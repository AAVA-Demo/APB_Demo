const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

// Test cases for Category-Wise Spending Analysis (QE-10357)
test.describe('Category-Wise Spending Analysis Dashboard', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'testpass');
  });

  // QE-10357 TS-001 TC-001
  test('TC-001: Verify interactive spending chart displays all 9 predefined categories within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await analyticsPage.navigate();
    await analyticsPage.selectCategoryView();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    const categories = await analyticsPage.getAllCategories();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    expect(categories.length).toBe(9);
    
    const isInteractive = await analyticsPage.isChartInteractive();
    expect(isInteractive).toBeTruthy();
  });

  // QE-10357 TS-001 TC-002
  test('TC-002: Verify spending distribution accuracy across categories matches transaction data', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.selectCategoryView();
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    const categoryData = await analyticsPage.getCategorySpendingData();
    expect(categoryData['Food & Dining']).toBe(500);
    expect(categoryData['Fuel']).toBe(200);
    expect(categoryData['Shopping']).toBe(300);
    
    let totalSpend = 0;
    for (const category in categoryData) {
      totalSpend += categoryData[category];
    }
    expect(totalSpend).toBe(2500);
  });

  // QE-10357 TS-002 TC-001
  test('TC-003: Verify category drill-down displays detailed transactions with smooth transition', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.selectCategoryView();
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    await analyticsPage.clickCategory('Food & Dining');
    
    await expect(analyticsPage.transactionDetailView).toBeVisible();
    
    const transactions = await analyticsPage.getCategoryTransactions();
    for (const txn of transactions) {
      expect(txn.merchant).toBeTruthy();
      expect(txn.amount).toBeTruthy();
      expect(txn.date).toBeTruthy();
      expect(txn.card).toBeTruthy();
    }
  });

  // QE-10357 TS-002 TC-002
  test('TC-004: Verify drill-down allows navigation back to category overview', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.selectCategoryView();
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    await analyticsPage.clickCategory('Shopping');
    await expect(analyticsPage.transactionDetailView).toBeVisible();
    
    await analyticsPage.clickBackButton();
    
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBe(9);
  });

  // QE-10357 TS-003 TC-001
  test('TC-005: Verify no spending data message is displayed when no transactions exist for selected period', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.selectTimePeriod('January 2025');
    await analyticsPage.selectCategoryView();
    
    await expect(analyticsPage.noDataMessage).toBeVisible();
    await expect(analyticsPage.noDataMessage).toContainText('No spending data available for the selected period');
    await expect(analyticsPage.categoryChart).not.toBeVisible();
  });

  // QE-10357 TS-003 TC-002
  test('TC-006: Verify appropriate message when user has no transactions at all', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.selectCategoryView();
    
    const hasTransactions = await analyticsPage.hasAnyTransactions();
    if (!hasTransactions) {
      await expect(analyticsPage.noDataMessage).toBeVisible();
      const messageText = await analyticsPage.noDataMessage.textContent();
      expect(messageText).toMatch(/No spending data available|Start using your credit cards/);
      await expect(analyticsPage.categoryChart).not.toBeVisible();
    }
  });
});

// Test cases for Monthly Spend Trend Visualization (QE-10343)
test.describe('Monthly Spend Trend Visualization', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'testpass');
  });

  // QE-10343 TS-001 TC-001
  test('TC-007: Verify 12-month trend chart renders within 2 seconds with smooth transitions', async ({ page }) => {
    const startTime = Date.now();
    await analyticsPage.navigate();
    await analyticsPage.selectMonthlyTrendView();
    await expect(analyticsPage.trendChart).toBeVisible();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    const months = await analyticsPage.getTrendMonths();
    expect(months.length).toBe(12);
    expect(months).toContain('Jan');
    expect(months).toContain('Dec');
    
    const isInteractive = await analyticsPage.isChartInteractive();
    expect(isInteractive).toBeTruthy();
  });

  // QE-10343 TS-001 TC-002
  test('TC-008: Verify trend chart data accuracy matches monthly transaction totals', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.selectMonthlyTrendView();
    await expect(analyticsPage.trendChart).toBeVisible();
    
    const trendData = await analyticsPage.getMonthlyTrendData();
    expect(trendData['Jan']).toBe(2500);
    expect(trendData['Feb']).toBe(2800);
    expect(trendData['Mar']).toBe(2200);
  });

  // QE-10343 TS-002 TC-001
  test('TC-009: Verify interactive tooltip displays detailed spend amounts on hover', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.selectMonthlyTrendView();
    await expect(analyticsPage.trendChart).toBeVisible();
    
    await analyticsPage.hoverOverDataPoint('January');
    await expect(analyticsPage.tooltip).toBeVisible();
    
    const tooltipText = await analyticsPage.tooltip.textContent();
    expect(tooltipText).toContain('January');
    expect(tooltipText).toContain('$2500');
    
    await analyticsPage.hoverOverDataPoint('March');
    await expect(analyticsPage.tooltip).toBeVisible();
    
    await analyticsPage.hoverOverDataPoint('June');
    await expect(analyticsPage.tooltip).toBeVisible();
  });

  // QE-10343 TS-002 TC-002
  test('TC-010: Verify tooltip displays additional context (e.g., percentage change from previous month)', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.selectMonthlyTrendView();
    await expect(analyticsPage.trendChart).toBeVisible();
    
    await analyticsPage.hoverOverDataPoint('February');
    await expect(analyticsPage.tooltip).toBeVisible();
    
    const tooltipText = await analyticsPage.tooltip.textContent();
    expect(tooltipText).toContain('February');
    expect(tooltipText).toContain('$2800');
    expect(tooltipText).toMatch(/\+12%|from January/);
  });

  // QE-10343 TS-003 TC-001
  test('TC-011: Verify notification when user has insufficient data (less than 3 months)', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.selectMonthlyTrendView();
    
    const monthsAvailable = await analyticsPage.getAvailableMonthsCount();
    if (monthsAvailable < 3) {
      await expect(analyticsPage.insufficientDataNotification).toBeVisible();
      const notificationText = await analyticsPage.insufficientDataNotification.textContent();
      expect(notificationText).toContain('At least 3 months of data is required for meaningful trend analysis');
    }
  });

  // QE-10343 TS-003 TC-002
  test('TC-012: Verify chart displays available data with warning when data is limited', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.selectMonthlyTrendView();
    
    const monthsAvailable = await analyticsPage.getAvailableMonthsCount();
    if (monthsAvailable === 2) {
      await expect(analyticsPage.trendChart).toBeVisible();
      
      const months = await analyticsPage.getTrendMonths();
      expect(months.length).toBe(2);
      expect(months).toContain('Jan');
      expect(months).toContain('Feb');
      
      await expect(analyticsPage.warningMessage).toBeVisible();
      const warningText = await analyticsPage.warningMessage.textContent();
      expect(warningText).toMatch(/Limited data available|more meaningful with at least 3 months/);
      
      const isInteractive = await analyticsPage.isChartInteractive();
      expect(isInteractive).toBeTruthy();
    }
  });
});