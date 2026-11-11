# Warranty Claims Analysis Dashboard – High-Level Design

## 1. Architecture Narrative

### 1.1 Overview
The **Warranty Claims Analysis Dashboard** is a read-only, browser-based analytics application that provides consolidated insights into synthetic warranty-claims data for an automotive manufacturer. It serves three primary personas: Warranty Analysts, Quality Engineers, and After-sales Managers.

The solution is implemented as a **three-tier web application**:
- **Presentation Layer (UI Web App)** – A responsive single-page application (SPA) that renders KPI cards, charts, claims tables, and detail panels, and manages global filters and user interactions.
- **API Layer (Analytics & Data Services)** – A set of RESTful services that expose filtered, aggregated, and detailed warranty-claims data via well-documented endpoints.
- **Data Layer (Synthetic Data Store & Generation)** – Relational schemas and synthetic-data generation processes that persist Vehicle Model, Dealer, Warranty Claim, and Claim Status History entities and support analytical queries.

All data is **synthetic**; there are **no write operations** and no integrations with live operational systems in this release. The dashboard is strictly read-only, with all workflow-like rules (e.g., eligibility, automatic rejection) applied upstream during synthetic data generation.

### 1.2 Major Components and Responsibilities

1. **WCAD Web UI (SPA)**  
   - Renders the Warranty Claims Analysis Dashboard including:
     - Four KPI cards: Total Claims, Total Claim Cost, Claim Approval Rate, Average Claim Processing Time (FS-001, FS-003, FS-004, FS-010, FS-026, FS-033).
     - Analytics visualizations: monthly trend chart, model-wise chart, component-wise chart (FS-002, FS-005, FS-008, FS-009, FS-020, FS-021, FS-022).
     - Claims List with sorting, pagination, masking, and overdue indicators (FS-006, FS-007, FS-012, FS-013, FS-014, FS-015, FS-025, FS-027, FS-028, FS-029, FS-030, FS-033, FS-035).
     - Claim Detail Panel for drill-down into individual claims (FS-007, FS-008, FS-016, FS-031, FS-032).
   - Manages **global filter state** (model, model year, region, date range) and propagates it to all API calls (FS-011, FS-024, FS-027, FS-028).
   - Implements **responsive layout** for desktop, tablet, and mobile breakpoints, ensuring no horizontal scrolling at 1280px, 768px, and 375px widths (FS-034, TN-015, TN-016, TN-017, TN-027).
   - Handles **UI-only behaviors**:
     - Loading, empty, and error states per component (FS-017, FS-018, FS-019, FS-033, FS-035).
     - Interactive chart-driven filtering (e.g., click component bar → filter claims list) (FS-008, FS-022, FS-023).
     - VIN masking on display only (BR-014, FS-012, FS-016).
     - Accessibility behaviors including keyboard navigation, focus management, and alternate views for charts (TN-020, TN-029, TN-040).
   - Communicates solely via HTTPS to the API layer.

2. **API Gateway / Backend-for-Frontend (BFF)**  
   - Exposes a cohesive set of REST endpoints tailored to the dashboard use cases and responsible for:
     - **KPI Summary API** – Computes and returns four KPIs and period deltas based on filters (TN-001, TN-025, FS-003, FS-004, FS-009, FS-010, FS-026, FS-033).
     - **Vehicle Models API** – Returns vehicle model metadata and per-model claim counts (TN-002, TN-011, TN-032, FS-011).
     - **Claims API** – Returns paginated, sortable, and filterable claims data; also surfaces overdue flags if implemented server-side (TN-003, TN-004, TN-005, TN-013, FS-006, FS-007, FS-012, FS-013, FS-014, FS-015, FS-025, FS-027, FS-028, FS-029, FS-030, FS-033, FS-035).
     - **Claim Detail API** – Returns complete claim details and status history for a given Claim ID (TN-006, TN-013, TN-014, FS-007, FS-008, FS-016, FS-031, FS-032).
     - **Monthly Trend API** – Returns monthly claim count and cost for the last 12 months / selected period (TN-007, FS-002, FS-003, FS-009, FS-020).
     - **Breakdown API** – Returns aggregates grouped by model or component category (TN-008, FS-005, FS-008, FS-021, FS-022, FS-023).
   - Implements a **common filter schema** (TN-009) so that all endpoints accept consistent parameters: model IDs (multi-select), model years, regions, date range (based on submission_date), and where relevant, status and component category.
   - Performs **server-side validation** of filters and business rules:
     - Enforces status enumeration {'Submitted','Under Review','Approved','Rejected'} (BR-006).
     - Applies BR-001, BR-002, BR-004, BR-005, BR-009–BR-013, BR-015, BR-016 as part of KPI and aggregation logic where relevant.
     - Ensures claims entity relationships (model, dealer, region, component_category) are present and valid before including records in aggregates (BR-013).
   - Implements **aggregation and analytics logic** required to support counts, sums, group-bys, and time-series calculations.
   - Provides **OpenAPI/Swagger documentation** for all endpoints (TN-022, TN-034, TN-039).
   - Exposes **read-only operations** only (BR-019, BR-020, TN-033).

