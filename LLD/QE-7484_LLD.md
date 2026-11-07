# Low-Level Design: QE-7484 - Spending Analytics and Insights

## a. Architecture Mapping

- **Analytics Module** → AngularJS Module (`app.analytics`)
- **Analytics Controller** → AngularJS Controller (`AnalyticsController`)
- **Analytics Service** → AngularJS Service (`AnalyticsService`)
- **Data Aggregation Service** → AngularJS Service (`DataAggregationService`)
- **Categorization Service** → AngularJS Service (`TransactionCategorizationService`)
- **Chart Directive** → AngularJS Directive (`spendingChart`)
- **Analytics View** → HTML5 Template with Bootstrap and Chart.js (`analytics.html`)

**Recommended Folder Structure:**
```
/app
  /analytics
    analytics.module.js
    analytics.controller.js
    analytics.html
    /services
      analytics.service.js
      data-aggregation.service.js
      transaction-categorization.service.js
    /directives
      spending-chart.directive.js
```

## b. Component Specifications

| Component Name | Artifact Type | Responsibility | Key Dependencies |
|----------------|---------------|----------------|------------------|
| AnalyticsModule | Module | Registers analytics feature module and chart dependencies | angular, ui.router, chart.js, app.core |
| AnalyticsController | Controller | Manages analytics view state, filters, and chart data binding | AnalyticsService, $scope, $filter |
| AnalyticsService | Service | Orchestrates data aggregation and categorization for analytics | DataAggregationService, TransactionCategorizationService |
| DataAggregationService | Service | Queries transaction repository and aggregates by category, card, month | TransactionDataFactory, $q |
| TransactionCategorizationService | Service | Maps transactions to spending categories using merchant codes/names | None |
| TransactionDataFactory | Factory | Fetches transaction data via REST API with date range filters | $http, API_CONFIG |
| SpendingChartDirective | Directive | Renders interactive Chart.js visualizations (pie, bar, line charts) | Chart.js library |
| AnalyticsView | HTML Template | Displays category filters, card selector, and chart containers | Bootstrap CSS, spendingChart directive |

## c. Data Model

**SpendingCategory Object:**
```javascript
{
  categoryName: String,
  totalAmount: Number,
  percentage: Number,
  transactionCount: Number,
  color: String
}
```

**MonthlyTrend Object:**
```javascript
{
  month: String,
  year: Number,
  totalSpend: Number,
  categoryBreakdown: Array<SpendingCategory>
}
```

**CardWiseSpending Object:**
```javascript
{
  cardId: String,
  cardName: String,
  totalSpend: Number,
  categoryBreakdown: Array<SpendingCategory>
}
```

**AnalyticsFilter Object:**
```javascript
{
  selectedCard: String,
  selectedCategory: String,
  dateRange: { startDate: Date, endDate: Date },
  viewType: String
}
```

## d. Data Flow

User accesses analytics dashboard → AnalyticsController initializes with default filters (all cards, all categories, last 12 months) → Controller calls AnalyticsService.getSpendingAnalytics(filters) → AnalyticsService invokes DataAggregationService.aggregateTransactions() → DataAggregationService fetches transactions via TransactionDataFactory from REST API → TransactionCategorizationService.categorizeTransactions() maps each transaction to one of nine categories → DataAggregationService groups by category, calculates totals and percentages, aggregates by month and card → Formatted analytics data returned to AnalyticsController → Controller binds data to $scope and chart configurations → SpendingChartDirective renders interactive Chart.js visualizations (pie chart for categories, line chart for monthly trends, bar chart for card-wise) with drill-down and filter capabilities, all rendering within 3 seconds.

## e. Primary Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant AnalyticsView
    participant AnalyticsController
    participant AnalyticsService
    participant DataAggregationService
    participant TransactionCategorizationService
    participant TransactionDataFactory
    participant REST_API

    User->>AnalyticsView: Access Analytics Dashboard
    AnalyticsView->>AnalyticsController: Initialize with default filters
    AnalyticsController->>AnalyticsService: getSpendingAnalytics(filters)
    AnalyticsService->>DataAggregationService: aggregateTransactions(filters)
    DataAggregationService->>TransactionDataFactory: getTransactions(dateRange)
    TransactionDataFactory->>REST_API: GET /api/transactions?startDate=X&endDate=Y
    REST_API-->>TransactionDataFactory: Transaction array
    DataAggregationService->>TransactionCategorizationService: categorizeTransactions(transactions)
    TransactionCategorizationService-->>DataAggregationService: Categorized transactions
    DataAggregationService->>DataAggregationService: Group by category, card, month; calculate totals
    DataAggregationService-->>AnalyticsService: Aggregated analytics data
    AnalyticsService-->>AnalyticsController: SpendingCategory[], MonthlyTrend[], CardWiseSpending[]
    AnalyticsController->>AnalyticsView: Bind chart data to scope
    AnalyticsView->>AnalyticsView: Render Chart.js visualizations
    AnalyticsView-->>User: Display interactive charts with drill-down
```

## f. Implementation Notes

- Use Chart.js library integrated via angular-chart.js wrapper for declarative chart binding with AngularJS
- Implement category mapping using ES6 Map with merchant code/name as key and category as value for O(1) lookup
- Apply AngularJS $filter service for client-side filtering when switching between cards/categories to avoid redundant API calls
- Use responsive Chart.js options (maintainAspectRatio, responsive: true) for mobile-friendly visualizations
- Cache aggregated data in AnalyticsService for 5 minutes using $cacheFactory to improve performance on filter changes

## g. Error Handling

HTTP interceptor captures API errors; try/catch in categorization logic with fallback to 'Miscellaneous' category; user notified via toast on failures.

## h. Security Notes

Standard input validation and secure API calls assumed; token-based auth via existing SSO for API access.