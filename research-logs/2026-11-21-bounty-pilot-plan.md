# 2026-11-21 — 60-day bug bounty pilot plan (BB-2026-1121-01)

**Status**: Proposal (awaiting operator approval)
**Research angle**: Can a 60-day, low-cost bounty pilot on HackerOne and Bugcrowd roughly cover plan plus top-up costs?
**Case**: BB-2026-1121-01
**Engagement folder**: `engagements/Bounties/bounty-pilot-2026/`
**Branch (proposed)**: `research/bb-2026-1121-01-bounty-pilot`

## Hypothesis / Attack Surface

This is a planning log, not a vulnerability hypothesis. The working question is whether a narrow, low-cost bounty pilot (newer or less crowded programs; network gear, firmware, security tooling, and EV-charging work where it genuinely fits) can produce about $100-$500 in findings a month. That figure is a target, not a forecast. No target is in play until the operator finishes the outside-work policy check, approves a shortlist, and signs a per-program scope file.

## Prerequisites & Test Environment

- Public / personal research only. No employer, employer-vendor, or freight/logistics-sector targets, and no employer data in the repo.
- Platforms: HackerOne, Bugcrowd (profiles already in intake).
- Repo framework on jacob-kraniak/cybersecurity-research main at commit 943e18e: `grok-workspace-instructions.md`, `engagements/Bounties/` (including `chime/`), `engagements/VDP/dhs-vdp/scope/`, and `research-logs/2026-05-15-chime-bug-bounty-onboarding.md` as the per-program onboarding template.
- Tooling: JKALI01 inventory dated 2026-11-09 (America/New_York), guided mode only. The operator runs tools. Bots do not write PoC or exploit code.
- HORIZON-PROGRAMS.md and NEXUS-FIT.md: not yet delivered; program table stays pending.

## Steps / Reproducer

Not applicable as a vulnerability reproducer. Planning steps only:

1. Read intake and the Kali bounty inventory.
2. Read the repo policy and the existing `engagements/Bounties/` plus `research-logs/` layout at commit 943e18e.
3. Draft the pilot plan, ledger, Bounties README edit, and this log as a staged proposal. No branch, commit, push, or PR in this step.

## Results & Evidence

Staged (not committed) under the case `pr-staging/` tree, mirroring:

- `engagements/Bounties/README.md` (proposed edit)
- `engagements/Bounties/bounty-pilot-2026/PILOT-PLAN.md`
- `engagements/Bounties/bounty-pilot-2026/ledger.csv` and `ledger.md`
- This file at `research-logs/2026-11-21-bounty-pilot-plan.md`

Usage snapshot used in the plan: Grok Bot usage report, 2026-11-21 (America/New_York) — Premium; weekly usage limit 100% used (shared with other apps on the plan); reset Sunday, 2026-11-22 at 17:28 America/New_York; about $21 additional credits left. Operator-stated: more than $70 in top-up credits in the week ending 2026-11-22. Details and proposed caps are in the plan, not repeated here.

No program was selected. No target was contacted. Nothing was submitted.

## Impact Assessment (CVSS v4.0)

N/A for a planning log.

## Next Actions / Open Questions

- Operator: outside-work / outside-business policy check; approve or amend the proposed budget and kill criteria; set Day 0 only after that.
- HORIZON and NEXUS: deliver program and fit notes so the starter table can be filled (no invented programs in the meantime).
- After approval: open branch `research/bb-2026-1121-01-bounty-pilot` and a draft PR only. Do not push to main. Do not merge. Do not submit to any platform without a later, explicit yes.
- When a program is approved: add `engagements/Bounties/<program>/` in the Chime layout, write a scope file, and write an onboarding log from the Chime template. Do not add those folders in this proposal.
