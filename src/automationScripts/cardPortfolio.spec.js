const { test, expect } = require('@playwright/test');
const { CardPortfolioPage } = require('./pages/cardPortfolio.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Card Portfolio Tests', () => {

  test('QE-10606 TS-001 TC-001 - Verify user with 10 cards can view all cards with details', async ({ page }) => {
    logger.info('Starting test: QE-10606 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const cardPortfolioPage = new CardPortfolioPage(page);

    await test.step('Login with 10-card user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_10cards', 'Pass@123');
      logger.info('User authenticated');
    });

    await test.step('Navigate to My Cards tab', async () => {
      await cardPortfolioPage.navigate();
      await cardPortfolioPage.waitForPortfolioLoad();
      logger.info('Multi-card view loaded');
    });

    await test.step('Verify 10 cards displayed', async () => {
      const cardCount = await cardPortfolioPage.getCardCount();
      expect(cardCount).toBe(10);
      logger.info(`Card count verified: ${cardCount}`);
    });

    await test.step('Verify masked card numbers', async () => {
      const cardNumbers = await cardPortfolioPage.getAllCardNumbers();
      cardNumbers.forEach(cardNumber => {
        expect(cardNumber).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
      });
      logger.info('All card numbers properly masked');
    });

    await test.step('Verify issuer names displayed', async () => {
      const issuers = await cardPortfolioPage.getAllIssuers();
      expect(issuers.length).toBe(10);
      issuers.forEach(issuer => {
        expect(issuer).toBeTruthy();
      });
      logger.info('All issuer names displayed');
    });

    await test.step('Verify credit limits displayed', async () => {
      const limits = await cardPortfolioPage.getAllCreditLimits();
      expect(limits.length).toBe(10);
      limits.forEach(limit => {
        expect(limit).toMatch(/^\$[\d,]+/);
      });
      logger.info('All credit limits displayed in currency format');
    });

    await test.step('Verify available credit displayed', async () => {
      const availableCredits = await cardPortfolioPage.getAllAvailableCredits();
      expect(availableCredits.length).toBe(10);
      logger.info('All available credits displayed');
    });

    await test.step('Verify outstanding balances displayed', async () => {
      const balances = await cardPortfolioPage.getAllOutstandingBalances();
      expect(balances.length).toBe(10);
      logger.info('All outstanding balances displayed');
    });

    await test.step('Verify portfolio summary', async () => {
      const summary = await cardPortfolioPage.getPortfolioSummary();
      expect(summary.totalCards).toBe(10);
      expect(parseFloat(summary.totalCreditLimit.replace(/[$,]/g, ''))).toBeGreaterThan(0);
      expect(parseFloat(summary.totalAvailable.replace(/[$,]/g, ''))).toBeGreaterThanOrEqual(0);
      logger.info('Portfolio summary verified');
    });
  });

  test('QE-10606 TS-002 TC-001 - Verify session timeout redirects to login', async ({ page }) => {
    logger.info('Starting test: QE-10606 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const cardPortfolioPage = new CardPortfolioPage(page);

    await test.step('Login with valid credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser', 'Pass@123');
      logger.info('User authenticated');
    });

    await test.step('Expire authentication token', async () => {
      await page.evaluate(() => {
        window.sessionStorage.removeItem('authToken');
      });
      logger.info('Authentication token expired');
    });

    await test.step('Attempt to navigate to My Cards', async () => {
      await page.goto('/#!/cards');
      // Wait for redirect
      await page.waitForTimeout(2000);
    });

    await test.step('Verify redirect to login page', async () => {
      await expect(page).toHaveURL(/.*\/login/);
      logger.info('Redirected to login page');
    });

    await test.step('Verify session timeout message', async () => {
      const message = await loginPage.getSessionTimeoutMessage();
      expect(message).toContain('session has expired');
      logger.info('Session timeout message displayed');
    });
  });

  test('QE-10606 TS-003 TC-001 - Verify single card display without errors', async ({ page }) => {
    logger.info('Starting test: QE-10606 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const cardPortfolioPage = new CardPortfolioPage(page);

    await test.step('Login with single-card user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_1card', 'Pass@123');
      logger.info('Single-card user authenticated');
    });

    await test.step('Navigate to My Cards', async () => {
      await cardPortfolioPage.navigate();
      await cardPortfolioPage.waitForPortfolioLoad();
      logger.info('Card portfolio loaded');
    });

    await test.step('Verify exactly 1 card displayed', async () => {
      const cardCount = await cardPortfolioPage.getCardCount();
      expect(cardCount).toBe(1);
      logger.info('Single card displayed');
    });

    await test.step('Verify card details displayed', async () => {
      const cardNumber = await cardPortfolioPage.getCardNumberByIndex(0);
      const issuer = await cardPortfolioPage.getIssuerByIndex(0);
      const limit = await cardPortfolioPage.getCreditLimitByIndex(0);
      
      expect(cardNumber).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
      expect(issuer).toBeTruthy();
      expect(limit).toMatch(/^\$[\d,]+/);
      logger.info('Card details verified');
    });

    await test.step('Verify no error messages', async () => {
      await expect(cardPortfolioPage.errorMessage).not.toBeVisible();
      logger.info('No error messages displayed');
    });

    await test.step('Verify no empty state messages', async () => {
      await expect(cardPortfolioPage.emptyStateMessage).not.toBeVisible();
      logger.info('No empty state messages displayed');
    });

    await test.step('Verify portfolio summary for single card', async () => {
      const summary = await cardPortfolioPage.getPortfolioSummary();
      expect(summary.totalCards).toBe(1);
      logger.info('Portfolio summary correct for single card');
    });
  });

  test('QE-10605 TS-001 TC-001 - Verify card-specific spending analysis', async ({ page }) => {
    logger.info('Starting test: QE-10605 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const cardPortfolioPage = new CardPortfolioPage(page);

    await test.step('Login and navigate to My Cards', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser', 'Pass@123');
      await cardPortfolioPage.navigate();
      await cardPortfolioPage.waitForPortfolioLoad();
      logger.info('Portfolio loaded');
    });

    await test.step('Select specific credit card', async () => {
      await cardPortfolioPage.selectCardByIndex(0);
      await cardPortfolioPage.waitForCardDetailsLoad();
      logger.info('Card details page loaded');
    });

    await test.step('Verify current month spend displayed', async () => {
      const currentMonthSpend = await cardPortfolioPage.getCurrentMonthSpend();
      expect(currentMonthSpend).toMatch(/^\$[\d,]+\.\d{2}$/);
      logger.info(`Current month spend: ${currentMonthSpend}`);
    });

    await test.step('Verify previous month spend displayed', async () => {
      const previousMonthSpend = await cardPortfolioPage.getPreviousMonthSpend();
      expect(previousMonthSpend).toMatch(/^\$[\d,]+\.\d{2}$/);
      logger.info(`Previous month spend: ${previousMonthSpend}`);
    });

    await test.step('Verify spending trend indicator', async () => {
      const trendIndicator = await cardPortfolioPage.getSpendingTrend();
      expect(['up', 'down', 'stable']).toContain(trendIndicator.toLowerCase());
      logger.info(`Spending trend: ${trendIndicator}`);
    });

    await test.step('Verify top spending categories', async () => {
      const topCategories = await cardPortfolioPage.getTopSpendingCategories();
      expect(topCategories.length).toBeGreaterThan(0);
      topCategories.forEach(category => {
        expect(category.name).toBeTruthy();
        expect(category.amount).toMatch(/^\$[\d,]+/);
      });
      logger.info(`Top categories: ${topCategories.length}`);
    });
  });

  test('QE-10605 TS-002 TC-001 - Verify new card with no transaction history', async ({ page }) => {
    logger.info('Starting test: QE-10605 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const cardPortfolioPage = new CardPortfolioPage(page);

    await test.step('Login with new card user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_newcard', 'Pass@123');
      await cardPortfolioPage.navigate();
      await cardPortfolioPage.waitForPortfolioLoad();
      logger.info('New card user logged in');
    });

    await test.step('Select newly added card', async () => {
      await cardPortfolioPage.selectCardByIndex(0);
      await cardPortfolioPage.waitForCardDetailsLoad();
      logger.info('New card details loaded');
    });

    await test.step('Verify current month spend is $0.00', async () => {
      const currentSpend = await cardPortfolioPage.getCurrentMonthSpend();
      expect(currentSpend).toBe('$0.00');
      logger.info('Current month spend verified as $0.00');
    });

    await test.step('Verify previous month spend is $0.00', async () => {
      const previousSpend = await cardPortfolioPage.getPreviousMonthSpend();
      expect(previousSpend).toBe('$0.00');
      logger.info('Previous month spend verified as $0.00');
    });

    await test.step('Verify trend shows No data available', async () => {
      const trendText = await cardPortfolioPage.getTrendSectionText();
      expect(trendText).toContain('No data available');
      logger.info('Trend section shows no data message');
    });

    await test.step('Verify top categories shows No data available', async () => {
      const categoriesText = await cardPortfolioPage.getCategoriesSectionText();
      expect(categoriesText).toContain('No data available');
      logger.info('Categories section shows no data message');
    });

    await test.step('Verify no errors thrown', async () => {
      await expect(cardPortfolioPage.errorMessage).not.toBeVisible();
      logger.info('Page loaded without errors');
    });
  });

  test('QE-10605 TS-003 TC-001 - Verify card comparison and utilization analysis', async ({ page }) => {
    logger.info('Starting test: QE-10605 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const cardPortfolioPage = new CardPortfolioPage(page);

    await test.step('Login with multi-card user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_multicard', 'Pass@123');
      await cardPortfolioPage.navigate();
      await cardPortfolioPage.waitForPortfolioLoad();
      logger.info('Multi-card portfolio loaded');
    });

    await test.step('Sort by Monthly Spend', async () => {
      await cardPortfolioPage.sortByMonthlySpend();
      await page.waitForTimeout(1000); // Wait for sort animation
      logger.info('Cards sorted by monthly spend');
    });

    await test.step('Identify card with highest monthly spend', async () => {
      const highestSpendCard = await cardPortfolioPage.getCardByIndex(0);
      expect(highestSpendCard.monthlySpend).toBeTruthy();
      logger.info(`Highest spend card: ${highestSpendCard.cardNumber}, Spend: ${highestSpendCard.monthlySpend}`);
    });

    await test.step('View card-wise spend analysis for each card', async () => {
      const cardCount = await cardPortfolioPage.getCardCount();
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = await cardPortfolioPage.getCardByIndex(i);
        expect(card.monthlySpend).toBeTruthy();
        logger.info(`Card ${i+1} - Monthly Spend: ${card.monthlySpend}`);
      }
    });

    await test.step('Calculate utilization rates', async () => {
      const utilizationRates = await cardPortfolioPage.calculateUtilizationRates();
      expect(utilizationRates.length).toBeGreaterThan(0);
      utilizationRates.forEach((rate, index) => {
        expect(rate).toBeGreaterThanOrEqual(0);
        expect(rate).toBeLessThanOrEqual(100);
        logger.info(`Card ${index+1} utilization: ${rate}%`);
      });
    });

    await test.step('Identify card with highest utilization', async () => {
      const highestUtilization = await cardPortfolioPage.getHighestUtilizationCard();
      expect(highestUtilization.rate).toBeGreaterThan(0);
      logger.info(`Highest utilization: Card ${highestUtilization.cardNumber}, Rate: ${highestUtilization.rate}%`);
    });

    await test.step('Verify comparison summary', async () => {
      const summary = await cardPortfolioPage.getComparisonSummary();
      expect(summary.highestSpendCard).toBeTruthy();
      expect(summary.highestUtilizationCard).toBeTruthy();
      logger.info('Comparison summary verified');
    });
  });
});
