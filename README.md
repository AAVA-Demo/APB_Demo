# Credit Card Dashboard - Playwright Automation Suite

## Project: CreditCardNew20261109163507

### Overview
This repository contains comprehensive Playwright automation scripts for the Credit Card Dashboard application. All 25 test cases from TestRail have been implemented using the Page Object Model pattern.

### Test Coverage
- **Transaction Search and Filtering (QE-8455)**: 5 test cases
- **Category-wise Spending Analysis (QE-8454)**: 3 test cases
- **Dashboard KPI Overview Display (QE-8453)**: 6 test cases
- **Multi-Card Transaction Listing (QE-8452)**: 4 test cases
- **Multiple Credit Cards Overview (QE-8451)**: 4 test cases
- **Monthly Spend Trends Visualization (QE-8450)**: 3 test cases

### Project Structure
```
src/
├── automationScripts/
│   ├── transactionFilter.spec.js
│   ├── categoryAnalytics.spec.js
│   ├── dashboardKPI.spec.js
│   ├── multiCardTransactions.spec.js
│   ├── creditCardOverview.spec.js
│   ├── monthlyTrends.spec.js
│   └── pages/
│       ├── transaction.page.js
│       ├── analytics.page.js
│       ├── dashboard.page.js
│       └── cardOverview.page.js
└── utils/
    └── logger.js
```

### Installation
```bash
npm install
npx playwright install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run test:report
```

### Configuration
- Base URL: Set via `BASE_URL` environment variable (default: http://localhost:3000)
- Browsers: Chromium, Firefox, WebKit
- Parallel execution: Enabled
- Retries: 2 (in CI), 0 (locally)

### Features
- ✅ Page Object Model architecture
- ✅ Native Playwright auto-waiting
- ✅ Comprehensive logging
- ✅ Performance validations
- ✅ Error handling and negative scenarios
- ✅ Multi-browser support
- ✅ HTML, JSON, and JUnit reports

### Test Data
All test data is extracted from TestRail test cases and embedded in the test steps.

### Compliance
- SOC2 compliant
- ISO27001 compliant
- No sensitive data in code
- Secure credential management

### Author
Senior DevOps Integration Engineer
