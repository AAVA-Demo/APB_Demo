# Credit Card Analysis Dashboard - High Level Design

## 1. Architecture Narrative

The **Credit Card Analysis Dashboard** is a read-only, responsive analytics application that provides consolidated insights across one or more credit cards. It is intentionally designed without any real-bank integrations, payment initiation, fund transfer, or loan-processing capabilities, focusing purely on monitoring and analysis.

The solution is structured into the following major logical components:

1. **Web UI / Presentation Layer**  
   - Responsive single-page application (SPA) or web frontend built with a modern UI framework.  
   - Provides three primary feature areas:
     - **Dashboard module** – consolidated KPIs (Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount), trends, and category-wise visualizations (FS-001, FS-002, FS-003, FS-004, FS-005, FS-006, FS-007, FS-009, FS-010, FS-013–FS-016, FS-023, FS-024, FS-025–FS-028).
     - **Cards module** – list of credit cards and per-card attributes used for analysis (FS-011, FS-014–FS-016, FS-017, FS-025, FS-026).
     - **Transactions module** – list of transactions, filters, and drill-through from KPIs/visuals (FS-012, FS-021, FS-022, FS-023, FS-024).
   - Hosts interactive visualizations (charts) for trends, card-wise, and category-wise analysis, with client-side interactions such as hover, filter, and selection (FS-007, FS-008, FS-009, FS-022).
   - Implements responsive layouts across mobile, tablet, and desktop per TN-001, TN-002, TN-007.

2. **API Gateway / Backend-for-Frontend (BFF)**  
   - Single façade API consumed by the Web UI.  
   - Aggregates and orchestrates data from underlying services into UI-optimized DTOs (e.g., `DashboardSummary`, `CardList`, `TransactionPage`, `TrendSeries`).
   - Applies business rules around KPI computation scope (e.g., active cards only, BR-007–BR-011), time-period handling, and feature scoping (blocking of payment/fund-transfer/loan flows, BR-018–BR-022, FS-018–FS-020).
   - Exposes endpoints such as:
     - `GET /dashboard/summary` – consolidated KPIs and key visuals (FS-001–FS-006, FS-010, FS-013–FS-016, FS-027, FS-028).
     - `GET /dashboard/trends` – monthly spend and outstanding trends (FS-007, FS-023).  
     - `GET /dashboard/category-spend` – category-wise aggregations (FS-009, FS-024).  
     - `GET /dashboard/card-spend` – card-wise spend (FS-008).  
     - `GET /cards` – list cards and attributes (FS-011, FS-014–FS-016, FS-017, FS-025, FS-026).  
     - `GET /transactions` – transaction search with filters (FS-012, FS-021, FS-022).  
   - Enforces read-only behavior by not exposing any mutating endpoints related to payments, transfers, or loans (FS-018–FS-020, BR-018–BR-022, TN-004).

3. **Card & Account Service**  
   - Domain service that manages logical representations of credit cards and associated analytical attributes.  
   - Responsibilities:
     - Maintain card metadata: identifiers, masked card numbers, status (active/inactive), credit limits, outstanding balances, utilization figures (FS-004–FS-006, FS-011, FS-014–FS-016, FS-027–FS-028).
     - Provide card lists and per-card views for a user session (FS-011, FS-017, FS-025, FS-026).
     - Compute or expose per-card available credit and outstanding amount, and expose these for aggregation (FS-005, FS-006, FS-014–FS-016, BR-007–BR-011).
   - Implements business rules restricting storage of sensitive data (no full PAN or CVV) and ensuring that only active cards are included in aggregation (BR-007–BR-011, TN-008, TN-009).

