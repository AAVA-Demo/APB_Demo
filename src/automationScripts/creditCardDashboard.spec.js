const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const { TransactionPage } = require('./pages/transaction.page');
const { CardManagementPage } = require('./pages/cardManagement.page');
const testData = require('../data/testData.json');

test.describe('Credit Card Dashboard - KPI Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9139 TS001 TC-001 - Verify four KPI cards display with correct values', async ({ page }) => {
    await loginPage.login(testData.users.activeCards.username, testData.users.activeCards.password);
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$2,500.00');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('$25,000.00');
    
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$18,000.00');
    
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('$7,000.00');
  });

  test('QE-9139 TS002 TC-001 - Verify Monthly Spend KPI displays $0 for user with no current transactions', async ({ page }) => {
    await loginPage.login(testData.users.noCurrentTransactions.username, testData.users.noCurrentTransactions.password);
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$0.00');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(parseFloat(totalCreditLimit.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(parseFloat(availableCredit.replace(/[$,]/g, ''))).toBeGreaterThan(0);
  });

  test('QE-9139 TS003 TC-001 - Verify Outstanding Amount equals Total Credit Limit minus Available Credit', async ({ page }) => {
    await loginPage.login(testData.users.calculationCheck.username, testData.users.calculationCheck.password);
    await dashboardPage.waitForDashboardLoad();
    
    const totalCreditLimit = parseFloat((await dashboardPage.getTotalCreditLimitValue()).replace(/[$,]/g, ''));
    const availableCredit = parseFloat((await dashboardPage.getAvailableCreditValue()).replace(/[$,]/g, ''));
    const outstandingAmount = parseFloat((await dashboardPage.getOutstandingAmountValue()).replace(/[$,]/g, ''));
    
    const calculatedOutstanding = totalCreditLimit - availableCredit;
    expect(outstandingAmount).toBe(calculatedOutstanding);
  });
});

test.describe('Credit Card Dashboard - Monthly Trend Analysis Tests', () => {
  let loginPage;
  let dashboardPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-9138 TS001 TC-001 - Verify 6-month trend chart displays with drill-down capability', async ({ page }) => {
    await loginPage.login(testData.users.sixMonthsHistory.username, testData.users.sixMonthsHistory.password);
    await dashboardPage.waitForDashboardLoad();
    await analyticsPage.navigateToMonthlyTrends();
    
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    
    const monthCount = await analyticsPage.getMonthDataPointCount();
    expect(monthCount).toBe(6);
    
    const monthlyData = await analyticsPage.getAllMonthlySpendingData();
    expect(monthlyData).toHaveLength(6);
    expect(monthlyData[0].month).toContain('Jan');
    expect(monthlyData[0].amount).toBe('$1,500.00');
    
    await analyticsPage.clickMonthDataPoint('March');
    await expect(analyticsPage.monthDetailView).toBeVisible();
  });

  test('QE-9138 TS002 TC-001 - Verify insufficient data message for user with 1 month history', async ({ page }) => {
    await loginPage.login(testData.users.oneMonthHistory.username, testData.users.oneMonthHistory.password);
    await dashboardPage.waitForDashboardLoad();
    await analyticsPage.navigateToMonthlyTrends();
    
    const monthCount = await analyticsPage.getMonthDataPointCount();
    expect(monthCount).toBe(1);
    
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.getInsufficientDataMessageText();
    expect(messageText).toContain('More historical data needed for trend analysis');
  });

  test('QE-9138 TS003 TC-001 - Verify drilling down into specific month displays transactions with category breakdown', async ({ page }) => {
    await loginPage.login(testData.users.multiMonthHistory.username, testData.users.multiMonthHistory.password);
    await dashboardPage.waitForDashboardLoad();
    await analyticsPage.navigateToMonthlyTrends();
    
    await analyticsPage.clickMonthDataPoint('March');
    await expect(analyticsPage.monthDetailView).toBeVisible();
    
    const transactionCount = await analyticsPage.getTransactionCountForMonth();
    expect(transactionCount).toBeGreaterThan(0);
    
    await expect(analyticsPage.categoryBreakdownSection).toBeVisible();
    const categories = await analyticsPage.getCategoryBreakdownList();
    expect(categories.length).toBeGreaterThan(0);
  });
});

