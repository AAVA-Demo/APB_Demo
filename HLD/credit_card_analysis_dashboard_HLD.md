# Credit Card Analysis Dashboard – High-Level Design

## 1. Architecture Narrative

The **Credit Card Analysis Dashboard** is a responsive, read‑only, analytical web module that consolidates information from multiple credit cards and their transactions to present KPIs and visual insights to end users.

At a high level, the solution is composed of:

1. **Web UI (Credit Card Dashboard UI)**  
   A single‑page, responsive front‑end that renders dashboard KPIs, card lists, transaction tables, and analytics charts (e.g., monthly trends and category‑wise spending). It interacts only with the Dashboard API Gateway.

2. **API Gateway / Backend‑for‑Frontend (Dashboard API Gateway)**  
   A thin service exposing tailored REST/JSON endpoints for the UI (e.g., `/dashboard/summary`, `/cards`, `/transactions`, `/analytics/category-spend`). It orchestrates calls to underlying domain services, applies basic aggregation, and enforces cross‑cutting policies (auth, rate limits, response shaping).

3. **Card Management Service**  
   A domain service responsible for representing and serving credit card profile data: card metadata, issuer, masked card number, credit limit, and available credit. It exposes card‑centric APIs used by the API Gateway.

4. **Transaction Service**  
   A domain service that exposes transaction data per card and per user. It is responsible for retrieving and filtering transactions by period (e.g., current month) and returning normalized transaction records including amount, date, merchant, category, and card reference.

5. **Analytics & Aggregation Service**  
   A compute‑focused component that aggregates transactional data into metrics and time‑series used by the dashboard. It calculates:
   - Monthly spend (overall and per card)
   - Outstanding amount per card and total
   - Category‑wise spend (overall and by card)
   - Card‑wise spend analysis (e.g., distribution per card)

   This service may pre‑compute aggregations (e.g., via cached materialized views) or perform them on demand, based on transaction and card data.

6. **User & Card Association Store**  
   A persistence layer component that maintains the mapping between users and their credit cards (e.g., which cards a user can see). It is used by Card Management Service and Transaction Service to scope data to the authenticated user.

7. **Reporting & Query Store (Read‑Optimized Data Store)**  
   A database (or set of schemas) optimized for read and analytical queries. It stores consolidated card profiles, transactions, and derived aggregates used by the Analytics & Aggregation Service. This store is fed by upstream ETL or batch imports from non‑production bank/statement data sources (since real bank integration is out of scope, data can be simulated or loaded from files).

8. **Data Ingestion / Loader (Batch Import Pipeline)**  
   An offline/batch process that takes synthetic or exported credit‑card and transaction data (CSV, JSON, etc.) and loads it into the Reporting & Query Store. This allows the dashboard to behave as if connected to real data sources while respecting the "no real bank integration" constraint.

9. **Authentication & Authorization Service (Logical)**  
   A logical component, typically implemented via existing enterprise identity (e.g., SSO/OIDC). It authenticates users and issues tokens that the API Gateway uses to authorize access to cards and transactions.

10. **Logging & Monitoring Subsystem (Logical)**  
    Centralized logging of API requests, dashboard usage, performance metrics, and error traces. This subsystem supports operational monitoring and troubleshooting.

11. **Error Handling & Validation Layer (Logical)**  
    A cross‑cutting layer implemented in the API Gateway and services to enforce consistent error formats (e.g., standardized error codes and messages) and input validation.

### Interaction Flow (Typical Use Case: View Dashboard)

1. **User Accesses Dashboard**  
   The user navigates to the Credit Card Dashboard UI. The browser loads the SPA and static assets.

2. **User Authentication**  
   The UI redirects the user to the enterprise identity provider (Authentication Service) if no valid session exists. Upon successful login, the UI receives an access token.

3. **Dashboard Summary Call**  
   The UI calls the Dashboard API Gateway `/dashboard/summary` with the user’s token.

4. **API Gateway Orchestration**  
   The API Gateway:
   - Validates the token and identifies the user.
   - Queries the Card Management Service to fetch all cards associated with the user.
   - Queries the Analytics & Aggregation Service for KPIs (monthly spend, total credit limit, available credit, outstanding amount) based on those cards.
   - Optionally queries the Transaction Service for a small recent‑transaction slice if required for the dashboard.

