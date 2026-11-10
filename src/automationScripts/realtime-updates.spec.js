const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { AuthHelper } = require('./helpers/auth.helper');

test.describe('Real-time Credit Utilization Tracking - QE-10015', () => {
  let dashboardPage;
  
  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await AuthHelper.authenticate(page, 'user123');
    await dashboardPage.navigate();
  });
  
  test('QE-10015 TS-001 TC-001 - Verify real-time KPI update on mobile dashboard when new transaction is processed within 30 seconds', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await dashboardPage.waitForDashboardLoad();
    
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    const initialOutstanding = await dashboardPage.getOutstandingAmount();
    
    await dashboardPage.simulateTransaction('card1', 5000.00);
    
    await dashboardPage.waitForKpiUpdate(30000);
    
    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    const updatedOutstanding = await dashboardPage.getOutstandingAmount();
    
    expect(parseFloat(updatedAvailableCredit)).toBe(parseFloat(initialAvailableCredit) - 5000.00);
    expect(parseFloat(updatedOutstanding)).toBe(parseFloat(initialOutstanding) + 5000.00);
    
    const isResponsive = await dashboardPage.isResponsiveLayout();
    expect(isResponsive).toBe(true);
  });
  
  test('QE-10015 TS-001 TC-002 - Verify near real-time KPI updates occur automatically without manual refresh', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    const initialOutstanding = await dashboardPage.getOutstandingAmount();
    
    await dashboardPage.simulateTransaction('card1', 3000.00);
    
    await page.waitForTimeout(30000);
    
    const updatedOutstanding = await dashboardPage.getOutstandingAmount();
    
    expect(parseFloat(updatedOutstanding)).toBe(parseFloat(initialOutstanding) + 3000.00);
  });
  
  test('QE-10015 TS-002 TC-001 - Verify dashboard displays last known KPI values with timestamp and warning when data source is unavailable', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    const initialKpis = await dashboardPage.getAllKpis();
    const initialTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    
    await dashboardPage.simulateDataSourceFailure();
    
    await page.waitForTimeout(30000);
    
    const currentKpis = await dashboardPage.getAllKpis();
    const currentTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    
    expect(currentKpis).toEqual(initialKpis);
    expect(currentTimestamp).toBe(initialTimestamp);
    
    const warningMessage = await dashboardPage.getWarningMessage();
    expect(warningMessage).toContain('Real-time updates currently unavailable');
  });
  
  test('QE-10015 TS-003 TC-001 - Verify consolidated KPIs correctly aggregate simultaneous transactions on multiple cards', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    const initialOutstanding = await dashboardPage.getOutstandingAmount();
    
    await dashboardPage.simulateSimultaneousTransactions([
      { cardId: 'card1', amount: 2000.00 },
      { cardId: 'card2', amount: 3500.00 },
      { cardId: 'card3', amount: 1500.00 }
    ]);
    
    await dashboardPage.waitForKpiUpdate(30000);
    
    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    const updatedOutstanding = await dashboardPage.getOutstandingAmount();
    
    expect(parseFloat(updatedAvailableCredit)).toBe(parseFloat(initialAvailableCredit) - 7000.00);
    expect(parseFloat(updatedOutstanding)).toBe(parseFloat(initialOutstanding) + 7000.00);
  });
  
  test('QE-10015 TS-003 TC-002 - Verify KPI aggregation handles concurrent transactions without data loss or calculation errors', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    const initialOutstanding = await dashboardPage.getOutstandingAmount();
    
    await dashboardPage.simulateSimultaneousTransactions([
      { cardId: 'card1', amount: 1000.00 },
      { cardId: 'card1', amount: 2000.00 },
      { cardId: 'card2', amount: 1500.00 },
      { cardId: 'card2', amount: 2500.00 },
      { cardId: 'card3', amount: 3000.00 }
    ]);
    
    await dashboardPage.waitForKpiUpdate(30000);
    
    const updatedOutstanding = await dashboardPage.getOutstandingAmount();
    
    expect(parseFloat(updatedOutstanding)).toBe(parseFloat(initialOutstanding) + 10000.00);
  });
});
