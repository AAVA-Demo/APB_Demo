#### 1. High-Level Design
- Summary: This epic's core requirement is to create a system that ingests and analyzes credit card transactions in real-time, scores them for fraud risk, and alerts customers about suspicious transactions.
- Component Flow:
```mermaid
flowchart LR
  A["Card Transaction Platform"] --> B["Fraud-Risk Engine"];
  B --> C["Policy/Decision Engine"];
  C --> D["Notification Providers"];
```
- Integration Points: Upstream: Card authorization/transaction platform; Downstream: Fraud-risk engine/model, Policy/decision engine, Notification providers.
- Key Assumptions: A fraud-risk scoring model is available for integration. The system can connect to various notification providers (Push, SMS, Email).
- NFR Highlights: High availability and low latency for risk evaluation and alert triggering to meet transaction-time SLA. System must be scalable to handle transaction spikes.
- Data Flow: Transaction data is ingested from the card platform, scored for risk by the fraud engine, evaluated against alert thresholds by the policy engine, and if deemed suspicious, an alert is dispatched via notification providers.
#### 2. Validation Report
- Requirements Coverage: The design covers the epic's stated scope, including real-time transaction ingestion, risk scoring, and multi-channel alerting.