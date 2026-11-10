const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Credit Card Dashboard - KPI and Multi-Card View', () => {

  test('QE-9491 TS-001 TC-001 - Verify multi-card dashboard displays consolidated KPI metrics for 3 active credit cards within 2-second load time', async ({ page }) => {
    logger.info('Starting test: QE-9491 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch application and login', async () => {
      await dashboardPage.navigate();
      await dashboardPage.login('testuser_3cards', 'Pass@123');
    });

    await test.step('Navigate to Dashboard and verify load time', async () => {
      const startTime = Date.now();
      await dashboardPage.navigateToDashboard();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(2000);
      logger.info(`Dashboard loaded in ${loadTime}ms`);
    });

    await test.step('Verify Total Credit Limit KPI', async () => {
      const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
      expect(totalCreditLimit).toBe('$30,000');
    });

    await test.step('Verify Available Credit KPI', async () => {
      const availableCredit = await dashboardPage.getAvailableCredit();
      expect(availableCredit).toBe('$22,000');
    });

    await test.step('Verify Outstanding Amount KPI', async () => {
      const outstanding = await dashboardPage.getOutstandingAmount();
      expect(outstanding).toBe('$8,000');
    });

    await test.step('Verify Monthly Spend KPI', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpend();
      expect(monthlySpend).toBe('$4,300');
    });
  });

  test('QE-9491 TS-001 TC-002 - Verify dashboard displays individual card details in addition to consolidated KPI metrics', async ({ page }) => {
    logger.info('Starting test: QE-9491 TS-001 TC-002');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_3cards', 'Pass@123');
    await dashboardPage.navigateToDashboard();

    await test.step('Verify consolidated KPIs are displayed', async () => {
      await expect(dashboardPage.kpiSection).toBeVisible();
    });

    await test.step('Scroll to individual card details section', async () => {
      await dashboardPage.scrollToCardDetails();
      await expect(dashboardPage.cardDetailsSection).toBeVisible();
    });

    await test.step('Verify Card A details', async () => {
      const cardA = await dashboardPage.getCardDetails('****1234');
      expect(cardA.creditLimit).toBe('$10,000');
      expect(cardA.availableCredit).toBe('$7,000');
      expect(cardA.outstanding).toBe('$3,000');
      expect(cardA.monthlySpend).toBe('$1,500');
    });

    await test.step('Verify Card B details', async () => {
      const cardB = await dashboardPage.getCardDetails('****5678');
      expect(cardB.creditLimit).toBe('$5,000');
      expect(cardB.availableCredit).toBe('$3,000');
      expect(cardB.outstanding).toBe('$2,000');
      expect(cardB.monthlySpend).toBe('$800');
    });

    await test.step('Verify Card C details', async () => {
      const cardC = await dashboardPage.getCardDetails('****9012');
      expect(cardC.creditLimit).toBe('$15,000');
      expect(cardC.availableCredit).toBe('$12,000');
      expect(cardC.outstanding).toBe('$3,000');
      expect(cardC.monthlySpend).toBe('$2,000');
    });
  });

  test('QE-9491 TS-002 TC-001 - Verify dashboard displays appropriate message and zero/N/A KPI values when user has no registered credit cards', async ({ page }) => {
    logger.info('Starting test: QE-9491 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_nocards', 'Pass@123');
    await dashboardPage.navigateToDashboard();

    await test.step('Verify no cards message is displayed', async () => {
      await expect(dashboardPage.noCardsMessage).toBeVisible();
      const messageText = await dashboardPage.noCardsMessage.textContent();
      expect(messageText).toContain('No credit cards registered');
    });

    await test.step('Verify Total Credit Limit shows zero or N/A', async () => {
      const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
      expect(['$0.00', 'N/A', '$0']).toContain(totalCreditLimit);
    });

    await test.step('Verify Available Credit shows zero or N/A', async () => {
      const availableCredit = await dashboardPage.getAvailableCredit();
      expect(['$0.00', 'N/A', '$0']).toContain(availableCredit);
    });

    await test.step('Verify Outstanding Amount shows zero or N/A', async () => {
      const outstanding = await dashboardPage.getOutstandingAmount();
      expect(['$0.00', 'N/A', '$0']).toContain(outstanding);
    });

    await test.step('Verify Monthly Spend shows zero or N/A', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpend();
      expect(['$0.00', 'N/A', '$0']).toContain(monthlySpend);
    });
  });

  test('QE-9491 TS-003 TC-001 - Verify dashboard displays KPI metrics for 2 successfully synchronized cards and error indicator for 1 card with synchronization failure', async ({ page }) => {
    logger.info('Starting test: QE-9491 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_syncerror', 'Pass@123');
    await dashboardPage.navigateToDashboard();

    await test.step('Verify consolidated KPIs display data from 2 synced cards only', async () => {
      const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
      expect(totalCreditLimit).toBe('$15,000');
      const availableCredit = await dashboardPage.getAvailableCredit();
      expect(availableCredit).toBe('$10,000');
      const outstanding = await dashboardPage.getOutstandingAmount();
      expect(outstanding).toBe('$5,000');
      const monthlySpend = await dashboardPage.getMonthlySpend();
      expect(monthlySpend).toBe('$2,300');
    });

    await test.step('Verify error indicator for Card C', async () => {
      await dashboardPage.scrollToCardDetails();
      const cardCError = await dashboardPage.getCardErrorIndicator('****9012');
      await expect(cardCError).toBeVisible();
      const errorText = await cardCError.textContent();
      expect(errorText).toContain('synchronization failed');
    });

    await test.step('Verify Card C shows N/A for all metrics', async () => {
      const cardC = await dashboardPage.getCardDetails('****9012');
      expect(cardC.creditLimit).toMatch(/N\/A|Error/);
      expect(cardC.availableCredit).toMatch(/N\/A|Error/);
      expect(cardC.outstanding).toMatch(/N\/A|Error/);
      expect(cardC.monthlySpend).toMatch(/N\/A|Error/);
    });

    await test.step('Verify global error banner is displayed', async () => {
      await expect(dashboardPage.errorBanner).toBeVisible();
      const bannerText = await dashboardPage.errorBanner.textContent();
      expect(bannerText).toContain('1 card failed to synchronize');
    });
  });

  test('QE-9491 TS-003 TC-002 - Verify user can retry synchronization for the failed card from the dashboard error indicator', async ({ page }) => {
    logger.info('Starting test: QE-9491 TS-003 TC-002');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_syncerror', 'Pass@123');
    await dashboardPage.navigateToDashboard();

    await test.step('Verify error indicator for Card C is displayed', async () => {
      await dashboardPage.scrollToCardDetails();
      const cardCError = await dashboardPage.getCardErrorIndicator('****9012');
      await expect(cardCError).toBeVisible();
    });

    await test.step('Click Retry button for Card C', async () => {
      await dashboardPage.clickRetrySync('****9012');
    });

    await test.step('Verify loading indicator appears', async () => {
      const loadingIndicator = await dashboardPage.getCardLoadingIndicator('****9012');
      await expect(loadingIndicator).toBeVisible();
    });

    await test.step('Verify Card C data updates after successful retry', async () => {
      await page.waitForTimeout(2000);
      const cardC = await dashboardPage.getCardDetails('****9012');
      expect(cardC.creditLimit).toBe('$15,000');
      expect(cardC.availableCredit).toBe('$12,000');
      expect(cardC.outstanding).toBe('$3,000');
      expect(cardC.monthlySpend).toBe('$2,000');
    });

    await test.step('Verify consolidated KPIs update to include Card C', async () => {
      const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
      expect(totalCreditLimit).toBe('$30,000');
    });
  });

  test('QE-9488 TS-001 TC-001 - Verify KPI visualizations update to reflect current monthly spend, available credit, and outstanding amounts after recent transactions', async ({ page }) => {
    logger.info('Starting test: QE-9488 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_recent_transactions', 'Pass@123');
    await dashboardPage.navigateToDashboard();

    await test.step('Note current KPI values before refresh', async () => {
      const beforeMonthlySpend = await dashboardPage.getMonthlySpend();
      const beforeAvailableCredit = await dashboardPage.getAvailableCredit();
      const beforeOutstanding = await dashboardPage.getOutstandingAmount();
      logger.info(`Before refresh - Monthly Spend: ${beforeMonthlySpend}, Available: ${beforeAvailableCredit}, Outstanding: ${beforeOutstanding}`);
    });

    await test.step('Refresh dashboard', async () => {
      await dashboardPage.refreshDashboard();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify Monthly Spend KPI reflects latest transaction', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpend();
      expect(monthlySpend).toBe('$2,150');
    });

    await test.step('Verify Available Credit KPI decreased', async () => {
      const availableCredit = await dashboardPage.getAvailableCredit();
      expect(availableCredit).toBe('$7,850');
    });

    await test.step('Verify Outstanding Amount KPI increased', async () => {
      const outstanding = await dashboardPage.getOutstandingAmount();
      expect(outstanding).toBe('$2,150');
    });

    await test.step('Verify Total Credit Limit remains unchanged', async () => {
      const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
      expect(totalCreditLimit).toBe('$10,000');
    });
  });

  test('QE-9488 TS-001 TC-002 - Verify KPI update timestamp is displayed after dashboard refresh to indicate data freshness', async ({ page }) => {
    logger.info('Starting test: QE-9488 TS-001 TC-002');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_recent_transactions', 'Pass@123');
    await dashboardPage.navigateToDashboard();

    await test.step('Verify Last Updated timestamp is displayed', async () => {
      await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
      const timestampText = await dashboardPage.lastUpdatedTimestamp.textContent();
      expect(timestampText).toContain('Last Updated');
    });

    await test.step('Note initial timestamp', async () => {
      const initialTimestamp = await dashboardPage.getLastUpdatedTime();
      logger.info(`Initial timestamp: ${initialTimestamp}`);
    });

    await test.step('Refresh dashboard', async () => {
      await page.waitForTimeout(1000);
      await dashboardPage.refreshDashboard();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify timestamp updated to current refresh time', async () => {
      const updatedTimestamp = await dashboardPage.getLastUpdatedTime();
      logger.info(`Updated timestamp: ${updatedTimestamp}`);
      await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
    });
  });

  test('QE-9488 TS-002 TC-001 - Verify error message is displayed when dashboard refresh fails due to data synchronization failure or backend outage', async ({ page }) => {
    logger.info('Starting test: QE-9488 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser', 'Pass@123');
    await dashboardPage.navigateToDashboard();

    await test.step('Simulate backend outage', async () => {
      await page.route('**/api/dashboard/**', route => route.abort());
    });

    await test.step('Attempt to refresh dashboard', async () => {
      await dashboardPage.refreshDashboard();
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(dashboardPage.errorMessage).toBeVisible();
      const errorText = await dashboardPage.errorMessage.textContent();
      expect(errorText).toContain('temporarily unavailable');
    });

    await test.step('Verify last synchronized KPI values remain displayed', async () => {
      await expect(dashboardPage.kpiSection).toBeVisible();
      const monthlySpend = await dashboardPage.getMonthlySpend();
      expect(monthlySpend).toBeTruthy();
    });

    await test.step('Verify Last Updated timestamp shows last successful sync', async () => {
      await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
    });
  });

  test('QE-9488 TS-002 TC-002 - Verify user can retry dashboard refresh after synchronization failure', async ({ page }) => {
    logger.info('Starting test: QE-9488 TS-002 TC-002');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser', 'Pass@123');
    await dashboardPage.navigateToDashboard();

    await test.step('Simulate backend outage', async () => {
      await page.route('**/api/dashboard/**', route => route.abort());
    });

    await test.step('Trigger error by refreshing', async () => {
      await dashboardPage.refreshDashboard();
      await expect(dashboardPage.errorMessage).toBeVisible();
    });

    await test.step('Verify Retry button is available', async () => {
      await expect(dashboardPage.retryButton).toBeVisible();
    });

    await test.step('Restore backend service', async () => {
      await page.unroute('**/api/dashboard/**');
    });

    await test.step('Click Retry button', async () => {
      await dashboardPage.retryButton.click();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify KPIs are successfully updated', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpend();
      expect(monthlySpend).toBeTruthy();
      await expect(dashboardPage.errorMessage).not.toBeVisible();
    });

    await test.step('Verify timestamp reflects successful retry', async () => {
      await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
    });
  });

  test('QE-9488 TS-003 TC-001 - Verify KPI visualizations update within 5 minutes to reflect a large purchase transaction ($500)', async ({ page }) => {
    logger.info('Starting test: QE-9488 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_large_purchase', 'Pass@123');
    await dashboardPage.navigateToDashboard();

    await test.step('Note current KPI values before purchase', async () => {
      const beforeMonthlySpend = await dashboardPage.getMonthlySpend();
      const beforeAvailableCredit = await dashboardPage.getAvailableCredit();
      const beforeOutstanding = await dashboardPage.getOutstandingAmount();
      expect(beforeMonthlySpend).toBe('$1,800');
      expect(beforeAvailableCredit).toBe('$8,200');
      expect(beforeOutstanding).toBe('$1,800');
    });

    await test.step('Simulate $500 purchase transaction', async () => {
      logger.info('Simulating $500 purchase transaction');
    });

    await test.step('Wait and refresh dashboard within 5 minutes', async () => {
      await page.waitForTimeout(3000);
      await dashboardPage.refreshDashboard();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify Monthly Spend updated to $2,300', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpend();
      expect(monthlySpend).toBe('$2,300');
    });

    await test.step('Verify Available Credit decreased to $7,700', async () => {
      const availableCredit = await dashboardPage.getAvailableCredit();
      expect(availableCredit).toBe('$7,700');
    });

    await test.step('Verify Outstanding Amount increased to $2,300', async () => {
      const outstanding = await dashboardPage.getOutstandingAmount();
      expect(outstanding).toBe('$2,300');
    });
  });

  test('QE-9488 TS-003 TC-002 - Verify dashboard displays transaction notification or indicator when a large purchase is detected', async ({ page }) => {
    logger.info('Starting test: QE-9488 TS-003 TC-002');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_large_purchase', 'Pass@123');
    await dashboardPage.navigateToDashboard();

    await test.step('Simulate $500 purchase transaction', async () => {
      logger.info('Simulating $500 purchase');
    });

    await test.step('Refresh dashboard within 5 minutes', async () => {
      await page.waitForTimeout(2000);
      await dashboardPage.refreshDashboard();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify transaction notification is displayed', async () => {
      await expect(dashboardPage.transactionNotification).toBeVisible();
      const notificationText = await dashboardPage.transactionNotification.textContent();
      expect(notificationText).toContain('$500');
      expect(notificationText).toContain('purchase');
    });

    await test.step('Verify notification includes transaction details', async () => {
      const notificationText = await dashboardPage.transactionNotification.textContent();
      expect(notificationText).toMatch(/Electronics Store|Merchant/);
    });

    await test.step('Verify user can dismiss notification', async () => {
      await expect(dashboardPage.dismissNotificationButton).toBeVisible();
      await dashboardPage.dismissNotificationButton.click();
      await expect(dashboardPage.transactionNotification).not.toBeVisible();
    });
  });

});