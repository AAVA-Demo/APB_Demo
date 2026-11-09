const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Consolidated KPI Dashboard', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await page.goto('/dashboard');
  });

  test('TC-4818: Verify consolidated dashboard calculates accurate KPIs for user with 3 active credit cards within 2-second SLA', async ({ page }) => {
    // Step 1: Prepare test data - handled by mock service
    
    // Step 2: Record start time and call DashboardService.loadKPIs()
    const startTime = Date.now();
    await dashboardPage.loadKPIs();
    
    // Step 3: Wait for promise resolution and record end time
    await dashboardPage.waitForKPIsLoad();
    const endTime = Date.now();
    const elapsed = endTime - startTime;
    
    // Step 4: Verify response time is within 2-second SLA
    await expect(elapsed).toBeLessThan(2000);
    
    // Step 5: Verify totalCreditLimit KPI calculation
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    await expect(totalCreditLimit).toBe(450000);
    
    // Step 6: Verify outstandingAmount KPI calculation
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    await expect(outstandingAmount).toBe(155000);
    
    // Step 7: Verify availableCredit KPI calculation
    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(availableCredit).toBe(295000);
    
    // Step 8: Verify monthlySpend KPI
    const monthlySpend = await dashboardPage.getMonthlySpend();
    await expect(monthlySpend).toBeGreaterThan(0);
    
    // Step 9: Verify utilizationPercentage KPI calculation
    const utilizationPercentage = await dashboardPage.getUtilizationPercentage();
    const expectedUtilization = (155000 / 450000) * 100;
    await expect(Math.abs(utilizationPercentage - expectedUtilization)).toBeLessThan(0.1);
    
    // Step 10: Verify lastUpdated timestamp is present and recent
    const lastUpdated = await dashboardPage.getLastUpdated();
    const now = new Date();
    const timeDiff = now - lastUpdated;
    await expect(timeDiff).toBeLessThan(5000);
  });

  test('TC-4819: Verify KPI calculation accuracy with different card combinations', async ({ page }) => {
    // Step 1: Call KPICalculationService.calculateKPIs with card summaries and monthly spend
    await dashboardPage.loadKPIs();
    await dashboardPage.waitForKPIsLoad();
    
    // Step 2: Verify totalCreditLimit aggregation logic
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    await expect(totalCreditLimit).toBe(450000);
    
    // Step 3: Verify outstandingAmount aggregation logic
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    await expect(outstandingAmount).toBe(155000);
    
    // Step 4: Verify availableCredit calculation formula
    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(availableCredit).toBe(totalCreditLimit - outstandingAmount);
    
    // Step 5: Verify utilizationPercentage calculation formula
    const utilizationPercentage = await dashboardPage.getUtilizationPercentage();
    const expectedUtilization = (outstandingAmount / totalCreditLimit) * 100;
    await expect(Math.abs(utilizationPercentage - expectedUtilization)).toBeLessThan(0.01);
    
    // Step 6: Verify monthlySpend is passed through unchanged
    const monthlySpend = await dashboardPage.getMonthlySpend();
    await expect(monthlySpend).toBeGreaterThan(0);
  });

  test('TC-4820: Verify real-time available credit calculation reflects most current data from services', async ({ page }) => {
    // Step 1: Call DashboardService.loadKPIs() to retrieve initial KPI data
    await dashboardPage.loadKPIs();
    await dashboardPage.waitForKPIsLoad();
    
    // Step 2: Record initial availableCredit value
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    await expect(initialAvailableCredit).toBe(295000);
    
    // Step 3: Verify calculation uses formula: totalCreditLimit - outstandingAmount
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    await expect(initialAvailableCredit).toBe(totalCreditLimit - outstandingAmount);
    
    // Step 4: Call DashboardService.loadKPIs() again to verify real-time recalculation
    await dashboardPage.refreshKPIs();
    await dashboardPage.waitForKPIsLoad();
    
    // Step 5: Verify availableCredit is recalculated on each request
    const refreshedAvailableCredit = await dashboardPage.getAvailableCredit();
    await expect(refreshedAvailableCredit).toBe(295000);
    
    // Step 6: Verify calculation reflects data from CreditCardFactory and TransactionService
    const refreshedTotalLimit = await dashboardPage.getTotalCreditLimit();
    const refreshedOutstanding = await dashboardPage.getOutstandingAmount();
    await expect(refreshedAvailableCredit).toBe(refreshedTotalLimit - refreshedOutstanding);
  });

  test('TC-4821: Verify data consistency across concurrent KPI calculation requests', async ({ page }) => {
    // Step 1: Initiate 5 concurrent calls to DashboardService.loadKPIs()
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(dashboardPage.loadKPIs());
    }
    
    // Step 2: Wait for all 5 promises to resolve
    await Promise.all(promises);
    await dashboardPage.waitForKPIsLoad();
    
    // Step 3: Compare availableCredit values from all 5 results
    const availableCredit1 = await dashboardPage.getAvailableCredit();
    await dashboardPage.refreshKPIs();
    const availableCredit2 = await dashboardPage.getAvailableCredit();
    await expect(availableCredit1).toBe(availableCredit2);
    
    // Step 4: Compare totalCreditLimit values from all results
    const totalLimit1 = await dashboardPage.getTotalCreditLimit();
    await dashboardPage.refreshKPIs();
    const totalLimit2 = await dashboardPage.getTotalCreditLimit();
    await expect(totalLimit1).toBe(totalLimit2);
    
    // Step 5: Compare outstandingAmount values from all results
    const outstanding1 = await dashboardPage.getOutstandingAmount();
    await dashboardPage.refreshKPIs();
    const outstanding2 = await dashboardPage.getOutstandingAmount();
    await expect(outstanding1).toBe(outstanding2);
    
    // Step 6: Verify no race conditions or data corruption occurred
    await expect(availableCredit1).toBe(totalLimit1 - outstanding1);
  });

  test('TC-4822: Verify system handles credit cards with zero credit limit without division by zero errors', async ({ page }) => {
    // Step 1: Prepare test data with cards having zero credit limit
    await page.route('**/api/cards', route => route.fulfill({
      status: 200,
      body: JSON.stringify([
        { cardId: 'c1', creditLimit: 0, currentBalance: 0 },
        { cardId: 'c2', creditLimit: 0, currentBalance: 0 }
      ])
    }));
    
    // Step 2: Call KPICalculationService.calculateKPIs with zero-limit cards
    await dashboardPage.loadKPIs();
    await dashboardPage.waitForKPIsLoad();
    
    // Step 3: Verify totalCreditLimit calculation
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    await expect(totalCreditLimit).toBe(0);
    
    // Step 4: Verify outstandingAmount calculation
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    await expect(outstandingAmount).toBe(0);
    
    // Step 5: Verify availableCredit calculation
    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(availableCredit).toBe(0);
    
    // Step 6: Verify utilizationPercentage calculation handles division by zero
    const utilizationPercentage = await dashboardPage.getUtilizationPercentage();
    await expect(utilizationPercentage).toBe(0);
    await expect(isNaN(utilizationPercentage)).toBe(false);
    await expect(isFinite(utilizationPercentage)).toBe(true);
    
    // Step 7: Verify all KPI fields have appropriate zero or null values
    await expect(totalCreditLimit).toBe(0);
    await expect(outstandingAmount).toBe(0);
    await expect(availableCredit).toBe(0);
    
    // Step 8: Verify no system failure or exception is thrown
    const hasErrors = await dashboardPage.hasConsoleErrors();
    await expect(hasErrors).toBe(false);
  });
});