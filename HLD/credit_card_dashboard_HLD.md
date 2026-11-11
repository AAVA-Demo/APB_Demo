# Credit Card Analysis Dashboard – High Level Design

## 1. Architecture Narrative

### 1.1 Overview
The **Credit Card Analysis Dashboard** is a web-based, read-only analytics application that provides users with a consolidated and interactive view of their credit cards, transactions, and financial KPIs. The solution is intentionally decoupled from real banking systems and operates entirely on **non-bank / mock data sources** while still enforcing security, data protection, and modern UX standards.

The system is composed of:
- A **Responsive Web UI** (SPA) built on a modern front-end framework.
- A set of **Backend APIs** exposing cards, transactions, and analytics data.
- An **Analytics & KPI Service Layer** that centralizes calculation rules (Monthly Spend, Available Credit, etc.).
- A **Mock Data & Persistence Layer** hosting card and transaction data using non-bank sources.
- Supportive **cross-cutting services** for security, configuration, logging, and monitoring.

All capabilities in functional specs FS-001 to FS-018 are realized by orchestrating these components over secure HTTP(S) within the organization’s web and application hosting environment.

### 1.2 Logical Component View

1. **Web UI (Dashboard SPA)**  
   - Single-page application (React/Vue/Angular) delivering:
     - Card list/tiles with per-card metrics.
     - KPI tiles (Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount).
     - Transaction feed.
     - Analytics visualizations: monthly spend trends, card-wise and category-wise spending.
   - Implements responsive layout, interactive charts, and local UI state (filters, date ranges, sorting, etc.).
   - Communicates with backend via REST/JSON APIs.

2. **API Gateway / Backend-for-Frontend (BFF)**  
   - Optional but recommended façade between UI and internal services.
   - Exposes coarse-grained endpoints tailored to UI screens, for example:
     - `GET /dashboard/summary` – cards, high-level KPIs, minimal transaction sample for FS-014, FS-017.
     - `GET /dashboard/transactions` – paged, filtered transaction feed for FS-015.
     - `GET /analytics/monthly-spend` – aggregated monthly spend and trend data for FS-005, FS-009, FS-010.
     - `GET /analytics/category-spend` – category-wise spending for FS-012, FS-018.
   - Orchestrates calls to data services and analytics services, merging responses into UI-friendly payloads.
   - Enforces business rules that UI must not expose payment, transfer, or loan actions (BR-003, BR-004, BR-005).

3. **Card Service**  
   - Manages CRUD for credit card entities (within mock/non-bank constraints).
   - Responsible for:
     - Creating, editing, removing cards (FS-002, FS-003, FS-004).
     - Retrieving consolidated card views and per-card metrics (FS-001, FS-016).
     - Maintaining card attributes used by analytics (credit limit, outstanding amount, available credit inputs).
   - Exposes APIs such as:
     - `GET /cards` – list cards for user.
     - `POST /cards` – add card.
     - `PUT /cards/{id}` – edit card.
     - `DELETE /cards/{id}` – logical delete.

4. **Transaction Service**  
   - Manages transaction entities and supports querying by user, card, date range, and category.
   - Provides the data foundation for Monthly Spend, card-wise spend, and category-wise analytics.
   - Exposes APIs such as:
     - `GET /transactions` – list transactions for user with filters, pagination (FS-015).
     - `GET /transactions/summary` – pre-filtered transaction sets for analytics services.
   - Enforces data model constraints: each transaction has card reference, category, amount, date (TN-011, TN-013).

