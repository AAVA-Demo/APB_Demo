const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { PortfolioPage } = require('./pages/portfolio.page');

// Test Case: QE-10419 TS-001 TC-001
test('Verify consolidated KPIs display for user with three active credit cards within 2 seconds', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  await expect(page).toHaveTitle(/Credit Card/);
  
  // Step 2: Navigate to Dashboard landing page
  const startTime = Date.now();
  await dashboardPage.waitForDashboardLoad();
  const loadTime = Date.now() - startTime;
  
  // Verify load time within 2 seconds
  expect(loadTime).toBeLessThan(2000);
  
  // Step 3: Verify aggregated monthly spend KPI
  const monthlySpend = await dashboardPage.getMonthlySpend();
  await expect(dashboardPage.monthlySpendKPI).toBeVisible();
  expect(monthlySpend).toContain('$');
  
  // Step 4: Verify total credit limit KPI
  const creditLimit = await dashboardPage.getTotalCreditLimit();
  await expect(dashboardPage.creditLimitKPI).toBeVisible();
  expect(creditLimit).toContain('$');
  
  // Step 5: Verify total available credit KPI
  const availableCredit = await dashboardPage.getAvailableCredit();
  await expect(dashboardPage.availableCreditKPI).toBeVisible();
  expect(availableCredit).toContain('$');
  
  // Step 6: Verify total outstanding amounts KPI
  const outstanding = await dashboardPage.getOutstandingAmount();
  await expect(dashboardPage.outstandingKPI).toBeVisible();
  expect(outstanding).toContain('$');
  
  // Step 7: Verify financial calculations accuracy
  await dashboardPage.verifyFinancialCalculations();
});

// Test Case: QE-10419 TS-002 TC-001
test('Verify KPIs display zero monthly spend and outstanding when user has zero balance', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  
  // Step 2: Navigate to Dashboard with zero balance user
  await dashboardPage.waitForDashboardLoad();
  
  // Step 3: Verify monthly spend KPI displays zero
  const monthlySpend = await dashboardPage.getMonthlySpend();
  expect(monthlySpend).toContain('$0.00');
  
  // Step 4: Verify outstanding amount KPI displays zero
  const outstanding = await dashboardPage.getOutstandingAmount();
  expect(outstanding).toContain('$0.00');
  
  // Step 5: Verify credit limit KPI displays correct non-zero value
  const creditLimit = await dashboardPage.getTotalCreditLimit();
  expect(parseFloat(creditLimit.replace(/[$,]/g, ''))).toBeGreaterThan(0);
  
  // Step 6: Verify available credit equals total credit limit
  const availableCredit = await dashboardPage.getAvailableCredit();
  expect(availableCredit).toBe(creditLimit);
});

// Test Case: QE-10419 TS-003 TC-001
test('Verify accurate credit utilization percentage calculation with varying outstanding balances', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await dashboardPage.navigate();
  
  // Step 2: Navigate to Dashboard with varying balances
  await dashboardPage.waitForDashboardLoad();
  
  // Step 3: Verify total outstanding amount
  const outstanding = await dashboardPage.getOutstandingAmount();
  const outstandingValue = parseFloat(outstanding.replace(/[$,]/g, ''));
  expect(outstandingValue).toBeGreaterThan(0);
  
  // Step 4: Verify total credit limit
  const creditLimit = await dashboardPage.getTotalCreditLimit();
  const creditLimitValue = parseFloat(creditLimit.replace(/[$,]/g, ''));
  expect(creditLimitValue).toBeGreaterThan(0);
  
  // Step 5: Verify credit utilization calculation
  const utilization = await dashboardPage.getCreditUtilization();
  const expectedUtilization = (outstandingValue / creditLimitValue) * 100;
  const utilizationValue = parseFloat(utilization.replace('%', ''));
  expect(Math.abs(utilizationValue - expectedUtilization)).toBeLessThan(0.1);
  
  // Step 6: Verify real-time data reflection
  await expect(dashboardPage.creditUtilizationBar).toBeVisible();
});

// Test Case: QE-10417 TS-001 TC-001
test('Verify responsive dashboard layout displays KPIs in stacked vertical format on mobile', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await dashboardPage.navigate();
  
  // Step 2: Navigate to Dashboard
  await dashboardPage.waitForDashboardLoad();
  
  // Step 3: Verify KPIs in stacked vertical format
  const kpiLayout = await dashboardPage.getKPILayout();
  expect(kpiLayout).toBe('vertical');
  
  // Step 4: Verify KPI cards fit within viewport
  const kpiCards = await dashboardPage.getAllKPICards();
  for (const card of kpiCards) {
    const box = await card.boundingBox();
    expect(box.width).toBeLessThanOrEqual(375);
  }
  
  // Step 5: Verify text readability
  await expect(dashboardPage.monthlySpendKPI).toBeVisible();
  await expect(dashboardPage.creditLimitKPI).toBeVisible();
  await expect(dashboardPage.availableCreditKPI).toBeVisible();
  await expect(dashboardPage.outstandingKPI).toBeVisible();
});

// Test Case: QE-10417 TS-002 TC-001
test('Verify responsive dashboard layout displays KPIs in horizontal grid on desktop', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Set desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 });
  await dashboardPage.navigate();
  
  // Step 2: Navigate to Dashboard
  await dashboardPage.waitForDashboardLoad();
  
  // Step 3: Verify KPIs in horizontal grid format
  const kpiLayout = await dashboardPage.getKPILayout();
  expect(kpiLayout).toBe('horizontal');
  
  // Step 4: Verify KPIs utilize full screen width
  const kpiContainer = await dashboardPage.getKPIContainerWidth();
  expect(kpiContainer).toBeGreaterThan(1800);
  
  // Step 5: Verify optimal spacing and readability
  const kpiCards = await dashboardPage.getAllKPICards();
  expect(kpiCards.length).toBe(4);
  await expect(kpiCards[0]).toBeVisible();
});

// Test Case: QE-10417 TS-003 TC-001
test('Verify dashboard adjusts to very small viewport without horizontal scrolling', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Set very small viewport
  await page.setViewportSize({ width: 320, height: 568 });
  await dashboardPage.navigate();
  
  // Step 2: Navigate to Dashboard
  await dashboardPage.waitForDashboardLoad();
  
  // Step 3: Verify no horizontal scrolling
  const hasHorizontalScroll = await dashboardPage.hasHorizontalScrollbar();
  expect(hasHorizontalScroll).toBe(false);
  
  // Step 4: Verify text truncation with ellipsis
  const truncatedElements = await dashboardPage.getTruncatedElements();
  expect(truncatedElements.length).toBeGreaterThan(0);
  
  // Step 5: Verify KPI values remain visible
  await expect(dashboardPage.monthlySpendValue).toBeVisible();
  await expect(dashboardPage.creditLimitValue).toBeVisible();
});
