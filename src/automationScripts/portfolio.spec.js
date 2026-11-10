const { test, expect } = require('@playwright/test');
const { PortfolioPage } = require('./pages/portfolio.page');
const testData = require('../data/testData.json');

test.describe('Portfolio Management Tests - QE-10456', () => {

  test('QE-10456 TS-001 TC-001: Verify portfolio page displays all registered credit cards with complete details', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    await portfolioPage.navigate();
    await portfolioPage.waitForPageLoad();
    
    const userId = 'user123';
    await portfolioPage.loadCardsForUser(userId);
    
    // Validate 3 cards are displayed
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBe(3);
    
    // Validate card details
    const card1 = await portfolioPage.getCardDetails(0);
    expect(card1.cardName).toBe('Visa Platinum');
    expect(card1.cardNumber).toBe('**** 1234');
    expect(card1.creditLimit).toBe('$10,000');
    expect(card1.currentBalance).toBe('$3,000');
    expect(card1.availableCredit).toBe('$7,000');
    expect(card1.utilizationPercentage).toBe('30.00%');
    
    const card2 = await portfolioPage.getCardDetails(1);
    expect(card2.utilizationPercentage).toBe('25.00%');
    
    const card3 = await portfolioPage.getCardDetails(2);
    expect(card3.utilizationPercentage).toBe('50.00%');
  });

  test('QE-10456 TS-002 TC-001: Verify portfolio page displays empty state when user has no registered cards', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    await portfolioPage.navigate();
    await portfolioPage.waitForPageLoad();
    
    const userId = 'user456';
    await portfolioPage.loadCardsForUser(userId);
    
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBe(0);
    
    const emptyMessage = await portfolioPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No credit cards are currently registered');
  });

  test('QE-10456 TS-003 TC-001: Verify portfolio page displays error when credit card data service is unavailable', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    // Mock service unavailability
    await page.route('**/api/portfolio/cards*', route => route.abort());
    
    await portfolioPage.navigate();
    await portfolioPage.waitForPageLoad();
    
    const userId = 'user123';
    await portfolioPage.loadCardsForUser(userId);
    
    const errorMessage = await portfolioPage.getErrorMessage();
    expect(errorMessage).toContain('Card data cannot be retrieved at this time');
    
    const hasStaleData = await portfolioPage.hasStaleCardData();
    expect(hasStaleData).toBe(false);
  });

});

test.describe('Card-Wise Spend Analysis Tests - QE-10452', () => {

  test('QE-10452 TS-001 TC-001: Verify card-specific spending data is retrieved and displayed accurately', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    await portfolioPage.navigate();
    await portfolioPage.waitForPageLoad();
    
    const cardId = 'card1';
    await portfolioPage.selectCard(cardId);
    await portfolioPage.loadCardSpendDetail(cardId, '2026-11');
    
    const totalSpend = await portfolioPage.getCardTotalSpend();
    expect(totalSpend).toBe('$1,500');
    
    const creditLimit = await portfolioPage.getCardCreditLimit();
    expect(creditLimit).toBe('$10,000');
    
    const currentBalance = await portfolioPage.getCardCurrentBalance();
    expect(currentBalance).toBe('$3,000');
    
    const availableCredit = await portfolioPage.getCardAvailableCredit();
    expect(availableCredit).toBe('$7,000');
    
    const utilization = await portfolioPage.getCardUtilization();
    expect(utilization).toBe('30.00%');
  });

  test('QE-10452 TS-002 TC-001: Verify system returns zero spending when card has no transactions in selected month', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    await portfolioPage.navigate();
    await portfolioPage.waitForPageLoad();
    
    const cardId = 'card2';
    await portfolioPage.selectCard(cardId);
    await portfolioPage.loadCardSpendDetail(cardId, '2026-11');
    
    const totalSpend = await portfolioPage.getCardTotalSpend();
    expect(totalSpend).toBe('$0');
    
    const message = await portfolioPage.getNoTransactionsMessage();
    expect(message).toContain('No transactions found for this card in the selected month');
    
    // Verify card details still displayed
    const creditLimit = await portfolioPage.getCardCreditLimit();
    expect(creditLimit).toBe('$5,000');
  });

  test('QE-10452 TS-003 TC-001: Verify system returns error for invalid card ID', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    await portfolioPage.navigate();
    await portfolioPage.waitForPageLoad();
    
    const invalidCardId = 'invalidCard999';
    await portfolioPage.loadCardSpendDetail(invalidCardId, '2026-11');
    
    const errorMessage = await portfolioPage.getErrorMessage();
    expect(errorMessage).toMatch(/Card not found|Card does not belong to user/);
    
    const hasCardData = await portfolioPage.hasCardData();
    expect(hasCardData).toBe(false);
  });

  test('QE-10452 TS-003 TC-002: Verify system returns error when requesting card belonging to different user', async ({ page }) => {
    const portfolioPage = new PortfolioPage(page);
    
    await portfolioPage.navigate();
    await portfolioPage.waitForPageLoad();
    
    // Authenticate as user123, attempt to access user456's card
    const cardId = 'card2';
    await portfolioPage.loadCardSpendDetail(cardId, '2026-11');
    
    const errorMessage = await portfolioPage.getErrorMessage();
    expect(errorMessage).toMatch(/Card does not belong to user|Access denied/);
    
    const hasSensitiveData = await portfolioPage.hasSensitiveDataExposed();
    expect(hasSensitiveData).toBe(false);
  });

});