5. **Analytics & KPI Service**  
   - Centralizes all derived metrics and aggregation logic to ensure consistency across UI widgets and pages.
   - Implements business rules and technical notes for KPIs and analytics (BR-001, BR-002, BR-007, BR-008; TN-009–TN-012, TN-016, TN-017).
   - Key responsibilities:
     - **Monthly Spend KPI** (FS-005, FS-009, FS-010):
       - Compute monthly spend per user based on configured period rules (calendar vs. billing; TN-011, TN-017).
       - Provide both scalar value (current month) and time-series data for trends.
     - **Total Credit Limit KPI** (FS-006):
       - Aggregate credit limits across selected cards.
     - **Outstanding Amount KPI** (FS-008):
       - Aggregate outstanding balances across cards.
     - **Available Credit KPI** (FS-007):
       - Compute per-card and aggregate available credit using configurable formula:  
         `available_credit_card = credit_limit_card – outstanding_amount_card`  
         `available_credit_total = Σ available_credit_card` or derived from totals (TN-009, TN-016).
     - **Card-wise Spend** (FS-011):
       - Aggregate transaction amounts per card over selected period.
     - **Category-wise Spend** (FS-012, FS-013, FS-018):
       - Aggregate transaction amounts per category over time.
       - Enforce supported category set and mapping rules.
   - May leverage database aggregation (SQL GROUP BY, materialized views) and/or pre-computed summaries (TN-010, TN-012) for performance.

6. **Category & Reference Data Service**  
   - Maintains reference data such as spending categories and possibly configuration of KPI formulas and time windows.
   - Provides read APIs used by Transaction Service and Analytics & KPI Service to validate and interpret categories (FS-012, FS-013).
   - Supports future category extension scenarios.

7. **Mock Data Source & Persistence Layer**  
   - Provides secure, non-bank storage for cards and transactions in line with TN-003, TN-005, TN-018.
   - Components:
     - **Application Database** (e.g., PostgreSQL/MySQL/SQL Server):
       - Tables: `users`, `cards`, `transactions`, `categories`, optional `kpi_monthly_aggregates`.
       - Enforces referential integrity between cards and transactions.
       - Indexed on user id, card id, transaction date for efficient analytics queries (TN-010, TN-012).
     - **Mock Data Generation/Seeding Tools**:
       - Scripts or admin UI to generate synthetic cards and transactions for demo/test (TN-005).
   - Explicitly **no connectivity** to real banks or payment gateways; all data is synthetic or user-entered (BR-006, TN-004, TN-006, TN-018).

8. **Admin / Data Management UI (Optional)**  
   - Internal-only UI for administrators or testers to:
     - Seed card and transaction data.
     - Clean/recycle demo data sets.
   - Not user-facing and does not expose payments/loans/transfers.

9. **Security & Access Layer**  
   - Provides application-level authentication and authorization for multi-user deployments (TN-014, TN-015).
   - For the current scope, **authentication behavior is TBD** (FS-001 precondition) but the architecture supports:
     - Session-based or token-based authentication (e.g., OAuth2/OpenID Connect) for dashboard access.
     - Per-user scoping of data queries (all card and transaction calls filtered by user identity).
   - Implements role-based access to admin tooling where applicable.

10. **Observability & Operations**  
    - Common logging, tracing, and metrics stack (TN-019) for:
      - API call latencies, error rates, and volume.
      - Dashboard usage (page loads, chart interactions, filter usage).
    - Helps ensure performance and stability of responsive UI and analytics.

### 1.3 Interaction Overview

1. **Dashboard Load (FS-001, FS-005–FS-008, FS-014, FS-016, FS-017)**
   - User accesses dashboard URL.
   - Web UI invokes `GET /dashboard/summary` on BFF.
   - BFF:
     - Calls Card Service to fetch cards and per-card metrics.
     - Calls Analytics & KPI Service for Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount.
     - Optionally calls Transaction Service for a small, recent transaction subset.
   - BFF composes single payload; UI renders:
     - Card tiles (with per-card metrics).
     - KPI tiles.
     - Unified layout (cards, KPIs, sample transactions, key charts).

2. **Add/Edit/Remove Card (FS-002, FS-003, FS-004)**
   - User interacts with relevant UI forms or dialogs in Web UI.
   - Web UI calls Card Service APIs via BFF or directly.
   - Card Service validates input (business rules, numeric ranges), persists changes to database, and triggers recalculation path:
     - Analytics & KPI Service either recomputes KPIs on demand or uses updated underlying card values in next dashboard load.
   - UI refreshes the consolidated card view and affected KPIs.

