const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Monthly Spend Trends Analysis Tests', () => {
  let loginPage;
  let dashboardPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    analyticsPage = new AnalyticsPage(page);
    
    await loginPage.navigate();
  });

  test('QE-7525 TS-001 TC-001: Verify monthly spend trends chart displays accurately for user with 12 months history', async ({ page }) => {
    logger.info('Test Case: QE-7525 TS-001 TC-001 - 12 Months Trend Analysis');
    
    await test.step('Login with user having 12 months history', async () => {
      await loginPage.login('user12months@example.com', 'Pass12Month!');
      logger.info('User with 12 months history authenticated');
    });

    await test.step('Navigate to Analytics section', async () => {
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.navigateToAnalytics();
      logger.info('Navigated to Analytics section');
    });

    await test.step('Access Monthly Spend Trends view', async () => {
      await analyticsPage.waitForAnalyticsPageLoad();
      await analyticsPage.selectMonthlyTrendsView();
      logger.info('Monthly Spend Trends view accessed');
    });

    await test.step('Verify chart displays 12 months of data', async () => {
      await analyticsPage.waitForTrendsChartLoad();
      const monthsCount = await analyticsPage.getTrendsChartMonthsCount();
      expect(monthsCount).toBe(12);
      logger.info(`Chart displays ${monthsCount} months of data`);
    });

    await test.step('Verify accurate monthly spending totals', async () => {
      const monthlyData = await analyticsPage.getMonthlyTrendsData();
      expect(monthlyData.length).toBe(12);
      
      monthlyData.forEach((data, index) => {
        expect(data.month).toBeTruthy();
        expect(data.total).toBeGreaterThan(0);
        logger.info(`Month ${index + 1}: ${data.month} - Total: ₹${data.total}`);
      });
    });

    await test.step('Test drill-down capability', async () => {
      await analyticsPage.clickTrendsDataPoint('March 2024');
      await analyticsPage.waitForDrillDownView();
      
      const drillDownVisible = await analyticsPage.isDrillDownViewVisible();
      expect(drillDownVisible).toBe(true);
      logger.info('Drill-down view opened successfully for selected month');
    });
  });

  test('QE-7525 TS-002 TC-001: Verify trends displays available months only for user with less than 12 months history', async ({ page }) => {
    logger.info('Test Case: QE-7525 TS-002 TC-001 - Partial History (6 months)');
    
    await test.step('Login with user having 6 months history', async () => {
      await loginPage.login('user6months@example.com', 'Pass6Month!');
      logger.info('User with 6 months history authenticated');
    });

    await test.step('Navigate to Analytics and Monthly Trends', async () => {
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.navigateToAnalytics();
      await analyticsPage.waitForAnalyticsPageLoad();
      await analyticsPage.selectMonthlyTrendsView();
      logger.info('Monthly Spend Trends view accessed');
    });

    await test.step('Verify chart displays only 6 months of data', async () => {
      await analyticsPage.waitForTrendsChartLoad();
      const monthsCount = await analyticsPage.getTrendsChartMonthsCount();
      expect(monthsCount).toBe(6);
      logger.info(`Chart displays ${monthsCount} months of available data`);
    });

    await test.step('Verify insufficient data message is displayed', async () => {
      const insufficientDataMessage = await analyticsPage.getInsufficientDataMessage();
      expect(insufficientDataMessage).toContain('Only 6 months of data available');
      logger.info(`Message displayed: ${insufficientDataMessage}`);
    });
  });

  test('QE-7525 TS-003 TC-001: Verify error message when aggregation service fails', async ({ page }) => {
    logger.info('Test Case: QE-7525 TS-003 TC-001 - Aggregation Service Failure');
    
    await test.step('Simulate aggregation service failure', async () => {
      await page.route('**/api/transactions/categorized**', route => route.abort());
      await page.route('**/api/analytics/**', route => route.abort());
      logger.info('Aggregation service routes blocked');
    });

    await test.step('Login and navigate to Analytics', async () => {
      await loginPage.login('testuser@example.com', 'ValidPass123');
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.navigateToAnalytics();
      logger.info('Navigated to Analytics section');
    });

    await test.step('Attempt to access Monthly Spend Trends', async () => {
      await analyticsPage.waitForAnalyticsPageLoad();
      await analyticsPage.selectMonthlyTrendsView();
      logger.info('Attempted to access Monthly Spend Trends');
    });

    await test.step('Verify error message is displayed', async () => {
      await analyticsPage.waitForErrorMessage();
      const errorMessage = await analyticsPage.getErrorMessage();
      expect(errorMessage).toContain('Failed to load analytics');
      logger.info(`Error message displayed: ${errorMessage}`);
    });

    await test.step('Verify no incomplete trend data is shown', async () => {
      const chartVisible = await analyticsPage.isTrendsChartVisible();
      expect(chartVisible).toBe(false);
      logger.info('Confirmed no incomplete trend data is displayed');
    });
  });
});

