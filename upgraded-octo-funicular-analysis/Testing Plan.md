# OnTime Carpool App Malware Analysis: Testing Plan Document.md

**Prepared for: Jacob Kraniak**  
**Role: Cybersecurity Engineer, Enterprise Environment**  
**Date: October 08, 2025**  
**App Details: OnTime Carpool by MobileWare Inc. (v1.0.3+ APK from APKPure)**  
**Objective:** Perform comprehensive static and dynamic malware analysis to detect data collection, malicious endpoints, or actions against user interests. Leverage Kali Linux (primary) and Windows 10 (secondary) setups. Total estimated time: 8-15 hours.  

This document consolidates the structured plan from our prior discussion. Follow sequentially, documenting notes/screenshots in a shared folder (e.g., OneDrive or Git repo). Use checklists for tracking. Escalate high-risk findings (e.g., unauthorized installs) immediately.

## Prerequisites
- **Hardware/Software:** Kali Linux PC (rooted Android emulator via Android Studio/Genymotion), Windows 10 PC (for GUI tools like JD-GUI).
- **APK Acquisition:** Download from APKPure; verify SHA256 hash: `[Insert hash here after verification]`.
- **Environment Setup:**
  - Install Android SDK/NDK on Kali: `sudo apt update && sudo apt install android-sdk android-sdk-platform-tools`.
  - Root emulator with Magisk/SuperSU.
  - Install core tools: `sudo apt install apktool jadx mobsf clamav wireshark burpsuite frida drozer`.
  - Python deps: `pip install androguard objection`.
- **Safety:** Isolate in VM; never install on personal device. Use VPN for host traffic.

## Step 1: Preparation and Recon (1-2 hours)
Goal: Baseline APK integrity and metadata. Flag immediate red flags like excessive permissions.

| Task | Action | Tools/Commands | Notes/Output |
|------|--------|----------------|-------------|
| 1.1 Obtain/Verify APK | Download APK; compute hash. | `sha256sum app.apk` (Kali) | Hash: [ ] Verified? Y/N |
| 1.2 Initial Malware Scan | Scan for signatures. | ClamAV: `freshclam; clamscan app.apk`<br>VirusTotal: Upload online | Results: [ ] Clean/Flagged? |
| 1.3 Extract Manifest | Inspect permissions/intents. | APKTool: `apktool d app.apk -o output_dir`<br>Grep: `grep -r "permission" output_dir/AndroidManifest.xml` | Permissions reviewed (see attached analysis). Unexpected: REQUEST_INSTALL_PACKAGES. |
| 1.4 Setup Emulator | Create rooted AVD; test ADB. | Android Studio (Kali/Windows); `adb devices` | Emulator ID: [ ] Root confirmed? Y/N |

**Checkpoint:** If scans flag malware, halt and report. Proceed if clean.

## Step 2: Static Analysis (2-4 hours)
Goal: Decompile and inspect code/resources for suspicious patterns (e.g., hardcoded keys, trackers).

| Task | Action | Tools/Commands | Notes/Output |
|------|--------|----------------|-------------|
| 2.1 Disassemble APK | Decode to Smali/resources. | APKTool: `apktool d app.apk -o static_dir` | Dir: [ ] Size/Files: [ ] |
| 2.2 Decompile to Java | Convert for readability. | Jadx: `jadx app.apk -d decompiled/` (Kali) or jadx-gui (Windows) | Open in browser/IDE; search for "http", "firebase", "key=". |
| 2.3 Automated Scan | Run vuln/permission analysis. | MobSF: `mobsf` → Upload APK | Report: Permissions score [ ]<br>Trackers: [ ]<br>URLs/Keys: [List here] |
| 2.4 Custom Queries | Script for strings/permissions. | AndroGuard: `androlyze.py -s app.apk` → Query e.g., `a.get_permissions()` | Suspicious strings: [e.g., tracker.example.com] |
| 2.5 Native Check | Scan JNI/ELF libs if present. | `file static_dir/lib/*` → Use Ghidra if needed | Obfuscation? Y/N; Payloads: [ ] |

