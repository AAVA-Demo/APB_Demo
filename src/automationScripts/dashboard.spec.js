const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Credit Card Dashboard - KPI and Real-Time Tracking Tests', () => {

  test('QE-7927 TS-001 TC-001 - Verify aggregated KPIs display correctly for user with multiple active credit cards', async ({ page }) => {
    logger.info('Starting test: QE-7927 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch application and login', async () => {
      await dashboardPage.navigate();
      await dashboardPage.waitForDashboardLoad();
      logger.info('Dashboard loaded successfully');
    });

    await test.step('Verify Monthly Spend KPI', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpendValue();
      await expect(monthlySpend).toBe('$3,250.75');
      logger.info('Monthly Spend KPI verified: $3,250.75');
    });

    await test.step('Verify Total Credit Limit KPI', async () => {
      const creditLimit = await dashboardPage.getTotalCreditLimitValue();
      await expect(creditLimit).toBe('$25,000.00');
      logger.info('Total Credit Limit KPI verified: $25,000.00');
    });

    await test.step('Verify Available Credit KPI', async () => {
      const availableCredit = await dashboardPage.getAvailableCreditValue();
      await expect(availableCredit).toBe('$18,500.00');
      logger.info('Available Credit KPI verified: $18,500.00');
    });

    await test.step('Verify Outstanding Amount KPI', async () => {
      const outstanding = await dashboardPage.getOutstandingAmountValue();
      await expect(outstanding).toBe('$6,500.00');
      logger.info('Outstanding Amount KPI verified: $6,500.00');
    });

    await test.step('Verify last updated timestamp', async () => {
      const timestamp = await dashboardPage.getLastUpdatedTimestamp();
      await expect(timestamp).toContain('Nov 15, 2026');
      logger.info('Timestamp verified');
    });

    await test.step('Verify KPI calculation accuracy', async () => {
      const isCalculationCorrect = await dashboardPage.verifyAvailableCreditCalculation();
      await expect(isCalculationCorrect).toBeTruthy();
      logger.info('KPI calculation verified: $25,000 - $6,500 = $18,500');
    });
  });

  test('QE-7927 TS-001 TC-002 - Verify dashboard loads within 2 seconds for user with multiple cards', async ({ page }) => {
    logger.info('Starting test: QE-7927 TS-001 TC-002');
    const dashboardPage = new DashboardPage(page);
    
    const startTime = Date.now();
    
    await test.step('Launch application and measure load time', async () => {
      await dashboardPage.navigate();
      await dashboardPage.waitForAllKPIsToLoad();
      const loadTime = Date.now() - startTime;
      
      await expect(loadTime).toBeLessThanOrEqual(2000);
      logger.info(`Dashboard loaded in ${loadTime}ms (requirement: ≤2000ms)`);
    });

    await test.step('Verify all KPI widgets are rendered', async () => {
      const allKPIsVisible = await dashboardPage.areAllKPIsVisible();
      await expect(allKPIsVisible).toBeTruthy();
      logger.info('All 4 KPI widgets rendered successfully');
    });

    await test.step('Verify no loading indicators remain', async () => {
      const hasLoadingIndicators = await dashboardPage.hasLoadingIndicators();
      await expect(hasLoadingIndicators).toBeFalsy();
      logger.info('No loading indicators present');
    });
  });

  test('QE-7927 TS-002 TC-001 - Verify dashboard displays appropriate message for user with no credit cards', async ({ page }) => {
    logger.info('Starting test: QE-7927 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch application with no cards user', async () => {
      await dashboardPage.navigateWithUser('newuser-002');
      await dashboardPage.waitForDashboardLoad();
      logger.info('Dashboard loaded for user with no cards');
    });

    await test.step('Verify informational message is displayed', async () => {
      const message = await dashboardPage.getNoCardsMessage();
      await expect(message).toContain('No credit cards registered');
      logger.info('No cards message verified');
    });

    await test.step('Verify Monthly Spend displays zero or N/A', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpendValue();
      await expect(['$0.00', 'N/A']).toContain(monthlySpend);
      logger.info('Monthly Spend shows zero/N/A');
    });

    await test.step('Verify all KPIs display zero or N/A', async () => {
      const allKPIsZeroOrNA = await dashboardPage.areAllKPIsZeroOrNA();
      await expect(allKPIsZeroOrNA).toBeTruthy();
      logger.info('All KPIs show zero or N/A');
    });

    await test.step('Verify Add Credit Card button is displayed', async () => {
      const addCardButtonVisible = await dashboardPage.isAddCardButtonVisible();
      await expect(addCardButtonVisible).toBeTruthy();
      logger.info('Add Credit Card button is visible');
    });

    await test.step('Verify dashboard does not crash', async () => {
      const isDashboardStable = await dashboardPage.isDashboardStable();
      await expect(isDashboardStable).toBeTruthy();
      logger.info('Dashboard remains stable with no cards');
    });
  });

  test('QE-7927 TS-003 TC-001 - Verify dashboard displays error message when backend service is unavailable', async ({ page }) => {
    logger.info('Starting test: QE-7927 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Simulate backend service failure', async () => {
      await dashboardPage.mockBackendServiceFailure();
      logger.info('Backend service failure simulated');
    });

    await test.step('Launch application', async () => {
      await dashboardPage.navigate();
      await dashboardPage.waitForErrorOrDashboard();
      logger.info('Dashboard loaded with error state');
    });

    await test.step('Verify meaningful error message is displayed', async () => {
      const errorMessage = await dashboardPage.getErrorMessage();
      await expect(errorMessage).toContain('Unable to load credit card data');
      await expect(errorMessage).toContain('temporarily unavailable');
      logger.info('Error message verified');
    });

    await test.step('Verify KPI widgets display N/A or placeholder', async () => {
      const allKPIsShowNA = await dashboardPage.areAllKPIsNA();
      await expect(allKPIsShowNA).toBeTruthy();
      logger.info('All KPIs show N/A or placeholder');
    });

    await test.step('Verify application does not crash', async () => {
      const pageVisible = await dashboardPage.isPageVisible();
      await expect(pageVisible).toBeTruthy();
      logger.info('Dashboard page remains visible');
    });

    await test.step('Verify Retry button is displayed', async () => {
      const retryButtonVisible = await dashboardPage.isRetryButtonVisible();
      await expect(retryButtonVisible).toBeTruthy();
      logger.info('Retry button is visible');
    });

    await test.step('Click Retry button', async () => {
      await dashboardPage.clickRetryButton();
      logger.info('Retry button clicked');
    });

    await test.step('Verify no incorrect values displayed', async () => {
      const hasIncorrectValues = await dashboardPage.hasIncorrectKPIValues();
      await expect(hasIncorrectValues).toBeFalsy();
      logger.info('No incorrect KPI values displayed');
    });
  });

  test('QE-7924 TS-001 TC-001 - Verify available credit updates within 2 seconds after transaction', async ({ page }) => {
    logger.info('Starting test: QE-7924 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch application and note initial credit', async () => {
      await dashboardPage.navigate();
      await dashboardPage.waitForDashboardLoad();
      const initialCredit = await dashboardPage.getAvailableCreditValue();
      await expect(initialCredit).toBe('$18,500.00');
      logger.info('Initial available credit: $18,500.00');
    });

    await test.step('Simulate credit card transaction', async () => {
      await dashboardPage.simulateTransaction(150.00, 'Visa ****1234');
      logger.info('Transaction simulated: $150.00');
    });

    await test.step('Refresh dashboard within 2 seconds', async () => {
      await page.waitForTimeout(1000);
      await dashboardPage.refreshDashboard();
      logger.info('Dashboard refreshed after 1 second');
    });

    await test.step('Verify available credit is updated', async () => {
      const updatedCredit = await dashboardPage.getAvailableCreditValue();
      await expect(updatedCredit).toBe('$18,350.00');
      logger.info('Available credit updated to $18,350.00');
    });

    await test.step('Verify outstanding amount increased', async () => {
      const outstanding = await dashboardPage.getOutstandingAmountValue();
      await expect(outstanding).toBe('$6,650.00');
      logger.info('Outstanding amount updated to $6,650.00');
    });

    await test.step('Verify monthly spend increased', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpendValue();
      await expect(monthlySpend).toBe('$3,400.75');
      logger.info('Monthly spend updated to $3,400.75');
    });

    await test.step('Verify timestamp reflects recent refresh', async () => {
      const timestamp = await dashboardPage.getLastUpdatedTimestamp();
      await expect(timestamp).toContain('11:00 AM');
      logger.info('Timestamp updated correctly');
    });
  });

  test('QE-7924 TS-001 TC-002 - Verify real-time data refresh occurs automatically', async ({ page }) => {
    logger.info('Starting test: QE-7924 TS-001 TC-002');
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch application and keep dashboard open', async () => {
      await dashboardPage.navigate();
      await dashboardPage.waitForDashboardLoad();
      logger.info('Dashboard loaded and active');
    });

    await test.step('Simulate background transaction', async () => {
      await dashboardPage.simulateBackgroundTransaction(200.00, 'MasterCard ****5678');
      logger.info('Background transaction simulated: $200.00');
    });

    await test.step('Wait for automatic refresh', async () => {
      await dashboardPage.waitForAutoRefresh(300000);
      logger.info('Waited for auto-refresh interval');
    });

    await test.step('Verify available credit updated automatically', async () => {
      const updatedCredit = await dashboardPage.getAvailableCreditValue();
      await expect(updatedCredit).toBe('$18,300.00');
      logger.info('Available credit auto-updated to $18,300.00');
    });

    await test.step('Verify refresh notification displayed', async () => {
      const hasRefreshNotification = await dashboardPage.hasRefreshNotification();
      await expect(hasRefreshNotification).toBeTruthy();
      logger.info('Refresh notification displayed');
    });
  });

  test('QE-7924 TS-002 TC-001 - Verify staleness indicator when transaction service fails', async ({ page }) => {
    logger.info('Starting test: QE-7924 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch application and note initial state', async () => {
      await dashboardPage.navigate();
      await dashboardPage.waitForDashboardLoad();
      const initialCredit = await dashboardPage.getAvailableCreditValue();
      await expect(initialCredit).toBe('$18,500.00');
      logger.info('Initial state captured');
    });

    await test.step('Simulate transaction service failure', async () => {
      await dashboardPage.mockTransactionServiceFailure();
      logger.info('Transaction service failure simulated');
    });

    await test.step('Complete a transaction', async () => {
      await dashboardPage.simulateTransaction(100.00, 'Visa ****1234');
      logger.info('Transaction initiated: $100.00');
    });

    await test.step('Refresh dashboard', async () => {
      await dashboardPage.refreshDashboard();
      logger.info('Dashboard refreshed');
    });

    await test.step('Verify last known credit is displayed', async () => {
      const credit = await dashboardPage.getAvailableCreditValue();
      await expect(credit).toBe('$18,500.00');
      logger.info('Last known credit value displayed');
    });

    await test.step('Verify staleness warning is displayed', async () => {
      const warning = await dashboardPage.getStalenessWarning();
      await expect(warning).toContain('Unable to retrieve latest balance');
      await expect(warning).toContain('last known value');
      logger.info('Staleness warning verified');
    });

    await test.step('Verify timestamp is highlighted as stale', async () => {
      const isTimestampStale = await dashboardPage.isTimestampMarkedStale();
      await expect(isTimestampStale).toBeTruthy();
      logger.info('Timestamp marked as stale');
    });

    await test.step('Verify Retry button is available', async () => {
      const retryVisible = await dashboardPage.isRetryButtonVisible();
      await expect(retryVisible).toBeTruthy();
      logger.info('Retry button available');
    });

    await test.step('Click Retry button', async () => {
      await dashboardPage.clickRetryButton();
      logger.info('Retry button clicked');
    });
  });

  test('QE-7924 TS-003 TC-001 - Verify over-limit condition handling', async ({ page }) => {
    logger.info('Starting test: QE-7924 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch application with low credit user', async () => {
      await dashboardPage.navigateWithUser('user-006');
      await dashboardPage.waitForDashboardLoad();
      const credit = await dashboardPage.getAvailableCreditValue();
      await expect(credit).toBe('$500.00');
      logger.info('Initial credit: $500.00');
    });

    await test.step('Simulate over-limit transaction', async () => {
      await dashboardPage.simulateTransaction(700.00, 'Visa ****2345');
      logger.info('Over-limit transaction simulated: $700.00');
    });

    await test.step('Refresh dashboard', async () => {
      await dashboardPage.refreshDashboard();
      logger.info('Dashboard refreshed');
    });

    await test.step('Verify available credit does not show negative', async () => {
      const credit = await dashboardPage.getAvailableCreditValue();
      await expect(['$0.00', 'Over Limit']).toContain(credit);
      logger.info('Available credit shows: ' + credit);
    });

    await test.step('Verify over-limit warning is displayed', async () => {
      const warning = await dashboardPage.getOverLimitWarning();
      await expect(warning).toContain('over the credit limit');
      logger.info('Over-limit warning displayed');
    });

    await test.step('Verify over-limit amount is indicated', async () => {
      const overLimitAmount = await dashboardPage.getOverLimitAmount();
      await expect(overLimitAmount).toContain('$200.00');
      logger.info('Over-limit amount: $200.00');
    });

    await test.step('Verify outstanding amount reflects over-limit', async () => {
      const outstanding = await dashboardPage.getOutstandingAmountValue();
      await expect(outstanding).toBe('$5,200.00');
      logger.info('Outstanding amount: $5,200.00');
    });

    await test.step('Verify credit utilization exceeds 100%', async () => {
      const utilization = await dashboardPage.getCreditUtilization();
      await expect(utilization).toBe('104%');
      logger.info('Credit utilization: 104%');
    });

    await test.step('Verify available credit widget shows alert', async () => {
      const hasAlert = await dashboardPage.hasAvailableCreditAlert();
      await expect(hasAlert).toBeTruthy();
      logger.info('Available credit widget shows alert indicator');
    });
  });

});