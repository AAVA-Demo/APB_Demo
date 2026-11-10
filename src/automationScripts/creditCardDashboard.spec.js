const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const { PortfolioPage } = require('./pages/portfolio.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const { SpendingTrendsPage } = require('./pages/spendingTrends.page');
const logger = require('../utils/logger');

// Test Case: QE-10004 TS-001 TC-001
test('TC-7310: Verify dashboard KPIs load within 2 seconds with accurate values', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  logger.info('Starting test: Verify dashboard KPIs display');
  
  await loginPage.navigate();
  await loginPage.login('testuser_kpi', 'Pass@123');
  
  const startTime = Date.now();
  await dashboardPage.waitForDashboardLoad();
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(2000);
  logger.info(`Dashboard loaded in ${loadTime}ms`);
  
  await expect(dashboardPage.monthlySpendKPI).toBeVisible();
  await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
  await expect(dashboardPage.availableCreditKPI).toBeVisible();
  await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  
  const monthlySpend = await dashboardPage.getMonthlySpendValue();
  const totalLimit = await dashboardPage.getTotalCreditLimitValue();
  const availableCredit = await dashboardPage.getAvailableCreditValue();
  const outstanding = await dashboardPage.getOutstandingAmountValue();
  
  expect(monthlySpend).toBe('$2,500.00');
  expect(totalLimit).toBe('$50,000.00');
  expect(availableCredit).toBe('$35,000.00');
  expect(outstanding).toBe('$15,000.00');
  
  logger.info('Test completed successfully: All KPIs displayed with accurate values');
});

// Test Case: QE-10004 TS-002 TC-001
test('TC-7311: Verify error message when backend service fails', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  logger.info('Starting test: Verify error handling on backend failure');
  
  await loginPage.navigate();
  await loginPage.login('testuser_error', 'Pass@123');
  
  await page.route('**/api/cards', route => route.abort());
  await page.reload();
  
  await expect(dashboardPage.errorMessage).toBeVisible();
  const errorText = await dashboardPage.getErrorMessageText();
  expect(errorText).toContain('Unable to retrieve credit card data');
  
  await expect(dashboardPage.monthlySpendKPI).toHaveText(/N\/A|No data/);
  
  logger.info('Test completed: Error message displayed correctly');
});

// Test Case: QE-10004 TS-003 TC-001
test('TC-7312: Verify dashboard with zero credit cards shows appropriate message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  logger.info('Starting test: Verify dashboard with zero cards');
  
  await loginPage.navigate();
  await loginPage.login('testuser_zerocards', 'Pass@123');
  
  await dashboardPage.waitForDashboardLoad();
  
  const monthlySpend = await dashboardPage.getMonthlySpendValue();
  const totalLimit = await dashboardPage.getTotalCreditLimitValue();
  const availableCredit = await dashboardPage.getAvailableCreditValue();
  const outstanding = await dashboardPage.getOutstandingAmountValue();
  
  expect(monthlySpend).toMatch(/\$0\.00|No data available/);
  expect(totalLimit).toMatch(/\$0\.00|No data available/);
  expect(availableCredit).toMatch(/\$0\.00|No data available/);
  expect(outstanding).toMatch(/\$0\.00|No data available/);
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  
  expect(consoleErrors.length).toBe(0);
  
  logger.info('Test completed: Zero cards handled correctly');
});

// Test Case: QE-10007 TS-001 TC-001
test('TC-7300: Verify portfolio displays all 5 credit cards with accurate details', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  logger.info('Starting test: Verify multiple credit cards display');
  
  await loginPage.navigate();
  await loginPage.login('testuser5cards', 'Pass@123');
  
  await portfolioPage.navigateToPortfolio();
  await portfolioPage.waitForPortfolioLoad();
  
  const cardCount = await portfolioPage.getCardCount();
  expect(cardCount).toBe(5);
  
  const expectedCards = [
    { number: '****1234', type: 'Visa', balance: '$3,500.00' },
    { number: '****5678', type: 'MasterCard', balance: '$8,000.00' },
    { number: '****9012', type: 'Amex', balance: '$5,000.00' },
    { number: '****3456', type: 'Discover', balance: '$2,000.00' },
    { number: '****7890', type: 'Visa', balance: '$1,200.00' }
  ];
  
  for (let i = 0; i < expectedCards.length; i++) {
    const card = expectedCards[i];
    await expect(portfolioPage.getCardByIndex(i)).toBeVisible();
    await expect(portfolioPage.getCardNumber(i)).toHaveText(card.number);
    await expect(portfolioPage.getCardType(i)).toContainText(card.type);
    await expect(portfolioPage.getCardBalance(i)).toHaveText(card.balance);
  }
  
  logger.info('Test completed: All 5 cards displayed with accurate details');
});

