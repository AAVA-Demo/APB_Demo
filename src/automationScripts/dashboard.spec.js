const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

// Test Case ID: 6986 - QE-9865 TS-001 TC-001
test('TC-6986: Verify dashboard updates available credit and outstanding amount in real-time after a transaction on a single card', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Verify Card A initial state
  const initialAvailableCredit = await dashboardPage.getCardAvailableCredit('Card A');
  const initialOutstanding = await dashboardPage.getCardOutstanding('Card A');
  expect(initialAvailableCredit).toBe('$3,000.00');
  expect(initialOutstanding).toBe('$2,000.00');
  
  // Step 3: Complete a $500 transaction on Card A
  await dashboardPage.addTransaction('Card A', 500);
  await expect(dashboardPage.transactionSuccessMessage).toBeVisible();
  
  // Step 4: Refresh the dashboard page
  await page.reload();
  await dashboardPage.waitForDashboardLoad();
  
  // Step 5: Verify Card A updated state
  const updatedAvailableCredit = await dashboardPage.getCardAvailableCredit('Card A');
  const updatedOutstanding = await dashboardPage.getCardOutstanding('Card A');
  expect(updatedAvailableCredit).toBe('$2,500.00');
  expect(updatedOutstanding).toBe('$2,500.00');
  
  // Step 6: Verify consolidated KPIs reflect the updated transaction
  const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
  const totalOutstanding = await dashboardPage.getKPIValue('Total Outstanding');
  expect(parseFloat(monthlySpend.replace(/[$,]/g, ''))).toBeGreaterThanOrEqual(500);
  expect(parseFloat(totalOutstanding.replace(/[$,]/g, ''))).toBeGreaterThanOrEqual(2500);
});

// Test Case ID: 6987 - QE-9865 TS-002 TC-001
test('TC-6987: Verify system prevents transaction that exceeds available credit limit and displays appropriate error message', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Verify Card B current available credit
  const availableCredit = await dashboardPage.getCardAvailableCredit('Card B');
  expect(availableCredit).toBe('$1,500.00');
  
  // Step 3: Attempt to record a transaction of $2000 on Card B
  await dashboardPage.addTransaction('Card B', 2000);
  
  // Step 4: Verify error message is displayed
  await expect(dashboardPage.errorMessage).toBeVisible();
  const errorText = await dashboardPage.errorMessage.textContent();
  expect(errorText).toContain('Insufficient available credit');
  expect(errorText).toContain('$1,500');
  
  // Step 5: Refresh dashboard and verify Card B balance remains unchanged
  await page.reload();
  await dashboardPage.waitForDashboardLoad();
  const unchangedAvailableCredit = await dashboardPage.getCardAvailableCredit('Card B');
  expect(unchangedAvailableCredit).toBe('$1,500.00');
});

// Test Case ID: 6988 - QE-9865 TS-003 TC-001
test('TC-6988: Verify system correctly updates multiple cards independently when simultaneous transactions occur', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Verify initial state of Card A and Card B
  const cardAInitialAvailable = await dashboardPage.getCardAvailableCredit('Card A');
  const cardAInitialOutstanding = await dashboardPage.getCardOutstanding('Card A');
  const cardBInitialAvailable = await dashboardPage.getCardAvailableCredit('Card B');
  const cardBInitialOutstanding = await dashboardPage.getCardOutstanding('Card B');
  expect(cardAInitialAvailable).toBe('$3,000.00');
  expect(cardAInitialOutstanding).toBe('$2,000.00');
  expect(cardBInitialAvailable).toBe('$5,000.00');
  expect(cardBInitialOutstanding).toBe('$3,000.00');
  
  // Step 3 & 4: Record transactions on both cards
  await dashboardPage.addTransaction('Card A', 400);
  await dashboardPage.addTransaction('Card B', 600);
  
  // Step 5: Refresh the dashboard
  await page.reload();
  await dashboardPage.waitForDashboardLoad();
  
  // Step 6: Verify Card A updated state
  const cardAUpdatedAvailable = await dashboardPage.getCardAvailableCredit('Card A');
  const cardAUpdatedOutstanding = await dashboardPage.getCardOutstanding('Card A');
  expect(cardAUpdatedAvailable).toBe('$2,600.00');
  expect(cardAUpdatedOutstanding).toBe('$2,400.00');
  
  // Step 7: Verify Card B updated state
  const cardBUpdatedAvailable = await dashboardPage.getCardAvailableCredit('Card B');
  const cardBUpdatedOutstanding = await dashboardPage.getCardOutstanding('Card B');
  expect(cardBUpdatedAvailable).toBe('$4,400.00');
  expect(cardBUpdatedOutstanding).toBe('$3,600.00');
  
  // Step 8: Verify no data conflicts or synchronization errors
  expect(cardAUpdatedAvailable).not.toBe(cardBUpdatedAvailable);
  expect(cardAUpdatedOutstanding).not.toBe(cardBUpdatedOutstanding);
});

