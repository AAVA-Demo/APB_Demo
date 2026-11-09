const { test, expect } = require('@playwright/test');
const { CardPortfolioPage } = require('./pages/cardPortfolio.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Credit Card Portfolio - Multiple Card Display', () => {
  let cardPortfolioPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardPortfolioPage = new CardPortfolioPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
    await cardPortfolioPage.navigateToPortfolio();
  });

  test('TC-011: Verify multiple credit cards are displayed with card type', async ({ page }) => {
    await cardPortfolioPage.waitForPortfolioLoad();
    const cardCount = await cardPortfolioPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
    
    const cardTypes = await cardPortfolioPage.getAllCardTypes();
    expect(cardTypes.length).toBe(cardCount);
    console.log(`Total cards displayed: ${cardCount}`);
  });

  test('TC-012: Verify card details display credit limit and available credit', async ({ page }) => {
    await cardPortfolioPage.waitForPortfolioLoad();
    const firstCardDetails = await cardPortfolioPage.getCardDetails(0);
    
    expect(firstCardDetails.creditLimit).toBeTruthy();
    expect(firstCardDetails.availableCredit).toBeTruthy();
    expect(firstCardDetails.outstandingBalance).toBeTruthy();
    console.log(`First card details:`, firstCardDetails);
  });

  test('TC-013: Verify card numbers are masked for security', async ({ page }) => {
    await cardPortfolioPage.waitForPortfolioLoad();
    const cardNumbers = await cardPortfolioPage.getAllCardNumbers();
    
    cardNumbers.forEach(cardNumber => {
      expect(cardNumber).toMatch(/\*{12}\d{4}/);
    });
  });

  test('TC-014: Verify card utilization percentage is displayed', async ({ page }) => {
    await cardPortfolioPage.waitForPortfolioLoad();
    const firstCardUtilization = await cardPortfolioPage.getCardUtilization(0);
    
    expect(firstCardUtilization).toBeTruthy();
    expect(firstCardUtilization).toMatch(/\d+%/);
  });

  test('TC-015: Verify clicking on card shows detailed view', async ({ page }) => {
    await cardPortfolioPage.waitForPortfolioLoad();
    await cardPortfolioPage.clickCard(0);
    
    await expect(page).toHaveURL(/\/cards\//);
    expect(await cardPortfolioPage.isCardDetailViewVisible()).toBe(true);
  });

  test('TC-016: Verify empty state message when no cards registered', async ({ page }) => {
    // Login with user having no cards
    await loginPage.navigate();
    await loginPage.login(testData.users.noCardsUser.username, testData.users.noCardsUser.password);
    await cardPortfolioPage.navigateToPortfolio();
    
    expect(await cardPortfolioPage.isEmptyStateVisible()).toBe(true);
    const emptyMessage = await cardPortfolioPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No credit cards found');
  });

  test('TC-017: Verify portfolio summary displays aggregated data', async ({ page }) => {
    await cardPortfolioPage.waitForPortfolioLoad();
    const summary = await cardPortfolioPage.getPortfolioSummary();
    
    expect(summary.totalCards).toBeGreaterThan(0);
    expect(summary.totalCreditLimit).toBeTruthy();
    expect(summary.totalAvailableCredit).toBeTruthy();
    expect(summary.averageUtilization).toBeTruthy();
  });
});

test.describe('Credit Card Portfolio - Card-Wise Spend Analysis', () => {
  let cardPortfolioPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardPortfolioPage = new CardPortfolioPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
    await cardPortfolioPage.navigateToPortfolio();
  });

  test('TC-018: Verify card-wise spending breakdown is displayed', async ({ page }) => {
    await cardPortfolioPage.waitForPortfolioLoad();
    await cardPortfolioPage.clickCard(0);
    
    const spendingBreakdown = await cardPortfolioPage.getCardSpendingBreakdown();
    expect(spendingBreakdown.monthlySpend).toBeTruthy();
    expect(spendingBreakdown.categories).toBeTruthy();
  });

  test('TC-019: Verify spending comparison across multiple cards', async ({ page }) => {
    await cardPortfolioPage.waitForPortfolioLoad();
    const cardCount = await cardPortfolioPage.getCardCount();
    
    if (cardCount >= 2) {
      const card1Spending = await cardPortfolioPage.getCardSpending(0);
      const card2Spending = await cardPortfolioPage.getCardSpending(1);
      
      expect(card1Spending).toBeTruthy();
      expect(card2Spending).toBeTruthy();
      console.log(`Card 1 Spending: ${card1Spending}, Card 2 Spending: ${card2Spending}`);
    }
  });

  test('TC-020: Verify utilization tracking with color indicators', async ({ page }) => {
    await cardPortfolioPage.waitForPortfolioLoad();
    const utilizationIndicator = await cardPortfolioPage.getUtilizationIndicatorColor(0);
    
    expect(utilizationIndicator).toMatch(/green|yellow|red/);
  });
});
