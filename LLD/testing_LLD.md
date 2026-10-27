# 1. Application Overview

## 1.1 Purpose
The AI Portfolio Management Dashboard application provides a single-page, browser-based dashboard for enterprise users to monitor and benchmark AI usage and spend across their portfolio companies. It offers real-time visualization, drill-down analytics, budgeting alerts, data freshness monitoring, and exportable reports while enforcing role-based access control and audit logging.

## 1.2 Scope
This LLD defines the implementation specification for the SPA frontend application layer described in the HLD "AI Portfolio Management Dashboard - High Level Design" for the epic **testing**. It focuses on:
- Dashboard UI implementation.
- Integration with backend REST APIs (assumed existing microservices and API gateway as per HLD).
- Role-aware views and interactions.
- Alert visualization (but not alert generation logic; that resides in backend services).
- Reporting triggers (export commands) and their UI representation.
- Audit logging events triggered from the UI.

Backend microservices (Node.js/Java, PostgreSQL, Redis, API Gateway, SSO IdP, Vault, etc.) are **out of scope** for this LLD and are treated as existing REST APIs according to the contracts defined in section 15.

## 1.3 Audience
- Code Generation Agents.
- Frontend engineers.
- QA engineers.
- Security and compliance reviewers.

## 1.4 Business Requirements Coverage
This LLD directly maps to HLD requirements:
- Real-time dashboard for AI usage/spend across portfolio companies.
- Drill-down analytics per portfolio company and AI provider.
- Budget threshold alerts and data freshness alerts.
- Report export (PDF/Excel) for dashboards and analytics.
- Benchmarking analytics across companies and industry.
- Role-based access control with multiple roles (Enterprise Admin, Operating Partner, Deal Partner, General Partner).
- Audit logging of user actions.
- Accessibility to WCAG 2.1 AA level.

Where the HLD does not provide UI or API detail, this LLD explicitly flags missing information instead of making assumptions (see relevant sections).

---

# 2. Technology Stack

## 2.1 Frontend Technologies
- HTML5
- CSS3
- JavaScript ES6
- AngularJS 1.7.9
- Angular Route 1.7.9
- Angular Animate 1.7.9
- Angular Sanitize 1.7.9
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS only)
- Chart.js 2.9.4

## 2.2 Browser Support
- Google Chrome (latest stable)
- Microsoft Edge (latest stable)

## 2.3 Constraints
- No framework upgrades or replacements.
- No additional frontend frameworks (e.g., React) shall be introduced.
- jQuery and `bootstrap.min.js` shall not be included unless explicitly required. The HLD does not require them, therefore they are excluded.

---

# 3. Architecture Design

## 3.1 Architectural Style
- Single Page Application (SPA) using AngularJS 1.7.9.
- AngularJS MVC architectural pattern.
- IIFE (Immediately Invoked Function Expression) module pattern.
- Dependency Injection for services, controllers, directives, and filters.

## 3.2 Logical Layers
- **Presentation Layer** (Controllers, Templates, Directives):
  - Portfolio overview dashboard.
  - Company detail view.
  - Benchmarking view.
  - Alerts panel.
  - Report export modal.
- **Business Logic Layer** (Services, Factories):
  - DashboardService: orchestrates retrieval of aggregated data.
  - CompanyService: provides data for individual portfolio companies.
  - BenchmarkService: provides benchmarking data.
  - AlertService: retrieves alert data from backend.
  - ReportService: triggers report generation/export.
  - AuthService: handles session/role information from backend.
  - ConfigService (or configuration access wrapper) for ENV_CONFIG usage.
  - LoggingService: unified logging.
  - Mock services for all above when mock mode is enabled.
- **Data Layer (Frontend)**:
  - Models representing User, PortfolioCompany, AIProvider, Report, Alert, AuditLog.
  - View models maintained by controllers for specific screens.

## 3.3 Component Interaction Overview
- Controllers interact only with Services and update ViewModels.
- Services call REST APIs (or mock implementations) and map responses into Models.
- Directives encapsulate reusable visual components such as KPI cards, alert lists, charts, and tables.
- Filters provide presentation formatting (e.g., currency, date, percentage).

## 3.4 External Dependencies
- REST API Gateway for backend microservices.
- SSO/Authentication endpoints.
- Reporting export endpoints.

All such dependencies are mediated through REST contracts defined in section 15.

---

# 4. Repository Structure

The repository structure for this epic conforms to the mandatory standard.

