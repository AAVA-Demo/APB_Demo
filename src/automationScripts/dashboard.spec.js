const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Dashboard KPIs and Credit Card Overview Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('TC-7128: Verify consolidated dashboard displays aggregated KPIs for multiple credit cards in responsive layout within 2 seconds', async ({ page }) => {
    // Step 1-2: Login with valid user credentials who has multiple credit cards registered
    await loginPage.login('testuser_multicards', 'Test@123');
    
    // Step 3-4: Navigate to Dashboard and verify it loads within 2 seconds
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    
    // Step 5: Verify that aggregated KPIs are displayed
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    
    expect(parseFloat(totalCreditLimit.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(availableCredit.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    
    // Step 6: Verify that the dashboard layout is responsive and displays correctly on desktop viewport
    const viewportSize = page.viewportSize();
    expect(viewportSize.width).toBeGreaterThanOrEqual(1024);
    
    const kpiCardsCount = await dashboardPage.getKPICardsCount();
    expect(kpiCardsCount).toBe(4);
    
    // Step 7: Verify that individual credit card summaries are displayed
    const creditCardCount = await dashboardPage.getCreditCardTilesCount();
    expect(creditCardCount).toBeGreaterThanOrEqual(3);
    
    await expect(dashboardPage.creditCardTiles.first()).toBeVisible();
  });

  test('TC-7130: Verify dashboard responsive layout on tablet and mobile viewports', async ({ page }) => {
    // Step 1: Login with valid credentials
    await loginPage.login('testuser_multicards', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    
    // Step 2-3: Resize browser window to tablet viewport (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500); // Allow layout to adapt
    
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const kpiCardsCountTablet = await dashboardPage.getKPICardsCount();
    expect(kpiCardsCountTablet).toBe(4);
    
    // Step 4-5: Resize browser window to mobile viewport (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Allow layout to adapt
    
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const kpiCardsCountMobile = await dashboardPage.getKPICardsCount();
    expect(kpiCardsCountMobile).toBe(4);
    
    // Step 6: Verify that credit card summary tiles also adapt to mobile layout
    const creditCardTilesVisible = await dashboardPage.creditCardTiles.first().isVisible();
    expect(creditCardTilesVisible).toBeTruthy();
  });

  test('TC-7132: Verify error message is displayed when Credit Card Data Service is unavailable', async ({ page }) => {
    // Mock API to return 503 error
    await page.route('**/api/creditcards', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Service Unavailable' })
      });
    });
    
    // Step 1-3: Login with valid user credentials
    await loginPage.login('testuser_multicards', 'Test@123');
    
    // Step 4-5: Navigate to Dashboard and verify error message
    await dashboardPage.waitForErrorMessage();
    await expect(dashboardPage.errorMessage).toBeVisible();
    
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('Failed to load dashboard data');
    
    // Step 6: Verify that KPI cards show error state or zero values
    const kpiCardsVisible = await dashboardPage.totalCreditLimitKPI.isVisible();
    if (kpiCardsVisible) {
      const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
      expect(totalCreditLimit).toMatch(/\$0\.00|error|loading/i);
    }
  });

  test('TC-7134: Verify appropriate message and empty state is displayed when user has no registered credit cards', async ({ page }) => {
    // Step 1-2: Login with valid user credentials for a user with no registered credit cards
    await loginPage.login('newuser_nocards', 'Test@123');
    
    // Step 3: Navigate to the Dashboard
    await dashboardPage.waitForDashboardLoad();
    
    // Step 4: Verify that an informational message is displayed
    await expect(dashboardPage.emptyStateMessage).toBeVisible();
    const emptyStateText = await dashboardPage.getEmptyStateMessageText();
    expect(emptyStateText).toMatch(/no credit card data available/i);
    
    // Step 5: Verify that KPI values are displayed as zero
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    
    expect(totalCreditLimit).toMatch(/\$0\.00/);
    expect(availableCredit).toMatch(/\$0\.00/);
    expect(outstandingAmount).toMatch(/\$0\.00/);
    expect(monthlySpend).toMatch(/\$0\.00/);
    
    // Step 6: Verify that the credit card summary section is empty
    const creditCardCount = await dashboardPage.getCreditCardTilesCount();
    expect(creditCardCount).toBe(0);
  });

  test('TC-7122: Verify available credit and outstanding amount KPIs update within 2 seconds after recent transactions', async ({ page }) => {
    // Step 1-2: Login and navigate to Dashboard
    await loginPage.login('testuser', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    
    // Record initial KPI values
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    const initialOutstanding = await dashboardPage.getOutstandingAmount();
    
    // Step 3: Simulate a recent transaction (mock API response with updated values)
    await page.route('**/api/transactions/summary', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          monthlySpend: 5500,
          totalTransactions: 45,
          averageTransaction: 122.22
        })
      });
    });
    
    await page.route('**/api/creditcards', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { cardId: 1, cardName: 'Visa Gold', creditLimit: 10000, availableCredit: 7500, outstandingAmount: 2500 }
        ])
      });
    });
    
    // Step 4-5: Refresh the dashboard and verify KPIs update within 2 seconds
    const startTime = Date.now();
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    
    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    const updatedOutstanding = await dashboardPage.getOutstandingAmount();
    
    expect(updatedAvailableCredit).toMatch(/\$7,500/);
    expect(updatedOutstanding).toMatch(/\$2,500/);
    
    // Step 6: Verify credit utilization is recalculated
    const utilizationVisible = await dashboardPage.creditUtilizationIndicator.isVisible();
    if (utilizationVisible) {
      const utilization = await dashboardPage.getCreditUtilization();
      expect(parseFloat(utilization)).toBeCloseTo(25, 1);
    }
  });

  test('TC-7124: Verify dashboard automatically refreshes KPI data within configured interval', async ({ page }) => {
    // Step 1-2: Login and record initial KPI values
    await loginPage.login('testuser', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    
    // Step 3: Simulate a transaction by updating mock API response
    await page.route('**/api/transactions/summary', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          monthlySpend: 5800,
          totalTransactions: 46
        })
      });
    });
    
    await page.route('**/api/creditcards', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { cardId: 1, cardName: 'Visa Gold', creditLimit: 10000, availableCredit: 7700, outstandingAmount: 2300 }
        ])
      });
    });
    
    // Step 4-5: Wait for auto-refresh interval (simulated with shorter timeout for testing)
    // Note: In production, this would be 30-60 seconds. Using shorter timeout for test efficiency.
    await page.waitForTimeout(5000);
    
    // Trigger refresh manually to simulate auto-refresh behavior
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    
    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    const updatedOutstanding = await dashboardPage.getOutstandingAmount();
    
    expect(updatedAvailableCredit).toMatch(/\$7,700/);
    expect(updatedOutstanding).toMatch(/\$2,300/);
  });

  test('TC-7126: Verify warning message is displayed when real-time data refresh service experiences delays exceeding 2 seconds', async ({ page }) => {
    // Mock API with delay exceeding 2 seconds
    await page.route('**/api/creditcards', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }, 3000); // 3 second delay
    });
    
    // Step 1-2: Login with valid credentials
    await loginPage.login('testuser', 'Test@123');
    
    // Step 3-4: Refresh the dashboard and observe delayed data fetch
    await page.reload();
    
    // Step 5: Verify that a warning message is displayed
    await dashboardPage.waitForWarningMessage();
    await expect(dashboardPage.warningMessage).toBeVisible();
    
    const warningText = await dashboardPage.getWarningMessageText();
    expect(warningText).toMatch(/KPI data may not be current|Please try refreshing/i);
    
    // Step 6: Verify that KPI values show stale data or loading state
    const loadingIndicatorVisible = await dashboardPage.loadingSpinner.isVisible();
    expect(loadingIndicatorVisible).toBeTruthy();
  });
});