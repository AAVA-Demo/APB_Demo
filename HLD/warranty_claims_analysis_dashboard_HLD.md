# Warranty Claims Analysis Dashboard – High-Level Design

## 1. Architecture Narrative

The **warranty_claims_analysis_dashboard** module is a read-only analytics application providing a consolidated, interactive view of synthetic warranty claim data across multiple vehicle models, regions, and time periods.

The solution is organized into the following major components:

1. **Web UI (Dashboard Front-End)**  
   A single-page application (SPA) or rich web client responsible for rendering KPI cards, charts, filters, claims tables, and claim-detail panels, and coordinating user interactions. It consumes documented REST APIs and applies UX patterns for loading, empty, and error states, as well as responsive behavior and accessibility.

2. **API Gateway / Edge Layer**  
   A thin HTTP layer that exposes the dashboard’s REST endpoints to the UI: KPI summary, vehicle models, claims list, claim detail, monthly trend, and breakdown. It centralizes cross-cutting concerns such as request validation, filter schema enforcement, basic authentication (if configured), CORS, rate limiting, and error normalization.

3. **Dashboard Aggregation Services**  
   Backend application services that implement the core business logic and calculations for analytics:
   - KPI Calculation Service (Total Claims, Total Claim Cost, Claim Approval Rate, Average Claim Processing Time, change vs. previous period).
   - Trend Service (monthly claim volume and cost time series).
   - Breakdown Service (model-wise and component-wise aggregates).
   - Claims Service (filtered, sorted, paginated claims list; overdue flagging; status enumeration enforcement).
   - Claim Detail Service (full claim + status history retrieval and validation of cost composition).

   These services encapsulate business rules (BR-001–BR-020, FR-02, FR-04, FR-06, FR-09, FR-12, FR-15, FR-17) and provide consistent API contracts (TN-001, TN-007, TN-008, TN-025).

4. **Filter & Configuration Service**  
   A shared backend module responsible for:
   - Defining and validating common filter schema across APIs (model, model year, region, date range, status, component category) in line with TN-009 and FR-17 / FS-024.
   - Computing default filter values (e.g., current calendar month by submission date, all models, all regions; BR-015, BR-016).
   - Managing configuration for display currency and distance units (USD / miles by default, with potential other markets) per TN-024, TN-030, TN-037.

5. **Domain Data Services & Repositories**  
   Data-access layer that exposes read-only operations over the synthetic dataset:
   - **Vehicle Model Repository** (VehicleModel entity – TN-011, TN-032).
   - **Dealer Repository** (Dealer entity – TN-012).
   - **Warranty Claim Repository** (WarrantyClaim entity – TN-013, TN-033).
   - **Claim Status History Repository** (ClaimStatusHistory entity – TN-014).

   Repositories implement query and aggregation logic over a relational database (or equivalent) and enforce referential integrity and validation rules (BR-003, BR-006, BR-013, BR-017, BR-018). They rely on indexes for performance (TN-003, TN-013, TN-019, TN-036).

6. **Synthetic Data Generation & Seeding Pipeline**  
   Offline or deployment-time processes that generate and seed synthetic data into the data store (TN-010, TN-026, TN-031, TN-038):
   - Create ~2,000 Warranty Claims with realistic distributions across 6 models, 3 model years, 5 regions, and ~40 dealers for the last 12 months.
   - Produce consistent Claim Status History that reflects allowed transitions (BR-007, BR-008, BR-012).
   - Enforce warranty eligibility and overdue semantics at data level where needed (BR-009–BR-011, CON-002).

7. **Observability & Performance Layer**  
   Cross-cutting monitoring and performance tooling (TN-018, TN-019, TN-028, TN-035, TN-036, TN-042):
   - Metrics for API latency (95th percentile <= 500 ms) and initial dashboard load time (<= 3 seconds).
   - Logs and traces for API calls, filter usage, and synthetic data access.
   - Health endpoints for services to support operational monitoring.

8. **Security & Access Control Layer**  
   A minimal but explicit layer enforcing read-only access (BR-018–BR-020, NFR-04, TN-033):
   - Restricts access to authenticated/demo users where required.
   - Prevents any create/update/delete operations on warranty claims or master data.
   - Ensures that only synthetic data is stored and exposed.

### Interaction Overview

Typical end-to-end flow (FS-001) for loading the dashboard:

1. User navigates to the dashboard URL.  
2. Web UI initializes with default global filters (current month, all models, all regions; BR-015, BR-016, FS-010, FS-024).  
3. Web UI issues parallel REST calls via the API Gateway:
   - `/kpi-summary` (KPI Calculation Service, FS-010, FS-003, FS-004, FS-026).  
   - `/monthly-trend` (Trend Service, FS-002, FS-020).  
   - `/breakdown?groupBy=model` and `groupBy=component` (Breakdown Service, FS-005, FS-021, FS-022).  
   - `/claims` (Claims Service, FS-012–FS-015, FS-027–FS-030, FS-033, FS-035).  
   - `/vehicle-models` (Vehicle Model Service, FS-011).