```text
src/
  app/
    controllers/
      dashboard.controller.js
      company-detail.controller.js
      benchmarking.controller.js
      alerts.controller.js
      reports.controller.js
      auth.controller.js
    services/
      dashboard.service.js
      company.service.js
      benchmarking.service.js
      alert.service.js
      report.service.js
      auth.service.js
      logging.service.js
      config.service.js
    factories/
      model-factory.js
    directives/
      kpi-card.directive.js
      alert-list.directive.js
      company-table.directive.js
      chart-panel.directive.js
    filters/
      currency-format.filter.js
      date-format.filter.js
      percentage.filter.js
      status-label.filter.js
    models/
      user.model.js
      portfolio-company.model.js
      ai-provider.model.js
      report.model.js
      alert.model.js
      audit-log.model.js
    config/
      env.default.json
      env.dev.json
      env.prod.json
      config.constants.js
      app.config.js
      app.run.js
    routes/
      app.routes.js
  templates/
    dashboard/
      dashboard.html
      benchmarking.html
      company-detail.html
    alerts/
      alerts-panel.html
    reports/
      reports-modal.html
    auth/
      login.html
  assets/
    css/
      main.css
      dashboard.css
      tables.css
      charts.css
    js/
      polyfills.js
    images/
      logo.png
      icons.png
    fonts/
      (No specific fonts mandated; to be defined when brand guidelines are provided.)
  mock/
    dashboard.mock.js
    company.mock.js
    benchmarking.mock.js
    alert.mock.js
    report.mock.js
    auth.mock.js
  data/
    sample-dashboard.json
    sample-company.json
    sample-benchmarking.json
    sample-alerts.json
    sample-reports.json
index.html
README.md
```

For each file, detailed specification is provided in later sections. No placeholder files are defined; all listed files are required for implementing the described functionality.

---

# 5. Application Bootstrap Design

## 5.1 Root Angular Module
- Module Name: `apmApp`
- Declaration File: `src/app/config/app.config.js`
- Angular Registration:
  - Exactly one module declaration:
    - `angular.module("apmApp", ["ngRoute", "ngAnimate", "ngSanitize", "ui.bootstrap", "chart.js"])`

## 5.2 Config Blocks
- File: `src/app/config/app.config.js`
- Responsibilities:
  - Configure routes (delegated to `app.routes.js`).
  - Configure Chart.js defaults (colours, legend display, responsiveness) according to UX requirements.
  - Configure `$httpProvider` interceptors for authentication and error handling (see Security and Error Handling sections).

## 5.3 Run Blocks
- File: `src/app/config/app.run.js`
- Responsibilities:
  - Initialize application-wide state (e.g., initial AuthService check for session, loading ENV_CONFIG).
  - Register global event listeners (e.g., `$rootScope.$on("$routeChangeStart")`) for route access control.
  - Log application startup event using LoggingService.

## 5.4 Bootstrap Sequence
- `index.html` loads: CSS (Bootstrap, main.css, others) → AngularJS and libraries → application scripts (config, routes, services, controllers, directives, filters).
- `ng-app="apmApp"` on `<html>` or `<body>` as specified in section 6.

---

# 6. Module Design

## 6.1 Angular Module
- Name: `apmApp`
- Type: Root AngularJS module.
- Dependencies:
  - `ngRoute`
  - `ngAnimate`
  - `ngSanitize`
  - `ui.bootstrap`
  - `chart.js`
- Responsibility:
  - Coordinate registration of all controllers, services, directives, filters, and configuration.

No additional feature modules are defined in the HLD. Splitting into feature modules is possible but not specified; therefore only a single root module is defined, and the lack of feature module requirements is noted as a missing detail.

Missing Detail (no assumption made):
- Whether separate AngularJS modules per feature (e.g., `apm.dashboard`, `apm.alerts`) are required is not specified in the HLD. This LLD keeps a single root module as required minimum.

---

# 7. Routing Design

## 7.1 Route Configuration File
- File: `src/app/routes/app.routes.js`
- Angular Registration:
  - Uses `angular.module("apmApp")`.
  - Injects `$routeProvider`, `$locationProvider`.

## 7.2 Routes

1. **Dashboard Overview Route**
   - URL: `/dashboard`
   - TemplateUrl: `templates/dashboard/dashboard.html`
   - Controller: `DashboardController`
   - ControllerAs: `vm`
   - Resolve:
     - `initialDashboardData`: calls `DashboardService.getInitialDashboard()`.

2. **Company Detail Route**
   - URL: `/companies/:companyId`
   - TemplateUrl: `templates/dashboard/company-detail.html`
   - Controller: `CompanyDetailController`
   - ControllerAs: `vm`
   - Resolve:
     - `companyData`: calls `CompanyService.getCompanyDetail(companyId)`.

3. **Benchmarking Route**
   - URL: `/benchmarking`
   - TemplateUrl: `templates/dashboard/benchmarking.html`
   - Controller: `BenchmarkingController`
   - ControllerAs: `vm`
   - Resolve:
     - `benchmarkData`: calls `BenchmarkService.getBenchmarkData()`.