3. **Analytics & Domain Services Layer**  
   Logical layer within the backend that encapsulates business logic and data-access orchestration. Key services include:

   - **KPI Calculation Service**
     - Centralizes computation of the four KPIs and their deltas (TN-001, TN-025, FS-003, FS-004, FS-009, FS-010, FS-026, FS-033).
     - Applies date-range filters based on submission_date (BR-001, BR-002, BR-004, BR-005, BR-015, BR-016).
     - Enforces claim amount = parts_cost + labour_cost for record inclusion in KPIs (BR-002, BR-003, FS-031).

   - **Claims Query Service**
     - Executes filtered, sorted, and paginated queries over Warranty Claim and related entities (TN-003, TN-004, TN-005, TN-013, TN-036).
     - Encapsulates rules for overdue flag calculation (BR-011, FS-006, FS-025, FS-030).
     - Ensures read-only semantics in query paths (BR-019, BR-020, TN-033).

   - **Trend & Breakdown Service**
     - Performs monthly aggregations and per-model / per-component groupings (TN-007, TN-008, TN-028, TN-038, FS-002, FS-005, FS-008, FS-009, FS-020, FS-021, FS-022).
     - Respects component-category enumeration and mapping rules (BR-017).

   - **Claim Detail Service**
     - Loads a claim and its status history with correct ordering (TN-006, TN-013, TN-014, FS-016, FS-031, FS-032).
     - Ensures status histories comply with allowed transitions; for this release, any invalid patterns would be considered data-generation defects, not fixed at runtime (BR-007, BR-008, BR-012).

   - **Configuration & Units Service**
     - Controls display currency and distance units (TN-024, TN-030, TN-037), exposing canonical units to the UI and/or converting for downstream consumers.

   - **Synthetic Data Integrity & Eligibility Service (Data-prep only)**
     - Applied during dataset generation, not at runtime (TN-010, TN-026, TN-031):
       - Enforces warranty eligibility (BR-009, BR-010).
       - Generates status histories consistent with workflow rules (BR-006, BR-007, BR-008, BR-012).
       - Ensures all relationships (model, dealer, region, component_category) are populated (BR-013).

4. **Data Layer (Synthetic Relational Store)**  
   - **Database**: A lightweight relational DB (e.g., PostgreSQL, MySQL, or equivalent) hosting:
     - `vehicle_model` – Model ID, Model Name, Model Years, Vehicle Type, plus optional extensible attributes (TN-011, TN-032).
     - `dealer` – Dealer ID, Dealer Name, Region (TN-012).
     - `warranty_claim` – All claim fields including model_id, model_year, dealer_id, component_category, failure_description, vehicle_sale_date, repair_date, mileage, parts_cost, labour_cost, claim_amount, status, submission_date, decision_date (TN-013, BR-002, BR-003, BR-006, BR-009–BR-011, BR-015, BR-016, BR-017).
     - `claim_status_history` – Claim ID, Status, Changed On (TN-014, BR-012).
   - **Indexes** on submission_date, status, model_id, region, and component_category to satisfy latency targets (TN-003, TN-013, TN-019, TN-036, TN-038).
   - **Synthetic data generation pipeline** populates these tables according to TN-010, TN-026, TN-028, TN-031, maintaining realism and compliance with business rules.

5. **Observability & Testability Components**  
   - **Logging & Metrics** across UI and backend to support:
     - API latency measurements (TN-019, TN-042).
     - Performance SLOs for initial load and per-endpoint response times (TN-018, TN-019, TN-028, TN-035, TN-038, TN-041).
   - **Mock / Stub Services** for independent UI and API testing (TN-023, TN-034, TN-039):
     - A mock API server that returns deterministic synthetic responses for UI automation.
     - API-level test harnesses using either the real synthetic DB or in-memory fixtures.

