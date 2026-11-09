# Jasmine Unit Test Suite - Execution Guide

## Overview
This document provides instructions for executing the Jasmine unit test suite generated for the APB_Demo repository, branch `CreditCardNew20261109190012`.

## Test Suite Summary

### Services Tested (5 files)
1. **analytics-engine.factory.spec.js** - Analytics aggregation and category breakdown
2. **category.factory.spec.js** - Category classification service (9 predefined categories)
3. **credit-card-data.factory.spec.js** - Credit card data retrieval and validation
4. **transaction.factory.spec.js** - Transaction data, monthly spend, and card spending
5. **user-auth.factory.spec.js** - User authentication and validation

## Prerequisites

### Required Dependencies
```bash
npm install --save-dev jasmine-core karma karma-jasmine karma-chrome-launcher karma-coverage angular-mocks
```

### AngularJS Dependencies
```bash
npm install angular angular-route angular-mocks
```

## Test Execution Methods

### Method 1: Karma Test Runner (Recommended)

#### 1. Create karma.conf.js
```javascript
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/app/app.module.js',
      'src/app/app.config.js',
      'src/app/services/**/*.js',
      'src/app/services/__tests__/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      'src/app/services/**/*.js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  });
};
```

#### 2. Run Tests
```bash
karma start karma.conf.js
```

#### 3. Single Run (CI/CD)
```bash
karma start karma.conf.js --single-run
```

### Method 2: Standalone Jasmine

#### 1. Initialize Jasmine
```bash
jasmine init
```

#### 2. Update spec/support/jasmine.json
```json
{
  "spec_dir": "src/app/services/__tests__",
  "spec_files": [
    "**/*.spec.js"
  ],
  "helpers": [
    "../../app.module.js",
    "../../app.config.js",
    "../**/*.js"
  ],
  "stopSpecOnExpectationFailure": false,
  "random": false
}
```

#### 3. Run Tests
```bash
jasmine
```

## Test Coverage Report

### Expected Coverage Metrics
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: 100%
- **Lines**: > 90%

### View Coverage Report
After running Karma with coverage:
```bash
open coverage/index.html
```

## Test Scenarios Covered

### analytics-engine.factory.spec.js
- ✅ Category aggregation with multiple transactions
- ✅ Top category identification
- ✅ Empty transaction array handling
- ✅ Percentage calculation accuracy
- ✅ Single category aggregation
- ✅ Promise resolution timing

### category.factory.spec.js
- ✅ Returns all 9 predefined categories
- ✅ Individual category presence validation
- ✅ Promise resolution timing
- ✅ Consistency across multiple calls

### credit-card-data.factory.spec.js
- ✅ Fetch all cards successfully
- ✅ Card data structure validation
- ✅ Masked card numbers
- ✅ Credit limit calculations
- ✅ Card-specific retrieval by ID
- ✅ Error handling for invalid cardId
- ✅ Multiple card types (Visa, MasterCard, Amex)

### transaction.factory.spec.js
- ✅ Monthly spend calculation
- ✅ Card-wise spending with 12-month trends
- ✅ Transaction retrieval with date filtering
- ✅ Empty card ID array handling
- ✅ No matching transactions for date range
- ✅ Partial date range handling

### user-auth.factory.spec.js
- ✅ User validation data structure
- ✅ Validated flag verification
- ✅ UserId and userName verification
- ✅ Promise resolution
- ✅ Consistency across multiple calls
- ✅ Property type validation

## Continuous Integration

### GitHub Actions Example
```yaml
name: Run Jasmine Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: karma start karma.conf.js --single-run --browsers ChromeHeadless
      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          files: ./coverage/lcov.info
```

## Troubleshooting

### Issue: Module 'creditCardApp' not found
**Solution**: Ensure app.module.js is loaded before test specs
```javascript
files: [
  'src/app/app.module.js',  // Load first
  'src/app/**/*.js',
  'src/app/**/*.spec.js'
]
```

### Issue: Timeout errors
**Solution**: Increase Jasmine timeout in spec files
```javascript
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
```

### Issue: $rootScope.$apply() errors
**Solution**: Ensure proper digest cycle timing
```javascript
setTimeout(function() {
  $rootScope.$apply();
}, 600); // Adjust based on service delay
```

## Best Practices

1. **Run tests before committing**
   ```bash
   npm test
   ```

2. **Maintain > 90% coverage**
   - Add tests for new features
   - Update tests when modifying services

3. **Use descriptive test names**
   - Follow pattern: "should [expected behavior] when [condition]"

4. **Mock external dependencies**
   - Use Jasmine spies for $http calls
   - Mock API responses

5. **Test edge cases**
   - Empty arrays
   - Null/undefined values
   - Invalid inputs
   - Error conditions

## Additional Resources

- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Documentation](https://karma-runner.github.io/)
- [AngularJS Testing Guide](https://docs.angularjs.org/guide/unit-testing)
- [Angular Mocks Documentation](https://docs.angularjs.org/api/ngMock)

## Support

For issues or questions:
1. Check test output for specific error messages
2. Review coverage report for untested code paths
3. Consult test documentation comments in spec files
4. Verify all dependencies are installed correctly

---

**Generated for**: APB_Demo Repository  
**Branch**: CreditCardNew20261109190012  
**Test Framework**: Jasmine  
**AngularJS Version**: 1.x  
**Total Test Files**: 5  
**Total Test Cases**: 50+  
**Coverage Target**: > 90%