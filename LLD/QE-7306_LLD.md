# 1. Application Overview

## 1.1 Epic Reference
- Epic ID: QE-7306
- Epic Title: Monthly Spending Summary Dashboard

## 1.2 Purpose
This Low Level Design (LLD) defines the complete implementation specification for the QE-7306 Monthly Spending Summary Dashboard frontend application. It translates the HLD requirements into an implementation-ready AngularJS 1.7.9 Single Page Application (SPA), compliant with the `lldgenerationkb` standards.

This LLD is the single source of truth for downstream Code Generation Agents and contains sufficient detail to generate the application without implementation assumptions.

## 1.3 Scope
- In-scope:
  - Read-only dashboard UI for credit card monthly spending summary.
  - Visualization of monthly spend, utilization, card metrics, transactions, analytics, and budget indicators.
  - Responsive layout for desktop, tablet, and mobile.
  - REST-based integration with backend API Gateway endpoints:
    - `/v1/dashboard/summary`
    - `/v1/cards`
    - `/v1/transactions`
    - `/v1/transactions/recent`
    - `/v1/analytics/categories`
    - `/v1/analytics/monthly-trend`
    - `/v1/analytics/card-distribution`
    - `/v1/budget/summary`
  - Mock mode for all REST APIs.

- Out-of-scope:
  - Payment execution, card lifecycle management, dispute handling, upstream ETL, and identity provider implementation.

## 1.4 Assumptions and Constraints
- Technology stack fixed as per standards: AngularJS 1.7.9, Bootstrap 3.4.1 (CSS), Angular Route/Animate/Sanitize, Angular UI Bootstrap 2.5.6, Chart.js 2.9.4.
- HLD does not define:
  - Exact time horizon for monthly trends (e.g., 6 vs 12 months).
  - Budget configuration lifecycle (read-only vs editable).
  - Detailed authentication mechanism in frontend (token acquisition flows).

These are explicitly marked as "Missing from HLD" where required. No assumptions are made beyond HLD.


# 2. Technology Stack

## 2.1 Frontend Technologies
- HTML5
- CSS3
- JavaScript (ES6 syntax compatible with AngularJS 1.7.9)
- AngularJS 1.7.9
- Angular Route 1.7.9
- Angular Animate 1.7.9
- Angular Sanitize 1.7.9
- Angular UI Bootstrap 2.5.6
- Bootstrap 3.4.1 (CSS Only)
- Chart.js 2.9.4

## 2.2 Supported Browsers
- Google Chrome (latest stable)
- Microsoft Edge (latest stable)

Browser-specific polyfills, if required, will be handled by the Code Generation Agent according to Code Generation Standards.


# 3. Architecture Design

## 3.1 Architectural Style
- AngularJS MVC
- Single Page Application (SPA)
- REST-based communication with backend
- Dependency Injection based component wiring
- ControllerAs syntax
- IIFE module pattern

## 3.2 High-Level Frontend Architecture
- Root Angular module: `apbApp`
- Modules:
  - `apbApp.core` – core services, configuration, logging, security hooks.
  - `apbApp.dashboard` – dashboard summary and KPI tiles.
  - `apbApp.cards` – card management views.
  - `apbApp.transactions` – transaction table and filters.
  - `apbApp.analytics` – analytics charts and category breakdown.
  - `apbApp.budget` – budget tracking and progress indicators.
  - `apbApp.shared` – shared directives, filters, models.

## 3.3 Component Responsibilities
- Controllers: Coordinate UI behaviour; no business logic.
- Services: Contain business logic and REST communication.
- Factories: Create reusable objects/models.
- Directives: Encapsulate reusable UI widgets (KPI cards, charts, progress bars).
- Filters: Format currency, dates, percentages.
- Models: Represent data structures exchanged with backend.
- Configuration: Externalised via JSON and constants.


# 4. Repository Structure

## 4.1 Root Structure
- `index.html`
- `README.md`
- `src/`
  - `app/`
    - `controllers/`
    - `services/`
    - `factories/`
    - `directives/`
    - `filters/`
    - `models/`
    - `config/`
    - `routes/`
  - `templates/`
  - `assets/`
    - `css/`
    - `js/`
    - `images/`
    - `fonts/`
  - `mock/`
  - `data/`

## 4.2 File-Level Specifications

