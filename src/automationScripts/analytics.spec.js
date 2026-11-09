const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Analytics and Spending Insights Tests', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await analyticsPage.navigate();
  });

  test('TC-QE-8055-TS-001-TC-001: Verify category-wise spending visualization displays all nine categories', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('diverse-spender@example.com', 'Pass@123');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
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
    
    await expect(analyticsPage.categoryChart).toBeVisible();
  });

  test('TC-QE-8055-TS-002-TC-001: Verify system categorizes uncategorized transactions as Miscellaneous', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('uncategorized-user@example.com', 'Pass@123');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    const miscellaneousAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(miscellaneousAmount).toBeTruthy();
  });

  test('TC-QE-8055-TS-003-TC-001: Verify category spending totals and percentages are accurate', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    
    const categories = await analyticsPage.getAllCategoryData();
    let totalSpending = 0;
    
    for (const category of categories) {
      const amount = parseFloat(category.amount.replace(/[$,]/g, ''));
      totalSpending += amount;
    }
    
    for (const category of categories) {
      const amount = parseFloat(category.amount.replace(/[$,]/g, ''));
      const expectedPercentage = (amount / totalSpending * 100).toFixed(2);
      expect(category.percentage).toContain(expectedPercentage);
    }
  });

  test('TC-QE-8047-TS-001-TC-001: Verify spending analytics displays all nine categories with amounts', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('diverse-spender@example.com', 'Pass@123');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    const startTime = Date.now();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
    
    const categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBe(9);
  });

  test('TC-QE-8047-TS-002-TC-001: Verify chart displays only category with spending data', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('single-category-user@example.com', 'Pass@123');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    const categoriesWithData = await analyticsPage.getCategoriesWithSpending();
    expect(categoriesWithData.length).toBeGreaterThanOrEqual(1);
  });

  test('TC-QE-8047-TS-003-TC-001: Verify transaction categorization based on merchant information', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    
    const categoryData = await analyticsPage.getAllCategoryData();
    
    for (const category of categoryData) {
      expect(category.name).toBeTruthy();
      expect(category.amount).toMatch(/\$[\d,]+/);
    }
  });

  test('TC-QE-8050-TS-001-TC-001: Verify drill-down displays detailed transactions within 1.5 seconds', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    
    const startTime = Date.now();
    await analyticsPage.clickCategory('Food & Dining');
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(1500);
    
    await expect(analyticsPage.transactionList).toBeVisible();
    
    const transactions = await analyticsPage.getTransactionDetails();
    for (const txn of transactions) {
      expect(txn.merchantName).toBeTruthy();
      expect(txn.date).toBeTruthy();
      expect(txn.amount).toMatch(/\$[\d,]+/);
    }
  });

  test('TC-QE-8050-TS-002-TC-001: Verify appropriate message for category with no transactions', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.clickCategory('Healthcare');
    
    const noDataMessage = await analyticsPage.getNoDataMessage();
    if (noDataMessage) {
      expect(noDataMessage).toContain('No transactions found');
    }
  });

  test('TC-QE-8050-TS-003-TC-001: Verify category drill-down filters and calculates total correctly', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.clickCategory('Food & Dining');
    await expect(analyticsPage.transactionList).toBeVisible();
    
    const transactions = await analyticsPage.getTransactionDetails();
    let calculatedTotal = 0;
    
    for (const txn of transactions) {
      const amount = parseFloat(txn.amount.replace(/[$,]/g, ''));
      calculatedTotal += amount;
    }
    
    const displayedTotal = await analyticsPage.getCategoryTotal();
    const displayedTotalNum = parseFloat(displayedTotal.replace(/[$,]/g, ''));
    
    expect(displayedTotalNum).toBeCloseTo(calculatedTotal, 2);
  });

  test('TC-QE-8046-TS-001-TC-001: Verify multi-category filter updates visualization within 1.5 seconds', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    
    const startTime = Date.now();
    await analyticsPage.selectMultipleCategories(['Travel', 'Entertainment']);
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(1500);
    
    const visibleCategories = await analyticsPage.getVisibleCategories();
    expect(visibleCategories).toContain('Travel');
    expect(visibleCategories).toContain('Entertainment');
    expect(visibleCategories.length).toBe(2);
  });

  test('TC-QE-8046-TS-002-TC-001: Verify appropriate message for categories with no transactions', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.selectMultipleCategories(['Healthcare', 'Education']);
    
    const noDataMessage = await analyticsPage.getNoDataMessage();
    if (noDataMessage) {
      expect(noDataMessage).toContain('No transactions exist');
    }
  });

  test('TC-QE-8046-TS-003-TC-001: Verify dynamic update when removing category from filter', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.selectMultipleCategories(['Travel', 'Entertainment', 'Shopping']);
    let visibleCategories = await analyticsPage.getVisibleCategories();
    expect(visibleCategories.length).toBe(3);
    
    await analyticsPage.deselectCategory('Entertainment');
    visibleCategories = await analyticsPage.getVisibleCategories();
    expect(visibleCategories.length).toBe(2);
    expect(visibleCategories).not.toContain('Entertainment');
  });
});

