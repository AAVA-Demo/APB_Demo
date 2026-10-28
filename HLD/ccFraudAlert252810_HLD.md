# Credit Card Fraud Alert System – Domain Model & High-Level Design

## Domain Model (UML/ERD)

### Entities and Attributes

- **Transaction**
  - transaction_id (PK)
  - account_id
  - card_id
  - merchant
  - amount
  - currency
  - timestamp
  - channel

- **RiskDecision**
  - decision_id (PK)
  - transaction_id (FK)
  - risk_score
  - risk_band
  - model_version
  - decision
  - timestamp

- **Alert**
  - alert_id (PK)
  - transaction_id (FK)
  - customer_id
  - severity
  - status
  - created_at
  - expires_at

- **Notification**
  - notification_id (PK)
  - alert_id (FK)
  - channel
  - provider_status
  - sent_at
  - delivered_at
  - failure_reason

- **CustomerResponse**
  - response_id (PK)
  - alert_id (FK)
  - customer_id
  - response
  - authenticated_at
  - timestamp

- **FraudCase**
  - case_id (PK)
  - alert_id (FK)
  - case_type
  - protection_action
  - status
  - created_at

#### Relationships

- A **Transaction** may have 0..1 **RiskDecision**
- A **RiskDecision** is associated with 1 **Transaction**
- A **Transaction** may trigger 0..1 **Alert**
- An **Alert** is linked to 1 **Transaction**
- An **Alert** may have 0..N **Notifications**
- An **Alert** may have 0..N **CustomerResponses**
- An **Alert** may result in 0..1 **FraudCase**

**ERD Diagram:**  
```
[Transaction] 1---0..1 [RiskDecision]
[Transaction] 1---0..1 [Alert] 1---0..N [Notification]
[Alert] 1---0..N [CustomerResponse]
[Alert] 1---0..1 [FraudCase]
```
*(Diagram to be rendered using PlantUML, Lucidchart, or similar tool in implementation phase)*

---

## High-Level Design (HLD)

### 1. Architecture Overview

**Component Diagram:**
```
[Transaction Event Source] 
      |
[Fraud Decision Service] <--- [Risk Engine]
      |
[Policy Engine]
      |
[Alert Service] <--- [Notification Service]
      |
[Customer Response Service]
      |
[Protection/Case Management Service]
      |
[Audit & Analytics]
```

#### Data Flow:
1. Transaction event ingested from card platform.
2. Risk Decision Service evaluates risk and assigns a score/band.
3. Policy Engine maps risk to action (alert, hold, approve, step-up, decline).
4. Alert Service creates an alert, sends notification(s) via Notification Service.
5. Customer receives alert, can respond (confirm or report).
6. Customer Response Service authenticates, records action.
7. If reported as unauthorized, triggers Protection/Case Management workflow.
8. All actions logged for audit/analytics.

### 2. Major Components

- **Transaction Ingestion**
  - Receives real-time events from card authorization system.
  - Idempotent processing to avoid duplicate alerts.

- **Fraud Decision Service**
  - Integrates with approved risk engine.
  - Uses configurable thresholds.
  - Records risk decision and model version.

- **Policy Engine**
  - Determines if/when to alert, block, or step-up authentication.
  - Configurable policies.

- **Alert Service**
  - Generates canonical alert records.
  - Ensures only one alert per transaction.
  - Manages alert state machine.

- **Notification Service**
  - Sends alerts via push, SMS, email, or in-app.
  - Handles delivery retries and fallback.
  - Logs all notification attempts and outcomes.

- **Customer Response Service**
  - Authenticates customer (step-up for sensitive actions).
  - Records 'Yes, this was me' and 'No, I don't recognize this'.
  - Triggers downstream workflows.

- **Protection/Case Management**
  - Blocks card/account as needed.
  - Initiates investigation/dispute flow.
  - Updates alert/case status.

- **Audit & Analytics**
  - Records all key events: alert creation, delivery, response, protection.
  - Supports compliance, operational monitoring, and reporting.

### 3. Integration Points

- **Card Transaction Platform:** Transaction event ingestion.
- **Fraud-Risk Engine:** External or internal risk scoring.
- **Notification Providers:** Push, SMS, email, in-app.
- **Customer Authentication Service:** Secure login, step-up auth.
- **Case Management System:** Fraud investigation/dispute.
- **Analytics/Monitoring:** SIEM, dashboards, compliance reporting.

### 4. Security & Compliance Features

#### Security

- **Input Validation:** Strict schema, type, and format checks on all events and API calls.
- **Output Filtering:** Never expose sensitive data (e.g., full card numbers) in notifications or logs.
- **Encryption:**  
  - AES-256 at rest  
  - TLS 1.3 in transit
- **Authentication & Authorization:**  
  - RBAC for operations and support users  
  - ABAC for customer actions  
  - Step-up authentication for sensitive flows
- **Secrets Management:**  
  - Use enterprise secrets vault for API keys, credentials.
- **Audit Logging:**  
  - Immutable logs for all alert lifecycle events, customer responses, and protection actions.
- **Rate Limiting:**  
  - Limit sensitive endpoints to prevent abuse.

#### Compliance

- **Data Retention:**  
  - Apply legal/enterprise policy for alert, case, and audit record retention.
- **Consent Management:**  
  - Respect customer notification preferences except where security policy overrides.
- **Data Lineage:**  
  - Traceability for all risk, alert, and case decisions.
- **Compliance Reporting:**  
  - Generate exportable reports for audit, regulatory, and operational review.

### 5. Error Handling Patterns

- **Retries:** For transient failures (notification delivery, external API calls).
- **Fallbacks:** If primary notification fails, use approved secondary channel.
- **Circuit Breaker:** For dependent service outages (e.g., risk engine down).
- **Logging:** All errors and edge cases logged for investigation.

---

## Validation Report

### Requirements Coverage Checklist

| PRD Section | Requirement | Coverage |
|-------------|-------------|----------|
| Functional  | FR-01 to FR-14 | All mapped to domain entities and flows |
| Non-Functional | Latency, Security, Reliability, Privacy, Observability | Addressed in HLD and security features |
| Security & Privacy | All requirements | Included in architecture, component, and data flow design |
| Compliance | Retention, audit, consent, reporting | Addressed in compliance features |
| Edge Cases | Notification fallback, grouping, offline, etc. | Handled in error patterns and design |
| MVP/Scope | MVP features only | Out-of-scope features excluded |

### Error Handling

- Idempotency on transaction ingest
- Retry/fallback on notification
- Circuit breaker for downstream dependencies
- Immutable audit logs for all state transitions

### Compliance

- Encryption (AES-256/TLS 1.3)
- RBAC/ABAC, strong authentication
- Data retention and consent
- Secure secrets management
- No sensitive card data exposure

---

**End of HLD/ccFraudAlert252810_HLD.md**

---