# Manual Code Review: JSONTools Core (JNode, Parser, RemesPath, Schema, etc.)

**Engagement**: JsonToolsNppPlugin Pro Bono Security Review  
**Date (UTC)**: 2026-05-22  
**Reviewer**: Grok 4.3 (structured analysis session)  
**Scope**: All 14 `.cs` files under `JsonToolsNppPlugin/JSONTools/` (~15,159 LOC total). This is the core JSON handling library (parser, DOM, query language, schema tools) consumed by the Notepad++ plugin UI, forms, and `Main.cs`.  
**Referenced Work**: 
- Ongoing pro-bono engagement in this folder (`README.md`, `ACTIVITY-LOG.md`).
- Automated phase complete (CodeQL CWE-275 fixed in fork, Socket.dev clean, Dependabot merged).
- Full project structure and entry points analyzed from `Main.cs`, `Settings.cs`, `JsonGrepper.cs`, and related (untrusted editor text, API fetches, user schemas/queries, timer auto-parse).
**Methodology**: SDLC best practices + security-focused (input validation, injection/DoS surfaces, recursion/resource exhaustion, regex safety, error handling, maintainability). Prioritized paths handling untrusted data (Scintilla buffers, HTTP responses, user-entered schemas/RemesPath queries, globs). Cross-referenced with .NET 4.8 target, NPP in-process plugin risks (crashes = data loss), and existing recursion hardening in parser/validator.

**Key Attack Surfaces Identified** (from `Main.cs:TryParseJson`, `JsonParserFromSettings`, grepper, forms):
- Full document or multi-selection text → parsers.
- "Get JSON from files and APIs" form → arbitrary URLs (HttpClient) + local dir recursion + globs.
- JSON Schema validation / "Generate random JSON from schema" / auto-validate → user schemas (potentially attacker-controlled).
- RemesPath queries (search, sort, find/replace, tree, grepper) executed against above data.
- Tolerant JSON5/JSONC parsing modes (high surface for ambiguous/evil input).

**Severity**: Critical | High | Medium | Low | Info. Focus on issues with exploitability in realistic plugin usage.

---

## Executive Summary

The JSONTools core implements a highly tolerant, feature-rich JSON engine (JSON5 + comments + error recovery + powerful RemesPath query language with mutation + schema validation + random generation + CSV/INI/YAML/DSON interop). 

**Strengths**:
- Explicit recursion guards (`JsonParser.MAX_RECURSION_DEPTH = 512`, `JsonSchemaValidator.RECURSION_LIMIT = 64`) with graceful FATAL handling — directly mitigates NPP crash risk (excellent, per code comments).
- LRU caching for compiled Remes queries.
- Size thresholds for slow actions on large files.
- Strong test coverage + fuzz options in `Tests/`.

**Critical/High Findings (Aggregate)**:
- **ReDoS (Regular Expression Denial of Service)**: Multiple paths compile user-influenced or attacker-controlled regexes *without timeouts* and execute `IsMatch`/`Match`. Primary vectors: JSON Schema `pattern` + `patternProperties` (validator + random gen), RemesPath regex literals in queries, parser unquoted-key/unicode regexes, CSV helpers. On untrusted JSON + schema (common via grepper/API flows) or crafted queries, this can hang the UI thread or async tasks indefinitely. .NET 4.8 supports `Regex(..., timeout)` — not used.
- **Incomplete Resource Limits**: Parser/validator recursion is capped; most other recursive paths (JNode pretty-print/path helpers, Yaml/Remes dumps, schema gen, query interpreters) and complex operations (Remes higher-order funcs, large array projections, string/CSV ops) lack CPU/time/memory budgets. Large or deeply nested (but <512) or specially crafted inputs/queries can cause excessive CPU, memory pressure, or UI hangs.
- **Architectural / Maintainability Risks**: Very large monolithic files (`JNode.cs` 2471 LOC mixing DOM + query AST/mutation, `RemesPathFunctions.cs` 3828 LOC) with tight coupling. Increases bug surface and review difficulty. Shared static parsers (`Main.remesParser`) raise race concerns with timer + async grepper.
- **NPP Plugin Context**: In-process DLL means any unhandled exhaustion/crash (SO, OOM, hang) terminates Notepad++ entirely (unsaved buffers lost across tabs). Tolerant parsing is a *feature*, but amplifies need for hard limits and graceful degradation.

