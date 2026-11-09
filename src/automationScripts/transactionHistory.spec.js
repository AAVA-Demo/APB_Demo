const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { TransactionHistoryPage } = require('./pages/transactionHistory.page');
const logger = require('../utils/logger');

test.describe('Transaction History Tests - QE-9012', () => {
  let loginPage;
  let cardManagementPage;
  let transactionHistoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    transactionHistoryPage = new TransactionHistoryPage(page);
    logger.info('Starting Transaction History test');
  });

  test('QE-9012 TS-001 TC-001 - Verify paginated transaction history with 50 transactions per page', async ({ page }) => {
    logger.info('Test Case: QE-9012 TS-001 TC-001');
    
    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    logger.info('User logged in successfully');

    // Step 3: Navigate to Card Management section
    await cardManagementPage.navigateToCardManagement();
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    logger.info('Card Management page loaded');

    // Step 4: Select credit card with 150 transactions
    await cardManagementPage.selectCardByLastFourDigits('4567');
    logger.info('Selected card: Visa ending in 4567');

    // Step 5: Click View Transaction History
    await cardManagementPage.clickViewTransactionHistory();
    await transactionHistoryPage.waitForTransactionHistoryLoad();
    logger.info('Transaction History page loaded');

    // Step 6: Verify first page displays 50 transactions
    const transactionCount = await transactionHistoryPage.getTransactionCount();
    expect(transactionCount).toBe(50);
    logger.info(`Verified 50 transactions on page 1`);

    // Step 7: Verify each transaction displays Date field
    const allDatesVisible = await transactionHistoryPage.verifyAllTransactionsHaveDate();
    expect(allDatesVisible).toBe(true);
    const sampleDate = await transactionHistoryPage.getFirstTransactionDate();
    expect(sampleDate).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    logger.info(`Date field verified. Sample: ${sampleDate}`);

    // Step 8: Verify each transaction displays Merchant field
    const allMerchantsVisible = await transactionHistoryPage.verifyAllTransactionsHaveMerchant();
    expect(allMerchantsVisible).toBe(true);
    const sampleMerchant = await transactionHistoryPage.getFirstTransactionMerchant();
    expect(sampleMerchant.length).toBeGreaterThan(0);
    logger.info(`Merchant field verified. Sample: ${sampleMerchant}`);

    // Step 9: Verify each transaction displays Amount field
    const allAmountsVisible = await transactionHistoryPage.verifyAllTransactionsHaveAmount();
    expect(allAmountsVisible).toBe(true);
    const sampleAmount = await transactionHistoryPage.getFirstTransactionAmount();
    expect(sampleAmount).toMatch(/\$\d+\.\d{2}/);
    logger.info(`Amount field verified. Sample: ${sampleAmount}`);

    // Step 10: Verify each transaction displays Category field
    const allCategoriesVisible = await transactionHistoryPage.verifyAllTransactionsHaveCategory();
    expect(allCategoriesVisible).toBe(true);
    const sampleCategory = await transactionHistoryPage.getFirstTransactionCategory();
    const validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expect(validCategories).toContain(sampleCategory);
    logger.info(`Category field verified. Sample: ${sampleCategory}`);

    // Step 11: Verify pagination controls
    const paginationText = await transactionHistoryPage.getPaginationText();
    expect(paginationText).toContain('Page 1 of 3');
    await expect(transactionHistoryPage.nextPageButton).toBeEnabled();
    await expect(transactionHistoryPage.lastPageButton).toBeEnabled();
    logger.info('Pagination controls verified');
  });

  test('QE-9012 TS-002 TC-001 - Verify error message for deleted card transaction access', async ({ page }) => {
    logger.info('Test Case: QE-9012 TS-002 TC-001');
    
    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    logger.info('User logged in successfully');

    // Step 3: Manually navigate to deleted card transaction URL
    await page.goto('https://creditcard-dashboard.example.com/cards/deleted-card-id-123/transactions');
    logger.info('Navigated to deleted card transaction URL');

    // Step 4-5: Verify error message is displayed
    await expect(transactionHistoryPage.errorMessageContainer).toBeVisible();
    const errorMessage = await transactionHistoryPage.getErrorMessage();
    expect(errorMessage).toContain('Card not found or access denied');
    expect(errorMessage).toContain('This card may have been deleted or is no longer associated with your account');
    logger.info(`Error message verified: ${errorMessage}`);

    // Step 6: Verify no transaction data is displayed
    const transactionTableVisible = await transactionHistoryPage.isTransactionTableVisible();
    expect(transactionTableVisible).toBe(false);
    logger.info('Verified no transaction data is displayed');

    // Step 7: Verify Return to Dashboard button is displayed
    await expect(transactionHistoryPage.returnToDashboardButton).toBeVisible();
    await expect(transactionHistoryPage.returnToDashboardButton).toBeEnabled();
    logger.info('Return to Dashboard button verified');
  });

  test('QE-9012 TS-003 TC-001 - Verify filtered transaction history by date range and category', async ({ page }) => {
    logger.info('Test Case: QE-9012 TS-003 TC-001');
    
    // Step 1: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    logger.info('User logged in successfully');

    // Step 2: Navigate to Card Management and select card
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.selectCardByLastFourDigits('4567');
    logger.info('Selected card: Visa ending in 4567');

    // Step 3: Click View Transaction History
    await cardManagementPage.clickViewTransactionHistory();
    await transactionHistoryPage.waitForTransactionHistoryLoad();
    logger.info('Transaction History page loaded');

    // Step 4: Open filter panel
    await transactionHistoryPage.clickFilterButton();
    await expect(transactionHistoryPage.filterPanel).toBeVisible();
    logger.info('Filter panel opened');

    // Step 5: Select date range filter 'Last 30 Days'
    await transactionHistoryPage.selectDateRangeFilter('Last 30 Days');
    const dateRangeText = await transactionHistoryPage.getSelectedDateRange();
    expect(dateRangeText).toMatch(/\d{2}\/\d{2}\/\d{4} to \d{2}\/\d{2}\/\d{4}/);
    logger.info(`Date range filter set: ${dateRangeText}`);

    // Step 6: Select category filter 'Food & Dining'
    await transactionHistoryPage.selectCategoryFilter('Food & Dining');
    const selectedCategory = await transactionHistoryPage.getSelectedCategory();
    expect(selectedCategory).toBe('Food & Dining');
    logger.info('Category filter set: Food & Dining');

    // Step 7: Apply filters
    await transactionHistoryPage.clickApplyFilters();
    await transactionHistoryPage.waitForFilteredResults();
    logger.info('Filters applied');

    // Step 8: Verify all displayed transactions are within last 30 days
    const allDatesValid = await transactionHistoryPage.verifyAllTransactionsWithinDateRange('12/15/2024', '01/14/2025');
    expect(allDatesValid).toBe(true);
    logger.info('All transactions within date range verified');

    // Step 9: Verify all displayed transactions have category 'Food & Dining'
    const allCategoriesMatch = await transactionHistoryPage.verifyAllTransactionsHaveCategory('Food & Dining');
    expect(allCategoriesMatch).toBe(true);
    logger.info('All transactions have Food & Dining category verified');

    // Step 10: Verify transactions not matching criteria are excluded
    const transactionCount = await transactionHistoryPage.getTransactionCount();
    expect(transactionCount).toBeLessThan(50);
    logger.info(`Filtered transaction count: ${transactionCount}`);

    // Step 11: Verify pagination adjusts to filtered results
    const paginationText = await transactionHistoryPage.getPaginationText();
    if (transactionCount <= 50) {
      expect(paginationText).toContain('Page 1 of 1');
    }
    logger.info(`Pagination adjusted: ${paginationText}`);
  });
});
