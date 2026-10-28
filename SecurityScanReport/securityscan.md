# Security Scan Report

**Repository:** APB_Demo
**Branch:** ccFraudAlertNew199
**Scan Date:** 2025-07-14
**PRD Reference:** Credit Card Fraud Alert System v1.0

---

## Security Gate Decision

**Status:** ⚠️ PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 High | 4 |
| 🟡 Medium | 6 |
| 🔵 Low | 5 |
| ℹ️ Info | 4 |
| **Total** | **19** |

---

## Findings

---

### 1. [HIGH] Sensitive Token Retrieved from localStorage — CWE-922 / OWASP A02:2021

- **File:** `src/app/app.config.js`
- **Line:** 24
- **Vulnerable Code:**
```javascript
const token = localStorage.getItem('auth_token');
if (token) {
  config.headers.Authorization = 'Bearer ' + token;
}
```
- **Issue:** The Bearer authentication token is stored in and retrieved from `localStorage`. `localStorage` is accessible by any JavaScript running on the page, making it vulnerable to XSS-based token theft. Once stolen, the token can be used to impersonate the authenticated user and access fraud alert data, customer PII, and card details.
- **Security Impact:** Token exfiltration via XSS leads to full session hijacking. In a fraud alert system handling sensitive financial data and card information, this is a critical attack vector. Violates PRD §22: *"Use secure authentication before sensitive fraud-response actions"* and *"Encrypt sensitive data in transit and at rest."*
- **OWASP / CWE:** CWE-922 (Insecure Storage of Sensitive Information), CWE-312, OWASP A02:2021 (Cryptographic Failures), OWASP A07:2021 (Identification and Authentication Failures)
- **Recommended Fix:**
  - Store authentication tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies managed server-side.
  - If `localStorage` must be used (not recommended), implement a short-lived token with refresh rotation and pair with a strict Content Security Policy (CSP).
  - Never store long-lived tokens in browser-accessible storage for security-critical financial applications.

---

### 2. [HIGH] Customer ID Retrieved from localStorage — CWE-922 / OWASP A01:2021

- **File:** `src/app/modules/notifications/controllers/notification-preference.controller.js`
- **Line:** 10
- **Vulnerable Code:**
```javascript
vm.customerId = localStorage.getItem('customer_id') || 'CUST-12345';
```
- **Issue:** The `customer_id` is read directly from `localStorage` and used to construct API calls to fetch and update customer notification preferences (`/customers/${customerId}/preferences`). There is no server-side binding of this ID to the authenticated session. An attacker who can manipulate `localStorage` (via XSS or direct browser access) can substitute any `customer_id` and read or modify another customer's notification preferences.
- **Security Impact:** This is an Insecure Direct Object Reference (IDOR / BOLA) vulnerability. An attacker could enumerate customer IDs and silently disable fraud alert notifications for victim accounts (e.g., disabling push/SMS/email), effectively blinding the customer to fraudulent transactions. This directly undermines the core security purpose of the system. Violates PRD §22: *"Apply least-privilege access to fraud and customer data"* and §10: *"Customer responses must be authenticated and authorized."*
- **OWASP / CWE:** CWE-639 (Authorization Through User-Controlled Key), CWE-922, OWASP A01:2021 (Broken Access Control), OWASP A07:2021
- **Recommended Fix:**
  - Never derive the `customer_id` from client-side storage. The server must resolve the customer identity from the authenticated session/token server-side.
  - Remove the `localStorage.getItem('customer_id')` pattern entirely. The API endpoint should use the authenticated identity from the Bearer token.
  - Remove the hardcoded fallback `'CUST-12345'` — this is a debug artifact that must not exist in any environment.

---

### 3. [HIGH] IDOR on Alert Retrieval — No Client-Side Authorization Validation — CWE-639 / OWASP A01:2021

