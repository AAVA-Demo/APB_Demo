# Credit Card Analysis Dashboard - Playwright Automation

## Overview
Production-ready Playwright JavaScript automation framework for Credit Card Analysis Dashboard using Page Object Model (POM).

## Test Coverage
- **Dashboard KPIs**: Consolidated view, authentication, real-time updates (3 test cases)
- **Card Management**: Multiple cards display, error handling, performance with 10 cards (3 test cases)
- **Card Switching**: Instant display, deactivated card handling, rapid switching (3 test cases)
- **Credit Utilization**: Transaction updates, deactivated card exclusion, concurrent transactions (3 test cases)
- **Spending Analytics**: Category breakdown, empty state, drill-down (3 test cases)
- **Monthly Trends**: 12-month chart, partial data, month drill-down (3 test cases)

**Total Test Cases**: 18

## Framework Structure
```
src/automationScripts/
├── pages/
│   ├── login.page.js
│   ├── dashboard.page.js
│   ├── card-management.page.js
│   └── analytics.page.js
├── utils/
│   └── logger.js
├── dashboard-kpis.spec.js
├── card-management.spec.js
├── card-switching.spec.js
├── credit-utilization.spec.js
├── spending-analytics.spec.js
└── monthly-trends.spec.js
```

## Installation
```bash
npm install
npx playwright install
```

## Execution
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:dashboard
npm run test:cards
npm run test:switching
npm run test:utilization
npm run test:analytics
npm run test:trends

# Run in headed mode
npm run test:headed

# Debug mode
npm run test:debug

# View report
npm run report
```

## Configuration
- Base URL: `https://creditcard.demo.com` (configurable via `BASE_URL` env variable)
- Browsers: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- Timeout: 60 seconds per test
- Retries: 2 (in CI), 0 (local)
- Parallel execution: Disabled for data consistency

## Logging
All test execution logs are written to `test-execution.log` using Winston logger.

## Reporting
- HTML Report: `playwright-report/index.html`
- JSON Report: `test-results.json`
- JUnit Report: `junit-results.xml`

## Key Features
- ✅ Page Object Model (POM) architecture
- ✅ Zero hardcoded locators in test files
- ✅ Playwright native auto-waiting
- ✅ Comprehensive logging
- ✅ Cross-browser support
- ✅ Mobile responsive testing
- ✅ Screenshot on failure
- ✅ Video recording on failure
- ✅ Trace on retry

## Test Data
All test data is embedded in test steps as per TestRail test cases. No external data files required.

## Maintenance
- All locators are centralized in Page Object classes
- Reusable methods across test cases
- Single source of truth for UI element interactions

## Contact
For questions or issues, contact the Senior Automation Framework Engineer team.