4. Filter & Configuration Service validates incoming filter parameters and applies default date range (submission_date-based) plus multi-model, model-year, region, status, and component filters (FS-024).  
5. Dashboard Aggregation Services query/retrieve data via the domain repositories and compute necessary aggregates/calculations (BR-001–BR-005, BR-011, BR-014–BR-017). Overdue flags are computed either in the Claims Service or at query time (FS-006, FS-025, FS-030).  
6. API Gateway normalizes responses and error codes; Observability layer logs metrics for latency and success/failure.  
7. Web UI renders KPI cards, charts, and claims list with:
   - Loading indicators while data is being fetched (FS-017).  
   - Empty states when no data (FS-018, FS-033).  
   - Error states for failed calls (FS-019, FS-035, AC-09).
8. User interactions (filter changes, chart segment selections, claim row clicks) trigger updated API calls and UI updates:
   - Global filter changes propagate to all components (FS-024, FS-027, FS-028).  
   - Component-wise chart selection filters the claims list via Claims API (FS-023, AC-05).  
   - Claim row selection opens a Claim Detail panel using `/claim-detail/{id}` (FS-016, FS-031, FS-032, AC-06).

The entire system is read-only from the dashboard perspective; any workflow-like rules (e.g., eligibility-based rejection BR-010) are realized in the data generation pipeline, not at runtime.

---

## 2. Components and Responsibilities

### 2.1 Web UI – Dashboard Front-End

**Responsibilities**
- Render consolidated dashboard with KPIs, charts, and claims list (FS-001, FS-002, FS-003, FS-005, FS-006, FS-009, FS-010, FS-021, FS-022, FS-027–FS-028).  
- Implement global filters and their propagation (model, model year, region, date range) across all views (FS-011, FS-016, FS-020–FS-024).  
- Provide claims list with sorting and pagination (FS-012–FS-014).  
- Implement status filter & overdue claim highlighting in the UI (FS-006, FS-007, FS-015, FS-025, FS-029–FS-030).  
- Render claim detail panel with detailed fields and status history (FS-016, FS-031–FS-032).  
- Handle loading, empty, and error states for all visual components (FS-017–FS-019, FS-033, FS-035).  
- Implement responsive layouts for desktop, tablet, and mobile (FS-034; TN-015–TN-017, TN-027).  
- Implement accessibility and browser-compatibility constraints (TN-020, TN-021, TN-029, TN-040).

**Key Interactions**
- Calls REST endpoints via API Gateway with shared filter schema.  
- Interprets and renders filter-driven data updates.  
- Masks VIN values in UI per BR-014.

### 2.2 API Gateway / Edge Layer

**Responsibilities**
- Expose public REST endpoints for dashboard data:
  - `GET /kpi-summary` – KPI Summary Endpoint (FR-02, TN-001, TN-025).  
  - `GET /vehicle-models` – Vehicle Models Endpoint (FR-04, TN-002).  
  - `GET /claims` – Claims Endpoint (FR-06, TN-003–TN-005).  
  - `GET /claim-detail/{claimId}` – Claim Detail Endpoint (FR-09, TN-006).  
  - `GET /monthly-trend` – Monthly Trend Endpoint (FR-12, TN-007).  
  - `GET /breakdown` – Breakdown Endpoint (FR-15, TN-008).
- Enforce common filter schema and validation (TN-009) across endpoints.  
- Normalize error responses and propagate appropriate status codes for UI error handling (FS-019, FS-035).  
- Implement CORS, request throttling, minimal authentication, and ensure read-only access aligned to BR-019–BR-020 and NFR-04.

**Key Interactions**
- Forwards valid requests to corresponding Aggregation Service components.  
- Integrates with Observability layer to log metrics and traces.

### 2.3 KPI Calculation Service

**Responsibilities**
- Implement `GET /kpi-summary` business logic (TN-001, TN-025, FS-003–FS-004, FS-010, FS-026, FS-033):
  - **Total Claims**: count claims whose `submission_date` falls within the selected date range and satisfy all filters (BR-001).  
  - **Total Claim Cost**: sum `claim_amount` (= `parts_cost + labour_cost`) for filtered claims (BR-002, BR-003).  
  - **Claim Approval Rate**: `(Approved / (Approved + Rejected)) × 100` for filtered Approved and Rejected claims; exclude open statuses (BR-004).  
  - **Average Claim Processing Time**: mean `(decision_date - submission_date)` in days for filtered Approved and Rejected claims (BR-005).
- Compute change vs previous period for all KPIs (FS-026), deriving prior period of equal length.  
- Honor date filters using submission_date (BR-015–BR-016).  
- Respect eligibility/workflow rules as reflected in data (BR-009–BR-010) without mutating data at runtime.

