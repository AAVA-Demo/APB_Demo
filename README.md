# Credit Card Analysis Dashboard - Playwright Automation

## Project Overview
This repository contains production-ready Playwright JavaScript automation tests for the Credit Card Analysis Dashboard application, following enterprise-grade Page Object Model (POM) framework.

## Test Coverage
- **54 Test Cases** covering Dashboard KPIs, Card Management, Analytics, and Responsive Layout
- **Test Cases mapped to:** QE-8044 through QE-8061 (TestRail)
- **Label:** CreditCardNew20261109161802

## Framework Architecture

### Directory Structure
```
src/
├── automationScripts/
│   ├── dashboard.spec.js          # Dashboard KPI & Responsive Layout Tests
│   ├── cardManagement.spec.js     # Card Management Tests (Coming Soon)
│   ├── analytics.spec.js          # Analytics Tests (Coming Soon)
│   └── pages/
│       ├── login.page.js          # Login Page Object
│       ├── dashboard.page.js      # Dashboard Page Object
│       ├── cardManagement.page.js # Card Management Page Object (Coming Soon)
│       └── analytics.page.js      # Analytics Page Object (Coming Soon)
└── utils/
    └── logger.js                  # Winston Logger Utility
```

## Key Features

### ✅ Mandatory Engineering Rules Compliance
1. **Page Object Model (POM)** - All locators defined in Page Object classes
2. **No Locators in Tests** - Test files contain only business logic
3. **Proper Directory Structure** - Tests and pages organized in `src/automationScripts/`
4. **Feature-Based Grouping** - Tests grouped by Dashboard, Card Management, Analytics
5. **Shared Page Objects** - Single LoginPage, DashboardPage reused across tests
6. **Method Reuse** - Common actions like login, navigation reused
7. **Playwright Native Waits** - Uses `waitForLoadState`, `toBeVisible`, etc.
8. **Logging Utility** - Winston logger for comprehensive test execution logs
9. **Playwright Expect Assertions** - Only Playwright expect used
10. **Minimal waitForTimeout** - Only used where necessary with comments

## Test Scenarios Covered

### Dashboard KPI Tests (dashboard.spec.js)
- QE-8061 TS-001 TC-001: Dashboard displays all KPI metrics within 2 seconds
- QE-8061 TS-002 TC-001: Dashboard displays loading indicator when data is processing
- QE-8061 TS-003 TC-001: KPI metrics display with proper currency formatting
- QE-8051 TS-001 TC-001: User with active cards views dashboard with all KPIs
- QE-8051 TS-002 TC-001: User with no cards sees appropriate message
- QE-8051 TS-003 TC-001: KPI values correctly calculated by aggregating multiple cards
- QE-8045 TS-001 TC-001: Dashboard loads with consolidated KPIs within 2 seconds
- QE-8045 TS-002 TC-001: Error message when backend service is unavailable
- QE-8045 TS-003 TC-001: Aggregated KPIs for user with 10 credit cards
- QE-8052 TS-001 TC-001: KPIs update automatically within 30 seconds after new transaction
- QE-8052 TS-002 TC-001: Warning indicator when data feed is interrupted
- QE-8052 TS-003 TC-001: KPIs update after payment on credit card

### Responsive Layout Tests (dashboard.spec.js)
- QE-8060 TS-001 TC-001: Dashboard adapts to mobile device screen (390x844)
- QE-8060 TS-002 TC-001: Dashboard adapts when tablet orientation changes
- QE-8060 TS-003 TC-001: Dashboard maintains readability on low resolution device (320x480)
- QE-8044 TS-001 TC-001: Mobile-optimized stacked layout (375x667)
- QE-8044 TS-002 TC-001: Tablet 2-column grid layout (768x1024)
- QE-8044 TS-003 TC-001: Fallback layout on unsupported browser

## Prerequisites