No evidence of RCE, arbitrary file write, or privilege escalation. Risks are primarily availability (DoS/hang/crash) and correctness on adversarial input. Supply chain already clean per prior Socket.dev/CodeQL.

**Immediate Recommended Fixes** (high ROI) + **Session Actions Taken**:
1. Add `MatchTimeout` (e.g., 1-2s) to *every* `new Regex(..., RegexOptions.Compiled)` construction in JSONTools (and callers). Centralize in a `SafeRegex` helper.
   - **Applied in session (proof-of-concept)**: 3 sites updated locally in fork clone (`JsonParser.cs` statics + `JsonSchemaValidator.cs` pattern + patternProperties) with engagement comments.
2. Set `HttpClient.Timeout` (e.g. 30s) + response size caps in `JsonGrepper`.
   - **Applied in session**: 30s timeout + guard added to `InitializeHttpClient` (with engagement reference).
3. Add depth guards (or early truncation) to JNode recursive helpers; introduce shared `MAX_JSON_DEPTH`.
4. Add execution budgets (op count + wall time + cancellation) to RemesPath `Search`/`Operate` paths.
5. Split large files; document trust model ("queries/schemas inherit trust level of the JSON source").

See new ACTIVITY-LOG entry (2026-05-22T18:10Z) and git diffs in the local clone for the exact patches. These are minimal, low-risk, and ready for manual push.

---

## Detailed Findings by File

### CsvSniffer.cs (68 LOC)
**Purpose**: RFC 4180-ish CSV delimiter/quote/newline heuristic for the Regex Search form.

**Issues**:
- **Medium (ReDoS surface)**: `new Regex(regexStr, RegexOptions.Compiled)` (line 35) built from user-supplied `delimiter`/`quote` chars (via `ArgFunction.CsvCleanChar` / `CsvColumnRegex` in RemesPathFunctions). No timeout. Patterns are relatively simple, but still a vector if form input is malicious or fuzzed.
- Minor: Hard-coded sniff limits; depends on cross-module regex builders.

**Recommendations**:
- `new Regex(..., RegexOptions.Compiled, TimeSpan.FromMilliseconds(500))`.
- Sanitize delimiter/quote (reject controls, non-printable, limit charset).
- Consider pure state-machine sniffer to eliminate regex here.

**Status / Suggested Revision**: Add timeout + validation. Low exploitability in practice (desktop UI) but consistent hardening.

### Dson.cs (131 LOC)
**Purpose**: Novelty "Doge" JSON (DSON) serializer ("such key is value wow").

**Issues**:
- **Info (style)**: `DsonDumpException` uses `public new string Message` (shadows `Exception.Message`; anti-pattern). Should call base ctor.
- Recursive `Dump(JNode)` (lines 44-129) — safe only because of upstream parser depth cap.
- No regex, no untrusted input parsing (pure output), no external I/O.

**Recommendations**:
- Fix exception: `public DsonDumpException(string message) : base($"DSON dump error: {message}") { }` + override `Message` properly or remove shadowing.
- Mark as `[Obsolete("Novelty feature")]` if not core.
- No security impact.

### IniFileParser.cs (412 LOC)
**Purpose**: Tolerant INI parser (used for `DocumentType.INI`).

**Issues**:
- **Low**: Manual char-by-char + line-based state machine (`Parse`, `ParseSection`, `ParseKeyValuePair`). No recursion. Good explicit duplicate-key errors.
- Utf8 position tracking mirrors JsonParser (maintainability coupling).
- No regex. Broad `IniParserException` (subclass of FormatException).
- Upstream size guards in Main apply; no per-key limits.

**Recommendations**:
- Optional key/value length limits (defense-in-depth, expose in Settings).
- Share more parsing utilities with JsonParser if patterns diverge.
- No major vulns.

