const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

// Test Case: QE-9759 TS-001 TC-001
test('QE-9759 TS-001 TC-001 - Verify consolidated KPI dashboard with four KPI widgets', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Access the main dashboard view
  await dashboardPage.navigate();
  await expect(dashboardPage.dashboardContainer).toBeVisible();

  // Step 3: Verify that four KPI widgets are displayed
  await expect(dashboardPage.monthlySpendWidget).toBeVisible();
  await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
  await expect(dashboardPage.availableCreditWidget).toBeVisible();
  await expect(dashboardPage.outstandingAmountWidget).toBeVisible();

  // Step 4: Verify the values and formatting of each KPI widget
  const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
  const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
  const availableCredit = await dashboardPage.getKPIValue('Available Credit');
  const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');

  expect(monthlySpend).toContain('$');
  expect(totalCreditLimit).toContain('$');
  expect(availableCredit).toContain('$');
  expect(outstandingAmount).toContain('$');
});

// Test Case: QE-9759 TS-002 TC-001
test('QE-9759 TS-002 TC-001 - Verify dashboard handles zero credit limit cards correctly', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Log into the application with user having zero credit limit card
  await loginPage.navigate();
  await loginPage.login('testuser_zerolimit@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Access the main dashboard view
  await dashboardPage.navigate();
  await expect(dashboardPage.dashboardContainer).toBeVisible();

  // Step 3: Verify the Total Credit Limit KPI widget value
  const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
  expect(totalCreditLimit).toContain('$5,000.00');

  // Step 4: Verify no division-by-zero errors occur
  await expect(dashboardPage.errorMessage).not.toBeVisible();
  await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
});

// Test Case: QE-9759 TS-003 TC-001
test('QE-9759 TS-003 TC-001 - Verify dashboard aggregates data across multiple cards', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Log into the application with multiple cards from different issuers
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Access the main dashboard view
  await dashboardPage.navigate();
  await expect(dashboardPage.dashboardContainer).toBeVisible();

  // Step 3: Verify the Total Credit Limit KPI widget value
  const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
  expect(totalCreditLimit).toContain('$23,000.00');

  // Step 4: Verify the Outstanding Amount KPI widget value
  const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');
  expect(outstandingAmount).toContain('$6,700.00');

  // Step 5: Verify the Available Credit KPI widget value
  const availableCredit = await dashboardPage.getKPIValue('Available Credit');
  expect(availableCredit).toContain('$16,300.00');
});

// Test Case: QE-9761 TS-001 TC-001
test('QE-9761 TS-001 TC-001 - Verify KPI dashboard auto-refreshes after 60 seconds', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to the KPI dashboard view
  await dashboardPage.navigate();
  await expect(dashboardPage.dashboardContainer).toBeVisible();

  // Step 3: Note the initial KPI values and timestamp
  const initialTimestamp = await dashboardPage.getLastUpdatedTimestamp();
  expect(initialTimestamp).toBeTruthy();

  // Step 4: Wait for 60 seconds without interacting with the page
  // Using page.waitForTimeout with explicit reason
  await page.waitForTimeout(61000); // Wait 61 seconds to ensure auto-refresh triggers

  // Step 5: Observe the KPI values and timestamp after 60 seconds
  const updatedTimestamp = await dashboardPage.getLastUpdatedTimestamp();
  expect(updatedTimestamp).not.toBe(initialTimestamp);
  expect(updatedTimestamp).toBeTruthy();
});

// Test Case: QE-9761 TS-002 TC-001
test('QE-9761 TS-002 TC-001 - Verify dashboard displays warning when backend latency exceeds 2 seconds', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to the KPI dashboard view
  await dashboardPage.navigate();
  await expect(dashboardPage.dashboardContainer).toBeVisible();

  // Step 3: Simulate backend service latency exceeding 2 seconds
  await page.route('**/api/transactions/monthly', async route => {
    await page.waitForTimeout(3000); // Simulate 3 second delay
    await route.continue();
  });

  // Step 4: Wait for the auto-refresh cycle to trigger
  await page.waitForTimeout(61000); // Wait for auto-refresh

  // Step 5: Observe the dashboard behavior during delayed response
  await expect(dashboardPage.warningIndicator).toBeVisible();
  const warningText = await dashboardPage.warningIndicator.textContent();
  expect(warningText).toContain('Data refresh delayed');
});

// Test Case: QE-9761 TS-003 TC-001
test('QE-9761 TS-003 TC-001 - Verify dashboard reflects new transaction data after auto-refresh', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to the KPI dashboard view and note current values
  await dashboardPage.navigate();
  await expect(dashboardPage.dashboardContainer).toBeVisible();
  const initialOutstanding = await dashboardPage.getKPIValue('Outstanding Amount');
  const initialAvailable = await dashboardPage.getKPIValue('Available Credit');

  // Step 3: Complete a new transaction (simulated via API call or mock)
  // In real scenario, this would trigger actual transaction processing
  await page.evaluate(() => {
    // Simulate transaction completion that updates backend
    localStorage.setItem('newTransaction', JSON.stringify({ amount: 100, cardId: '1' }));
  });

  // Step 4: Wait for the next auto-refresh cycle
  await page.waitForTimeout(61000); // Wait for auto-refresh

  // Step 5: Observe the updated Outstanding Amount and Available Credit
  const updatedOutstanding = await dashboardPage.getKPIValue('Outstanding Amount');
  const updatedAvailable = await dashboardPage.getKPIValue('Available Credit');
  expect(updatedOutstanding).not.toBe(initialOutstanding);
  expect(updatedAvailable).not.toBe(initialAvailable);
});
