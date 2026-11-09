# Credit Card Management - Playwright Automation Suite

## Overview
Production-ready Playwright JavaScript automation suite for Credit Card Management Application with complete test coverage for Dashboard, Transactions, and Analytics features.

## Test Coverage
- **20 Test Cases** mapped to TestRail IDs (TC-4630 to TC-4649)
- **3 Feature Modules:** Dashboard (6 tests), Transactions (7 tests), Analytics (7 tests)
- **Page Object Model** architecture for maintainability
- **Comprehensive logging** with Winston logger

## Project Structure
```
src/
├── automationScripts/
│   ├── dashboard.spec.js (6 tests)
│   ├── transactions.spec.js (7 tests)
│   ├── analytics.spec.js (7 tests)
│   └── pages/
│       ├── login.page.js
│       ├── dashboard.page.js
│       ├── transactions.page.js
│       └── analytics.page.js
├── data/
│   ├── testData.json (user credentials, test data)
│   └── config.json (environment configuration)
└── utils/
    └── logger.js (winston logging utility)
```

## Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

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

### Run specific feature tests
```bash
npm run test:dashboard
npm run test:transactions
npm run test:analytics
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Debug tests
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

## Test Cases

### Dashboard Tests (6 tests)
- TC-4630: Mobile responsive layout (375px)
- TC-4631: Tablet responsive layout (768px)
- TC-4632: Narrow screen handling (320px)
- TC-4643: Multiple credit cards KPI aggregation
- TC-4644: Single credit card KPI display
- TC-4645: Service unavailability error handling

### Transaction Tests (7 tests)
- TC-4633: Aggregated transaction list display
- TC-4634: Transaction detail view
- TC-4635: Transaction service unavailability
- TC-4639: Date range filter performance (<2 seconds)
- TC-4640: Multiple simultaneous filters
- TC-4641: Invalid date range validation
- TC-4642: Future date validation

### Analytics Tests (7 tests)
- TC-4646: Category-wise spending chart (9 categories)
- TC-4647: Category drill-down functionality
- TC-4648: No transaction history handling
- TC-4649: All miscellaneous transactions handling
- TC-4636: Monthly trend chart (6+ months)
- TC-4637: Monthly data point drill-down
- TC-4638: Limited historical data handling

## Configuration

### Environment Configuration (src/data/config.json)
```json
{
  "baseUrl": "https://app.creditcard.demo",
  "apiBaseUrl": "https://api.creditcard.demo/v1",
  "timeout": 30000
}
```

### Test Data (src/data/testData.json)
Contains user credentials, date ranges, categories, and expected KPI values for all test scenarios.

## Logging
All test execution logs are written to:
- **Console output:** Real-time test progress
- **File output:** `logs/automation.log`

Log format: `[YYYY-MM-DD HH:mm:ss] LEVEL: message`

## Test Reports
Playwright generates multiple report formats:
- **HTML Report:** Interactive test results with screenshots and videos
- **JUnit XML:** `test-results/junit.xml` (CI/CD integration)
- **JSON Report:** `test-results/results.json` (custom processing)

## Cross-Browser Testing
Tests run on multiple browsers:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Features
✅ Page Object Model architecture
✅ Zero locators in test files
✅ Comprehensive logging with Winston
✅ Environment-based configuration
✅ Data-driven testing
✅ Cross-browser support
✅ Mobile responsive testing
✅ Performance validation (<2 second response times)
✅ Error handling and fallback validation
✅ Screenshot and video capture on failure
✅ Parallel test execution
✅ CI/CD ready with JUnit reports

## Best Practices Implemented
1. **Page Object Model:** All locators in page classes
2. **Reusable methods:** Login, navigation, assertions
3. **Playwright auto-waiting:** No explicit waits except where necessary
4. **Environment separation:** Config and test data externalized
5. **Comprehensive logging:** Every test step logged
6. **Error handling:** Service unavailability scenarios covered
7. **Assertions before actions:** All interactions preceded by visibility checks
8. **Zero syntax errors:** Production-ready code

## Maintenance
- **Update locators:** Modify page object files in `src/automationScripts/pages/`
- **Update test data:** Edit `src/data/testData.json`
- **Update environment:** Edit `src/data/config.json`
- **Add new tests:** Follow existing pattern in spec files

## Traceability
Every test case includes TestRail ID in test name for complete traceability:
```javascript
test('TC-4630: Verify dashboard layout responsiveness on mobile device', async ({ page }) => {
  // Test implementation
});
```

## Support
For issues or questions, contact the DevOps team.

## License
ISC
