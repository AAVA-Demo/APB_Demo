const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Category-wise Spending Visualization - QE-8175', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    logger.info('Initializing Analytics Page for test execution');
  });

  test('QE-8175 TS-001 TC-001: Verify accurate spending breakdown across all 9 categories', async ({ page }) => {
    logger.info('Starting test: QE-8175 TS-001 TC-001');
    
    // Step 1: Authenticate user
    await analyticsPage.authenticateUser('user123', 'valid-token-xyz');
    logger.info('User authenticated successfully');
    
    // Step 2-3: Navigate to analytics and retrieve transaction data
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForSpendingDataLoad();
    
    // Step 4-6: Verify category breakdown with accurate amounts and percentages
    const categoryData = await analyticsPage.getCategoryBreakdown();
    
    const expectedCategories = [
      { category: 'Food & Dining', amount: 1250.50, percentage: 29.4 },
      { category: 'Fuel', amount: 680.25, percentage: 16.0 },
      { category: 'Shopping', amount: 950.75, percentage: 22.4 },
      { category: 'Travel', amount: 450.00, percentage: 10.6 },
      { category: 'Entertainment', amount: 320.50, percentage: 7.5 },
      { category: 'Utilities', amount: 280.00, percentage: 6.6 },
      { category: 'Healthcare', amount: 150.75, percentage: 3.5 },
      { category: 'Education', amount: 98.00, percentage: 2.3 },
      { category: 'Miscellaneous', amount: 70.00, percentage: 1.7 }
    ];
    
    expect(categoryData.length).toBe(9);
    
    for (let i = 0; i < expectedCategories.length; i++) {
      expect(categoryData[i].category).toBe(expectedCategories[i].category);
      expect(categoryData[i].amount).toBe(expectedCategories[i].amount);
      expect(categoryData[i].percentage).toBe(expectedCategories[i].percentage);
    }
    
    // Verify sum of percentages equals 100%
    const totalPercentage = categoryData.reduce((sum, cat) => sum + cat.percentage, 0);
    expect(totalPercentage).toBe(100);
    
    // Verify total spend
    const totalSpend = categoryData.reduce((sum, cat) => sum + cat.amount, 0);
    expect(totalSpend).toBe(4250.75);
    
    logger.info('All 9 categories verified with accurate amounts and percentages');
  });

  test('QE-8175 TS-002 TC-001: Verify system returns empty dataset when user has no transaction history', async ({ page }) => {
    logger.info('Starting test: QE-8175 TS-002 TC-001');
    
    // Step 1: Authenticate user with no transactions
    await analyticsPage.authenticateUser('user456', 'valid-token-abc');
    
    // Step 2-3: Navigate and verify empty dataset
    await page.route('**/api/analytics/spending', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          categoryBreakdown: [],
          message: 'No spending data available'
        })
      });
    });
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForSpendingDataLoad();
    
    // Step 4: Verify empty dataset and message
    const categoryData = await analyticsPage.getCategoryBreakdown();
    expect(categoryData.length).toBe(0);
    
    const message = await analyticsPage.getNoDataMessage();
    expect(message).toContain('No spending data available');
    logger.info('Empty dataset and appropriate message verified');
  });

  test('QE-8175 TS-002 TC-002: Verify appropriate message when no spending data available', async ({ page }) => {
    logger.info('Starting test: QE-8175 TS-002 TC-002');
    
    // Step 1-2: Authenticate and navigate
    await analyticsPage.authenticateUser('user789', 'valid-token-def');
    
    await page.route('**/api/analytics/spending', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          categoryBreakdown: [],
          totalSpend: 0,
          message: 'No spending data available'
        })
      });
    });
    
    await analyticsPage.navigateToAnalytics();
    
    // Step 3-4: Verify message in API response
    const message = await analyticsPage.getNoDataMessage();
    expect(message).toMatch(/No spending data available/i);
    
    const totalSpend = await analyticsPage.getTotalSpend();
    expect(totalSpend).toBe(0);
    logger.info('No spending data message verified successfully');
  });

  test('QE-8175 TS-003 TC-001: Verify error when transaction categorization engine fails', async ({ page }) => {
    logger.info('Starting test: QE-8175 TS-003 TC-001');
    
    // Step 1-2: Authenticate and retrieve transactions
    await analyticsPage.authenticateUser('user123', 'valid-token-xyz');
    
    // Step 3-5: Simulate categorization engine failure
    await page.route('**/api/analytics/spending', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({
          error: 'Transaction categorization failed',
          statusCode: 500
        })
      });
    });
    
    await analyticsPage.navigateToAnalytics();
    
    // Verify error response
    const errorMessage = await analyticsPage.getErrorMessage();
    expect(errorMessage).toContain('Transaction categorization failed');
    logger.info('Categorization engine failure error verified');
  });

  test('QE-8175 TS-003 TC-002: Verify uncategorized transaction data when categorization engine fails', async ({ page }) => {
    logger.info('Starting test: QE-8175 TS-003 TC-002');
    
    // Step 1-3: Authenticate and simulate categorization failure
    await analyticsPage.authenticateUser('user123', 'valid-token-xyz');
    
    await page.route('**/api/analytics/spending', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          categoryBreakdown: [],
          error: 'Unable to generate accurate category breakdown due to categorization failure',
          uncategorizedTransactions: 150
        })
      });
    });
    
    await analyticsPage.navigateToAnalytics();
    
    // Step 4-5: Verify uncategorized data and error
    const categoryData = await analyticsPage.getCategoryBreakdown();
    expect(categoryData.length).toBe(0);
    
    const errorMessage = await analyticsPage.getErrorMessage();
    expect(errorMessage).toContain('Unable to generate accurate category breakdown');
    logger.info('Uncategorized transaction data scenario verified');
  });
});

