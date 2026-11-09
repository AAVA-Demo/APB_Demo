# Credit Card Dashboard - Playwright Automation Framework

## Overview
This is a production-ready Playwright automation framework for the Credit Card Analysis Dashboard application, implementing the Page Object Model (POM) design pattern.

## Project Structure
```
├── src/
│   ├── automationScripts/
│   │   ├── pages/
│   │   │   ├── base.page.js
│   │   │   ├── login.page.js
│   │   │   ├── dashboard.page.js
│   │   │   ├── cardPortfolio.page.js
│   │   │   └── analytics.page.js
│   │   ├── dashboard.spec.js
│   │   ├── cardPortfolio.spec.js
│   │   └── analytics.spec.js
│   ├── data/
│   │   ├── config.json
│   │   └── testData.json
│   └── utils/
│       └── logger.js
├── playwright.config.js
├── package.json
└── README.md
```

## Features
- ✅ Page Object Model (POM) architecture
- ✅ Multi-browser support (Chromium, Firefox, WebKit)
- ✅ Multi-device support (Desktop, Mobile, Tablet)
- ✅ Parallel test execution
- ✅ Comprehensive reporting (HTML, JSON, JUnit)
- ✅ Screenshot and video capture on failure
- ✅ Winston logger integration
- ✅ Environment configuration management
- ✅ Zero hardcoded values in tests

## Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation
```bash
npm install
```

## Test Execution

### Run all tests
```bash
npm test
```

### Run specific test suites
```bash
npm run test:dashboard
npm run test:portfolio
npm run test:analytics
```

### Run in headed mode
```bash
npm run test:headed
```

### Run in debug mode
```bash
npm run test:debug
```

### Run on specific browsers
```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Run on mobile devices
```bash
npm run test:mobile
```

### View HTML report
```bash
npm run report
```

## Test Coverage

### Dashboard Tests (10 test cases)
- KPI display validation (Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount)
- Dashboard performance (2-second load time)
- Responsive design (mobile, tablet, desktop)
- KPI refresh functionality

### Card Portfolio Tests (10 test cases)
- Multiple card display
- Card details validation
- Card number masking
- Utilization tracking
- Empty state handling
- Portfolio summary aggregation
- Card-wise spending analysis

### Analytics Tests (11 test cases)
- Category-wise spending visualization
- Interactive chart drill-down
- Monthly trend analysis
- Tooltip validation
- Empty state handling
- Insufficient data warnings

## Configuration

### Environment URLs
Edit `src/data/config.json` to configure environment URLs:
```json
{
  "baseURL": "https://creditcard-dashboard.example.com",
  "environments": {
    "dev": "https://dev.creditcard-dashboard.example.com",
    "staging": "https://staging.creditcard-dashboard.example.com",
    "production": "https://creditcard-dashboard.example.com"
  }
}
```

### Test Data
Edit `src/data/testData.json` to manage test users and data:
```json
{
  "users": {
    "validUser": {
      "username": "testuser@example.com",
      "password": "Test@123"
    }
  }
}
```

## Reporting

### HTML Report
After test execution, view the HTML report:
```bash
npm run report
```

### JSON Report
JSON results are saved to: `test-results/results.json`

### JUnit Report
JUnit XML is saved to: `test-results/junit.xml`

## Logging
Logs are saved to:
- `logs/error.log` - Error-level logs
- `logs/combined.log` - All logs

## Best Practices Implemented
1. **Page Object Model** - All locators in Page Object classes, zero locators in spec files
2. **Playwright Native Waits** - Using `expect().toBeVisible()` and auto-waiting
3. **No waitForTimeout** - All waits use Playwright's native mechanisms
4. **Environment Configuration** - URLs in config.json, no hardcoded URLs
5. **Reusable Methods** - Common actions in BasePage class
6. **State Assertions** - All interactions preceded by visibility/enabled checks
7. **Comprehensive Logging** - Winston logger for all logging operations
8. **Error Handling** - Try-catch blocks and graceful error handling

## CI/CD Integration
This framework is CI/CD ready. Set environment variable:
```bash
export CI=true
```

## Support
For issues or questions, contact the QA Team.

## License
ISC
