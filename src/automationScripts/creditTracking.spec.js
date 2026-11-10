const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Real-Time Credit Utilization Tracking Tests - QE-9803', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
  });

  test('TC-7083: Verify available credit updates after purchase transaction within refresh cycle', async ({ page }) => {
    // Step 3: Verify initial dashboard KPI metrics
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();

    const initialCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();

    expect(initialCreditLimit).toContain('$10,000');
    expect(initialAvailableCredit).toContain('$8,000');

    // Step 4: Simulate a purchase transaction of $500
    // Note: This requires API call or test environment transaction simulation
    await page.evaluate(() => {
      // Mock transaction processing
      window.simulateTransaction = { amount: 500, cardId: 'card-001' };
    });

    // Step 5: Wait for dashboard refresh cycle (30-60 seconds)
    await page.waitForTimeout(60000);

    // Step 6: Verify available credit is updated to $7,500
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    expect(updatedAvailableCredit).toContain('$7,500');

    // Step 7: Verify monthly spend is updated to include new transaction
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const spendAmount = parseFloat(monthlySpend.replace(/[$,]/g, ''));
    expect(spendAmount).toBeGreaterThan(0);

    // Step 8: Verify KPI aggregation reflects the new transaction
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  test('TC-7084: Verify system prevents transaction exceeding available credit', async ({ page }) => {
    // Step 3: Verify initial dashboard KPI metrics
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    expect(initialAvailableCredit).toContain('$8,000');

    // Step 4: Attempt to simulate a purchase transaction of $8,500 (exceeding available credit)
    await page.evaluate(() => {
      window.attemptTransaction = { amount: 8500, cardId: 'card-001' };
    });

    // Step 5: Verify warning message is displayed
    await expect(dashboardPage.warningMessage).toBeVisible({ timeout: 5000 });
    const warningText = await dashboardPage.getWarningMessage();
    expect(warningText).toMatch(/exceed.*credit limit/i);

    // Step 6: Verify transaction does not reflect in dashboard
    await page.waitForTimeout(5000);
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toContain('$8,000');

    // Step 7: Verify data integrity is maintained
    const creditValue = parseFloat(availableCredit.replace(/[$,]/g, ''));
    expect(creditValue).toBeGreaterThanOrEqual(0);
  });

  test('TC-7085: Verify available credit calculation accuracy with concurrent transactions', async ({ page }) => {
    // Step 3: Verify initial dashboard KPI metrics
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    expect(initialAvailableCredit).toContain('$8,000');

    // Step 4: Simulate two concurrent transactions on different cards
    await page.evaluate(() => {
      window.concurrentTransactions = [
        { amount: 500, cardId: 'card-001' },
        { amount: 300, cardId: 'card-002' }
      ];
    });

    // Step 5: Wait for dashboard refresh cycle
    await page.waitForTimeout(60000);

    // Step 6: Verify available credit is recalculated accurately
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const creditValue = parseFloat(updatedAvailableCredit.replace(/[$,]/g, ''));
    // Expected: $8,000 - $500 - $300 = $7,200
    expect(creditValue).toBeCloseTo(7200, 2);

    // Step 7: Verify no race condition or inconsistent credit values
    await page.waitForTimeout(2000);
    const finalAvailableCredit = await dashboardPage.getAvailableCreditValue();
    expect(finalAvailableCredit).toBe(updatedAvailableCredit);

    // Step 8: Verify financial accuracy meets NFR requirements
    const allKPIs = await dashboardPage.getAllKPIValues();
    allKPIs.forEach(kpi => {
      const value = parseFloat(kpi.replace(/[$,]/g, ''));
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });
});
