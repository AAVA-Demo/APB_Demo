# Credit Card Analysis Dashboard - High Level Design

## 1. Architecture Narrative

The **Credit Card Analysis Dashboard** is a responsive, read-only analytics experience that surfaces card, transaction, and KPI insights from internal/mock data sources. It is implemented as a web-based dashboard with a modular front-end and a service-oriented backend. No live banking connectivity, payments, transfers, loans, or payment-gateway transactions are allowed.

### 1.1 High-Level View

At a high level, the solution consists of:

- **Web UI (SPA/Responsive Front-End)** – Presents the dashboard, card tiles, KPI panels, transactions table, and analytics visualizations (category-wise, card-wise, trends). Built as a responsive single-page application (SPA) or equivalent modern web front end. Communicates with backend services over HTTPS/REST using JSON APIs. Implements layout, interaction behavior, accessibility, and basic client-side validations.

- **API Gateway / Backend-for-Frontend (BFF)** – A lightweight façade that exposes dashboard-focused endpoints optimized for the UI. It orchestrates calls to domain microservices or internal modules, aggregates data, enforces cross-cutting policies (auth, authorization, logging), and applies business rules like category vocabulary validation and non-transactional scope.

- **Card & User Profile Service** – Manages in-scope card metadata for each user (card identifiers, labels, brands, status, credit limits, and card-to-user associations). Provides APIs for listing cards, fetching card details and credit limits, and supplying context for analytics.

- **Transactions & Category Aggregation Service** – Owns transaction records for in-scope cards and enforces categorization business rules (BR-001, BR-002). Provides APIs for transaction listing, category-wise aggregation, and card-wise aggregation over configurable periods.

- **KPI Aggregation Service** – Computes dashboard KPIs including Monthly Spend, Total Credit Limit, Available Credit, and Outstanding Amount. It consumes card, transaction, and balance data (from internal/mock stores) and exposes KPI-centric APIs. Implements error-tolerant aggregation and “N/A/0” behaviors.

- **Analytics & Trends Service** – Computes higher-level analytics such as monthly spending trends and configurable trend windows (e.g., last 3, 6, or 12 months). Supports parameterized queries by time period and card filters, and returns data suitable for charting components.

- **Data Store(s) (Internal/Mock Only)** – Persist user cards, transactions, category configuration, and precalculated aggregates if needed. These stores are explicitly **non-live**, using static datasets, mock APIs, or internal databases. All rules preventing live bank integration (BR-003, BR-004, BR-013, BR-014) apply here.

- **Configuration & Governance Store** – Holds governed configuration such as the allowed spending categories list, KPI calculation parameters, and non-functional settings (e.g., default trend window, supported devices and breakpoints). This supports category governance (BR-001, BR-002) and the “No Real Bank Connectivity / No Transaction Execution” policies.

The system is designed to be **read-only**, **analytics-focused**, and **device responsive**, supporting single-card and multi-card scenarios without any capability to execute financial transactions.

### 1.2 Component Responsibilities and Interactions

#### Web UI (Dashboard Shell & Views)

- Hosts the unified **Credit Card Analysis Dashboard** view that includes:
  - Cards overview (FS-001, FS-002, FS-014, FS-015, FS-020, FS-021)
  - KPI panel for Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount (FS-003–FS-007, FS-016–FS-019)
  - Transactions section (FS-013, FS-014, FS-025)
  - Analytics visualizations (category-wise, card-wise, trends) (FS-008–FS-012, FS-022–FS-024)
- Implements a responsive layout (TN-001, TN-004, TN-006, TN-007) so that must-have features are functionally accessible across mobile, tablet, and desktop.
- Uses a charting library capable of responsive, touch-friendly interactions (TN-002, TN-008, TN-010).
- Implements empty/error states per functional specs (e.g., no cards, no transactions, N/A KPIs).
- Applies security and privacy considerations in responsive views (TN-015), e.g., masking card numbers, avoiding overexposure of sensitive details on small screens.
- Consumes BFF APIs and binds returned JSON into cards, tables, and charts.

**Interactions:**
- Calls **BFF** to retrieve consolidated dashboard payloads and to update visualizations when filters/time ranges change.
- Reacts to BFF responses by updating KPI tiles, card tiles, transactions table, and chart components.

