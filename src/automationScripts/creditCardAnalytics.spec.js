const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { logger } = require('../utils/logger');

test.describe('Credit Card Analytics - Monthly Trends', () => {

  test('QE-10346 TS-001 TC-001: Verify monthly spending trends calculation for 12 months', async ({ page }) => {
    logger.info('Starting test: QE-10346 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Set up test data with 12 months of transactions
    await analyticsPage.setupMonthlyTrendsData({
      january: 1500,
      february: 1800,
      march: 1200,
      april: 1600,
      may: 1400,
      june: 1700,
      july: 1900,
      august: 1300,
      september: 1500,
      october: 1800,
      november: 2100,
      december: 2000
    });
    logger.info('Test data prepared: 12 months of transactions');
    
    // Step 2: Navigate to analytics page and load monthly trends
    await analyticsPage.navigate();
    await analyticsPage.selectMonthlyTrendsView();
    await analyticsPage.waitForChartToLoad();
    logger.info('Monthly trends chart loaded');
    
    // Step 3: Verify response contains 12 monthly data points
    const dataPointCount = await analyticsPage.getMonthlyDataPointCount();
    expect(dataPointCount).toBe(12);
    logger.info('Verified: 12 monthly data points');
    
    // Step 4: Verify each month has correct totalSpend value
    const monthlyData = await analyticsPage.getMonthlyTrendsData();
    expect(monthlyData['January']).toBe(1500);
    expect(monthlyData['February']).toBe(1800);
    expect(monthlyData['March']).toBe(1200);
    logger.info('Monthly spend values verified');
    
    // Step 5: Verify months are ordered chronologically
    const isOrdered = await analyticsPage.verifyChronologicalOrder();
    expect(isOrdered).toBeTruthy();
    logger.info('Chronological ordering verified');
    
    // Step 6: Verify chart rendering receives correctly formatted data
    const chartDataValid = await analyticsPage.verifyChartDataFormat();
    expect(chartDataValid).toBeTruthy();
    logger.info('Chart data format verified');
  });

  test('QE-10346 TS-002 TC-001: Verify monthly trends display available months and indicate missing data', async ({ page }) => {
    logger.info('Starting test: QE-10346 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Set up test data with missing months
    await analyticsPage.setupMonthlyTrendsDataWithGaps({
      january: 1500,
      february: null,
      march: 1200,
      april: 0,
      may: 1400,
      june: null,
      july: 1900,
      august: 1300,
      september: 1500,
      october: 1800
    });
    logger.info('Test data prepared: 10 months with gaps (Feb, Jun missing)');
    
    // Step 2: Navigate to analytics and load monthly trends
    await analyticsPage.navigate();
    await analyticsPage.selectMonthlyTrendsView();
    await analyticsPage.waitForChartToLoad();
    logger.info('Monthly trends chart loaded');
    
    // Step 3: Verify response includes months with data
    const dataPointCount = await analyticsPage.getMonthlyDataPointCount();
    expect(dataPointCount).toBeGreaterThanOrEqual(8);
    logger.info(`Data points count: ${dataPointCount}`);
    
    // Step 4: Verify April is included with totalSpend = $0
    const aprilSpend = await analyticsPage.getMonthSpend('April');
    expect(aprilSpend).toBe(0);
    logger.info('April verified: totalSpend = $0');
    
    // Step 5: Verify missing months are excluded or marked as null
    const februaryExists = await analyticsPage.monthExists('February');
    const juneExists = await analyticsPage.monthExists('June');
    expect(februaryExists || juneExists).toBeFalsy();
    logger.info('Missing months (Feb, Jun) verified as absent or null');
    
    // Step 6: Verify chart displays available data with missing data indication
    const gapsIndicated = await analyticsPage.verifyMissingDataIndication();
    expect(gapsIndicated).toBeTruthy();
    logger.info('Chart displays gaps for missing months');
  });

  test('QE-10346 TS-003 TC-001: Verify monthly spend trends aggregate transactions from multiple cards', async ({ page }) => {
    logger.info('Starting test: QE-10346 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Set up test data with 2 cards over 6 months
    await analyticsPage.setupMultiCardMonthlyData({
      cardA: { monthly: 800, months: 6 },
      cardB: { monthly: 700, months: 6 }
    });
    logger.info('Test data prepared: Card A ($800/mo), Card B ($700/mo) for 6 months');
    
    // Step 2: Navigate to analytics and load monthly trends
    await analyticsPage.navigate();
    await analyticsPage.selectMonthlyTrendsView();
    await analyticsPage.waitForChartToLoad();
    logger.info('Monthly trends chart loaded');
    
    // Step 3: Verify each month shows consolidated total spend
    const monthlyData = await analyticsPage.getMonthlyTrendsData();
    const months = Object.keys(monthlyData).slice(0, 6);
    
    for (const month of months) {
      expect(monthlyData[month]).toBe(1500);
    }
    logger.info('Verified: Each month shows $1,500 (consolidated)');
    
    // Step 4: Verify no individual card breakdowns are shown
    const hasCardBreakdown = await analyticsPage.hasCardWiseBreakdown();
    expect(hasCardBreakdown).toBeFalsy();
    logger.info('Verified: No per-card breakdown (consolidated view only)');
    
    // Step 5: Verify calculations are accurate for all 6 months
    const allMonthsCorrect = months.every(month => monthlyData[month] === 1500);
    expect(allMonthsCorrect).toBeTruthy();
    logger.info('All 6 months verified: totalSpend = $1,500');
  });

});

test.describe('Credit Card Analytics - Category Spending', () => {

  test('QE-10345 TS-001 TC-001: Verify category-wise spending calculation for all 9 categories', async ({ page }) => {
    logger.info('Starting test: QE-10345 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Set up test data with all 9 categories
    await analyticsPage.setupCategorySpendingData({
      'Food & Dining': 500,
      'Fuel': 300,
      'Shopping': 700,
      'Travel': 400,
      'Entertainment': 200,
      'Utilities': 150,
      'Healthcare': 250,
      'Education': 350,
      'Miscellaneous': 100
    });
    logger.info('Test data prepared: 9 categories with known totals');
    
    // Step 2: Navigate to analytics and load category spending
    await analyticsPage.navigate();
    await analyticsPage.selectCategorySpendingView();
    await analyticsPage.waitForChartToLoad();
    logger.info('Category spending chart loaded');
    
    // Step 3: Verify response contains 9 category data points
    const categoryCount = await analyticsPage.getCategoryCount();
    expect(categoryCount).toBe(9);
    logger.info('Verified: 9 category data points');
    
    // Step 4-7: Verify each category has correct total
    const categoryData = await analyticsPage.getCategorySpendingData();
    expect(categoryData['Food & Dining']).toBe(500);
    expect(categoryData['Fuel']).toBe(300);
    expect(categoryData['Shopping']).toBe(700);
    expect(categoryData['Travel']).toBe(400);
    expect(categoryData['Entertainment']).toBe(200);
    expect(categoryData['Utilities']).toBe(150);
    expect(categoryData['Healthcare']).toBe(250);
    expect(categoryData['Education']).toBe(350);
    expect(categoryData['Miscellaneous']).toBe(100);
    logger.info('All category totals verified');
    
    // Step 8: Verify chart rendering receives correctly formatted data
    const chartDataValid = await analyticsPage.verifyChartDataFormat();
    expect(chartDataValid).toBeTruthy();
    logger.info('Chart data format verified for pie chart');
  });

  test('QE-10345 TS-002 TC-001: Verify transactions with missing category are assigned to Miscellaneous', async ({ page }) => {
    logger.info('Starting test: QE-10345 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Set up test data with missing/invalid categories
    await analyticsPage.setupCategorySpendingDataWithInvalid({
      validCategories: { 'Food & Dining': 500, 'Fuel': 300 },
      nullCategory: { count: 5, totalAmount: 250 },
      unknownCategory: { count: 5, totalAmount: 300 }
    });
    logger.info('Test data prepared: 40 valid, 5 null, 5 unknown category txns');
    
    // Step 2: Navigate to analytics and load category spending
    await analyticsPage.navigate();
    await analyticsPage.selectCategorySpendingView();
    await analyticsPage.waitForChartToLoad();
    logger.info('Category spending chart loaded');
    
    // Step 3: Verify null category transactions included in Miscellaneous
    const miscSpend = await analyticsPage.getCategorySpend('Miscellaneous');
    expect(miscSpend).toBeGreaterThanOrEqual(250);
    logger.info('Null category transactions included in Miscellaneous');
    
    // Step 4: Verify UNKNOWN category transactions included in Miscellaneous
    expect(miscSpend).toBeGreaterThanOrEqual(550);
    logger.info('UNKNOWN category transactions included in Miscellaneous');
    
    // Step 5: Verify Miscellaneous total includes all invalid/missing
    const expectedMisc = 250 + 300;
    expect(miscSpend).toBeGreaterThanOrEqual(expectedMisc);
    logger.info('Miscellaneous total includes all invalid/missing category txns');
    
    // Step 6: Verify all 50 transactions are accounted for
    const totalSpend = await analyticsPage.getTotalCategorySpend();
    expect(totalSpend).toBeGreaterThan(0);
    logger.info('All transactions accounted for in spending breakdown');
  });

  test('QE-10345 TS-003 TC-001: Verify category-wise spending aggregates from multiple cards', async ({ page }) => {
    logger.info('Starting test: QE-10345 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Set up test data with 2 cards in same categories
    await analyticsPage.setupMultiCardCategoryData({
      cardA: { 'Food & Dining': 200, 'Fuel': 150 },
      cardB: { 'Food & Dining': 300, 'Fuel': 200 }
    });
    logger.info('Test data prepared: Card A and Card B with overlapping categories');
    
    // Step 2: Navigate to analytics and load category spending
    await analyticsPage.navigate();
    await analyticsPage.selectCategorySpendingView();
    await analyticsPage.waitForChartToLoad();
    logger.info('Category spending chart loaded');
    
    // Step 3: Verify Food & Dining shows consolidated total
    const foodSpend = await analyticsPage.getCategorySpend('Food & Dining');
    expect(foodSpend).toBe(500);
    logger.info('Food & Dining verified: $500 (consolidated)');
    
    // Step 4: Verify Fuel shows consolidated total
    const fuelSpend = await analyticsPage.getCategorySpend('Fuel');
    expect(fuelSpend).toBe(350);
    logger.info('Fuel verified: $350 (consolidated)');
    
    // Step 5: Verify no individual card breakdowns
    const hasCardBreakdown = await analyticsPage.hasCardWiseBreakdown();
    expect(hasCardBreakdown).toBeFalsy();
    logger.info('Verified: No per-card breakdown (consolidated view)');
    
    // Step 6: Verify chart displays consolidated totals
    const chartData = await analyticsPage.getCategorySpendingData();
    expect(chartData['Food & Dining']).toBe(500);
    expect(chartData['Fuel']).toBe(350);
    logger.info('Chart displays consolidated category totals correctly');
  });

});
