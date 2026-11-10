const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Spending Analytics and Category Insights', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    logger.info('Navigated to Analytics page');
  });

  // QE-9788 TS-001 TC-001: Verify category-wise spending visualization
  test('TC-017: Display all 9 predefined categories with accurate percentage breakdown', async ({ page }) => {
    logger.info('Test Case QE-9788 TS-001 TC-001: Starting category visualization validation');
    
    await analyticsPage.login('testuser_allcategories', 'Test@123');
    
    // Step 4: Verify pie chart displays all 9 categories
    const categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBe(9);
    
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    for (const expected of expectedCategories) {
      expect(categories).toContain(expected);
    }
    logger.info('All 9 predefined categories are displayed');
    
    // Step 5: Verify percentage breakdown
    const categoryData = await analyticsPage.getCategoryBreakdown();
    let totalPercentage = 0;
    
    for (const cat of categoryData) {
      const percentage = parseFloat(cat.percentage.replace('%', ''));
      totalPercentage += percentage;
      logger.info(`${cat.name}: ${cat.amount} (${cat.percentage})`);
    }
    
    expect(totalPercentage).toBeCloseTo(100, 1);
    logger.info(`Total percentage: ${totalPercentage}%`);
    
    // Step 6: Click on category segment
    await analyticsPage.clickCategorySegment('Food & Dining');
    await expect(analyticsPage.categoryDetailPanel).toBeVisible();
    logger.info('Category detail panel displayed');
  });

  // QE-9788 TS-001 TC-002: Verify chart renders within 2 seconds
  test('TC-018: Interactive pie chart renders within 2 seconds (NFR)', async ({ page }) => {
    logger.info('Test Case QE-9788 TS-001 TC-002: Starting chart render time validation');
    
    await analyticsPage.login('testuser_allcategories', 'Test@123');
    
    // Step 3-4: Measure render time
    const startTime = Date.now();
    await analyticsPage.waitForChartToRender();
    const renderTime = Date.now() - startTime;
    
    expect(renderTime).toBeLessThanOrEqual(2000);
    logger.info(`Chart rendered in ${renderTime}ms (NFR: ≤2000ms)`);
    
    // Step 5: Verify chart is interactive
    const categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBe(9);
    logger.info('Chart is interactive with all 9 categories clickable');
  });

  // QE-9788 TS-002 TC-001: Verify uncategorized transactions handling
  test('TC-019: Uncategorized transactions automatically assigned to Miscellaneous', async ({ page }) => {
    logger.info('Test Case QE-9788 TS-002 TC-001: Starting uncategorized transaction handling');
    
    await analyticsPage.login('testuser_uncategorized', 'Test@123');
    
    // Step 3: Verify Miscellaneous category contains uncategorized transactions
    await analyticsPage.clickCategorySegment('Miscellaneous');
    await expect(analyticsPage.categoryDetailPanel).toBeVisible();
    
    const transactions = await analyticsPage.getCategoryTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    logger.info(`Miscellaneous category has ${transactions.length} transactions`);
    
    // Step 5: Verify categorization accuracy ≥ 95%
    const categoryData = await analyticsPage.getCategoryBreakdown();
    const miscCategory = categoryData.find(cat => cat.name === 'Miscellaneous');
    const miscPercentage = parseFloat(miscCategory.percentage.replace('%', ''));
    
    expect(miscPercentage).toBeLessThanOrEqual(5);
    logger.info(`Miscellaneous percentage: ${miscPercentage}% (≤5% for 95% accuracy)`);
  });

  // QE-9788 TS-002 TC-002: Verify null category handling
  test('TC-020: System handles transactions with null category by defaulting to Miscellaneous', async ({ page }) => {
    logger.info('Test Case QE-9788 TS-002 TC-002: Starting null category handling validation');
    
    await analyticsPage.login('testuser_nullcategory', 'Test@123');
    
    // Step 3: Verify null category transactions in Miscellaneous
    await analyticsPage.clickCategorySegment('Miscellaneous');
    const transactions = await analyticsPage.getCategoryTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    logger.info('Transactions with null category are in Miscellaneous');
    
    // Step 4: Verify no console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    expect(consoleErrors.length).toBe(0);
    logger.info('No console errors detected');
  });

  // QE-9788 TS-003 TC-001: Verify mobile responsive touch interactions
  test('TC-021: Category visualization responsive and supports touch interactions on mobile', async ({ page }) => {
    logger.info('Test Case QE-9788 TS-003 TC-001: Starting mobile touch interaction validation');
    
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    logger.info('Set viewport to iPhone 13 size');
    
    await analyticsPage.login('testuser_mobile', 'Test@123');
    
    // Step 3: Verify responsive layout
    await expect(analyticsPage.chartContainer).toBeVisible();
    const chartBox = await analyticsPage.chartContainer.boundingBox();
    expect(chartBox.width).toBeLessThanOrEqual(375);
    logger.info('Chart is responsive to mobile screen size');
    
    // Step 4: Tap on category segment
    await analyticsPage.chartContainer.tap();
    await expect(analyticsPage.categoryDetailPanel).toBeVisible();
    logger.info('Touch tap interaction works');
    
    // Step 5: Swipe gesture
    await analyticsPage.performSwipeGesture();
    logger.info('Swipe gesture performed');
    
    // Step 6: Verify smooth interactions
    const interactionDelay = await analyticsPage.measureInteractionDelay();
    expect(interactionDelay).toBeLessThan(300);
    logger.info(`Interaction delay: ${interactionDelay}ms (< 300ms)`);
  });

  // QE-9780 TS-001 TC-001: Verify historical spending trends
  test('TC-022: Display accurate monthly data for 12 months with drill-down capability', async ({ page }) => {
    logger.info('Test Case QE-9780 TS-001 TC-001: Starting historical trends validation');
    
    await analyticsPage.login('testuser_12months', 'Test@123');
    
    // Step 3: Verify chart displays 12 months
    const monthsDisplayed = await analyticsPage.getHistoricalMonthsCount();
    expect(monthsDisplayed).toBe(12);
    logger.info(`Historical chart displays ${monthsDisplayed} months`);
    
    // Step 4: Click on specific month to drill down
    await analyticsPage.clickMonthDataPoint('March 2024');
    await expect(analyticsPage.transactionDetailView).toBeVisible();
    
    const transactions = await analyticsPage.getMonthTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    logger.info(`March 2024 has ${transactions.length} transactions`);
    
    // Step 5: Verify total matches chart
    const chartAmount = await analyticsPage.getChartDataPointValue('March 2024');
    const drillDownTotal = await analyticsPage.getDrillDownTotal();
    expect(chartAmount).toBe(drillDownTotal);
    logger.info(`Chart amount matches drill-down total: ${chartAmount}`);
  });

  // QE-9780 TS-001 TC-002: Verify historical chart render time
  test('TC-023: Historical trends chart renders within 2 seconds (NFR)', async ({ page }) => {
    logger.info('Test Case QE-9780 TS-001 TC-002: Starting historical chart render time validation');
    
    await analyticsPage.login('testuser_12months', 'Test@123');
    
    const startTime = Date.now();
    await analyticsPage.waitForHistoricalChartToRender();
    const renderTime = Date.now() - startTime;
    
    expect(renderTime).toBeLessThanOrEqual(2000);
    logger.info(`Historical chart rendered in ${renderTime}ms (NFR: ≤2000ms)`);
    
    // Verify all data points are interactive
    const monthsDisplayed = await analyticsPage.getHistoricalMonthsCount();
    expect(monthsDisplayed).toBe(12);
    logger.info('All 12 data points are interactive');
  });

  // QE-9780 TS-002 TC-001: Verify future date validation
  test('TC-024: System returns validation error for future date range', async ({ page }) => {
    logger.info('Test Case QE-9780 TS-002 TC-001: Starting future date validation');
    
    await analyticsPage.login('testuser_12months', 'Test@123');
    
    // Step 3: Select future date range
    await analyticsPage.selectDateRange('01/01/2026', '12/31/2026');
    
    // Step 4: Apply filter
    await analyticsPage.clickApplyFilter();
    
    // Step 5: Verify validation error
    await expect(analyticsPage.dateValidationError).toBeVisible();
    const errorText = await analyticsPage.dateValidationError.textContent();
    expect(errorText).toContain('Invalid date range');
    expect(errorText).toContain('past');
    logger.info('Validation error displayed: ' + errorText);
    
    // Step 6: Verify no data displayed
    const chartEmpty = await analyticsPage.isChartEmpty();
    expect(chartEmpty).toBe(true);
    logger.info('Chart remains empty for invalid date range');
  });

  // QE-9780 TS-002 TC-002: Verify empty state for dates before account creation
  test('TC-025: Display empty state message for date range before account creation', async ({ page }) => {
    logger.info('Test Case QE-9780 TS-002 TC-002: Starting empty state validation');
    
    await analyticsPage.login('testuser_newaccount', 'Test@123');
    
    // Step 3: Select date range before account creation
    await analyticsPage.selectDateRange('01/01/2023', '12/31/2023');
    await analyticsPage.clickApplyFilter();
    
    // Step 5: Verify empty state message
    await expect(analyticsPage.emptyStateMessage).toBeVisible();
    const messageText = await analyticsPage.emptyStateMessage.textContent();
    expect(messageText).toContain('No transactions found');
    logger.info('Empty state message displayed: ' + messageText);
    
    // Step 6: Verify chart is empty
    const chartEmpty = await analyticsPage.isChartEmpty();
    expect(chartEmpty).toBe(true);
    logger.info('Chart shows no data points');
  });

  // QE-9780 TS-003 TC-001: Verify custom date range filtering
  test('TC-026: Custom date range filtering retrieves only transactions within period', async ({ page }) => {
    logger.info('Test Case QE-9780 TS-003 TC-001: Starting custom date range validation');
    
    await analyticsPage.login('testuser_customrange', 'Test@123');
    
    // Step 3: Select custom date range (Q1 2024)
    await analyticsPage.selectDateRange('01/01/2024', '03/31/2024');
    await analyticsPage.clickApplyFilter();
    
    // Step 5: Verify chart displays only 3 months
    const monthsDisplayed = await analyticsPage.getHistoricalMonthsCount();
    expect(monthsDisplayed).toBe(3);
    logger.info('Chart displays 3 months (Q1 2024)');
    
    // Step 6: Verify total spend matches sum of Q1 months
    const totalSpend = await analyticsPage.getTotalSpendDisplayed();
    expect(totalSpend).toBe('$4,000.00');
    logger.info(`Total spend for Q1 2024: ${totalSpend}`);
  });
});