3. **View Transactions (FS-015)**
   - User scrolls to transaction section or opens dedicated transaction view.
   - Web UI calls `GET /dashboard/transactions` or `GET /transactions` with parameters for user, date range, filters.
   - Transaction Service queries database, orders results, returns paginated list.
   - UI renders transaction feed and supports filters (date, card, category).

4. **Monthly Spend and Trends (FS-005, FS-009, FS-010)**
   - Web UI calls Analytics & KPI Service for Monthly Spend (current period) and monthly trend series.
   - Analytics & KPI Service retrieves transactions from Transaction Service or database views, aggregates by month, and returns results.
   - UI renders KPI tile and interactive chart (line/bar) for trends.

5. **Card-wise and Category-wise Analytics (FS-011, FS-012, FS-013, FS-018)**
   - Web UI requests analytics endpoints:
     - `GET /analytics/card-spend`.
     - `GET /analytics/category-spend` (including category list from Category Service).
   - Analytics & KPI Service aggregates transaction data accordingly and returns per-card and per-category totals.
   - UI renders visualizations (bar/pie/donut charts) with hover tooltips and clickable legends/filters; interactions manipulate front-end filters while data originates from backend aggregations.

6. **Unified Experience (FS-014, FS-017)**
   - Dashboard UI composes cards, KPIs, transaction feed, and analytics visualizations on a single page/route.
   - Internal navigation and deep links (e.g., from KPI tile to detailed analytics section) remain within the same SPA; no redirection to external banking systems.


## 2. Components and Functional Mapping

### 2.1 Component List

Below, each component lists its main responsibility and the functional specs it implements.

1. **Web UI (Dashboard SPA)**  
   - **Responsibility:** Render responsive dashboard screens, capture user interactions (filters, forms), and call backend APIs. Provide interactive visualizations and unified view of cards, KPIs, and transactions.  
   - **Implements:** FS-001, FS-002, FS-003, FS-004, FS-005, FS-006, FS-007, FS-008, FS-009, FS-010, FS-011, FS-012, FS-013, FS-014, FS-015, FS-016, FS-017, FS-018.

2. **API Gateway / Backend-for-Frontend (BFF)**  
   - **Responsibility:** Provide tailored dashboard endpoints that orchestrate Card, Transaction, Analytics, and Category services. Enforce high-level business rules and shape payloads for optimal UI consumption.  
   - **Implements:** FS-001, FS-005, FS-006, FS-007, FS-008, FS-009, FS-010, FS-011, FS-012, FS-014, FS-015, FS-016, FS-017.

3. **Card Service**  
   - **Responsibility:** Manage lifecycle and retrieval of credit card entities, including metadata and financial attributes needed for KPIs, while ensuring no real bank interaction.  
   - **Implements:** FS-001, FS-002, FS-003, FS-004, FS-006, FS-007, FS-008, FS-016, FS-017.

4. **Transaction Service**  
   - **Responsibility:** Manage and query transaction records, including associations to cards and categories, providing raw data for KPIs and analytics and powering the transaction feed.  
   - **Implements:** FS-005, FS-007, FS-008, FS-009, FS-010, FS-011, FS-012, FS-014, FS-015, FS-016, FS-017.

5. **Analytics & KPI Service**  
   - **Responsibility:** Centralize all KPI formulas and aggregate queries, including Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount, monthly trends, card-wise and category-wise spend. Ensure consistent application of business rules BR-001, BR-002, BR-007, BR-008.  
   - **Implements:** FS-005, FS-006, FS-007, FS-008, FS-009, FS-010, FS-011, FS-012, FS-014, FS-016, FS-017.

6. **Category & Reference Data Service**  
   - **Responsibility:** Maintain and expose the standard spending category model, validate category assignments, and provide reference data to UI and analytics components.  
   - **Implements:** FS-012, FS-013, FS-018.

7. **Mock Data & Persistence Layer**  
   - **Responsibility:** Store card, transaction, category, and pre-aggregated KPI data in a secure, non-bank data store with appropriate indexing and masking, and support synthetic data seeding.  
   - **Implements:** FS-001, FS-002, FS-003, FS-004, FS-005, FS-006, FS-007, FS-008, FS-009, FS-010, FS-011, FS-012, FS-013, FS-014, FS-015, FS-016, FS-017.

