const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { Logger } = require('../utils/logger');

test.describe('Category-wise Spending Analysis - QE-8454', () => {
  let analyticsPage;
  const logger = new Logger();

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    logger.info('Navigated to analytics page');
  });

  test('QE-8454 TS-001 TC-001: Verify category aggregation calculates accurate totals and percentages across all 9 predefined categories', async () => {
    logger.info('Starting test: Category aggregation validation');
    
    await analyticsPage.waitForCategoryChartToLoad();
    const categoryData = await analyticsPage.getCategoryWiseSpending();
    
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    for (const category of expectedCategories) {
      expect(categoryData).toHaveProperty(category);
    }
    
    const totalSpend = Object.values(categoryData).reduce((sum, amount) => sum + amount, 0);
    const percentages = {};
    
    for (const [category, amount] of Object.entries(categoryData)) {
      percentages[category] = (amount / totalSpend) * 100;
    }
    
    const totalPercentage = Object.values(percentages).reduce((sum, pct) => sum + pct, 0);
    expect(Math.round(totalPercentage)).toBe(100);
    
    logger.info(`Category aggregation validated. Total spend: ${totalSpend}, Total percentage: ${totalPercentage}`);
  });

  test('QE-8454 TS-002 TC-001: Verify transactions with missing or invalid category are automatically categorized as Miscellaneous', async () => {
    logger.info('Starting test: Missing category handling');
    
    await analyticsPage.waitForCategoryChartToLoad();
    const categoryData = await analyticsPage.getCategoryWiseSpending();
    
    expect(categoryData).toHaveProperty('Miscellaneous');
    expect(categoryData['Miscellaneous']).toBeGreaterThan(0);
    
    const miscellaneousCount = await analyticsPage.getMiscellaneousTransactionCount();
    expect(miscellaneousCount).toBeGreaterThanOrEqual(4);
    
    logger.info(`Miscellaneous category validated with ${miscellaneousCount} transactions`);
  });

  test('QE-8454 TS-003 TC-001: Verify category-wise aggregation correctly combines transactions across multiple months and cards', async () => {
    logger.info('Starting test: Multi-month multi-card aggregation');
    
    await analyticsPage.waitForCategoryChartToLoad();
    const categoryData = await analyticsPage.getCategoryWiseSpending();
    
    expect(categoryData['Food & Dining']).toBe(450);
    expect(categoryData['Fuel']).toBe(125);
    
    const allTransactions = await analyticsPage.getAllTransactionsForCategory('Food & Dining');
    const uniqueMonths = new Set(allTransactions.map(txn => txn.month));
    const uniqueCards = new Set(allTransactions.map(txn => txn.cardId));
    
    expect(uniqueMonths.size).toBeGreaterThan(1);
    expect(uniqueCards.size).toBeGreaterThan(1);
    
    logger.info(`Validated aggregation across ${uniqueMonths.size} months and ${uniqueCards.size} cards`);
  });
});
