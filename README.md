# Credit Card Dashboard - Playwright Automation

## Project: CreditCardNew20261109185933

This repository contains production-ready Playwright JavaScript automation scripts for the Credit Card Dashboard application.

## Test Coverage

This automation suite covers **18 test cases** across **6 features**:

### 1. Dashboard KPIs (QE-8971)
- QE-8971 TS-001 TC-001: Dashboard loads within 2 seconds with aggregated KPIs
- QE-8971 TS-002 TC-001: Dashboard displays zero/N/A values when no cards registered
- QE-8971 TS-003 TC-001: Dashboard displays error message when backend service unavailable

### 2. Spending Analytics (QE-8970)
- QE-8970 TS-001 TC-001: Category-wise spending breakdown visualization
- QE-8970 TS-002 TC-001: Zero values display when no transaction history
- QE-8970 TS-003 TC-001: Time period filtering and recalculation

### 3. Responsive Dashboard (QE-8969)
- QE-8969 TS-001 TC-001: Mobile responsive layout within 2 seconds
- QE-8969 TS-002 TC-001: Compatibility warning on unsupported browser
- QE-8969 TS-003 TC-001: Tablet responsive layout with optimized grid

### 4. Card Management (QE-8968)
- QE-8968 TS-001 TC-001: Detailed spending analysis for selected card
- QE-8968 TS-002 TC-001: Warning message for deactivated card
- QE-8968 TS-003 TC-001: Data integrity when comparing multiple cards

### 5. Monthly Trends (QE-8967)
- QE-8967 TS-001 TC-001: Interactive line chart with accurate data points
- QE-8967 TS-002 TC-001: Insufficient data message for <3 months history
- QE-8967 TS-003 TC-001: Detailed tooltips on chart hover

### 6. Multiple Cards Display (QE-8966)
- QE-8966 TS-001 TC-001: Display all cards with masked numbers
- QE-8966 TS-002 TC-001: Error message with retry on service failure
- QE-8966 TS-003 TC-001: Performance test for 20 cards within 1 second

## Architecture

### Page Object Model (POM)
All automation scripts follow the Page Object Model design pattern for maintainability and reusability.

**Page Objects:**
- `src/automationScripts/pages/login.page.js` - Login page interactions
- `src/automationScripts/pages/dashboard.page.js` - Dashboard KPI interactions
- `src/automationScripts/pages/analytics.page.js` - Analytics and trends interactions
- `src/automationScripts/pages/card-management.page.js` - Card management interactions

**Test Specs:**
- `src/automationScripts/dashboard-kpis.spec.js`
- `src/automationScripts/spending-analytics.spec.js`
- `src/automationScripts/responsive-dashboard.spec.js`
- `src/automationScripts/card-management.spec.js`
- `src/automationScripts/monthly-trends.spec.js`
- `src/automationScripts/multiple-cards.spec.js`

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Configuration

Update `src/data/config.json` with your application URL and settings:

```json
{
  "baseURL": "https://creditcard-dashboard.example.com",
  "timeout": 30000,
  "retries": 2,
  "headless": true
}
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific feature tests
```bash
npm run test:dashboard-kpis
npm run test:spending-analytics
npm run test:responsive-dashboard
npm run test:card-management
npm run test:monthly-trends
npm run test:multiple-cards
```

### Run in headed mode (see browser)
```bash
npm run test:headed
```

### Debug mode
```bash
npm run test:debug
```

### UI mode (interactive)
```bash
npm run test:ui
```

### View test report
```bash
npm run test:report
```

## Test Execution on Multiple Browsers

Tests are configured to run on:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Microsoft Edge

## Logging

All test execution logs are stored in the `logs/` directory:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

Logs include timestamps, test case IDs, and detailed step information.

## Test Reports

After test execution, reports are generated in:
- `playwright-report/` - HTML report
- `test-results/results.json` - JSON report
- `test-results/junit.xml` - JUnit XML report

## CI/CD Integration

This automation suite is ready for CI/CD integration. Example GitHub Actions workflow:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, CreditCardNew20261109185933 ]
  pull_request:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Best Practices Implemented

✅ Page Object Model (POM) design pattern  
✅ Comprehensive logging with Winston  
✅ Configurable test data and environment settings  
✅ Multiple locator strategies (data-testid, CSS, text)  
✅ Explicit waits and proper synchronization  
✅ Cross-browser testing support  
✅ Mobile and responsive testing  
✅ Screenshot and video capture on failure  
✅ Trace recording for debugging  
✅ Detailed HTML and JSON reports  
✅ Retry mechanism for flaky tests  
✅ Parallel test execution  

## Maintenance

When application changes:
1. Update page objects in `src/automationScripts/pages/`
2. Update test data in `src/data/config.json`
3. Update locators if UI elements change
4. Run tests to verify changes

## Support

For issues or questions, contact the DevOps Integration team.

## License

ISC