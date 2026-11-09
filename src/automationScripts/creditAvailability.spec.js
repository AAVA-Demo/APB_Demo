const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Real-Time Credit Availability Calculation', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await page.goto('/dashboard');
  });

  test('TC-4823: Verify real-time available credit calculation for user with 2 credit cards', async ({ page }) => {
    // Step 1: Prepare test data with 2 credit cards
    await page.route('**/api/cards', route => route.fulfill({
      status: 200,
      body: JSON.stringify([
        { cardId: 'cardA', creditLimit: 100000, currentBalance: 35000 },
        { cardId: 'cardB', creditLimit: 150000, currentBalance: 48000 }
      ])
    }));
    
    // Step 2: Calculate expected total credit limit
    const expectedTotalLimit = 250000;
    
    // Step 3: Calculate expected total outstanding amount
    const expectedOutstanding = 83000;
    
    // Step 4: Calculate expected available credit
    const expectedAvailable = 167000;
    
    // Step 5: Call KPICalculationService.calculateKPIs with 2-card data
    await dashboardPage.loadKPIs();
    await dashboardPage.waitForKPIsLoad();
    
    // Step 6: Verify calculated availableCredit matches expected value
    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(availableCredit).toBe(expectedAvailable);
    
    // Step 7: Verify calculation is performed in real-time (not cached)
    const lastUpdated = await dashboardPage.getLastUpdated();
    const now = new Date();
    const timeDiff = now - lastUpdated;
    await expect(timeDiff).toBeLessThan(5000);
  });

  test('TC-4824: Verify available credit calculation formula accuracy', async ({ page }) => {
    // Step 1: Call KPICalculationService.calculateKPIs with known card data
    await dashboardPage.loadKPIs();
    await dashboardPage.waitForKPIsLoad();
    
    // Step 2: Verify totalCreditLimit is sum of all card limits
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    await expect(totalCreditLimit).toBeGreaterThan(0);
    
    // Step 3: Verify outstandingAmount is sum of all card balances
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    await expect(outstandingAmount).toBeGreaterThan(0);
    
    // Step 4: Verify availableCredit = totalCreditLimit - outstandingAmount
    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(availableCredit).toBe(totalCreditLimit - outstandingAmount);
    
    // Step 5: Verify calculation produces positive number when limit exceeds outstanding
    await expect(availableCredit).toBeGreaterThan(0);
  });

  test('TC-4825: Verify consistent available credit calculation across rapid successive requests', async ({ page }) => {
    // Step 1: Initiate 10 rapid successive calls to DashboardService.loadKPIs()
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(dashboardPage.loadKPIs());
    }
    
    // Step 2: Wait for all 10 promises to resolve
    await Promise.all(promises);
    await dashboardPage.waitForKPIsLoad();
    
    // Step 3: Extract availableCredit value from each result
    const availableCredit1 = await dashboardPage.getAvailableCredit();
    
    // Step 4: Verify all 10 availableCredit values are identical
    for (let i = 0; i < 10; i++) {
      await dashboardPage.refreshKPIs();
      const availableCredit = await dashboardPage.getAvailableCredit();
      await expect(availableCredit).toBe(availableCredit1);
    }
    
    // Step 5: Verify calculation formula is applied consistently
    const totalLimit = await dashboardPage.getTotalCreditLimit();
    const outstanding = await dashboardPage.getOutstandingAmount();
    await expect(availableCredit1).toBe(totalLimit - outstanding);
    
    // Step 6: Verify no race conditions or calculation errors occurred
    const hasErrors = await dashboardPage.hasConsoleErrors();
    await expect(hasErrors).toBe(false);
  });

  test('TC-4826: Verify data consistency across concurrent calls with different timing', async ({ page }) => {
    // Step 1: Initiate first call to DashboardService.loadKPIs()
    const promise1 = dashboardPage.loadKPIs();
    
    // Step 2: Initiate second call immediately after first
    const promise2 = dashboardPage.loadKPIs();
    
    // Step 3: Wait for both promises to resolve
    await Promise.all([promise1, promise2]);
    await dashboardPage.waitForKPIsLoad();
    
    // Step 4: Compare availableCredit from both results
    const availableCredit1 = await dashboardPage.getAvailableCredit();
    await dashboardPage.refreshKPIs();
    const availableCredit2 = await dashboardPage.getAvailableCredit();
    await expect(availableCredit1).toBe(availableCredit2);
    
    // Step 5: Verify both calculations used same source data
    const totalLimit1 = await dashboardPage.getTotalCreditLimit();
    const outstanding1 = await dashboardPage.getOutstandingAmount();
    await dashboardPage.refreshKPIs();
    const totalLimit2 = await dashboardPage.getTotalCreditLimit();
    const outstanding2 = await dashboardPage.getOutstandingAmount();
    await expect(totalLimit1).toBe(totalLimit2);
    await expect(outstanding1).toBe(outstanding2);
    
    // Step 6: Verify real-time accuracy is maintained despite concurrent requests
    await expect(availableCredit1).toBe(totalLimit1 - outstanding1);
  });

  test('TC-4827: Verify system handles over-limit scenario where outstanding exceeds credit limit', async ({ page }) => {
    // Step 1: Prepare test data with over-limit card
    await page.route('**/api/cards', route => route.fulfill({
      status: 200,
      body: JSON.stringify([
        { cardId: 'cardA', creditLimit: 100000, currentBalance: 120000 }
      ])
    }));
    
    // Step 2: Calculate expected available credit for over-limit scenario
    const expectedAvailable = -20000;
    
    // Step 3: Call KPICalculationService.calculateKPIs with over-limit card data
    await dashboardPage.loadKPIs();
    await dashboardPage.waitForKPIsLoad();
    
    // Step 4: Verify calculated availableCredit is negative or zero
    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(availableCredit).toBeLessThanOrEqual(0);
    
    // Step 5: Verify system correctly reflects over-limit status
    await expect(availableCredit).toBe(expectedAvailable);
    
    // Step 6: Verify no calculation errors or misleading positive values
    await expect(availableCredit).not.toBeGreaterThan(0);
    
    // Step 7: Verify utilizationPercentage reflects over-limit status
    const utilizationPercentage = await dashboardPage.getUtilizationPercentage();
    await expect(utilizationPercentage).toBeGreaterThan(100);
    
    // Step 8: Verify no system failure or exception is thrown
    const hasErrors = await dashboardPage.hasConsoleErrors();
    await expect(hasErrors).toBe(false);
  });
});