# 2026-05-05 Microsoft Edge – Plaintext Credential Storage in Process Memory

**Status**: Confirmed (ITW viable on lab PC)  
**Research ID**: EDGE-MEM-2026-001  
**Target**: Microsoft Edge (Chromium-based) Password Manager

## Hypothesis
Edge decrypts and keeps the entire saved password vault in plaintext inside `msedge.exe` process memory for the lifetime of the browser session (CWE-316), unlike Chrome’s on-demand decryption.

## Test Environment
- **OS**: Windows (work-provided lab PC)
- **Browser**: Microsoft Edge (edge://version – please fill in exact version)
- **Tools**: WinDbg 1.2603.20001.0, Sysinternals `strings.exe`
- **Test Credential**: `testuser` / `testpassword` on `https://fill.dev/submit`
- **Method**: Full process memory dump → targeted `s -a` searches

## Reproducer Steps
1. Save test credential in Edge.
2. Launch fresh Edge instance (no navigation required).
3. Create dump via Task Manager or `procdump -ma`.
4. Search: `s -a 0 L?0x7fffffffffff "password_value"` / `"origin"` / `"testpassword"`.

## Key Observations

- Microsoft Edge decrypts **all** saved passwords from the user’s vault and keeps them in **plaintext** inside `msedge.exe` process memory for the entire browser session.
- Credentials are resident even if the associated sites have never been visited in the current session.
- Multiple credential formats appear in private RW memory:
  - JSON-like fragments (`"username":"testuser","password":"..."`)
  - Delimited strings (`testuser&password`, `testuser testpassword`)
  - Repeated username occurrences across heap regions
- Confirmed with controlled test credential (`testuser` / `testpassword` on `https://fill.dev/submit`).
- Contrast with Chrome: Edge’s behavior is significantly more permissive (“by design” per Microsoft).

## Evidence (Redacted Raw Memory Hits)

```text
00002dfc`05f79885  74 65 73 74 75 73 65 72-26 70 61 73 73 77 6f 72  testuser&passwor
00002dfc`1c5ad24c  74 65 73 74 75 73 65 72-22 2c 22 70 61 73 73 77  testuser","passw
00002dfc`0c71f2ce  74 65 73 74 75 73 65 72-20 74 65 73 74 70 61 73  testuser testpas
00002dfc`0c71fece  74 65 73 74 75 73 65 72-20 74 65 73 74 70 61 73  testuser testpas
```
Screenshots:
<img width="2704" height="853" alt="image" src="https://github.com/user-attachments/assets/1511c12e-7b48-4fd3-aef3-9b14bb5acca0" />

## Tools & Commands Used

- WinDbg 1.2603.20001.0 (`s -a` searches for credential patterns)
- Sysinternals `strings.exe`
- Full process memory dump via Task Manager or ProcDump

## Impact

- Any process running under the same user context (or with debug/admin rights) can extract the **entire** password vault in plaintext without triggering Windows Hello or other UI protections.
- Highly relevant in enterprise environments, shared workstations, EDR bypass scenarios, and red-team / insider threat operations.
- **CVSS v4.0 (provisional)**: Medium–High  
  `AV:L/AC:L/PR:N/UI:N/C:H`

## Recommendations

- Use the built-in password manager sparingly or clear the vault on browser close.
- Enterprise policy: Consider disabling Edge Password Manager or standardizing on Chrome (on-demand decryption) where feasible.
- Threat hunting: Monitor for memory-scraping techniques targeting browser processes.
- For researchers: Always use throwaway/test credentials and authorized lab systems only.

## Environment

 - Browser: Microsoft Edge 147.0.3912.98 (Official build) (64-bit) – latest as of 2026-05-05
 - OS: Windows (work-provided lab PC)
 - Research ID: EDGE-MEM-2026-001
 - Date: 2026-05-05
 - Researcher: Jacob Kraniak
