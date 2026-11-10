# Credit Card Dashboard - Playwright Automation

## Overview
Production-ready Playwright JavaScript automation suite for Credit Card Analysis Dashboard.

## Project Structure
```
├── src/
│   ├── automationScripts/
│   │   ├── creditCardDashboard.spec.js  # Main test suite (20 test cases)
│   │   └── pages/                        # Page Object Model
│   │       ├── login.page.js
│   │       ├── dashboard.page.js
│   │       ├── myCards.page.js
│   │       └── analytics.page.js
│   └── utils/
│       └── logger.js                     # Winston logger
├── playwright.config.js                  # Playwright configuration
├── package.json                          # Dependencies
└── README.md                             # This file
```

## Test Coverage
- **Total Test Cases**: 20
- **Dashboard Tests**: 8 (TC-6955, TC-6957, TC-6959, TC-6933, TC-6935, TC-6937, TC-6939, TC-6941)
- **My Cards Tests**: 6 (TC-6943, TC-6945, TC-6947, TC-6949, TC-6951, TC-6953)
- **Analytics Tests**: 6 (TC-6961, TC-6963, TC-6964, TC-6927, TC-6929, TC-6931)

## Features Tested
1. **Dashboard KPIs**
   - Monthly Spend Display
   - Credit Limit Aggregation
   - Available Credit Tracking
   - Outstanding Amount Monitoring
   - Credit Utilization Rate with Color Indicators

2. **Multi-Card Management**
   - Display up to 20 cards with masked numbers
   - Card retrieval within 300ms
   - Pagination/error handling for excess cards
   - Authentication token validation
   - Card comparison feature
   - Zero transaction card handling

3. **Analytics & Insights**
   - Category-wise spending across 9 categories
   - Uncategorized transaction handling
   - Percentage calculation and top category identification
   - 12-month trend analysis
   - Category filter performance (500ms)

## Prerequisites
- Node.js 16+
- npm or yarn

## Installation
```bash
npm install
```

## Running Tests
```bash
# Run all tests
npm test

# Run in headed mode
npm run test:headed

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run mobile tests
npm run test:mobile

# Debug mode
npm run test:debug

# View report
npm run report
```

## Test Execution
Tests are executed in parallel across multiple browsers:
- Desktop: Chrome, Firefox, Safari
- Mobile: Pixel 5 (Chrome), iPhone 12 (Safari)

## Reporting
- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/junit.xml`
- **Logs**: `logs/combined.log`, `logs/error.log`

## Page Object Model
All locators are centralized in page classes:
- `LoginPage`: Authentication flows
- `DashboardPage`: KPI widgets, utilization indicators
- `MyCardsPage`: Card list, comparison, filtering
- `AnalyticsPage`: Category breakdown, trend charts

## Logging
Winston logger provides:
- Console output with colors
- File logging (combined.log, error.log)
- Timestamp and service metadata

## Best Practices
- ✅ Page Object Model (POM) architecture
- ✅ No locators in spec files
- ✅ Reusable page methods
- ✅ Native Playwright waits (no hardcoded delays)
- ✅ Comprehensive logging
- ✅ Multi-browser support
- ✅ Parallel execution
- ✅ Screenshot/video on failure
- ✅ Trace on retry

## Test Data
Test users:
- `testuser@example.com` - Standard user with transactions
- `notransactions@example.com` - User with no transactions
- `multicard@example.com` - User with multiple cards
- `zerolimit@example.com` - User with zero credit limit card
- `lowutilization@example.com` - Low utilization (<30%)
- `mediumutilization@example.com` - Medium utilization (30-70%)
- `highutilization@example.com` - High utilization (>70%)
- `twentycards@example.com` - User with 20 cards
- `twentyfivecards@example.com` - User with 25 cards (excess)
- `notransactioncard@example.com` - Card with no transactions
- `uncategorized@example.com` - User with uncategorized transactions
- `newuser@example.com` - User with insufficient history

## Categories Tested
1. Food & Dining
2. Fuel
3. Shopping
4. Travel
5. Entertainment
6. Utilities
7. Healthcare
8. Education
9. Miscellaneous

## Performance Benchmarks
- Dashboard load: ≤ 2 seconds
- Card retrieval: ≤ 300ms
- Trend chart render: ≤ 500ms
- Category filter: ≤ 500ms

## Error Handling
- Service unavailability (cached data fallback)
- Invalid authentication tokens
- Incomplete/corrupted data
- Zero credit limit edge cases
- Insufficient transaction history

## Maintenance
- Update locators in page objects only
- Add new test cases to `creditCardDashboard.spec.js`
- Extend page objects for new features
- Update test data as needed

## CI/CD Integration
Ready for integration with:
- Jenkins
- GitHub Actions
- GitLab CI
- Azure DevOps

## Support
For issues or questions, contact the QA Team.