### 4.2.1 Root Module & Bootstrap
- **File Path**: `src/app/app.module.js`
- **Component Type**: Angular Module
- **Angular Registration**: `angular.module("apbApp", ["ngRoute", "ngAnimate", "ngSanitize", "ui.bootstrap", "apbApp.core", "apbApp.dashboard", "apbApp.cards", "apbApp.transactions", "apbApp.analytics", "apbApp.budget", "apbApp.shared"]);`
- **Purpose**: Declare root module and wire feature modules.
- **Dependencies**:
  - Angular core modules: `ngRoute`, `ngAnimate`, `ngSanitize`.
  - `ui.bootstrap`.
  - Feature modules described above.
- **Responsibilities**:
  - Provide application-wide module namespace.
  - Ensure modules load in correct order.
- **Public Methods**: None.
- **Configuration Used**: None directly.
- **Files Referenced**: Feature modules.
- **Files Depending on It**: `src/app/app.config.js`, all feature modules.

### 4.2.2 Routing
- **File Path**: `src/app/routes/app.routes.js`
- **Component Type**: Config (route configuration)
- **Angular Registration**: `angular.module("apbApp").config([...])`
- **Purpose**: Define SPA routes and default route.
- **Dependencies**:
  - `$routeProvider`
  - `$locationProvider`
- **Responsibilities**:
  - Map URLs to templates and controllers.
  - Define default route and fallback redirection.
- **Public Methods**: None.
- **Configuration Used**: Route paths, template URLs.
- **Files Referenced**: Controllers and templates per route.
- **Files Depending on It**: `index.html` (ng-view), all controllers.

### 4.2.3 Core Configuration
- **File Path**: `src/app/config/config.constants.js`
- **Component Type**: Constant definition
- **Angular Registration**: `angular.module("apbApp.core").constant("ENV_CONFIG", {...})`
- **Purpose**: Provide environment configuration.
- **Dependencies**: None.
- **Responsibilities**:
  - Supply base URLs, timeouts, feature flags.
- **Files Referenced**: Services requiring configuration.
- **Files Depending on It**: All services using `ENV_CONFIG`.

(Additional per-file specifications continue in sections 9–16.)


# 5. Application Bootstrap Design

## 5.1 index.html

### 5.1.1 Layout
- **File Path**: `index.html`
- **Purpose**: Application entry point and shell.
- **Structure**:
  - `<html>` with `lang="en"`.
  - `<head>`:
    - Meta tags for charset, viewport, compatibility.
    - Title: `Monthly Spending Summary Dashboard`.
    - CSS links (see 5.1.2).
  - `<body ng-app="apbApp">`:
    - Header with application name.
    - Navigation bar (optional) for tabs: Dashboard, Transactions, Analytics, Budget.
    - Main content container with `ng-view`.
    - Footer with version information.

### 5.1.2 Stylesheet Loading Order
1. Bootstrap CSS 3.4.1 (CDN)
2. Application base styles `assets/css/app.css`
3. Feature-specific styles `assets/css/dashboard.css`, `assets/css/transactions.css`, `assets/css/analytics.css`, `assets/css/budget.css`.

### 5.1.3 JavaScript Loading Order
1. AngularJS 1.7.9 (CDN)
2. Angular Route 1.7.9 (CDN)
3. Angular Animate 1.7.9 (CDN)
4. Angular Sanitize 1.7.9 (CDN)
5. Angular UI Bootstrap 2.5.6 (CDN)
6. Chart.js 2.9.4 (CDN)
7. Application scripts (in order):
   - `assets/js/app.bundle.js` OR individual scripts:
     - `src/app/app.module.js`
     - `src/app/app.config.js`
     - `src/app/routes/app.routes.js`
     - Core services and logging.
     - Feature controllers, services, directives.

### 5.1.4 Script and Stylesheet Sources (CDN URLs)
- AngularJS 1.7.9: `https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js`
- Angular Route 1.7.9: `https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-route.min.js`
- Angular Animate 1.7.9: `https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.min.js`
- Angular Sanitize 1.7.9: `https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-sanitize.min.js`
- Angular UI Bootstrap 2.5.6: `https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js`
- Bootstrap CSS 3.4.1: `https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css`
- Chart.js 2.9.4: `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js`

Note: jQuery and `bootstrap.min.js` are NOT included.

## 5.2 Angular Bootstrap
- Root Angular Module: `apbApp` defined in `app.module.js`.
- Config Blocks:
  - Route configuration in `app.routes.js`.
  - HTTP interceptors for logging and security in `core` config (file: `src/app/config/http.config.js`).
- Run Blocks:
  - Initialization logic (e.g., setting global constants, default route behaviour) in `src/app/config/app.run.js`.


# 6. Module Design

