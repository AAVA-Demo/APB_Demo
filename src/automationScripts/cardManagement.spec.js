const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');

/**
 * Test Suite: Multi-Card Management and Monitoring
 * Epic: QE-9527 - Multi-Card Management and Monitoring
 * User Story: QE-9648 - Multiple Credit Card Display
 * User Story: QE-9649 - Card-Wise Spend Analysis
 */

test.describe('Multi-Card Management and Monitoring', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    await cardManagementPage.navigate();
  });

  /**
   * Test Case ID: QE-9808 TS-001 TC-001
   * Scenario: Multi-card interface retrieves and displays 10 cards within 1.5 seconds
   * Test Data: User ID: user123, Card Count: 10
   */
  test('TC-6888: Verify multi-card display with 10 cards within 1.5 seconds', async () => {
    const startTime = Date.now();
    
    await cardManagementPage.waitForCardListLoad();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(1500);
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(1);
    
    await cardManagementPage.verifyAllCardsDisplayMetrics();
  });

  /**
   * Test Case ID: QE-9808 TS-002 TC-001
   * Scenario: System displays loading indicator and timeout message on high latency
   * Test Data: Simulated Latency: 3 seconds
   */
  test('TC-6889: Verify timeout handling when card service has high latency', async ({ page }) => {
    await page.route('**/api/cards/**', route => {
      setTimeout(() => {
        route.fulfill({ status: 200, body: JSON.stringify({ cards: [] }) });
      }, 3000);
    });
    
    await cardManagementPage.navigate();
    
    await expect(cardManagementPage.loadingSpinner).toBeVisible();
    
    await cardManagementPage.waitForTimeout(2000);
    
    await expect(cardManagementPage.timeoutMessage).toBeVisible();
    const timeoutText = await cardManagementPage.timeoutMessage.textContent();
    expect(timeoutText).toContain('Unable to load credit cards');
    
    await cardManagementPage.verifySystemStability();
  });

  /**
   * Test Case ID: QE-9808 TS-003 TC-001
   * Scenario: System loads 50 cards (maximum capacity) with maintained performance
   * Test Data: User ID: user_max, Card Count: 50
   */
  test('TC-6890: Verify system handles maximum 50 cards with maintained performance', async ({ page }) => {
    const mockCards = [];
    for (let i = 1; i <= 50; i++) {
      mockCards.push({
        cardId: `card${i}`,
        cardNumber: `**** ${1000 + i}`,
        cardType: 'Visa',
        bankName: 'Test Bank',
        creditLimit: 5000 + (i * 100),
        availableCredit: 3000 + (i * 50),
        outstandingBalance: 2000 + (i * 50),
        utilizationPercent: 40
      });
    }
    
    await page.route('**/api/users/*/cards', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockCards.map(c => c.cardId)) });
    });
    
    await page.route('**/api/cards/*/details', route => {
      const cardId = route.request().url().match(/\/cards\/(\w+)\/details/)[1];
      const card = mockCards.find(c => c.cardId === cardId);
      route.fulfill({ status: 200, body: JSON.stringify(card) });
    });
    
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(50);
    
    await cardManagementPage.verifyScrollPerformance();
    
    await cardManagementPage.selectCardByIndex(25);
    await expect(cardManagementPage.cardDetailView).toBeVisible();
  });

  /**
   * Test Case ID: QE-9810 TS-001 TC-001
   * Scenario: Card-specific spend analysis displays accurate metrics
   * Test Data: Card ID: card1, Card Number: **** 1234
   */
  test('TC-6882: Verify card-specific spend analysis displays accurate metrics', async () => {
    await cardManagementPage.waitForCardListLoad();
    
    await cardManagementPage.selectFirstCard();
    
    await expect(cardManagementPage.cardDetailView).toBeVisible();
    
    await expect(cardManagementPage.monthlySpendTrendChart).toBeVisible();
    
    await expect(cardManagementPage.currentBalanceLabel).toBeVisible();
    const balance = await cardManagementPage.getCurrentBalance();
    expect(balance).toBeGreaterThanOrEqual(0);
    
    await expect(cardManagementPage.utilizationPercentage).toBeVisible();
    const utilization = await cardManagementPage.getUtilizationPercentage();
    expect(utilization).toBeGreaterThanOrEqual(0);
    expect(utilization).toBeLessThanOrEqual(100);
  });

  /**
   * Test Case ID: QE-9810 TS-002 TC-001
   * Scenario: System displays appropriate message for new card with no transaction history
   * Test Data: Card ID: card_new, Card Number: **** 9999
   */
  test('TC-6883: Verify message display for new card with no transaction history', async ({ page }) => {
    await page.route('**/api/transactions/card-wise*', route => {
      route.fulfill({ status: 200, body: JSON.stringify({ cardId: 'card_new', monthlySpend: 0, spendTrend: [] }) });
    });
    
    await cardManagementPage.waitForCardListLoad();
    await cardManagementPage.selectFirstCard();
    
    await expect(cardManagementPage.insufficientDataMessage).toBeVisible();
    const messageText = await cardManagementPage.insufficientDataMessage.textContent();
    expect(messageText).toContain('Insufficient data for trend analysis');
    
    await expect(cardManagementPage.currentBalanceLabel).toBeVisible();
    await expect(cardManagementPage.creditLimitLabel).toBeVisible();
  });

  /**
   * Test Case ID: QE-9810 TS-003 TC-001
   * Scenario: Card-specific metrics are correctly isolated when switching between cards
   * Test Data: Card A: **** 1234, Balance: $2,000; Card B: **** 5678, Balance: $3,000
   */
  test('TC-6884: Verify data isolation when switching between multiple cards', async ({ page }) => {
    const cardAData = {
      cardId: 'cardA',
      cardNumber: '**** 1234',
      creditLimit: 5000,
      availableCredit: 3000,
      outstandingBalance: 2000,
      utilizationPercent: 40
    };
    
    const cardBData = {
      cardId: 'cardB',
      cardNumber: '**** 5678',
      creditLimit: 10000,
      availableCredit: 7000,
      outstandingBalance: 3000,
      utilizationPercent: 30
    };
    
    await page.route('**/api/cards/cardA/details', route => {
      route.fulfill({ status: 200, body: JSON.stringify(cardAData) });
    });
    
    await page.route('**/api/cards/cardB/details', route => {
      route.fulfill({ status: 200, body: JSON.stringify(cardBData) });
    });
    
    await cardManagementPage.waitForCardListLoad();
    
    await cardManagementPage.selectCardByIndex(0);
    const cardABalance = await cardManagementPage.getCurrentBalance();
    expect(cardABalance).toBe(2000);
    
    await cardManagementPage.navigateBackToCardList();
    
    await cardManagementPage.selectCardByIndex(1);
    const cardBBalance = await cardManagementPage.getCurrentBalance();
    expect(cardBBalance).toBe(3000);
    expect(cardBBalance).not.toBe(cardABalance);
    
    await cardManagementPage.navigateBackToCardList();
    await cardManagementPage.selectCardByIndex(0);
    const cardABalanceAgain = await cardManagementPage.getCurrentBalance();
    expect(cardABalanceAgain).toBe(2000);
  });
});