### JNode.cs (2471 LOC) — **High**
**Purpose**: Central JSON value model (`JNode` + `JObject`/`JArray` + scalars) + pretty-printing + path computation + **embedded RemesPath machinery** (CurJson, JMutateResult, statement evaluation, variable scopes, `Operate` for queries/mutation).

**Issues**:
- **High (Maintainability + Coupling)**: God object / monolithic. Data model intertwined with query language AST and execution state. ~half the file is Remes-related. Violates single-responsibility; difficult to review or test in isolation.
- **High (Latent DoS - Stack Exhaustion)**: Multiple recursive helpers (`PrettyPrintHelper` 511, `PPrintHelper` 547, `PrettyPrintWithCommentsHelper` 656, `PathToPositionHelper` 873, `ParentHierarchyHelper` 811, `ToStringHelper`, `BuildYaml` callers, etc.) accept `depth` but perform **no max-depth enforcement or truncation**. 
  - Parser caps *input* at 512, but construction paths exist outside parser (schema maker, random JSON from schema, manual JNode creation in forms/grepper results, `MutateInto`, query results, tests).
  - Deep-but-valid JSON or query output can trigger `StackOverflowException` during pretty-print, tree view, "path to position", etc.
  - In NPP plugin: SO is frequently unrecoverable → full editor crash (data loss).
- **Medium (Encapsulation Leak)**: `children` (Dictionary/List) exposed publicly in JObject/JArray. Callers can mutate without going through position/comment tracking APIs.
- Regex: One internal `DOT_COMPATIBLE_REGEX` (safe).
- Mutation support (`MutateInto`, statements) enables powerful in-place changes via Remes — side effects on shared trees if not cloned.

**Recommendations & Suggested Code Changes**:
1. Add shared constant (e.g., in `JNode` or new `JsonLimits.cs`): `public const int MAX_DEPTH = JsonParser.MAX_RECURSION_DEPTH;`.
2. Guard every recursive helper: at entry, `if (depth > MAX_DEPTH) { sb.Append("... [depth limit]"); return sb.Length; }` (or throw controlled error for strict paths).
3. **Major refactor**: Extract all Remes query classes (`CurJson`, `JMutateResult`, `RemesPathStatement`, `VarAssign`, `EvaluateStatements*`, etc.) into `RemesPath.cs` or a new `RemesPathQuery.cs`. Keep pure JSON model in JNode.
4. Make `children` private; expose `IReadOnlyDictionary` / controlled mutators.
5. Add `public JNode DeepClone()` helper (currently reimplemented in places).
6. Update all call sites (pretty print, tree viewer, path ops) to respect limits.

**Priority**: High. Depth guards are quick wins; split is longer-term.

### JsonGrepper.cs (463 LOC) — **High**
**Purpose**: "Get JSON from files and APIs" — parallel HTTP fetches + recursive local dir glob search + parsing + progress/cancellation.

**Issues**:
- **High (Resource Exhaustion / Partial SSRF)**: Static `HttpClient httpClient` (63). `InitializeHttpClient` (441) only sets Accept + User-Agent. **No `Timeout` property set** (HttpClient default can be 100s or effectively infinite for some operations). `GetStringAsync(url)` (432) on fully user-controlled URLs from the form/API tab.
  - Slow/malicious remote server can pin threads or hang the "get" operation.
  - No `MaxResponseContentBufferSize` or streaming + length cap before full materialization.
  - Scheme not restricted (though .NET HttpClient rejects non-http/https by default in practice).
- Local file surface: `DirectoryInfo` + `AllDirectories` recursion + `Glob` (user patterns from form). Size guard `MAX_COMBINED_LENGTH...` exists and is checked (good).
- Parsing after fetch uses strict `throwIfFatal/throwIfLogged` (good).
- Cancellation supported — positive.

**Recommendations & Suggested Code Changes**:
1. In `InitializeHttpClient` (or add `static HttpClient` factory):
   ```csharp
   hc.Timeout = TimeSpan.FromSeconds(30);
   // hc.MaxResponseContentBufferSize = 10 * 1024 * 1024; // 10 MiB example
   ```