4. **Transaction & Analytics Service**  
   - Core analytical engine operating solely on internal transaction data (TN-005, TN-006, TN-010; BR-004–BR-006, BR-012–BR-017).
   - Responsibilities:
     - Store and retrieve transaction records with schema at least: `transaction_id`, `user_id`, `card_id`, `amount`, `date`, `category`, and supporting fields (FS-003, FS-007–FS-009, FS-012, FS-013, FS-021–FS-024; TN-005–TN-006).
     - Enforce category validation rules (BR-001–BR-003) so all categorized transactions use the fixed category list.
     - Provide aggregation capabilities:
       - Monthly spend for a period and over time (FS-003, FS-007, FS-013, FS-023; BR-004, BR-012, BR-013).
       - Category-wise spend per period (FS-009, FS-021, FS-022, FS-024; BR-003, BR-005, BR-015, BR-016).
       - Card-wise spend analysis (FS-008, FS-021; BR-006, BR-014, BR-016).
     - Support filterable transaction retrieval by card, category, date range, and other contexts (FS-012, FS-021, FS-022).
   - Exposes aggregation APIs both directly to BFF and, where appropriate, via precomputed views or caches to meet performance expectations for trend charts (TN-010).

5. **User Session & Access Control Service**  
   - Handles user sessions (including demo sessions) and associates a single authenticated login with multiple cards (FS-017; TN-008, TN-009).  
   - Responsibilities:
     - Provide authenticated user context and user ID to downstream services.
     - Enforce per-user data boundaries (cards and transactions only for active user/session).
     - Manage session expiration and reauthentication flows without per-card login (FS-017-A1).
   - Integrates with the Web UI and BFF through standard authentication mechanisms (e.g., session cookies or JWT) while remaining agnostic of real bank identity providers.

6. **Data Access & Storage Layer**  
   - Underpins Card & Account Service and Transaction & Analytics Service.
   - Likely realized as:
     - **Relational DB** for cards, card attributes, user-to-card associations, and reference data (categories).  
     - **Relational or analytical store** for transactions and aggregated metrics. Where volumes grow, pre-aggregation tables, materialized views, or offline batch jobs may be used for monthly trends and category-wise analytics (TN-005–TN-006, TN-010).
   - Enforces read-only operational semantics at application level, while still allowing internal data load tools (e.g., CSV importers) outside this solution boundary to populate data (TN-003, TN-006).

7. **Data Source Abstraction Layer**  
   - Thin abstraction between domain services and actual data sources.  
   - Responsibilities:
     - Route all data requests to internal or mock sources (e.g., local DB, file-based demo datasets) and **not** to real banking APIs (TN-003, TN-006, BR-018, TN-008).
     - Provide a pluggable contract for future integration with external providers, while currently binding only to internal stores.

8. **Feature Guard & Scope Enforcement Component**  
   - Logical cross-cutting component that ensures the system remains analysis-only (FS-018–FS-020; BR-018–BR-022; TN-004).
   - Responsibilities:
     - Centralized configuration flags indicating that payments, fund transfers, and loan operations are disabled.
     - Intercept and deny any attempted invocation of payment/transfer/loan routes or actions (e.g., 404/403 or redirect to informational screen).
     - Validate that no outbound connectors are configured to payment gateways or bank APIs.

These components interact as follows:

- The **End User** accesses the **Web UI**, which authenticates via the **User Session & Access Control Service** and renders responsive views for Dashboard, Cards, and Transactions.  
- The Web UI calls the **API Gateway/BFF** for all dashboard data needs.  
- The BFF uses the **Card & Account Service** and **Transaction & Analytics Service** to construct consolidated responses. All aggregations and business rules are executed in these services, underpinned by the **Data Access & Storage Layer** and **Data Source Abstraction Layer**.  
- The **Feature Guard & Scope Enforcement Component** works inside the BFF and services to ensure only read-only analytics flows are exposed and any payment/transfer/loan attempts are blocked.  
- Throughout, **business_rules** and **technical_notes** drive the shape of KPIs, category lists, aggregation scopes, the responsive UI design, and the lack of any external bank or payment integration.

---

## 2. Components and Responsibilities