#### API Gateway / Backend-for-Frontend (BFF)

- Exposes **dashboard-oriented REST endpoints** such as:
  - `GET /dashboard/overview` – returns cards, KPIs, headline analytics for initial load.
  - `GET /dashboard/cards` – card list and high-level card metrics.
  - `GET /dashboard/kpis` – Monthly Spend, Total Limit, Available Credit, Outstanding Amount.
  - `GET /dashboard/transactions` – paged/filtered transaction listing.
  - `GET /dashboard/analytics/category-spend` – category-wise aggregated spend.
  - `GET /dashboard/analytics/card-spend` – card-wise aggregated spend.
  - `GET /dashboard/analytics/monthly-trends` – trend datasets with period and card filters.
- Orchestrates calls to **Card & User Profile**, **Transactions & Category Aggregation**, **KPI Aggregation**, and **Analytics & Trends** services.
- Applies cross-cutting rules:
  - Enforces **authN/authZ** and ensures only authenticated, authorized users can access dashboard data.
  - Enforces **No Real Bank Connectivity** and **No Transaction Execution** by ensuring no outward calls to external banking/payment endpoints and no mutation/payment APIs.
  - Performs request validation and parameter normalization (e.g., date ranges, card IDs, allowed categories) before calling downstream services.
- Aggregates partial failures into user-friendly states (e.g., some KPIs N/A while others are available as in FS-007-A1, FS-014-A1, FS-024-A2).

**Interactions:**
- Receives HTTP/JSON calls from **Web UI**.
- Calls underlying services using internal APIs (REST/GRPC) and combines results into dashboard responses.
- Logs all calls and errors for observability.

#### Card & User Profile Service

- Stores and retrieves card metadata and associations with users:
  - Card label, masked number, brand, issuing bank label, status.
  - Credit limit per card (if available).
  - Flags or metadata for cards with incomplete data.
- Supports single-card and multi-card scenarios (FS-020, FS-021) and ensures card lists can be retrieved for any authenticated user.
- Provides data needed by KPIs and analytics services for per-card aggregation.

**Interactions:**
- Serves `GET /cards?userId=...` to **BFF**.
- Exposes card metadata to **KPI Aggregation Service** (credit limits, statuses).

#### Transactions & Category Aggregation Service

- Owns raw transaction records for in-scope cards, sourced exclusively from internal/mock data stores (BR-004, BR-013).
- Enforces category mapping rules:
  - Ensures each transaction has exactly one allowed category (BR-001).
  - Validates categories against the governed list (BR-002) stored in **Configuration & Governance Store**.
- Provides APIs to:
  - List transactions by user/card/time range (FS-013, FS-014, FS-020–FS-022, FS-025).
  - Aggregate spend by category across all cards or per card (FS-008, FS-022).
  - Supply data for card-wise spend views (FS-011, FS-012).

**Interactions:**
- Called by **BFF** for transaction lists and category-based analytics.
- Provides aggregated feeds to **KPI Aggregation** and **Analytics & Trends** services.

#### KPI Aggregation Service

- Implements business logic for key KPIs:
  - **Monthly Spend** (FS-003, FS-016) – sums transaction amounts over the configured monthly period.
  - **Total Credit Limit** (FS-004, FS-017) – aggregates credit limits across cards per business rules.
  - **Available Credit** (FS-005, FS-018) – calculates limit minus outstanding/used balances.
  - **Outstanding Amount** (FS-006, FS-019) – computes unpaid balance, statement/current as defined.
- Encodes rules for handling missing data (FS-004-A1/A2, FS-005-A1, FS-006-A1/A2, FS-003-A1/A2):
  - Returns 0 where appropriate (no transactions or balances).
  - Returns explicit “no data” states producing N/A placeholders.
- Provides consolidated KPI payloads used by BFF to compose the dashboard KPI panel (FS-007).

**Interactions:**
- Retrieves card base data from **Card & User Profile Service**.
- Retrieves/aggregates transaction and balance data from **Transactions & Category Aggregation Service**.
- Returns KPI objects to **BFF**.

#### Analytics & Trends Service

- Specializes in time-series and comparative analytics:
  - Monthly spending trends over default and user-selected periods (FS-009, FS-010, FS-023).
  - Parameterized by card scope (all cards or per card) and time ranges.
  - Supplies datasets optimized for visualization (ordered series of (month, amount) points).
