# Request identity

Confirmed 2026-11-26 from https://hackerone.com/jacob-kraniak.

- User-Agent: `RingResearcher_jacob-kraniak`
- Test account email: `jacob-kraniak@wearehackerone.com`
- Rate cap: `<= 5` requests/second per service. CLI tools stay at `2` req/s until raised on purpose.
- Applies to every client that sends a request: browser proxy, `curl`, `httpx`, `ffuf`, and anything else.

DNS-only checks (`dig`, `whois`, RDAP) do not send this header. Put it on the first HTTP client before that client is used.

## Burp match-and-replace

- Type: Request header
- Match: `^User-Agent:.*`
- Replace: `User-Agent: RingResearcher_jacob-kraniak`
- Check Logger before any in-scope host is enabled.

A missing or different User-Agent breaks program rules and can get the source address or the test account blocked.