| Component Name | Responsibility | Implements Functional Specs |
|----------------|----------------|-----------------------------|
| **Web_UI_Presentation_Layer** | Responsive web front-end providing Dashboard, Cards, and Transactions surfaces; renders KPIs, charts, lists, and interactive filters; manages navigation and responsive layouts across devices. | FS-001, FS-002, FS-003, FS-004, FS-005, FS-006, FS-007, FS-008, FS-009, FS-010, FS-011, FS-012, FS-013, FS-014, FS-015, FS-016, FS-017, FS-018, FS-019, FS-020, FS-021, FS-022, FS-023, FS-024, FS-025, FS-026, FS-027, FS-028 |
| **API_Gateway_BFF** | Single façade API that aggregates and orchestrates backend services into UI-optimized responses; exposes dashboard, card, and transaction endpoints; applies read-only and scope-enforcement checks. | FS-001, FS-002, FS-003, FS-004, FS-005, FS-006, FS-007, FS-008, FS-009, FS-010, FS-011, FS-012, FS-013, FS-014, FS-015, FS-016, FS-017, FS-018, FS-019, FS-020, FS-021, FS-022, FS-023, FS-024, FS-025, FS-026, FS-027, FS-028 |
| **Card_and_Account_Service** | Manages credit card entities and attributes (limits, outstanding balances, utilization); supplies per-card and aggregated views; ensures only active cards participate in KPI calculations. | FS-001, FS-002, FS-004, FS-005, FS-006, FS-010, FS-011, FS-014, FS-015, FS-016, FS-017, FS-025, FS-026, FS-027, FS-028 |
| **Transaction_and_Analytics_Service** | Stores transaction records and performs all analytical aggregations (monthly spend, trends, category-wise and card-wise analysis); enforces category validation rules and alignment between KPIs and underlying transaction lists. | FS-003, FS-007, FS-008, FS-009, FS-010, FS-012, FS-013, FS-021, FS-022, FS-023, FS-024, FS-025, FS-026, FS-027, FS-028 |
| **User_Session_and_Access_Control_Service** | Provides authentication (including demo sessions), session lifecycle, and per-user data scoping across cards and transactions; supports single login for multi-card access. | FS-001, FS-002, FS-003, FS-004, FS-005, FS-006, FS-007, FS-008, FS-009, FS-010, FS-011, FS-012, FS-013, FS-014, FS-015, FS-016, FS-017, FS-021, FS-022, FS-023, FS-024, FS-025, FS-026, FS-027, FS-028 |
| **Data_Access_and_Storage_Layer** | Persists cards, transactions, and derived aggregates; provides performant querying and optional pre-aggregation/materialized views for analytics; enforces internal-only data sources. | FS-001, FS-002, FS-003, FS-004, FS-005, FS-006, FS-007, FS-008, FS-009, FS-010, FS-011, FS-012, FS-013, FS-014, FS-015, FS-016, FS-017, FS-021, FS-022, FS-023, FS-024, FS-025, FS-026, FS-027, FS-028 |
| **Data_Source_Abstraction_Layer** | Abstracts underlying data providers so that all analytics and views rely solely on internal/mock datasets; ensures no calls are made to real bank APIs or payment gateways while allowing future pluggability. | FS-001, FS-002, FS-003, FS-004, FS-005, FS-006, FS-007, FS-008, FS-009, FS-010, FS-011, FS-012, FS-013, FS-014, FS-015, FS-016, FS-017, FS-021, FS-022, FS-023, FS-024, FS-025, FS-026, FS-027, FS-028 |
| **Feature_Guard_and_Scope_Enforcement** | Centralized enforcement of scope constraints; ensures payments, fund transfers, loans and payment-gateway integrations are disabled and blocked; validates that all flows remain read-only analytics. | FS-018, FS-019, FS-020 |

---

## 3. Functional Capability-to-Component Mapping

Below each functional spec (FS) is mapped to the component(s) that implement it.

- **FS-001 – View consolidated dashboard showing information for all added credit cards in a single interface**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer  
  - Data_Source_Abstraction_Layer

- **FS-002 – Monitor more than one credit card concurrently within the dashboard**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer  
  - Data_Source_Abstraction_Layer

- **FS-003 – Display Monthly Spend KPI for the selected time period on the dashboard**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Transaction_and_Analytics_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer  
  - Data_Source_Abstraction_Layer

