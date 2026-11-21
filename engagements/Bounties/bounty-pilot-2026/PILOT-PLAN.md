# BB-2026-1121-01 - 60-day bug bounty pilot plan

CASE-ID: BB-2026-1121-01
ROLE: BRIEF
PROGRAM: HPE Networking Product (Bugcrowd); AXIS OS (Bugcrowd); Synology vendor-run (WAIT, conditional)
PLATFORM: HackerOne, Bugcrowd; Synology vendor-run (conditional)
BRIEF retrieved-at: 2026-11-21 (America/New_York). Selection update: 2026-11-21, afternoon America/New_York.
STATUS: PROPOSAL, awaiting operator approval
HUMAN-REPRODUCED?: no
SUBMIT?: no
GO/NO-GO/WAIT: WAIT (starter pick proposed; pre-start and employer-vendor gates still open)
STAFFED: BRIEF (lead); HORIZON (candidate programs, delivered 2026-11-21); NEXUS (product/CVE fit, delivered 2026-11-21); QUILL (not staffed)
HANDOFF: AEGIS for QC, then Chief of Staff, then the operator

This is a short proposal, not an authorization to test or submit. Session log: [research-logs/2026-11-21-bounty-pilot-plan.md](../../../research-logs/2026-11-21-bounty-pilot-plan.md). Ledger: [ledger.csv](ledger.csv), [ledger.md](ledger.md).

## Policy overrides for this pilot

`grok-workspace-instructions.md` on main (commit 943e18e) still governs repo layout, research-log structure, Conventional Commits, `research/` branches, and the rule that public `main` holds only coordinated, redacted, mitigation-ready content. Where that file conflicts with this pilot, this plan and the draft PR body win:

1. No direct pushes to the remote. Work stays on `research/bb-2026-1121-01-bounty-pilot` and a draft pull request only. Never push this work to `main`. Never merge until the operator explicitly says to merge.
2. Bots do not write proof-of-concept or exploit code, and they do not build offensive tooling. The operator does all hands-on testing and reviews every submission.

## Goal and break-even math

Question: can a 60-day, low-cost bounty pilot produce about $100-$500 in findings a month, enough to roughly cover the operator's Grok Bot / Cursor plan plus top-ups?

The $100-$500/month figure is a **target, not a forecast**. This plan does not predict that the target will be hit.

Operator-stated costs (use for break-even framing only):

- Current plan: Premium, $25/month.
- Top-up credits: more than $70 spent in the week ending 2026-11-22.
- Stated comparison prices: Super $84/month, Ultra $167/month.

Grok Bot usage report, read 2026-11-21 (America/New_York), used to ground the spend picture, not to invent a forecast:

- Plan confirmed: Premium.
- Weekly usage limit: 100% used. That limit is shared with the other apps on the plan, not Grok Bot only.
- Weekly usage limit resets Sunday, 2026-11-22 at 17:28 America/New_York.
- Additional usage credits left: about $21.
- On-demand usage (after included usage ran out) was 72% of Grok Bot usage over the last 7 days (2026-11-14 to 2026-11-21, UTC).
- In that 7-day window, Household (44%), Chief of Staff (20%), and Ship Desk (18%) accounted for most Grok Bot usage. HORIZON was 5%; BRIEF was 1%; AEGIS and NEXUS were each under 1%.
- Over the last 30 days (2026-10-22 to 2026-11-21, UTC), on-demand usage was 47% of Grok Bot usage. Household 26%, Ship Desk 19%, Chief of Staff 19%, HORIZON 8%, OSINT Desk 8%, other bots 20%. The monthly additional-usage limit itself was not shown.

Break-even, for this pilot, means payouts that cover the $25/month Premium plan plus whatever top-ups are attributable to bounty work, not the entire household and desk spend. The recent $70-plus top-up week was driven mainly by bots outside this cell.

## Pre-start gate

The operator checks the operator's employer's outside-work / outside-business policy before any testing. This file does not name the employer and must not receive employer data.

Exclusions, even after that check: no employer targets, no employer-vendor targets, and no freight or logistics-sector targets.

The operator must also confirm that none of the vendors in the starter-programs table supplies the operator's employer, without naming the employer in this repository. That employer-vendor check is a gate for every row, including the GO programs. No testing starts until it is complete.

