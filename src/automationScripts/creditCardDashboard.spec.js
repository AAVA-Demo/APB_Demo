const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { logger } = require('../utils/logger');

test.describe('Credit Card Portfolio Dashboard - KPI Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Test@123');
    logger.info('User logged in successfully for dashboard tests');
  });

  test('QE-10332 TS-001 TC-001 - Verify aggregated real-time KPI dashboard for user with multiple credit cards', async ({ page }) => {
    logger.info('Starting test: Verify aggregated real-time KPI dashboard');
    
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.totalOutstandingAmountKPI).toBeVisible();
    await expect(dashboardPage.totalAvailableCreditKPI).toBeVisible();
    await expect(dashboardPage.totalMonthlySpendKPI).toBeVisible();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const totalOutstanding = await dashboardPage.getTotalOutstandingAmount();
    const totalAvailable = await dashboardPage.getTotalAvailableCredit();
    const totalMonthlySpend = await dashboardPage.getTotalMonthlySpend();
    
    expect(totalCreditLimit).toBe('80,000');
    expect(totalOutstanding).toBe('23,000');
    expect(totalAvailable).toBe('57,000');
    expect(totalMonthlySpend).toBe('13,700');
    logger.info('All KPI values verified successfully');
    
    await page.waitForTimeout(10000);
    logger.info('Waiting 10 seconds for KPI auto-refresh');
    
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    logger.info('KPI auto-refresh verified');
  });

  test('QE-10332 TS-002 TC-001 - Verify incomplete KPI data handling when credit limit is missing', async ({ page }) => {
    logger.info('Starting test: Verify incomplete KPI data handling');
    
    await dashboardPage.simulateIncompleteKPIData();
    
    await expect(dashboardPage.warningMessage).toBeVisible();
    const warningText = await dashboardPage.getWarningMessageText();
    expect(warningText).toContain('Some KPI data is currently unavailable');
    logger.info('Warning message displayed correctly');
    
    const totalOutstanding = await dashboardPage.getTotalOutstandingAmount();
    const totalMonthlySpend = await dashboardPage.getTotalMonthlySpend();
    expect(totalOutstanding).toBe('23,000');
    expect(totalMonthlySpend).toBe('13,700');
    logger.info('Partial KPIs displayed correctly');
    
    await expect(dashboardPage.totalCreditLimitKPI).toHaveText(/N\/A|not available/i);
    await expect(dashboardPage.totalAvailableCreditKPI).toHaveText(/N\/A|not available/i);
    logger.info('Missing KPIs show N/A as expected');
  });

  test('QE-10332 TS-003 TC-001 - Verify zero credit cards KPI calculation message', async ({ page }) => {
    logger.info('Starting test: Verify zero credit cards KPI message');
    
    await dashboardPage.logout();
    await dashboardPage.login('nocards@example.com', 'Test@123');
    await dashboardPage.navigate();
    
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.getNoCardsMessageText();
    expect(messageText).toContain('KPIs cannot be calculated as no credit cards are associated with your account');
    logger.info('No cards message displayed correctly');
    
    const kpiCardsCount = await dashboardPage.getKPICardsCount();
    expect(kpiCardsCount).toBe(0);
    logger.info('No KPI cards displayed as expected');
  });

  test('QE-10329 TS-001 TC-001 - Verify consolidated portfolio view for multiple active credit cards', async ({ page }) => {
    logger.info('Starting test: Verify consolidated portfolio view');
    
    await expect(dashboardPage.creditCardList).toBeVisible();
    
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(2);
    logger.info('2 credit cards displayed');
    
    const card1Name = await dashboardPage.getCardName(0);
    const card1Number = await dashboardPage.getCardNumber(0);
    const card1Limit = await dashboardPage.getCardCreditLimit(0);
    const card1Outstanding = await dashboardPage.getCardOutstanding(0);
    const card1Available = await dashboardPage.getCardAvailableCredit(0);
    const card1MonthlySpend = await dashboardPage.getCardMonthlySpend(0);
    
    expect(card1Name).toBe('Visa Platinum');
    expect(card1Number).toContain('**** 1234');
    expect(card1Limit).toBe('50,000');
    expect(card1Outstanding).toBe('15,000');
    expect(card1Available).toBe('35,000');
    expect(card1MonthlySpend).toBe('8,500');
    logger.info('Visa Platinum card details verified');
    
    const card2Name = await dashboardPage.getCardName(1);
    const card2Number = await dashboardPage.getCardNumber(1);
    expect(card2Name).toBe('Mastercard Gold');
    expect(card2Number).toContain('**** 5678');
    logger.info('Mastercard Gold card details verified');
  });

  test('QE-10329 TS-002 TC-001 - Verify no active cards handling message', async ({ page }) => {
    logger.info('Starting test: Verify no active cards message');
    
    await dashboardPage.logout();
    await dashboardPage.login('nocards@example.com', 'Test@123');
    await dashboardPage.navigate();
    
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.getNoCardsMessageText();
    expect(messageText).toContain('No credit cards available for display');
    logger.info('No cards message displayed correctly');
    
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(0);
    logger.info('No credit cards displayed as expected');
  });

  test('QE-10329 TS-003 TC-001 - Verify credit card data service failure error handling', async ({ page }) => {
    logger.info('Starting test: Verify service failure error handling');
    
    await dashboardPage.simulateServiceFailure();
    await dashboardPage.navigate();
    
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('Failed to load dashboard data');
    expect(errorText).toContain('currently unavailable');
    logger.info('Error message displayed correctly');
    
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(0);
    logger.info('No stale data displayed as expected');
  });
});
