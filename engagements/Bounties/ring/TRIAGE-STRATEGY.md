# Ring Campaign — Triage Overlay

- **Case ID:** BB-2026-1126-01
- **Program:** [Ring & BlinkForHome on HackerOne](https://hackerone.com/ring)
- **Shared contract (methodology, priority list, Build operating contract):** [`../../../reference/TRIAGE-STRATEGY.md`](../../../reference/TRIAGE-STRATEGY.md)
- **Shared tooling map:** [`../../../reference/TOOLING-INVENTORY.md`](../../../reference/TOOLING-INVENTORY.md)
- **Authoritative scope:** `SCOPE.md`
- **Pre-flight:** `TESTING-CHECKLIST.md`
- **Aligned:** 2026-11-26 (ET)

This file holds **Ring-specific** continuity and prioritization only. Do not duplicate the shared methodology here.

---

## Program caps (from `SCOPE.md`)

- Limited automated scanners **allowed** at **<= 5 req/s** per service with the required `User-Agent: RingResearcher_<h1username>` on **all** traffic.
- Recommended conservative working cap for Build mapping: **2 req/s**.
- No third-party OOB / blind-XSS hosts (self-hosted only; third-party = reward forfeiture).
- Test accounts: `<h1username>@wearehackerone.com`.

Because scanners are explicitly allowed within those caps, breadth-first automated mapping under the shared Phase A contract is in-policy — Build should not be overly timid on mapping, and must still obey the caps and UA.

---

## Ring priority bias (extends shared §3)

1. Business logic + multi-account access control (two `@wearehackerone.com` accounts) on API/app/billing surfaces.
2. **Hardware / companion-app advantage:** operator-owned Ring/Blink devices → companion-app ↔ API traffic and device endpoints most remote-only hunters cannot reach. Device Low payout is higher than web Low (see `SCOPE.md` reward table). Use `waydroid` + Burp per the shared tooling map when exercising mobile packages.
3. Newest / niche hosts (e.g. `publicsafety.ring.com`) over flagship front doors.
4. Eligible classes only — skip non-qualifying items listed in `SCOPE.md`.

---

## Current proxy-history state (continuity)

Carry forward so Build resumes without rework:

- **Mapped:** `ring.com`, `oauth.ring.com`
- **Queued (order):** `app.ring.com` → `api.ring.com` → `billing.ring.com`, then `admin.ring.com` / `nw.ring.com` / `fw.ring.com` / `publicsafety.ring.com` / `prd-ring-web-us.prd.rings.solutions`
- **Out of scope file — leave alone:** `static.ring.com`, `chatbot.rc3.ring.com` (also excluded by employee-communication / support-chat rules)
- **WHOIS/RDAP before any request:** `*.blinkforhome.com`, `*.immedia-semi.com`
- **Blocked pending prerequisite:** authenticated access-control / IDOR waits on **two** `@wearehackerone.com` test accounts

---

## Build reminder for this engagement

Follow shared [`TRIAGE-STRATEGY.md`](../../../reference/TRIAGE-STRATEGY.md) §5. Ring-specific: parse Burp MCP first; map under <=5 req/s + required UA; hand targeted scans to the operator; **no background auto-approve**.
