# Credit Card Analysis Dashboard - Playwright Automation

## Overview
Production-ready Playwright JavaScript automation framework for Credit Card Analysis Dashboard using Page Object Model (POM).

## Project Structure
```
├── src/
│   ├── automationScripts/
│   │   ├── dashboard.spec.js          # Dashboard KPI & Responsive Layout tests
│   │   ├── analytics.spec.js          # Monthly Trends & Category-wise tests
│   │   ├── cardManagement.spec.js     # Card Display & Spend Analysis tests
│   │   └── pages/
│   │       ├── login.page.js          # Login page object
│   │       ├── dashboard.page.js      # Dashboard page object
│   │       ├── analytics.page.js      # Analytics page object
│   │       └── cardManagement.page.js # Card Management page object
│   └── utils/
│       └── logger.js                  # Winston logging utility
├── logs/                              # Test execution logs
├── test-results/                      # Test reports and artifacts
├── playwright.config.js               # Playwright configuration
├── package.json                       # Dependencies
└── README.md                          # This file
```

## Test Coverage

### Dashboard Tests (dashboard.spec.js)
- **QE-7526 TS-001 TC-001**: Dashboard KPI Real-Time Display
- **QE-7526 TS-002 TC-001**: No Credit Cards Scenario
- **QE-7526 TS-003 TC-001**: Backend Service Unavailable
- **QE-7527 TS-001 TC-001**: Mobile Responsive Layout (375px)
- **QE-7527 TS-002 TC-001**: Extremely Small Viewport (320px)
- **QE-7527 TS-003 TC-001**: Dynamic Layout Adjustment

### Analytics Tests (analytics.spec.js)
- **QE-7525 TS-001 TC-001**: 12 Months Trend Analysis
- **QE-7525 TS-002 TC-001**: Partial History (6 months)
- **QE-7525 TS-003 TC-001**: Aggregation Service Failure
- **QE-7522 TS-001 TC-001**: Category-wise Visualization
- **QE-7522 TS-001 TC-002**: Interactive Filtering and Drill-down
- **QE-7522 TS-002 TC-001**: Uncategorizable Transactions
- **QE-7522 TS-003 TC-001**: Categorization Service Failure

### Card Management Tests (cardManagement.spec.js)
- **QE-7523 TS-001 TC-001**: Multiple Cards Display (5 cards)
- **QE-7523 TS-002 TC-001**: Multiple Cards (12 cards)
- **QE-7523 TS-003 TC-001**: Card Repository Unavailable
- **QE-7524 TS-001 TC-001**: Card-Wise Spend Analysis
- **QE-7524 TS-002 TC-001**: No Transaction History
- **QE-7524 TS-003 TC-001**: Spend Analysis Engine Failure

## Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation
```bash
npm install
npx playwright install
```

