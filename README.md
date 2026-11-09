# Credit Card Dashboard - Playwright Automation

## Overview
This repository contains production-ready Playwright JavaScript automation scripts for the Credit Card Dashboard application. The test suite covers 23 critical test scenarios across Dashboard KPIs, Transaction Management, Analytics, and Card Management modules.

## Project Structure
```
src/automationScripts/
├── dashboard.spec.js          # Dashboard KPI tests (5 test cases)
├── transactions.spec.js       # Transaction management tests (7 test cases)
├── analytics.spec.js          # Analytics and insights tests (6 test cases)
├── cards.spec.js              # Card management tests (5 test cases)
└── pages/
    ├── login.page.js          # Login page object
    ├── dashboard.page.js      # Dashboard page object
    ├── transaction.page.js    # Transaction page object
    ├── analytics.page.js      # Analytics page object
    └── card-management.page.js # Card management page object
```

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation
```bash
npm install
npx playwright install
```

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

### Run tests in UI mode
```bash
npm run test:ui
```

### View test report
```bash
npm run report
```

## Test Coverage

### Dashboard KPI Tests (5 tests)
- QE-8469 TS-001 TC-001: Verify total monthly spend calculation
- QE-8469 TS-002 TC-001: Verify zero monthly spend display
- QE-8474 TS-001 TC-001: Verify total credit limit aggregation
- QE-8473 TS-001 TC-001: Verify available credit display
- QE-8479 TS-001 TC-001: Verify all KPIs load within 2 seconds

### Transaction Management Tests (7 tests)
- QE-8468 TS-001 TC-001: Verify paginated transaction list
- QE-8468 TS-002 TC-001: Verify empty state message
- QE-8470 TS-001 TC-001: Verify date range filter performance
- QE-8470 TS-002 TC-001: Verify date validation error
- QE-8470 TS-003 TC-001: Verify merchant name filter
- QE-8483 TS-003 TC-001: Verify transaction sorting

### Analytics Tests (6 tests)
- QE-8476 TS-001 TC-001: Verify nine category display
- QE-8471 TS-001 TC-001: Verify category drill-down
- QE-8471 TS-002 TC-001: Verify zero transaction message
- QE-8472 TS-001 TC-001: Verify 12-month trend chart
- QE-8472 TS-003 TC-001: Verify chart tooltip
- QE-8485 TS-001 TC-001: Verify analytics load within 3 seconds

### Card Management Tests (5 tests)
- QE-8477 TS-001 TC-001: Verify multi-card display
- QE-8477 TS-002 TC-001: Verify no cards message
- QE-8481 TS-001 TC-001: Verify spend analysis display
- QE-8475 TS-001 TC-001: Verify card comparison view
- QE-8475 TS-002 TC-001: Verify comparison error message

## Framework Features

✅ **Strict Page Object Model** - All locators in page objects, zero in test files  
✅ **Reusable Methods** - Login, navigation, and common actions shared  
✅ **Playwright Native Waits** - Uses toBeVisible(), waitForLoadState()  
✅ **Performance Validation** - Load time assertions for NFR compliance  
✅ **Data-Driven** - Test data passed as parameters  
✅ **Comprehensive Coverage** - 23 automated test cases  
✅ **Error Handling** - Validation error checks and empty state verifications  
✅ **Chart Interactions** - Advanced Chart.js interaction via page.evaluate()  

## Configuration

The `playwright.config.js` file includes:
- Multi-browser support (Chromium, Firefox, WebKit)
- HTML, JSON, and JUnit reporters
- Screenshot and video capture on failure
- Trace on first retry
- Parallel execution support

## CI/CD Integration

The test suite is ready for CI/CD integration with:
- Retry mechanism for flaky tests
- Multiple report formats
- Failure artifacts (screenshots, videos, traces)
- Configurable parallelization

## Traceability

All test cases are mapped to:
- User Story IDs (QE-XXXX)
- Test Scenario IDs (TS-XXX)
- Test Case IDs (TC-XXX)
- TestRail test cases

## Support

For issues or questions, please refer to the project documentation or contact the DevOps team.
