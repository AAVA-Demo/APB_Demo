const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { TransactionPage } = require('./pages/transaction.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Credit Card Dashboard - KPI Display and Utilization', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    logger.info('Navigated to Credit Card Dashboard');
  });

  test('QE-10459 TS-001 TC-001: Verify aggregated KPIs for multiple linked credit cards displayed within 2 seconds', async ({ page }) => {
    logger.info('Test Case: QE-10459 TS-001 TC-001 - Aggregated KPIs for multiple cards');
    
    // Step 1: Authenticate user with multiple linked credit cards
    await dashboardPage.authenticateUser('testuser013');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User testuser013 authenticated successfully');

    // Step 2: Navigate to dashboard page
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard page loaded');

    // Step 3 & 4: Retrieve and validate aggregated KPIs
    const startTime = Date.now();
    const kpis = await dashboardPage.getKPIValues();
    const loadTime = Date.now() - startTime;

    expect(kpis.totalCreditLimit).toBe('$80,000');
    expect(kpis.totalAvailableCredit).toBe('$57,000');
    expect(kpis.totalOutstanding).toBe('$23,000');
    expect(kpis.totalMonthlySpend).toBe('$13,700');
    logger.info('KPI values validated successfully');

    // Step 5: Validate KPIs displayed within 2 seconds
    expect(loadTime).toBeLessThan(2000);
    logger.info(`KPIs rendered in ${loadTime}ms (< 2000ms requirement met)`);
  });

  test('QE-10459 TS-002 TC-001: Verify zero KPIs displayed when no credit cards are linked', async ({ page }) => {
    logger.info('Test Case: QE-10459 TS-002 TC-001 - No linked credit cards');
    
    // Step 1: Authenticate user with no linked credit cards
    await dashboardPage.authenticateUser('testuser014');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User testuser014 authenticated successfully');

    // Step 2: Navigate to dashboard page
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard page loaded');

    // Step 3 & 4: Validate all KPIs display zero values
    const kpis = await dashboardPage.getKPIValues();
    expect(kpis.totalCreditLimit).toBe('$0');
    expect(kpis.totalAvailableCredit).toBe('$0');
    expect(kpis.totalOutstanding).toBe('$0');
    expect(kpis.totalMonthlySpend).toBe('$0');
    logger.info('Zero KPI values validated successfully');

    // Step 5: Validate message indicating no credit cards linked
    const message = await dashboardPage.getNoCardsMessage();
    expect(message).toContain('No credit cards are linked to your account');
    logger.info('No credit cards message validated');
  });

  test('QE-10459 TS-003 TC-001: Verify error message when credit card data source is unavailable', async ({ page }) => {
    logger.info('Test Case: QE-10459 TS-003 TC-001 - Data source unavailable');
    
    // Step 1: Authenticate user with linked credit cards
    await dashboardPage.authenticateUser('testuser015');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User testuser015 authenticated successfully');

    // Step 2: Simulate credit card data source unavailability
    await dashboardPage.simulateDataSourceError();
    logger.info('Data source unavailability simulated');

    // Step 3: Navigate to dashboard page
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard page loaded');

    // Step 4: Validate error message displayed
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('KPI data cannot be calculated. Please retry or refresh the dashboard.');
    logger.info('Error message validated');

    // Step 5: Validate retry or refresh option is available
    await expect(dashboardPage.retryButton).toBeVisible();
    logger.info('Retry button is visible');
  });

  test('QE-10460 TS-001 TC-001: Verify real-time credit utilization metrics with recent transactions', async ({ page }) => {
    logger.info('Test Case: QE-10460 TS-001 TC-001 - Real-time credit utilization');
    
    // Step 1: Authenticate user with active credit cards and recent transactions
    await dashboardPage.authenticateUser('testuser016');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User testuser016 authenticated successfully');

    // Step 2: Navigate to dashboard
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded');

    // Step 3: Retrieve credit utilization metrics
    const utilization = await dashboardPage.getCreditUtilizationMetrics('CC001');
    logger.info('Credit utilization metrics retrieved');

    // Step 4: Validate available credit calculated correctly
    expect(utilization.availableCredit).toBe('$35,000');
    logger.info('Available credit validated: $35,000');

    // Step 5: Validate outstanding amount synchronized with latest transaction
    expect(utilization.outstandingAmount).toBe('$15,000');
    expect(utilization.lastUpdated).toBeDefined();
    logger.info('Outstanding amount and sync timestamp validated');
  });

  test('QE-10460 TS-002 TC-001: Verify warning indicator when credit limit is exceeded', async ({ page }) => {
    logger.info('Test Case: QE-10460 TS-002 TC-001 - Credit limit exceeded');
    
    // Step 1: Authenticate user with credit card exceeding limit
    await dashboardPage.authenticateUser('testuser017');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User testuser017 authenticated successfully');

    // Step 2: Navigate to dashboard
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded');

    // Step 3: Retrieve credit utilization metrics
    const utilization = await dashboardPage.getCreditUtilizationMetrics('CC003');
    logger.info('Credit utilization metrics retrieved');

    // Step 4: Validate available credit is negative
    expect(utilization.availableCredit).toBe('-$500');
    logger.info('Negative available credit validated: -$500');

    // Step 5: Validate warning indicator displayed
    const warningIndicator = await dashboardPage.getWarningIndicator('CC003');
    expect(warningIndicator).toContain('Credit limit exceeded');
    await expect(dashboardPage.warningIcon('CC003')).toBeVisible();
    logger.info('Warning indicator validated');
  });

  test('QE-10460 TS-003 TC-001: Verify responsive layout on mobile device', async ({ page }) => {
    logger.info('Test Case: QE-10460 TS-003 TC-001 - Mobile responsive layout');
    
    // Step 1: Authenticate user with active credit cards
    await dashboardPage.authenticateUser('testuser018');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User testuser018 authenticated successfully');

    // Step 2: Set mobile viewport (iPhone 12)
    await page.setViewportSize({ width: 375, height: 812 });
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded on mobile viewport (375x812)');

    // Step 3: Retrieve credit utilization metrics
    const utilization = await dashboardPage.getCreditUtilizationMetrics('CC001');
    logger.info('Credit utilization metrics retrieved');

    // Step 4: Validate responsive layout without horizontal scrolling
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScroll();
    expect(hasHorizontalScroll).toBe(false);
    logger.info('No horizontal scrolling detected');

    // Step 5: Validate values displayed accurately without truncation
    expect(utilization.availableCredit).toBe('$35,000');
    expect(utilization.outstandingAmount).toBe('$15,000');
    const isTruncated = await dashboardPage.isTextTruncated();
    expect(isTruncated).toBe(false);
    logger.info('Values displayed without truncation');
  });
});