No tool runs against a target, and no program is treated as in play, until this gate is complete and a per-program scope file exists (see Roles).

## Program selection criteria

Prefer:

- Newer, private, or less crowded programs on HackerOne or Bugcrowd.
- Network gear, firmware, and security tooling.
- Areas that fit the operator's existing strengths, including EV charging (OCPP, ISO 15118) and the operator's own Tesla Wall Connector, when a program actually covers that work.

Avoid:

- Crowded web apps, launch-day squats, and spraying many programs at once.
- Anything in the exclusion list above.

Stay strictly within each program's published scope and rules, including safe harbor, rate limits, and banned test types. Do not invent programs, payout ranges, or scope. Figures below are quoted from HORIZON-PROGRAMS.md and NEXUS-FIT.md, with their retrieval times. Where a value was not documented, the cell says UNKNOWN.

None of the programs in this table is an EV-charging program. EV charging (OCPP, ISO 15118) and the operator's own Tesla Wall Connector stay a strength to watch for in future programs, not a current starter.

When a program is approved, add `engagements/Bounties/<program>/` using the `chime/` layout. Do not add those folders in this proposal. Onboarding logs follow [research-logs/2026-05-15-chime-bug-bounty-onboarding.md](../../../research-logs/2026-05-15-chime-bug-bounty-onboarding.md).

## Starter programs

Selection by BRIEF on 2026-11-21 (America/New_York), using only HORIZON-PROGRAMS.md (collection window 2026-11-21, 12:43 PM-12:55 PM ET, America/New_York) and NEXUS-FIT.md (retrieved-at 2026-11-21, about 1:00-1:07 PM ET, America/New_York). This table is still a proposal. It does not authorize testing or submission.

Sources for every quoted URL, payout, crowding figure, and safe-harbor sentence: HORIZON, unless Fit is marked as NEXUS. Timeboxes are BRIEF proposals, not program rules.