- **File:** `src/app/modules/notifications/controllers/alert-viewer.controller.js`
- **Lines:** 9–10, 13–22
- **Vulnerable Code:**
```javascript
vm.alertId = $routeParams.alertId;
vm.loadAlert = () => {
  alertService.getAlert(vm.alertId)
    ...
};
```
- **Issue:** The `alertId` is taken directly from the URL route parameter (`$routeParams.alertId`) with no client-side ownership validation. Any authenticated user can navigate to `/alert/<any_alert_id>` and attempt to retrieve another customer's fraud alert, including sensitive transaction details (card identifier, merchant, amount, risk score). The protection relies entirely on the backend enforcing ownership — which is not visible in this codebase and cannot be assumed.
- **Security Impact:** If the backend does not enforce that the requesting user owns the alert, any authenticated customer can view another customer's fraud alert details, including masked card data, transaction history, and risk scores. Violates PRD §22: *"Apply least-privilege access to fraud and customer data"* and §14: *"Authorized fraud operations users must be able to investigate alert outcomes"* (implying non-operations users must not).
- **OWASP / CWE:** CWE-639 (Authorization Through User-Controlled Key), OWASP A01:2021 (Broken Access Control)
- **Recommended Fix:**
  - The backend API `GET /alerts/{alertId}` must enforce that the authenticated user's identity (from the Bearer token) matches the `customer_id` on the alert record.
  - Add a client-side post-fetch ownership check: after loading the alert, verify `alert.customer_id` matches the authenticated user's identity.
  - Implement route guards that verify session validity before rendering the alert viewer.

---

### 4. [HIGH] Hardcoded Fallback Account ID in Test Transaction Object — CWE-798 / OWASP A07:2021

- **File:** `src/app/modules/fraud-detection/controllers/alert-dashboard.controller.js`
- **Lines:** 10–20
- **Vulnerable Code:**
```javascript
vm.testTransaction = {
  transaction_id: 'TXN-' + Date.now(),
  account_id: 'ACC-12345',
  card_id: '4532123456789012',   // <-- Full 16-digit card number
  merchant: 'Test Merchant',
  amount: 150.00,
  ...
};
```
- **Issue:** A full 16-digit card number (`4532-1234-5678-9012` — masked here per policy) is hardcoded directly in the controller source code. This card number is a valid Visa-format PAN (passes Luhn check). Additionally, a hardcoded `account_id: 'ACC-12345'` is present. This test transaction object is submitted to the live fraud detection pipeline via `vm.processTestTransaction()`, meaning real API calls are made with this hardcoded card data.
- **Security Impact:**
  - Hardcoded PAN in source code violates PCI-DSS Requirement 3 (Protect Stored Cardholder Data) and PCI-DSS Requirement 6 (Develop and Maintain Secure Systems).
  - The test transaction button is present in the production dashboard view (`alert-dashboard.view.html`), meaning any authenticated user can trigger fraud pipeline processing with this hardcoded card.
  - Source code repositories containing PANs are a direct compliance violation regardless of whether the number is "real."
  - Violates PRD §22: *"Never display full card numbers in customer notifications or tracking screens"* — this extends to never storing them in source code.
- **OWASP / CWE:** CWE-798 (Use of Hard-coded Credentials), CWE-312 (Cleartext Storage of Sensitive Information), OWASP A02:2021
- **Recommended Fix:**
  - **Immediately remove** the hardcoded card number from source code.
  - Replace with a tokenized test reference or a mock/stub value that does not resemble a real PAN (e.g., `'card_id': 'TEST-CARD-TOKEN'`).
  - The test transaction feature must be gated behind a feature flag that is disabled in production environments.
  - Move all test fixtures to environment-specific configuration files excluded from version control (`.gitignore`).

---

### 5. [MEDIUM] No Route Guards / Authentication Check on Protected Routes — CWE-306 / OWASP A07:2021