test.describe('Credit Card Transactions - Filtering and Listing', () => {
  let transactionPage;

  test.beforeEach(async ({ page }) => {
    transactionPage = new TransactionPage(page);
    await transactionPage.navigate();
    logger.info('Navigated to Transaction Management page');
  });

  test('QE-10458 TS-001 TC-001: Verify filtering transactions by valid credit card ID', async ({ page }) => {
    logger.info('Test Case: QE-10458 TS-001 TC-001 - Filter by valid card ID');
    
    // Step 1: Authenticate user and retrieve linked credit cards
    await transactionPage.authenticateUser('testuser001');
    const cards = await transactionPage.getLinkedCards();
    expect(cards).toContain('CC001');
    expect(cards).toContain('CC002');
    expect(cards).toContain('CC003');
    logger.info('User authenticated, cards retrieved: CC001, CC002, CC003');

    // Step 2: Apply filter by selecting card ID CC001
    await transactionPage.selectCardFilter('CC001');
    await expect(transactionPage.filterAppliedIndicator).toBeVisible();
    logger.info('Filter applied for card ID: CC001');

    // Step 3: Retrieve filtered transaction list
    const transactions = await transactionPage.getTransactionList();
    expect(transactions.length).toBeGreaterThan(0);
    logger.info(`Retrieved ${transactions.length} transactions`);

    // Step 4: Validate all transactions have cardId = CC001
    transactions.forEach(txn => {
      expect(txn.cardId).toBe('CC001');
    });
    logger.info('All transactions match cardId CC001');

    // Step 5: Validate transaction details accuracy
    transactions.forEach(txn => {
      expect(txn.timestamp).toBeDefined();
      expect(txn.amount).toBeDefined();
      expect(txn.merchantName).toBeDefined();
      expect(txn.category).toBeDefined();
    });
    logger.info('Transaction details validated');
  });

  test('QE-10458 TS-002 TC-001: Verify empty list message for card with no transactions', async ({ page }) => {
    logger.info('Test Case: QE-10458 TS-002 TC-001 - Card with no transactions');
    
    // Step 1: Authenticate user and retrieve linked credit cards
    await transactionPage.authenticateUser('testuser002');
    const cards = await transactionPage.getLinkedCards();
    expect(cards).toContain('CC004');
    logger.info('User authenticated, card CC004 retrieved');

    // Step 2: Apply filter by selecting card ID CC004
    await transactionPage.selectCardFilter('CC004');
    await expect(transactionPage.filterAppliedIndicator).toBeVisible();
    logger.info('Filter applied for card ID: CC004');

    // Step 3: Retrieve filtered transaction list
    const transactions = await transactionPage.getTransactionList();
    expect(transactions.length).toBe(0);
    logger.info('Empty transaction list confirmed');

    // Step 4: Validate no transactions message displayed
    const message = await transactionPage.getNoTransactionsMessage();
    expect(message).toContain('No transactions available for the selected card');
    logger.info('No transactions message validated');
  });

  test('QE-10458 TS-003 TC-001: Verify error message for invalid card ID', async ({ page }) => {
    logger.info('Test Case: QE-10458 TS-003 TC-001 - Invalid card ID');
    
    // Step 1: Authenticate user and retrieve linked credit cards
    await transactionPage.authenticateUser('testuser003');
    const cards = await transactionPage.getLinkedCards();
    expect(cards).toContain('CC001');
    expect(cards).toContain('CC002');
    logger.info('User authenticated, cards retrieved');

    // Step 2: Attempt to apply filter with invalid card ID CC999
    await transactionPage.selectCardFilter('CC999');
    logger.info('Filter request sent with invalid card ID: CC999');

    // Step 3: Validate error message displayed
    const errorMessage = await transactionPage.getErrorMessage();
    expect(errorMessage).toContain('Card ID is not recognized or does not belong to your account');
    logger.info('Error message validated');

    // Step 4: Validate no transaction data returned
    const transactions = await transactionPage.getTransactionList();
    expect(transactions.length).toBe(0);
    logger.info('No transaction data returned');
  });

  test('QE-10462 TS-001 TC-001: Verify consolidated transaction list sorted by timestamp', async ({ page }) => {
    logger.info('Test Case: QE-10462 TS-001 TC-001 - Consolidated transaction list');
    
    // Step 1: Authenticate user with multiple linked credit cards
    await transactionPage.authenticateUser('testuser004');
    const cards = await transactionPage.getLinkedCards();
    expect(cards).toContain('CC001');
    expect(cards).toContain('CC002');
    expect(cards).toContain('CC003');
    logger.info('User authenticated with multiple cards');

    // Step 2: Access transaction management interface without filter
    await transactionPage.clearAllFilters();
    await expect(transactionPage.transactionListContainer).toBeVisible();
    logger.info('Transaction management interface loaded');

    // Step 3: Retrieve consolidated transaction list
    const transactions = await transactionPage.getTransactionList();
    expect(transactions.length).toBeGreaterThan(0);
    logger.info(`Retrieved ${transactions.length} transactions from all cards`);

    // Step 4: Validate transactions sorted by timestamp descending
    for (let i = 0; i < transactions.length - 1; i++) {
      const currentTimestamp = new Date(transactions[i].timestamp);
      const nextTimestamp = new Date(transactions[i + 1].timestamp);
      expect(currentTimestamp.getTime()).toBeGreaterThanOrEqual(nextTimestamp.getTime());
    }
    logger.info('Transactions sorted by timestamp in descending order');

    // Step 5: Validate transaction fields accuracy
    transactions.forEach(txn => {
      expect(txn.amount).toBeDefined();
      expect(txn.merchantName).toBeDefined();
      expect(txn.timestamp).toBeDefined();
    });
    logger.info('Transaction fields validated');
  });

  test('QE-10462 TS-002 TC-001: Verify error message when data source is unavailable', async ({ page }) => {
    logger.info('Test Case: QE-10462 TS-002 TC-001 - Data source unavailable');
    
    // Step 1: Authenticate user with multiple linked credit cards
    await transactionPage.authenticateUser('testuser005');
    logger.info('User authenticated');

    // Step 2: Simulate transaction data source unavailability
    await transactionPage.simulateDataSourceError();
    logger.info('Data source unavailability simulated');

    // Step 3: Access transaction management interface
    await transactionPage.navigate();
    await transactionPage.waitForPageLoad();
    logger.info('Transaction interface accessed');

    // Step 4: Validate error message displayed
    const errorMessage = await transactionPage.getErrorMessage();
    expect(errorMessage).toContain('Transaction data cannot be retrieved at this time. Please try again later.');
    logger.info('Error message validated');
  });

  test('QE-10462 TS-003 TC-001: Verify single card transaction display with complete details', async ({ page }) => {
    logger.info('Test Case: QE-10462 TS-003 TC-001 - Single card transactions');
    
    // Step 1: Authenticate user with single linked credit card
    await transactionPage.authenticateUser('testuser006');
    const cards = await transactionPage.getLinkedCards();
    expect(cards).toContain('CC005');
    logger.info('User authenticated with single card: CC005');

    // Step 2: Access transaction management interface
    await expect(transactionPage.transactionListContainer).toBeVisible();
    logger.info('Transaction management interface loaded');

    // Step 3: Retrieve transaction list
    const transactions = await transactionPage.getTransactionList();
    expect(transactions.length).toBeGreaterThan(0);
    logger.info(`Retrieved ${transactions.length} transactions for card CC005`);

    // Step 4: Validate complete transaction details
    transactions.forEach(txn => {
      expect(txn.transactionId).toBeDefined();
      expect(txn.timestamp).toBeDefined();
      expect(txn.amount).toBeDefined();
      expect(txn.merchantName).toBeDefined();
      expect(txn.category).toBeDefined();
    });
    logger.info('All required transaction fields validated');
  });
});

