# Credit Card Dashboard - Playwright Automation Framework

## Overview
This is a comprehensive Playwright automation framework for the Credit Card Analysis Dashboard application. The framework implements all 24 test cases from TestRail using the Page Object Model design pattern.

## Project Structure
```
├── src/
│   ├── automationScripts/
│   │   ├── creditCardDashboard.spec.js    # Main test specification file
│   │   └── pages/
│   │       ├── creditCardDashboard.page.js # Dashboard page object
│   │       └── login.page.js               # Login page object
│   └── data/
│       ├── config.json                     # Environment configuration
│       └── testData.json                   # Test data
├── playwright.config.js                     # Playwright configuration
├── package.json                             # NPM dependencies
└── README.md                                # This file
```

## Test Coverage

### Test Suites Implemented
1. **Monthly Spending Trend Visualization (QE-9418)** - 4 test cases
2. **Multiple Credit Card Display Interface (QE-9417)** - 5 test cases
3. **Category-Wise Spending Analysis Dashboard (QE-9416)** - 4 test cases
4. **Consolidated Credit Card KPI Dashboard (QE-9415)** - 4 test cases
5. **Card-Wise Spending Comparison Tool (QE-9414)** - 4 test cases
6. **Responsive Multi-Device Dashboard Access (QE-9410)** - 3 test cases

**Total: 24 automated test cases**

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in headed mode:
```bash
npm run test:headed
```

### Run tests in debug mode:
```bash
npm run test:debug
```

### Run tests with UI mode:
```bash
npm run test:ui
```

### Run tests on specific browser:
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run mobile tests:
```bash
npm run test:mobile
```

### View test report:
```bash
npm run report
```

## Framework Features

### Page Object Model (POM)
- All locators are centralized in page classes
- No locators in test specification files
- Reusable methods for common actions
- Proper separation of concerns

### Data-Driven Testing
- Test data externalized in `testData.json`
- Environment configuration in `config.json`
- Support for multiple environments (dev, staging, production)

### Playwright Best Practices
- Native auto-waiting for elements
- Proper state assertions before interactions
- Network idle waits for dynamic content
- Screenshot and video capture on failures

### Responsive Testing
- Mobile viewport testing (iPhone 12)
- Tablet viewport testing (iPad Pro)
- Desktop testing across multiple browsers
- Small screen edge case testing

### Performance Testing
- Load time measurements for dashboard (2-second threshold)
- Card data retrieval time validation (1-second threshold)
- Chart rendering performance checks

## Test Data

### Test Users
- `testuser@example.com` - User with 12 months of transaction history
- `newuser@example.com` - User with 6 months of transaction history
- `multicard@example.com` - User with 5 credit cards
- `nocard@example.com` - User with no credit cards
- `singlecard@example.com` - User with 1 credit card
- `threecard@example.com` - User with 3 credit cards (varying utilization)
- `edgecase@example.com` - User with edge case cards (0% and 100% utilization)

### Test Categories
- Food & Dining
- Fuel
- Shopping
- Travel
- Entertainment
- Utilities
- Healthcare
- Education
- Miscellaneous

## Configuration

### Environment URLs
- Development: `https://dev.app.creditcard.com`
- Staging: `https://staging.app.creditcard.com`
- Production: `https://app.creditcard.com`

### Viewport Configurations
- Mobile: 375x812 (iPhone 12)
- Tablet: 1024x1366 (iPad Pro)
- Desktop: 1920x1080
- Small Screen: 320x480

## CI/CD Integration

The framework is CI/CD ready with:
- Automatic retries on failure (2 retries in CI)
- Parallel test execution
- Multiple report formats (HTML, JSON, JUnit)
- Screenshot and video capture on failures

### GitHub Actions Example
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Troubleshooting

### Common Issues

1. **Tests failing due to timeout**
   - Increase timeout in `playwright.config.js`
   - Check network connectivity
   - Verify application is accessible

2. **Element not found errors**
   - Verify locators in page objects
   - Check if application UI has changed
   - Ensure proper waits are implemented

3. **Performance test failures**
   - Check system resources
   - Verify network speed
   - Consider adjusting performance thresholds

## Maintenance

### Adding New Tests
1. Add test data to `testData.json`
2. Add locators to appropriate page object
3. Write test in `creditCardDashboard.spec.js`
4. Follow existing naming conventions

### Updating Locators
1. Update locators in page object files only
2. Never update locators in test specification files
3. Use data-testid attributes for stability

## Contributing

1. Follow the Page Object Model pattern
2. Add proper comments and documentation
3. Ensure all tests pass before committing
4. Update README for significant changes

## Contact

For questions or issues, please contact the QA team.

---

**Branch:** CreditCardNew20261110203323  
**Repository:** APB_Demo  
**Framework:** Playwright with JavaScript  
**Pattern:** Page Object Model