# Findings log — BB-2026-1126-01

Draft notes only. Nothing in this file is a HackerOne submission.
Pre-disclosure detail, tokens, cookies, and raw captures stay off public `main`.

| ID | Date | Asset | In scope? | Class | Status | Note |
|----|------|-------|-----------|-------|--------|------|
| N-01 | 2026-11-27 | `ring.com` `/partials/consent/en-US/strings.json` | yes | JSONP callback | noise | `callback` is echoed into `typeof <name> === 'function' && <name>(...)`. Body is public consent copy. |

Status values: `idea`, `needs-repro`, `noise`, `out-of-scope`, `draft`, `held`.

## Entries

### N-01 — consent JSONP callback

`callback` is copied into the function name. The argument is the public cookie-banner object. `Content-Type` is `text/javascript` and `nosniff` is set. No account data is present. Not a report. No further callback values.
