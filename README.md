# Credit Card Analysis Dashboard - Playwright Automation

## Overview
This repository contains production-ready Playwright JavaScript automation code for the Credit Card Analysis Dashboard, implementing all 18 test cases using the Page Object Model (POM) architecture.

## Project Structure
```
├── src/
│   ├── automationScripts/
│   │   ├── dashboard.spec.js          # Dashboard & KPI tests (TC-7264, TC-7265, TC-7266)
│   │   ├── analytics.spec.js          # Analytics & Insights tests (TC-7267, TC-7268, TC-7269, TC-7288, TC-7290, TC-7292)
│   │   ├── portfolio.spec.js          # Portfolio Management tests (TC-7282, TC-7284, TC-7286, TC-7276, TC-7278, TC-7280)
│   │   ├── responsive.spec.js         # Responsive Design tests (TC-7270, TC-7272, TC-7274)
│   │   └── pages/
│   │       ├── login.page.js          # Login page object
│   │       ├── dashboard.page.js      # Dashboard page object
│   │       ├── analytics.page.js      # Analytics page object
│   │       ├── portfolio.page.js      # Portfolio page object
│   │       └── cardDetail.page.js     # Card Detail page object
│   ├── data/
│   │   └── config.json                # Configuration and test data
│   └── utils/
│       └── logger.js                  # Winston logger utility
├── playwright.config.js               # Playwright configuration
├── package.json                       # Dependencies
└── README.md                          # This file
```

## Test Coverage

### Dashboard & KPI Management (3 test cases)
- **TC-7264**: Verify authenticated user can view all four KPIs with 2 decimal precision
- **TC-7265**: Verify unauthenticated user receives authentication error
- **TC-7266**: Verify appropriate error message when backend KPI service unavailable

### Spending Analytics & Insights (6 test cases)
- **TC-7267**: Verify category-wise spending visualization renders within 2 seconds
- **TC-7268**: Verify no spending data message for user with no transactions
- **TC-7269**: Verify uncategorized transactions default to Miscellaneous
- **TC-7288**: Verify monthly spending trends with 12 months history and drill-down
- **TC-7290**: Verify partial transaction history display with appropriate message
- **TC-7292**: Verify expired detailed data handling with graceful degradation

### Multi-Card Portfolio Management (6 test cases)
- **TC-7282**: Verify 5 credit cards portfolio displays within 1.5 seconds
- **TC-7284**: Verify maximum 10 cards portfolio with pagination/scrolling
- **TC-7286**: Verify no credit cards message for new user
- **TC-7276**: Verify individual card details load within 1 second
- **TC-7278**: Verify card not found error for deleted/deactivated card
- **TC-7280**: Verify partial card details with corrupted transaction data

### Responsive Multi-Device Dashboard (3 test cases)
- **TC-7270**: Verify mobile responsive dashboard (375px viewport)
- **TC-7272**: Verify tablet responsive dashboard (768px viewport)
- **TC-7274**: Verify slow network timeout handling

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Configuration

Edit `src/data/config.json` to update:
- Base URL
- User credentials
- Timeouts
- Retry settings

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui

# Run specific test suite
npm run test:dashboard
npm run test:analytics
npm run test:portfolio
npm run test:responsive

# View test report
npm run report
```

## Page Object Model Architecture

All locators are defined in Page Object classes located in `src/automationScripts/pages/`. Test spec files only contain test logic and assertions.

### Page Objects:
- **LoginPage**: Handles authentication
- **DashboardPage**: Dashboard KPIs and layout
- **AnalyticsPage**: Category charts and spending trends
- **PortfolioPage**: Credit card list management
- **CardDetailPage**: Individual card details

## Logging

All test execution logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console output with color coding

## Test Reports

- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/junit.xml`

## NFR Compliance

- ✅ Dashboard load time ≤2 seconds (validated in TC-7270, TC-7272)
- ✅ Card list load time ≤1.5 seconds (validated in TC-7282, TC-7284)
- ✅ Card details retrieval ≤1 second (validated in TC-7276)
- ✅ Analytics render time ≤2 seconds (validated in TC-7267)
- ✅ KPI calculation precision (2 decimals) (validated in TC-7264)
- ✅ Support minimum 10 cards (validated in TC-7284)
- ✅ 12-month historical data support (validated in TC-7288)
- ✅ Responsive design (mobile/tablet/desktop) (validated in TC-7270, TC-7272)

## CI/CD Integration

The test suite is configured for CI/CD with:
- Automatic retries on failure (2 retries in CI)
- Parallel execution support
- Multiple browser support (Chromium, Firefox, WebKit)
- Mobile device emulation (Pixel 5, iPhone 12)
- Screenshot on failure
- Video recording on failure
- Trace on first retry

## Best Practices Implemented

1. ✅ Page Object Model (POM) architecture
2. ✅ All locators in Page Object classes
3. ✅ Playwright native auto-waiting
4. ✅ Configuration externalized to `data/config.json`
5. ✅ Winston logger for comprehensive logging
6. ✅ Playwright `expect` assertions only
7. ✅ No duplicate logic
8. ✅ Element interactions preceded by state assertions
9. ✅ All 18 test cases implemented
10. ✅ Zero syntax errors

## Maintenance

- Update locators in Page Object files only
- Add new test data to `config.json`
- Extend Page Objects for new features
- Keep test logic separate from page interactions

## Support

For issues or questions, contact the QA Team.
