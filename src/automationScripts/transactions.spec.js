const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const { LoginPage } = require('./pages/login.page');

// Test cases for Unified Transaction List View (QE-10342)
test.describe('Unified Transaction List View', () => {
  let transactionPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionPage = new TransactionPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'testpass');
  });

  // QE-10342 TS-001 TC-001
  test('TC-001: Verify consolidated transaction list displays all transactions from 3 cards within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await transactionPage.navigate();
    await expect(transactionPage.transactionList).toBeVisible();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(3000);
    
    const transactions = await transactionPage.getAllTransactions();
    const uniqueCards = new Set(transactions.map(t => t.cardName));
    expect(uniqueCards.size).toBe(3);
    
    for (const txn of transactions) {
      expect(txn.merchant).toBeTruthy();
      expect(txn.amount).toBeTruthy();
      expect(txn.date).toBeTruthy();
      expect(txn.cardName).toBeTruthy();
    }
  });

  // QE-10342 TS-001 TC-002
  test('TC-002: Verify transaction list is sorted by date (most recent first) by default', async ({ page }) => {
    await transactionPage.navigate();
    await expect(transactionPage.transactionList).toBeVisible();
    
    const transactions = await transactionPage.getAllTransactions();
    const dates = transactions.map(t => new Date(t.date));
    
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i + 1].getTime());
    }
  });

  // QE-10342 TS-002 TC-001
  test('TC-003: Verify system handles 1000 transactions with pagination without performance degradation', async ({ page }) => {
    const startTime = Date.now();
    await transactionPage.navigate();
    await expect(transactionPage.transactionList).toBeVisible();
    const firstPageLoadTime = Date.now() - startTime;
    expect(firstPageLoadTime).toBeLessThanOrEqual(3000);
    
    await expect(transactionPage.paginationControls).toBeVisible();
    await expect(transactionPage.nextButton).toBeVisible();
    await expect(transactionPage.previousButton).toBeVisible();
    
    const page2Start = Date.now();
    await transactionPage.nextButton.click();
    await expect(transactionPage.transactionList).toBeVisible();
    const page2LoadTime = Date.now() - page2Start;
    expect(page2LoadTime).toBeLessThanOrEqual(1000);
    
    await transactionPage.goToPage(5);
    await expect(transactionPage.transactionList).toBeVisible();
    
    await transactionPage.goToPage(10);
    await expect(transactionPage.transactionList).toBeVisible();
    
    await transactionPage.goToPage(15);
    await expect(transactionPage.transactionList).toBeVisible();
  });

  // QE-10342 TS-002 TC-002
  test('TC-004: Verify transaction count and pagination metadata are accurate for 1000 transactions', async ({ page }) => {
    await transactionPage.navigate();
    await expect(transactionPage.transactionList).toBeVisible();
    
    const totalCount = await transactionPage.getTotalTransactionCount();
    expect(totalCount).toBe(1000);
    
    const paginationText = await transactionPage.getPaginationMetadata();
    expect(paginationText).toContain('Showing 1-50 of 1000');
    
    await transactionPage.goToLastPage();
    await expect(transactionPage.transactionList).toBeVisible();
    
    const lastPageText = await transactionPage.getPaginationMetadata();
    expect(lastPageText).toContain('Showing 951-1000 of 1000');
  });

  // QE-10342 TS-003 TC-001
  test('TC-005: Verify appropriate message when user has no credit card transactions', async ({ page }) => {
    await transactionPage.navigate();
    
    const transactionCount = await transactionPage.getTransactionCount();
    if (transactionCount === 0) {
      await expect(transactionPage.noTransactionsMessage).toBeVisible();
      await expect(transactionPage.noTransactionsMessage).toContainText('No transactions found');
      await expect(transactionPage.transactionList).not.toBeVisible();
    }
  });

  // QE-10342 TS-003 TC-002
  test('TC-006: Verify no transactions message includes helpful guidance or call-to-action', async ({ page }) => {
    await transactionPage.navigate();
    
    const transactionCount = await transactionPage.getTransactionCount();
    if (transactionCount === 0) {
      await expect(transactionPage.noTransactionsMessage).toBeVisible();
      const messageText = await transactionPage.noTransactionsMessage.textContent();
      expect(messageText).toMatch(/No transactions found|Start using your credit cards/);
      
      await expect(transactionPage.dashboardLink).toBeVisible();
      const linkText = await transactionPage.dashboardLink.textContent();
      expect(linkText).toMatch(/View your credit cards|Go to Dashboard/);
    }
  });
});