| Program | Platform | Fit | Noise | Safe-harbor | Timebox | GO/NO-GO | Why |
|---|---|---|---|---|---|---|---|
| HPE Networking Product Public Program | Bugcrowd. Scope URL: https://bugcrowd.com/engagements/hpe-networking-product-public (HORIZON, 2026-11-21, 12:43 PM-12:55 PM ET). | High (NEXUS, 2026-11-21, about 1:00-1:07 PM ET). AOS-10 / AOS-8 / AOS-CX with official OVAs. Recurring CLI, PAPI, and web-management classes. Preferred in-scope lines sit after recent fixed builds; NEXUS cites Oct/Nov 2026 HPESBNW05162 (released 2026-10-22, rev.2 2026-11-18) as the documented Oct/Nov bulletin for variant and patch-diff review. | Medium-high (HORIZON assessment). 537 rewarded vulnerabilities; average payout $2,277.50; validation within "about 1 month"; hall of fame 71; "recently joined users" total 92; scopeRank 4. Cross-branch duplicate rule. Brief last published 2026-11-18, 4:44 PM ET. StartsAt 2023-01-17, 1:00 PM ET. | Bugcrowd brief label: Safe harbor / full. HORIZON: same standard sentence as AXIS, "This engagement is fully committed to providing safe harbor for good-faith security research." Not labeled Gold Standard Safe Harbor or disclose.io on the brief HORIZON retrieved 2026-11-21, 12:43 PM-12:55 PM ET. | 3 weeks, first in sequence (proposal). | GO (starter 1) | Official OVAs for AOS-10 Virtual Gateway, AOS-8 Virtual Gateway, and an AOS-CX switch simulator, so this work can start in a lab without buying switches or APs (HORIZON/NEXUS). Focus is limited to those official OVAs and patch-diff against the documented Oct/Nov 2026 HPESBNW fixes. Published payouts (HORIZON official rewardRangeData): Group 1 (AOS-10.7+ GW/AP, New Central UI, ArubaOS-CX Switches) P1 $5,000; P2 $3,000; P3 $1,200; P4 $600; P5 none. Group 2 (AOS-8, AOS-10.4, and other named families) P1 $2,500; P2 $1,500; P3 $600; P4 $300; P5 none. Aruba Central old/original UI: P1 $2,500; P2 $1,500; P3-P5 none. Group 3: no published dollar table. Still gated on the employer-vendor check and a scope file. |
| AXIS OS | Bugcrowd. Scope URL: https://bugcrowd.com/engagements/axis-os-public (HORIZON, 2026-11-21, 12:43 PM-12:55 PM ET). | High (NEXUS, 2026-11-21, about 1:00-1:07 PM ET). AXIS OS 13 Active Track. Recurring VAPIX CGI / input-validation and ACAP framework classes. Explicit CVE-bypass payout. Latest Active Track as of NEXUS retrieval: 13.0.114 (2026-11-05); NEXUS says the in-scope latest is post-fix for several Nov 2026 Axis advisories. | Medium (HORIZON assessment). 90 rewarded vulnerabilities; average payout $6,068.18; validation within 22 days; hall of fame 65; "recently joined users" total 269; scopeRank 1 (definition not published on the brief). One shared OS and a same-root-cause collapse rule. Engagement startsAt 2024-09-24, 00:00 UTC (2024-09-23, 8:00 PM ET). Latest brief published 2026-11-13, 4:23 AM ET. | Bugcrowd brief label: Safe harbor / full — "This engagement is fully committed to providing safe harbor for good-faith security research." Not labeled Gold Standard Safe Harbor or disclose.io on the brief HORIZON retrieved 2026-11-21, 12:43 PM-12:55 PM ET. | 3 weeks, second in sequence (proposal). | GO (starter 2) | Focus: AXIS OS 13, VAPIX/ACAP classes (NEXUS). Published payouts (HORIZON official rewardRangeData and brief text): P1 $20,000; P2 $5,000; P3 $1,000; P4 $250; P5 none. Also: one-time $500 per previously disclosed AXIS OS CVE bypass (or full severity if impact is raised); exceptional bonus up to $5,000; rewardRangeData programMax $25,000; CVE-ID swag (AXIS M1075-L) as published. Open item before any work: confirm whether the unsigned-ACAP precondition is out of scope under the program rules. HORIZON lists ACAPs among published out-of-scope items; NEXUS says many ACAP-class advisories require an unsigned-ACAP install config and tells us to verify that against Bugcrowd out-of-scope text before investing. Those two statements are not resolved here. Hardware caveat (HORIZON): Axis does not currently provide hosted devices; a physical unit may still be needed. Still gated on the employer-vendor check and a scope file. |
| Synology Security Bug Bounty Program | Vendor-run. Scope URLs: https://www.synology.com/en-us/security/bounty_program and https://www.synology.com/en-us/security/bounty_program/scope_and_reward (HORIZON, 2026-11-21, 12:43 PM-12:55 PM ET). | High for DSM/SRM if hardware is already on hand; Med otherwise (NEXUS, 2026-11-21, about 1:00-1:07 PM ET). Named in-scope line for this wait: DSM 7 (latest official). No OVA; QEMU reports are not accepted (HORIZON/NEXUS). | Medium-high (HORIZON assessment). 355 acknowledgement-list entries (340 unique strings); year tabs 2017 through 2026; no public 90-day submission or paid-bounty counters. Reward process "will take at least 90 days." Launch date: UNKNOWN (not specified on the pages HORIZON retrieved). Policy last-updated timestamp: UNKNOWN (none found on those pages). | None found. HORIZON, 2026-11-21, 12:43 PM-12:55 PM ET: no "safe harbor," Gold Standard, or disclose.io label on the bounty pages retrieved. Formal harbor language was not located. Pages say testing "must not breach local or Taiwanese laws." Unclear. | 3 weeks, only if the WAIT condition clears (proposal). The published 90-day-plus payout cycle can overrun the 60-day pilot. | WAIT (conditional third) | Only if the operator already owns DSM 7 hardware. Advisories Synology-SA-26:18 and SA-26:19 (NEXUS, vendor pages retrieved 2026-11-21) are context only; in-scope "DSM 7 (latest)" is post-fix relative to the fixed builds those advisories name. Published payouts (HORIZON): category caps Operating systems up to $30,000 (footnotes: SRM_LAN max $5,000; camera firmware max $10,000); Software and C2 up to US$10,000; Web services up to $5,000. A Critical/Important severity grid is published; Moderate or unlisted classes get a CVE ID but no monetary reward. Still gated on the employer-vendor check, the hardware condition, and a scope file. |
| NetScaler Public Program | HackerOne. Scope URL: https://hackerone.com/netscaler_public_program (HORIZON, 2026-11-21, 12:43 PM-12:55 PM ET). | Med for skill; Low-Med as a pilot money bet (NEXUS, 2026-11-21, about 1:00-1:07 PM ET). In-scope products named as Testing Instances; version/firmware line: UNKNOWN (not specified). Precise version math against the test instance is blocked until a build is recorded. | HORIZON duplicate-risk assessment: Low-medium. Platform-reported: 5 hackers thanked; 5 participants; 24 reports received in last 90 days; $1,600 total bounties paid; $0 paid in last 90 days; last report resolved 2025-11-04, 3:50 AM ET; response efficiency 8% (indicator: failed). Resolved-report count is not published. NEXUS: heavy KEV/ITW attention. Bounty launched 2025-09-11, 8:15 AM ET. Policy last changed 2025-10-27, 2:26 AM ET. Bounty table last updated 2026-05-01, 8:02 AM ET. | None found in the published policy (HORIZON, 2026-11-21, 12:43 PM-12:55 PM ET). Policy still contains HackerOne template placeholders. disclose.io directory match for netscaler.com: 0 programs. | n/a (NO-GO for now) | NO-GO for now | Crowded in the KEV/ITW sense (NEXUS: many KEV entries). No build named in scope (HORIZON/NEXUS). $0 paid in the last 90 days (HORIZON). Published payouts (HORIZON): Low none; Medium $300; High $2,000; Critical $5,000 (USD; not a range). |
| ForeScout Technologies | HackerOne. Scope URL: https://hackerone.com/forescout_technologies (HORIZON, 2026-11-21, 12:43 PM-12:55 PM ET). Public scope CSV also retrieved by HORIZON: https://hackerone.com/teams/forescout_technologies/assets/download_csv.csv. | Med for the security-tooling theme; Low for variant/patch-diff yield (NEXUS, 2026-11-21, about 1:00-1:07 PM ET). Named hardware row: CounterAct 9.x. Exact 9.x build: UNKNOWN (HORIZON: instruction field empty). | Medium (HORIZON assessment; lower on the newer CounterAct 9.x row, higher on long-standing web assets). 99 resolved reports; 182 hackers thanked; 177 participants; 30 reports in last 90 days; $117,600 total bounties paid; $0 paid in last 90 days; last report resolved 2026-06-10, 12:02 PM ET; average bounty $600-$1,000; response efficiency 81%. Program launched 2019-07-31, 11:32 AM ET. Policy last changed 2024-09-17, 1:51 PM ET. Bounty table updated_at 2022-08-15. | Explicit legal language in the policy "Safe Harbor" section (HORIZON, 2026-11-21, 12:43 PM-12:55 PM ET): activities consistent with the policy "will be considered authorized conduct and we will not initiate legal action against you," and Forescout will "take steps to make it known" to third parties. Not labeled Gold Standard Safe Harbor on the policy HORIZON retrieved. | n/a (NO-GO for now) | NO-GO for now | Thin product-specific CVE trail (NEXUS). $0 paid in the last 90 days and a 2022 bounty table (HORIZON). Published payouts (HORIZON): Low $100-$500; Medium $501-$1,000; High $1,001-$2,000; Critical $2,001-$4,000. |
| QNAP Security Bounty Program | Vendor-run. Scope URLs: https://www.qnap.com/en/security-bounty-program and https://www.qnap.com/en-us/security-bounty-program (HORIZON, 2026-11-21, 12:43 PM-12:55 PM ET). HORIZON retrieved full policy via WebFetch; unauthenticated curl returned HTTP 403 / a "Page Not Found" shell. | Med-High on firmware/NAS skills; Med overall for this pilot (NEXUS, 2026-11-21, about 1:00-1:07 PM ET), because there is no public severity-to-dollar grid. In-scope lines: QTS 5.2.0 and later official releases; QuTS hero h5.2.0 and later official releases. | Medium (HORIZON assessment). 77 names listed under Acknowledgments (HORIZON count). No platform volume counters. Page last updated: 2026/11/10 (no timezone stated). Launch date: UNKNOWN (not specified). | Explicit good-faith language (HORIZON, 2026-11-21, 12:43 PM-12:55 PM ET): if a researcher "tests and reports in good faith in accordance with this page and the QNAP Security Bounty Program Terms and Conditions, QNAP will not take legal action against the researcher for such research activities," with a stated exception that QNAP may have to notify authorities. Not labeled Gold Standard Safe Harbor. Good-faith protection does not apply if the researcher exceeds data-minimization rules or discloses non-public data. | n/a (NO-GO for now) | NO-GO for now | No per-severity payout table (HORIZON/NEXUS). Only category maximums are published: Operating systems up to US$20,000; Applications up to US$10,000; Cloud services up to US$5,000. HORIZON could not say from official text whether a typical $100-$500 finding is paid, delayed, or acknowledged without a bounty. |

