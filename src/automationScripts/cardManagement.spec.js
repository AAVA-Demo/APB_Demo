const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Multiple Credit Card Management Tests', () => {

  test('QE-8880 TS-001 TC-001 - Verify display of 5 registered credit cards with complete details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await cardManagementPage.navigate();

    await cardManagementPage.waitForCardsToLoad();
    const cardCount = await cardManagementPage.getCardCount();
    await expect(cardCount).toBe(5);

    const expectedCards = [
      { name: 'Platinum Rewards', number: '****1234', issuer: 'Bank A', limit: '$20,000', balance: '$8,500' },
      { name: 'Travel Elite', number: '****5678', issuer: 'Bank B', limit: '$15,000', balance: '$4,500' },
      { name: 'Cashback Plus', number: '****9012', issuer: 'Bank C', limit: '$10,000', balance: '$3,200' },
      { name: 'Business Gold', number: '****3456', issuer: 'Bank D', limit: '$25,000', balance: '$12,500' },
      { name: 'Student Starter', number: '****7890', issuer: 'Bank E', limit: '$5,000', balance: '$1,800' }
    ];

    for (let i = 0; i < expectedCards.length; i++) {
      const card = expectedCards[i];
      await expect(await cardManagementPage.getCardName(i)).toBe(card.name);
      await expect(await cardManagementPage.getCardNumber(i)).toBe(card.number);
      await expect(await cardManagementPage.getCardIssuer(i)).toBe(card.issuer);
      await expect(await cardManagementPage.getCardLimit(i)).toBe(card.limit);
      await expect(await cardManagementPage.getCardBalance(i)).toBe(card.balance);
    }
  });

  test('QE-8880 TS-002 TC-001 - Verify display of 10 cards without performance degradation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await loginPage.navigate();
    await loginPage.login('poweruser', 'Pass@123');
    
    const startTime = Date.now();
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardsToLoad();
    const loadTime = Date.now() - startTime;

    await expect(loadTime).toBeLessThan(3000);

    const cardCount = await cardManagementPage.getCardCount();
    await expect(cardCount).toBe(10);

    const isScrollSmooth = await cardManagementPage.verifyScrollPerformance();
    await expect(isScrollSmooth).toBeTruthy();
  });

  test('QE-8880 TS-003 TC-001 - Verify empty state when no cards registered', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await loginPage.navigate();
    await loginPage.login('newuser999', 'Pass@123');
    await cardManagementPage.navigate();

    await cardManagementPage.waitForEmptyState();
    const cardCount = await cardManagementPage.getCardCount();
    await expect(cardCount).toBe(0);

    const emptyMessage = await cardManagementPage.getEmptyStateMessage();
    await expect(emptyMessage).toContain('No credit cards available to display');
  });

  test('QE-8878 TS-001 TC-001 - Verify card-wise spend analysis with transaction history', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await cardManagementPage.navigate();

    await cardManagementPage.waitForCardsToLoad();
    await cardManagementPage.selectCard(1);

    await cardManagementPage.waitForCardDetails();
    const balance = await cardManagementPage.getSelectedCardBalance();
    await expect(balance).toBe('$4,500');

    const monthlySpend = await cardManagementPage.getSelectedCardMonthlySpend();
    await expect(monthlySpend).toBe('$850');

    const utilizationRate = await cardManagementPage.getUtilizationRate();
    await expect(utilizationRate).toBe('30%');
  });

  test('QE-8878 TS-002 TC-001 - Verify comprehensive spending patterns with 12 months history', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await cardManagementPage.navigate();

    await cardManagementPage.waitForCardsToLoad();
    await cardManagementPage.selectCard(0);

    await cardManagementPage.waitForCardDetails();
    const hasTrendChart = await cardManagementPage.hasMonthOverMonthTrends();
    await expect(hasTrendChart).toBeTruthy();

    const hasCategoryBreakdown = await cardManagementPage.hasCategoryBreakdown();
    await expect(hasCategoryBreakdown).toBeTruthy();
  });

  test('QE-8878 TS-003 TC-001 - Verify newly added card with no transaction history', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await cardManagementPage.navigate();

    await cardManagementPage.waitForCardsToLoad();
    await cardManagementPage.selectCardById('card006');

    await cardManagementPage.waitForCardDetails();
    const cardName = await cardManagementPage.getSelectedCardName();
    await expect(cardName).toBeTruthy();

    const monthlySpend = await cardManagementPage.getSelectedCardMonthlySpend();
    const isZeroOrMessage = monthlySpend === '$0.00' || monthlySpend.includes('No transactions available');
    await expect(isZeroOrMessage).toBeTruthy();

    const patternsMessage = await cardManagementPage.getSpendingPatternsMessage();
    await expect(patternsMessage).toContain('No spending patterns available');
  });

});
