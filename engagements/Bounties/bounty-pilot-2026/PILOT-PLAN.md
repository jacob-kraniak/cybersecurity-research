# BB-2026-1121-01 - 60-day bug bounty pilot plan

CASE-ID: BB-2026-1121-01
ROLE: BRIEF
PROGRAM: pending shortlist
PLATFORM: HackerOne, Bugcrowd
BRIEF retrieved-at: 2026-11-21 (America/New_York)
STATUS: PROPOSAL, awaiting operator approval
HUMAN-REPRODUCED?: no
SUBMIT?: no
GO/NO-GO/WAIT: WAIT
STAFFED: BRIEF (lead); HORIZON (candidate programs, pending); NEXUS (product/CVE fit, pending); QUILL (not staffed)
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

No tool runs against a target, and no program is treated as in play, until this gate is complete and a per-program scope file exists (see Roles).

## Program selection criteria

Prefer:

- Newer, private, or less crowded programs on HackerOne or Bugcrowd.
- Network gear, firmware, and security tooling.
- Areas that fit the operator's existing strengths, including EV charging (OCPP, ISO 15118) and the operator's own Tesla Wall Connector, when a program actually covers that work.

Avoid:

- Crowded web apps, launch-day squats, and spraying many programs at once.
- Anything in the exclusion list above.

Stay strictly within each program's published scope and rules, including safe harbor, rate limits, and banned test types. Do not invent programs, payout ranges, or scope. Tesla's program, Chime, and any other named program stay off the shortlist until HORIZON and NEXUS document them.

When a program is approved, add `engagements/Bounties/<program>/` using the `chime/` layout. Do not add those folders in this proposal. Onboarding logs follow [research-logs/2026-05-15-chime-bug-bounty-onboarding.md](../../../research-logs/2026-05-15-chime-bug-bounty-onboarding.md).

## Starter programs (PENDING: HORIZON-PROGRAMS.md + NEXUS-FIT.md)

HORIZON-PROGRAMS.md and NEXUS-FIT.md are not in the case folder yet. The table is a placeholder. Do not treat blank cells as a pick, a payout, or a scope statement.

| Program | Platform | Fit | Noise | Safe-harbor | Timebox | GO/NO-GO | Why |
|---|---|---|---|---|---|---|---|
| PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | WAIT | Waiting on HORIZON-PROGRAMS.md and NEXUS-FIT.md. No program invented here. |
| PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | WAIT | Second seat reserved for the shortlist (target: two or three programs). |
| PENDING | PENDING | PENDING | PENDING | PENDING | PENDING | WAIT | Third seat reserved; leave unused if only two programs qualify. |

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
| Week 1 (Day 0-7) | Outside-work policy check; review HORIZON and NEXUS inputs; pick two or three programs; write a scope file and a Chime-style onboarding log for each; no testing until those exist. |
| Weeks 2-7 (Day 8-49) | Hunting inside the agreed timeboxes. Bots limited to scoping, recon summaries, CVE/version matching, and report drafts. Operator does the hands-on work. |
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

### Inferences

- Recent top-up burn is mostly from non-pilot bots, so a tight pilot-tagged cap can still leave room for scoping and drafts.
- Reusing `engagements/Bounties/` and the Chime layout will fit the public repo better than a case-id-only tree.

### Assumptions

- HORIZON and NEXUS will deliver public-source program and fit notes before any target is touched.
- The operator will complete the outside-work policy check before Day 0 and will keep employer data out of this repo.
- Ledger dollar amounts will be operator- or bot-estimated tags, not a complete billing export.

### Unknowns

- Which programs, payout tables, crowding, and safe-harbor terms HORIZON and NEXUS will report, and on what retrieve dates.
- Whether any EV-charging or Wall Connector work is in a currently open program the operator can join.
- The exact top-up total (only "over $70" is stated) and the monthly additional-usage limit (not shown in the usage report).
- Start date, and the employer's outside-work decision.
- Whether the $100-$500/month target is achievable; that remains unknown on purpose.

## Confidence

0.52 overall. Higher on repo-structure and process (about 0.75). Moderate on the proposed caps, because they are grounded in a one-day usage report plus operator-stated top-ups, not a full billing month (about 0.55). Low on income and program fit until HORIZON-PROGRAMS.md and NEXUS-FIT.md exist and the ledger has real rows (about 0.25).

## Decision needed

1. Approve or change the proposed caps and kill criteria ($40/month, $10/week, $15 or 25% per-finding pause, 50% duplicate rule after four submissions).
2. Complete the operator's employer outside-work / outside-business policy check, and confirm Day 0 only after that.
3. After HORIZON and NEXUS deliver, pick two or three starter programs and authorize a scope file for each.
4. Confirm that this work ships only as branch `research/bb-2026-1121-01-bounty-pilot` plus a draft PR (no push to main, no merge, no direct push to the remote until the operator asks for that later step).