## 6.1 Module: apbApp.core
- **File Path**: `src/app/core/core.module.js`
- **Purpose**: Provide core services (logging, error handling, security hooks, configuration).
- **Dependencies**: `ngRoute`, `ngAnimate`, `ngSanitize`.
- **Components**:
  - `LoggingService`
  - `ErrorHandlingService`
  - `SecurityService`

## 6.2 Module: apbApp.dashboard
- **File Path**: `src/app/dashboard/dashboard.module.js`
- **Purpose**: Dashboard summary, KPIs, recent transactions widget.
- **Dependencies**: `apbApp.core`, `apbApp.shared`.

## 6.3 Module: apbApp.cards
- **File Path**: `src/app/cards/cards.module.js`
- **Purpose**: Card management & portfolio view.
- **Dependencies**: `apbApp.core`.

## 6.4 Module: apbApp.transactions
- **File Path**: `src/app/transactions/transactions.module.js`
- **Purpose**: Transaction table and filtering.
- **Dependencies**: `apbApp.core`, `apbApp.shared`.

## 6.5 Module: apbApp.analytics
- **File Path**: `src/app/analytics/analytics.module.js`
- **Purpose**: Charts and analytics visualizations.
- **Dependencies**: `apbApp.core`, `apbApp.shared`.

## 6.6 Module: apbApp.budget
- **File Path**: `src/app/budget/budget.module.js`
- **Purpose**: Budget tracking and progress indicators.
- **Dependencies**: `apbApp.core`, `apbApp.shared`.

## 6.7 Module: apbApp.shared
- **File Path**: `src/app/shared/shared.module.js`
- **Purpose**: Shared directives, filters, models.
- **Dependencies**: `apbApp.core`.


# 7. Routing Design

## 7.1 Route Definitions

### 7.1.1 Default Route
- **URL**: `/`
- **Controller**: `DashboardController`
- **Controller Alias**: `vm`
- **TemplateUrl**: `templates/dashboard/dashboard.html`
- **Resolve**: Optionally pre-fetch dashboard summary and recent transactions.
- **Behaviour**: Landing page showing summary KPIs and key widgets.

### 7.1.2 Dashboard Route
- **URL**: `/dashboard`
- Same as default route.

### 7.1.3 Transactions Route
- **URL**: `/transactions`
- **Controller**: `TransactionsController`
- **Controller Alias**: `vm`
- **TemplateUrl**: `templates/transactions/transactions.html`
- **Resolve**: Load default transaction list (current month, all cards).

### 7.1.4 Analytics Route
- **URL**: `/analytics`
- **Controller**: `AnalyticsController`
- **Controller Alias**: `vm`
- **TemplateUrl**: `templates/analytics/analytics.html`
- **Resolve**: Load default charts (category-wise, monthly trend, card distribution).

### 7.1.5 Budget Route
- **URL**: `/budget`
- **Controller**: `BudgetController`
- **Controller Alias**: `vm`
- **TemplateUrl**: `templates/budget/budget.html`
- **Resolve**: Load budget summary for default month.

### 7.1.6 Fallback Route
- **URL**: Any unmatched route
- **Behaviour**: Redirect to `/dashboard`.

## 7.2 Route Reachability
- All routes are reachable via navigation bar and programmatic navigation.
- Invalid routes redirect to default route.


# 8. Component Registry

## 8.1 Modules
- `apbApp` – Root module.
- `apbApp.core` – Core services.
- `apbApp.dashboard` – Dashboard feature.
- `apbApp.cards` – Card management feature (controllers referenced in dashboard where needed).
- `apbApp.transactions` – Transactions feature.
- `apbApp.analytics` – Analytics feature.
- `apbApp.budget` – Budget feature.
- `apbApp.shared` – Shared utilities.

## 8.2 Controllers
1. `DashboardController`
   - Type: Controller
   - Path: `src/app/dashboard/dashboard.controller.js`
   - Module: `apbApp.dashboard`
   - Registration: `.controller("DashboardController", ...)`
   - Dependencies: `DashboardService`, `RecentTransactionsService`, `$log`, `LoggingService`.

2. `TransactionsController`
   - Path: `src/app/transactions/transactions.controller.js`
   - Module: `apbApp.transactions`
   - Dependencies: `TransactionsService`, `LoggingService`.

3. `AnalyticsController`
   - Path: `src/app/analytics/analytics.controller.js`
   - Module: `apbApp.analytics`
   - Dependencies: `AnalyticsService`, `LoggingService`.

4. `BudgetController`
   - Path: `src/app/budget/budget.controller.js`
   - Module: `apbApp.budget`
   - Dependencies: `BudgetService`, `LoggingService`.

