# Credit Card Analysis Dashboard - Playwright Automation Framework

## Overview

This repository contains a comprehensive Playwright automation framework for testing the Credit Card Analysis Dashboard application. The framework follows the Page Object Model (POM) design pattern and implements best practices for maintainability, scalability, and reliability.

## Project Structure

```
.
├── src/
│   ├── automationScripts/
│   │   ├── dashboard.spec.js           # Dashboard KPI and real-time tracking tests
│   │   ├── analytics.spec.js           # Analytics and trend analysis tests
│   │   ├── cardManagement.spec.js      # Card management tests
│   │   └── pages/
│   │       ├── dashboard.page.js       # Dashboard page object
│   │       ├── analytics.page.js       # Analytics page object
│   │       └── cardManagement.page.js  # Card management page object
│   └── utils/
│       └── logger.js                   # Custom logging utility
├── playwright.config.js                # Playwright configuration
├── package.json                        # Project dependencies
└── README.md                           # This file
```

## Features

### Test Coverage

- **Dashboard Tests (7 test cases)**
  - KPI dashboard load time validation
  - KPI accuracy verification
  - Service unavailability handling
  - Responsive layout testing
  - Real-time credit utilization tracking
  - Payment processing updates

- **Analytics Tests (8 test cases)**
  - Monthly spend trend analysis
  - Performance validation
  - Insufficient data handling
  - Drill-down functionality
  - Category-wise spending visualization
  - No transactions scenario

- **Card Management Tests (8 test cases)**
  - Multiple card display
  - Unified interface validation
  - No cards scenario
  - Performance testing with 10+ cards
  - Card-specific transaction history
  - Deactivated card error handling
  - Transaction filtering

### Framework Features

