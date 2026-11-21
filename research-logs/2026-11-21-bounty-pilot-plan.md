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
- HORIZON-PROGRAMS.md delivered with collection window 2026-11-21, 12:43 PM-12:55 PM ET (America/New_York). NEXUS-FIT.md delivered with retrieved-at 2026-11-21, about 1:00-1:07 PM ET (America/New_York).

## Steps / Reproducer

Not applicable as a vulnerability reproducer. Planning steps only:

1. Read intake and the Kali bounty inventory.
2. Read the repo policy and the existing `engagements/Bounties/` plus `research-logs/` layout at commit 943e18e.
3. Draft the pilot plan, ledger, Bounties README edit, and this log as a staged proposal. No branch, commit, push, or PR in that step.
4. After draft PR #4 was opened, read HORIZON-PROGRAMS.md and NEXUS-FIT.md, fill the starter-programs table from those packets only, and update this log. No invented programs, payouts, or scope.

## Results & Evidence

The pilot plan, ledger, Bounties README edit, and this log were staged, then opened as draft pull request https://github.com/jacob-kraniak/cybersecurity-research/pull/4 on branch `research/bb-2026-1121-01-bounty-pilot`. The PR is not merged. Base is `main`.

Usage snapshot used in the plan: Grok Bot usage report, 2026-11-21 (America/New_York) — Premium; weekly usage limit 100% used (shared with other apps on the plan); reset Sunday, 2026-11-22 at 17:28 America/New_York; about $21 additional credits left. Operator-stated: more than $70 in top-up credits in the week ending 2026-11-22. Details and proposed caps are in the plan, not repeated here.

Starter-program selection (BRIEF, 2026-11-21, afternoon America/New_York), quoted from HORIZON and NEXUS only, now fills the table in `engagements/Bounties/bounty-pilot-2026/PILOT-PLAN.md`:

- GO (starter 1): HPE Networking Product (Bugcrowd). Focus: AOS-10, AOS-8, and AOS-CX official OVAs; variant and patch-diff review against the Oct/Nov 2026 HPESBNW fixes. Lab work without buying hardware. Proposed timebox: 3 weeks, first in sequence.
- GO (starter 2): AXIS OS (Bugcrowd). Focus: AXIS OS 13 (VAPIX/ACAP classes). Open item: confirm whether the unsigned-ACAP precondition is out of scope under the program rules before any work. Proposed timebox: 3 weeks, second in sequence.
- WAIT (conditional third): Synology (vendor-run). Only if the operator already owns DSM 7 hardware. Safe harbor is not stated on the pages HORIZON retrieved, so it is unclear. Advisories SA-26:18 and SA-26:19 are context only.
- NO-GO for now: NetScaler (crowded KEV/ITW attention, no build named, $0 paid in the last 90 days), Forescout (thin CVE trail), QNAP (no per-severity payout table).

None of these is an EV-charging program. EV charging (OCPP, ISO 15118) stays a strength to watch for in future programs.

No program folder was added. No target was contacted. Nothing was submitted.

## Impact Assessment (CVSS v4.0)

N/A for a planning log.

## Next Actions / Open Questions

- Operator: complete the outside-work / outside-business policy check, and confirm that none of the vendors in the starter table supplies the operator's employer, without naming the employer. Approve or amend the proposed pick, budget, and kill criteria. Set Day 0 only after those gates.
- Before any AXIS work: confirm whether the unsigned-ACAP precondition is out of scope under the program rules (HORIZON lists ACAPs among published out-of-scope items; NEXUS flags the unsigned-install precondition).
- Before Synology leaves WAIT: confirm that the operator already owns DSM 7 hardware.
- After approval: add `engagements/Bounties/<program>/` in the Chime layout for each GO program, write a scope file, and write an onboarding log from the Chime template. Do not add those folders until approved.
- Pull request #4 stays a draft. Do not push this work to main. Do not merge. Do not submit to any platform without a later, explicit yes.
