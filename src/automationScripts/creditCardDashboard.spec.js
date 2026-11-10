const { test, expect } = require('@playwright/test');
const { CreditCardDashboardPage } = require('./pages/creditCardDashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

// Test Suite for QE-9418 - Monthly Spending Trend Visualization
test.describe('Monthly Spending Trend Visualization', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new CreditCardDashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9418 TS-001 TC-001 - Verify 12-month spending trend chart display', async ({ page }) => {
    // Step 1: Launch application
    await expect(page).toHaveURL(/.*creditcard/);
    
    // Step 2: Login with valid credentials
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 3: Navigate to spending analytics section
    await dashboardPage.navigateToSpendingAnalytics();
    await expect(dashboardPage.analyticsHeader).toBeVisible();
    
    // Step 4: Verify interactive chart is displayed
    await expect(dashboardPage.monthlyTrendChart).toBeVisible();
    await expect(dashboardPage.chartXAxis).toContainText('months');
    await expect(dashboardPage.chartYAxis).toContainText('spending');
    
    // Step 5: Verify 12 months of data points
    const dataPoints = await dashboardPage.getChartDataPoints();
    expect(dataPoints.length).toBe(12);
    for (const month of testData.expectedMonths) {
      expect(dataPoints).toContain(month);
    }
  });

  test('QE-9418 TS-002 TC-001 - Verify limited history message for new users', async ({ page }) => {
    // Step 1: Launch application
    await expect(page).toHaveURL(/.*creditcard/);
    
    // Step 2: Login with new user credentials
    await loginPage.login(testData.users.newuser.username, testData.users.newuser.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 3: Navigate to spending analytics
    await dashboardPage.navigateToSpendingAnalytics();
    await expect(dashboardPage.analyticsHeader).toBeVisible();
    
    // Step 4: Verify only 6 months of data displayed
    const dataPoints = await dashboardPage.getChartDataPoints();
    expect(dataPoints.length).toBe(6);
    
    // Step 5: Verify insufficient data message
    await expect(dashboardPage.insufficientDataMessage).toBeVisible();
    await expect(dashboardPage.insufficientDataMessage).toContainText('Insufficient historical data');
  });

  test('QE-9418 TS-003 TC-001 - Verify chart interaction with hover tooltips', async ({ page }) => {
    // Step 1: Login and navigate to dashboard
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Navigate to spending analytics
    await dashboardPage.navigateToSpendingAnalytics();
    await expect(dashboardPage.monthlyTrendChart).toBeVisible();
    
    // Step 3: Hover over March 2024 data point
    await dashboardPage.hoverOverDataPoint('March 2024');
    await expect(dashboardPage.chartTooltip).toBeVisible();
    await expect(dashboardPage.chartTooltip).toContainText('$1,250.75');
    
    // Step 4: Apply date range filter
    await dashboardPage.applyDateRangeFilter('Jan 2024', 'Jun 2024');
    const filteredPoints = await dashboardPage.getChartDataPoints();
    expect(filteredPoints.length).toBe(6);
    
    // Step 5: Verify spending spike highlighting
    await dashboardPage.clearDateFilter();
    const highlightedMonth = await dashboardPage.getHighlightedSpike();
    expect(highlightedMonth).toBe('December 2024');
    await expect(dashboardPage.spikeIndicator).toContainText('$3,500');
  });

  test('QE-9418 TS-003 TC-002 - Verify custom date range filtering', async ({ page }) => {
    // Step 1: Login with 12 months data user
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Navigate to spending analytics
    await dashboardPage.navigateToSpendingAnalytics();
    const initialPoints = await dashboardPage.getChartDataPoints();
    expect(initialPoints.length).toBe(12);
    
    // Step 3: Apply Q1 2024 filter
    await dashboardPage.applyCustomDateRange('01/01/2024', '03/31/2024');
    const q1Points = await dashboardPage.getChartDataPoints();
    expect(q1Points.length).toBe(3);
    expect(q1Points).toEqual(['January', 'February', 'March']);
    
    // Step 4: Verify tooltip accuracy for Q1 months
    await dashboardPage.hoverOverDataPoint('January');
    await expect(dashboardPage.chartTooltip).toContainText('$1,100');
    await dashboardPage.hoverOverDataPoint('February');
    await expect(dashboardPage.chartTooltip).toContainText('$1,050');
    await dashboardPage.hoverOverDataPoint('March');
    await expect(dashboardPage.chartTooltip).toContainText('$1,250');
    
    // Step 5: Clear filter and verify full view
    await dashboardPage.clearDateFilter();
    const fullPoints = await dashboardPage.getChartDataPoints();
    expect(fullPoints.length).toBe(12);
  });
});

