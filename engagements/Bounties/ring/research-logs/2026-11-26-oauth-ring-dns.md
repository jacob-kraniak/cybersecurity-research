# oauth.ring.com — passive DNS

- **When:** 2026-11-26 19:28:07 EST
- **Host:** JKALI01
- **Resolver:** 10.0.0.1#53
- **Command:** `dig +nocmd oauth.ring.com A oauth.ring.com AAAA oauth.ring.com CNAME`
- **Scope row:** `https://oauth.ring.com/*` (explicit; not a wildcard)

## Evidence

- `NOERROR` for A, AAAA, and CNAME.
- `oauth.ring.com` is a CNAME to `oauth.ring.com.cdn.cloudflare.net`.
- A answers for that target: `104.19.247.116`, `104.19.248.116` (TTL about 182–185s on this lookup).
- AAAA answer is the CNAME only. Authority is the `cloudflare.net` SOA (`ns1.cloudflare.net`). No IPv6 address was returned.
- CNAME TTL on this lookup was 44s.
- The CNAME answer had the `aa` flag. The A answer did not. Both came from `10.0.0.1`.

## Inference

- The edge in front of this hostname is Cloudflare. The CNAME suffix `cdn.cloudflare.net` is Cloudflare's customer target. The A records belong to that name.
- No published AAAA means this resolver got no IPv6 address. That is not a vulnerability.
- The mixed `aa` flag is resolver behavior on the LAN DNS path. It is not a property of the Ring application.

## Not a finding

- Shared Cloudflare addresses are not targets. Do not scan `104.19.247.116` or `104.19.248.116`.
- Requests go to the hostname `oauth.ring.com`. Direct attacks on Cloudflare, or on other third-party infrastructure, are out of scope.
- Missing IPv6, short TTLs, and DNS flags are noise.