4. **Alerts Route**
   - URL: `/alerts`
   - TemplateUrl: `templates/alerts/alerts-panel.html`
   - Controller: `AlertsController`
   - ControllerAs: `vm`
   - Resolve:
     - `alertsData`: calls `AlertService.getAllAlerts()`.

5. **Login Route**
   - URL: `/login`
   - TemplateUrl: `templates/auth/login.html`
   - Controller: `AuthController`
   - ControllerAs: `vm`
   - Resolve: none.

6. **Default Route**
   - Redirect: any unknown URL → `/dashboard`.

## 7.3 Route Access Control
- Access control is enforced in `app.run.js` via route change events:
  - On `$routeChangeStart`, AuthService validates user session and role.
  - If unauthenticated, redirect to `/login`.
  - Role-based visibility for certain routes (e.g., benchmarking may be restricted) is based on backend-provided role information.

Missing Detail:
- Exact route-to-role mapping (e.g., which roles can access benchmarking) is not explicitly defined in the HLD and must be specified by product/security owners.

---

# 8. Component Registry

The table below lists all AngularJS components.

## 8.1 Controllers
- `DashboardController` (controller) – `src/app/controllers/dashboard.controller.js`
- `CompanyDetailController` (controller) – `src/app/controllers/company-detail.controller.js`
- `BenchmarkingController` (controller) – `src/app/controllers/benchmarking.controller.js`
- `AlertsController` (controller) – `src/app/controllers/alerts.controller.js`
- `ReportsController` (controller) – `src/app/controllers/reports.controller.js`
- `AuthController` (controller) – `src/app/controllers/auth.controller.js`

## 8.2 Services
- `DashboardService` – `src/app/services/dashboard.service.js`
- `CompanyService` – `src/app/services/company.service.js`
- `BenchmarkService` – `src/app/services/benchmarking.service.js`
- `AlertService` – `src/app/services/alert.service.js`
- `ReportService` – `src/app/services/report.service.js`
- `AuthService` – `src/app/services/auth.service.js`
- `LoggingService` – `src/app/services/logging.service.js`
- `ConfigService` – `src/app/services/config.service.js`

## 8.3 Factories
- `ModelFactory` – `src/app/factories/model-factory.js` (responsible for constructing model instances)

## 8.4 Directives
- `kpiCard` – `src/app/directives/kpi-card.directive.js`
- `alertList` – `src/app/directives/alert-list.directive.js`
- `companyTable` – `src/app/directives/company-table.directive.js`
- `chartPanel` – `src/app/directives/chart-panel.directive.js`

## 8.5 Filters
- `currencyFormat` – `src/app/filters/currency-format.filter.js`
- `dateFormat` – `src/app/filters/date-format.filter.js`
- `percentage` – `src/app/filters/percentage.filter.js`
- `statusLabel` – `src/app/filters/status-label.filter.js`

## 8.6 Models
- `UserModel` – `src/app/models/user.model.js`
- `PortfolioCompanyModel` – `src/app/models/portfolio-company.model.js`
- `AIProviderModel` – `src/app/models/ai-provider.model.js`
- `ReportModel` – `src/app/models/report.model.js`
- `AlertModel` – `src/app/models/alert.model.js`
- `AuditLogModel` – `src/app/models/audit-log.model.js`

## 8.7 Constants/Config
- `ENV_CONFIG` – loaded from JSON files.
- `APP_CONSTANTS` – defined in `config.constants.js` for reusable constants such as date formats, chart colour palette, etc.

## 8.8 Interceptors
- `AuthInterceptor` – defined in `app.config.js` or a dedicated file (not listed separately in structure; to be added if required by security architecture). Missing detail from HLD: explicit naming and separation of interceptors.

Dependencies and consumers for each component are described in the respective design sections.

---

# 9. Controller Design

For all controllers:
- Use ControllerAs syntax with alias `vm`.
- Inject dependencies explicitly using array notation for minification safety.
- Controllers shall not contain business logic; they delegate to services.

## 9.1 DashboardController
- File: `src/app/controllers/dashboard.controller.js`
- Angular Registration: `angular.module("apmApp").controller("DashboardController", [...])`
- Dependencies:
  - `$scope` (only if necessary for events; prefer using `vm`)
  - `DashboardService`
  - `AlertService`
  - `ReportService`
  - `LoggingService`
- ViewModel Variables:
  - `vm.kpiSummary` – aggregated KPI metrics for portfolio.
  - `vm.filters` – selected filter values (date range, provider, role-specific views).
  - `vm.charts` – configuration for charts displayed on dashboard.
  - `vm.alertsSummary` – summary of active alerts (count by type).
  - `vm.loading` – boolean indicating loading state.
  - `vm.error` – error state object.
