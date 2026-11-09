const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Credit Card Dashboard - KPI Overview', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-8182 TS-001 TC-001 - Verify dashboard displays all four KPIs with accurate currency values for user with multiple active cards', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*login/);

    // Step 2: Log in with user credentials who has multiple active credit cards
    await loginPage.login(testData.users.multiCardUser.username, testData.users.multiCardUser.password);
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Verify Monthly Spend KPI is displayed
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpendText = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpendText).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);

    // Step 4: Verify Total Credit Limit KPI is displayed
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const creditLimitText = await dashboardPage.getTotalCreditLimitValue();
    expect(creditLimitText).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);

    // Step 5: Verify Available Credit KPI is displayed
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCreditText = await dashboardPage.getAvailableCreditValue();
    expect(availableCreditText).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);

    // Step 6: Verify Outstanding Amount KPI is displayed
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const outstandingText = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingText).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);

    // Step 7: Verify all currency values are accurate to exactly 2 decimal places
    const allKPIValues = [monthlySpendText, creditLimitText, availableCreditText, outstandingText];
    allKPIValues.forEach(value => {
      const decimalPart = value.split('.')[1];
      expect(decimalPart.length).toBe(2);
    });
  });

  test('QE-8182 TS-002 TC-001 - Verify appropriate error message when credit card data service is unavailable', async ({ page, context }) => {
    // Step 1: Simulate credit card data service unavailability
    await context.route('**/api/creditcards', route => route.abort());
    await context.route('**/api/users/*/cards', route => route.abort());

    // Step 2: Launch the application and log in
    await loginPage.login(testData.users.testUser.username, testData.users.testUser.password);

    // Step 3: Attempt to access the dashboard
    await dashboardPage.navigate();

    // Step 4: Verify error message is displayed
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('cannot be loaded');

    // Step 5: Verify KPI cards show error or loading state
    const kpiCardsVisible = await dashboardPage.areKPICardsVisible();
    expect(kpiCardsVisible).toBe(false);
  });

  test('QE-8182 TS-003 TC-001 - Verify KPI calculations are accurate for user with single active credit card', async ({ page }) => {
    // Step 1: Log in with user having single active credit card
    await loginPage.login(testData.users.singleCardUser.username, testData.users.singleCardUser.password);

    // Step 2: Navigate to Dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Verify Monthly Spend KPI aggregates data from single card
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);

    // Step 4: Verify Total Credit Limit displays the single card's credit limit
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('$10,000.00');

    // Step 5: Verify Outstanding Amount displays the single card's outstanding balance
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('$2,500.00');

    // Step 6: Verify Available Credit is calculated as (Total Credit Limit - Outstanding Amount)
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$7,500.00');

    // Step 7: Verify calculation accuracy to 2 decimal places
    const decimalPart = availableCredit.split('.')[1];
    expect(decimalPart.length).toBe(2);
  });
});

test.describe('Credit Card Dashboard - Responsive Layout', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('QE-8183 TS-001 TC-001 - Verify KPI dashboard is fully responsive on mobile device', async ({ page }) => {
    // Step 1: Set viewport to mobile device size (375px width)
    await page.setViewportSize({ width: 375, height: 667 });

    // Step 2: Launch the application and log in
    await loginPage.navigate();
    await loginPage.login(testData.users.testUser.username, testData.users.testUser.password);

    // Step 3: Navigate to Dashboard
    await dashboardPage.navigate();

    // Step 4: Verify all KPI cards stack vertically
    const isVerticalStack = await dashboardPage.areKPICardsStackedVertically();
    expect(isVerticalStack).toBe(true);

    // Step 5: Verify no horizontal scrolling is required
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScrollbar();
    expect(hasHorizontalScroll).toBe(false);

    // Step 6: Verify all KPI data is clearly visible and readable
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  test('QE-8183 TS-002 TC-001 - Verify KPI dashboard displays in two-column grid format on tablet device', async ({ page }) => {
    // Step 1: Set viewport to tablet size (768px width)
    await page.setViewportSize({ width: 768, height: 1024 });

    // Step 2: Launch the application and log in
    await loginPage.navigate();
    await loginPage.login(testData.users.testUser.username, testData.users.testUser.password);

    // Step 3: Navigate to Dashboard
    await dashboardPage.navigate();

    // Step 4: Verify KPIs are displayed in two-column grid format
    const isTwoColumnGrid = await dashboardPage.isKPILayoutTwoColumn();
    expect(isTwoColumnGrid).toBe(true);

    // Step 5: Verify all currency values are readable
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);

    // Step 6: Verify all labels remain readable without truncation
    const labels = await dashboardPage.getAllKPILabels();
    expect(labels).toContain('Monthly Spend');
    expect(labels).toContain('Total Credit Limit');
    expect(labels).toContain('Available Credit');
    expect(labels).toContain('Outstanding Amount');
  });

  test('QE-8183 TS-003 TC-001 - Verify dashboard maintains minimum usability on extremely narrow viewport', async ({ page }) => {
    // Step 1: Set viewport to extremely narrow width (320px)
    await page.setViewportSize({ width: 320, height: 568 });

    // Step 2: Launch the application and log in
    await loginPage.navigate();
    await loginPage.login(testData.users.testUser.username, testData.users.testUser.password);

    // Step 3: Navigate to Dashboard
    await dashboardPage.navigate();

    // Step 4: Verify no text overlapping occurs
    const hasOverlap = await dashboardPage.checkForTextOverlap();
    expect(hasOverlap).toBe(false);

    // Step 5: Verify no KPI values are truncated
    const areTruncated = await dashboardPage.areKPIValuesTruncated();
    expect(areTruncated).toBe(false);

    // Step 6: Verify minimum usability is maintained
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });
});