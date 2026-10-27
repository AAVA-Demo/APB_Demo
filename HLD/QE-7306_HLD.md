# High-Level Design (HLD) – QE-7306 – Monthly Spending Summary Dashboard

## 1. Architecture Overview

### 1.1 Context & Objectives
The solution provides an enterprise-grade, responsive dashboard for visualizing credit card spending and related metrics. It must:
- Present monthly spend summaries and utilization metrics.
- Manage multiple credit cards and their key attributes.
- Display and filter transaction data efficiently.
- Provide analytics and charts for spending patterns.
- Support budget tracking indicators.
- Be responsive across mobile, tablet, and desktop form factors.

All processing is read-oriented analytics and visualization; payment execution, card lifecycle management, and upstream data ingestion are explicitly out of scope (assumed to be handled by upstream systems and ETL jobs).

### 1.2 High-Level Architecture (Mermaid Diagram)
```mermaid
flowchart LR
    subgraph ClientLayer[Client Layer]
        WUI[Web UI (Responsive SPA)]
        MUI[Mobile/Tablet Layout Engine]
    end

    subgraph EdgeLayer[API & Edge Layer]
        APIGW[API Gateway]
        AUTH[Identity & Access Service]
    end

    subgraph DomainLayer[Domain Services]
        DSHSRV[Dashboard Aggregation Service]
        CRDSRV[Card Portfolio Service]
        TRNSRV[Transaction Query Service]
        ANASRV[Spending Analytics Service]
        BDGSRV[Budget Tracking Service]
        CFGSRV[Configuration & Reference Data Service]
    end

    subgraph DataLayer[Data Stores]
        CDB[(Customer & Card Metadata DB)]
        TDB[(Transaction Data Store)]
        ADB[(Analytics Aggregates Store)]
        BDB[(Budget Config & Metrics DB)]
    end

    subgraph IntegrationLayer[Integration & ETL]
        ETL[ETL/Batch Ingestion Jobs]
        SRCBANK[Bank/Card Provider Data Feeds]
    end

    subgraph CrossCutting[Cross-Cutting Services]
        LOG[Centralized Logging & Audit]
        MON[Monitoring & Metrics]
        SECVAULT[Secrets Vault]
    end

    WUI -- HTTPS/JSON --> APIGW
    MUI -- HTTPS/JSON --> APIGW

    APIGW -- OAuth2/JWT --> AUTH
    APIGW --> DSHSRV
    APIGW --> CRDSRV
    APIGW --> TRNSRV
    APIGW --> ANASRV
    APIGW --> BDGSRV

    DSHSRV --> CDB
    DSHSRV --> ADB
    CRDSRV --> CDB
    TRNSRV --> TDB
    ANASRV --> TDB
    ANASRV --> ADB
    BDGSRV --> BDB
    CFGSRV --> CDB

    ETL --> CDB
    ETL --> TDB
    ETL --> ADB
    ETL --> BDB
    SRCBANK --> ETL

    DSHSRV --> LOG
    CRDSRV --> LOG
    TRNSRV --> LOG
    ANASRV --> LOG
    BDGSRV --> LOG

    LOG --> MON
    APIGW --> MON

    APIGW --> SECVAULT
    DSHSRV --> SECVAULT
    CRDSRV --> SECVAULT
    TRNSRV --> SECVAULT
    ANASRV --> SECVAULT
    BDGSRV --> SECVAULT
```

## 2. Component Descriptions

### 2.1 Client Layer

**Web UI (Responsive SPA)**
- Single Page Application (e.g., React/Angular/Vue) providing:
  - Monthly dashboard summary tiles (total spend, credit limit, available credit, outstanding amount, utilization percentage, number of transactions).
  - Card management views listing multiple cards and key attributes.
  - Transaction table with sorting, filtering, and search.
  - Charts for category-wise spend, monthly trends, card-wise distribution, and category breakdown.
  - Budget tracking widgets with progress bars and remaining budget visualization.
  - Recent transactions widget (latest 5 transactions).
- Implements responsive layout with breakpoints for mobile, tablet, and desktop.
- Handles client-side input validation and safe rendering, with no display of full primary account numbers (masked card number only).