- Public Methods:
  - `vm.initialize()` – loads initial data (using resolved data).
  - `vm.refresh()` – reloads dashboard based on current filters.
  - `vm.onFilterChange()` – applied whenever filters change; triggers `refresh()`.
  - `vm.viewCompany(companyId)` – navigates to company detail view.
  - `vm.exportReport(type)` – triggers report export via ReportService (type: PDF/Excel).
  - `vm.retry()` – retries last failed operation.
- Inputs:
  - User actions: filter selections, export report requests, navigation clicks.
- Outputs:
  - Updates dashboard ViewModel data.
  - Invokes service calls.
  - Triggers navigation to `/companies/:companyId`.
  - Triggers notifications for success/error messages.
- Error Handling:
  - On service failure, sets `vm.error` with message and type.
  - Logs errors using LoggingService.
  - Provides retry capability via `vm.retry()`.

## 9.2 CompanyDetailController
- File: `src/app/controllers/company-detail.controller.js`
- Dependencies:
  - `$routeParams`
  - `CompanyService`
  - `AlertService`
  - `LoggingService`
- ViewModel:
  - `vm.company` – PortfolioCompanyModel instance.
  - `vm.aiUsage` – detailed AI usage metrics for the company.
  - `vm.budgetThresholds` – budget threshold configuration.
  - `vm.dataFreshness` – indicator of last data sync.
  - `vm.loading`, `vm.error` – state objects.
- Public Methods:
  - `vm.initialize()` – uses resolved `companyData` to populate view.
  - `vm.viewProvider(providerId)` – optional navigation to provider-level view; HLD does not specify a dedicated provider view, so this is flagged as missing detail.
  - `vm.viewAlerts()` – shows alerts related to the company.
  - `vm.retry()` – retry fetching data.

Missing Detail:
- Whether provider-specific detail screens exist is not specified; if required, a new route and template must be defined.

## 9.3 BenchmarkingController
- File: `src/app/controllers/benchmarking.controller.js`
- Dependencies:
  - `BenchmarkService`
  - `LoggingService`
- ViewModel:
  - `vm.benchmarkData` – cross-company benchmark metrics.
  - `vm.filters` – filter criteria for industry/region/segment (not specified in HLD; flagged as missing detail).
  - `vm.charts` – configurations for benchmarking charts.
  - `vm.loading`, `vm.error`.
- Public Methods:
  - `vm.initialize()` – uses resolved `benchmarkData`.
  - `vm.applyFilters()` – re-fetch data with filters.
  - `vm.exportBenchmarkReport(type)` – triggers ReportService.

## 9.4 AlertsController
- File: `src/app/controllers/alerts.controller.js`
- Dependencies:
  - `AlertService`
  - `LoggingService`
- ViewModel:
  - `vm.alerts` – list of alerts (AlertModel).
  - `vm.filters` – alert type (budget, data freshness), severity, status.
  - `vm.loading`, `vm.error`.
- Public Methods:
  - `vm.initialize()` – uses resolved `alertsData`.
  - `vm.applyFilters()` – filter alerts locally or via service (decision based on backend capabilities; not specified in HLD).
  - `vm.acknowledge(alertId)` – mark alert as acknowledged (if supported by backend).
  - `vm.retry()` – retry fetching alerts.

Missing Detail:
- Whether alerts can be acknowledged or only viewed is not explicit in HLD.

## 9.5 ReportsController
- File: `src/app/controllers/reports.controller.js`
- Responsibilities:
  - Manage report export modal/dialog.
- Dependencies:
  - `ReportService`
  - `LoggingService`
- ViewModel:
  - `vm.availableReports` – list of report types.
  - `vm.selectedReportType`.
  - `vm.inProgress` – export in progress flag.
  - `vm.error`.
- Public Methods:
  - `vm.export()` – triggers ReportService.
  - `vm.cancel()` – closes modal.

## 9.6 AuthController
- File: `src/app/controllers/auth.controller.js`
- Dependencies:
  - `AuthService`
  - `LoggingService`
- ViewModel:
  - `vm.username`, `vm.password` – if username/password fallback is provided by backend; HLD references SSO, not username/password.
  - `vm.ssoProviders` – list of SSO providers if applicable (missing detail; depends on enterprise setup).
  - `vm.loading`, `vm.error`.
- Public Methods:
  - `vm.loginWithSSO(provider)` – triggers AuthService SSO flow.
  - `vm.logout()` – triggers AuthService logout.

Missing Detail:
- Exact SSO flow (redirect URLs, tokens) is backend-defined and not covered here.

---

# 10. Service Design

