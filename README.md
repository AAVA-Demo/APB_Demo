# Credit Card Dashboard - Playwright Automation

## Overview

This repository contains Playwright automation test scripts for the Credit Card Analysis Dashboard application. The tests are organized using the Page Object Model (POM) framework and follow enterprise best practices for maintainability, scalability, and reliability.

## Project Structure

```
.
├── tests/                      # Test specification files
│   └── dashboard.spec.js       # Dashboard KPI and Analytics tests
├── pages/                      # Page Object Model classes
│   ├── dashboard.page.js       # Dashboard page object
│   └── login.page.js           # Login page object
├── utils/                      # Utility modules
│   └── logger.js               # Custom logging utility
├── playwright.config.js        # Playwright configuration
├── package.json                # Project dependencies
└── README.md                   # This file
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd creditcard-dashboard-automation
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Configuration

### Environment Variables

Set the `BASE_URL` environment variable to point to your application:

```bash
export BASE_URL=https://your-app-url.com
```

Or create a `.env` file in the project root:

```
BASE_URL=https://your-app-url.com
```

### Playwright Configuration

The `playwright.config.js` file contains all test execution settings including:
- Test timeout: 60 seconds
- Expect timeout: 10 seconds
- Retry strategy: 2 retries in CI, 0 locally
- Browsers: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- Reporters: HTML, JSON, JUnit

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in headed mode:
```bash
npm run test:headed
```

### Run tests in debug mode:
```bash
npm run test:debug
```

### Run tests on specific browser:
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run mobile tests:
```bash
npm run test:mobile
```

### View test report:
```bash
npm run report
```

## Test Coverage

### Dashboard KPI Tests (QE-9139)
- ✅ Verify user with active credit cards views all four KPI cards with correct aggregated values
- ✅ Verify KPI refresh when new transaction is processed
- ✅ Verify user with no current month transactions sees monthly spend as $0
- ✅ Verify Outstanding Amount equals Total Credit Limit minus Available Credit

### Monthly Trend Analysis Tests (QE-9138)
- ✅ Verify user with 6 months history views monthly trend chart with all 6 months
- ✅ Verify monthly trend chart interaction and tooltip display
- ✅ Verify user with 1 month history sees insufficient data message
- ✅ Verify clicking on month drills down to show all transactions

### Category Drill-Down Tests (QE-9137)
- ✅ Verify clicking on Food & Dining drills down with filtering options
- ✅ Verify date range filter in drill-down shows only filtered transactions
- ✅ Verify category with one transaction shows no sub-category breakdown

## Page Object Model

All page interactions are abstracted into Page Object classes located in the `pages/` directory. This ensures:
- **Maintainability**: Changes to UI elements only require updates in one place
- **Reusability**: Page methods can be reused across multiple tests
- **Readability**: Test code focuses on business logic, not implementation details

### Example Page Object Usage:

```javascript
const { DashboardPage } = require('../pages/dashboard.page');
const dashboardPage = new DashboardPage(page);

await dashboardPage.navigate();
const monthlySpend = await dashboardPage.getMonthlySpendValue();
expect(monthlySpend).toBe('$2,500.00');
```

## Locator Strategy

All locators use `data-testid` attributes for maximum stability:

```javascript
this.monthlySpendCard = page.locator('[data-testid="kpi-monthly-spend"]');
```

**Benefits:**
- Decouples tests from implementation details
- Survives CSS class and structure changes
- Clear intent for test automation

## Logging

The custom Logger utility provides timestamped logging at multiple levels:

```javascript
Logger.info('User authenticated and redirected to dashboard');
Logger.error('Failed to load KPI data');
Logger.warn('Slow network detected');
Logger.debug('Response payload: ' + JSON.stringify(data));
```

Logs are output to console with ISO timestamps for easy debugging and traceability.

## Best Practices

1. **No Hardcoded Waits**: Use Playwright's auto-waiting and explicit waits with conditions
2. **Assertions Only with `expect`**: Never use `assert` or other assertion libraries
3. **Locators in Page Objects**: All locators defined in Page Object constructors
4. **Descriptive Test Names**: Test names clearly describe the scenario being tested
5. **Comprehensive Logging**: Every major action is logged for debugging
6. **Error Handling**: Tests gracefully handle errors and provide clear failure messages
7. **Data-Driven**: Test data is parameterized and can be externalized

## CI/CD Integration

The test suite is designed for CI/CD integration with:
- JUnit XML output for test result parsing
- JSON output for custom reporting
- HTML report for human-readable results
- Screenshot and video capture on failure
- Trace files for debugging

### Example CI Configuration (GitHub Actions):

```yaml
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
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Tests fail with "Element not found"
- Verify the application is running and accessible at the configured `BASE_URL`
- Check that `data-testid` attributes are present in the application HTML
- Increase timeout values if the application is slow to load

### Tests fail with "Timeout exceeded"
- Check network connectivity to the application
- Verify the application is not experiencing performance issues
- Review the trace files in `test-results/` for detailed execution timeline

### Tests pass locally but fail in CI
- Ensure all Playwright browsers are installed in CI environment
- Check for timing issues due to slower CI environment (increase timeouts if needed)
- Verify environment variables are correctly set in CI

## Contributing

When adding new tests:
1. Follow the existing Page Object Model structure
2. Add locators to the appropriate Page Object class
3. Use descriptive test names following the pattern: `[Test ID] - [Description]`
4. Add comprehensive logging for debugging
5. Update this README with new test coverage

## License

ISC

## Contact

For questions or issues, contact the DevOps Integration Team.