**Key Interactions**
- Queries WarrantyClaim repository for filtered claims.  
- May leverage pre-computed aggregates or caching to meet performance SLAs (TN-018, TN-028, TN-035–TN-036, TN-041).

### 2.4 Trend Service

**Responsibilities**
- Implement `GET /monthly-trend` endpoint logic (FR-12, FS-002, FS-020, TN-007, TN-028):
  - Aggregate claim count and claim cost per month for the last 12 months or specified period.  
  - Use submission_date as time dimension per BR-015–BR-016.
- Provide data for toggling chart between count and cost without additional calls when both metrics are returned upfront (FS-020).

**Key Interactions**
- Queries WarrantyClaim repository with group-by month functions.  
- Integrates with filter schema (model, model year, region, date range) and configuration for currency (TN-024, TN-030).

### 2.5 Breakdown Service

**Responsibilities**
- Implement `GET /breakdown` endpoint logic (FR-15, FS-005, FS-021–FS-023, TN-008):
  - Group and aggregate claim count and cost by **vehicle model** (FS-021, FS-027–FS-028).  
  - Group and aggregate claim count and cost by **component category** (FS-005, FS-022, BR-017).
- Return a standard aggregation structure usable for both charts and accessible/tabular representations (TN-029).

**Key Interactions**
- Uses WarrantyClaim repository and component category taxonomy enforcement (BR-017).  
- Drives UI charts for model-wise and component-wise analytics and supports clickable component segments that feed into Claims Service filtering (FS-023).

### 2.6 Claims Service

**Responsibilities**
- Implement `GET /claims` endpoint with filter, sorting, and pagination (FR-06, FS-006–FS-007, FS-012–FS-015, FS-024–FS-025, FS-027–FS-030, FS-033, FS-035, TN-003–TN-005):
  - Filter by model, model year, region, date range, status, and component category (FS-015, FS-023–FS-024, TN-009).  
  - Apply status enumeration and validation (BR-006, BR-007–BR-008).  
  - Support sorting by any displayed column (FS-013, TN-004).  
  - Support pagination with 25 rows per page and total count metadata (FS-014, TN-005).  
  - Compute overdue flag using rule `(current_status ∈ {Submitted, Under Review} AND (now - submission_date) > 30 days)` (BR-011, FS-006, FS-025, FS-029–FS-030).
- Return normalized claim list payload with:
  - Claim ID, masked VIN (or full VIN with masking at UI), Model, Model Year, Component, Dealer, Region, Submission Date, Claim Amount, Status, overdue flag (FR-05, BR-013–BR-014).

**Key Interactions**
- Queries WarrantyClaim and related entities with efficient indexing (TN-003, TN-013, TN-019).  
- Works with Filter & Configuration Service to enforce filter semantics and read-only policy (BR-019–BR-020).  
- Provides data to Web UI for claims table and supports persona workflows (FS-007–FS-009, AC-01–AC-05, AC-07–AC-09).

### 2.7 Claim Detail Service

**Responsibilities**
- Implement `GET /claim-detail/{id}` endpoint (FR-09, FS-016, FS-031–FS-032, TN-006):
  - Retrieve full WarrantyClaim data by Claim ID, including: failure description, mileage, repair date, parts cost, labour cost, claim amount, status, submission_date, decision_date, and related model/dealer/component information.  
  - Join ClaimStatusHistory entries ordered by `changed_on` (BR-012, FS-032).  
  - Verify parts_cost + labour_cost = claim_amount (BR-003, FS-031), optionally returning a flag or exposing discrepancy for synthetic data testing.

**Key Interactions**
- Utilizes WarrantyClaim and ClaimStatusHistory repositories.  
- Provides detail view to Web UI claim detail panel for persona-specific drill-down (FS-007–FS-008, AC-06).

### 2.8 Filter & Configuration Service

**Responsibilities**
- Define shared filter model object used across endpoints (TN-009, FS-024):
  - `models[]`, `modelYears[]`, `regions[]`, `dateRange` (start, end), `status`, `componentCategory`.  
- Compute default date range as current calendar month based on submission_date (BR-015–BR-016, FS-010, FS-024).  
- Validate filter combinations (e.g., at least one model selected or treat empty as “All models”, FS-011, FS-027–FS-028).  
- Manage configuration for currency and distance units (TN-024, TN-030, TN-037) and inject into KPI, trend, and breakdown formatting.

**Key Interactions**
- Called by API Gateway before delegating to Aggregation Services.  
- Provides consistent filter semantics to avoid divergence across endpoints.

### 2.9 Domain Data Layer (Repositories)

**Responsibilities**
- **VehicleModel Repository** (TN-011, TN-032):
  - Persist and expose Model ID, Model Name, Model Years, Vehicle Type.  
  - Provide aggregated claim counts per model via joins to WarrantyClaim for vehicle models API and breakdown service.
- **Dealer Repository** (TN-012):
  - Persist Dealer ID, Dealer Name, Region and support region-based filtering in claims and breakdowns.  
  - Ensure referential integrity with WarrantyClaim via Dealer ID.
