const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');
const Logger = require('../utils/logger');

const logger = new Logger('AnalyticsSpec');

test.describe('Category-Wise Spending Analysis - QE-7946', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    logger.info('Test setup: Initializing analytics tests');
  });

  test('QE-7946 TS-001 TC-001: Verify user views accurate pie chart with all nine categories within 3 seconds', async ({ page }) => {
    logger.info('Starting test: QE-7946 TS-001 TC-001');
    
    // Step 1: Authenticate user
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_multi_category.username, testData.users.test_user_multi_category.password);
    logger.info('User with multi-category transactions authenticated');

    // Step 2: Navigate to Spending Analytics
    const startTime = Date.now();
    await analyticsPage.navigateToSpendingAnalytics();
    const loadTime = Date.now() - startTime;
    logger.info(`Spending Analytics page loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);

    // Step 3: Verify pie chart with all nine categories
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    const categories = await analyticsPage.getAllCategorySegments();
    expect(categories.length).toBe(9);
    logger.info('Pie chart displays all 9 categories');

    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of expectedCategories) {
      const categoryExists = await analyticsPage.isCategoryDisplayed(category);
      expect(categoryExists).toBeTruthy();
    }
    logger.info('All expected categories verified');

    // Step 4: Verify chart renders within 3-second NFR
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(3000);
    logger.info('Chart rendered within 3-second NFR requirement');

    // Step 5: Verify tooltip displays correct amounts
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('Food & Dining');
    expect(tooltipText).toMatch(/\$2,500/);
    expect(tooltipText).toMatch(/16\.7%/);
    logger.info('Tooltip verified for Food & Dining category');
  });

  test('QE-7946 TS-002 TC-001: Verify user with limited categories views chart with only populated categories', async ({ page }) => {
    logger.info('Starting test: QE-7946 TS-002 TC-001');
    
    // Step 1: Authenticate user with limited categories
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_limited_categories.username, testData.users.test_user_limited_categories.password);
    logger.info('User with limited categories authenticated');

    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToSpendingAnalytics();
    await expect(analyticsPage.categoryPieChart).toBeVisible();

    // Step 3: Verify only populated categories displayed
    const visibleCategories = await analyticsPage.getVisibleCategorySegments();
    expect(visibleCategories.length).toBe(2);
    expect(visibleCategories).toContain('Food & Dining');
    expect(visibleCategories).toContain('Fuel');
    logger.info('Only 2 populated categories displayed in chart');

    // Step 4: Verify legend shows all nine categories with zeros
    await expect(analyticsPage.categoryLegend).toBeVisible();
    const legendItems = await analyticsPage.getAllLegendItems();
    expect(legendItems.length).toBe(9);
    
    const shoppingAmount = await analyticsPage.getLegendCategoryAmount('Shopping');
    expect(shoppingAmount).toBe('$0.00');
    logger.info('Legend displays all 9 categories with $0.00 for unused categories');
  });

  test('QE-7946 TS-003 TC-001: Verify clicking category segment displays detailed breakdown modal', async ({ page }) => {
    logger.info('Starting test: QE-7946 TS-003 TC-001');
    
    // Step 1: Authenticate user
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_analytics.username, testData.users.test_user_analytics.password);

    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToSpendingAnalytics();
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    logger.info('Pie chart loaded successfully');

    // Step 3: Click on Shopping category
    await analyticsPage.clickCategorySegment('Shopping');
    await expect(analyticsPage.categoryDetailModal).toBeVisible();
    logger.info('Category detail modal opened');

    // Step 4: Verify modal displays accurate details
    const modalTitle = await analyticsPage.getModalTitle();
    expect(modalTitle).toContain('Shopping');
    
    const totalAmount = await analyticsPage.getModalTotalAmount();
    expect(totalAmount).toBe('$2,500');
    
    const transactionCount = await analyticsPage.getModalTransactionCount();
    expect(transactionCount).toBe('15');
    
    const percentage = await analyticsPage.getModalPercentage();
    expect(percentage).toBe('25%');
    logger.info('Modal details verified: $2,500, 15 transactions, 25%');

    // Step 5: Close modal and click Travel category
    await analyticsPage.closeModal();
    await expect(analyticsPage.categoryDetailModal).not.toBeVisible();
    
    await analyticsPage.clickCategorySegment('Travel');
    await expect(analyticsPage.categoryDetailModal).toBeVisible();
    
    const travelAmount = await analyticsPage.getModalTotalAmount();
    expect(travelAmount).toBe('$3,000');
    logger.info('Travel category modal opened with correct details');
  });
});

test.describe('Monthly Spend Trends Visualization - QE-7950', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
  });

  test('QE-7950 TS-001 TC-001: Verify user views interactive line graph with accurate monthly spend', async ({ page }) => {
    logger.info('Starting test: QE-7950 TS-001 TC-001');
    
    // Step 1: Authenticate user with six months history
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_six_months.username, testData.users.test_user_six_months.password);
    logger.info('User with 6 months history authenticated');

    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToSpendingAnalytics();
    await expect(analyticsPage.analyticsContainer).toBeVisible();

    // Step 3: Select Monthly Trends view
    await analyticsPage.selectMonthlyTrendsView();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    logger.info('Monthly Trends view activated');

    // Step 4: Verify line graph displays six months of data
    const dataPoints = await analyticsPage.getMonthlyDataPoints();
    expect(dataPoints.length).toBeGreaterThanOrEqual(6);
    
    const expectedMonths = ['Jun-2024', 'Jul-2024', 'Aug-2024', 'Sep-2024', 'Oct-2024', 'Nov-2024'];
    for (const month of expectedMonths) {
      const monthExists = await analyticsPage.isMonthDisplayed(month);
      expect(monthExists).toBeTruthy();
    }
    logger.info('Line graph displays 6+ months of data');

    // Step 5: Verify chart interactions are smooth
    await analyticsPage.hoverOverDataPoint('Oct-2024');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    
    await analyticsPage.zoomChart(1.5);
    await page.waitForTimeout(500); // Wait for zoom animation
    
    await analyticsPage.panChart(100, 0);
    await page.waitForTimeout(500); // Wait for pan animation
    logger.info('Chart interactions verified: hover, zoom, pan');

    // Step 6: Verify spend calculations are accurate
    const junSpend = await analyticsPage.getMonthSpendValue('Jun-2024');
    expect(junSpend).toBe('$3,000');
    logger.info('Spend calculation verified for Jun-2024: $3,000');
  });

  test('QE-7950 TS-002 TC-001: Verify user with insufficient data views informational message', async ({ page }) => {
    logger.info('Starting test: QE-7950 TS-002 TC-001');
    
    // Step 1: Authenticate user with less than six months
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_three_months.username, testData.users.test_user_three_months.password);
    logger.info('User with 3 months history authenticated');

    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToSpendingAnalytics();

    // Step 3: Select Monthly Trends view
    await analyticsPage.selectMonthlyTrendsView();

    // Step 4: Verify insufficient data message
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const message = await analyticsPage.getInsufficientDataMessageText();
    expect(message).toContain('Insufficient transaction history for monthly trend analysis');
    expect(message).toContain('At least six months of data is required');
    logger.info('Insufficient data message verified');

    // Step 5: Verify no chart displayed
    await expect(analyticsPage.monthlyTrendsChart).not.toBeVisible();
    logger.info('Verified no chart displayed');

    // Step 6: Verify no errors or broken UI
    await expect(analyticsPage.errorMessage).not.toBeVisible();
    await expect(analyticsPage.analyticsContainer).toBeVisible();
    logger.info('Page displays cleanly with no errors');
  });

  test('QE-7950 TS-003 TC-001: Verify user can interact with chart to view detailed breakdowns', async ({ page }) => {
    logger.info('Starting test: QE-7950 TS-003 TC-001');
    
    // Step 1: Authenticate user
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_interactive_chart.username, testData.users.test_user_interactive_chart.password);

    // Step 2: Navigate to Monthly Trends view
    await analyticsPage.navigateToSpendingAnalytics();
    await analyticsPage.selectMonthlyTrendsView();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();

    // Step 3: Hover over October 2024 data point
    await analyticsPage.hoverOverDataPoint('Oct-2024');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('Oct-2024');
    expect(tooltipText).toContain('$4,000');
    expect(tooltipText).toContain('45 transactions');
    logger.info('Tooltip displays: Oct-2024, $4,000, 45 transactions');

    // Step 4: Click on October 2024 data point
    await analyticsPage.clickDataPoint('Oct-2024');
    await expect(analyticsPage.monthDetailModal).toBeVisible();
    
    const modalTitle = await analyticsPage.getModalTitle();
    expect(modalTitle).toContain('Oct-2024');
    
    const totalSpend = await analyticsPage.getModalTotalSpend();
    expect(totalSpend).toBe('$4,000');
    
    const transactionCount = await analyticsPage.getModalTransactionCount();
    expect(transactionCount).toBe('45');
    logger.info('Modal opened with Oct-2024 breakdown');

    // Step 5: Verify category distribution totals match
    const categoryDistribution = await analyticsPage.getCategoryDistribution();
    const categorySum = Object.values(categoryDistribution).reduce((sum, amount) => sum + parseFloat(amount.replace(/[^0-9.-]+/g, '')), 0);
    expect(categorySum).toBe(4000);
    logger.info('Category distribution totals match total spend: $4,000');

    // Step 6: Close modal and click November 2024
    await analyticsPage.closeModal();
    await analyticsPage.clickDataPoint('Nov-2024');
    await expect(analyticsPage.monthDetailModal).toBeVisible();
    
    const novSpend = await analyticsPage.getModalTotalSpend();
    expect(novSpend).toBe('$4,200');
    logger.info('November 2024 modal opened with correct details');
  });
});