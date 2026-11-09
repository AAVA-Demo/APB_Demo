const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { logger } = require('../utils/logger');

test.describe('Category-Wise Spending Analytics Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    logger.info('Navigated to analytics page');
  });

  test('TC-4986 - Verify eight-category pie chart displays spending distribution with percentages', async ({ page }) => {
    logger.info('Starting test: Eight-category pie chart display');
    
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    
    const categories = await analyticsPage.getCategoryBreakdown();
    expect(categories.length).toBeGreaterThanOrEqual(8);
    
    categories.forEach(category => {
      expect(category.name).toBeTruthy();
      expect(category.amount).toMatch(/\$[0-9,]+/);
      expect(category.percentage).toMatch(/\d+%/);
    });
    
    logger.info('Eight-category pie chart validated successfully');
  });

  test('TC-4987 - Verify empty chart with appropriate message when no transaction data exists', async ({ page }) => {
    logger.info('Starting test: Empty chart scenario');
    
    await page.route('**/api/transactions', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ transactions: [] })
      });
    });
    
    await page.reload();
    
    await expect(analyticsPage.emptyChartMessage).toBeVisible();
    const messageText = await analyticsPage.emptyChartMessage.textContent();
    expect(messageText).toContain('No spending data available');
    
    logger.info('Empty chart message validated');
  });

  test('TC-4988 - Verify category drill-down displays all transactions when user clicks on a category', async ({ page }) => {
    logger.info('Starting test: Category drill-down');
    
    await analyticsPage.clickCategory('Travel');
    
    await expect(analyticsPage.categoryDetailModal).toBeVisible();
    
    const transactions = await analyticsPage.getCategoryTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    
    transactions.forEach(transaction => {
      expect(transaction.merchantName).toBeTruthy();
      expect(transaction.date).toBeTruthy();
      expect(transaction.amount).toMatch(/\$[0-9,]+/);
    });
    
    logger.info('Category drill-down validated successfully');
  });

  test('TC-5015 - Verify multi-category spending breakdown displays visual chart with amounts for 7 categories', async ({ page }) => {
    logger.info('Starting test: Multi-category spending breakdown');
    
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    
    const categories = await analyticsPage.getCategoryBreakdown();
    const nonZeroCategories = categories.filter(cat => !cat.amount.includes('$0'));
    
    expect(nonZeroCategories.length).toBe(7);
    
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare'];
    expectedCategories.forEach(expectedCat => {
      const found = categories.some(cat => cat.name === expectedCat);
      expect(found).toBe(true);
    });
    
    logger.info('Multi-category breakdown validated');
  });

  test('TC-5016 - Verify no spending data message displays when user has no transactions in current month', async ({ page }) => {
    logger.info('Starting test: No spending data for current month');
    
    await page.route('**/api/transactions**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ transactions: [] })
      });
    });
    
    await page.reload();
    
    await expect(analyticsPage.emptyChartMessage).toBeVisible();
    const messageText = await analyticsPage.emptyChartMessage.textContent();
    expect(messageText).toContain('No spending data available for the current month');
    
    const categories = await analyticsPage.getCategoryBreakdown();
    categories.forEach(category => {
      expect(category.amount).toBe('$0');
    });
    
    logger.info('No spending data message validated');
  });

  test('TC-5017 - Verify all categories with percentages display when user has transactions in all 9 categories', async ({ page }) => {
    logger.info('Starting test: All 9 categories with percentages');
    
    const mockTransactions = [
      { category: 'Food & Dining', amount: 1200 },
      { category: 'Fuel', amount: 300 },
      { category: 'Shopping', amount: 800 },
      { category: 'Travel', amount: 600 },
      { category: 'Entertainment', amount: 200 },
      { category: 'Utilities', amount: 250 },
      { category: 'Healthcare', amount: 150 },
      { category: 'Education', amount: 400 },
      { category: 'Miscellaneous', amount: 100 }
    ];
    
    await page.route('**/api/analytics/categories', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ categories: mockTransactions })
      });
    });
    
    await page.reload();
    
    const categories = await analyticsPage.getCategoryBreakdown();
    expect(categories.length).toBe(9);
    
    categories.forEach(category => {
      expect(category.name).toBeTruthy();
      expect(category.amount).toMatch(/\$[0-9,]+/);
      expect(category.percentage).toMatch(/\d+%/);
    });
    
    logger.info('All 9 categories validated with percentages');
  });
});

