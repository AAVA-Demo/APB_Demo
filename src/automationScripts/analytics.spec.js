const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Monthly Spend Trends and Category-Wise Spending Analytics', () => {

  test('QE-8973 TS-001 TC-001 - Verify 12-month trend visualization with accurate data', async ({ page }) => {
    logger.info('Starting test: QE-8973 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await test.step('Login with 12-month history user', async () => {
      await loginPage.navigate();
      await loginPage.login('user12months@example.com', 'User@123');
      logger.info('User with 12-month history logged in');
    });

    await test.step('Navigate to Analytics page', async () => {
      await analyticsPage.navigate();
      await expect(page).toHaveURL(/.*analytics/);
      logger.info('Analytics page loaded');
    });

    await test.step('Access monthly trend analysis feature', async () => {
      await analyticsPage.waitForTrendChartToLoad();
      logger.info('Monthly trend analysis section displayed');
    });

    await test.step('Verify graph displays 12 months of data', async () => {
      const monthCount = await analyticsPage.getTrendChartMonthCount();
      expect(monthCount).toBe(12);
      logger.info('Graph shows 12 data points');
    });

    await test.step('Verify monthly totals are accurately calculated', async () => {
      const monthlyTotals = await analyticsPage.getMonthlyTotals();
      expect(monthlyTotals.length).toBe(12);
      monthlyTotals.forEach(total => {
        expect(total).toBeGreaterThan(0);
      });
      logger.info('Monthly totals calculated correctly');
    });

    await test.step('Verify graph is interactive', async () => {
      const isInteractive = await analyticsPage.isChartInteractive();
      expect(isInteractive).toBeTruthy();
      logger.info('Graph responds to user interactions');
    });

    logger.info('Test QE-8973 TS-001 TC-001 completed successfully');
  });

  test('QE-8973 TS-002 TC-001 - Verify notification for insufficient historical data', async ({ page }) => {
    logger.info('Starting test: QE-8973 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await test.step('Login with 6-month history user', async () => {
      await loginPage.navigate();
      await loginPage.login('user6months@example.com', 'User@123');
      logger.info('User with 6-month history logged in');
    });

    await test.step('Navigate to Analytics page', async () => {
      await analyticsPage.navigate();
      await expect(page).toHaveURL(/.*analytics/);
      logger.info('Analytics page loaded');
    });

    await test.step('Access monthly trend analysis feature', async () => {
      await analyticsPage.waitForTrendChartToLoad();
      logger.info('Monthly trend analysis section displayed');
    });

    await test.step('Verify insufficient data notification is displayed', async () => {
      await analyticsPage.waitForNotification();
      const notification = await analyticsPage.getNotificationText();
      expect(notification).toContain('Insufficient historical data');
      logger.info('Insufficient data notification displayed');
    });

    await test.step('Verify graph displays only 6 months of data', async () => {
      const monthCount = await analyticsPage.getTrendChartMonthCount();
      expect(monthCount).toBe(6);
      logger.info('Graph shows 6 data points');
    });

    await test.step('Verify monthly totals for available months', async () => {
      const monthlyTotals = await analyticsPage.getMonthlyTotals();
      expect(monthlyTotals.length).toBe(6);
      logger.info('Monthly totals displayed for available months');
    });

    logger.info('Test QE-8973 TS-002 TC-001 completed successfully');
  });

  test('QE-8973 TS-003 TC-001 - Verify appropriate message for no transaction history', async ({ page }) => {
    logger.info('Starting test: QE-8973 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await test.step('Login with new user credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('newuser@example.com', 'NewUser@123');
      logger.info('New user logged in');
    });

    await test.step('Navigate to Analytics page', async () => {
      await analyticsPage.navigate();
      await expect(page).toHaveURL(/.*analytics/);
      logger.info('Analytics page loaded');
    });

    await test.step('Access monthly trend analysis feature', async () => {
      await analyticsPage.waitForTrendChartToLoad();
      logger.info('Monthly trend analysis section displayed');
    });

    await test.step('Verify no transaction data message is displayed', async () => {
      const message = await analyticsPage.getNoDataMessage();
      expect(message).toContain('No transaction data available');
      logger.info('No data message displayed');
    });

    await test.step('Verify graph displays empty state', async () => {
      const hasEmptyState = await analyticsPage.hasEmptyChartState();
      expect(hasEmptyState).toBeTruthy();
      logger.info('Graph shows empty state');
    });

    logger.info('Test QE-8973 TS-003 TC-001 completed successfully');
  });

  test('QE-8977 TS-001 TC-001 - Verify accurate category-wise spending visualization', async ({ page }) => {
    logger.info('Starting test: QE-8977 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await test.step('Login with multi-category user', async () => {
      await loginPage.navigate();
      await loginPage.login('multicategory@example.com', 'Multi@123');
      logger.info('Multi-category user logged in');
    });

    await test.step('Navigate to spending analytics page', async () => {
      await analyticsPage.navigate();
      await expect(page).toHaveURL(/.*analytics/);
      logger.info('Analytics page loaded');
    });

    await test.step('Verify category chart is displayed', async () => {
      await analyticsPage.waitForCategoryChartToLoad();
      const isChartVisible = await analyticsPage.isCategoryChartVisible();
      expect(isChartVisible).toBeTruthy();
      logger.info('Category chart displayed');
    });

    await test.step('Verify all spending categories are displayed', async () => {
      const categories = await analyticsPage.getCategoryNames();
      const expectedCategories = [
        'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
        'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
      ];
      expectedCategories.forEach(category => {
        expect(categories).toContain(category);
      });
      logger.info('All 9 categories displayed');
    });

    await test.step('Verify accurate amounts and percentages for each category', async () => {
      const categoryData = await analyticsPage.getCategoryData();
      Object.keys(categoryData).forEach(category => {
        expect(categoryData[category].amount).toBeGreaterThanOrEqual(0);
        expect(categoryData[category].percentage).toBeGreaterThanOrEqual(0);
        expect(categoryData[category].percentage).toBeLessThanOrEqual(100);
      });
      logger.info('Category amounts and percentages validated');
    });

    await test.step('Verify chart is interactive', async () => {
      const isInteractive = await analyticsPage.isChartInteractive();
      expect(isInteractive).toBeTruthy();
      logger.info('Chart responds to user interactions');
    });

    logger.info('Test QE-8977 TS-001 TC-001 completed successfully');
  });

  test('QE-8977 TS-002 TC-001 - Verify 100% allocation for single category spending', async ({ page }) => {
    logger.info('Starting test: QE-8977 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await test.step('Login with single-category user', async () => {
      await loginPage.navigate();
      await loginPage.login('singlecategory@example.com', 'Single@123');
      logger.info('Single-category user logged in');
    });

    await test.step('Navigate to spending analytics page', async () => {
      await analyticsPage.navigate();
      await expect(page).toHaveURL(/.*analytics/);
      logger.info('Analytics page loaded');
    });

    await test.step('Verify category chart is displayed', async () => {
      await analyticsPage.waitForCategoryChartToLoad();
      const isChartVisible = await analyticsPage.isCategoryChartVisible();
      expect(isChartVisible).toBeTruthy();
      logger.info('Category chart displayed');
    });

    await test.step('Verify Food & Dining shows 100% allocation', async () => {
      const categoryData = await analyticsPage.getCategoryData();
      expect(categoryData['Food & Dining'].percentage).toBe(100);
      logger.info('Food & Dining shows 100% allocation');
    });

    await test.step('Verify all other categories show zero', async () => {
      const categoryData = await analyticsPage.getCategoryData();
      const otherCategories = Object.keys(categoryData).filter(cat => cat !== 'Food & Dining');
      otherCategories.forEach(category => {
        expect(categoryData[category].amount).toBe(0);
        expect(categoryData[category].percentage).toBe(0);
      });
      logger.info('All other categories show $0 (0%)');
    });

    logger.info('Test QE-8977 TS-002 TC-001 completed successfully');
  });

  test('QE-8977 TS-003 TC-001 - Verify appropriate message for no spending data', async ({ page }) => {
    logger.info('Starting test: QE-8977 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await test.step('Login with new user credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('newuser@example.com', 'NewUser@123');
      logger.info('New user logged in');
    });

    await test.step('Navigate to spending analytics page', async () => {
      await analyticsPage.navigate();
      await expect(page).toHaveURL(/.*analytics/);
      logger.info('Analytics page loaded');
    });

    await test.step('Verify no spending data message is displayed', async () => {
      const message = await analyticsPage.getNoDataMessage();
      expect(message).toContain('No spending data available');
      logger.info('No spending data message displayed');
    });

    await test.step('Verify chart displays empty state with zero values', async () => {
      const hasEmptyState = await analyticsPage.hasEmptyChartState();
      expect(hasEmptyState).toBeTruthy();
      logger.info('Chart shows empty state with zero values');
    });

    logger.info('Test QE-8977 TS-003 TC-001 completed successfully');
  });

});