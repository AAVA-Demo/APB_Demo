const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { PortfolioPage } = require('./pages/portfolio.page');

// Test Case: QE-9868 TS-001 TC-001
test('QE-9868 TS-001 TC-001 - Verify portfolio page displays all 5 registered credit cards with masked numbers within 1 second', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Log in with user who has 5 registered credit cards
  await loginPage.login('testuser_5cards', 'Test@123');

  // Step 3: Navigate to portfolio management page
  await portfolioPage.navigateToPortfolio();
  await expect(page).toHaveURL(/portfolio/);

  // Step 4: Verify all 5 cards are displayed with masked numbers
  const cardCount = await portfolioPage.getCardCount();
  expect(cardCount).toBe(5);
  const cardNumbers = await portfolioPage.getAllCardNumbers();
  expect(cardNumbers).toContain('****1234');
  expect(cardNumbers).toContain('****5678');
  expect(cardNumbers).toContain('****9012');
  expect(cardNumbers).toContain('****3456');
  expect(cardNumbers).toContain('****7890');

  // Step 5: Verify individual credit limits, balances, and card types
  const card1Details = await portfolioPage.getCardDetails('****1234');
  expect(card1Details.type).toBe('Visa');
  expect(card1Details.creditLimit).toBe('$10,000.00');
  expect(card1Details.currentBalance).toBe('$2,500.00');

  // Step 6: Verify page loads within 1 second
  const loadTime = await portfolioPage.getPageLoadTime();
  expect(loadTime).toBeLessThanOrEqual(1000);
});

// Test Case: QE-9868 TS-002 TC-001
test('QE-9868 TS-002 TC-001 - Verify portfolio page displays only first 10 cards with notification when user has 15 cards', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Log in with user who has 15 registered credit cards
  await loginPage.login('testuser_15cards', 'Test@123');

  // Step 3: Navigate to portfolio management page
  await portfolioPage.navigateToPortfolio();

  // Step 4: Verify only first 10 cards are displayed
  const cardCount = await portfolioPage.getCardCount();
  expect(cardCount).toBe(10);
  const cardNumbers = await portfolioPage.getAllCardNumbers();
  expect(cardNumbers).toContain('****1234');
  expect(cardNumbers).toContain('****5555');

  // Step 5: Verify notification is displayed
  await expect(portfolioPage.displayLimitNotification).toBeVisible();
  await expect(portfolioPage.displayLimitNotification).toContainText('Display limit reached. Showing 10 of 15 credit cards');

  // Step 6: Verify remaining 5 cards are not displayed
  const allCardNumbers = await portfolioPage.getAllCardNumbers();
  expect(allCardNumbers).not.toContain('****6666');
  expect(allCardNumbers).not.toContain('****0123');
});

// Test Case: QE-9868 TS-003 TC-001
test('QE-9868 TS-003 TC-001 - Verify portfolio page displays error message when data source is unavailable', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Log in with valid credentials
  await loginPage.login('testuser_valid', 'Test@123');

  // Step 3: Simulate data source unavailability (using test flag in URL)
  await portfolioPage.navigateToPortfolioWithTestFlag('data_source_unavailable=true');

  // Step 4: Portfolio page attempts to load
  await page.waitForLoadState('networkidle');

  // Step 5: Verify clear error message is displayed
  await expect(portfolioPage.serviceUnavailableError).toBeVisible();
  await expect(portfolioPage.serviceUnavailableError).toContainText('Credit card data service is temporarily unavailable');

  // Step 6: Verify no partial or corrupted card data is displayed
  const cardCount = await portfolioPage.getCardCount();
  expect(cardCount).toBe(0);
  const hasCorruptedUI = await portfolioPage.checkForCorruptedUI();
  expect(hasCorruptedUI).toBe(false);
});

// Test Case: QE-9869 TS-001 TC-001
test('QE-9869 TS-001 TC-001 - Verify card-wise spend analysis displays trends for 3 cards with comparative bar charts', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Log in with user who has transactions on 3 cards
  await loginPage.login('testuser_3cards', 'Test@123');

  // Step 3: Navigate to Portfolio and select card-wise spend analysis
  await portfolioPage.navigateToPortfolio();
  await portfolioPage.selectCardWiseSpendAnalysis();

  // Step 4: Verify monthly spend trends for each of 3 cards
  const card1Spend = await portfolioPage.getCardMonthlySpend('****1234');
  expect(card1Spend).toBe('$1,200.00');
  const card2Spend = await portfolioPage.getCardMonthlySpend('****5678');
  expect(card2Spend).toBe('$2,100.00');
  const card3Spend = await portfolioPage.getCardMonthlySpend('****9012');
  expect(card3Spend).toBe('$800.00');

  // Step 5: Verify comparative bar charts show highest utilization
  await expect(portfolioPage.utilizationChart).toBeVisible();
  const card1Utilization = await portfolioPage.getCardUtilization('****1234');
  expect(card1Utilization).toBe('12%');
  const card2Utilization = await portfolioPage.getCardUtilization('****5678');
  expect(card2Utilization).toBe('14%');
  const highestUtilizationCard = await portfolioPage.getHighestUtilizationCard();
  expect(highestUtilizationCard).toBe('****5678');
});

// Test Case: QE-9869 TS-002 TC-001
test('QE-9869 TS-002 TC-001 - Verify card-wise spend analysis displays historical trends over 6 months with line graphs', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Log in with user who has transactions over 6 months
  await loginPage.login('testuser_6monthshistory', 'Test@123');

  // Step 3: Navigate to Portfolio and select card-wise spend analysis
  await portfolioPage.navigateToPortfolio();
  await portfolioPage.selectCardWiseSpendAnalysis();

  // Step 4: Verify historical monthly trends for each card over 6 months
  await expect(portfolioPage.trendLineGraph).toBeVisible();
  const card1Months = await portfolioPage.getCardMonthlyTrends('****1234');
  expect(card1Months.length).toBe(6);
  expect(card1Months[0].month).toBe('Jul');
  expect(card1Months[0].amount).toBe('$1,100.00');

  // Step 5: Verify spending patterns are visible in line graphs
  const card1TrendVisible = await portfolioPage.isCardTrendVisible('****1234');
  expect(card1TrendVisible).toBe(true);

  // Step 6: Verify most utilized card is identified
  const mostUtilizedCard = await portfolioPage.getMostUtilizedCard();
  expect(mostUtilizedCard.cardNumber).toBe('****5678');
  expect(mostUtilizedCard.totalSpend).toBe('$13,250.00');
});

// Test Case: QE-9869 TS-003 TC-001
test('QE-9869 TS-003 TC-001 - Verify card-wise spend analysis displays message when card has no transactions', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Log in with user who has one card with no transactions
  await loginPage.login('testuser_notxn', 'Test@123');

  // Step 3: Navigate to Portfolio and select card-wise spend analysis
  await portfolioPage.navigateToPortfolio();
  await portfolioPage.selectCardWiseSpendAnalysis();

  // Step 4: Verify message indicating no spending activity
  await expect(portfolioPage.noSpendingActivityMessage).toBeVisible();
  await expect(portfolioPage.noSpendingActivityMessage).toContainText('No spending activity for the selected period');

  // Step 5: Verify card is still displayed with zero spend and 0% utilization
  const cardDetails = await portfolioPage.getCardDetails('****1234');
  expect(cardDetails.monthlySpend).toBe('$0.00');
  expect(cardDetails.utilization).toBe('0%');
  expect(cardDetails.creditLimit).toBe('$10,000.00');
});