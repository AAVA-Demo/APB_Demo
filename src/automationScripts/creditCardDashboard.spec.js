const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { AnalyticsPage } = require('./pages/analytics.page');

// Test Suite: QE-10415 - Responsive Layout Design
test.describe('Responsive Layout Tests', () => {
  let loginPage, dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
  });

  test('QE-10415 TS-001 TC-001 - Verify responsive layout on mobile (320px-575px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.kpiCardsContainer).toBeVisible();
    const columnCount = await dashboardPage.getKpiCardColumnCount();
    expect(columnCount).toBe(1);
    const fontSize = await dashboardPage.getContainerFontSize();
    expect(fontSize).toBe('14px');
    await expect(dashboardPage.creditCardTiles.first()).toBeVisible();
  });

  test('QE-10415 TS-001 TC-002 - Verify responsive layout on tablet (768px-991px)', async ({ page }) => {
    await page.setViewportSize({ width: 850, height: 1024 });
    await dashboardPage.waitForDashboardLoad();
    const columnCount = await dashboardPage.getKpiCardColumnCount();
    expect(columnCount).toBe(3);
    const fontSize = await dashboardPage.getContainerFontSize();
    expect(fontSize).toBe('16px');
    await expect(dashboardPage.navigationMenu).toBeVisible();
  });

  test('QE-10415 TS-001 TC-003 - Verify responsive layout on 4K desktop (3840px)', async ({ page }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await dashboardPage.waitForDashboardLoad();
    const columnCount = await dashboardPage.getKpiCardColumnCount();
    expect(columnCount).toBe(4);
    const fontSize = await dashboardPage.getContainerFontSize();
    expect(fontSize).toBe('18px');
  });

  test('QE-10415 TS-002 TC-001 - Verify dashboard on extremely narrow screen (below 320px)', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 600 });
    await dashboardPage.waitForDashboardLoad();
    const isScrollable = await dashboardPage.isHorizontallyScrollable();
    expect(isScrollable).toBe(true);
    await expect(dashboardPage.kpiCardsContainer).toBeVisible();
  });

  test('QE-10415 TS-003 TC-001 - Verify real-time responsive layout adjustment', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.waitForDashboardLoad();
    let columnCount = await dashboardPage.getKpiCardColumnCount();
    expect(columnCount).toBe(4);
    await page.setViewportSize({ width: 1100, height: 800 });
    await page.waitForTimeout(500);
    columnCount = await dashboardPage.getKpiCardColumnCount();
    expect(columnCount).toBe(3);
    await page.setViewportSize({ width: 850, height: 800 });
    await page.waitForTimeout(500);
    columnCount = await dashboardPage.getKpiCardColumnCount();
    expect(columnCount).toBe(3);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    columnCount = await dashboardPage.getKpiCardColumnCount();
    expect(columnCount).toBe(1);
  });
});

// Test Suite: QE-10414 - Monthly Spend Trend Analysis
test.describe('Monthly Spend Trend Analysis Tests', () => {
  let loginPage, analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigate();
  });

  test('QE-10414 TS-001 TC-001 - Verify monthly trend chart displays multi-month data', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    const monthLabels = await analyticsPage.getMonthlyTrendLabels();
    expect(monthLabels.length).toBeGreaterThanOrEqual(3);
    expect(monthLabels).toContain('2024-01');
    expect(monthLabels).toContain('2024-02');
    expect(monthLabels).toContain('2024-03');
    const isInteractive = await analyticsPage.isChartInteractive();
    expect(isInteractive).toBe(true);
  });

  test('QE-10414 TS-001 TC-002 - Verify monthly trend chart renders within 1.5 seconds', async ({ page }) => {
    const startTime = Date.now();
    await analyticsPage.waitForAnalyticsLoad();
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    const endTime = Date.now();
    const renderTime = (endTime - startTime) / 1000;
    expect(renderTime).toBeLessThanOrEqual(1.5);
  });

  test('QE-10414 TS-002 TC-001 - Verify monthly trend display for single month data', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('newuser', 'Pass@123');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    const monthLabels = await analyticsPage.getMonthlyTrendLabels();
    expect(monthLabels.length).toBe(1);
    const message = await analyticsPage.getLimitedDataMessage();
    expect(message).toContain('Trend analysis requires multiple months');
  });

  test('QE-10414 TS-003 TC-001 - Verify error handling when analytics engine fails', async ({ page }) => {
    await page.route('**/api/analytics/**', route => route.abort('failed'));
    await analyticsPage.navigate();
    await expect(analyticsPage.errorMessage).toBeVisible();
    const errorText = await analyticsPage.getErrorMessageText();
    expect(errorText).toContain('temporarily unavailable');
    await expect(analyticsPage.navigationMenu).toBeVisible();
  });
});