test.describe('Category-Wise Spending Visualization Tests', () => {
  let loginPage;
  let dashboardPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    analyticsPage = new AnalyticsPage(page);
    
    await loginPage.navigate();
  });

  test('QE-7522 TS-001 TC-001: Verify category-wise spending visualization displays accurately', async ({ page }) => {
    logger.info('Test Case: QE-7522 TS-001 TC-001 - Category-wise Visualization');
    
    await test.step('Login with user having multi-category transactions', async () => {
      await loginPage.login('multicategory@example.com', 'MultiCat789');
      logger.info('User with multi-category transactions authenticated');
    });

    await test.step('Navigate to Analytics section', async () => {
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.navigateToAnalytics();
      logger.info('Navigated to Analytics section');
    });

    await test.step('Access Category-Wise Spending Visualization', async () => {
      await analyticsPage.waitForAnalyticsPageLoad();
      const startTime = Date.now();
      await analyticsPage.selectCategoryWiseView();
      await analyticsPage.waitForCategoryChartLoad();
      const renderTime = Date.now() - startTime;
      
      logger.info(`Category chart render time: ${renderTime}ms`);
      expect(renderTime).toBeLessThanOrEqual(3000);
    });

    await test.step('Verify all predefined categories are displayed', async () => {
      const expectedCategories = [
        'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
        'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
      ];
      
      const displayedCategories = await analyticsPage.getDisplayedCategories();
      expect(displayedCategories.length).toBe(9);
      
      expectedCategories.forEach(category => {
        expect(displayedCategories).toContain(category);
      });
      
      logger.info(`All 9 categories displayed: ${displayedCategories.join(', ')}`);
    });

    await test.step('Verify accurate spending totals and percentages', async () => {
      const categoryData = await analyticsPage.getCategorySpendingData();
      
      categoryData.forEach(data => {
        expect(data.category).toBeTruthy();
        expect(data.total).toBeGreaterThan(0);
        expect(data.percentage).toBeGreaterThan(0);
        logger.info(`${data.category}: ₹${data.total} (${data.percentage}%)`);
      });
    });
  });

  test('QE-7522 TS-001 TC-002: Verify interactive filtering and drill-down capabilities', async ({ page }) => {
    logger.info('Test Case: QE-7522 TS-001 TC-002 - Interactive Filtering and Drill-down');
    
    await test.step('Login and navigate to Category-Wise Spending', async () => {
      await loginPage.login('multicategory@example.com', 'MultiCat789');
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.navigateToAnalytics();
      await analyticsPage.waitForAnalyticsPageLoad();
      await analyticsPage.selectCategoryWiseView();
      await analyticsPage.waitForCategoryChartLoad();
      logger.info('Category-Wise Spending view loaded');
    });

    await test.step('Test category filter functionality', async () => {
      await analyticsPage.selectCategoryFilter('Food & Dining');
      await page.waitForTimeout(500);
      
      const filteredData = await analyticsPage.getCategorySpendingData();
      expect(filteredData.length).toBeGreaterThan(0);
      expect(filteredData[0].category).toBe('Food & Dining');
      logger.info('Category filter applied successfully for Food & Dining');
    });

    await test.step('Test drill-down capability', async () => {
      await analyticsPage.clickCategorySegment('Shopping');
      const startTime = Date.now();
      await analyticsPage.waitForDrillDownView();
      const drillDownTime = Date.now() - startTime;
      
      expect(drillDownTime).toBeLessThanOrEqual(2000);
      
      const drillDownVisible = await analyticsPage.isDrillDownViewVisible();
      expect(drillDownVisible).toBe(true);
      logger.info(`Drill-down opened in ${drillDownTime}ms for Shopping category`);
    });

    await test.step('Verify detailed transactions are displayed', async () => {
      const transactionCount = await analyticsPage.getDrillDownTransactionCount();
      expect(transactionCount).toBeGreaterThan(0);
      logger.info(`${transactionCount} transactions displayed in drill-down view`);
    });
  });

  test('QE-7522 TS-002 TC-001: Verify uncategorizable transactions are assigned to Miscellaneous', async ({ page }) => {
    logger.info('Test Case: QE-7522 TS-002 TC-001 - Uncategorizable Transactions');
    
    await test.step('Login with user having uncategorizable transactions', async () => {
      await loginPage.login('uncategorized@example.com', 'UnCat456');
      logger.info('User with uncategorizable transactions authenticated');
    });

    await test.step('Navigate to Category-Wise Spending', async () => {
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.navigateToAnalytics();
      await analyticsPage.waitForAnalyticsPageLoad();
      await analyticsPage.selectCategoryWiseView();
      await analyticsPage.waitForCategoryChartLoad();
      logger.info('Category-Wise Spending view loaded');
    });

    await test.step('Verify Miscellaneous category includes uncategorizable transactions', async () => {
      const miscellaneousData = await analyticsPage.getCategoryDataByName('Miscellaneous');
      expect(miscellaneousData).toBeTruthy();
      expect(miscellaneousData.total).toBeGreaterThan(0);
      logger.info(`Miscellaneous category total: ₹${miscellaneousData.total}`);
    });

    await test.step('Drill down into Miscellaneous category', async () => {
      await analyticsPage.clickCategorySegment('Miscellaneous');
      await analyticsPage.waitForDrillDownView();
      
      const drillDownVisible = await analyticsPage.isDrillDownViewVisible();
      expect(drillDownVisible).toBe(true);
      logger.info('Drill-down view opened for Miscellaneous category');
    });

    await test.step('Verify uncategorizable transactions are shown', async () => {
      const transactions = await analyticsPage.getDrillDownTransactions();
      expect(transactions.length).toBeGreaterThan(0);
      logger.info(`${transactions.length} transactions found in Miscellaneous category`);
    });
  });

  test('QE-7522 TS-003 TC-001: Verify error message when categorization service is unavailable', async ({ page }) => {
    logger.info('Test Case: QE-7522 TS-003 TC-001 - Categorization Service Failure');
    
    await test.step('Simulate categorization service unavailability', async () => {
      await page.route('**/api/transactions/categorized**', route => route.abort());
      logger.info('Categorization service routes blocked');
    });

    await test.step('Login and navigate to Analytics', async () => {
      await loginPage.login('testuser@example.com', 'ValidPass123');
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.navigateToAnalytics();
      logger.info('Navigated to Analytics section');
    });

    await test.step('Attempt to access Category-Wise Spending', async () => {
      await analyticsPage.waitForAnalyticsPageLoad();
      await analyticsPage.selectCategoryWiseView();
      logger.info('Attempted to access Category-Wise Spending');
    });

    await test.step('Verify error message is displayed', async () => {
      await analyticsPage.waitForErrorMessage();
      const errorMessage = await analyticsPage.getErrorMessage();
      expect(errorMessage).toContain('Failed to load analytics');
      logger.info(`Error message displayed: ${errorMessage}`);
    });

    await test.step('Verify no incorrect categorized data is shown', async () => {
      const chartVisible = await analyticsPage.isCategoryChartVisible();
      expect(chartVisible).toBe(false);
      logger.info('Confirmed no incorrect categorized data is displayed');
    });
  });
});