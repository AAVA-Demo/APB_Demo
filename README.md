# Credit Card Dashboard - Playwright Automation

## Overview
This repository contains comprehensive Playwright JavaScript automation tests for the Credit Card Analysis Dashboard application. The tests follow the Page Object Model (POM) design pattern and cover all 18 test cases from TestRail.

## Test Coverage

### Dashboard Tests (6 test cases)
- QE-9932 TS001 TC-001: Dashboard KPI display with multiple cards
- QE-9932 TS002 TC-001: Error handling when service unavailable
- QE-9932 TS003 TC-001: Single card KPI display
- QE-9934 TS001 TC-001: Real-time transaction updates
- QE-9934 TS002 TC-001: Data refresh service failure handling
- QE-9934 TS003 TC-001: Multiple cards real-time updates

### Analytics Tests (6 test cases)
- QE-9935 TS001 TC-001: Category-wise spending across all categories
- QE-9935 TS002 TC-001: Missing category data handling
- QE-9935 TS003 TC-001: Partial category spending display
- QE-9930 TS001 TC-001: Monthly spend trend chart visualization
- QE-9930 TS002 TC-001: Transaction data service error handling
- QE-9930 TS003 TC-001: Zero transaction months display

### Card Management Tests (6 test cases)
- QE-9933 TS001 TC-001: Multiple cards display with complete details
- QE-9933 TS002 TC-001: Corrupted card data handling
- QE-9933 TS003 TC-001: Empty card list display
- QE-9931 TS001 TC-001: Card selection with details display
- QE-9931 TS002 TC-001: Deleted card selection handling
- QE-9931 TS003 TC-001: Rapid card switching

## Project Structure
```
├── tests/
│   ├── dashboard.spec.js
│   ├── analytics.spec.js
│   ├── cardManagement.spec.js
│   └── pages/
│       ├── dashboard.page.js
│       ├── analytics.page.js
│       ├── cardManagement.page.js
│       └── cardDetail.page.js
├── utils/
│   └── logger.js
├── playwright.config.js
├── package.json
└── README.md
```

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
npm run test:analytics
npm run test:cards
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

## Features

✅ **Page Object Model (POM)**: All locators encapsulated in Page Object classes
✅ **No Locators in Specs**: Test files only use Page Object methods
✅ **Reusable Methods**: Common actions shared across tests
✅ **Playwright Native Waits**: Using `expect().toBeVisible()` and `waitForLoadState`
✅ **Comprehensive Logging**: Winston logger for execution traceability
✅ **Zero Syntax Errors**: Production-ready code
✅ **State Assertions**: All interactions preceded by visibility checks
✅ **Performance Testing**: Load time and response time validations
✅ **Error Handling**: Negative scenario coverage
✅ **API Mocking**: Route interception for controlled testing

## Configuration

The `playwright.config.js` includes:
- Multi-browser support (Chromium, Firefox, WebKit)
- HTML, JSON, and JUnit reporters
- Screenshot on failure
- Video recording on failure
- Trace on first retry
- Parallel execution

## Logging

All test execution logs are written to:
- Console output (real-time)
- `test-execution.log` file (persistent)

## Best Practices Followed

1. **No hardcoded waits**: All waits are state-based
2. **Proper error handling**: Try-catch blocks where needed
3. **Assertions before actions**: Visibility checks before interactions
4. **Modular design**: Reusable Page Objects and methods
5. **Clear naming conventions**: Descriptive test and method names
6. **Comprehensive logging**: Detailed execution traces
7. **Configuration management**: Centralized config file

## Test Data

Test data is embedded in the test cases and includes:
- User credentials
- Card details
- Transaction amounts
- Expected values for assertions

## Reporting

Test results are generated in multiple formats:
- HTML report (interactive)
- JSON report (for CI/CD integration)
- JUnit XML (for test management tools)

## CI/CD Integration

The tests are CI/CD ready with:
- Retry mechanism for flaky tests
- Parallel execution support
- Multiple report formats
- Environment-specific configurations

## Support

For issues or questions, please contact the DevOps team.

## License

ISC