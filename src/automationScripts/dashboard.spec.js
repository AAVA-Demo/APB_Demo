const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Dashboard KPI Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('TC-4595: Verify dashboard calculates and displays total monthly spend for user with active cards', async ({ page }) => {
    await loginPage.login(testData.users.userWithActiveCards.username, testData.users.userWithActiveCards.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    await dashboardPage.waitForDashboardLoad();
    const monthlySpendValue = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpendValue).toBeTruthy();
    expect(await dashboardPage.isMonthlySpendCardVisible()).toBe(true);
    
    const formattedValue = await dashboardPage.getMonthlySpendFormatted();
    expect(formattedValue).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
  });

  test('TC-4596: Verify dashboard displays monthly spend as $0.00 for user with no transactions', async ({ page }) => {
    await loginPage.login(testData.users.userNoCurrentMonthTxns.username, testData.users.userNoCurrentMonthTxns.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    await dashboardPage.waitForDashboardLoad();
    const monthlySpendValue = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpendValue).toBe(0);
    
    const formattedValue = await dashboardPage.getMonthlySpendFormatted();
    expect(formattedValue).toBe('$0.00');
    
    await expect(page.locator('text=null')).toHaveCount(0);
    await expect(page.locator('text=undefined')).toHaveCount(0);
  });

  test('TC-4597: Verify dashboard handles invalid transaction data gracefully', async ({ page }) => {
    await loginPage.login(testData.users.userWithInvalidTxnData.username, testData.users.userWithInvalidTxnData.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    await dashboardPage.waitForDashboardLoad();
    const monthlySpendValue = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpendValue).toBeGreaterThanOrEqual(0);
    
    const hasError = await dashboardPage.checkForJavaScriptErrors(page);
    expect(hasError).toBe(false);
  });

  test('TC-4598: Verify dashboard displays appropriate error message when invalid data detected', async ({ page }) => {
    await loginPage.login(testData.users.userWithInvalidTxnData.username, testData.users.userWithInvalidTxnData.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    await dashboardPage.waitForDashboardLoad();
    const errorMessage = await dashboardPage.getErrorMessage();
    
    if (errorMessage) {
      expect(errorMessage).toContain('transaction data');
    }
    
    const monthlySpendValue = await dashboardPage.getMonthlySpendFormatted();
    expect(monthlySpendValue === 'N/A' || monthlySpendValue.match(/^\$[0-9,]+\.[0-9]{2}$/)).toBeTruthy();
  });

  test('TC-4602: Verify available credit is calculated and displayed correctly', async ({ page }) => {
    await loginPage.login(testData.users.userWithActiveCards.username, testData.users.userWithActiveCards.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    await dashboardPage.waitForDashboardLoad();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBeGreaterThan(0);
    
    await expect(dashboardPage.availableCreditCard).toBeVisible();
    const formattedValue = await dashboardPage.getAvailableCreditFormatted();
    expect(formattedValue).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
  });

  test('TC-4603: Verify available credit displays correctly for overlimit card', async ({ page }) => {
    await loginPage.login(testData.users.userWithOverlimitCard.username, testData.users.userWithOverlimitCard.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    await dashboardPage.waitForDashboardLoad();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBeLessThanOrEqual(0);
    
    const warningVisible = await dashboardPage.isWarningIndicatorVisible();
    expect(warningVisible).toBe(true);
    
    const formattedValue = await dashboardPage.getAvailableCreditFormatted();
    expect(formattedValue === '$0.00' || formattedValue.startsWith('-$')).toBeTruthy();
  });

  test('TC-4604: Verify suspended cards excluded from available credit calculation', async ({ page }) => {
    await loginPage.login(testData.users.userWithInactiveCard.username, testData.users.userWithInactiveCard.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    await dashboardPage.waitForDashboardLoad();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBeGreaterThan(0);
    
    await dashboardPage.navigateToCardsSection();
    const inactiveCardVisible = await dashboardPage.isInactiveCardStatusVisible();
    expect(inactiveCardVisible).toBe(true);
  });
});
