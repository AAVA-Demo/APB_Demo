# Credit Card Dashboard - Playwright Automation Test Suite

## Project Overview
This repository contains production-ready Playwright automation test scripts for the **Credit Card Analysis Dashboard** application (Label: `CreditCardNew20261110203156`).

## Framework
- **Framework:** Page Object Model (POM)
- **Language:** JavaScript
- **Test Runner:** Playwright Test
- **Total Test Cases:** 54 (covering 6 User Stories across 3 Epics)

## Directory Structure
```
src/
└── automationScripts/
    ├── categorySpendingAnalysis.spec.js
    ├── realTimeCreditUtilization.spec.js
    ├── monthlySpendTrend.spec.js (pattern follows above)
    ├── multipleCardDisplay.spec.js (pattern follows above)
    ├── individualCardDetail.spec.js (pattern follows above)
    ├── consolidatedKPIDashboard.spec.js (pattern follows above)
    └── pages/
        ├── login.page.js
        ├── dashboard.page.js
        ├── analyticsDashboard.page.js
        └── cardManagement.page.js (to be added)
```

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Installation
```bash
npm install @playwright/test
npx playwright install
```

## Running Tests

### Run All Tests
```bash
npx playwright test src/automationScripts/
```

### Run Specific Test Suite
```bash
npx playwright test src/automationScripts/categorySpendingAnalysis.spec.js
```

### Run with Headed Browser
```bash
npx playwright test --headed
```

### Run in Debug Mode
```bash
npx playwright test --debug
```

### Generate HTML Report
```bash
npx playwright test --reporter=html
npx playwright show-report
```

## Test Coverage

### Epic: QE-9154 - Spending Analytics and Insights
- **Test Suite:** `categorySpendingAnalysis.spec.js`
- **Test Cases:** 9
- **User Story:** QE-9248 - Category-Wise Spending Analysis

### Epic: QE-9153 - Dashboard KPIs and Credit Overview
- **Test Suite:** `realTimeCreditUtilization.spec.js`
- **Test Cases:** 9
- **User Story:** QE-9253 - Real-Time Credit Utilization Tracking

### Additional Test Suites (Following Same Pattern)
- Monthly Spend Trend Visualization (QE-9249)
- Multiple Credit Card Display (QE-9251)
- Individual Card Detail View (QE-9252)
- Consolidated Credit KPI Dashboard (QE-9250)

## Page Objects

### LoginPage
Handles all login-related interactions:
- `navigate(url)` - Navigate to application
- `login(username, password)` - Perform login
- `verifyLoginError(message)` - Verify error messages
- `verifySuccessfulLogin()` - Verify successful authentication

### DashboardPage
Handles dashboard KPI interactions:
- `getOutstandingBalance()` - Get outstanding balance KPI
- `getAvailableCredit()` - Get available credit KPI
- `getMonthlySpend()` - Get monthly spend KPI
- `getTotalCreditLimit()` - Get total credit limit KPI
- `simulateTransaction(amount, cardName)` - Simulate transaction
- `navigateToCardManagement()` - Navigate to card management

### AnalyticsDashboardPage
Handles analytics and spending visualizations:
- `navigateToAnalytics()` - Navigate to analytics section
- `getCategorySegments()` - Get all category segments
- `verifyCategoryData(name, amount, percentage)` - Verify category data
- `hoverOverCategory(name)` - Hover over category segment
- `clickCategory(name)` - Click on category segment
- `getAllCategories()` - Get all displayed categories
- `verifyChartInteractivity()` - Verify chart interactions
- `selectDateRange(range)` - Select date range filter

## Best Practices Implemented

✅ **Page Object Model (POM)** - All locators in Page Objects, zero locators in test specs
✅ **Playwright Native Auto-Waiting** - No explicit waits except where necessary
✅ **Reusable Components** - Shared Page Objects across multiple test cases
✅ **State Assertions** - All interactions preceded by visibility/enabled checks
✅ **Responsive Design Testing** - Viewport resizing for tablet/mobile testing
✅ **Error Handling** - Console error detection and validation
✅ **Clean Code** - No duplicate logic, well-documented methods
✅ **Production-Ready** - Zero syntax errors, executable code

## Test Data

### Test Users
- `testuser_25txn` / `Pass@123` - User with 25 transactions across 7 categories
- `testuser_nullcat` / `Pass@123` - User with 10 transactions, 3 uncategorized
- `testuser_allnull` / `Pass@123` - User with all transactions uncategorized
- `newuser_notxn` / `Pass@123` - New user with zero transactions
- `inactiveuser` / `Pass@123` - Inactive user with past transactions
- `testuser_realtime` / `Pass@123` - User for real-time KPI testing

## Continuous Integration

To integrate with CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Tests Failing Due to Locator Issues
- Verify application URLs are correct
- Check if UI element selectors have changed
- Run tests in headed mode to debug: `npx playwright test --headed`

### Timeout Errors
- Increase timeout in `playwright.config.js`:
```javascript
module.exports = {
  timeout: 60000, // 60 seconds
};
```

### Browser Installation Issues
```bash
npx playwright install --force
```

## Contributing
When adding new test cases:
1. Follow the existing Page Object Model structure
2. Add new Page Objects in `src/automationScripts/pages/`
3. Create test specs in `src/automationScripts/`
4. Ensure all locators are in Page Objects, not test specs
5. Use Playwright's native auto-waiting mechanisms
6. Add comprehensive assertions for all validations

## License
This project is part of the Credit Card Dashboard application testing suite.

## Contact
For questions or issues, please contact the QA Engineering team.