**Mobile/Tablet Layout Engine**
- Responsive styling and layout rules shared with desktop but optimized for smaller screens.
- Adjusts the order and density of widgets (e.g., stacking tiles, collapsing filters into drawers, simplifying charts).

### 2.2 API & Edge Layer

**API Gateway**
- Single entry point for all dashboard-related APIs.
- Responsibilities:
  - Route requests to specific domain services.
  - Enforce TLS, rate limiting, and request size limits.
  - Apply authentication and authorization policies via identity service.
  - Normalize response formats and error envelopes.
- Exposes versioned REST endpoints:
  - `/v1/dashboard/summary`
  - `/v1/cards`
  - `/v1/transactions`
  - `/v1/analytics/*` (category, trend, distribution)
  - `/v1/budget/summary`

**Identity & Access Service**
- Provides OAuth2/OIDC authentication, issuing JWT access tokens.
- Supports RBAC (e.g., `CARD_DASHBOARD_VIEWER` role) and optional ABAC (e.g., tenant/account ownership attributes).
- Manages user sessions and token introspection.

### 2.3 Domain Services

**Dashboard Aggregation Service**
- Composes data from card, transaction, analytics, and budget services to power the main dashboard summary.
- Responsibilities:
  - Compute total monthly spend, available credit, outstanding amount, utilization percentage, and number of transactions.
  - Retrieve and aggregate pre-calculated metrics from analytics store when available.
  - Enforce user scoping (only cards/accounts belonging to the authenticated user/tenant).

**Card Portfolio Service**
- Manages read-only views of multiple credit cards for a user.
- Responsibilities:
  - Retrieve list of cards and attributes (card name, issuing bank, masked card number, credit limit, available credit, current outstanding, billing date, due date).
  - Enforce data masking for card identifiers.
  - Support efficient pagination and filtering by issuing bank or card.
  - Provide derived metrics needed by dashboard summary (e.g., total credit limit).

**Transaction Query Service**
- Provides query APIs for credit card transactions.
- Responsibilities:
  - Expose filtered transaction lists based on date range, merchant name, category, bank, card, payment status, and sorting by amount/date.
  - Return transaction attributes (transaction date, merchant name, category, card used, amount, payment status, remarks).
  - Support pagination and server-side sorting.
  - Enforce per-user scoping and category normalization through reference data.

**Spending Analytics Service**
- Computes and serves analytics for spending patterns.
- Responsibilities:
  - Category-wise spending aggregates for current and past months.
  - Monthly spending trend over selected time windows.
  - Card-wise spending distribution.
  - Category breakdown with mapping to standard categories (food & dining, fuel, shopping, travel, entertainment, utilities, healthcare, education, miscellaneous).
  - Leverage pre-aggregated data in analytics store or compute on demand with caching.

**Budget Tracking Service**
- Manages budget configuration and computing utilization metrics.
- Responsibilities:
  - Store monthly budget values at user/tenant level.
  - Compute current spend vs. budget for the selected month.
  - Calculate remaining budget and budget utilization percentage.
  - Provide data required for progress bar visualization.
- Budget configuration changes beyond read access are assumed to be handled through existing UIs or upstream processes; creating/updating budget values is treated as configurable but details can be implemented under future enhancements.

**Configuration & Reference Data Service**
- Centralizes reference data such as categories and mapping logic.
- Responsibilities:
  - Maintain category dictionary and mapping rules for transactions.
  - Provide category metadata to UI and analytics service.

### 2.4 Data Stores

**Customer & Card Metadata DB**
- Relational database or key-value store containing card and user metadata.
- Stores:
  - Card identifiers (stored in tokenized/masked form where applicable).
  - Card attributes (issuing bank, credit limit, billing/due dates, account relationships).
  - User-to-card mapping.
- Enforces encryption at rest and column-level masking for sensitive fields.

**Transaction Data Store**
- Optimized for read-heavy analytics workloads (e.g., columnar store, data warehouse, or OLTP + analytics view).
- Stores transaction records with dimensions: date/time, merchant, category, card, amount, payment status, remarks.
- Partitioned by date and possibly by tenant/user for efficient range queries.

**Analytics Aggregates Store**
- Stores precomputed aggregates for category, monthly, and card-wise analytics.
- May be implemented as materialized views, OLAP cubes, or pre-aggregated tables.