- **WarrantyClaim Repository** (TN-013, TN-033, TN-035, TN-038):
  - Persist main claim record with required fields and indexes.  
  - Support: filtered queries, time-series aggregations, model/component breakdowns, overdue flag computation, eligibility status representation.  
  - Enforce single association to model, component category, dealer, and region (BR-013).
- **ClaimStatusHistory Repository** (TN-014):
  - Persist Claim ID, Status, Changed On entries; ensure immutability post-write (BR-012).  
  - Provide status timelines for claim view.

**Key Interactions**
- Serve as backing store for all Aggregation Services and Synthetic Data Generator.  
- Enforce validation rules during seeding and any future data ingestion.

### 2.10 Synthetic Data Generation & Seeding Pipeline

**Responsibilities**
- Generate sample dataset aligned with PRD and technical notes (TN-010, TN-026, TN-028, TN-031, TN-038, TN-039):
  - 6 vehicle models, 3 model years, 5 regions, ~40 dealers, ~2,000 claims over the last 12 months.  
  - Populate component categories from the required set (BR-017).  
  - Populate status histories observing allowed transitions and finality rules (BR-006–BR-008, BR-012).  
  - Compute and persist eligibility and overdue flags or raw fields so that runtime services can derive correct states (BR-009–BR-011).  
  - Ensure all data is synthetic and complies with privacy constraints (BR-018, NFR-04).

**Key Interactions**
- Runs during environment setup or CI pipelines to seed demo/test environments.  
- Validates data against business rules so analytics are meaningful and acceptance criteria can be tested.

### 2.11 Observability & Performance Layer

**Responsibilities**
- Expose metrics on:
  - API latency per endpoint (TN-019, TN-041–TN-042).  
  - Initial dashboard load time (TN-018, TN-028).  
  - Query performance, page size distribution, and filter usage (TN-035–TN-036).  
- Provide logs for:
  - API errors, filter validation failures, rule violations (e.g., invalid status transitions).  
  - Synthetic data anomalies (e.g., claim_amount mismatches).  
- Support tracing for multi-endpoint calls during dashboard load.

**Key Interactions**
- Integrated into Aggregation Services and API Gateway via instrumentation libraries.

### 2.12 Security & Access Control Layer

**Responsibilities**
- Enforce read-only access to dashboard APIs (BR-019, BR-020, TN-033).  
- Ensure only synthetic data is loaded and exposed (BR-018, TN-031).  
- Prevent modification of claims and master data through UI or APIs.  
- Optionally provide simple auth (e.g., API key or demo user login) without role-specific differences.

**Key Interactions**
- Hooks into API Gateway for request authorization.  
- Integrates with Observability to detect misuse attempts.

---

## 3. Functional Capability to Component Mapping

Below, each functional spec (FS-xxx) is mapped to implementing component(s).

### FS-001 – View consolidated dashboard of warranty claims across all supported vehicle models
- **Components**: Web UI, API Gateway, KPI Calculation Service, Trend Service, Breakdown Service, Claims Service, Filter & Configuration Service.  
- **Notes**: Supports consolidated, synchronized view with default filters.

### FS-002 – Monitor monthly warranty claim volumes for selected filters
- **Components**: Web UI, API Gateway, Trend Service, WarrantyClaim Repository, Filter & Configuration Service.  
- **Notes**: Trend chart; count-based metric.

### FS-003 – Monitor total and aggregated claim costs for selected filters
- **Components**: Web UI, API Gateway, KPI Calculation Service, Breakdown Service, Trend Service, WarrantyClaim Repository, Filter & Configuration Service.  
- **Notes**: Uses claim_amount = parts_cost + labour_cost.

### FS-004 – Monitor claim approval rates for selected filters
- **Components**: Web UI, API Gateway, KPI Calculation Service, WarrantyClaim Repository, Filter & Configuration Service.  
- **Notes**: Approval rate per BR-004.

### FS-005 – Identify component-level failure patterns across warranty claims
- **Components**: Web UI, API Gateway, Breakdown Service, WarrantyClaim Repository, Synthetic Data Generator (for populated component categories).  
- **Notes**: Component-wise chart.

### FS-006 – Highlight pending and overdue claims in the claims list
- **Components**: Web UI, API Gateway, Claims Service, WarrantyClaim Repository, Filter & Configuration Service.  
- **Notes**: Overdue flag computed as per BR-011.

### FS-007 – Support warranty analyst tasks (review claims, filter by status, open claim details, identify overdue claims)
- **Components**: Web UI, API Gateway, Claims Service, Claim Detail Service, WarrantyClaim Repository, ClaimStatusHistory Repository.  
- **Notes**: Persona-specific workflow over claims table and detail panel.

### FS-008 – Support quality engineer tasks (component-wise analysis, model/model-year comparison, drill into claims)
- **Components**: Web UI, API Gateway, Breakdown Service, Claims Service, Claim Detail Service, Filter & Configuration Service, WarrantyClaim Repository.  
- **Notes**: Uses model-wise and component-wise charts plus drill-down.

