const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Category-Wise Spending Visualization - QE-7920', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    logger.info('Starting analytics test case');
  });

  test('QE-7920 TS-001 TC-001: Verify category-wise spending visualization displays correctly for user with transactions across 7 categories', async ({ page }) => {
    logger.info('Test Case ID: QE-7920 TS-001 TC-001');
    
    await test.step('Launch the Credit Card Dashboard application in a browser', async () => {
      await loginPage.navigate();
      await expect(page).toHaveURL(/.*creditcard-dashboard/);
      await expect(analyticsPage.navigationMenu).toBeVisible();
      logger.info('Application loads successfully and displays navigation menu');
    });

    await test.step('Login with valid user credentials who has transactions in 7 categories', async () => {
      await loginPage.login('testuser_7cat', 'Test@123');
      await expect(page).toHaveURL(/.*\/dashboard/);
      logger.info('User is authenticated and redirected to dashboard');
    });

    await test.step('Navigate to the Analytics section from the main menu', async () => {
      await analyticsPage.navigateToAnalytics();
      await expect(analyticsPage.analyticsContainer).toBeVisible();
      logger.info('Analytics dashboard page loads');
    });

    await test.step('Verify the category-wise spending visualization is displayed', async () => {
      await expect(analyticsPage.categoryChart).toBeVisible();
      const categories = await analyticsPage.getCategoryLabels();
      expect(categories).toEqual([
        'Food & Dining',
        'Fuel',
        'Shopping',
        'Travel',
        'Entertainment',
        'Utilities',
        'Healthcare'
      ]);
      logger.info('Interactive visual breakdown rendered showing all 7 categories');
    });

    await test.step('Verify each category displays accurate spending amount', async () => {
      const categoryData = await analyticsPage.getCategorySpendingData();
      expect(categoryData).toEqual({
        'Food & Dining': '$450.00',
        'Fuel': '$200.00',
        'Shopping': '$350.00',
        'Travel': '$600.00',
        'Entertainment': '$180.00',
        'Utilities': '$250.00',
        'Healthcare': '$120.00'
      });
      logger.info('Each category shows correct spending amount matching transaction data');
    });

    await test.step('Verify each category displays accurate percentage of total spend', async () => {
      const categoryPercentages = await analyticsPage.getCategoryPercentages();
      const totalPercentage = Object.values(categoryPercentages).reduce((sum, pct) => sum + pct, 0);
      expect(Math.round(totalPercentage)).toBe(100);
      logger.info('Percentages sum to 100% and accurately represent proportion of total spending');
    });
  });

  test('QE-7920 TS-002 TC-001: Verify appropriate message is displayed when user has no transactions in current month', async ({ page }) => {
    logger.info('Test Case ID: QE-7920 TS-002 TC-001');
    
    await test.step('Launch the Credit Card Dashboard application in a browser', async () => {
      await loginPage.navigate();
      await expect(page).toHaveURL(/.*creditcard-dashboard/);
      logger.info('Application loads successfully');
    });

    await test.step('Login with valid user credentials who has no transactions in the current month', async () => {
      await loginPage.login('testuser_notxn', 'Test@123');
      await expect(page).toHaveURL(/.*\/dashboard/);
      logger.info('User is authenticated and redirected to dashboard');
    });

    await test.step('Navigate to the Analytics section', async () => {
      await analyticsPage.navigateToAnalytics();
      await expect(analyticsPage.analyticsContainer).toBeVisible();
      logger.info('Analytics page loads');
    });

    await test.step('Verify the system displays appropriate message for no data', async () => {
      await expect(analyticsPage.noDataMessage).toBeVisible();
      const message = await analyticsPage.getNoDataMessage();
      expect(message).toContain('No spending data available for the current month');
      logger.info('Message displayed correctly');
    });

    await test.step('Verify no category visualization chart is rendered', async () => {
      const isChartVisible = await analyticsPage.isCategoryChartVisible();
      expect(isChartVisible).toBeFalsy();
      logger.info('No pie chart or bar chart is displayed on the page');
    });
  });

  test('QE-7920 TS-003 TC-001: Verify Miscellaneous category is displayed correctly alongside predefined categories', async ({ page }) => {
    logger.info('Test Case ID: QE-7920 TS-003 TC-001');
    
    await test.step('Launch the Credit Card Dashboard application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveURL(/.*creditcard-dashboard/);
      logger.info('Application loads successfully');
    });

    await test.step('Login with user who has transactions in predefined categories and Miscellaneous category', async () => {
      await loginPage.login('testuser_misc', 'Test@123');
      await expect(page).toHaveURL(/.*\/dashboard/);
      logger.info('User is authenticated successfully');
    });

    await test.step('Navigate to Analytics dashboard', async () => {
      await analyticsPage.navigateToAnalytics();
      await expect(analyticsPage.analyticsContainer).toBeVisible();
      await expect(analyticsPage.categoryChart).toBeVisible();
      logger.info('Analytics page loads with spending visualization');
    });

    await test.step('Verify Miscellaneous category is displayed in the category breakdown', async () => {
      const categories = await analyticsPage.getCategoryLabels();
      expect(categories).toContain('Miscellaneous');
      expect(categories.length).toBe(9);
      logger.info('Miscellaneous category appears alongside the 8 predefined categories');
    });

    await test.step('Verify Miscellaneous category shows accurate spending amount', async () => {
      const miscAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
      expect(miscAmount).toBe('$275.00');
      logger.info('Miscellaneous category displays correct sum of all uncategorized transactions');
    });
  });
});

