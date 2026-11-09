const { test, expect } = require('@playwright/test');
const { SpendingInsightsPage } = require('./pages/spendingInsights.page');
const logger = require('../utils/logger');

test.describe('Monthly Spend Trend Analysis', () => {
  let spendingInsightsPage;

  test.beforeEach(async ({ page }) => {
    spendingInsightsPage = new SpendingInsightsPage(page);
    logger.info('Starting spending insights test case');
  });

  test('QE-8496 TS-001 TC-001: Verify monthly spend trend chart for 6 consecutive months', async ({ page }) => {
    logger.info('Test Case: QE-8496 TS-001 TC-001');
    
    await spendingInsightsPage.navigateWithUser('test_user_six_months_history');
    await spendingInsightsPage.waitForSpendingInsightsLoad();
    
    const monthCount = await spendingInsightsPage.getMonthCount();
    expect(monthCount).toBe(6);
    
    await spendingInsightsPage.verifyMonthlySpend('2026-06', '5000');
    await spendingInsightsPage.verifyMonthlySpend('2026-07', '6200');
    await spendingInsightsPage.verifyMonthlySpend('2026-08', '4800');
    await spendingInsightsPage.verifyMonthlySpend('2026-09', '7100');
    await spendingInsightsPage.verifyMonthlySpend('2026-10', '5500');
    await spendingInsightsPage.verifyMonthlySpend('2026-11', '6300');
    
    const trendVisible = await spendingInsightsPage.isTrendLineVisible();
    expect(trendVisible).toBeTruthy();
    
    const isInteractive = await spendingInsightsPage.verifyChartInteractivity();
    expect(isInteractive).toBeTruthy();
    
    logger.info('Test Case QE-8496 TS-001 TC-001 completed successfully');
  });

  test('QE-8496 TS-001 TC-002: Verify month labels in chronological order', async ({ page }) => {
    logger.info('Test Case: QE-8496 TS-001 TC-002');
    
    await spendingInsightsPage.navigateWithUser('test_user_six_months_history');
    await spendingInsightsPage.waitForSpendingInsightsLoad();
    
    const monthLabels = await spendingInsightsPage.getMonthLabels();
    expect(monthLabels).toEqual(['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11']);
    
    const formatConsistent = await spendingInsightsPage.verifyMonthLabelFormat();
    expect(formatConsistent).toBeTruthy();
    
    logger.info('Test Case QE-8496 TS-001 TC-002 completed successfully');
  });

  test('QE-8496 TS-002 TC-001: Verify complete year-over-year trend chart displays 12 months', async ({ page }) => {
    logger.info('Test Case: QE-8496 TS-002 TC-001');
    
    await spendingInsightsPage.navigateWithUser('test_user_twelve_months_history');
    await spendingInsightsPage.waitForSpendingInsightsLoad();
    
    const monthCount = await spendingInsightsPage.getMonthCount();
    expect(monthCount).toBe(12);
    
    const monthLabels = await spendingInsightsPage.getMonthLabels();
    expect(monthLabels[0]).toBe('2025-12');
    expect(monthLabels[11]).toBe('2026-11');
    
    await spendingInsightsPage.verifyMonthlySpend('2026-01', '4500');
    await spendingInsightsPage.verifyMonthlySpend('2026-06', '5000');
    await spendingInsightsPage.verifyMonthlySpend('2026-11', '6300');
    
    const trendVisible = await spendingInsightsPage.isTrendLineVisible();
    expect(trendVisible).toBeTruthy();
    
    logger.info('Test Case QE-8496 TS-002 TC-001 completed successfully');
  });

  test('QE-8496 TS-002 TC-002: Verify year-over-year chart handles month transitions correctly', async ({ page }) => {
    logger.info('Test Case: QE-8496 TS-002 TC-002');
    
    await spendingInsightsPage.navigateWithUser('test_user_twelve_months_history');
    await spendingInsightsPage.waitForSpendingInsightsLoad();
    
    const monthLabels = await spendingInsightsPage.getMonthLabels();
    const decIndex = monthLabels.indexOf('2025-12');
    const janIndex = monthLabels.indexOf('2026-01');
    
    expect(janIndex).toBe(decIndex + 1);
    
    const hasYearIndicators = await spendingInsightsPage.verifyYearIndicatorsPresent();
    expect(hasYearIndicators).toBeTruthy();
    
    logger.info('Test Case QE-8496 TS-002 TC-002 completed successfully');
  });

  test('QE-8496 TS-003 TC-001: Verify appropriate handling when only current month data exists', async ({ page }) => {
    logger.info('Test Case: QE-8496 TS-003 TC-001');
    
    await spendingInsightsPage.navigateWithUser('test_user_current_month_only');
    await spendingInsightsPage.waitForSpendingInsightsLoad();
    
    const monthCount = await spendingInsightsPage.getMonthCount();
    const hasMessage = await spendingInsightsPage.hasInsufficientDataMessage();
    
    expect(monthCount === 1 || hasMessage).toBeTruthy();
    
    const hasSystemErrors = await spendingInsightsPage.checkForSystemErrors();
    expect(hasSystemErrors).toBeFalsy();
    
    const currentMonthSpend = await spendingInsightsPage.getCurrentMonthSpend();
    expect(currentMonthSpend).toBe('6300');
    
    logger.info('Test Case QE-8496 TS-003 TC-001 completed successfully');
  });

  test('QE-8496 TS-003 TC-002: Verify trend chart handles single data point gracefully', async ({ page }) => {
    logger.info('Test Case: QE-8496 TS-003 TC-002');
    
    await spendingInsightsPage.navigateWithUser('test_user_current_month_only');
    await spendingInsightsPage.waitForSpendingInsightsLoad();
    
    const chartRendered = await spendingInsightsPage.isChartRenderedCorrectly();
    expect(chartRendered).toBeTruthy();
    
    const monthLabels = await spendingInsightsPage.getMonthLabels();
    if (monthLabels.length === 1) {
      expect(monthLabels[0]).toBe('2026-11');
    }
    
    const yAxisScaled = await spendingInsightsPage.verifyYAxisScaling();
    expect(yAxisScaled).toBeTruthy();
    
    logger.info('Test Case QE-8496 TS-003 TC-002 completed successfully');
  });
});
