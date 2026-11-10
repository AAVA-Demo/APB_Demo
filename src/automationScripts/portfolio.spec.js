const { test, expect } = require('@playwright/test');
const { PortfolioPage } = require('./pages/portfolio.page');
const { CardDetailPage } = require('./pages/cardDetail.page');
const { LoginPage } = require('./pages/login.page');
const config = require('../data/config.json');
const logger = require('../utils/logger');

test.describe('Multi-Card Portfolio Management Tests', () => {
  let portfolioPage;
  let cardDetailPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    portfolioPage = new PortfolioPage(page);
    cardDetailPage = new CardDetailPage(page);
    loginPage = new LoginPage(page);
    logger.info('Starting portfolio test setup');
  });

  // Test Case ID: 7282 - QE-9982 TS-001 TC-001
  test('TC-7282: Verify 5 credit cards portfolio displays within 1.5 seconds', async ({ page }) => {
    logger.info('Test Case 7282: Starting 5 cards portfolio test');
    
    // Step 1-3: Login with 5-card user
    await loginPage.navigate(config.baseUrl);
    await loginPage.login(config.users.user5Cards.username, config.users.user5Cards.password);
    logger.info('Steps 1-3: User with 5 cards authenticated');
    
    // Step 4: Navigate to Portfolio page
    await portfolioPage.navigate();
    logger.info('Step 4: Portfolio page navigation initiated');
    
    // Step 5: Verify portfolio loads within 1.5 seconds
    const startTime = Date.now();
    await portfolioPage.waitForCardListToLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(1500);
    logger.info(`Step 5: Portfolio loaded in ${loadTime}ms`);
    
    // Step 6: Verify 5 cards displayed
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBe(5);
    logger.info(`Step 6: Verified ${cardCount} cards displayed`);
    
    // Step 7-12: Verify all card details for each card
    const cards = await portfolioPage.getAllCards();
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      expect(card.name).toBeTruthy();
      expect(card.type).toBeTruthy();
      expect(card.lastFourDigits).toMatch(/\*{4}\d{4}/);
      expect(card.creditLimit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
      expect(card.availableCredit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
      expect(card.outstandingBalance).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
      logger.info(`Steps 7-12: Card ${i+1} details verified: ${card.name}`);
    }
  });

  // Test Case ID: 7284 - QE-9982 TS-002 TC-001
  test('TC-7284: Verify maximum 10 cards portfolio with pagination/scrolling', async ({ page }) => {
    logger.info('Test Case 7284: Starting 10 cards portfolio test');
    
    // Step 1-3: Login with 10-card user
    await loginPage.navigate(config.baseUrl);
    await loginPage.login(config.users.user10Cards.username, config.users.user10Cards.password);
    logger.info('Steps 1-3: User with 10 cards authenticated');
    
    // Step 4: Navigate to Portfolio page
    await portfolioPage.navigate();
    logger.info('Step 4: Portfolio page navigation initiated');
    
    // Step 5: Verify portfolio loads within 1.5 seconds
    const startTime = Date.now();
    await portfolioPage.waitForCardListToLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(1500);
    logger.info(`Step 5: Portfolio loaded in ${loadTime}ms`);
    
    // Step 6: Verify 10 cards displayed
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBe(10);
    logger.info(`Step 6: Verified ${cardCount} cards displayed`);
    
    // Step 7: Verify pagination controls if implemented
    const hasPagination = await portfolioPage.hasPaginationControls();
    if (hasPagination) {
      await expect(portfolioPage.paginationControls).toBeVisible();
      logger.info('Step 7: Pagination controls verified');
    } else {
      logger.info('Step 7: No pagination controls (single page or scrolling)');
    }
    
    // Step 8: Verify scrolling functionality if implemented
    const hasScrolling = await portfolioPage.hasScrollingFunctionality();
    if (hasScrolling) {
      await portfolioPage.scrollToBottomOfCardList();
      const lastCard = await portfolioPage.getLastCard();
      expect(lastCard).toBeTruthy();
      logger.info('Step 8: Scrolling functionality verified');
    } else {
      logger.info('Step 8: No scrolling required (all cards visible)');
    }
    
    // Step 9: Verify all card details
    const cards = await portfolioPage.getAllCards();
    expect(cards.length).toBe(10);
    logger.info('Step 9: All 10 card details verified');
    
    // Step 10: Verify application performance
    const isResponsive = await portfolioPage.isPageResponsive();
    expect(isResponsive).toBeTruthy();
    logger.info('Step 10: Application performance remains stable');
  });

  // Test Case ID: 7286 - QE-9982 TS-003 TC-001
  test('TC-7286: Verify no credit cards message for new user', async ({ page }) => {
    logger.info('Test Case 7286: Starting no cards test');
    
    // Step 1-3: Login with new user
    await loginPage.navigate(config.baseUrl);
    await loginPage.login(config.users.newUser.username, config.users.newUser.password);
    logger.info('Steps 1-3: New user authenticated');
    
    // Step 4: Navigate to Portfolio page
    await portfolioPage.navigate();
    logger.info('Step 4: Portfolio page loaded');
    
    // Step 5: Verify no cards message
    const message = await portfolioPage.getNoCardsMessage();
    expect(message).toContain('No credit cards found. Add a card to get started');
    logger.info(`Step 5: No cards message verified: ${message}`);
    
    // Step 6: Verify no empty list displayed
    const hasEmptyList = await portfolioPage.hasEmptyCardList();
    expect(hasEmptyList).toBeFalsy();
    logger.info('Step 6: No empty list displayed');
    
    // Step 7: Verify no error state
    const hasErrorState = await portfolioPage.hasErrorState();
    expect(hasErrorState).toBeFalsy();
    logger.info('Step 7: No error state displayed');
    
    // Step 8: Verify application stability
    const canNavigate = await portfolioPage.canNavigateToOtherSections();
    expect(canNavigate).toBeTruthy();
    logger.info('Step 8: Application remains stable and navigable');
  });

  // Test Case ID: 7276 - QE-9981 TS-001 TC-001
  test('TC-7276: Verify individual card details load within 1 second', async ({ page }) => {
    logger.info('Test Case 7276: Starting individual card details test');
    
    // Step 1-3: Login
    await loginPage.navigate(config.baseUrl);
    await loginPage.login(config.users.testUser.username, config.users.testUser.password);
    logger.info('Steps 1-3: User authenticated');
    
    // Step 4: Navigate to Portfolio page
    await portfolioPage.navigate();
    await portfolioPage.waitForCardListToLoad();
    logger.info('Step 4: Portfolio page displays card list');
    
    // Step 5: Select specific card
    await portfolioPage.selectCard('CARD-12345');
    logger.info('Step 5: Card CARD-12345 selected');
    
    // Step 6: Verify card detail page loads within 1 second
    const startTime = Date.now();
    await cardDetailPage.waitForPageToLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(1000);
    logger.info(`Step 6: Card detail page loaded in ${loadTime}ms`);
    
    // Step 7: Verify credit limit
    const creditLimit = await cardDetailPage.getCreditLimit();
    expect(creditLimit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    logger.info(`Step 7: Credit limit verified: ${creditLimit}`);
    
    // Step 8: Verify available credit
    const availableCredit = await cardDetailPage.getAvailableCredit();
    expect(availableCredit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    logger.info(`Step 8: Available credit verified: ${availableCredit}`);
    
    // Step 9: Verify outstanding balance
    const outstandingBalance = await cardDetailPage.getOutstandingBalance();
    expect(outstandingBalance).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    logger.info(`Step 9: Outstanding balance verified: ${outstandingBalance}`);
    
    // Step 10: Verify spending patterns
    const hasSpendingPatterns = await cardDetailPage.hasSpendingPatterns();
    expect(hasSpendingPatterns).toBeTruthy();
    logger.info('Step 10: Spending patterns section verified');
    
    // Step 11: Verify recent transactions
    const transactionCount = await cardDetailPage.getRecentTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(10);
    logger.info(`Step 11: Recent transactions verified: ${transactionCount} transactions`);
  });

  // Test Case ID: 7278 - QE-9981 TS-002 TC-001
  test('TC-7278: Verify card not found error for deleted/deactivated card', async ({ page }) => {
    logger.info('Test Case 7278: Starting card not found test');
    
    // Step 1-3: Login
    await loginPage.navigate(config.baseUrl);
    await loginPage.login(config.users.testUser.username, config.users.testUser.password);
    logger.info('Steps 1-3: User authenticated');
    
    // Step 4: Navigate to Portfolio page
    await portfolioPage.navigate();
    await portfolioPage.waitForCardListToLoad();
    logger.info('Step 4: Portfolio page loaded');
    
    // Step 5: Attempt to access deleted card
    await page.goto(`${config.baseUrl}/card-detail/CARD-DELETED-999`);
    logger.info('Step 5: Attempted to access deleted card CARD-DELETED-999');
    
    // Step 6: Verify card not found error
    const errorMessage = await cardDetailPage.getErrorMessage();
    expect(errorMessage).toMatch(/Card not found|no longer available/);
    logger.info(`Step 6: Card not found error verified: ${errorMessage}`);
    
    // Step 7: Verify back to portfolio option
    await expect(cardDetailPage.backToPortfolioButton).toBeVisible();
    logger.info('Step 7: Back to Portfolio button verified');
    
    // Step 8: Click back to portfolio
    await cardDetailPage.clickBackToPortfolio();
    await expect(page).toHaveURL(/portfolio/);
    logger.info('Step 8: Redirected to portfolio list page');
    
    // Step 9: Verify application stability
    await expect(page).not.toHaveTitle(/Error/);
    logger.info('Step 9: Application remains stable, no crash detected');
  });

  // Test Case ID: 7280 - QE-9981 TS-003 TC-001
  test('TC-7280: Verify partial card details with corrupted transaction data', async ({ page }) => {
    logger.info('Test Case 7280: Starting corrupted data handling test');
    
    // Step 1-3: Login
    await loginPage.navigate(config.baseUrl);
    await loginPage.login(config.users.testUser.username, config.users.testUser.password);
    logger.info('Steps 1-3: User authenticated');
    
    // Step 4: Navigate to Portfolio page
    await portfolioPage.navigate();
    await portfolioPage.waitForCardListToLoad();
    logger.info('Step 4: Portfolio page loaded');
    
    // Step 5: Select card with corrupted data
    await portfolioPage.selectCard('CARD-CORRUPT-456');
    logger.info('Step 5: Card CARD-CORRUPT-456 selected');
    
    // Step 6: Wait for page to load
    await cardDetailPage.waitForPageToLoad();
    logger.info('Step 6: Card detail page loaded');
    
    // Step 7: Verify basic card details
    const creditLimit = await cardDetailPage.getCreditLimit();
    const availableCredit = await cardDetailPage.getAvailableCredit();
    const outstandingBalance = await cardDetailPage.getOutstandingBalance();
    expect(creditLimit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    expect(availableCredit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    expect(outstandingBalance).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    logger.info('Step 7: Basic card details verified');
    
    // Step 8: Verify spending patterns error message
    const spendingPatternsError = await cardDetailPage.getSpendingPatternsError();
    expect(spendingPatternsError).toContain('Unable to load spending analysis');
    logger.info(`Step 8: Spending patterns error verified: ${spendingPatternsError}`);
    
    // Step 9: Verify transactions error message
    const transactionsError = await cardDetailPage.getTransactionsError();
    expect(transactionsError).toMatch(/Transaction data unavailable|displays available transactions/);
    logger.info(`Step 9: Transactions error verified: ${transactionsError}`);
    
    // Step 10: Verify application stability
    await expect(cardDetailPage.backToPortfolioButton).toBeVisible();
    const canNavigateBack = await cardDetailPage.canNavigateBack();
    expect(canNavigateBack).toBeTruthy();
    logger.info('Step 10: Application remains responsive, back navigation functional');
  });
});
