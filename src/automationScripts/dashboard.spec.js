const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Credit Card Dashboard - Consolidated Portfolio and Monthly Tracker', () => {

  test('TC-8052: Verify consolidated dashboard displays accurate aggregated KPIs for three linked credit cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.authenticate('testuser_threeCards', 'Test@123');
    
    await expect(dashboardPage.totalCreditLimitCard).toBeVisible();
    await expect(dashboardPage.totalAvailableCreditCard).toBeVisible();
    await expect(dashboardPage.totalOutstandingCard).toBeVisible();
    await expect(dashboardPage.totalMonthlySpendCard).toBeVisible();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    const totalOutstanding = await dashboardPage.getTotalOutstanding();
    const totalMonthlySpend = await dashboardPage.getTotalMonthlySpend();
    
    expect(totalCreditLimit).toBe('₹155,000.00');
    expect(totalAvailableCredit).toBe('₹117,000.00');
    expect(totalOutstanding).toBe('₹38,000.00');
    expect(totalMonthlySpend).toBe('₹19,000.00');
    
    const loadTime = await dashboardPage.measureLoadTime();
    expect(loadTime).toBeLessThan(2000);
  });

  test('TC-8053: Verify system displays appropriate error message when credit card data source is unavailable', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.authenticate('testuser', 'Test@123');
    
    await page.route('**/api/creditcards', route => route.abort('failed'));
    
    await dashboardPage.refreshDashboard();
    
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessage();
    expect(errorText).toContain('Service temporarily unavailable');
    
    await expect(dashboardPage.retryButton).toBeVisible();
  });

  test('TC-8054: Verify system displays appropriate message when user has no linked credit cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.authenticate('testuser_noCards', 'Test@123');
    
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const message = await dashboardPage.getNoCardsMessage();
    expect(message).toContain('No credit cards linked');
    
    await expect(dashboardPage.addCardButton).toBeVisible();
    
    const kpiCardsVisible = await dashboardPage.areKPICardsVisible();
    expect(kpiCardsVisible).toBe(false);
  });

  test('TC-8049: Verify monthly spending tracker correctly aggregates total monthly spend across multiple active credit cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.authenticate('testuser_multicard', 'Test@123');
    
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    
    const monthlySpend = await dashboardPage.getTotalMonthlySpend();
    expect(monthlySpend).toBe('₹19,000.00');
    
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(3);
    
    const loadTime = await dashboardPage.measureLoadTime();
    expect(loadTime).toBeLessThan(2000);
  });

  test('TC-8050: Verify system displays partial data warning when one or more credit card data sources are unavailable', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.authenticate('testuser', 'Test@123');
    
    await page.route('**/api/creditcards/CC002', route => route.abort('failed'));
    
    await dashboardPage.refreshDashboard();
    
    await expect(dashboardPage.partialDataWarning).toBeVisible();
    const warningText = await dashboardPage.getPartialDataWarning();
    expect(warningText).toContain('Gold Cashback (CC002)');
    expect(warningText).toContain('temporarily unavailable');
    
    const monthlySpend = await dashboardPage.getTotalMonthlySpend();
    expect(monthlySpend).not.toBe('₹19,000.00');
  });

  test('TC-8051: Verify monthly spending tracker displays zero spending at the beginning of a new month', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.authenticate('testuser', 'Test@123');
    
    await dashboardPage.simulateFirstDayOfMonth();
    
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    
    const monthlySpend = await dashboardPage.getTotalMonthlySpend();
    expect(monthlySpend).toBe('₹0.00');
    
    await expect(dashboardPage.newMonthMessage).toBeVisible();
    const message = await dashboardPage.getNewMonthMessage();
    expect(message).toContain('Start of new month');
  });

});
