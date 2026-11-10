const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard Financial KPIs and Consolidated Metrics', () => {
  let loginPage, dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-10356 TS-001 TC-001: Verify dashboard KPIs display correctly for user with 3 active credit cards', async ({ page }) => {
    logger.info('Test Case: QE-10356 TS-001 TC-001 - Dashboard KPIs with 3 active cards');
    
    await loginPage.login('testuser_3cards', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible({ timeout: 2000 });
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    expect(monthlySpend).toContain('33,000');
    logger.info('Monthly Spend KPI validated: ' + monthlySpend);
    
    const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    expect(totalCreditLimit).toContain('225,000');
    logger.info('Total Credit Limit KPI validated: ' + totalCreditLimit);
    
    const availableCredit = await dashboardPage.getKPIValue('Available Credit');
    expect(availableCredit).toContain('145,500');
    logger.info('Available Credit KPI validated: ' + availableCredit);
    
    const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');
    expect(outstandingAmount).toContain('79,500');
    logger.info('Outstanding Amount KPI validated: ' + outstandingAmount);
    
    await dashboardPage.verifyKPIFormatting();
    logger.info('All KPI values are formatted correctly with currency symbols');
  });

  test('QE-10356 TS-002 TC-001: Verify dashboard handles user with no active credit cards gracefully', async ({ page }) => {
    logger.info('Test Case: QE-10356 TS-002 TC-001 - Dashboard with no cards');
    
    await loginPage.login('testuser_nocards', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    expect(monthlySpend === '$0.00' || monthlySpend === 'N/A').toBeTruthy();
    logger.info('Monthly Spend KPI shows zero or N/A: ' + monthlySpend);
    
    const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    expect(totalCreditLimit === '$0.00' || totalCreditLimit === 'N/A').toBeTruthy();
    
    const availableCredit = await dashboardPage.getKPIValue('Available Credit');
    expect(availableCredit === '$0.00' || availableCredit === 'N/A').toBeTruthy();
    
    const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');
    expect(outstandingAmount === '$0.00' || outstandingAmount === 'N/A').toBeTruthy();
    
    const consoleErrors = await dashboardPage.checkConsoleErrors(page);
    expect(consoleErrors.length).toBe(0);
    logger.info('No console errors detected');
  });

  test('QE-10356 TS-003 TC-001: Verify dashboard displays error message when backend aggregation service is unavailable', async ({ page }) => {
    logger.info('Test Case: QE-10356 TS-003 TC-001 - Backend service unavailable');
    
    await page.route('**/api/cards/aggregated', route => route.abort('failed'));
    
    await loginPage.login('testuser_3cards', 'Pass@123');
    
    await expect(dashboardPage.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await dashboardPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load dashboard data');
    logger.info('Error message displayed: ' + errorText);
    
    await dashboardPage.verifyNoStaleKPIValues();
    logger.info('No stale KPI values displayed');
    
    await expect(dashboardPage.retryButton).toBeVisible();
    logger.info('Retry button is available');
  });

  test('QE-10353 TS-001 TC-001: Verify consolidated multi-card metrics are calculated correctly for 3 cards', async ({ page }) => {
    logger.info('Test Case: QE-10353 TS-001 TC-001 - Consolidated metrics for 3 cards');
    
    await loginPage.login('testuser_3cards', 'Pass@123');
    await dashboardPage.navigateToDashboardOverview();
    
    const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    expect(totalCreditLimit).toContain('225,000');
    logger.info('Total Credit Limit validated: ' + totalCreditLimit);
    
    const availableCredit = await dashboardPage.getKPIValue('Available Credit');
    expect(availableCredit).toContain('145,500');
    logger.info('Total Available Credit validated: ' + availableCredit);
    
    const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');
    expect(outstandingAmount).toContain('79,500');
    logger.info('Total Outstanding Amount validated: ' + outstandingAmount);
  });

  test('QE-10353 TS-002 TC-001: Verify consolidated metrics handle negative balance (refund/credit) correctly', async ({ page }) => {
    logger.info('Test Case: QE-10353 TS-002 TC-001 - Negative balance handling');
    
    await loginPage.login('testuser_negativebalance', 'Pass@123');
    await dashboardPage.navigateToDashboardOverview();
    
    const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    expect(totalCreditLimit).toContain('150,000');
    
    const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');
    expect(outstandingAmount).toContain('5,000');
    
    const availableCredit = await dashboardPage.getKPIValue('Available Credit');
    expect(availableCredit).toContain('155,000');
    logger.info('Available credit exceeds limit due to refund: ' + availableCredit);
    
    await expect(dashboardPage.errorMessage).not.toBeVisible();
    logger.info('No validation errors displayed for negative balance');
  });

  test('QE-10353 TS-003 TC-001: Verify multi-currency card aggregation displays error or converts to base currency', async ({ page }) => {
    logger.info('Test Case: QE-10353 TS-003 TC-001 - Multi-currency aggregation');
    
    await loginPage.login('testuser_multicurrency', 'Pass@123');
    await dashboardPage.navigateToDashboardOverview();
    
    const isErrorDisplayed = await dashboardPage.errorMessage.isVisible();
    const isConversionIndicatorDisplayed = await dashboardPage.conversionIndicator.isVisible();
    
    expect(isErrorDisplayed || isConversionIndicatorDisplayed).toBeTruthy();
    
    if (isErrorDisplayed) {
      const errorText = await dashboardPage.errorMessage.textContent();
      expect(errorText).toContain('Multi-currency aggregation not supported');
      logger.info('Multi-currency error displayed: ' + errorText);
    } else {
      const conversionText = await dashboardPage.conversionIndicator.textContent();
      expect(conversionText).toContain('USD');
      expect(conversionText).toContain('converted');
      logger.info('Currency conversion indicator displayed: ' + conversionText);
      
      await expect(dashboardPage.conversionRatesInfo).toBeVisible();
      const ratesText = await dashboardPage.conversionRatesInfo.textContent();
      expect(ratesText).toContain('EUR');
      expect(ratesText).toContain('GBP');
      logger.info('Conversion rates displayed: ' + ratesText);
    }
  });
});