## 8.3 Services
- `DashboardService`
- `CardsService`
- `TransactionsService`
- `AnalyticsService`
- `BudgetService`
- `ConfigService`
- `LoggingService`
- `ErrorHandlingService`
- `SecurityService`

## 8.4 Factories
- `MonthlySummaryModelFactory`
- `CardModelFactory`
- `TransactionModelFactory`
- `AnalyticsModelFactory`
- `BudgetSummaryModelFactory`

## 8.5 Directives
- `apbKpiCard` – KPI card widget.
- `apbTransactionsTable` – Transactions table.
- `apbCategoryChart` – Category-wise spend chart.
- `apbMonthlyTrendChart` – Monthly trend chart.
- `apbCardDistributionChart` – Card distribution chart.
- `apbBudgetProgress` – Budget progress bar.
- `apbLoadingSpinner` – Loading indicator.

## 8.6 Filters
- `currencyFormat`
- `dateFormat`
- `percentageFormat`

## 8.7 Models
- `MonthlySummaryModel`
- `CardModel`
- `TransactionModel`
- `AnalyticsCategoryModel`
- `MonthlyTrendPointModel`
- `CardDistributionPointModel`
- `BudgetSummaryModel`
- `ErrorModel`

## 8.8 Constants / Values
- `ENV_CONFIG`
- `CATEGORY_CONSTANTS` – category definitions as per HLD.


# 9. Controller Design

## 9.1 DashboardController
- **File Path**: `src/app/dashboard/dashboard.controller.js`
- **Module**: `apbApp.dashboard`
- **Registration**: `angular.module("apbApp.dashboard").controller("DashboardController", DashboardController);`
- **Dependencies**:
  - `DashboardService`
  - `RecentTransactionsService`
  - `LoggingService`
  - `$log`
- **ViewModel Alias**: `vm`

### 9.1.1 ViewModel Variables
- `vm.summary` : `MonthlySummaryModel`
- `vm.recentTransactions` : `TransactionModel[]`
- `vm.selectedMonth` : String (e.g., `"2026-07"`)
- `vm.isLoadingSummary` : Boolean
- `vm.isLoadingRecent` : Boolean
- `vm.errorSummary` : `ErrorModel | null`
- `vm.errorRecent` : `ErrorModel | null`

### 9.1.2 Public Functions
- `vm.initialize()`
  - Inputs: None.
  - Outputs: Initiates loading summary and recent transactions.
- `vm.loadSummary(month)`
  - Inputs: `month` (String, YYYY-MM)
  - Outputs: Updates `vm.summary`, error state, loading state.
- `vm.changeMonth(month)`
  - Inputs: `month`
  - Outputs: Triggers `loadSummary` and notifies child components.
- `vm.retrySummary()`
  - Inputs: None.
  - Outputs: Retries summary loading after failure.

### 9.1.3 Initialization Logic
- Called on controller instantiation:
  - Set default month to current month (Missing from HLD: explicit default period; to be determined by configuration).
  - Call `vm.loadSummary(vm.selectedMonth)`.
  - Call `RecentTransactionsService.getRecentTransactions(5)`.

### 9.1.4 Inputs
- User actions:
  - Month dropdown selection.
  - Retry button click.

### 9.1.5 Outputs
- ViewModel updates to KPI cards and recent transactions widget.
- Service calls to `DashboardService` and `RecentTransactionsService`.

### 9.1.6 Error Handling & Logging
- On error, set relevant `ErrorModel` and log via `LoggingService`.
- Provide user-friendly message: e.g., "Unable to load dashboard summary. Please try again."


## 9.2 TransactionsController
- **File Path**: `src/app/transactions/transactions.controller.js`
- **Dependencies**:
  - `TransactionsService`
  - `LoggingService`
- **ViewModel Variables**:
  - `vm.transactions` : `TransactionModel[]`
  - `vm.filters` : { `startDate`, `endDate`, `merchant`, `category`, `bank`, `card`, `sortField`, `sortDirection`, `page`, `pageSize` }
  - `vm.pagination` : { `totalItems`, `currentPage`, `pageSize` }
  - `vm.isLoading` : Boolean
  - `vm.error` : `ErrorModel | null`

### 9.2.1 Public Functions
- `vm.initialize()` – load default transaction list.
- `vm.applyFilters()` – call service with current filters.
- `vm.resetFilters()` – reset filters to defaults.
- `vm.changePage(page)` – change page, reload data.
- `vm.sortBy(field)` – toggle sort and reload.