**Budget Config & Metrics DB**
- Stores budget configuration per user/tenant and tracking snapshots.
- Contains:
  - Monthly budget amounts.
  - Optional budget categories.
  - Derived metrics for quick retrieval.

### 2.5 Integration & ETL Layer

**ETL/Batch Ingestion Jobs**
- Periodically ingest card, transaction, and budget data from upstream systems (card processors, core banking, external feeds).
- Responsibilities:
  - Normalize schemas and enrich data with categories according to reference rules.
  - Write data into card, transaction, analytics, and budget stores.
  - Handle idempotency and late-arriving data.

**Bank/Card Provider Data Feeds**
- Represent upstream providers and internal systems supplying transaction and card data.
- Out of scope: establishing new feed contracts, real-time transaction pipelines, and settlement processes.

### 2.6 Cross-Cutting Services

**Centralized Logging & Audit**
- Capture API requests/responses (metadata only, no sensitive payload fields), domain events, and key user actions (dashboard access, filter changes).
- Provide structured logs for diagnostics and compliance.

**Monitoring & Metrics**
- Collects service-level metrics (latency, error rate, throughput) and dashboard usage metrics.
- Supports alerting on SLO breaches and ETL failures.

**Secrets Vault**
- Securely stores secrets such as database credentials, API keys, and encryption keys.
- Integrates with all services via managed identity or service principal.


## 3. Integration Points & Data Flow

### 3.1 Flow 1 – Authentication & Session Establishment
1. User opens the dashboard UI (web or mobile layout).
2. UI redirects user to the Identity & Access Service via the API Gateway for authentication (OIDC/OAuth2).
3. User authenticates (e.g., username/password + MFA); identity service issues an access token.
4. UI stores token securely (in-memory or secure storage) and attaches it to subsequent API requests.
5. API Gateway validates token on each call (signature, expiry, scopes, roles) before routing.

Scope Coverage:
- Supports secure access to all dashboard features (all scope items via secure entry).

### 3.2 Flow 2 – Dashboard Summary Retrieval
1. UI calls `/v1/dashboard/summary` via API Gateway, including query parameters such as month.
2. API Gateway authenticates/authorizes the request and forwards it to Dashboard Aggregation Service.
3. Dashboard Aggregation Service:
   - Queries Card Portfolio Service for cards and aggregate credit metrics (total credit limit, available credit, outstanding amounts).
   - Queries Spending Analytics Service for total monthly spend and utilization percentage, or computes from transactions if not pre-aggregated.
   - Queries Transaction Query Service for count of transactions in the selected month.
4. Services fetch data from respective stores:
   - Card Portfolio → Customer & Card Metadata DB.
   - Spending Analytics → Analytics Aggregates Store and/or Transaction Data Store.
   - Transaction Query → Transaction Data Store (count only).
5. Dashboard Aggregation Service composes response with:
   - Total Monthly Spend.
   - Total Credit Limit.
   - Available Credit.
   - Outstanding Amount.
   - Utilization Percentage.
   - Number of Transactions.
6. API Gateway returns the response to the UI for rendering summary tiles.

Scope Coverage:
- Dashboard Summary (total monthly spend, total credit limit, available credit, outstanding amount, utilization percentage, number of transactions).

### 3.3 Flow 3 – Card Management View
1. UI calls `/v1/cards` via API Gateway.
2. API Gateway forwards request to Card Portfolio Service after token validation.
3. Card Portfolio Service queries Customer & Card Metadata DB for all cards belonging to the authenticated user.
4. Service constructs response with card attributes (name, issuing bank, masked card number, credit limit, available credit, current outstanding, billing date, due date) and applies masking rules.
5. Response returned to UI and presented in card management sections, with responsive layout behavior.

Scope Coverage:
- Credit Card Management (display multiple credit cards, with all card attributes).

### 3.4 Flow 4 – Transaction Management & Filtering
1. User opens transactions tab; UI calls `/v1/transactions` with default filters (current month, all cards).
2. API Gateway forwards to Transaction Query Service.
3. Transaction Query Service builds a query against Transaction Data Store using filters:
   - Date range (default or user-selected).
   - Merchant name search.
   - Category filters.
   - Bank and card filters.
   - Sorting (amount or date).