test.describe('Monthly Spend Trend Analysis - QE-8170', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    logger.info('Initializing Analytics Page for trend analysis tests');
  });

  test('QE-8170 TS-001 TC-001: Verify 12-month trend analysis with accurate data rendered within 1 second', async ({ page }) => {
    logger.info('Starting test: QE-8170 TS-001 TC-001');
    
    // Step 1-2: Authenticate and navigate
    await analyticsPage.authenticateUser('user123', 'valid-token-xyz');
    await analyticsPage.navigateToAnalytics();
    
    // Step 3-7: Measure rendering time
    const startTime = Date.now();
    await analyticsPage.navigateToTrendAnalysis();
    await analyticsPage.waitForTrendGraphRender();
    const renderTime = (Date.now() - startTime) / 1000;
    
    expect(renderTime).toBeLessThan(1);
    logger.info(`Trend graph rendered in ${renderTime} seconds`);
    
    // Step 4-8: Verify 12 months of accurate data
    const trendData = await analyticsPage.getMonthlyTrendData();
    expect(trendData.length).toBe(12);
    
    const expectedMonths = [
      { month: 'Jan 2024', amount: 3850.50 },
      { month: 'Feb 2024', amount: 4120.75 },
      { month: 'Mar 2024', amount: 3950.25 },
      { month: 'Apr 2024', amount: 4250.75 },
      { month: 'May 2024', amount: 4050.00 },
      { month: 'Jun 2024', amount: 4380.50 },
      { month: 'Jul 2024', amount: 4100.00 },
      { month: 'Aug 2024', amount: 3900.00 },
      { month: 'Sep 2024', amount: 4200.00 },
      { month: 'Oct 2024', amount: 4300.00 },
      { month: 'Nov 2024', amount: 4150.00 },
      { month: 'Dec 2024', amount: 4400.00 }
    ];
    
    for (let i = 0; i < expectedMonths.length; i++) {
      expect(trendData[i].month).toBe(expectedMonths[i].month);
      expect(trendData[i].amount).toBe(expectedMonths[i].amount);
    }
    
    // Verify interactive features
    const hasInteractiveFeatures = await analyticsPage.verifyInteractiveGraphFeatures();
    expect(hasInteractiveFeatures).toBe(true);
    logger.info('12-month trend analysis verified with accurate data and interactive features');
  });

  test('QE-8170 TS-002 TC-001: Verify limited trend data for user with only 2 months of history', async ({ page }) => {
    logger.info('Starting test: QE-8170 TS-002 TC-001');
    
    // Step 1-3: Authenticate and navigate
    await analyticsPage.authenticateUser('user789', 'valid-token-def');
    
    await page.route('**/api/analytics/spending', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          monthlyTrends: [
            { month: 'Nov 2024', amount: 2500.00 },
            { month: 'Dec 2024', amount: 2800.00 }
          ],
          message: 'Limited transaction history available. Showing data for 2 months. Comprehensive trend analysis requires at least 6 months of data.',
          dataPoints: 2
        })
      });
    });
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToTrendAnalysis();
    
    // Step 4-7: Verify limited data and message
    const trendData = await analyticsPage.getMonthlyTrendData();
    expect(trendData.length).toBe(2);
    expect(trendData[0].amount).toBe(2500.00);
    expect(trendData[1].amount).toBe(2800.00);
    
    const message = await analyticsPage.getLimitedDataMessage();
    expect(message).toContain('Limited transaction history');
    expect(message).toContain('2 months');
    logger.info('Limited trend data scenario verified with appropriate message');
  });

  test('QE-8170 TS-003 TC-001: Verify system fails to render within 1 second with high transaction volume', async ({ page }) => {
    logger.info('Starting test: QE-8170 TS-003 TC-001');
    
    // Step 1-3: Authenticate and simulate high volume
    await analyticsPage.authenticateUser('user999', 'valid-token-ghi');
    
    // Step 4: Simulate aggregation delay (1.5 seconds)
    await page.route('**/api/analytics/spending', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            monthlyTrends: [],
            transactionCount: 15000
          })
        });
      }, 1500);
    });
    
    await analyticsPage.navigateToAnalytics();
    
    // Step 5-6: Measure rendering time
    const startTime = Date.now();
    await analyticsPage.navigateToTrendAnalysis();
    
    try {
      await analyticsPage.waitForTrendGraphRender({ timeout: 1000 });
    } catch (error) {
      const renderTime = (Date.now() - startTime) / 1000;
      expect(renderTime).toBeGreaterThan(1);
      logger.info(`Trend graph failed to render within 1 second (took ${renderTime}s)`);
      
      const timeoutError = await analyticsPage.getTimeoutError();
      expect(timeoutError).toMatch(/timeout|performance/i);
      logger.info('High transaction volume performance degradation verified');
    }
  });
});