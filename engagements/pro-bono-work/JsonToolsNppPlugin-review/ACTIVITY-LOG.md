# Activity Log - JsonToolsNppPlugin Security Review

| Timestamp (UTC)              | Description                                                                 | Commit Hash                          | Source Link |
|------------------------------|-----------------------------------------------------------------------------|--------------------------------------|-------------|
| 2026-05-22T03:35:00Z        | Merged Dependabot PR #1 (Bump `microsoft/setup-msbuild` from 2.0.0 to 3.0.0). | ae48851                              | [PR #1](https://github.com/jacob-kraniak/JsonToolsNppPlugin/pull/1) |
| 2026-05-22T03:40:00Z        | Added CodeQL analysis workflow configuration to main branch. | 4ab21054913853611aca2ce2136cadd087a4da98 | [Commit](https://github.com/jacob-kraniak/JsonToolsNppPlugin/commit/4ab21054913853611aca2ce2136cadd087a4da98) |
| 2026-05-22T03:05:00Z        | Received first CodeQL alert: "Workflow does not contain permissions" (Medium severity, CWE-275) in `.github/workflows/CI_build.yml`. | N/A (Alert)                         | [Code Scanning Alert #1](https://github.com/jacob-kraniak/JsonToolsNppPlugin/security/code-scanning/1) |
| 2026-05-22T03:20:00Z        | Received Socket.dev Organization Dependencies Report – 5 NuGet packages (1 direct, 4 transitive). All scored 88–90. No critical risks. | N/A (Socket.dev)                    | [Organization Dependencies Report](https://github.com/jacob-kraniak/JsonToolsNppPlugin) |
| 2026-05-22T03:25:00Z        | Reviewed `JsonToolsNppPlugin_attribution.json` – confirmed clean license attributions (primarily MIT, BSD). | N/A (Socket.dev)                    | [Attribution JSON](https://github.com/jacob-kraniak/JsonToolsNppPlugin) |
| 2026-05-22T03:30:00Z        | Added dedicated "Detected Vulnerabilities and Weaknesses" table to README.md documenting CWE-275 (no CVEs/KEV found). | Latest commit                       | [Engagement Folder](https://github.com/jacob-kraniak/cybersecurity-research/tree/main/engagements/pro-bono-work/JsonToolsNppPlugin-review) |
| 2026-05-22T03:45:00Z        | Force-fetched latest repository state and updated ACTIVITY-LOG.md + README.md with merged PRs and latest findings. | Latest commit                       | [Engagement Folder](https://github.com/jacob-kraniak/cybersecurity-research/tree/main/engagements/pro-bono-work/JsonToolsNppPlugin-review) |

**Notes**: All timestamps reflect actual GitHub events and commit history. Log maintained as part of pro bono security review.
