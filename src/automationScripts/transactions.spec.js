const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { TransactionsPage } = require('./pages/transactions.page');

test.describe('Transaction Management and Monitoring Tests', () => {
  let loginPage;
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);
    await loginPage.navigate();
  });

  test('QE-8901 TS-001 TC-001: Verify centralized transaction list displays all transactions with pagination', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await transactionsPage.navigateToTransactions();
    
    const isTransactionListVisible = await transactionsPage.isTransactionListVisible();
    expect(isTransactionListVisible).toBe(true);
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeLessThanOrEqual(25);
    
    const transactions = await transactionsPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    
    const isChronological = await transactionsPage.isTransactionsInChronologicalOrder();
    expect(isChronological).toBe(true);
    
    const hasPagination = await transactionsPage.hasPaginationControls();
    expect(hasPagination).toBe(true);
    
    await transactionsPage.goToNextPage();
    const secondPageTransactions = await transactionsPage.getAllTransactions();
    expect(secondPageTransactions.length).toBeGreaterThan(0);
  });

  test('QE-8901 TS-002 TC-001: Verify system displays empty state message when no transactions exist', async ({ page }) => {
    await loginPage.login('notransactionuser@demo.com', 'Test@123');
    await transactionsPage.navigateToTransactions();
    
    const emptyMessage = await transactionsPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No transactions available');
    
    const isListStructureVisible = await transactionsPage.isTransactionListContainerVisible();
    expect(isListStructureVisible).toBe(true);
    
    const hasErrors = await transactionsPage.hasConsoleErrors();
    expect(hasErrors).toBe(false);
  });

  test('QE-8901 TS-003 TC-001: Verify system displays user-friendly error message when service returns 500 error', async ({ page }) => {
    await page.route('**/api/transactions*', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    await loginPage.login('testuser@demo.com', 'Test@123');
    await transactionsPage.navigateToTransactions();
    
    const errorMessage = await transactionsPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load transactions. Please try again.');
    
    const hasTechnicalDetails = await transactionsPage.hasTechnicalErrorDetails();
    expect(hasTechnicalDetails).toBe(false);
    
    const hasRetryButton = await transactionsPage.hasRetryButton();
    expect(hasRetryButton).toBe(true);
  });

  test('QE-8900 TS-001 TC-001: Verify transaction details view displays complete information with sub-300ms latency', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await transactionsPage.navigateToTransactions();
    
    const startTime = Date.now();
    await transactionsPage.selectFirstTransaction();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(300);
    
    const amount = await transactionsPage.getTransactionDetailAmount();
    expect(amount).toMatch(/^\$\d+\.\d{2}$/);
    
    const timestamp = await transactionsPage.getTransactionDetailTimestamp();
    expect(timestamp).toMatch(/^\w{3}\s\d{1,2},\s\d{4},\s\d{1,2}:\d{2}\s(AM|PM)$/);
    
    const merchant = await transactionsPage.getTransactionDetailMerchant();
    expect(merchant).toBeDefined();
    expect(merchant.length).toBeGreaterThan(0);
    
    const category = await transactionsPage.getTransactionDetailCategory();
    expect(category).toBeDefined();
    
    const cardInfo = await transactionsPage.getTransactionDetailCard();
    expect(cardInfo).toMatch(/\*{4}\s\d{4}/);
  });

  test('QE-8900 TS-002 TC-001: Verify system displays error message when viewing deleted transaction', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await transactionsPage.navigateToTransactions();
    
    await page.route('**/api/transactions/TXN-DELETED-001', route => {
      route.fulfill({
        status: 404,
        body: JSON.stringify({ error: 'Transaction not found' })
      });
    });
    
    await transactionsPage.attemptToViewDeletedTransaction('TXN-DELETED-001');
    
    const errorMessage = await transactionsPage.getTransactionDetailErrorMessage();
    expect(errorMessage).toContain('Transaction cannot be found');
    
    const isAppStable = await transactionsPage.isApplicationStable();
    expect(isAppStable).toBe(true);
    
    await transactionsPage.returnToTransactionList();
    const isListVisible = await transactionsPage.isTransactionListVisible();
    expect(isListVisible).toBe(true);
  });

  test('QE-8900 TS-003 TC-001: Verify system displays placeholder values for missing transaction fields', async ({ page }) => {
    await loginPage.login('missingfielduser@demo.com', 'Test@123');
    await transactionsPage.navigateToTransactions();
    await transactionsPage.selectFirstTransaction();
    
    const merchant = await transactionsPage.getTransactionDetailMerchant();
    if (merchant === null || merchant === '') {
      const placeholder = await transactionsPage.getMerchantPlaceholder();
      expect(placeholder === 'N/A' || placeholder === 'Unknown').toBe(true);
    }
    
    const category = await transactionsPage.getTransactionDetailCategory();
    if (category === null || category === '') {
      const placeholder = await transactionsPage.getCategoryPlaceholder();
      expect(placeholder === 'N/A' || placeholder === 'Uncategorized').toBe(true);
    }
    
    const isLayoutIntact = await transactionsPage.isDetailViewLayoutIntact();
    expect(isLayoutIntact).toBe(true);
    
    const hasErrors = await transactionsPage.hasConsoleErrors();
    expect(hasErrors).toBe(false);
  });
});
