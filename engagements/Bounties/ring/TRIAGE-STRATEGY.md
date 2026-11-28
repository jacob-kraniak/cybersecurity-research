# Ring Campaign — Triage & Hunting Strategy (Grok Build + JKALI01)

- **Case ID:** BB-2026-1126-01
- **Program:** [Ring & BlinkForHome on HackerOne](https://hackerone.com/ring)
- **Companion docs:** `SCOPE.md` (authoritative scope), `TESTING-CHECKLIST.md` (pre-flight), `README.md`
- **Retrieved / aligned:** 2026-11-26 (ET)
- **Purpose:** A working playbook Grok Build on JKALI01 can act from directly, dividing broad automated mapping (Build) from targeted deep scans (operator, manual).

---

## 0. Operating Principles (Read First)

1. **Automated mapping IS allowed.** Ring permits limited automated scanners at **<= 5 requests/second** per service **with** `User-Agent: RingResearcher_jacob-kraniak` on every request. Do not be overly timid: breadth-first mapping within that cap is explicitly in-policy. (Recommended conservative working cap: 2 req/s.)
2. **Surface-mapping-first, not blind fuzzing.** Map the whole attack surface, fingerprint and cluster it, then deep-dive the outliers. Do **not** burn cycles on blind shaped-GET fuzzing until something looks anomalous.
3. **Build does breadth; the operator does targeted depth.** Build handles the high-volume parse/map/cluster/flag work and surfaces outliers. The operator runs the actual targeted deep scans manually with Kali tooling. See the Operating Contract (Section 5).
4. **No background auto-approve.** Build must not run in unattended auto-approve loops that churn tokens with no useful output. Every targeted scan is operator-initiated. Build's job between asks is analysis, not continuous probing.
5. **Lean on the Burp MCP connection.** The local Burp Suite MCP connection is enabled; Build reads Burp scan results and proxy history directly. Parse what is already captured before re-requesting anything.

---

## 1. Methodology: Breadth -> Cluster -> Targeted Depth

### Phase A — Surface Mapping (Build, automated, within <=5 req/s + required UA)
- Enumerate endpoints, parameters, and JS-referenced routes across in-scope hosts.
- Parse existing Burp proxy history and site map via the MCP connection first; only issue new requests to fill gaps.
- Harvest from JS bundles: API paths, parameter names, feature flags, host references, and auth/token handling hints.
- Build a normalized inventory: host -> endpoint -> method -> params -> auth-required? -> content-type.

### Phase B — Fingerprint & Cluster (Build, analysis only)
- Group endpoints by framework/stack, response shape, auth boundary, and tenant/object-id patterns.
- Flag **outliers**: unusual response sizes/codes, inconsistent auth enforcement across sibling endpoints, reflected parameters, verbose errors, object-id patterns that look enumerable, CORS/ACAO echoes, redirect parameters, and header-handling quirks.
- Produce a ranked "leads to verify" list (not findings, not submissions).

### Phase C — Targeted Deep-Dive (Operator, manual on JKALI01)
- Operator picks leads from the ranked list and runs targeted, class-specific checks by hand (Burp Repeater/Intruder with tuned payload sets, manual access-control diffing between accounts, OAuth flow manipulation).
- Build supports by preparing request templates, diffing responses, and tracking which leads are open/closed — but does not auto-fire the targeted scans.

---

## 2. Priority Vulnerability List (OWASP Top 10 -> CWE/CVSS, Ring-eligible classes)

Ordered by expected payoff for this program. Use **Burp Target > Issue Definitions** as a live working checklist (each entry is a lead to verify manually, never an auto-submission).

| Priority | OWASP | Class | CWE | Typical CVSS band | Ring severity fit | Where to focus |
|---|---|---|---|---|---|---|
| 1 | A01 | Broken Access Control / IDOR | CWE-639, CWE-284 | Medium-High (often 5-8) | Medium-High (IDOR Medium-Critical) | Multi-account diffing between two `@wearehackerone.com` accounts on `api.ring.com`, `app.ring.com`, `billing.ring.com` |
| 2 | A07 | Auth / OAuth flow flaws | CWE-287, CWE-384 | Medium-High | Medium-High | `oauth.ring.com` redirect_uri/state/PKCE handling, token scope, session fixation |
| 3 | A10 | SSRF | CWE-918 | Low-Critical | Low-Critical | URL/webhook/image-fetch params on API endpoints |
| 4 | A03 | Injection (SQLi/XSS/CRLF) | CWE-89, CWE-79, CWE-93 | Medium-Critical | XSS Medium-Critical; CRLF Low-Medium | Reflected/stored inputs, header injection; XSS only via self-hosted OOB |
| 5 | A05 | Security Misconfiguration (CORS, Web Cache Deception) | CWE-942, CWE-525 | Low-Medium | Low-Medium | ACAO reflection with credentials; cacheable authenticated responses |
| 6 | A01 | Open Redirect | CWE-601 | Low-Medium | Low-Medium | Redirect/return/next params (verify real impact; bare open redirect is low) |
| 7 | A06/A05 | Request Smuggling | CWE-444 | Medium | Low-Medium | Front-end/back-end header desync on CDN-fronted hosts |

**Exclusion reminders (from `SCOPE.md`):** missing security headers, SSL/TLS best-practice, missing rate limiting, clickjacking, anonymous/logout CSRF, self-XSS, mixed-content scripting, banner/version disclosure, and theoretical subdomain takeover are all **non-qualifying** — do not spend time on them.

---

## 3. Target Prioritization (Beat the Crowd)

Ranked bias for where to invest effort, since this program has ~140 reports/90d and 189 hackers thanked:

1. **Business logic + multi-account access control.** Scanners miss it and many hunters skip it. This is the top differentiator — anchor on A01/IDOR between two owned test accounts.
2. **Operator's hardware advantage (highest-value, lowest-competition).** The operator owns Ring hardware, so **companion-app <-> API traffic and device endpoints** are a surface most remote-only hunters cannot reach. Devices also pay **$500 Low vs $200 web**. Capture companion-app API calls through Burp (device paired, latest firmware) and compare device-originated requests against the documented API surface.
3. **Newest / recently-added assets.** Weight toward recently added scope entries (e.g., `publicsafety.ring.com`, added 2025-05-12) and niche/non-flagship subdomains over heavily-trodden flagship `ring.com` / `app.ring.com` front doors.
4. **Niche subdomains with real function** over marketing/brand pages (secondary focus, lower payoff).

---

## 4. Current Proxy-History State (Continuity)

Carry this state forward so Build resumes without rework:

- **Scope-safe hosts confirmed / mapped:** `ring.com`, `oauth.ring.com` (done).
- **Untouched in-scope hosts queued (in order):** `app.ring.com` -> `api.ring.com` -> `billing.ring.com`, then `admin.ring.com` / `nw.ring.com` / `fw.ring.com` / `publicsafety.ring.com` / `prd-ring-web-us.prd.rings.solutions`.
- **OUT of scope file — leave alone:** `static.ring.com` and `chatbot.rc3.ring.com` are NOT in the scope CSV; do not request them. (Chatbot/support-chat surfaces are also excluded by the employee-communication rule.)
- **Needs WHOIS/RDAP ownership check before any request:** `*.blinkforhome.com` and `*.immedia-semi.com` — confirm Ring/Amazon ownership and drop any third-party-hosted subdomain before probing.
- **Blocked pending prerequisite:** Authenticated access-control / IDOR work waits on **two** `@wearehackerone.com` test accounts being provisioned.

---

## 5. Grok Build Operating Contract

### Build does autonomously (when instructed; analysis-heavy, low request volume)
- Parse Burp proxy history and scan results via the MCP connection.
- Map endpoints, parameters, and JS-referenced routes; normalize into the inventory.
- Fingerprint/cluster the surface and flag outliers.
- Maintain the ranked "leads to verify" list and the host queue state.
- Prepare request templates and response diffs for the operator's manual checks.
- Any Build-issued requests stay `<= 5 req/s` with `User-Agent: RingResearcher_jacob-kraniak`.

### Operator runs manually on JKALI01 (Build must hand these off, not execute)
- The actual targeted deep scans (tuned Intruder/Repeater runs, class-specific payload testing).
- Authenticated multi-account access-control testing.
- Device / companion-app traffic capture and analysis.
- Any decision to submit a report.

### Hard rules
- **No background auto-approve.** No unattended probing loops. Build pauses for the operator between asks.
- **No third-party OOB.** Blind-XSS/OOB only via operator-owned self-hosted infrastructure (third-party hosts forfeit all rewards).
- **No PoC/exploit code or payload generation in this repo.** Strategy and leads only.
- **Scope is law.** Only hosts in `SCOPE.md`; `static.ring.com` and `chatbot.rc3.ring.com` stay untouched.
- **No submission without human reproduction** and explicit operator approval.

---

## Facts / Inferences / Assumptions / Unknowns

- **FACTS:** Ring allows automated scanners at <=5 req/s with the required User-Agent; `publicsafety.ring.com` is in the scope CSV (added 2025-05-12); devices pay $500 Low vs $200 web; `static.ring.com` and `chatbot.rc3.ring.com` are absent from the scope CSV.
- **INFERENCES:** Multi-account access control and device/companion-app surfaces are the lowest-competition, highest-yield areas for this operator.
- **ASSUMPTIONS:** Burp MCP connection remains enabled; operator sets the two test accounts before authenticated work begins.
- **UNKNOWNS:** Which exact Ring/Blink device(s) the operator owns (gates the hardware workstream); ownership of individual `*.blinkforhome.com` / `*.immedia-semi.com` subdomains pending WHOIS/RDAP.