- Supports interactive analytics behavior (FS-024): filtering by card, category, date range, and combining multiple filters.
- Handles partial/empty data gracefully (FS-009-A1, FS-010-A1, FS-024-A1/A2).

**Interactions:**
- Consumes aggregated transaction data from **Transactions & Category Aggregation Service**.
- Exposes trend endpoints to **BFF** (e.g., `GET /analytics/monthly-trends?userId=...&from=...&to=...&cardId=`).

#### Data Store(s) – Internal/Mock

- Provide persistence for:
  - User profiles and card metadata.
  - Transactions and categories.
  - Optional pre-aggregated KPIs and analytic summaries (for performance).
- Must comply with **No Real Bank Connectivity** rules (BR-003, BR-004, BR-013, BR-014):
  - Populated via controlled, non-live sources (mock data, batch loads, internal systems).
  - No direct connection to external banks or payment gateways from this dashboard context.

**Interactions:**
- Accessed by domain services (Card & User Profile, Transactions & Category Aggregation, KPI Aggregation, Analytics & Trends).

#### Configuration & Governance Store

- Maintains governed configuration:
  - Allowed category list for analytics (BR-001, BR-002, C-004 resolution).
  - Feature toggles ensuring no payment, transfer, loan, or payment gateway actions are exposed (BR-005–BR-012, BR-015–BR-016; C-002, C-003).
  - KPI definitions (periods, rounding rules), default trend ranges, and device breakpoints.
- Used by services and UI for consistent behavior and enforcement.

**Interactions:**
- Read by **Transactions & Category Aggregation**, **KPI Aggregation**, **Analytics & Trends**, and **BFF** at startup and/or runtime.

## 2. Components and Functional Mapping

### 2.1 Components Array

```json
{
  "components": [
    {
      "name": "web_ui_dashboard_shell",
      "responsibility": "Responsive SPA shell and unified Credit Card Analysis Dashboard view including cards, KPIs, transactions, and analytics visualizations.",
      "implements": ["FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024","FS-025"]
    },
    {
      "name": "api_gateway_bff",
      "responsibility": "Backend-for-Frontend layer exposing dashboard-oriented REST APIs, orchestrating downstream services, aggregating data, and enforcing no-live-bank and no-transaction rules.",
      "implements": ["FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024","FS-025"]
    },
    {
      "name": "card_user_profile_service",
      "responsibility": "Manages user card metadata, associations, and credit limits; supports single-card and multi-card scenarios.",
      "implements": ["FS-001","FS-002","FS-004","FS-007","FS-014","FS-015","FS-017","FS-020","FS-021"]
    },
    {
      "name": "transactions_category_aggregation_service",
      "responsibility": "Persists transactions, enforces category assignment and vocabulary governance, and exposes transaction lists and category-wise/card-wise aggregations.",
      "implements": ["FS-003","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-013","FS-014","FS-016","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024"]
    },
    {
      "name": "kpi_aggregation_service",
      "responsibility": "Computes KPI values (Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount), handles missing data, and provides consolidated KPI payloads.",
      "implements": ["FS-003","FS-004","FS-005","FS-006","FS-007","FS-016","FS-017","FS-018","FS-019"]
    },
    {
      "name": "analytics_trends_service",
      "responsibility": "Delivers higher-level analytics such as monthly spending trends over configurable periods and supports interactive, filterable analytics views.",
      "implements": ["FS-009","FS-010","FS-011","FS-012","FS-020","FS-021","FS-023","FS-024"]
    },
    {
      "name": "internal_data_store_cluster",
      "responsibility": "Non-live persistence for user cards, transactions, and optional aggregates using internal/mock data sources only.",
      "implements": ["FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-013","FS-014","FS-016","FS-017","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024"]
    },
    {
      "name": "configuration_governance_store",
      "responsibility": "Holds governed configuration for allowed categories, feature toggles excluding payments/transfers/loans, KPI parameters, and default analytics ranges.",
      "implements": ["FS-008","FS-009","FS-010","FS-022","FS-023","FS-024","FS-025"]
    }
  ]
}
```

### 2.2 Functional Capability → Component Mapping (Tabular)

