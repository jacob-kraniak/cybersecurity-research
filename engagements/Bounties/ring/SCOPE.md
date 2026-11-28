# Ring & BlinkForHome — Scope & Rules of Engagement

- **Case ID:** BB-2026-1126-01
- **Source:** [HackerOne — Ring](https://hackerone.com/ring)
- **Retrieved:** 2026-11-26 (ET) (Policy updated 2025-11-25; Rewards updated 2025-11-11)
- **Program Type:** Paid Bug Bounty (Closed Scope, 0.0 Signal requirement, Fast Payment)

## Reward Guidelines (Maximums, CVSS v3.0)

| Target Category | Low | Medium | High | Critical |
|---|---|---|---|---|
| Services, Apps, Mobile | $200 | $600 | $2,000-$6,000 | $12,000-$25,000 |
| Devices | $500 | $3,000-$4,000 | $6,000-$8,000 | $20,000-$30,000 |

## In-Scope Assets

### Web & API Domains / Wildcards
- `https://ring.com/*`
- `https://api.ring.com/*`
- `https://fw.ring.com/*`
- `https://app.ring.com/*`
- `https://admin.ring.com/*`
- `https://nw.ring.com/*`
- `https://oauth.ring.com/*`
- `https://billing.ring.com/*`
- `prd-ring-web-us.prd.rings.solutions`
- `publicsafety.ring.com`
- `https://*.blinkforhome.com/*` (verify WHOIS ownership before testing subdomains)
- `https://*.immedia-semi.com/*` (verify WHOIS ownership before testing subdomains)

### Mobile Applications
- **Blink Home Monitor:** Android `com.immediasemi.android.blink` | iOS `1013961111`
- **Neighbors by Ring:** Android `com.ring.neighborhoods` | iOS `1218902777`
- **Ring - Always Home:** Android `com.ringapp` | iOS `926252661`

### Hardware Devices (Latest Firmware Required)
Old firmware versions are out of scope. SoC vendor-specific bugs require demonstrated impact on Ring/Blink products.

1. Ring Video Doorbell (2nd Gen, 3 & 3 Plus) — ASINs: `B0849J7W5X`, `B08N5NQ869`, `B07WLP395R`
2. Ring Peephole Cam — ASIN: `B07WHMQNPC`
3. Ring Indoor Cam — ASIN: `B07Q9VBYV8`
4. Ring Stickup Cam (Gen 3) — ASIN: `B07Q3T177V`
5. Ring Chime (Gen 2 & 2 Pro) — ASINs: `B07WML2XTD`, `B07WML1QM4`
6. Ring Alarm (Gen 2) — ASIN: `B07ZPMCW64`
7. Ring Smart Lighting Bridge (Gen 1)
8. Blink Outdoor — ASIN: `B086DKMSSM`
9. Blink Indoor — ASIN: `B086DL32QX`
10. Blink Sync Module 2 — ASIN: `B084RQ6MHJ`
11. Blink Mini — ASIN: `B07X27VK3D`
12. Blink Video Doorbell — ASIN: `B08SG2MS3V` (listed in HackerOne scope CSV)

## Mandatory Rules of Engagement

- **Test Accounts:** Register with `jacob-kraniak@wearehackerone.com` (HackerOne user [jacob-kraniak](https://hackerone.com/jacob-kraniak)). Test only accounts you own.
- **Required User-Agent:** `RingResearcher_jacob-kraniak` on all traffic (omitting it during scanning risks automated IP/account blocks).
- **Rate Limit & Scanners:** Limited automated tools allowed ONLY with the required User-Agent and capped at **<= 5 requests/second** per service.
- **No 3rd-Party OOB Infrastructure:** Blind XSS / OOB testing must use self-hosted domains you control. Using third-party services (e.g., hosted XSS Hunter, public OOB servers) **forfeits all rewards**.
- **Prohibited Targets & Actions:** Direct attacks on AWS infrastructure, third-party hosted services, employee-facing communication assets (including automated support chats), physical/social engineering, brute-force/DoS, and post-exploitation.
- **Customer Data:** If accidental access occurs, stop immediately, report what was accessed, and provide written confirmation of secure deletion.
- **Disclosure:** Report first via HackerOne; no public or third-party disclosure without consent.
- **Bypass Reports:** Populate Custom Field `Bypass Reference` with the original report ID.

## Out-of-Scope / Non-Qualifying Highlights

- HackerOne Core Ineligible Findings; anything not explicitly listed in scope.
- Web/service exclusions: stack traces/error messages, theoretical subdomain takeovers, banner/version disclosure, `robots.txt`, clickjacking, anonymous/logout CSRF, `autocomplete`, missing `Secure`/`HttpOnly` on non-sensitive cookies, weak CAPTCHA, forgot-password brute force/lockout, `OPTIONS`, reflected file downloads, missing cache-control/security headers, SSL/TLS best-practice issues, missing rate limiting (honeypots present on login), content spoofing, HSTS/PKP, SPF/DKIM/DMARC, mixed-content scripting, Self-XSS, outdated browsers.
- Mobile exclusions: clipboard/pasteboard leakage, missing cert pinning, TLS-protected sensitive params, lack of obfuscation/anti-debugging/root-detection/PIE/ARC/canaries, malformed Intent/URL crashes without data leak, private-dir storage, unencrypted local data, `logcat` without malicious-app PoC, data backups.
- OpSec reports (leaked employee creds/docs): reputation points only, no bounty.

## Safe Harbor Summary

Amazon commits not to bring legal action for good-faith compliance (including DMCA anti-circumvention claims), considers compliant research authorized under the CFAA, and waives conflicting ToS/AUP restrictions for in-scope assets. Third-party products/services are not covered.