4. Transaction Query Service executes paginated query and returns:
   - Transaction Date.
   - Merchant Name.
   - Category.
   - Card Used (masked identifier or alias).
   - Amount.
   - Payment Status.
   - Remarks.
5. UI renders transactions in a responsive table, enabling user to adjust filters and sorting parameters, and reissues requests as needed.

Scope Coverage:
- Transaction Management (responsive table, filters and search, sorting).

### 3.5 Flow 5 – Spending Analytics Charts
1. UI opens Analytics section and calls one or more analytics endpoints via API Gateway:
   - `/v1/analytics/categories` for category-wise spending.
   - `/v1/analytics/monthly-trend` for monthly spending trend.
   - `/v1/analytics/card-distribution` for card-wise spending distribution.
2. API Gateway forwards requests to Spending Analytics Service.
3. Spending Analytics Service:
   - Reads pre-aggregated data from Analytics Aggregates Store.
   - If not available or stale, queries Transaction Data Store and recomputes aggregates, then updates Analytics Aggregates Store.
   - Applies category mapping using Configuration & Reference Data Service.
4. Service returns structured data series suitable for chart rendering, with categories (food & dining, fuel, shopping, travel, entertainment, utilities, healthcare, education, miscellaneous).
5. UI renders charts responsive to viewport size.

Scope Coverage:
- Spending Analytics (category-wise spending, monthly trend, card-wise distribution, category breakdown with defined categories).

### 3.6 Flow 6 – Budget Tracking & Progress
1. UI calls `/v1/budget/summary` via API Gateway for the selected month.
2. API Gateway forwards to Budget Tracking Service.
3. Budget Tracking Service:
   - Reads monthly budget configuration for the user from Budget Config & Metrics DB.
   - Fetches current spend for the selected month from Analytics Aggregates Store or Transaction Data Store.
   - Computes remaining budget and budget utilization percentage.
4. Service returns:
   - Monthly Budget.
   - Current Spend.
   - Remaining Budget.
   - Budget Utilization %.
5. UI renders progress bars and budget indicators; responsive behavior adjusts placement and size of widgets.

Scope Coverage:
- Budget Tracking (monthly budget, current spend, remaining budget, budget utilization %, progress bar).

### 3.7 Flow 7 – Recent Transactions Widget
1. UI calls `/v1/transactions/recent?limit=5` (or uses `/v1/transactions` with appropriate sorting and limit).
2. API Gateway routes to Transaction Query Service.
3. Transaction Query Service fetches the latest N transactions for the user from Transaction Data Store.
4. UI renders the latest 5 transactions in the recent transactions widget.

Scope Coverage:
- Recent Transactions Widget (show latest 5 transactions).

### 3.8 Flow 8 – Responsive Design Rendering
1. UI detects viewport size or device type.
2. UI uses responsive layout engine to adjust components:
   - Reflow dashboard tiles.
   - Stack charts and tables.
   - Collapse filters into drawers or accordions.
3. API layer and backend services remain unchanged; only client rendering differs.

Scope Coverage:
- Responsive Design (mobile, tablet, desktop friendly).


## 4. Security & Compliance Features

### 4.1 Transport Security
- All client-to-API Gateway communication uses HTTPS with TLS 1.2+.
- Mutual TLS between API Gateway and backend services where supported.
- HSTS enabled at the edge.

### 4.2 Data Encryption & Protection
- Encryption at rest for all data stores (CDB, TDB, ADB, BDB).
- Column-level encryption and masking for card-related fields; only masked card numbers and non-sensitive attributes are exposed to UI.
- Secrets Vault used for managing encryption keys; keys rotated according to policy.

### 4.3 Identity, RBAC/ABAC
- OAuth2/OIDC-based authentication; short-lived access tokens.
- RBAC to restrict dashboard features to authorized roles (e.g., customer vs. internal analyst views).
- Optional ABAC using tenant or account attributes encoded in token claims to ensure users only see their own cards and transactions.

### 4.4 Input Validation & Output Filtering
- Client-side validation for filters and inputs (date ranges, numeric constraints).
- API Gateway and services perform server-side validation:
  - Whitelisting of sortable and filterable fields.
  - Range limits on date filters and page size.