// Test Suite for QE-9417 - Multiple Credit Card Display Interface
test.describe('Multiple Credit Card Display Interface', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new CreditCardDashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9417 TS-001 TC-001 - Verify 5 cards display within 1 second', async ({ page }) => {
    // Step 1: Launch application
    await expect(page).toHaveURL(/.*creditcard/);
    
    // Step 2: Login with multi-card user
    await loginPage.login(testData.users.multicard.username, testData.users.multicard.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 3: Navigate to multi-card interface and measure load time
    const startTime = Date.now();
    await dashboardPage.navigateToMultiCardManagement();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(1000);
    
    // Step 4: Verify all 5 cards are displayed
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(5);
    const cardNames = await dashboardPage.getCardNames();
    expect(cardNames).toEqual(['Card A', 'Card B', 'Card C', 'Card D', 'Card E']);
    
    // Step 5: Verify card details for Card A
    const cardADetails = await dashboardPage.getCardDetails('Card A');
    expect(cardADetails.creditLimit).toBe('$10,000');
    expect(cardADetails.balance).toBe('$2,000');
    expect(cardADetails.available).toBe('$8,000');
    expect(cardADetails.utilization).toBe('20%');
  });

  test('QE-9417 TS-001 TC-002 - Verify 1-second performance requirement', async ({ page }) => {
    // Step 1: Login with 5 linked cards
    await loginPage.login(testData.users.multicard.username, testData.users.multicard.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2 & 3: Measure load time for multi-card interface
    const startTime = Date.now();
    await dashboardPage.navigateToMultiCardManagement();
    await expect(dashboardPage.cardContainer).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(1000);
    
    // Step 4: Verify all card details are accurate
    const allCards = await dashboardPage.getAllCardsData();
    expect(allCards.length).toBe(5);
    for (const card of allCards) {
      expect(card).toHaveProperty('creditLimit');
      expect(card).toHaveProperty('balance');
      expect(card).toHaveProperty('utilization');
    }
  });

  test('QE-9417 TS-002 TC-001 - Verify backend unavailable error handling', async ({ page }) => {
    // Step 1: Login with valid credentials
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Simulate backend unavailability
    await page.route('**/api/cards', route => route.abort('failed'));
    
    // Step 3: Navigate to multi-card interface
    await dashboardPage.navigateToMultiCardManagement();
    
    // Step 4: Verify error message is displayed
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText('Unable to retrieve card data');
    
    // Step 5: Verify Retry button is available
    await expect(dashboardPage.retryButton).toBeVisible();
    await expect(dashboardPage.retryButton).toBeEnabled();
  });

  test('QE-9417 TS-003 TC-001 - Verify accurate financial calculations', async ({ page }) => {
    // Step 1: Login with 5 credit cards
    await loginPage.login(testData.users.multicard.username, testData.users.multicard.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Navigate to multi-card interface
    await dashboardPage.navigateToMultiCardManagement();
    await expect(dashboardPage.cardContainer).toBeVisible();
    
    // Step 3: Verify Card A utilization calculation
    const cardAUtilization = await dashboardPage.getCardUtilization('Card A');
    expect(cardAUtilization).toBe('20%');
    
    // Step 4: Verify Card A available credit calculation
    const cardAAvailable = await dashboardPage.getCardAvailableCredit('Card A');
    expect(cardAAvailable).toBe('$8,000');
    
    // Step 5: Verify all 5 cards have accurate calculations
    const cardBDetails = await dashboardPage.getCardDetails('Card B');
    expect(cardBDetails.utilization).toBe('30%');
    expect(cardBDetails.available).toBe('$10,500');
  });

  test('QE-9417 TS-003 TC-002 - Verify edge case calculations (0% and 100%)', async ({ page }) => {
    // Step 1: Login with edge case user
    await loginPage.login(testData.users.edgecase.username, testData.users.edgecase.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Navigate to multi-card interface
    await dashboardPage.navigateToMultiCardManagement();
    await expect(dashboardPage.cardContainer).toBeVisible();
    
    // Step 3: Verify 0% utilization card
    const cardXDetails = await dashboardPage.getCardDetails('Card X');
    expect(cardXDetails.utilization).toBe('0%');
    expect(cardXDetails.available).toBe('$5,000');
    
    // Step 4: Verify 100% utilization card
    const cardYDetails = await dashboardPage.getCardDetails('Card Y');
    expect(cardYDetails.utilization).toBe('100%');
    expect(cardYDetails.available).toBe('$0');
    
    // Step 5: Verify no display errors
    await expect(dashboardPage.errorMessage).not.toBeVisible();
    await expect(dashboardPage.warningMessage).not.toBeVisible();
  });
});

// Test Suite for QE-9416 - Category-Wise Spending Analysis Dashboard
test.describe('Category-Wise Spending Analysis Dashboard', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new CreditCardDashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9416 TS-001 TC-001 - Verify all 9 categories with visual representations', async ({ page }) => {
    // Step 1: Launch application
    await expect(page).toHaveURL(/.*creditcard/);
    
    // Step 2: Login with valid credentials
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 3: Navigate to category-wise analysis
    await dashboardPage.navigateToCategoryAnalysis();
    await expect(dashboardPage.categoryAnalysisHeader).toBeVisible();
    
    // Step 4: Verify all 9 categories are displayed
    const categories = await dashboardPage.getAllCategories();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expect(categories).toEqual(expectedCategories);
    
    // Step 5: Verify visual representations
    await expect(dashboardPage.categoryPieChart).toBeVisible();
    const foodDiningAmount = await dashboardPage.getCategoryAmount('Food & Dining');
    expect(foodDiningAmount).toBe('$1,200');
    const fuelAmount = await dashboardPage.getCategoryAmount('Fuel');
    expect(fuelAmount).toBe('$800');
  });

  test('QE-9416 TS-002 TC-001 - Verify no transaction history message', async ({ page }) => {
    // Step 1: Login with new user
    await loginPage.login(testData.users.newuser.username, testData.users.newuser.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Navigate to category analysis
    await dashboardPage.navigateToCategoryAnalysis();
    await expect(dashboardPage.categoryAnalysisHeader).toBeVisible();
    
    // Step 3: Verify no data message
    await expect(dashboardPage.noDataMessage).toBeVisible();
    await expect(dashboardPage.noDataMessage).toContainText('No spending data available');
    
    // Step 4: Verify all categories show $0.00
    const categories = await dashboardPage.getAllCategories();
    for (const category of categories) {
      const amount = await dashboardPage.getCategoryAmount(category);
      expect(amount).toBe('$0.00');
    }
    
    // Step 5: Verify empty chart state
    await expect(dashboardPage.categoryPieChart).toBeVisible();
    const chartSegments = await dashboardPage.getChartSegments();
    expect(chartSegments.length).toBe(0);
  });

  test('QE-9416 TS-003 TC-001 - Verify accurate category calculations totaling $5,000', async ({ page }) => {
    // Step 1: Login with user having $5,000 spending
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Navigate to category analysis
    await dashboardPage.navigateToCategoryAnalysis();
    await expect(dashboardPage.categoryAnalysisHeader).toBeVisible();
    
    // Step 3: Verify each category displays amount and percentage
    const categoryData = await dashboardPage.getAllCategoryData();
    expect(categoryData['Food & Dining']).toEqual({ amount: '$1,500', percentage: '30%' });
    expect(categoryData['Fuel']).toEqual({ amount: '$800', percentage: '16%' });
    expect(categoryData['Shopping']).toEqual({ amount: '$1,200', percentage: '24%' });
    
    // Step 4: Calculate sum of all categories
    const totalSpending = await dashboardPage.calculateTotalFromCategories();
    expect(totalSpending).toBe(5000);
    
    // Step 5: Verify displayed total matches sum
    const displayedTotal = await dashboardPage.getTotalSpending();
    expect(displayedTotal).toBe('$5,000');
  });

  test('QE-9416 TS-003 TC-002 - Verify percentages sum to 100%', async ({ page }) => {
    // Step 1: Login with categorized transactions
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Navigate to category analysis
    await dashboardPage.navigateToCategoryAnalysis();
    await expect(dashboardPage.categoryAnalysisHeader).toBeVisible();
    
    // Step 3: Verify Food & Dining percentage
    const foodPercentage = await dashboardPage.getCategoryPercentage('Food & Dining');
    expect(foodPercentage).toBe('30%');
    
    // Step 4: Verify all category percentages
    const allPercentages = await dashboardPage.getAllCategoryPercentages();
    expect(allPercentages['Fuel']).toBe('16%');
    expect(allPercentages['Shopping']).toBe('24%');
    expect(allPercentages['Travel']).toBe('12%');
    expect(allPercentages['Entertainment']).toBe('8%');
    expect(allPercentages['Utilities']).toBe('6%');
    expect(allPercentages['Healthcare']).toBe('2%');
    expect(allPercentages['Education']).toBe('1%');
    expect(allPercentages['Miscellaneous']).toBe('1%');
    
    // Step 5: Verify sum equals 100%
    const totalPercentage = await dashboardPage.calculateTotalPercentage();
    expect(totalPercentage).toBe(100);
  });
});

