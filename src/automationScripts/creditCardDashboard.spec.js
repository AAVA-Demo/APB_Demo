const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { TransactionPage } = require('./pages/transaction.page');
const { AnalyticsPage } = require('./pages/analytics.page');

// Test Suite: Dashboard KPIs Display (User Story QE-10151)
test.describe('Dashboard KPIs Display Tests', () => {
  let loginPage, dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-10439 TS-001 TC-001: Verify dashboard displays aggregated KPIs for user with multiple active credit cards', async ({ page }) => {
    // Step 1-2: Login with multi-card user
    await loginPage.login('testuser_multicard', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Dashboard KPIs section
    await dashboardPage.waitForDashboardLoad();

    // Step 4: Verify Monthly Spend KPI
    const monthlySpend = await dashboardPage.getMonthlySpendKPI();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    expect(monthlySpend).toMatch(/\$[0-9,]+\.\d{2}/);

    // Step 5: Verify Total Credit Limit KPI
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitKPI();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    expect(totalCreditLimit).toMatch(/\$[0-9,]+\.\d{2}/);

    // Step 6: Verify Available Credit KPI
    const availableCredit = await dashboardPage.getAvailableCreditKPI();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    expect(availableCredit).toMatch(/\$[0-9,]+\.\d{2}/);

    // Step 7: Verify Outstanding Amount KPI
    const outstandingAmount = await dashboardPage.getOutstandingAmountKPI();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    expect(outstandingAmount).toMatch(/\$[0-9,]+\.\d{2}/);

    // Step 8: Verify currency formatting
    const allKPIs = [monthlySpend, totalCreditLimit, availableCredit, outstandingAmount];
    allKPIs.forEach(kpi => {
      expect(kpi).toMatch(/^\$[0-9]{1,3}(,[0-9]{3})*\.[0-9]{2}$/);
    });
  });

  test('QE-10439 TS-002 TC-001: Verify dashboard displays appropriate message and zero KPI values when user has no registered credit cards', async ({ page }) => {
    // Step 1-2: Login with no-cards user
    await loginPage.login('testuser_nocards', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Dashboard KPIs section
    await dashboardPage.waitForDashboardLoad();

    // Step 4: Verify no credit cards message
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.getNoCardsMessageText();
    expect(messageText).toContain('No credit cards registered');

    // Step 5-8: Verify all KPIs show $0.00
    const monthlySpend = await dashboardPage.getMonthlySpendKPI();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitKPI();
    const availableCredit = await dashboardPage.getAvailableCreditKPI();
    const outstandingAmount = await dashboardPage.getOutstandingAmountKPI();

    expect(monthlySpend).toBe('$0.00');
    expect(totalCreditLimit).toBe('$0.00');
    expect(availableCredit).toBe('$0.00');
    expect(outstandingAmount).toBe('$0.00');
  });

  test('QE-10439 TS-003 TC-001: Verify dashboard accurately calculates total credit limit and outstanding amounts for varying balances', async ({ page }) => {
    // Step 1-2: Login with varying balances user
    await loginPage.login('testuser_varyingbalances', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Dashboard KPIs section
    await dashboardPage.waitForDashboardLoad();

    // Step 4: Retrieve individual card details
    const cardDetails = await dashboardPage.getAllCardDetails();
    expect(cardDetails.length).toBeGreaterThanOrEqual(3);

    // Step 5: Verify Total Credit Limit calculation
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitKPI();
    expect(totalCreditLimit).toBe('$45,000.00');

    // Step 6: Verify Outstanding Amount calculation
    const outstandingAmount = await dashboardPage.getOutstandingAmountKPI();
    expect(outstandingAmount).toBe('$15,200.00');

    // Step 7: Verify Available Credit calculation
    const availableCredit = await dashboardPage.getAvailableCreditKPI();
    expect(availableCredit).toBe('$29,800.00');
  });
});

// Test Suite: Multiple Credit Card View (User Story QE-10165)
test.describe('Multiple Credit Card View Tests', () => {
  let loginPage, dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-10437 TS-001 TC-001: Verify user with three or more cards can view all cards in consolidated interface', async ({ page }) => {
    // Step 1-2: Login with three-cards user
    await loginPage.login('testuser_threecards', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Credit Card Overview
    await dashboardPage.waitForDashboardLoad();

    // Step 4: Verify at least three card tiles displayed
    const cardCount = await dashboardPage.getCardTilesCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);

    // Step 5-8: Verify card details for each card
    const cards = await dashboardPage.getAllCardDetails();
    for (const card of cards) {
      expect(card.name).toBeTruthy();
      expect(card.last4Digits).toMatch(/\d{4}/);
      expect(card.outstanding).toMatch(/\$[0-9,]+\.\d{2}/);
      expect(card.creditLimit).toMatch(/\$[0-9,]+\.\d{2}/);
      expect(card.utilization).toMatch(/\d+\.\d%/);
    }

    // Step 9: Verify responsive layout
    await expect(dashboardPage.cardGridContainer).toBeVisible();
  });

  test('QE-10437 TS-002 TC-001: Verify user with single card can view card correctly without errors', async ({ page }) => {
    // Step 1-2: Login with one-card user
    await loginPage.login('testuser_onecard', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Credit Card Overview
    await dashboardPage.waitForDashboardLoad();

    // Step 4: Verify exactly one card tile
    const cardCount = await dashboardPage.getCardTilesCount();
    expect(cardCount).toBe(1);

    // Step 5: Verify all card details displayed
    const cardDetails = await dashboardPage.getCardDetailsByIndex(0);
    expect(cardDetails.name).toContain('Platinum Rewards');
    expect(cardDetails.last4Digits).toBe('4532');
    expect(cardDetails.outstanding).toBe('$6,500.00');
    expect(cardDetails.creditLimit).toBe('$15,000.00');
    expect(cardDetails.utilization).toBe('43.3%');

    // Step 6: Verify no errors or layout issues
    await expect(dashboardPage.errorMessage).not.toBeVisible();
  });

  test('QE-10437 TS-003 TC-001: Verify appropriate error message when backend service unavailable', async ({ page }) => {
    // Step 1-2: Login with valid credentials
    await loginPage.login('testuser', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Simulate backend unavailability (intercept API and return 503)
    await page.route('**/api/dashboard/cards', route => {
      route.fulfill({
        status: 503,
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });

    // Step 4: Navigate to Credit Card Overview
    await page.reload();
    await dashboardPage.waitForDashboardLoad();

    // Step 5: Verify error message displayed
    await expect(dashboardPage.serviceErrorMessage).toBeVisible();
    const errorText = await dashboardPage.getServiceErrorMessageText();
    expect(errorText).toContain('Unable to retrieve credit card data');

    // Step 6: Verify no partial data displayed
    const cardCount = await dashboardPage.getCardTilesCount();
    expect(cardCount).toBe(0);
  });
});

// Test Suite: Transaction History Display (User Story QE-10170)
test.describe('Transaction History Display Tests', () => {
  let loginPage, transactionPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionPage = new TransactionPage(page);
    await loginPage.navigate();
  });

  test('QE-10436 TS-001 TC-001: Verify user can view transaction history with accurate details', async ({ page }) => {
    // Step 1-2: Login with transactions user
    await loginPage.login('testuser_transactions', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Transaction History
    await transactionPage.navigateToTransactions();

    // Step 4: Verify at least one transaction displayed
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);

    // Step 5-8: Verify transaction details
    const firstTransaction = await transactionPage.getTransactionByIndex(0);
    expect(firstTransaction.timestamp).toMatch(/[A-Za-z]{3} \d{1,2}, \d{4} \d{1,2}:\d{2} [AP]M/);
    expect(firstTransaction.merchant).toBeTruthy();
    expect(firstTransaction.amount).toMatch(/USD \d+\.\d{2}/);
    expect(firstTransaction.status).toMatch(/posted|pending|declined/);
  });

  test('QE-10436 TS-002 TC-001: Verify no transactions message for user with no history', async ({ page }) => {
    // Step 1-2: Login with no-transactions user
    await loginPage.login('testuser_notransactions', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Transaction History
    await transactionPage.navigateToTransactions();

    // Step 4: Verify no transactions message
    await expect(transactionPage.noTransactionsMessage).toBeVisible();
    const messageText = await transactionPage.getNoTransactionsMessageText();
    expect(messageText).toContain('No transactions found');

    // Step 5: Verify empty transaction list
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(0);
  });

  test('QE-10436 TS-003 TC-001: Verify transactions displayed in reverse chronological order with correct formatting', async ({ page }) => {
    // Step 1-2: Login with multi-transactions user
    await loginPage.login('testuser_multitransactions', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Transaction History
    await transactionPage.navigateToTransactions();

    // Step 4: Verify reverse chronological order
    const transactions = await transactionPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(1);
    
    for (let i = 0; i < transactions.length - 1; i++) {
      const currentDate = new Date(transactions[i].timestamp);
      const nextDate = new Date(transactions[i + 1].timestamp);
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }

    // Step 5: Verify consistent date formatting
    transactions.forEach(txn => {
      expect(txn.timestamp).toMatch(/[A-Za-z]{3} \d{1,2}, \d{4} \d{1,2}:\d{2} [AP]M/);
    });

    // Step 6: Verify currency formatting
    transactions.forEach(txn => {
      expect(txn.amount).toMatch(/USD \d+\.\d{2}|\$\d+\.\d{2}/);
    });
  });
});

// Test Suite: Multi-Card Transaction Support (User Story QE-10172)
test.describe('Multi-Card Transaction Support Tests', () => {
  let loginPage, transactionPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionPage = new TransactionPage(page);
    await loginPage.navigate();
  });

  test('QE-10435 TS-001 TC-001: Verify user can filter transactions by specific card with pagination', async ({ page }) => {
    // Step 1-2: Login with multi-card transactions user
    await loginPage.login('testuser_multicardtxns', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Transaction History
    await transactionPage.navigateToTransactions();

    // Step 4: Select specific card from filter
    await transactionPage.selectCardFilter('Platinum Rewards');

    // Step 5: Verify filtered transactions
    const transactions = await transactionPage.getAllTransactions();
    transactions.forEach(txn => {
      expect(txn.cardName).toBe('Platinum Rewards');
    });

    // Step 6: Verify pagination controls visible
    await expect(transactionPage.paginationControls).toBeVisible();

    // Step 7: Navigate to next page
    await transactionPage.clickNextPage();
    const nextPageTransactions = await transactionPage.getAllTransactions();
    expect(nextPageTransactions.length).toBeGreaterThan(0);
  });

  test('QE-10435 TS-002 TC-001: Verify no transactions message when selecting card with no transactions', async ({ page }) => {
    // Step 1-2: Login with card-no-txns user
    await loginPage.login('testuser_cardnotxns', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Transaction History
    await transactionPage.navigateToTransactions();

    // Step 4: Select card with no transactions
    await transactionPage.selectCardFilter('Cashback Plus');

    // Step 5: Verify no transactions message
    await expect(transactionPage.noTransactionsForCardMessage).toBeVisible();
    const messageText = await transactionPage.getNoTransactionsForCardMessageText();
    expect(messageText).toContain('No transactions found for this card');

    // Step 6: Verify empty transaction list
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(0);
  });

  test('QE-10435 TS-003 TC-001: Verify All Cards option displays unified list with card identifiers and pagination', async ({ page }) => {
    // Step 1-2: Login with all-cards-txns user
    await loginPage.login('testuser_allcardstxns', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Transaction History
    await transactionPage.navigateToTransactions();

    // Step 4: Select All Cards option
    await transactionPage.selectCardFilter('All Cards');

    // Step 5: Verify mixed transactions from all cards
    const transactions = await transactionPage.getAllTransactions();
    const cardNames = transactions.map(txn => txn.cardName);
    const uniqueCards = [...new Set(cardNames)];
    expect(uniqueCards.length).toBeGreaterThan(1);

    // Step 6: Verify each transaction shows card identifier
    transactions.forEach(txn => {
      expect(txn.cardName).toBeTruthy();
    });

    // Step 7: Verify pagination controls
    await expect(transactionPage.paginationControls).toBeVisible();

    // Step 8: Verify pagination functionality
    await transactionPage.clickNextPage();
    const nextPageTransactions = await transactionPage.getAllTransactions();
    expect(nextPageTransactions.length).toBeGreaterThan(0);
  });
});

// Test Suite: Category-Wise Spending Breakdown (User Story QE-10181)
test.describe('Category-Wise Spending Breakdown Tests', () => {
  let loginPage, analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-10438 TS-001 TC-001: Verify category-wise spending breakdown displays all categories with accurate amounts', async ({ page }) => {
    // Step 1-2: Login with all-categories user
    await loginPage.login('testuser_allcategories', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 4: Verify all 9 categories displayed
    const categories = await analyticsPage.getAllCategories();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expectedCategories.forEach(category => {
      expect(categories).toContain(category);
    });

    // Step 5: Verify accurate spend amounts
    const categoryData = await analyticsPage.getCategorySpendData();
    expect(categoryData['Food & Dining']).toBe('$500.00');
    expect(categoryData['Fuel']).toBe('$300.00');

    // Step 6: Verify percentage distribution
    const percentages = await analyticsPage.getCategoryPercentages();
    const totalPercentage = Object.values(percentages).reduce((sum, pct) => sum + parseFloat(pct), 0);
    expect(totalPercentage).toBeCloseTo(100, 1);

    // Step 7: Verify interactive chart
    await analyticsPage.hoverOverCategorySegment('Food & Dining');
    await expect(analyticsPage.chartTooltip).toBeVisible();
  });

  test('QE-10438 TS-002 TC-001: Verify 100% allocation for single category transactions', async ({ page }) => {
    // Step 1-2: Login with single-category user
    await loginPage.login('testuser_singlecategory', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 4: Verify Food & Dining shows 100%
    const categoryData = await analyticsPage.getCategorySpendData();
    expect(categoryData['Food & Dining']).toBe('$1,250.00');
    const percentages = await analyticsPage.getCategoryPercentages();
    expect(percentages['Food & Dining']).toBe('100.0%');

    // Step 5: Verify other categories show $0.00 and 0%
    const otherCategories = ['Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    otherCategories.forEach(category => {
      expect(categoryData[category]).toBe('$0.00');
      expect(percentages[category]).toBe('0.0%');
    });

    // Step 6: Verify total spend matches
    const totalSpend = await analyticsPage.getTotalSpend();
    expect(totalSpend).toBe('$1,250.00');
  });

  test('QE-10438 TS-003 TC-001: Verify category totals equal dashboard total and percentages sum to 100%', async ({ page }) => {
    // Step 1-2: Login with multi-category user
    await loginPage.login('testuser_multicategory', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Get Monthly Spend from Dashboard
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();
    const dashboardMonthlySpend = await dashboardPage.getMonthlySpendKPI();

    // Step 4: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 5: Sum all category amounts
    const categoryData = await analyticsPage.getCategorySpendData();
    const categorySum = Object.values(categoryData).reduce((sum, amount) => {
      return sum + parseFloat(amount.replace(/[^0-9.]/g, ''));
    }, 0);

    // Step 6: Verify category sum matches dashboard
    const dashboardAmount = parseFloat(dashboardMonthlySpend.replace(/[^0-9.]/g, ''));
    expect(categorySum).toBeCloseTo(dashboardAmount, 2);

    // Step 7: Verify percentages sum to 100%
    const percentages = await analyticsPage.getCategoryPercentages();
    const totalPercentage = Object.values(percentages).reduce((sum, pct) => {
      return sum + parseFloat(pct.replace('%', ''));
    }, 0);
    expect(totalPercentage).toBeCloseTo(100.0, 1);
  });
});

// Test Suite: Monthly Spend Trends Visualization (User Story QE-10174)
test.describe('Monthly Spend Trends Visualization Tests', () => {
  let loginPage, analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-10434 TS-001 TC-001: Verify interactive monthly spend trends chart with drill-down', async ({ page }) => {
    // Step 1-2: Login with multi-month user
    await loginPage.login('testuser_multimonth', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 4: Verify Monthly Spend Trends chart displayed
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();

    // Step 5: Verify data points for each month
    const dataPoints = await analyticsPage.getMonthlyTrendsDataPoints();
    expect(dataPoints.length).toBeGreaterThanOrEqual(3);
    expect(dataPoints).toContainEqual({ month: 'Jan 2024', spend: '$2,300.00' });

    // Step 6: Verify tooltip on hover
    await analyticsPage.hoverOverDataPoint(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('Jan 2024');
    expect(tooltipText).toContain('$2,300.00');

    // Step 7: Verify drill-down functionality
    await analyticsPage.clickDataPoint(0);
    await expect(analyticsPage.drillDownView).toBeVisible();
  });

  test('QE-10434 TS-002 TC-001: Verify single month data point or insufficient data message', async ({ page }) => {
    // Step 1-2: Login with one-month user
    await loginPage.login('testuser_onemonth', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 4: Verify Monthly Spend Trends chart displayed
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();

    // Step 5: Verify single data point
    const dataPoints = await analyticsPage.getMonthlyTrendsDataPoints();
    expect(dataPoints.length).toBe(1);
    expect(dataPoints[0]).toEqual({ month: 'Jan 2024', spend: '$2,300.00' });

    // Step 6: Verify insufficient data message
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.getInsufficientDataMessageText();
    expect(messageText).toContain('Insufficient data');
  });

  test('QE-10434 TS-003 TC-001: Verify chart is interactive and responsive on desktop and mobile', async ({ page }) => {
    // Step 1-2: Login with responsive user (Desktop)
    await loginPage.login('testuser_responsive', 'Pass@123');
    await expect(page).toHaveURL(/\/dashboard/);

    // Step 3: Navigate to Analytics on desktop
    await analyticsPage.navigateToAnalytics();

    // Step 4: Verify tooltips on hover (desktop)
    await analyticsPage.hoverOverDataPoint(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();

    // Step 5: Verify chart renders correctly on desktop
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    const chartBounds = await analyticsPage.monthlyTrendsChart.boundingBox();
    expect(chartBounds.width).toBeGreaterThan(400);

    // Step 6: Resize to mobile dimensions
    await page.setViewportSize({ width: 375, height: 667 });

    // Step 7: Verify chart responsive on mobile
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    const mobileChartBounds = await analyticsPage.monthlyTrendsChart.boundingBox();
    expect(mobileChartBounds.width).toBeLessThanOrEqual(375);

    // Step 8: Verify tooltips on tap (mobile)
    await analyticsPage.tapDataPoint(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
  });
});