### Environment Configuration
Create a `.env` file (optional):
```
BASE_URL=https://app.creditcard-dashboard.com
LOG_LEVEL=info
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test suite
```bash
npm run test:dashboard
npm run test:analytics
npm run test:cards
```

### Run in headed mode
```bash
npm run test:headed
```

### Debug mode
```bash
npm run test:debug
```

### UI mode
```bash
npm run test:ui
```

### View test report
```bash
npm run report
```

## Page Object Model Architecture

### Design Principles
1. **All locators in Page Objects** - Never in spec files
2. **Reusable methods** - Shared across multiple test cases
3. **Single Page Object per feature** - Not per test case
4. **Playwright auto-waiting** - No explicit waits unless necessary
5. **Logging utility** - All actions logged via Winston
6. **Playwright expect** - Only Playwright assertions used

### Page Objects

#### LoginPage
- `navigate()` - Navigate to login page
- `login(username, password)` - Perform login
- `getErrorMessage()` - Get login error message

#### DashboardPage
- `waitForDashboardLoad()` - Wait for dashboard to load
- `getMonthlySpendValue()` - Get monthly spend KPI
- `getTotalCreditLimitValue()` - Get total credit limit KPI
- `getAvailableCreditValue()` - Get available credit KPI
- `getOutstandingAmountValue()` - Get outstanding amount KPI
- `navigateToAnalytics()` - Navigate to Analytics section
- `navigateToCardManagement()` - Navigate to Card Management
- `isKPILayoutStacked()` - Check if layout is stacked (mobile)
- `isDesktopLayout()` - Check if desktop layout
- `isMobileLayout()` - Check if mobile layout

#### AnalyticsPage
- `selectMonthlyTrendsView()` - Select monthly trends view
- `selectCategoryWiseView()` - Select category-wise view
- `waitForTrendsChartLoad()` - Wait for trends chart
- `waitForCategoryChartLoad()` - Wait for category chart
- `getTrendsChartMonthsCount()` - Get number of months displayed
- `getMonthlyTrendsData()` - Get monthly trends data
- `getCategorySpendingData()` - Get category spending data
- `selectCategoryFilter(category)` - Apply category filter
- `clickCategorySegment(category)` - Click category for drill-down
- `isDrillDownViewVisible()` - Check drill-down view visibility

#### CardManagementPage
- `waitForCardsLoad()` - Wait for cards to load
- `getDisplayedCardCount()` - Get number of cards displayed
- `getAllCardDetails()` - Get all card details
- `selectCardByName(cardName)` - Select card by name
- `selectCardByIndex(index)` - Select card by index
- `getCardSpendAnalysis()` - Get card spending analysis
- `getNoTransactionsMessage()` - Get no transactions message

## Logging

All test actions are logged using Winston logger:
- **Console output** - Colored logs in terminal
- **test-execution.log** - All logs (info, warn, error)
- **error.log** - Error logs only

Logs are located in `logs/` directory.

## Test Reports

Multiple report formats generated:
- **HTML Report** - `test-results/html-report/index.html`
- **JSON Report** - `test-results/test-results.json`
- **JUnit XML** - `test-results/junit.xml`

## Browser Support

Tests run on multiple browsers:
- Chromium (Desktop)
- Firefox (Desktop)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Best Practices Implemented

1. ✅ **Page Object Model** - Strict separation of locators and test logic
2. ✅ **No hardcoded waits** - Playwright auto-waiting used
3. ✅ **Reusable methods** - Shared across test cases
4. ✅ **Comprehensive logging** - All actions logged
5. ✅ **Error handling** - Graceful error handling with meaningful messages
6. ✅ **Test isolation** - Each test is independent
7. ✅ **Parallel execution** - Tests run in parallel for speed
8. ✅ **Multiple reporters** - HTML, JSON, JUnit reports
9. ✅ **Screenshot/Video on failure** - Automatic capture for debugging
10. ✅ **Cross-browser testing** - Desktop and mobile browsers

## Maintenance

### Adding New Tests
1. Identify the feature/page
2. Add/update Page Object in `src/automationScripts/pages/`
3. Add test spec in `src/automationScripts/`
4. Use existing Page Object methods where possible
5. Add new methods to Page Object if needed
6. Follow naming convention: `<feature>.spec.js`

### Updating Locators
1. Locate the Page Object file
2. Update locator in constructor
3. All tests using that Page Object will automatically use new locator

## Troubleshooting

### Tests failing due to timeout
- Increase `actionTimeout` or `navigationTimeout` in `playwright.config.js`
- Check network connectivity
- Verify application is accessible

### Locators not found
- Verify locator in Page Object
- Use Playwright Inspector: `npm run test:debug`
- Check if element is in iframe or shadow DOM

### Tests passing locally but failing in CI
- Check CI environment variables
- Verify browser versions
- Review CI logs and screenshots

## Contributing

1. Follow existing code structure
2. Add comprehensive logging
3. Write meaningful test descriptions
4. Update README for new features
5. Ensure all tests pass before committing

## License
ISC

## Contact
QA Team - For questions and support
