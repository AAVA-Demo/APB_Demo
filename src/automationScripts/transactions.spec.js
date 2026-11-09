const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');

test.describe('Credit Card Dashboard - Transaction Management', () => {
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
    await transactionsPage.navigate();
  });

  // QE-7637 TS-001 TC-001
  test('TC-007: Verify user with multiple transactions across multiple cards can view complete chronological transaction list', async ({ page }) => {
    await expect(transactionsPage.navigationMenu).toBeVisible();
    await transactionsPage.navigateToTransactionManagement();
    
    await expect(transactionsPage.transactionListingPage).toBeVisible();
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBe(19);
    
    const dates = await transactionsPage.getAllTransactionDates();
    dates.forEach(date => {
      expect(date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
    
    const amounts = await transactionsPage.getAllTransactionAmounts();
    amounts.forEach(amount => {
      expect(amount).toMatch(/^\$\d+\.\d{2}$/);
    });
    
    const merchants = await transactionsPage.getAllMerchantNames();
    expect(merchants).toContain('Starbucks');
    expect(merchants).toContain('Shell Gas');
    expect(merchants).toContain('Amazon');
    
    const categories = await transactionsPage.getAllCategories();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    
    const statuses = await transactionsPage.getAllStatuses();
    statuses.forEach(status => {
      expect(['Posted', 'Pending']).toContain(status);
    });
  });

  // QE-7637 TS-002 TC-001
  test('TC-008: Verify user with no transaction history receives appropriate empty state message', async ({ page }) => {
    await transactionsPage.loginWithNoTransactions('user_no_transactions', 'Test@123');
    await expect(transactionsPage.navigationMenu).toBeVisible();
    
    await transactionsPage.navigateToTransactionManagement();
    await expect(transactionsPage.transactionListingPage).toBeVisible();
    
    await expect(transactionsPage.emptyStateMessage).toBeVisible();
    const emptyMessage = await transactionsPage.emptyStateMessage.textContent();
    expect(emptyMessage).toContain('No transactions are available to display');
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBe(0);
  });

  // QE-7637 TS-003 TC-001
  test('TC-009: Verify user can filter transactions by specific credit card and view only transactions for that card', async ({ page }) => {
    await expect(transactionsPage.navigationMenu).toBeVisible();
    await transactionsPage.navigateToTransactionManagement();
    
    await expect(transactionsPage.transactionListingPage).toBeVisible();
    
    await transactionsPage.applyCardFilter('1');
    await transactionsPage.waitForFilteredResults();
    
    const filteredCount = await transactionsPage.getTransactionCount();
    expect(filteredCount).toBe(5);
    
    const allBelongToCard1 = await transactionsPage.verifyAllTransactionsBelongToCard('1');
    expect(allBelongToCard1).toBe(true);
    
    const detailsPreserved = await transactionsPage.verifyTransactionDetailsPreserved();
    expect(detailsPreserved).toBe(true);
  });

  // QE-7635 TS-001 TC-001
  test('TC-010: Verify user can select transaction from list and view comprehensive details in detail panel', async ({ page }) => {
    await expect(transactionsPage.navigationMenu).toBeVisible();
    await transactionsPage.navigateToTransactionManagement();
    
    await expect(transactionsPage.transactionListingPage).toBeVisible();
    
    await transactionsPage.selectTransaction('t1');
    await expect(transactionsPage.transactionDetailPanel).toBeVisible();
    
    const transactionId = await transactionsPage.getDetailFieldValue('Transaction ID');
    expect(transactionId).toBe('t1');
    
    const dateTime = await transactionsPage.getDetailFieldValue('Date');
    expect(dateTime).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
    
    const merchant = await transactionsPage.getDetailFieldValue('Merchant');
    expect(merchant).toBe('Starbucks');
    
    const amount = await transactionsPage.getDetailFieldValue('Amount');
    expect(amount).toBe('$5.50');
    
    const category = await transactionsPage.getDetailFieldValue('Category');
    expect(category).toBe('Food & Dining');
    
    const status = await transactionsPage.getDetailFieldValue('Status');
    expect(status).toBe('Posted');
    
    const description = await transactionsPage.getDetailFieldValue('Description');
    expect(description).toBe('Coffee');
    
    const cardId = await transactionsPage.getDetailFieldValue('Card ID');
    expect(cardId).toBe('1');
  });

  // QE-7635 TS-002 TC-001
  test('TC-011: Verify transaction detail panel gracefully handles transactions with missing or incomplete data fields', async ({ page }) => {
    await expect(transactionsPage.navigationMenu).toBeVisible();
    await transactionsPage.navigateToTransactionManagement();
    
    await expect(transactionsPage.transactionListingPage).toBeVisible();
    
    await transactionsPage.selectTransaction('t_incomplete');
    await expect(transactionsPage.transactionDetailPanel).toBeVisible();
    
    const availableFieldsDisplayed = await transactionsPage.verifyAvailableFieldsDisplayed();
    expect(availableFieldsDisplayed).toBe(true);
    
    const missingFieldsHandled = await transactionsPage.verifyMissingFieldsShowPlaceholder();
    expect(missingFieldsHandled).toBe(true);
    
    await expect(transactionsPage.page.locator('.error, .exception, .blank-error')).toHaveCount(0);
    
    const panelRendersCleanly = await transactionsPage.verifyPanelLayout();
    expect(panelRendersCleanly).toBe(true);
  });

  // QE-7635 TS-003 TC-001
  test('TC-012: Verify transaction detail panel updates correctly when switching between different transactions', async ({ page }) => {
    await expect(transactionsPage.navigationMenu).toBeVisible();
    await transactionsPage.navigateToTransactionManagement();
    
    await expect(transactionsPage.transactionListingPage).toBeVisible();
    
    await transactionsPage.selectTransaction('t1');
    await expect(transactionsPage.transactionDetailPanel).toBeVisible();
    
    let merchant = await transactionsPage.getDetailFieldValue('Merchant');
    expect(merchant).toBe('Starbucks');
    
    await transactionsPage.closeDetailPanel();
    await expect(transactionsPage.transactionDetailPanel).not.toBeVisible();
    await expect(transactionsPage.transactionListingPage).toBeVisible();
    
    await transactionsPage.selectTransaction('t3');
    await expect(transactionsPage.transactionDetailPanel).toBeVisible();
    
    merchant = await transactionsPage.getDetailFieldValue('Merchant');
    expect(merchant).toBe('Amazon');
    
    const noResidualData = await transactionsPage.verifyNoResidualData('Starbucks');
    expect(noResidualData).toBe(true);
  });
});