### 1.3 Component Interactions (Runtime View)

1. **Initial Dashboard Load (FS-001, FS-010, FS-017, FS-024, FS-035)**
   - User navigates to the dashboard URL.
   - WCAD Web UI initializes global filters with defaults (current calendar month, all models, all regions, all statuses) using submission_date (BR-015, BR-016).
   - UI sends **parallel** API requests via the BFF:
     - `GET /api/models` (Vehicle Models API) – to populate model filter (FS-011).
     - `GET /api/kpi-summary` – to render four KPI cards and deltas (FS-010, FS-026).
     - `GET /api/trend/monthly` – to render monthly trend chart (FS-002, FS-020).
     - `GET /api/breakdown?groupBy=model` – for model-wise chart (FS-021).
     - `GET /api/breakdown?groupBy=componentCategory` – for component-wise chart (FS-005, FS-022).
     - `GET /api/claims` – for the initial claims list page (FS-012–FS-015, FS-025, FS-030).
   - UI shows loading skeletons/spinners for each component (FS-017).
   - Upon responses:
     - Successful responses populate the corresponding components.
     - Any failed responses result in localized error states without blocking others (FS-019, FS-035).

2. **Global Filter Change (FS-024, FS-027, FS-028)**
   - User adjusts model, model year, region, or date range filters.
   - UI updates the global filter state, resets claims pagination and chart selections as needed.
   - UI re-issues parallel API calls using the updated filter parameters for KPIs, trend, breakdowns, and claims list.
   - All components update to reflect the exact same filter set, ensuring consistency.

3. **Claims List Interactions (FS-012–FS-015, FS-025, FS-029–FS-030)**
   - **Status filter**: UI sends `GET /api/claims?status=UnderReview` with existing global filters; API returns filtered claims; UI displays them and optionally a count that matches the API result (FS-015, FS-029, BR-006).
   - **Sorting**: user clicks a column header; UI calls `GET /api/claims?sortBy=submissionDate&sortDir=desc`; API returns sorted data (FS-013, TN-004).
   - **Pagination**: user navigates pages using 25-row pages; UI calls `GET /api/claims?page=2&pageSize=25` etc. (FS-012, FS-014, TN-005).
   - Overdue flag is computed server-side (preferred) or replicated client-side for display, based on BR-011 (FS-006, FS-025, FS-030).

4. **Drill-down and Analytics Interactions (FS-005–FS-008, FS-016, FS-020–FS-023, FS-031–FS-032)**
   - **Claim Detail**: clicking a claim row triggers `GET /api/claims/{claimId}`; UI opens a detail panel with failure description, mileage, repair date, costs, and ordered status history (FS-016, FS-031, FS-032).
   - **Component-wise drill-down**: clicking a bar in the component-wise chart sets `componentCategory` filter; UI reloads claims list via `GET /api/claims?componentCategory=Electrical` (FS-022, FS-023).
   - **Trend metric toggle**: toggling between Count and Cost changes only UI representation if both metrics are pre-fetched; otherwise, UI may re-call the trend API with a `metric` parameter (FS-020).

5. **Error, Loading, and Empty Scenarios (FS-017–FS-019, FS-033, FS-035)**
   - API unavailability or timeouts for specific endpoints yield component-level error states with retry options (FS-019, FS-035).
   - Zero-data scenarios (no claims matching filters) yield zero-valued KPIs and empty-state visuals/messages for charts and list (FS-018, FS-033).

### 1.4 Deployment & Environment

- **UI**: Deployed as static assets behind a CDN or web server (e.g., Nginx, S3+CloudFront).
- **API/BFF**: Deployed as a stateless web service (container or VM-based) exposing REST endpoints; horizontally scalable if needed.
- **Database**: Single instance relational database for the synthetic dataset; backups and migration scripts maintained but no live feeds.
- **Synthetic Data Generator**: Executed as part of environment provisioning or CI/CD pipelines for test/demo environments.


## 2. Components and Capability Mapping

### 2.1 Component List

Below, each logical component lists its primary responsibility and the functional specs (FS-xxx) it implements.

