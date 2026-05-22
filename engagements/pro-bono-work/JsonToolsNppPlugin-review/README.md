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
- **CodeQL Alert**: "Workflow does not contain permissions" (Medium severity, CWE-275) detected in `.github/workflows/CI_build.yml`
- **Socket.dev Scan**: Organization Dependencies Report received – 5 NuGet packages identified (1 direct, 4 transitive). All packages received high overall scores (88–90). No critical or high-risk dependencies flagged.
- Attribution data reviewed (`JsonToolsNppPlugin_attribution.json`) confirms standard open-source licenses (primarily MIT, with BSD and others).

**Activity Log**: [ACTIVITY-LOG.md](ACTIVITY-LOG.md)

## Detected Vulnerabilities and Weaknesses

| ID       | Type | Severity | Description                                      | Affected Component                  | Status      | Recommendation                              | Source                          |
|----------|------|----------|--------------------------------------------------|-------------------------------------|-------------|---------------------------------------------|---------------------------------|
| CWE-275 | CWE  | Medium   | Workflow does not contain permissions (excessive `GITHUB_TOKEN` permissions) | `.github/workflows/CI_build.yml`   | Open        | Add explicit `permissions: { contents: read }` at workflow root level | [CodeQL Alert #1](https://github.com/jacob-kraniak/JsonToolsNppPlugin/security/code-scanning/1) |
| -        | -    | None     | No CVEs, KEV entries, or high-risk dependency vulnerabilities detected | All NuGet dependencies             | Resolved    | Continue monitoring via Dependabot & Socket.dev | Socket.dev Organization Report |

---

**Last Updated**: 2026-05-22
