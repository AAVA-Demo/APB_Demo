# Credit Card Dashboard Automation Framework

## Overview
Production-ready Playwright JavaScript automation framework for Credit Card Analysis Dashboard using Page Object Model.

## Test Coverage
- **Dashboard KPIs**: 72 test cases covering real-time display, responsive layouts, and data aggregation
- **Portfolio Management**: Multiple credit card display, card-specific tracking, empty states
- **Transaction Management**: Listing, pagination, search, and filtering
- **Spending Analytics**: Category-wise visualization, monthly trends, card-wise analysis, interactive charts

## Framework Structure
```
src/
├── automationScripts/
│   ├── dashboard.spec.js
│   ├── portfolio.spec.js
│   ├── transactions.spec.js
│   ├── analytics.spec.js
│   └── pages/
│       ├── dashboard.page.js
│       ├── portfolio.page.js
│       ├── transactions.page.js
│       └── analytics.page.js
├── utils/
│   ├── logger.js
│   └── wait-utils.js
data/
└── config.json
playwright.config.js
package.json
```

## Installation
```bash
npm install
npx playwright install
```

## Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:dashboard
npm run test:portfolio
npm run test:transactions
npm run test:analytics

# Run in headed mode
npm run test:headed

# Debug mode
npm run test:debug

# View test report
npm run test:report
```

## Configuration
Environment-specific URLs and test data are configured in `data/config.json`.

## Page Object Model
All locators are centralized in Page Object classes under `src/automationScripts/pages/`.

## Logging
All test actions are logged using the custom Logger utility.

## Wait Utilities
Playwright's native auto-waiting is used with custom wait utilities for complex scenarios.

## Test Case Mapping
Each test case is mapped to TestRail test cases (QE-XXXX format) for traceability.

## Supported Browsers
- Chromium
- Firefox
- WebKit
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Microsoft Edge

## Responsive Testing
Tests include viewport-specific validations for mobile (320px-375px), tablet (768px), and desktop (1920px) layouts.