```json
{
  "components": [
    {
      "name": "wcad_web_ui",
      "responsibility": "Responsive SPA implementing dashboard layout, global filters, KPIs, charts, claims list, claim detail panel, and all client-side interaction patterns.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010",
        "FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020",
        "FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028","FS-029","FS-030",
        "FS-031","FS-032","FS-033","FS-034","FS-035"
      ]
    },
    {
      "name": "api_gateway_bff",
      "responsibility": "REST API surface that orchestrates requests from the UI to backend services, enforces read-only access, validates filters, and shapes responses for the dashboard.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010",
        "FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020",
        "FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028","FS-029","FS-030",
        "FS-031","FS-032","FS-033","FS-035"
      ]
    },
    {
      "name": "kpi_calculation_service",
      "responsibility": "Calculates Total Claims, Total Claim Cost, Claim Approval Rate, and Average Claim Processing Time plus period deltas based on filterable synthetic warranty claims.",
      "implements": ["FS-001","FS-003","FS-004","FS-009","FS-010","FS-026","FS-033"]
    },
    {
      "name": "claims_query_service",
      "responsibility": "Executes filtered, sorted, and paginated queries over Warranty Claim data and computes overdue flags in alignment with business rules.",
      "implements": [
        "FS-001","FS-006","FS-007","FS-011","FS-012","FS-013","FS-014","FS-015","FS-024",
        "FS-025","FS-027","FS-028","FS-029","FS-030","FS-033","FS-035"
      ]
    },
    {
      "name": "trend_and_breakdown_service",
      "responsibility": "Provides monthly trend aggregates and breakdowns by vehicle model and component category for counts and costs.",
      "implements": ["FS-002","FS-003","FS-005","FS-008","FS-009","FS-020","FS-021","FS-022","FS-023","FS-024","FS-027","FS-028"]
    },
    {
      "name": "claim_detail_service",
      "responsibility": "Returns full warranty claim details and ordered status history, and validates cost-composition rules for display.",
      "implements": ["FS-007","FS-008","FS-016","FS-031","FS-032"]
    },
    {
      "name": "vehicle_models_service",
      "responsibility": "Exposes vehicle model master data and per-model claim counts to support model filters and multi-model analytics.",
      "implements": ["FS-001","FS-008","FS-009","FS-011","FS-021","FS-024","FS-027","FS-028"]
    },
    {
      "name": "configuration_and_units_service",
      "responsibility": "Manages configuration for display currency and distance units and ensures consistent formatting across KPIs, charts, and lists.",
      "implements": ["FS-001","FS-003","FS-009","FS-010"]
    },
    {
      "name": "synthetic_data_generation_pipeline",
      "responsibility": "Generates and loads synthetic Vehicle Model, Dealer, Warranty Claim, and Claim Status History data consistent with business rules and acceptance criteria.",
      "implements": ["FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010"]
    },
    {
      "name": "relational_data_store",
      "responsibility": "Persists synthetic entities and supports indexed, read-only queries for all dashboard APIs.",
      "implements": ["FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010",
                     "FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-020","FS-021","FS-022","FS-023","FS-024",
                     "FS-025","FS-027","FS-028","FS-029","FS-030","FS-031","FS-032","FS-033","FS-035"]
    }
  ],
  "cross_cutting_concerns": [
    "Authentication and read-only authorization",
    "Input validation and business-rule enforcement at API boundaries",
    "Centralized error handling and user-friendly error states",
    "Structured logging and correlation IDs across UI and API calls",
    "Performance monitoring (latency, initial load timing) and capacity planning",
    "Configuration management for currency and units, and environment-specific settings",
    "Security and privacy for synthetic-only data usage and VIN masking",
    "Accessibility and internationalization-ready formatting",
    "API contract documentation and versioning",
    "Testability via mocks, stubs, and CI-integrated automated tests"
  ],
  "narrative": "See sections 1 and 2 of this Markdown document for the full architecture narrative and component responsibilities."
}
```


## 3. Cross-Cutting Concerns

The following concerns apply across multiple components and are implemented once in a shared, consistent manner.

1. **Authentication & Authorization**
   - Even though data is synthetic and access is read-only, all API requests are authenticated (e.g., via OAuth2 or API keys in a demo environment).
   - Authorization is deliberately simple: all authenticated users have the same read-only access (BR-019, BR-020, TN-033). No role-based differentiation is implemented in this release.