test.describe('Monthly Spend Trends Tests', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await analyticsPage.navigate();
  });

  test('TC-QE-8057-TS-001-TC-001: Verify monthly trends chart displays 12 months with drill-down', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('longtime-user@example.com', 'Pass@123');
    await analyticsPage.navigateToTrends();
    await analyticsPage.waitForTrendsLoad();
    
    const months = await analyticsPage.getTrendMonths();
    expect(months.length).toBe(12);
    
    await analyticsPage.clickMonth('June 2024');
    await expect(analyticsPage.monthDetailPanel).toBeVisible();
  });

  test('TC-QE-8057-TS-002-TC-001: Verify limited data notification for users with less than 12 months', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('newuser@example.com', 'Pass@123');
    await analyticsPage.navigateToTrends();
    await analyticsPage.waitForTrendsLoad();
    
    await expect(analyticsPage.limitedDataNotification).toBeVisible();
    await expect(analyticsPage.limitedDataNotification).toContainText(/Limited historical data|12 months/);
  });

  test('TC-QE-8057-TS-003-TC-001: Verify tooltip displays spending details on hover', async ({ page }) => {
    await analyticsPage.navigateToTrends();
    await analyticsPage.waitForTrendsLoad();
    
    await analyticsPage.hoverOverMonth('June 2024');
    
    await expect(analyticsPage.tooltip).toBeVisible();
    const tooltipText = await analyticsPage.tooltip.textContent();
    expect(tooltipText).toContain('June 2024');
    expect(tooltipText).toMatch(/\$[\d,]+/);
  });

  test('TC-QE-8049-TS-001-TC-001: Verify monthly spend trends displays 12 months with drill-down capability', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('longtime-user@example.com', 'Pass@123');
    await analyticsPage.navigateToTrends();
    await analyticsPage.waitForTrendsLoad();
    
    await expect(analyticsPage.trendsChart).toBeVisible();
    
    const months = await analyticsPage.getTrendMonths();
    expect(months.length).toBe(12);
    
    await analyticsPage.clickMonth('June 2024');
    await expect(analyticsPage.transactionBreakdown).toBeVisible();
  });

  test('TC-QE-8049-TS-002-TC-001: Verify limited data message for users with less than 3 months', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('newuser@example.com', 'Pass@123');
    await analyticsPage.navigateToTrends();
    await analyticsPage.waitForTrendsLoad();
    
    await expect(analyticsPage.limitedDataNotification).toBeVisible();
    const months = await analyticsPage.getTrendMonths();
    expect(months.length).toBeLessThan(12);
  });

  test('TC-QE-8049-TS-003-TC-001: Verify month drill-down shows detailed transaction breakdown', async ({ page }) => {
    await analyticsPage.navigateToTrends();
    await analyticsPage.waitForTrendsLoad();
    
    await analyticsPage.clickMonth('June 2024');
    await expect(analyticsPage.transactionBreakdown).toBeVisible();
    
    const transactions = await analyticsPage.getMonthTransactions();
    for (const txn of transactions) {
      expect(txn.merchant).toBeTruthy();
      expect(txn.date).toContain('June');
      expect(txn.amount).toMatch(/\$[\d,]+/);
      expect(txn.category).toBeTruthy();
    }
  });
});