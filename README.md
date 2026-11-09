# Credit Card Dashboard - Playwright Automation

## Overview

This repository contains production-ready Playwright automation scripts for the Credit Card Dashboard application. The automation follows the Page Object Model (POM) design pattern and includes comprehensive test coverage for all critical features.

## Features Automated

- ✅ Dashboard KPI Display & Validation
- ✅ Multi-Card Portfolio Management
- ✅ Credit Utilization Tracking
- ✅ Category-Wise Spending Analytics
- ✅ Historical Spending Comparisons
- ✅ Monthly Trend Analysis
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Real-Time Data Refresh
- ✅ Error Handling & Edge Cases

## Project Structure

```
src/
├── automationScripts/
│   ├── dashboard.spec.js          # Dashboard KPI tests
│   ├── portfolio.spec.js          # Portfolio management tests
│   ├── analytics.spec.js          # Analytics & spending tests
│   ├── responsive.spec.js         # Responsive design tests
│   └── pages/
│       ├── dashboard.page.js      # Dashboard page object
│       ├── portfolio.page.js      # Portfolio page object
│       └── analytics.page.js      # Analytics page object
└── utils/
    └── logger.js                  # Winston logger utility

playwright.config.js               # Playwright configuration
package.json                       # Dependencies & scripts
README.md                          # This file
```

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

Update the `playwright.config.js` file to set your base URL:

```javascript
use: {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  // ... other settings
}
```

Or set the `BASE_URL` environment variable:

```bash
export BASE_URL=https://your-dashboard-url.com
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests in UI mode
```bash
npm run test:ui
```

### Run tests on specific browsers
```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Run mobile tests
```bash
npm run test:mobile
```

### View test report
```bash
npm run report
```

## Test Coverage

### Dashboard Tests (dashboard.spec.js)
- TC-4992: Verify four KPI metrics display
- TC-4993: Backend service unavailable scenario
- TC-4994: KPI metrics update after transactions
- TC-5010: KPI load time performance (2 seconds)
- TC-5011: No credit cards scenario
- TC-4995: Real-time KPI refresh
- TC-4996: Network connectivity error handling
- TC-4997: Automatic dashboard refresh
- TC-5013: Monthly spend KPI display
- TC-5014: No transactions scenario

### Portfolio Tests (portfolio.spec.js)
- TC-4983: Five-card portfolio display
- TC-4984: Empty portfolio state
- TC-4985: Large portfolio with pagination (15 cards)
- TC-5025: Portfolio card details validation
- TC-5026: Empty portfolio with add card option
- TC-5001: Healthy utilization indicators (<50%)
- TC-5002: High utilization warning (85%)
- TC-5003: Moderate utilization indicator (55%)
- TC-5028: Card detail view
- TC-5029: Deactivated card error
- TC-5030: Zero balance card details

### Analytics Tests (analytics.spec.js)
- TC-4986: Eight-category pie chart display
- TC-4987: Empty chart scenario
- TC-4988: Category drill-down
- TC-5015: Multi-category spending breakdown (7 categories)
- TC-5016: No spending data for current month
- TC-5017: All 9 categories with percentages
- TC-5046: Interactive chart drill-down (15 transactions)
- TC-5047: Zero transactions in category
- TC-5048: Category hover tooltip
- TC-5018: Historical spending comparison
- TC-5019: Insufficient historical data error
- TC-5020: No previous month data message
- TC-4980: Six-month trend analysis
- TC-4981: Insufficient trend data warning
- TC-4982: Monthly drill-down

### Responsive Tests (responsive.spec.js)
- TC-4989: Mobile responsive layout (375px)
- TC-5040: Touch-friendly mobile layout
- TC-4990: Tablet responsive layout (768px)
- TC-5041: Tablet optimized spacing
- TC-4991: Legacy browser fallback (320px)
- TC-5042: Small screen font adaptation

## Page Object Model

All locators are centralized in Page Object classes:

- **DashboardPage**: Manages dashboard KPI elements and interactions
- **PortfolioPage**: Manages portfolio card elements and interactions
- **AnalyticsPage**: Manages analytics chart elements and interactions

Test files only use Page Object methods, ensuring maintainability and reusability.

## Logging

The project uses Winston for structured logging:

- **Console logs**: Colorized output for development
- **File logs**: 
  - `logs/error.log`: Error-level logs only
  - `logs/combined.log`: All logs

Logs include timestamps, service metadata, and stack traces for errors.

## Best Practices Followed

✅ Page Object Model (POM) design pattern
✅ No locators in test files
✅ Reusable methods across tests
✅ Playwright native waits (no hardcoded timeouts)
✅ Comprehensive error handling
✅ Mock API responses for edge cases
✅ Responsive design testing
✅ Performance validation (load time checks)
✅ Zero syntax errors
✅ Enterprise-grade logging

## CI/CD Integration

The tests are configured for CI/CD pipelines:

- Retry failed tests 2 times in CI
- Generate HTML, JSON, and JUnit reports
- Capture screenshots on failure
- Record videos on failure
- Parallel execution support

## Troubleshooting

### Tests failing due to timeout
- Increase `actionTimeout` or `navigationTimeout` in `playwright.config.js`
- Check if the application is running and accessible

### Locators not found
- Verify the application uses `data-testid` attributes
- Update locators in Page Object files if UI structure changed

### Browser installation issues
```bash
npx playwright install --with-deps
```

## Contributing

1. Create a new branch for your feature
2. Follow the existing Page Object Model structure
3. Add tests in appropriate spec files
4. Ensure all tests pass before committing
5. Update this README if adding new features

## Support

For issues or questions, contact the DevOps Integration Engineering team.

## License

ISC
