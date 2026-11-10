# Credit Card Dashboard - Playwright Automation Framework

## Overview

Production-ready Playwright JavaScript automation framework for the Credit Card Analysis Dashboard application. Built using the Page Object Model (POM) pattern with comprehensive test coverage for all 18 TestRail test cases.

## Framework Structure

```
src/
├── automationScripts/
│   ├── creditCardDashboard.spec.js    # Main test suite (18 test cases)
│   └── pages/
│       ├── dashboard.page.js          # Dashboard Page Object
│       ├── transaction.page.js        # Transaction Page Object
│       ├── analytics.page.js          # Analytics Page Object
│       └── login.page.js              # Login Page Object
└── utils/
    └── logger.js                      # Winston logger utility
```

## Test Coverage

### Dashboard KPI Tests (3 test cases)
- QE-10399 TS-001 TC-001: Verify aggregated KPIs load within 2 seconds
- QE-10399 TS-002 TC-001: Verify authentication validation
- QE-10399 TS-003 TC-001: Verify zero-card scenario

### Multiple Cards View Tests (3 test cases)
- QE-10398 TS-001 TC-001: Verify individual card metrics display
- QE-10398 TS-002 TC-001: Verify expired token handling
- QE-10398 TS-003 TC-001: Verify KPI aggregation accuracy

### Transaction History Tests (6 test cases)
- QE-10400 TS-001 TC-001: Verify paginated transaction list
- QE-10400 TS-002 TC-001: Verify empty transaction list
- QE-10400 TS-003 TC-001: Verify pagination navigation
- QE-10403 TS-001 TC-001: Verify card filter functionality
- QE-10403 TS-002 TC-001: Verify filter with no results
- QE-10403 TS-003 TC-001: Verify filter reset

### Analytics Tests (6 test cases)
- QE-10402 TS-001 TC-001: Verify monthly trends chart
- QE-10402 TS-002 TC-001: Verify single-month scenario
- QE-10402 TS-003 TC-001: Verify month drill-down
- QE-10401 TS-001 TC-001: Verify category-wise visualization
- QE-10401 TS-002 TC-001: Verify limited category scenario
- QE-10401 TS-003 TC-001: Verify category sum validation

## Installation

```bash
npm install
```

## Configuration

Update `playwright.config.js` to set your application base URL:

```javascript
use: {
  baseURL: process.env.BASE_URL || 'https://creditcard-dashboard.example.com'
}
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui

# Run tests on specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run mobile tests
npm run test:mobile

# View test report
npm run report
```

## Environment Variables

- `BASE_URL`: Application base URL (default: https://creditcard-dashboard.example.com)
- `LOG_LEVEL`: Logging level (default: info)
- `CI`: Set to true for CI/CD environments

## Logging

All test execution logs are stored in the `logs/` directory:
- `combined.log`: All logs
- `error.log`: Error logs only

## Test Reports

- HTML Report: `playwright-report/index.html`
- JSON Report: `test-results/results.json`
- JUnit Report: `test-results/junit.xml`

## Page Object Model

All locators are centralized in Page Object classes:
- **DashboardPage**: KPI panels, card list, refresh functionality
- **TransactionPage**: Transaction table, filters, pagination
- **AnalyticsPage**: Category charts, monthly trends, drill-down
- **LoginPage**: Authentication functionality

## Best Practices Implemented

✅ Page Object Model pattern
✅ No locators in test files
✅ Centralized logging utility
✅ Playwright native auto-waiting
✅ Expect assertions only
✅ Environment-based configuration
✅ Comprehensive error handling
✅ Cross-browser support
✅ Mobile device testing
✅ CI/CD ready

## Maintenance

- Update locators only in Page Object files
- Add new test cases to `creditCardDashboard.spec.js`
- Follow existing naming conventions
- Ensure all tests have proper logging

## Support

For issues or questions, contact the Senior Automation Framework Engineer team.