// Test Case ID: 6989 - QE-9864 TS-001 TC-001
test('TC-6989: Verify consolidated KPI dashboard displays accurate totals across 4 active credit cards', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Verify 4 active credit cards are displayed
  const cardCount = await dashboardPage.getActiveCardCount();
  expect(cardCount).toBe(4);
  const cardNames = await dashboardPage.getAllCardNames();
  expect(cardNames).toContain('Visa Gold');
  expect(cardNames).toContain('MasterCard Platinum');
  expect(cardNames).toContain('Amex Blue');
  expect(cardNames).toContain('Discover Silver');
  
  // Step 3: Verify Monthly Spend KPI
  const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
  expect(monthlySpend).toBe('$4,500.00');
  
  // Step 4: Verify Total Credit Limit KPI
  const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
  expect(totalCreditLimit).toBe('$35,000.00');
  
  // Step 5: Verify Available Credit KPI
  const availableCredit = await dashboardPage.getKPIValue('Available Credit');
  expect(availableCredit).toBe('$22,000.00');
  
  // Step 6: Verify Total Outstanding Amount KPI
  const totalOutstanding = await dashboardPage.getKPIValue('Total Outstanding');
  expect(totalOutstanding).toBe('$13,000.00');
});

// Test Case ID: 6990 - QE-9864 TS-002 TC-001
test('TC-6990: Verify dashboard correctly handles zero balance and no transaction scenario', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Verify all credit cards have zero current balance
  const allCards = await dashboardPage.getAllCardNames();
  for (const cardName of allCards) {
    const outstanding = await dashboardPage.getCardOutstanding(cardName);
    expect(outstanding).toBe('$0.00');
  }
  
  // Step 3: Verify no transactions exist in current month
  const transactionCount = await dashboardPage.getCurrentMonthTransactionCount();
  expect(transactionCount).toBe(0);
  
  // Step 4: Verify Monthly Spend KPI displays $0
  const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
  expect(monthlySpend).toBe('$0.00');
  
  // Step 5: Verify Total Outstanding Amount KPI displays $0
  const totalOutstanding = await dashboardPage.getKPIValue('Total Outstanding');
  expect(totalOutstanding).toBe('$0.00');
  
  // Step 6: Verify Total Credit Limit KPI displays full credit capacity
  const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
  expect(totalCreditLimit).toBe('$35,000.00');
  
  // Step 7: Verify Available Credit KPI equals Total Credit Limit
  const availableCredit = await dashboardPage.getKPIValue('Available Credit');
  expect(availableCredit).toBe('$35,000.00');
});

// Test Case ID: 6991 - QE-9864 TS-003 TC-001
test('TC-6991: Verify dashboard displays multi-card summary section with individual card details', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  await expect(page).toHaveTitle(/Credit Card Dashboard/i);
  
  // Step 2: Verify consolidated KPIs section is displayed at the top
  await expect(dashboardPage.kpiSection).toBeVisible();
  const kpiLabels = await dashboardPage.getAllKPILabels();
  expect(kpiLabels).toContain('Monthly Spend');
  expect(kpiLabels).toContain('Total Credit Limit');
  expect(kpiLabels).toContain('Available Credit');
  expect(kpiLabels).toContain('Total Outstanding');
  
  // Step 3: Scroll down and verify multi-card summary section
  await dashboardPage.scrollToCardSummary();
  await expect(dashboardPage.cardSummarySection).toBeVisible();
  
  // Step 4: Verify each card tile displays required details
  const cardDetails = await dashboardPage.getCardDetails('Visa Gold');
  expect(cardDetails.creditLimit).toBe('$10,000.00');
  expect(cardDetails.availableCredit).toBe('$6,000.00');
  expect(cardDetails.currentBalance).toBe('$4,000.00');
  
  // Step 5: Click on card tile to drill down
  await dashboardPage.clickCardTile('Visa Gold');
  await expect(page).toHaveURL(/.*\/card\/visa-gold/i);
  
  // Step 6: Verify individual card view displays transaction history
  await expect(dashboardPage.transactionHistoryTable).toBeVisible();
  await expect(dashboardPage.cardMetricsSection).toBeVisible();
});