## 10.1 DashboardService
- File: `src/app/services/dashboard.service.js`
- Purpose: Retrieve and aggregate dashboard data for portfolio overview.
- Dependencies:
  - `$http`
  - `ConfigService`
  - `LoggingService`
- Public Methods:
  - `getInitialDashboard()`
    - Parameters: none.
    - Returns: Promise resolving to DashboardModel (composed from multiple models; not defined as a separate file to avoid duplication).
  - `getDashboard(filters)`
    - Parameters: filter object (date range, provider, etc.).
    - Returns: Promise.
- Private Methods:
  - `buildDashboardRequest(filters)` – constructs query params.
  - `mapDashboardResponse(response)` – validates and maps API response.
  - `validateResponse(response)` – ensures contract adherence.
- REST Endpoints Used:
  - `/api/dashboard/overview` (see REST API Contract section; actual path names are missing from HLD, flagged as assumption point; final path to be confirmed).

## 10.2 CompanyService
- File: `src/app/services/company.service.js`
- Purpose: Fetch detailed data for a portfolio company.
- Dependencies:
  - `$http`
  - `ConfigService`
  - `LoggingService`
- Public Methods:
  - `getCompanyDetail(companyId)` – Returns Promise<PortfolioCompanyModel>.
  - `getCompanyUsage(companyId)` – Returns Promise of AI usage breakdown.
- REST Endpoints:
  - `/api/companies/{companyId}` (exact path to be confirmed).

## 10.3 BenchmarkService
- File: `src/app/services/benchmarking.service.js`
- Purpose: Provide benchmarking analytics.
- Dependencies:
  - `$http`
  - `ConfigService`
  - `LoggingService`
- Public Methods:
  - `getBenchmarkData(filters)` – Returns Promise of benchmark model.
- REST Endpoints:
  - `/api/benchmarking` (exact path to be confirmed).

## 10.4 AlertService
- File: `src/app/services/alert.service.js`
- Purpose: Retrieve alerts and optionally update alert status.
- Dependencies:
  - `$http`
  - `ConfigService`
  - `LoggingService`
- Public Methods:
  - `getAllAlerts(filters)` – Returns Promise<AlertModel[]>.
  - `acknowledgeAlert(alertId)` – if supported by backend (missing detail).
- REST Endpoints:
  - `/api/alerts`.

## 10.5 ReportService
- File: `src/app/services/report.service.js`
- Purpose: Trigger report generation and export.
- Dependencies:
  - `$http`
  - `ConfigService`
  - `LoggingService`
- Public Methods:
  - `exportDashboardReport(format, filters)` – format: PDF or Excel.
  - `exportCompanyReport(companyId, format)`.
  - `exportBenchmarkReport(format, filters)`.
- REST Endpoints:
  - `/api/reports/dashboard`.
  - `/api/reports/company/{companyId}`.
  - `/api/reports/benchmarking`.

## 10.6 AuthService
- File: `src/app/services/auth.service.js`
- Purpose: Manage authentication state and role information.
- Dependencies:
  - `$http`
  - `$window`
  - `$q`
  - `ConfigService`
  - `LoggingService`
- Public Methods:
  - `getCurrentUser()` – returns UserModel or null.
  - `isAuthenticated()` – returns boolean.
  - `hasRole(role)` – returns boolean.
  - `loginWithSSO(provider)` – triggers redirect or window navigation.
  - `logout()` – clear session and redirect to login.

## 10.7 LoggingService
- File: `src/app/services/logging.service.js`
- Purpose: Centralize logging.
- Dependencies:
  - `$log`
  - Optional `$http` if backend logging endpoint exists (missing detail).
- Public Methods:
  - `info(message, context)`
  - `warn(message, context)`
  - `error(message, context)`
  - `audit(event, context)` – logs audit events.

## 10.8 ConfigService
- File: `src/app/services/config.service.js`
- Purpose: Provide access to ENV_CONFIG and constants.
- Dependencies:
  - `$http`
  - `$q`
- Public Methods:
  - `loadEnvConfig()` – loads environment configuration from JSON.
  - `get(key)` – returns configuration property.

---

# 11. Factory Design

## 11.1 ModelFactory
- File: `src/app/factories/model-factory.js`
- Purpose: Create instances of models (UserModel, PortfolioCompanyModel, etc.) from raw API responses.
- Dependencies:
  - None (pure factory) or the model constructors.
- Public Methods:
  - `createUser(raw)` → UserModel.
  - `createPortfolioCompany(raw)` → PortfolioCompanyModel.
  - `createAIProvider(raw)` → AIProviderModel.
  - `createReport(raw)` → ReportModel.
  - `createAlert(raw)` → AlertModel.
  - `createAuditLog(raw)` → AuditLogModel.

---

# 12. Directive Design