2. Add URL allow-list or warning (http/https only; optionally block loopback/private ranges with note that desktop tool runs with user privileges).
3. Stream responses with length check before buffering full string.
4. Update docs in form: "Fetches run with your privileges; use caution with untrusted endpoints."

**Priority**: High (easy, matches network-related risks in security reviews). Apply in this engagement.

### JsonParser.cs (2018 LOC) — **Critical**
**Purpose**: Recursive-descent tolerant parser + linter for JSON through full JSON5 + error recovery + JSON Lines support. Heart of the plugin.

**Issues**:
- **Strength (already present)**: Explicit `MAX_RECURSION_DEPTH = 512` (519) + checks before `ParseArray`/`ParseObject` recurse (1398, 1498). Returns FATAL lint + short array/obj instead of crashing. Comment (517) explicitly calls out "stack overflow causes a panic that makes Notepad++ crash". Best practice.
- **Critical (ReDoS)**: Static compiled regexes executed against untrusted document text in tolerant modes:
  - `UNICODE_ESCAPES` (1100): `(?<=\\u)[\da-f]{4}`
  - `UNQUOTED_KEY_REGEX` (1102): Complex pattern with `\p{Mn}` etc. unicode categories + repetition: `UNQUOTED_START ( ... | \p{...} )*`
  - Used inside `ParseString` (925+), key parsing loops (1020+ `while(true)`), `ParseNumber`.
  - In JSON5/JSONC logger levels (user or auto setting), crafted input can trigger catastrophic backtracking.
- Broad `catch (Exception ex)` (1631, 178x) in top `Parse*` — tolerant by design (feature), but can mask parser bugs. `HandleJsonParserError` centralizes.
- Instance state (`ii`, `lint`, `comments`, `utf8ExtraBytes`) — recreated per `JsonParserFromSettings()` call (good for isolation).
- No streaming parser; full materialization.

**Recommendations & Suggested Code Changes**:
1. **Top priority**: Wrap regex construction:
   ```csharp
   private static Regex SafeRegex(string pattern, RegexOptions options = RegexOptions.Compiled, TimeSpan? timeout = null)
       => new Regex(pattern, options, timeout ?? TimeSpan.FromSeconds(1));
   ```
   Use for both statics (or make them instance with timeout) and dynamic.
2. Add `RegexOptions.CultureInvariant` where appropriate for unicode regex.
3. Consider bounded `while` loops or position checkpoints for key/string parsing to limit work even on regex.
4. Expand `Tests/JsonParserTests.cs` with adversarial regex inputs (evil unquoted keys).
5. Document trust: "Tolerant modes increase attack surface; use STRICT for untrusted documents when possible."

**Priority**: Critical. ReDoS here + schema validator are the highest-impact availability issues.

### JsonSchemaMaker.cs (563 LOC)
**Purpose**: Infer draft-2020-12-style JSON Schema from example instance JSON.

**Issues**:
- **Medium (Resource amplification)**: Recursive descent over input JNode to emit schema. No independent depth cap (assumes parser limit). Generated schema size can explode for wide/deep objects.
- No regex *creation* (only consumes strings for "examples" etc.).
- Positive: clean required/properties/type inference; handles nulls, arrays, etc.

**Recommendations**:
- Enforce `JNode.MAX_DEPTH` during generation; emit `maxItems`/`maxProperties` or truncation notes for deep cases.
- Add output size guard.

**Priority**: Medium.

### JsonSchemaValidator.cs (813 LOC) — **Critical**
**Purpose**: JSON Schema validator with $ref/definitions support, compiled validation funcs, lint collection capped by settings.

**Issues**:
- **Strength**: `RECURSION_LIMIT = 64` (23) + check (213) in `CompileValidationHelperFunc`. Explicitly handles recursive `$ref` via definitions. `maxLintCount` from settings prevents OOM on malicious schemas (189).
- **Critical (ReDoS via untrusted schemas)**:
  - `patternProperties` (548): `new Regex(pat, RegexOptions.Compiled)` where `pat` is the **schema key** (user-controlled).
  - `pattern` keyword (630): `new Regex((string)pattern.value, RegexOptions.Compiled)`.
  - Later: `regex.IsMatch(str)` / `regex.IsMatch(kv.Key)` (633, 557+) with **no per-match timeout**.
  - Attack: Supply JSON + schema containing evil `pattern` (e.g. `(a+)+` or unicode equivalents) + a string that triggers exponential backtracking → validator hangs (called from auto-validate timer, manual command, random gen, grepper post-fetch).
