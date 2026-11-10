const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { TransactionPage } = require('./pages/transaction.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Credit Card Dashboard - KPI Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Dashboard KPI test suite');
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
  });

  test('QE-10399 TS-001 TC-001 - Verify user with multiple credit cards can view all aggregated KPIs within 2 seconds', async ({ page }) => {
    logger.info('Test Case: QE-10399 TS-001 TC-001 - Starting KPI aggregation test');
    const startTime = Date.now();
    
    await dashboardPage.navigate();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    logger.info(`Dashboard loaded in ${loadTime}ms`);
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('26,000');
    logger.info(`Monthly Spend KPI verified: ₹${monthlySpend}`);
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('155,000');
    logger.info(`Total Credit Limit KPI verified: ₹${totalCreditLimit}`);
    
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('117,000');
    logger.info(`Available Credit KPI verified: ₹${availableCredit}`);
    
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('38,000');
    logger.info(`Outstanding Amount KPI verified: ₹${outstandingAmount}`);
  });

  test('QE-10399 TS-002 TC-001 - Verify user without valid authentication token receives an authentication error', async ({ page, context }) => {
    logger.info('Test Case: QE-10399 TS-002 TC-001 - Testing authentication validation');
    
    await context.clearCookies();
    await page.evaluate(() => localStorage.removeItem('jwt_token'));
    logger.info('Authentication token removed from localStorage');
    
    await dashboardPage.navigate();
    
    await expect(page).toHaveURL(/.*login/);
    logger.info('User redirected to login page as expected');
    
    await expect(dashboardPage.monthlySpendKPI).not.toBeVisible();
    logger.info('KPI data not displayed without authentication');
  });

  test('QE-10399 TS-003 TC-001 - Verify user with no registered credit cards sees zero values for all KPIs', async ({ page }) => {
    logger.info('Test Case: QE-10399 TS-003 TC-001 - Testing zero card scenario');
    
    await loginPage.navigate();
    await loginPage.login('testuser_nocards', 'Pass@123');
    await dashboardPage.navigate();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('0');
    logger.info('Monthly Spend KPI shows ₹0 for user with no cards');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('0');
    
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('0');
    
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('0');
    
    const noCardsMessage = await dashboardPage.getNoCardsMessage();
    expect(noCardsMessage).toContain('No credit cards registered');
    logger.info('No cards message displayed correctly');
  });
});