- **FS-004 – Display Total Credit Limit across user’s credit cards as a KPI**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer  
  - Data_Source_Abstraction_Layer

- **FS-005 – Display Available Credit across user’s credit cards as a KPI**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer  
  - Data_Source_Abstraction_Layer

- **FS-006 – Display Outstanding Amount across user’s credit cards as a KPI**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer  
  - Data_Source_Abstraction_Layer

- **FS-007 – View Monthly Spend trends over time via visual representation**  
  - Web_UI_Presentation_Layer (charts)  
  - API_Gateway_BFF  
  - Transaction_and_Analytics_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer  
  - Data_Source_Abstraction_Layer

- **FS-008 – View card-wise spend analysis to compare spending metrics per individual card**  
  - Web_UI_Presentation_Layer (card-wise analysis view)  
  - API_Gateway_BFF  
  - Transaction_and_Analytics_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer  
  - Data_Source_Abstraction_Layer

- **FS-009 – View interactive category-wise spending visualizations**  
  - Web_UI_Presentation_Layer (category charts)  
  - API_Gateway_BFF  
  - Transaction_and_Analytics_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer  
  - Data_Source_Abstraction_Layer

- **FS-010 – Access Dashboard module presenting KPIs, visualizations, and summary information**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - Transaction_and_Analytics_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer  
  - Data_Source_Abstraction_Layer

- **FS-011 – View Cards module/list with each credit card and its attributes**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-012 – View Transactions module/list used to compute spending, trends, and category-wise analytics**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Transaction_and_Analytics_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-013 – View Monthly Spending values within the dashboard for at least one monthly period**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Transaction_and_Analytics_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-014 – View credit limit per card and/or total credit limit within the dashboard**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-015 – View available credit per card and/or total available credit within the dashboard**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-016 – View outstanding balance per card and/or combined outstanding balance within the dashboard**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-017 – View information for multiple credit cards in a single session without separate logins per card**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-018 – Prevent card payment initiation flows within the dashboard**  
  - Web_UI_Presentation_Layer (no payment UI)  
  - API_Gateway_BFF  
  - Feature_Guard_and_Scope_Enforcement

- **FS-019 – Prevent fund transfer functionality between accounts or cards from within the dashboard**  
  - Web_UI_Presentation_Layer (no transfer UI)  
  - API_Gateway_BFF  
  - Feature_Guard_and_Scope_Enforcement

- **FS-020 – Prevent loan-related features (viewing, applying, managing loans) within the dashboard**  
  - Web_UI_Presentation_Layer (no loan UI)  
  - API_Gateway_BFF  
  - Feature_Guard_and_Scope_Enforcement

- **FS-021 – View list of transactions per card underlying Monthly Spend, category-wise spending, and card-wise analysis**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Transaction_and_Analytics_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-022 – Use interactive behaviors on visualizations (filtering, hovering for details, selecting time ranges) to explore spending data**  
  - Web_UI_Presentation_Layer (interactive charts & filters)  
  - API_Gateway_BFF  
  - Transaction_and_Analytics_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-023 – Track spending patterns over time to identify trends in monthly spending and outstanding balances**  
  - Web_UI_Presentation_Layer (trend views)  
  - API_Gateway_BFF  
  - Transaction_and_Analytics_Service  
  - Card_and_Account_Service (outstanding trends)  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-024 – Distinguish spending amounts by each defined spending category within a selected period**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Transaction_and_Analytics_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-025 – Display information for at least one credit card for single-card users**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - Transaction_and_Analytics_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-026 – Display information for multiple credit cards for multi-card users**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - Transaction_and_Analytics_Service  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-027 – View total outstanding balance across all cards at a glance**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - Transaction_and_Analytics_Service (if trend history is included)  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

- **FS-028 – View total available credit across all cards at a glance**  
  - Web_UI_Presentation_Layer  
  - API_Gateway_BFF  
  - Card_and_Account_Service  
  - Transaction_and_Analytics_Service (if used for derived utilization trends)  
  - User_Session_and_Access_Control_Service  
  - Data_Access_and_Storage_Layer

