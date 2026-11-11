# Credit Card Analysis Dashboard – High-Level Design

## 1. Architecture Narrative

### 1.1 Context and Objectives
The **Credit Card Analysis Dashboard** is a read-only, responsive web application that provides credit card users with a consolidated view of multiple cards, KPIs, transactions, and analytics, including category-wise and card-wise spending insights. 

Key business objectives:
- Consolidate multiple credit cards in a single dashboard (BR-002, FS-001, FS-011).
- Improve visibility into **Monthly Spend** and **Outstanding Amount** as primary KPIs (BR-003, FS-002, FS-005).
- Provide **Category-wise** and **Card-wise** spending analytics to reveal spending patterns (BR-001, BR-004, FS-008, FS-009).
- Operate in a **read-only analytics scope**, with no payment initiation, fund transfers, loans, or payment gateway integration (TN-007, TN-009, TN-010, TN-011, TN-019, TN-020).
- Use **mock/simulated data sources** with a clear boundary for future integration with real bank APIs (TN-004, TN-006, TN-013, TN-014, TN-017, TN-023, TN-024).

### 1.2 High-Level Component Model
At a high level, the solution consists of:

1. **Responsive Web UI (Dashboard Frontend)**  
   - SPA or modern web frontend using a responsive layout system (TN-001, TN-002, TN-012, TN-015, TN-016, TN-022).  
   - Renders card list/grid, KPI tiles, transaction table, and analytics charts.  
   - Handles interaction, filtering, sorting, and user navigation within a single integrated dashboard (FS-001, FS-002–FS-012, FS-010, FS-011, FS-012).

2. **API Gateway / Backend-for-Frontend (BFF)**  
   - Thin service layer exposing **dashboard-oriented APIs** to the UI and orchestrating data from underlying domain services.  
   - Aggregates card, transaction, and analytics data into UI-optimized payloads (e.g., consolidated dashboard summary for FS-010; KPIs for FS-002–FS-005; trend datasets for FS-007–FS-009).  
   - Enforces read-only semantics and guards against any payment or transfer-like actions (TN-007, TN-009, TN-011, TN-018, TN-021).

3. **Domain Services Layer**  
   Logical services implementing business logic and reusable capabilities:

   - **Card Management Service**  
     - Manages card entities and card-level attributes (limits, card alias, masked number, issuer, type).  
     - Provides APIs to retrieve a user’s cards, card details, and card-level KPIs such as limit, available credit, outstanding amount (FS-001, FS-003–FS-006, FS-011).

   - **Transaction Service**  
     - Retrieves and filters transactions by card, date range, and category (FS-002, FS-007–FS-009, FS-010, FS-012).  
     - Supports sorting, pagination, and foundational spending pattern queries.  
     - Feeds both KPI calculations and analytics.

   - **Analytics & KPI Service**  
     - Computes aggregated KPIs and analytic datasets such as:  
       - Monthly Spend (FS-002)  
       - Total Credit Limit (FS-003)  
       - Available Credit (FS-004)  
       - Outstanding Amount (FS-005)  
       - Monthly Spend Trends over time (FS-007)  
       - Card-wise spend analysis (FS-008)  
       - Category-wise spending analysis aligning to fixed categories per BR-001 (FS-009).  
     - Encapsulates business rules for aggregation (e.g., transaction inclusion/exclusion, multi-currency handling TBD).  
     - Exposes APIs that return pre-aggregated structures optimized for visualization.

   - **Category Classification Service**  
     - Implements mapping rules from transaction attributes (e.g., merchant, MCC, description) to the fixed category set defined in BR-001 (Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous).  
     - Ensures all analytics and displays referencing categories consistently use this canonical taxonomy (FS-009, BR-001, BR-004).

   - **User Profile & Session Context Service**  
     - Maintains a minimal profile for the dashboard user (e.g., user id, locale, preferred currency, display preferences).  
     - Provides context to card, transaction, and analytics services (for filters, localization, and session continuity in FS-011 and FS-012).  
     - Integrates with authentication/identity but does not own identity data.