test.describe('Credit Card Analytics - Spending Trends and Category Analysis', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    logger.info('Navigated to Analytics page');
  });

  test('QE-10461 TS-001 TC-001: Verify monthly spend trends chart with accurate data', async ({ page }) => {
    logger.info('Test Case: QE-10461 TS-001 TC-001 - Monthly spend trends');
    
    // Step 1: Authenticate user with 3+ months transaction history
    await analyticsPage.authenticateUser('testuser007');
    logger.info('User authenticated with transaction history: Jan-Mar 2024');

    // Step 2: Access trends visualization section
    await expect(analyticsPage.trendsVisualizationContainer).toBeVisible();
    logger.info('Trends visualization interface loaded');

    // Step 3: Retrieve monthly spend trends data
    const startTime = Date.now();
    const trendsData = await analyticsPage.getMonthlyTrendsData();
    const loadTime = Date.now() - startTime;
    logger.info('Monthly trends data retrieved');

    // Step 4: Validate chart displays accurate month labels and amounts
    expect(trendsData['Jan 2024']).toBe('$15,000');
    expect(trendsData['Feb 2024']).toBe('$18,000');
    expect(trendsData['Mar 2024']).toBe('$20,000');
    logger.info('Month labels and amounts validated');

    // Step 5: Validate chart renders within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    logger.info(`Chart rendered in ${loadTime}ms (< 3000ms requirement met)`);
  });

  test('QE-10461 TS-002 TC-001: Verify insufficient data message for less than 3 months history', async ({ page }) => {
    logger.info('Test Case: QE-10461 TS-002 TC-001 - Insufficient data');
    
    // Step 1: Authenticate user with less than 3 months history
    await analyticsPage.authenticateUser('testuser008');
    logger.info('User authenticated with transaction history: Mar 2024 only');

    // Step 2: Access trends visualization section
    await expect(analyticsPage.trendsVisualizationContainer).toBeVisible();
    logger.info('Trends visualization interface loaded');

    // Step 3: Retrieve monthly spend trends data
    const trendsData = await analyticsPage.getMonthlyTrendsData();
    logger.info('Monthly trends data retrieved');

    // Step 4: Validate insufficient data message displayed
    const message = await analyticsPage.getInsufficientDataMessage();
    expect(message).toContain('Insufficient data to generate meaningful trends. Showing available data for existing months.');
    logger.info('Insufficient data message validated');

    // Step 5: Validate available data for Mar 2024 displayed
    expect(trendsData['Mar 2024']).toBe('$12,000');
    logger.info('Available data for Mar 2024 validated');
  });

  test('QE-10461 TS-003 TC-001: Verify drill-down on monthly trends chart', async ({ page }) => {
    logger.info('Test Case: QE-10461 TS-003 TC-001 - Drill-down on trends');
    
    // Step 1: Authenticate user with multiple months history
    await analyticsPage.authenticateUser('testuser009');
    logger.info('User authenticated with transaction history: Jan-Mar 2024');

    // Step 2: Access trends visualization and display chart
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    logger.info('Monthly trends chart displayed');

    // Step 3: Trigger drill-down on Feb 2024 data point
    await analyticsPage.clickMonthDataPoint('Feb 2024');
    logger.info('Drill-down triggered for Feb 2024');

    // Step 4: Retrieve detailed transaction breakdown
    const breakdown = await analyticsPage.getMonthBreakdown('Feb 2024');
    expect(breakdown).toBeDefined();
    logger.info('Detailed transaction breakdown retrieved');

    // Step 5: Validate breakdown includes category totals and transaction list
    expect(breakdown.categories).toBeDefined();
    expect(breakdown.transactions).toBeDefined();
    expect(breakdown.categories.length).toBeGreaterThan(0);
    logger.info('Category totals and transaction list validated');
  });

  test('QE-10463 TS-001 TC-001: Verify category-wise spending visualization with accurate data', async ({ page }) => {
    logger.info('Test Case: QE-10463 TS-001 TC-001 - Category-wise spending');
    
    // Step 1: Authenticate user with multi-category transaction history
    await analyticsPage.authenticateUser('testuser010');
    logger.info('User authenticated with categories: Food & Dining, Fuel, Shopping, Travel');

    // Step 2: Access spending analytics dashboard
    await expect(analyticsPage.spendingAnalyticsDashboard).toBeVisible();
    logger.info('Spending analytics dashboard loaded');

    // Step 3: Retrieve category-wise spending data
    const categoryData = await analyticsPage.getCategorySpendingData();
    expect(categoryData).toBeDefined();
    logger.info('Category-wise spending data retrieved');

    // Step 4: Validate accurate totals for all nine categories
    expect(categoryData['Food & Dining']).toEqual({ amount: '$5,000', transactionCount: 20 });
    expect(categoryData['Fuel']).toEqual({ amount: '$1,200', transactionCount: 10 });
    expect(categoryData['Shopping']).toEqual({ amount: '$3,000', transactionCount: 15 });
    expect(categoryData['Travel']).toEqual({ amount: '$2,500', transactionCount: 5 });
    expect(categoryData['Entertainment']).toEqual({ amount: '$0', transactionCount: 0 });
    expect(categoryData['Utilities']).toEqual({ amount: '$0', transactionCount: 0 });
    expect(categoryData['Healthcare']).toEqual({ amount: '$0', transactionCount: 0 });
    expect(categoryData['Education']).toEqual({ amount: '$0', transactionCount: 0 });
    expect(categoryData['Miscellaneous']).toEqual({ amount: '$0', transactionCount: 0 });
    logger.info('All category totals and transaction counts validated');

    // Step 5: Validate percentages calculated correctly
    const percentages = await analyticsPage.getCategoryPercentages();
    const totalPercentage = Object.values(percentages).reduce((sum, pct) => sum + pct, 0);
    expect(totalPercentage).toBe(100);
    logger.info('Category percentages sum to 100%');
  });

  test('QE-10463 TS-002 TC-001: Verify single category spending with zero values for others', async ({ page }) => {
    logger.info('Test Case: QE-10463 TS-002 TC-001 - Single category spending');
    
    // Step 1: Authenticate user with single category history
    await analyticsPage.authenticateUser('testuser011');
    logger.info('User authenticated with category: Food & Dining only');

    // Step 2: Access spending analytics dashboard
    await expect(analyticsPage.spendingAnalyticsDashboard).toBeVisible();
    logger.info('Spending analytics dashboard loaded');

    // Step 3: Retrieve category-wise spending data
    const categoryData = await analyticsPage.getCategorySpendingData();
    logger.info('Category-wise spending data retrieved');

    // Step 4: Validate Food & Dining non-zero, all others zero
    expect(categoryData['Food & Dining'].amount).toBe('$8,000');
    expect(categoryData['Fuel'].amount).toBe('$0');
    expect(categoryData['Shopping'].amount).toBe('$0');
    expect(categoryData['Travel'].amount).toBe('$0');
    expect(categoryData['Entertainment'].amount).toBe('$0');
    expect(categoryData['Utilities'].amount).toBe('$0');
    expect(categoryData['Healthcare'].amount).toBe('$0');
    expect(categoryData['Education'].amount).toBe('$0');
    expect(categoryData['Miscellaneous'].amount).toBe('$0');
    logger.info('Single category validated with all others at $0');

    // Step 5: Validate zero-value categories clearly indicated
    const zeroIndicators = await analyticsPage.getZeroCategoryIndicators();
    expect(zeroIndicators.length).toBe(8);
    logger.info('Zero-value categories clearly indicated');
  });

  test('QE-10463 TS-003 TC-001: Verify error message when categorization service fails', async ({ page }) => {
    logger.info('Test Case: QE-10463 TS-003 TC-001 - Categorization service failure');
    
    // Step 1: Authenticate user with transaction history
    await analyticsPage.authenticateUser('testuser012');
    logger.info('User authenticated');

    // Step 2: Simulate categorization service failure
    await analyticsPage.simulateCategorizationServiceError();
    logger.info('Categorization service failure simulated');

    // Step 3: Access spending analytics dashboard
    await analyticsPage.navigate();
    await analyticsPage.waitForPageLoad();
    logger.info('Dashboard accessed');

    // Step 4: Validate error message displayed
    const errorMessage = await analyticsPage.getErrorMessage();
    expect(errorMessage).toContain('Category analysis is temporarily unavailable. Please retry or view uncategorized transactions.');
    logger.info('Error message validated');

    // Step 5: Validate retry option available
    await expect(analyticsPage.retryButton).toBeVisible();
    logger.info('Retry button is visible');
  });
});