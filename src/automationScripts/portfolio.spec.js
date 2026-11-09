const { test, expect } = require('@playwright/test');
const { PortfolioPage } = require('./pages/portfolio.page');

test.describe('Portfolio Management Tests', () => {
  let portfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolioPage = new PortfolioPage(page);
  });

  test('QE-7934 TS-001 TC-001 - Verify portfolio displays all 5 credit cards with complete details', async ({ page }) => {
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_5cards', 'Pass@123');
    await portfolioPage.navigateToPortfolio();
    
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBe(5);
    
    const cardTypes = await portfolioPage.getAllCardTypes();
    expect(cardTypes).toEqual(['Visa', 'Mastercard', 'Amex', 'Visa', 'Discover']);
    
    const maskedNumbers = await portfolioPage.getAllMaskedCardNumbers();
    maskedNumbers.forEach(num => {
      expect(num).toMatch(/\*\*\*\* \d{4}/);
    });
    
    const creditLimits = await portfolioPage.getAllCreditLimits();
    expect(creditLimits).toEqual([10000, 15000, 20000, 5000, 12000]);
    
    const balances = await portfolioPage.getAllCurrentBalances();
    expect(balances).toEqual([2500, 8000, 15000, 1200, 6000]);
    
    const availableCredits = await portfolioPage.getAllAvailableCredits();
    expect(availableCredits).toEqual([7500, 7000, 5000, 3800, 6000]);
  });

  test('QE-7934 TS-002 TC-001 - Verify graceful error handling when card data repository experiences high latency', async ({ page }) => {
    await page.route('**/api/cards/**', route => {
      return new Promise(resolve => setTimeout(() => resolve(route.abort()), 8000));
    });
    
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_10cards', 'Pass@123');
    await portfolioPage.navigateToPortfolio();
    
    await expect(portfolioPage.loadingIndicator).toBeVisible();
    
    await page.waitForTimeout(10000);
    
    await expect(portfolioPage.errorMessage).toContainText('Unable to load credit card data');
    
    await expect(portfolioPage.navigationMenu).toBeVisible();
    
    await expect(portfolioPage.retryButton).toBeVisible();
  });

  test('QE-7934 TS-003 TC-001 - Verify different card types display with accurate card-specific information', async ({ page }) => {
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_multitype', 'Pass@123');
    await portfolioPage.navigateToPortfolio();
    
    await expect(portfolioPage.getCardLogo('Visa')).toBeVisible();
    await expect(portfolioPage.getCardLogo('Mastercard')).toBeVisible();
    await expect(portfolioPage.getCardLogo('Amex')).toBeVisible();
    
    const expirationDates = await portfolioPage.getAllExpirationDates();
    expect(expirationDates).toEqual(['12/26', '08/27', '03/28']);
    
    const cardholderNames = await portfolioPage.getAllCardholderNames();
    cardholderNames.forEach(name => {
      expect(name).toBe('John Doe');
    });
    
    await portfolioPage.verifyVisualDifferentiation();
  });

  test('QE-7932 TS-001 TC-001 - Verify card-wise spend analysis displays all metrics for selected card', async ({ page }) => {
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_3cards', 'Pass@123');
    await portfolioPage.navigateToPortfolio();
    
    await portfolioPage.selectCard('Visa **** 1234');
    
    await expect(portfolioPage.cardDetailsPanel).toBeVisible();
    
    const totalSpend = await portfolioPage.getTotalSpendForSelectedCard();
    expect(totalSpend).toBe(4500);
    
    const utilizationRate = await portfolioPage.getUtilizationRateForSelectedCard();
    expect(utilizationRate).toBe(45);
    
    const transactionCount = await portfolioPage.getTransactionCountForSelectedCard();
    expect(transactionCount).toBe(32);
    
    const avgTransaction = await portfolioPage.getAvgTransactionForSelectedCard();
    expect(avgTransaction).toBeCloseTo(140.63, 2);
    
    await expect(portfolioPage.spendingTrendChart).toBeVisible();
  });

  test('QE-7932 TS-002 TC-001 - Verify card-wise spend analysis handles newly added card with zero transactions', async ({ page }) => {
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_newcard', 'Pass@123');
    await portfolioPage.navigateToPortfolio();
    
    await portfolioPage.selectCard('Mastercard **** 5678');
    
    const totalSpend = await portfolioPage.getTotalSpendText();
    expect(['$0.00', 'No data available']).toContain(totalSpend);
    
    const utilizationRate = await portfolioPage.getUtilizationRateText();
    expect(['0%', 'No data available']).toContain(utilizationRate);
    
    const transactionCount = await portfolioPage.getTransactionCountValue();
    expect(transactionCount).toBe(0);
    
    const avgTransaction = await portfolioPage.getAvgTransactionText();
    expect(['$0.00', 'No data available']).toContain(avgTransaction);
    
    await expect(portfolioPage.noTransactionsMessage).toContainText('No transactions recorded for this card yet');
    
    await expect(page).not.toHaveURL(/.*error/);
  });

  test('QE-7932 TS-003 TC-001 - Verify card comparison identifies more effectively utilized card', async ({ page }) => {
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_comparison', 'Pass@123');
    await portfolioPage.navigateToPortfolio();
    
    await portfolioPage.selectCard('Visa **** 1234');
    const cardASpend = await portfolioPage.getTotalSpendForSelectedCard();
    const cardAUtil = await portfolioPage.getUtilizationRateForSelectedCard();
    expect(cardASpend).toBe(4000);
    expect(cardAUtil).toBe(80);
    
    await portfolioPage.navigateToPortfolio();
    await portfolioPage.selectCard('Mastercard **** 5678');
    const cardBSpend = await portfolioPage.getTotalSpendForSelectedCard();
    const cardBUtil = await portfolioPage.getUtilizationRateForSelectedCard();
    expect(cardBSpend).toBe(1500);
    expect(cardBUtil).toBe(30);
    
    expect(cardASpend).toBeGreaterThan(cardBSpend);
    expect(cardAUtil).toBeGreaterThan(cardBUtil);
    
    const recommendation = await portfolioPage.getOptimizationRecommendation();
    expect(recommendation).toContain('Card A utilization below 70%');
  });
});