### FS-009 – Support after-sales manager tasks (monitor KPIs, track monthly trends, compare regions and models)
- **Components**: Web UI, API Gateway, KPI Calculation Service, Trend Service, Breakdown Service, Filter & Configuration Service, WarrantyClaim Repository.  
- **Notes**: Manager persona with KPI focus.

### FS-010 – Display four KPI cards for selected filters with default period set to current calendar month
- **Components**: Web UI, API Gateway, KPI Calculation Service, Filter & Configuration Service, WarrantyClaim Repository.  
- **Notes**: Uses default filters logic and change vs previous period.

### FS-011 – Select one, multiple, or all vehicle models for dashboard filtering
- **Components**: Web UI, API Gateway, Filter & Configuration Service, VehicleModel Repository, KPI Calculation Service, Claims Service, Trend Service, Breakdown Service.  
- **Notes**: Model multi-select filter.

### FS-012 – Display claims list with defined columns and pagination
- **Components**: Web UI, API Gateway, Claims Service, WarrantyClaim Repository, Dealer Repository, VehicleModel Repository.  
- **Notes**: 25 rows/page, masking VIN in UI; pagination contract.

### FS-013 – Sort claims list by any displayed column
- **Components**: Web UI, API Gateway, Claims Service, WarrantyClaim Repository.  
- **Notes**: Server-side sorting; consistent semantics.

### FS-014 – Paginate the claims list at 25 rows per page
- **Components**: Web UI, API Gateway, Claims Service, WarrantyClaim Repository.  
- **Notes**: page, pageSize, totalCount.

### FS-015 – Filter claims list by claim status
- **Components**: Web UI, API Gateway, Claims Service, WarrantyClaim Repository, Filter & Configuration Service.  
- **Notes**: Status values limited to enumeration and validated.

### FS-016 – Display claim detail panel for a selected claim
- **Components**: Web UI, API Gateway, Claim Detail Service, WarrantyClaim Repository, ClaimStatusHistory Repository.  
- **Notes**: Retrieval of detail plus status timeline.

### FS-017 – Show loading states for KPIs, charts, and lists while data is being retrieved
- **Components**: Web UI.  
- **Notes**: Pure UI responsibility, driven by API call lifecycle.

### FS-018 – Show empty states when no data matches current filters for KPIs, charts, and lists
- **Components**: Web UI, API Gateway, KPI Calculation Service, Trend Service, Breakdown Service, Claims Service.  
- **Notes**: Zero values and empty messages.

### FS-019 – Show error states when data retrieval fails and prevent display of incorrect values
- **Components**: Web UI, API Gateway, Aggregation Services (for error signaling), Observability Layer.  
- **Notes**: Per-component error handling.

### FS-020 – View and toggle monthly claim trend chart between claim count and claim cost
- **Components**: Web UI, API Gateway, Trend Service, WarrantyClaim Repository, Filter & Configuration Service.  
- **Notes**: Toggle with single payload containing both metrics.

### FS-021 – View model-wise chart comparing claim count and claim cost across vehicle models
- **Components**: Web UI, API Gateway, Breakdown Service, WarrantyClaim Repository, VehicleModel Repository, Filter & Configuration Service.  
- **Notes**: chart for model comparison.

### FS-022 – View component-wise chart showing claim count and claim cost by component category
- **Components**: Web UI, API Gateway, Breakdown Service, WarrantyClaim Repository, Synthetic Data Generator (for component categories), Filter & Configuration Service.  
- **Notes**: component chart; uses taxonomy.

### FS-023 – Filter claims list by component category selection from component-wise chart
- **Components**: Web UI, API Gateway, Claims Service, Breakdown Service, WarrantyClaim Repository, Filter & Configuration Service.  
- **Notes**: Chart-to-table drilldown.

### FS-024 – Apply global filters (model, model year, region, date range) consistently to KPIs, charts, and claims list
- **Components**: Web UI, API Gateway, Filter & Configuration Service, KPI Calculation Service, Trend Service, Breakdown Service, Claims Service, WarrantyClaim Repository, VehicleModel Repository, Dealer Repository.  
- **Notes**: Synchronization across all components.

### FS-025 – Flag overdue claims in the claims list with a visual indicator
- **Components**: Web UI, API Gateway, Claims Service, WarrantyClaim Repository, Observability Layer (for overdue calculation monitoring).  
- **Notes**: Overdue flag for Submitted/Under Review claims >30 days.

### FS-026 – Display change vs previous period on each KPI card
- **Components**: Web UI, API Gateway, KPI Calculation Service, WarrantyClaim Repository, Filter & Configuration Service.  
- **Notes**: current vs previous period calculations.

