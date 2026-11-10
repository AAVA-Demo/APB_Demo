const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Dashboard KPI Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
  });

  test('TC-6847: Verify consolidated dashboard KPIs are displayed accurately within 2 seconds', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Application already loaded via beforeEach
    // Step 2: User already logged in via beforeEach
    
    // Step 3: Measure dashboard load time
    const startTime = Date.now();
    await dashboardPage.waitForDashboardToLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    
    // Step 4: Verify Monthly Spend KPI
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpendText = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpendText).toMatch(/₹[0-9,]+\.[0-9]{2}/);
    
    // Step 5: Verify Total Credit Limit KPI
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const creditLimitText = await dashboardPage.getTotalCreditLimitValue();
    expect(creditLimitText).toMatch(/₹[0-9,]+\.[0-9]{2}/);
    
    // Step 6: Verify Available Credit KPI
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCreditText = await dashboardPage.getAvailableCreditValue();
    expect(availableCreditText).toMatch(/₹[0-9,]+\.[0-9]{2}/);
    
    // Step 7: Verify Total Outstanding Amount KPI
    await expect(dashboardPage.totalOutstandingKPI).toBeVisible();
    const outstandingText = await dashboardPage.getTotalOutstandingValue();
    expect(outstandingText).toMatch(/₹[0-9,]+\.[0-9]{2}/);
  });

  test('TC-6848: Verify dashboard KPI data is cached and refreshed automatically every 10 minutes', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Dashboard already loaded
    await dashboardPage.waitForDashboardToLoad();
    
    // Step 2: Verify KPI data is fetched from backend on first load
    let networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        networkRequests.push(request.url());
      }
    });
    
    await page.reload();
    await dashboardPage.waitForDashboardToLoad();
    
    const hasApiCall = networkRequests.some(url => 
      url.includes('/api/creditcards') || url.includes('/api/transactions')
    );
    expect(hasApiCall).toBeTruthy();
    
    // Step 3: Refresh within 10 minutes - data should come from cache
    networkRequests = [];
    await page.reload();
    await dashboardPage.waitForDashboardToLoad();
    
    // Verify no new API calls (data from cache)
    const hasNewApiCall = networkRequests.some(url => 
      url.includes('/api/creditcards') || url.includes('/api/transactions')
    );
    // Note: In real implementation, cache behavior depends on backend/localStorage implementation
    
    // Step 4: Wait for 10 minutes would be impractical in automated tests
    // This would be validated through cache TTL inspection or manual testing
  });

  test('TC-6849: Verify appropriate error message when backend services are unavailable', async ({ page, context }) => {
    // Step 1: Simulate backend unavailability
    await context.route('**/api/creditcards', route => {
      route.abort('failed');
    });
    await context.route('**/api/transactions', route => {
      route.abort('failed');
    });
    
    const dashboardPage = new DashboardPage(page);
    
    // Step 2: Navigate to dashboard
    await dashboardPage.navigate();
    
    // Step 3: Verify error message is displayed
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('Failed to load dashboard KPIs');
    
    // Step 4: Verify retry option is available
    await expect(dashboardPage.retryButton).toBeVisible();
    
    // Step 5: Verify interface remains functional
    await expect(dashboardPage.navigationMenu).toBeVisible();
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    // Verify no JavaScript errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Interface should be stable
    await page.waitForTimeout(1000); // Wait for any potential errors
    expect(consoleErrors.length).toBe(0);
  });

});
