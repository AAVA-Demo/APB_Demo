const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Credit Card Dashboard - Portfolio Management and KPIs', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  // QE-7638 TS-001 TC-001
  test('TC-001: Verify user with multiple registered credit cards can view all cards with complete details', async ({ page }) => {
    await expect(dashboardPage.navigationMenu).toBeVisible();
    await dashboardPage.navigateToPortfolioDashboard();
    
    await expect(dashboardPage.kpiSection).toBeVisible();
    await expect(dashboardPage.cardListSection).toBeVisible();
    
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(4);
    
    const cardTypes = await dashboardPage.getAllCardTypes();
    expect(cardTypes).toContain('Visa');
    expect(cardTypes).toContain('MasterCard');
    expect(cardTypes).toContain('American Express');
    expect(cardTypes).toContain('Discover');
    
    const issuers = await dashboardPage.getAllIssuers();
    expect(issuers).toContain('Chase');
    expect(issuers).toContain('Citi');
    expect(issuers).toContain('Amex');
    expect(issuers).toContain('Discover');
    
    const creditLimits = await dashboardPage.getAllCreditLimits();
    expect(creditLimits).toContain('$10,000.00');
    expect(creditLimits).toContain('$15,000.00');
    expect(creditLimits).toContain('$20,000.00');
    expect(creditLimits).toContain('$8,000.00');
    
    const balances = await dashboardPage.getAllCurrentBalances();
    expect(balances).toContain('$3,500.00');
    expect(balances).toContain('$5,000.00');
    expect(balances).toContain('$8,000.00');
    expect(balances).toContain('$2,000.00');
  });

  // QE-7638 TS-002 TC-001
  test('TC-002: Verify user with no registered credit cards receives appropriate empty state message', async ({ page }) => {
    await dashboardPage.loginWithNoCards('user_no_cards', 'Test@123');
    await expect(dashboardPage.navigationMenu).toBeVisible();
    
    await dashboardPage.navigateToPortfolioDashboard();
    await expect(dashboardPage.kpiSection).toBeVisible();
    
    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    expect(monthlySpend).toBe('$0.00');
    
    await expect(dashboardPage.emptyStateMessage).toBeVisible();
    const emptyMessage = await dashboardPage.emptyStateMessage.textContent();
    expect(emptyMessage).toContain('No credit cards available to display');
    
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(0);
  });

  // QE-7638 TS-003 TC-001
  test('TC-003: Verify user with 20 registered credit cards can view all cards within 2-second performance threshold', async ({ page }) => {
    await dashboardPage.loginWithMaxCards('user_max_cards', 'Test@123');
    await expect(dashboardPage.navigationMenu).toBeVisible();
    
    const startTime = Date.now();
    await dashboardPage.navigateToPortfolioDashboard();
    
    await dashboardPage.waitForAllCardsToLoad(20);
    const loadTime = Date.now() - startTime;
    
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(20);
    
    expect(loadTime).toBeLessThan(2000);
    
    const allCardsHaveDetails = await dashboardPage.verifyAllCardsHaveCompleteDetails();
    expect(allCardsHaveDetails).toBe(true);
  });

  // QE-7634 TS-001 TC-001
  test('TC-004: Verify user with multiple credit cards can view aggregated KPI cards with accurate calculated totals', async ({ page }) => {
    await dashboardPage.loginWithMultipleCards('user_multiple_cards', 'Test@123');
    await expect(dashboardPage.navigationMenu).toBeVisible();
    
    await dashboardPage.navigateToPortfolioDashboard();
    await expect(dashboardPage.kpiSection).toBeVisible();
    
    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    expect(monthlySpend).toBe('$6,500.00');
    
    const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    expect(totalCreditLimit).toBe('$45,000.00');
    
    const availableCredit = await dashboardPage.getKPIValue('Available Credit');
    expect(availableCredit).toBe('$28,500.00');
    
    const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');
    expect(outstandingAmount).toBe('$16,500.00');
  });

  // QE-7634 TS-002 TC-001
  test('TC-005: Verify KPI cards display $0.00 values correctly when user has credit cards with zero balances', async ({ page }) => {
    await dashboardPage.loginWithZeroBalance('user_zero_balance', 'Test@123');
    await expect(dashboardPage.navigationMenu).toBeVisible();
    
    await dashboardPage.navigateToPortfolioDashboard();
    await expect(dashboardPage.kpiSection).toBeVisible();
    
    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    expect(monthlySpend).toBe('$0.00');
    
    const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');
    expect(outstandingAmount).toBe('$0.00');
    
    await expect(dashboardPage.page.locator('.error, .exception')).toHaveCount(0);
  });

  // QE-7634 TS-003 TC-001
  test('TC-006: Verify all four KPI cards load and render within 2 seconds with correctly formatted currency values', async ({ page }) => {
    const startTime = Date.now();
    await dashboardPage.navigateToPortfolioDashboard();
    
    await dashboardPage.waitForAllKPIsToLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    
    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    expect(monthlySpend).toMatch(/^\$[\d,]+\.\d{2}$/);
    
    const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    expect(totalCreditLimit).toMatch(/^\$[\d,]+\.\d{2}$/);
    
    const availableCredit = await dashboardPage.getKPIValue('Available Credit');
    expect(availableCredit).toMatch(/^\$[\d,]+\.\d{2}$/);
    
    const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');
    expect(outstandingAmount).toMatch(/^\$[\d,]+\.\d{2}$/);
  });
});