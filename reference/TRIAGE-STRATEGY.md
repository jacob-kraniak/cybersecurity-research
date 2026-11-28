# Triage & Hunting Strategy (Reusable Contract)

- **Audience:** Grok Build on JKALI01 + operator
- **Scope:** Program-agnostic. Engagement folders supply rate limits, required headers/User-Agent, in-scope hosts, and continuity state.
- **Companion:** [`TOOLING-INVENTORY.md`](./TOOLING-INVENTORY.md) for which JKALI01 tools map to each phase.

---

## 0. Operating Principles

1. **Honor the engagement scope file first.** Assets, out-of-scope list, rate limits, banned tests, and required headers/User-Agent come from the engagement `SCOPE.md` (or equivalent). Never invent program rules.
2. **Automated mapping only when the program allows it.** If limited scanners are permitted, stay inside the documented rate/header caps. If scanners are banned, mapping is manual/proxy-only.
3. **Surface-mapping-first, not blind fuzzing.** Map the attack surface, fingerprint and cluster it, then deep-dive outliers. Do **not** burn cycles on blind shaped-GET fuzzing until something looks anomalous.
4. **Build does breadth; the operator does targeted depth.** Build handles high-volume parse/map/cluster/flag work and surfaces outliers. The operator runs targeted deep scans manually with Kali tooling.
5. **No background auto-approve.** Build must not run unattended auto-approve loops that churn tokens with no useful output. Every targeted scan is operator-initiated. Between asks, Build analyzes — it does not continuously probe.
6. **Lean on Burp MCP when enabled.** Prefer reading Burp scan results and proxy history over re-requesting. Parse what is already captured first.

---

## 1. Methodology: Breadth → Cluster → Targeted Depth

### Phase A — Surface Mapping
- Enumerate endpoints, parameters, and JS-referenced routes across **in-scope** hosts only.
- Parse existing Burp proxy history and site map (MCP) before issuing new requests.
- Harvest from JS bundles: API paths, parameter names, feature flags, host references, auth/token handling hints.
- Normalize an inventory: host → endpoint → method → params → auth-required? → content-type.
- Any active requests obey the engagement rate limit and required headers/User-Agent.

### Phase B — Fingerprint & Cluster (analysis)
- Group endpoints by framework/stack, response shape, auth boundary, and tenant/object-id patterns.
- Flag **outliers**: unusual sizes/codes, inconsistent auth across siblings, reflected parameters, verbose errors, enumerable-looking object IDs, CORS/ACAO echoes, redirect parameters, header-handling quirks.
- Produce a ranked **leads to verify** list (not findings, not submissions).

### Phase C — Targeted Deep-Dive (operator, manual on JKALI01)
- Operator picks leads and runs class-specific checks by hand (Burp Repeater/Intruder, multi-account access-control diffing, OAuth flow checks).
- Build prepares request templates, diffs responses, and tracks open/closed leads — and does **not** auto-fire targeted scans.

---

## 2. Priority Vulnerability List (OWASP → CWE/CVSS)

Default ordering for web/API bounty practice. Always re-rank against the engagement’s eligible / non-qualifying classes. Use **Burp Target → Issue Definitions** as a live checklist (leads to verify, never auto-submissions).

| Priority | OWASP | Class | CWE | Typical CVSS band | Where to focus (generic) |
|---|---|---|---|---|---|
| 1 | A01 | Broken Access Control / IDOR | CWE-639, CWE-284 | Medium–High | Multi-account diffing between two owned test accounts on APIs and app backends |
| 2 | A07 | Auth / OAuth flow flaws | CWE-287, CWE-384 | Medium–High | IdP/oauth hosts: redirect_uri, state, PKCE, token scope, session fixation |
| 3 | A10 | SSRF | CWE-918 | Low–Critical | URL / webhook / image-fetch parameters on APIs |
| 4 | A03 | Injection (SQLi / XSS / CRLF) | CWE-89, CWE-79, CWE-93 | Medium–Critical | Reflected/stored inputs, header injection; respect program OOB rules |
| 5 | A05 | Security Misconfiguration (CORS, Web Cache Deception) | CWE-942, CWE-525 | Low–Medium | ACAO reflection with credentials; cacheable authenticated responses |
| 6 | A01 | Open Redirect | CWE-601 | Low–Medium | Redirect/return/next params — verify real impact |
| 7 | A06/A05 | Request Smuggling | CWE-444 | Medium | Front-end / back-end header desync on CDN-fronted hosts |

Skip classes the engagement lists as non-qualifying (commonly: missing headers, TLS best-practice only, missing rate limiting, clickjacking, anonymous/logout CSRF, self-XSS, banner disclosure, theoretical takeover).

---

## 3. Target Prioritization (Beat the Crowd)

Program-agnostic bias for where effort pays off:

1. **Business logic + multi-account access control** — scanners miss it; many hunters skip it. Anchor on A01/IDOR between two owned test accounts.
2. **Operator-unique surfaces** — hardware, companion apps, local lab assets, or other access most remote-only hunters lack. Prefer these when the program scopes them and payouts justify it.
3. **Newest / recently-added assets** — lower duplicate density than flagship front doors.
4. **Niche / non-flagship hosts with real function** over marketing/brand pages.

Engagement overlays may re-order these (e.g., device Low payout vs web Low payout).

---

## 4. Continuity State (engagement-owned)

Proxy-history progress, host queues, WHOIS gates, and blocked prerequisites live in the **engagement** triage overlay (for example `engagements/Bounties/<program>/TRIAGE-STRATEGY.md`), not in this shared contract. Build resumes from that overlay.

---

## 5. Grok Build Operating Contract

### Build does autonomously (when instructed; analysis-heavy)
- Parse Burp proxy history and scan results via MCP when available.
- Map endpoints, parameters, and JS-referenced routes; normalize the inventory.
- Fingerprint/cluster the surface and flag outliers.
- Maintain the ranked leads list and host-queue state from the engagement overlay.
- Prepare request templates and response diffs for the operator’s manual checks.
- Any Build-issued requests obey engagement rate limits and required headers/User-Agent.

### Operator runs manually on JKALI01 (Build hands these off)
- Targeted deep scans (tuned Repeater/Intruder, class-specific checks).
- Authenticated multi-account access-control testing.
- Device / companion-app traffic capture when in scope.
- Any decision to submit a report.

### Hard rules
- **No background auto-approve** and no unattended probing loops.
- **No third-party OOB** unless the engagement explicitly allows it; prefer operator-owned self-hosted infrastructure when OOB is required.
- **No PoC/exploit code in public `main`.** Strategy and leads only on public branches.
- **Scope is law.** Only hosts/assets in the engagement scope file.
- **No submission without human reproduction** and explicit operator approval.
- **HUMAN-REPRODUCED** defaults no; **SUBMIT** defaults no (draft-only only after the operator states reproduction).

---

## Facts / Inferences / Assumptions / Unknowns (template)

Engagement overlays fill these for each campaign. Shared defaults:

- **FACTS:** Methodology and Build contract above; tooling map in `TOOLING-INVENTORY.md`.
- **INFERENCES:** Multi-account access control and operator-unique surfaces usually yield the best signal-to-noise.
- **ASSUMPTIONS:** Burp MCP remains available when the operator enables it; engagement `SCOPE.md` is current.
- **UNKNOWNS:** Per-program rate limits, required headers, asset lists — always read the engagement overlay.
