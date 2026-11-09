const { test, expect } = require('@playwright/test');
const { TransactionAnalyticsPage } = require('./pages/transactionAnalytics.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Transaction Analytics Tests', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new TransactionAnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.validUser.username, testData.validUser.password);
  });

  test('QE-8169-TS001-TC001: Verify interactive category drill-down displays all nine categories', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.waitForCategoryChartLoad();
    
    const categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBe(9);
    
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of expectedCategories) {
      expect(categories).toContain(category);
    }
    
    await analyticsPage.clickCategory('Food & Dining');
    await expect(analyticsPage.drillDownView).toBeVisible();
    await expect(analyticsPage.transactionList).toBeVisible();
  });

  test('QE-8169-TS002-TC001: Verify pagination for categories with 1000+ transactions', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.clickCategory('Shopping');
    
    await expect(analyticsPage.paginationControls).toBeVisible();
    await expect(analyticsPage.nextButton).toBeVisible();
    await expect(analyticsPage.previousButton).toBeVisible();
    
    const transactionCount = await analyticsPage.getVisibleTransactionCount();
    expect(transactionCount).toBeLessThanOrEqual(100);
    
    await analyticsPage.nextButton.click();
    await analyticsPage.waitForTransactionLoad();
    await expect(analyticsPage.transactionList).toBeVisible();
  });

  test('QE-8169-TS003-TC001: Verify category tooltip displays amount, percentage, and transaction count', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.waitForCategoryChartLoad();
    
    await analyticsPage.hoverOverCategory('Fuel');
    await expect(analyticsPage.tooltip).toBeVisible();
    
    const tooltipText = await analyticsPage.tooltip.textContent();
    expect(tooltipText).toMatch(/Amount:.*₹\d+/);
    expect(tooltipText).toMatch(/Percentage:.*\d+\.?\d*%/);
    expect(tooltipText).toMatch(/Transactions:.*\d+/);
  });

  test('QE-8164-TS001-TC001: Verify category-wise spending visualization displays all categories', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.waitForVisualizationLoad();
    
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getAllVisibleCategories();
    expect(categories.length).toBeGreaterThan(0);
    
    for (const category of categories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      const percentage = await analyticsPage.getCategoryPercentage(category);
      expect(amount).toBeTruthy();
      expect(percentage).toBeTruthy();
    }
  });

  test('QE-8164-TS002-TC001: Verify visualization displays only populated categories', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.waitForVisualizationLoad();
    
    const visibleCategories = await analyticsPage.getVisibleCategories();
    const hiddenCategories = await analyticsPage.getHiddenCategories();
    
    expect(visibleCategories.length).toBeGreaterThan(0);
    for (const category of hiddenCategories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      expect(amount).toBe('0');
    }
  });

  test('QE-8164-TS003-TC001: Verify fallback table view when visualization fails', async ({ page }) => {
    await page.route('**/api/analytics/visualization', route => {
      route.fulfill({ status: 500, body: 'Aggregation Error' });
    });
    
    await analyticsPage.navigate();
    await expect(analyticsPage.fallbackTable).toBeVisible();
    await expect(analyticsPage.retryButton).toBeVisible();
    
    const tableHeaders = await analyticsPage.getTableHeaders();
    expect(tableHeaders).toContain('Category');
    expect(tableHeaders).toContain('Amount');
    expect(tableHeaders).toContain('Percentage');
  });

  test('QE-8163-TS001-TC001: Verify 12-month trend chart displays with drill-down', async ({ page }) => {
    await analyticsPage.navigateToTrendAnalysis();
    await analyticsPage.waitForTrendChartLoad();
    
    const months = await analyticsPage.getTrendMonths();
    expect(months.length).toBe(12);
    
    await analyticsPage.clickMonth('March 2024');
    await expect(analyticsPage.monthDetailView).toBeVisible();
    await expect(analyticsPage.categoryBreakdown).toBeVisible();
    await expect(analyticsPage.cardBreakdown).toBeVisible();
  });

  test('QE-8163-TS002-TC001: Verify limited history display with informational message', async ({ page }) => {
    await page.route('**/api/transactions/history', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ months: 3, data: [] })
      });
    });
    
    await analyticsPage.navigateToTrendAnalysis();
    await expect(analyticsPage.infoMessage).toBeVisible();
    
    const message = await analyticsPage.infoMessage.textContent();
    expect(message).toContain('Full 12-month trend analysis will be available');
  });

  test('QE-8168-TS001-TC001: Verify pattern analysis highlights recurring spending and anomalies', async ({ page }) => {
    await analyticsPage.navigateToPatternAnalysis();
    await analyticsPage.waitForPatternLoad();
    
    await expect(analyticsPage.recurringPatterns).toBeVisible();
    await expect(analyticsPage.anomalies).toBeVisible();
    
    const patterns = await analyticsPage.getRecurringPatterns();
    expect(patterns.length).toBeGreaterThan(0);
    
    const anomalies = await analyticsPage.getAnomalies();
    expect(anomalies.length).toBeGreaterThan(0);
  });

  test('QE-8168-TS002-TC001: Verify insufficient data message for users with less than 3 months history', async ({ page }) => {
    await page.route('**/api/transactions/history', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ months: 2, data: [] })
      });
    });
    
    await analyticsPage.navigateToPatternAnalysis();
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    
    const message = await analyticsPage.insufficientDataMessage.textContent();
    expect(message).toContain('at least 3-6 months of data');
  });

  test('QE-8168-TS003-TC001: Verify anomaly drill-down displays detailed transaction data', async ({ page }) => {
    await analyticsPage.navigateToPatternAnalysis();
    await analyticsPage.waitForPatternLoad();
    
    await analyticsPage.clickAnomalyMonth('March 2024');
    await expect(analyticsPage.anomalyDetailView).toBeVisible();
    await expect(analyticsPage.detailedTransactionList).toBeVisible();
    
    const explanation = await analyticsPage.getAnomalyExplanation();
    expect(explanation).toBeTruthy();
  });
});