4. **Mock Data Provider & Data Store Layer**  
   - **Mock Data Provider / Data Access Layer**  
     - Abstracts underlying data persistence and simulates interactions with external financial institutions (TN-004, TN-005, TN-006, TN-013, TN-014, TN-017, TN-023).  
     - Provides interfaces that can be reimplemented later for real bank APIs without impacting the upper layers.  
   - **Read-Optimized Data Store** (e.g., relational DB, document DB, or in-memory store for MVP)  
     - Holds **card**, **transaction**, **category**, and **user**-level demo data.  
     - Designed with extensible schemas to avoid refactor when moving from simulated to real data models (TN-013, TN-020).  
     - Supports batch-style data loading and reset scripts for test data (TN-014, TN-023, TN-024).

5. **Infrastructure & DevOps**  
   - CI/CD pipeline building and deploying the frontend and backend services.  
   - Environments (dev, test, demo) seeded with deterministic mock data for consistent analytics (TN-023).  
   - Monitoring, logging, and metrics focused on read performance and UI responsiveness (TN-012, TN-024).

### 1.3 Interaction Overview

1. **User Access & Session**  
   - A credit card user authenticates via an external or existing **Access Management / Authentication Service** (BR-002).  
   - Upon successful authentication, the dashboard UI obtains a user token/identity and establishes a session.  
   - The UI calls the **API Gateway/BFF** with this identity; the BFF validates authorization for dashboard access.

2. **Dashboard Initial Load (FS-001, FS-002–FS-005, FS-010, FS-011)**  
   - UI requests a **Dashboard Summary** endpoint (e.g., `/dashboard/summary`) from the BFF.  
   - BFF orchestrates calls to:  
     - Card Management Service → fetch user’s cards and base attributes (FS-001).  
     - Transaction Service → fetch recent transactions for default period and cards (FS-002, FS-012).  
     - Analytics & KPI Service → compute or retrieve Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount (FS-002–FS-005).  
   - BFF composes a response with:  
     - Card list/grid data.  
     - KPI values, with Monthly Spend and Outstanding Amount flagged as primary KPIs per BR-003.  
     - Initial transaction slice and a subset of analytics data (if desired for FS-010).  
   - UI renders an integrated dashboard view, with responsive KPIs and cards prominently displayed (FS-010, FS-011, BR-003).

3. **Card Detail Interactions (FS-006, FS-011)**  
   - When a user selects a card, the UI calls BFF endpoints (e.g., `/cards/{cardId}/details`).  
   - BFF queries Card Management Service and Analytics & KPI Service for card-level metrics (limit, available credit, outstanding, monthly spend).  
   - UI displays extended card details in a panel/section and updates metrics when switching cards.

4. **Analytics Interactions (FS-007–FS-009)**  
   - **Monthly Spend Trends (FS-007):**  
     - UI requests trend data (e.g., `/analytics/monthly-spend-trends?range=12m`).  
     - Analytics & KPI Service retrieves aggregated monthly spend from Transaction Service and returns a period/value time series.  
     - UI renders responsive line/bar charts with interactive hover.  
   - **Card-wise Spend Analysis (FS-008):**  
     - UI calls an endpoint (e.g., `/analytics/spend-by-card?period=current_month`).  
     - Analytics & KPI Service aggregates spend by card using Transaction Service data and card identifiers.  
     - UI renders comparative visualization (bar chart, etc.).  
   - **Category-wise Spending (FS-009) with BR-001 & BR-004:**  
     - UI requests category-wise spend (e.g., `/analytics/spend-by-category?period=current_month`).  
     - Analytics & KPI Service calls Category Classification Service to ensure each transaction is mapped into the defined categories (BR-001).  
     - Aggregated spend per category is returned and rendered as interactive chart(s), giving visual insights per BR-004.

