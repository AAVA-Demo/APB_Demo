const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Credit Card Dashboard - KPIs and Card Management', () => {

  test('QE-8445 TS-001 TC-001 - Verify dashboard displays all 5 credit cards with accurate individual details in responsive layout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveTitle(/Credit Card Dashboard/);

    // Step 2: Login with user having 5 cards
    await loginPage.login('user_with_5cards', 'Test@123');
    await expect(dashboardPage.dashboardHeader).toBeVisible();

    // Step 3-4: Navigate to card management and verify all 5 cards
    await dashboardPage.navigateToCardManagement();
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(5);

    // Step 5: Verify credit limits
    const expectedLimits = {
      'Visa Gold': 10000,
      'MasterCard Platinum': 15000,
      'Amex Blue': 20000,
      'Discover IT': 8000,
      'Chase Sapphire': 12000
    };
    for (const [cardName, limit] of Object.entries(expectedLimits)) {
      const actualLimit = await dashboardPage.getCardCreditLimit(cardName);
      expect(actualLimit).toBe(limit);
    }

    // Step 6: Verify available credit
    const expectedAvailable = {
      'Visa Gold': 7500,
      'MasterCard Platinum': 10000,
      'Amex Blue': 15000,
      'Discover IT': 6000,
      'Chase Sapphire': 9000
    };
    for (const [cardName, available] of Object.entries(expectedAvailable)) {
      const actualAvailable = await dashboardPage.getCardAvailableCredit(cardName);
      expect(actualAvailable).toBe(available);
    }

    // Step 7: Verify outstanding balance
    const expectedOutstanding = {
      'Visa Gold': 2500,
      'MasterCard Platinum': 5000,
      'Amex Blue': 5000,
      'Discover IT': 2000,
      'Chase Sapphire': 3000
    };
    for (const [cardName, outstanding] of Object.entries(expectedOutstanding)) {
      const actualOutstanding = await dashboardPage.getCardOutstandingBalance(cardName);
      expect(actualOutstanding).toBe(outstanding);
    }

    // Step 8: Resize to tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(dashboardPage.cardListContainer).toBeVisible();
    const isResponsive = await dashboardPage.isLayoutResponsive();
    expect(isResponsive).toBeTruthy();

    // Step 9: Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(dashboardPage.cardListContainer).toBeVisible();
    const isMobileLayout = await dashboardPage.isMobileLayout();
    expect(isMobileLayout).toBeTruthy();
  });

  test('QE-8445 TS-002 TC-001 - Verify appropriate error message when card data service is unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Simulate service unavailability by intercepting API
    await page.route('**/api/cards', route => route.abort());

    // Step 2-3: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@123');

    // Step 4-5: Verify error message
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessage();
    expect(errorText).toContain('Cards cannot be loaded at this time');

    // Step 6: Verify no partial data displayed
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(0);

    // Step 7: Verify retry option
    await expect(dashboardPage.retryButton).toBeVisible();
  });

  test('QE-8445 TS-003 TC-001 - Verify available credit calculation for all cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_varied_cards', 'Test@123');

    // Step 3: Navigate to card portfolio
    await dashboardPage.navigateToCardManagement();

    // Step 4-7: Verify available credit calculations
    const testCards = [
      { name: 'Visa Gold', limit: 10000, outstanding: 2500, expectedAvailable: 7500 },
      { name: 'MasterCard', limit: 5000, outstanding: 4000, expectedAvailable: 1000 },
      { name: 'Amex Platinum', limit: 15000, outstanding: 0, expectedAvailable: 15000 },
      { name: 'Discover IT', limit: 8000, outstanding: 7500, expectedAvailable: 500 }
    ];

    for (const card of testCards) {
      const limit = await dashboardPage.getCardCreditLimit(card.name);
      const outstanding = await dashboardPage.getCardOutstandingBalance(card.name);
      const available = await dashboardPage.getCardAvailableCredit(card.name);

      expect(limit).toBe(card.limit);
      expect(outstanding).toBe(card.outstanding);
      expect(available).toBe(card.expectedAvailable);
      expect(available).toBe(limit - outstanding);
    }
  });

  test('QE-8442 TS-001 TC-001 - Verify all KPIs calculated correctly and displayed within 2 seconds', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_multi_active_cards', 'Test@123');

    // Step 3: Start timer and navigate to dashboard
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;

    // Step 4-7: Verify KPIs
    const monthlySpend = await dashboardPage.getMonthlySpendKPI();
    expect(monthlySpend).toBe(3500.00);

    const totalCreditLimit = await dashboardPage.getTotalCreditLimitKPI();
    expect(totalCreditLimit).toBe(65000.00);

    const availableCredit = await dashboardPage.getAvailableCreditKPI();
    expect(availableCredit).toBe(47500.00);

    const outstandingAmount = await dashboardPage.getOutstandingAmountKPI();
    expect(outstandingAmount).toBe(17500.00);

    // Step 8: Verify load time
    expect(loadTime).toBeLessThan(2000);

    // Step 9: Verify calculation accuracy
    expect(availableCredit).toBe(totalCreditLimit - outstandingAmount);
  });

  test('QE-8442 TS-002 TC-001 - Verify KPIs display correctly for user with zero outstanding balance', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_zero_balance', 'Test@123');

    // Step 3: Navigate to dashboard
    await dashboardPage.waitForDashboardLoad();

    // Step 4-8: Verify KPIs
    const outstanding = await dashboardPage.getOutstandingAmountKPI();
    expect(outstanding).toBe(0.00);

    const totalLimit = await dashboardPage.getTotalCreditLimitKPI();
    expect(totalLimit).toBe(25000.00);

    const available = await dashboardPage.getAvailableCreditKPI();
    expect(available).toBe(25000.00);
    expect(available).toBe(totalLimit);

    const monthlySpend = await dashboardPage.getMonthlySpendKPI();
    expect(monthlySpend).toBeGreaterThanOrEqual(0);

    const utilizationRate = await dashboardPage.getUtilizationRate();
    expect(utilizationRate).toBe(0);
  });

  test('QE-8442 TS-003 TC-001 - Verify appropriate messaging when user has no credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_no_cards', 'Test@123');

    // Step 3: Navigate to dashboard
    await dashboardPage.waitForDashboardLoad();

    // Step 4: Verify no cards message
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const message = await dashboardPage.getNoCardsMessage();
    expect(message).toContain('No credit cards available');

    // Step 5-8: Verify KPI values
    const monthlySpend = await dashboardPage.getMonthlySpendKPI();
    expect(monthlySpend).toBe(0.00);

    const totalLimit = await dashboardPage.getTotalCreditLimitKPI();
    expect(totalLimit).toBe(0.00);

    const available = await dashboardPage.getAvailableCreditKPI();
    expect(available).toBe(0.00);

    const outstanding = await dashboardPage.getOutstandingAmountKPI();
    expect(outstanding).toBe(0.00);

    // Step 9: Verify add card option
    await expect(dashboardPage.addCardButton).toBeVisible();
  });

});
