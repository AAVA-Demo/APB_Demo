const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { AuthHelper } = require('./helpers/auth.helper');
const { TestDataGenerator } = require('./helpers/testdata.generator');
const { Logger } = require('./utils/logger');
const config = require('../data/config.json');

test.describe('Analytics Dashboard - Category-wise Spending', () => {
  let analyticsPage;
  let authHelper;
  let logger;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    authHelper = new AuthHelper(page);
    logger = new Logger();
    await authHelper.authenticate();
  });

  test('QE-10388 TS-001 TC-001: Verify analytics dashboard displays accurate spending breakdown across all 9 categories', async ({ page }) => {
    logger.info('Test Case ID: QE-10388 TS-001 TC-001');
    const userId = 'user-multi-category-001';
    
    // Step 1: Authenticate user
    await authHelper.authenticateAsUser(userId);
    logger.info(`Authenticated as user: ${userId}`);
    
    // Step 2: Navigate to analytics dashboard and retrieve category data
    await analyticsPage.navigateToAnalytics();
    const categoryData = await analyticsPage.getCategorySpendingData();
    logger.info('Retrieved category spending data');
    
    // Step 3: Validate all 9 categories have non-zero amounts
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    for (const category of expectedCategories) {
      const categoryItem = categoryData.find(c => c.category === category);
      expect(categoryItem).toBeDefined();
      expect(categoryItem.totalAmount).toBeGreaterThan(0);
      expect(categoryItem.transactionCount).toBeGreaterThan(0);
      logger.info(`Category ${category}: Amount=${categoryItem.totalAmount}, Count=${categoryItem.transactionCount}`);
    }
    
    // Step 4: Validate percentage sum equals 100%
    const totalPercentage = categoryData.reduce((sum, cat) => sum + cat.percentage, 0);
    expect(Math.abs(totalPercentage - 100)).toBeLessThanOrEqual(0.1);
    logger.info(`Total percentage: ${totalPercentage}%`);
    
    // Step 5: Verify visualization renders correctly
    await expect(analyticsPage.categoryVisualization).toBeVisible();
    const renderedCategories = await analyticsPage.getRenderedCategoryCount();
    expect(renderedCategories).toBe(9);
    logger.info('Visualization rendered with all 9 categories');
  });

  test('QE-10388 TS-001 TC-002: Verify category percentages are calculated correctly', async ({ page }) => {
    logger.info('Test Case ID: QE-10388 TS-001 TC-002');
    const userId = 'user-percentage-test-001';
    
    await authHelper.authenticateAsUser(userId);
    await analyticsPage.navigateToAnalytics();
    
    const categoryData = await analyticsPage.getCategorySpendingData();
    const totalSpending = categoryData.reduce((sum, cat) => sum + cat.totalAmount, 0);
    logger.info(`Total spending across all categories: $${totalSpending}`);
    
    for (const category of categoryData) {
      const expectedPercentage = (category.totalAmount / totalSpending) * 100;
      const actualPercentage = category.percentage;
      expect(Math.abs(actualPercentage - expectedPercentage)).toBeLessThanOrEqual(0.1);
      logger.info(`${category.category}: Expected=${expectedPercentage.toFixed(2)}%, Actual=${actualPercentage.toFixed(2)}%`);
    }
  });

  test('QE-10388 TS-002 TC-001: Verify zero-state message when user has no transactions', async ({ page }) => {
    logger.info('Test Case ID: QE-10388 TS-002 TC-001');
    const userId = 'user-no-transactions-001';
    
    await authHelper.authenticateAsUser(userId);
    await analyticsPage.navigateToAnalytics();
    
    const categoryData = await analyticsPage.getCategorySpendingData();
    expect(categoryData.length === 0 || categoryData.every(c => c.totalAmount === 0)).toBeTruthy();
    logger.info('Verified category data is empty or all amounts are zero');
    
    // Verify no errors occurred
    const errors = await page.evaluate(() => window.errors || []);
    expect(errors.length).toBe(0);
    logger.info('No JavaScript errors detected');
    
    // Verify zero-state message is displayed
    await expect(analyticsPage.zeroStateMessage).toBeVisible();
    const messageText = await analyticsPage.zeroStateMessage.textContent();
    expect(messageText).toContain('No spending data');
    logger.info(`Zero-state message displayed: ${messageText}`);
    
    // Verify visualization handles empty data gracefully
    await expect(analyticsPage.categoryVisualization).toBeVisible();
    const isEmpty = await analyticsPage.isVisualizationEmpty();
    expect(isEmpty).toBeTruthy();
    logger.info('Visualization displays empty state correctly');
  });

  test('QE-10388 TS-003 TC-001: Verify drill-down displays detailed transaction data', async ({ page }) => {
    logger.info('Test Case ID: QE-10388 TS-003 TC-001');
    const userId = 'user-food-transactions-001';
    const targetCategory = 'Food & Dining';
    
    await authHelper.authenticateAsUser(userId);
    await analyticsPage.navigateToAnalytics();
    
    const categoryData = await analyticsPage.getCategorySpendingData();
    const foodCategory = categoryData.find(c => c.category === targetCategory);
    expect(foodCategory).toBeDefined();
    expect(foodCategory.totalAmount).toBeGreaterThan(0);
    logger.info(`${targetCategory} category found with amount: $${foodCategory.totalAmount}`);
    
    // Drill down into category
    await analyticsPage.drillDownIntoCategory(targetCategory);
    logger.info(`Drilled down into ${targetCategory} category`);
    
    const transactions = await analyticsPage.getCategoryTransactionDetails();
    expect(transactions.length).toBeGreaterThan(0);
    logger.info(`Retrieved ${transactions.length} transactions`);
    
    // Validate transaction fields
    for (const txn of transactions) {
      expect(txn.merchantName).toBeTruthy();
      expect(txn.transactionDate).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(txn.amount).toBeGreaterThan(0);
      logger.info(`Transaction: ${txn.merchantName}, Date: ${txn.transactionDate}, Amount: $${txn.amount}`);
    }
    
    // Verify sum matches category total
    const transactionSum = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    expect(Math.abs(transactionSum - foodCategory.totalAmount)).toBeLessThanOrEqual(0.01);
    logger.info(`Transaction sum ($${transactionSum}) matches category total ($${foodCategory.totalAmount})`);
  });

  test('QE-10388 TS-003 TC-002: Verify drill-down works for all 9 categories', async ({ page }) => {
    logger.info('Test Case ID: QE-10388 TS-003 TC-002');
    const userId = 'user-all-categories-001';
    
    await authHelper.authenticateAsUser(userId);
    await analyticsPage.navigateToAnalytics();
    
    const categories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    for (const category of categories) {
      await analyticsPage.drillDownIntoCategory(category);
      const transactions = await analyticsPage.getCategoryTransactionDetails();
      expect(transactions.length).toBeGreaterThan(0);
      logger.info(`${category}: ${transactions.length} transactions found`);
      
      // Verify no cross-category contamination
      for (const txn of transactions) {
        expect(txn.category).toBe(category);
      }
      logger.info(`${category}: All transactions correctly categorized`);
      
      await analyticsPage.closeDrillDown();
    }
  });
});
