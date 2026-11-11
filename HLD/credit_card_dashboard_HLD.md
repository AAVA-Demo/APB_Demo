# Credit Card Analysis Dashboard – High-Level Design (HLD)

## 1. Architecture Narrative

The **Credit Card Analysis Dashboard** is a read‑only, analytics‑oriented web module that consolidates multiple credit cards, their limits, available credit, monthly spending, outstanding balances, and category-wise spend insights into a single responsive UI.

At a high level, the solution is composed of:

1. **Dashboard Web UI**  
   A responsive, browser-based frontend that presents key KPIs, charts, and card/transaction summaries. It consumes data from the Dashboard API and renders:
   - Overall KPIs (monthly spend, total credit limit, available credit, outstanding amount)
   - Multiple credit card tiles/panels
   - Monthly and card-wise spend analysis
   - Category-wise spending visualizations

2. **Dashboard API Gateway / Backend-for-Frontend (BFF)**  
   A lightweight API layer that exposes optimized endpoints for the UI. It orchestrates data retrieval from the Card Management service and the Analytics service. It:
   - Serves aggregate dashboard data in UI-friendly shapes
   - Combines card, transaction, and analytics metrics
   - Applies any presentation-level filters and time-window logic

3. **Card Management Service**  
   A service responsible for representing logical “cards” and their financial limits. It:
   - Manages credit card profiles (issuer, masked number, credit limit)
   - Computes and exposes per-card balances and available credit
   - Provides a consolidated view of all cards for a user

4. **Transaction Service**  
   A service focused on transaction-level details. It:
   - Stores and retrieves transactions per card (date, amount, category)
   - Exposes endpoints for querying transactions by time range, card, or category
   - Acts as the source for all downstream spend and category analytics

5. **Analytics & Insights Service**  
   A computation-focused service that derives higher-order metrics from transactions and card data. It:
   - Calculates monthly spend trends across all cards
   - Produces card-wise spend summaries
   - Aggregates category-wise spending for the supported categories: Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous
   - Provides pre-aggregated metrics for KPI calculations

6. **User Context & Session Component**  
   A logical component that maintains which user is currently using the dashboard and provides card/transaction scoping. In this HLD (where real bank integration and payments are out of scope), it focuses on:
   - User identity context (e.g., from an existing SSO session)
   - Resolving which cards belong to the user

7. **Data Store Layer**  
   Underlying persistent storage for cards, transactions, and analytics results:
   - **Cards Store**: Holds card master data and credit limits
   - **Transactions Store**: Holds transaction history for each card
   - **Analytics Store (Optional)**: Holds materialized views or cached aggregates for fast dashboard loads

### Interaction Overview

1. A user opens the **Dashboard Web UI** on a browser.  
2. The UI uses the current **User Context & Session** to call the **Dashboard API** (BFF) for:
   - Overall dashboard KPIs (FS-001, FS-004, FS-005)
   - Multiple cards summary (FS-002)
   - Monthly spend trend and card-wise analysis (FS-003)
   - Category-wise spend breakdown (FS-006)
3. The **Dashboard API**:
   - Retrieves card details and limits from the **Card Management Service** (backed by the Cards Store)
   - Retrieves relevant transactions from the **Transaction Service** (backed by the Transactions Store)
   - Delegates heavy aggregations to the **Analytics & Insights Service**, or computes lightweight aggregates itself where appropriate
4. The **Analytics & Insights Service**:
   - Reads raw transaction data from the Transactions Store
   - Computes and returns:
     - Monthly spend totals (overall and per card)
     - Card-wise spend distribution
     - Category-wise aggregations
5. The **Dashboard API** composes the results into a set of API responses optimized for the UI.  
6. The **Dashboard Web UI** renders the KPIs, cards, charts, and tables using responsive layouts to support different screen sizes.

The solution is intentionally decoupled around clear domains (cards, transactions, analytics, UI composition) so that future expansions such as real bank integrations, payments, and additional financial products can be added without major rework.

---

## 2. Components

