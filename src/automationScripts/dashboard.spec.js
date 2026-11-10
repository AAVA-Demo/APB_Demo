const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Dashboard KPIs and Credit Card Overview', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('user123', 'password123');
    await dashboardPage.navigate();
  });

  test('QE-9461 TS-001 TC-001 - Verify dashboard displays all four KPIs with correct calculations', async ({ page }) => {
    await expect(dashboardPage.monthlySpendKPI).toBeVisible({ timeout: 2000 });
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();

    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    const availableCredit = await dashboardPage.getKPIValue('Available Credit');
    const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');

    expect(monthlySpend).toContain('$12,450.75');
    expect(totalCreditLimit).toContain('$50,000.00');
    expect(availableCredit).toContain('$37,549.25');
    expect(outstandingAmount).toContain('$12,450.75');

    const calculatedAvailableCredit = 50000 - 12450.75;
    expect(calculatedAvailableCredit).toBe(37549.25);
  });

  test('QE-9461 TS-002 TC-001 - Verify error handling when KPI data service returns incomplete data', async ({ page }) => {
    await page.route('**/api/dashboard/kpis**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ monthlySpend: null, totalCreditLimit: 50000 })
      });
    });

    await page.reload();
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessage();
    expect(errorText).toContain('Failed to load dashboard data');
  });

  test('QE-9461 TS-003 TC-001 - Verify unauthenticated users cannot access dashboard', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('QE-9462 TS-001 TC-001 - Verify responsive multi-card display on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.navigate();

    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(3);

    const visaCard = await dashboardPage.getCardDetails('Visa Platinum');
    expect(visaCard.cardNumber).toContain('****');
    expect(visaCard.cardNumber).toContain('1234');

    const masterCard = await dashboardPage.getCardDetails('MasterCard Gold');
    expect(masterCard.cardNumber).toContain('5678');

    const amexCard = await dashboardPage.getCardDetails('Amex Blue');
    expect(amexCard.cardNumber).toContain('9012');
  });

  test('QE-9462 TS-001 TC-002 - Verify responsive multi-card display on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await dashboardPage.navigate();

    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(3);

    await expect(dashboardPage.creditCardList).toBeVisible();
  });

  test('QE-9462 TS-001 TC-003 - Verify responsive multi-card display on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await dashboardPage.navigate();

    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(3);

    await expect(dashboardPage.creditCardList).toBeVisible();
  });

  test('QE-9462 TS-002 TC-001 - Verify single credit card display without layout issues', async ({ page }) => {
    await page.route('**/api/dashboard/kpis**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          userId: 'user456',
          monthlySpend: 6250,
          totalCreditLimit: 25000,
          availableCredit: 18750,
          outstandingAmount: 6250,
          creditCards: [{
            cardId: 'card001',
            cardName: 'Visa Platinum',
            cardNumber: '**** **** **** 1234',
            creditLimit: 25000,
            availableCredit: 18750,
            outstandingAmount: 6250,
            monthlySpend: 6250
          }]
        })
      });
    });

    await page.reload();
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(1);

    const visaCard = await dashboardPage.getCardDetails('Visa Platinum');
    expect(visaCard.cardNumber).toContain('1234');
  });

  test('QE-9462 TS-003 TC-001 - Verify handling of incomplete credit card data', async ({ page }) => {
    await page.route('**/api/dashboard/kpis**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          userId: 'user123',
          monthlySpend: 12450.75,
          totalCreditLimit: 50000,
          availableCredit: 37549.25,
          outstandingAmount: 12450.75,
          creditCards: [{
            cardId: 'card001',
            cardName: 'Visa Platinum',
            cardNumber: '**** **** **** 1234',
            creditLimit: null,
            availableCredit: null,
            outstandingAmount: 6250,
            monthlySpend: 6250
          }]
        })
      });
    });

    await page.reload();
    const visaCard = await dashboardPage.getCardDetails('Visa Platinum');
    expect(visaCard.creditLimit).toMatch(/N\/A|--|Data unavailable/);
  });
});
