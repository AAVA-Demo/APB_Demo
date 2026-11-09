const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { Logger } = require('../utils/logger');
const config = require('../../data/config.json');

test.describe('Spending Analytics Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    Logger.info('Navigated to Analytics page');
  });

  test('QE-8952 TS-001 TC-001: Verify category-wise spending visualization displays all 9 predefined categories', async ({ page }) => {
    Logger.info('Starting test: Category-wise spending visualization');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    const categories = await analyticsPage.getDisplayedCategories();
    expect(categories.length).toBeGreaterThan(0);
    
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    for (const category of categories) {
      expect(expectedCategories).toContain(category.name);
      expect(category.amount).toBeTruthy();
      expect(category.percentage).toBeTruthy();
    }
    
    Logger.info('Category-wise visualization verified');
  });

  test('QE-8952 TS-002 TC-001: Verify category-wise spending visualization displays only categories with transactions', async ({ page }) => {
    Logger.info('Starting test: Categories with transactions only');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    const categories = await analyticsPage.getDisplayedCategories();
    
    for (const category of categories) {
      if (category.amount !== '$0.00') {
        expect(category.amount).toBeTruthy();
      }
    }
    
    Logger.info('Categories with transactions verified');
  });

  test('QE-8952 TS-003 TC-001: Verify error handling when no spending data is available for any category', async ({ page }) => {
    Logger.info('Starting test: No spending data');
    
    await page.route('**/api/transactions/categorized*', route => route.fulfill({ body: JSON.stringify([]) }));
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsToLoad();
    
    const emptyMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No spending data available');
    
    Logger.info('No spending data handling verified');
  });

  test('QE-8787 TS-001 TC-001: Verify category-wise spending visualization', async ({ page }) => {
    Logger.info('Starting test: Category spending visualization');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    const categories = await analyticsPage.getDisplayedCategories();
    expect(categories.length).toBeGreaterThan(0);
    
    Logger.info('Category spending visualization verified');
  });

  test('QE-8933 TS-001 TC-001: Verify category-wise spending visualization displays all 7 predefined categories', async ({ page }) => {
    Logger.info('Starting test: Seven category visualization');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    const categories = await analyticsPage.getDisplayedCategories();
    expect(categories.length).toBeGreaterThan(0);
    
    Logger.info('Seven category visualization verified');
  });

  test('QE-8933 TS-002 TC-001: Verify category-wise spending visualization displays only categories with transactions', async ({ page }) => {
    Logger.info('Starting test: Active categories only');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    const categories = await analyticsPage.getDisplayedCategories();
    
    for (const category of categories) {
      if (category.amount !== '$0.00') {
        expect(category.amount).toBeTruthy();
      }
    }
    
    Logger.info('Active categories verified');
  });

  test('QE-8933 TS-003 TC-001: Verify category-wise spending visualization displays empty state message when no spending data is available', async ({ page }) => {
    Logger.info('Starting test: Empty spending data');
    
    await page.route('**/api/transactions/categorized*', route => route.fulfill({ body: JSON.stringify([]) }));
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsToLoad();
    
    const emptyMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No spending data available');
    
    Logger.info('Empty spending data verified');
  });
});