- Output filtering ensures:
  - No unmasked card numbers or other sensitive identifiers are returned.
  - No PII/PCI sample data is embedded in logs or test datasets.

### 4.5 Audit Logging & Observability
- API Gateway captures high-level access logs (user/tenant IDs, endpoints, response codes) without sensitive payload fields.
- Domain services log key events (e.g., dashboard summary generation, analytics refresh) with correlation IDs.
- Logs ingested into centralized logging platform with retention per policy.

### 4.6 Compliance Mapping
- Payment/PCI data is limited to masked card numbers and aggregate metrics; no full PAN, CVV, or track data is handled by this dashboard.
- If integrated in a PCI environment, this design assumes:
  - Card data handling is constrained to tokens/masked values only.
  - Full PAN and other sensitive authentication data remain in upstream, segmented systems.
- Regulatory reporting, dispute handling, and payment execution are out of scope and remain in other systems.


## 5. Resiliency & Error Handling

### 5.1 Service Resiliency
- API Gateway employs per-service timeouts and circuit breakers.
- Domain services use retry policies (with backoff and jitter) for transient failures when accessing data stores.
- ETL jobs are idempotent and support rerun on failure.

### 5.2 Graceful Degradation
- If analytics service or aggregates store is unavailable:
  - Dashboard Aggregation Service may fall back to partial metrics (e.g., card metrics without advanced analytics) and mark analytics widgets as temporarily unavailable.
- If transaction data store is degraded:
  - UI informs the user that detailed transaction lists are unavailable while still showing high-level card metrics where possible.
- Recent transactions widget degrades independently; failure does not block the rest of the dashboard.

### 5.3 Error Handling & Status Codes
- Standard REST error model:
  - `400 Bad Request` – invalid filters, unsupported sort fields, or malformed parameters.
  - `401 Unauthorized` – missing/invalid token.
  - `403 Forbidden` – valid token but insufficient permission.
  - `404 Not Found` – resource not found (e.g., non-existent card for user).
  - `429 Too Many Requests` – rate limit exceeded.
  - `500 Internal Server Error` – unexpected backend failure.
- Error responses include correlation ID and generic messages safe for user display; internal details remain only in logs.

### 5.4 Observability
- Metrics:
  - Request throughput, latency, error rate per endpoint.
  - Dashboard load time and time-to-first-byte for key views.
- Tracing:
  - Distributed tracing across API Gateway and domain services using correlation IDs.
- Alerts:
  - Threshold-based alerts on high error rates, unusual latency, or ETL failures.


## 6. Validation Report

### 6.1 Requirements Coverage (Scope → Components/Flows)

1. **Dashboard Summary (Total Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount, Utilization %, Number of Transactions)**
   - Components: Dashboard Aggregation Service, Card Portfolio Service, Spending Analytics Service, Transaction Query Service, API Gateway, Web UI.
   - Flows: Flow 2 (Dashboard Summary Retrieval), Flow 1 (Authentication & Session).

2. **Credit Card Management – Display Multiple Cards (Card Name, Issuing Bank, Masked Card Number, Credit Limit, Available Credit, Current Outstanding, Billing Date, Due Date)**
   - Components: Card Portfolio Service, Customer & Card Metadata DB, API Gateway, Web UI.
   - Flows: Flow 3 (Card Management View), Flow 1 (Authentication & Session).

3. **Transaction Management – Responsive Table (Transaction Date, Merchant Name, Category, Card Used, Amount, Payment Status, Remarks)**
   - Components: Transaction Query Service, Transaction Data Store, Web UI, API Gateway.
   - Flows: Flow 4 (Transaction Management & Filtering).

4. **Filters and Search (Search by Merchant, Filter by Category, Bank, Card, Date Range; Sort by Amount, Date)**
   - Components: Transaction Query Service, Web UI (filter UI), API Gateway.
   - Flows: Flow 4 (Transaction Management & Filtering).

5. **Spending Analytics (Category-wise Spending, Monthly Spending Trend, Card-wise Spending Distribution)**
   - Components: Spending Analytics Service, Analytics Aggregates Store, Transaction Data Store, Configuration & Reference Data Service, Web UI, API Gateway.
   - Flows: Flow 5 (Spending Analytics Charts).

