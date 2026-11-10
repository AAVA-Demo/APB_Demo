const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { logger } = require('../utils/logger');

test.describe('Analytics and Insights Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.login('testuser@example.com', 'Test@123');
    logger.info('User logged in successfully for analytics tests');
  });

  test('QE-10333 TS-001 TC-001 - Verify interactive monthly trends chart', async ({ page }) => {
    logger.info('Starting test: Verify interactive monthly trends chart');
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlyTrendsTab();
    
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    logger.info('Monthly trends chart is visible');
    
    const chartData = await analyticsPage.getMonthlyTrendsData();
    expect(chartData.length).toBeGreaterThanOrEqual(6);
    logger.info(`Chart displays ${chartData.length} months of data`);
    
    await analyticsPage.applyDateRangeFilter('2026-03-01', '2026-06-30');
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    logger.info('Date range filter applied successfully');
    
    const filteredData = await analyticsPage.getMonthlyTrendsData();
    expect(filteredData.length).toBe(4);
    logger.info('Chart updated with filtered date range');
    
    await analyticsPage.hoverOverDataPoint(2);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('₹');
    logger.info('Chart interactivity verified - tooltip displayed on hover');
  });

  test('QE-10333 TS-002 TC-001 - Verify insufficient transaction history message', async ({ page }) => {
    logger.info('Starting test: Verify insufficient transaction history message');
    
    await analyticsPage.logout();
    await analyticsPage.login('newuser@example.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlyTrendsTab();
    
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.getInsufficientDataMessageText();
    expect(messageText).toContain('Insufficient data to generate meaningful trend analysis');
    expect(messageText).toContain('Minimum 2 months');
    logger.info('Insufficient data message displayed correctly');
    
    await expect(analyticsPage.monthlyTrendsChart).not.toBeVisible();
    logger.info('Chart is not displayed as expected');
  });

  test('QE-10333 TS-003 TC-001 - Verify invalid date range filter validation', async ({ page }) => {
    logger.info('Starting test: Verify invalid date range filter validation');
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlyTrendsTab();
    
    await analyticsPage.enterDateRange('2026-06-01', '2026-03-01');
    await analyticsPage.clickApplyFilter();
    
    await expect(analyticsPage.validationErrorMessage).toBeVisible();
    const errorText = await analyticsPage.getValidationErrorText();
    expect(errorText).toContain('Invalid date range');
    expect(errorText).toContain('End date must be later than or equal to start date');
    logger.info('Validation error message displayed correctly');
    
    const chartData = await analyticsPage.getMonthlyTrendsData();
    expect(chartData.length).toBeGreaterThan(0);
    logger.info('Chart remains unchanged with previous valid data');
  });

  test('QE-10331 TS-001 TC-001 - Verify category-wise spending visualization', async ({ page }) => {
    logger.info('Starting test: Verify category-wise spending visualization');
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategoryWiseTab();
    
    await expect(analyticsPage.categoryChart).toBeVisible();
    logger.info('Category-wise spending chart is visible');
    
    const categories = await analyticsPage.getCategorySpendingData();
    expect(categories.length).toBe(9);
    logger.info('Chart displays all 9 spending categories');
    
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    for (const category of expectedCategories) {
      const hasCategory = categories.some(c => c.name === category);
      expect(hasCategory).toBe(true);
    }
    logger.info('All expected categories are present in the chart');
    
    const travelCategory = categories.find(c => c.name === 'Travel');
    expect(travelCategory.amount).toBeTruthy();
    expect(travelCategory.percentage).toBeTruthy();
    logger.info('Category data includes amount and percentage');
    
    await analyticsPage.hoverOverCategorySlice('Travel');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('Travel');
    expect(tooltipText).toContain('₹');
    expect(tooltipText).toContain('%');
    logger.info('Chart interactivity verified - tooltip shows category details');
  });

  test('QE-10331 TS-002 TC-001 - Verify no spending data available message', async ({ page }) => {
    logger.info('Starting test: Verify no spending data available message');
    
    await analyticsPage.logout();
    await analyticsPage.login('newuser@example.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategoryWiseTab();
    
    await expect(analyticsPage.noSpendingDataMessage).toBeVisible();
    const messageText = await analyticsPage.getNoSpendingDataMessageText();
    expect(messageText).toContain('No spending data available to display');
    logger.info('No spending data message displayed correctly');
    
    await expect(analyticsPage.categoryChart).not.toBeVisible();
    logger.info('Chart is not displayed as expected');
  });

  test('QE-10331 TS-003 TC-001 - Verify transaction categorization failure handling', async ({ page }) => {
    logger.info('Starting test: Verify transaction categorization failure handling');
    
    await analyticsPage.simulateCategorizationFailure();
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategoryWiseTab();
    
    await expect(analyticsPage.categoryChart).toBeVisible();
    logger.info('Category chart is visible');
    
    const categories = await analyticsPage.getCategorySpendingData();
    const miscellaneous = categories.find(c => c.name === 'Miscellaneous');
    expect(miscellaneous).toBeTruthy();
    expect(miscellaneous.amount).toBeGreaterThan(0);
    logger.info('Uncategorized transactions are grouped under Miscellaneous');
    
    await expect(analyticsPage.warningMessage).toBeVisible();
    const warningText = await analyticsPage.getWarningMessageText();
    expect(warningText).toContain('Some transactions could not be categorized');
    logger.info('Warning message displayed correctly');
  });
});
