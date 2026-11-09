const { test, expect } = require('@playwright/test');
const { KPIDashboardPage } = require('./pages/kpi-dashboard.page');

test.describe('KPI Dashboard Tests', () => {

  test('QE-8862 TS-001 TC-001 - Verify accurate aggregation of Total Credit Limit for user with three credit cards', async ({ page }) => {
    const kpiPage = new KPIDashboardPage(page);
    
    // Step 1: Launch application
    await kpiPage.navigate();
    
    // Step 2: Login with user having 3 cards
    await kpiPage.login('testuser_3cards', 'Test@123');
    
    // Step 3: Navigate to KPI Dashboard
    await kpiPage.navigateToKPIDashboard();
    
    // Step 4: Locate Total Credit Limit KPI card
    await kpiPage.verifyKPICardVisible('Total Credit Limit');
    
    // Step 5: Verify Total Credit Limit value
    await kpiPage.verifyKPIValue('Total Credit Limit', 30000);
    
    // Step 6: Navigate to Portfolio view
    await kpiPage.navigateToPortfolio();
    await kpiPage.verifyIndividualCardLimits([5000, 10000, 15000]);
    
    // Step 7: Return to KPI Dashboard and verify consistency
    await kpiPage.navigateToKPIDashboard();
    await kpiPage.verifyKPIValue('Total Credit Limit', 30000);
  });

  test('QE-8862 TS-002 TC-001 - Verify system handles null or missing credit limit value', async ({ page }) => {
    const kpiPage = new KPIDashboardPage(page);
    
    // Step 1: Launch application
    await kpiPage.navigate();
    
    // Step 2: Login with user having null limit
    await kpiPage.login('testuser_nulllimit', 'Test@123');
    
    // Step 3: Navigate to KPI Dashboard
    await kpiPage.navigateToKPIDashboard();
    
    // Step 4: Locate Total Credit Limit KPI card
    await kpiPage.verifyKPICardVisible('Total Credit Limit');
    
    // Step 5: Verify Total Credit Limit excludes null
    await kpiPage.verifyKPIValue('Total Credit Limit', 15000);
    
    // Step 6: Verify warning message
    await kpiPage.verifyWarningMessage('One or more cards have missing credit limit data and were excluded from aggregation.');
    
    // Step 7: Navigate to Portfolio and verify null card
    await kpiPage.navigateToPortfolio();
    await kpiPage.verifyCardLimitDisplay(2, 'N/A');
  });

  test('QE-8862 TS-003 TC-001 - Verify Total Credit Limit KPI automatically updates when a new card is added', async ({ page }) => {
    const kpiPage = new KPIDashboardPage(page);
    
    // Step 1: Launch application
    await kpiPage.navigate();
    
    // Step 2: Login
    await kpiPage.login('testuser_3cards', 'Test@123');
    
    // Step 3: Navigate to KPI Dashboard
    await kpiPage.navigateToKPIDashboard();
    
    // Step 4: Note current Total Credit Limit
    const initialLimit = await kpiPage.getKPIValue('Total Credit Limit');
    expect(initialLimit).toBe(30000);
    
    // Step 5: Add new card via API
    await page.request.post('https://creditcard-dashboard.example.com/api/cards', {
      data: {
        userId: 'testuser_3cards',
        cardId: 'card4',
        creditLimit: 20000
      }
    });
    
    // Step 6: Wait for auto-refresh
    await page.waitForTimeout(30000);
    
    // Step 7: Verify Total Credit Limit updated
    await kpiPage.verifyKPIValue('Total Credit Limit', 50000);
    
    // Step 8: Navigate to Portfolio and verify new card
    await kpiPage.navigateToPortfolio();
    const cardCount = await kpiPage.getCardCount();
    expect(cardCount).toBe(4);
    await kpiPage.verifyCardLimit(3, 20000);
  });

  test('QE-8858 TS-001 TC-001 - Verify user can view four accurate KPI metrics refreshed in real-time', async ({ page }) => {
    const kpiPage = new KPIDashboardPage(page);
    
    // Step 1: Launch application
    await kpiPage.navigate();
    
    // Step 2: Login
    await kpiPage.login('testuser_kpi', 'Test@123');
    
    // Step 3: Navigate to KPI Dashboard
    await kpiPage.navigateToKPIDashboard();
    
    // Step 4: Verify Monthly Spend KPI
    await kpiPage.verifyKPIValue('Monthly Spend', 2500);
    
    // Step 5: Verify Total Credit Limit KPI
    await kpiPage.verifyKPIValue('Total Credit Limit', 45000);
    
    // Step 6: Verify Available Credit KPI
    await kpiPage.verifyKPIValue('Available Credit', 35500);
    
    // Step 7: Verify Outstanding Amount KPI
    await kpiPage.verifyKPIValue('Outstanding Amount', 9500);
    
    // Step 8: Verify last refreshed indicator
    await kpiPage.verifyLastRefreshedVisible();
    
    // Step 9: Wait for auto-refresh interval
    await page.waitForTimeout(30000);
    
    // Step 10: Verify KPI values are updated
    await kpiPage.verifyKPIValuesUpdated();
  });

  test('QE-8858 TS-002 TC-001 - Verify system displays error notification when transaction system is unavailable', async ({ page }) => {
    const kpiPage = new KPIDashboardPage(page);
    
    // Step 1: Launch application
    await kpiPage.navigate();
    
    // Step 2: Login
    await kpiPage.login('testuser', 'Test@123');
    
    // Step 3: Simulate transaction system unavailability
    await page.route('**/api/transactions/**', route => route.abort());
    
    // Step 4: Navigate to KPI Dashboard
    await kpiPage.navigateToKPIDashboard();
    
    // Step 5: Verify error notification for Monthly Spend
    await kpiPage.verifyKPIError('Monthly Spend', 'Unable to retrieve Monthly Spend data. Service temporarily unavailable.');
    
    // Step 6: Verify Total Credit Limit still displays
    await kpiPage.verifyKPIValue('Total Credit Limit', 45000);
    
    // Step 7: Verify Available Credit still displays
    await kpiPage.verifyKPIValue('Available Credit', 35500);
    
    // Step 8: Verify Outstanding Amount still displays
    await kpiPage.verifyKPIValue('Outstanding Amount', 9500);
    
    // Step 9: Verify dashboard remains responsive
    await expect(page).not.toHaveTitle(/Error/);
    
    // Step 10: Verify retry option for Monthly Spend
    await kpiPage.verifyRetryButtonVisible('Monthly Spend');
  });

  test('QE-8858 TS-003 TC-001 - Verify KPI dashboard automatically updates after new transaction', async ({ page }) => {
    const kpiPage = new KPIDashboardPage(page);
    
    // Step 1: Launch application
    await kpiPage.navigate();
    
    // Step 2: Login
    await kpiPage.login('testuser', 'Test@123');
    
    // Step 3: Navigate to KPI Dashboard
    await kpiPage.navigateToKPIDashboard();
    
    // Step 4: Note current values
    const initialMonthlySpend = await kpiPage.getKPIValue('Monthly Spend');
    const initialAvailableCredit = await kpiPage.getKPIValue('Available Credit');
    expect(initialMonthlySpend).toBe(2500);
    expect(initialAvailableCredit).toBe(35500);
    
    // Step 5: Simulate new transaction
    await page.request.post('https://creditcard-dashboard.example.com/api/transactions', {
      data: {
        userId: 'testuser',
        cardId: 'card1',
        amount: 200,
        transactionDate: new Date().toISOString()
      }
    });
    
    // Step 6: Wait for auto-refresh
    await page.waitForTimeout(30000);
    
    // Step 7: Verify Monthly Spend updated
    await kpiPage.verifyKPIValue('Monthly Spend', 2700);
    
    // Step 8: Verify Available Credit updated
    await kpiPage.verifyKPIValue('Available Credit', 35300);
    
    // Step 9: Verify Outstanding Amount updated
    await kpiPage.verifyKPIValue('Outstanding Amount', 9700);
    
    // Step 10: Verify timestamp updated
    await kpiPage.verifyTimestampUpdated();
  });

});