5. **Transaction View Interactions (FS-012)**  
   - UI requests transaction lists (e.g., `/transactions?period=last_30_days&cards=all`).  
   - Transaction Service returns paginated, sortable lists.  
   - Sorting and simple filtering may be done either server-side or client-side depending on volume and performance needs.  
   - Users can adjust filters (date range, card, category), triggering new API calls and UI updates.

6. **Error and Partial Data Handling**  
   - In case of partial failures (e.g., some cards or analytics cannot be retrieved), BFF uses standard error envelopes and the UI renders available sections while showing non-blocking messages (FS-001 alt flow, FS-002–FS-005 alt flows, FS-010 alt flow, TN-024).  
   - Read-only nature simplifies rollback and transactional concerns; failures are surfaced as degraded analytics rather than inconsistent balances.

7. **Future Real-Bank Integration (Out of Scope Now)**  
   - The **Mock Data Provider** and domain service interfaces are designed as extension points (ports).  
   - In a future phase, real bank connectors can replace or augment mock implementations without changing UI or BFF contracts (TN-006, TN-013, TN-017, TN-020).

---

## 2. Component Model and Responsibilities

### 2.1 Component List

#### C1. Dashboard UI (Responsive Frontend)
- **Responsibilities**  
  - Present a unified, responsive dashboard with cards, KPIs, transactions, and analytics (FS-001–FS-012, FS-010, FS-011, BR-003).  
  - Implement layout and visual prominence for Monthly Spend and Outstanding Amount KPIs (BR-003).  
  - Render charts and tables via a mobile-friendly visualization library (TN-001, TN-002, TN-012, TN-015, TN-016, TN-022).  
  - Handle user interactions: selecting cards, applying filters, changing time ranges, sorting transactions, etc.  
  - Consume dashboard APIs exposed by BFF using authenticated calls.  
  - Maintain a client-side view model of dashboard state within a session.

- **Key Interfaces**  
  - HTTP/HTTPS calls to BFF REST APIs (`/dashboard/*`, `/cards/*`, `/analytics/*`, `/transactions/*`).  
  - Browser-based interaction events and responsive breakpoints.

#### C2. API Gateway / Backend-for-Frontend (BFF)
- **Responsibilities**  
  - Provide UI-optimized APIs that aggregate and compose data from domain services.  
  - Expose endpoints for dashboard summary, card details, KPIs, trends, category-wise and card-wise analytics, and transaction lists.  
  - Apply request validation (e.g., user identity and card ownership checks) and enforce read-only behavior (TN-007, TN-018, TN-021).  
  - Normalize error responses and hide underlying domain service complexity from the UI.  
  - Orchestrate partial data handling and return partial successes with warnings where necessary (FS-001 alt flow, FS-002–FS-005 alt flows, FS-010 alt flow, TN-024).

- **Key Interfaces**  
  - Inbound: REST APIs for Dashboard UI.  
  - Outbound: REST/RPC calls to C3–C7 (domain services).  
  - Integrates with authentication/authorization middleware.

#### C3. Card Management Service
- **Responsibilities**  
  - Manage lifecycle and retrieval of **card** entities.  
  - Provide list of cards for a given user and high-level attributes (alias, masked number, issuer, type, status).  
  - Provide per-card credit limit and outstanding balance data (or access them from Mock Data Provider/Data Store).  
  - Support aggregation basics for Total Credit Limit and Outstanding Amount in collaboration with Analytics & KPI Service (FS-003, FS-005).  
  - Provide card-level KPIs and details for selected card views (FS-004, FS-006, FS-011).

- **Key Interfaces**  
  - APIs to query cards by user id and card id.  
  - Data access layer to data store via Mock Data Provider.

#### C4. Transaction Service
- **Responsibilities**  
  - Retrieve and filter transactions by user, card, date range, and category (FS-002, FS-007–FS-009, FS-010, FS-012).  
  - Provide results for transaction table views with sorting and pagination.  
  - Provide raw or semi-aggregated transaction datasets needed by Analytics & KPI Service.  
  - Signal missing/inconsistent data to callers for appropriate alt-flow handling (FS-002–FS-005 alt flows, FS-007–FS-009 alt flows, FS-012 alt flows).

