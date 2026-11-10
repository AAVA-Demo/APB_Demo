# Credit Card Analysis Dashboard - Playwright Automation Framework

## Overview
Production-ready Playwright JavaScript automation framework using Page Object Model (POM) for Credit Card Analysis Dashboard application.

## Framework Structure
```
src/
├── automationScripts/
│   ├── categorySpendingAnalytics.spec.js
│   ├── cardManagement.spec.js
│   ├── cardDetails.spec.js
│   ├── dashboardKPI.spec.js
│   ├── trendAnalysis.spec.js
│   └── pages/
│       ├── categorySpending.page.js
│       ├── cardManagement.page.js
│       ├── cardDetails.page.js
│       ├── dashboard.page.js
│       ├── trendAnalysis.page.js
│       └── login.page.js
├── utils/
│   └── logger.js
playwright.config.js
package.json
```

## Test Coverage
- **18 Test Cases** covering all TestRail scenarios
- **6 Page Objects** with reusable locators and methods
- **5 Test Spec Files** organized by feature

## Features
- ✅ Page Object Model (POM) architecture
- ✅ Winston logging utility
- ✅ Playwright native auto-waiting
- ✅ Cross-browser testing (Chrome, Firefox, Safari)
- ✅ Mobile testing (iOS & Android)
- ✅ Comprehensive assertions using Playwright expect
- ✅ HTML, JSON, and JUnit reporting
- ✅ Screenshot and video capture on failure
- ✅ Retry mechanism for flaky tests

## Installation
```bash
npm install
npx playwright install
```

## Running Tests
```bash
# Run all tests
npm test

# Run with UI mode
npm run test:ui

# Run in headed mode
npm run test:headed

# Run specific browser
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Run mobile tests
npm run test:mobile

# Debug mode
npm run test:debug

# View report
npm run report
```

## Test Mapping
### QE-9424: Category-wise Spending Analytics
- TS-001 TC-001: Pie chart with 6 categories and drill-down
- TS-002 TC-001: Empty state for no transactions
- TS-003 TC-001: 3-month filter with 9 categories

### QE-9423: Multiple Credit Card Management
- TS-001 TC-001: Display 5 cards with masked numbers
- TS-002 TC-001: Empty state for no cards
- TS-003 TC-001: Invalid authentication token

### QE-9422: Individual Card Details Navigation
- TS-001 TC-001: Card details load within 500ms
- TS-002 TC-001: Unauthorized card access
- TS-003 TC-001: Rapid switching between 3 cards

### QE-9421: Real-Time Credit Portfolio Tracking
- TS-001 TC-001: Auto-refresh within 60 seconds
- TS-002 TC-001: Backend unavailability handling
- TS-003 TC-001: Simultaneous transactions aggregation

### QE-9420: Monthly Spend Trend Analysis
- TS-001 TC-001: 12-month trend graph with drill-down
- TS-002 TC-001: Insufficient data message
- TS-003 TC-001: 6-month filter with recalculation

### QE-9419: Consolidated Dashboard KPI Display
- TS-001 TC-001: Consolidated metrics for 3 cards
- TS-002 TC-001: Partial KPIs with service failure
- TS-003 TC-001: Zero outstanding balance

## Configuration
- Base URL: `https://creditcard.demo` (configurable via `BASE_URL` env variable)
- Timeout: 120 seconds per test
- Retries: 2 (in CI), 0 (local)
- Parallel execution: Enabled

## Logging
Logs are stored in `logs/` directory:
- `error.log`: Error-level logs only
- `combined.log`: All logs
- Console: Colorized output

## Page Object Model
All locators are defined in Page Object classes. Test spec files only contain test logic and assertions. Methods are reused across test cases targeting the same UI feature.

## Best Practices Followed
1. ✅ No locators in test spec files
2. ✅ Shared Page Objects for related test cases
3. ✅ Reusable methods across tests
4. ✅ Playwright native auto-waiting
5. ✅ Environment-specific URLs in config
6. ✅ Winston logging utility
7. ✅ Playwright expect assertions only
8. ✅ State assertions before interactions
9. ✅ All 18 test cases implemented
10. ✅ Zero syntax errors

## Author
Senior Automation Framework Engineer with 12+ years of experience

## License
ISC