## 12.1 kpiCard Directive
- File: `src/app/directives/kpi-card.directive.js`
- Restrict: `E`
- Scope: Isolated.
- Bindings:
  - `title` (`@`): KPI label.
  - `value` (`<`): KPI value.
  - `icon` (`@`): icon identifier (CSS class or sprite reference).
  - `tooltip` (`@`): description.
- BindToController: true.
- Controller: `KpiCardController` (internal to directive).
- ControllerAs: `vm`.
- TemplateUrl: `templates/dashboard/kpi-card.html` (not listed in structure; must be added or directive template must be embedded; missing in initial structure listing and needs explicit template file path. To keep repository list consistent, add `templates/dashboard/kpi-card.html`).
- Replace: false.
- Transclude: false.
- Dependencies:
  - None specific.
- Usage Example:
  - `<kpi-card title="Total AI Spend" value="vm.kpiSummary.totalSpend" icon="icon-spend" tooltip="Total AI spend across portfolio"></kpi-card>`

## 12.2 alertList Directive
- File: `src/app/directives/alert-list.directive.js`
- Restrict: `E`
- Scope: Isolated.
- Bindings:
  - `alerts` (`<`) – list of AlertModel.
  - `onAcknowledge` (`&`) – callback when alert is acknowledged.
- TemplateUrl: `templates/alerts/alert-list.html` (needs to be added to templates structure).
- Controller: `AlertListController` (internal).
- ControllerAs: `vm`.
- Replace: false.
- Transclude: false.
- Usage Example:
  - `<alert-list alerts="vm.alerts" on-acknowledge="vm.acknowledge(alertId)"></alert-list>`

## 12.3 companyTable Directive
- File: `src/app/directives/company-table.directive.js`
- Restrict: `E`
- Scope: Isolated.
- Bindings:
  - `companies` (`<`): array of PortfolioCompanyModel.
  - `onSelect` (`&`): callback when row is clicked.
- TemplateUrl: `templates/dashboard/company-table.html`.
- Controller: `CompanyTableController` (internal).
- ControllerAs: `vm`.
- Replace: false.
- Transclude: false.
- Usage Example:
  - `<company-table companies="vm.portfolioCompanies" on-select="vm.viewCompany(companyId)"></company-table>`

## 12.4 chartPanel Directive
- File: `src/app/directives/chart-panel.directive.js`
- Restrict: `E`
- Scope: Isolated.
- Bindings:
  - `config` (`<`) – Chart.js configuration object.
  - `title` (`@`) – chart title.
- TemplateUrl: `templates/dashboard/chart-panel.html`.
- Controller: `ChartPanelController` (internal).
- ControllerAs: `vm`.
- Replace: false.
- Transclude: false.
- Usage Example:
  - `<chart-panel config="vm.charts.aiSpendByProvider" title="AI Spend by Provider"></chart-panel>`

---

# 13. Filter Design

## 13.1 currencyFormat Filter
- File: `src/app/filters/currency-format.filter.js`
- Purpose: Format numeric values as currency based on configured currency format (from ENV_CONFIG).
- Input Type: Number.
- Output Type: String.

## 13.2 dateFormat Filter
- File: `src/app/filters/date-format.filter.js`
- Purpose: Format dates using configured date format.
- Input Type: Date or string.
- Output Type: String.

## 13.3 percentage Filter
- File: `src/app/filters/percentage.filter.js`
- Purpose: Format ratios as percentage.
- Input Type: Number.
- Output Type: String.

## 13.4 statusLabel Filter
- File: `src/app/filters/status-label.filter.js`
- Purpose: Convert status enum values to user-friendly labels.
- Input Type: String (enum).
- Output Type: String.

---

# 14. Model Design

Models correspond directly to HLD entities.

## 14.1 UserModel
- File: `src/app/models/user.model.js`
- Purpose: Represent an authenticated user.
- Properties:
  - `userId` (UUID, required)
  - `name` (String, required)
  - `email` (String, required)
  - `role` (Enum: EnterpriseAdmin, OperatingPartner, DealPartner, GeneralPartner; required)
  - `status` (Enum: Active, Inactive, Locked; required)
  - `lastLogin` (Date, nullable)
- Validation:
  - `email` must match standard email format.
  - `role` must be one of defined enums.
- Sample JSON:
  - `{ "userId": "UUID", "name": "Alice", "email": "alice@example.com", "role": "EnterpriseAdmin", "status": "Active", "lastLogin": "2026-01-01T12:00:00Z" }`

## 14.2 PortfolioCompanyModel
- File: `src/app/models/portfolio-company.model.js`
- Properties:
  - `companyId` (UUID, required)
  - `name` (String, required)
  - `aiUsage` (Array of usage metrics; structure not specified in HLD, flagged as missing detail.)
  - `budgetThreshold` (Number or structured object; missing detailed structure.)
  - `dataFreshness` (Date or indicator of last update.)