- **Key Interfaces**  
  - APIs for transaction queries.  
  - Data access interfaces into data store via Mock Data Provider.

#### C5. Analytics & KPI Service
- **Responsibilities**  
  - Implement business rules to calculate and aggregate financial metrics:  
    - Monthly Spend (FS-002).  
    - Total Credit Limit (FS-003).  
    - Available Credit (FS-004).  
    - Outstanding Amount (FS-005).  
    - Monthly Spend Trends over time (FS-007).  
    - Card-wise Spend Analysis (FS-008).  
    - Category-wise Spending Analysis (FS-009) based on BR-001 categories.  
  - Respect out-of-scope features (no payments, transfers, loans, gateways) in its logic and interfaces.  
  - Provide aggregated datasets in chart-friendly formats for the UI.  
  - Enforce category taxonomy via Category Classification Service and business rules (BR-001, BR-004).  
  - Compute or cache KPIs for efficient dashboard loading, particularly on mobile and lower-powered devices (TN-012).

- **Key Interfaces**  
  - APIs to BFF for KPIs and analytics endpoints.  
  - Calls to Transaction Service and Card Management Service for source data.  
  - Calls to Category Classification Service for category resolution.

#### C6. Category Classification Service
- **Responsibilities**  
  - Maintain mapping logic and configuration between transactions and fixed category taxonomy required by BR-001.  
  - Apply classification rules for each transaction based on merchant codes, descriptions, or other attributes.  
  - Ensure consistent category representation in analytics and transaction views.  
  - Provide fallbacks for unclassified or ambiguous transactions (e.g., map to **Miscellaneous** or **Uncategorized** per design).

- **Key Interfaces**  
  - API endpoints or libraries invoked by Analytics & KPI Service and Transaction Service.  
  - Configuration or rule repository for category mappings.

#### C7. User Profile & Session Context Service
- **Responsibilities**  
  - Store and provide user-level preferences (locale, currency, default filters/time ranges).  
  - Provide lightweight session context referenced by BFF and domain services (e.g., default month definition, timezone for KPIs FS-002, FS-007, FS-008, FS-009).  
  - Integrate with external authentication/Access Management for user identity (BR-002).  
  - Support session continuity for multi-card and analytics views within a single session (FS-011, FS-012).

- **Key Interfaces**  
  - APIs for retrieving user context given a token/identity.  
  - Integration hooks into authentication provider.

#### C8. Mock Data Provider & Data Access Layer
- **Responsibilities**  
  - Provide a clear data access boundary that can be swapped for real bank integration in future (TN-004, TN-006, TN-013, TN-017).  
  - Wrap underlying data store interactions for cards, transactions, categories, and user profiles.  
  - Include utilities for seeding and resetting test/demo datasets (TN-014, TN-023, TN-024).  
  - Ensure synthetic data is realistic enough to exercise KPI and visualization logic.

- **Key Interfaces**  
  - Repositories or data access APIs used by Card Management Service, Transaction Service, Category Classification Service, and User Profile Service.  
  - Batch/seeding scripts or management endpoints for test data.

#### C9. Read-Optimized Data Store
- **Responsibilities**  
  - Persist cards, transactions, category mappings, and user profiles/settings.  
  - Support efficient read queries for dashboard KPIs and analytics (FS-002–FS-009, FS-012).  
  - Provide simple batch-style or static dataset loading mechanism rather than real-time ingestion (TN-014).  
  - Maintain schemas extensible toward real-world card and transaction data (TN-013, TN-020).

- **Key Interfaces**  
  - Data access via Mock Data Provider.  
  - Data seeding & migration tooling.

---

## 3. Functional Capability to Component Mapping

### 3.1 Component JSON Mapping