8. **Admin / Data Management UI (Optional)**  
   - **Responsibility:** Provide internal tools for managing mock data sets (cards, transactions) to support demos, testing, and analytics validation.  
   - **Implements:** Indirectly supports all FS by providing underlying data; no direct mapping to numbered FS as it is non-user-facing.

9. **Security & Access Layer**  
   - **Responsibility:** Authenticate users, authorize access to their data, enforce session or token-based security, and ensure data is only visible to the owning user.  
   - **Implements:** Supports all user-facing FS where user-specific data access is required (FS-001–FS-018) but is modeled as a cross-cutting concern.

10. **Observability & Operations**  
    - **Responsibility:** Capture logs, metrics, and traces for all services, focusing on dashboard usage and analytics computation performance.  
    - **Implements:** Cross-cutting across all FS and services.

### 2.2 Functional Capability to Component Mapping

The table below maps each functional spec (FS-XXX) to the components that implement it.

| FS ID  | Capability Summary                                                          | Components                                                                                           |
|-------|------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| FS-001 | View consolidated dashboard of all user credit cards                        | Web UI; BFF; Card Service; Mock Data & Persistence                                                  |
| FS-002 | Add a new credit card to the dashboard                                      | Web UI; Card Service; Mock Data & Persistence                                                       |
| FS-003 | Edit an existing credit card’s details                                      | Web UI; Card Service; Mock Data & Persistence                                                       |
| FS-004 | Remove an existing credit card from the dashboard                           | Web UI; Card Service; Mock Data & Persistence                                                       |
| FS-005 | Display Monthly Spend KPI on the dashboard                                  | Web UI; BFF; Transaction Service; Analytics & KPI Service; Mock Data & Persistence                  |
| FS-006 | Display Total Credit Limit KPI across user’s credit cards                   | Web UI; BFF; Card Service; Analytics & KPI Service; Mock Data & Persistence                         |
| FS-007 | Display Available Credit KPI across user’s credit cards                     | Web UI; BFF; Card Service; Transaction Service; Analytics & KPI Service; Mock Data & Persistence    |
| FS-008 | Display Outstanding Amount KPI across user’s credit cards                   | Web UI; BFF; Card Service; Transaction Service; Analytics & KPI Service; Mock Data & Persistence    |
| FS-009 | View aggregated monthly spending across user’s credit cards                 | Web UI; BFF; Transaction Service; Analytics & KPI Service; Mock Data & Persistence                  |
| FS-010 | View visualized monthly spend trends over time                              | Web UI; Transaction Service; Analytics & KPI Service; Mock Data & Persistence                       |
| FS-011 | View card-wise spend analysis across user’s credit cards                    | Web UI; BFF; Transaction Service; Analytics & KPI Service; Mock Data & Persistence                  |
| FS-012 | View interactive visualizations for category-wise spending                  | Web UI; BFF; Transaction Service; Analytics & KPI Service; Category & Reference Data; Mock Data     |
| FS-013 | Support defined spending categories for analysis                            | Web UI; Category & Reference Data Service; Mock Data & Persistence                                  |
| FS-014 | View unified dashboard combining cards, transactions, and analytics         | Web UI; BFF; Card Service; Transaction Service; Analytics & KPI Service; Mock Data & Persistence    |
| FS-015 | View list/feed of credit card transactions                                  | Web UI; BFF; Transaction Service; Mock Data & Persistence                                           |
| FS-016 | View per-card credit limit, available credit, and outstanding balance       | Web UI; BFF; Card Service; Transaction Service; Analytics & KPI Service; Mock Data & Persistence    |
| FS-017 | View multiple cards & KPIs without navigating to external systems           | Web UI; BFF; Card Service; Transaction Service; Analytics & KPI Service; Mock Data & Persistence    |
| FS-018 | Interact with category-wise spending visualizations (hover, filters, etc.)  | Web UI; Analytics & KPI Service; Category & Reference Data Service; Mock Data & Persistence         |


## 3. Cross-Cutting Concerns

The following concerns apply across the architecture and are not repeated per component.