- Sample JSON:
  - `{ "companyId": "UUID", "name": "Company A" }` (full AI usage structure TBD).

## 14.3 AIProviderModel
- File: `src/app/models/ai-provider.model.js`
- Properties:
  - `providerId` (UUID)
  - `name` (String, e.g., AWS, Azure, GCP)
  - `apiEndpoint` (URL)
  - `integrationStatus` (Enum; values not provided in HLD; needs definition.)

## 14.4 ReportModel
- File: `src/app/models/report.model.js`
- Properties:
  - `reportId` (UUID)
  - `companyId` (UUID, optional for company-specific reports)
  - `generatedBy` (UUID userId)
  - `type` (Enum: PDF, Excel)
  - `createdAt` (Date)

## 14.5 AlertModel
- File: `src/app/models/alert.model.js`
- Properties:
  - `alertId` (UUID)
  - `companyId` (UUID)
  - `triggeredBy` (String, e.g., budgetThreshold or dataFreshness)
  - `type` (Enum; budget_threshold, data_freshness, etc.)
  - `createdAt` (Date)
  - `severity` (Enum; not specified in HLD; needs definition.)
  - `status` (Enum: Open, Acknowledged, Resolved; not specified in HLD.)

## 14.6 AuditLogModel
- File: `src/app/models/audit-log.model.js`
- Properties:
  - `logId` (UUID)
  - `userId` (UUID)
  - `action` (String)
  - `timestamp` (Date)
  - `status` (Enum: Success, Failure; not specified in HLD.)

---

# 15. REST API Contract

The backend is described only at a high level in the HLD. Exact endpoint URLs, query parameters, and error structures are not specified. The following contracts are **placeholders** indicating required contracts; actual details must be provided by backend architects.

## 15.1 Dashboard Overview API
- Endpoint Name: `GetDashboardOverview`
- URL: `/api/dashboard/overview`
- HTTP Method: GET
- Headers:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- Authentication: Required (SSO token).
- Query Parameters:
  - `dateRange` (string, e.g., `last_30_days`)
  - `provider` (string, optional)
- Request Body: None.
- Success Response:
  - Status 200.
  - Body: JSON representing dashboard KPIs and charts. Exact structure not provided in HLD; must align with frontend models.
- Error Response:
  - 400, 401, 403, 404, 408, 500 with error payload structure TBD.
- Timeout, Retry, Cache Behaviour:
  - `apiTimeoutMs` from configuration.
  - Retry handled in service logic (e.g., limited attempts). Details not provided in HLD.

## 15.2 Company Detail API
- Endpoint Name: `GetCompanyDetail`
- URL: `/api/companies/{companyId}`
- HTTP Method: GET
- Query/Path Parameters:
  - `companyId` – UUID.

## 15.3 Benchmarking API
- Endpoint Name: `GetBenchmarkData`
- URL: `/api/benchmarking`

## 15.4 Alerts API
- Endpoint Name: `GetAlerts`
- URL: `/api/alerts`

## 15.5 Reports API
- Endpoint Name: `ExportReport`
- URLs:
  - `/api/reports/dashboard`
  - `/api/reports/company/{companyId}`
  - `/api/reports/benchmarking`

## 15.6 Auth APIs
- SSO endpoints (login, logout) are backend-defined; only the need for them is specified here.

All endpoints must support TLS 1.3, strict input validation, and output filtering as per HLD.

---

# 16. Configuration Design

## 16.1 ENV_CONFIG
- Represented as JSON files per environment.
- Properties:
  - `apiBaseUrl` (string; base URL for REST APIs)
  - `apiTimeoutMs` (number; default timeout)
  - `maxLookbackMonths` (number; max months for date filters)
  - `useMockData` (boolean; toggle between mock and real APIs)
  - `featureFlags` (object; for enabling/disabling features such as benchmarking)
  - `telemetry` (object; flags for logging and analytics)
- Files:
  - `env.default.json` – baseline configuration.
  - `env.dev.json` – development.
  - `env.prod.json` – production.

## 16.2 config.constants.js
- Defines `APP_CONSTANTS`:
  - Default date formats.
  - Chart colour palette.
  - Currency symbol (if defined; missing detail from HLD, must be provided).

## 16.3 No Hardcoded Config
- Controllers and services must access configuration via ConfigService or constants; no direct hardcoded URLs or timeouts.

---

# 17. Mock Implementation Design

For each REST endpoint, a corresponding mock file exists.

## 17.1 dashboard.mock.js
- Simulates `/api/dashboard/overview` responses.
- Uses `$q` and `$timeout`.
- Scenarios:
  - Success: response with sample-dashboard.json.
  - Failure: error codes like 500.
  - Timeout: simulates delayed response.

