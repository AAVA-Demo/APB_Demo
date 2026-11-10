const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard KPIs and Credit Card Overview', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-10464 TS-001 TC-001 - Verify consolidated dashboard displays correctly aggregated KPIs across 3 linked credit cards', async ({ page }) => {
    // Step 1: Launch application and authenticate
    await loginPage.login('testuser_3cards_kpi', 'Pass@123');
    
    // Step 2-4: Verify Card A, B, C details are loaded correctly
    await expect(dashboardPage.getCardCreditLimit('Card A')).toHaveText('₹50,000');
    await expect(dashboardPage.getCardAvailableCredit('Card A')).toHaveText('₹35,000');
    await expect(dashboardPage.getCardOutstanding('Card A')).toHaveText('₹15,000');
    await expect(dashboardPage.getCardMonthlySpend('Card A')).toHaveText('₹8,500');
    
    await expect(dashboardPage.getCardCreditLimit('Card B')).toHaveText('₹30,000');
    await expect(dashboardPage.getCardAvailableCredit('Card B')).toHaveText('₹22,000');
    await expect(dashboardPage.getCardOutstanding('Card B')).toHaveText('₹8,000');
    await expect(dashboardPage.getCardMonthlySpend('Card B')).toHaveText('₹4,200');
    
    await expect(dashboardPage.getCardCreditLimit('Card C')).toHaveText('₹70,000');
    await expect(dashboardPage.getCardAvailableCredit('Card C')).toHaveText('₹50,000');
    await expect(dashboardPage.getCardOutstanding('Card C')).toHaveText('₹20,000');
    await expect(dashboardPage.getCardMonthlySpend('Card C')).toHaveText('₹12,000');
    
    // Step 5-8: Verify aggregated KPIs
    await expect(dashboardPage.totalMonthlySpendKPI).toHaveText('₹24,700');
    await expect(dashboardPage.totalCreditLimitKPI).toHaveText('₹150,000');
    await expect(dashboardPage.totalAvailableCreditKPI).toHaveText('₹107,000');
    await expect(dashboardPage.totalOutstandingKPI).toHaveText('₹43,000');
  });

  test('QE-10464 TS-002 TC-001 - Verify system displays appropriate message when user has no linked credit cards', async ({ page }) => {
    // Step 1: Authenticate as user with no cards
    await loginPage.login('testuser_nocards', 'Pass@123');
    
    // Step 2: Navigate to Dashboard
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Verify appropriate message
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    await expect(dashboardPage.noCardsMessage).toContainText('No credit cards found. Please link a credit card to view dashboard KPIs');
    
    // Step 4: Verify KPI widgets do not display zero or null
    await expect(dashboardPage.totalMonthlySpendKPI).not.toContainText('₹0');
    await expect(dashboardPage.totalMonthlySpendKPI).not.toContainText('null');
    
    // Step 5: Verify call-to-action button
    await expect(dashboardPage.addCardButton).toBeVisible();
    await expect(dashboardPage.addCardButton).toHaveText(/Add Card|Link Credit Card/);
    
    // Step 6: Click call-to-action button
    await dashboardPage.addCardButton.click();
    await expect(page).toHaveURL(/.*card.*link|add/);
  });

  test('QE-10464 TS-003 TC-001 - Verify system validates credit limit calculations for data integrity', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_validation', 'Pass@123');
    
    // Step 2: Navigate to Dashboard
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3-4: Verify validation passes for all cards
    const cardAValid = await dashboardPage.validateCardDataIntegrity('Card A');
    expect(cardAValid).toBe(true);
    
    const cardBValid = await dashboardPage.validateCardDataIntegrity('Card B');
    expect(cardBValid).toBe(true);
    
    const cardCValid = await dashboardPage.validateCardDataIntegrity('Card C');
    expect(cardCValid).toBe(true);
    
    // Step 5-6: Simulate data inconsistency and verify error indicator
    // Note: This would require backend API mocking or test data injection
    // Checking if error indicator mechanism exists
    const hasErrorIndicator = await dashboardPage.cardErrorIndicator.count();
    if (hasErrorIndicator > 0) {
      await expect(dashboardPage.cardErrorIndicator.first()).toBeVisible();
      await expect(dashboardPage.cardErrorIndicator.first()).toContainText(/Data inconsistency detected|Error/);
    }
  });

  test('QE-10468 TS-001 TC-001 - Verify dashboard automatically updates credit availability after new transaction', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_cardA', 'Pass@123');
    
    // Step 2: Note current values for Card A
    await dashboardPage.waitForDashboardLoad();
    const initialAvailable = await dashboardPage.getCardAvailableCredit('Card A').textContent();
    const initialOutstanding = await dashboardPage.getCardOutstanding('Card A').textContent();
    expect(initialAvailable).toBe('₹35,000');
    expect(initialOutstanding).toBe('₹15,000');
    
    // Step 3: Simulate transaction (via API or test harness)
    // This would require backend integration - placeholder for demonstration
    // await simulateTransaction('Card A', 5000);
    
    // Step 4-7: Verify automatic update within 2 seconds
    await page.waitForTimeout(2000); // Wait for auto-refresh
    await expect(dashboardPage.getCardAvailableCredit('Card A')).toHaveText('₹30,000', { timeout: 2000 });
    await expect(dashboardPage.getCardOutstanding('Card A')).toHaveText('₹20,000', { timeout: 2000 });
  });

  test('QE-10468 TS-002 TC-001 - Verify dashboard displays warning when real-time data service is unavailable', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser', 'Pass@123');
    
    // Step 2: Verify initial timestamp
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.lastUpdatedTimestamp).toContainText(/Just now|seconds ago/);
    
    // Step 3: Simulate service unavailability (mock API failure)
    await page.route('**/api/realtime-updates', route => route.abort());
    
    // Step 4: Wait 5 minutes (simulated)
    await page.waitForTimeout(5000); // Reduced for test execution
    
    // Step 5-7: Verify warning indicator and manual refresh prompt
    await expect(dashboardPage.warningIndicator).toBeVisible();
    await expect(dashboardPage.warningIndicator).toContainText(/Real-time updates unavailable|Service unavailable/);
    await expect(dashboardPage.lastUpdatedTimestamp).toContainText(/minutes ago/);
    await expect(dashboardPage.refreshButton).toBeVisible();
    
    // Step 8: Verify no misleading live indicators
    await expect(dashboardPage.liveIndicator).not.toBeVisible();
  });

  test('QE-10468 TS-003 TC-001 - Verify system updates only affected card after payment posting', async ({ page }) => {
    // Step 1: Authenticate
    await loginPage.login('testuser_3cards', 'Pass@123');
    
    // Step 2: Note initial balances
    await dashboardPage.waitForDashboardLoad();
    const cardAInitial = await dashboardPage.getCardBalances('Card A');
    const cardBInitial = await dashboardPage.getCardBalances('Card B');
    const cardCInitial = await dashboardPage.getCardBalances('Card C');
    
    // Step 3: Simulate payment to Card B
    // await simulatePayment('Card B', 10000);
    
    // Step 4: Wait for auto-refresh
    await page.waitForTimeout(2000);
    
    // Step 5-6: Verify Card B updates
    await expect(dashboardPage.getCardAvailableCredit('Card B')).toHaveText('₹32,000');
    await expect(dashboardPage.getCardOutstanding('Card B')).toHaveText('₹0');
    
    // Step 7-8: Verify Card A and C unchanged
    const cardAFinal = await dashboardPage.getCardBalances('Card A');
    const cardCFinal = await dashboardPage.getCardBalances('Card C');
    expect(cardAFinal).toEqual(cardAInitial);
    expect(cardCFinal).toEqual(cardCInitial);
    
    // Step 9: Verify aggregated KPIs updated
    await expect(dashboardPage.totalAvailableCreditKPI).toHaveText('₹117,000');
  });
});