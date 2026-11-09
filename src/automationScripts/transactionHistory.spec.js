const { test, expect } = require('@playwright/test');
const { TransactionHistoryPage } = require('./pages/transactionHistory.page');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Transaction History Tests', () => {

  test('QE-9079 TS-001 TC-001 - Verify transaction history displays paginated list of 20 transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);
    const transactionHistoryPage = new TransactionHistoryPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.selectCard(testData.cards.visa1234);
    
    await cardManagementPage.clickViewTransactionHistory();
    
    await transactionHistoryPage.waitForTransactionHistoryLoad();
    
    const transactionCount = await transactionHistoryPage.getTransactionCount();
    expect(transactionCount).toBe(20);
    
    const firstTransaction = await transactionHistoryPage.getTransactionDetails(0);
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.merchant).toBeTruthy();
    expect(firstTransaction.amount).toContain('$');
    expect(firstTransaction.category).toBeTruthy();
    
    await expect(transactionHistoryPage.paginationControls).toBeVisible();
    await expect(transactionHistoryPage.nextButton).toBeVisible();
    await expect(transactionHistoryPage.previousButton).toBeVisible();
  });

  test('QE-9079 TS-002 TC-001 - Verify transaction history displays last recorded transactions for inactive card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);
    const transactionHistoryPage = new TransactionHistoryPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.selectCard(testData.cards.inactiveCard5678);
    
    await cardManagementPage.clickViewTransactionHistory();
    
    await transactionHistoryPage.waitForTransactionHistoryLoad();
    
    await expect(transactionHistoryPage.inactiveCardMessage).toBeVisible();
    const messageText = await transactionHistoryPage.getInactiveCardMessageText();
    expect(messageText).toContain('No recent transactions');
    expect(messageText).toContain('2022-03-15');
    
    const transactions = await transactionHistoryPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    
    const lastTransactionDate = await transactionHistoryPage.getLastTransactionDate();
    expect(lastTransactionDate).toContain('2022');
  });

  test('QE-9079 TS-003 TC-001 - Verify transaction history filtering by category displays only matching transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);
    const transactionHistoryPage = new TransactionHistoryPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.selectCard(testData.cards.highVolumeCard9012);
    
    await cardManagementPage.clickViewTransactionHistory();
    
    await transactionHistoryPage.waitForTransactionHistoryLoad();
    
    const initialCount = await transactionHistoryPage.getTransactionCount();
    expect(initialCount).toBeGreaterThan(0);
    
    await transactionHistoryPage.clickFilterByCategory();
    await transactionHistoryPage.selectCategory('Food & Dining');
    
    await transactionHistoryPage.waitForFilteredResults();
    
    const filteredCount = await transactionHistoryPage.getTransactionCount();
    expect(filteredCount).toBeGreaterThan(0);
    
    const allTransactions = await transactionHistoryPage.getAllTransactions();
    for (const transaction of allTransactions) {
      expect(transaction.category).toBe('Food & Dining');
    }
    
    await expect(transactionHistoryPage.dateRangeFilter).toBeVisible();
  });

  test('QE-9012 TS-001 TC-001 - Verify transaction history displays 50 transactions per page with all details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);
    const transactionHistoryPage = new TransactionHistoryPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.selectCard(testData.cards.visa4567);
    
    await cardManagementPage.clickViewTransactionHistory();
    
    await transactionHistoryPage.waitForTransactionHistoryLoad();
    
    const transactionCount = await transactionHistoryPage.getTransactionCount();
    expect(transactionCount).toBe(50);
    
    const allTransactions = await transactionHistoryPage.getAllTransactions();
    for (const transaction of allTransactions) {
      expect(transaction.date).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(transaction.merchant).toBeTruthy();
      expect(transaction.amount).toMatch(/\$\d+\.\d{2}/);
      expect(transaction.category).toBeTruthy();
    }
    
    const paginationText = await transactionHistoryPage.getPaginationText();
    expect(paginationText).toContain('Page 1 of 3');
    
    await expect(transactionHistoryPage.nextButton).toBeEnabled();
    await expect(transactionHistoryPage.lastButton).toBeEnabled();
  });

  test('QE-9012 TS-002 TC-001 - Verify error message when accessing deleted card transaction history', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionHistoryPage = new TransactionHistoryPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await page.goto(testData.urls.deletedCardTransactions);
    
    await expect(transactionHistoryPage.errorMessage).toBeVisible();
    const errorText = await transactionHistoryPage.getErrorMessageText();
    expect(errorText).toContain('Card not found or access denied');
    expect(errorText).toContain('deleted or is no longer associated');
    
    const transactionCount = await transactionHistoryPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    
    await expect(transactionHistoryPage.returnToDashboardButton).toBeVisible();
  });

  test('QE-9012 TS-003 TC-001 - Verify transaction filtering by date range and category', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);
    const transactionHistoryPage = new TransactionHistoryPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.selectCard(testData.cards.visa4567);
    
    await cardManagementPage.clickViewTransactionHistory();
    
    await transactionHistoryPage.waitForTransactionHistoryLoad();
    
    await transactionHistoryPage.clickFilterButton();
    
    await transactionHistoryPage.selectDateRange('Last 30 Days');
    await transactionHistoryPage.selectCategory('Food & Dining');
    
    await transactionHistoryPage.clickApplyFilters();
    
    await transactionHistoryPage.waitForFilteredResults();
    
    const allTransactions = await transactionHistoryPage.getAllTransactions();
    
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
    
    for (const transaction of allTransactions) {
      const transactionDate = new Date(transaction.date);
      expect(transactionDate).toBeGreaterThanOrEqual(thirtyDaysAgo);
      expect(transaction.category).toBe('Food & Dining');
    }
    
    const paginationText = await transactionHistoryPage.getPaginationText();
    expect(paginationText).toBeTruthy();
  });
});
