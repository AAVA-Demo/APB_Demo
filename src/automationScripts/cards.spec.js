const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Credit Card Management Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
  });

  test('TC-6853: Verify user can view all registered credit cards with complete details', async ({ page }) => {
    const cardsPage = new CardManagementPage(page);
    
    // Step 1 & 2: Navigate to My Cards section
    await cardsPage.navigate();
    
    // Step 3: Verify all registered cards are displayed
    await cardsPage.waitForCardsToLoad();
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
    expect(cardCount).toBeLessThanOrEqual(10);
    
    // Get all card items
    const cards = await cardsPage.getAllCardItems();
    
    for (let i = 0; i < cards.length; i++) {
      // Step 4: Verify card type
      const cardType = await cardsPage.getCardType(i);
      expect(cardType).toMatch(/Visa|MasterCard|Amex|Discover/);
      
      // Step 5: Verify masked card number
      const cardNumber = await cardsPage.getCardNumber(i);
      expect(cardNumber).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
      
      // Step 6: Verify credit limit
      const creditLimit = await cardsPage.getCreditLimit(i);
      expect(creditLimit).toMatch(/₹[0-9,]+\.[0-9]{2}/);
      
      // Step 7: Verify available credit
      const availableCredit = await cardsPage.getAvailableCredit(i);
      expect(availableCredit).toMatch(/₹[0-9,]+\.[0-9]{2}/);
      
      // Step 8: Verify outstanding amount
      const outstanding = await cardsPage.getOutstandingAmount(i);
      expect(outstanding).toMatch(/₹[0-9,]+\.[0-9]{2}/);
      
      // Step 9: Verify status
      const status = await cardsPage.getCardStatus(i);
      expect(status).toMatch(/Active|Blocked/);
    }
  });

  test('TC-6854: Verify user can filter credit card list by status', async ({ page }) => {
    const cardsPage = new CardManagementPage(page);
    
    // Step 1: Navigate to My Cards
    await cardsPage.navigate();
    await cardsPage.waitForCardsToLoad();
    
    // Step 2: Verify filter options are available
    await expect(cardsPage.allFilterButton).toBeVisible();
    await expect(cardsPage.activeFilterButton).toBeVisible();
    await expect(cardsPage.blockedFilterButton).toBeVisible();
    
    const initialCount = await cardsPage.getCardCount();
    
    // Step 3 & 4: Click Active filter and verify
    await cardsPage.filterByStatus('Active');
    await page.waitForTimeout(500); // Wait for filter to apply
    
    const activeCards = await cardsPage.getAllCardItems();
    for (let i = 0; i < activeCards.length; i++) {
      const status = await cardsPage.getCardStatus(i);
      expect(status).toBe('Active');
    }
    
    // Step 5: Click Blocked filter
    await cardsPage.filterByStatus('Blocked');
    await page.waitForTimeout(500);
    
    const blockedCount = await cardsPage.getCardCount();
    // May be 0 if no blocked cards
    if (blockedCount > 0) {
      const blockedCards = await cardsPage.getAllCardItems();
      for (let i = 0; i < blockedCards.length; i++) {
        const status = await cardsPage.getCardStatus(i);
        expect(status).toBe('Blocked');
      }
    }
    
    // Step 6: Click All filter
    await cardsPage.filterByStatus('All');
    await page.waitForTimeout(500);
    
    const finalCount = await cardsPage.getCardCount();
    expect(finalCount).toBe(initialCount);
  });

  test('TC-6855: Verify appropriate message when user has no registered credit cards', async ({ page }) => {
    // This test requires a user with no cards - would need separate test data
    // For demonstration, we'll use route interception to simulate empty response
    
    await page.route('**/api/creditcards/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      });
    });
    
    const cardsPage = new CardManagementPage(page);
    
    // Step 1 & 2: Navigate to My Cards
    await cardsPage.navigate();
    
    // Step 3: Verify no cards message
    await expect(cardsPage.noCardsMessage).toBeVisible();
    const messageText = await cardsPage.getNoCardsMessageText();
    expect(messageText).toContain('No credit cards are currently registered');
    
    // Step 4: Verify card list is empty
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(0);
  });

  test('TC-6844: Verify user can select card and view detailed spend analysis', async ({ page }) => {
    const cardsPage = new CardManagementPage(page);
    
    // Step 1: Navigate to My Cards
    await cardsPage.navigate();
    await cardsPage.waitForCardsToLoad();
    
    // Step 2: Click on first card
    await cardsPage.selectCard(0);
    
    // Wait for card details to load
    await cardsPage.waitForCardDetailsToLoad();
    
    // Step 3: Verify total spend amount
    await expect(cardsPage.totalSpendLabel).toBeVisible();
    const totalSpend = await cardsPage.getTotalSpendValue();
    expect(totalSpend).toMatch(/₹[0-9,]+\.[0-9]{2}/);
    
    // Step 4: Verify transaction count
    await expect(cardsPage.totalTransactionsLabel).toBeVisible();
    const txnCount = await cardsPage.getTotalTransactionsValue();
    expect(parseInt(txnCount)).toBeGreaterThanOrEqual(0);
    
    // Step 5: Verify average transaction value
    const avgTxn = await cardsPage.getAverageTransactionValue();
    expect(avgTxn).toMatch(/₹[0-9,]+\.[0-9]{2}/);
    
    // Step 6: Verify category-wise breakdown
    await expect(cardsPage.transactionTable).toBeVisible();
    const categories = await cardsPage.getTransactionCategories();
    expect(categories.length).toBeGreaterThan(0);
  });

  test('TC-6845: Verify utilization metrics are calculated correctly for selected card', async ({ page }) => {
    const cardsPage = new CardManagementPage(page);
    
    // Step 1 & 2: Navigate and select card
    await cardsPage.navigate();
    await cardsPage.waitForCardsToLoad();
    await cardsPage.selectCard(0);
    await cardsPage.waitForCardDetailsToLoad();
    
    // Step 3: Verify credit limit
    const creditLimit = await cardsPage.getCreditLimitFromDetails();
    expect(creditLimit).toMatch(/₹[0-9,]+\.[0-9]{2}/);
    
    // Step 4: Verify outstanding balance
    const outstanding = await cardsPage.getOutstandingFromDetails();
    expect(outstanding).toMatch(/₹[0-9,]+\.[0-9]{2}/);
    
    // Step 5: Verify available credit
    const available = await cardsPage.getAvailableCreditFromDetails();
    expect(available).toMatch(/₹[0-9,]+\.[0-9]{2}/);
    
    // Step 6: Verify utilization percentage
    const utilization = await cardsPage.getUtilizationRate();
    expect(utilization).toMatch(/[0-9]+\.[0-9]{2}%/);
    
    // Validate calculation: utilization = (outstanding / creditLimit) * 100
    const creditLimitNum = parseFloat(creditLimit.replace(/[₹,]/g, ''));
    const outstandingNum = parseFloat(outstanding.replace(/[₹,]/g, ''));
    const utilizationNum = parseFloat(utilization.replace('%', ''));
    
    const expectedUtilization = (outstandingNum / creditLimitNum) * 100;
    expect(Math.abs(utilizationNum - expectedUtilization)).toBeLessThan(0.1);
  });

  test('TC-6846: Verify message when card has no transaction history', async ({ page }) => {
    // Simulate card with no transactions via route interception
    await page.route('**/api/transactions/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      });
    });
    
    const cardsPage = new CardManagementPage(page);
    
    // Step 1 & 2: Navigate and select card
    await cardsPage.navigate();
    await cardsPage.waitForCardsToLoad();
    await cardsPage.selectCard(0);
    
    // Step 3: Verify no spending data message
    await expect(cardsPage.noTransactionsMessage).toBeVisible();
    const messageText = await cardsPage.getNoTransactionsMessageText();
    expect(messageText).toContain('No spending data available for this card');
    
    // Step 4: Verify zero values
    const totalSpend = await cardsPage.getTotalSpendValue();
    expect(totalSpend).toContain('₹0.00');
    
    const txnCount = await cardsPage.getTotalTransactionsValue();
    expect(txnCount).toBe('0');
  });

});
