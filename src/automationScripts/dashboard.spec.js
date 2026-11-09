const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Credit Card Dashboard - KPI and Portfolio Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Starting dashboard test setup');
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    logger.info('User authenticated successfully');
  });

  test('QE-8513 TS-001 TC-001: Verify consolidated KPI dashboard loads within 2 seconds and displays accurate aggregated KPIs', async ({ page }) => {
    logger.info('Test Case: QE-8513 TS-001 TC-001 - KPI Dashboard Load Performance');
    const startTime = Date.now();
    
    await dashboardPage.navigate();
    await expect(dashboardPage.kpiSection).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    logger.info(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const totalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    const availableCredit = await dashboardPage.getKPIValue('availableCredit');
    const outstanding = await dashboardPage.getKPIValue('outstanding');
    
    logger.info(`KPI Values - Monthly Spend: ${monthlySpend}, Total Credit Limit: ${totalCreditLimit}, Available Credit: ${availableCredit}, Outstanding: ${outstanding}`);
    
    expect(parseFloat(monthlySpend.replace(/[^0-9.]/g, ''))).toBeGreaterThanOrEqual(0);
    expect(parseFloat(totalCreditLimit.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(availableCredit.replace(/[^0-9.]/g, ''))).toBeGreaterThanOrEqual(0);
    expect(parseFloat(outstanding.replace(/[^0-9.]/g, ''))).toBeGreaterThanOrEqual(0);
  });

  test('QE-8513 TS-002 TC-001: Verify system displays error message when backend credit card data service is unavailable', async ({ page }) => {
    logger.info('Test Case: QE-8513 TS-002 TC-001 - Backend Service Unavailable');
    
    await page.route('**/api/creditcards', route => {
      route.fulfill({ status: 503, body: 'Service Unavailable' });
    });
    
    await dashboardPage.navigate();
    
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load credit card data');
    
    await expect(dashboardPage.retryButton).toBeVisible();
    logger.info('Error message and retry button displayed correctly');
  });

  test('QE-8513 TS-003 TC-001: Verify system correctly displays all KPI values as zero for user with zero balance credit cards', async ({ page }) => {
    logger.info('Test Case: QE-8513 TS-003 TC-001 - Zero Balance Credit Cards');
    
    await loginPage.navigate();
    await loginPage.login('newuser@example.com', 'Pass@123');
    
    await dashboardPage.navigate();
    await expect(dashboardPage.kpiSection).toBeVisible();
    
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const outstanding = await dashboardPage.getKPIValue('outstanding');
    const availableCredit = await dashboardPage.getKPIValue('availableCredit');
    const totalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    
    expect(monthlySpend).toContain('$0.00');
    expect(outstanding).toContain('$0.00');
    
    const availableCreditValue = parseFloat(availableCredit.replace(/[^0-9.]/g, ''));
    const totalCreditLimitValue = parseFloat(totalCreditLimit.replace(/[^0-9.]/g, ''));
    expect(availableCreditValue).toBe(totalCreditLimitValue);
    
    await expect(dashboardPage.errorMessage).not.toBeVisible();
    logger.info('Zero balance KPIs displayed correctly without errors');
  });

  test('QE-8512 TS-001 TC-001: Verify multi-card portfolio dashboard displays all registered credit cards with complete details', async ({ page }) => {
    logger.info('Test Case: QE-8512 TS-001 TC-001 - Multi-Card Portfolio Display');
    
    await dashboardPage.navigate();
    await expect(dashboardPage.portfolioSection).toBeVisible();
    
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);
    logger.info(`Total credit cards displayed: ${cardCount}`);
    
    const firstCard = await dashboardPage.getCreditCardDetails(0);
    expect(firstCard.cardType).toBeTruthy();
    expect(firstCard.maskedCardNumber).toMatch(/\*{4} \*{4} \*{4} \d{4}/);
    expect(firstCard.creditLimit).toBeTruthy();
    expect(firstCard.availableCredit).toBeTruthy();
    expect(firstCard.outstanding).toBeTruthy();
    expect(firstCard.monthlySpend).toBeTruthy();
    
    logger.info(`First card details: ${JSON.stringify(firstCard)}`);
    
    await dashboardPage.verifyResponsiveLayout(page);
    logger.info('Responsive layout verified across device types');
  });

  test('QE-8512 TS-002 TC-001: Verify system denies access with 401 Unauthorized when user attempts to access portfolio dashboard without valid authentication', async ({ page, context }) => {
    logger.info('Test Case: QE-8512 TS-002 TC-001 - Unauthorized Access');
    
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
    
    const response = await page.goto(process.env.BASE_URL + '/dashboard');
    
    expect(response.status()).toBe(401);
    
    await expect(page).toHaveURL(/.*login/);
    
    await expect(page.locator('text=Unauthorized access')).toBeVisible();
    logger.info('Unauthorized access correctly denied and redirected to login');
  });

  test('QE-8512 TS-003 TC-001: Verify system displays empty portfolio view with informational message when user has no registered credit cards', async ({ page }) => {
    logger.info('Test Case: QE-8512 TS-003 TC-001 - Empty Portfolio');
    
    await loginPage.navigate();
    await loginPage.login('newuser@example.com', 'Pass@123');
    
    await dashboardPage.navigate();
    await expect(dashboardPage.portfolioSection).toBeVisible();
    
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(0);
    
    await expect(dashboardPage.emptyPortfolioMessage).toBeVisible();
    const messageText = await dashboardPage.emptyPortfolioMessage.textContent();
    expect(messageText).toContain('No credit cards registered');
    
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const totalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    const availableCredit = await dashboardPage.getKPIValue('availableCredit');
    const outstanding = await dashboardPage.getKPIValue('outstanding');
    
    expect(monthlySpend).toContain('$0.00');
    expect(totalCreditLimit).toContain('$0.00');
    expect(availableCredit).toContain('$0.00');
    expect(outstanding).toContain('$0.00');
    
    logger.info('Empty portfolio displayed correctly with all KPIs as zero');
  });
});
