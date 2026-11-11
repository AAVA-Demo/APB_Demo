# Credit Card Analysis Dashboard - High-Level Design

## 1. Architecture Narrative

The **Credit Card Analysis Dashboard** is a 3-tier web application that provides a consolidated, responsive view of a user’s credit cards, KPIs, and analytics. It is optimized for demo/snapshot data (no real bank integration) and supports multiple devices (mobile, tablet, desktop).

### 1.1 High-Level Component Overview

**Presentation Layer (Frontend Web App)**  
Implemented as a responsive, SPA-style dashboard (e.g., React/Angular/Vue using a responsive CSS framework and a charting library).
- **Dashboard Shell & Navigation UI**  
  - Provides global layout, routing, and navigation between the dashboard overview, analytics, and transaction views.  
  - Hosts authentication-aware header and access control (e.g., hides content until user is authenticated).  
  - Implements responsive layout behavior for KPI tiles, charts, and tables.

- **Card Overview & KPIs UI**  
  - Renders consolidated view of all cards (tiles or rows) with key metrics per card.  
  - Shows aggregate KPIs: Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount.  
  - Supports context switching between aggregate view and per-card focus.

- **Analytics Visualizations UI**  
  - Presents interactive charts for category-wise spending, monthly spend trends, and card-wise spend analysis.  
  - Integrates with a charting library (e.g., Chart.js/Highcharts/D3) configured for responsive behavior.  
  - Allows user interaction such as hover, basic filtering, time-range selection, and card selection.

- **Transactions View UI**  
  - Presents transaction-level data in tabular/list form with pagination, sorting, and filtering (date range, card, category).  
  - Allows cross-reference between transaction rows and dashboard KPIs/analytics.

The Presentation Layer communicates exclusively with backend APIs and never directly accesses the data store.

**Application & API Layer (Backend Services)**  
A stateless API layer (REST/JSON or GraphQL) that orchestrates domain logic for cards, transactions, and analytics.

- **Authentication & Session Integration**  
  - Integrates with an existing Identity Provider or authentication framework (per TN-035) to validate user identity and issue access tokens/sessions.  
  - Exposes secure endpoints requiring a valid authenticated context.

- **Dashboard Aggregation Service**  
  - Provides consolidated dashboard payloads for a user in a single or small number of API calls.  
  - Fetches card profiles and transaction summaries, then computes KPIs: Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount.  
  - Encapsulates business rules for missing data, fallback values, and aggregation across multiple cards.

- **Cards Service**  
  - Manages card entities and the one-to-many relationship between user and cards.  
  - Exposes APIs to retrieve cards and their static attributes (name, issuer, last four digits, credit limit, etc.).  
  - Provides card-level KPIs where needed (per-card limit, available credit, outstanding amount).

- **Transactions & KPIs Service**  
  - Exposes read APIs to query transaction records with filters (user, card, date range, category).  
  - Implements aggregation logic for KPIs and analytics:  
    - Monthly Spend per reporting period.  
    - Available Credit per card (credit_limit - balance).  
    - Outstanding Amount per card (rule-driven balance definition).  
    - Trend aggregations (per month) and card-wise comparisons.  
  - Applies category mapping rules (baseline category list, mapping to Miscellaneous).

- **Analytics & Visualization API**  
  - Provides specialized, aggregated data structures optimized for visualizations:  
    - Category-wise spending aggregates per period.  
    - Monthly spend trends over time.  
    - Card-wise spend breakdowns.  
  - Supports time period and card-set filters to drive interactive UI behavior.

All backend services are designed to be stateless, horizontally scalable, and accessed via secure, versioned endpoints. Aggregations are executed via optimized queries or pre-computed views depending on performance constraints.

**Data Layer**  
A relational or document database hosting demo/snapshot financial-like data, with no live bank integration.

- **User & Identity Reference Data**  
  - Stores references that link application users to their card portfolios.  
  - User authentication details themselves are managed by an external IdP or separate auth service.

- **Card Store**  
  - Schema capturing card profile information: card identifier, issuer, credit limit, current balance/outstanding amount, and metadata for display.  
  - Maintains foreign keys/links to users.