- `RegexAndValidator` struct caches compiled regex + sub-validator (good perf, bad if regex slow).
- Schema cache in Main (16 entries).

**Recommendations & Suggested Code Changes** (apply locally):
1. Change constructions (548-550, 630):
   ```csharp
   new Regex(pat, RegexOptions.Compiled, TimeSpan.FromSeconds(2))
   ```
2. Update `RegexAndValidator` to hold timeout; prefer `regex.Match(input, 0, timeoutMs)` overloads where available or wrap calls.
3. Add Settings knob: `int max_regex_match_ms = 2000;`.
4. In validator entry points, catch slow regex via `RegexMatchTimeoutException` (derive from .NET) and turn into lint instead of crash/hang.
5. Docs update: "Never validate untrusted data against a schema from an untrusted source."

**Priority**: Critical. Direct vector for hang on common "validate JSON" flows.

### JsonTabularize.cs (905 LOC)
**Purpose**: Bidirectional JSON ↔ tabular/CSV/TSV conversion + related queries.

**Issues**:
- **Low/Medium (perf)**: Heavy string building, column inference, quoting logic. Some calls into Remes CSV regex builders (which create regex from args).
- No obvious new regex entry from untrusted sources beyond Remes context.
- Large but single-purpose.

**Recommendations**: Benchmark against huge arrays; add streaming option for very large outputs. Minor.

### RandomJsonFromSchema.cs (395 LOC)
**Purpose**: Generate random instances conforming to a schema (useful for fuzzing + "random JSON from schema" command).

**Issues**:
- **Medium (Amplification of schema regexes)**: Delegates `pattern` / `patternProperties` keys to `RandomStringFromRegex.GetGenerator(pattern)` (126, 218+). Evil patterns can cause the generator's parser or generation loop to consume excessive time/CPU before producing output (or throw).
- Shares `RECURSION_LIMIT`.
- Good UX: warns on incompatible regexes (Main.cs:82).

**Recommendations**:
- Wrap generator creation + sampling in bounded iteration + timeout.
- Treat as secondary vector to the validator ReDoS.

**Priority**: Medium (tied to schema surface).

### RemesPathLexer.cs (451 LOC)
**Purpose**: Tokenizes the RemesPath query language (indexers `.[{`, projections, functions, variables, for-loops, mutation `:=`, etc.).

**Issues**:
- **Medium (Query DoS surface)**: Lexing user-entered queries (from multiple UI forms). Import of `System.Text.RegularExpressions` present; any regex on query text is a potential ReDoS before parsing even begins.
- `RemesLexerException` + location marking — good UX.
- No explicit max query length.

**Recommendations**:
- Early length cap on queries (e.g. 8k-16k chars) with clear error.
- Audit any regex usage inside lexer for timeouts; add if present.
- Fuzz lexer with long/malformed queries.

**Priority**: Medium (queries are powerful by design; length cap is cheap defense).

### RemesPath.cs (2385 LOC) — **Critical**
**Purpose**: `RemesParser` (Compile/Search/Operate), LRU query cache (64), Indexer types (VarnameList, SlicerList, Star, regex indexers), query AST representation (as JNode trees — clever reuse), statement execution, variable scoping, `CanOperate` / mutation engine.

**Issues**:
- **Critical (Powerful interpreter on untrusted data)**: RemesPath is extremely expressive (higher-order funcs, projections, for-loops with assignment, CurJson recursion, mutation). `Search(query, json)` / `compiled.Operate(obj)` run with no CPU, memory, operation-count, or recursion budget beyond what the underlying JSON provides.
  - On large arrays from API/fetch + complex user (or saved) query → potential quadratic/exponential blowup or long runtimes.
  - Mutation side-effects mutate the original JNode tree in place.