- ✅ **Page Object Model (POM)**: All locators and actions encapsulated in page objects
- ✅ **No locators in spec files**: Clean separation of concerns
- ✅ **Reusable methods**: Common actions like login, navigate shared across tests
- ✅ **Playwright auto-waiting**: Leverages built-in waiting mechanisms
- ✅ **Environment configuration**: Supports multiple environments via environment variables
- ✅ **Custom logging**: Structured logging with timestamps and log levels
- ✅ **Cross-browser testing**: Supports Chromium, Firefox, WebKit
- ✅ **Mobile testing**: Includes mobile Chrome and Safari configurations
- ✅ **Comprehensive reporting**: HTML, JSON, and JUnit reports

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd credit-card-dashboard-automation
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npm run install:browsers
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
BASE_URL=https://creditcard.dashboard.app
LOG_LEVEL=info
```

### Playwright Configuration

The `playwright.config.js` file contains:
- Test directory configuration
- Timeout settings
- Reporter configurations
- Browser projects (Chromium, Firefox, WebKit, Mobile)
- Base URL and other use options

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test suites
```bash
npm run test:dashboard    # Dashboard tests only
npm run test:analytics    # Analytics tests only
npm run test:cards        # Card management tests only
```

### Run tests on specific browsers
```bash
npm run test:chromium     # Chromium only
npm run test:firefox      # Firefox only
npm run test:webkit       # WebKit only
npm run test:mobile       # Mobile browsers only
```

### View test report
```bash
npm run report
```

## Test Case Mapping

All test cases are mapped to TestRail test case IDs:

| Test Case ID | Description | Spec File |
|--------------|-------------|----------|
| TC-5883 | Verify KPI dashboard load time | dashboard.spec.js |
| TC-5884 | Verify KPI accuracy for single card | dashboard.spec.js |
| TC-5885 | Verify error handling for service unavailability | dashboard.spec.js |
| TC-5886 | Verify responsive layout | dashboard.spec.js |
| TC-5893 | Verify real-time transaction update | dashboard.spec.js |
| TC-5895 | Verify last known values with warning | dashboard.spec.js |
| TC-5897 | Verify payment processing update | dashboard.spec.js |
| TC-5879 | Verify monthly trend chart with 12+ months | analytics.spec.js |
| TC-5880 | Verify trend chart performance | analytics.spec.js |
| TC-5881 | Verify insufficient data handling | analytics.spec.js |
| TC-5882 | Verify drill-down functionality | analytics.spec.js |
| TC-5887 | Verify category-wise visualization | analytics.spec.js |
| TC-5888 | Verify category chart performance | analytics.spec.js |
| TC-5889 | Verify no transactions scenario | analytics.spec.js |
| TC-5891 | Verify category drill-down | analytics.spec.js |
| TC-5907 | Verify multiple card display | cardManagement.spec.js |
| TC-5909 | Verify unified interface | cardManagement.spec.js |
| TC-5911 | Verify no cards scenario | cardManagement.spec.js |
| TC-5913 | Verify performance with 10+ cards | cardManagement.spec.js |
| TC-5899 | Verify card-specific transaction history | cardManagement.spec.js |
| TC-5901 | Verify card detail load performance | cardManagement.spec.js |
| TC-5903 | Verify deactivated card error handling | cardManagement.spec.js |
| TC-5905 | Verify transaction filtering | cardManagement.spec.js |

## Page Object Model

### DashboardPage

Methods:
- `navigate()`: Navigate to dashboard
- `login(username, password)`: Perform login
- `waitForDashboardLoad()`: Wait for dashboard to load
- `getKPIValue(kpiType)`: Get specific KPI value
- `verifyAllKPIsVisible()`: Verify all KPIs are visible
- `getLastUpdatedTimestamp()`: Get last updated timestamp
- `verifyResponsiveLayout(width, height)`: Verify responsive layout

### AnalyticsPage

Methods:
- `navigate()`: Navigate to analytics
- `login(username, password)`: Perform login
- `navigateToAnalytics()`: Navigate to analytics section
- `navigateToTrendAnalysis()`: Navigate to trend analysis
- `waitForTrendChartLoad()`: Wait for trend chart
- `getTrendDataPoints()`: Get number of data points
- `verifyChartInteractivity()`: Verify chart interactivity
- `clickTrendDataPoint(index)`: Click on data point
- `getCategoryBreakdown()`: Get category breakdown
- `waitForCategoryChartLoad()`: Wait for category chart
- `getAllCategories()`: Get all category names
- `getCategoryAmounts()`: Get category amounts
- `getCategoryPercentages()`: Get category percentages
- `clickCategory(categoryName)`: Click on category
- `getTransactionDetails()`: Get transaction details

### CardManagementPage

Methods:
- `navigate()`: Navigate to card management
- `login(username, password)`: Perform login
- `navigateToMyCards()`: Navigate to My Cards section
- `waitForCardListLoad()`: Wait for card list
- `getCardCount()`: Get number of cards
- `getAllCardDetails()`: Get all card details
- `selectCard(cardName)`: Select card by name
- `selectCardByNumber(lastFourDigits)`: Select card by number
- `waitForCardDetailLoad()`: Wait for card detail
- `getTransactions()`: Get transaction list
- `getSpendingBreakdown()`: Get spending breakdown
- `getUtilizationMetrics()`: Get utilization metrics
- `setDateRangeFilter(from, to)`: Set date range filter
- `setCategoryFilter(category)`: Set category filter
- `applyFilters()`: Apply filters
- `clearFilters()`: Clear filters
- `getFilteredTotal()`: Get filtered total
- `navigateBack()`: Navigate back to card list

## Logging

The framework includes a custom logger utility that provides structured logging with timestamps and log levels.

### Log Levels
- `error`: Error messages
- `warn`: Warning messages
- `info`: Informational messages (default)
- `debug`: Debug messages

Set the log level via environment variable:
```bash
export LOG_LEVEL=debug
```

## Best Practices

1. **Always use Page Objects**: Never put locators directly in test files
2. **Use Playwright's auto-waiting**: Leverage `expect().toBeVisible()` instead of manual waits
3. **Keep tests independent**: Each test should be able to run independently
4. **Use descriptive test names**: Test names should clearly describe what is being tested
5. **Log important actions**: Use the logger to track test execution
6. **Handle errors gracefully**: Implement proper error handling and assertions
7. **Keep page objects DRY**: Reuse common methods across page objects

## Troubleshooting

### Tests failing due to timeout
- Increase timeout in `playwright.config.js`
- Check if the application is running and accessible
- Verify network connectivity

### Element not found errors
- Verify locators in page objects
- Check if the application UI has changed
- Use Playwright Inspector for debugging: `npm run test:debug`

### Browser installation issues
- Run `npm run install:browsers` to reinstall browsers
- Check system requirements for Playwright

## Contributing

When adding new tests:
1. Create test cases in the appropriate spec file
2. Add new methods to page objects as needed
3. Follow the existing naming conventions
4. Update this README with new test case mappings
5. Ensure all tests pass before committing

## License

ISC

## Contact

For questions or issues, please contact the DevOps Integration Team.

---

**Last Updated**: 2024
**Framework Version**: 1.0.0
**Playwright Version**: 1.40.0