---

## 4. Cross-Cutting Concerns

The following cross-cutting concerns apply across components; they are not repeated per component.

1. **Authentication and Session Management**  
   - All user interactions (except potentially an anonymous demo mode) require authentication that maps a user to one or more cards (FS-017; TN-008, TN-009).  
   - Implemented centrally by the **User_Session_and_Access_Control_Service** and enforced at the **API_Gateway_BFF**.  
   - Sessions must support timeout and reauthentication without requiring per-card logins.

2. **Authorization & Data Isolation**  
   - Every request to Card & Account Service and Transaction & Analytics Service is scoped to the authenticated user’s ID, ensuring users can only see their own cards and transactions.  
   - Future multi-tenant scenarios can reuse this model without major refactoring (TN-008).

3. **Audit, Logging, and Monitoring**  
   - Centralized structured logging at BFF and service layers for all dashboard, card, and transaction retrieval operations, including filters used and response timings.  
   - Monitoring and metrics (e.g., time-to-render dashboard, query latencies, chart data size) to identify performance issues, especially on mobile devices (TN-002, TN-010).

4. **Error Handling and Resilience**  
   - Consistent non-technical error messages delivered to the UI for data load failures (e.g., FS-001-A2, FS-002-A2, FS-010-A1).  
   - BFF implements graceful degradation: partial data (e.g., KPIs without charts) still returns 200 with embedded error sections for failed parts.  
   - Timeouts, retries, and circuit breakers between BFF and backend services to maintain responsiveness.

5. **Validation and Business Rule Enforcement**  
   - Category values validated against the fixed enumeration (BR-001, BR-002).  
   - KPIs computed based solely on internal transaction data and active cards (BR-003–BR-017).  
   - Permission rules blocking external integrations and financial operations (BR-018–BR-022) enforced at BFF and Feature_Guard_and_Scope_Enforcement.

6. **Security and Data Protection**  
   - HTTPS-only communications between UI and BFF, and between BFF and services (TN-008, TN-009).  
   - Card numbers stored only in masked form; no CVV or full PANs persisted.  
   - Access to card and transaction data restricted to authenticated sessions, even in demo environments.

7. **Performance and Scalability**  
   - Use of indexes and query optimization for transaction tables; pagination for transaction listings (FS-012, FS-021).  
   - Optionally, pre-aggregated tables/materialized views for monthly and category-wise analytics for users with high transaction volumes (TN-010).  
   - Caching of frequently accessed aggregates (e.g., current-month KPIs) where consistent with freshness requirements.

8. **Responsiveness & UX Consistency**  
   - Shared responsive layout rules and breakpoints applied across Dashboard, Cards, and Transactions modules (TN-001, TN-002, TN-007).
   - Charting components configured for touch interactions and adaptive layout on small screens.

9. **Configuration & Feature Flags**  
   - Central config for enabling/disabling modules or analytics (e.g., advanced drill-downs) independent of core KPIs.  
   - Hard-disabled flags (non-configurable in this version) for payment, fund transfer, loan, and real bank integration to uphold out-of-scope guarantees (FS-018–FS-020, TN-003, TN-004, BR-018–BR-022).

---

## 5. JSON HLD Representation

