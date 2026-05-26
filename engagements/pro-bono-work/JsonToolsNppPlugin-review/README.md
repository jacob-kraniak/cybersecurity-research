# JsonToolsNppPlugin - Pro Bono Security Review

**Engagement Type**: Pro Bono Community Work  
**Project**: [JsonToolsNppPlugin](https://github.com/molsonkiko/JsonToolsNppPlugin)  
**My Fork**: [jacob-kraniak/JsonToolsNppPlugin](https://github.com/jacob-kraniak/JsonToolsNppPlugin)  
**Research Branch**: `vulnerability-assessment-v8.5.0.1` (based on stable v8.5 release)

## Overview
Independent security review of the JsonToolsNppPlugin for Notepad++, performed as a pro bono contribution following maintainer support in [Issue #117](https://github.com/molsonkiko/JsonToolsNppPlugin/issues/117).

## Scope
- Supply chain security assessment (Dependabot, Socket.dev)
- Static analysis (CodeQL)
- Manual code review focused on JSON parsing, input handling, and plugin integration risks
- License and attribution verification

## Current Status
- Fork synchronized with upstream
- Security tooling enabled (Dependabot, Socket.dev, CodeQL)
- **CodeQL Alert (CWE-275)**: Resolved – explicit `permissions: contents: read` now present in `.github/workflows/CI_build.yml`
- **Socket.dev Scan**: Clean – 5 NuGet packages (scores 88–90), no critical risks
- **Manual Code Review Phase**: In progress — structured review of JSONTools core (JNode, JsonParser, RemesPath suite, schema validator, grepper, etc.) complete. Detailed per-file findings + remediation roadmap documented in [JSONTools-core-manual-code-review-2026-05-22.md](JSONTools-core-manual-code-review-2026-05-22.md). Key themes: ReDoS via untrusted regex patterns (schema `pattern*`, Remes queries, parser), incomplete execution limits outside recursion guards, large monolithic files, shared mutable state.
  - **Example hardening patches applied locally** (in fork clone at `/home/jacob/Repositories/JsonToolsNppPlugin/` for manual push): `HttpClient.Timeout` (30s) + `MatchTimeout` on 3 critical user-controlled regex sites in `JsonGrepper.cs`, `JsonSchemaValidator.cs` (pattern + patternProperties), and `JsonParser.cs` (UNICODE_ESCAPES + UNQUOTED_KEY_REGEX). All changes include engagement references. See detailed review doc + `git diff` in clone.
- Attribution data reviewed – standard open-source licenses only

**Activity Log**: [ACTIVITY-LOG.md](ACTIVITY-LOG.md)

## Detected Vulnerabilities and Weaknesses

| ID       | Type | Severity | Description                                      | Affected Component                  | Status      | Recommendation                              | Source                          |
|----------|------|----------|--------------------------------------------------|-------------------------------------|-------------|---------------------------------------------|---------------------------------|
| CWE-275 | CWE  | Medium   | Workflow does not contain permissions (excessive `GITHUB_TOKEN` permissions) | `.github/workflows/CI_build.yml`   | Resolved    | Add explicit `permissions: { contents: read }` at workflow root level (applied in fork) | [CodeQL Alert #1](https://github.com/jacob-kraniak/JsonToolsNppPlugin/security/code-scanning/1) |
| -        | -    | None     | No CVEs, KEV entries, or high-risk dependency vulnerabilities detected | All NuGet dependencies             | Resolved    | Continue monitoring via Dependabot & Socket.dev | Socket.dev Organization Report |
| ReDoS-001 | Design/Impl | **Critical** (availability) | Multiple `new Regex(..., RegexOptions.Compiled)` without `MatchTimeout` on strings derived from untrusted JSON, schemas, or RemesPath queries. `IsMatch` can hang indefinitely on crafted evil regex + input. | JsonSchemaValidator (pattern, patternProperties), JsonParser (UNQUOTED_KEY_REGEX, UNICODE_ESCAPES), RemesPath* (query regex literals + CSV builders), CsvSniffer, RandomJsonFromSchema | Open | Central `SafeRegex` helper with mandatory 1-2s timeout; handle `RegexMatchTimeoutException` as lint/error; update all 8+ sites | Manual code review 2026-05-22 (see detailed findings doc) |
| ResLimit-001 | Design | **High** (availability) | Recursion guards exist only in parser (512) and schema validator (64). JNode pretty-print/path helpers, RemesPath interpreters, schema maker, query execution, YAML dump, etc. lack depth/CPU/op-count/time budgets. Deep or adversarial input + queries can cause excessive resource use or StackOverflow (NPP plugin crash = data loss). | JNode.cs (multiple recursive helpers), RemesPath.cs + Functions (Operate, higher-order, loops), JsonSchemaMaker, YamlDumper, etc. | Open | Shared `JsonLimits` / execution context; add guards + truncation; budgets for Remes queries | Manual code review 2026-05-22 |
| Arch-001 | Maintainability | High | Monolithic files (JNode 2471 LOC mixing model+query AST; RemesPathFunctions 3828 LOC) with tight coupling between DOM and powerful query/mutation engine. Increases bug surface and review cost. | JNode.cs, RemesPath*.cs (entire suite) | Open | Extract Remes query classes from JNode; split Functions into focused partials/modules; introduce SafeRegex + Limits types | Manual code review 2026-05-22 |
| Concurrency-001 | Impl | Medium | Singleton shared `remesParser` / `iniParser` (non-thread-safe caches/dicts) + timer-based auto-parse + async grepper tasks. Race potential on query cache or parser state. | Main.cs (statics), RemesPath (LruCache), JsonGrepper | Open | Per-use instances or locks; document threading model | Manual code review 2026-05-22 |
| Network-001 | Impl | High (resource) | `HttpClient` in JsonGrepper has no `Timeout` configured. `GetStringAsync` on arbitrary user URLs can hang on slow/malicious endpoints. No response size cap before buffering. | JsonGrepper.cs:63,441,432 | Open | Set `Timeout = 30s`; add MaxResponseContentBufferSize or streaming + limit; scheme validation + docs | Manual code review 2026-05-22 |

**See full per-file analysis, code locations, prioritized remediation plan, and notes on the 4 example patches applied locally:** [JSONTools-core-manual-code-review-2026-05-22.md](JSONTools-core-manual-code-review-2026-05-22.md)

**Professional vulnerability findings table** (CWE + OWASP 2025 mapped, precise file:line references, impact in Notepad++ context, fork vs upstream status): **[VULNERABILITY-FINDINGS.md](VULNERABILITY-FINDINGS.md)** — recommended document to send to the repo owner.

---

**Last Updated**: 2026-05-22 (stale claims removed; patch application documented in ACTIVITY-LOG + review doc)
