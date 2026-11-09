# Credit Card Dashboard - Playwright Automation Framework

## Overview
Production-ready Playwright JavaScript automation framework for Credit Card Dashboard application covering 63 test cases across Dashboard, Card Management, and Transaction Analytics features.

## Project Structure
```
├── src/
│   ├── automationScripts/
│   │   ├── dashboard.spec.js
│   │   ├── cardManagement.spec.js
│   │   ├── transactionAnalytics.spec.js
│   │   └── pages/
│   │       ├── dashboard.page.js
│   │       ├── cardManagement.page.js
│   │       ├── transactionAnalytics.page.js
│   │       └── login.page.js
│   └── data/
│       ├── testData.json
│       └── config.json
├── playwright.config.js
├── package.json
└── README.md
```

## Test Coverage

### Dashboard Tests (8 test cases)
- QE-8167: KPI dashboard load time and accuracy
- QE-8165: Responsive layout (mobile, tablet)
- QE-8161: Real-time data refresh and caching

### Card Management Tests (9 test cases)
- QE-8162: Multi-card display and error handling
- QE-8166: Card-specific analysis and performance
- QE-8157: Individual card detail views
- QE-8158: Card comparison capabilities

### Transaction Analytics Tests (10 test cases)
- QE-8169: Interactive category drill-down
- QE-8164: Category-wise spending visualization
- QE-8163: 12-month trend analysis
- QE-8168: Pattern analysis and anomaly detection

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
npm run test:cards
npm run test:analytics
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

### View test report
```bash
npm run report
```

## Configuration

### Base URL
Update `src/automationScripts/data/config.json`:
```json
{
  "baseUrl": "https://creditcard.app.com"
}
```

### Test Data
Update `src/automationScripts/data/testData.json` with valid credentials and test data.

### Playwright Configuration
Modify `playwright.config.js` for:
- Browser selection
- Parallel execution
- Retry logic
- Screenshot/video capture
- Timeout settings

## Page Object Model

All test scripts follow strict Page Object Model:
- **Locators**: Defined in Page Object classes
- **Methods**: Reusable actions in Page Objects
- **Test Specs**: Only test logic, no locators

### Example Page Object
```javascript
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
  }
  
  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }
};
```

## Best Practices

✅ **Playwright native waits** - Auto-waiting with `expect().toBeVisible()`
✅ **No explicit waits** - Avoid `waitForTimeout()` except for specific scenarios
✅ **Page Object Model** - All locators in Page Objects
✅ **Reusable methods** - Shared logic across tests
✅ **Externalized data** - Test data and config in JSON files
✅ **Error handling** - Proper try-catch where needed
✅ **Assertions** - Playwright expect only

## Test Data Requirements

### Valid User Credentials
- Username: testuser
- Password: Pass@123

### Test Users
- `testuser_multicard`: User with multiple credit cards
- `testuser_12months`: User with 12 months transaction history
- `testuser_3months`: User with 3 months transaction history
- `testuser_large_data`: User with 1000+ transactions

## CI/CD Integration

The framework is CI/CD ready with:
- Configurable retry logic
- Parallel execution support
- HTML reporting
- Screenshot/video on failure
- Environment-based configuration

## Troubleshooting

### Tests failing due to timeout
- Increase timeout in `playwright.config.js`
- Check network connectivity
- Verify base URL is correct

### Locators not found
- Verify `data-testid` attributes exist in application
- Check if application is loaded properly
- Review Page Object locators

### Authentication issues
- Verify credentials in `testData.json`
- Check if login page URL is correct
- Review login flow in `login.page.js`

## Support

For issues or questions:
- Review test execution logs
- Check Playwright HTML report
- Verify application state during test execution

## Version History

### v1.0.0 (Initial Release)
- 63 test cases automated
- Page Object Model implementation
- Multi-browser support
- Responsive testing support
- CI/CD ready configuration
