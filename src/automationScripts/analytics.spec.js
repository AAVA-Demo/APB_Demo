const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Spending Analytics and Transaction Insights', () => {
  let loginPage, analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-10355 TS-001 TC-001: Verify category-wise spending pie chart renders correctly with accurate data and color coding', async ({ page }) => {
    logger.info('Test Case: QE-10355 TS-001 TC-001 - Category-wise spending chart');
    
    await loginPage.login('testuser_analytics', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    
    const startTime = Date.now();
    await expect(analyticsPage.pieChart).toBeVisible({ timeout: 2000 });
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(1500);
    logger.info('Pie chart rendered in ' + renderTime + 'ms (within 1.5 seconds)');
    
    const segmentCount = await analyticsPage.getPieChartSegmentCount();
    expect(segmentCount).toBe(3);
    logger.info('Pie chart displays 3 segments (Food & Dining, Fuel, Shopping)');
    
    await analyticsPage.verifySegmentData('Food & Dining', '1,250.50', '#FF6384');
    await analyticsPage.verifySegmentData('Fuel', '850.00', '#36A2EB');
    await analyticsPage.verifySegmentData('Shopping', '3,500.00', '#FFCE56');
    
    logger.info('All segments verified with correct amounts and colors');
    
    await analyticsPage.clickPieChartSegment('Food & Dining');
    await expect(analyticsPage.transactionList).toBeVisible();
    logger.info('Pie chart is interactive; clicking segment filters transactions');
  });

  test('QE-10355 TS-002 TC-001: Verify empty category spending chart displays appropriate message without errors', async ({ page }) => {
    logger.info('Test Case: QE-10355 TS-002 TC-001 - Empty category chart');
    
    await loginPage.login('testuser_notransactions', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const messageText = await analyticsPage.noDataMessage.textContent();
    expect(messageText).toContain('No spending data available');
    logger.info('No data message displayed: ' + messageText);
    
    const segmentCount = await analyticsPage.getPieChartSegmentCount();
    expect(segmentCount).toBe(0);
    logger.info('No pie chart segments rendered');
    
    const consoleErrors = await analyticsPage.checkConsoleErrors(page);
    expect(consoleErrors.length).toBe(0);
    logger.info('No console errors detected');
  });

  test('QE-10355 TS-003 TC-001: Verify category with $0.01 spending displays with cent-level accuracy in pie chart', async ({ page }) => {
    logger.info('Test Case: QE-10355 TS-003 TC-001 - Cent-level accuracy');
    
    await loginPage.login('testuser_centlevel', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    
    await expect(analyticsPage.pieChart).toBeVisible();
    
    const isHealthcareSegmentVisible = await analyticsPage.isSegmentVisible('Healthcare');
    expect(isHealthcareSegmentVisible).toBeTruthy();
    logger.info('Healthcare segment is visible in pie chart');
    
    const healthcareAmount = await analyticsPage.getSegmentAmount('Healthcare');
    expect(healthcareAmount).toBe('$0.01');
    logger.info('Healthcare segment displays $0.01 (not rounded to $0.00)');
    
    const segmentCount = await analyticsPage.getPieChartSegmentCount();
    expect(segmentCount).toBeGreaterThan(0);
    logger.info('Healthcare segment is included in chart visualization');
  });

  test('QE-10354 TS-001 TC-001: Verify monthly spend trends line graph displays accurate data for 6 months', async ({ page }) => {
    logger.info('Test Case: QE-10354 TS-001 TC-001 - Monthly trends for 6 months');
    
    await loginPage.login('testuser_trends', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.scrollToMonthlyTrends();
    
    await expect(analyticsPage.lineChart).toBeVisible();
    
    const dataPointCount = await analyticsPage.getLineChartDataPointCount();
    expect(dataPointCount).toBe(6);
    logger.info('Line graph displays 6 data points for last 6 months');
    
    await analyticsPage.verifyMonthDataPoint('June', '5,000');
    await analyticsPage.verifyMonthDataPoint('July', '6,200');
    await analyticsPage.verifyMonthDataPoint('August', '4,800');
    await analyticsPage.verifyMonthDataPoint('September', '7,100');
    await analyticsPage.verifyMonthDataPoint('October', '5,500');
    await analyticsPage.verifyMonthDataPoint('November', '6,800');
    
    logger.info('All 6 months verified with correct spending amounts');
    
    await analyticsPage.verifyAxisLabels('month', 'currency');
    logger.info('X-axis shows month labels, Y-axis shows currency format');
  });

  test('QE-10354 TS-002 TC-001: Verify monthly trends chart handles partial data (2 months) without rendering errors', async ({ page }) => {
    logger.info('Test Case: QE-10354 TS-002 TC-001 - Partial month data');
    
    await loginPage.login('testuser_partialdata', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.scrollToMonthlyTrends();
    
    await expect(analyticsPage.lineChart).toBeVisible();
    
    const dataPointCount = await analyticsPage.getLineChartDataPointCount();
    expect(dataPointCount).toBe(2);
    logger.info('Line graph displays 2 data points (October, November)');
    
    await analyticsPage.verifyMonthDataPoint('October', '3,200');
    await analyticsPage.verifyMonthDataPoint('November', '4,100');
    
    const zeroValueMonths = await analyticsPage.getZeroValueMonthCount();
    expect(zeroValueMonths).toBe(4);
    logger.info('Remaining 4 months display zero values or No Data labels');
    
    const consoleErrors = await analyticsPage.checkConsoleErrors(page);
    expect(consoleErrors.length).toBe(0);
    logger.info('No console errors detected');
  });

  test('QE-10354 TS-003 TC-001: Verify monthly trends chart aggregates over 1,000 transactions in a single month without data loss', async ({ page }) => {
    logger.info('Test Case: QE-10354 TS-003 TC-001 - High transaction volume');
    
    await loginPage.login('testuser_highvolume', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.scrollToMonthlyTrends();
    
    const startTime = Date.now();
    await expect(analyticsPage.lineChart).toBeVisible({ timeout: 2000 });
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(1500);
    logger.info('Chart rendered in ' + renderTime + 'ms despite 1,200 transactions');
    
    const novemberSpend = await analyticsPage.getMonthDataPointValue('November');
    expect(novemberSpend).toContain('45,600');
    logger.info('November data point shows $45,600 (sum of all 1,200 transactions)');
    
    const transactionListTotal = await analyticsPage.getTransactionListTotal('November');
    expect(transactionListTotal).toContain('45,600');
    logger.info('No data truncation; all 1,200 transactions included in total');
  });
});
