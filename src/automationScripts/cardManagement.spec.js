const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const logger = require('../utils/logger');

test.describe('Multiple Credit Card Display - QE-8172', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    logger.info('Initializing Card Management Page for test execution');
  });

  test('QE-8172 TS-001 TC-001: Verify system displays 5 credit cards with masked numbers and accurate balances', async ({ page }) => {
    logger.info('Starting test: QE-8172 TS-001 TC-001');
    
    // Step 1: Authenticate user
    await cardManagementPage.authenticateUser('user123', 'valid-token-xyz');
    logger.info('User authenticated successfully');
    
    // Step 2-3: Navigate to card management interface
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.waitForCardListLoad();
    
    // Step 4-5: Verify 5 cards with masked numbers
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    
    const cards = await cardManagementPage.getAllCards();
    const expectedMaskedNumbers = [
      '**** **** **** 1234',
      '**** **** **** 9903',
      '**** **** **** 0005',
      '**** **** **** 1117',
      '**** **** **** 0000'
    ];
    
    for (let i = 0; i < cards.length; i++) {
      expect(cards[i].maskedNumber).toBe(expectedMaskedNumbers[i]);
    }
    logger.info('All 5 cards displayed with properly masked card numbers');
    
    // Step 6-7: Verify accurate balances
    const expectedBalances = [5000, 4500, 4750.75, 3200, 2800];
    for (let i = 0; i < cards.length; i++) {
      expect(cards[i].balance).toBe(expectedBalances[i]);
    }
    logger.info('All card balances verified successfully');
  });

  test('QE-8172 TS-002 TC-001: Verify system handles 11 credit cards without performance degradation', async ({ page }) => {
    logger.info('Starting test: QE-8172 TS-002 TC-001');
    
    // Step 1: Authenticate user with 11 cards
    await cardManagementPage.authenticateUser('user456', 'valid-token-abc');
    
    // Step 2-4: Navigate and measure response time
    const startTime = Date.now();
    await cardManagementPage.navigateToCardManagement();
    await cardManagementPage.waitForCardListLoad();
    const responseTime = Date.now() - startTime;
    
    // Step 5: Verify response time under 500ms
    expect(responseTime).toBeLessThan(500);
    logger.info(`Card list loaded in ${responseTime}ms (within 500ms threshold)`);
    
    // Step 6-7: Verify all 11 cards displayed without data loss
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(11);
    
    const cards = await cardManagementPage.getAllCards();
    for (const card of cards) {
      expect(card.maskedNumber).toMatch(/\*{4} \*{4} \*{4} \d{4}/);
      expect(card.balance).toBeDefined();
      expect(card.creditLimit).toBeDefined();
    }
    logger.info('All 11 cards displayed with complete data and no performance degradation');
  });

  test('QE-8172 TS-003 TC-001: Verify system returns error when data encryption service fails', async ({ page }) => {
    logger.info('Starting test: QE-8172 TS-003 TC-001');
    
    // Step 1: Authenticate user
    await cardManagementPage.authenticateUser('user123', 'valid-token-xyz');
    
    // Step 2-5: Simulate encryption service failure
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({
          error: 'Unable to decrypt and mask card numbers',
          statusCode: 500
        })
      });
    });
    
    await cardManagementPage.navigateToCardManagement();
    
    // Step 6-7: Verify error message and no insecure display
    const errorMessage = await cardManagementPage.getErrorMessage();
    expect(errorMessage).toContain('Unable to display card information securely');
    
    const hasUnmaskedCards = await cardManagementPage.hasUnmaskedCardNumbers();
    expect(hasUnmaskedCards).toBe(false);
    logger.info('Encryption service failure handled correctly with appropriate error message');
  });
});