1. **Authentication & Authorization** (TN-014, TN-015; FS precondition references)  
   - Implement an auth mechanism appropriate to deployment (e.g., corporate SSO using OAuth2/OIDC) for the dashboard application.
   - All API calls from Web UI must carry user identity (JWT, session cookie). Backend services must derive a **userId** to scope all card and transaction queries.
   - Authorize admin-only features (data seeding tools) separately from end-user dashboard views.

2. **Security & Data Protection** (TN-014, TN-015, BR-003–BR-006)  
   - Enforce HTTPS for all web and API traffic.
   - Follow minimum data storage principles:
     - Store only masked card numbers (e.g., last 4 digits). Avoid or tokenize full PANs; if unavoidable, comply with PCI DSS.
     - Encrypt sensitive fields at rest (card identifiers, user identifiers) and in transit.
   - Explicitly **exclude** payment, fund transfer, and loan features from UI and APIs, enforcing BR-003, BR-004, BR-005.
   - Ensure the integration layer cannot be configured, even accidentally, to call real banking APIs (TN-004, TN-006, TN-018).

3. **Configuration Management & Business Rules** (TN-009, TN-011, TN-016, TN-017)  
   - Centralize configuration for:
     - KPI formulas (Available Credit, Outstanding Amount, Monthly Spend, etc.).
     - Inclusion rules for which cards participate in KPIs (all vs. subset).
     - Monthly period definitions (calendar month vs. billing cycle; timezone handling).
   - The Analytics & KPI Service should read these from configuration (files, DB config table, or feature flag system) to avoid hard-coding.

4. **Logging, Monitoring & Telemetry** (TN-019)  
   - Standardized structured logging across UI (JS console logs shipped to log collector) and backend services.
   - Metrics:
     - Dashboard load times, API latency, error rates.
     - Volume of transactions, number of cards per user.
     - Usage of interactive analytics features (e.g., category filters, hover events) for UX optimization.
   - Integrate with existing observability stack (e.g., ELK, Splunk, Azure Monitor, CloudWatch, Grafana).

5. **Error Handling & Resilience**  
   - Backend services must handle transient errors to the database and other services, returning meaningful HTTP status codes and localized error payloads.
   - BFF should degrade gracefully on partial failures:
     - Return what data is available for dashboard sections, marking failed sections with explicit error messages (FS-001-AF-02, FS-002-AF-02, FS-003-AF-03, FS-004-AF-02, FS-005-AF-02, FS-006-AF-02, FS-007-AF-02, FS-008-AF-02, FS-014-AF-02, FS-015-AF-03, FS-010-AF-02, FS-012-AF-03).
   - UI must show clear inline error/empty states and allow manual retry where appropriate.

6. **Performance & Scalability** (TN-010, TN-012)  
   - Use proper indexing and query optimization for card and transaction tables to support real-time aggregation.
   - For heavy historical data:
     - Introduce pre-computed aggregates (e.g., per-user per-month spend, per-card/month summaries) refreshed on schedule.
   - Use pagination and lazy loading for transaction feed and heavy visualizations.
   - Cache frequently accessed reference data (categories) and configuration on server side.

7. **Responsiveness & Accessibility** (TN-001, TN-002, TN-007, TN-008, TN-013, TN-020)  
   - Implement mobile-first responsive layout using a grid system (e.g., CSS Grid / Flexbox plus Tailwind/Bootstrap or corporate design system).
   - Use responsive chart components with automatic resizing and touch gestures where applicable.
   - Baseline accessibility:
     - Keyboard navigability for dashboard navigation and filters.
     - ARIA labels for charts and KPI tiles.
     - Sufficient color contrast and accessible color palette for categories and charts.

8. **Compliance with Scope Restrictions** (BR-003–BR-006, TN-004, TN-006, TN-018)  
   - Governance checks to ensure:
     - No payment gateway SDKs or endpoints are present in build artifacts.
     - No bank API endpoints or secrets are configured in any environment.
     - UI CTAs are strictly analytical (e.g., filters, drill-downs) and never transactional.


## 4. HLD JSON Representation