- **File:** `src/app/app.config.js`
- **Lines:** 4–21
- **Vulnerable Code:**
```javascript
$routeProvider
  .when('/dashboard', {
    templateUrl: '...',
    controller: 'alertDashboardController',
    ...
  })
  .when('/alert/:alertId', { ... })
  .when('/preferences', { ... })
```
- **Issue:** None of the defined routes include a `resolve` block with an authentication guard. There is no check that verifies the user is authenticated before rendering the dashboard, alert viewer, or preferences pages. The HTTP interceptor adds a token if present, but does not prevent unauthenticated navigation to protected views.
- **Security Impact:** An unauthenticated user can navigate directly to `/dashboard`, `/alert/<id>`, or `/preferences` and the views will render. API calls will fail with 401 (handled by the interceptor), but the page structure, UI, and any client-side data already in scope may be exposed. Violates PRD §22: *"Use secure authentication before sensitive fraud-response actions."*
- **OWASP / CWE:** CWE-306 (Missing Authentication for Critical Function), OWASP A07:2021
- **Recommended Fix:**
```javascript
.when('/dashboard', {
  templateUrl: '...',
  controller: 'alertDashboardController',
  resolve: {
    auth: ['authGuard', function(authGuard) {
      return authGuard.requireAuthentication();
    }]
  }
})
```
  - Implement an `authGuard` service that checks for a valid session and redirects to login if not authenticated.
  - Apply the guard to all protected routes.

---

### 6. [MEDIUM] `confirmTransaction` and `reportTransaction` Perform No Authentication or Authorization — CWE-306 / OWASP A01:2021

- **File:** `src/app/modules/notifications/controllers/alert-viewer.controller.js`
- **Lines:** 23–30
- **Vulnerable Code:**
```javascript
vm.confirmTransaction = () => {
  toastr.success('Transaction confirmed as legitimate', 'Confirmed');
  $location.path('/dashboard');
};
vm.reportTransaction = () => {
  toastr.warning('Transaction reported as fraud. Account protection initiated.', 'Reported');
  $location.path('/dashboard');
};
```
- **Issue:** Both the "confirm" and "report" actions are entirely client-side UI operations. They display a toast notification and redirect — **no API call is made to record the customer's response**. The "report" action claims "Account protection initiated" but performs no backend action whatsoever. This means customer fraud reports are silently dropped.
- **Security Impact:**
  - A customer reporting fraud receives false assurance that account protection has been initiated when it has not.
  - No audit record is created for the customer response, violating PRD §9 (FR-09): *"System must record alert creation, delivery, customer response, and resulting action."*
  - PRD §21 Acceptance Criteria: *"Given a customer selects 'No, I don't recognize this', the system starts the approved protection workflow"* — this is not implemented.
  - PRD §22: *"Customer responses must be authenticated and authorized"* — no authentication step-up is performed before the "report fraud" action.
- **OWASP / CWE:** CWE-306 (Missing Authentication for Critical Function), CWE-778 (Insufficient Logging), OWASP A01:2021, OWASP A09:2021
- **Recommended Fix:**
```javascript
vm.reportTransaction = () => {
  // Step-up authentication required per PRD §22
  authService.requireStepUpAuth().then(() => {
    return alertService.reportFraud(vm.alertId, vm.alert.customer_id);
  }).then(() => {
    auditService.logCustomerResponse(vm.alertId, 'reported');
    toastr.warning('Transaction reported. Account protection initiated.', 'Reported');
    $location.path('/dashboard');
  }).catch(() => {
    toastr.error('Failed to report transaction. Please try again.', 'Error');
  });
};
```
  - Both actions must make authenticated API calls to record the response.
  - "Report" must trigger the card/account protection workflow server-side.
  - Step-up authentication (re-authentication or MFA) must be required before the "report fraud" action per PRD §22 and §27.

---

### 7. [MEDIUM] Sensitive Data Logged to Browser Console — CWE-532 / OWASP A09:2021

