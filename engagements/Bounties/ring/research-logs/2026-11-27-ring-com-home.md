# ring.com — first proxied page load

- **When:** Burp timestamps `1795749235386` through `1795749238589` (about 6 minutes after the oauth metadata check)
- **Tool:** Proxy
- **Scope row:** `https://ring.com/*`
- **Source:** Logger summary pasted by the operator. Full bodies were not copied into the repo.

## Evidence

- `GET https://ring.com/` → `200`, HTML, title `Home Security Systems - Cameras, Alarms, Doorbells | Ring`, length `477763`. Address `44.215.133.67`.
- No other host appears in the pasted rows. Follow-on requests stayed on `ring.com`.
- `POST /ec-api/cart` → `200` JSON, length `660`. Burp listed 12 parameter names: `rsas`, `rw_mp`, `rw_country`, `rs_geo`, `rw_locale`, `_a_id`, `privacy-banner`, `rwa_session_id`, `rwa_anonymous_id`, `rwa_country`, `campaign`, `session`.
- `POST /ec-api/estimated-delivery` → `200` JSON, length `484`. Same name list without `session`.
- `GET /partials/en-US/global-nav` → `200` JSON, length `62527`.
- `GET /partials/consent/en-US/strings.json?callback=ringconsent_0` → `200`, Burp MIME `script`, length `7773`.
- Response headers pasted for that request, dated `Fri, 27 Nov 2026 03:13:57 GMT`: `Content-Type: text/javascript; charset=utf-8`, `Server: Server`, `X-Request-Id: hkq7tw9tnimtmx64mbaxxl`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`. CSP paste starts `default-src 'self'; script-src 'self' 'unsafe-inline' https://*.ring.com/ https://*.a2z.com/` and may be cut off. Body not pasted.

## Inference

- The homepage is the Ring marketing site and it answered on the explicit scope host.
- `44.215.133.67` is not the Cloudflare edge used by `oauth.ring.com`. Direct attacks on AWS infrastructure are out of scope, so this address is not a target.
- The repeated names on the two POSTs match cookie names. The POST bodies were not in the paste.
- The consent prefix calls the callback name only when that function already exists. The `/**/` prefix is a fixed wrapper, not an error leak.
- A second request echoed `ringconsent_2` in both the `typeof` check and the call. `callback` is written into the script. The object is the same public copy as `ringconsent_0`. Closed as noise: no user data, `text/javascript` plus `nosniff`, and no document context. Do not send punctuation or other callback values.

## Not a finding

- Homepage 200, nav JSON, consent strings, cart and delivery JSON from an anonymous page load.
- The consent response includes HSTS, `X-Frame-Options`, `nosniff`, and a CSP. Missing security headers, clickjacking, banner disclosure, HSTS, and mixed-content scripting are non-qualifying. `Server: Server` is a generic banner.
- Consent body reviewed. Prefix is `/**/ typeof ringconsent_0 === 'function' && ringconsent_0({...})`. The object is cookie-banner copy, category labels, and public third-party names (Heap, Optimizely, Amazon Display Ads, Kenshoo, Sizmek, Kustomer). It also names `https://d39xvdj9d5ntm1.cloudfront.net/common/` as a CSS base. No user data, session, or token.
- CSP allow-lists Stripe, Optimizely, Zoom, YouTube, Mapbox, Amazon/AWS, CloudFront, and other third parties, and it contains `http://` sources. Those hosts are not Ring targets. Theoretical takeover of the CloudFront name is non-qualifying. Do not build a CSP bypass around the nonce or `'unsafe-inline'`.
- Do not scan `44.215.133.67`. Do not add path guesses under `/ec-api/`.
