const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Analytics and Spending Trends Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.login('testuser', 'Test@123');
  });

  test('QE-9935 TS001 TC-001: Verify category-wise spending display across all 9 predefined categories with accurate totals and percentages', async ({ page }) => {
    logger.info('Starting test: Category-wise spending across all categories');
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategoryWiseView();
    
    const categories = await analyticsPage.getAllDisplayedCategories();
    logger.info(`Displayed categories: ${categories.join(', ')}`);
    expect(categories.length).toBe(9);
    
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of expectedCategories) {
      expect(categories).toContain(category);
    }
    
    const categoryAmounts = await analyticsPage.getCategoryAmounts();
    logger.info(`Category amounts: ${JSON.stringify(categoryAmounts)}`);
    
    for (const [category, amount] of Object.entries(categoryAmounts)) {
      expect(amount).toMatch(/^\$[\d,]+\.\d{2}$/);
    }
    
    const percentages = await analyticsPage.getCategoryPercentages();
    const totalPercentage = Object.values(percentages).reduce((sum, pct) => sum + parseFloat(pct), 0);
    logger.info(`Total percentage: ${totalPercentage}%`);
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    logger.info('Test completed successfully');
  });

  test('QE-9935 TS002 TC-001: Verify system handles transactions with missing category data by categorizing them as Miscellaneous', async ({ page }) => {
    logger.info('Starting test: Missing category data handling');
    
    await page.route('**/api/transactions*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          { id: 1, amount: 100, category: 'Food & Dining' },
          { id: 2, amount: 150, category: null },
          { id: 3, amount: 200, category: '' },
          { id: 4, amount: 250, category: 'Shopping' },
          { id: 5, amount: 150, category: null }
        ])
      });
    });
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategoryWiseView();
    
    const miscellaneousAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    logger.info(`Miscellaneous amount: ${miscellaneousAmount}`);
    expect(miscellaneousAmount).toBe('$550.00');
    
    const totalSpend = await analyticsPage.getTotalSpend();
    logger.info(`Total spend: ${totalSpend}`);
    expect(totalSpend).toBe('$850.00');
    
    const hasDisplayErrors = await analyticsPage.hasDisplayErrors();
    expect(hasDisplayErrors).toBe(false);
    
    logger.info('Test completed successfully');
  });

  test('QE-9935 TS003 TC-001: Verify category-wise spending display when transactions exist only in 3 categories', async ({ page }) => {
    logger.info('Starting test: Partial category spending display');
    
    await page.route('**/api/transactions*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          { id: 1, amount: 500, category: 'Food & Dining', date: '2024-01-15' },
          { id: 2, amount: 200, category: 'Fuel', date: '2024-01-20' },
          { id: 3, amount: 300, category: 'Shopping', date: '2024-01-25' }
        ])
      });
    });
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectDateRange('2024-01-01', '2024-01-31');
    await analyticsPage.selectCategoryWiseView();
    
    const displayedCategories = await analyticsPage.getVisibleCategories();
    logger.info(`Visible categories: ${displayedCategories.join(', ')}`);
    expect(displayedCategories).toContain('Food & Dining');
    expect(displayedCategories).toContain('Fuel');
    expect(displayedCategories).toContain('Shopping');
    
    const foodAmount = await analyticsPage.getCategoryAmount('Food & Dining');
    const fuelAmount = await analyticsPage.getCategoryAmount('Fuel');
    const shoppingAmount = await analyticsPage.getCategoryAmount('Shopping');
    
    logger.info(`Amounts - Food: ${foodAmount}, Fuel: ${fuelAmount}, Shopping: ${shoppingAmount}`);
    expect(foodAmount).toBe('$500.00');
    expect(fuelAmount).toBe('$200.00');
    expect(shoppingAmount).toBe('$300.00');
    
    const totalSpend = await analyticsPage.getTotalSpend();
    expect(totalSpend).toBe('$1,000.00');
    
    logger.info('Test completed successfully');
  });

  test('QE-9930 TS001 TC-001: Verify monthly spend trend chart displays accurate monthly totals and trend lines for the past 12 months within 2 seconds', async ({ page }) => {
    logger.info('Starting test: Monthly spend trend chart visualization');
    
    await analyticsPage.navigateToAnalytics();
    
    const startTime = Date.now();
    await analyticsPage.selectMonthlyTrendView();
    const renderTime = Date.now() - startTime;
    
    logger.info(`Chart render time: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(2000);
    
    const monthCount = await analyticsPage.getMonthlyDataPointCount();
    logger.info(`Number of months displayed: ${monthCount}`);
    expect(monthCount).toBe(12);
    
    const monthlyTotals = await analyticsPage.getMonthlyTotals();
    logger.info(`Monthly totals: ${JSON.stringify(monthlyTotals)}`);
    
    for (const [month, amount] of Object.entries(monthlyTotals)) {
      expect(amount).toMatch(/^\$[\d,]+\.\d{2}$/);
    }
    
    const hasTrendLine = await analyticsPage.isTrendLineVisible();
    expect(hasTrendLine).toBe(true);
    
    logger.info('Test completed successfully');
  });

  test('QE-9930 TS002 TC-001: Verify system displays appropriate error message when transaction data service returns an error without crashing the analytics page', async ({ page }) => {
    logger.info('Starting test: Transaction data service error handling');
    
    await page.route('**/api/transactions*', route => {
      route.abort('failed');
    });
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlyTrendView();
    
    const isErrorDisplayed = await analyticsPage.isErrorMessageVisible();
    expect(isErrorDisplayed).toBe(true);
    
    const errorMessage = await analyticsPage.getErrorMessage();
    logger.info(`Error message: ${errorMessage}`);
    expect(errorMessage).toMatch(/Unable to load spending trends|Please try again later/i);
    
    const isPageFunctional = await analyticsPage.isAnalyticsPageFunctional();
    expect(isPageFunctional).toBe(true);
    
    const hasNavigationMenu = await analyticsPage.hasWorkingNavigation();
    expect(hasNavigationMenu).toBe(true);
    
    const hasBrokenElements = await analyticsPage.hasBrokenUIElements();
    expect(hasBrokenElements).toBe(false);
    
    logger.info('Test completed successfully');
  });

  test('QE-9930 TS003 TC-001: Verify monthly spend trend chart correctly displays zero values for months with no transactions while maintaining proper scale and visualization', async ({ page }) => {
    logger.info('Starting test: Zero transaction months display');
    
    await page.route('**/api/transactions*', route => {
      const mockData = [];
      const months = ['2024-01', '2024-02', '2024-04', '2024-05', '2024-07', '2024-08', '2024-10', '2024-11', '2024-12'];
      months.forEach((month, idx) => {
        mockData.push({ id: idx, amount: 1000 + (idx * 100), date: `${month}-15`, category: 'Shopping' });
      });
      route.fulfill({ status: 200, body: JSON.stringify(mockData) });
    });
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectDateRange('2024-01-01', '2024-12-31');
    await analyticsPage.selectMonthlyTrendView();
    
    const zeroMonths = ['2024-03', '2024-06', '2024-09'];
    for (const month of zeroMonths) {
      const amount = await analyticsPage.getMonthAmount(month);
      logger.info(`${month} amount: ${amount}`);
      expect(amount).toBe('$0.00');
    }
    
    const nonZeroMonths = await analyticsPage.getNonZeroMonths();
    logger.info(`Months with transactions: ${nonZeroMonths.join(', ')}`);
    expect(nonZeroMonths.length).toBeGreaterThan(0);
    
    const isScaleProper = await analyticsPage.isChartScaleProper();
    expect(isScaleProper).toBe(true);
    
    const isTrendLineCorrect = await analyticsPage.isTrendLineConnectingAllPoints();
    expect(isTrendLineCorrect).toBe(true);
    
    logger.info('Test completed successfully');
  });
});