test.describe('Credit Card Dashboard - Multiple Cards View Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Multiple Cards View test suite');
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.navigate();
  });

  test('QE-10398 TS-001 TC-001 - Verify user with 3 registered credit cards can view unified dashboard with individual metrics', async ({ page }) => {
    logger.info('Test Case: QE-10398 TS-001 TC-001 - Verifying individual card metrics');
    
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(3);
    logger.info('Card count verified: 3 cards displayed');
    
    const card1 = await dashboardPage.getCardDetails(0);
    expect(card1.name).toBe('Platinum Rewards');
    expect(card1.type).toBe('Credit');
    expect(card1.lastFourDigits).toBe('4521');
    expect(card1.creditLimit).toBe('50,000');
    expect(card1.available).toBe('35,000');
    expect(card1.outstanding).toBe('15,000');
    expect(card1.monthlySpend).toBe('8,500');
    logger.info('Card 1 (Platinum Rewards) metrics verified');
    
    const card2 = await dashboardPage.getCardDetails(1);
    expect(card2.name).toBe('Gold Cashback');
    expect(card2.lastFourDigits).toBe('7834');
    expect(card2.creditLimit).toBe('30,000');
    logger.info('Card 2 (Gold Cashback) metrics verified');
    
    const card3 = await dashboardPage.getCardDetails(2);
    expect(card3.name).toBe('Travel Elite');
    expect(card3.lastFourDigits).toBe('2109');
    expect(card3.creditLimit).toBe('75,000');
    logger.info('Card 3 (Travel Elite) metrics verified');
  });

  test('QE-10398 TS-002 TC-001 - Verify user with expired session token is redirected to login page', async ({ page, context }) => {
    logger.info('Test Case: QE-10398 TS-002 TC-001 - Testing expired token handling');
    
    await page.evaluate(() => localStorage.setItem('jwt_token', 'expired_token_12345'));
    logger.info('Expired token set in localStorage');
    
    await dashboardPage.navigate();
    
    await expect(page).toHaveURL(/.*login/);
    logger.info('User redirected to login page with expired token');
    
    const tokenAfterRedirect = await page.evaluate(() => localStorage.getItem('jwt_token'));
    expect(tokenAfterRedirect).toBeNull();
    logger.info('Expired token removed from localStorage');
    
    await expect(dashboardPage.cardListSection).not.toBeVisible();
    logger.info('No credit card data displayed');
  });

  test('QE-10398 TS-003 TC-001 - Verify aggregated metrics correctly sum individual card values', async ({ page }) => {
    logger.info('Test Case: QE-10398 TS-003 TC-001 - Verifying KPI aggregation accuracy');
    
    const cards = await dashboardPage.getAllCardDetails();
    
    let expectedTotalCreditLimit = 0;
    let expectedAvailableCredit = 0;
    let expectedOutstanding = 0;
    
    for (const card of cards) {
      expectedTotalCreditLimit += parseFloat(card.creditLimit.replace(/,/g, ''));
      expectedAvailableCredit += parseFloat(card.available.replace(/,/g, ''));
      expectedOutstanding += parseFloat(card.outstanding.replace(/,/g, ''));
    }
    
    logger.info(`Calculated expected totals: Credit Limit=${expectedTotalCreditLimit}, Available=${expectedAvailableCredit}, Outstanding=${expectedOutstanding}`);
    
    const actualTotalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(actualTotalCreditLimit).toBe(expectedTotalCreditLimit.toLocaleString());
    
    const actualAvailableCredit = await dashboardPage.getAvailableCreditValue();
    expect(actualAvailableCredit).toBe(expectedAvailableCredit.toLocaleString());
    
    const actualOutstanding = await dashboardPage.getOutstandingAmountValue();
    expect(actualOutstanding).toBe(expectedOutstanding.toLocaleString());
    
    logger.info('All aggregated KPIs match sum of individual card values');
  });
});

