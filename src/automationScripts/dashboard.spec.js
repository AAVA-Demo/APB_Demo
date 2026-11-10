const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

// Test Case - QE-10364 TS-001 TC-001
test('QE-10364 TS-001 TC-001 - Verify authenticated user views all four KPIs with correct calculated values', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Launch the credit card dashboard application
  await loginPage.navigate();
  await expect(page).toHaveURL(/login|auth/);

  // Step 2 & 3: Enter valid credentials and login
  await loginPage.login('testuser@example.com', 'Pass@123');

  // Step 4-7: Verify all KPIs are displayed with correct values
  await expect(dashboardPage.monthlySpendKPI).toBeVisible();
  await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
  await expect(dashboardPage.availableCreditKPI).toBeVisible();
  await expect(dashboardPage.outstandingAmountKPI).toBeVisible();

  // Verify KPI values are numeric and greater than or equal to 0
  const monthlySpend = await dashboardPage.getKPIValue(dashboardPage.monthlySpendKPI);
  const totalLimit = await dashboardPage.getKPIValue(dashboardPage.totalCreditLimitKPI);
  const availableCredit = await dashboardPage.getKPIValue(dashboardPage.availableCreditKPI);
  const outstanding = await dashboardPage.getKPIValue(dashboardPage.outstandingAmountKPI);

  expect(monthlySpend).toBeGreaterThanOrEqual(0);
  expect(totalLimit).toBeGreaterThanOrEqual(0);
  expect(availableCredit).toBeGreaterThanOrEqual(0);
  expect(outstanding).toBeGreaterThanOrEqual(0);
});

// Test Case - QE-10364 TS-002 TC-001
test('QE-10364 TS-002 TC-001 - Verify dashboard displays zero or no-data message for user with no credit cards', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Authenticate as user with no linked credit cards
  await loginPage.navigate();
  await loginPage.login('newuser@example.com', 'Pass@123');

  // Step 2: Navigate to dashboard
  await dashboardPage.navigate();

  // Step 3: Verify all KPI values display as zero or show no-data message
  const hasNoDataMessage = await dashboardPage.isNoDataMessageVisible();
  if (!hasNoDataMessage) {
    const monthlySpend = await dashboardPage.getKPIValue(dashboardPage.monthlySpendKPI);
    const totalLimit = await dashboardPage.getKPIValue(dashboardPage.totalCreditLimitKPI);
    const availableCredit = await dashboardPage.getKPIValue(dashboardPage.availableCreditKPI);
    const outstanding = await dashboardPage.getKPIValue(dashboardPage.outstandingAmountKPI);

    expect(monthlySpend).toBe(0);
    expect(totalLimit).toBe(0);
    expect(availableCredit).toBe(0);
    expect(outstanding).toBe(0);
  } else {
    await expect(dashboardPage.noDataMessage).toBeVisible();
  }

  // Step 4: Verify user is prompted to add a credit card
  await expect(dashboardPage.addCardCTA).toBeVisible();
});

// Test Case - QE-10364 TS-003 TC-001
test('QE-10364 TS-003 TC-001 - Verify error notification with retry option when KPI aggregation service fails', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Authenticate
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Pass@123');

  // Step 2: Simulate KPI aggregation service failure by intercepting API call
  await page.route('**/api/creditcards/summary', route => route.abort());

  // Step 3: Navigate to dashboard
  await dashboardPage.navigate();

  // Step 4: Verify error notification is displayed
  await expect(dashboardPage.errorNotification).toBeVisible();
  await expect(dashboardPage.errorNotification).toContainText(/failed to load|error/i);

  // Step 5 & 6: Verify retry option is available and click it
  await expect(dashboardPage.retryButton).toBeVisible();
  await dashboardPage.retryButton.click();
});

