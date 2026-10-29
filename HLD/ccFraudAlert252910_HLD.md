---
## Domain Model: UML/ERD

**Entities & Attributes**
1. **Transaction**
   - transaction_id (PK)
   - account_id (FK: Customer)
   - card_id (FK: Card)
   - merchant
   - amount
   - currency
   - timestamp
   - channel

2. **RiskDecision**
   - decision_id (PK)
   - transaction_id (FK: Transaction)
   - risk_score
   - risk_band
   - model_version
   - decision
   - timestamp

3. **Alert**
   - alert_id (PK)
   - transaction_id (FK: Transaction)
   - customer_id (FK: Customer)
   - severity
   - status
   - created_at
   - expires_at

4. **Notification**
   - notification_id (PK)
   - alert_id (FK: Alert)
   - channel
   - provider_status
   - sent_at
   - delivered_at
   - failure_reason

5. **CustomerResponse**
   - response_id (PK)
   - alert_id (FK: Alert)
   - customer_id (FK: Customer)
   - response (confirmed/reported)
   - authenticated_at
   - timestamp

6. **FraudCase**
   - case_id (PK)
   - alert_id (FK: Alert)
   - case_type
   - protection_action
   - status
   - created_at

7. **Customer**
   - customer_id (PK)
   - name
   - contact_preferences
   - notification_channels
   - authentication_level

8. **Card**
   - card_id (PK)
   - customer_id (FK: Customer)
   - masked_number
   - card_nickname

**Relationships**
- Transaction 1..* — 1 Customer
- Transaction 1..* — 1 Card
- Transaction 1 — 0..1 RiskDecision
- Transaction 1 — 0..1 Alert
- Alert 1 — 0..* Notification
- Alert 1 — 0..* CustomerResponse
- Alert 1 — 0..1 FraudCase
- Customer 1 — 0..* Card

---

## High-Level Design (HLD) Document

### 1. Architecture Overview

**Main Components:**
- Transaction Event Ingestion Service
- Fraud Risk Engine
- Policy/Decision Engine
- Alert Service
- Notification Service (Push, SMS, Email, In-App)
- Customer Response Service
- Card/Account Protection & Case Management
- Analytics & Audit Logging Service
- Preferences & Profile Service
- Integration with Authentication/Identity Provider

**Architecture Diagram** (Textual):

```
[Transaction Platform] --> [Risk Engine] --> [Policy Engine] --> [Alert Service] --> [Notification Service]
                                                                          |
                                                                          v
                                                          [Customer Response Service]
                                                                          |
                                                                          v
                                                          [Protection/Case Management]
                                                                          |
                                                                          v
                                                        [Audit & Analytics] <---+
                                                              ^                 |
                                                              |                 |
                                                         [Ops Analyst UI]       |
                                                                                |
                                                        [Preferences/Profile] <-+
```

### 2. Major Components & Integration Points

- **Transaction Ingestion:** Receives and normalizes events from the card authorization platform.
- **Risk Engine:** Calculates risk score using pre-configured and tunable models.
- **Policy Engine:** Maps risk bands to actions (approve, alert, hold, decline).
- **Alert Service:** Creates a canonical alert, manages alert state machine, triggers notifications.
- **Notification Service:** Multi-channel delivery (push/SMS/email/in-app), with fallback logic.
- **Customer Response Service:** Authenticates user, records 'confirm'/'report', triggers case workflow.
- **Protection/Case Management:** Handles card blocks, replacements, dispute initiation.
- **Analytics & Audit:** Captures all lifecycle events and operational metrics.
- **Ops Analyst UI:** Allows investigation, overrides, and visibility for fraud analysts.

### 3. Security & Compliance Features

- **Input Validation & Output Filtering:** All inbound events validated (schema, range, format). All outputs filtered to avoid PII leakage.
- **Encryption:** AES-256 for data at rest, TLS 1.3 for all network transport.
- **Access Control:** RBAC for analysts, ABAC for customer actions, enforced by authentication gateway.
- **Audit Logging:** Immutable logs for all alerts, responses, and state transitions.
- **Secrets Management:** All credentials/keys in centralized, secured vaults.
- **Data Retention:** Retention policies per legal/compliance guidance, with automated expiry/deletion.
- **Consent Management:** All notification/processing respects user preferences except where overridden by security policy.
- **Data Lineage & Compliance Reporting:** All fraud and customer actions are traceable from ingestion to outcome, with exportable compliance reports.
- **Rate Limiting:** Sensitive APIs/endpoints are rate limited to prevent abuse.

### 4. Data Flow

1. Transaction Event Ingested
2. Risk Engine scores transaction
3. Policy Engine determines action (approve/alert/hold/decline)
4. If alert needed, Alert Service creates alert and triggers Notification Service
5. Customer receives alert via preferred channel
6. Customer responds ('Yes, this was me' / 'No, I don’t recognize')
7. System authenticates customer and updates alert state
8. If fraud reported, Protection Workflow triggers (block card, etc.)
9. All events, transitions, and errors are logged for analytics and compliance

### 5. Compliance

- **PCI DSS**: Masked card data only; no full PAN exposure.
- **GDPR/CCPA**: Data minimization, right to erasure, and customer consent tracked.
- **Auditability**: Complete alert/case/audit trails.
- **Incident Response**: Security events generate alerts for SOC review.
- **Data Residency**: All storage complies with regional legal requirements.

### 6. Error Handling

- **Retries:** All notification and workflow steps have retry logic with exponential backoff.
- **Fallbacks:** Alternate channels (SMS/email) if push fails.
- **Circuit Breaker:** For integration failures with upstream/downstream systems.
- **Logging:** All errors are logged with context for support/ops.
- **Idempotency:** Duplicate events do not create duplicate alerts/cases.
- **Edge Cases:** Offline customer, unavailable engine/provider, ambiguous merchant—all handled per defined scenarios.

---

## Validation Report

### Requirements Coverage Checklist

- [x] Transaction ingestion and risk scoring
- [x] Configurable risk thresholds
- [x] Alert creation and state management
- [x] Multi-channel notifications with fallback
- [x] Customer confirmation/report workflows
- [x] Account/card protection workflow
- [x] Audit trail for all key actions and decisions
- [x] Operations/analyst investigation
- [x] Idempotency, retries, error handling, and edge-case management
- [x] User preferences and security policy overrides
- [x] Data retention, consent, and compliance
- [x] Encryption, access control, and secrets management
- [x] Data lineage and compliance reporting

### Compliance

- [x] PCI DSS: Masked card data, secure storage/transport
- [x] GDPR/CCPA: Consent, retention, and erasure
- [x] Audit requirements: All transitions/actions logged
- [x] Security: AuthN/AuthZ, RBAC/ABAC, logging, and rate limiting

### Error Handling

- [x] Notification/channel fallback
- [x] Risk engine and provider unavailability
- [x] Duplicate event idempotency
- [x] Circuit breaker for downstream failures
- [x] Logging and alerting for all critical errors

---

**End of Subtask 1 Output**