- **File:** Multiple files
- **Lines:** Various
- **Vulnerable Code:**
```javascript
// alert-dashboard.controller.js:31
console.error('Failed to load alerts:', error);

// fraud-detection.service.js:8
console.log('Duplicate transaction detected, skipping:', transactionEvent.transaction_id);

// email-provider.factory.js:18
console.log('Email sent successfully:', response.data);

// push-notification.factory.js:17
console.log('Push notification sent successfully:', response.data);

// sms-provider.factory.js:17
console.log('SMS sent successfully:', response.data);

// audit.service.js:13
// user_id: localStorage.getItem('user_id') || 'system'
```
- **Issue:** Numerous `console.log` and `console.error` statements log API response data, transaction IDs, error objects, and provider responses to the browser console. In a fraud alert system, API error responses may contain sensitive customer data, card details, or internal system information. Browser console output is accessible to anyone with DevTools access on a shared or compromised device.
- **Security Impact:** Sensitive financial data, transaction IDs, customer IDs, and provider response details may be exposed in browser developer tools. Violates PRD §22: *"Log security events without unnecessarily storing sensitive payment data."*
- **OWASP / CWE:** CWE-532 (Insertion of Sensitive Information into Log File), OWASP A09:2021 (Security Logging and Monitoring Failures)
- **Recommended Fix:**
  - Replace all `console.log/error/warn` with a structured logging service that:
    - Is disabled or sanitized in production builds.
    - Strips sensitive fields (card IDs, transaction amounts, customer IDs) before logging.
    - Routes logs to a secure server-side logging infrastructure.
  - Use build-time environment flags (`NODE_ENV=production`) to suppress debug logging.

---

### 8. [MEDIUM] `user_id` Retrieved from localStorage for Audit Records — CWE-922 / OWASP A02:2021

- **File:** `src/app/services/audit.service.js`
- **Line:** 12
- **Vulnerable Code:**
```javascript
user_id: localStorage.getItem('user_id') || 'system'
```
- **Issue:** The `user_id` included in audit records is sourced from `localStorage`, which is client-controlled. An attacker can set any arbitrary `user_id` in `localStorage` to forge audit trail entries, attributing actions to other users or to the system account (`'system'`).
- **Security Impact:** Audit trail integrity is compromised. Fraudulent actions could be attributed to legitimate users, or malicious activity could be hidden under the `'system'` identity. This directly violates PRD §9 (FR-09): *"System must record alert creation, delivery, customer response, and resulting action"* — the integrity of those records is undermined. Violates PRD §22: *"Fraud-alert decisions must be auditable."*
- **OWASP / CWE:** CWE-922, CWE-345 (Insufficient Verification of Data Authenticity), OWASP A02:2021, OWASP A09:2021
- **Recommended Fix:**
  - The `user_id` for audit records must be resolved server-side from the authenticated Bearer token.
  - Remove all client-side identity resolution for security-sensitive operations.
  - The audit service should not accept a client-supplied `user_id`; the backend must enforce identity binding.

---

### 9. [MEDIUM] `session_id` Retrieved from localStorage for Analytics Events — CWE-922

- **File:** `src/app/services/analytics.service.js`
- **Line:** 11
- **Vulnerable Code:**
```javascript
session_id: localStorage.getItem('session_id') || 'unknown'
```
- **Issue:** The `session_id` used in analytics events is read from `localStorage` and can be manipulated by the client. While analytics data is generally lower risk than audit data, in a fraud detection system, analytics events (including `fraud_alert_created`, `fraud_alert_reported`) are used for operational monitoring and fraud pattern analysis. Manipulated session IDs can corrupt fraud analytics and operational dashboards.
- **Security Impact:** Analytics-based fraud detection signals can be poisoned. Operational monitoring dashboards (PRD §25) may produce incorrect metrics. An attacker could use session ID manipulation to evade fraud pattern detection.
- **OWASP / CWE:** CWE-922, OWASP A09:2021
- **Recommended Fix:**
  - Resolve `session_id` server-side from the authenticated session context.
  - If a client-side session identifier is necessary, generate it server-side and deliver it via a `HttpOnly` cookie, not `localStorage`.

---

### 10. [MEDIUM] Unvalidated `alertId` from URL Route Parameter — CWE-20 / OWASP A03:2021