```json
{
  "components": [
    {
      "name": "dashboard_web_ui",
      "responsibility": "Render a responsive single-page dashboard that shows consolidated credit card KPIs, multiple card details, monthly trends, card-wise and category-wise spend analytics.",
      "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006"]
    },
    {
      "name": "dashboard_api_bff",
      "responsibility": "Provide UI-optimized REST/GraphQL endpoints that aggregate card, transaction, and analytics data into consolidated dashboard responses per user.",
      "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006"]
    },
    {
      "name": "card_management_service",
      "responsibility": "Maintain and expose credit card profiles, limits, balances, and available credit for all of a user’s cards.",
      "implements": ["FS-001", "FS-002", "FS-004", "FS-005"]
    },
    {
      "name": "transaction_service",
      "responsibility": "Store and retrieve credit card transactions, providing query capabilities by card, date range, and category to support spend analysis.",
      "implements": ["FS-003", "FS-006"]
    },
    {
      "name": "analytics_insights_service",
      "responsibility": "Compute monthly spend trends, card-wise spend summaries, and category-wise spending aggregates across all cards for a user.",
      "implements": ["FS-003", "FS-006"]
    },
    {
      "name": "user_context_session_component",
      "responsibility": "Resolve the active user and their associated cards, enforcing per-user scoping for all dashboard data.",
      "implements": ["FS-002", "FS-003", "FS-004", "FS-005", "FS-006"]
    },
    {
      "name": "cards_store",
      "responsibility": "Persist credit card master data, including card identifiers, issuers, and credit limits.",
      "implements": ["FS-002", "FS-004"]
    },
    {
      "name": "transactions_store",
      "responsibility": "Persist all credit card transaction records, including amount, date, and category, to support trend and category analysis.",
      "implements": ["FS-003", "FS-006"]
    },
    {
      "name": "analytics_store",
      "responsibility": "Optionally hold materialized aggregates and precomputed analytics (monthly totals, category rollups) for fast dashboard rendering.",
      "implements": ["FS-001", "FS-003", "FS-006"]
    }
  ]
}
```

---

## 3. Functional Capabilities and Component Mapping

Below, each functional specification (FS-XXX) is inferred from the provided business and functional description and mapped to the components that realize it.

### FS-001 – Display Overall Dashboard KPIs
**Description**: Display overall KPIs including Monthly Spend, Total Credit Limit, Available Credit, and Outstanding Amount across all credit cards.

- **dashboard_web_ui** – Renders KPI tiles/cards in the dashboard header.
- **dashboard_api_bff** – Aggregates per-card data into overall KPI metrics for the UI.
- **card_management_service** – Provides total credit limit, per-card outstanding amount, and available credit, which are aggregated for the dashboard.
- **analytics_insights_service** – Supplies monthly spend aggregates across all cards.
- **analytics_store** (optional) – Stores precomputed KPI values to reduce response time.

### FS-002 – View and Manage Multiple Credit Cards in a Consolidated View
**Description**: Allow users to see details of multiple credit cards (issuer, masked number, credit limit, balance/available credit) from a single dashboard view.

- **dashboard_web_ui** – Presents a grid or list of card tiles/panels.
- **dashboard_api_bff** – Returns consolidated card summaries for the logged-in user.
- **card_management_service** – Provides card-level details, limits, balances, and available credit.
- **user_context_session_component** – Ensures only the user’s own cards are retrieved and shown.
- **cards_store** – Persists card details and limits.

### FS-003 – Monthly Spend Trends and Card-wise Spend Analysis
**Description**: Show monthly spending trends (e.g., line or bar chart) and card-wise spend breakdown over a selected time period.

- **dashboard_web_ui** – Renders charts for monthly spending trends and card-wise comparisons.
- **dashboard_api_bff** – Provides endpoints that return trend series and per-card spend totals.
- **transaction_service** – Supplies raw transactions within the selected time window.
- **analytics_insights_service** – Aggregates transactions into time-series metrics and card-wise totals.
- **transactions_store** – Holds the underlying transaction data.
- **analytics_store** (optional) – Stores pre-aggregated trend lines and card-wise breakdowns for faster retrieval.
- **user_context_session_component** – Scopes the data to the current user’s cards.

### FS-004 – Total Credit Limit and Available Credit Visibility
**Description**: Display total credit limit across all cards and derived available credit based on outstanding balances.