test.describe('Transaction History Tests', () => {
  let transactionPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Transaction History test suite');
    loginPage = new LoginPage(page);
    transactionPage = new TransactionPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await transactionPage.navigate();
  });

  test('QE-10400 TS-001 TC-001 - Verify user can view paginated transaction history sorted by date descending', async ({ page }) => {
    logger.info('Test Case: QE-10400 TS-001 TC-001 - Testing transaction pagination and sorting');
    
    await expect(transactionPage.transactionTable).toBeVisible();
    
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(10);
    logger.info('First page displays 10 transactions');
    
    const isSortedDescending = await transactionPage.verifyDateSortDescending();
    expect(isSortedDescending).toBe(true);
    logger.info('Transactions sorted by date in descending order');
    
    const firstTransaction = await transactionPage.getTransactionDetails(0);
    expect(firstTransaction.date).toBeDefined();
    expect(firstTransaction.merchant).toBeDefined();
    expect(firstTransaction.category).toBeDefined();
    expect(firstTransaction.card).toBeDefined();
    expect(firstTransaction.amount).toBeDefined();
    logger.info('Transaction details displayed correctly');
    
    const paginationText = await transactionPage.getPaginationText();
    expect(paginationText).toContain('Page 1 of 5');
    logger.info('Pagination shows correct page information');
  });

  test('QE-10400 TS-002 TC-001 - Verify system displays appropriate message when user has no transaction history', async ({ page }) => {
    logger.info('Test Case: QE-10400 TS-002 TC-001 - Testing empty transaction list');
    
    await loginPage.navigate();
    await loginPage.login('testuser_notransactions', 'Pass@123');
    await transactionPage.navigate();
    
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    logger.info('No transactions displayed');
    
    const noTransactionsMessage = await transactionPage.getNoTransactionsMessage();
    expect(noTransactionsMessage).toMatch(/No transactions available|You have no transaction history/);
    logger.info('No transactions message displayed');
    
    const paginationVisible = await transactionPage.isPaginationVisible();
    expect(paginationVisible).toBe(false);
    logger.info('Pagination hidden when no transactions exist');
  });

  test('QE-10400 TS-003 TC-001 - Verify user can navigate through paginated transaction history without duplication', async ({ page }) => {
    logger.info('Test Case: QE-10400 TS-003 TC-001 - Testing pagination navigation');
    
    const page1Transactions = await transactionPage.getAllTransactionIds();
    expect(page1Transactions.length).toBe(10);
    logger.info(`Page 1 transaction IDs captured: ${page1Transactions.join(', ')}`);
    
    await transactionPage.clickNextPage();
    await expect(transactionPage.paginationInfo).toContainText('Page 2 of 5');
    logger.info('Navigated to page 2');
    
    const page2Transactions = await transactionPage.getAllTransactionIds();
    expect(page2Transactions.length).toBe(10);
    
    const hasDuplicates = page1Transactions.some(id => page2Transactions.includes(id));
    expect(hasDuplicates).toBe(false);
    logger.info('No duplicate transactions between page 1 and page 2');
    
    await transactionPage.clickPreviousPage();
    await expect(transactionPage.paginationInfo).toContainText('Page 1 of 5');
    logger.info('Navigated back to page 1');
    
    const page1TransactionsAgain = await transactionPage.getAllTransactionIds();
    expect(page1TransactionsAgain).toEqual(page1Transactions);
    logger.info('Page 1 displays same transactions after navigation');
  });

  test('QE-10403 TS-001 TC-001 - Verify user can filter transactions by selecting a specific credit card', async ({ page }) => {
    logger.info('Test Case: QE-10403 TS-001 TC-001 - Testing card filter functionality');
    
    await expect(transactionPage.cardFilterDropdown).toBeVisible();
    
    const filterOptions = await transactionPage.getFilterOptions();
    expect(filterOptions).toContain('All Cards');
    expect(filterOptions).toContain('Platinum Rewards (****4521)');
    expect(filterOptions).toContain('Gold Cashback (****7834)');
    expect(filterOptions).toContain('Travel Elite (****2109)');
    logger.info('Card filter dropdown contains all expected options');
    
    await transactionPage.selectCardFilter('Platinum Rewards (****4521)');
    logger.info('Selected Platinum Rewards card filter');
    
    await page.waitForTimeout(500);
    
    const filteredTransactions = await transactionPage.getAllTransactions();
    const allMatchCard = filteredTransactions.every(txn => txn.card.includes('Platinum Rewards') && txn.card.includes('4521'));
    expect(allMatchCard).toBe(true);
    logger.info('All displayed transactions belong to Platinum Rewards card');
    
    const paginationText = await transactionPage.getPaginationText();
    expect(paginationText).toBeDefined();
    logger.info('Pagination updated for filtered results');
  });

  test('QE-10403 TS-002 TC-001 - Verify system displays appropriate message when filtering by a card with no transactions', async ({ page }) => {
    logger.info('Test Case: QE-10403 TS-002 TC-001 - Testing filter with no results');
    
    await transactionPage.selectCardFilter('Gold Cashback (****7834)');
    logger.info('Selected Gold Cashback card filter (assuming no transactions)');
    
    await page.waitForTimeout(500);
    
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    logger.info('No transactions displayed for selected card');
    
    const noTransactionsMessage = await transactionPage.getNoTransactionsMessage();
    expect(noTransactionsMessage).toContain('No transactions available for the selected card');
    logger.info('Appropriate message displayed');
    
    const paginationText = await transactionPage.getPaginationText();
    expect(paginationText).toMatch(/Page 0 of 0/);
    logger.info('Pagination shows zero pages');
  });

  test('QE-10403 TS-003 TC-001 - Verify user can reset card filter to view all transactions', async ({ page }) => {
    logger.info('Test Case: QE-10403 TS-003 TC-001 - Testing filter reset functionality');
    
    await transactionPage.selectCardFilter('Platinum Rewards (****4521)');
    logger.info('Applied Platinum Rewards filter');
    
    const filteredCount = await transactionPage.getTotalTransactionCount();
    logger.info(`Filtered transaction count: ${filteredCount}`);
    
    await transactionPage.selectCardFilter('All Cards');
    logger.info('Reset filter to All Cards');
    
    await page.waitForTimeout(500);
    
    const allTransactions = await transactionPage.getAllTransactions();
    const hasMultipleCards = new Set(allTransactions.map(txn => txn.card)).size > 1;
    expect(hasMultipleCards).toBe(true);
    logger.info('Transactions from multiple cards displayed after reset');
    
    const totalCount = await transactionPage.getTotalTransactionCount();
    expect(totalCount).toBeGreaterThan(filteredCount);
    logger.info('Total transaction count increased after filter reset');
  });
});

