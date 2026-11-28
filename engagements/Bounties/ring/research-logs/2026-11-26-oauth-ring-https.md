# oauth.ring.com — first HTTPS request

- **When:** HTTP date `Fri, 27 Nov 2026 00:30:52 GMT` (2026-11-26 19:30 EST)
- **Host:** JKALI01
- **Request:** `GET /` with `User-Agent: RingResearcher_jacob-kraniak`, `--max-redirs 0`
- **Scope row:** `https://oauth.ring.com/*`

## Evidence

- Resolved to `104.19.247.116` (IPv6 none). Connected to port 443.
- Certificate verified (`OpenSSL verify result: 0`).
- Subject `CN=oauth.ring.com`. SAN matched `oauth.ring.com`.
- Validity: `Sep 3 00:00:00 2026 GMT` through `Mar 19 23:59:59 2027 GMT`.
- Issuer: `C=US; O=Amazon; CN=Amazon RSA 2048 M01`.
- Negotiated `TLSv1.2 / ECDHE-RSA-CHACHA20-POLY1305`. ALPN accepted `h2`.
- Response: `HTTP/2 404`, `content-type: text/plain; charset=utf-8`, `content-length: 18`.
- `server: cloudflare`, `cf-cache-status: DYNAMIC`, `cf-ray: a60d06dc0b267a38-EWR`.
- No `Location` and no `Set-Cookie` on this response.
- Body of `GET /` is the 18-byte string `404 page not found` (no trailing newline).

## OIDC discovery

- **When:** `Fri, 27 Nov 2026 00:34:28 GMT`
- **Request:** `GET /.well-known/openid-configuration` with the same User-Agent
- **Response:** `HTTP/2 404`, `text/plain; charset=utf-8`, `content-length: 18`, `cf-cache-status: DYNAMIC`, `cf-ray: a60d0c21e977efa9-EWR`
- Body file `/tmp/ring-oauth-oidc.body` was not pasted. Same status, type, and length as `GET /`.

## Inference

- The hostname is the in-scope OAuth host: name matches the certificate, and Cloudflare is the HTTP edge (`cf-ray`, `server`).
- `Amazon RSA 2048 M01` is an Amazon Trust Services intermediate. That identifies the issuing CA. It does not change the DNS result that the edge is Cloudflare.
- `cf-cache-status: DYNAMIC` plus a tiny plaintext body is consistent with an origin-generated 404 passed through the edge. `/` is not a document on this host.
- `404 page not found` is the text Go's `NotFound` uses. Stock Go adds a newline (19 bytes). This body is 18 bytes, so the framework is not confirmed. A version banner would be out of scope anyway.
- OpenID Connect discovery is not published at the standard path. The identical 404 shape means this lookup hit the same empty handler, not a metadata document.
- TLS 1.2 was selected. Cipher and protocol choice are not bounty material on this program.

## Authorization-server metadata

- **When:** `Fri, 27 Nov 2026 03:07:47 GMT`
- **Source:** Burp Logger export `/home/jacob/testresult.csv` row 8. Raw export stays outside the repo.
- **Tool:** Proxy. `User-Agent: RingResearcher_jacob-kraniak`
- **Request:** `GET /.well-known/oauth-authorization-server` via HTTP/1.1. Response HTTP/2.
- **Edge:** `104.19.248.116`
- **Response:** `404 Not Found`, `text/plain; charset=utf-8`, `Content-Length: 18`, body `404 page not found`, `Cf-Cache-Status: DYNAMIC`, `Cf-Ray: a60decb65c565e4b-EWR`
- Row 9 is the browser's automatic `GET /favicon.ico`. Same 18-byte body. `Cf-Cache-Status: HIT`, `Cache-Control: public, max-age=14400`, `Age: 235`.

## Not a finding

- Root 404, both discovery 404s, favicon 404, Cloudflare headers, certificate brand, and TLS version.
- A cached missing favicon is CDN behavior. It is not a cache-deception issue.
- Do not probe the Cloudflare addresses.
- No further path guessing on `oauth.ring.com`. The client flow has to reveal real routes.