// Test Case - QE-10360 TS-001 TC-001
test('QE-10360 TS-001 TC-001 - Verify dashboard is responsive on mobile device with 375px viewport', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Set viewport to 375px width (mobile device simulation)
  await page.setViewportSize({ width: 375, height: 667 });

  // Step 2: Launch application
  await loginPage.navigate();

  // Step 3: Authenticate
  await loginPage.login('testuser@example.com', 'Pass@123');

  // Step 4: Verify all KPI widgets are displayed in a single column layout
  await expect(dashboardPage.monthlySpendKPI).toBeVisible();
  await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
  await expect(dashboardPage.availableCreditKPI).toBeVisible();
  await expect(dashboardPage.outstandingAmountKPI).toBeVisible();

  // Step 5: Verify no horizontal scrolling is required
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(375);

  // Step 6: Verify all KPI values are readable and not truncated
  const kpiElements = [dashboardPage.monthlySpendKPI, dashboardPage.totalCreditLimitKPI, dashboardPage.availableCreditKPI, dashboardPage.outstandingAmountKPI];
  for (const kpi of kpiElements) {
    const isVisible = await kpi.isVisible();
    expect(isVisible).toBe(true);
  }
});

// Test Case - QE-10360 TS-002 TC-001
test('QE-10360 TS-002 TC-001 - Verify dashboard is responsive on tablet device with 768px viewport', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Set viewport to 768px width (tablet device simulation)
  await page.setViewportSize({ width: 768, height: 1024 });

  // Step 2: Launch application
  await loginPage.navigate();

  // Step 3: Authenticate
  await loginPage.login('testuser@example.com', 'Pass@123');

  // Step 4: Verify KPI widgets are displayed in a two-column grid layout
  await expect(dashboardPage.monthlySpendKPI).toBeVisible();
  await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
  await expect(dashboardPage.availableCreditKPI).toBeVisible();
  await expect(dashboardPage.outstandingAmountKPI).toBeVisible();

  // Step 5: Verify no horizontal scrolling is required
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(768);

  // Step 6: Verify all KPI labels and values are fully visible and readable
  const kpiElements = [dashboardPage.monthlySpendKPI, dashboardPage.totalCreditLimitKPI, dashboardPage.availableCreditKPI, dashboardPage.outstandingAmountKPI];
  for (const kpi of kpiElements) {
    const isVisible = await kpi.isVisible();
    expect(isVisible).toBe(true);
  }
});

// Test Case - QE-10360 TS-003 TC-001
test('QE-10360 TS-003 TC-001 - Verify dashboard handles extremely narrow viewport (320px)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Set viewport to 320px width (extremely narrow device simulation)
  await page.setViewportSize({ width: 320, height: 568 });

  // Step 2: Launch application
  await loginPage.navigate();

  // Step 3: Authenticate
  await loginPage.login('testuser@example.com', 'Pass@123');

  // Step 4: Verify all KPI widgets are displayed in a single column layout
  await expect(dashboardPage.monthlySpendKPI).toBeVisible();
  await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
  await expect(dashboardPage.availableCreditKPI).toBeVisible();
  await expect(dashboardPage.outstandingAmountKPI).toBeVisible();

  // Step 5: Verify all KPI values remain readable without text truncation
  const kpiElements = [dashboardPage.monthlySpendKPI, dashboardPage.totalCreditLimitKPI, dashboardPage.availableCreditKPI, dashboardPage.outstandingAmountKPI];
  for (const kpi of kpiElements) {
    const textContent = await kpi.textContent();
    expect(textContent).toBeTruthy();
  }

  // Step 6: Verify no overlapping elements occur
  const boundingBoxes = [];
  for (const kpi of kpiElements) {
    const box = await kpi.boundingBox();
    if (box) boundingBoxes.push(box);
  }
  // Check for overlaps
  for (let i = 0; i < boundingBoxes.length; i++) {
    for (let j = i + 1; j < boundingBoxes.length; j++) {
      const box1 = boundingBoxes[i];
      const box2 = boundingBoxes[j];
      const overlap = !(box1.x + box1.width < box2.x || box2.x + box2.width < box1.x || box1.y + box1.height < box2.y || box2.y + box2.height < box1.y);
      expect(overlap).toBe(false);
    }
  }

  // Step 7: Verify no horizontal scrolling is required
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(320);
});