- **Medium (Concurrency)**: Singleton `Main.remesParser` (LruCache + lexer). Dictionaries/LinkedLists not thread-safe. Timer auto-parse + grepper async tasks + UI commands can interleave.
- Regex indexers (ApplyRegexIndex etc., ~499-628): user regexes from queries compiled/passed to `IsMatch` — another ReDoS vector during filtering.
- Cache helps repeated queries but still parses/compiles first time.
- `JNode` reuse for AST blurs model/query boundary (see JNode issues).

**Recommendations & Suggested Code Changes**:
1. Introduce `RemesExecutionLimits` (maxOps, timeoutMs, maxDepth, CancellationToken) passed down through `Search`/`Operate`/`Evaluate*`.
2. Enforce in hot paths (map/filter/reduce, loops, projections).
3. Replace static singleton with factory or per-form instances + locks around cache.
4. Document security model explicitly in `docs/RemesPath.md`: "Queries execute with the privileges and trust level of the JSON source. Do not paste untrusted queries against sensitive or large documents."
5. Move query AST/eval classes out of JNode.cs.

**Priority**: Critical for any flow involving Remes on fetched or editor JSON (very common).

### RemesPathFunctions.cs (3828 LOC) — **Critical (by size)**
**Purpose**: The bulk of built-in RemesPath functions (arithmetic, string, array/object transforms, regex, CSV `s_csv`/`str_split_csv`, type tests, higher-order `map`/`filter`/`reduce`, random, etc.). 100s of static methods.

**Issues**:
- **Critical (Maintainability / Hidden Surface)**: Largest single file. 196+ matches for function/regex patterns. Extremely broad API surface. Difficult to audit for all perf pitfalls, side effects, or injection points.
- Regex creation (4 sites, ~2529, 2607, 2636, 2988): mostly CSV row regexes built from query-supplied `nColumns`/`delim`/`quote` etc. (`CsvRowRegex`). No timeouts. When invoked via Remes on untrusted data (`@ | s_csv(5, ",")` etc.), creates another vector.
- Higher-order + CurJson can produce deep or repeated traversals without limits.
- String/concat, LINQ-heavy ops on large collections → potential high memory/CPU.
- Varying error handling per function.

**Recommendations**:
1. **Split the file** (highest long-term value): e.g. partial classes or `RemesPathFunctions/Arithmetic.cs`, `Collections.cs`, `StringOps.cs`, `RegexAndCsv.cs`, `HigherOrder.cs`, `TypeAndMisc.cs`.
2. Central `RunWithLimits` wrapper or context object for all exported funcs.
3. Add timeout to the CSV regex creations + any `IsMatch` inside functions.
4. Add operation counting in recursive/looping functions.
5. Expand adversarial testing (large arrays + expensive queries like nested maps or repeated regex).

**Priority**: Critical for sustainability of the project. The size alone increases likelihood of future subtle bugs.

### YamlDumper.cs (256 LOC)
**Purpose**: YAML emitter (export from tree view, etc.).

**Issues**:
- **Low**: Recursive `BuildYaml` (167+). Safe under depth cap.
- Internal regexes only (117: forbidden key chars; 146: backslash escapes) on data derived from JSON — fully controlled, simple patterns, no user regex.
- Minor dead/commented StreamReader code.

**Recommendations**:
- Add depth truncation note for consistency.
- Clean dead code.

**Priority**: Low.

---

## Cross-Cutting Concerns & Recommendations

1. **ReDoS Unification (Critical aggregate finding)**: At least 8-10 sites create `Regex` from (partially) untrusted strings without timeout. Central helper + mandatory timeout + `RegexMatchTimeoutException` handling everywhere is the single highest-impact fix.
2. **Resource Budgets & Graceful Degradation**: Add a `JsonLimits` or `ExecutionContext` type with depth/ops/timeout values. Apply consistently to parser (already good), validator, JNode ops, Remes interpreter, schema tools, HTTP, pretty-print.
3. **Threading & Shared State**: Audit all statics (`remesParser`, `iniParser`, `yamlDumper`, caches, `random`). Prefer instance-per-use or `ConcurrentDictionary` + locks for the LRU. Consider making `JsonParser`/`RemesParser` creation cheap and always fresh for untrusted paths.
4. **File Organization & Reviewability**:
   - Split JNode.cs and RemesPathFunctions.cs.
   - Consider `JsonLimits.cs`, `SafeRegex.cs`, `JsonExceptions.cs` for shared concerns.
