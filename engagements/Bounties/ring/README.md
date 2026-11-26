# Ring & BlinkForHome Bug Bounty Engagement

- **Program:** [Ring and BlinkForHome Bug Bounty Program](https://hackerone.com/ring)
- **Platform:** HackerOne (Public Paid Bounty, Closed Scope)
- **Status:** Onboarding / Scope Locked (Pre-Testing)
- **Case ID:** BB-2026-1126-01
- **Policy Retrieved:** 2026-11-26 (ET)

## Artifacts

- Program scope, exclusions, and rules of engagement: `SCOPE.md`
- JKALI01 pre-flight and Burp configuration checklist: `TESTING-CHECKLIST.md`
- Session research logs: `research-logs/`

## Ground Rules

- Public `main` holds scope documentation, checklists, and coordinated/redacted notes only.
- Pre-disclosure findings, raw captures, tokens, cookies, and unredacted logs stay off `main` (operator-held local files or private branch only).
- All testing stays strictly within `SCOPE.md` using `User-Agent: RingResearcher_<h1username>`, `@wearehackerone.com` test accounts, and `<= 5 req/s`.
- Nothing is submitted to HackerOne without explicit human reproduction and operator approval.