// Test Case: QE-10007 TS-002 TC-001
test('TC-7301: Verify empty state message when user has no credit cards', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  logger.info('Starting test: Verify empty portfolio state');
  
  await loginPage.navigate();
  await loginPage.login('testuser_nocards', 'Pass@123');
  
  await portfolioPage.navigateToPortfolio();
  await portfolioPage.waitForPortfolioLoad();
  
  await expect(portfolioPage.emptyStateMessage).toBeVisible();
  const emptyMessage = await portfolioPage.getEmptyStateText();
  expect(emptyMessage).toContain('No credit cards found');
  
  await expect(portfolioPage.pageHeader).toBeVisible();
  await expect(portfolioPage.navigationMenu).toBeVisible();
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  
  expect(consoleErrors.length).toBe(0);
  
  logger.info('Test completed: Empty state displayed correctly');
});

// Test Case: QE-10007 TS-003 TC-001
test('TC-7302: Verify portfolio with maximum 10 cards performs without issues', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  logger.info('Starting test: Verify maximum cards performance');
  
  await loginPage.navigate();
  await loginPage.login('testuser10cards', 'Pass@123');
  
  await portfolioPage.navigateToPortfolio();
  
  const startTime = Date.now();
  await portfolioPage.waitForPortfolioLoad();
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(2000);
  
  const cardCount = await portfolioPage.getCardCount();
  expect(cardCount).toBe(10);
  
  await expect(portfolioPage.cardListContainer).toBeVisible();
  
  const isScrollable = await portfolioPage.isCardListScrollable();
  if (isScrollable) {
    await portfolioPage.scrollCardList();
  }
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  
  expect(consoleErrors.length).toBe(0);
  
  logger.info('Test completed: 10 cards displayed without performance issues');
});

// Test Case: QE-10005 TS-001 TC-001
test('TC-7307: Verify card transaction history displays in reverse chronological order', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  logger.info('Starting test: Verify transaction history display');
  
  await loginPage.navigate();
  await loginPage.login('testuser_transactions', 'Pass@123');
  
  await portfolioPage.navigateToPortfolio();
  await portfolioPage.selectCard('****1234');
  
  await expect(portfolioPage.transactionHistoryTable).toBeVisible();
  
  const firstTransaction = await portfolioPage.getTransactionByIndex(0);
  expect(firstTransaction.date).toBe('2024-01-15');
  expect(firstTransaction.merchant).toBe('Grocery Store');
  expect(firstTransaction.amount).toBe('$150.00');
  expect(firstTransaction.category).toBe('Food & Dining');
  
  const transactionCount = await portfolioPage.getTransactionCount();
  expect(transactionCount).toBe(25);
  
  const dates = await portfolioPage.getAllTransactionDates();
  for (let i = 0; i < dates.length - 1; i++) {
    const currentDate = new Date(dates[i]);
    const nextDate = new Date(dates[i + 1]);
    expect(currentDate >= nextDate).toBeTruthy();
  }
  
  logger.info('Test completed: Transaction history displayed correctly');
});

// Test Case: QE-10005 TS-002 TC-001
test('TC-7308: Verify empty transaction history displays appropriate message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  logger.info('Starting test: Verify empty transaction history');
  
  await loginPage.navigate();
  await loginPage.login('testuser_notransactions', 'Pass@123');
  
  await portfolioPage.navigateToPortfolio();
  await portfolioPage.selectCard('****5678');
  
  await expect(portfolioPage.emptyTransactionMessage).toBeVisible();
  const emptyMessage = await portfolioPage.getEmptyTransactionText();
  expect(emptyMessage).toContain('No transactions found for this card');
  
  await expect(portfolioPage.transactionTableHeader).toBeVisible();
  
  logger.info('Test completed: Empty transaction state handled correctly');
});

// Test Case: QE-10005 TS-003 TC-001
test('TC-7309: Verify large transaction history with pagination', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  logger.info('Starting test: Verify pagination for large transaction history');
  
  await loginPage.navigate();
  await loginPage.login('testuser_largehistory', 'Pass@123');
  
  await portfolioPage.navigateToPortfolio();
  
  const startTime = Date.now();
  await portfolioPage.selectCard('****9012');
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(3000);
  
  const initialTransactionCount = await portfolioPage.getVisibleTransactionCount();
  expect(initialTransactionCount).toBe(20);
  
  await expect(portfolioPage.paginationControls).toBeVisible();
  
  await portfolioPage.clickNextPage();
  await portfolioPage.waitForTransactionsLoad();
  
  const secondPageCount = await portfolioPage.getVisibleTransactionCount();
  expect(secondPageCount).toBeGreaterThan(0);
  
  logger.info('Test completed: Pagination working correctly');
});

