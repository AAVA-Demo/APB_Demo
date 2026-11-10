const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { BasePage } = require('./pages/base.page');

test.describe('Transaction Management and Viewing Tests', () => {
  let transactionsPage;
  let basePage;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
    basePage = new BasePage(page);
    await transactionsPage.navigate();
  });

  test('QE-9943 TS-001 TC-001: Verify user can view complete transaction details on responsive interface', async ({ page }) => {
    await transactionsPage.waitForTransactionsLoad();
    
    await transactionsPage.selectTransaction('TXN12345');
    
    await expect(transactionsPage.transactionDetailsPanel).toBeVisible();
    
    const transactionId = await transactionsPage.getDetailField('transactionId');
    expect(transactionId).toBe('TXN12345');
    
    const merchantName = await transactionsPage.getDetailField('merchantName');
    expect(merchantName).toBe('Amazon.com');
    
    const amount = await transactionsPage.getDetailField('amount');
    expect(amount).toBe('$125.50');
    
    const dateTime = await transactionsPage.getDetailField('dateTime');
    expect(dateTime).toMatch(/2024-01-15 14:30:22/);
    
    await expect(transactionsPage.categoryBadge).toBeVisible();
    const categoryText = await transactionsPage.categoryBadge.textContent();
    expect(categoryText).toBe('Shopping');
    const badgeColor = await transactionsPage.getCategoryBadgeColor();
    expect(badgeColor).toBe('rgb(155, 89, 182)');
    
    const cardInfo = await transactionsPage.getDetailField('cardInfo');
    expect(cardInfo).toMatch(/Visa \*\*\*\* 1234/);
    
    const status = await transactionsPage.getDetailField('status');
    expect(status).toBe('Completed');
    
    const description = await transactionsPage.getDetailField('description');
    expect(description).toBe('Online purchase - Electronics');
    
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect(transactionsPage.transactionDetailsPanel).toBeVisible();
      const detailsBox = await transactionsPage.transactionDetailsPanel.boundingBox();
      expect(detailsBox.width).toBeGreaterThan(0);
    }
  });

  test('QE-9943 TS-002 TC-001: Verify error handling when attempting to view deleted or unavailable transaction', async ({ page }) => {
    await transactionsPage.waitForTransactionsLoad();
    
    await page.route('**/api/transactions/TXN99999', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Transaction not found' })
      });
    });
    
    await transactionsPage.selectTransaction('TXN99999');
    
    await expect(transactionsPage.errorMessage).toBeVisible();
    const errorText = await transactionsPage.errorMessage.textContent();
    expect(errorText).toContain('Transaction not found or no longer available');
    
    await expect(transactionsPage.transactionList).toBeVisible();
    
    const otherTransactions = await transactionsPage.getTransactionCount();
    expect(otherTransactions).toBeGreaterThan(0);
    
    await transactionsPage.selectTransaction('TXN001');
    await expect(transactionsPage.transactionDetailsPanel).toBeVisible();
  });

  test('QE-9943 TS-003 TC-001: Verify authentication/session expiry handling when accessing transaction details', async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => sessionStorage.clear());
    
    await page.goto('https://creditcard-dashboard.example.com/transactions/TXN12345/details');
    
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
    
    await expect(transactionsPage.sessionExpiredMessage).toBeVisible();
    const messageText = await transactionsPage.sessionExpiredMessage.textContent();
    expect(messageText).toContain('Session expired');
    expect(messageText).toContain('Please log in again to view transaction details');
  });

  test('QE-9943 TS-003 TC-002: Verify expired session token handling when accessing transaction details', async ({ page }) => {
    await page.evaluate(() => {
      sessionStorage.setItem('cc_auth_token', 'expired_token_12345');
    });
    
    await page.route('**/api/transactions/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized - Token expired' })
      });
    });
    
    await transactionsPage.navigate();
    await transactionsPage.selectTransaction('TXN001');
    
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
    
    await expect(transactionsPage.sessionExpiredMessage).toBeVisible();
    const messageText = await transactionsPage.sessionExpiredMessage.textContent();
    expect(messageText).toContain('Session expired');
    expect(messageText).toContain('Please log in again to view transaction details');
  });

  test('QE-9942 TS-001 TC-001: Verify consolidated multi-card transaction list displays correctly with minimal latency', async ({ page }) => {
    const startTime = Date.now();
    await transactionsPage.waitForTransactionsLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    
    await expect(transactionsPage.transactionList).toBeVisible();
    
    const transactions = await transactionsPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    
    const dates = await transactionsPage.getTransactionDates();
    for (let i = 0; i < dates.length - 1; i++) {
      const date1 = new Date(dates[i]);
      const date2 = new Date(dates[i + 1]);
      expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
    }
    
    for (const txn of transactions.slice(0, 5)) {
      await expect(transactionsPage.getTransactionCardLabel(txn.id)).toBeVisible();
      const cardLabel = await transactionsPage.getTransactionCardLabel(txn.id).textContent();
      expect(cardLabel).toMatch(/^(Visa|Mastercard|Amex) \*\*\*\* \d{4}$/);
      
      await expect(transactionsPage.getTransactionMerchant(txn.id)).toBeVisible();
      
      await expect(transactionsPage.getTransactionAmount(txn.id)).toBeVisible();
      const amount = await transactionsPage.getTransactionAmount(txn.id).textContent();
      expect(amount).toMatch(/^\$[\d,]+\.\d{2}$/);
      
      await expect(transactionsPage.getTransactionCategoryBadge(txn.id)).toBeVisible();
      
      await expect(transactionsPage.getTransactionDate(txn.id)).toBeVisible();
    }
    
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect(transactionsPage.transactionList).toBeVisible();
    }
  });

  test('QE-9942 TS-002 TC-001: Verify informational message when user has no credit cards linked', async ({ page }) => {
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await transactionsPage.navigate();
    
    await expect(transactionsPage.noCardsMessage).toBeVisible();
    const messageText = await transactionsPage.noCardsMessage.textContent();
    expect(messageText).toContain('No credit cards found');
    expect(messageText).toContain('Please add a credit card to view transaction history');
    
    await expect(transactionsPage.addCardButton).toBeVisible();
    const buttonText = await transactionsPage.addCardButton.textContent();
    expect(buttonText).toMatch(/Add Credit Card|Manage Cards/);
    
    await transactionsPage.addCardButton.click();
    await page.waitForURL('**/cards/manage');
    expect(page.url()).toContain('/cards/manage');
  });

  test('QE-9942 TS-003 TC-001: Verify warning message and partial data display when transaction service experiences high latency', async ({ page }) => {
    await page.route('**/api/transactions', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { transactionId: 'TXN001', cardId: 'CC001', merchantName: 'Amazon', amount: 2500, transactionDate: '2024-01-15', category: 'Shopping', status: 'Completed' },
            { transactionId: 'TXN002', cardId: 'CC001', merchantName: 'Shell', amount: 1200, transactionDate: '2024-01-14', category: 'Fuel', status: 'Completed' }
          ].concat(Array(48).fill(null).map((_, i) => ({
            transactionId: `TXN${String(i + 3).padStart(3, '0')}`,
            cardId: 'CC002',
            merchantName: `Merchant ${i + 3}`,
            amount: Math.floor(Math.random() * 5000) + 100,
            transactionDate: '2024-01-10',
            category: 'Miscellaneous',
            status: 'Completed'
          }))))
        });
      }, 5000);
    });
    
    await transactionsPage.navigate();
    
    await expect(transactionsPage.warningMessage).toBeVisible({ timeout: 10000 });
    const warningText = await transactionsPage.warningMessage.textContent();
    expect(warningText).toContain('Some transactions may not be displayed due to connectivity issues');
    
    await expect(transactionsPage.transactionList).toBeVisible();
    const transactions = await transactionsPage.getAllTransactions();
    expect(transactions.length).toBe(50);
    
    await expect(transactionsPage.refreshButton).toBeVisible();
    await expect(transactionsPage.refreshButton).toBeEnabled();
    
    await page.route('**/api/transactions', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(Array(100).fill(null).map((_, i) => ({
          transactionId: `TXN${String(i + 1).padStart(3, '0')}`,
          cardId: `CC00${(i % 3) + 1}`,
          merchantName: `Merchant ${i + 1}`,
          amount: Math.floor(Math.random() * 5000) + 100,
          transactionDate: '2024-01-15',
          category: 'Shopping',
          status: 'Completed'
        })))
      });
    });
    
    await transactionsPage.refreshButton.click();
    await page.waitForTimeout(1000);
    
    const allTransactions = await transactionsPage.getAllTransactions();
    expect(allTransactions.length).toBe(100);
  });
});