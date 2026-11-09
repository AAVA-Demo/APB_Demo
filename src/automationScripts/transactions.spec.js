const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Transaction Monitoring and Spending Analytics Tests', () => {
  let transactionsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Starting transactions test setup');
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    logger.info('User authenticated successfully');
  });

  test('QE-8511 TS-001 TC-001: Verify transaction history listing displays comprehensive paginated list with complete transaction details', async ({ page }) => {
    logger.info('Test Case: QE-8511 TS-001 TC-001 - Transaction History Listing');
    
    await transactionsPage.navigate();
    await expect(transactionsPage.transactionTable).toBeVisible();
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeLessThanOrEqual(20);
    logger.info(`Transactions displayed on page 1: ${transactionCount}`);
    
    const firstTransaction = await transactionsPage.getTransactionDetails(0);
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.merchant).toBeTruthy();
    expect(firstTransaction.category).toBeTruthy();
    expect(firstTransaction.amount).toBeTruthy();
    expect(firstTransaction.description).toBeTruthy();
    
    logger.info(`First transaction: ${JSON.stringify(firstTransaction)}`);
    
    await expect(transactionsPage.paginationControls).toBeVisible();
    await expect(transactionsPage.nextButton).toBeVisible();
    await expect(transactionsPage.previousButton).toBeVisible();
    
    const pageInfo = await transactionsPage.getPageInfo();
    expect(pageInfo).toMatch(/Page \d+ of \d+/);
    
    if (await transactionsPage.nextButton.isEnabled()) {
      await transactionsPage.nextButton.click();
      await page.waitForTimeout(500);
      const pageInfoAfter = await transactionsPage.getPageInfo();
      expect(pageInfoAfter).toContain('Page 2');
      
      await transactionsPage.previousButton.click();
      await page.waitForTimeout(500);
      const pageInfoBack = await transactionsPage.getPageInfo();
      expect(pageInfoBack).toContain('Page 1');
    }
    
    logger.info('Pagination controls verified successfully');
  });

  test('QE-8511 TS-002 TC-001: Verify system returns validation error when date range exceeds maximum allowed period of 12 months', async ({ page }) => {
    logger.info('Test Case: QE-8511 TS-002 TC-001 - Date Range Exceeds 12 Months');
    
    await transactionsPage.navigate();
    
    await transactionsPage.setDateRange('2023-01-01', '2024-06-30');
    
    await expect(transactionsPage.errorMessage).toBeVisible();
    const errorText = await transactionsPage.errorMessage.textContent();
    expect(errorText).toContain('Invalid date range');
    expect(errorText).toContain('within 12 months');
    
    const transactionCount = await transactionsPage.getTransactionCount();
    logger.info(`Transaction count after invalid date range: ${transactionCount}`);
    
    logger.info('Date range validation error displayed correctly');
  });

  test('QE-8511 TS-003 TC-001: Verify system rejects request with malformed date parameters (invalid date format)', async ({ page }) => {
    logger.info('Test Case: QE-8511 TS-003 TC-001 - Malformed Date Parameters');
    
    await transactionsPage.navigate();
    
    await page.route('**/api/transactions*', route => {
      const url = route.request().url();
      if (url.includes('2024-13-01')) {
        route.fulfill({ status: 400, body: JSON.stringify({ error: 'Invalid date format' }) });
      } else {
        route.continue();
      }
    });
    
    await transactionsPage.setDateRange('2024-13-01', '2024-01-31');
    
    await expect(transactionsPage.errorMessage).toBeVisible();
    const errorText = await transactionsPage.errorMessage.textContent();
    expect(errorText).toContain('Invalid date format');
    
    logger.info('Malformed date parameter error displayed correctly');
  });

  test('QE-8511 TS-003 TC-002: Verify system rejects request when end date is before start date', async ({ page }) => {
    logger.info('Test Case: QE-8511 TS-003 TC-002 - End Date Before Start Date');
    
    await transactionsPage.navigate();
    
    await transactionsPage.setDateRange('2024-06-30', '2024-01-01');
    
    await expect(transactionsPage.errorMessage).toBeVisible();
    const errorText = await transactionsPage.errorMessage.textContent();
    expect(errorText).toContain('Invalid date range');
    expect(errorText).toContain('End date cannot be before start date');
    
    logger.info('End date before start date error displayed correctly');
  });

  test('QE-8514 TS-001 TC-001: Verify category-wise spending visualization displays correctly for user with transactions across all 9 categories', async ({ page }) => {
    logger.info('Test Case: QE-8514 TS-001 TC-001 - Category-wise Spending Visualization');
    
    await transactionsPage.navigate();
    await expect(transactionsPage.analyticsSection).toBeVisible();
    
    await expect(transactionsPage.categoryChart).toBeVisible();
    
    const categories = await transactionsPage.getCategoryList();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    expectedCategories.forEach(category => {
      expect(categories.some(c => c.name === category)).toBeTruthy();
    });
    
    logger.info(`Categories displayed: ${categories.map(c => c.name).join(', ')}`);
    
    const totalPercentage = categories.reduce((sum, cat) => sum + parseFloat(cat.percentage), 0);
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    const firstCategory = categories[0];
    await transactionsPage.clickCategoryInChart(firstCategory.name);
    await page.waitForTimeout(500);
    
    const filteredTransactions = await transactionsPage.getTransactionCount();
    logger.info(`Transactions filtered by ${firstCategory.name}: ${filteredTransactions}`);
    
    logger.info('Category-wise spending visualization verified successfully');
  });

  test('QE-8514 TS-002 TC-001: Verify system returns empty analytics result when no transactions exist in selected date range', async ({ page }) => {
    logger.info('Test Case: QE-8514 TS-002 TC-001 - No Transactions in Date Range');
    
    await transactionsPage.navigate();
    
    await transactionsPage.setDateRange('2025-01-01', '2025-01-31');
    await page.waitForTimeout(500);
    
    const categories = await transactionsPage.getCategoryList();
    
    categories.forEach(category => {
      expect(category.totalSpend).toContain('$0.00');
      expect(category.percentage).toBe('0');
    });
    
    await expect(transactionsPage.emptyChartMessage).toBeVisible();
    const messageText = await transactionsPage.emptyChartMessage.textContent();
    expect(messageText).toContain('No spending data available');
    
    logger.info('Empty analytics result displayed correctly');
  });

  test('QE-8514 TS-003 TC-001: Verify system returns validation error when invalid category filter parameter is provided', async ({ page }) => {
    logger.info('Test Case: QE-8514 TS-003 TC-001 - Invalid Category Filter');
    
    await transactionsPage.navigate();
    
    await page.route('**/api/analytics/categories*', route => {
      const url = route.request().url();
      if (url.includes('InvalidCategory')) {
        route.fulfill({ status: 400, body: JSON.stringify({ error: 'Invalid category' }) });
      } else {
        route.continue();
      }
    });
    
    await transactionsPage.selectCategory('InvalidCategory');
    
    await expect(transactionsPage.errorMessage).toBeVisible();
    const errorText = await transactionsPage.errorMessage.textContent();
    expect(errorText).toContain('Invalid category');
    
    logger.info('Invalid category filter error displayed correctly');
  });
});