test.describe('Credit Card Dashboard - Category Drill-Down Tests', () => {
  let loginPage;
  let dashboardPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-9137 TS001 TC-001 - Verify drilling down into Food & Dining displays detailed transactions with filters', async ({ page }) => {
    await loginPage.login(testData.users.multiCategory.username, testData.users.multiCategory.password);
    await dashboardPage.waitForDashboardLoad();
    await analyticsPage.navigateToSpendingAnalytics();
    
    await analyticsPage.clickCategoryInChart('Food & Dining');
    await expect(analyticsPage.categoryDrillDownView).toBeVisible();
    
    const transactions = await analyticsPage.getTransactionList();
    expect(transactions.length).toBeGreaterThan(0);
    
    for (const txn of transactions) {
      expect(txn).toHaveProperty('merchantName');
      expect(txn).toHaveProperty('date');
      expect(txn).toHaveProperty('amount');
    }
    
    await expect(analyticsPage.dateRangeFilter).toBeVisible();
    await expect(analyticsPage.cardTypeFilter).toBeVisible();
  });

  test('QE-9137 TS002 TC-001 - Verify date range filter in drill-down view displays only filtered transactions', async ({ page }) => {
    await loginPage.login(testData.users.multiCategory.username, testData.users.multiCategory.password);
    await dashboardPage.waitForDashboardLoad();
    await analyticsPage.navigateToSpendingAnalytics();
    await analyticsPage.clickCategoryInChart('Shopping');
    
    await analyticsPage.applyDateRangeFilter('2024-01-01', '2024-01-31');
    
    const transactions = await analyticsPage.getTransactionList();
    for (const txn of transactions) {
      const txnDate = new Date(txn.date);
      expect(txnDate >= new Date('2024-01-01') && txnDate <= new Date('2024-01-31')).toBeTruthy();
    }
  });

  test('QE-9137 TS003 TC-001 - Verify single transaction category displays without sub-category breakdown', async ({ page }) => {
    await loginPage.login(testData.users.singleTransactionCategory.username, testData.users.singleTransactionCategory.password);
    await dashboardPage.waitForDashboardLoad();
    await analyticsPage.navigateToSpendingAnalytics();
    await analyticsPage.clickCategoryInChart('Healthcare');
    
    const transactionCount = await analyticsPage.getTransactionCount();
    expect(transactionCount).toBe(1);
    
    const transaction = await analyticsPage.getFirstTransaction();
    expect(transaction).toHaveProperty('merchantName');
    expect(transaction).toHaveProperty('date');
    expect(transaction).toHaveProperty('amount');
    
    await expect(analyticsPage.insufficientDataForSubCategoryMessage).toBeVisible();
    const message = await analyticsPage.getInsufficientDataMessageText();
    expect(message).toContain('Insufficient data for sub-category breakdown');
  });
});