- **dashboard_web_ui** – Displays total credit limit and available credit as part of the KPIs and per-card views.
- **dashboard_api_bff** – Aggregates per-card limits into totals and computes overall available credit.
- **card_management_service** – Maintains card limits and current balances from which available credit is derived.
- **cards_store** – Stores card limit information.
- **user_context_session_component** – Ensures that only cards for the current user are included in these totals.

### FS-005 – Outstanding Amount Visibility
**Description**: Surface outstanding amounts (per card and total) to help users understand their current liabilities.

- **dashboard_web_ui** – Renders outstanding amounts in KPI tiles and card tiles.
- **dashboard_api_bff** – Aggregates per-card outstanding amounts to present overall outstanding value.
- **card_management_service** – Calculates and exposes per-card outstanding balances.
- **user_context_session_component** – Applies user scoping to outstanding balance retrieval.

### FS-006 – Category-wise Spending Analytics
**Description**: Provide interactive visualizations showing category-wise spending across categories such as Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, and Miscellaneous.

- **dashboard_web_ui** – Renders interactive charts (e.g., pie, donut, bar) for category-wise spending.
- **dashboard_api_bff** – Exposes category-wise aggregated spend data to the UI with optional filters (date range, card selection).
- **transaction_service** – Provides transaction-level data including the category dimension.
- **analytics_insights_service** – Aggregates spend by category and applies filters.
- **transactions_store** – Holds categorised transaction data.
- **analytics_store** (optional) – Caches category-wise aggregation results to reduce recomputation.
- **user_context_session_component** – Ensures only the categories and transactions belonging to the user’s cards are included.

---

## 4. Cross-Cutting Concerns

Cross-cutting concerns are addressed uniformly across relevant components rather than on a per-component basis in this HLD.

1. **Authentication & Authorization**
   - Rely on an enterprise identity provider (e.g., SSO / OAuth2 / OpenID Connect) to authenticate users.
   - The **user_context_session_component** consumes identity tokens or session info to resolve the current user and associate them with their cards.
   - The **dashboard_api_bff**, **card_management_service**, **transaction_service**, and **analytics_insights_service** all validate incoming calls with user identity, ensuring users can access only their own card and transaction data.

2. **Logging & Monitoring**
   - Implement centralized, structured logging (e.g., JSON logs) for all services: **dashboard_api_bff**, **card_management_service**, **transaction_service**, **analytics_insights_service**.
   - Track key events such as dashboard load, KPI retrieval, analytics queries, and error conditions.
   - Integrate with monitoring/observability tooling for metrics (e.g., dashboard response time, error rates) and health checks.

3. **Error Handling & Fault Tolerance**
   - Standardized error response model across APIs (HTTP status codes plus error payloads).
   - Graceful degradation in the **dashboard_web_ui**: if analytics data fails, show partial information with an appropriate message, while still showing basic card details where possible.
   - Circuit breakers and timeouts between **dashboard_api_bff** and downstream services to prevent cascading failures.

4. **Performance & Caching**
   - Use **analytics_store** and/or in-memory caches at the **analytics_insights_service** layer for frequently accessed aggregates (e.g., current month KPIs).
   - Pagination and time-window filters for transaction-heavy queries via **transaction_service**.
   - Frontend-level caching of last-viewed dashboard data to minimize redundant calls when switching views.

5. **Security & Data Protection**
   - Mask card numbers in all UI and API responses (only show last 4 digits).
   - Enforce HTTPS/TLS for all network communication.
   - Apply least-privilege access to data stores (cards, transactions, analytics) per service.

6. **Responsiveness & UX**
   - The **dashboard_web_ui** uses responsive layouts (CSS grid/flexbox, breakpoint design) to ensure usability across devices.
   - Progressive loading: KPIs and card summaries load first, detailed charts load asynchronously.

7. **Audit & Compliance (Optional)**
   - Capture read-access audit logs when users view sensitive financial data (card details, transactions).
   - Provide traceability for who accessed which card portfolio and when.

---

## 5. Component-to-FS Mapping Table

