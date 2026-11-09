const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard KPIs and Credit Card Overview Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-8904 TS-001 TC-001: Verify dashboard displays all KPIs with 100% accurate financial calculations and loads within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await loginPage.login('testuser@demo.com', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('$5,234.56');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$25,000.00');
    
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$18,765.44');
    
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$6,234.56');
    
    const creditUtilization = await dashboardPage.getCreditUtilization();
    expect(creditUtilization).toBe('24.94%');
  });

  test('QE-8904 TS-002 TC-001: Verify dashboard displays error message when credit card data service is unavailable', async ({ page }) => {
    await page.route('**/api/creditcards', route => route.abort());
    await page.route('**/api/transactions/summary', route => route.abort());
    
    await loginPage.login('testuser@demo.com', 'Test@123');
    await dashboardPage.waitForErrorMessage();
    
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load dashboard data. Please try again.');
    
    const isDashboardStructureIntact = await dashboardPage.isDashboardStructureVisible();
    expect(isDashboardStructureIntact).toBe(true);
  });

  test('QE-8904 TS-003 TC-001: Verify dashboard correctly displays negative available credit and credit utilization above 100% for over-limit cards', async ({ page }) => {
    await loginPage.login('overlimituser@demo.com', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toContain('-$');
    
    const creditUtilization = await dashboardPage.getCreditUtilization();
    const utilizationValue = parseFloat(creditUtilization.replace('%', ''));
    expect(utilizationValue).toBeGreaterThan(100);
  });

  test('QE-8903 TS-001 TC-001: Verify consolidated credit card portfolio displays all cards with individual and aggregate metrics', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.navigateToCreditCardOverview();
    
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);
    
    const cards = await dashboardPage.getAllCreditCards();
    expect(cards.length).toBeGreaterThanOrEqual(3);
    
    for (const card of cards) {
      expect(card.cardNumber).toBeDefined();
      expect(card.utilization).toBeDefined();
      expect(card.outstanding).toBeDefined();
      expect(card.available).toBeDefined();
    }
    
    const aggregateUtilization = await dashboardPage.getAggregateCreditUtilization();
    expect(aggregateUtilization).toBeDefined();
  });

  test('QE-8903 TS-002 TC-001: Verify system displays error message when backend service is unavailable without crashing', async ({ page }) => {
    await page.route('**/api/creditcards', route => route.abort());
    
    await loginPage.login('testuser@demo.com', 'Test@123');
    await dashboardPage.waitForErrorMessage();
    
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load dashboard data. Please try again.');
    
    const isAppResponsive = await dashboardPage.isApplicationResponsive();
    expect(isAppResponsive).toBe(true);
  });

  test('QE-8903 TS-003 TC-001: Verify system handles credit cards with zero credit limit gracefully', async ({ page }) => {
    await loginPage.login('zerolimituser@demo.com', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.navigateToCreditCardOverview();
    
    const cards = await dashboardPage.getAllCreditCards();
    const zeroLimitCards = cards.filter(card => card.creditLimit === '$0');
    
    expect(zeroLimitCards.length).toBeGreaterThan(0);
    
    for (const card of zeroLimitCards) {
      const utilization = card.utilization;
      expect(utilization === '0%' || utilization === 'N/A').toBe(true);
      expect(utilization).not.toContain('NaN');
      expect(utilization).not.toContain('Infinity');
    }
  });
});