| FS ID  | Capability (Summary)                                                                      | web_ui_dashboard_shell | api_gateway_bff | card_user_profile_service | transactions_category_aggregation_service | kpi_aggregation_service | analytics_trends_service | internal_data_store_cluster | configuration_governance_store |
|-------|--------------------------------------------------------------------------------------------|------------------------|-----------------|---------------------------|-------------------------------------------|-------------------------|--------------------------|----------------------------|---------------------------------|
| FS-001| View consolidated list of all user credit cards                                            | ✓                      | ✓               | ✓                         |                                       –   | –                       | –                        | ✓                          | –                               |
| FS-002| Monitor multiple credit cards simultaneously                                               | ✓                      | ✓               | ✓                         | –                                         | –                       | –                        | ✓                          | –                               |
| FS-003| View Monthly Spend KPI across all cards                                                    | ✓                      | ✓               | –                         | ✓                                         | ✓                       | –                        | ✓                          | –                               |
| FS-004| View Total Credit Limit KPI                                                                | ✓                      | ✓               | ✓                         | –                                         | ✓                       | –                        | ✓                          | –                               |
| FS-005| View Available Credit KPI                                                                  | ✓                      | ✓               | –                         | ✓                                         | ✓                       | –                        | ✓                          | –                               |
| FS-006| View Outstanding Amount KPI                                                                | ✓                      | ✓               | –                         | ✓                                         | ✓                       | –                        | ✓                          | –                               |
| FS-007| Display core KPIs (Monthly Spend, Total Limit, Available, Outstanding)                     | ✓                      | ✓               | ✓                         | ✓                                         | ✓                       | –                        | ✓                          | –                               |
| FS-008| View interactive category-wise spending visualization                                      | ✓                      | ✓               | –                         | ✓                                         | –                       | –                        | ✓                          | ✓                               |
| FS-009| Analyze monthly spending trends over time                                                  | ✓                      | ✓               | –                         | ✓                                         | –                       | ✓                        | ✓                          | ✓                               |
| FS-010| Configure and explore monthly spend trends over configurable period                        | ✓                      | ✓               | –                         | ✓                                         | –                       | ✓                        | ✓                          | ✓                               |
| FS-011| View card-wise spend analysis                                                              | ✓                      | ✓               | –                         | ✓                                         | –                       | ✓                        | ✓                          | –                               |
| FS-012| Interact with card-wise spend visualizations                                               | ✓                      | ✓               | –                         | –                                         | –                       | ✓                        | ✓                          | –                               |
| FS-013| View list/summary of transactions                                                          | ✓                      | ✓               | –                         | ✓                                         | –                       | –                        | ✓                          | –                               |
| FS-014| Unified view of cards, transactions, and KPIs in single dashboard                          | ✓                      | ✓               | ✓                         | ✓                                         | ✓                       | ✓                        | ✓                          | –                               |
| FS-015| Successfully view multiple cards without errors                                            | ✓                      | ✓               | ✓                         | –                                         | –                       | –                        | ✓                          | –                               |
| FS-016| Successfully view monthly spending within dashboard                                        | ✓                      | ✓               | –                         | ✓                                         | ✓                       | –                        | ✓                          | –                               |
| FS-017| Successfully view credit limits for cards                                                  | ✓                      | ✓               | ✓                         | –                                         | ✓                       | –                        | ✓                          | –                               |
| FS-018| Successfully view available credit                                                         | ✓                      | ✓               | –                         | ✓                                         | ✓                       | –                        | ✓                          | –                               |
| FS-019| Successfully view outstanding balances                                                     | ✓                      | ✓               | –                         | ✓                                         | ✓                       | –                        | ✓                          | –                               |
| FS-020| Support a user managing a single card                                                      | ✓                      | ✓               | ✓                         | ✓                                         | ✓                       | ✓                        | ✓                          | –                               |
| FS-021| Support users managing multiple cards                                                      | ✓                      | ✓               | ✓                         | ✓                                         | ✓                       | ✓                        | ✓                          | –                               |
| FS-022| Support category-wise aggregation per card/across cards                                   | ✓                      | ✓               | –                         | ✓                                         | –                       | ✓                        | ✓                          | ✓                               |
| FS-023| Explore monthly spending trends through interactive visualizations                         | ✓                      | ✓               | –                         | ✓                                         | –                       | ✓                        | ✓                          | ✓                               |
| FS-024| Interact with analytics visualizations via filtering and selection                         | ✓                      | ✓               | –                         | ✓                                         | –                       | ✓                        | ✓                          | ✓                               |
| FS-025| View card/transaction/KPI data without payment-related actions                             | ✓                      | ✓               | –                         | –                                         | –                       | –                        | –                          | ✓                               |

