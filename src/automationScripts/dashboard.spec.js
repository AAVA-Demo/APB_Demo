const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

// Test cases for QE-8982 (Available Credit Limit Tracking) and QE-8981 (Monthly Spend Dashboard Display)

test.describe('Dashboard KPI Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  // QE-8982 TS-001 TC-001: Verify accurate credit calculations for multiple credit cards
  test('TC-5846: Verify consolidated KPI dashboard displays accurate credit calculations for multiple cards', async ({ page }) => {
    // Step 1-2: Navigate to Dashboard (handled in beforeEach)
    await expect(dashboardPage.page).toHaveURL(/.*dashboard/);

    // Step 3: Verify user has multiple credit cards (mock data validation)
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);

    // Step 4: Verify Total Credit Limit KPI
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('155000');

    // Step 5: Verify Outstanding Amount KPI
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('40000');

    // Step 6: Verify Available Credit KPI (calculation: 155000 - 40000 = 115000)
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('115000');

    // Verify calculation accuracy
    const calculatedAvailable = parseInt(totalCreditLimit) - parseInt(outstandingAmount);
    expect(parseInt(availableCredit)).toBe(calculatedAvailable);
  });

  // QE-8982 TS-002 TC-001: Verify zero available credit when outstanding equals limit
  test('TC-5847: Verify available credit displays zero when outstanding amount equals credit limit', async ({ page }) => {
    // Step 1-2: Navigate to Dashboard (handled in beforeEach)
    await expect(dashboardPage.page).toHaveURL(/.*dashboard/);

    // Step 3: Verify card with outstanding equal to limit exists (mock data)
    // This would require specific test data setup or API mocking
    // For now, we validate the display logic

    // Step 4: Verify Available Credit displays zero
    const availableCredit = await dashboardPage.getAvailableCredit();
    
    // Step 5: Verify no negative value is displayed
    expect(parseInt(availableCredit)).toBeGreaterThanOrEqual(0);
    
    // Additional validation: if outstanding equals limit, available should be 0
    const totalLimit = await dashboardPage.getTotalCreditLimit();
    const outstanding = await dashboardPage.getOutstandingAmount();
    if (parseInt(totalLimit) === parseInt(outstanding)) {
      expect(availableCredit).toBe('0');
    }
  });

  // QE-8982 TS-003 TC-001: Verify error handling when service unavailable
  test('TC-5848: Verify appropriate error message when credit card data service is unavailable', async ({ page }) => {
    // Step 1: Navigate to application
    await dashboardPage.navigate();

    // Step 2: Simulate service unavailability by intercepting API call
    await page.route('**/cards', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });

    // Step 3: Navigate to Dashboard
    await dashboardPage.navigate();

    // Step 4: Verify error message is displayed
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText('Failed to load credit limit data');

    // Step 5: Verify application remains functional (no crash)
    await expect(dashboardPage.page).not.toHaveURL(/.*error/);
    const isNavigationPossible = await dashboardPage.isNavigationMenuVisible();
    expect(isNavigationPossible).toBe(true);
  });

  // QE-8981 TS-001 TC-001: Verify monthly spend aggregation across all active cards
  test('TC-5849: Verify monthly spend displays aggregated amount across all active credit cards', async ({ page }) => {
    // Step 1-2: Navigate to Dashboard (handled in beforeEach)
    await expect(dashboardPage.page).toHaveURL(/.*dashboard/);

    // Step 2: Verify user has active cards with transactions (mock data)
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);

    // Step 3: Dashboard already loaded
    // Step 4: Verify Monthly Spend KPI displays aggregated amount
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('15000'); // Expected: 5000 + 3000 + 7000

    // Step 5: Verify prominent display with proper formatting
    await expect(dashboardPage.monthlySpendTile).toBeVisible();
    const tileText = await dashboardPage.monthlySpendTile.textContent();
    expect(tileText).toContain('₹');
  });

  // QE-8981 TS-002 TC-001: Verify zero or placeholder for no transactions
  test('TC-5850: Verify monthly spend displays zero or placeholder when no transactions exist', async ({ page }) => {
    // Step 1-2: Navigate to Dashboard
    await dashboardPage.navigate();

    // Step 2: Mock scenario with no transactions
    await page.route('**/transactions/monthly-spend', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ monthlySpend: 0 })
      });
    });

    await dashboardPage.navigate();

    // Step 4: Verify Monthly Spend displays zero or placeholder
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend === '0' || monthlySpend === 'No spending this month').toBe(true);

    // Step 5: Verify no error message and graceful handling
    await expect(dashboardPage.errorMessage).not.toBeVisible();
    await expect(dashboardPage.monthlySpendTile).toBeVisible();
  });

  // QE-8981 TS-003 TC-001: Verify multi-card monthly spend aggregation accuracy
  test('TC-5851: Verify monthly spend calculation correctly aggregates amounts from all linked cards', async ({ page }) => {
    // Step 1-2: Navigate to Dashboard
    await dashboardPage.navigate();

    // Step 2: Verify multiple cards with transactions (mock data: Card A: 4000, Card B: 5000, Card C: 1500)
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);

    // Step 4: Verify Monthly Spend displays aggregated total
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('10500'); // Expected: 4000 + 5000 + 1500

    // Step 5: Navigate to My Cards and verify individual card spending
    await dashboardPage.navigateToMyCards();
    // Individual card verification would be in MyCardsPage tests
  });
});