// Test Suite: QE-10413 - Multiple Credit Card View
test.describe('Multiple Credit Card View Tests', () => {
  let loginPage, dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-10413 TS-001 TC-001 - Verify multiple credit cards display correctly', async ({ page }) => {
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(3);
    const cardTypes = await dashboardPage.getAllCardTypes();
    expect(cardTypes).toContain('Visa');
    expect(cardTypes).toContain('MasterCard');
    expect(cardTypes).toContain('Amex');
    const firstCardNumber = await dashboardPage.getCardNumber(0);
    expect(firstCardNumber).toMatch(/\*\*\*\* \*\*\*\* \*\*\*\* \d{4}/);
    const firstCardData = await dashboardPage.getCardFinancialData(0);
    expect(firstCardData.creditLimit).toBeDefined();
    expect(firstCardData.availableCredit).toBeDefined();
    expect(firstCardData.outstanding).toBeDefined();
    expect(firstCardData.expiryDate).toBeDefined();
  });

  test('QE-10413 TS-001 TC-002 - Verify credit card data accuracy and calculations', async ({ page }) => {
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    const cardData = await dashboardPage.getCardFinancialData(0);
    const calculatedAvailable = cardData.creditLimit - cardData.outstanding;
    expect(cardData.availableCredit).toBe(calculatedAvailable);
    expect(cardData.monthlySpend).toBeGreaterThan(0);
  });

  test('QE-10413 TS-002 TC-001 - Verify dashboard with no registered credit cards', async ({ page }) => {
    await loginPage.login('newuser_nocard', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const message = await dashboardPage.getNoCardsMessageText();
    expect(message).toContain('No credit cards registered');
    const kpiValues = await dashboardPage.getAllKpiValues();
    kpiValues.forEach(value => {
      expect(value).toBe('$0.00');
    });
  });

  test('QE-10413 TS-003 TC-001 - Verify error handling when backend service unavailable', async ({ page }) => {
    await page.route('**/api/cards/**', route => route.abort('failed'));
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('Unable to load credit card information');
    expect(errorText).not.toContain('500');
    expect(errorText).not.toContain('API');
  });
});

// Test Suite: QE-10412 - Touch-friendly Mobile Interactions
test.describe('Touch-friendly Mobile Interactions Tests', () => {
  let loginPage, dashboardPage, analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
  });

  test('QE-10412 TS-001 TC-001 - Verify touch-friendly interactions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await dashboardPage.waitForDashboardLoad();
    const kpiCard = dashboardPage.kpiCards.first();
    await expect(kpiCard).toBeVisible();
    const touchTargetSize = await dashboardPage.getTouchTargetSize(kpiCard);
    expect(touchTargetSize.width).toBeGreaterThanOrEqual(44);
    expect(touchTargetSize.height).toBeGreaterThanOrEqual(44);
    await kpiCard.tap();
    const hasActiveClass = await dashboardPage.hasTouchActiveClass(kpiCard);
    expect(hasActiveClass).toBe(true);
  });

  test('QE-10412 TS-001 TC-002 - Verify touch feedback and visual states', async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    const chartElement = analyticsPage.categoryChart;
    await chartElement.tap();
    const opacity = await analyticsPage.getElementOpacity(chartElement);
    expect(parseFloat(opacity)).toBeLessThan(1.0);
  });

  test('QE-10412 TS-002 TC-001 - Verify poor UX with insufficient touch target', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await dashboardPage.waitForDashboardLoad();
    const smallElements = await dashboardPage.getElementsWithInsufficientTouchTarget();
    if (smallElements.length > 0) {
      console.log(`Found ${smallElements.length} elements with insufficient touch targets`);
    }
  });

  test('QE-10412 TS-003 TC-001 - Verify desktop mouse input behavior', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.waitForDashboardLoad();
    const kpiCard = dashboardPage.kpiCards.first();
    await kpiCard.hover();
    const hasHoverState = await dashboardPage.hasHoverState(kpiCard);
    expect(hasHoverState).toBe(true);
    const cursor = await dashboardPage.getCursorStyle(kpiCard);
    expect(cursor).toBe('pointer');
  });
});