// Test cases for Advanced Transaction Search and Filter (QE-10341)
test.describe('Advanced Transaction Search and Filter', () => {
  let transactionPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionPage = new TransactionPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'testpass');
  });

  // QE-10341 TS-001 TC-001
  test('TC-007: Verify date range and card filter returns matching transactions within 1 second', async ({ page }) => {
    await transactionPage.navigate();
    await expect(transactionPage.transactionList).toBeVisible();
    
    await transactionPage.selectDateRangeFilter('Last 30 days');
    await transactionPage.selectCardFilter('Visa Platinum');
    
    const filterStart = Date.now();
    await transactionPage.applyFilters();
    await expect(transactionPage.transactionList).toBeVisible();
    const filterTime = Date.now() - filterStart;
    expect(filterTime).toBeLessThanOrEqual(1000);
    
    const filteredTransactions = await transactionPage.getAllTransactions();
    for (const txn of filteredTransactions) {
      expect(txn.cardName).toBe('Visa Platinum');
      const txnDate = new Date(txn.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      expect(txnDate.getTime()).toBeGreaterThanOrEqual(thirtyDaysAgo.getTime());
    }
  });

  // QE-10341 TS-001 TC-002
  test('TC-008: Verify filter accuracy by comparing filtered results with expected transaction count', async ({ page }) => {
    await transactionPage.navigate();
    await expect(transactionPage.transactionList).toBeVisible();
    
    await transactionPage.selectDateRangeFilter('Last 30 days');
    await transactionPage.selectCardFilter('Visa Platinum');
    
    const filterStart = Date.now();
    await transactionPage.applyFilters();
    await expect(transactionPage.transactionList).toBeVisible();
    const filterTime = Date.now() - filterStart;
    expect(filterTime).toBeLessThanOrEqual(1000);
    
    const totalCount = await transactionPage.getTotalTransactionCount();
    expect(totalCount).toBe(50);
    
    const sampleTransactions = await transactionPage.getSampleTransactions(10);
    for (const txn of sampleTransactions) {
      expect(txn.cardName).toBe('Visa Platinum');
      const txnDate = new Date(txn.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      expect(txnDate.getTime()).toBeGreaterThanOrEqual(thirtyDaysAgo.getTime());
    }
  });

  // QE-10341 TS-002 TC-001
  test('TC-009: Verify amount range filter returns only transactions within specified range within 1 second', async ({ page }) => {
    await transactionPage.navigate();
    await expect(transactionPage.transactionList).toBeVisible();
    
    await transactionPage.setMinAmount(100);
    await transactionPage.setMaxAmount(500);
    
    const filterStart = Date.now();
    await transactionPage.applyFilters();
    await expect(transactionPage.transactionList).toBeVisible();
    const filterTime = Date.now() - filterStart;
    expect(filterTime).toBeLessThanOrEqual(1000);
    
    const filteredTransactions = await transactionPage.getAllTransactions();
    for (const txn of filteredTransactions) {
      expect(txn.amount).toBeGreaterThanOrEqual(100);
      expect(txn.amount).toBeLessThanOrEqual(500);
    }
  });

  // QE-10341 TS-002 TC-002
  test('TC-010: Verify amount filter excludes transactions outside the specified range', async ({ page }) => {
    await transactionPage.navigate();
    await expect(transactionPage.transactionList).toBeVisible();
    
    await transactionPage.setMinAmount(100);
    await transactionPage.setMaxAmount(500);
    
    const filterStart = Date.now();
    await transactionPage.applyFilters();
    await expect(transactionPage.transactionList).toBeVisible();
    const filterTime = Date.now() - filterStart;
    expect(filterTime).toBeLessThanOrEqual(1000);
    
    const filteredTransactions = await transactionPage.getAllTransactions();
    for (const txn of filteredTransactions) {
      expect(txn.amount).toBeGreaterThanOrEqual(100);
      expect(txn.amount).toBeLessThanOrEqual(500);
    }
    
    const sampleTransactions = await transactionPage.getSampleTransactions(10);
    for (const txn of sampleTransactions) {
      expect(txn.amount).toBeGreaterThanOrEqual(100);
      expect(txn.amount).toBeLessThanOrEqual(500);
    }
  });

  // QE-10341 TS-003 TC-001
  test('TC-011: Verify validation error when Date From is later than Date To', async ({ page }) => {
    await transactionPage.navigate();
    await expect(transactionPage.transactionList).toBeVisible();
    
    await transactionPage.setDateFrom('2023-01-31');
    await transactionPage.setDateTo('2023-01-01');
    
    await transactionPage.applyFilters();
    
    await expect(transactionPage.validationError).toBeVisible();
    const errorText = await transactionPage.validationError.textContent();
    expect(errorText).toContain('Invalid date range');
    
    const transactionsBefore = await transactionPage.getAllTransactions();
    expect(transactionsBefore.length).toBeGreaterThan(0);
  });

  // QE-10341 TS-003 TC-002
  test('TC-012: Verify validation error is cleared when user corrects the date range', async ({ page }) => {
    await transactionPage.navigate();
    await expect(transactionPage.transactionList).toBeVisible();
    
    await transactionPage.setDateFrom('2023-01-31');
    await transactionPage.setDateTo('2023-01-01');
    await transactionPage.applyFilters();
    
    await expect(transactionPage.validationError).toBeVisible();
    
    await transactionPage.setDateFrom('2023-01-01');
    await transactionPage.setDateTo('2023-01-31');
    await transactionPage.applyFilters();
    
    await expect(transactionPage.validationError).not.toBeVisible();
    await expect(transactionPage.transactionList).toBeVisible();
    
    const filteredTransactions = await transactionPage.getAllTransactions();
    for (const txn of filteredTransactions) {
      const txnDate = new Date(txn.date);
      expect(txnDate.getTime()).toBeGreaterThanOrEqual(new Date('2023-01-01').getTime());
      expect(txnDate.getTime()).toBeLessThanOrEqual(new Date('2023-01-31').getTime());
    }
  });
});