- **Transaction Store**  
  - Holds transaction-level records with at minimum: timestamp, amount, card reference, category, and optional attributes (merchant, status, etc.).  
  - Serves as the authoritative source for spend-based analytics and KPI calculation.

- **Reference & Configuration Data**  
  - Stores fixed list of transaction categories and related configuration.  
  - Maintains environment-level flags ensuring no connection to real banking systems.

Data load routines (seed scripts, admin tools) populate the Card and Transaction Stores with synthetic or sample data, respecting non-integration constraints (TN-006 to TN-008).

### 1.2 Interaction Flows

**Dashboard Load (FS-001, FS-002, FS-011, FS-010)**
1. User authenticates via existing auth mechanism.
2. Dashboard Shell invokes the Dashboard Aggregation API with the user identity.
3. Dashboard Aggregation Service retrieves cards via Cards Service, and transaction summaries via Transactions & KPIs Service.
4. KPIs (Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount) are computed and returned along with per-card tiles and supporting summaries.
5. UI renders consolidated dashboard view; empty/error states are generated based on responses.

**KPI Computation (FS-003, FS-004, FS-005, FS-006)**
1. On dashboard load or filter changes, frontend requests KPI data for a user and (optionally) card context and period.
2. Transactions & KPIs Service applies reporting period rules, aggregates transactions per card, and joins with Card Store for credit limits and balances.  
3. Business rules for missing values, zero/negative availability, and label formatting are applied.
4. Backend returns KPI payload; frontend renders KPI tiles with clear labels, currency formatting, and responsive layout.

**Analytics Visualizations (FS-007, FS-008, FS-009)**
1. User navigates to Analytics section or interacts with time-period/card filters.  
2. Frontend calls Analytics & Visualization API for:  
   - Category-wise spend for selected period.  
   - Monthly spend trends across periods.  
   - Card-wise spend comparisons.  
3. Backend aggregates transaction data per required dimension and maps categories per business rules.  
4. Visualization data structures are returned and bound to chart components in the UI.  
5. User interactions (hover, filter changes, time range updates) trigger incremental API calls without full page reloads.

**Transactions Exploration (FS-012)**
1. From dashboard or analytics view, user opens transaction-level view.  
2. Frontend requests paginated transaction lists for default time period.  
3. Transactions & KPIs Service queries Transaction Store applying default and user-chosen filters.  
4. Transaction data is rendered in responsive tables/lists, with sorting and filtering controls.  
5. Optionally, changes in filters can trigger recalculation of derived analytics on the same view.

### 1.3 Key Architectural Constraints
- **No Real Bank Integration**: All card, limit, balance, and transaction data must come from non-bank sources (TN-006 to TN-008). Data ingress relies on synthetic/seeded data or admin tools.
- **Responsive-First UX**: All views (dashboard, analytics, transactions) must be mobile-friendly, leveraging a responsive UI framework and tested across key breakpoints (TN-001, TN-004, TN-009, TN-022).
- **Demo/Snapshot Data Semantics**: KPIs and analytics are computed over snapshot data with clearly documented semantics (monthly spend period, outstanding amount definition, etc.) to minimize misinterpretation.


## 2. Components

Below is the component catalog with responsibilities and functional specs implemented.