### UNKNOWN values left in or around the table

- Whether any vendor in this table supplies the operator's employer (gate; not yet confirmed).
- AXIS: whether the unsigned-ACAP precondition is out of scope under current program rules (open item). HORIZON lists ACAPs among published out-of-scope items; NEXUS treats unsigned-ACAP install as a precondition to verify. Not resolved here.
- Whether the operator already owns DSM 7 hardware (Synology WAIT condition).
- Whether the operator has, or will obtain, a physical Axis device (HORIZON caveat; not a WAIT in this pick).
- Synology: launch date, and a policy last-updated timestamp (not specified on the pages HORIZON retrieved). Safe harbor is not stated (documented as none found; unclear).
- Synology Camera "Firmware 1.1 (latest)" vs fixed 1.2.0-0525, and BeeStation OS 1.0 vs later fixed lines (NEXUS gaps). Not used in this pick, which would be DSM 7 only if the WAIT clears.
- NetScaler test-instance firmware build (not named in scope).
- Forescout CounterAct 9.x exact build, and mapping to eyeSight 9.1.x (NEXUS/HORIZON).
- QNAP: launch date; whether a typical $100-$500 finding is paid (no per-severity grid).
- HPE AOS-CX: a specific CX version number is not specified beyond the firmware link and "latest" guidance (HORIZON).


