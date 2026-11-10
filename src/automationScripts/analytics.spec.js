const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { BasePage } = require('./pages/base.page');

test.describe('Spending Analytics and Insights Tests', () => {
  let analyticsPage;
  let basePage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    basePage = new BasePage(page);
    await analyticsPage.navigate();
  });

  test('QE-9947 TS-001 TC-001: Verify interactive 12-month spending trend chart displays correctly with smooth animations and responsive interactions', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.selectMonthlyTrendView();
    
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    
    const dataPoints = await analyticsPage.getChartDataPoints();
    expect(dataPoints.length).toBe(12);
    
    const months = await analyticsPage.getChartMonthLabels();
    expect(months).toContain('Jan 2024');
    expect(months).toContain('Dec 2024');
    
    await analyticsPage.hoverOverDataPoint(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.chartTooltip.textContent();
    expect(tooltipText).toMatch(/Jan 2024: \$[\d,]+\.\d{2}/);
    
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect(analyticsPage.monthlyTrendChart).toBeVisible();
      const chartBox = await analyticsPage.monthlyTrendChart.boundingBox();
      expect(chartBox.width).toBeGreaterThan(0);
    }
  });

  test('QE-9947 TS-002 TC-001: Verify system displays friendly message when insufficient transaction data exists for trend analysis', async ({ page }) => {
    await page.route('**/api/transactions/categorized', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { cardId: 'CC001', category: 'Food & Dining', amount: 8500, month: '2024-01' }
        ])
      });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.selectMonthlyTrendView();
    
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.insufficientDataMessage.textContent();
    expect(messageText).toContain('Insufficient data to display trends');
    expect(messageText).toContain('At least 2 months of transaction history is required');
    
    await expect(analyticsPage.partialChart).toBeVisible();
    const dataPoints = await analyticsPage.getChartDataPoints();
    expect(dataPoints.length).toBe(1);
  });

  test('QE-9947 TS-003 TC-001: Verify error handling when analytics service is unavailable or times out', async ({ page }) => {
    await page.route('**/api/analytics/trends', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.selectMonthlyTrendView();
    
    await expect(analyticsPage.errorNotification).toBeVisible();
    const errorText = await analyticsPage.errorNotification.textContent();
    expect(errorText).toContain('Unable to load spending trends');
    expect(errorText).toContain('Please try again later');
    
    await expect(analyticsPage.retryButton).toBeVisible();
    await expect(analyticsPage.retryButton).toBeEnabled();
    
    await expect(analyticsPage.categoryTab).toBeVisible();
    await analyticsPage.selectCategoryView();
    await expect(analyticsPage.categoryChart).toBeVisible();
  });

  test('QE-9944 TS-001 TC-001: Verify interactive pie chart displays spending across all 9 categories with complete visual elements', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.selectCategoryView();
    
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    const categories = await analyticsPage.getCategoryLabels();
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
      'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    for (const category of expectedCategories) {
      expect(categories).toContain(category);
    }
    
    const percentages = await analyticsPage.getCategoryPercentages();
    for (const percentage of percentages) {
      expect(percentage).toMatch(/\d+%/);
    }
    
    const colors = await analyticsPage.getCategoryColors();
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(9);
    
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.chartTooltip.textContent();
    expect(tooltipText).toMatch(/Food & Dining: \$[\d,]+\.\d{2}/);
    
    await expect(analyticsPage.chartLegend).toBeVisible();
    const legendItems = await analyticsPage.getLegendItems();
    expect(legendItems.length).toBe(9);
  });

  test('QE-9944 TS-002 TC-001: Verify system displays appropriate message when no spending data exists for selected period', async ({ page }) => {
    await page.route('**/api/transactions/categorized', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.selectCategoryView();
    
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const messageText = await analyticsPage.noDataMessage.textContent();
    expect(messageText).toContain('No spending data available for the selected period');
    
    await expect(analyticsPage.dateRangeSelector).toBeVisible();
    await expect(analyticsPage.dateRangeSelector).toBeEnabled();
    
    await expect(analyticsPage.historicalDataLink).toBeVisible();
  });

  test('QE-9944 TS-003 TC-001: Verify system handles categorization service failure by defaulting uncategorized transactions to Miscellaneous', async ({ page }) => {
    await page.route('**/api/transactions/categorized', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { cardId: 'CC001', category: 'Food & Dining', amount: 8500, month: '2024-01' },
          { cardId: 'CC001', category: 'Fuel', amount: 3200, month: '2024-01' },
          { cardId: 'CC001', category: null, amount: 1500, month: '2024-01' },
          { cardId: 'CC002', category: null, amount: 2000, month: '2024-01' },
          { cardId: 'CC003', category: null, amount: 1000, month: '2024-01' }
        ])
      });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.selectCategoryView();
    
    const miscellaneousAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(parseFloat(miscellaneousAmount.replace(/[^\d.]/g, ''))).toBeGreaterThanOrEqual(4500);
    
    await expect(analyticsPage.warningIndicator).toBeVisible();
    const warningText = await analyticsPage.warningIndicator.textContent();
    expect(warningText).toContain('Some transactions could not be categorized');
    
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getCategoryLabels();
    expect(categories).toContain('Miscellaneous');
  });
});