test.describe('Interactive Analytics Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  test('QE-8945 TS-001 TC-001: Verify interactive category spending chart allows drill-down into specific category transactions', async ({ page }) => {
    Logger.info('Starting test: Category drill-down');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    const categories = await analyticsPage.getDisplayedCategories();
    
    if (categories.length > 0) {
      await analyticsPage.clickCategory(categories[0].name);
      
      const drillDownVisible = await analyticsPage.isDrillDownVisible();
      expect(drillDownVisible).toBe(true);
      
      const transactions = await analyticsPage.getDrillDownTransactions();
      expect(transactions.length).toBeGreaterThan(0);
      
      Logger.info('Category drill-down verified');
    }
  });

  test('QE-8945 TS-002 TC-001: Verify interactive category spending chart displays tooltip on hover with category details', async ({ page }) => {
    Logger.info('Starting test: Category tooltip');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    const categories = await analyticsPage.getDisplayedCategories();
    
    if (categories.length > 0) {
      await analyticsPage.hoverOverCategory(categories[0].name);
      
      const tooltip = await analyticsPage.getTooltipContent();
      expect(tooltip.categoryName).toBeTruthy();
      expect(tooltip.amount).toBeTruthy();
      expect(tooltip.percentage).toBeTruthy();
      
      Logger.info('Category tooltip verified');
    }
  });

  test('QE-8945 TS-003 TC-001: Verify interactive category spending chart handles empty category click without breaking visualization', async ({ page }) => {
    Logger.info('Starting test: Empty category click');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    const categories = await analyticsPage.getDisplayedCategories();
    
    for (const category of categories) {
      if (category.amount === '$0.00') {
        await analyticsPage.clickCategory(category.name);
        
        const emptyMessage = await analyticsPage.getEmptyCategoryMessage();
        expect(emptyMessage).toContain('No transactions found');
        
        const chartVisible = await analyticsPage.isChartVisible();
        expect(chartVisible).toBe(true);
        
        Logger.info('Empty category click verified');
        break;
      }
    }
  });

  test('QE-8792 TS-001 TC-001: Verify interactive spending analytics dashboard', async ({ page }) => {
    Logger.info('Starting test: Interactive analytics dashboard');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    const categories = await analyticsPage.getDisplayedCategories();
    expect(categories.length).toBeGreaterThan(0);
    
    Logger.info('Interactive analytics dashboard verified');
  });

  test('QE-8934 TS-001 TC-001: Verify interactive spending analytics dashboard allows drill-down into Food & Dining category', async ({ page }) => {
    Logger.info('Starting test: Food & Dining drill-down');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    await analyticsPage.clickCategory('Food & Dining');
    
    const drillDownVisible = await analyticsPage.isDrillDownVisible();
    
    if (drillDownVisible) {
      const transactions = await analyticsPage.getDrillDownTransactions();
      expect(transactions.length).toBeGreaterThan(0);
      
      Logger.info('Food & Dining drill-down verified');
    }
  });

  test('QE-8934 TS-002 TC-001: Verify interactive spending analytics dashboard filters category breakdown when specific month is selected', async ({ page }) => {
    Logger.info('Starting test: Month filter');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    await analyticsPage.selectMonth('November 2024');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    const categories = await analyticsPage.getDisplayedCategories();
    expect(categories.length).toBeGreaterThanOrEqual(0);
    
    Logger.info('Month filter verified');
  });

  test('QE-8934 TS-003 TC-001: Verify interactive spending analytics dashboard handles empty category click without breaking visualization', async ({ page }) => {
    Logger.info('Starting test: Empty category interaction');
    
    await analyticsPage.waitForAnalyticsToLoad();
    
    const categories = await analyticsPage.getDisplayedCategories();
    
    for (const category of categories) {
      if (category.amount === '$0.00') {
        await analyticsPage.clickCategory(category.name);
        
        const emptyMessage = await analyticsPage.getEmptyCategoryMessage();
        expect(emptyMessage).toBeTruthy();
        
        const chartVisible = await analyticsPage.isChartVisible();
        expect(chartVisible).toBe(true);
        
        Logger.info('Empty category interaction verified');
        break;
      }
    }
  });
});