### Required Software
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AAVA-Demo/APB_Demo.git
cd APB_Demo
git checkout CreditCardNew20261109161802
```

2. Install dependencies:
```bash
npm install @playwright/test winston
npx playwright install
```

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test Suite
```bash
npx playwright test src/automationScripts/dashboard.spec.js
```

### Run Tests in Headed Mode
```bash
npx playwright test --headed
```

### Run Tests with UI Mode
```bash
npx playwright test --ui
```

### Run Tests on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Generate HTML Report
```bash
npx playwright test --reporter=html
npx playwright show-report
```

## Configuration

### Playwright Configuration (playwright.config.js)
Create a `playwright.config.js` file in the root directory:

```javascript
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './src/automationScripts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: 'https://creditcard-dashboard.example.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

## Logging

Test execution logs are automatically generated using Winston logger:
- **Console Output:** Real-time test execution logs
- **File Output:** `test-execution.log` in root directory

### Log Format
```
2024-12-30 10:15:30 [INFO]: Navigating to login page
2024-12-30 10:15:32 [INFO]: Login page loaded successfully
2024-12-30 10:15:33 [INFO]: Logging in with username: testuser@example.com
2024-12-30 10:15:35 [INFO]: Login completed
```

## Page Object Model Structure

### LoginPage (login.page.js)
- `navigate()` - Navigate to login page
- `login(username, password)` - Perform login
- `hasErrorMessage()` - Check for error message
- `getErrorMessage()` - Get error message text

### DashboardPage (dashboard.page.js)
- `waitForDashboardLoad()` - Wait for dashboard to load
- `getMonthlySpend()` - Get monthly spend KPI value
- `getTotalCreditLimit()` - Get total credit limit KPI value
- `getAvailableCredit()` - Get available credit KPI value
- `getOutstandingAmount()` - Get outstanding amount KPI value
- `hasLoadingIndicator()` - Check for loading indicator
- `hasNoDataMessage()` - Check for no data message
- `hasErrorMessage()` - Check for error message
- `getKPILayout()` - Get KPI layout type (stacked, grid-2-column, etc.)
- `getKPIFontSize()` - Get KPI font size

## Test Data

### Test Users
- `testuser@example.com` - Standard user with multiple cards
- `processing-user@example.com` - User with data being processed
- `active-user@example.com` - User with active cards and transactions
- `nocard-user@example.com` - User with no credit cards
- `multicard-user@example.com` - User with multiple credit cards
- `tencard-user@example.com` - User with 10 credit cards

### Test Credentials
- Password: `Pass@123` (for all test users)

## NFR Validation

### Performance Requirements
- ✅ Dashboard load time: < 2 seconds (QE-8061, QE-8045)
- ✅ Real-time KPI update: Within 30 seconds (QE-8052)
- ✅ Category drill-down: < 1.5 seconds (Analytics tests)
- ✅ Card navigation: < 100ms (Card Management tests)

### Responsive Design Requirements
- ✅ Mobile devices: 375x667, 390x844
- ✅ Tablet devices: 768x1024, 1024x1366
- ✅ Low resolution: 320x480
- ✅ Minimum font size: 12px (low-res), 14px (mobile)

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Playwright Tests

on:
  push:
    branches: [ CreditCardNew20261109161802 ]
  pull_request:
    branches: [ CreditCardNew20261109161802 ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: |
        npm install
        npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Troubleshooting

### Common Issues

1. **Tests failing due to timeout:**
   - Increase timeout in `playwright.config.js`
   - Check network connectivity
   - Verify application is accessible

2. **Locators not found:**
   - Verify application UI matches expected structure
   - Check if data-testid attributes are present
   - Update locators in Page Object classes

3. **Winston logger errors:**
   - Ensure winston is installed: `npm install winston`
   - Check file write permissions for `test-execution.log`

## Contributing

### Adding New Tests
1. Create test file in `src/automationScripts/`
2. Import required Page Objects
3. Follow existing test structure and naming conventions
4. Add comprehensive logging
5. Update README with new test scenarios

### Adding New Page Objects
1. Create page file in `src/automationScripts/pages/`
2. Define all locators in constructor
3. Create reusable methods
4. Add proper error handling
5. Include logging in methods

## Support

For issues or questions:
- Create an issue in GitHub repository
- Contact: DevOps Integration Team
- Label: CreditCardNew20261109161802

## License

Enterprise Internal Use Only

---

**Last Updated:** 2024-12-30  
**Version:** 1.0.0  
**Branch:** CreditCardNew20261109161802