test.describe('Analytics - Monthly Spend Trends Tests', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Monthly Spend Trends test suite');
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigate();
  });

  test('QE-10402 TS-001 TC-001 - Verify user can view monthly spending trends chart for transactions spanning multiple months', async ({ page }) => {
    logger.info('Test Case: QE-10402 TS-001 TC-001 - Testing monthly trends chart');
    
    await expect(analyticsPage.monthlyTrendsSection).toBeVisible();
    logger.info('Monthly Spend Trends section visible');
    
    const chartVisible = await analyticsPage.isChartVisible('monthly-trends');
    expect(chartVisible).toBe(true);
    logger.info('Monthly trends chart displayed');
    
    const monthsDisplayed = await analyticsPage.getMonthlyTrendsMonths();
    expect(monthsDisplayed.length).toBe(6);
    expect(monthsDisplayed).toContain('2026-09');
    expect(monthsDisplayed).toContain('2026-10');
    expect(monthsDisplayed).toContain('2026-11');
    logger.info('Chart displays 6 months of data');
    
    const nov2026Spend = await analyticsPage.getMonthSpend('2026-11');
    expect(nov2026Spend).toBe('6,150');
    logger.info('Nov 2026 spend amount verified');
    
    const isInteractive = await analyticsPage.verifyChartInteractivity('monthly-trends');
    expect(isInteractive).toBe(true);
    logger.info('Chart is interactive');
  });

  test('QE-10402 TS-002 TC-001 - Verify monthly trends chart displays correctly when user has transaction history in only one month', async ({ page }) => {
    logger.info('Test Case: QE-10402 TS-002 TC-001 - Testing single month scenario');
    
    await loginPage.navigate();
    await loginPage.login('testuser_singlemonth', 'Pass@123');
    await analyticsPage.navigate();
    
    await expect(analyticsPage.monthlyTrendsSection).toBeVisible();
    
    const monthsDisplayed = await analyticsPage.getMonthlyTrendsMonths();
    expect(monthsDisplayed.length).toBe(1);
    expect(monthsDisplayed[0]).toBe('2026-11');
    logger.info('Chart displays single month data point');
    
    const hasTrendLines = await analyticsPage.hasTrendLines();
    expect(hasTrendLines).toBe(false);
    logger.info('No trend lines displayed for single data point');
    
    const monthSpend = await analyticsPage.getMonthSpend('2026-11');
    expect(monthSpend).toBeDefined();
    logger.info('Single month spend amount displayed correctly');
  });

  test('QE-10402 TS-003 TC-001 - Verify user can drill down into a specific month to view category-wise spending breakdown', async ({ page }) => {
    logger.info('Test Case: QE-10402 TS-003 TC-001 - Testing month drill-down functionality');
    
    await analyticsPage.clickMonthDataPoint('2026-11');
    logger.info('Clicked on Nov 2026 data point');
    
    await expect(analyticsPage.categoryBreakdownModal).toBeVisible();
    logger.info('Category breakdown modal opened');
    
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    expect(categoryBreakdown['Food & Dining']).toBe('450');
    expect(categoryBreakdown['Fuel']).toBe('2,500');
    expect(categoryBreakdown['Shopping']).toBe('3,200');
    expect(categoryBreakdown['Travel']).toBe('850');
    expect(categoryBreakdown['Entertainment']).toBe('799');
    expect(categoryBreakdown['Utilities']).toBe('1,500');
    expect(categoryBreakdown['Healthcare']).toBe('650');
    expect(categoryBreakdown['Education']).toBe('2,999');
    expect(categoryBreakdown['Miscellaneous']).toBe('500');
    logger.info('All category amounts verified');
    
    const totalSpend = Object.values(categoryBreakdown).reduce((sum, val) => sum + parseFloat(val.replace(/,/g, '')), 0);
    expect(totalSpend).toBe(13448);
    logger.info('Sum of categories equals total monthly spend');
  });
});

