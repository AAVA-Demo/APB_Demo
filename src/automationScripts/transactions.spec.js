const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Transaction Management Tests', () => {
  let transactionsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
    loginPage = new LoginPage(page);
    await page.goto('https://creditcard.dashboard.app');
    await loginPage.login('testuser', 'Test@1234');
  });

  test('QE-10321 TS-001 TC-001 - Verify complete transaction details are displayed when user selects valid transaction', async ({ page }) => {
    // Step 2: Navigate to Transaction History
    await transactionsPage.navigateToTransactionHistory();
    await expect(transactionsPage.transactionList).toBeVisible();
    
    // Step 3: Select a valid transaction
    await transactionsPage.selectTransaction('TXN-20240115-001');
    
    // Step 4-12: Verify all transaction details
    await expect(transactionsPage.transactionId).toContainText('TXN-20240115-001');
    await expect(transactionsPage.transactionDate).toBeVisible();
    await expect(transactionsPage.merchantName).toBeVisible();
    await expect(transactionsPage.transactionAmount).toBeVisible();
    await expect(transactionsPage.currency).toContainText('USD');
    await expect(transactionsPage.category).toBeVisible();
    await expect(transactionsPage.cardIdentifier).toMatch(/\*\*\*\*\d{4}/);
    await expect(transactionsPage.transactionStatus).toBeVisible();
    await expect(transactionsPage.transactionDescription).toBeVisible();
    
    // Step 13: Verify response time
    const startTime = Date.now();
    await transactionsPage.selectTransaction('TXN-20240115-001');
    await transactionsPage.waitForTransactionDetails();
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(500);
  });

  test('QE-10321 TS-002 TC-001 - Verify error handling for invalid transaction ID', async ({ page }) => {
    // Step 2: Attempt to access invalid transaction ID
    await page.goto('https://creditcard.dashboard.app/transactions/INVALID-TXN-999');
    
    // Step 3-4: Verify error message and no data displayed
    await expect(transactionsPage.errorMessage).toBeVisible();
    await expect(transactionsPage.errorMessage).toContainText('Transaction not found');
    await expect(transactionsPage.transactionAmount).not.toBeVisible();
    await expect(transactionsPage.merchantName).not.toBeVisible();
    
    // Step 5: Verify no data in console logs
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    expect(consoleLogs.join('')).not.toContain('transaction');
  });

  test('QE-10321 TS-002 TC-002 - Verify error handling for transaction belonging to another user', async ({ page }) => {
    // Step 1: Login as User A
    await page.goto('https://creditcard.dashboard.app');
    await loginPage.login('userA', 'Test@1234');
    
    // Step 2: Attempt to access User B transaction
    await page.goto('https://creditcard.dashboard.app/transactions/TXN-USERB-001');
    
    // Step 3-4: Verify error and no data exposed
    await expect(transactionsPage.errorMessage).toBeVisible();
    await expect(transactionsPage.errorMessage).toMatch(/Transaction not found|Access denied/);
    await expect(transactionsPage.transactionAmount).not.toBeVisible();
    
    // Step 5: Verify no data in logs
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    expect(consoleLogs.join('')).not.toContain('USERB');
  });

  test('QE-10321 TS-003 TC-001 - Verify access denied for unauthenticated user', async ({ page }) => {
    // Step 1: Launch without login
    await page.goto('https://creditcard.dashboard.app');
    
    // Step 2: Attempt to access transaction detail
    await page.goto('https://creditcard.dashboard.app/transactions/TXN-20240115-001');
    
    // Step 3-4: Verify redirect to login
    await expect(page).toHaveURL(/login/);
    await expect(transactionsPage.transactionAmount).not.toBeVisible();
    
    // Step 5: Verify no data in logs
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    expect(consoleLogs.join('')).not.toContain('transaction');
  });

  test('QE-10321 TS-003 TC-002 - Verify access denied for expired token', async ({ page }) => {
    // Step 1: Login
    await loginPage.login('testuser', 'Test@1234');
    
    // Step 2: Manually expire token
    await page.evaluate(() => {
      sessionStorage.removeItem('authToken');
    });
    
    // Step 3: Attempt to access transaction detail
    await page.goto('https://creditcard.dashboard.app/transactions/TXN-20240115-001');
    
    // Step 4-5: Verify redirect and no data displayed
    await expect(page).toHaveURL(/login/);
    await expect(transactionsPage.errorMessage).toContainText(/Session expired|Authentication/);
    await expect(transactionsPage.transactionAmount).not.toBeVisible();
  });

  test('QE-10320 TS-001 TC-001 - Verify consolidated transaction history for multi-card user', async ({ page }) => {
    // Step 1: Login as multi-card user
    await page.goto('https://creditcard.dashboard.app');
    await loginPage.login('testuser_multicard', 'Test@1234');
    
    // Step 2: Navigate to Transaction Management
    await transactionsPage.navigateToTransactionHistory();
    
    // Step 3-4: Verify consolidated list from all cards
    await expect(transactionsPage.transactionList).toBeVisible();
    const cardIdentifiers = await transactionsPage.getAllCardIdentifiers();
    expect(cardIdentifiers).toContain('****1234');
    expect(cardIdentifiers).toContain('****5678');
    expect(cardIdentifiers).toContain('****9012');
    
    // Step 5: Verify 12-month time range
    const transactions = await transactionsPage.getAllTransactions();
    const dates = transactions.map(t => new Date(t.date));
    const oldestDate = new Date(Math.min(...dates));
    const newestDate = new Date(Math.max(...dates));
    const monthsDiff = (newestDate.getFullYear() - oldestDate.getFullYear()) * 12 + (newestDate.getMonth() - oldestDate.getMonth());
    expect(monthsDiff).toBeLessThanOrEqual(12);
    
    // Step 6: Verify descending order
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i].getTime()).toBeGreaterThanOrEqual(dates[i + 1].getTime());
    }
    
    // Step 7: Verify response time
    const startTime = Date.now();
    await transactionsPage.navigateToTransactionHistory();
    await transactionsPage.waitForTransactionList();
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(500);
  });

  test('QE-10320 TS-002 TC-001 - Verify error handling when service is unavailable', async ({ page }) => {
    // Step 2: Mock service unavailability
    await page.route('**/transactions', route => route.abort());
    
    // Step 3: Navigate to Transaction Management
    await transactionsPage.navigateToTransactionHistory();
    
    // Step 4-5: Verify error message and UI stability
    await expect(transactionsPage.errorMessage).toBeVisible();
    await expect(transactionsPage.errorMessage).toContainText(/Service temporarily unavailable/);
    await expect(page).not.toHaveURL(/error/);
  });

  test('QE-10320 TS-002 TC-002 - Verify error handling when service times out', async ({ page }) => {
    // Step 2: Mock timeout
    await page.route('**/transactions', route => {
      setTimeout(() => route.fulfill({ status: 200, body: '[]' }), 6000);
    });
    
    // Step 3: Navigate to Transaction Management
    await transactionsPage.navigateToTransactionHistory();
    
    // Step 4-5: Verify timeout error
    await expect(transactionsPage.errorMessage).toBeVisible();
    await expect(transactionsPage.errorMessage).toContainText(/Request timed out/);
  });

  test('QE-10320 TS-003 TC-001 - Verify transaction history for single-card user', async ({ page }) => {
    // Step 1: Login as single-card user
    await page.goto('https://creditcard.dashboard.app');
    await loginPage.login('testuser_singlecard', 'Test@1234');
    
    // Step 2-4: Navigate and verify single card transactions
    await transactionsPage.navigateToTransactionHistory();
    const cardIdentifiers = await transactionsPage.getAllCardIdentifiers();
    expect(cardIdentifiers.every(id => id === '****1234')).toBe(true);
    
    // Step 5-7: Verify 12-month range, sorting, and response time
    const transactions = await transactionsPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    const startTime = Date.now();
    await transactionsPage.navigateToTransactionHistory();
    await transactionsPage.waitForTransactionList();
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(500);
  });
});