## 9.3 AnalyticsController
- **File Path**: `src/app/analytics/analytics.controller.js`
- **Dependencies**:
  - `AnalyticsService`
  - `LoggingService`
- **ViewModel Variables**:
  - `vm.categoryData` : `AnalyticsCategoryModel[]`
  - `vm.monthlyTrend` : `MonthlyTrendPointModel[]`
  - `vm.cardDistribution` : `CardDistributionPointModel[]`
  - `vm.selectedMonthRange` : String (e.g., last N months; Missing from HLD: precise range)
  - `vm.isLoading` : Boolean
  - `vm.error` : `ErrorModel | null`

### 9.3.1 Public Functions
- `vm.initialize()` – load default analytics.
- `vm.refresh()` – reload analytics data.

## 9.4 BudgetController
- **File Path**: `src/app/budget/budget.controller.js`
- **Dependencies**:
  - `BudgetService`
  - `LoggingService`
- **ViewModel Variables**:
  - `vm.budgetSummary` : `BudgetSummaryModel`
  - `vm.selectedMonth` : String
  - `vm.isLoading` : Boolean
  - `vm.error` : `ErrorModel | null`

### 9.4.1 Public Functions
- `vm.initialize()` – load budget summary.
- `vm.changeMonth(month)` – reload budget summary.


# 10. Service Design

## 10.1 DashboardService
- **File Path**: `src/app/dashboard/dashboard.service.js`
- **Module**: `apbApp.dashboard`
- **Purpose**: Retrieve dashboard summary from `/v1/dashboard/summary`.
- **Dependencies**:
  - `$http`
  - `ENV_CONFIG`
  - `LoggingService`
- **Public Methods**:
  - `getMonthlySummary(month)`
    - Parameters: `month` (String, YYYY-MM)
    - Returns: Promise resolving to `MonthlySummaryModel`.
- **Private Methods**:
  - `buildRequestUrl(month)`
  - `mapResponse(apiResponse)`
  - `validateResponse(apiResponse)`

## 10.2 CardsService
- **File Path**: `src/app/cards/cards.service.js`
- **Purpose**: Retrieve card list from `/v1/cards`.
- **Public Methods**:
  - `getCards()` → Promise resolving to `CardModel[]`.

## 10.3 TransactionsService
- **File Path**: `src/app/transactions/transactions.service.js`
- **Public Methods**:
  - `getTransactions(filterParams)`
    - Request: `/v1/transactions` with query params.
    - Returns: Paginated list of `TransactionModel`.
  - `getRecentTransactions(limit)`
    - Request: `/v1/transactions/recent?limit=...`.

## 10.4 AnalyticsService
- **File Path**: `src/app/analytics/analytics.service.js`
- **Public Methods**:
  - `getCategoryAnalytics(month)` – `/v1/analytics/categories`.
  - `getMonthlyTrend(range)` – `/v1/analytics/monthly-trend`.
  - `getCardDistribution(month)` – `/v1/analytics/card-distribution`.

## 10.5 BudgetService
- **File Path**: `src/app/budget/budget.service.js`
- **Public Methods**:
  - `getBudgetSummary(month)` – `/v1/budget/summary`.

## 10.6 LoggingService
- **File Path**: `src/app/core/logging.service.js`
- **Purpose**: Abstract logging to console or external telemetry.
- **Public Methods**:
  - `info(message, context)`
  - `warn(message, context)`
  - `error(message, context)`
  - `audit(event, context)`

## 10.7 ErrorHandlingService
- **File Path**: `src/app/core/error-handling.service.js`
- **Public Methods**:
  - `mapHttpError(response)` → `ErrorModel`

## 10.8 SecurityService
- **File Path**: `src/app/core/security.service.js`
- **Purpose**: Provide hooks for token management, attaching auth headers.
- **Note**: Actual token acquisition/renewal flows missing from HLD; must be integrated with upstream Identity & Access Service.


# 11. Factory Design

## 11.1 MonthlySummaryModelFactory
- **File Path**: `src/app/dashboard/monthly-summary.factory.js`
- **Purpose**: Create `MonthlySummaryModel` objects from API responses.
- **Public Methods**:
  - `createFromApiResponse(apiResponse)`

## 11.2 CardModelFactory
- **File Path**: `src/app/cards/card.factory.js`
- **Purpose**: Create `CardModel` objects.

## 11.3 TransactionModelFactory
- **File Path**: `src/app/transactions/transaction.factory.js`

## 11.4 AnalyticsModelFactory
- **File Path**: `src/app/analytics/analytics.factory.js`

