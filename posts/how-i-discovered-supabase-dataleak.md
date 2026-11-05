---
title: "How I Discovered a Leak Exposing 1,000+ Customer Emails via a Simple API Query (?select=*)"
date: "2026-10-30"
description: A security writeup on how a missing Supabase Row-Level Security (RLS) policy allowed a horizontal privilege escalation, exposing 1,000+ customer emails.
---

# How I Discovered a Leak Exposing 1,000+ Customer Emails via a Simple API Query (?select=*)

**While inspecting the web traffic of `hiddenweb`, I stumbled upon a major database security flaw. By changing a single query parameter, I was able to access a leaked database containing over 1,000 cleartext customer emails and private multi-tenant store data.**

---

## Responsible Disclosure Timeline
* **October 30, 2026:** Vulnerability discovered during a routine traffic audit.
* **October 30, 2026:** Detailed bug report sent to the development team.
* **October 30, 2026:** Developers acknowledged the issue and deployed a security patch.
* **October 30, 2026:** Re-tested the endpoint to confirm the vulnerability was fully resolved.


## 1. The Vulnerability & Discovery

While auditing how data flows through the app, I opened **Burp Suite** to inspect the background API requests. 
Looking through the **HTTP History** tab, I noticed the app was making direct calls to the Supabase database REST endpoint using the public anonymous key. The main security flaw was that **the database rules trusted the frontend completely**, lacking proper column-level restrictions for the `anon` user role.

### Exploring the `reviews` Table (1,000 Customer Emails Leaked)
While the frontend UI was designed to only show public review contents (like names and comments), the underlying database endpoint accepted the wildcard query selector (`select=*`) without validation.

I sent the intercepted request from HTTP History over to the **Burp Suite Repeater** and modified the query parameter to:

```http
GET /rest/v1/reviews?select=* HTTP/2
```

The backend bypassed the intended frontend logic and returned raw database rows. Because the multi-tenant database stored reviews from various storefronts in a shared instance, this single wildcard query in Repeater exposed database rows linked to internal `store_id` values—exposing **over 1,000 cleartext customer email addresses** in total across different shops.

In PostgREST/Supabase APIs, filtering for an exact match is done using the `eq` operator (which means equal). I extracted a `store_id` from the initial leaky response and appended it to my request:

```http
GET /rest/v1/reviews?select=*&store_id=eq.xxxxxxxxxxxxxxxxxxxx HTTP/2
```

The API accepted this logic perfectly. It filtered down the results, proving that anyone could target a specific merchant on the platform and mass-harvest exclusively their customer emails (which could lead to highly targeted phishing or spam via fake links sent to their emails).

Here is the exact request and response captured inside **Burp Suite**:

![Data Leak Response](/posts-imgs/dataleak_blurred.jpg)
*(Note: Real user emails and internal IDs have been partially blurred for privacy).*

### The Patch: Verifying the Fix

To ensure no rules were broken and that the vulnerability is no longer exploitable, I re-tested the exact same wildcard endpoint after the developer deployed the security patch.
When sending the `GET /rest/v1/reviews?select=*` request now, the Supabase backend actively restricts the output. Instead of leaking internal database rows and customer emails, it blocks the query completely and returns a `42501` database error code stating: **"permission denied for table reviews"**.

This confirms that Row Level Security (RLS) and table permissions are now properly configured and protecting the platform's data.
Here is the **Burp Suite Repeater** screenshot proving that the leak has been successfully patched:

![Vulnerability Patched Response](/posts-imgs/after_blurred.jpg)

## 2. Bonus Discovery: Missing Security Headers

While analyzing the infrastructure of `hiddenweb`, I also checked the HTTP response headers of the production server. A properly configured web server should utilize standard security headers to defend the application and its users against client-side attacks. 

Unfortunately, as shown in the scan below, the server was missing almost every critical security header:
* **Content-Security-Policy (CSP):** Missing entirely. This is crucial for mitigating Cross-Site Scripting (XSS) and data injection attacks by restricting where resources can be loaded from.
* **X-Frame-Options:** Missing, meaning the website could be embedded into an external `<iframe>`, making it vulnerable to Clickjacking attacks.
* **Strict-Transport-Security (HSTS):** Not enforced. This leaves users vulnerable to SSL stripping and Man-in-the-Middle (MitM) attacks by not forcing browsers to interact only over secure HTTPS connections.
* **X-Content-Type-Options:** Not set to `nosniff`, which exposes users to MIME-sniffing vulnerabilities where browsers try to guess and execute malicious file types.
* **Referrer-Policy:** Not configured. This header is important to control how much referral information (like URLs or data in the Referer header) is leaked when users navigate to external links.
* **Permissions-Policy:** Missing entirely. This header allows a site to restrict access to sensitive browser features and hardware functions (like camera, microphone, or geolocation) to prevent abuse.