// Test Suite for QE-9415 - Consolidated Credit Card KPI Dashboard
test.describe('Consolidated Credit Card KPI Dashboard', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new CreditCardDashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9415 TS-001 TC-001 - Verify KPI dashboard loads within 2 seconds', async ({ page }) => {
    // Step 1: Launch application
    await expect(page).toHaveURL(/.*creditcard/);
    
    // Step 2: Login with multi-card user
    await loginPage.login(testData.users.multicard.username, testData.users.multicard.password);
    
    // Step 3: Measure dashboard load time
    const startTime = Date.now();
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    // Step 4: Verify all KPIs are displayed
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    // Step 5: Verify accurate aggregated data
    const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    expect(totalCreditLimit).toBe('$50,000');
  });

  test('QE-9415 TS-002 TC-001 - Verify no cards linked message', async ({ page }) => {
    // Step 1: Login with no-card user
    await loginPage.login(testData.users.nocard.username, testData.users.nocard.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Attempt to access KPI dashboard
    await expect(dashboardPage.kpiContainer).toBeVisible();
    
    // Step 3: Verify no data message
    await expect(dashboardPage.noCardDataMessage).toBeVisible();
    await expect(dashboardPage.noCardDataMessage).toContainText('No credit card data available');
    
    // Step 4: Verify Link Credit Card button
    await expect(dashboardPage.linkCardButton).toBeVisible();
    await expect(dashboardPage.linkCardButton).toBeEnabled();
    
    // Step 5: Verify all KPIs show zero
    expect(await dashboardPage.getKPIValue('Monthly Spend')).toBe('$0.00');
    expect(await dashboardPage.getKPIValue('Total Credit Limit')).toBe('$0.00');
    expect(await dashboardPage.getKPIValue('Available Credit')).toBe('$0.00');
    expect(await dashboardPage.getKPIValue('Outstanding Amounts')).toBe('$0.00');
  });

  test('QE-9415 TS-003 TC-001 - Verify accurate KPI aggregation for 5 cards', async ({ page }) => {
    // Step 1: Login with 5 linked cards
    await loginPage.login(testData.users.multicard.username, testData.users.multicard.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Access KPI dashboard
    await expect(dashboardPage.kpiContainer).toBeVisible();
    
    // Step 3: Verify Monthly Spend aggregation
    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    expect(monthlySpend).toBe('$3,000');
    
    // Step 4: Verify Total Credit Limit
    const totalLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    expect(totalLimit).toBe('$50,000');
    
    // Step 5: Verify Available Credit
    const availableCredit = await dashboardPage.getKPIValue('Available Credit');
    expect(availableCredit).toBe('$38,500');
    
    // Step 6: Verify Outstanding Amount
    const outstanding = await dashboardPage.getKPIValue('Outstanding Amounts');
    expect(outstanding).toBe('$11,500');
  });

  test('QE-9415 TS-003 TC-002 - Verify dynamic KPI updates after transaction', async ({ page }) => {
    // Step 1: Login with 5 linked cards
    await loginPage.login(testData.users.multicard.username, testData.users.multicard.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Note initial KPI values
    const initialOutstanding = await dashboardPage.getKPIValue('Outstanding Amounts');
    expect(initialOutstanding).toBe('$11,500');
    const initialAvailable = await dashboardPage.getKPIValue('Available Credit');
    expect(initialAvailable).toBe('$38,500');
    
    // Step 3: Simulate new transaction
    await dashboardPage.simulateTransaction('Card 1', 200);
    
    // Step 4: Refresh dashboard
    await dashboardPage.refreshDashboard();
    await expect(dashboardPage.kpiContainer).toBeVisible();
    
    // Step 5: Verify Outstanding Amount updated
    const newOutstanding = await dashboardPage.getKPIValue('Outstanding Amounts');
    expect(newOutstanding).toBe('$11,700');
    
    // Step 6: Verify Available Credit recalculated
    const newAvailable = await dashboardPage.getKPIValue('Available Credit');
    expect(newAvailable).toBe('$38,300');
  });
});

// Test Suite for QE-9414 - Card-Wise Spending Comparison Tool
test.describe('Card-Wise Spending Comparison Tool', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new CreditCardDashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9414 TS-001 TC-001 - Verify side-by-side card comparison', async ({ page }) => {
    // Step 1: Launch application
    await expect(page).toHaveURL(/.*creditcard/);
    
    // Step 2: Login with multi-card user
    await loginPage.login(testData.users.multicard.username, testData.users.multicard.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 3: Navigate to card comparison
    await dashboardPage.navigateToCardComparison();
    await expect(dashboardPage.comparisonHeader).toBeVisible();
    
    // Step 4: Verify side-by-side analysis
    await expect(dashboardPage.comparisonTable).toBeVisible();
    const comparedCards = await dashboardPage.getComparedCards();
    expect(comparedCards).toContain('Card A');
    expect(comparedCards).toContain('Card B');
    expect(comparedCards).toContain('Card C');
    
    // Step 5: Verify optimal card identification
    const optimalForFood = await dashboardPage.getOptimalCardForCategory('Food & Dining');
    expect(optimalForFood).toBe('Card A');
    const optimalForTravel = await dashboardPage.getOptimalCardForCategory('Travel');
    expect(optimalForTravel).toBe('Card B');
  });

  test('QE-9414 TS-002 TC-001 - Verify single card comparison message', async ({ page }) => {
    // Step 1: Login with single card user
    await loginPage.login(testData.users.singlecard.username, testData.users.singlecard.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Navigate to card comparison
    await dashboardPage.navigateToCardComparison();
    await expect(dashboardPage.comparisonHeader).toBeVisible();
    
    // Step 3: Verify comparison requirement message
    await expect(dashboardPage.comparisonRequirementMessage).toBeVisible();
    await expect(dashboardPage.comparisonRequirementMessage).toContainText('requires at least two credit cards');
    
    // Step 4: Verify single-card analysis displayed
    await expect(dashboardPage.singleCardAnalysis).toBeVisible();
    await expect(dashboardPage.comparisonTable).not.toBeVisible();
  });

  test('QE-9414 TS-003 TC-001 - Verify accurate utilization calculations and highlights', async ({ page }) => {
    // Step 1: Login with three-card user
    await loginPage.login(testData.users.threecard.username, testData.users.threecard.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Navigate to card comparison
    await dashboardPage.navigateToCardComparison();
    await expect(dashboardPage.comparisonTable).toBeVisible();
    
    // Step 3: Verify utilization percentages
    expect(await dashboardPage.getCardUtilizationInComparison('Card A')).toBe('20%');
    expect(await dashboardPage.getCardUtilizationInComparison('Card B')).toBe('50%');
    expect(await dashboardPage.getCardUtilizationInComparison('Card C')).toBe('80%');
    
    // Step 4: Verify highest utilization highlight
    const highestCard = await dashboardPage.getHighlightedCard('highest');
    expect(highestCard).toBe('Card C');
    await expect(dashboardPage.highestUtilizationBadge).toContainText('80%');
    
    // Step 5: Verify lowest utilization highlight
    const lowestCard = await dashboardPage.getHighlightedCard('lowest');
    expect(lowestCard).toBe('Card A');
    await expect(dashboardPage.lowestUtilizationBadge).toContainText('20%');
    
    // Step 6: Verify category breakdowns
    const cardACategoryBreakdown = await dashboardPage.getCategoryBreakdown('Card A');
    expect(cardACategoryBreakdown['Food & Dining']).toBe('$500');
    expect(cardACategoryBreakdown['Fuel']).toBe('$300');
  });

  test('QE-9414 TS-003 TC-002 - Verify dynamic comparison updates', async ({ page }) => {
    // Step 1: Login with three cards
    await loginPage.login(testData.users.threecard.username, testData.users.threecard.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 2: Navigate and note initial rates
    await dashboardPage.navigateToCardComparison();
    const initialCardAUtilization = await dashboardPage.getCardUtilizationInComparison('Card A');
    expect(initialCardAUtilization).toBe('20%');
    
    // Step 3: Simulate transaction on Card A
    await dashboardPage.simulateTransaction('Card A', 1000);
    
    // Step 4: Refresh comparison view
    await dashboardPage.refreshComparison();
    await expect(dashboardPage.comparisonTable).toBeVisible();
    
    // Step 5: Verify Card A utilization recalculated
    const newCardAUtilization = await dashboardPage.getCardUtilizationInComparison('Card A');
    expect(newCardAUtilization).toBe('30%');
    
    // Step 6: Verify highlights remain accurate
    const highestCard = await dashboardPage.getHighlightedCard('highest');
    expect(highestCard).toBe('Card C');
    const lowestCard = await dashboardPage.getHighlightedCard('lowest');
    expect(lowestCard).toBe('Card A');
  });
});

// Test Suite for QE-9410 - Responsive Multi-Device Dashboard Access
test.describe('Responsive Multi-Device Dashboard Access', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new CreditCardDashboardPage(page);
  });

  test('QE-9410 TS-001 TC-001 - Verify mobile responsive layout', async ({ page, context }) => {
    // Step 1: Set mobile viewport
    await context.setViewportSize({ width: 375, height: 812 });
    await loginPage.navigate();
    await expect(page).toHaveURL(/.*creditcard/);
    
    // Step 2: Login with valid credentials
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 3: Verify responsive layout
    const viewportWidth = await page.viewportSize().width;
    expect(viewportWidth).toBe(375);
    await expect(dashboardPage.mobileLayout).toBeVisible();
    
    // Step 4: Verify KPIs in mobile layout
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const kpiLayout = await dashboardPage.getKPILayout();
    expect(kpiLayout).toBe('vertical');
    
    // Step 5: Verify last update timestamp
    await expect(dashboardPage.lastUpdateTimestamp).toBeVisible();
    const timestamp = await dashboardPage.getLastUpdateTimestamp();
    expect(timestamp).toMatch(/Last updated:/);
  });

  test('QE-9410 TS-002 TC-001 - Verify tablet responsive layout within 2 seconds', async ({ page, context }) => {
    // Step 1: Set tablet viewport
    await context.setViewportSize({ width: 1024, height: 1366 });
    await loginPage.navigate();
    await expect(page).toHaveURL(/.*creditcard/);
    
    // Step 2: Login and measure load time
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    const startTime = Date.now();
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    // Step 3: Verify load time within 2 seconds
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    // Step 4: Verify tablet-optimized layout
    await expect(dashboardPage.tabletLayout).toBeVisible();
    const kpiLayout = await dashboardPage.getKPILayout();
    expect(kpiLayout).toBe('grid');
    
    // Step 5: Verify data accuracy and readability
    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    expect(monthlySpend).toMatch(/^\$[0-9,]+\.\d{2}$/);
    await expect(dashboardPage.kpiContainer).toBeVisible();
    const isOverlapping = await dashboardPage.checkForOverlappingContent();
    expect(isOverlapping).toBe(false);
  });

  test('QE-9410 TS-003 TC-001 - Verify extremely small screen handling', async ({ page, context }) => {
    // Step 1: Set extremely small viewport
    await context.setViewportSize({ width: 320, height: 480 });
    await loginPage.navigate();
    await expect(page).toHaveURL(/.*creditcard/);
    
    // Step 2: Login with valid credentials
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    
    // Step 3: Verify warning message
    await expect(dashboardPage.screenSizeWarning).toBeVisible();
    await expect(dashboardPage.screenSizeWarning).toContainText('screen resolution is below the minimum');
    
    // Step 4: Verify graceful degradation with scrollable content
    const isScrollable = await dashboardPage.isContentScrollable();
    expect(isScrollable).toBe(true);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    
    // Step 5: Verify no critical functionality broken
    await expect(dashboardPage.kpiContainer).toBeVisible();
    const canNavigate = await dashboardPage.canNavigateToAnalytics();
    expect(canNavigate).toBe(true);
  });
});