| FS ID   | Functional Description                                                     | Components Involved |
|--------|----------------------------------------------------------------------------|---------------------|
| FS-001 | Display Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount as KPIs | dashboard_web_ui, dashboard_api_bff, card_management_service, analytics_insights_service, analytics_store |
| FS-002 | Consolidated view of multiple credit cards and their key attributes        | dashboard_web_ui, dashboard_api_bff, card_management_service, user_context_session_component, cards_store |
| FS-003 | Monthly spend trends and card-wise spend analysis                          | dashboard_web_ui, dashboard_api_bff, transaction_service, analytics_insights_service, transactions_store, analytics_store, user_context_session_component |
| FS-004 | Total credit limit and available credit visibility                         | dashboard_web_ui, dashboard_api_bff, card_management_service, cards_store, user_context_session_component |
| FS-005 | Outstanding amount visibility (per card and overall)                       | dashboard_web_ui, dashboard_api_bff, card_management_service, user_context_session_component |
| FS-006 | Category-wise spending analytics for defined categories                    | dashboard_web_ui, dashboard_api_bff, transaction_service, analytics_insights_service, transactions_store, analytics_store, user_context_session_component |

---

## 6. JSON HLD Representation

```json
{
  "components": [
    {"name": "dashboard_web_ui", "responsibility": "Render a responsive single-page dashboard that shows consolidated credit card KPIs, multiple card details, monthly trends, card-wise and category-wise spend analytics.", "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006"]},
    {"name": "dashboard_api_bff", "responsibility": "Provide UI-optimized REST/GraphQL endpoints that aggregate card, transaction, and analytics data into consolidated dashboard responses per user.", "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006"]},
    {"name": "card_management_service", "responsibility": "Maintain and expose credit card profiles, limits, balances, and available credit for all of a user’s cards.", "implements": ["FS-001", "FS-002", "FS-004", "FS-005"]},
    {"name": "transaction_service", "responsibility": "Store and retrieve credit card transactions, providing query capabilities by card, date range, and category to support spend analysis.", "implements": ["FS-003", "FS-006"]},
    {"name": "analytics_insights_service", "responsibility": "Compute monthly spend trends, card-wise spend summaries, and category-wise spending aggregates across all cards for a user.", "implements": ["FS-003", "FS-006"]},
    {"name": "user_context_session_component", "responsibility": "Resolve the active user and their associated cards, enforcing per-user scoping for all dashboard data.", "implements": ["FS-002", "FS-003", "FS-004", "FS-005", "FS-006"]},
    {"name": "cards_store", "responsibility": "Persist credit card master data, including card identifiers, issuers, and credit limits.", "implements": ["FS-002", "FS-004"]},
    {"name": "transactions_store", "responsibility": "Persist all credit card transaction records, including amount, date, and category, to support trend and category analysis.", "implements": ["FS-003", "FS-006"]},
    {"name": "analytics_store", "responsibility": "Optionally hold materialized aggregates and precomputed analytics (monthly totals, category rollups) for fast dashboard rendering.", "implements": ["FS-001", "FS-003", "FS-006"]}
  ],
  "cross_cutting_concerns": [
    "Authentication & Authorization via centralized identity provider and per-user scoping",
    "Centralized structured logging & monitoring across all backend services",
    "Standardized error handling, graceful degradation, and fault tolerance",
    "Performance optimization via caching, pagination, and pre-aggregation of analytics",
    "Security & data protection including masked card numbers and TLS",
    "Responsive UX with progressive loading on the dashboard UI",
    "Audit & compliance logging for access to financial data (optional)"
  ],
  "narrative": "The Credit Card Analysis Dashboard is a modular web-based analytics solution that consolidates multiple credit cards, their limits, available credit, monthly spending, outstanding balances, and category-wise spending patterns into a single responsive dashboard. The architecture is organized into a presentation layer (Dashboard Web UI), an aggregation and orchestration layer (Dashboard API BFF and User Context & Session component), domain services (Card Management, Transaction, Analytics & Insights), and a data storage layer (Cards Store, Transactions Store, Analytics Store). Users interact with the Dashboard Web UI, which invokes the Dashboard API BFF with the current user context to retrieve optimized dashboard payloads. The BFF delegates to Card Management and Transaction services for core financial data, and to the Analytics & Insights service for computed metrics such as monthly spend trends, card-wise distributions, and category-wise breakdowns. Underlying stores retain cards and transactions, while optional precomputed aggregates accelerate dashboard load times. Cross-cutting concerns such as authentication, logging, error handling, performance optimization, and security are implemented consistently across services to ensure a secure, reliable, and performant user experience while real-time bank integration and payment flows remain out of scope."
}
"},