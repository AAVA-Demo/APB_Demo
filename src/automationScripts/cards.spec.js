const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardsPage } = require('./pages/cards.page');

test.describe('Card Management Tests - QE-10338, QE-10339', () => {
  let loginPage;
  let cardsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardsPage = new CardsPage(page);
    await loginPage.navigate();
  });

  test('QE-10338 TS-001 TC-001: Verify consolidated multi-card view displays all 5 cards with masked numbers within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await loginPage.login('testuser_5cards', 'Pass@123');
    await cardsPage.navigateToCards();
    await cardsPage.waitForCardsLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
    
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(5);
    
    const cardNumbers = await cardsPage.getAllCardNumbers();
    cardNumbers.forEach(cardNumber => {
      expect(cardNumber).toMatch(/\*\*\*\*-\*\*\*\*-\*\*\*\*-\d{4}/);
    });
    
    await expect(cardsPage.firstCard).toBeVisible();
    const creditLimit = await cardsPage.getCardCreditLimit(0);
    const availableCredit = await cardsPage.getCardAvailableCredit(0);
    const outstanding = await cardsPage.getCardOutstandingBalance(0);
    
    expect(creditLimit).toMatch(/₹[\d,]+\.\d{2}/);
    expect(availableCredit).toMatch(/₹[\d,]+\.\d{2}/);
    expect(outstanding).toMatch(/₹[\d,]+\.\d{2}/);
  });

  test('QE-10338 TS-002 TC-001: Verify system handles network latency for 10 cards with progressive loading', async ({ page }) => {
    await page.route('**/api/cards', route => {
      setTimeout(() => route.continue(), 5000);
    });
    
    await loginPage.login('testuser_10cards', 'Pass@123');
    await cardsPage.navigateToCards();
    
    await expect(cardsPage.loadingIndicator).toBeVisible();
    
    await cardsPage.waitForCardsLoad();
    
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(10);
    
    const performanceWarning = await cardsPage.getPerformanceWarning();
    if (performanceWarning) {
      expect(performanceWarning).toContain('Loading took longer than expected');
    }
  });

  test('QE-10338 TS-003 TC-001: Verify authentication validation when accessing cards without login', async ({ page }) => {
    await page.goto('https://app.example.com/#/cards');
    
    await expect(page).toHaveURL(/.*login/);
    await expect(cardsPage.errorMessage).toBeVisible();
    const errorText = await cardsPage.getErrorMessageText();
    expect(errorText).toContain('Session expired or invalid');
    
    await loginPage.login('testuser', 'Pass@123');
    await cardsPage.navigateToCards();
    
    await page.waitForTimeout(3600000);
    await cardsPage.clickCard(0);
    
    await expect(page).toHaveURL(/.*login/);
    const sessionErrorText = await cardsPage.getErrorMessageText();
    expect(sessionErrorText).toContain('Your session has expired');
  });

  test('QE-10339 TS-001 TC-001: Verify card-wise spend analysis displays detailed breakdown with encrypted transmission', async ({ page }) => {
    await loginPage.login('testuser', 'Pass@123');
    await cardsPage.navigateToCards();
    await cardsPage.waitForCardsLoad();
    
    await cardsPage.clickCard(0);
    await cardsPage.clickViewSpendAnalysis();
    
    await expect(cardsPage.spendAnalysisSection).toBeVisible();
    
    const totalSpend = await cardsPage.getTotalSpend();
    const categoryBreakdown = await cardsPage.getCategoryBreakdown();
    const monthlyTrends = await cardsPage.getMonthlyTrends();
    const transactionCount = await cardsPage.getTransactionCount();
    
    expect(totalSpend).toMatch(/₹[\d,]+\.\d{2}/);
    expect(categoryBreakdown.length).toBeGreaterThan(0);
    expect(monthlyTrends.length).toBeGreaterThan(0);
    expect(transactionCount).toBeGreaterThan(0);
    
    const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    categoryBreakdown.forEach(cat => {
      expect(categories).toContain(cat);
    });
    
    const protocol = await page.evaluate(() => window.location.protocol);
    expect(protocol).toBe('https:');
  });

  test('QE-10339 TS-002 TC-001: Verify message displayed for card with no transaction history', async ({ page }) => {
    await loginPage.login('testuser_newcard', 'Pass@123');
    await cardsPage.navigateToCards();
    await cardsPage.waitForCardsLoad();
    
    const cardNumber = await cardsPage.findCardByLastFourDigits('5678');
    await cardsPage.clickCardByNumber(cardNumber);
    await cardsPage.clickViewSpendAnalysis();
    
    await expect(cardsPage.noDataMessage).toBeVisible();
    const messageText = await cardsPage.getNoDataMessageText();
    expect(messageText).toContain('No spending data available for this card');
    expect(messageText).toContain('Please check back after transactions are recorded');
  });

  test('QE-10339 TS-003 TC-001: Verify error message for invalid card ID', async ({ page }) => {
    await loginPage.login('testuser', 'Pass@123');
    
    await page.goto('https://app.example.com/#/cards/INVALID-CARD-999/spend');
    
    await expect(cardsPage.errorMessage).toBeVisible();
    const errorText = await cardsPage.getErrorMessageText();
    expect(errorText).toContain('Card not found or is not associated with your account');
    
    await expect(page).toHaveURL(/.*cards/);
  });
});