5. **Analytics Computation**  
   The Analytics & Aggregation Service reads card, transaction, and derived aggregates from the Reporting & Query Store and returns computed metrics and chart data (e.g., monthly trend series, category‑wise aggregates).

6. **Response Assembly**  
   The API Gateway aggregates results into a UI‑friendly payload (e.g., `cards[]`, `kpis{}`, `categorySpend[]`, `monthlyTrend[]`) and returns it to the UI.

7. **UI Rendering**  
   The UI renders:
   - Dashboard KPIs (Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount).
   - Card list with per‑card key metrics.
   - Monthly spend trend chart.
   - Category‑wise spend visuals.
   - Card‑wise spend analysis panels.

8. **Subsequent Drill‑downs**  
   When the user selects particular cards or time ranges, the UI issues targeted calls to `/cards/{id}`, `/transactions`, or `/analytics/*` endpoints. The flow repeats with narrower filters.

Constraints honored:
- The dashboard is **read‑only** and analytical: no payments, no funds transfer, no real bank connectivity.
- All visualizations are driven by consolidated data across multiple cards and categories.

---

## 2. Components and Responsibilities

### 2.1 Component List (JSON‑aligned View)

Below is the component list, aligned to the JSON structure and mapping to functional specs (FS‑codes inferred for clarity):

- **FS‑001** – View Dashboard KPIs (Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount)  
- **FS‑002** – View and manage list of multiple credit cards (metadata + key metrics)  
- **FS‑003** – View monthly spend trends over time  
- **FS‑004** – View card‑wise spend analysis  
- **FS‑005** – View category‑wise spending analytics  
- **FS‑006** – View transactions (support underlying dashboard, drill‑downs)  
- **FS‑007** – Responsive layout across devices

#### Component Table

| Name                              | Responsibility                                                                                          | Implements                  |
|-----------------------------------|--------------------------------------------------------------------------------------------------------|-----------------------------|
| Credit Card Dashboard UI          | Render responsive dashboard UI, charts, and tables. Orchestrate calls to API Gateway based on user actions. | FS-001, FS-002, FS-003, FS-004, FS-005, FS-006, FS-007 |
| Dashboard API Gateway             | Provide BFF endpoints, validate auth, orchestrate card/transaction/analytics calls, shape responses.  | FS-001, FS-002, FS-003, FS-004, FS-005, FS-006 |
| Card Management Service           | Manage and expose card profiles and card-level KPIs (limits, available credit, outstanding per card). | FS-001, FS-002, FS-004 |
| Transaction Service               | Provide transaction lists per user/card/time range, normalized with categories.                        | FS-003, FS-005, FS-006 |
| Analytics & Aggregation Service   | Compute monthly spend, category-wise spend, card-wise spend analysis, and trend data.                  | FS-001, FS-003, FS-004, FS-005 |
| User & Card Association Store     | Persist associations of users to their cards; enforce scoping for services.                            | FS-002, FS-006 |
| Reporting & Query Store           | Store card, transaction, and aggregated data optimized for dashboard queries.                          | FS-001, FS-002, FS-003, FS-004, FS-005, FS-006 |
| Data Ingestion / Loader           | Batch load synthetic/exported card and transaction data into Reporting Store.                          | FS-006 |

---

## 3. Cross‑Cutting Concerns

These concerns apply across the module and are not repeated per component.

1. **Authentication & Authorization**  
   - Use enterprise SSO/OIDC for user authentication.  
   - The UI includes the bearer token in all API calls.  
   - The API Gateway validates tokens and resolves user identity.  
   - Card Management and Transaction Service enforce authorization via user‑to‑card mappings in the User & Card Association Store.

2. **Logging & Monitoring**  
   - Centralized logging of all API calls (request/response envelopes, excluding sensitive fields like full card number).  
   - Capture key business events: dashboard load, filters applied, cards viewed.  
   - Application and infrastructure metrics (latency, error rates, throughput) exposed to monitoring tools.

3. **Error Handling & Validation**  
   - Uniform error response format (e.g., `{ code, message, details, correlationId }`).  
   - Input validation for all external endpoints (date ranges, pagination, card identifiers, category filters).  
   - Graceful degradation of analytics (e.g., when some data is missing, show partial charts with clear messaging).