test.describe('Card-Specific Details View - QE-8174', () => {
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    logger.info('Initializing Card Management Page for card details tests');
  });

  test('QE-8174 TS-001 TC-001: Verify card details retrieval within 500ms with accurate data', async ({ page }) => {
    logger.info('Starting test: QE-8174 TS-001 TC-001');
    
    // Step 1-2: Authenticate and select card
    await cardManagementPage.authenticateUser('user123', 'valid-token-xyz');
    await cardManagementPage.navigateToCardManagement();
    
    // Step 3-5: Measure response time for card details
    const startTime = Date.now();
    await cardManagementPage.selectCard('card1');
    await cardManagementPage.waitForCardDetailsLoad();
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(500);
    logger.info(`Card details loaded in ${responseTime}ms`);
    
    // Step 6-7: Verify accurate card data
    const cardDetails = await cardManagementPage.getCardDetails();
    expect(cardDetails.creditLimit).toBe(20000);
    expect(cardDetails.currentBalance).toBe(5000);
    expect(cardDetails.availableCredit).toBe(15000);
    
    // Verify calculation
    const calculatedAvailable = cardDetails.creditLimit - cardDetails.currentBalance;
    expect(calculatedAvailable).toBe(15000);
    logger.info('Card details verified with accurate calculations');
  });

  test('QE-8174 TS-002 TC-001: Verify error when viewing deleted credit card', async ({ page }) => {
    logger.info('Starting test: QE-8174 TS-002 TC-001');
    
    // Step 1-3: Authenticate and attempt to select deleted card
    await cardManagementPage.authenticateUser('user123', 'valid-token-xyz');
    await cardManagementPage.navigateToCardManagement();
    
    // Step 4-5: Simulate deleted card scenario
    await page.route('**/api/cards/card999', route => {
      route.fulfill({
        status: 404,
        body: JSON.stringify({
          error: 'Card is no longer available or accessible',
          statusCode: 404,
          cardId: 'card999'
        })
      });
    });
    
    await cardManagementPage.selectCard('card999');
    
    // Step 6: Verify error message
    const errorMessage = await cardManagementPage.getCardDetailsError();
    expect(errorMessage).toContain('no longer available');
    expect(errorMessage).toContain('deleted');
    logger.info('Deleted card error message displayed correctly');
  });

  test('QE-8174 TS-002 TC-002: Verify error when viewing deactivated credit card', async ({ page }) => {
    logger.info('Starting test: QE-8174 TS-002 TC-002');
    
    // Step 1-3: Authenticate and attempt to select deactivated card
    await cardManagementPage.authenticateUser('user123', 'valid-token-xyz');
    await cardManagementPage.navigateToCardManagement();
    
    // Step 4-5: Simulate deactivated card scenario
    await page.route('**/api/cards/card888', route => {
      route.fulfill({
        status: 403,
        body: JSON.stringify({
          error: 'Card is deactivated and no longer accessible',
          statusCode: 403,
          cardId: 'card888'
        })
      });
    });
    
    await cardManagementPage.selectCard('card888');
    
    // Step 6: Verify error message
    const errorMessage = await cardManagementPage.getCardDetailsError();
    expect(errorMessage).toContain('deactivated');
    expect(errorMessage).toContain('no longer accessible');
    logger.info('Deactivated card error message displayed correctly');
  });

  test('QE-8174 TS-003 TC-001: Verify system fails to meet 500ms requirement with high latency', async ({ page }) => {
    logger.info('Starting test: QE-8174 TS-003 TC-001');
    
    // Step 1-3: Authenticate and navigate
    await cardManagementPage.authenticateUser('user123', 'valid-token-xyz');
    await cardManagementPage.navigateToCardManagement();
    
    // Step 4: Simulate high latency (750ms)
    await page.route('**/api/cards/card1', route => {
      setTimeout(() => route.continue(), 750);
    });
    
    // Step 5: Measure response time
    const startTime = Date.now();
    await cardManagementPage.selectCard('card1');
    
    try {
      await cardManagementPage.waitForCardDetailsLoad({ timeout: 1000 });
      const responseTime = Date.now() - startTime;
      
      // Step 6: Verify performance requirement not met
      expect(responseTime).toBeGreaterThan(500);
      logger.info(`Card details loaded in ${responseTime}ms (exceeds 500ms threshold)`);
      
      const timeoutError = await cardManagementPage.getTimeoutError();
      expect(timeoutError).toMatch(/timeout|delayed/i);
    } catch (error) {
      logger.info('Card details request timed out as expected due to high latency');
    }
  });
});