```json
{
  "components": [
    {
      "name": "Web_UI_Presentation_Layer",
      "responsibility": "Responsive web front-end providing Dashboard, Cards, and Transactions views; renders KPIs, charts, and transaction lists; manages navigation, filters, and interactive visualizations across devices.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028"
      ]
    },
    {
      "name": "API_Gateway_BFF",
      "responsibility": "Backend-for-frontend façade exposing dashboard, card, and transaction endpoints; orchestrates Card and Transaction services into UI-optimized payloads; enforces read-only scope and feature guards.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028"
      ]
    },
    {
      "name": "Card_and_Account_Service",
      "responsibility": "Manages credit card entities and analytical attributes (limits, outstanding balances, utilization); returns per-card details and aggregates used for KPIs and dashboard views.",
      "implements": [
        "FS-001","FS-002","FS-004","FS-005","FS-006","FS-010","FS-011","FS-014","FS-015","FS-016","FS-017","FS-025","FS-026","FS-027","FS-028"
      ]
    },
    {
      "name": "Transaction_and_Analytics_Service",
      "responsibility": "Stores transaction records and implements analytical computations for monthly spend, trends, category-wise and card-wise analysis; ensures KPIs align with underlying transaction lists and category rules.",
      "implements": [
        "FS-003","FS-007","FS-008","FS-009","FS-010","FS-012","FS-013","FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028"
      ]
    },
    {
      "name": "User_Session_and_Access_Control_Service",
      "responsibility": "Provides authentication and session management, mapping a single login to multiple cards; enforces per-user data scoping for cards and transactions; handles session expiry and reauthentication.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028"
      ]
    },
    {
      "name": "Data_Access_and_Storage_Layer",
      "responsibility": "Persists cards, transactions, and optional pre-aggregated analytics; provides performant querying and indexing; underpins all read-only analytical endpoints.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028"
      ]
    },
    {
      "name": "Data_Source_Abstraction_Layer",
      "responsibility": "Abstracts underlying data providers so that all analytics and dashboards are driven solely from internal/mock sources; prevents any real-time calls to external bank or payment APIs while remaining extensible.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028"
      ]
    },
    {
      "name": "Feature_Guard_and_Scope_Enforcement",
      "responsibility": "Central feature-flag and scope enforcement layer that blocks payments, fund transfers, loan operations, and payment-gateway integrations, ensuring the system remains read-only and analysis-only.",
      "implements": [
        "FS-018","FS-019","FS-020"
      ]
    }
  ],
  "cross_cutting_concerns": [
    "Authentication and session management across all UI and API requests, mapping users to their cards without per-card logins.",
    "Authorization and per-user data isolation so that each user sees only their own cards and transactions.",
    "Centralized audit logging, structured application logs, and operational monitoring for dashboard, cards, and transaction flows.",
    "Consistent error handling and graceful degradation when backend services or aggregations fail, including user-friendly messages.",
    "Validation and enforcement of business rules for KPIs, category values, aggregation scopes, and out-of-scope operations.",
    "Security and data protection including HTTPS-only access, masked card identifiers, and restricted storage of sensitive card data.",
    "Performance and scalability measures such as indexing, pagination, caching, and optional pre-aggregation for analytics.",
    "Responsive UX and accessibility, with layouts and charts adapting to mobile, tablet, and desktop while retaining full functionality.",
    "Configuration and feature-flag management, including hard-disabled capabilities for payments, fund transfers, loans, and real bank integrations."
  ],
  "narrative": "The Credit Card Analysis Dashboard is a read-only, responsive analytics solution that consolidates information from one or more credit cards into a single web experience. A responsive Web UI exposes three primary modules—Dashboard, Cards, and Transactions—backed by a backend-for-frontend (BFF) API that orchestrates dedicated Card and Transaction services. All KPIs, such as Monthly Spend, Total Credit Limit, Available Credit, and Outstanding Amount, are derived exclusively from internal card and transaction data stored in the platform's databases, in accordance with strict business rules that prohibit reliance on real bank feeds or payment gateways. The Card and Account Service manages card metadata and per-card analytical attributes, while the Transaction and Analytics Service stores transaction records and computes monthly, category-wise, card-wise, and time-series aggregations. A User Session and Access Control Service provides authentication and maps each user session to one or more cards, enabling multi-card monitoring without per-card login flows. Underneath, a Data Access and Storage Layer and a Data Source Abstraction Layer ensure that all data originates from internal or mock sources, with an eye toward future extensibility to real providers. A Feature Guard and Scope Enforcement component, integrated into the BFF and services, ensures that the system remains purely analytical by blocking any attempt to initiate payments, fund transfers, loans, or external payment-gateway calls. Cross-cutting concerns—including security, logging, error handling, validation, responsiveness, and performance optimization—are consistently applied across all components, yielding a robust, scalable, and user-friendly platform for credit card analysis without any transactional capabilities."
}
```
