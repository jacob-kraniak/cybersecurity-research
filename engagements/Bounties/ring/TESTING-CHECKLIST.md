# Ring Practice Campaign — JKALI01 Testing Checklist

- **Case ID:** BB-2026-1126-01
- **Workstation:** JKALI01 (guided mode; scope-first)
- **Program:** [Ring on HackerOne](https://hackerone.com/ring)

## Pre-Flight (Required Before First Packet)

- [ ] Confirm outside-work policy and vendor-conflict checks are complete.
- [ ] Re-check live policy on `https://hackerone.com/ring` for any updates since 2026-11-26.
- [ ] Create two test accounts using `<h1username>@wearehackerone.com` (for authenticated access-control/IDOR checks).
- [ ] **Burp Suite User-Agent rule:** Add Match & Replace (`^User-Agent: .*$` -> `User-Agent: RingResearcher_<h1username>`) and verify in Logger.
- [ ] **Burp Suite Target Scope:** Lock to in-scope Ring/Blink domains; explicitly exclude AWS infrastructure, third-party SaaS hosts, and support-chat endpoints.
- [ ] **OOB Safety:** Confirm no third-party OOB/blind-XSS hosts (public Collaborator / hosted XSS Hunter) are enabled.
- [ ] **CLI Rate Cap:** If running `httpx` or `ffuf`, always pass `-H "User-Agent: RingResearcher_<h1username>"` and stay strictly `<= 5 req/s` (recommended conservative cap: `2 req/s`, `-t 2`).

## Phased Workflow

1. **Passive Recon & Ownership Check:** `whois`, `dig`, `host`, passive `amass` on `*.blinkforhome.com` and `*.immedia-semi.com`. Discard third-party hosted domains before active requests.
2. **Low-Rate HTTP Triage:** `httpx` (`-rl 2`) with required User-Agent on verified in-scope hosts.
3. **Manual Web/API Review (`burpsuite`):** Focus on eligible Low/Medium classes:
   - Broken Access Control / IDOR between your two test accounts
   - OAuth flow and redirect validation (`oauth.ring.com`)
   - CORS misconfiguration and Web Cache Deception
   - API parameter authorization and information disclosure (`api.ring.com`, `app.ring.com`, `billing.ring.com`)
4. **Optional Hardware Check:** Confirm owned device matches one of the 12 ASINs in `SCOPE.md` and is running the latest firmware before testing.

## Hard Stops

- Stop immediately if any non-owned customer data appears; document what was seen, delete locally, and report to Ring.
- Do not run brute-force/credential attacks (`hydra`, `medusa`), DoS tests, or exploit frameworks (`msfconsole`).
- Keep raw captures, tokens, and draft findings local until coordinated disclosure; never commit pre-disclosure data to `main`.