test.describe('Credit Card Dashboard - Card-Wise Spend Analysis Tests', () => {
  let loginPage;
  let dashboardPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-9136 TS001 TC-001 - Verify comparative card spending chart displays for two cards', async ({ page }) => {
    await loginPage.login(testData.users.twoCards.username, testData.users.twoCards.password);
    await dashboardPage.waitForDashboardLoad();
    await analyticsPage.navigateToCardWiseSpend();
    
    await expect(analyticsPage.cardWiseSpendChart).toBeVisible();
    
    const cardData = await analyticsPage.getCardSpendingData();
    expect(cardData.length).toBe(2);
    expect(cardData[0].amount).toBe('$2,000.00');
    expect(cardData[1].amount).toBe('$3,000.00');
    
    await expect(analyticsPage.categoryFilterDropdown).toBeVisible();
    const categories = await analyticsPage.getCategoryFilterOptions();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
  });

  test('QE-9136 TS002 TC-001 - Verify category filter updates card-wise spend chart', async ({ page }) => {
    await loginPage.login(testData.users.multiCardCategory.username, testData.users.multiCardCategory.password);
    await dashboardPage.waitForDashboardLoad();
    await analyticsPage.navigateToCardWiseSpend();
    
    await analyticsPage.selectCategoryFilter('Food & Dining');
    
    const cardData = await analyticsPage.getCardSpendingData();
    expect(cardData[0].category).toBe('Food & Dining');
    expect(cardData[0].amount).toBe('$500.00');
    expect(cardData[1].category).toBe('Food & Dining');
    expect(cardData[1].amount).toBe('$700.00');
  });

  test('QE-9136 TS003 TC-001 - Verify empty state message when category filter has no transactions', async ({ page }) => {
    await loginPage.login(testData.users.limitedCategories.username, testData.users.limitedCategories.password);
    await dashboardPage.waitForDashboardLoad();
    await analyticsPage.navigateToCardWiseSpend();
    
    await analyticsPage.selectCategoryFilter('Healthcare');
    
    await expect(analyticsPage.emptyStateMessage).toBeVisible();
    const message = await analyticsPage.getEmptyStateMessageText();
    expect(message).toContain('No spending found in the selected category');
  });
});

test.describe('Credit Card Dashboard - Multi-Card Portfolio Tests', () => {
  let loginPage;
  let dashboardPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
  });

  test('QE-9135 TS001 TC-001 - Verify three registered credit cards display with details', async ({ page }) => {
    await loginPage.login(testData.users.threeCards.username, testData.users.threeCards.password);
    await dashboardPage.waitForDashboardLoad();
    await cardManagementPage.navigateToMyCards();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(3);
    
    const cards = await cardManagementPage.getAllCardDetails();
    expect(cards[0].name).toBe('Chase Visa');
    expect(cards[0].maskedNumber).toBe('****1234');
    expect(cards[0].type).toBe('Visa');
    
    expect(cards[1].name).toBe('Citi Mastercard');
    expect(cards[1].maskedNumber).toBe('****5678');
    expect(cards[1].type).toBe('Mastercard');
    
    expect(cards[2].name).toBe('Amex');
    expect(cards[2].maskedNumber).toBe('****9012');
    expect(cards[2].type).toBe('Amex');
  });

  test('QE-9135 TS002 TC-001 - Verify empty state message for user with no registered cards', async ({ page }) => {
    await loginPage.login(testData.users.noCards.username, testData.users.noCards.password);
    await dashboardPage.waitForDashboardLoad();
    await cardManagementPage.navigateToMyCards();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(0);
    
    await expect(cardManagementPage.emptyStateMessage).toBeVisible();
    const message = await cardManagementPage.getEmptyStateMessageText();
    expect(message).toContain('No credit cards registered');
  });

  test('QE-9135 TS003 TC-001 - Verify card status displays with visual indicators', async ({ page }) => {
    await loginPage.login(testData.users.mixedCardStatus.username, testData.users.mixedCardStatus.password);
    await dashboardPage.waitForDashboardLoad();
    await cardManagementPage.navigateToMyCards();
    
    const cards = await cardManagementPage.getAllCardDetails();
    expect(cards[0].status).toBe('Active');
    expect(cards[1].status).toBe('Inactive');
    expect(cards[2].status).toBe('Suspended');
    
    const statusColors = await cardManagementPage.getCardStatusColors();
    expect(statusColors[0]).toContain('green');
    expect(statusColors[1]).toContain('gray');
    expect(statusColors[2]).toContain('red');
  });
});

