# Credit Card Dashboard - Playwright Automation Tests

## Project: CreditCardNew20261109161803

This repository contains comprehensive Playwright automation tests for the Credit Card Dashboard application.

## Test Coverage

### Dashboard Tests (dashboard.spec.js)
- QE-8251: Aggregated dashboard metrics load within 2 seconds
- QE-8233: Aggregated KPI calculation across multiple cards
- QE-8248: Real-time KPI updates within 30 seconds
- QE-8247: Mobile responsive dashboard loads within 2 seconds
- QE-8252: Portfolio overview displays all credit cards
- QE-8238: Screen reader accessibility with proper ARIA labels
- QE-8238: Keyboard navigation with visible focus indicators

### Transaction Tests (transactions.spec.js)
- QE-8258: Complete transaction list across all credit cards
- QE-8258: Multi-column sorting support
- QE-8235: Date range filter updates within 500ms
- QE-8249: Multi-criteria filter returns results within 500ms
- QE-8249: Fuzzy merchant search returns relevant transactions
- QE-8242: Large volume pagination performs smoothly

### Analytics Tests (analytics.spec.js)
- QE-8259: Monthly spend trend chart displays correctly
- QE-8257: Nine-category spending visualization
- QE-8256: Chart drill-down renders within 1 second
- QE-8241: Interactive charts render within 1 second
- QE-8250: Multi-card spend comparison with category breakdown
- QE-8243: Monthly trend shows increasing/decreasing patterns

### Card Management Tests (cardManagement.spec.js)
- QE-8246: Comprehensive card details are displayed
- QE-8245: Fast card navigation loads within 500ms
- QE-8237: Multi-card selection updates within 500ms
- QE-8237: Rapid card switching maintains data consistency
- QE-8244: Card comparison identifies highest usage

## Project Structure

```
playwright-tests/
├── src/
│   ├── automationScripts/
│   │   ├── dashboard.spec.js
│   │   ├── transactions.spec.js
│   │   ├── analytics.spec.js
│   │   ├── cardManagement.spec.js
│   │   └── pages/
│   │       ├── dashboard.page.js
│   │       ├── transaction.page.js
│   │       ├── analytics.page.js
│   │       └── cardManagement.page.js
│   └── utils/
│       └── logger.js
├── logs/
├── test-results/
├── playwright.config.js
├── package.json
└── README.md
```

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

### Run specific test suite
```bash
npm run test:dashboard
npm run test:transactions
npm run test:analytics
npm run test:cards
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI mode
```bash
npm run test:ui
```

### View test report
```bash
npm run report
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
BASE_URL=https://creditcard-dashboard.example.com
LOG_LEVEL=info
NODE_ENV=development
```

### Browser Configuration

Tests are configured to run on:
- Desktop Chrome
- Desktop Firefox
- Desktop Safari
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Page Object Model

All tests follow the Page Object Model (POM) design pattern:

- **Page Objects**: Located in `src/automationScripts/pages/`
- **Test Specs**: Located in `src/automationScripts/`
- **Utilities**: Located in `src/utils/`

### Page Object Example

```javascript
const { DashboardPage } = require('./pages/dashboard.page');

test('Verify dashboard loads', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.navigate();
  await dashboardPage.waitForDashboardLoad();
  
  const monthlySpend = await dashboardPage.getMonthlySpend();
  expect(monthlySpend).toBeDefined();
});
```

## Logging

All tests use Winston logger for comprehensive logging:

- **Error logs**: `logs/error.log`
- **Combined logs**: `logs/combined.log`
- **Console output**: Enabled in development mode

## Test Reports

Test results are generated in multiple formats:

- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/junit.xml`

## Best Practices

1. **All locators in Page Objects**: No locators in test files
2. **Playwright auto-waiting**: Use native `expect()` assertions
3. **No hardcoded waits**: Minimal use of `waitForTimeout`
4. **Comprehensive logging**: Every action is logged
5. **State assertions**: All interactions preceded by visibility checks
6. **Reusable methods**: Shared logic in Page Objects

## Performance Thresholds

- Dashboard load: < 2 seconds
- Card navigation: < 500ms
- Transaction filter: < 500ms
- Chart drill-down: < 1 second
- Real-time refresh: < 30 seconds

## Accessibility Testing

- ARIA labels verification
- Keyboard navigation support
- Focus indicator visibility
- Screen reader compatibility

## CI/CD Integration

Tests are configured for CI/CD pipelines:

- Automatic retries on failure (2 retries in CI)
- Parallel execution support
- Screenshot on failure
- Video recording on failure
- Trace on first retry

## Support

For issues or questions, please contact the AAVA QA Team.

## License

ISC