**Pro Tip (from your 10+ years IT exp):** Prioritize `REQUEST_INSTALL_PACKAGES`—grep for `PackageInstaller` or `ACTION_INSTALL_PACKAGE` in decompiled code. Cross-ref with CompTIA Net+ knowledge for network-impacting perms like INTERNET + BACKGROUND_LOCATION.

**Checkpoint:** Document code snippets/screenshots. If API keys exposed, flag as high-risk.

## Step 3: Dynamic Analysis (3-6 hours)
Goal: Observe runtime behavior in controlled environment. Hook processes for data flows.

| Task | Action | Tools/Commands | Notes/Output |
|------|--------|----------------|-------------|
| 3.1 Install & Launch | Sideload APK; monitor logs. | ADB: `adb install app.apk`<br>`adb logcat | grep com.mobileware.ontime` | Package: com.mobileware.ontime [ ] Logs: [Initial errors?] |
| 3.2 Hook Methods | Intercept API calls/data exfil. | Frida: `frida -U -f com.mobileware.ontime -l hook.js --no-pause`<br>Script: Trace OkHttp/Retrofit for POSTs. | Hooked methods: [e.g., sendLocation()]<br>Data leaks: [PII types] |
| 3.3 App Exploration | Runtime inspection. | Objection: `objection -g com.mobileware.ontime explore` → `android hooking watch class_method` | Exported components: [ ]<br>Background services: [ ] |
| 3.4 Security Assessment | Test for vulns like exported activities. | Drozer: `drozer console connect` → `run app.activity.info -a com.mobileware.ontime` | Vulns: [e.g., insecure intents] |
| 3.5 Simulate Interactions | Trigger perms (e.g., location share, login). | Manual in emulator; monitor with ADB logs. | Behaviors: [e.g., vibrate on boot?]<br>Persistence: [ ] |

**Pro Tip:** With your Server+ cert, focus on service persistence (RECEIVE_BOOT_COMPLETED)—use `ps aux | grep ontime` to check post-reboot.

**Checkpoint:** Record videos of interactions if anomalies (e.g., unsolicited installs). Wipe emulator after.

## Step 4: Network and Endpoint Analysis (1-2 hours)
Goal: Capture/inspect traffic for malicious C2 or leaks.

| Task | Action | Tools/Commands | Notes/Output |
|------|--------|----------------|-------------|
| 4.1 Setup Proxy | Route emulator traffic. | mitmproxy: `mitmproxy --mode transparent`<br>Emulator proxy: 127.0.0.1:8080 | Proxy active? Y/N |
| 4.2 Packet Capture | Sniff during app use. | tcpdump: `tcpdump -i any -w capture.pcap` (Kali)<br>Or Wireshark (both) on lo interface. | Filter: http/dns; Domains: [List resolved] |
| 4.3 Traffic Inspection | Decrypt/analyze flows. | Burp Suite: Intercept requests; Repeater for fuzzing. | Endpoints: [e.g., api.ontime.com?]<br>Unencrypted? Y/N; PII in payloads: [ ] |
| 4.4 Endpoint Validation | Check domains for malice. | Manual: VirusTotal on URLs/IPs from capture. | IOCs: [Suspicious IPs/domains] |

**Pro Tip:** Bypass SSL pinning with Frida script if needed—aligns with your enterprise proxy experience.

**Checkpoint:** Export PCAPs; blacklist benign domains (e.g., googleapis.com).

## Step 5: Synthesis and Reporting (1 hour)
Goal: Correlate findings; generate risk assessment.

| Task | Action | Tools/Commands | Notes/Output |
|------|--------|----------------|-------------|
| 5.1 Correlate Data | Link static/dynamic (e.g., string → traffic). | Manual review; MobSF report export. | Cross-refs: [e.g., AD_ID → ad endpoint] |
| 5.2 Risk Scoring | Low/Med/High per finding (impact: privacy/code exec). | Template: Use Findings Report below. | Overall score: [ ] |
| 5.3 Document IOCs | List hashes, URLs, etc. | Markdown/Word export. | IOCs: [Table/list] |
| 5.4 Cleanup | Wipe emulator; revoke installs. | `adb uninstall com.mobileware.ontime` | Confirmed? Y/N |

**Final Notes:** If findings warrant, share anonymized IOCs via MalwareBazaar. Re-run if app updates. Contact me in chat for script tweaks.