- **File:** `src/app/modules/notifications/controllers/alert-viewer.controller.js`
- **Line:** 9
- **Vulnerable Code:**
```javascript
vm.alertId = $routeParams.alertId;
```
- **File:** `src/app/modules/fraud-detection/directives/alert-list.directive.js`
- **Line:** 14
- **Vulnerable Code:**
```javascript
scope.viewAlert = (alertId) => {
  window.location.href = '#/alert/' + alertId;
};
```
- **Issue:** The `alertId` from the URL route parameter is used directly in API calls without any format validation or sanitization. Additionally, `alertId` values from the alert list are concatenated directly into a URL string using `window.location.href`. If `alertId` contains special characters or path traversal sequences, this could lead to unexpected behavior.
- **Security Impact:** Malformed `alertId` values could cause unexpected API behavior. The `window.location.href` concatenation could be abused for open redirect if `alertId` is not properly constrained. While AngularJS route handling provides some protection, explicit validation is required for a security-critical application.
- **OWASP / CWE:** CWE-20 (Improper Input Validation), CWE-601 (URL Redirection to Untrusted Site), OWASP A03:2021
- **Recommended Fix:**
```javascript
// Validate alertId format before use
const ALERT_ID_PATTERN = /^[A-Za-z0-9\-_]{1,64}$/;
if (!ALERT_ID_PATTERN.test(vm.alertId)) {
  $location.path('/dashboard');
  return;
}
```
  - Validate `alertId` against an expected format (UUID or alphanumeric) before making API calls.
  - Use `$location.path()` instead of `window.location.href` for internal navigation to prevent open redirect risks.

---

### 11. [LOW] Missing CSRF Protection Configuration — CWE-352 / OWASP A01:2021

- **File:** `src/app/app.config.js`
- **Lines:** 22–35
- **Vulnerable Code:**
```javascript
$httpProvider.interceptors.push([...]);
// No $httpProvider.defaults.xsrfCookieName or xsrfHeaderName configuration
```
- **Issue:** The `$httpProvider` interceptor is configured for Bearer token injection but there is no explicit XSRF/CSRF token configuration. AngularJS has built-in XSRF protection (`$httpProvider.defaults.xsrfCookieName` / `xsrfHeaderName`) but it requires the server to set the XSRF cookie and the configuration to be explicitly enabled and matched to the server's expected header name.
- **Security Impact:** If the backend relies on CSRF tokens and the AngularJS client is not configured to send them, state-changing requests (confirm/report transaction, update preferences) may be vulnerable to CSRF attacks. Violates PRD §22 security requirements.
- **OWASP / CWE:** CWE-352 (Cross-Site Request Forgery), OWASP A01:2021
- **Recommended Fix:**
```javascript
$httpProvider.defaults.xsrfCookieName = 'XSRF-TOKEN';
$httpProvider.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
```
  - Coordinate with the backend team to ensure CSRF tokens are issued and validated.

---

### 12. [LOW] `toastr` Used as Global Without Injection — CWE-749 / OWASP A06:2021

- **File:** Multiple files (`app.config.js`, `alert-dashboard.controller.js`, `fraud-detection.service.js`, `alert-viewer.controller.js`)
- **Lines:** Various
- **Vulnerable Code:**
```javascript
toastr.error(rejection.data && rejection.data.message || 'An error occurred', 'Error');
toastr.success('Transaction processed: ' + result.status, 'Success');
```
- **Issue:** `toastr` is used as an implicit global variable throughout the codebase rather than being injected as an AngularJS service. This bypasses AngularJS's dependency injection system and makes the dependency invisible to the module system. Additionally, `rejection.data.message` from API error responses is rendered directly in the toastr notification without sanitization.
- **Security Impact:**
  - If a malicious API response returns a crafted `message` field containing HTML/script content, and `toastr` renders HTML (some configurations do), this could lead to XSS.
  - Uncontrolled global dependency makes security auditing and testing harder.
- **OWASP / CWE:** CWE-749 (Exposed Dangerous Method), CWE-79 (XSS), OWASP A06:2021 (Vulnerable and Outdated Components)
- **Recommended Fix:**
  - Inject `toastr` via AngularJS DI: `['toastr', function(toastr) { ... }]`
  - Sanitize error messages before displaying: strip HTML tags from `rejection.data.message` before passing to toastr.
  - Configure toastr with `escapeHtml: true` to prevent HTML rendering in notifications.