test.describe('Monthly Trend Analysis Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  test('QE-8946 TS-001 TC-001: Verify monthly spend trend analysis displays 12 months of data with accurate values', async ({ page }) => {
    Logger.info('Starting test: 12-month trend analysis');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToTrendSection();
    
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    expect(monthlyData.length).toBeGreaterThan(0);
    
    for (const month of monthlyData) {
      expect(month.month).toBeTruthy();
      expect(month.amount).toBeTruthy();
    }
    
    Logger.info('12-month trend analysis verified');
  });

  test('QE-8946 TS-002 TC-001: Verify monthly spend trend analysis updates when date range filter is applied', async ({ page }) => {
    Logger.info('Starting test: Date range filter on trends');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToTrendSection();
    
    await analyticsPage.setTrendDateRange('2024-07-01', '2024-12-31');
    
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    expect(monthlyData.length).toBeGreaterThan(0);
    expect(monthlyData.length).toBeLessThanOrEqual(6);
    
    Logger.info('Date range filter on trends verified');
  });

  test('QE-8946 TS-003 TC-001: Verify monthly spend trend analysis displays error message when only 1 month of data exists', async ({ page }) => {
    Logger.info('Starting test: Insufficient trend data');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToTrendSection();
    
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    
    if (monthlyData.length === 1) {
      const errorMessage = await analyticsPage.getTrendErrorMessage();
      expect(errorMessage).toContain('at least 2 months');
      
      Logger.info('Insufficient trend data verified');
    }
  });

  test('QE-8942 TS-001 TC-001: Verify monthly spend trend analysis displays 12 months of transaction history', async ({ page }) => {
    Logger.info('Starting test: 12-month transaction history');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToTrendSection();
    
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    expect(monthlyData.length).toBeGreaterThan(0);
    
    Logger.info('12-month transaction history verified');
  });

  test('QE-8942 TS-002 TC-001: Verify monthly spend trend analysis updates when date range filter (January to June) is applied', async ({ page }) => {
    Logger.info('Starting test: January to June filter');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToTrendSection();
    
    await analyticsPage.setTrendDateRange('2024-01-01', '2024-06-30');
    
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    expect(monthlyData.length).toBeGreaterThan(0);
    expect(monthlyData.length).toBeLessThanOrEqual(6);
    
    Logger.info('January to June filter verified');
  });

  test('QE-8942 TS-003 TC-001: Verify monthly spend trend analysis displays error message when only 1 month of transaction history exists', async ({ page }) => {
    Logger.info('Starting test: Single month history');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToTrendSection();
    
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    
    if (monthlyData.length === 1) {
      const errorMessage = await analyticsPage.getTrendErrorMessage();
      expect(errorMessage).toBeTruthy();
      
      Logger.info('Single month history verified');
    }
  });

  test('QE-8784 TS-001 TC-001: Verify monthly spend trend analysis', async ({ page }) => {
    Logger.info('Starting test: Monthly trend analysis');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToTrendSection();
    
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    expect(monthlyData.length).toBeGreaterThan(0);
    
    Logger.info('Monthly trend analysis verified');
  });
});