4. **Security & Data Privacy**  
   - Store only masked card numbers and non‑sensitive card identifiers in the dashboard module.  
   - Encrypt data at rest in the Reporting & Query Store.  
   - TLS for all in‑transit communication.  
   - No storage of CVV or full PANs; no payment capability.

5. **Performance & Caching**  
   - Use response caching at API Gateway for frequently accessed dashboard summaries per user.  
   - Pre‑compute heavy aggregations in Analytics & Aggregation Service via scheduled jobs or materialized views.  
   - Paginate transaction lists and lazy‑load secondary charts.

6. **Responsiveness & UX**  
   - Implement responsive design (CSS grid/flex) to support desktop, tablet, and mobile.  
   - Defer non‑critical calls (e.g., secondary charts) until primary KPIs are displayed for perceived performance improvements.

7. **Configuration & Feature Flags**  
   - Use centralized configuration (e.g., environment‑based) for category definitions, thresholds, and feature toggles (e.g., enabling/disabling specific analytics views).

---

## 4. Component–to–Functional Specification Mapping

This section restates, in a compact form, which components implement each functional spec (FS‑code).

### FS‑001 – Dashboard KPIs (Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount)
- **Credit Card Dashboard UI** – Displays KPI cards and panels.
- **Dashboard API Gateway** – Provides KPI summary endpoint.
- **Card Management Service** – Supplies per‑card credit limit, available credit, and outstanding amounts.
- **Analytics & Aggregation Service** – Calculates monthly spend and total aggregates across cards.
- **Reporting & Query Store** – Persists data used to compute and serve KPI values.

### FS‑002 – Multiple Credit Cards (Consolidated View of All Cards)
- **Credit Card Dashboard UI** – Renders the list of cards and associated metrics.
- **Dashboard API Gateway** – Provides `/cards` and enriched card list in `/dashboard/summary`.
- **Card Management Service** – Core logic for card metadata and per‑card metrics.
- **User & Card Association Store** – Determines which cards belong to the authenticated user.
- **Reporting & Query Store** – Stores card details and derived metrics.

### FS‑003 – Monthly Spend Trends
- **Credit Card Dashboard UI** – Shows time‑series charts for monthly spend.
- **Dashboard API Gateway** – Exposes endpoints to fetch trend data.
- **Transaction Service** – Supplies raw transaction data by date.
- **Analytics & Aggregation Service** – Aggregates transactions into time‑series spend data.
- **Reporting & Query Store** – Stores transactions and aggregated spend data.

### FS‑004 – Card‑wise Spend Analysis
- **Credit Card Dashboard UI** – Renders per‑card spend comparisons (charts/tables).
- **Dashboard API Gateway** – Provides card‑wise spend analysis data.
- **Card Management Service** – Provides card identities and credit limits for context.  
- **Analytics & Aggregation Service** – Aggregates spend per card over a period.
- **Reporting & Query Store** – Persists transactional facts and card‑level aggregates.

### FS‑005 – Category‑wise Spending Analytics
- **Credit Card Dashboard UI** – Displays charts/tables for category‑wise spending using categories: Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous.
- **Dashboard API Gateway** – Exposes category analytics endpoints.
- **Transaction Service** – Provides categorized transactions (category as an attribute on each transaction record).
- **Analytics & Aggregation Service** – Aggregates spend by category and optionally by card and period.
- **Reporting & Query Store** – Stores categorized transactions and computed category aggregates.

### FS‑006 – Transactions (Support Dashboard & Drill‑downs)
- **Credit Card Dashboard UI** – Allows users to view filtered transaction lists and details.
- **Dashboard API Gateway** – Exposes transaction endpoints with filters (card, date range, category).
- **Transaction Service** – Retrieves and filters transactions for given cards and criteria.
- **User & Card Association Store** – Ensures only transactions related to user‑owned cards are retrieved.
- **Reporting & Query Store** – Stores transactional data.
- **Data Ingestion / Loader** – Loads initial and incremental transaction data.

### FS‑007 – Responsive Layout & Usability
- **Credit Card Dashboard UI** – Implements responsive design and adaptive layout for various screen sizes.  
  (Backend components are largely agnostic but must support lightweight responses suitable for constrained networks.)

---

## 5. Deployment & Integration Considerations (High‑Level)