2. **Input Validation & Business-rule Guardrails**
   - API Gateway validates filter parameters (date ranges, model IDs, regions, statuses, component categories) against allowed values.
   - Status and component category queries are checked against enumerations (BR-006, BR-017).
   - Invalid input yields clear 4xx responses without querying the database, protecting performance targets (TN-019, TN-036).

3. **Error Handling & User Feedback**
   - API layer standardizes error responses (error codes, messages, correlation IDs) documented in OpenAPI (TN-022).
   - UI maps API errors to per-component error states with retry actions (FS-019, FS-035).
   - No stale data is displayed when errors occur—components either show loading, error, or empty states (FS-017–FS-019, FS-033).

4. **Logging, Monitoring & Observability**
   - Backend logs all API calls, including latency, filters, and response codes, with correlation IDs to trace request flows (TN-019, TN-042).
   - Metrics dashboards track:
     - Per-endpoint 95th percentile latency to ensure <500ms (NFR-02, TN-019).
     - Initial load performance to ensure <3s page render (NFR-02, TN-018, TN-041).
   - Alerts are configured for sustained SLO violations.

5. **Performance & Caching**
   - Parallelized API calls from the UI for initial and subsequent loads (TN-018, TN-041).
   - DB indexes on submission_date, model_id, region, status, component_category, and decision_date to meet latency targets (TN-003, TN-019, TN-036, TN-038).
   - Optional in-memory caching or materialized views for KPI summaries and trend data (TN-028, TN-035) in higher-load environments.

6. **Configuration & Localization (Currency/Units)**
   - Central configuration determines base currency (default USD) and distance units (default miles) (TN-024, TN-030, TN-037).
   - UI uses shared formatting utilities to present amounts and distances uniformly across KPIs, charts, and lists.
   - Back-end calculations are performed on canonical numeric values independent of presentation units.

7. **Security & Privacy**
   - All data is synthetic; controls ensure no real customer or VIN data is ingested (BR-018, TN-031).
   - VIN values stored in the database may be full synthetic VINs but are masked at UI rendering per BR-014.
   - APIs never expose write operations, preventing accidental mutation of claims data (BR-019, TN-033).
   - TLS is enforced between UI and API.

8. **Accessibility & UX Quality**
   - UI adheres to WCAG 2.1 AA (TN-020, TN-029, TN-040):
     - Keyboard navigation and focus management across filters, lists, and charts.
     - Sufficient color contrast and text alternatives for charted data (e.g., toggleable tabular views).
   - Responsive layouts at key breakpoints (desktop, tablet, mobile) avoid horizontal scroll (NFR-01, FS-034, TN-015–TN-017, TN-027).

9. **API Contract Documentation & Testability**
   - All APIs defined and versioned via OpenAPI/Swagger (TN-022, TN-034).
   - Mock servers auto-generated from contracts enable UI testing in isolation (TN-023, TN-039).
   - Automated tests validate business rules for KPIs, eligibility flags, overdue logic, and filter consistency.


## 4. Functional Capability to Component Mapping

The table below summarizes which components participate in implementing each functional spec.