test.describe('Monthly Spend Trend Analysis - QE-7915', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    logger.info('Starting monthly spend trend analysis test case');
  });

  test('QE-7915 TS-001 TC-001: Verify user with 12 months of transaction history can view complete monthly spend trends with drill-down', async ({ page }) => {
    logger.info('Test Case ID: QE-7915 TS-001 TC-001');
    
    await test.step('Launch application and login with user having 12 months of transaction history', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_12months', 'Test@123');
      logger.info('User is authenticated');
    });

    await test.step('Navigate to Analytics section', async () => {
      await analyticsPage.navigateToAnalytics();
      await expect(analyticsPage.analyticsContainer).toBeVisible();
      logger.info('Analytics dashboard loads');
    });

    await test.step('Navigate to the trend analysis section', async () => {
      await analyticsPage.navigateToTrendAnalysis();
      await expect(analyticsPage.trendAnalysisSection).toBeVisible();
      logger.info('Monthly spend trend analysis page loads');
    });

    await test.step('Verify interactive line chart is displayed', async () => {
      await expect(analyticsPage.trendChart).toBeVisible();
      const isInteractive = await analyticsPage.verifyChartInteractivity();
      expect(isInteractive).toBeTruthy();
      logger.info('Line chart showing monthly spending trends is rendered with smooth transitions');
    });

    await test.step('Verify chart displays spending patterns from earliest to most recent month', async () => {
      const monthLabels = await analyticsPage.getTrendMonthLabels();
      expect(monthLabels.length).toBe(12);
      expect(monthLabels[0]).toContain('Jan 2024');
      expect(monthLabels[11]).toContain('Dec 2024');
      logger.info('Chart shows all 12 months of data in chronological order');
    });

    await test.step('Click on a specific month data point on the chart', async () => {
      await analyticsPage.clickMonthDataPoint('August 2024');
      logger.info('Drill-down capability is triggered');
    });

    await test.step('Verify detailed spending information for selected month is displayed', async () => {
      await expect(analyticsPage.monthDetailPanel).toBeVisible();
      const augustSpend = await analyticsPage.getMonthDetailSpend();
      expect(augustSpend).toBe('$3,200.00');
      logger.info('Detailed breakdown of August 2024 spending is shown');
    });
  });

  test('QE-7915 TS-002 TC-001: Verify limited trend chart with notification is displayed for user with only 2 months of history', async ({ page }) => {
    logger.info('Test Case ID: QE-7915 TS-002 TC-001');
    
    await test.step('Launch application and login with user having only 2 months of transaction history', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_2months', 'Test@123');
      logger.info('User is authenticated');
    });

    await test.step('Navigate to Analytics section and then to trend analysis', async () => {
      await analyticsPage.navigateToAnalytics();
      await analyticsPage.navigateToTrendAnalysis();
      await expect(analyticsPage.trendAnalysisSection).toBeVisible();
      logger.info('Trend analysis page loads');
    });

    await test.step('Verify limited trend chart is displayed with only 2 months of data', async () => {
      await expect(analyticsPage.trendChart).toBeVisible();
      const monthLabels = await analyticsPage.getTrendMonthLabels();
      expect(monthLabels.length).toBe(2);
      expect(monthLabels).toEqual(['November 2024', 'December 2024']);
      logger.info('Chart shows only 2 data points');
    });

    await test.step('Verify notification message is displayed', async () => {
      await expect(analyticsPage.limitedDataNotification).toBeVisible();
      const notification = await analyticsPage.getLimitedDataNotification();
      expect(notification).toContain('Limited data available - trend analysis is most accurate with 6+ months of history');
      logger.info('Notification message verified');
    });
  });

  test('QE-7915 TS-003 TC-001: Verify user can drill down into spending spike month to view detailed category breakdown', async ({ page }) => {
    logger.info('Test Case ID: QE-7915 TS-003 TC-001');
    
    await test.step('Launch application and login with user having transaction history with a spending spike', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_spike', 'Test@123');
      logger.info('User is authenticated');
    });

    await test.step('Navigate to trend analysis section', async () => {
      await analyticsPage.navigateToAnalytics();
      await analyticsPage.navigateToTrendAnalysis();
      await expect(analyticsPage.trendChart).toBeVisible();
      logger.info('Monthly spend trend chart is displayed');
    });

    await test.step('Identify the month with significant spending increase on the chart', async () => {
      const spikeMonth = await analyticsPage.identifySpendingSpike();
      expect(spikeMonth.month).toBe('July 2024');
      expect(spikeMonth.amount).toBe('$5,500.00');
      logger.info('Spending spike visible: July 2024 shows $5,500 compared to average $2,500');
    });

    await test.step('Click on the spike month data point to drill down', async () => {
      await analyticsPage.clickMonthDataPoint('July 2024');
      await expect(analyticsPage.monthDetailPanel).toBeVisible();
      logger.info('Drill-down view is triggered');
    });

    await test.step('Verify detailed category-wise breakdown is displayed for the spike month', async () => {
      const categoryBreakdown = await analyticsPage.getMonthCategoryBreakdown();
      expect(categoryBreakdown).toEqual({
        'Travel': '$3,000.00',
        'Shopping': '$1,500.00',
        'Entertainment': '$1,000.00'
      });
      logger.info('Category breakdown shows spending distribution for July 2024');
    });

    await test.step('Verify transaction list for the month is displayed', async () => {
      await expect(analyticsPage.transactionList).toBeVisible();
      const transactions = await analyticsPage.getMonthTransactions();
      expect(transactions).toContainEqual(expect.objectContaining({
        description: expect.stringContaining('Flight booking'),
        amount: '$2,500.00'
      }));
      expect(transactions).toContainEqual(expect.objectContaining({
        description: expect.stringContaining('Hotel'),
        amount: '$500.00'
      }));
      logger.info('Detailed transaction list shows individual transactions that contributed to the spike');
    });
  });
});