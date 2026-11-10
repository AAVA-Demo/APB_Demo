const { test, expect } = require('@playwright/test');
const { TrendAnalysisPage } = require('./pages/trendAnalysis.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Monthly Spend Trend Analysis - QE-9420', () => {
  let trendAnalysisPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Trend Analysis test');
    trendAnalysisPage = new TrendAnalysisPage(page);
    loginPage = new LoginPage(page);
  });

  test('QE-9420 TS-001 TC-001: Verify 12-month trend graph with drill-down capability', async ({ page }) => {
    logger.info('Starting test: QE-9420 TS-001 TC-001');
    
    // Step 1: Login with user having 12 months history
    await trendAnalysisPage.navigate();
    await loginPage.login('testuser_12months', 'Pass@123');
    await trendAnalysisPage.waitForAuthenticationComplete();
    logger.info('User authenticated');
    
    // Step 2: Navigate to Trend Analysis
    await trendAnalysisPage.navigateToTrendAnalysis();
    await trendAnalysisPage.waitForPageLoad(3000);
    logger.info('Trend analysis page loaded');
    
    // Step 3: Verify line graph with 12 data points
    await trendAnalysisPage.waitForChartRender();
    const dataPointCount = await trendAnalysisPage.getDataPointCount();
    expect(dataPointCount).toBe(12);
    const months = await trendAnalysisPage.getMonthLabels();
    expect(months).toContain('Jan');
    expect(months).toContain('Feb');
    expect(months).toContain('Mar');
    expect(months).toContain('Apr');
    expect(months).toContain('May');
    expect(months).toContain('Jun');
    expect(months).toContain('Jul');
    expect(months).toContain('Aug');
    expect(months).toContain('Sep');
    expect(months).toContain('Oct');
    expect(months).toContain('Nov');
    expect(months).toContain('Dec');
    logger.info('12-month graph verified');
    
    // Step 4: Verify monthly spend totals
    const spendData = await trendAnalysisPage.getMonthlySpendData();
    expect(spendData['Jan']).toBe(4000);
    expect(spendData['Feb']).toBe(5000);
    expect(spendData['Mar']).toBe(4500);
    expect(spendData['Apr']).toBe(6000);
    expect(spendData['May']).toBe(5500);
    expect(spendData['Jun']).toBe(7000);
    expect(spendData['Jul']).toBe(6500);
    expect(spendData['Aug']).toBe(5000);
    expect(spendData['Sep']).toBe(4800);
    expect(spendData['Oct']).toBe(6200);
    expect(spendData['Nov']).toBe(5800);
    expect(spendData['Dec']).toBe(7500);
    const totalAnnualSpend = Object.values(spendData).reduce((a, b) => a + b, 0);
    expect(totalAnnualSpend).toBe(67800);
    logger.info('Monthly spend totals verified');
    
    // Step 5: Drill down into March
    await trendAnalysisPage.clickDataPoint('Mar');
    await trendAnalysisPage.waitForTransactionListLoad();
    const transactionCount = await trendAnalysisPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(20);
    logger.info('March drill-down verified');
    
    // Step 6: Verify March total matches
    const marchTransactionTotal = await trendAnalysisPage.getTransactionListTotal();
    expect(marchTransactionTotal).toBe(4500);
    logger.info('March transaction total verified');
  });

  test('QE-9420 TS-002 TC-001: Verify insufficient data message for user with 2 months history', async ({ page }) => {
    logger.info('Starting test: QE-9420 TS-002 TC-001');
    
    // Step 1: Login with user having only 2 months
    await trendAnalysisPage.navigate();
    await loginPage.login('newuser_2months', 'Pass@123');
    await trendAnalysisPage.waitForAuthenticationComplete();
    logger.info('User authenticated');
    
    // Step 2: Navigate to Trend Analysis
    await trendAnalysisPage.navigateToTrendAnalysis();
    await trendAnalysisPage.waitForPageLoad(3000);
    logger.info('Trend analysis page loaded');
    
    // Step 3: Verify informational message
    const message = await trendAnalysisPage.getInformationalMessage();
    expect(message).toContain('Insufficient data for trend analysis');
    expect(message).toContain('At least 3 months');
    expect(message).toContain('You currently have 2 months');
    logger.info('Informational message verified');
    
    // Step 4: Verify no graph rendered
    const isGraphVisible = await trendAnalysisPage.isGraphVisible();
    expect(isGraphVisible).toBe(false);
    logger.info('No graph displayed');
    
    // Step 5: Verify page remains functional
    const isNavigationActive = await trendAnalysisPage.isNavigationActive();
    expect(isNavigationActive).toBe(true);
    logger.info('Navigation verified as active');
  });

  test('QE-9420 TS-003 TC-001: Verify filtering to 6-month period with accurate recalculation', async ({ page }) => {
    logger.info('Starting test: QE-9420 TS-003 TC-001');
    
    // Step 1: Login with user having 12+ months
    await trendAnalysisPage.navigate();
    await loginPage.login('testuser_12months', 'Pass@123');
    await trendAnalysisPage.waitForAuthenticationComplete();
    logger.info('User authenticated');
    
    // Step 2: Navigate to Trend Analysis
    await trendAnalysisPage.navigateToTrendAnalysis();
    await trendAnalysisPage.waitForPageLoad(3000);
    const defaultPeriod = await trendAnalysisPage.getSelectedPeriod();
    expect(defaultPeriod).toBe('12 months');
    logger.info('Default 12-month view loaded');
    
    // Step 3: Apply 6-month filter
    await trendAnalysisPage.selectPeriodFilter('6 months');
    await trendAnalysisPage.waitForChartUpdate(3000);
    logger.info('6-month filter applied');
    
    // Step 4: Verify 6 data points
    const dataPointCount = await trendAnalysisPage.getDataPointCount();
    expect(dataPointCount).toBe(6);
    const months = await trendAnalysisPage.getMonthLabels();
    expect(months).toContain('Jul');
    expect(months).toContain('Aug');
    expect(months).toContain('Sep');
    expect(months).toContain('Oct');
    expect(months).toContain('Nov');
    expect(months).toContain('Dec');
    logger.info('6-month graph verified');
    
    // Step 5: Verify recalculated spend totals
    const spendData = await trendAnalysisPage.getMonthlySpendData();
    expect(spendData['Jul']).toBe(6500);
    expect(spendData['Aug']).toBe(5000);
    expect(spendData['Sep']).toBe(4800);
    expect(spendData['Oct']).toBe(6200);
    expect(spendData['Nov']).toBe(5800);
    expect(spendData['Dec']).toBe(7500);
    const sixMonthTotal = Object.values(spendData).reduce((a, b) => a + b, 0);
    expect(sixMonthTotal).toBe(35800);
    logger.info('6-month totals verified');
    
    // Step 6: Drill down into October
    await trendAnalysisPage.clickDataPoint('Oct');
    await trendAnalysisPage.waitForTransactionListLoad();
    const transactionCount = await trendAnalysisPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(18);
    logger.info('October drill-down verified');
    
    // Step 7: Verify drill-down remains operational
    const isDrillDownActive = await trendAnalysisPage.isDrillDownActive();
    expect(isDrillDownActive).toBe(true);
    logger.info('Drill-down functionality verified');
  });
});