- The **Credit Card Dashboard UI** is deployed as static assets via a web server or CDN.
- The **Dashboard API Gateway** and the **domain services** (Card Management, Transaction, Analytics) are deployed as containerized microservices or within a modular monolith, depending on enterprise standards.
- The **Reporting & Query Store** may be a relational database with analytical indexes, a data warehouse (e.g., columnar store), or a combination, provided it supports efficient aggregation queries for dashboard workloads.
- The **Data Ingestion / Loader** may run as scheduled batch jobs or ETL pipelines populating the Reporting Store from CSV/JSON sources.
- Integration with an **enterprise identity provider** is required for authentication; no direct integration with live banking systems is performed.

---

## 6. HLD JSON Representation

```json
{
  "components": [
    {
      "name": "Credit Card Dashboard UI",
      "responsibility": "Render responsive dashboard UI with KPIs, card list, charts, and transaction views; orchestrate API calls based on user interactions.",
      "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006", "FS-007"]
    },
    {
      "name": "Dashboard API Gateway",
      "responsibility": "Expose BFF endpoints to the UI, validate authentication, orchestrate calls to domain services, and shape responses for dashboard use cases.",
      "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006"]
    },
    {
      "name": "Card Management Service",
      "responsibility": "Manage and serve credit card profiles and card-level KPIs such as credit limit, available credit, and outstanding balances.",
      "implements": ["FS-001", "FS-002", "FS-004"]
    },
    {
      "name": "Transaction Service",
      "responsibility": "Provide normalized transaction data per user, card, and time range, including classifications into spending categories.",
      "implements": ["FS-003", "FS-005", "FS-006"]
    },
    {
      "name": "Analytics & Aggregation Service",
      "responsibility": "Perform aggregations over card and transaction data to compute KPIs, monthly trends, card-wise and category-wise spend analytics.",
      "implements": ["FS-001", "FS-003", "FS-004", "FS-005"]
    },
    {
      "name": "User & Card Association Store",
      "responsibility": "Persist associations between users and their credit cards and provide lookup capabilities for authorization-aware queries.",
      "implements": ["FS-002", "FS-006"]
    },
    {
      "name": "Reporting & Query Store",
      "responsibility": "Store consolidated card, transaction, and aggregated data in a form optimized for the dashboard's read and analytics queries.",
      "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006"]
    },
    {
      "name": "Data Ingestion / Loader",
      "responsibility": "Load and refresh synthetic or exported card and transaction data into the Reporting & Query Store via batch or ETL processes.",
      "implements": ["FS-006"]
    }
  ],
  "cross_cutting_concerns": [
    "Authentication & authorization via enterprise identity provider; token validation at API Gateway and user-to-card scoping in services.",
    "Centralized logging and monitoring of API usage, dashboard interactions, performance metrics, and errors.",
    "Consistent error handling and input validation with standardized error response formats and correlation IDs.",
    "Security and data privacy controls including masking of card numbers, encryption at rest, and TLS in transit.",
    "Performance optimization through caching, pre-computed aggregations, and pagination for large datasets.",
    "Responsive UX considerations in the UI layer to support multiple devices and varying network conditions.",
    "Centralized configuration and feature flags for categories, thresholds, and optional analytics views."
  ],
  "narrative": "The Credit Card Analysis Dashboard is a responsive analytical module that consolidates information from multiple credit cards into a single user experience. A web-based single-page application (Credit Card Dashboard UI) communicates exclusively with a tailored Dashboard API Gateway using secure REST/JSON calls. The API Gateway validates authentication tokens, identifies the user, and orchestrates calls to domain services responsible for card profiles, transactions, and analytics. Card Management Service exposes card-level metadata and KPIs such as credit limits, available credit, and outstanding balances. Transaction Service provides normalized and categorized transaction data per card and per time range. Analytics & Aggregation Service consumes card and transaction data from a read-optimized Reporting & Query Store to compute dashboard KPIs, monthly spend trends, card-wise spend distributions, and category-wise spending summaries. A User & Card Association Store enforces which cards and transactions belong to a given authenticated user. Data is populated into the Reporting & Query Store via a Data Ingestion / Loader process that imports synthetic or exported statements, avoiding direct integration with live banking systems. Cross-cutting concerns such as authentication, authorization, logging, monitoring, error handling, security, and responsiveness are consistently applied across the architecture, ensuring a secure, observable, and performant user experience while remaining strictly read-only in accordance with scope constraints."
}
```