## Roles

Bots may: scope from public program rules, write public-source recon summaries, match published versions and CVE classes, and draft reports.

The operator (Jacob): does all hands-on testing, runs any tool against a target, reviews every submission, and is the only person who can approve a submit.

Rules:

- Nothing is submitted to any platform without the operator's explicit yes for that report.
- A scope file per program is required before anything touches a target. Place it under the later `engagements/Bounties/<program>/` folder, in the same spirit as `engagements/VDP/dhs-vdp/scope/` (commit 943e18e). The scope file must list in-scope assets, the out-of-scope list, rate limits, banned tests, and safe-harbor status.
- No exploit how-tos, no proof-of-concept or exploit code from bots, and no bot-built offensive tooling.
- HUMAN-REPRODUCED? stays `no` until the operator states a finding was reproduced. SUBMIT? stays `no` until the operator approves a specific submission.

### Tooling (guided mode only)

Reference only tools already present in the JKALI01 inventory (`BOUNTY_STARTER_SET.md`, `KALI_TOOL_INVENTORY.md`, captured 2026-11-09, America/New_York). BRIEF may name a tool and why; the operator approves and runs it; output comes back for joint reading.

Starter-path tools already on the host include: `theHarvester`, `recon-ng`, `spiderfoot`, `whois`, `dig`, `host`, `amass` (passive first), `dnsrecon`/`dnsenum` if allowed, `httpx`/`httpx-toolkit`, `whatweb`, `wafw00f`, `sslscan`/`sslyze`, `ffuf` (preferred), `feroxbuster`, `gobuster`, `eyewitness`, `burpsuite`, `mitmproxy`/`mitmweb`, `nuclei` (safe templates only, and only if the program allows scanners), `nikto` if allowed, `wpscan` (WordPress only), `sqlmap`/`commix` only if that class of test is allowed, `nmap` at polite timing if ports are in scope, plus `script`, `tmux`, `jq`, `cvss_calculator`, and `searchsploit` for notes and public-advisory research.

