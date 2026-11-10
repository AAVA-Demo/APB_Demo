const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { Logger } = require('../utils/logger');

test.describe('Credit Card Management - Portfolio and Card Details', () => {
  let cardManagementPage;
  let logger;

  test.beforeEach(async ({ page }) => {
    logger = new Logger('CardManagementSpec');
    cardManagementPage = new CardManagementPage(page);
    logger.info('Navigating to card management dashboard');
    await cardManagementPage.navigate();
  });

  test('QE-10029 TS-001 TC-001 - Verify multiple credit cards are displayed with names, last 4 digits, and current balances', async ({ page }) => {
    logger.info('Test Case: QE-10029 TS-001 TC-001 - Multiple cards display validation');
    
    // Step 1-2: Login and navigate completed in beforeEach
    logger.info('Step 1-2: Navigation to card management dashboard completed');
    
    // Step 3: Verify all 5 credit cards are displayed
    logger.info('Step 3: Verifying 5 credit cards are displayed');
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    logger.info(`Card count verified: ${cardCount}`);
    
    // Step 4: Verify each card displays name, last 4 digits, and balance
    logger.info('Step 4: Verifying card details display');
    const cards = await cardManagementPage.getAllCardDetails();
    
    expect(cards.length).toBe(5);
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      logger.info(`Card ${i + 1}: ${card.name} ${card.lastFourDigits} ${card.balance}`);
      
      expect(card.name).toBeTruthy();
      expect(card.lastFourDigits).toMatch(/\*\*\*\*\d{4}/);
      expect(card.balance).toMatch(/\$[\d,]+/);
    }
    
    logger.info('Test completed successfully');
  });

  test('QE-10029 TS-002 TC-001 - Verify system displays first 10 cards with warning when user has 11 cards (exceeding limit)', async ({ page }) => {
    logger.info('Test Case: QE-10029 TS-002 TC-001 - Card limit exceeded validation');
    
    // Step 1: Login with user having 11 cards
    logger.info('Step 1: Logging in with user having 11 active cards');
    await cardManagementPage.loginWithCredentials('poweruser@example.com', 'SecurePass123');
    
    // Step 2: Navigate to card management dashboard
    logger.info('Step 2: Navigating to card management dashboard');
    await cardManagementPage.navigate();
    
    // Step 3: Verify only 10 cards are displayed
    logger.info('Step 3: Verifying only 10 cards are displayed');
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(10);
    logger.info(`Card count verified: ${cardCount}`);
    
    // Step 4: Verify warning message
    logger.info('Step 4: Verifying card limit warning message');
    await expect(cardManagementPage.cardLimitWarning).toBeVisible();
    const warningText = await cardManagementPage.cardLimitWarning.textContent();
    expect(warningText).toContain('11 credit cards');
    expect(warningText).toContain('only 10 can be displayed');
    logger.info(`Warning message displayed: ${warningText}`);
    
    logger.info('Test completed successfully');
  });

  test('QE-10029 TS-003 TC-001 - Verify error message is displayed when card data service is unavailable', async ({ page }) => {
    logger.info('Test Case: QE-10029 TS-003 TC-001 - Service unavailability handling');
    
    // Step 1: Login completed in beforeEach
    logger.info('Step 1: User authentication completed');
    
    // Step 2: Simulate card data service unavailability
    logger.info('Step 2: Simulating card data service unavailability');
    await page.route('**/api/cards', route => route.abort());
    await page.route('**/api/cards/**', route => route.abort());
    
    // Step 3: Navigate to card management dashboard
    logger.info('Step 3: Navigating to card management dashboard');
    await page.reload();
    await cardManagementPage.waitForPageLoad();
    
    // Step 4: Verify error message
    logger.info('Step 4: Verifying error message display');
    await expect(cardManagementPage.errorMessage).toBeVisible();
    const errorText = await cardManagementPage.errorMessage.textContent();
    expect(errorText).toContain('Unable to load credit card data');
    logger.info(`Error message displayed: ${errorText}`);
    
    // Step 5: Verify no partial or stale data is displayed
    logger.info('Step 5: Verifying no card tiles are displayed');
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(0);
    logger.info('Verified: No card tiles displayed');
    
    logger.info('Test completed successfully');
  });

  test('QE-10028 TS-001 TC-001 - Verify card details page displays total spend, available credit, and transaction history', async ({ page }) => {
    logger.info('Test Case: QE-10028 TS-001 TC-001 - Card details display validation');
    
    // Step 1-2: Login and navigate completed in beforeEach
    logger.info('Step 1-2: Navigation to card management dashboard completed');
    
    // Step 3: Select specific credit card
    logger.info('Step 3: Selecting Visa Platinum ****1234');
    await cardManagementPage.selectCardByLastFourDigits('1234');
    await cardManagementPage.waitForCardDetailsLoad();
    
    // Step 4: Verify total spend is displayed
    logger.info('Step 4: Verifying total spend display');
    await expect(cardManagementPage.totalSpendLabel).toBeVisible();
    const totalSpend = await cardManagementPage.getTotalSpend();
    expect(totalSpend).toBeTruthy();
    expect(totalSpend).toMatch(/\$[\d,]+/);
    logger.info(`Total Spend: ${totalSpend}`);
    
    // Step 5: Verify available credit is displayed
    logger.info('Step 5: Verifying available credit display');
    await expect(cardManagementPage.availableCreditLabel).toBeVisible();
    const availableCredit = await cardManagementPage.getAvailableCredit();
    expect(availableCredit).toBeTruthy();
    expect(availableCredit).toMatch(/\$[\d,]+/);
    logger.info(`Available Credit: ${availableCredit}`);
    
    // Step 6: Verify transaction history is displayed
    logger.info('Step 6: Verifying transaction history display');
    await expect(cardManagementPage.transactionHistorySection).toBeVisible();
    const transactions = await cardManagementPage.getTransactionHistory();
    expect(transactions.length).toBeGreaterThan(0);
    
    for (const txn of transactions) {
      expect(txn.date).toBeTruthy();
      expect(txn.merchant).toBeTruthy();
      expect(txn.category).toBeTruthy();
      expect(txn.amount).toMatch(/\$[\d,]+/);
      logger.info(`Transaction: ${txn.date} ${txn.merchant} ${txn.category} ${txn.amount}`);
    }
    
    logger.info('Test completed successfully');
  });

  test('QE-10028 TS-002 TC-001 - Verify closed/deactivated card displays appropriate message and prevents transaction history access', async ({ page }) => {
    logger.info('Test Case: QE-10028 TS-002 TC-001 - Closed card handling validation');
    
    // Step 1-2: Login and navigate completed in beforeEach
    logger.info('Step 1-2: Navigation to card management dashboard completed');
    
    // Step 3: Select closed/deactivated card
    logger.info('Step 3: Selecting closed Mastercard Gold ****5678');
    await cardManagementPage.selectCardByLastFourDigits('5678');
    await cardManagementPage.waitForCardDetailsLoad();
    
    // Step 4: Verify inactive card message
    logger.info('Step 4: Verifying inactive card message');
    await expect(cardManagementPage.inactiveCardMessage).toBeVisible();
    const messageText = await cardManagementPage.inactiveCardMessage.textContent();
    expect(messageText).toContain('no longer active');
    expect(messageText).toContain('closed');
    logger.info(`Inactive card message: ${messageText}`);
    
    // Step 5: Verify transaction history access is prevented
    logger.info('Step 5: Verifying transaction history is not accessible');
    const isTransactionHistoryVisible = await cardManagementPage.transactionHistorySection.isVisible().catch(() => false);
    
    if (isTransactionHistoryVisible) {
      const historyMessage = await cardManagementPage.transactionHistorySection.textContent();
      expect(historyMessage).toContain('not available for inactive cards');
      logger.info(`Transaction history message: ${historyMessage}`);
    } else {
      logger.info('Transaction history section not displayed (as expected)');
    }
    
    logger.info('Test completed successfully');
  });

  test('QE-10028 TS-003 TC-001 - Verify card summary is displayed but transaction history shows error when service is unavailable', async ({ page }) => {
    logger.info('Test Case: QE-10028 TS-003 TC-001 - Transaction service unavailability handling');
    
    // Step 1: Login completed in beforeEach
    logger.info('Step 1: User authentication completed');
    
    // Step 2: Simulate transaction history service unavailability
    logger.info('Step 2: Simulating transaction history service unavailability');
    await page.route('**/api/cards/*/transactions', route => route.abort());
    await page.route('**/api/transactions/**', route => route.abort());
    
    // Step 3-4: Navigate and select card
    logger.info('Step 3-4: Navigating to card details');
    await cardManagementPage.selectCardByLastFourDigits('9012');
    await cardManagementPage.waitForCardDetailsLoad();
    
    // Step 5: Verify card summary is displayed
    logger.info('Step 5: Verifying card summary display');
    await expect(cardManagementPage.totalSpendLabel).toBeVisible();
    await expect(cardManagementPage.availableCreditLabel).toBeVisible();
    
    const totalSpend = await cardManagementPage.getTotalSpend();
    const availableCredit = await cardManagementPage.getAvailableCredit();
    
    expect(totalSpend).toBeTruthy();
    expect(availableCredit).toBeTruthy();
    logger.info(`Card summary displayed - Total Spend: ${totalSpend}, Available Credit: ${availableCredit}`);
    
    // Step 6: Verify transaction history error message
    logger.info('Step 6: Verifying transaction history error message');
    await expect(cardManagementPage.transactionErrorMessage).toBeVisible();
    const errorText = await cardManagementPage.transactionErrorMessage.textContent();
    expect(errorText).toContain('Unable to load transaction history');
    logger.info(`Transaction error message: ${errorText}`);
    
    logger.info('Test completed successfully');
  });
});