```json
{
  "components": [
    {
      "name": "DashboardShellUI",
      "responsibility": "Provides application shell, routing, navigation, and responsive layout framework for the Credit Card Analysis Dashboard. Handles authenticated entry into the dashboard and high-level composition of overview, analytics, and transaction views.",
      "implements": ["FS-001", "FS-002", "FS-010", "FS-011"]
    },
    {
      "name": "CardOverviewAndKPIUI",
      "responsibility": "Renders consolidated view of all user cards and key KPIs at aggregate and per-card level, including Monthly Spend, Total Credit Limit, Available Credit, and Outstanding Amount.",
      "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006", "FS-010", "FS-011"]
    },
    {
      "name": "AnalyticsVisualizationUI",
      "responsibility": "Displays interactive charts and visualizations for category-wise spending, monthly spend trends, and card-wise spend analysis, supporting user interactions such as period and card filtering.",
      "implements": ["FS-007", "FS-008", "FS-009", "FS-010"]
    },
    {
      "name": "TransactionsViewUI",
      "responsibility": "Provides transaction-level views with pagination, sorting, and filtering, enabling users to inspect detailed transaction records that underpin KPIs and analytics.",
      "implements": ["FS-010", "FS-012"]
    },
    {
      "name": "AuthIntegrationService",
      "responsibility": "Integrates with enterprise authentication/identity provider, validates user credentials/tokens, and exposes authenticated user context to backend services and UI.",
      "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006", "FS-007", "FS-008", "FS-009", "FS-010", "FS-011", "FS-012"]
    },
    {
      "name": "DashboardAggregationService",
      "responsibility": "Aggregates user-specific card and transaction data into a consolidated dashboard payload, computing multi-card KPIs and orchestrating retrieval from Cards and Transactions services.",
      "implements": ["FS-001", "FS-002", "FS-003", "FS-004", "FS-005", "FS-006", "FS-010", "FS-011"]
    },
    {
      "name": "CardsService",
      "responsibility": "Manages card entities and provides APIs to retrieve user card lists and per-card attributes (limits, outstanding amounts), supporting one-to-many user-to-card relationships.",
      "implements": ["FS-001", "FS-002", "FS-004", "FS-005", "FS-006", "FS-010", "FS-011"]
    },
    {
      "name": "TransactionsAndKPIService",
      "responsibility": "Provides transaction querying and KPI aggregation logic, including Monthly Spend, Available Credit, Outstanding Amount, and other KPI calculations based on transaction and card data.",
      "implements": ["FS-003", "FS-005", "FS-006", "FS-007", "FS-008", "FS-009", "FS-010", "FS-012"]
    },
    {
      "name": "AnalyticsAggregationService",
      "responsibility": "Generates analytics-ready datasets for category-wise spending, monthly spend trends, and card-wise comparisons, optimized for chart rendering and interaction.",
      "implements": ["FS-007", "FS-008", "FS-009", "FS-010"]
    },
    {
      "name": "UserAndCardRepository",
      "responsibility": "Data access layer for user-to-card relationships and card profile information (limits, balances, metadata).",
      "implements": ["FS-001", "FS-002", "FS-004", "FS-005", "FS-006", "FS-010", "FS-011"]
    },
    {
      "name": "TransactionRepository",
      "responsibility": "Data access layer for transaction records, including support for filtering, pagination, and aggregation queries over time periods and categories.",
      "implements": ["FS-003", "FS-005", "FS-006", "FS-007", "FS-008", "FS-009", "FS-010", "FS-012"]
    },
    {
      "name": "CategoryReferenceStore",
      "responsibility": "Stores and enforces the baseline set of spending categories and provides lookup and mapping functions to classify or remap transaction categories, including the Miscellaneous fallback.",
      "implements": ["FS-007", "FS-009", "FS-010"]
    }
  ],
  "cross_cutting_concerns": [
    "Authentication & Authorization: All dashboard, card, transaction, and analytics APIs require authenticated access tied to a credit card user account. Role-based access control ensures only authorized users can view their own data (BR-007, TN-035).",
    "Security & Data Protection: All communication occurs over TLS. Sensitive financial-like data at rest in Card and Transaction Stores should be encrypted. Environment-level configuration prevents any connection to real banking systems and ensures demo data isolation (TN-006 to TN-008, TN-037).",
    "Error Handling & Resilience: Backend services implement consistent error handling and return structured error responses for UI display (e.g., empty states, banners). Data access errors, missing data, and aggregation failures are logged and surfaced as safe, user-friendly messages (FS-001-A2, FS-003-A3, FS-006-A1, FS-010-A1).",
    "Logging, Monitoring & Telemetry: Centralized logging for key events (dashboard load, KPI computation, analytics queries) is implemented. Telemetry is captured for dashboard load success/failure, API latency, and user interactions to support operational monitoring and product analytics (TN-005, TN-024, TN-038).",
    "Performance & Scalability: APIs for KPIs and analytics are optimized via appropriate indexing, aggregation queries, and pagination (especially for transactions). Stateless services can scale horizontally. Responsive front-end minimizes payload sizes and leverages lazy loading where appropriate (TN-002, TN-005, TN-019, TN-036).",
    "Responsive UX & Accessibility: UI components comply with responsive design requirements and accessibility best practices (adequate contrast, font sizes, touch targets, and meaningful labels for KPIs and charts) (TN-001, TN-004, TN-009, TN-010, TN-022, BR-003, BR-006).",
    "Configuration Management & Feature Flags: Environment-level configuration controls category lists, KPI semantics, and guardrails preventing real bank integration. Feature flags may manage experimental analytics interactions (TN-008, TN-018, TN-025 to TN-032)."
  ],
  "narrative": "The Credit Card Analysis Dashboard is a responsive web application that enables authenticated credit card users to view multiple cards, key financial KPIs, and analytics in a single, unified interface. At a high level, the solution is structured into a presentation layer, an application/API layer, and a data layer, all designed around snapshot/demo data with no direct bank integration.\n\nIn the presentation layer, the DashboardShellUI component provides the main shell and navigation experience. It coordinates routing between the consolidated dashboard overview, analytics visualizations, and transaction-level views, ensuring that only authenticated users can access dashboard content. Within this shell, the CardOverviewAndKPIUI component renders a consolidated panel of all cards associated with the user, along with aggregate and per-card KPIs including Monthly Spend, Total Credit Limit, Available Credit, and Outstanding Amount. It supports both an all-cards view and card-specific focus, adapting layout across mobile, tablet, and desktop screens.\n\nThe AnalyticsVisualizationUI component presents the analytical capabilities of the dashboard. It consumes aggregated datasets from backend analytics APIs to render interactive visualizations for category-wise spending, monthly spend trends over time, and card-wise spend comparisons. Users can adjust time periods and card selections to explore their spending behavior, with charts updating dynamically without full page reloads. Complementing this, the TransactionsViewUI component exposes the underlying transaction-level data in paginated, filterable tables or lists, allowing users to inspect individual transactions that drive the KPIs and charts and to cross-check totals and trends.\n\nBehind the UI, an application and API layer orchestrates domain logic and data retrieval. The AuthIntegrationService connects the dashboard to the enterprise authentication and authorization ecosystem, supplying the authenticated user context required by all other services. The DashboardAggregationService coordinates the retrieval of cards and transactions for a given user, computing consolidated dashboard payloads that include key KPIs and per-card summaries. It calls the CardsService for card profile data and the TransactionsAndKPIService for transaction-based metrics, applying business rules for handling missing data, empty states, and multi-card aggregation.\n\nThe CardsService manages the user’s card portfolio, enforcing the one-to-many user-to-card relationship and exposing APIs to retrieve card details and card-level attributes such as credit limits and outstanding amounts. The TransactionsAndKPIService is responsible for querying transaction records and applying aggregation logic to compute metrics such as Monthly Spend, Available Credit, and Outstanding Amount. For more advanced analytical use cases, the AnalyticsAggregationService generates specialized, visualization-friendly datasets that group spending by category, month, and card, optimizing the interaction between the backend and the charting components in the AnalyticsVisualizationUI.\n\nAll of these services rely on a structured data layer consisting of User and Card Stores, a Transaction Store, and reference/configuration data. The UserAndCardRepository and TransactionRepository components abstract database access, providing efficient queries for cards and transactions, including filtered, paginated, and aggregated views. The CategoryReferenceStore maintains the authoritative list of spending categories and implements mapping rules that ensure any unmapped categories are assigned to \\\"Miscellaneous\\\" for display, satisfying category-related business rules. Data is sourced exclusively from controlled, non-bank mechanisms such as seed scripts or admin tools, with configuration safeguards preventing accidental connections to real banking systems.\n\nCross-cutting concerns such as authentication, security, logging, error handling, performance management, responsive UX, and configuration management are consistently applied across the stack. Authenticated access and TLS-secured communication protect financial-like data, while centralized logging and telemetry support both operational monitoring and product insights. Responsive design and accessibility principles guide the construction of all UI components, ensuring that monthly spending and outstanding balance metrics remain clear and legible on all supported devices. This architecture provides a robust, extensible foundation for delivering the specified dashboard capabilities while honoring constraints around responsiveness, demo data, and the absence of live banking integrations."
}
```