### FS-027 – View claims across multiple vehicle models simultaneously in tables and charts
- **Components**: Web UI, API Gateway, Filter & Configuration Service, KPI Calculation Service, Breakdown Service, Trend Service, Claims Service, WarrantyClaim Repository, VehicleModel Repository.  
- **Notes**: multi-model context.

### FS-028 – Constrain KPIs, charts, and claims list to data for selected models only
- **Components**: Web UI, API Gateway, Filter & Configuration Service, KPI Calculation Service, Breakdown Service, Trend Service, Claims Service, WarrantyClaim Repository.  
- **Notes**: respect selected model filter.

### FS-029 – Ensure claims list count aligns with selected status filter
- **Components**: Web UI, API Gateway, Claims Service, WarrantyClaim Repository, Filter & Configuration Service.  
- **Notes**: accurate counts per status; AC-03.

### FS-030 – Flag claims that have been Under Review for more than 30 days at list load time
- **Components**: Web UI, API Gateway, Claims Service, WarrantyClaim Repository.  
- **Notes**: specialization of overdue rule for Under Review status; AC-04.

### FS-031 – Verify and display that parts cost plus labour cost equals claim amount in claim detail
- **Components**: Web UI, Claim Detail Service, WarrantyClaim Repository, API Gateway.  
- **Notes**: BR-003; composition check.

### FS-032 – Display claim status history entries ordered by date in claim detail panel
- **Components**: Web UI, Claim Detail Service, ClaimStatusHistory Repository, API Gateway.  
- **Notes**: chronological status history.

### FS-033 – Show zero KPIs and empty claims list state when no claims match filters
- **Components**: Web UI, API Gateway, KPI Calculation Service, Claims Service, Trend Service, Breakdown Service.  
- **Notes**: AC-07.

### FS-034 – Provide a usable dashboard layout on 375px mobile viewport without horizontal scrolling
- **Components**: Web UI, Responsive Layout Implementation (CSS/Grid), TN-015–TN-017, TN-027.  
- **Notes**: AC-08; mobile responsiveness.

### FS-035 – Handle claims API unavailability at dashboard load by showing appropriate error messages
- **Components**: Web UI, API Gateway, Claims Service, Observability Layer.  
- **Notes**: AC-09; error handling for unavailable claims API.

---

## 4. Cross-Cutting Concerns

These concerns apply system-wide and are not repeated per component.

1. **Authentication and Authorization**  
   - Minimal authentication for demo/read-only users; no role-based differentiation in initial release (BR-019–BR-020).  
   - Authorization layer ensures that only `GET` operations are exposed for dashboard APIs; any attempted write (POST/PUT/PATCH/DELETE) is rejected.  
   - Implemented at API Gateway and Security Layer.

2. **Data Privacy and Security**  
   - Only synthetic data is stored and exposed (BR-018, TN-031, NFR-04).  
   - VINs masked in UI, and for future non-synthetic scenarios, potential masking/tokenization at storage/API layers (BR-014, CON-003).  
   - No customer PII or confidential dealer data in scope.

3. **Error Handling & Resilience**  
   - Consistent error contracts across APIs (TN-022, FS-019, FS-035).  
   - UI shows per-component error states and avoids stale or partial data (FS-017–FS-019).  
   - API layer uses standardized status codes and structured error payloads.

4. **Logging, Monitoring, and Observability**  
   - Structured logging for API requests/responses, filter usage, rule violations.  
   - Metrics for latency, throughput, and error rate per endpoint (TN-019, TN-041–TN-042).  
   - Dashboards for performance (NFR-02, TN-018, TN-028, TN-035–TN-036).  
   - Tracing across UI–API–service–DB for performance bottleneck analysis.

5. **Performance & Scalability**  
   - Indexing and query optimization to meet 500 ms API response target (TN-003, TN-013, TN-019, TN-036).  
   - Parallel calls from UI on initial load (TN-041) and potential caching/pre-aggregation of KPI and trend data (TN-028).  
   - Sensible limits on pagination and aggregation complexity.

6. **Responsiveness & Accessibility**  
   - Responsive layout for desktop, tablet, mobile with no horizontal page scrolling (NFR-01, FS-034, TN-015–TN-017, TN-027).  
   - WCAG 2.1 AA compliance (NFR-03, TN-020, TN-029, TN-040): keyboard navigation, ARIA for charts, alternative tabular views for visualizations.  
   - Cross-browser compatibility for latest versions of major browsers (NFR-05, TN-021).

7. **Configuration Management**  
   - Centralized configuration for currency, distance units, and possibly locale (TN-024, TN-030, TN-037).  
   - Configurable thresholds for overdue definition and warranty period in future (currently illustrative per assumptions).

8. **Testability and Documentation**  
   - Independently testable UI and API layers (NFR-06, TN-023, TN-034, TN-039).  
   - Mock/stub services matching API contracts, and CI integration.  
   - Documented API schemas via OpenAPI/Swagger and markdown (TN-022).

---

## 5. Component Summary Table