| FS ID | Capability (summary) | wcad_web_ui | api_gateway_bff | kpi_calculation_service | claims_query_service | trend_and_breakdown_service | claim_detail_service | vehicle_models_service | configuration_and_units_service | synthetic_data_generation_pipeline | relational_data_store |
|------|-----------------------|-------------|------------------|-------------------------|----------------------|-----------------------------|----------------------|------------------------|----------------------------------|------------------------------------|----------------------|
| FS-001 | Consolidated dashboard view | ✔ | ✔ | ✔ | ✔ | ✔ | – | ✔ | ✔ | ✔ | ✔ |
| FS-002 | Monthly claim volumes | ✔ | ✔ | – | – | ✔ | – | – | – | ✔ | ✔ |
| FS-003 | Total & aggregated claim costs | ✔ | ✔ | ✔ | – | ✔ | – | – | ✔ | ✔ | ✔ |
| FS-004 | Claim approval rates | ✔ | ✔ | ✔ | – | – | – | – | – | ✔ | ✔ |
| FS-005 | Component-level failure patterns | ✔ | ✔ | – | – | ✔ | – | – | – | ✔ | ✔ |
| FS-006 | Highlight pending & overdue claims | ✔ | ✔ | – | ✔ | – | – | – | – | ✔ | ✔ |
| FS-007 | Analyst workflow (status filter, detail, overdue) | ✔ | ✔ | – | ✔ | – | ✔ | – | – | ✔ | ✔ |
| FS-008 | Quality engineer tasks | ✔ | ✔ | – | ✔ | ✔ | ✔ | ✔ | – | ✔ | ✔ |
| FS-009 | After-sales manager tasks | ✔ | ✔ | ✔ | – | ✔ | – | ✔ | ✔ | ✔ | ✔ |
| FS-010 | Four KPI cards w/ default period | ✔ | ✔ | ✔ | – | – | – | – | ✔ | ✔ | ✔ |
| FS-011 | Model selection filter | ✔ | ✔ | – | ✔ | – | – | ✔ | – | ✔ | ✔ |
| FS-012 | Claims list with columns & pagination | ✔ | ✔ | – | ✔ | – | – | – | – | ✔ | ✔ |
| FS-013 | Sort claims list by column | ✔ | ✔ | – | ✔ | – | – | – | – | ✔ | ✔ |
| FS-014 | Pagination at 25 rows/page | ✔ | ✔ | – | ✔ | – | – | – | – | ✔ | ✔ |
| FS-015 | Filter claims by status | ✔ | ✔ | – | ✔ | – | – | – | – | ✔ | ✔ |
| FS-016 | Claim detail panel | ✔ | ✔ | – | – | – | ✔ | – | – | ✔ | ✔ |
| FS-017 | Loading states | ✔ | – | – | – | – | – | – | – | – | – |
| FS-018 | Empty states | ✔ | – | – | – | – | – | – | – | – | – |
| FS-019 | Error states & prevention of incorrect values | ✔ | ✔ | – | – | – | – | – | – | – | – |
| FS-020 | Monthly trend chart toggle | ✔ | ✔ | – | – | ✔ | – | – | – | ✔ | ✔ |
| FS-021 | Model-wise chart | ✔ | ✔ | – | – | ✔ | – | ✔ | – | ✔ | ✔ |
| FS-022 | Component-wise chart | ✔ | ✔ | – | – | ✔ | – | – | – | ✔ | ✔ |
| FS-023 | Filter list by component selection | ✔ | ✔ | – | ✔ | ✔ | – | – | – | ✔ | ✔ |
| FS-024 | Global filters applied consistently | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| FS-025 | Visual overdue indicator | ✔ | ✔ | – | ✔ | – | – | – | – | ✔ | ✔ |
| FS-026 | KPI change vs previous period | ✔ | ✔ | ✔ | – | – | – | – | ✔ | ✔ | ✔ |
| FS-027 | Multi-model views | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | – | ✔ | ✔ |
| FS-028 | Constrain to selected models | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | – | ✔ | ✔ |
| FS-029 | Align list count with status filter | ✔ | ✔ | – | ✔ | – | – | – | – | ✔ | ✔ |
| FS-030 | Flag Under Review >30 days | ✔ | ✔ | – | ✔ | – | – | – | – | ✔ | ✔ |
| FS-031 | Cost composition verification | ✔ | ✔ | – | – | – | ✔ | – | – | ✔ | ✔ |
| FS-032 | Status history ordering | ✔ | ✔ | – | – | – | ✔ | – | – | ✔ | ✔ |
| FS-033 | Zero KPIs and empty list | ✔ | ✔ | ✔ | ✔ | ✔ | – | – | ✔ | ✔ | ✔ |
| FS-034 | 375px mobile layout without horizontal scrolling | ✔ | – | – | – | – | – | – | – | – | – |
| FS-035 | Claims API unavailable handling | ✔ | ✔ | – | – | – | – | – | – | – | – |


## 5. HLD JSON Block

