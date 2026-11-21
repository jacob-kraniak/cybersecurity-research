# Pilot ledger

Companion to `ledger.csv` for BB-2026-1121-01. Overall Grok Bot usage tracking belongs to dr eggbot. This ledger only tags spend and time for this pilot.

## How to fill a row

Use one row per activity block (a scoping pass, a recon summary, a CVE-match session, a hunting block, a report draft, or other). Estimates are fine; this is not a billing export.

| Column | What to enter |
|---|---|
| date | Activity date, `YYYY-MM-DD`, America/New_York |
| case_id | `BB-2026-1121-01` |
| program | Public program name, or `PENDING` until a program is approved. No target hostnames or asset lists. |
| platform | `HackerOne`, `Bugcrowd`, or another named platform |
| activity | One of: `scoping`, `recon-summary`, `cve-match`, `hunting`, `report-draft`, `other` |
| bot | Bot that did the tagged work (BRIEF, HORIZON, NEXUS, QUILL, or `none` if operator-only) |
| est_usage_usd | Estimated Grok Bot usage for this row, in USD. Do not paste billing tokens or raw usage receipts. |
| hours_jacob | Operator hands-on hours for the same block |
| finding_ref | Stable local id (for example `F-001`) once a finding exists; otherwise leave blank |
| severity | Program severity if known (`P1`–`P5`, or critical/high/medium/low/info); otherwise blank |
| status | One of: `none`, `draft`, `submitted`, `triaged`, `duplicate`, `informative`, `na`, `resolved`, `paid` |
| payout_usd | Amount paid, or `0.00` until paid. Never invent a bounty. |
| notes | Short context. No secrets, session tokens, cookies, credentials, raw captures, or in-scope URLs. |

The header row is live. The first data line is a commented `EXAMPLE` only; delete or replace it before the first real entry.

## Usage per finding

Sum `est_usage_usd` for all rows that share the same `finding_ref`:

```text
usage_per_finding(F) = sum(est_usage_usd where finding_ref = F)
```

Rows with a blank `finding_ref` are overhead (program pick, scoping, general recon). Keep them. They count toward the pilot cap but not toward any one finding.

## Net

For a date range (week, month, or the full 60 days):

```text
gross_payouts = sum(payout_usd where status = paid)
tagged_spend  = sum(est_usage_usd)
net           = gross_payouts - tagged_spend
```

Compare `net` and `usage_per_finding` to the caps and kill criteria in `PILOT-PLAN.md`. Those numbers are proposals until the operator approves them.

## What never goes in this file

Secrets, API tokens, cookies, credentials, unredacted logs, target URLs, asset lists, or employer data.