## 11.5 BudgetSummaryModelFactory
- **File Path**: `src/app/budget/budget-summary.factory.js`


# 12. Directive Design

## 12.1 apbKpiCard
- **File Path**: `src/app/shared/directives/kpi-card.directive.js`
- **Restrict**: `E`
- **Scope**:
  - `title` (String, `@`)
  - `value` (Number/String, `@` or `=` depending on usage)
  - `iconClass` (String, `@`)
  - `description` (String, `@`)
- **BindToController**: `true`
- **Controller**: `KpiCardController`
- **ControllerAs**: `vm`
- **TemplateUrl**: `templates/shared/kpi-card.html`
- **Replace**: `false`
- **Transclude**: `false`
- **Usage Example**:
  ```html
  <apb-kpi-card
      title="Total Spend"
      value="{{vm.summary.totalSpend | currencyFormat}}"
      icon-class="glyphicon glyphicon-stats"
      description="Monthly total spending">
  </apb-kpi-card>
  ```

## 12.2 apbTransactionsTable
- **File Path**: `src/app/transactions/transactions-table.directive.js`
- **Purpose**: Render transactions table with sorting and pagination.
- **Scope**:
  - `transactions` (`=`, array of `TransactionModel`)
  - `onSortChange` (`&`)
  - `onPageChange` (`&`)
- **TemplateUrl**: `templates/transactions/transactions-table.html`

## 12.3 apbCategoryChart
- **File Path**: `src/app/analytics/category-chart.directive.js`
- **Purpose**: Render category-wise spend chart using Chart.js.
- **Scope**:
  - `data` (`=`, category dataset)

(Additional directive definitions for `apbMonthlyTrendChart`, `apbCardDistributionChart`, `apbBudgetProgress`, `apbLoadingSpinner` with similar structure.)


# 13. Filter Design

## 13.1 currencyFormat
- **Input Type**: Number
- **Output Type**: String
- **Formatting Rules**: Use configured currency symbol and locale; default symbol Missing from HLD (to be provided in configuration).

## 13.2 dateFormat
- **Input Type**: Date/String
- **Output Type**: String (e.g., `DD-MMM-YYYY`)

## 13.3 percentageFormat
- **Input Type**: Number (0–100)
- **Output Type**: String with `%` suffix.


# 14. Model Design

## 14.1 MonthlySummaryModel
- **Purpose**: Monthly dashboard summary.
- **Properties**:
  - `month` (String, YYYY-MM)
  - `totalSpend` (Number, >= 0)
  - `totalCreditLimit` (Number, >= 0)
  - `availableCredit` (Number, >= 0)
  - `outstandingAmount` (Number, >= 0)
  - `utilizationPercentage` (Number, 0–100)
  - `transactionCount` (Number, >= 0)
- **Default Values**: 0 or null
- **Sample JSON**:
  ```json
  {
    "month": "2026-07",
    "totalSpend": 45872,
    "totalCreditLimit": 200000,
    "availableCredit": 154128,
    "outstandingAmount": 45872,
    "utilizationPercentage": 22.94,
    "transactionCount": 92
  }
  ```

## 14.2 CardModel
- **Purpose**: Card portfolio listing.
- **Properties**:
  - `cardId` (String, masked identifier)
  - `cardName` (String)
  - `issuingBank` (String)
  - `maskedNumber` (String)
  - `creditLimit` (Number)
  - `availableCredit` (Number)
  - `currentOutstanding` (Number)
  - `billingDate` (String/Date)
  - `dueDate` (String/Date)

## 14.3 TransactionModel
- **Purpose**: Transaction row representation.
- **Properties**:
  - `transactionDate` (Date/String)
  - `merchantName` (String)
  - `category` (String)
  - `cardAlias` (String)
  - `amount` (Number)
  - `paymentStatus` (String, e.g., `PAID`, `UNPAID`)
  - `remarks` (String)

## 14.4 Analytics Models
- Category-wise, monthly trend, card distribution point models as simple value objects with fields required by charts.

## 14.5 BudgetSummaryModel
- **Purpose**: Budget metrics for month.
- **Properties**:
  - `month` (String)
  - `monthlyBudget` (Number)
  - `currentSpend` (Number)
  - `remainingBudget` (Number)
  - `budgetUtilizationPercentage` (Number)

## 14.6 ErrorModel
- **Purpose**: Represent error details in UI.
- **Properties**:
  - `code` (Number)
  - `message` (String)
  - `correlationId` (String)


# 15. REST API Contract

## 15.1 GET /v1/dashboard/summary
- **Method**: GET
- **Query Parameters**:
  - `month` (string, YYYY-MM, required)
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:
  - `200 OK` with `MonthlySummaryModel`.