// Test Case: QE-10003 TS-001 TC-001
test('TC-7313: Verify category-wise spending chart displays all nine categories', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  logger.info('Starting test: Verify category-wise spending visualization');
  
  await loginPage.navigate();
  await loginPage.login('testuser_categories', 'Pass@123');
  
  await analyticsPage.navigateToAnalytics();
  await analyticsPage.waitForAnalyticsLoad();
  
  await expect(analyticsPage.categoryChart).toBeVisible();
  
  const categories = await analyticsPage.getAllCategories();
  const expectedCategories = [
    'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
    'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
  ];
  
  expect(categories.sort()).toEqual(expectedCategories.sort());
  
  const categoryData = await analyticsPage.getCategoryData('Food & Dining');
  expect(categoryData.amount).toBe('$800.00');
  expect(categoryData.percentage).toBe('30%');
  
  logger.info('Test completed: Category chart displayed correctly');
});

// Test Case: QE-10003 TS-001 TC-002
test('TC-7314: Verify category chart is interactive', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  logger.info('Starting test: Verify category chart interactivity');
  
  await loginPage.navigate();
  await loginPage.login('testuser_categories', 'Pass@123');
  
  await analyticsPage.navigateToAnalytics();
  await analyticsPage.clickCategorySegment('Food & Dining');
  
  await expect(analyticsPage.categoryDetailView).toBeVisible();
  
  const details = await analyticsPage.getCategoryDetails();
  expect(details.transactionCount).toBeGreaterThan(0);
  expect(details.totalAmount).toBeDefined();
  expect(details.percentage).toBeDefined();
  
  logger.info('Test completed: Category chart interactivity verified');
});

// Test Case: QE-10003 TS-002 TC-001
test('TC-7315: Verify empty spending data displays appropriate message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  logger.info('Starting test: Verify empty analytics state');
  
  await loginPage.navigate();
  await loginPage.login('testuser_notransactions', 'Pass@123');
  
  await analyticsPage.navigateToAnalytics();
  
  await expect(analyticsPage.emptyStateMessage).toBeVisible();
  const emptyMessage = await analyticsPage.getEmptyStateText();
  expect(emptyMessage).toContain('No spending data available');
  
  const chartVisible = await analyticsPage.isChartVisible();
  expect(chartVisible).toBeFalsy();
  
  logger.info('Test completed: Empty analytics state handled correctly');
});

// Test Case: QE-10003 TS-003 TC-001
test('TC-7316: Verify partial category data displays correctly', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  logger.info('Starting test: Verify partial category data');
  
  await loginPage.navigate();
  await loginPage.login('testuser_threecategories', 'Pass@123');
  
  await analyticsPage.navigateToAnalytics();
  
  const visibleCategories = await analyticsPage.getVisibleCategories();
  expect(visibleCategories).toEqual(['Food & Dining', 'Fuel', 'Shopping']);
  
  const foodData = await analyticsPage.getCategoryData('Food & Dining');
  expect(foodData.amount).toBe('$600.00');
  expect(foodData.percentage).toBe('50%');
  
  logger.info('Test completed: Partial category data displayed correctly');
});

// Test Case: QE-10006 TS-001 TC-001
test('TC-7303: Verify monthly spending trend chart with 12+ months data', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const spendingTrendsPage = new SpendingTrendsPage(page);
  
  logger.info('Starting test: Verify monthly spending trends');
  
  await loginPage.navigate();
  await loginPage.login('testuser12months', 'Pass@123');
  
  await spendingTrendsPage.navigateToSpendingTrends();
  await spendingTrendsPage.waitForTrendChartLoad();
  
  await expect(spendingTrendsPage.trendChart).toBeVisible();
  
  const dataPoints = await spendingTrendsPage.getDataPointCount();
  expect(dataPoints).toBe(12);
  
  const months = await spendingTrendsPage.getMonthLabels();
  expect(months.length).toBe(12);
  
  await expect(spendingTrendsPage.categoryFilter).toBeVisible();
  
  logger.info('Test completed: Trend chart displayed correctly');
});

// Test Case: QE-10006 TS-001 TC-002
test('TC-7304: Verify trend chart interactivity with hover', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const spendingTrendsPage = new SpendingTrendsPage(page);
  
  logger.info('Starting test: Verify trend chart hover interactivity');
  
  await loginPage.navigate();
  await loginPage.login('testuser12months', 'Pass@123');
  
  await spendingTrendsPage.navigateToSpendingTrends();
  await spendingTrendsPage.hoverOverDataPoint(2);
  
  await expect(spendingTrendsPage.tooltip).toBeVisible();
  
  const tooltipText = await spendingTrendsPage.getTooltipText();
  expect(tooltipText).toMatch(/March 2023.*\$1,800/);
  
  await spendingTrendsPage.hoverOverDataPoint(5);
  const newTooltipText = await spendingTrendsPage.getTooltipText();
  expect(newTooltipText).not.toBe(tooltipText);
  
  logger.info('Test completed: Chart hover interactivity verified');
});