## 3. Cross-Cutting Concerns

### 3.1 Authentication and Authorization

- **AuthN**: All dashboard endpoints require authenticated users. Authentication is delegated to an existing identity provider (IdP) or application auth layer; the dashboard assumes the user is authenticated before accessing the dashboard route (FS preconditions referencing “user account exists and is authenticated”).
- **AuthZ**: Authorization is enforced at the **BFF** and downstream services:
  - User can only access cards and transactions associated with their profile.
  - No admin or cross-user data access paths are exposed via the dashboard APIs.
- Token/credential handling is isolated in infrastructure; the dashboard never handles raw secrets beyond standard tokens in HTTP headers.

### 3.2 No Real Bank Connectivity & No Transaction Execution

Implemented as consolidated policies based on BR-003–BR-016 and conflict resolutions C-001–C-003:

- **No Real Bank Connectivity Policy**:
  - All runtime data for cards, transactions, and KPIs is sourced exclusively from **internal/mock data stores** and internal upstream systems.
  - Any configuration pointing to live banking endpoints is disabled in production (BR-014).
  - No outbound network routes from dashboard services to live banking domains are allowed.

- **No Transaction Execution Policy**:
  - UI presents **view-only** capabilities; no buttons or flows for payments, transfers, loans, or gateway-based transactions (FS-025, BR-005–BR-012, BR-015–BR-016).
  - Backend exposes **no** APIs that execute payments, transfers, or loan operations.
  - Any sandbox/demo gateway interactions, if ever needed, must be clearly non-production and non-transactional, and are strictly separated from the dashboard environment.

### 3.3 Logging, Monitoring, and Error Handling

- **Logging**:
  - BFF logs all incoming requests, response times, and significant errors.
  - Services log aggregation operations, category validation failures, and KPI computation errors.
  - Sensitive data (full card numbers, PII) is never logged. Only masked identifiers and aggregate statistics are allowed.
- **Monitoring**:
  - Dashboards and alerts are configured for API latency, error rates, and front-end performance budgets (TN-002, TN-010).
  - Trend/KPI endpoints are monitored given their centrality to perceived functionality.
- **Error Handling**:
  - Services distinguish between **data absence** (empty result sets, zero transactions) and **technical errors** (exceptions, timeouts) and respond accordingly.
  - BFF translates technical errors into structured problem responses that the UI can interpret (e.g., `status="unavailable"` for specific tiles).
  - UI renders error/empty states per FS alt-flows: empty messages, N/A placeholders, non-breaking layout when specific sections fail (FS-001-A2, FS-003-A2, FS-004-A2, FS-006-A2, FS-007-A1/A2, FS-008-A2, FS-009-A1, FS-010-A1, FS-013-A2, FS-014-A1, FS-024-A2).

### 3.4 Responsiveness, Accessibility, and Device Support

- **Responsive Layout**:
  - Uses CSS grid/flexbox with breakpoint-based design (TN-001, TN-004, TN-006, TN-007).
  - Must-have features remain accessible at all supported breakpoints; some components may stack or collapse into tabs/drawers but remain reachable.
  - Mobile layouts may use stacked KPIs and collapsible panels; desktop uses a richer side-by-side layout.
- **Performance on Mobile**:
  - Charts support lazy loading and reduced data density where needed to avoid overloading low-powered devices (TN-002, TN-010).
  - Code splitting, asset optimization, and caching strategies are applied to keep time-to-interactive within agreed budgets.
- **Accessibility**:
  - Semantic HTML, ARIA roles, keyboard navigation paths, and readable error/empty messages (TN-003, TN-012).
  - Interactions like hover tooltips have touch equivalents (tap) for mobile (TN-008, FS-023-A1).

### 3.5 Security and Privacy

- Mask sensitive card identifiers (show last 4 digits only) and avoid displaying full account numbers.
- Consider environment context for small screens and public/shoulder-surfing risk (TN-015):
  - On mobile, more aggressive masking/truncation may be applied.