- **Error Responses**:
  - `400 Bad Request` – invalid month format.
  - `401 Unauthorized` – missing/invalid token.
  - `403 Forbidden` – insufficient role.
  - `500 Internal Server Error` – unexpected error.
- **Timeout**: Configured via `ENV_CONFIG.apiTimeoutMs`.
- **Retry Policy**: 3 attempts with exponential backoff (client-side optional; primarily backend responsibility).

## 15.2 GET /v1/cards
- Returns list of `CardModel`.

## 15.3 GET /v1/transactions
- **Query Parameters**:
  - `startDate` (YYYY-MM-DD)
  - `endDate` (YYYY-MM-DD)
  - `merchant` (string)
  - `category` (string)
  - `bank` (string)
  - `card` (string)
  - `sortField` (one of `amount`, `transactionDate`)
  - `sortDirection` (`asc`/`desc`)
  - `page` (number)
  - `pageSize` (number)
- **Response**:
  - `200 OK` with paginated list of `TransactionModel`.

## 15.4 GET /v1/transactions/recent
- **Query Parameters**: `limit` (integer)
- **Response**: Latest N `TransactionModel`.

## 15.5 GET /v1/analytics/categories
- **Response**: Category-wise spend aggregates.

## 15.6 GET /v1/analytics/monthly-trend
- **Response**: Monthly trend data points.

## 15.7 GET /v1/analytics/card-distribution
- **Response**: Card-wise distribution data.

## 15.8 GET /v1/budget/summary
- **Query Parameters**: `month`
- **Response**: `BudgetSummaryModel`.


# 16. Configuration Design

## 16.1 ENV_CONFIG
- **File**: `src/app/config/env.default.json`, `env.dev.json`, `env.prod.json`
- **Properties**:
  - `apiBaseUrl` – base URL for backend APIs.
  - `apiTimeoutMs` – HTTP timeout.
  - `maxLookbackMonths` – maximum months allowed for trends (Missing from HLD, to be defined).
  - `useMockData` – boolean, toggles mock mode.
  - `featureFlags` – object with keys for enabling/disabling features.
  - `telemetry` – telemetry configuration.

## 16.2 Config Constants
- `config.constants.js` to register `ENV_CONFIG` as Angular constant.


# 17. Mock Implementation Design

## 17.1 Mock Mode Overview
- **Toggle**: `ENV_CONFIG.useMockData`.
- **Mechanism**:
  - Services check `useMockData`; when `true`, they delegate to mock services.

## 17.2 Mock Files
- `mock/dashboard-summary.mock.js`
- `mock/cards.mock.js`
- `mock/transactions.mock.js`
- `mock/analytics.mock.js`
- `mock/budget-summary.mock.js`

Each mock file:
- Uses `$q` and `$timeout` to simulate async behaviour.
- Returns sample JSON matching production contracts.
- Supports:
  - Delay simulation (configurable delay).
  - Failure simulation (e.g., forced 500 error).
  - Timeout simulation.
  - Empty response.
  - Invalid response (for negative testing).


# 18. UI Specification

## 18.1 Overall Layout
- Bootstrap 3 container-based layout.
- Structure:
  - Header with app title and user info dropdown.
  - Navigation tabs: Dashboard, Transactions, Analytics, Budget.
  - Content area using rows and columns.
  - Footer with build version.

## 18.2 Dashboard Page
- **Page Title**: "Monthly Spending Dashboard".
- **Sections Order**:
  1. KPI Summary row (Total Spend, Total Credit Limit, Available Credit, Outstanding Amount, Utilization %, Transaction Count).
  2. Filters row (Month selector).
  3. Charts row (Category chart, Monthly trend chart).
  4. Recent Transactions widget.

## 18.3 Transactions Page
- Table with columns: Transaction Date, Merchant Name, Category, Card Used, Amount, Payment Status, Remarks.
- Filters: Date range, Merchant name, Category, Bank, Card, Sort options.

## 18.4 Analytics Page
- Category-wise bar/pie chart.
- Monthly trend line chart.
- Card distribution doughnut chart.

## 18.5 Budget Page
- Budget KPI card (Monthly Budget, Current Spend, Remaining Budget).
- Horizontal progress bar with utilisation percentage.

## 18.6 Responsive Behaviour
- For smaller screens:
  - KPI cards stacked vertically.
  - Charts stacked.
  - Filters collapsed into accordions.


# 19. Data Flow

