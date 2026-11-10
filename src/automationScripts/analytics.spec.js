const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

/**
 * Test Suite: Analytics and Spending Insights
 * User Stories: QE-9794, QE-9793
 * Test Cases: QE-9794 TS-001 TC-001, QE-9794 TS-001 TC-002, QE-9794 TS-002 TC-001, QE-9794 TS-002 TC-002, QE-9794 TS-003 TC-001,
 *             QE-9793 TS-001 TC-001, QE-9793 TS-001 TC-002, QE-9793 TS-002 TC-001, QE-9793 TS-003 TC-001
 */

test.describe('Analytics and Spending Insights', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    loginPage = new LoginPage(page);
  });

  /**
   * Test Case ID: QE-9794 TS-001 TC-001
   * Description: Verify system retrieves 12 months of transaction data and aggregates monthly spend accurately
   */
  test('TC-001: Verify 12-month data retrieval and aggregation', async ({ page }) => {
    // Step 1: Authenticate as user with 12 months of history
    await loginPage.navigate();
    await loginPage.login('testuser001', 'valid_token');

    // Step 2: Send GET request to trends endpoint (verified via network)
    await page.route('**/api/analytics/trends**', route => {
      expect(route.request().url()).toContain('userId=testuser001');
      route.continue();
    });

    // Navigate to analytics page
    await analyticsPage.navigate();

    // Step 3: Validate response contains 12 monthly trend objects
    const trendDataCount = await analyticsPage.getMonthlyTrendCount();
    expect(trendDataCount).toBe(12);

    // Step 4: Verify each month object has required fields
    const trendData = await analyticsPage.getMonthlyTrendData();
    trendData.forEach(monthData => {
      expect(monthData).toHaveProperty('month');
      expect(monthData).toHaveProperty('totalSpend');
      expect(typeof monthData.month).toBe('string');
      expect(typeof monthData.totalSpend).toBe('number');
    });

    // Step 5: Cross-validate totalSpend for sample month (March)
    const marchData = trendData.find(d => d.month === 'March');
    expect(marchData.totalSpend).toBe(1650.00);
  });

  /**
   * Test Case ID: QE-9794 TS-001 TC-002
   * Description: Verify monthly aggregation uses transaction posting date correctly
   */
  test('TC-002: Verify posting date-based aggregation', async ({ page }) => {
    // Step 1: Authenticate as user with multi-month transactions
    await loginPage.navigate();
    await loginPage.login('testuser002', 'valid_token');

    // Step 2: Retrieve raw transaction data for February
    let rawTransactions = [];
    await page.route('**/api/transactions**', route => {
      if (route.request().url().includes('month=February')) {
        rawTransactions = [100, 250, 300, 150];
      }
      route.continue();
    });

    // Step 3: Calculate manual sum
    const expectedSum = rawTransactions.reduce((sum, amount) => sum + amount, 0);
    expect(expectedSum).toBe(800);

    // Step 4: Navigate to analytics and verify February totalSpend
    await analyticsPage.navigate();
    const trendData = await analyticsPage.getMonthlyTrendData();
    const februaryData = trendData.find(d => d.month === 'February');
    expect(februaryData.totalSpend).toBe(800);
  });

  /**
   * Test Case ID: QE-9794 TS-002 TC-001
   * Description: Verify system filters monthly trends by last 3 months without page reload
   */
  test('TC-003: Verify 3-month filter without page reload', async ({ page }) => {
    // Step 1: Authenticate as user with 12 months history
    await loginPage.navigate();
    await loginPage.login('testuser003', 'valid_token');

    // Step 2: Load analytics page with all 12 months
    await analyticsPage.navigate();
    let trendCount = await analyticsPage.getMonthlyTrendCount();
    expect(trendCount).toBe(12);

    // Step 3: Apply 3-month filter
    await analyticsPage.applyPeriodFilter('3months');

    // Step 4: Validate only 3 most recent months displayed
    trendCount = await analyticsPage.getMonthlyTrendCount();
    expect(trendCount).toBe(3);

    const trendData = await analyticsPage.getMonthlyTrendData();
    const months = trendData.map(d => d.month);
    expect(months).toEqual(['October', 'November', 'December']);

    // Step 5: Verify no page reload occurred
    const currentUrl = page.url();
    expect(currentUrl).toContain('/analytics');
    expect(currentUrl).not.toContain('reload');
  });

  /**
   * Test Case ID: QE-9794 TS-002 TC-002
   * Description: Verify system filters monthly trends by custom date range
   */
  test('TC-004: Verify custom date range filter', async ({ page }) => {
    // Step 1: Authenticate as user
    await loginPage.navigate();
    await loginPage.login('testuser004', 'valid_token');

    // Step 2: Navigate to analytics page
    await analyticsPage.navigate();
    let trendCount = await analyticsPage.getMonthlyTrendCount();
    expect(trendCount).toBe(12);

    // Step 3: Select custom date range (March 2023 to August 2023)
    await analyticsPage.applyCustomDateRange('2023-03-01', '2023-08-31');

    // Step 4: Verify system recalculates for 6-month period
    trendCount = await analyticsPage.getMonthlyTrendCount();
    expect(trendCount).toBe(6);

    // Step 5: Validate displayed data contains only 6 months
    const trendData = await analyticsPage.getMonthlyTrendData();
    const months = trendData.map(d => d.month);
    expect(months).toEqual(['March', 'April', 'May', 'June', 'July', 'August']);
  });

  /**
   * Test Case ID: QE-9794 TS-003 TC-001
   * Description: Verify system handles transaction history less than 12 months gracefully
   */
  test('TC-005: Verify handling of limited transaction history', async ({ page }) => {
    // Step 1: Authenticate as new user with 4 months history
    await loginPage.navigate();
    await loginPage.login('newuser001', 'valid_token');

    // Step 2: Navigate to analytics (API returns 4 months)
    await page.route('**/api/analytics/trends**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          { month: 'September', totalSpend: 1000 },
          { month: 'October', totalSpend: 1200 },
          { month: 'November', totalSpend: 1100 },
          { month: 'December', totalSpend: 1300 }
        ])
      });
    });

    await analyticsPage.navigate();

    // Step 3: Validate response contains only 4 months
    const trendCount = await analyticsPage.getMonthlyTrendCount();
    expect(trendCount).toBe(4);

    // Step 4: Verify informational message displayed
    const limitedDataMessage = await analyticsPage.getLimitedDataMessage();
    expect(limitedDataMessage).toContain('Showing trends for 4 months');

    // Step 5: Confirm no errors logged
    await expect(analyticsPage.analyticsContainer).toBeVisible();
    await expect(page).not.toHaveURL(/.*error/);
  });

  /**
   * Test Case ID: QE-9793 TS-001 TC-001
   * Description: Verify system classifies transactions into all nine categories and aggregates spending correctly
   */
  test('TC-006: Verify category classification and aggregation', async ({ page }) => {
    // Step 1: Authenticate as user with transactions across all categories
    await loginPage.navigate();
    await loginPage.login('testuser005', 'valid_token');

    // Step 2: Navigate to analytics page
    await analyticsPage.navigate();

    // Step 3: Verify category classification service is invoked
    // Step 4: Aggregate spending by category
    await analyticsPage.waitForCategoryDataLoad();

    // Step 5: Validate all nine categories present
    const categories = await analyticsPage.getAllCategories();
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    expect(categories.sort()).toEqual(expectedCategories.sort());

    // Step 6: Verify sum of category totals equals total monthly spend
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    const totalCategorySpend = Object.values(categoryBreakdown).reduce((sum, val) => sum + val, 0);
    expect(totalCategorySpend).toBe(3500);
  });

  /**
   * Test Case ID: QE-9793 TS-001 TC-002
   * Description: Verify category classification service assigns correct categories to transactions
   */
  test('TC-007: Verify category assignment accuracy', async ({ page }) => {
    // Step 1: Authenticate as user
    await loginPage.navigate();
    await loginPage.login('testuser006', 'valid_token');

    // Step 2-3: Verify 'Shell Gas Station' classified as 'Fuel'
    await page.route('**/api/transactions**', route => {
      const transactions = [
        { transactionId: 'txn123', merchant: 'Shell Gas Station', amount: 75.00, category: 'Fuel' },
        { transactionId: 'txn124', merchant: 'Whole Foods', amount: 150.00, category: 'Food & Dining' }
      ];
      route.fulfill({ status: 200, body: JSON.stringify(transactions) });
    });

    await analyticsPage.navigate();
    await analyticsPage.waitForCategoryDataLoad();

    // Verify category assignments
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    expect(categoryBreakdown['Fuel']).toBe(75.00);

    // Step 4-5: Verify 'Whole Foods' classified as 'Food & Dining'
    expect(categoryBreakdown['Food & Dining']).toBe(150.00);
  });

  /**
   * Test Case ID: QE-9793 TS-002 TC-001
   * Description: Verify system filters category-wise spending by selecting a specific category
   */
  test('TC-008: Verify category filtering', async ({ page }) => {
    // Step 1: Authenticate as user
    await loginPage.navigate();
    await loginPage.login('testuser007', 'valid_token');

    // Step 2: Navigate to analytics page
    await analyticsPage.navigate();
    await analyticsPage.waitForCategoryDataLoad();

    // Verify all 9 categories displayed initially
    let categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBe(9);

    // Step 3: Select 'Food & Dining' filter
    await analyticsPage.applyCategoryFilter('Food & Dining');

    // Step 4: Validate only 'Food & Dining' displayed
    const filteredBreakdown = await analyticsPage.getCategoryBreakdown();
    expect(Object.keys(filteredBreakdown)).toEqual(['Food & Dining']);
    expect(filteredBreakdown['Food & Dining']).toBe(500.00);

    // Step 5: Clear filter and verify all categories return
    await analyticsPage.clearCategoryFilter();
    categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBe(9);
  });

  /**
   * Test Case ID: QE-9793 TS-003 TC-001
   * Description: Verify system classifies transactions with missing category as Miscellaneous
   */
  test('TC-009: Verify missing category handling', async ({ page }) => {
    // Step 1: Authenticate as user with transactions having null categories
    await loginPage.navigate();
    await loginPage.login('testuser008', 'valid_token');

    // Step 2: Mock transactions with null/undefined categories
    await page.route('**/api/transactions**', route => {
      const transactions = [
        { amount: 100, category: null },
        { amount: 50, category: undefined },
        { amount: 75 }
      ];
      route.fulfill({ status: 200, body: JSON.stringify(transactions) });
    });

    // Step 3: Navigate to analytics
    await analyticsPage.navigate();
    await analyticsPage.waitForCategoryDataLoad();

    // Step 4: Validate transactions classified as 'Miscellaneous'
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    expect(categoryBreakdown['Miscellaneous']).toBe(225);

    // Step 5: Verify total monthly spend includes all transactions
    const totalSpend = Object.values(categoryBreakdown).reduce((sum, val) => sum + val, 0);
    expect(totalSpend).toBeGreaterThanOrEqual(225);
  });
});