5. **Documentation & Threat Model**:
   - Update `docs/RemesPath.md`, `docs/README.md`, and Settings descriptions with trust assumptions and "untrusted input" warnings.
   - Add a top-level `SECURITY.md` in the plugin repo (or link to engagement findings).
6. **Testing & Fuzzing**:
   - Add evil-regex corpus to `JsonParserTests`, `JsonSchemaValidatorTests`, `RemesPathTests`.
   - Use existing `skip_api_request_and_fuzz_tests` flag; expand fuzz targets.
   - Property-based or mutation testing for schema roundtrips and query semantics.
7. **NPP-Specific Hardening**: On any long operation or potential hang, ensure UI remains responsive (already async in grepper; extend to heavy Remes/schema on large docs). Catch `StackOverflowException` at top level where possible (difficult in .NET but worth try/finally guards).
8. **No New Supply-Chain Issues**: Attribution and dep scanning already covered.

---

## Prioritized Remediation Roadmap (for Engagement + Upstream PR)

**Phase 1 (This session / immediate, low-risk edits) — Partially Complete**:
- [x] Add timeout ctors to key `new Regex` sites in JSONTools (JsonParser statics + JsonSchemaValidator pattern/patternProperties; 3 sites total). Example patches applied locally with engagement comments.
- [x] Set `httpClient.Timeout` + comment in JsonGrepper (30s guard applied locally).
- [ ] Add depth guards to 2-3 critical JNode recursive paths (pretty print + path helpers).
- [x] Create this review document + append to ACTIVITY-LOG + update README status/table (including accurate "patches applied" notes).
- [ ] Run full test suite (`TestRunner.RunAll()`) post-edits (blocked on Linux dev env; researcher to execute on Windows with VS).

**Phase 2 (Short, 1-2 weeks)**:
- Introduce centralized `SafeRegex` helper + Settings knob for regex timeout (cover remaining sites: CsvSniffer, Remes CSV builders, etc.).
- Add basic Remes execution limits (op counter + wall-time check).
- Refactor JNode: extract Remes classes; add MAX_DEPTH const + Clone().

**Phase 3 (Medium, upstream contribution)**:
- Full file splits + architecture docs.
- Comprehensive adversarial test corpus + CI job.
- Security model section in plugin docs.
- PR to maintainer (reference this engagement and Issue #117).

**Success Metrics**: All high/critical findings mitigated or documented with accepted risk; no new CodeQL/Socket alerts; positive maintainer feedback.

---

## Appendix: File Line Counts (for Prioritization)
- RemesPathFunctions.cs: 3828
- JNode.cs: 2471
- RemesPath.cs: 2385
- JsonParser.cs: 2018
- JsonTabularize.cs: 905
- JsonSchemaValidator.cs: 813
- JsonSchemaMaker.cs: 563
- JsonGrepper.cs: 463
- RemesPathLexer.cs: 451
- IniFileParser.cs: 412
- RandomJsonFromSchema.cs: 395
- YamlDumper.cs: 256
- Dson.cs: 131
- CsvSniffer.cs: 68

---

*This document captures the initial structured manual source code review of the JSONTools core. All findings are based on static analysis and architecture review; manual dynamic verification (fuzzing, adversarial test cases, timing measurements) by the researcher is required before any disclosure or upstream report. References existing automated results in the engagement folder. Example low-risk patches for the top ReDoS and network findings were applied locally during the session (see updated ACTIVITY-LOG 18:10Z entry and git diffs in the fork clone).*

**Last Updated in this document**: 2026-05-22 (post-patch application; stale "no changes applied" text removed from README + ACTIVITY-LOG for accuracy)