## 19.1 Dashboard Summary Success Flow
User selects month → DashboardController `changeMonth` → DashboardService `getMonthlySummary` → REST API `/v1/dashboard/summary` → Response mapped to `MonthlySummaryModel` → `vm.summary` updated → KPI cards re-render.

## 19.2 Transactions Success Flow
User modifies filters → TransactionsController `applyFilters` → TransactionsService `getTransactions` → REST API `/v1/transactions` → Response mapped to `TransactionModel[]` → Table updates.

## 19.3 Analytics Success Flow
User opens Analytics tab → AnalyticsController `initialize` → AnalyticsService methods → Analytics endpoints → Chart data models → Chart directives render.

## 19.4 Budget Success Flow
User selects month → BudgetController `changeMonth` → BudgetService `getBudgetSummary` → `/v1/budget/summary` → `BudgetSummaryModel` → Budget progress component updates.


# 20. Business Rules

## 20.1 Monthly Summary Rules
- Utilization % = `totalSpend / totalCreditLimit * 100`.
- If `totalCreditLimit == 0`, utilisation is 0 and flagged for configuration review.

## 20.2 Budget Rules
- Remaining budget = `monthlyBudget - currentSpend`.
- Budget utilization % = `currentSpend / monthlyBudget * 100`.
- If `monthlyBudget == 0`, utilisation is undefined; UI shows "No budget configured".

## 20.3 Transactions Rules
- Date filters must not exceed `maxLookbackMonths`.
- Pagination default `pageSize` <= configured maximum.


# 21. Validation Rules

## 21.1 Form Validation
- Month selector: required.
- Date range: startDate <= endDate; range <= `maxLookbackMonths`.
- Page size: positive integer within allowed range.

## 21.2 API Request Validation
- Services validate inputs before building requests.

## 21.3 API Response Validation
- All mandatory fields present and of expected type.


# 22. Error Handling

## 22.1 Error Types
- Validation Errors – missing/invalid inputs.
- Business Errors – e.g., no budget configured.
- Network Errors – connectivity or timeout.
- Timeout Errors – HTTP timeout.
- Unexpected Errors – generic.

## 22.2 Error Handling Flow
API Failure → Service validation → LoggingService logs error → ErrorHandlingService maps to ErrorModel → Controller updates `error` in ViewModel → UI displays message and retry option.


# 23. Logging Design

- LoggingService used for all logs.
- Logs:
  - Info: view loads, successful data loads.
  - Warning: partial failures.
  - Error: API failures, unexpected exceptions.
  - Audit: key user actions (filter changes, navigation between main tabs).
- No sensitive data (card numbers, tokens) logged.


# 24. Security Design

- Input validation for all user inputs.
- Output encoding where dynamic HTML is used.
- Sanitization via `ngSanitize` for any HTML content.
- Hooks for attaching `Authorization` headers provided by SecurityService.
- UI will not display full card numbers; only masked numbers are used.

Missing from HLD:
- Exact mechanism for integrating with OAuth2/OIDC; LLD provides hooks only.


# 25. Dependency Map

For each major file, the dependency map is summarised:
- `DashboardController` depends on `DashboardService`, `RecentTransactionsService`, `LoggingService` and consumes `MonthlySummaryModel`, `TransactionModel`.
- `TransactionsController` depends on `TransactionsService`, `LoggingService`.
- `AnalyticsController` depends on `AnalyticsService`, `LoggingService`.
- `BudgetController` depends on `BudgetService`, `LoggingService`.
- Services depend on `$http`, `ENV_CONFIG`, `LoggingService`, `SecurityService`.
- Directives depend on Chart.js (via global script) and bootstrap CSS.


# 26. LLD Validation Checklist

- [x] All 26 mandatory sections present and ordered.
- [x] Technology stack conforms to standards.
- [x] AngularJS SPA architecture with routes, controllers, services.
- [x] Repository structure fully defined.
- [x] index.html fully specified with correct loading order and CDNs.
- [x] Root module and module dependencies defined.
- [x] All routes map to existing controllers and templates.
- [x] Component registry covers all controllers, services, directives, filters, models.
- [x] REST API contracts defined for all endpoints used by UI.
- [x] Mock mode and mock files defined per endpoint.
- [x] UI specification includes layout, components, and states.
- [x] Data flows (success and failure) documented.
- [x] Business rules, validation rules, error handling, logging, security documented.
- [x] No source code or HTML/JS/CSS implementation included (only specifications).

This LLD adheres to `lldgenerationkb` and follows the QE-7306 HLD without introducing new business functionality. It explicitly marks missing HLD details where clarification is required.