// Test Suite: QE-10411 - Dashboard KPIs Display
test.describe('Dashboard KPIs Display Tests', () => {
  let loginPage, dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-10411 TS-001 TC-001 - Verify all KPIs display within 2 seconds', async ({ page }) => {
    await loginPage.login('testuser', 'Pass@123');
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.monthlySpendKpi).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKpi).toBeVisible();
    await expect(dashboardPage.availableCreditKpi).toBeVisible();
    await expect(dashboardPage.outstandingAmountKpi).toBeVisible();
    const endTime = Date.now();
    const loadTime = (endTime - startTime) / 1000;
    expect(loadTime).toBeLessThanOrEqual(2.0);
    const monthlySpend = await dashboardPage.getKpiValue('monthlySpend');
    expect(monthlySpend).toBe('$5,300.00');
    const totalCreditLimit = await dashboardPage.getKpiValue('totalCreditLimit');
    expect(totalCreditLimit).toBe('$45,000.00');
    const availableCredit = await dashboardPage.getKpiValue('availableCredit');
    expect(availableCredit).toBe('$33,000.00');
    const outstanding = await dashboardPage.getKpiValue('outstanding');
    expect(outstanding).toBe('$12,000.00');
  });

  test('QE-10411 TS-002 TC-001 - Verify graceful error handling for incomplete data', async ({ page }) => {
    await page.route('**/api/cards/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([{ cardId: 'card001', creditLimit: null }])
      });
    });
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    const availableKpis = await dashboardPage.getVisibleKpis();
    expect(availableKpis).toContain('monthlySpend');
    expect(availableKpis).toContain('outstanding');
    const unavailableMessage = await dashboardPage.getDataUnavailableMessage();
    expect(unavailableMessage).toContain('Data unavailable');
  });

  test('QE-10411 TS-003 TC-001 - Verify credit utilization calculation', async ({ page }) => {
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    const outstanding = await dashboardPage.getNumericKpiValue('outstanding');
    const totalCreditLimit = await dashboardPage.getNumericKpiValue('totalCreditLimit');
    const expectedUtilization = (outstanding / totalCreditLimit) * 100;
    const actualUtilization = await dashboardPage.getCreditUtilization();
    expect(actualUtilization).toBeCloseTo(expectedUtilization, 2);
    expect(actualUtilization).toBeCloseTo(26.67, 2);
  });
});

// Test Suite: QE-10410 - Category-wise Spending Visualization
test.describe('Category-wise Spending Visualization Tests', () => {
  let loginPage, analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigate();
  });

  test('QE-10410 TS-001 TC-001 - Verify category pie chart displays all nine categories', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getCategoryLabels();
    expect(categories.length).toBe(9);
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    const isInteractive = await analyticsPage.isChartInteractive();
    expect(isInteractive).toBe(true);
  });

  test('QE-10410 TS-001 TC-002 - Verify category chart renders within 1.5 seconds', async ({ page }) => {
    const startTime = Date.now();
    await analyticsPage.waitForAnalyticsLoad();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const endTime = Date.now();
    const renderTime = (endTime - startTime) / 1000;
    expect(renderTime).toBeLessThanOrEqual(1.5);
  });

  test('QE-10410 TS-002 TC-001 - Verify analytics with no transaction history', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('newuser_notrans', 'Pass@123');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const message = await analyticsPage.getNoDataMessageText();
    expect(message).toContain('No spending data available');
    const tableMessage = await analyticsPage.getTransactionTableMessage();
    expect(tableMessage).toContain('No transactions to display');
  });

  test('QE-10410 TS-003 TC-001 - Verify category drill-down functionality', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.clickCategorySlice('Food & Dining');
    await expect(analyticsPage.filterIndicator).toBeVisible();
    const filterText = await analyticsPage.getFilterIndicatorText();
    expect(filterText).toContain('Filtered by: Food & Dining');
    const transactions = await analyticsPage.getFilteredTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    transactions.forEach(transaction => {
      expect(transaction.category).toBe('Food & Dining');
    });
    await analyticsPage.clickClearFilter();
    await expect(analyticsPage.filterIndicator).not.toBeVisible();
  });
});