```json
{
  "components": [
    {
      "name": "C1_Dashboard_UI",
      "responsibility": "Responsive web frontend rendering integrated credit card dashboard, KPIs, transactions, and analytics, handling user interactions and layout.",
      "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006", "FS-007", "FS-008", "FS-009", "FS-010", "FS-011", "FS-012"]
    },
    {
      "name": "C2_API_Gateway_BFF",
      "responsibility": "Backend-for-Frontend providing UI-optimized REST APIs, orchestrating domain services, enforcing read-only rules, and handling partial data/errors.",
      "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006", "FS-007", "FS-008", "FS-009", "FS-010", "FS-011", "FS-012"]
    },
    {
      "name": "C3_Card_Management_Service",
      "responsibility": "Manages retrieval of user credit cards and card-level data including limits, outstanding balances, and core attributes.",
      "implements": ["FS-001", "FS-003", "FS-004", "FS-005", "FS-006", "FS-010", "FS-011"]
    },
    {
      "name": "C4_Transaction_Service",
      "responsibility": "Provides access to transaction records with filtering, sorting, and aggregation-ready datasets for KPIs and analytics.",
      "implements": ["FS-002", "FS-007", "FS-008", "FS-009", "FS-010", "FS-012"]
    },
    {
      "name": "C5_Analytics_and_KPI_Service",
      "responsibility": "Computes aggregated KPIs and analytics datasets including monthly spend, credit limits, available credit, outstanding amount, trends, card-wise and category-wise analysis.",
      "implements": ["FS-002", "FS-003", "FS-004", "FS-005", "FS-007", "FS-008", "FS-009", "FS-010", "FS-011"]
    },
    {
      "name": "C6_Category_Classification_Service",
      "responsibility": "Classifies transactions into fixed spending categories as per business rules and ensures consistency across analytics and visualizations.",
      "implements": ["FS-009"]
    },
    {
      "name": "C7_User_Profile_and_Session_Service",
      "responsibility": "Provides user context (locale, currency, default filters) and session-level preferences to support consistent dashboard behavior.",
      "implements": ["FS-002", "FS-007", "FS-008", "FS-009", "FS-010", "FS-011", "FS-012"]
    },
    {
      "name": "C8_Mock_Data_Provider_DAL",
      "responsibility": "Abstracts data access to a simulated dataset for cards, transactions, and categories, acting as a future integration boundary for real bank data.",
      "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006", "FS-007", "FS-008", "FS-009", "FS-010", "FS-011", "FS-012"]
    },
    {
      "name": "C9_Read_Optimized_Data_Store",
      "responsibility": "Stores card, transaction, category, and user profile data in a schema optimized for read-heavy analytical queries and mock data seeding.",
      "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006", "FS-007", "FS-008", "FS-009", "FS-010", "FS-011", "FS-012"]
    }
  ]
}
```

### 3.2 FS-to-Component Mapping (Tabular)