---

### 13. [LOW] Notification Preference Form Has No Input Validation — CWE-20 / OWASP A03:2021

- **File:** `src/app/modules/notifications/views/notification-preference.view.html`
- **Lines:** 20–40
- **Vulnerable Code:**
```html
<input type="tel" class="form-control" ng-model="vm.preferences.phone_number" 
       placeholder="+1234567890">
<input type="email" class="form-control" ng-model="vm.preferences.email_address" 
       placeholder="user@example.com">
```
- **Issue:** The phone number and email address input fields have no AngularJS validation directives (`ng-pattern`, `ng-minlength`, `ng-maxlength`) and the save button has no check for `preferencesForm.$valid`. The form can submit arbitrary values including excessively long strings or malformed data.
- **Security Impact:** Malformed phone numbers or email addresses could cause downstream notification delivery failures or, if the backend does not validate, could be used for injection attacks against SMS/email providers. Violates PRD §22 input handling requirements.
- **OWASP / CWE:** CWE-20 (Improper Input Validation), OWASP A03:2021
- **Recommended Fix:**
```html
<input type="tel" class="form-control" ng-model="vm.preferences.phone_number"
       ng-pattern="/^\+?[1-9]\d{7,14}$/" ng-maxlength="16"
       placeholder="+1234567890">
<button type="button" class="btn btn-primary" 
        ng-click="vm.savePreferences()" 
        ng-disabled="preferencesForm.$invalid">Save Preferences</button>
```

---

### 14. [LOW] Idempotency Cache is In-Memory and Not Bounded — CWE-400

- **File:** `src/app/services/idempotency.service.js`
- **Lines:** 8–9
- **Vulnerable Code:**
```javascript
const cache = new Map();
```
- **Issue:** The client-side idempotency cache is an unbounded in-memory `Map`. In a long-running session with high transaction volume, this cache will grow indefinitely, consuming memory. More critically, the cache is per-session and per-page-load — it provides no real idempotency guarantee across sessions, page refreshes, or multiple browser tabs.
- **Security Impact:** The false sense of idempotency protection at the client level may mask duplicate processing issues. The actual idempotency guarantee must come from the server (which appears to be the case via the API call), but the client cache could cause `checkDuplicate` to return `true` incorrectly if a transaction ID is reused across sessions. Violates PRD FR-10: *"Duplicate transaction events must not create duplicate fraud cases."*
- **OWASP / CWE:** CWE-400 (Uncontrolled Resource Consumption), CWE-362
- **Recommended Fix:**
  - Remove the client-side cache entirely and rely solely on the server-side idempotency check.
  - If a client-side cache is desired for performance, implement a bounded LRU cache with a TTL matching the transaction deduplication window.

---

### 15. [LOW] `window.location.href` Used for Internal Navigation — CWE-601

