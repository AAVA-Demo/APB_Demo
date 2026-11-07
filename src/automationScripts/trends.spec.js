const { test, expect } = require('@playwright/test');
const { TrendsPage } = require('./pages/trends.page');

/**
 * Test Suite: Monthly Spend Trends and Card-wise Analysis
 * Test Cases: QE-7544 TS-001 TC-001, QE-7544 TS-002 TC-001, QE-7544 TS-003 TC-001,
 *             QE-7545 TS-001 TC-001, QE-7545 TS-002 TC-001, QE-7545 TS-003 TC-001
 */

test.describe('Monthly Spend Trends and Card-wise Analysis', () => {

  test('QE-7544 TS-001 TC-001 - Verify monthly spend trend visualization with six months history', async ({ page }) => {
    const trendsPage = new TrendsPage(page);
    
    // Step 1: Launch application
    await trendsPage.navigate();
    
    // Step 2: Login with user having six months history
    await trendsPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Navigate to Trends page
    await trendsPage.navigateToTrends();
    
    // Step 4: Verify line chart with six months data
    await trendsPage.waitForChartLoad();
    const months = await trendsPage.getChartMonths();
    expect(months).toEqual(['Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024', 'Mar 2024']);
    
    // Step 5: Verify month-over-month amounts
    const amounts = await trendsPage.getMonthlyAmounts();
    expect(amounts).toEqual([1500, 1800, 2200, 1900, 2100, 1700]);
    
    // Step 6: Hover over data point and verify tooltip
    await trendsPage.hoverDataPoint(3);
    const tooltipText = await trendsPage.getTooltipText();
    expect(tooltipText).toContain('Jan 2024');
    expect(tooltipText).toContain('Visa Gold');
    expect(tooltipText).toContain('$1,900');
    
    // Step 7: Verify chart interactivity
    await trendsPage.verifyChartInteractive();
  });

  test('QE-7544 TS-002 TC-001 - Verify insufficient data message for users with less than one month history', async ({ page }) => {
    const trendsPage = new TrendsPage(page);
    
    // Step 1: Launch application
    await trendsPage.navigate();
    
    // Step 2: Login with new user
    await trendsPage.login('newuser@example.com', 'Test@123');
    
    // Step 3: Navigate to Trends page
    await trendsPage.navigateToTrends();
    
    // Step 4: Verify chart shows minimal/no data
    await trendsPage.waitForPageLoad();
    const hasData = await trendsPage.hasChartData();
    expect(hasData).toBe(false);
    
    // Step 5: Verify informational message
    await expect(trendsPage.insufficientDataMessage).toBeVisible();
    await expect(trendsPage.insufficientDataMessage).toContainText('Insufficient data for meaningful trend analysis');
  });

  test('QE-7544 TS-003 TC-001 - Verify error handling when analytics service times out', async ({ page }) => {
    const trendsPage = new TrendsPage(page);
    
    // Step 1: Launch application
    await trendsPage.navigate();
    
    // Step 2: Navigate to Trends page
    await trendsPage.navigateToTrends();
    
    // Step 3: Simulate service timeout
    await page.route('**/api/analytics/trends*', route => {
      return new Promise(resolve => setTimeout(() => route.abort('timedout'), 35000));
    });
    
    // Step 4: Verify error message
    await expect(trendsPage.errorMessage).toBeVisible({ timeout: 40000 });
    await expect(trendsPage.errorMessage).toContainText('Failed to load trend data');
    
    // Step 5: Verify Retry button
    await expect(trendsPage.retryButton).toBeVisible();
    
    // Step 6: Verify filters are preserved
    const startDate = await trendsPage.getStartDateValue();
    const endDate = await trendsPage.getEndDateValue();
    const selectedCard = await trendsPage.getSelectedCard();
    expect(startDate).toBe('2023-10-01');
    expect(endDate).toBe('2024-03-31');
    expect(selectedCard).toBe('All Cards');
    
    // Step 7: Click Retry
    await page.unroute('**/api/analytics/trends*');
    await trendsPage.clickRetry();
  });

  test('QE-7545 TS-001 TC-001 - Verify filtering by specific credit card', async ({ page }) => {
    const trendsPage = new TrendsPage(page);
    
    // Step 1: Launch application
    await trendsPage.navigate();
    
    // Step 2: Navigate to Trends page
    await trendsPage.navigateToTrends();
    
    // Step 3: Verify filter dropdown is populated
    await expect(trendsPage.cardFilterDropdown).toBeVisible();
    const options = await trendsPage.getCardFilterOptions();
    expect(options).toContain('Visa Gold');
    expect(options).toContain('Mastercard Platinum');
    expect(options).toContain('Amex Blue');
    
    // Step 4: Select Visa Gold
    await trendsPage.selectCard('Visa Gold');
    
    // Step 5: Verify chart shows only Visa Gold data
    await trendsPage.waitForChartUpdate();
    const datasets = await trendsPage.getChartDatasets();
    expect(datasets.length).toBe(1);
    expect(datasets[0].name).toBe('Visa Gold');
    const amounts = await trendsPage.getMonthlyAmounts();
    expect(amounts).toEqual([350, 250, 180]);
    
    // Step 6: Verify legend shows only Visa Gold
    const legendItems = await trendsPage.getLegendItems();
    expect(legendItems).toEqual(['Visa Gold']);
  });

  test('QE-7545 TS-002 TC-001 - Verify empty state for card with no transaction history', async ({ page }) => {
    const trendsPage = new TrendsPage(page);
    
    // Step 1: Launch application
    await trendsPage.navigate();
    
    // Step 2: Navigate to Trends page
    await trendsPage.navigateToTrends();
    
    // Step 3: Select card with no transactions
    await trendsPage.selectCard('New Card');
    
    // Step 4: Verify empty chart
    const hasData = await trendsPage.hasChartData();
    expect(hasData).toBe(false);
    
    // Step 5: Verify informational message
    await expect(trendsPage.emptyStateMessage).toBeVisible();
    await expect(trendsPage.emptyStateMessage).toContainText('No spending data is available for the selected card');
  });

  test('QE-7545 TS-003 TC-001 - Verify reset filter to All Cards shows combined trends', async ({ page }) => {
    const trendsPage = new TrendsPage(page);
    
    // Step 1: Launch application
    await trendsPage.navigate();
    
    // Step 2: Navigate to Trends page
    await trendsPage.navigateToTrends();
    
    // Step 3: Select specific card
    await trendsPage.selectCard('Visa Gold');
    await trendsPage.waitForChartUpdate();
    
    // Step 4: Reset to All Cards
    await trendsPage.selectCard('All Cards');
    
    // Step 5: Verify combined trends for all cards
    await trendsPage.waitForChartUpdate();
    const datasets = await trendsPage.getChartDatasets();
    expect(datasets.length).toBe(3);
    expect(datasets.map(d => d.name)).toEqual(['Visa Gold', 'Mastercard Platinum', 'Amex Blue']);
    
    // Step 6: Verify monthly aggregated amounts
    const janAmounts = await trendsPage.getMonthAmounts('Jan 2024');
    expect(janAmounts).toEqual({ 'Visa Gold': 350, 'Mastercard Platinum': 300, 'Amex Blue': 0 });
    
    // Step 7: Verify color-coded legend
    const legendItems = await trendsPage.getLegendItems();
    expect(legendItems).toEqual(['Visa Gold', 'Mastercard Platinum', 'Amex Blue']);
    await trendsPage.verifyLegendColors();
  });

});