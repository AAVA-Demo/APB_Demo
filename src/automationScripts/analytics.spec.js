const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Credit Card Analytics - Spending Visualization and Trends', () => {

  test('QE-9492 TS-001 TC-001 - Verify category-wise spending chart displays accurate spending distribution across all 9 predefined categories within 3 seconds', async ({ page }) => {
    logger.info('Starting test: QE-9492 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await test.step('Launch application and login', async () => {
      await analyticsPage.navigate();
      await analyticsPage.login('testuser_multicategory', 'Pass@123');
    });

    await test.step('Navigate to Spending Analytics page', async () => {
      await analyticsPage.navigateToAnalytics();
    });

    await test.step('Verify chart renders within 3 seconds', async () => {
      const startTime = Date.now();
      await expect(analyticsPage.categoryChart).toBeVisible();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);
      logger.info(`Chart rendered in ${loadTime}ms`);
    });

    await test.step('Verify all 9 predefined categories are displayed', async () => {
      const categories = await analyticsPage.getChartCategories();
      expect(categories).toContain('Food & Dining');
      expect(categories).toContain('Fuel');
      expect(categories).toContain('Shopping');
      expect(categories).toContain('Travel');
      expect(categories).toContain('Entertainment');
      expect(categories).toContain('Utilities');
      expect(categories).toContain('Healthcare');
      expect(categories).toContain('Education');
      expect(categories).toContain('Miscellaneous');
    });

    await test.step('Verify spending amounts are accurate for active categories', async () => {
      const categoryData = await analyticsPage.getCategorySpendingData();
      expect(categoryData['Food & Dining']).toBe('$500');
      expect(categoryData['Fuel']).toBe('$200');
      expect(categoryData['Shopping']).toBe('$800');
      expect(categoryData['Travel']).toBe('$300');
      expect(categoryData['Entertainment']).toBe('$0.00');
    });
  });

  test('QE-9492 TS-001 TC-002 - Verify category-wise spending chart is interactive and allows drill-down into specific categories', async ({ page }) => {
    logger.info('Starting test: QE-9492 TS-001 TC-002');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_multicategory', 'Pass@123');
    await analyticsPage.navigateToAnalytics();

    await test.step('Click on Food & Dining category', async () => {
      await analyticsPage.clickCategory('Food & Dining');
    });

    await test.step('Verify category is highlighted or tooltip is displayed', async () => {
      await expect(analyticsPage.categoryTooltip).toBeVisible();
    });

    await test.step('Verify drill-down shows transaction details', async () => {
      await expect(analyticsPage.drillDownModal).toBeVisible();
      const transactions = await analyticsPage.getDrillDownTransactions();
      expect(transactions.length).toBeGreaterThan(0);
      transactions.forEach(txn => {
        expect(txn.category).toBe('Food & Dining');
      });
    });

    await test.step('Close drill-down and verify chart returns to original state', async () => {
      await analyticsPage.closeDrillDown();
      await expect(analyticsPage.drillDownModal).not.toBeVisible();
      await expect(analyticsPage.categoryChart).toBeVisible();
    });
  });

  test('QE-9492 TS-002 TC-001 - Verify appropriate message is displayed when user with no transaction history accesses spending analytics page', async ({ page }) => {
    logger.info('Starting test: QE-9492 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_notransactions', 'Pass@123');
    await analyticsPage.navigateToAnalytics();

    await test.step('Verify insufficient data message is displayed', async () => {
      await expect(analyticsPage.insufficientDataMessage).toBeVisible();
      const messageText = await analyticsPage.insufficientDataMessage.textContent();
      expect(messageText).toContain('Insufficient data');
    });

    await test.step('Verify chart displays empty or zero values', async () => {
      const categoryData = await analyticsPage.getCategorySpendingData();
      Object.values(categoryData).forEach(value => {
        expect(value).toBe('$0.00');
      });
    });
  });

  test('QE-9492 TS-003 TC-001 - Verify category-wise spending chart accurately displays spending for only the 2 categories with transaction data while showing zero for remaining 7 categories', async ({ page }) => {
    logger.info('Starting test: QE-9492 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_2categories', 'Pass@123');
    await analyticsPage.navigateToAnalytics();

    await test.step('Verify Food & Dining shows $650', async () => {
      const foodDining = await analyticsPage.getCategorySpending('Food & Dining');
      expect(foodDining).toBe('$650.00');
    });

    await test.step('Verify Fuel shows $180', async () => {
      const fuel = await analyticsPage.getCategorySpending('Fuel');
      expect(fuel).toBe('$180.00');
    });

    await test.step('Verify remaining 7 categories show zero', async () => {
      const zeroCategories = ['Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      for (const category of zeroCategories) {
        const amount = await analyticsPage.getCategorySpending(category);
        expect(amount).toBe('$0.00');
      }
    });

    await test.step('Verify chart legend distinguishes between categories with and without data', async () => {
      const activeCategoryStyle = await analyticsPage.getCategoryStyle('Food & Dining');
      const inactiveCategoryStyle = await analyticsPage.getCategoryStyle('Shopping');
      expect(activeCategoryStyle).not.toBe(inactiveCategoryStyle);
    });
  });

  test('QE-9492 TS-003 TC-002 - Verify percentage distribution in category-wise spending chart is accurate when only 2 out of 9 categories have transaction data', async ({ page }) => {
    logger.info('Starting test: QE-9492 TS-003 TC-002');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_2categories', 'Pass@123');
    await analyticsPage.navigateToAnalytics();

    await test.step('Verify total spending is $830', async () => {
      const totalSpending = await analyticsPage.getTotalSpending();
      expect(totalSpending).toBe('$830.00');
    });

    await test.step('Verify Food & Dining shows 78.3% distribution', async () => {
      const percentage = await analyticsPage.getCategoryPercentage('Food & Dining');
      expect(parseFloat(percentage)).toBeCloseTo(78.3, 1);
    });

    await test.step('Verify Fuel shows 21.7% distribution', async () => {
      const percentage = await analyticsPage.getCategoryPercentage('Fuel');
      expect(parseFloat(percentage)).toBeCloseTo(21.7, 1);
    });

    await test.step('Verify remaining categories show 0% distribution', async () => {
      const zeroCategories = ['Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      for (const category of zeroCategories) {
        const percentage = await analyticsPage.getCategoryPercentage(category);
        expect(percentage).toBe('0%');
      }
    });
  });

  test('QE-9490 TS-001 TC-001 - Verify 12-month trend analysis displays month-by-month spending trends with card-wise comparison for 2 credit cards', async ({ page }) => {
    logger.info('Starting test: QE-9490 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_12months_2cards', 'Pass@123');
    await analyticsPage.navigateToAnalytics();

    await test.step('Select Monthly Trend Analysis view', async () => {
      await analyticsPage.selectAnalyticsView('Monthly Trend Analysis');
      await expect(analyticsPage.trendChart).toBeVisible();
    });

    await test.step('Verify graph displays 12 months on X-axis', async () => {
      const months = await analyticsPage.getXAxisMonths();
      expect(months.length).toBe(12);
      expect(months).toContain('Jan');
      expect(months).toContain('Dec');
    });

    await test.step('Verify separate trend lines for Card A and Card B', async () => {
      const trendLines = await analyticsPage.getTrendLines();
      expect(trendLines.length).toBe(2);
      expect(trendLines[0].card).toBe('****1234');
      expect(trendLines[1].card).toBe('****5678');
    });

    await test.step('Verify Y-axis displays spending amounts', async () => {
      const yAxisLabel = await analyticsPage.getYAxisLabel();
      expect(yAxisLabel).toContain('Spending Amount');
    });
  });

  test('QE-9490 TS-001 TC-002 - Verify drill-down functionality allows viewing detailed transaction data for a specific month', async ({ page }) => {
    logger.info('Starting test: QE-9490 TS-001 TC-002');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_12months_2cards', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectAnalyticsView('Monthly Trend Analysis');

    await test.step('Click on June data point', async () => {
      await analyticsPage.clickMonthDataPoint('June');
    });

    await test.step('Verify month is highlighted', async () => {
      const highlightedMonth = await analyticsPage.getHighlightedMonth();
      expect(highlightedMonth).toBe('June');
    });

    await test.step('Verify drill-down modal displays June transactions', async () => {
      await expect(analyticsPage.drillDownModal).toBeVisible();
      const transactions = await analyticsPage.getDrillDownTransactions();
      transactions.forEach(txn => {
        const txnDate = new Date(txn.date);
        expect(txnDate.getMonth()).toBe(5);
      });
    });

    await test.step('Verify total spending matches graph data point', async () => {
      const drillDownTotal = await analyticsPage.getDrillDownTotal();
      expect(drillDownTotal).toBe('$2,500');
    });

    await test.step('Close drill-down and verify graph returns to original state', async () => {
      await analyticsPage.closeDrillDown();
      await expect(analyticsPage.drillDownModal).not.toBeVisible();
      await expect(analyticsPage.trendChart).toBeVisible();
    });
  });

  test('QE-9490 TS-002 TC-001 - Verify appropriate message is displayed when user with less than 1 month of transaction history attempts to view 12-month trend analysis', async ({ page }) => {
    logger.info('Starting test: QE-9490 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_newaccount', 'Pass@123');
    await analyticsPage.navigateToAnalytics();

    await test.step('Select Monthly Trend Analysis view', async () => {
      await analyticsPage.selectAnalyticsView('Monthly Trend Analysis');
    });

    await test.step('Verify insufficient data message is displayed', async () => {
      await expect(analyticsPage.insufficientDataMessage).toBeVisible();
      const messageText = await analyticsPage.insufficientDataMessage.textContent();
      expect(messageText).toContain('Insufficient historical data');
    });

    await test.step('Verify graph shows only available months with note', async () => {
      const availableMonths = await analyticsPage.getAvailableMonths();
      expect(availableMonths.length).toBeLessThan(12);
      await expect(analyticsPage.dataAvailabilityNote).toBeVisible();
    });
  });

  test('QE-9490 TS-003 TC-001 - Verify monthly trend analysis displays complete 12-month trend for Card A and 6-month trend for Card B with accurate card-wise comparison', async ({ page }) => {
    logger.info('Starting test: QE-9490 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_asymmetric_history', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectAnalyticsView('Monthly Trend Analysis');

    await test.step('Verify Card A trend line shows 12 months of data', async () => {
      const cardATrend = await analyticsPage.getCardTrendData('****1234');
      expect(cardATrend.length).toBe(12);
    });

    await test.step('Verify Card B trend line shows only last 6 months', async () => {
      const cardBTrend = await analyticsPage.getCardTrendData('****5678');
      expect(cardBTrend.length).toBe(6);
      expect(cardBTrend[0].month).toBe('Month 7');
    });

    await test.step('Verify card-wise comparison for overlapping period (Months 7-12)', async () => {
      const overlappingMonths = await analyticsPage.getOverlappingMonthsData();
      expect(overlappingMonths.length).toBe(6);
      overlappingMonths.forEach(month => {
        expect(month.cardA).toBeTruthy();
        expect(month.cardB).toBeTruthy();
      });
    });

    await test.step('Verify legend indicates data availability for each card', async () => {
      const cardALegend = await analyticsPage.getCardLegend('****1234');
      expect(cardALegend).toContain('12 months');
      const cardBLegend = await analyticsPage.getCardLegend('****5678');
      expect(cardBLegend).toContain('6 months');
    });
  });

  test('QE-9490 TS-003 TC-002 - Verify drill-down into overlapping months shows transactions from both cards while non-overlapping months show only Card A transactions', async ({ page }) => {
    logger.info('Starting test: QE-9490 TS-003 TC-002');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_asymmetric_history', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectAnalyticsView('Monthly Trend Analysis');

    await test.step('Click on non-overlapping month (Month 3)', async () => {
      await analyticsPage.clickMonthDataPoint('Month 3');
    });

    await test.step('Verify only Card A transactions are shown', async () => {
      const transactions = await analyticsPage.getDrillDownTransactions();
      transactions.forEach(txn => {
        expect(txn.cardNumber).toBe('****1234');
      });
    });

    await test.step('Close drill-down and click on overlapping month (Month 10)', async () => {
      await analyticsPage.closeDrillDown();
      await analyticsPage.clickMonthDataPoint('Month 10');
    });

    await test.step('Verify transactions from both cards are shown', async () => {
      const transactions = await analyticsPage.getDrillDownTransactions();
      const cardNumbers = [...new Set(transactions.map(t => t.cardNumber))];
      expect(cardNumbers).toContain('****1234');
      expect(cardNumbers).toContain('****5678');
    });

    await test.step('Verify total spending matches sum of both cards', async () => {
      const drillDownTotal = await analyticsPage.getDrillDownTotal();
      expect(drillDownTotal).toBe('$2,300');
    });
  });

});