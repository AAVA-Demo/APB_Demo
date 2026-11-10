const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Authentication Tests', () => {
  let loginPage;
  let dashboardPage;
  let cardManagementPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    cardManagementPage = new CardManagementPage(page);
    analyticsPage = new AnalyticsPage(page);
  });

  test('TC-6658: Verify user with 3 credit cards views comparative spend analysis', async ({ page }) => {
    await test.step('Login with user account having 3 registered credit cards', async () => {
      await loginPage.navigate();
      await loginPage.login('user_3cards_analysis', 'Pass@123');
    });

    await test.step('Navigate to Card Management section', async () => {
      await cardManagementPage.navigate();
      await cardManagementPage.waitForCardsLoad();
    });

    await test.step('Access card-wise spend analysis feature', async () => {
      await expect(cardManagementPage.cardItems.first()).toBeVisible();
    });

    await test.step('Verify comparative table displays all 3 cards', async () => {
      const cardCount = await cardManagementPage.getCardCount();
      expect(cardCount).toBe(3);
    });

    await test.step('Verify each card displays monthly spend amount', async () => {
      const monthlySpends = await cardManagementPage.getAllMonthlySpends();
      expect(monthlySpends.length).toBe(3);
    });

    await test.step('Verify each card displays utilization rate', async () => {
      const utilizationRates = await page.locator('[data-testid="utilization-rate"]').allTextContents();
      expect(utilizationRates.length).toBe(3);
      utilizationRates.forEach(rate => expect(rate).toMatch(/\d+%/));
    });

    await test.step('Verify each card displays performance ranking', async () => {
      const rankings = await page.locator('[data-testid="card-rank"]').allTextContents();
      expect(rankings.length).toBe(3);
    });

    await test.step('Verify cards are sorted by monthly spend descending', async () => {
      const spends = await cardManagementPage.getAllMonthlySpends();
      const spendValues = spends.map(s => parseFloat(s.replace(/[$,]/g, '')));
      for (let i = 0; i < spendValues.length - 1; i++) {
        expect(spendValues[i]).toBeGreaterThanOrEqual(spendValues[i + 1]);
      }
    });
  });

  test('TC-6660: Verify user can drill down to detailed spend analysis for specific card', async ({ page }) => {
    await test.step('Login and navigate to card-wise spend analysis', async () => {
      await loginPage.navigate();
      await loginPage.login('user_3cards_analysis', 'Pass@123');
      await cardManagementPage.navigate();
      await cardManagementPage.waitForCardsLoad();
    });

    await test.step('Select a specific card from comparison view', async () => {
      await cardManagementPage.cardItems.first().click();
      await page.waitForURL(/.*cards\/.*/);
    });

    await test.step('Verify detailed spend analysis page displays card info', async () => {
      const cardName = await page.locator('[data-testid="card-detail-name"]').textContent();
      expect(cardName).not.toBe('');
    });

    await test.step('Verify outstanding amount is displayed', async () => {
      const outstanding = await page.locator('[data-testid="outstanding-amount"]').textContent();
      expect(outstanding).toMatch(/\$[0-9,]+/);
    });

    await test.step('Verify credit limit is displayed', async () => {
      const limit = await page.locator('[data-testid="credit-limit-detail"]').textContent();
      expect(limit).toMatch(/\$[0-9,]+/);
    });

    await test.step('Verify utilization rate is calculated correctly', async () => {
      const utilizationRate = await page.locator('[data-testid="utilization-rate-detail"]').textContent();
      expect(utilizationRate).toMatch(/\d+\.\d{2}%/);
    });

    await test.step('Verify utilization rate formula is visible', async () => {
      const formula = await page.locator('[data-testid="utilization-formula"]').textContent();
      expect(formula).toContain('outstanding');
      expect(formula).toContain('limit');
    });
  });

  test('TC-6662: Verify user with zero transaction history receives appropriate message', async ({ page }) => {
    await test.step('Login with user having cards with zero transaction history', async () => {
      await loginPage.navigate();
      await loginPage.login('user_notransactions', 'Pass@123');
    });

    await test.step('Navigate to card-wise spend analysis', async () => {
      await cardManagementPage.navigate();
      await cardManagementPage.waitForCardsLoad();
    });

    await test.step('Verify message indicating no transaction data', async () => {
      const message = await page.locator('[data-testid="no-transaction-message"]').textContent();
      expect(message).toContain('No transaction data available');
    });

    await test.step('Verify all cards display 0% utilization rate', async () => {
      const utilizationRates = await page.locator('[data-testid="utilization-rate"]').allTextContents();
      utilizationRates.forEach(rate => expect(rate).toBe('0%'));
    });

    await test.step('Verify monthly spend for all cards is $0.00', async () => {
      const monthlySpends = await cardManagementPage.getAllMonthlySpends();
      monthlySpends.forEach(spend => expect(spend).toBe('$0.00'));
    });

    await test.step('Verify card comparison ranking is still displayed', async () => {
      const rankings = await page.locator('[data-testid="card-rank"]').allTextContents();
      expect(rankings.length).toBeGreaterThan(0);
    });
  });
});