test.describe('Credit Card Dashboard - Card Spending Analysis Tests', () => {
  let loginPage;
  let dashboardPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
  });

  test('QE-9134 TS001 TC-001 - Verify card-specific spend analysis displays detailed information', async ({ page }) => {
    await loginPage.login(testData.users.multiCardsHistory.username, testData.users.multiCardsHistory.password);
    await dashboardPage.waitForDashboardLoad();
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.selectCard('Chase Visa');
    await cardManagementPage.navigateToSpendingAnalysis();
    
    await expect(cardManagementPage.totalSpendValue).toBeVisible();
    const totalSpend = await cardManagementPage.getTotalSpendValue();
    expect(totalSpend).toBe('$5,000.00');
    
    const monthlySpend = await cardManagementPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$800.00');
    
    await expect(cardManagementPage.spendingTrendChart).toBeVisible();
  });

  test('QE-9134 TS002 TC-001 - Verify no spending data message for card with no transactions', async ({ page }) => {
    await loginPage.login(testData.users.newCard.username, testData.users.newCard.password);
    await dashboardPage.waitForDashboardLoad();
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.selectCard('New Visa Card');
    await cardManagementPage.navigateToSpendingAnalysis();
    
    await expect(cardManagementPage.noSpendingDataMessage).toBeVisible();
    const message = await cardManagementPage.getNoSpendingDataMessageText();
    expect(message).toContain('No spending data available for this card');
  });

  test('QE-9134 TS003 TC-001 - Verify total spend matches sum of all transactions', async ({ page }) => {
    await loginPage.login(testData.users.validateSpend.username, testData.users.validateSpend.password);
    await dashboardPage.waitForDashboardLoad();
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.selectCard('Visa ****1234');
    
    const totalSpendFromAnalysis = parseFloat((await cardManagementPage.getTotalSpendValue()).replace(/[$,]/g, ''));
    
    await cardManagementPage.navigateToTransactions();
    const transactions = await cardManagementPage.getAllTransactionAmounts();
    const calculatedTotal = transactions.reduce((sum, amount) => sum + parseFloat(amount.replace(/[$,]/g, '')), 0);
    
    expect(totalSpendFromAnalysis).toBe(calculatedTotal);
  });
});

test.describe('Credit Card Dashboard - Consolidated View Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9133 TS001 TC-001 - Verify consolidated view aggregates totals correctly across three cards', async ({ page }) => {
    await loginPage.login(testData.users.threeActiveCards.username, testData.users.threeActiveCards.password);
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.navigateToConsolidatedView();
    
    const totalCreditLimit = parseFloat((await dashboardPage.getConsolidatedTotalCreditLimit()).replace(/[$,]/g, ''));
    expect(totalCreditLimit).toBe(23000);
    
    const availableCredit = parseFloat((await dashboardPage.getConsolidatedAvailableCredit()).replace(/[$,]/g, ''));
    expect(availableCredit).toBe(16500);
    
    const outstandingAmount = parseFloat((await dashboardPage.getConsolidatedOutstandingAmount()).replace(/[$,]/g, ''));
    expect(outstandingAmount).toBe(6500);
  });

  test('QE-9133 TS002 TC-001 - Verify inactive card is excluded from aggregated totals with notification', async ({ page }) => {
    await loginPage.login(testData.users.inactiveCard.username, testData.users.inactiveCard.password);
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.navigateToConsolidatedView();
    
    const totalCreditLimit = parseFloat((await dashboardPage.getConsolidatedTotalCreditLimit()).replace(/[$,]/g, ''));
    expect(totalCreditLimit).toBe(18000);
    
    await expect(dashboardPage.inactiveCardNotification).toBeVisible();
    const notification = await dashboardPage.getInactiveCardNotificationText();
    expect(notification).toContain('One card is inactive and excluded from totals');
  });

  test('QE-9133 TS003 TC-001 - Verify consolidated available credit calculation is correct', async ({ page }) => {
    await loginPage.login(testData.users.validateCredit.username, testData.users.validateCredit.password);
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.navigateToConsolidatedView();
    
    const totalCreditLimit = parseFloat((await dashboardPage.getConsolidatedTotalCreditLimit()).replace(/[$,]/g, ''));
    const outstandingAmount = parseFloat((await dashboardPage.getConsolidatedOutstandingAmount()).replace(/[$,]/g, ''));
    const availableCredit = parseFloat((await dashboardPage.getConsolidatedAvailableCredit()).replace(/[$,]/g, ''));
    
    const calculatedAvailableCredit = totalCreditLimit - outstandingAmount;
    expect(availableCredit).toBe(calculatedAvailableCredit);
  });
});