```json
{
  "components": [
    {
      "name": "wcad_web_ui",
      "responsibility": "Responsive SPA implementing dashboard layout, global filters, KPI cards, charts, claims list, claim detail panel, and all client-side interaction patterns including loading, empty, and error states.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010",
        "FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020",
        "FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028","FS-029","FS-030",
        "FS-031","FS-032","FS-033","FS-034","FS-035"
      ]
    },
    {
      "name": "api_gateway_bff",
      "responsibility": "REST API façade for the dashboard, orchestrating requests to backend services, enforcing read-only access, validating filters, and shaping responses for UI consumption.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010",
        "FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020",
        "FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028","FS-029","FS-030",
        "FS-031","FS-032","FS-033","FS-035"
      ]
    },
    {
      "name": "kpi_calculation_service",
      "responsibility": "Calculates Total Claims, Total Claim Cost, Claim Approval Rate, Average Claim Processing Time, and their changes versus the previous period using submission_date-based filters and claim-amount rules.",
      "implements": ["FS-001","FS-003","FS-004","FS-009","FS-010","FS-026","FS-033"]
    },
    {
      "name": "claims_query_service",
      "responsibility": "Executes filtered, sorted, and paginated queries over Warranty Claim data, applying status and overdue rules to support the claims list and related KPIs.",
      "implements": [
        "FS-001","FS-006","FS-007","FS-011","FS-012","FS-013","FS-014","FS-015","FS-024",
        "FS-025","FS-027","FS-028","FS-029","FS-030","FS-033","FS-035"
      ]
    },
    {
      "name": "trend_and_breakdown_service",
      "responsibility": "Provides monthly trend aggregates and breakdowns by vehicle model and component category for counts and costs, respecting filter parameters and performance constraints.",
      "implements": ["FS-002","FS-003","FS-005","FS-008","FS-009","FS-020","FS-021","FS-022","FS-023","FS-024","FS-027","FS-028"]
    },
    {
      "name": "claim_detail_service",
      "responsibility": "Returns full warranty claim details and ordered status history for a claim and validates cost-composition rules for display in the detail panel.",
      "implements": ["FS-007","FS-008","FS-016","FS-031","FS-032"]
    },
    {
      "name": "vehicle_models_service",
      "responsibility": "Exposes vehicle model master data and per-model claim counts, enabling model-based filtering and model-wise analytics.",
      "implements": ["FS-001","FS-008","FS-009","FS-011","FS-021","FS-024","FS-027","FS-028"]
    },
    {
      "name": "configuration_and_units_service",
      "responsibility": "Manages configuration for display currency and distance units and ensures consistent formatting across KPIs, charts, and lists.",
      "implements": ["FS-001","FS-003","FS-009","FS-010"]
    },
    {
      "name": "synthetic_data_generation_pipeline",
      "responsibility": "Generates and loads synthetic Vehicle Model, Dealer, Warranty Claim, and Claim Status History data that conforms to the defined business rules and supports all analytics scenarios.",
      "implements": ["FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010"]
    },
    {
      "name": "relational_data_store",
      "responsibility": "Persists synthetic entities and supports indexed, read-only queries for all dashboard APIs, ensuring query performance and integrity.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010",
        "FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-020","FS-021","FS-022","FS-023","FS-024",
        "FS-025","FS-027","FS-028","FS-029","FS-030","FS-031","FS-032","FS-033","FS-035"
      ]
    }
  ],
  "cross_cutting_concerns": [
    "Authentication and uniform read-only authorization across all endpoints.",
    "Input validation and enforcement of status, component category, and date-range rules at API boundaries.",
    "Centralized error handling, standardized error contracts, and consistent UI error states.",
    "Structured logging, correlation IDs, and metrics for API latency and initial page-load performance.",
    "Performance optimization via indexing, pagination, parallel calls, and optional caching of aggregates.",
    "Configuration management for display currency and distance units with consistent formatting.",
    "Security and privacy controls ensuring synthetic-only data usage and VIN masking in the UI.",
    "Accessibility compliance (WCAG 2.1 AA) and responsive UX across desktop, tablet, and mobile.",
    "API contract documentation (OpenAPI/Swagger) and support for mocked/stubbed services to enable independent UI and API testing."
  ],
  "narrative": "The Warranty Claims Analysis Dashboard is a three-tier, read-only analytics application built on synthetic data. A responsive web UI interacts with a RESTful API Gateway/Backend-for-Frontend that orchestrates specialized domain services for KPI calculations, claims querying, trend and breakdown analytics, and claim detail retrieval. Data is stored in a relational database seeded by a synthetic data-generation pipeline that enforces core business rules and entity relationships. Global filters based on claim submission_date ensure that all KPIs, charts, and the claims list remain synchronized, while overdue and eligibility behaviors are computed according to the defined business rules. Cross-cutting concerns such as authentication, error handling, performance monitoring, configuration for currency and units, accessibility, and API contract documentation are implemented consistently across the architecture, enabling maintainable, testable, and performant delivery of warranty insights to analysts, quality engineers, and after-sales managers."
}
```