- **File:** `src/app/modules/fraud-detection/directives/alert-list.directive.js`
- **Line:** 14
- **Vulnerable Code:**
```javascript
scope.viewAlert = (alertId) => {
  window.location.href = '#/alert/' + alertId;
};
```
- **Issue:** Using `window.location.href` for internal SPA navigation bypasses AngularJS's `$location` service and router, which could interfere with route guards (once implemented) and makes the navigation harder to test and secure.
- **Security Impact:** If `alertId` is not validated (see Finding #10), this concatenation could be used for open redirect. Using `$location` ensures AngularJS route processing and any resolve guards are applied.
- **OWASP / CWE:** CWE-601 (URL Redirection to Untrusted Site), OWASP A01:2021
- **Recommended Fix:**
```javascript
// Inject $location into the directive
scope.viewAlert = (alertId) => {
  if (/^[A-Za-z0-9\-_]{1,64}$/.test(alertId)) {
    $location.path('/alert/' + alertId);
  }
};
```

---

### 16. [INFO] No Content Security Policy (CSP) Observed — OWASP A05:2021

- **File:** N/A (application-level configuration)
- **Issue:** No Content Security Policy headers or meta tags are visible in the reviewed codebase. For an AngularJS application handling financial fraud data, a strict CSP is essential to mitigate XSS attacks.
- **Security Impact:** Without CSP, any XSS vulnerability has maximum impact — scripts can be injected and executed freely. Given the `localStorage` token storage (Finding #1), XSS + no CSP = complete session compromise.
- **OWASP / CWE:** OWASP A05:2021 (Security Misconfiguration)
- **Recommended Fix:**
  - Implement a strict CSP: `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self' https://api.fraudalert.example.com`
  - Disable `unsafe-inline` and `unsafe-eval`.

---

### 17. [INFO] No Dependency Manifest Found (package.json / bower.json) — OWASP A06:2021

- **File:** N/A
- **Issue:** No `package.json`, `bower.json`, or dependency lock files were found in the scanned `src/` folder. The AngularJS version, `ngRoute` version, and `toastr` version cannot be assessed for known CVEs.
- **Security Impact:** Outdated AngularJS versions (pre-1.8.x) have known XSS vulnerabilities. `ngRoute` and `toastr` may also have security issues in older versions.
- **OWASP / CWE:** OWASP A06:2021 (Vulnerable and Outdated Components)
- **Recommended Fix:**
  - Provide `package.json` / `bower.json` for dependency vulnerability scanning.
  - Run `npm audit` or equivalent and remediate HIGH/CRITICAL findings.
  - Ensure AngularJS ≥ 1.8.x (latest stable) is used.

---

### 18. [INFO] Email Body Contains Unescaped HTML Constructed from Alert Data — CWE-79

- **File:** `src/app/services/alert-formatter.service.js`
- **Lines:** 30–33
- **Vulnerable Code:**
```javascript
case 'email':
  return {
    subject: 'Fraud Alert - Action Required',
    body: `<h2>Fraud Alert</h2><p>${baseMessage}</p><p>${actionMessage}</p>
           <p><a href="https://app.example.com/alert/${alertData.alert_id}">View Alert</a></p>`
  };
```
- **Issue:** The email body is constructed using template literals that embed `alertData.alert_id` and `baseMessage` (which contains merchant name, amount, and card data) directly into an HTML string without HTML-encoding. If any of these values contain HTML special characters (e.g., from a merchant name like `<script>` or `AT&T`), the email body could be malformed or, in certain email clients, exploitable.
- **Security Impact:** While the primary risk is email rendering issues, in the context of a fraud alert system where merchant names come from external transaction data, a crafted merchant name could inject content into the email body. This is a stored XSS vector in the email channel.
- **OWASP / CWE:** CWE-79 (Cross-Site Scripting), OWASP A03:2021
- **Recommended Fix:**
  - HTML-encode all dynamic values before embedding in HTML email bodies.
  - Use a server-side email templating engine rather than constructing HTML on the client.
  - Validate `alertData.alert_id` format before embedding in URLs.

---

### 19. [INFO] `$scope.$apply()` Called Manually in Promise Callbacks — Operational Risk

- **File:** Multiple controllers
- **Lines:** Various
- **Vulnerable Code:**
```javascript
.then(alerts => {
  vm.alerts = alerts;
  vm.loading = false;
  $scope.$apply();  // Unnecessary and risky
})
```
- **Issue:** Manual `$scope.$apply()` calls inside `$http` promise callbacks are unnecessary (AngularJS `$http` already runs in the digest cycle) and can cause `$apply already in progress` errors, leading to unpredictable UI state.
- **Security Impact:** While primarily a stability issue, digest cycle errors can cause the UI to display stale or incorrect alert data, potentially showing outdated fraud alert states to customers.
- **Recommended Fix:** Remove all manual `$scope.$apply()` calls from `$http` promise callbacks. AngularJS `$http` and `$q` promises automatically trigger digest cycles.

---

## Summary Table

| # | Severity | File | Issue | OWASP/CWE |
|---|----------|------|-------|-----------|