```json
{
  "components": [
    {
      "name": "web_ui_dashboard_spa",
      "responsibility": "Responsive single-page application that renders dashboards, KPIs, cards, transactions, and interactive analytics visualizations, and invokes backend APIs.",
      "implements": ["FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018"]
    },
    {
      "name": "api_gateway_bff",
      "responsibility": "Backend-for-frontend and/or API gateway that exposes coarse-grained dashboard endpoints, orchestrates calls to domain and analytics services, and shapes responses for the UI.",
      "implements": ["FS-001","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-014","FS-015","FS-016","FS-017"]
    },
    {
      "name": "card_service",
      "responsibility": "Service responsible for card CRUD operations and retrieval of card data and metrics, ensuring data is sourced only from mock/non-bank stores.",
      "implements": ["FS-001","FS-002","FS-003","FS-004","FS-006","FS-007","FS-008","FS-016","FS-017"]
    },
    {
      "name": "transaction_service",
      "responsibility": "Service responsible for managing transaction records, including querying by user, card, date range, and category, and providing raw data for KPIs and analytics.",
      "implements": ["FS-005","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-014","FS-015","FS-016","FS-017"]
    },
    {
      "name": "analytics_kpi_service",
      "responsibility": "Central analytics service that implements all KPI and aggregation logic for monthly spend, total credit limit, available credit, outstanding amount, monthly trends, card-wise and category-wise spend.",
      "implements": ["FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-014","FS-016","FS-017"]
    },
    {
      "name": "category_reference_data_service",
      "responsibility": "Service that maintains and exposes the canonical set of spending categories and related reference data, and validates category usage across transactions and analytics.",
      "implements": ["FS-012","FS-013","FS-018"]
    },
    {
      "name": "mock_data_persistence_layer",
      "responsibility": "Application database and associated data access layer for storing cards, transactions, categories, and pre-aggregated KPI data using solely mock/non-bank sources.",
      "implements": ["FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017"]
    },
    {
      "name": "admin_data_management_ui",
      "responsibility": "Internal administrative UI for seeding and maintaining mock card and transaction data to support demo and test scenarios.",
      "implements": []
    },
    {
      "name": "security_access_layer",
      "responsibility": "Cross-cutting authentication and authorization mechanisms ensuring only authorized users access their own dashboard data and internal admin tools.",
      "implements": []
    },
    {
      "name": "observability_operations_layer",
      "responsibility": "Cross-cutting logging, monitoring, and telemetry capabilities for all services and the UI.",
      "implements": []
    }
  ],
  "cross_cutting_concerns": [
    "Authentication and authorization for end users and admin roles, with all data access scoped to the authenticated user.",
    "Security and data protection including HTTPS, masked card numbers, encryption at rest, and explicit exclusion of payment, transfer, and loan capabilities.",
    "Centralized configuration of KPI formulas, inclusion rules for cards, and monthly period definitions, allowing formula changes without UI changes.",
    "Consistent logging, monitoring, and telemetry for API calls, dashboard usage, and analytics performance using the organization’s observability stack.",
    "Robust error handling and resilience with graceful degradation on partial failures and clear user-facing error messages and retry options.",
    "Performance and scalability through indexed queries, optional pre-aggregated metrics, pagination, and caching of reference data.",
    "Responsive design and accessibility across devices and browsers, including mobile-friendly charts, keyboard navigation, and appropriate ARIA labels.",
    "Governance and compliance checks to enforce the absence of real bank integrations, payment gateways, and prohibited financial operations in all environments."
  ],
  "narrative": "The Credit Card Analysis Dashboard is a responsive, read-only analytics application composed of a modern Web UI, a backend-for-frontend API layer, domain services for cards and transactions, an Analytics & KPI service, a category/reference service, and a secure mock data persistence layer. The architecture centralizes complex KPI and aggregation logic in the analytics service while keeping the UI focused on responsive rendering, interactivity, and unified experiences. All data resides in non-bank data stores and is retrieved via internal services that enforce business rules for scope, security, and data protection. Cross-cutting layers for security, configuration, logging, error handling, performance, and responsiveness ensure a robust, maintainable, and extensible solution that can evolve with future requirements without compromising compliance constraints."
}
```