| Functional Spec | Capability (Summary) | Primary Components |
|-----------------|----------------------|--------------------|
| **FS-001** | View consolidated dashboard of all user credit cards | C1 Dashboard UI, C2 API Gateway BFF, C3 Card Management Service, C8 Mock Data Provider, C9 Data Store |
| **FS-002** | Display Monthly Spend KPI across all cards | C1 Dashboard UI, C2 BFF, C4 Transaction Service, C5 Analytics & KPI Service, C7 User Profile & Session, C8 Mock Data Provider, C9 Data Store |
| **FS-003** | Display Total Credit Limit KPI across all cards | C1 Dashboard UI, C2 BFF, C3 Card Management Service, C5 Analytics & KPI Service, C8 Mock Data Provider, C9 Data Store |
| **FS-004** | Display Available Credit KPI across all cards | C1 Dashboard UI, C2 BFF, C3 Card Management Service, C4 Transaction Service (if needed for outstanding), C5 Analytics & KPI Service, C8 Mock Data Provider, C9 Data Store |
| **FS-005** | Display Outstanding Amount KPI across all cards | C1 Dashboard UI, C2 BFF, C3 Card Management Service, C5 Analytics & KPI Service, C8 Mock Data Provider, C9 Data Store |
| **FS-006** | View card-specific details and metrics | C1 Dashboard UI, C2 BFF, C3 Card Management Service, C5 Analytics & KPI Service, C8 Mock Data Provider, C9 Data Store |
| **FS-007** | View Monthly Spend Trends visualization over time | C1 Dashboard UI, C2 BFF, C4 Transaction Service, C5 Analytics & KPI Service, C7 User Profile & Session, C8 Mock Data Provider, C9 Data Store |
| **FS-008** | View Card-wise Spend Analysis visualizations | C1 Dashboard UI, C2 BFF, C4 Transaction Service, C5 Analytics & KPI Service, C7 User Profile & Session, C8 Mock Data Provider, C9 Data Store |
| **FS-009** | View Category-wise Spending interactive visualizations | C1 Dashboard UI, C2 BFF, C4 Transaction Service, C5 Analytics & KPI Service, C6 Category Classification Service, C7 User Profile & Session, C8 Mock Data Provider, C9 Data Store |
| **FS-010** | View integrated dashboard with cards, transactions, analytics in one view | C1 Dashboard UI, C2 BFF, C3 Card Management Service, C4 Transaction Service, C5 Analytics & KPI Service, C7 User Profile & Session, C8 Mock Data Provider, C9 Data Store |
| **FS-011** | View multiple cards and key KPIs in a single session | C1 Dashboard UI, C2 BFF, C3 Card Management Service, C5 Analytics & KPI Service, C7 User Profile & Session, C8 Mock Data Provider, C9 Data Store |
| **FS-012** | View transactional data for spending pattern analysis | C1 Dashboard UI, C2 BFF, C4 Transaction Service, C7 User Profile & Session, C8 Mock Data Provider, C9 Data Store |

---

## 4. Cross-Cutting Concerns

The following cross-cutting concerns apply across UI, BFF, domain services, and data access, but are called out once here.

### 4.1 Authentication & Authorization
- Integrate with an **Access Management / Authentication Service** to ensure that only legitimate credit card users can access the dashboard (BR-002).  
- Use secure token-based authentication (e.g., JWT/OIDC) between UI and BFF.  
- BFF validates user identity on each request and ensures that users only access their own cards and transactions.  
- Future-ready for enterprise SSO without tight coupling to a specific identity provider.

### 4.2 Data Privacy, Security & Compliance
- Dashboard operates in **read-only mode**; no card payments, no fund transfers, no loans, and no payment gateway integration, reducing PCI-DSS scope (TN-007, TN-008, TN-009, TN-010, TN-011, TN-018, TN-019, TN-020).  
- Enforce **card data masking** in UI and logs: only display last 4 digits of the card number; never store or log full PAN or CVV (TN-008, TN-021).  
- Encrypt data in transit (HTTPS/TLS) and apply encryption at rest where cardholder-like data is stored.  
- Implement principle of least privilege for services accessing data store.

### 4.3 Logging, Monitoring & Audit
- Centralized structured logging for:
  - Service calls (BFF to domain services, domain services to DAL).  
  - Errors and partial failures (e.g., missing card data, incomplete transactions, unavailable analytics per alt flows).  
- Avoid logging sensitive card or transaction details (TN-021).  
- Application metrics to monitor:
  - API response times and error rates.  
  - Dashboard load times and chart rendering durations (TN-012).  
- Lightweight audit trail for access to card and transaction views (who accessed which user’s data, when) – read-only.

### 4.4 Error Handling & Resilience
- Standardized error envelope exposed by BFF to UI with user-friendly messages and technical details hidden.  
- Graceful handling of partial failures:
  - Show available cards/analytics even when some services/data fail (FS-001 alt flow, FS-002–FS-005 alt flows, FS-007–FS-009 alt flows, FS-010 alt flow, FS-012 alt flows, TN-024).  
  - UI should display non-blocking alerts or inline warnings for missing or incomplete data.  
