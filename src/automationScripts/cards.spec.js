const { test, expect } = require('@playwright/test');
const { CardsPage } = require('./pages/cards.page');
const { CardDetailPage } = require('./pages/cardDetail.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../../utils/logger');

test.describe('Credit Card Management - Multiple Cards and Spend Analysis', () => {
  let cardsPage;
  let cardDetailPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Setting up test - navigating to application');
    cardsPage = new CardsPage(page);
    cardDetailPage = new CardDetailPage(page);
    loginPage = new LoginPage(page);
    await page.goto('/');
  });

  test('QE-10397 TS-001 TC-001 - Verify 5 active cards display with complete details', async ({ page }) => {
    logger.info('Test Case: QE-10397 TS-001 TC-001 - Multiple card display');
    
    // Step 1-3: Login
    await loginPage.login('user_5cards@example.com', 'SecurePass@123');
    logger.info('User with 5 cards logged in');
    
    // Step 4: Navigate to My Cards page
    await cardsPage.navigateToCardsPage();
    await cardsPage.waitForCardsPageLoad();
    logger.info('Navigated to card portfolio page');
    
    // Step 5: Verify 5 cards displayed
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(5);
    logger.info('Verified: 5 credit cards displayed');
    
    // Step 6-10: Verify each card details
    const expectedCardTypes = ['Visa', 'Mastercard', 'Amex', 'Visa', 'Mastercard'];
    const expectedLast4Digits = ['1234', '5678', '9012', '3456', '7890'];
    const expectedBalances = ['$2,500', '$1,800', '$3,200', '$900', '$1,500'];
    const expectedAvailable = ['$7,500', '$8,200', '$6,800', '$9,100', '$8,500'];
    const expectedLimits = ['$10,000', '$10,000', '$10,000', '$10,000', '$10,000'];
    
    for (let i = 0; i < 5; i++) {
      await cardsPage.verifyCardType(i, expectedCardTypes[i]);
      await cardsPage.verifyCardLastFourDigits(i, expectedLast4Digits[i]);
      await cardsPage.verifyCardBalance(i, expectedBalances[i]);
      await cardsPage.verifyCardAvailableCredit(i, expectedAvailable[i]);
      await cardsPage.verifyCardCreditLimit(i, expectedLimits[i]);
      logger.info(`Card ${i + 1} details verified`);
    }
    
    logger.info('All 5 cards display complete details correctly');
  });

  test('QE-10397 TS-002 TC-001 - Verify 10 cards display with pagination and load time under 500ms', async ({ page }) => {
    logger.info('Test Case: QE-10397 TS-002 TC-001 - Maximum cards with performance check');
    
    // Step 1-3: Login
    await loginPage.login('user_10cards@example.com', 'SecurePass@123');
    
    // Step 4-5: Measure page load time
    const startTime = Date.now();
    await cardsPage.navigateToCardsPage();
    await cardsPage.waitForCardsPageLoad();
    const loadTime = Date.now() - startTime;
    logger.info(`Cards page load time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(500);
    
    // Step 6: Verify 10 cards displayed
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(10);
    logger.info('Verified: 10 credit cards displayed');
    
    // Step 7-8: Verify pagination or scrolling
    const hasPagination = await cardsPage.isPaginationVisible();
    if (hasPagination) {
      await cardsPage.verifyPaginationFunctional();
      logger.info('Pagination controls are functional');
    } else {
      await cardsPage.verifyScrollingFunctional();
      logger.info('Scrolling functionality works smoothly');
    }
    
    // Step 9: Verify all cards show complete information
    await cardsPage.verifyAllCardsHaveCompleteDetails();
    logger.info('All 10 cards display complete information without data loss');
  });

  test('QE-10397 TS-002 TC-002 - Verify card switching response time under 500ms', async ({ page }) => {
    logger.info('Test Case: QE-10397 TS-002 TC-002 - Card switching performance');
    
    // Step 1-2: Login and navigate to cards
    await loginPage.login('user_10cards@example.com', 'SecurePass@123');
    await cardsPage.navigateToCardsPage();
    await cardsPage.waitForCardsPageLoad();
    
    // Step 3: Click on first card
    await cardsPage.clickCard(0);
    await cardDetailPage.waitForCardDetailLoad();
    logger.info('First card details loaded');
    
    // Step 4-6: Test card switching performance
    const cardPairs = [[0, 1], [1, 2], [2, 4], [4, 7], [7, 9]];
    
    for (const [from, to] of cardPairs) {
      const startTime = Date.now();
      await cardDetailPage.navigateBackToCards();
      await cardsPage.clickCard(to);
      await cardDetailPage.waitForCardDetailLoad();
      const switchTime = Date.now() - startTime;
      
      expect(switchTime).toBeLessThan(500);
      logger.info(`Card ${from + 1} → ${to + 1} switch time: ${switchTime}ms`);
    }
    
    // Step 7: Verify no data loss or UI freezing
    await cardDetailPage.verifyCardDataIntegrity();
    logger.info('All card data loads correctly without errors');
  });

  test('QE-10397 TS-003 TC-001 - Verify appropriate message for user with no cards', async ({ page }) => {
    logger.info('Test Case: QE-10397 TS-003 TC-001 - No cards scenario');
    
    // Step 1-3: Login with no cards user
    await loginPage.login('user_nocards@example.com', 'SecurePass@123');
    
    // Step 4: Navigate to My Cards page
    await cardsPage.navigateToCardsPage();
    await cardsPage.waitForCardsPageLoad();
    
    // Step 5: Verify no cards displayed
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(0);
    logger.info('Verified: No credit cards displayed');
    
    // Step 6: Verify appropriate message
    await cardsPage.verifyNoCardsMessage();
    logger.info('No cards message displayed');
    
    // Step 7: Verify Add Card button
    await cardsPage.verifyAddCardButtonVisible();
    logger.info('Add Card button is visible');
    
    // Step 8: Click Add Card button
    await cardsPage.clickAddCardButton();
    await page.waitForURL('**/cards/add', { timeout: 5000 });
    logger.info('User redirected to card addition flow');
  });

  test('QE-10396 TS-001 TC-001 - Verify detailed spend analysis for selected card', async ({ page }) => {
    logger.info('Test Case: QE-10396 TS-001 TC-001 - Card-wise spend analysis');
    
    // Step 1-2: Login and navigate to cards
    await loginPage.login('user_multicard@example.com', 'SecurePass@123');
    await cardsPage.navigateToCardsPage();
    await cardsPage.waitForCardsPageLoad();
    logger.info('User with multiple cards logged in');
    
    // Step 3: Click on first card
    await cardsPage.clickCard(0);
    await cardDetailPage.waitForCardDetailLoad();
    logger.info('Card detail page loaded');
    
    // Step 4-7: Verify spend analysis details
    await cardDetailPage.verifyTotalSpend('$3,500.75');
    logger.info('Total spend verified');
    
    await cardDetailPage.verifyAvailableCredit('$6,500.00');
    logger.info('Available credit verified');
    
    await cardDetailPage.verifyUtilizationPercentage('35%');
    logger.info('Utilization percentage verified');
    
    await cardDetailPage.verifyMonthlyTrendsVisible();
    logger.info('Monthly spending trends chart displayed');
    
    // Step 8: Verify data is card-specific
    const cardId = await cardDetailPage.getCardId();
    expect(cardId).toBe('card-001');
    logger.info('All metrics correspond to selected card ID');
  });

  test('QE-10396 TS-002 TC-001 - Verify spend analysis comparison across multiple cards', async ({ page }) => {
    logger.info('Test Case: QE-10396 TS-002 TC-001 - Compare spending across cards');
    
    // Step 1-2: Login and navigate to cards
    await loginPage.login('user_multicard@example.com', 'SecurePass@123');
    await cardsPage.navigateToCardsPage();
    await cardsPage.waitForCardsPageLoad();
    
    // Step 3: Select Card A and record values
    await cardsPage.clickCard(0);
    await cardDetailPage.waitForCardDetailLoad();
    const cardAData = await cardDetailPage.getSpendAnalysisData();
    logger.info(`Card A data: Spend $${cardAData.spend}, Available $${cardAData.available}, Utilization ${cardAData.utilization}%`);
    
    // Step 4-5: Select Card B and verify different data
    await cardDetailPage.navigateBackToCards();
    await cardsPage.clickCard(1);
    await cardDetailPage.waitForCardDetailLoad();
    const cardBData = await cardDetailPage.getSpendAnalysisData();
    
    expect(cardBData.spend).not.toBe(cardAData.spend);
    logger.info('Card B displays unique data (not Card A data)');
    
    // Step 6-7: Select Card C and verify unique data
    await cardDetailPage.navigateBackToCards();
    await cardsPage.clickCard(2);
    await cardDetailPage.waitForCardDetailLoad();
    const cardCData = await cardDetailPage.getSpendAnalysisData();
    
    expect(cardCData.spend).not.toBe(cardAData.spend);
    expect(cardCData.spend).not.toBe(cardBData.spend);
    logger.info('Card C displays its own unique data');
    
    // Step 8: Switch back to Card A and verify original values
    await cardDetailPage.navigateBackToCards();
    await cardsPage.clickCard(0);
    await cardDetailPage.waitForCardDetailLoad();
    const cardADataAgain = await cardDetailPage.getSpendAnalysisData();
    
    expect(cardADataAgain.spend).toBe(cardAData.spend);
    logger.info('Card A still shows original spend analysis (no data corruption)');
    
    // Step 9: Verify monthly trends are card-specific
    await cardDetailPage.verifyMonthlyTrendsAreUnique();
    logger.info('Each card trend chart displays unique spending patterns');
  });

  test('QE-10396 TS-003 TC-001 - Verify message for deactivated card spend analysis', async ({ page }) => {
    logger.info('Test Case: QE-10396 TS-003 TC-001 - Deactivated card handling');
    
    // Step 1-2: Login with user having deactivated card
    await loginPage.login('user_deactivated@example.com', 'SecurePass@123');
    await cardsPage.navigateToCardsPage();
    await cardsPage.waitForCardsPageLoad();
    logger.info('User with deactivated card logged in');
    
    // Step 3: Attempt to access deactivated card
    await cardsPage.clickDeactivatedCard();
    
    // Step 4: Verify appropriate message
    await cardDetailPage.verifyCardDeactivatedMessage();
    logger.info('Card deactivated message displayed');
    
    // Step 5: Verify spend analysis handling
    const isCurrentSpendVisible = await cardDetailPage.isCurrentSpendDataVisible();
    expect(isCurrentSpendVisible).toBeFalsy();
    logger.info('Current spend analysis not available or marked as historical');
    
    // Step 6: Verify historical data access limitation message
    await cardDetailPage.verifyHistoricalDataLimitationMessage();
    logger.info('Historical data access limitation message displayed');
    
    // Step 7: Verify no real-time data shown
    const currentMonthSpend = await cardDetailPage.getCurrentMonthSpend();
    expect(currentMonthSpend).toMatch(/N\/A|\$0\.00/);
    logger.info('No current month spend or real-time data displayed');
  });
});