test.describe('Interactive Category Chart Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  test('TC-5046 - Verify interactive category chart drill-down displays 15 transactions with merchant details', async ({ page }) => {
    logger.info('Starting test: Interactive chart drill-down with 15 transactions');
    
    await analyticsPage.clickCategory('Food & Dining');
    
    await expect(analyticsPage.categoryDetailModal).toBeVisible();
    
    const transactions = await analyticsPage.getCategoryTransactions();
    expect(transactions.length).toBe(15);
    
    transactions.forEach(transaction => {
      expect(transaction.merchantName).toBeTruthy();
      expect(transaction.date).toBeTruthy();
      expect(transaction.amount).toMatch(/\$[0-9,]+/);
    });
    
    logger.info('15 transactions with merchant details validated');
  });

  test('TC-5047 - Verify zero transactions message displays when user clicks on category with no transactions', async ({ page }) => {
    logger.info('Starting test: Zero transactions in category');
    
    await page.route('**/api/transactions/category/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ transactions: [] })
      });
    });
    
    await analyticsPage.clickCategory('Healthcare');
    
    await expect(analyticsPage.categoryDetailModal).toBeVisible();
    await expect(analyticsPage.noTransactionsMessage).toBeVisible();
    
    const messageText = await analyticsPage.noTransactionsMessage.textContent();
    expect(messageText).toContain('No transactions found in Healthcare category');
    
    logger.info('Zero transactions message validated');
  });

  test('TC-5048 - Verify category hover tooltip displays transaction count, total amount, and percentage', async ({ page }) => {
    logger.info('Starting test: Category hover tooltip');
    
    await analyticsPage.hoverOverCategory('Travel');
    
    await expect(analyticsPage.categoryTooltip).toBeVisible();
    
    const tooltipText = await analyticsPage.categoryTooltip.textContent();
    expect(tooltipText).toContain('Travel');
    expect(tooltipText).toMatch(/\$[0-9,]+/);
    expect(tooltipText).toMatch(/\d+%/);
    expect(tooltipText).toMatch(/\d+ transactions/);
    
    logger.info('Category tooltip validated with all details');
  });
});

test.describe('Historical Spending Comparison Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  test('TC-5018 - Verify historical spending comparison displays side-by-side category breakdowns with percentage change', async ({ page }) => {
    logger.info('Starting test: Historical spending comparison');
    
    await analyticsPage.navigateToHistoricalComparison();
    
    await expect(analyticsPage.comparisonTable).toBeVisible();
    
    const comparisonData = await analyticsPage.getComparisonData();
    expect(comparisonData.length).toBeGreaterThan(0);
    
    comparisonData.forEach(row => {
      expect(row.category).toBeTruthy();
      expect(row.currentMonth).toMatch(/\$[0-9,]+/);
      expect(row.previousMonth).toMatch(/\$[0-9,]+/);
      expect(row.percentageChange).toMatch(/[+-]?\d+%/);
    });
    
    logger.info('Historical comparison validated successfully');
  });

  test('TC-5019 - Verify insufficient historical data error message displays when user has less than 6 months of data', async ({ page }) => {
    logger.info('Starting test: Insufficient historical data');
    
    await page.route('**/api/analytics/historical', route => {
      route.fulfill({
        status: 400,
        body: JSON.stringify({ error: 'Insufficient historical data' })
      });
    });
    
    await analyticsPage.navigateToHistoricalComparison();
    
    await expect(analyticsPage.errorMessage).toBeVisible();
    const errorText = await analyticsPage.errorMessage.textContent();
    expect(errorText).toContain('Insufficient historical data - minimum 6 months required');
    
    logger.info('Insufficient data error validated');
  });

  test('TC-5020 - Verify no previous month data message displays when previous month transaction data is missing', async ({ page }) => {
    logger.info('Starting test: No previous month data');
    
    await page.route('**/api/analytics/historical', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ currentMonth: {}, previousMonth: null })
      });
    });
    
    await analyticsPage.navigateToHistoricalComparison();
    
    await expect(analyticsPage.warningMessage).toBeVisible();
    const warningText = await analyticsPage.warningMessage.textContent();
    expect(warningText).toContain('No previous month data available for comparison');
    
    logger.info('No previous month data message validated');
  });
});

test.describe('Monthly Trend Analysis Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  test('TC-4980 - Verify six-month trend analysis displays interactive line chart with monthly spending values', async ({ page }) => {
    logger.info('Starting test: Six-month trend analysis');
    
    await analyticsPage.navigateToTrendAnalysis();
    
    await expect(analyticsPage.trendLineChart).toBeVisible();
    
    const dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints.length).toBe(6);
    
    dataPoints.forEach(point => {
      expect(point.month).toBeTruthy();
      expect(point.amount).toMatch(/\$[0-9,]+/);
    });
    
    logger.info('Six-month trend chart validated');
  });

  test('TC-4981 - Verify insufficient data warning displays when user has less than 3 months of transaction history', async ({ page }) => {
    logger.info('Starting test: Insufficient trend data warning');
    
    await page.route('**/api/analytics/trends', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ months: 2, data: [] })
      });
    });
    
    await analyticsPage.navigateToTrendAnalysis();
    
    await expect(analyticsPage.warningMessage).toBeVisible();
    const warningText = await analyticsPage.warningMessage.textContent();
    expect(warningText).toContain('Insufficient data for trend analysis - minimum 3 months required');
    
    logger.info('Insufficient trend data warning validated');
  });

  test('TC-4982 - Verify monthly drill-down displays detailed breakdown when user clicks on a specific month', async ({ page }) => {
    logger.info('Starting test: Monthly drill-down');
    
    await analyticsPage.navigateToTrendAnalysis();
    await analyticsPage.clickTrendDataPoint('March 2024');
    
    await expect(analyticsPage.monthDetailModal).toBeVisible();
    
    const monthDetails = await analyticsPage.getMonthDetails();
    expect(monthDetails.categoryBreakdown).toBeTruthy();
    expect(monthDetails.topMerchants).toBeTruthy();
    expect(monthDetails.transactionCount).toMatch(/\d+/);
    
    logger.info('Monthly drill-down validated');
  });
});
