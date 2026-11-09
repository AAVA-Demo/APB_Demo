# Credit Card Analysis Dashboard - Playwright Automation Framework

## Overview
Production-ready Playwright automation framework for the Credit Card Analysis Dashboard application, implementing Page Object Model (POM) design pattern with comprehensive test coverage.

## Framework Structure
```
src/
├── automationScripts/
│   ├── dashboard.spec.js          # Dashboard KPI tests (10 test cases)
│   ├── analytics.spec.js          # Analytics and visualization tests (14 test cases)
│   ├── cardManagement.spec.js     # Card management tests (11 test cases)
│   ├── responsive.spec.js         # Responsive design tests (3 test cases)
│   └── pages/
│       ├── dashboard.page.js      # Dashboard Page Object
│       ├── analytics.page.js      # Analytics Page Object
│       ├── cardManagement.page.js # Card Management Page Object
│       └── login.page.js          # Login Page Object (shared)
└── utils/
    └── logger.js                  # Winston logger utility
```

## Test Coverage
- **Total Test Cases:** 38 Playwright tests
- **TestRail Test Cases Covered:** 36
- **Features Covered:**
  - Dashboard KPI Management
  - Real-time Data Refresh
  - Multi-Card KPI Consolidation
  - Category-wise Spending Visualization
  - Spending Pattern Analysis
  - Monthly Trend Analysis
  - Multi-Card Management
  - Card Comparison
  - Card Details and Analysis
  - Responsive Design (Mobile, Tablet, Desktop)

## Installation
```bash
npm install
npx playwright install
```

## Running Tests
```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test suites
npm run test:dashboard
npm run test:analytics
npm run test:cards
npm run test:responsive

# View HTML report
npm run report
```

## Configuration
- **Base URL:** Configured in `playwright.config.js` (default: https://creditcard.app.com)
- **Browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Parallel Execution:** Enabled
- **Retries:** 2 retries in CI, 0 locally
- **Reporters:** HTML, JSON, JUnit

## Page Object Model
All page interactions are encapsulated in Page Objects located in `src/automationScripts/pages/`:
- **DashboardPage:** KPI interactions, dashboard navigation
- **AnalyticsPage:** Chart interactions, pattern analysis, trend analysis
- **CardManagementPage:** Card selection, comparison, details
- **LoginPage:** Authentication (shared across all tests)

## Logging
All test executions are logged using Winston logger:
- Console output for real-time monitoring
- File output in `test-execution.log`

## Test Results
Test results are generated in multiple formats:
- **HTML Report:** `test-results/html-report/`
- **JSON Report:** `test-results/results.json`
- **JUnit XML:** `test-results/junit.xml`

## CI/CD Integration
Framework is CI/CD ready with:
- Environment variable support for BASE_URL
- Retry mechanism for flaky tests
- Multiple report formats for integration
- Video and screenshot capture on failure

## Best Practices Implemented
✅ Page Object Model (POM) design pattern
✅ No locators in test files
✅ Reusable methods across page objects
✅ Playwright native waits (no arbitrary timeouts)
✅ Comprehensive logging
✅ State assertions before interactions
✅ Error handling and retry mechanisms
✅ Cross-browser testing
✅ Responsive design testing

## Test Case Traceability
Each test case is mapped to TestRail:
- Test case IDs in test names (e.g., QE-8167-TS001-TC001)
- Full coverage of 36 TestRail test cases
- Organized by feature/functionality

## Support
For issues or questions, contact the QE Team.