Firmware and network-gear work, when a program allows it, can use inventory tools already present at lower bounty-relevance: `binwalk`/`binwalk3`, `radare2`, `gdb`, `strings`, `objdump`, and SNMP helpers (`snmpwalk` and related) only if SNMP is in scope. There is no EV-charging-specific tool in the inventory; charging-protocol work would use the general set above plus operator-held hardware, not a new bot-built tool.

Not in the starter path, even when present: credential online attacks (`hydra`, `medusa`, `ncrack`, `patator`); exploitation frameworks (`msfconsole`, `msfvenom`, `setoolkit`, and similar); AD / post-exploitation tooling; wireless or LAN MitM suites.

Install only if a program allows it (notable inventory gaps): `subfinder`; `katana` / `gau` / `waybackurls` / `hakrawler`; `assetfinder` / `dirsearch`; `zaproxy`; `john` (the main binary; `*2john` helpers are present); `jwt_tool` / `dalfox` / `arjun` / `paramspider`; `ghidra` / `volatility` / `steghide`. Do not install these by default.

## 60-day timeline

Start date: `TBD` (placeholder until the operator approves this plan and completes the pre-start gate). Day 0 is that approved start date, not the date of this proposal.

| Window | Work |
|---|---|
| Week 1 (Day 0-7) | Finish the outside-work policy check and the employer-vendor confirmation (none of the tabled vendors supplies the operator's employer). Operator approves or amends this pick. Write a scope file and a Chime-style onboarding log for each approved GO program. Confirm the AXIS unsigned-ACAP / out-of-scope question before any Axis work. Confirm DSM 7 hardware before Synology leaves WAIT. No testing until those exist. |
| Weeks 2-7 (Day 8-49) | Hunting inside the agreed timeboxes. Proposed sequence (proposal only): HPE official OVAs for about 3 weeks, then AXIS OS 13 for about 3 weeks. Bots limited to scoping, recon summaries, CVE/version matching, and report drafts. Operator does the hands-on work. |
| Day 30 | Checkpoint: read the ledger (tagged spend, hours, any drafts or payouts), compare to the caps and kill criteria, and decide whether to continue, narrow, or stop. |
| Day 60 | GO/NO-GO: continue, redesign, or end the pilot based on the ledger (net payouts minus tagged spend, accepted vs duplicate/informative, and whether the $100-$500/month figure still makes sense as a target). |

## Kill criteria (proposals)

These numbers are proposals. They do not take effect until the operator approves them.

1. Stop or pause the pilot if pilot-tagged spend exceeds the weekly cap (proposed: $10) in each of two consecutive weeks with no accepted findings.
2. Stop or pause if pilot-tagged spend reaches the monthly cap (proposed: $40) before Day 30 with no operator-approved submission.
3. Stop or redesign if, once at least four reports have been submitted, 50% or more are marked duplicate.
4. At Day 60, default to NO-GO if both months hit the spend cap and there are still no accepted findings.

Any of these can be waived only by the operator, in writing in this case.

## Token budget (proposals)

Overall usage tracking belongs to dr eggbot. This pilot only tags its own spend in `ledger.csv`.

Proposed monthly pilot-tagged spend cap: **$40 of Grok Bot usage**. Proposed weekly soft cap: **$10**, used for the two-week kill rule.

Basis: the 2026-11-21 usage report shows the weekly included limit already exhausted, about $21 of additional credits left, and most recent usage coming from Household, Chief of Staff, and Ship Desk, not this research cell (BRIEF 1% of the last 7 days). A $40/month tagged cap is a small, deliberate slice of the operator-stated $70-plus top-up week, enough for scoping, recon summaries, CVE matching, and report drafts across two or three programs, without adding another large consumer. It is a cap, not an estimate of what the work will cost, and not a forecast of payouts.

Proposed per-finding spend guideline: pause bot work on a single finding and return it to the operator once estimated tagged spend for that `finding_ref` reaches **$15**, or **25% of that program's published minimum payout for the claimed severity**, whichever is lower. If no published minimum is on file, use $15. This is a review gate, not a finding about expected payouts.

Do not use untagged or household usage to justify more pilot spend.

## Money note

General guidance, not tax advice; check with a CPA once income arrives.

Start ad hoc. Payouts go on Schedule C as self-employment income reported on platform 1099s (platforms collect a W-9). Use a separate account. Set aside about 25-30% for taxes. Form an LLC under CyberSafe SMB later, when the first SMB client arrives. No S-Corp for now.

## Facts / Inferences / Assumptions / Unknowns

### Verified facts

- Case BB-2026-1121-01 opened 2026-11-21 for a 60-day personal bounty pilot; platforms named in intake are HackerOne and Bugcrowd.
- Repository layout and policy taken from jacob-kraniak/cybersecurity-research main at commit 943e18e, including `grok-workspace-instructions.md`, `engagements/Bounties/`, `engagements/Bounties/chime/`, `engagements/VDP/dhs-vdp/`, and `research-logs/2026-05-15-chime-bug-bounty-onboarding.md`.
- JKALI01 inventory captured 2026-11-09 (America/New_York); starter-path tools and the notable-gap list above come from that inventory.
- Usage report of 2026-11-21 (America/New_York): Premium plan; weekly usage limit 100% used and shared with other apps on the plan; reset Sunday, 2026-11-22 at 17:28 America/New_York; about $21 additional credits left; on-demand share and bot shares as quoted above.
- Operator-stated: Premium is $25/month; more than $70 in top-up credits was spent in the week ending 2026-11-22; Super and Ultra comparison prices are $84 and $167 per month.
- HORIZON-PROGRAMS.md collection window: 2026-11-21, 12:43 PM-12:55 PM ET (America/New_York). NEXUS-FIT.md retrieved-at: 2026-11-21, about 1:00-1:07 PM ET (America/New_York). Scope URLs, payout tables, crowding figures, and safe-harbor sentences in the starter table are quoted from those packets.
- Draft pull request https://github.com/jacob-kraniak/cybersecurity-research/pull/4 is open from branch `research/bb-2026-1121-01-bounty-pilot` and is not merged.

### Inferences

- Recent top-up burn is mostly from non-pilot bots, so a tight pilot-tagged cap can still leave room for scoping and drafts.
- Reusing `engagements/Bounties/` and the Chime layout will fit the public repo better than a case-id-only tree.

### Assumptions

- HORIZON and NEXUS public-source packets are sufficient for this proposed pick; live program pages may still change after 2026-11-21, so each scope file must re-read the current rules before any testing.
- The operator will complete the outside-work policy check before Day 0 and will keep employer data out of this repo.
- Ledger dollar amounts will be operator- or bot-estimated tags, not a complete billing export.

### Unknowns

- The UNKNOWN values listed under the starter-programs table, including the employer-vendor confirmation, the AXIS unsigned-ACAP / out-of-scope question, and whether the operator already owns DSM 7 hardware.
- Whether any EV-charging or Wall Connector work is in a currently open program the operator can join. None of the six programs above is an EV-charging program.
- The exact top-up total (only "over $70" is stated) and the monthly additional-usage limit (not shown in the usage report).
- Start date, and the employer's outside-work decision.
- Whether the $100-$500/month target is achievable; that remains unknown on purpose.

## Confidence

0.60 overall. Higher on repo-structure and process (about 0.75). Moderate on the proposed caps (about 0.55). Moderate on the two GO program fits from public HORIZON/NEXUS packets (about 0.65), with remaining UNKNOWNs on AXIS out-of-scope confirmation, hardware, and employer-vendor status. Low on income until the ledger has real rows (about 0.25).

## Decision needed

1. Approve or change the proposed caps and kill criteria ($40/month, $10/week, $15 or 25% per-finding pause, 50% duplicate rule after four submissions).
2. Complete the operator's employer outside-work / outside-business policy check, and confirm that none of the vendors in the starter table supplies the operator's employer, without naming the employer. Set Day 0 only after those gates.
3. Approve or amend this GO / WAIT / NO-GO pick. If approved, authorize a scope file for each GO program (HPE, then AXIS). Confirm the AXIS unsigned-ACAP / out-of-scope question before any Axis work. Confirm DSM 7 hardware ownership before Synology leaves WAIT.
4. Confirm that this work stays on branch `research/bb-2026-1121-01-bounty-pilot` and draft PR #4 only (no push to main, no merge, no direct push to the remote until the operator asks for that later step).
