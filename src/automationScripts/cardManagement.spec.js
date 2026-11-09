const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { Logger } = require('../utils/logger');
const testData = require('../data/testData.json');

test.describe('Multi-Card Management and Tracking Tests', () => {
  let cardManagementPage;
  let logger;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    logger = new Logger('CardManagementSpec');
    logger.info('Navigating to card management dashboard');
    await cardManagementPage.navigate();
  });

  test('QE-8895 TS-001 TC-001: Verify logged-in user with 5 active credit cards views all cards with masked numbers', async ({ page }) => {
    logger.info('Test Case: QE-8895 TS-001 TC-001 - Five Cards Display Test');
    
    const user = testData.users.testuser_5cards;
    await cardManagementPage.login(user.username, user.password);
    
    await cardManagementPage.waitForCardDashboardLoad();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    
    const cards = await cardManagementPage.getAllCards();
    
    const expectedMaskedNumbers = ['****1234', '****5678', '****9012', '****3456', '****7890'];
    const expectedLimits = ['$5,000.00', '$10,000.00', '$15,000.00', '$8,000.00', '$12,000.00'];
    const expectedBalances = ['$1,200.00', '$3,500.00', '$7,800.00', '$2,100.00', '$4,900.00'];
    
    for (let i = 0; i < cards.length; i++) {
      expect(cards[i].maskedNumber).toBe(expectedMaskedNumbers[i]);
      expect(cards[i].creditLimit).toBe(expectedLimits[i]);
      expect(cards[i].currentBalance).toBe(expectedBalances[i]);
      
      const maskedPattern = /^\*{4} \*{4} \*{4} \d{4}$|^\*{12}\d{4}$|^\*{4}\d{4}$/;
      expect(cards[i].maskedNumber).toMatch(maskedPattern);
    }
    
    logger.info('All 5 cards validated successfully');
  });

  test('QE-8895 TS-002 TC-001: Verify logged-in user with no linked credit cards receives appropriate message', async ({ page }) => {
    logger.info('Test Case: QE-8895 TS-002 TC-001 - No Cards Test');
    
    const user = testData.users.testuser_nocards;
    await cardManagementPage.login(user.username, user.password);
    
    await cardManagementPage.waitForCardDashboardLoad();
    
    await expect(cardManagementPage.noCardsMessage).toBeVisible();
    
    const messageText = await cardManagementPage.getNoCardsMessage();
    expect(messageText).toContain('No credit cards are linked to your account');
    expect(messageText).toContain('Please add a card to get started');
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(0);
    
    logger.info('No cards scenario validated');
  });

  test('QE-8895 TS-003 TC-001: Verify user with 10 active credit cards views all cards correctly', async ({ page }) => {
    logger.info('Test Case: QE-8895 TS-003 TC-001 - Maximum Cards Test');
    
    const user = testData.users.testuser_10cards;
    await cardManagementPage.login(user.username, user.password);
    
    const startTime = Date.now();
    await cardManagementPage.waitForCardDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    logger.info(`Dashboard load time with 10 cards: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(10);
    
    const cards = await cardManagementPage.getAllCards();
    
    const expectedMaskedNumbers = [
      '****1111', '****2222', '****3333', '****4444', '****5555',
      '****6666', '****7777', '****8888', '****9999', '****0000'
    ];
    
    for (let i = 0; i < cards.length; i++) {
      expect(cards[i].maskedNumber).toBe(expectedMaskedNumbers[i]);
      expect(cards[i].creditLimit).toBeTruthy();
      expect(cards[i].currentBalance).toBeTruthy();
    }
    
    logger.info('Maximum card limit scenario validated');
  });

  test('QE-8892 TS-001 TC-001: Verify user can select a card and view detailed spend analysis with accurate metrics', async ({ page }) => {
    logger.info('Test Case: QE-8892 TS-001 TC-001 - Card Spend Analysis Test');
    
    const user = testData.users.testuser_multicard;
    await cardManagementPage.login(user.username, user.password);
    
    await cardManagementPage.waitForCardDashboardLoad();
    
    await cardManagementPage.selectCard('****1234');
    
    await expect(cardManagementPage.cardDetailView).toBeVisible();
    await expect(cardManagementPage.spendAnalysisSection).toBeVisible();
    
    const totalSpend = await cardManagementPage.getTotalSpend();
    expect(totalSpend).toBe('$5,200.00');
    
    const monthlyTrend = await cardManagementPage.getMonthlySpendingTrend();
    expect(monthlyTrend.length).toBe(6);
    
    const expectedTrend = {
      'Jan': '$800.00',
      'Feb': '$900.00',
      'Mar': '$850.00',
      'Apr': '$920.00',
      'May': '$880.00',
      'Jun': '$850.00'
    };
    
    for (const [month, amount] of Object.entries(expectedTrend)) {
      const trendEntry = monthlyTrend.find(t => t.month === month);
      expect(trendEntry.amount).toBe(amount);
    }
    
    const utilization = await cardManagementPage.getCreditUtilization();
    expect(utilization).toBe('24%');
    
    const currentBalance = await cardManagementPage.getCurrentBalance();
    const creditLimit = await cardManagementPage.getCreditLimit();
    expect(currentBalance).toBe('$1,200.00');
    expect(creditLimit).toBe('$5,000.00');
    
    logger.info('Card spend analysis validated successfully');
  });

  test('QE-8892 TS-002 TC-001: Verify user selecting card with no transaction history receives appropriate message', async ({ page }) => {
    logger.info('Test Case: QE-8892 TS-002 TC-001 - No Transaction History Test');
    
    const user = testData.users.testuser_newcard;
    await cardManagementPage.login(user.username, user.password);
    
    await cardManagementPage.waitForCardDashboardLoad();
    
    await cardManagementPage.selectCard('****9999');
    
    await expect(cardManagementPage.cardDetailView).toBeVisible();
    
    await expect(cardManagementPage.noSpendingDataMessage).toBeVisible();
    
    const messageText = await cardManagementPage.getNoSpendingDataMessage();
    expect(messageText).toContain('No spending data available for this card');
    expect(messageText).toContain('Start using your card to see spending analysis');
    
    const utilization = await cardManagementPage.getCreditUtilization();
    expect(utilization).toBe('0%');
    
    const currentBalance = await cardManagementPage.getCurrentBalance();
    const creditLimit = await cardManagementPage.getCreditLimit();
    expect(currentBalance).toBe('$0.00');
    expect(creditLimit).toBe('$8,000.00');
    
    logger.info('No transaction history scenario validated');
  });

  test('QE-8892 TS-003 TC-001: Verify high utilization card displays spending trends and utilization status', async ({ page }) => {
    logger.info('Test Case: QE-8892 TS-003 TC-001 - High Utilization Card Test');
    
    const user = testData.users.testuser_highutil_card;
    await cardManagementPage.login(user.username, user.password);
    
    await cardManagementPage.waitForCardDashboardLoad();
    
    await cardManagementPage.selectCard('****5678');
    
    await expect(cardManagementPage.cardDetailView).toBeVisible();
    await expect(cardManagementPage.spendAnalysisSection).toBeVisible();
    
    const monthlyTrend = await cardManagementPage.getMonthlySpendingTrend();
    expect(monthlyTrend.length).toBe(6);
    
    const expectedTrend = {
      'Jan': '$1,200.00',
      'Feb': '$1,400.00',
      'Mar': '$1,600.00',
      'Apr': '$1,800.00',
      'May': '$2,000.00',
      'Jun': '$2,100.00'
    };
    
    for (const [month, amount] of Object.entries(expectedTrend)) {
      const trendEntry = monthlyTrend.find(t => t.month === month);
      expect(trendEntry.amount).toBe(amount);
    }
    
    const utilization = await cardManagementPage.getCreditUtilization();
    expect(utilization).toBe('85%');
    
    await expect(cardManagementPage.highUtilizationIndicator).toBeVisible();
    
    const warningText = await cardManagementPage.getHighUtilizationWarning();
    expect(warningText).toContain('High utilization');
    expect(warningText).toContain('Consider reducing balance');
    
    const currentBalance = await cardManagementPage.getCurrentBalance();
    const creditLimit = await cardManagementPage.getCreditLimit();
    expect(currentBalance).toBe('$8,500.00');
    expect(creditLimit).toBe('$10,000.00');
    
    logger.info('High utilization card validated successfully');
  });
});
