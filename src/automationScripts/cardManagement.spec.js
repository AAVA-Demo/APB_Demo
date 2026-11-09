const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const logger = require('../utils/logger');

test.describe('Card Management - Multiple Credit Card Display', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    logger.info('Navigating to Card Management section');
    await cardManagementPage.navigate();
  });

  // Test Case ID: 5907 - QE-8954 TS-001 TC-001
  test('TC-5907: Verify user with multiple credit cards can view consolidated list with summary information', async ({ page }) => {
    logger.info('Test Case 5907: Testing multiple card display');
    
    await cardManagementPage.login('testuser_5cards', 'Pass@123');
    await cardManagementPage.navigateToMyCards();
    
    await expect(cardManagementPage.cardList).toBeVisible();
    
    const cardCount = await cardManagementPage.getCardCount();
    logger.info(`Number of cards displayed: ${cardCount}`);
    expect(cardCount).toBe(5);
    
    const cards = await cardManagementPage.getAllCardDetails();
    
    for (const card of cards) {
      expect(card.name).toBeTruthy();
      expect(card.type).toBeTruthy();
      expect(card.availableCredit).toMatch(/\$/);
      expect(card.outstandingBalance).toMatch(/\$/);
      expect(card.creditLimit).toMatch(/\$/);
      
      logger.info(`Card: ${card.name}, Type: ${card.type}, Available: ${card.availableCredit}, Outstanding: ${card.outstandingBalance}, Limit: ${card.creditLimit}`);
    }
  });

  // Test Case ID: 5909 - QE-8954 TS-001 TC-002
  test('TC-5909: Verify card management dashboard provides unified interface without requiring access to multiple platforms', async ({ page }) => {
    logger.info('Test Case 5909: Testing unified interface');
    
    await cardManagementPage.login('testuser_multibank', 'Pass@123');
    await cardManagementPage.navigateToMyCards();
    
    await expect(cardManagementPage.cardList).toBeVisible();
    
    const cards = await cardManagementPage.getAllCardDetails();
    logger.info(`Total cards from different banks: ${cards.length}`);
    expect(cards.length).toBeGreaterThan(0);
    
    // Verify all cards are accessible within the application
    for (const card of cards) {
      await cardManagementPage.selectCard(card.name);
      await expect(cardManagementPage.cardDetailView).toBeVisible();
      await cardManagementPage.navigateBack();
    }
    
    // Verify no external links
    const externalLinks = await page.locator('a[target="_blank"]').count();
    logger.info(`External links found: ${externalLinks}`);
    expect(externalLinks).toBe(0);
  });

  // Test Case ID: 5911 - QE-8954 TS-002 TC-001
  test('TC-5911: Verify user with no registered credit cards receives appropriate message with guidance', async ({ page }) => {
    logger.info('Test Case 5911: Testing no cards scenario');
    
    await cardManagementPage.login('testuser_nocards', 'Pass@123');
    await cardManagementPage.navigateToMyCards();
    
    await expect(cardManagementPage.noCardsMessage).toBeVisible();
    
    const messageText = await cardManagementPage.noCardsMessage.textContent();
    logger.info(`Message displayed: ${messageText}`);
    expect(messageText).toContain('No credit cards available');
    
    await expect(cardManagementPage.addCardButton).toBeVisible();
    const buttonText = await cardManagementPage.addCardButton.textContent();
    logger.info(`Call-to-action button: ${buttonText}`);
    expect(buttonText).toMatch(/Add Credit Card|Register Your First Card/);
    
    // Verify no crash
    await expect(cardManagementPage.navigationMenu).toBeVisible();
  });

  // Test Case ID: 5913 - QE-8954 TS-003 TC-001
  test('TC-5913: Verify system successfully loads and displays 10+ credit cards within 1 second', async ({ page }) => {
    logger.info('Test Case 5913: Testing performance with 10+ cards');
    
    await cardManagementPage.login('testuser_12cards', 'Pass@123');
    
    const startTime = Date.now();
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForCardListLoad();
    const loadTime = Date.now() - startTime;
    
    logger.info(`Card list loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);
    
    const cardCount = await cardManagementPage.getCardCount();
    logger.info(`Number of cards displayed: ${cardCount}`);
    expect(cardCount).toBe(12);
    
    const cards = await cardManagementPage.getAllCardDetails();
    for (const card of cards) {
      expect(card.name).toBeTruthy();
      expect(card.type).toBeTruthy();
      expect(card.availableCredit).toBeTruthy();
      expect(card.outstandingBalance).toBeTruthy();
      expect(card.creditLimit).toBeTruthy();
    }
    
    // Verify interface responsiveness
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(100);
    await expect(cardManagementPage.cardList).toBeVisible();
  });
});

test.describe('Card Management - Card-Wise Spend Analysis', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    await cardManagementPage.navigate();
  });

  // Test Case ID: 5899 - QE-8955 TS-001 TC-001
  test('TC-5899: Verify user can select a specific credit card and view complete card-specific transaction history', async ({ page }) => {
    logger.info('Test Case 5899: Testing card-specific transaction history');
    
    await cardManagementPage.login('testuser_multicards', 'Pass@123');
    await cardManagementPage.navigateToMyCards();
    
    await cardManagementPage.selectCardByNumber('1234');
    
    await expect(cardManagementPage.cardDetailView).toBeVisible();
    await expect(cardManagementPage.transactionHistory).toBeVisible();
    
    const transactions = await cardManagementPage.getTransactions();
    logger.info(`Number of transactions: ${transactions.length}`);
    
    for (const transaction of transactions) {
      expect(transaction.date).toBeTruthy();
      expect(transaction.merchant).toBeTruthy();
      expect(transaction.amount).toMatch(/\$/);
      expect(transaction.description).toBeTruthy();
    }
    
    await expect(cardManagementPage.spendingBreakdown).toBeVisible();
    const breakdown = await cardManagementPage.getSpendingBreakdown();
    logger.info(`Spending breakdown: ${JSON.stringify(breakdown)}`);
    
    await expect(cardManagementPage.totalSpend).toBeVisible();
    await expect(cardManagementPage.utilizationMetrics).toBeVisible();
    
    const utilization = await cardManagementPage.getUtilizationMetrics();
    logger.info(`Utilization metrics: ${JSON.stringify(utilization)}`);
    expect(utilization.creditLimit).toBeTruthy();
    expect(utilization.availableCredit).toBeTruthy();
    expect(utilization.currentBalance).toBeTruthy();
    expect(utilization.utilizationPercentage).toMatch(/\d+/);
  });

  // Test Case ID: 5901 - QE-8955 TS-001 TC-002
  test('TC-5901: Verify card-wise spend analysis loads within 1 second performance requirement', async ({ page }) => {
    logger.info('Test Case 5901: Testing card detail load performance');
    
    await cardManagementPage.login('testuser_multicards', 'Pass@123');
    await cardManagementPage.navigateToMyCards();
    
    const startTime = Date.now();
    await cardManagementPage.selectCardByNumber('1234');
    await cardManagementPage.waitForCardDetailLoad();
    const loadTime = Date.now() - startTime;
    
    logger.info(`Card detail loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);
    
    await expect(cardManagementPage.transactionHistory).toBeVisible();
    await expect(cardManagementPage.spendingBreakdown).toBeVisible();
    await expect(cardManagementPage.utilizationMetrics).toBeVisible();
  });

  // Test Case ID: 5903 - QE-8955 TS-002 TC-001
  test('TC-5903: Verify error message is displayed when attempting to view analysis for a deactivated card', async ({ page }) => {
    logger.info('Test Case 5903: Testing deactivated card error handling');
    
    await cardManagementPage.login('testuser', 'Pass@123');
    await cardManagementPage.navigateToMyCards();
    
    // Simulate accessing deactivated card
    await page.goto(`${cardManagementPage.baseURL}/cards/deactivated-card-5678`);
    
    await expect(cardManagementPage.errorMessage).toBeVisible();
    
    const errorText = await cardManagementPage.errorMessage.textContent();
    logger.info(`Error message: ${errorText}`);
    expect(errorText).toContain('no longer available');
    
    // Verify no crash or incorrect data
    await expect(cardManagementPage.navigationMenu).toBeVisible();
    
    // Verify navigation back is possible
    await cardManagementPage.navigateBack();
    await expect(cardManagementPage.cardList).toBeVisible();
  });

  // Test Case ID: 5905 - QE-8955 TS-003 TC-001
  test('TC-5905: Verify user can filter card-specific transactions by date range and category with accurate results', async ({ page }) => {
    logger.info('Test Case 5905: Testing transaction filtering');
    
    await cardManagementPage.login('testuser_multicards', 'Pass@123');
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.selectCardByNumber('1234');
    
    await expect(cardManagementPage.filterControls).toBeVisible();
    
    await cardManagementPage.setDateRangeFilter('2024-01-01', '2024-01-31');
    await cardManagementPage.setCategoryFilter('Food & Dining');
    await cardManagementPage.applyFilters();
    
    const filteredTransactions = await cardManagementPage.getTransactions();
    logger.info(`Filtered transactions count: ${filteredTransactions.length}`);
    
    for (const transaction of filteredTransactions) {
      const date = new Date(transaction.date);
      expect(date).toBeGreaterThanOrEqual(new Date('2024-01-01'));
      expect(date).toBeLessThanOrEqual(new Date('2024-01-31'));
      expect(transaction.category).toBe('Food & Dining');
    }
    
    const filteredTotal = await cardManagementPage.getFilteredTotal();
    logger.info(`Filtered total: ${filteredTotal}`);
    expect(filteredTotal).toMatch(/\$/);
    
    await cardManagementPage.clearFilters();
    
    const allTransactions = await cardManagementPage.getTransactions();
    logger.info(`All transactions count after clearing filters: ${allTransactions.length}`);
    expect(allTransactions.length).toBeGreaterThan(filteredTransactions.length);
  });
});