const { test, expect } = require('@playwright/test');
const { CategorySpendingPage } = require('./pages/categorySpending.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Category-wise Spending Analytics - QE-9424', () => {
  let categorySpendingPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Category Spending Analytics test');
    categorySpendingPage = new CategorySpendingPage(page);
    loginPage = new LoginPage(page);
  });

  test('QE-9424 TS-001 TC-001: Verify pie chart with 6 categories and drill-down capability', async ({ page }) => {
    logger.info('Starting test: QE-9424 TS-001 TC-001');
    
    // Step 1: Launch application
    await categorySpendingPage.navigate();
    await expect(page).toHaveURL(/analytics/);
    logger.info('Application loaded successfully');
    
    // Step 2: Login with user having 6 categories
    await loginPage.login('testuser_6cat', 'Pass@123');
    await categorySpendingPage.waitForDashboardLoad();
    logger.info('User authenticated successfully');
    
    // Step 3: Navigate to Spending Analytics
    await categorySpendingPage.navigateToAnalytics();
    await categorySpendingPage.waitForPageLoad(3000);
    logger.info('Analytics page loaded');
    
    // Step 4: Verify pie chart with 6 segments
    await categorySpendingPage.waitForChartRender();
    const categoryCount = await categorySpendingPage.getCategoryCount();
    expect(categoryCount).toBe(6);
    const categories = await categorySpendingPage.getCategoryLabels();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    logger.info('Pie chart verified with 6 categories');
    
    // Step 5: Verify spend amounts
    const spendData = await categorySpendingPage.getCategorySpendData();
    expect(spendData['Food & Dining']).toBe(5000);
    expect(spendData['Fuel']).toBe(2000);
    expect(spendData['Shopping']).toBe(8000);
    expect(spendData['Travel']).toBe(3000);
    expect(spendData['Entertainment']).toBe(1500);
    expect(spendData['Utilities']).toBe(1000);
    const totalSpend = Object.values(spendData).reduce((a, b) => a + b, 0);
    expect(totalSpend).toBe(20500);
    logger.info('Spend amounts verified');
    
    // Step 6: Drill down into Food & Dining
    await categorySpendingPage.clickCategorySegment('Food & Dining');
    await categorySpendingPage.waitForTransactionListLoad();
    const transactionCount = await categorySpendingPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(15);
    logger.info('Drill-down functionality verified');
  });

  test('QE-9424 TS-002 TC-001: Verify empty state for user with no transaction history', async ({ page }) => {
    logger.info('Starting test: QE-9424 TS-002 TC-001');
    
    // Step 1: Launch application
    await categorySpendingPage.navigate();
    await expect(page).toHaveURL(/analytics/);
    
    // Step 2: Login with user having no transactions
    await loginPage.login('newuser_notrans', 'Pass@123');
    await categorySpendingPage.waitForDashboardLoad();
    logger.info('User with no transactions authenticated');
    
    // Step 3: Navigate to Spending Analytics
    await categorySpendingPage.navigateToAnalytics();
    await categorySpendingPage.waitForPageLoad(3000);
    
    // Step 4: Verify empty state message
    const emptyMessage = await categorySpendingPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No spending data available');
    logger.info('Empty state message verified');
    
    // Step 5: Verify no chart rendered
    const isChartVisible = await categorySpendingPage.isChartVisible();
    expect(isChartVisible).toBe(false);
    const hasErrors = await categorySpendingPage.hasErrorMessages();
    expect(hasErrors).toBe(false);
    logger.info('No chart or errors displayed');
    
    // Step 6: Verify navigation remains functional
    const isDashboardLinkActive = await categorySpendingPage.isDashboardLinkActive();
    const isCardManagementLinkActive = await categorySpendingPage.isCardManagementLinkActive();
    expect(isDashboardLinkActive).toBe(true);
    expect(isCardManagementLinkActive).toBe(true);
    logger.info('Navigation links verified as active');
  });

  test('QE-9424 TS-003 TC-001: Verify filtering to 3-month period with all 9 categories', async ({ page }) => {
    logger.info('Starting test: QE-9424 TS-003 TC-001');
    
    // Step 1: Login with user having all 9 categories
    await categorySpendingPage.navigate();
    await loginPage.login('testuser_9cat', 'Pass@123');
    await categorySpendingPage.waitForDashboardLoad();
    logger.info('User with 9 categories authenticated');
    
    // Step 2: Navigate to Analytics
    await categorySpendingPage.navigateToAnalytics();
    await categorySpendingPage.waitForPageLoad(3000);
    const defaultPeriod = await categorySpendingPage.getSelectedPeriod();
    expect(defaultPeriod).toBe('12 months');
    logger.info('Default 12-month view loaded');
    
    // Step 3: Apply 3-month filter
    await categorySpendingPage.selectPeriodFilter('3 months');
    await categorySpendingPage.waitForChartUpdate(3000);
    logger.info('3-month filter applied');
    
    // Step 4: Verify all 9 categories displayed
    const categoryCount = await categorySpendingPage.getCategoryCount();
    expect(categoryCount).toBe(9);
    const categories = await categorySpendingPage.getCategoryLabels();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    logger.info('All 9 categories verified');
    
    // Step 5: Verify Miscellaneous category
    const spendData = await categorySpendingPage.getCategorySpendData();
    expect(spendData['Miscellaneous']).toBe(500);
    logger.info('Miscellaneous category verified');
    
    // Step 6: Verify total spend
    const totalSpend = Object.values(spendData).reduce((a, b) => a + b, 0);
    expect(totalSpend).toBe(15000);
    logger.info('Total spend verified');
    
    // Step 7: Drill down into Miscellaneous
    await categorySpendingPage.clickCategorySegment('Miscellaneous');
    await categorySpendingPage.waitForTransactionListLoad();
    const transactionCount = await categorySpendingPage.getTransactionCount();
    expect(transactionCount).toBe(3);
    logger.info('Miscellaneous drill-down verified');
  });
});
