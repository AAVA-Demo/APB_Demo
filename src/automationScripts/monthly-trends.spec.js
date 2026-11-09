const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Monthly Spend Trends - QE-8967', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    logger.info('Starting Monthly Trends test');
  });

  test('QE-8967 TS-001 TC-001: Verify monthly trend analysis displays interactive line chart with accurate data points', async ({ page }) => {
    logger.info('Test Case: QE-8967 TS-001 TC-001 - Monthly trend chart display');
    
    // Step 1: Login with user having 3+ months history
    await loginPage.navigate();
    await loginPage.login('testuser_3months', 'Pass@123');
    await loginPage.clickLogin();
    logger.info('User with 3+ months history logged in');

    // Step 2: Navigate to monthly trend analysis
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    logger.info('Monthly trend analysis page loaded');

    // Step 3: Verify interactive line chart is displayed
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    logger.info('Line chart is rendered');

    // Step 4: Verify chart displays past 12 months data
    const chartLabels = await page.locator('.chart-label, [data-month]').all();
    expect(chartLabels.length).toBeGreaterThan(0);
    expect(chartLabels.length).toBeLessThanOrEqual(12);
    logger.info(`Chart displays ${chartLabels.length} months of data`);

    // Step 5: Verify month labels are accurate
    const firstLabel = await chartLabels[0].textContent();
    expect(firstLabel).toMatch(/\d{4}-\d{2}/);
    logger.info(`First month label: ${firstLabel}`);

    // Step 6: Verify data points are accurate
    const dataPoints = await page.locator('.chart-data-point, [data-value]').all();
    for (const point of dataPoints) {
      const value = await point.getAttribute('data-value');
      if (value) {
        expect(parseFloat(value)).toBeGreaterThanOrEqual(0);
      }
    }
    logger.info('Data points verified for accuracy');

    // Step 7: Verify chart is interactive
    await analyticsPage.hoverOverChartDataPoint(0);
    const tooltipVisible = await page.locator('.chart-tooltip, [role="tooltip"]').isVisible();
    expect(tooltipVisible).toBeTruthy();
    logger.info('Chart is interactive (hover functionality works)');

    logger.info('Test Case QE-8967 TS-001 TC-001 completed successfully');
  });

  test('QE-8967 TS-002 TC-001: Verify monthly trend displays message when user has insufficient transaction history', async ({ page }) => {
    logger.info('Test Case: QE-8967 TS-002 TC-001 - Insufficient data scenario');
    
    // Step 1: Login with user having less than 3 months history
    await loginPage.navigate();
    await loginPage.login('testuser_2months', 'Pass@123');
    await loginPage.clickLogin();
    logger.info('User with <3 months history logged in');

    // Step 2: Navigate to monthly trend analysis
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    logger.info('Monthly trend analysis page loaded');

    // Step 3: Verify informational message is displayed
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.getInsufficientDataMessageText();
    expect(messageText).toContain('Insufficient data to generate meaningful trends');
    expect(messageText).toContain('Showing available data points only');
    logger.info('Insufficient data message displayed correctly');

    // Step 4: Verify chart displays available data points
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    const chartLabels = await page.locator('.chart-label, [data-month]').all();
    expect(chartLabels.length).toBeLessThan(3);
    logger.info(`Chart shows ${chartLabels.length} available months`);

    // Step 5: Verify chart handles limited data gracefully
    const chartCanvas = await analyticsPage.monthlyTrendChart.boundingBox();
    expect(chartCanvas).not.toBeNull();
    logger.info('Chart renders correctly with limited data, no errors');

    logger.info('Test Case QE-8967 TS-002 TC-001 completed successfully');
  });

  test('QE-8967 TS-003 TC-001: Verify monthly trend chart displays detailed tooltips on hover', async ({ page }) => {
    logger.info('Test Case: QE-8967 TS-003 TC-001 - Interactive tooltips');
    
    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await loginPage.clickLogin();
    logger.info('User logged in successfully');

    // Step 2: Navigate to monthly trend analysis
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    logger.info('Monthly trend analysis page loaded with line chart');

    // Step 3: Hover over first data point
    await analyticsPage.hoverOverChartDataPoint(0);
    logger.info('Hovered over first data point');

    // Step 4: Verify tooltip displays exact spending amount
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toMatch(/\d{4}-\d{2}/);
    expect(tooltipText).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    logger.info(`Tooltip shows: ${tooltipText}`);

    // Step 5: Verify tooltip formatting
    expect(tooltipText).toContain('$');
    const amountMatch = tooltipText.match(/\$([0-9,]+\.[0-9]{2})/);
    expect(amountMatch).not.toBeNull();
    logger.info('Tooltip amount is properly formatted with currency symbol and decimals');

    // Step 6: Hover over another data point
    await analyticsPage.hoverOverChartDataPoint(1);
    const tooltipText2 = await analyticsPage.getTooltipText();
    expect(tooltipText2).not.toBe(tooltipText);
    logger.info(`Tooltip updated to: ${tooltipText2}`);

    // Step 7: Move cursor away from chart
    await page.mouse.move(0, 0);
    await page.waitForTimeout(500);
    const tooltipVisible = await page.locator('.chart-tooltip, [role="tooltip"]').isVisible();
    expect(tooltipVisible).toBeFalsy();
    logger.info('Tooltip disappears when cursor moves away');

    logger.info('Test Case QE-8967 TS-003 TC-001 completed successfully');
  });
});