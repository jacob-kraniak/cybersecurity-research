# JKALI01 Offensive Tooling Inventory (Reusable Contract)

- **Host:** JKALI01 (Kali Rolling)
- **Sources:**
  - PATH catalog capture 2026-11-09 (detailed tables maintained for BRIEF locally; this contract is the campaign-facing summary)
  - Desktop menu tree `/usr/share/applications` cross-check 2026-11-27
- **Companion:** [`TRIAGE-STRATEGY.md`](./TRIAGE-STRATEGY.md) for phase methodology and Build vs operator split
- **Purpose:** Which installed tools support authorized web/API bounty and VDP work — and which stay explicitly out of the starter path.

Daily-use/desktop apps (browsers, KDE `kcm_*`, media, office, Proton/Signal/Steam, file managers, etc.) are ignored here.

---

## Hard rules (starter path)

1. Engagement scope file first — no tool runs against a target until assets, out-of-scope, rate limits, and banned tests are written down.
2. Program rate limits and banned-test rules always win.
3. Guided by default: name the tool and why; operator approves/runs; output comes back for joint reading.
4. No exploit automation. Frameworks and AD/post-ex tooling stay out of the starter path.

---

## Security tooling by role

### Passive OSINT / recon
`theHarvester`, `recon-ng`, `spiderfoot` / `spiderfoot-cli`, `maltego`, `dmitry`

### DNS / subdomain
`amass` (passive first), `dnsrecon`, `dnsenum`, `dnsmap`, `fierce`, plus core clients `dig` / `host` / `whois`

### Live HTTP triage
`httpx` / `httpx-toolkit`, `curl`, `wget`

### Tech / WAF fingerprint
`whatweb`, `wafw00f`, `lbd`

### TLS
`sslscan`, `sslyze`, `ssldump`, `openssl`

### Content discovery / fuzzing
`ffuf` (preferred), `feroxbuster`, `gobuster`, `wfuzz`, `dirb`, `dirbuster`, `skipfish` — always with explicit rate/thread caps when the program allows automated discovery

### Manual proxy
`burpsuite` (primary; Burp MCP when enabled), `mitmproxy` / `mitmweb` / `mitmdump`

### Web vuln scanners (program-gated)
`nuclei` (safe templates only), `nikto`, `wapiti`, `wpscan` (WordPress only)

### Injection aids (program-gated; confirm manually)
`sqlmap`, `commix`

### Visual triage
`eyewitness`, `cutycapt`

### Notes / scoring / research
`faraday`, `searchsploit` / exploit-database (research only), `pipal`, wordlist helpers (`wordlists`, `cewl`, `crunch`, `rsmangler`), `jq`

### Mobile companion surface
`waydroid` — Android runtime for companion-app traffic through Burp when mobile packages are in scope

### Network (only if asset class in scope)
`nmap` / `zenmap`, `masscan` (throttle heavily or avoid), `fping`, `wireshark` / `tcpdump` (traffic review), `netcat` / `socat`

### Forensics / reversing (present; not primary bounty path)
`autopsy`, sleuthkit suite, `bulk_extractor`, `binwalk` / `binwalk3`, `radare2`, `gdb`, `pdfid` / `pdf-parser`, `photorec` / `testdisk`, `hashdeep` — defensive/artifact or explicitly scoped firmware review only; no exploit automation

---

## Map to triage phases

| Phase | Goal | Preferred tools | Build vs operator |
|---|---|---|---|
| **A — Surface mapping** | Enumerate in-scope hosts/endpoints within program caps | Burp (history/sitemap via MCP first), `httpx`, `whatweb`, `wafw00f`, rate-capped `ffuf`/`feroxbuster`/`gobuster`, `amass` passive + `dnsrecon`, `sslscan`/`sslyze` | Build: parse Burp, map endpoints/params/JS, fill gaps under caps. Operator: approve new active mapping. |
| **B — Fingerprint & cluster** | Group surface; flag outliers | Burp Issue Definitions + history, `eyewitness`, `jq`, `lbd` | Build: cluster + ranked leads. Operator: review. |
| **C — Targeted depth** | Manual class-specific checks | Burp Repeater/Intruder, optional `mitmproxy`, `sqlmap`/`commix` only if allowed and hand-confirmed, `waydroid`+Burp for mobile | **Operator runs.** Build prepares templates/diffs only. |
| **Ownership gate** | Confirm wildcard/third-party hosts before any request | `whois`, RDAP helpers, `dig`/`host` | Required before probing ambiguous wildcards. |

---

