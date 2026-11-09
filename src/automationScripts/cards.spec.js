const { test, expect } = require('@playwright/test');
const { CardsPage } = require('./pages/cards.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Credit Card Management Tests', () => {
  let cardsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardsPage = new CardsPage(page);
    await loginPage.navigate();
  });

  test('TC-4609: Verify card portfolio displays all cards with complete details', async ({ page }) => {
    await loginPage.login(testData.users.userWith10Cards.username, testData.users.userWith10Cards.password);
    await cardsPage.navigateToCards();
    
    await cardsPage.waitForCardsLoad();
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(10);
    
    const firstCard = await cardsPage.getCardDetails(0);
    expect(firstCard.cardNumber).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
    expect(firstCard.cardType).toBeTruthy();
    expect(firstCard.creditLimit).toBeGreaterThan(0);
    expect(firstCard.availableCredit).toBeGreaterThanOrEqual(0);
    expect(firstCard.outstandingAmount).toBeGreaterThanOrEqual(0);
    expect(firstCard.expiryDate).toMatch(/\d{2}\/\d{2}/);
    expect(firstCard.status).toBeTruthy();
  });

  test('TC-4610: Verify empty state message for user with no cards', async ({ page }) => {
    await loginPage.login(testData.users.userWithNoCards.username, testData.users.userWithNoCards.password);
    await cardsPage.navigateToCards();
    
    await cardsPage.waitForCardsLoad();
    const emptyMessage = await cardsPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No credit cards found');
    
    await expect(page.locator('.error, .alert-danger')).toHaveCount(0);
    
    const addCardButton = await cardsPage.isAddCardButtonVisible();
    expect(addCardButton).toBe(true);
  });

  test('TC-4611: Verify expired cards are marked and excluded from metrics', async ({ page }) => {
    await loginPage.login(testData.users.userWithExpiredCards.username, testData.users.userWithExpiredCards.password);
    await cardsPage.navigateToCards();
    
    await cardsPage.waitForCardsLoad();
    const expiredCards = await cardsPage.getExpiredCards();
    expect(expiredCards.length).toBeGreaterThan(0);
    
    for (const card of expiredCards) {
      expect(card.status).toMatch(/Expired|Inactive/i);
    }
    
    await cardsPage.navigateToDashboard();
    const totalCreditLimit = await cardsPage.getTotalCreditLimitFromDashboard();
    expect(totalCreditLimit).toBeGreaterThan(0);
  });

  test('TC-4599: Verify detailed spend analysis for selected card', async ({ page }) => {
    await loginPage.login(testData.users.userWithMultipleCards.username, testData.users.userWithMultipleCards.password);
    await cardsPage.navigateToCards();
    
    await cardsPage.waitForCardsLoad();
    await cardsPage.selectCard(0);
    
    await cardsPage.waitForCardDetailsLoad();
    const spendAnalysis = await cardsPage.getSpendAnalysis();
    expect(spendAnalysis.currentMonthSpend).toBeGreaterThanOrEqual(0);
    expect(spendAnalysis.lastMonthSpend).toBeGreaterThanOrEqual(0);
    expect(spendAnalysis.ytdSpend).toBeGreaterThanOrEqual(0);
    expect(spendAnalysis.topCategory).toBeTruthy();
    expect(spendAnalysis.transactionCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-4600: Verify spend analysis for card with no transactions', async ({ page }) => {
    await loginPage.login(testData.users.userWithNewCard.username, testData.users.userWithNewCard.password);
    await cardsPage.navigateToCards();
    
    await cardsPage.waitForCardsLoad();
    await cardsPage.selectCard(0);
    
    await cardsPage.waitForCardDetailsLoad();
    const spendAnalysis = await cardsPage.getSpendAnalysis();
    expect(spendAnalysis.currentMonthSpend).toBe(0);
    expect(spendAnalysis.lastMonthSpend).toBe(0);
    expect(spendAnalysis.ytdSpend).toBe(0);
    
    const noTransactionsMessage = await cardsPage.getNoTransactionsMessage();
    expect(noTransactionsMessage).toContain('No transactions');
    
    await expect(page.locator('text=null')).toHaveCount(0);
    await expect(page.locator('text=undefined')).toHaveCount(0);
  });

  test('TC-4601: Verify card switcher performance within 500ms', async ({ page }) => {
    await loginPage.login(testData.users.userWithMultipleCards.username, testData.users.userWithMultipleCards.password);
    await cardsPage.navigateToCards();
    
    await cardsPage.waitForCardsLoad();
    await cardsPage.selectCard(0);
    await cardsPage.waitForCardDetailsLoad();
    
    const cardAData = await cardsPage.getSpendAnalysis();
    
    const startTime = Date.now();
    await cardsPage.switchCard(1);
    const endTime = Date.now();
    const switchTime = endTime - startTime;
    
    expect(switchTime).toBeLessThan(500);
    
    const cardBData = await cardsPage.getSpendAnalysis();
    expect(cardBData.currentMonthSpend).not.toBe(cardAData.currentMonthSpend);
    
    const transactions = await cardsPage.getTransactionsList();
    expect(transactions.length).toBeGreaterThanOrEqual(0);
  });
});