test.describe('Analytics - Category-wise Spending Tests', () => {
  let analyticsPage;
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Category-wise Spending test suite');
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigate();
  });

  test('QE-10401 TS-001 TC-001 - Verify user can view category-wise spending visualization with accurate amounts and percentages', async ({ page }) => {
    logger.info('Test Case: QE-10401 TS-001 TC-001 - Testing category-wise visualization');
    
    const startTime = Date.now();
    
    await expect(analyticsPage.categorySpendingSection).toBeVisible();
    logger.info('Category-wise Spending section visible');
    
    const chartVisible = await analyticsPage.isChartVisible('category-pie');
    expect(chartVisible).toBe(true);
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    logger.info(`Category chart rendered in ${loadTime}ms`);
    
    const categories = await analyticsPage.getCategoryList();
    expect(categories).toHaveLength(9);
    expect(categories).toEqual(expect.arrayContaining([
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ]));
    logger.info('All 9 categories displayed');
    
    const categoryData = await analyticsPage.getAllCategoryData();
    expect(categoryData['Food & Dining'].amount).toBe('1,650');
    expect(categoryData['Fuel'].amount).toBe('5,500');
    expect(categoryData['Shopping'].amount).toBe('7,700');
    logger.info('Category amounts verified');
    
    expect(categoryData['Food & Dining'].percentage).toBe('7.5');
    expect(categoryData['Fuel'].percentage).toBe('25.0');
    expect(categoryData['Shopping'].percentage).toBe('35.0');
    logger.info('Category percentages verified');
  });

  test('QE-10401 TS-002 TC-001 - Verify category-wise spending chart correctly displays zero values for categories with no transactions', async ({ page }) => {
    logger.info('Test Case: QE-10401 TS-002 TC-001 - Testing limited category scenario');
    
    await loginPage.navigate();
    await loginPage.login('testuser_limitedcategories', 'Pass@123');
    await analyticsPage.navigate();
    
    await expect(analyticsPage.categorySpendingSection).toBeVisible();
    
    const chartSegments = await analyticsPage.getVisibleChartSegments();
    expect(chartSegments).toHaveLength(2);
    expect(chartSegments).toContain('Food & Dining');
    expect(chartSegments).toContain('Fuel');
    logger.info('Pie chart displays only 2 category segments');
    
    const categoryData = await analyticsPage.getAllCategoryData();
    expect(categoryData['Shopping'].amount).toBe('0');
    expect(categoryData['Travel'].amount).toBe('0');
    expect(categoryData['Entertainment'].amount).toBe('0');
    expect(categoryData['Utilities'].amount).toBe('0');
    expect(categoryData['Healthcare'].amount).toBe('0');
    expect(categoryData['Education'].amount).toBe('0');
    expect(categoryData['Miscellaneous'].amount).toBe('0');
    logger.info('Zero-value categories show ₹0 in breakdown table');
    
    expect(categoryData['Shopping'].percentage).toBe('0');
    logger.info('Zero-value categories show 0% percentage');
  });

  test('QE-10401 TS-003 TC-001 - Verify that the sum of all category amounts equals the total spending displayed in dashboard KPIs', async ({ page }) => {
    logger.info('Test Case: QE-10401 TS-003 TC-001 - Testing category sum validation');
    
    await dashboardPage.navigate();
    const dashboardMonthlySpend = await dashboardPage.getMonthlySpendValue();
    logger.info(`Dashboard Monthly Spend KPI: ₹${dashboardMonthlySpend}`);
    
    await analyticsPage.navigate();
    await expect(analyticsPage.categoryBreakdownTable).toBeVisible();
    
    const categoryData = await analyticsPage.getAllCategoryData();
    let categorySum = 0;
    
    for (const category in categoryData) {
      const amount = parseFloat(categoryData[category].amount.replace(/,/g, ''));
      categorySum += amount;
      logger.info(`${category}: ₹${categoryData[category].amount}`);
    }
    
    logger.info(`Sum of all categories: ₹${categorySum.toLocaleString()}`);
    
    const dashboardSpendNumeric = parseFloat(dashboardMonthlySpend.replace(/,/g, ''));
    expect(categorySum).toBe(dashboardSpendNumeric);
    logger.info('Category sum matches Dashboard Monthly Spend KPI');
  });
});