| Component Name | Responsibility | Implements |
|---------------|----------------|-----------|
| Web UI (Dashboard Front-End) | Render dashboard (KPIs, charts, claims list, detail panel), manage filters, loading/empty/error states, responsive layout, accessibility | FS-001, FS-002, FS-003, FS-004, FS-005, FS-006, FS-007, FS-008, FS-009, FS-010, FS-011, FS-012, FS-013, FS-014, FS-015, FS-016, FS-017, FS-018, FS-019, FS-020, FS-021, FS-022, FS-023, FS-024, FS-025, FS-026, FS-027, FS-028, FS-029, FS-030, FS-031, FS-032, FS-033, FS-034, FS-035 |
| API Gateway / Edge Layer | Expose REST endpoints, validate filters, centralize auth, CORS, rate limiting, error normalization | FS-001–FS-006, FS-008–FS-016, FS-018–FS-024, FS-025–FS-033, FS-035 |
| KPI Calculation Service | Compute dashboard KPIs, including totals and changes vs previous period | FS-001, FS-003, FS-004, FS-009, FS-010, FS-026, FS-033, FS-027–FS-028 |
| Trend Service | Provide monthly claim count and cost trends | FS-002, FS-009, FS-020, FS-024, FS-033, FS-027–FS-028 |
| Breakdown Service | Provide model-wise and component-wise aggregations | FS-001, FS-005, FS-008, FS-009, FS-021, FS-022, FS-023, FS-024, FS-027–FS-028 |
| Claims Service | Provide filtered, sorted, paginated claims; compute overdue flags; enforce status constraints | FS-001, FS-006, FS-007, FS-009, FS-012, FS-013, FS-014, FS-015, FS-018, FS-023, FS-024, FS-025, FS-027, FS-028, FS-029, FS-030, FS-033, FS-035 |
| Claim Detail Service | Provide detailed claim data and ordered status history; validate cost composition | FS-007, FS-008, FS-016, FS-031, FS-032 |
| Filter & Configuration Service | Define/validate global filter schema; compute defaults; manage currency/unit configuration | FS-001–FS-006, FS-008–FS-016, FS-020–FS-024, FS-026–FS-033 |
| VehicleModel Repository | Persist Vehicle Model entity and supply model metadata and counts | FS-001, FS-008, FS-009, FS-011, FS-021, FS-024, FS-027, FS-028 |
| Dealer Repository | Persist Dealer and Region entities to support region filters and claims listing | FS-001, FS-009, FS-012, FS-024, FS-027, FS-028 |
| WarrantyClaim Repository | Persist Warranty Claim entity; support all KPI, trend, breakdown, claims list queries | FS-001–FS-006, FS-008–FS-016, FS-020–FS-033, FS-035 |
| ClaimStatusHistory Repository | Persist claim status history; support detail view | FS-007, FS-008, FS-016, FS-032 |
| Synthetic Data Generation & Seeding Pipeline | Generate and seed synthetic data consistent with business rules | Enables FS-001–FS-035 via valid data; directly linked to FS-002, FS-005, FS-021, FS-022, FS-025, FS-027–FS-033 |
| Observability & Performance Layer | Provide logging, metrics, and tracing; validate performance SLAs | Supports FS-001–FS-035, NFR-02, NFR-06 |
| Security & Access Control Layer | Enforce read-only usage and synthetic-data-only constraints | Supports FS-001–FS-035, BR-018–BR-020 |

---

## 6. JSON HLD Structure