- Circuit breakers and retry policies for domain service and DAL calls where appropriate (to prevent cascading failures).  
- Fallbacks for category mapping (e.g., mapping to Miscellaneous or Uncategorized when classification fails) aligned to BR-001 and FS-009.

### 4.5 Performance & Scalability
- Frontend optimizations:
  - Lazy loading of heavy analytics sections (FS-007–FS-009), progressive rendering (FS-010 alt flow).  
  - Efficient chart rendering and DOM updates optimized for mobile (TN-012).  
- Backend optimizations:
  - Pre-calculation or caching of KPIs for dashboard load (FS-002–FS-005, FS-011).  
  - Query optimization and appropriate indexing in the data store for read-heavy analytics workloads.  
- Given mock/static data and absence of real-time ingestion, focus performance validation on read latencies under expected concurrent demo/testing loads (TN-012, TN-014, TN-024).

### 4.6 Responsiveness & UX Consistency
- Consistent responsive layout across:
  - Card list/grid views (FS-001, FS-006, FS-011).  
  - KPI tiles (FS-002–FS-005).  
  - Trend and comparative charts (FS-007–FS-009).  
  - Transaction list/table (FS-012).  
- Breakpoints and component behavior aligned with TN-001, TN-002, TN-003, TN-012, TN-015, TN-016, TN-022.  
- Optional accessibility enhancements (ARIA roles for charts, keyboard navigation, sufficient contrast) considered for library selection (TN-015).

### 4.7 Testability & Data Seeding
- Extensive reliance on **mock/simulated data** requires:  
  - Test data seeding scripts for cards, transactions, categories, and user profiles (TN-023).  
  - Repeatable environment setup for demos, automated tests, and local development.  
- Automated tests at multiple layers:
  - Unit tests for classification and KPI calculations (BR-001, FS-002–FS-005, FS-007–FS-009).  
  - API tests for BFF and domain services (TN-003, TN-024).  
  - UI tests for responsive behavior across different viewport sizes (TN-001–TN-003, TN-012, TN-016, TN-022).

---

## 5. HLD JSON Object

