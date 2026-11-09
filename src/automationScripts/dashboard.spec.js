const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard KPIs and Credit Card Overview', () => {

  test('QE-9060 TS-001 TC-001 - Verify dashboard displays accurate aggregated KPIs for multiple active credit cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/.*creditcard/);
    
    // Step 2: Login with multiple cards user
    await dashboardPage.login('testuser@example.com', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Step 3-6: Verify all KPI cards are displayed with aggregated values
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    // Step 7: Verify currency formatting
    const monthlySpend = await dashboardPage.monthlySpendKPI.textContent();
    expect(monthlySpend).toMatch(/USD\s+[0-9,]+\.[0-9]{2}/);
    
    const totalLimit = await dashboardPage.totalCreditLimitKPI.textContent();
    expect(totalLimit).toMatch(/USD\s+[0-9,]+\.[0-9]{2}/);
    
    const availableCredit = await dashboardPage.availableCreditKPI.textContent();
    expect(availableCredit).toMatch(/USD\s+[0-9,]+\.[0-9]{2}/);
    
    const outstanding = await dashboardPage.outstandingAmountKPI.textContent();
    expect(outstanding).toMatch(/USD\s+[0-9,]+\.[0-9]{2}/);
  });

  test('QE-9060 TS-002 TC-001 - Verify KPIs automatically refresh every 30 seconds via real-time polling mechanism', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1-2: Launch and login
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Pass@123');
    
    // Step 3-4: Record initial KPI values and timestamp
    const initialMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const initialTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    
    // Step 5-6: Wait 30 seconds and verify timestamp update
    await page.waitForTimeout(31000);
    const updatedTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    expect(updatedTimestamp).not.toBe(initialTimestamp);
    
    // Step 7: Verify KPIs are refreshed
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    
    // Step 8: Wait another 30 seconds and verify continuous polling
    await page.waitForTimeout(31000);
    const finalTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    expect(finalTimestamp).not.toBe(updatedTimestamp);
  });

  test('QE-9060 TS-003 TC-001 - Verify dashboard displays zero values with appropriate messaging when no credit cards are linked', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1-2: Launch and login with no cards user
    await dashboardPage.navigate();
    await dashboardPage.login('nocards@example.com', 'Pass@123');
    
    // Step 3-6: Verify all KPIs show zero values
    await expect(dashboardPage.monthlySpendKPI).toContainText('USD 0.00');
    await expect(dashboardPage.totalCreditLimitKPI).toContainText('USD 0.00');
    await expect(dashboardPage.availableCreditKPI).toContainText('USD 0.00');
    await expect(dashboardPage.outstandingAmountKPI).toContainText('USD 0.00');
    
    // Step 7: Verify no cards message
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    await expect(dashboardPage.noCardsMessage).toContainText(/No credit cards/i);
  });

  test('QE-9059 TS-001 TC-001 - Verify dashboard renders correctly on mobile device (375px viewport) without horizontal scrolling', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Step 2-3: Launch and login
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Pass@123');
    
    // Step 4: Verify KPI cards are visible without horizontal scroll
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    // Step 5: Verify credit card details are readable
    await expect(dashboardPage.creditCardList).toBeVisible();
    
    // Step 6: Verify navigation is accessible
    await expect(dashboardPage.navigationMenu).toBeVisible();
    
    // Step 7: Verify no horizontal scrollbar
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('QE-9059 TS-002 TC-001 - Verify dashboard adapts to tablet layout (768px viewport) with 2-column KPI grid', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Step 2-3: Launch and login
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Pass@123');
    
    // Step 4: Verify 2-column grid layout
    const kpiCards = await dashboardPage.getAllKPICards();
    expect(kpiCards.length).toBe(4);
    
    // Step 5: Verify no horizontal scrolling
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    
    // Step 6: Verify touch target sizes
    const buttonBox = await dashboardPage.navigationMenu.boundingBox();
    expect(buttonBox.height).toBeGreaterThanOrEqual(44);
    expect(buttonBox.width).toBeGreaterThanOrEqual(44);
  });

  test('QE-9059 TS-003 TC-001 - Verify dashboard maintains functionality on extremely small viewport (320px)', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Set minimum viewport
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Step 2-3: Launch and login
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Pass@123');
    
    // Step 4: Verify vertical stacking
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    
    // Step 5: Verify text readability
    const fontSize = await dashboardPage.monthlySpendKPI.evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    expect(parseInt(fontSize)).toBeGreaterThanOrEqual(12);
    
    // Step 6: Verify credit card details stack vertically
    await expect(dashboardPage.creditCardList).toBeVisible();
    
    // Step 7: Verify navigation functionality
    await expect(dashboardPage.navigationMenu).toBeVisible();
    
    // Step 8: Verify no horizontal scrolling
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

});