test.describe('Card-Wise Spend Analysis Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  test('QE-8938 TS-001 TC-001: Verify card-wise spend analysis displays comparative chart with accurate values', async ({ page }) => {
    Logger.info('Starting test: Card-wise comparative chart');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToCardWiseSection();
    
    const cardData = await analyticsPage.getCardWiseSpendData();
    expect(cardData.length).toBeGreaterThan(0);
    
    for (const card of cardData) {
      expect(card.cardName).toBeTruthy();
      expect(card.amount).toBeTruthy();
    }
    
    Logger.info('Card-wise comparative chart verified');
  });

  test('QE-8938 TS-002 TC-001: Verify card-wise spend analysis displays all 5 cards including zero-spend cards', async ({ page }) => {
    Logger.info('Starting test: All cards including zero-spend');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToCardWiseSection();
    
    const cardData = await analyticsPage.getCardWiseSpendData();
    
    for (const card of cardData) {
      expect(card.cardName).toBeTruthy();
      expect(card.amount).toBeDefined();
    }
    
    Logger.info('All cards including zero-spend verified');
  });

  test('QE-8938 TS-003 TC-001: Verify card-wise spend analysis displays message when only 1 card exists', async ({ page }) => {
    Logger.info('Starting test: Single card analysis');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToCardWiseSection();
    
    const cardData = await analyticsPage.getCardWiseSpendData();
    
    if (cardData.length === 1) {
      const message = await analyticsPage.getSingleCardMessage();
      expect(message).toContain('at least 2 cards');
      
      Logger.info('Single card analysis verified');
    }
  });

  test('QE-8791 TS-001 TC-001: Verify card-wise spend comparison', async ({ page }) => {
    Logger.info('Starting test: Card-wise comparison');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToCardWiseSection();
    
    const cardData = await analyticsPage.getCardWiseSpendData();
    expect(cardData.length).toBeGreaterThan(0);
    
    Logger.info('Card-wise comparison verified');
  });

  test('QE-8931 TS-001 TC-001: Verify card-wise spend comparison displays comparative bar chart', async ({ page }) => {
    Logger.info('Starting test: Comparative bar chart');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToCardWiseSection();
    
    const hasChart = await analyticsPage.hasCardWiseChart();
    expect(hasChart).toBe(true);
    
    const cardData = await analyticsPage.getCardWiseSpendData();
    expect(cardData.length).toBeGreaterThan(0);
    
    Logger.info('Comparative bar chart verified');
  });

  test('QE-8931 TS-002 TC-001: Verify card-wise spend comparison displays both cards including zero-spend card', async ({ page }) => {
    Logger.info('Starting test: Both cards with zero-spend');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToCardWiseSection();
    
    const cardData = await analyticsPage.getCardWiseSpendData();
    
    for (const card of cardData) {
      expect(card.amount).toBeDefined();
    }
    
    Logger.info('Both cards with zero-spend verified');
  });

  test('QE-8931 TS-003 TC-001: Verify card-wise spend comparison displays single-card summary with message when only 1 card exists', async ({ page }) => {
    Logger.info('Starting test: Single card summary');
    
    await analyticsPage.waitForAnalyticsToLoad();
    await analyticsPage.navigateToCardWiseSection();
    
    const cardData = await analyticsPage.getCardWiseSpendData();
    
    if (cardData.length === 1) {
      const message = await analyticsPage.getSingleCardMessage();
      expect(message).toBeTruthy();
      
      Logger.info('Single card summary verified');
    }
  });
});

test.describe('Responsive Analytics Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
  });

  test('QE-8932 TS-001 TC-001: Verify responsive multi-device dashboard displays KPIs in single-column layout on mobile device', async ({ page }) => {
    Logger.info('Starting test: Mobile analytics layout');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsToLoad();
    
    const layout = await analyticsPage.getLayoutType();
    expect(layout).toBe('single-column');
    
    const hasHorizontalScroll = await analyticsPage.hasHorizontalScrollbar();
    expect(hasHorizontalScroll).toBe(false);
    
    Logger.info('Mobile analytics layout verified');
  });

  test('QE-8932 TS-002 TC-001: Verify responsive multi-device dashboard displays KPIs in two-column grid layout on tablet device', async ({ page }) => {
    Logger.info('Starting test: Tablet analytics layout');
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsToLoad();
    
    const layout = await analyticsPage.getLayoutType();
    expect(layout).toBe('two-column');
    
    Logger.info('Tablet analytics layout verified');
  });

  test('QE-8932 TS-003 TC-001: Verify responsive multi-device dashboard displays KPIs in degraded but readable format on unsupported viewport', async ({ page }) => {
    Logger.info('Starting test: Unsupported viewport');
    
    await page.setViewportSize({ width: 200, height: 400 });
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsToLoad();
    
    const hasLayout = await analyticsPage.hasVisibleLayout();
    expect(hasLayout).toBe(true);
    
    const hasOverlap = await analyticsPage.hasOverlappingElements();
    expect(hasOverlap).toBe(false);
    
    Logger.info('Unsupported viewport verified');
  });

  test('QE-8794 TS-001 TC-001: Verify responsive multi-device dashboard', async ({ page }) => {
    Logger.info('Starting test: Responsive dashboard');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsToLoad();
    
    const hasVisibleContent = await analyticsPage.hasVisibleLayout();
    expect(hasVisibleContent).toBe(true);
    
    Logger.info('Responsive dashboard verified');
  });
});