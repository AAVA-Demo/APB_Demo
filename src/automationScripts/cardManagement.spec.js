const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardManagementPage } = require('./pages/cardManagement.page');
const logger = require('../utils/logger');

test.describe('Card Management Tests', () => {
  let loginPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@demo.com', 'Test@1234');
    logger.info('User logged in successfully');
  });

  test('TC-6160: Verify spending totals and utilization percentage for each card', async ({ page }) => {
    logger.info('Test Case ID: 6160 - Verify spending totals and utilization percentage are displayed for each card');
    
    // Step 1: User authenticated (done in beforeEach)
    
    // Step 2: Navigate to card management page
    await cardManagementPage.navigate();
    logger.info('Navigated to card management page');
    
    // Step 3: Verify spending totals are displayed for each of 3 cards
    const cards = await cardManagementPage.getAllCards();
    expect(cards.length).toBeGreaterThanOrEqual(3);
    
    const card1Spend = await cardManagementPage.getCardSpend('1234');
    const card2Spend = await cardManagementPage.getCardSpend('5678');
    const card3Spend = await cardManagementPage.getCardSpend('9012');
    
    expect(card1Spend).toBeTruthy();
    expect(card2Spend).toBeTruthy();
    expect(card3Spend).toBeTruthy();
    logger.info(`Card spending verified: Card1=$${card1Spend}, Card2=$${card2Spend}, Card3=$${card3Spend}`);
    
    // Step 4: Verify utilization percentage is calculated and displayed
    const card1Utilization = await cardManagementPage.getCardUtilization('1234');
    const card2Utilization = await cardManagementPage.getCardUtilization('5678');
    const card3Utilization = await cardManagementPage.getCardUtilization('9012');
    
    expect(card1Utilization).toMatch(/%$/);
    expect(card2Utilization).toMatch(/%$/);
    expect(card3Utilization).toMatch(/%$/);
    logger.info(`Utilization verified: Card1=${card1Utilization}, Card2=${card2Utilization}, Card3=${card3Utilization}`);
    
    // Step 5: Verify portfolio summary displays total spending
    await expect(cardManagementPage.portfolioSummary).toBeVisible();
    const totalOutstanding = await cardManagementPage.getTotalOutstanding();
    expect(totalOutstanding).toBeTruthy();
    logger.info(`Portfolio Summary Total Outstanding: $${totalOutstanding}`);
  });

  test('TC-6161: Verify no spending data message for cards with zero transactions', async ({ page }) => {
    logger.info('Test Case ID: 6161 - Verify no spending data available message for cards with zero transactions');
    
    // Step 1: User authenticated
    
    // Step 2: Navigate to card management page
    await cardManagementPage.navigate();
    
    // Step 3: Identify cards with zero transactions
    const cards = await cardManagementPage.getAllCards();
    logger.info(`Total cards found: ${cards.length}`);
    
    // Step 4: Verify 'No spending data available' message for cards with zero spend
    const zeroSpendCards = await cardManagementPage.getCardsWithZeroSpend();
    if (zeroSpendCards.length > 0) {
      for (const cardNumber of zeroSpendCards) {
        const message = await cardManagementPage.getNoSpendingDataMessage(cardNumber);
        expect(message).toContain('No spending data available');
        logger.info(`No spending data message verified for card ending ${cardNumber}`);
      }
    }
    
    // Step 5: Verify cards with transactions display spending analysis correctly
    const cardsWithSpend = await cardManagementPage.getCardsWithSpend();
    expect(cardsWithSpend.length).toBeGreaterThan(0);
    
    for (const cardNumber of cardsWithSpend) {
      const spend = await cardManagementPage.getCardSpend(cardNumber);
      const utilization = await cardManagementPage.getCardUtilization(cardNumber);
      expect(spend).toBeTruthy();
      expect(utilization).toMatch(/%$/);
      logger.info(`Card ${cardNumber}: Spend=$${spend}, Utilization=${utilization}`);
    }
  });

  test('TC-6162: Verify cards are reordered when sorted by spending amount', async ({ page }) => {
    logger.info('Test Case ID: 6162 - Verify cards are reordered when sorted by highest to lowest spending');
    
    // Step 1: User authenticated
    
    // Step 2: Navigate to card management page
    await cardManagementPage.navigate();
    const initialOrder = await cardManagementPage.getCardOrder();
    logger.info(`Initial card order: ${initialOrder.join(', ')}`);
    
    // Step 3: Click on 'Sort by Card Spend' button
    await cardManagementPage.clickSortBySpend();
    logger.info('Clicked Sort by Card Spend button');
    
    // Step 4: Verify card order after sorting
    await page.waitForTimeout(500); // Wait for sorting animation
    const sortedOrder = await cardManagementPage.getCardOrder();
    logger.info(`Sorted card order: ${sortedOrder.join(', ')}`);
    
    // Verify order has changed
    expect(sortedOrder).not.toEqual(initialOrder);
    
    // Step 5: Verify the most-used card (highest spend) is displayed at the top
    const firstCard = sortedOrder[0];
    const firstCardSpend = await cardManagementPage.getCardSpend(firstCard);
    logger.info(`First card after sorting: ${firstCard} with spend $${firstCardSpend}`);
    
    // Verify first card has highest or equal spend compared to second card
    if (sortedOrder.length > 1) {
      const secondCardSpend = await cardManagementPage.getCardSpend(sortedOrder[1]);
      const firstSpendNum = parseFloat(firstCardSpend.replace(/[^0-9.]/g, ''));
      const secondSpendNum = parseFloat(secondCardSpend.replace(/[^0-9.]/g, ''));
      expect(firstSpendNum).toBeGreaterThanOrEqual(secondSpendNum);
      logger.info('Most-used card is displayed at the top');
    }
  });

  test('TC-6172: Verify all registered credit cards displayed within 1 second', async ({ page }) => {
    logger.info('Test Case ID: 6172 - Verify all registered credit cards with complete details are displayed within 1 second');
    
    // Step 1: User authenticated
    
    // Step 2: Navigate to card management page and measure load time
    const startTime = Date.now();
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardsLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(1000);
    logger.info(`Card management page loaded in ${loadTime}ms`);
    
    // Step 3: Verify all 5 registered credit cards are displayed
    const cards = await cardManagementPage.getAllCards();
    expect(cards.length).toBe(5);
    logger.info(`Found ${cards.length} credit cards`);
    
    // Step 4: Verify complete details are displayed for each card
    for (const card of cards) {
      const cardNumber = await card.locator('.card-number').textContent();
      const cardType = await card.locator('.card-type').textContent();
      const creditLimit = await card.locator('.credit-limit').textContent();
      const availableCredit = await card.locator('.available-credit').textContent();
      const outstanding = await card.locator('.outstanding-balance').textContent();
      const spend = await card.locator('.card-spend').textContent();
      
      expect(cardNumber).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
      expect(cardType).toBeTruthy();
      expect(creditLimit).toMatch(/\$/);
      expect(availableCredit).toMatch(/\$/);
      expect(outstanding).toMatch(/\$/);
      expect(spend).toMatch(/\$/);
      
      logger.info(`Card verified: ${cardType} ${cardNumber}`);
    }
    
    // Step 5: Verify portfolio summary displays aggregated totals
    await expect(cardManagementPage.portfolioSummary).toBeVisible();
    const totalCreditLimit = await cardManagementPage.getTotalCreditLimit();
    const totalAvailable = await cardManagementPage.getTotalAvailable();
    const totalOutstanding = await cardManagementPage.getTotalOutstanding();
    
    expect(totalCreditLimit).toMatch(/\$/);
    expect(totalAvailable).toMatch(/\$/);
    expect(totalOutstanding).toMatch(/\$/);
    logger.info(`Portfolio Summary: Limit=${totalCreditLimit}, Available=${totalAvailable}, Outstanding=${totalOutstanding}`);
  });

  test('TC-6173: Verify session expired error with invalid authentication token', async ({ page }) => {
    logger.info('Test Case ID: 6173 - Verify session expired error is displayed with invalid authentication token');
    
    // Step 1: User authenticated and receives valid auth token
    await cardManagementPage.navigate();
    await expect(cardManagementPage.cardListContainer).toBeVisible();
    logger.info('User authenticated with valid token');
    
    // Step 2: Simulate token expiration by clearing localStorage
    await page.evaluate(() => {
      localStorage.removeItem('authToken');
    });
    logger.info('Auth token removed from localStorage');
    
    // Step 3: Attempt to navigate to card management page
    await page.reload();
    
    // Step 4: Verify 'Session expired. Please login again.' error message
    await expect(cardManagementPage.sessionExpiredError).toBeVisible({ timeout: 5000 });
    await expect(cardManagementPage.sessionExpiredError).toContainText('Session expired');
    logger.info('Session expired error message verified');
    
    // Step 5: Verify user is redirected to login page or prompted to re-authenticate
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    const isLoginPage = currentUrl.includes('/login') || currentUrl.includes('/auth');
    expect(isLoginPage || await loginPage.usernameInput.isVisible()).toBeTruthy();
    logger.info('User redirected to login page or authentication modal appeared');
  });

  test('TC-6174: Verify partial card list with error indicator when service fails', async ({ page }) => {
    logger.info('Test Case ID: 6174 - Verify partial card list is displayed with error indicator when card data retrieval fails');
    
    // Step 1: User authenticated
    
    // Step 2: Simulate partial service failure
    await page.route('**/api/cards/card4', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });
    await page.route('**/api/cards/card5', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });
    logger.info('Mock API configured to return 500 error for card4 and card5');
    
    // Step 3: Navigate to card management page
    await cardManagementPage.navigate();
    
    // Step 4: Verify successfully loaded cards are displayed
    const visibleCards = await cardManagementPage.getAllCards();
    expect(visibleCards.length).toBe(3);
    logger.info(`${visibleCards.length} cards displayed successfully`);
    
    // Verify specific cards are visible
    await expect(cardManagementPage.getCardByNumber('1234')).toBeVisible();
    await expect(cardManagementPage.getCardByNumber('5678')).toBeVisible();
    await expect(cardManagementPage.getCardByNumber('9012')).toBeVisible();
    logger.info('Cards 1234, 5678, and 9012 verified visible');
    
    // Step 5: Verify error indicator and warning message are displayed
    await expect(cardManagementPage.errorIndicator).toBeVisible();
    await expect(cardManagementPage.warningMessage).toBeVisible();
    await expect(cardManagementPage.warningMessage).toContainText('Some card details could not be loaded');
    await expect(cardManagementPage.warningMessage).toContainText('Showing 3 of 5 cards');
    logger.info('Error indicator and warning message verified');
  });
});
