const { test, expect } = require('@playwright/test');
const { PortfolioPage } = require('./pages/portfolio.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

// Test Case - QE-8341 TS001 TC-001
test('TC-5181: Verify user with 5 credit cards views all cards with individual details', async ({ page }) => {
  logger.info('Starting test: TC-5181');
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await portfolioPage.navigate();
  await portfolioPage.waitForPortfolioLoad();
  
  const cardCount = await portfolioPage.getCardCount();
  expect(cardCount).toBe(5);
  
  const cards = await portfolioPage.getAllCardDetails();
  expect(cards.length).toBe(5);
  
  // Verify each card has required details
  for (const card of cards) {
    expect(card.cardNumber).toBeTruthy();
    expect(card.cardType).toBeTruthy();
    expect(card.issuer).toBeTruthy();
    expect(card.creditLimit).toBeTruthy();
    expect(card.outstandingBalance).toBeTruthy();
  }
  
  logger.info('All 5 cards verified with complete details');
});

// Test Case - QE-8341 TS002 TC-001
test('TC-5182: Verify message when user has more than 10 credit cards', async ({ page }) => {
  logger.info('Starting test: TC-5182');
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Setup user with 12 cards
  await portfolioPage.setupUserWithCards(12);
  
  await portfolioPage.navigate();
  await portfolioPage.waitForPortfolioLoad();
  
  const cardCount = await portfolioPage.getCardCount();
  expect(cardCount).toBe(10);
  
  const message = await portfolioPage.getInfoMessage();
  await expect(message).toContainText('Only first 10 cards displayed');
  await expect(message).toContainText('pagination or filtering');
  
  logger.info('10-card limit scenario verified');
});

// Test Case - QE-8341 TS003 TC-001
test('TC-5183: Verify error message when card repository service is down', async ({ page }) => {
  logger.info('Starting test: TC-5183');
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Simulate service outage
  await page.route('**/api/cards/**', route => route.abort());
  
  await portfolioPage.navigate();
  await portfolioPage.waitForPortfolioLoad();
  
  const errorMessage = await portfolioPage.getErrorMessage();
  await expect(errorMessage).toContainText('credit card data cannot be retrieved');
  
  logger.info('Service outage scenario verified');
});

// Test Case - QE-8322 TS001 TC-001
test('TC-5238: Verify authenticated user views all credit cards with key details', async ({ page }) => {
  logger.info('Starting test: TC-5238');
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await portfolioPage.navigate();
  await portfolioPage.waitForPortfolioLoad();
  
  const cards = await portfolioPage.getAllCardDetails();
  expect(cards.length).toBeGreaterThan(0);
  
  for (const card of cards) {
    expect(card.cardName).toBeTruthy();
    expect(card.issuer).toBeTruthy();
    expect(card.cardType).toMatch(/Visa|Mastercard|Amex|Discover/);
  }
  
  logger.info('Credit card portfolio display verified');
});

// Test Case - QE-8322 TS002 TC-001
test('TC-5239: Verify message when user has no credit cards linked', async ({ page }) => {
  logger.info('Starting test: TC-5239');
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user456', 'validPassword');
  
  await portfolioPage.navigate();
  await portfolioPage.waitForPortfolioLoad();
  
  const cardCount = await portfolioPage.getCardCount();
  expect(cardCount).toBe(0);
  
  const message = await portfolioPage.getInfoMessage();
  await expect(message).toContainText('No credit cards are available for display');
  await expect(message).toContainText('add a credit card');
  
  logger.info('No cards scenario verified');
});

// Test Case - QE-8322 TS003 TC-001
test('TC-5240: Verify unauthenticated user is redirected to login page', async ({ page }) => {
  logger.info('Starting test: TC-5240');
  const portfolioPage = new PortfolioPage(page);
  
  await portfolioPage.navigate();
  
  await expect(page).toHaveURL(/.*login/);
  
  const errorMessage = await page.locator('.auth-error-message');
  await expect(errorMessage).toContainText('Authentication required');
  
  logger.info('Authentication redirect verified');
});

// Test Case - QE-8323 TS001 TC-001
test('TC-5235: Verify aggregated credit metrics calculated correctly across all cards', async ({ page }) => {
  logger.info('Starting test: TC-5235');
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await portfolioPage.setupCreditCards([
    { limit: 5000, outstanding: 1500 },
    { limit: 10000, outstanding: 3000 },
    { limit: 15000, outstanding: 3000 }
  ]);
  
  await portfolioPage.navigate();
  await portfolioPage.waitForPortfolioLoad();
  
  const aggregatedMetrics = await portfolioPage.getAggregatedMetrics();
  expect(aggregatedMetrics.totalCreditLimit).toBe('$30000.00');
  expect(aggregatedMetrics.totalAvailableCredit).toBe('$22500.00');
  expect(aggregatedMetrics.totalOutstandingAmount).toBe('$7500.00');
  
  logger.info('Aggregated metrics verified');
});

// Test Case - QE-8323 TS002 TC-001
test('TC-5236: Verify aggregated metrics when all cards have zero balance', async ({ page }) => {
  logger.info('Starting test: TC-5236');
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await portfolioPage.setupCreditCards([
    { limit: 5000, outstanding: 0 },
    { limit: 10000, outstanding: 0 }
  ]);
  
  await portfolioPage.navigate();
  await portfolioPage.waitForPortfolioLoad();
  
  const aggregatedMetrics = await portfolioPage.getAggregatedMetrics();
  expect(aggregatedMetrics.totalCreditLimit).toBe('$15000.00');
  expect(aggregatedMetrics.totalAvailableCredit).toBe('$15000.00');
  expect(aggregatedMetrics.totalOutstandingAmount).toBe('$0.00');
  
  logger.info('Zero balance scenario verified');
});

// Test Case - QE-8323 TS003 TC-001
test('TC-5237: Verify partial data warning when card data source is unavailable', async ({ page }) => {
  logger.info('Starting test: TC-5237');
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Simulate partial data availability
  await page.route('**/api/cards/card3', route => route.abort());
  
  await portfolioPage.navigate();
  await portfolioPage.waitForPortfolioLoad();
  
  const warningMessage = await portfolioPage.getWarningMessage();
  await expect(warningMessage).toContainText('Partial data');
  await expect(warningMessage).toContainText('one or more card data sources unavailable');
  
  logger.info('Partial data warning verified');
});

// Test Case - QE-8337 TS001 TC-001
test('TC-5193: Verify total credit limit aggregation for 3 cards', async ({ page }) => {
  logger.info('Starting test: TC-5193');
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await portfolioPage.setupCreditCards([
    { limit: 5000 },
    { limit: 10000 },
    { limit: 15000 }
  ]);
  
  await portfolioPage.navigate();
  await portfolioPage.waitForPortfolioLoad();
  
  const totalCreditLimit = await portfolioPage.getTotalCreditLimit();
  expect(totalCreditLimit).toBe('$30000.00');
  
  logger.info('Total credit limit aggregation verified');
});

// Test Case - QE-8337 TS002 TC-001
test('TC-5194: Verify zero credit limit display with clarification message', async ({ page }) => {
  logger.info('Starting test: TC-5194');
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await portfolioPage.setupCreditCards([
    { limit: 0, type: 'prepaid' },
    { limit: 0, type: 'prepaid' }
  ]);
  
  await portfolioPage.navigate();
  await portfolioPage.waitForPortfolioLoad();
  
  const totalCreditLimit = await portfolioPage.getTotalCreditLimit();
  expect(totalCreditLimit).toBe('$0.00');
  
  const message = await portfolioPage.getInfoMessage();
  await expect(message).toContainText('Prepaid cards or cards with zero credit limits');
  
  logger.info('Zero credit limit scenario verified');
});

// Test Case - QE-8337 TS003 TC-001
test('TC-5195: Verify partial aggregation warning with invalid card data', async ({ page }) => {
  logger.info('Starting test: TC-5195');
  const loginPage = new LoginPage(page);
  const portfolioPage = new PortfolioPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await portfolioPage.setupCreditCards([
    { limit: 5000 },
    { limit: null },
    { limit: 10000 }
  ]);
  
  await portfolioPage.navigate();
  await portfolioPage.waitForPortfolioLoad();
  
  const totalCreditLimit = await portfolioPage.getTotalCreditLimit();
  expect(totalCreditLimit).toBe('$15000.00');
  
  const warningMessage = await portfolioPage.getWarningMessage();
  await expect(warningMessage).toContainText('Partial aggregation');
  await expect(warningMessage).toContainText('one or more cards excluded due to invalid data');
  
  logger.info('Invalid card data scenario verified');
});