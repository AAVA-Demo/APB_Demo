# Credit Card Analysis Dashboard - Playwright Automation

## Overview

This repository contains production-ready Playwright JavaScript automation code for the Credit Card Analysis Dashboard application. The framework follows the Page Object Model (POM) design pattern and adheres to enterprise-level best practices.

## Test Coverage

The automation suite covers **18 test cases** across **6 user stories**:

### QE-10449: Dashboard KPI Display System (3 test cases)
- Responsive KPI widget display across desktop, tablet, and mobile
- Session expiration and authentication error handling
- Currency formatting and auto-refresh validation

### QE-10448: Multi-Card Consolidated View (3 test cases)
- Consolidated metrics for multiple credit cards
- No cards scenario with zero values
- Portfolio overview with card count and utilization

### QE-10451: Individual Card Details View (3 test cases)
- Complete card details display
- Invalid card ID error handling
- Recent usage patterns and transaction history

### QE-10446: Card Comparison Functionality (3 test cases)
- Side-by-side card comparison with all metrics
- Insufficient cards error handling
- Optimal card identification based on utilization

### QE-10447: Category-Wise Spending Visualization (3 test cases)
- Interactive bar chart with all 9 spending categories
- No spending data scenario
- Tooltip interaction with detailed spending information

### QE-10450: Monthly Spend Trends Analysis (3 test cases)
- Monthly trends line chart with 6 months data
- Insufficient data message for single month
- Trend indicators with percentage changes

## Project Structure

```
.
├── src/
│   ├── automationScripts/
│   │   ├── login.spec.js              # Authentication tests
│   │   ├── dashboard.spec.js          # Dashboard and KPI tests
│   │   ├── cards.spec.js              # Card details and comparison tests
│   │   ├── analytics.spec.js          # Analytics and trends tests
│   │   └── pages/
│   │       ├── login.page.js          # Login page object
│   │       ├── dashboard.page.js      # Dashboard page object
│   │       ├── cards.page.js          # Cards page object
│   │       └── analytics.page.js      # Analytics page object
│   └── utils/
│       └── logger.js                  # Winston logger utility
├── data/
│   └── config.json                    # Test data and configuration
├── logs/                              # Test execution logs
├── test-results/                      # Test results (JSON, JUnit)
├── playwright-report/                 # HTML test report
├── playwright.config.js               # Playwright configuration
├── package.json                       # Node.js dependencies
└── README.md                          # This file
```

## Framework Features

✅ **Page Object Model (POM)** - All locators and page actions encapsulated in Page Object classes

✅ **Reusable Components** - Shared Page Objects across multiple test cases

✅ **Logging** - Winston-based logging for debugging and audit trails

✅ **Configuration Management** - Centralized test data in `data/config.json`

✅ **Multi-Browser Support** - Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

✅ **Responsive Testing** - Viewport switching for desktop, tablet, and mobile layouts

✅ **Error Handling** - Graceful handling of missing elements and network issues

✅ **Reporting** - HTML, JSON, and JUnit reports

✅ **CI/CD Ready** - Configured for parallel execution and retry logic

## Prerequisites

- Node.js 16+ and npm
- Playwright browsers installed

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui

# Run specific test suite
npm run test:dashboard
npm run test:cards
npm run test:analytics

# View HTML report
npm run test:report
```

## Configuration

Edit `data/config.json` to update:
- Base URL
- User credentials
- Timeouts
- Viewport sizes

Edit `playwright.config.js` to update:
- Test directory
- Parallel execution settings
- Retry logic
- Browser configurations
- Reporter settings

## Page Objects

### LoginPage
- `navigate()` - Navigate to login page
- `login(username, password)` - Perform login
- `isErrorMessageVisible()` - Check for error messages

### DashboardPage
- `getMonthlySpendValue()` - Get monthly spend KPI
- `getTotalCreditLimitValue()` - Get total credit limit KPI
- `getAvailableCreditValue()` - Get available credit KPI
- `getOutstandingAmountValue()` - Get outstanding amount KPI
- `getCardCount()` - Get number of cards
- `getCreditUtilizationPercentage()` - Get utilization percentage
- `getCardSummaries()` - Get card summary elements

### CardsPage
- `navigateToMyCards()` - Navigate to My Cards section
- `getCardCount()` - Get number of cards in list
- `clickFirstCard()` - Click on first card
- `getCreditLimit()` - Get credit limit value
- `getOutstandingBalance()` - Get outstanding balance
- `getAvailableCredit()` - Get available credit
- `getMonthlySpend()` - Get monthly spend
- `getCreditUtilization()` - Get utilization percentage
- `getRecentTransactions()` - Get recent transaction data
- `clickCompareCardsButton()` - Activate comparison
- `getComparisonData()` - Get comparison table data

### AnalyticsPage
- `navigateToAnalytics()` - Navigate to Analytics section
- `clickMonthlyTrendsTab()` - Switch to trends view
- `getCategorySpendingData()` - Get category spending data
- `getCategoryBars()` - Get category bar elements
- `getMonthlyTrendsData()` - Get monthly trend data
- `getTrendIndicators()` - Get trend indicators

## Logging

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console output with color coding

## Test Reports

- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/junit.xml`

## Best Practices Implemented

1. ✅ **No hardcoded waits** - Using Playwright's auto-waiting and explicit waits
2. ✅ **No locators in test files** - All locators in Page Objects
3. ✅ **Reusable methods** - Shared actions across tests
4. ✅ **Proper error handling** - Try-catch blocks and fallbacks
5. ✅ **Logging at every step** - Comprehensive audit trail
6. ✅ **Assertions before interactions** - Verify element state before action
7. ✅ **Data-driven approach** - Test data in config files
8. ✅ **Zero syntax errors** - Production-ready code
9. ✅ **Maintainable structure** - Clear separation of concerns
10. ✅ **CI/CD ready** - Parallel execution and retry logic

## Troubleshooting

### Tests failing due to timeout
- Increase timeout values in `playwright.config.js`
- Check network connectivity
- Verify application is accessible

### Locators not found
- Verify application URL in `data/config.json`
- Check if application structure has changed
- Update locators in Page Object files

### Authentication issues
- Verify credentials in `data/config.json`
- Check if authentication endpoint is correct
- Review login flow in `login.page.js`

## Maintenance

### Adding New Tests
1. Create test file in `src/automationScripts/`
2. Import required Page Objects
3. Follow existing test structure
4. Add logging statements
5. Use Playwright `expect` assertions

### Updating Page Objects
1. Locate Page Object file in `src/automationScripts/pages/`
2. Update locators if UI changes
3. Add new methods for new functionality
4. Maintain method naming consistency
5. Add JSDoc comments for complex methods

### Updating Configuration
1. Edit `data/config.json` for test data changes
2. Edit `playwright.config.js` for framework settings
3. Update `package.json` for dependency changes

## Support

For issues or questions, contact the Automation Team.

## License

ISC
