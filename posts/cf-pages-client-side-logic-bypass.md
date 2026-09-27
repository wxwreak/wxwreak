---
title: "Headless E-Shop Client-Side Logic Bypass & Missing Security Headers"
date: "2026-09-27"
description: "Vulnerability write-up uncovering a critical fail-open authentication bypass, administrative module theft, and a security header infrastructure audit via Webrr."
---

# Vulnerability Write-up: Headless E-Shop Client-Side Logic Bypass & Missing Security Headers

## 📌 Executive Summary
During an authorized white-box and black-box security assessment of a custom-developed headless gaming e-shop, multiple critical vulnerabilities were discovered. The application, built statically on top of the **Tebex Headless API** and deployed via **Cloudflare Pages**, suffers from an insecure "Fail-Open" architecture and client-side trust issues. 

By utilizing advanced intercepting proxies, collaborative static code analysis, and automated header audits via my proprietary tool, I managed to achieve a complete **Authentication Bypass**, force-unlock hidden **Administrative Modules (Master Menu)**, and uncover a severe lack of baseline server-side defense hardening headers.

---

## 🛠️ Methodology & Tooling
To conduct this research and piece together the flawed execution flows, a blended stack of manual analysis and automated auditing was used:
* **Burp Suite (Community Edition):** Used to capture, analyze, and attempt replay attacks on the OAuth/SSO synchronization flow (`forum.cfx.re`) and inspect dynamic outbound API requests.
* **Gemini AI Collaboration:** Utilized as an advanced static code analysis assistant to quickly review compiled JavaScript components (`app.js` and `tebex.js`), trace variable scopes, and map out client-side state machine conditions.
* **Webrr Security Scanner:** My proprietary open-source command-line utility written in Go, specifically designed to map web server configurations, detect firewalls, and audit security headers. (Source code available on [GitHub](https://github.com/wxwreak/webrr)).

---

## 🚨 Technical Findings

### 1. Authentication Bypass via Fail-Open API Logic
* **Classification:** CWE-636: Not Handling Errors Correctly (Fail Open) / CWE-287: Broken Authentication
* **Severity:** High (UI Spoofing & Session Hijacking)

When a username is submitted into the authentication prompt, the static frontend framework dispatches an asynchronous request to a local router endpoint (`POST /api/cfx/user`). Because the target environment relies on pure static hosting without dynamic serverless routines enabled, the server inherently drops the query and yields an **HTTP 404 Not Found** status code.

The vulnerability resides in the application's error catching abstraction layer. When the network exception occurs, the `catch` block fires a superficial visual error notification to the visitor, but **fails to halt execution or drop the runtime sequence**. 

The subroutine blindly keeps processing code down the pipeline, triggers a client-side layout synchronization event, and applies a prominent green verification seal (`OVERENY UCET`) onto the user layout. This allows an attacker to gain a spoofed authenticated context utilizing completely arbitrary or randomized text strings.

#### Vulnerable Code Pattern (`app.js`):
```javascript
async function submitKeymasterLogin() {
  const val = inp ? inp.value.trim() : "";
  try {
    const userObj = await TebexAPI.loginWithUsername(val); // Inherent 404 Failure
    closeKeymasterLoginModal();
    await checkUserStatus(); // CRITICAL: Fires regardless of backend response validation!
    showToast(`Welcome back, ${userObj.username}! Account linked.`, "success");
  } catch (err) {
    showToast(err.message, "error"); // Catches error but misses explicit return/termination block
  }
}
```

#### Remediation:
```javascript
  } catch (err) {
    showToast(err.message, "error");
    clearActiveSession(); 
    return; // Hard stop downstream execution flows
  }
```

---

### 2. Client-Side Authorization Bypass (Administrative Module Theft)
* **Classification:** CWE-420: Unprotected Functionality Button / Client-Side State Tampering
* **Severity:** Medium

The production JavaScript distribution bundle ships the complete blueprint for the administrative management subsystem directly to unauthenticated clients. Isolating and executing the core global rendering function `openMasterQuickModal()` directly inside the browser's Developer Tools Console (`F12`) forces the hidden administrative interface to render over the viewport instantly.

Furthermore, the data synchronization routines embedded inside this module implement an insecure **"Optimistic UI Update"** combined with bad error containment:
1. The script writes unvalidated user adjustments (such as changing showcase media or script developers) into `localStorage` immediately upon form submission.
2. The UI layout triggers a redraw sequence (`renderProducts()`) to present the modifications as active.
3. Only then does the engine fire an outbound network call to transmit the data.
4. When the API inevitably drops the request with a **404 Not Found**, the exception block captures the failure but fails to roll back the local storage payload, while falsely displaying a successful confirmation toast to the user.

---

### 3. Missing Infrastructure Hardening Headers (Defense-in-Depth Failure)
* **Classification:** CWE-693: Protection Mechanism Failure
* **Severity:** Medium (Increased Exploit Surface)

To analyze the network-level defense posture, I ran a compliance diagnostic scan using [Webrr](https://github.com/wxwreak/webrr). The assessment revealed a total absence of vital server-side defensive response flags. The server layer fails to broadcast directive rules meant to instruct client browsers on how to strictly sand-box and protect the running execution space.

#### Exploitation Risks & Impact of Missing Headers:
* **Missing Content-Security-Policy (CSP):** Leaves the platform highly vulnerable to Cross-Site Scripting (XSS) and injection threats. An attacker capable of executing persistent scripts could freely exfiltrate session data or hook client web browsers.
* **Missing X-Frame-Options:** Exposes the storefront to Clickjacking attacks, enabling malicious actors to overlay the storefront inside invisible frames and steal user clicks or transaction interactions.
* **Missing Strict-Transport-Security (HSTS):** Fails to force TLS connections at the user-agent level, increasing susceptibility to Man-in-the-Middle (MitM) interceptions and SSL-stripping vectors.
* **Missing X-Content-Type-Options:** Prevents MIME-sniffing protection, which can lead the browser to interpret non-executable files (like user images) as active JavaScript payloads.

---

## 💡 Remediation & Code Hardening

To structurally insulate the storefront, the development layer must establish the following modifications:

1. **Implement Pessimistic UI Routines & Halting Logic:**
   The frontend must never prematurely write changes to the system layout or `localStorage`. State updates must sit strictly behind a validated `HTTP 200 OK` server response payload. Furthermore, every network `catch` branch must structurally enforce an immediate `return;` termination to suppress downstream script progression.

2. **Production Tree-Shaking & Dead Code Elimination:**
   Administrative modules, developer management screens, and debug routes must be completely isolated from production bundles. Use modern compiler configuration parameters (e.g., condition evaluation macros in Webpack or Vite) to strip sensitive components during the asset generation cycle.

3. **Deploy Security Header Profiles via Cloudflare Rules:**
   Utilize Cloudflare Transform Rules or `_headers` configuration patterns to attach compliant HTTP security configurations across all application endpoints. Ensure `Content-Security-Policy`, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff` are pushed to all visitors to fix the alerts raised by **Webrr**.