- Ensure all data is transmitted over HTTPS and that API responses do not expose data for users other than the authenticated principal.

## 4. HLD JSON Structure

```json
{
  "components": [
    {"name": "web_ui_dashboard_shell", "responsibility": "Responsive SPA shell and unified Credit Card Analysis Dashboard view including cards, KPIs, transactions, and analytics visualizations.", "implements": ["FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024","FS-025"]},
    {"name": "api_gateway_bff", "responsibility": "Backend-for-Frontend layer exposing dashboard-oriented REST APIs, orchestrating downstream services, aggregating data, and enforcing no-live-bank and no-transaction rules.", "implements": ["FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024","FS-025"]},
    {"name": "card_user_profile_service", "responsibility": "Manages user card metadata, associations, and credit limits; supports single-card and multi-card scenarios.", "implements": ["FS-001","FS-002","FS-004","FS-007","FS-014","FS-015","FS-017","FS-020","FS-021"]},
    {"name": "transactions_category_aggregation_service", "responsibility": "Persists transactions, enforces category assignment and vocabulary governance, and exposes transaction lists and category-wise/card-wise aggregations.", "implements": ["FS-003","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-013","FS-014","FS-016","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024"]},
    {"name": "kpi_aggregation_service", "responsibility": "Computes KPI values (Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount), handles missing data, and provides consolidated KPI payloads.", "implements": ["FS-003","FS-004","FS-005","FS-006","FS-007","FS-016","FS-017","FS-018","FS-019"]},
    {"name": "analytics_trends_service", "responsibility": "Delivers higher-level analytics such as monthly spending trends over configurable periods and supports interactive, filterable analytics views.", "implements": ["FS-009","FS-010","FS-011","FS-012","FS-020","FS-021","FS-023","FS-024"]},
    {"name": "internal_data_store_cluster", "responsibility": "Non-live persistence for user cards, transactions, and optional aggregates using internal/mock data sources only.", "implements": ["FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-013","FS-014","FS-016","FS-017","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024"]},
    {"name": "configuration_governance_store", "responsibility": "Holds governed configuration for allowed categories, feature toggles excluding payments/transfers/loans, KPI parameters, and default analytics ranges.", "implements": ["FS-008","FS-009","FS-010","FS-022","FS-023","FS-024","FS-025"]}
  ],
  "cross_cutting_concerns": [
    "Authentication and authorization for all dashboard APIs and views.",
    "No Real Bank Connectivity policy ensuring data is sourced only from internal/mock systems and no live banking endpoints are invoked.",
    "No Transaction Execution policy preventing any payments, transfers, loans, or payment-gateway-based financial actions from the dashboard.",
    "Centralized logging and monitoring of BFF and services with redaction of sensitive data.",
    "Standardized error handling and empty-state behaviors across UI sections, with N/A and zero-state handling per functional alt flows.",
    "Responsive UI design and performance optimization across devices, including touch-friendly visualizations and accessibility support.",
    "Security and privacy controls including HTTPS, masked identifiers, and minimized exposure of sensitive financial data, especially on small screens."
  ],
  "narrative": "The Credit Card Analysis Dashboard is implemented as a responsive, read-only analytics web application. A modern Web UI renders a unified dashboard combining card overviews, KPIs, transactions, and visual analytics for category-wise, card-wise, and trend-based spending insights. The UI communicates with a dedicated API Gateway/Backend-for-Frontend that exposes dashboard-focused REST endpoints and orchestrates domain services. Card and user profile data are served by a Card & User Profile Service, while a Transactions & Category Aggregation Service persists transactions, enforces governed spending categories, and exposes both raw and aggregated transaction data. A KPI Aggregation Service computes Monthly Spend, Total Credit Limit, Available Credit, and Outstanding Amount, and an Analytics & Trends Service delivers time-series and interactive analytics over configurable periods and card scopes. All data is sourced from internal/mock data stores, with strict governance ensuring no connectivity to live banking systems and no execution of payments, transfers, loans, or payment-gateway transactions. Cross-cutting concerns such as authentication/authorization, logging, standardized error and empty-state handling, responsiveness, accessibility, and privacy are centrally addressed in the BFF and UI patterns, resulting in a cohesive dashboard experience that works reliably on mobile, tablet, and desktop for both single-card and multi-card users."
}