// Test Case: QE-10006 TS-002 TC-001
test('TC-7305: Verify insufficient data message for less than 12 months', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const spendingTrendsPage = new SpendingTrendsPage(page);
  
  logger.info('Starting test: Verify insufficient data handling');
  
  await loginPage.navigate();
  await loginPage.login('testuser6months', 'Pass@123');
  
  await spendingTrendsPage.navigateToSpendingTrends();
  
  const dataPoints = await spendingTrendsPage.getDataPointCount();
  expect(dataPoints).toBe(6);
  
  await expect(spendingTrendsPage.insufficientDataMessage).toBeVisible();
  const message = await spendingTrendsPage.getInsufficientDataText();
  expect(message).toContain('Only 6 months of data available');
  
  logger.info('Test completed: Insufficient data handled correctly');
});

// Test Case: QE-10006 TS-003 TC-001
test('TC-7306: Verify category filter updates trend chart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const spendingTrendsPage = new SpendingTrendsPage(page);
  
  logger.info('Starting test: Verify category filter functionality');
  
  await loginPage.navigate();
  await loginPage.login('testuser_trends', 'Pass@123');
  
  await spendingTrendsPage.navigateToSpendingTrends();
  
  const initialTotal = await spendingTrendsPage.getTotalSpending();
  
  await spendingTrendsPage.selectCategoryFilter('Food & Dining');
  await spendingTrendsPage.waitForChartUpdate();
  
  const filteredTotal = await spendingTrendsPage.getTotalSpending();
  expect(filteredTotal).toBeLessThan(initialTotal);
  
  const chartTitle = await spendingTrendsPage.getChartTitle();
  expect(chartTitle).toContain('Food & Dining');
  
  logger.info('Test completed: Category filter working correctly');
});

// Test Case: QE-10002 TS-001 TC-001
test('TC-7317: Verify real-time credit update after transaction', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  logger.info('Starting test: Verify real-time credit update');
  
  await loginPage.navigate();
  await loginPage.login('testuser_realtime', 'Pass@123');
  
  const initialCredit = await dashboardPage.getAvailableCreditValue();
  expect(initialCredit).toBe('$10,000.00');
  
  await dashboardPage.simulateTransaction(500, 'Test Store');
  
  await page.reload();
  await page.waitForTimeout(5000);
  
  const updatedCredit = await dashboardPage.getAvailableCreditValue();
  expect(updatedCredit).toBe('$9,500.00');
  
  logger.info('Test completed: Real-time credit update verified');
});

// Test Case: QE-10002 TS-002 TC-001
test('TC-7318: Verify warning when credit limit exceeded', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  logger.info('Starting test: Verify credit limit exceeded warning');
  
  await loginPage.navigate();
  await loginPage.login('testuser_overlimit', 'Pass@123');
  
  const initialCredit = await dashboardPage.getAvailableCreditValue();
  expect(initialCredit).toBe('$500.00');
  
  await dashboardPage.simulateTransaction(1000, 'Test Store');
  await page.reload();
  
  const updatedCredit = await dashboardPage.getAvailableCreditValue();
  expect(updatedCredit).toMatch(/\$0\.00|\-\$500\.00/);
  
  await expect(dashboardPage.creditLimitWarning).toBeVisible();
  const warningText = await dashboardPage.getWarningText();
  expect(warningText).toContain('Credit limit exceeded');
  
  logger.info('Test completed: Credit limit warning displayed correctly');
});

// Test Case: QE-10002 TS-003 TC-001
test('TC-7319: Verify cumulative credit update for multiple transactions', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  logger.info('Starting test: Verify cumulative credit updates');
  
  await loginPage.navigate();
  await loginPage.login('testuser_multiple', 'Pass@123');
  
  const initialCredit = await dashboardPage.getAvailableCreditValue();
  expect(initialCredit).toBe('$15,000.00');
  
  await dashboardPage.simulateTransaction(300, 'Store A');
  await dashboardPage.simulateTransaction(500, 'Store B');
  await dashboardPage.simulateTransaction(200, 'Store C');
  
  await page.reload();
  await page.waitForTimeout(5000);
  
  const updatedCredit = await dashboardPage.getAvailableCreditValue();
  expect(updatedCredit).toBe('$14,000.00');
  
  logger.info('Test completed: Cumulative credit updates verified');
});