6. **Category Breakdown with Fixed Categories (Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous)**
   - Components: Spending Analytics Service, Configuration & Reference Data Service, Web UI.
   - Flows: Flow 5 (Spending Analytics Charts).

7. **Budget Tracking (Monthly Budget, Current Spend, Remaining Budget, Budget Utilization %, Progress Bar)**
   - Components: Budget Tracking Service, Budget Config & Metrics DB, Analytics Aggregates Store, Web UI, API Gateway.
   - Flows: Flow 6 (Budget Tracking & Progress).

8. **Recent Transactions Widget (Latest 5 Transactions)**
   - Components: Transaction Query Service, Transaction Data Store, Web UI.
   - Flows: Flow 7 (Recent Transactions Widget).

9. **Responsive Design (Mobile Friendly, Tablet Friendly, Desktop Friendly)**
   - Components: Web UI (Responsive SPA), Mobile/Tablet Layout Engine.
   - Flows: Flow 8 (Responsive Design Rendering).

### 6.2 Compliance Status

- **Authentication & Authorization**: **Pass**
  - Justification: OAuth2/OIDC-based authentication, RBAC, optional ABAC; all endpoints protected by API Gateway.

- **Transport Security**: **Pass**
  - Justification: TLS enforced end-to-end, HSTS, optional mTLS.

- **Data Protection (Card & Transaction Data)**: **Pass-with-conditions**
  - Justification: Design assumes only masked card numbers and non-sensitive attributes are exposed; full PAN and sensitive authentication data remain upstream. Implementation must ensure masking and column-level encryption policies are correctly configured.

- **Logging & Monitoring**: **Pass**
  - Justification: Centralized logging with PII/PCI suppression, metrics, and alerting defined.

- **Privacy/PII Handling**: **Pass-with-conditions**
  - Justification: Design avoids storing or displaying real PII samples. Implementation teams must ensure data minimization and masking policies align with organizational privacy standards.

- **PCI-DSS (if applicable)**: **Pass-with-conditions**
  - Justification: Dashboard operates primarily on masked card data and aggregates; PCI scope is minimized but remains dependent on upstream segmentation and network controls outside this HLD.

### 6.3 Identified Ambiguities/Risks

1. **Scope of Budget Configuration (Create/Update)**
   - Ambiguity: It is unclear whether users can configure or update budgets directly via this dashboard or if budgets are maintained in another system.
   - Consequence: Inconsistent budget values or user confusion if UI shows budget metrics but no configuration path.
   - Mitigation: Clarify ownership of budget lifecycle in a follow-up epic; if budgets are editable, define dedicated endpoints and UI flows, and update this HLD accordingly.

2. **Historical Window for Analytics & Trends**
   - Ambiguity: Exact time range for monthly trends and analytics (e.g., last 6 months, last 12 months) is unspecified.
   - Consequence: Storage, performance, and UX expectations might diverge; dashboards may show inconsistent ranges across views.
   - Mitigation: Product team to define standard time windows; configuration to be externalized via configuration service.

3. **Multi-Tenancy & Segregation Requirements**
   - Ambiguity: Degree of tenant isolation (e.g., per-tenant schema vs. shared schema with tenant key) is not specified.
   - Consequence: Incorrect multi-tenant strategy may complicate compliance audits and data isolation guarantees.
   - Mitigation: Architecture review with security/compliance teams to select appropriate tenancy model before implementation.

4. **Upstream Data Latency and Freshness**
   - Ambiguity: Frequency of ETL jobs and tolerance for data staleness are not defined.
   - Consequence: Users may perceive discrepancies between dashboard and real-time card activity.
   - Mitigation: Define SLAs for data freshness (e.g., updates every N minutes/hours) and expose last-refresh timestamp in UI.

5. **Out-of-Scope Functions (Payments, Disputes, Card Lifecycle)**
   - Ambiguity: While payment execution and card lifecycle operations are out of scope, the UI may still provide navigation links.
   - Consequence: User expectations for end-to-end workflows may not be met if navigation is not clearly delineated.
   - Mitigation: Ensure that any navigation to out-of-scope functions is clearly labeled and redirects to existing systems without exposing partial or non-functional features.


---

*This HLD intentionally omits any real PII/PHI/PCI values and uses only structural descriptions and placeholder concepts to ensure compliance with data protection requirements.*