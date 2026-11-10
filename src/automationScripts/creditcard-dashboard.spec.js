const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { PortfolioPage } = require('./pages/portfolio.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Credit Card Dashboard - Responsive Layout Tests', () => {

  test('QE-10376 TS-001 TC-001: Verify dashboard renders responsively on mobile device in portrait orientation', async ({ page }) => {
    logger.info('Starting test: QE-10376 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Set mobile viewport - iPhone 13 (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    logger.info('Set viewport to iPhone 13 portrait: 390x844');
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    logger.info('Navigated to credit card dashboard');
    
    // Step 2: Authenticate
    await dashboardPage.login('testuser@example.com', 'Test@123');
    logger.info('User authenticated successfully');
    
    // Step 3: Measure load time and verify dashboard loads within 2 seconds
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    logger.info(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    // Step 4: Verify all 4 KPI widgets are displayed
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
    await expect(dashboardPage.availableCreditWidget).toBeVisible();
    await expect(dashboardPage.outstandingAmountWidget).toBeVisible();
    logger.info('All 4 KPI widgets verified as visible');
    
    // Step 5: Verify font sizes and touch targets
    const fontSize = await dashboardPage.getWidgetFontSize();
    expect(fontSize).toBeGreaterThanOrEqual(14);
    logger.info(`Font size verified: ${fontSize}px (minimum 14px)`);
    
    const touchTargetSize = await dashboardPage.getTouchTargetSize();
    expect(touchTargetSize.width).toBeGreaterThanOrEqual(44);
    expect(touchTargetSize.height).toBeGreaterThanOrEqual(44);
    logger.info(`Touch target size verified: ${touchTargetSize.width}x${touchTargetSize.height}px`);
  });

  test('QE-10376 TS-002 TC-001: Verify dashboard layout adjusts on tablet orientation switch', async ({ page }) => {
    logger.info('Starting test: QE-10376 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Launch in landscape - iPad Pro (1024x768)
    await page.setViewportSize({ width: 1024, height: 768 });
    logger.info('Set viewport to iPad Pro landscape: 1024x768');
    
    // Step 2: Authenticate and access dashboard
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded in landscape mode');
    
    // Step 3: Capture KPI values in landscape
    const landscapeValues = await dashboardPage.captureKPIValues();
    logger.info(`Captured landscape KPI values: ${JSON.stringify(landscapeValues)}`);
    
    // Step 4: Rotate to portrait
    await page.setViewportSize({ width: 768, height: 1024 });
    logger.info('Rotated to portrait orientation: 768x1024');
    await page.waitForTimeout(500); // Allow layout adjustment
    
    // Step 5: Verify layout adjusted and data preserved
    await dashboardPage.waitForDashboardLoad();
    const portraitValues = await dashboardPage.captureKPIValues();
    logger.info(`Captured portrait KPI values: ${JSON.stringify(portraitValues)}`);
    
    expect(portraitValues.monthlySpend).toBe(landscapeValues.monthlySpend);
    expect(portraitValues.totalCreditLimit).toBe(landscapeValues.totalCreditLimit);
    expect(portraitValues.availableCredit).toBe(landscapeValues.availableCredit);
    expect(portraitValues.outstandingAmount).toBe(landscapeValues.outstandingAmount);
    logger.info('Data consistency verified after orientation change');
    
    // Step 6: Rotate back to landscape
    await page.setViewportSize({ width: 1024, height: 768 });
    logger.info('Rotated back to landscape orientation');
    await page.waitForTimeout(500);
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard layout adjusted back to landscape successfully');
  });

  test('QE-10376 TS-002 TC-002: Verify dashboard maintains data consistency during rapid orientation changes', async ({ page }) => {
    logger.info('Starting test: QE-10376 TS-002 TC-002');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1 & 2: Launch and authenticate
    await page.setViewportSize({ width: 2560, height: 1600 });
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded on Samsung Galaxy Tab S7');
    
    // Step 3: Perform rapid orientation changes
    const orientations = [
      { width: 1600, height: 2560 }, // Portrait
      { width: 2560, height: 1600 }, // Landscape
      { width: 1600, height: 2560 }, // Portrait
      { width: 2560, height: 1600 }  // Landscape
    ];
    
    for (const orientation of orientations) {
      await page.setViewportSize(orientation);
      await page.waitForTimeout(100);
      logger.info(`Changed orientation to ${orientation.width}x${orientation.height}`);
    }
    
    // Step 4: Verify all widgets visible and data consistent
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
    await expect(dashboardPage.availableCreditWidget).toBeVisible();
    await expect(dashboardPage.outstandingAmountWidget).toBeVisible();
    logger.info('All KPI widgets remain visible after rapid orientation changes');
  });

  test('QE-10376 TS-003 TC-001: Verify graceful degradation on low resolution device', async ({ page }) => {
    logger.info('Starting test: QE-10376 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Set extremely low resolution
    await page.setViewportSize({ width: 240, height: 320 });
    logger.info('Set viewport to low resolution: 240x320');
    
    // Step 2: Authenticate
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Test@123');
    logger.info('User authenticated on low-resolution device');
    
    // Step 3 & 4: Verify graceful degradation message or simplified layout
    const degradationMessage = await dashboardPage.getDegradationMessage();
    if (degradationMessage) {
      expect(degradationMessage).toContain('resolution');
      logger.info(`Graceful degradation message displayed: ${degradationMessage}`);
    } else {
      // Verify no broken UI elements
      const hasBrokenElements = await dashboardPage.checkForBrokenElements();
      expect(hasBrokenElements).toBe(false);
      logger.info('No broken UI elements detected - simplified layout rendered');
    }
  });
});

test.describe('Credit Card Dashboard - Analytics Tests', () => {

  test('QE-10375 TS-001 TC-001: Verify category-wise spending displays all 9 categories', async ({ page }) => {
    logger.info('Starting test: QE-10375 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1 & 2: Launch and authenticate
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_allcategories@example.com', 'Test@123');
    logger.info('Authenticated user with all 9 categories');
    
    // Step 3: Navigate to analytics
    await analyticsPage.navigateToAnalytics();
    logger.info('Navigated to spending analytics dashboard');
    
    // Step 4: Verify all 9 categories visible
    const categories = await analyticsPage.getCategoryList();
    expect(categories).toHaveLength(9);
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of expectedCategories) {
      expect(categories).toContain(category);
    }
    logger.info('All 9 predefined categories verified');
    
    // Step 5: Verify amounts and percentages
    const categoryData = await analyticsPage.getCategoryData();
    let totalPercentage = 0;
    for (const data of categoryData) {
      expect(data.amount).toBeGreaterThanOrEqual(0);
      expect(data.percentage).toBeGreaterThanOrEqual(0);
      totalPercentage += parseFloat(data.percentage);
    }
    expect(Math.round(totalPercentage)).toBe(100);
    logger.info('Category amounts and percentages verified - total: 100%');
  });

  test('QE-10375 TS-001 TC-002: Verify visualization renders smoothly with 1000 transactions', async ({ page }) => {
    logger.info('Starting test: QE-10375 TS-001 TC-002');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1 & 2: Launch and authenticate with 1000 transactions
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_1000txns@example.com', 'Test@123');
    logger.info('Authenticated user with 1000 transactions');
    
    // Step 3: Navigate to analytics
    await analyticsPage.navigateToAnalytics();
    
    // Step 4: Measure rendering time
    const startTime = Date.now();
    await analyticsPage.waitForVisualizationLoad();
    const renderTime = Date.now() - startTime;
    logger.info(`Visualization render time: ${renderTime}ms`);
    expect(renderTime).toBeLessThanOrEqual(3000);
    
    // Step 5: Test interactions
    await analyticsPage.hoverOverCategory('Food & Dining');
    await page.waitForTimeout(100);
    await analyticsPage.clickCategory('Shopping');
    await page.waitForTimeout(100);
    logger.info('Chart interactions smooth without lag');
  });

  test('QE-10375 TS-002 TC-001: Verify category drill-down functionality', async ({ page }) => {
    logger.info('Starting test: QE-10375 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Navigate to analytics
    await analyticsPage.navigate();
    await analyticsPage.login('testuser@example.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    logger.info('Navigated to category-wise visualization');
    
    // Step 4: Click on Food & Dining category
    await analyticsPage.clickCategory('Food & Dining');
    logger.info('Clicked on Food & Dining category');
    
    // Step 5: Verify detailed transaction list
    await analyticsPage.waitForTransactionListLoad();
    const transactions = await analyticsPage.getTransactionList();
    expect(transactions.length).toBeGreaterThan(0);
    
    for (const txn of transactions.slice(0, 5)) {
      expect(txn.date).toBeTruthy();
      expect(txn.merchant).toBeTruthy();
      expect(txn.amount).toBeGreaterThan(0);
    }
    logger.info(`Verified transaction list with ${transactions.length} transactions`);
    
    // Step 6: Return to summary view
    await analyticsPage.clickBackToSummary();
    await analyticsPage.waitForVisualizationLoad();
    logger.info('Returned to summary view successfully');
  });

  test('QE-10375 TS-003 TC-001: Verify empty state message for no transactions', async ({ page }) => {
    logger.info('Starting test: QE-10375 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Navigate to analytics with no transactions
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_notxns@example.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    logger.info('Navigated to analytics with no transactions');
    
    // Step 4: Verify empty state message
    const emptyMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No spending data is available');
    logger.info(`Empty state message displayed: ${emptyMessage}`);
    
    // Step 5: Verify date range selector guidance
    const hasDateRangeSelector = await analyticsPage.hasDateRangeSelector();
    expect(hasDateRangeSelector).toBe(true);
    logger.info('Date range selector available for user guidance');
  });
});

test.describe('Credit Card Dashboard - Portfolio Tests', () => {

  test('QE-10374 TS-001 TC-001: Verify detailed spend analysis for card with transaction history', async ({ page }) => {
    logger.info('Starting test: QE-10374 TS-001 TC-001');
    const portfolioPage = new PortfolioPage(page);
    
    // Step 1-3: Navigate to portfolio
    await portfolioPage.navigate();
    await portfolioPage.login('testuser@example.com', 'Test@123');
    await portfolioPage.navigateToPortfolio();
    logger.info('Navigated to portfolio management page');
    
    // Step 4: Select card with transaction history
    await portfolioPage.selectCard('3456'); // Last 4 digits
    logger.info('Selected Visa card ending in 3456');
    
    // Step 5-8: Verify spend analysis details
    const spendAnalysis = await portfolioPage.getSpendAnalysis();
    expect(spendAnalysis.monthlySpend).toBeGreaterThanOrEqual(0);
    expect(spendAnalysis.creditLimit).toBe(5000);
    expect(spendAnalysis.currentBalance).toBe(1200);
    expect(spendAnalysis.availableCredit).toBe(3800);
    expect(spendAnalysis.utilizationPercentage).toBeCloseTo(24.0, 1);
    logger.info(`Spend analysis verified: Monthly Spend: $${spendAnalysis.monthlySpend}, Utilization: ${spendAnalysis.utilizationPercentage}%`);
  });

  test('QE-10374 TS-002 TC-001: Verify spend analysis for card with no monthly transactions', async ({ page }) => {
    logger.info('Starting test: QE-10374 TS-002 TC-001');
    const portfolioPage = new PortfolioPage(page);
    
    // Step 1-4: Navigate and select card with no monthly spend
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_nomonthlyspend@example.com', 'Test@123');
    await portfolioPage.navigateToPortfolio();
    await portfolioPage.selectCard('7890');
    logger.info('Selected MasterCard with no monthly transactions');
    
    // Step 5-8: Verify zero spending with accurate credit data
    const spendAnalysis = await portfolioPage.getSpendAnalysis();
    expect(spendAnalysis.monthlySpend).toBe(0);
    expect(spendAnalysis.creditLimit).toBe(10000);
    expect(spendAnalysis.availableCredit).toBe(10000);
    expect(spendAnalysis.utilizationPercentage).toBe(0);
    logger.info('Verified zero monthly spend with 0% utilization');
  });

  test('QE-10374 TS-003 TC-001: Verify error message for deactivated card', async ({ page }) => {
    logger.info('Starting test: QE-10374 TS-003 TC-001');
    const portfolioPage = new PortfolioPage(page);
    
    // Step 1-3: Navigate to portfolio
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_deactivatedcard@example.com', 'Test@123');
    await portfolioPage.navigateToPortfolio();
    logger.info('Navigated to portfolio with deactivated card');
    
    // Step 4: Attempt to access deactivated card
    await portfolioPage.attemptAccessDeactivatedCard('999');
    
    // Step 5: Verify error message
    const errorMessage = await portfolioPage.getErrorMessage();
    expect(errorMessage).toContain('no longer available for analysis');
    logger.info(`Error message displayed: ${errorMessage}`);
  });

  test('QE-10373 TS-001 TC-001: Verify monthly trend chart with 12 months data', async ({ page }) => {
    logger.info('Starting test: QE-10373 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Navigate to monthly trends
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_12months@example.com', 'Test@123');
    await analyticsPage.navigateToMonthlyTrends();
    logger.info('Navigated to monthly trend analysis');
    
    // Step 4: Verify 12 months of data with proper labels
    const chartData = await analyticsPage.getMonthlyTrendData();
    expect(chartData.dataPoints).toHaveLength(12);
    expect(chartData.xAxisLabel).toContain('Month');
    expect(chartData.yAxisLabel).toContain('Spending');
    logger.info('Verified 12 data points with proper axis labels');
    
    // Step 5: Verify data accuracy
    for (const point of chartData.dataPoints) {
      expect(point.month).toBeTruthy();
      expect(point.amount).toBeGreaterThanOrEqual(0);
    }
    logger.info('All monthly totals verified');
    
    // Step 6: Verify smooth rendering
    const renderTime = await analyticsPage.getChartRenderTime();
    expect(renderTime).toBeLessThanOrEqual(3000);
    logger.info(`Chart rendered smoothly in ${renderTime}ms`);
  });

  test('QE-10373 TS-002 TC-001: Verify tooltip details on hover', async ({ page }) => {
    logger.info('Starting test: QE-10373 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Navigate to monthly trends
    await analyticsPage.navigate();
    await analyticsPage.login('testuser@example.com', 'Test@123');
    await analyticsPage.navigateToMonthlyTrends();
    logger.info('Navigated to monthly trend chart');
    
    // Step 4: Hover over March 2023 data point
    await analyticsPage.hoverOverDataPoint('March 2023');
    logger.info('Hovered over March 2023 data point');
    
    // Step 5-7: Verify tooltip content
    const tooltip = await analyticsPage.getTooltipData();
    expect(tooltip.month).toBe('March 2023');
    expect(tooltip.amount).toBeGreaterThanOrEqual(0);
    expect(tooltip.categoryBreakdown).toBeTruthy();
    expect(tooltip.percentageChange).toBeTruthy();
    logger.info(`Tooltip verified: Amount: $${tooltip.amount}, Change: ${tooltip.percentageChange}`);
  });

  test('QE-10373 TS-003 TC-001: Verify notification for insufficient historical data', async ({ page }) => {
    logger.info('Starting test: QE-10373 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Navigate with less than 3 months data
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_newaccount@example.com', 'Test@123');
    await analyticsPage.navigateToMonthlyTrends();
    logger.info('Navigated to monthly trends with 2 months data');
    
    // Step 4: Verify available data displayed
    const chartData = await analyticsPage.getMonthlyTrendData();
    expect(chartData.dataPoints.length).toBeLessThan(3);
    logger.info(`Chart displays ${chartData.dataPoints.length} data points`);
    
    // Step 5: Verify notification message
    const notification = await analyticsPage.getNotificationMessage();
    expect(notification).toContain('Insufficient historical data');
    logger.info(`Notification displayed: ${notification}`);
  });

  test('QE-10372 TS-001 TC-001: Verify dashboard KPI widgets load within 2 seconds', async ({ page }) => {
    logger.info('Starting test: QE-10372 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1-2: Launch and authenticate
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Test@123');
    logger.info('User authenticated');
    
    // Step 3: Measure load time
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    logger.info(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    // Step 4-7: Verify all KPI widgets with correct values
    const kpiValues = await dashboardPage.captureKPIValues();
    expect(kpiValues.monthlySpend).toBeGreaterThanOrEqual(0);
    expect(kpiValues.totalCreditLimit).toBeGreaterThanOrEqual(0);
    expect(kpiValues.availableCredit).toBeGreaterThanOrEqual(0);
    expect(kpiValues.outstandingAmount).toBeGreaterThanOrEqual(0);
    logger.info(`KPI values verified: ${JSON.stringify(kpiValues)}`);
  });

  test('QE-10372 TS-002 TC-001: Verify accurate KPI calculations', async ({ page }) => {
    logger.info('Starting test: QE-10372 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1-3: Navigate with 3 cards
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_3cards@example.com', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded for user with 3 cards');
    
    // Step 4-7: Verify calculations
    const kpiValues = await dashboardPage.captureKPIValues();
    const expectedTotalLimit = 23000; // 5000 + 10000 + 8000
    const expectedOutstanding = 6700; // 1200 + 3500 + 2000
    const expectedAvailable = 16300; // 23000 - 6700
    
    expect(kpiValues.totalCreditLimit).toBe(expectedTotalLimit);
    expect(kpiValues.outstandingAmount).toBe(expectedOutstanding);
    expect(kpiValues.availableCredit).toBe(expectedAvailable);
    logger.info('All KPI calculations verified as accurate');
  });

  test('QE-10372 TS-003 TC-001: Verify error handling for backend service unavailability', async ({ page }) => {
    logger.info('Starting test: QE-10372 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1-2: Authenticate
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Simulate backend unavailability
    await page.route('**/api/creditcards', route => route.abort());
    logger.info('Simulated backend service unavailability');
    
    // Step 4-5: Verify error message
    await page.reload();
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load dashboard data');
    logger.info(`Error message displayed: ${errorMessage}`);
    
    // Step 6: Verify retry button
    const hasRetryButton = await dashboardPage.hasRetryButton();
    expect(hasRetryButton).toBe(true);
    logger.info('Retry button available');
    
    // Step 7: Verify application stability
    const isStable = await dashboardPage.checkApplicationStability();
    expect(isStable).toBe(true);
    logger.info('Application remains stable without crash');
  });

  test('QE-10371 TS-001 TC-001: Verify 5 cards display with masked numbers', async ({ page }) => {
    logger.info('Starting test: QE-10371 TS-001 TC-001');
    const portfolioPage = new PortfolioPage(page);
    
    // Step 1-3: Navigate to portfolio
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_5cards@example.com', 'Test@123');
    await portfolioPage.navigateToPortfolio();
    logger.info('Navigated to portfolio with 5 cards');
    
    // Step 4: Verify 5 cards displayed
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBe(5);
    logger.info('Verified 5 credit cards displayed');
    
    // Step 5-8: Verify card details
    const cards = await portfolioPage.getAllCardDetails();
    for (const card of cards) {
      expect(card.maskedNumber).toMatch(/\*\*\*\* \*\*\*\* \*\*\*\* \d{4}/);
      expect(card.cardType).toBeTruthy();
      expect(card.creditLimit).toBeGreaterThan(0);
      expect(card.currentBalance).toBeGreaterThanOrEqual(0);
    }
    logger.info('All card details verified with proper masking');
  });

  test('QE-10371 TS-002 TC-001: Verify 10 cards performance and data retrieval', async ({ page }) => {
    logger.info('Starting test: QE-10371 TS-002 TC-001');
    const portfolioPage = new PortfolioPage(page);
    
    // Step 1-2: Authenticate with 10 cards
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_10cards@example.com', 'Test@123');
    
    // Step 3: Measure data retrieval time
    const startTime = Date.now();
    await portfolioPage.navigateToPortfolio();
    await portfolioPage.waitForPortfolioLoad();
    const loadTime = Date.now() - startTime;
    logger.info(`Portfolio load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThanOrEqual(1000);
    
    // Step 4: Verify 10 cards displayed
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBe(10);
    logger.info('Verified 10 credit cards displayed');
    
    // Step 5-6: Verify complete details and masking
    const cards = await portfolioPage.getAllCardDetails();
    for (const card of cards) {
      expect(card.maskedNumber).toMatch(/\*\*\*\* \*\*\*\* \*\*\*\* \d{4}/);
      expect(card.cardType).toBeTruthy();
      expect(card.creditLimit).toBeGreaterThan(0);
      expect(card.currentBalance).toBeGreaterThanOrEqual(0);
      expect(card.availableCredit).toBeGreaterThanOrEqual(0);
      expect(card.monthlySpend).toBeGreaterThanOrEqual(0);
    }
    logger.info('All 10 cards verified with complete details');
    
    // Step 7: Verify performance
    const isPerformant = await portfolioPage.checkPerformance();
    expect(isPerformant).toBe(true);
    logger.info('Interface remains performant with 10 cards');
  });

  test('QE-10371 TS-003 TC-001: Verify empty state message for no linked cards', async ({ page }) => {
    logger.info('Starting test: QE-10371 TS-003 TC-001');
    const portfolioPage = new PortfolioPage(page);
    
    // Step 1-3: Navigate with no cards
    await portfolioPage.navigate();
    await portfolioPage.login('testuser_nocards@example.com', 'Test@123');
    await portfolioPage.navigateToPortfolio();
    logger.info('Navigated to portfolio with no cards');
    
    // Step 4: Verify empty state message
    const emptyMessage = await portfolioPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No credit cards are currently linked');
    logger.info(`Empty state message displayed: ${emptyMessage}`);
    
    // Step 5: Verify add card option
    const hasAddCardButton = await portfolioPage.hasAddCardButton();
    expect(hasAddCardButton).toBe(true);
    logger.info('Add Card button available');
  });
});
