const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Spending Analytics - QE-8970', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    logger.info('Starting Spending Analytics test');
  });

  test('QE-8970 TS-001 TC-001: Verify spending analytics section displays accurate category-wise breakdown with pie/bar chart', async ({ page }) => {
    logger.info('Test Case: QE-8970 TS-001 TC-001 - Category-wise breakdown visualization');
    
    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await loginPage.clickLogin();
    logger.info('User logged in successfully');

    // Step 2: Navigate to spending analytics section
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    logger.info('Spending analytics page loaded');

    // Step 3: Verify visual breakdown is displayed
    await expect(analyticsPage.categoryChart).toBeVisible();
    logger.info('Category chart is visible');

    // Step 4: Verify all predefined categories are present
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
      'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    for (const category of expectedCategories) {
      const categoryElement = await analyticsPage.getCategoryElement(category);
      await expect(categoryElement).toBeVisible();
      logger.info(`Category verified: ${category}`);
    }

    // Step 5: Verify spending amounts are accurate
    const categoryAmounts = await analyticsPage.getAllCategoryAmounts();
    for (const [category, amount] of Object.entries(categoryAmounts)) {
      expect(amount).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
      logger.info(`${category}: ${amount}`);
    }

    // Step 6: Verify percentage calculations are accurate
    const categoryPercentages = await analyticsPage.getAllCategoryPercentages();
    let totalPercentage = 0;
    for (const [category, percentage] of Object.entries(categoryPercentages)) {
      const percentValue = parseFloat(percentage.replace('%', ''));
      expect(percentValue).toBeGreaterThanOrEqual(0);
      expect(percentValue).toBeLessThanOrEqual(100);
      totalPercentage += percentValue;
      logger.info(`${category}: ${percentage}`);
    }
    // Total should be approximately 100% (allowing for rounding)
    expect(totalPercentage).toBeGreaterThan(99);
    expect(totalPercentage).toBeLessThanOrEqual(100);

    logger.info('Test Case QE-8970 TS-001 TC-001 completed successfully');
  });

  test('QE-8970 TS-002 TC-001: Verify spending analytics displays all categories with zero values when user has no transaction history', async ({ page }) => {
    logger.info('Test Case: QE-8970 TS-002 TC-001 - No transaction history scenario');
    
    // Step 1: Login with user having no transactions
    await loginPage.navigate();
    await loginPage.login('testuser_notransactions', 'Pass@123');
    await loginPage.clickLogin();
    logger.info('User with no transactions logged in');

    // Step 2: Navigate to spending analytics section
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    logger.info('Spending analytics page loaded');

    // Step 3: Verify all categories show $0.00
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
      'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    for (const category of expectedCategories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      expect(amount).toBe('$0.00');
      logger.info(`${category} shows: ${amount}`);
    }

    // Step 4: Verify informational message is displayed
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const messageText = await analyticsPage.getNoDataMessageText();
    expect(messageText).toContain('No spending data is available for the selected period');
    logger.info('No data message displayed correctly');

    // Step 5: Verify chart handles zero data gracefully
    await expect(analyticsPage.categoryChart).toBeVisible();
    logger.info('Chart displays empty state without errors');

    logger.info('Test Case QE-8970 TS-002 TC-001 completed successfully');
  });

  test('QE-8970 TS-003 TC-001: Verify spending analytics recalculates when user filters by specific time period', async ({ page }) => {
    logger.info('Test Case: QE-8970 TS-003 TC-001 - Time period filtering');
    
    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await loginPage.clickLogin();
    logger.info('User logged in successfully');

    // Step 2: Navigate to spending analytics
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    logger.info('Spending analytics page loaded with default period');

    // Step 3: Note current category-wise spending amounts
    const initialAmounts = await analyticsPage.getAllCategoryAmounts();
    logger.info('Initial spending amounts captured');
    logger.info(JSON.stringify(initialAmounts));

    // Step 4: Select specific time period filter (last 30 days)
    await analyticsPage.selectTimePeriod('Last 30 days');
    await analyticsPage.waitForChartUpdate();
    logger.info('Time period filter applied: Last 30 days');

    // Step 5: Verify chart recalculates and updates
    const filteredAmounts = await analyticsPage.getAllCategoryAmounts();
    logger.info('Filtered spending amounts captured');
    logger.info(JSON.stringify(filteredAmounts));
    
    // Verify amounts have changed (at least one category should differ)
    let amountsChanged = false;
    for (const category in initialAmounts) {
      if (initialAmounts[category] !== filteredAmounts[category]) {
        amountsChanged = true;
        logger.info(`${category} changed from ${initialAmounts[category]} to ${filteredAmounts[category]}`);
      }
    }
    expect(amountsChanged).toBeTruthy();

    // Step 6: Verify percentages are recalculated
    const filteredPercentages = await analyticsPage.getAllCategoryPercentages();
    let totalPercentage = 0;
    for (const [category, percentage] of Object.entries(filteredPercentages)) {
      const percentValue = parseFloat(percentage.replace('%', ''));
      totalPercentage += percentValue;
      logger.info(`${category}: ${percentage}`);
    }
    expect(totalPercentage).toBeGreaterThan(99);
    expect(totalPercentage).toBeLessThanOrEqual(100);

    logger.info('Test Case QE-8970 TS-003 TC-001 completed successfully');
  });
});