## 17.2 company.mock.js
- Simulates company detail endpoints.

## 17.3 benchmarking.mock.js
- Simulates benchmarking data.

## 17.4 alert.mock.js
- Simulates alert list retrieval and alert status changes.

## 17.5 report.mock.js
- Simulates report export by returning URLs or file tokens.

## 17.6 auth.mock.js
- Simulates authentication flows.

All mock responses must match production models and status codes exactly.

---

# 18. UI Specification

## 18.1 Overall Layout
- Header → Navigation → Main Content → Footer.
- Bootstrap 3 grid with `.container` and `.row`.

## 18.2 Dashboard Page (dashboard.html)
- Page Title: "AI Portfolio Management Dashboard".
- Sections (top-down):
  1. KPI Summary row using `kpiCard` directives.
  2. Filters section (date range, provider dropdown, company search).
  3. Charts section with Chart.js:
     - Bar chart for AI spend by provider.
     - Line chart for spend over time.
  4. Portfolio Companies table using `companyTable` directive.
  5. Alerts summary panel (may link to alerts route).
- Loading state: overlay with spinner and "Loading dashboard...".
- Empty state: message: "No AI portfolio data available.".
- Error state: message: "Unable to load dashboard." with Retry button.

## 18.3 Company Detail Page
- Title: Company name.
- Sections:
  - KPI cards for company-specific metrics.
  - Data freshness indicator (time since last sync).
  - Charts for AI usage.
  - Alert list specific to company.

## 18.4 Benchmarking Page
- Title: "Benchmarking Analytics".
- Charts comparing AI adoption and spend across companies and industry benchmarks.

## 18.5 Alerts Page
- List of alerts with filters.

## 18.6 Reports Modal
- Modal window with options to export PDF or Excel.

## 18.7 Accessibility
- All controls keyboard accessible.
- ARIA labels for charts and key elements.

Missing Detail:
- Exact colour palette and typography are not defined; requires UX input.

---

# 19. Data Flow

## 19.1 Dashboard Success Flow
User opens `/dashboard` → DashboardController initialize → DashboardService.getInitialDashboard → REST API → Response mapped to models → ViewModel updated → KPI cards and charts render.

## 19.2 Dashboard Failure Flow
API failure → DashboardService validates response → LoggingService logs error → DashboardController sets error state → User sees error message → Retry option available.

Similar flows apply to company detail, benchmarking, alerts, and report export features.

---

# 20. Business Rules

Business rules are specified only at a high level in the HLD (e.g., budget thresholds, data freshness). The HLD does not provide concrete numeric thresholds or rules; these must be defined by product owners.

- BR-1: Budget Threshold Alert – An alert is generated when AI spend exceeds configured budget thresholds per company. Threshold values and calculation rules are backend responsibilities.
- BR-2: Data Freshness Alert – An alert is generated when data has not been refreshed within configured time window.
- BR-3: Role-based Access – Different roles see different subsets of data and features.

This LLD does not invent missing numeric rules; it documents the need for them.

---

# 21. Validation Rules

Validation is required for:
- Filter inputs (date ranges, provider selection).
- Export parameters (format type).
- Route parameters (companyId, etc.).

Exact validation rules (min/max date range, allowed formats) are not specified in HLD and must be provided.

---

# 22. Error Handling

Every service and controller must handle:
- Validation errors.
- Business errors (e.g., access denied).
- Network errors.
- Timeouts.
- Unexpected errors.

ErrorModel (structure not specified in HLD; must be provided by backend).

---

# 23. Logging Design

All errors and significant events are logged using LoggingService. This includes:
- Dashboard load successes and failures.
- Company detail access.
- Report export attempts and outcomes.
- Authentication events.

Audit logs correspond to AuditLogModel and are typically backend responsibilities; the frontend triggers audit events by calling backend endpoints.

---

# 24. Security Design

Security features from HLD include:
- SSO authentication.
- Role-based access.
- Input validation and output filtering.
- Encryption TLS 1.3 (backend level).
- Audit logging.

Frontend responsibilities:
- Never display sensitive information unnecessarily.
- Avoid logging sensitive data.
- Honour role-based restrictions in navigation and UI visibility.

---

# 25. Dependency Map

Each file documents its dependencies as described in sections 9–13 and 16–17.

---

# 26. LLD Validation Checklist

This LLD:
- Follows the HLD requirements without introducing new business functionality.
- Defines all components, dependencies, configurations, APIs, models, UI components, validation, error handling, logging, and security hooks where information is available.
- Flags missing required details instead of making assumptions.
- Uses mandated technology stack and architecture standards.