## Desktop-tree deltas (2026-11-27 vs PATH 2026-11-09)

| Delta | Detail |
|---|---|
| Menu present | `john` (`kali-john`) — older PATH listing lacked main binary; verify PATH before relying on it |
| Menu present | `responder`, `wifite`, `aircrack-ng` — still **NOT** in bounty starter path |
| Campaign-useful | `waydroid` — mobile companion capture |
| Support | `wireshark`, `zenmap`, `sqlitebrowser` — see disabled-by-kali-menu |

### Disabled-by-kali-menu (installed, menu-hidden)

`cherrytree`, `display-im7`, `ettercap`, `guymager`, `hydra-gtk`, `minicom`, `ophcrack`, `sqlitebrowser`, `texdoctk`, `wireshark`, `zenmap`

`wireshark` / `zenmap` remain usable from CLI where packaged that way. `ettercap`, `hydra-gtk`, `ophcrack`, `guymager` stay not-in-path regardless of menu state.

---

## EXPLICITLY NOT in the bounty starter path

Presence on JKALI01 ≠ permission. Do not use for typical web/API bounty work unless a program **explicitly** authorizes the class.

### Exploit frameworks / offensive automation
`metasploit-framework`, `msfvenom`, `msfpc`, `msf-nasm_shell`, `setoolkit`, `gophish`, `powershell-empire`, `starkiller`, live exploit runs via `searchsploit`, `webshells`, `weevely`, `laudanum`, `dbd`/`sbd`

### AD / post-exploitation / lateral
`netexec`, `impacket-*`, `bloodhound-python`, `evil-winrm`, `mimikatz`, `passing-the-hash`, `powersploit`, `responder`, `creddump7`, `chntpw`, `samdump2`, `winpeas`, `linpeas`, `peass`, `unix-privesc-check`, `enum4linux`, `smbmap`/`smbclient` (unless SMB is in-scope and allowed)

### Credential online attacks
`hydra` / `hydra-gtk`, `medusa`, `ncrack`, `patator`, `thc-pptp-bruter`

### Wireless / LAN MitM
`aircrack-ng` suite, `kismet`, `wifite`, `reaver`, `bully`, `pixiewps`, `wash`, `fern-wifi-cracker`, `ettercap`, `dsniff`, `sslsplit`, `arpspoof`, `macchanger`, `spooftooph`, `voiphopper`, `netsniff-ng`, `tcpreplay`

### Password cracking (offline)
`hashcat`, `john`, `ophcrack` / `ophcrack-cli` — offline-only on artifacts already owned; not Day-0 bounty activity

### Tunneling / covert channels (usually banned)
`dns2tcpc`/`dns2tcpd`, `iodine`, `proxytunnel`, `ptunnel`, `udptunnel`, `pwnat`, `miredo`, `sslh`

### Forensics suites (not starter path unless defensive/artifact review)
`autopsy`, sleuthkit, `bulk_extractor`, `guymager`, `magicrescue`, `scalpel`, `scrounge-ntfs`, `sigfind`

### Easy-to-overdrive
`legion`, unthrottled `masscan`, loud `skipfish`, `nuclei`/`nikto` when the program restricts scanners

---

## Starter workflow order (summary)

| Step | Tools |
|---|---|
| 0. Scope | Engagement case + program policy |
| 1. Passive OSINT | `theHarvester`, `recon-ng`, `spiderfoot` |
| 2. Ownership / DNS | `whois`, `dig`, `host` |
| 3. Subdomains | `amass` passive → `dnsrecon`/`dnsenum` if allowed |
| 4. Live HTTP | `httpx` |
| 5. Tech / WAF | `whatweb`, `wafw00f` |
| 6. TLS | `sslscan` / `sslyze` |
| 7. Content discovery | `ffuf` (preferred), `feroxbuster`, `gobuster` with rate caps |
| 8. Visual triage | `eyewitness` |
| 9. Manual testing | `burpsuite` |
| 10. Optional proxy | `mitmproxy` |
| 11. Focused checks | `nuclei` (safe), `nikto`, `wpscan` if allowed |
| 12. Injection aide | `sqlmap` / `commix` only if allowed; confirm manually |
| 13. Port/service | `nmap` polite; avoid loud `masscan` |
| 14. Notes | `jq`, `searchsploit` (research), session logs |

---

## Related

- Phase methodology / Build contract: [`TRIAGE-STRATEGY.md`](./TRIAGE-STRATEGY.md)
- Engagement overlays: `engagements/Bounties/<program>/`, `engagements/VDP/<program>/`