```json
{
  "components": [
    {
      "name": "web_ui_dashboard_frontend",
      "responsibility": "Render dashboard KPIs, charts, claims list, detail panel; manage filters, states, responsiveness, and accessibility.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028","FS-029","FS-030","FS-031","FS-032","FS-033","FS-034","FS-035"
      ]
    },
    {
      "name": "api_gateway_edge_layer",
      "responsibility": "Expose REST endpoints, enforce common filter schema, centralize auth and CORS, normalize errors.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024","FS-025","FS-027","FS-028","FS-029","FS-030","FS-031","FS-032","FS-033","FS-035"
      ]
    },
    {
      "name": "kpi_calculation_service",
      "responsibility": "Compute Total Claims, Total Claim Cost, Claim Approval Rate, Average Claim Processing Time, and changes vs previous period based on filters.",
      "implements": [
        "FS-001","FS-003","FS-004","FS-009","FS-010","FS-026","FS-027","FS-028","FS-033"
      ]
    },
    {
      "name": "trend_service",
      "responsibility": "Provide monthly claim count and cost trend data for the last 12 months or selected period.",
      "implements": [
        "FS-002","FS-009","FS-020","FS-024","FS-027","FS-028","FS-033"
      ]
    },
    {
      "name": "breakdown_service",
      "responsibility": "Provide model-wise and component-wise claim count and cost aggregates for analytics charts.",
      "implements": [
        "FS-001","FS-005","FS-008","FS-009","FS-021","FS-022","FS-023","FS-024","FS-027","FS-028"
      ]
    },
    {
      "name": "claims_service",
      "responsibility": "Provide filtered, sorted, paginated claims list; compute overdue flags; enforce status enumeration and return table payload.",
      "implements": [
        "FS-001","FS-006","FS-007","FS-009","FS-012","FS-013","FS-014","FS-015","FS-018","FS-023","FS-024","FS-025","FS-027","FS-028","FS-029","FS-030","FS-033","FS-035"
      ]
    },
    {
      "name": "claim_detail_service",
      "responsibility": "Retrieve detailed claim data and ordered status history, validate parts + labour = claim amount.",
      "implements": [
        "FS-007","FS-008","FS-016","FS-031","FS-032"
      ]
    },
    {
      "name": "filter_configuration_service",
      "responsibility": "Define and validate global filters (model, model year, region, date range, status, component); compute defaults; manage currency and unit configuration.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-020","FS-021","FS-022","FS-023","FS-024","FS-026","FS-027","FS-028","FS-029","FS-030","FS-031","FS-032","FS-033"
      ]
    },
    {
      "name": "vehicle_model_repository",
      "responsibility": "Persist and expose vehicle model data, including model names, years, types, and aggregated claim counts.",
      "implements": [
        "FS-001","FS-008","FS-009","FS-011","FS-021","FS-024","FS-027","FS-028"
      ]
    },
    {
      "name": "dealer_repository",
      "responsibility": "Persist dealer and region data; support region-based filtering and claims table rendering.",
      "implements": [
        "FS-001","FS-009","FS-012","FS-024","FS-027","FS-028"
      ]
    },
    {
      "name": "warranty_claim_repository",
      "responsibility": "Persist warranty claim records and support all KPI, trend, breakdown, and claims list queries with appropriate indexes and validations.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-012","FS-013","FS-014","FS-015","FS-016","FS-020","FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028","FS-029","FS-030","FS-031","FS-033","FS-035"
      ]
    },
    {
      "name": "claim_status_history_repository",
      "responsibility": "Persist immutable claim status history entries and provide ordered timelines per claim.",
      "implements": [
        "FS-007","FS-008","FS-016","FS-032"
      ]
    },
    {
      "name": "synthetic_data_generation_pipeline",
      "responsibility": "Generate and seed synthetic vehicle, dealer, claim, and status history data consistent with business rules.",
      "implements": [
        "FS-002","FS-005","FS-021","FS-022","FS-025","FS-027","FS-028","FS-029","FS-030","FS-031","FS-032","FS-033"
      ]
    },
    {
      "name": "observability_performance_layer",
      "responsibility": "Provide logging, metrics, and tracing for APIs and services; validate performance SLAs.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028","FS-029","FS-030","FS-031","FS-032","FS-033","FS-034","FS-035"
      ]
    },
    {
      "name": "security_access_control_layer",
      "responsibility": "Enforce synthetic-only data usage and read-only access to dashboard APIs.",
      "implements": [
        "FS-001","FS-002","FS-003","FS-004","FS-005","FS-006","FS-007","FS-008","FS-009","FS-010","FS-011","FS-012","FS-013","FS-014","FS-015","FS-016","FS-017","FS-018","FS-019","FS-020","FS-021","FS-022","FS-023","FS-024","FS-025","FS-026","FS-027","FS-028","FS-029","FS-030","FS-031","FS-032","FS-033","FS-034","FS-035"
      ]
    }
  ],
  "cross_cutting_concerns": [
    "Authentication and read-only authorization for all dashboard APIs.",
    "Data privacy via synthetic-only data and VIN masking.",
    "Consistent error handling and per-component UI error states.",
    "Logging, monitoring, and tracing for performance and reliability.",
    "Performance optimization to meet initial load and API latency SLAs.",
    "Responsive design and WCAG 2.1 AA accessibility, with cross-browser support.",
    "Centralized configuration for currency and distance units.",
    "Independent testability and documented API contracts."
  ],
  "narrative": "The warranty_claims_analysis_dashboard module is a read-only, web-based analytics solution that surfaces synthetic warranty claim data through a consolidated dashboard experience. The architecture is split into a responsive Web UI, an API Gateway exposing well-defined REST endpoints, a set of backend aggregation services that implement KPI, trend, breakdown, claims list, and claim detail logic, and a domain data layer backed by synthetic data. Global filters (model, model year, region, date range, status, component) are centrally defined and enforced, ensuring that KPI cards, charts, and claims lists remain synchronized. Business rules govern how claims are included in KPIs, how claim amounts are calculated, how approval rates and processing times are computed, and how overdue and eligibility flags are derived. Synthetic data generation ensures that all data respects privacy constraints and business semantics, while observability and performance tooling validate non-functional requirements such as latency and responsiveness. Security and access control layers guarantee that all dashboard interactions are read-only and synthetic-only, making the solution safe for demo and analytical use without connection to live warranty systems."
}
```