```json
{
  "components": [
    {
      "name": "C1_Dashboard_UI",
      "responsibility": "Responsive web frontend rendering integrated credit card dashboard, KPIs, transactions, and analytics, handling user interactions and layout.",
      "implements": [
        "FS-001",
        "FS-002",
        "FS-003",
        "FS-004",
        "FS-005",
        "FS-006",
        "FS-007",
        "FS-008",
        "FS-009",
        "FS-010",
        "FS-011",
        "FS-012"
      ]
    },
    {
      "name": "C2_API_Gateway_BFF",
      "responsibility": "Backend-for-Frontend providing UI-optimized REST APIs, orchestrating domain services, enforcing read-only rules, and handling partial data/errors.",
      "implements": [
        "FS-001",
        "FS-002",
        "FS-003",
        "FS-004",
        "FS-005",
        "FS-006",
        "FS-007",
        "FS-008",
        "FS-009",
        "FS-010",
        "FS-011",
        "FS-012"
      ]
    },
    {
      "name": "C3_Card_Management_Service",
      "responsibility": "Manages retrieval of user credit cards and card-level data including limits, outstanding balances, and core attributes.",
      "implements": [
        "FS-001",
        "FS-003",
        "FS-004",
        "FS-005",
        "FS-006",
        "FS-010",
        "FS-011"
      ]
    },
    {
      "name": "C4_Transaction_Service",
      "responsibility": "Provides access to transaction records with filtering, sorting, and aggregation-ready datasets for KPIs and analytics.",
      "implements": [
        "FS-002",
        "FS-007",
        "FS-008",
        "FS-009",
        "FS-010",
        "FS-012"
      ]
    },
    {
      "name": "C5_Analytics_and_KPI_Service",
      "responsibility": "Computes aggregated KPIs and analytics datasets including monthly spend, credit limits, available credit, outstanding amount, trends, card-wise and category-wise analysis.",
      "implements": [
        "FS-002",
        "FS-003",
        "FS-004",
        "FS-005",
        "FS-007",
        "FS-008",
        "FS-009",
        "FS-010",
        "FS-011"
      ]
    },
    {
      "name": "C6_Category_Classification_Service",
      "responsibility": "Classifies transactions into fixed spending categories as per business rules and ensures consistency across analytics and visualizations.",
      "implements": [
        "FS-009"
      ]
    },
    {
      "name": "C7_User_Profile_and_Session_Service",
      "responsibility": "Provides user context (locale, currency, default filters) and session-level preferences to support consistent dashboard behavior.",
      "implements": [
        "FS-002",
        "FS-007",
        "FS-008",
        "FS-009",
        "FS-010",
        "FS-011",
        "FS-012"
      ]
    },
    {
      "name": "C8_Mock_Data_Provider_DAL",
      "responsibility": "Abstracts data access to a simulated dataset for cards, transactions, and categories, acting as a future integration boundary for real bank data.",
      "implements": [
        "FS-001",
        "FS-002",
        "FS-003",
        "FS-004",
        "FS-005",
        "FS-006",
        "FS-007",
        "FS-008",
        "FS-009",
        "FS-010",
        "FS-011",
        "FS-012"
      ]
    },
    {
      "name": "C9_Read_Optimized_Data_Store",
      "responsibility": "Stores card, transaction, category, and user profile data in a schema optimized for read-heavy analytical queries and mock data seeding.",
      "implements": [
        "FS-001",
        "FS-002",
        "FS-003",
        "FS-004",
        "FS-005",
        "FS-006",
        "FS-007",
        "FS-008",
        "FS-009",
        "FS-010",
        "FS-011",
        "FS-012"
      ]
    }
  ],
  "cross_cutting_concerns": [
    "Authentication & authorization via integration with Access Management; enforce that only valid credit card users access their own dashboard data (BR-002).",
    "Data privacy and security, including read-only architecture, masking of card data, no storage of PAN/CVV, TLS for all traffic, and principle of least privilege for data access (TN-007, TN-008, TN-018, TN-021).",
    "Centralized structured logging, monitoring, and lightweight audit trails for access to card and transaction data, while avoiding sensitive data in logs.",
    "Standardized error handling and resilience patterns including partial data handling, user-friendly error messages, and circuit-breaker/retry strategies (TN-024).",
    "Performance and scalability tuning focused on read-heavy workloads, KPI caching, and responsive chart rendering, especially for mobile devices (TN-012, TN-014).",
    "Responsive UX and accessibility considerations, ensuring layouts and visualizations adapt to multiple screen sizes with consistent design system usage (TN-001, TN-002, TN-003, TN-015, TN-016, TN-022).",
    "Testability and deterministic data seeding for mock datasets, enabling repeatable automated tests, demos, and environment resets (TN-003, TN-023)."
  ],
  "narrative": "The Credit Card Analysis Dashboard is a responsive, read-only web application that provides authenticated credit card users with a consolidated view of multiple cards, KPIs, transactions, and analytics. A responsive Dashboard UI interacts with an API Gateway/Backend-for-Frontend, which orchestrates Card Management, Transaction, Analytics & KPI, Category Classification, User Profile & Session, and Mock Data Provider services. These services operate over a read-optimized data store containing synthetic but realistic card and transaction data. Analytics & KPI logic delivers Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount, Monthly Spend Trends, Card-wise Spend, and Category-wise Spending using a fixed category taxonomy. The architecture emphasizes clean separation of concerns, read-only semantics, responsive design, extensible mock data boundaries for future real-bank integration, and cross-cutting controls for authentication, security, error handling, performance, and testability."
}
```
