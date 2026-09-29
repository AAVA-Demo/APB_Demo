# Low-Level Design: QE-6195 - Fraud Protection Workflow and Operations Visibility

## a. Architecture Mapping

| HLD Component | AngularJS Artifact |
|---|---|
| Customer Reports Fraud | `FraudReportController` (Controller) + `fraud-report.html` (View) |
| Protection Workflow Service | `ProtectionWorkflowService` (Service) - orchestrates card blocking, case creation |
| Card Management Service | `CardManagementService` (Service) - wraps card blocking/replacement API |
| Fraud Case Management | `FraudCaseManagementService` (Service) - creates cases, initiates investigation |
| Operations Dashboard | `OperationsDashboardController` (Controller) + `operations-dashboard.html` (View) |
| Audit Trail Store | `AuditInterceptor` ($httpProvider interceptor) - logs all protection actions |

**Folder Structure:**
```
app/
  fraud-protection/
    fraud-protection.module.js
    fraud-report.controller.js
    protection-workflow.service.js
    card-management.service.js
    fraud-case-management.service.js
    operations-dashboard.controller.js
    views/fraud-report.html
    views/operations-dashboard.html
  shared/
    interceptors/
      audit.interceptor.js
```

## b. Component Specifications

| Component Name | Artifact Type | Responsibility | Key Dependencies |
|---|---|---|---|
| `FraudReportController` | Controller | Handles customer fraud report, triggers protection workflow | `AuthService`, `ProtectionWorkflowService` |
| `ProtectionWorkflowService` | Service | Orchestrates card blocking, case creation, investigation initiation | `CardManagementService`, `FraudCaseManagementService`, `AuditInterceptor` |
| `CardManagementService` | Service | Calls card-management API to block card, trigger replacement | `$http` |
| `FraudCaseManagementService` | Service | Creates fraud case record, initiates investigation, links to dispute system | `$http` |
| `AuditInterceptor` | Interceptor | Logs all protection actions with timestamps, user ID, action type | `$q`, `AuditService` |
| `OperationsDashboardController` | Controller | Displays fraud analyst dashboard with alert outcomes, metrics, trends | `FraudCaseManagementService`, `AnalyticsService` |

## c. Data Model

```javascript
FraudReport = {
  reportId: String,
  alertId: String,
  transactionId: String,
  userId: String,
  reportedAt: String
}

ProtectionWorkflow = {
  workflowId: String,
  reportId: String,
  cardId: String,
  actions: Array<String>, // ['card_blocked', 'replacement_triggered', 'case_created', 'investigation_initiated']
  status: String, // 'initiated' | 'in_progress' | 'completed' | 'failed'
  completedAt: String,
  slaTarget: Number,
  slaMet: Boolean
}

FraudCase = {
  caseId: String,
  reportId: String,
  transactionId: String,
  userId: String,
  status: String, // 'open' | 'investigating' | 'resolved' | 'disputed'
  assignedTo: String,
  createdAt: String,
  resolvedAt: String,
  outcome: String
}

OperationsMetrics = {
  totalAlerts: Number,
  deliveredAlerts: Number,
  viewedAlerts: Number,
  confirmedAlerts: Number,
  reportedAlerts: Number,
  protectionWorkflowsCompleted: Number,
  averageResponseTime: Number,
  falsePositiveRate: Number,
  fraudLossRate: Number
}
```

## d. Data Flow

When a customer reports fraud via `FraudReportController`, `AuthService` authenticates the user. Upon successful authentication, `ProtectionWorkflowService` initiates the protection workflow by calling `CardManagementService` to block the card and trigger replacement. Simultaneously, `FraudCaseManagementService` creates a fraud case record and initiates investigation. `AuditInterceptor` logs all actions. The workflow status is tracked until completion, and SLA compliance is recorded. Fraud analysts access `OperationsDashboardController` to view alert outcomes, response rates, protection metrics, false positive rates, fraud loss trends, and investigate cases.

## e. Primary Sequence Diagram

```mermaid
sequenceDiagram
    participant User as Customer
    participant FRC as FraudReportController
    participant Auth as AuthService
    participant PWS as ProtectionWorkflowService
    participant CMS as CardManagementService
    participant FCMS as FraudCaseManagementService
    participant Audit as AuditInterceptor

    User->>FRC: Report fraud
    FRC->>Auth: authenticate(userId)
    Auth-->>FRC: authToken
    FRC->>PWS: initiateProtection(reportId, cardId)
    PWS->>CMS: blockCard(cardId)
    CMS-->>PWS: cardBlocked
    PWS->>CMS: triggerReplacement(cardId)
    CMS-->>PWS: replacementTriggered
    PWS->>FCMS: createCase(reportId, transactionId)
    FCMS-->>PWS: caseId
    PWS->>FCMS: initiateInvestigation(caseId)
    PWS->>Audit: logProtectionActions(workflowId, actions)
    PWS-->>FRC: workflowCompleted
    FRC-->>User: "Your card has been secured."
```

## f. Implementation Notes

- DI: All services use `$inject` array annotation for minification safety.
- API calls: `CardManagementService` and `FraudCaseManagementService` centralize external API calls; controllers never call APIs directly.
- SLA tracking: `ProtectionWorkflowService` records workflow start/end times and compares against target SLA; breaches trigger alerts.
- Retry logic: Card blocking and case creation failures trigger exponential backoff retry (max 3 attempts).
- ES6: Arrow functions, `const`/`let`, template literals; Babel transpiles to ES5.

## g. Error Handling

Centralized `$http` interceptor catches API failures; protection workflow failures trigger retry logic and escalation; user-facing errors surfaced via shared notification service.

## h. Security Notes

Strong authentication via `AuthService` before protection actions; audit logs exclude full card numbers; least-privilege access enforced for fraud analyst dashboard; data retention policies applied.