const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { CardDetailPage } = require('./pages/cardDetail.page');
const logger = require('../utils/logger');

test.describe('Card Management Tests', () => {
  let cardManagementPage;
  let cardDetailPage;

  test.beforeEach(async ({ page }) => {
    cardManagementPage = new CardManagementPage(page);
    cardDetailPage = new CardDetailPage(page);
    await cardManagementPage.navigate();
    await cardManagementPage.login('testuser', 'Test@123');
  });

  test('QE-9933 TS001 TC-001: Verify all 5 registered credit cards are displayed with complete individual details', async ({ page }) => {
    logger.info('Starting test: Multiple cards display with complete details');
    
    await cardManagementPage.navigateToCardManagement();
    
    const cardCount = await cardManagementPage.getCardCount();
    logger.info(`Number of cards displayed: ${cardCount}`);
    expect(cardCount).toBe(5);
    
    const cardTypes = await cardManagementPage.getAllCardTypes();
    logger.info(`Card types: ${cardTypes.join(', ')}`);
    expect(cardTypes).toEqual(['Visa', 'Mastercard', 'Amex', 'Discover', 'Visa']);
    
    const lastFourDigits = await cardManagementPage.getAllLastFourDigits();
    logger.info(`Last four digits: ${lastFourDigits.join(', ')}`);
    expect(lastFourDigits).toEqual(['1234', '5678', '9012', '3456', '7890']);
    
    const creditLimits = await cardManagementPage.getAllCreditLimits();
    logger.info(`Credit limits: ${creditLimits.join(', ')}`);
    expect(creditLimits).toEqual(['$10,000.00', '$15,000.00', '$20,000.00', '$12,000.00', '$8,000.00']);
    
    const balances = await cardManagementPage.getAllBalances();
    logger.info(`Balances: ${balances.join(', ')}`);
    expect(balances).toEqual(['$2,000.00', '$3,500.00', '$5,000.00', '$1,200.00', '$800.00']);
    
    logger.info('Test completed successfully');
  });

  test('QE-9933 TS002 TC-001: Verify system displays 9 valid cards with error indicator for 1 corrupted card without breaking the list view', async ({ page }) => {
    logger.info('Starting test: Corrupted card data handling');
    
    await page.route('**/api/cards*', route => {
      const mockCards = [];
      for (let i = 1; i <= 10; i++) {
        if (i === 5) {
          mockCards.push({ cardId: `card-00${i}`, error: 'Data unavailable' });
        } else {
          mockCards.push({
            cardId: `card-00${i}`,
            cardType: 'Visa',
            lastFourDigits: `${1000 + i}`,
            creditLimit: 10000,
            balance: 1000
          });
        }
      }
      route.fulfill({ status: 200, body: JSON.stringify(mockCards) });
    });
    
    await cardManagementPage.navigateToCardManagement();
    
    const totalCards = await cardManagementPage.getCardCount();
    logger.info(`Total card slots: ${totalCards}`);
    expect(totalCards).toBe(10);
    
    const validCards = await cardManagementPage.getValidCardCount();
    logger.info(`Valid cards: ${validCards}`);
    expect(validCards).toBe(9);
    
    const hasErrorIndicator = await cardManagementPage.hasErrorIndicatorForCard(5);
    expect(hasErrorIndicator).toBe(true);
    
    const errorMessage = await cardManagementPage.getCardErrorMessage(5);
    logger.info(`Error message for card 5: ${errorMessage}`);
    expect(errorMessage).toMatch(/Unable to load card details|Data unavailable/i);
    
    const isListViewIntact = await cardManagementPage.isListViewIntact();
    expect(isListViewIntact).toBe(true);
    
    const canInteractWithValidCards = await cardManagementPage.canClickCard(1);
    expect(canInteractWithValidCards).toBe(true);
    
    logger.info('Test completed successfully');
  });

  test('QE-9933 TS003 TC-001: Verify empty state message is displayed when user has no registered credit cards', async ({ page }) => {
    logger.info('Starting test: Empty card list display');
    
    await cardManagementPage.logout();
    await cardManagementPage.login('newuser', 'Test@123');
    
    await page.route('**/api/cards*', route => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });
    
    await cardManagementPage.navigateToCardManagement();
    
    const hasEmptyState = await cardManagementPage.hasEmptyStateMessage();
    expect(hasEmptyState).toBe(true);
    
    const emptyStateMessage = await cardManagementPage.getEmptyStateMessage();
    logger.info(`Empty state message: ${emptyStateMessage}`);
    expect(emptyStateMessage).toMatch(/No credit cards registered|You have no cards yet/i);
    
    const hasAddCardPrompt = await cardManagementPage.hasAddCardPrompt();
    expect(hasAddCardPrompt).toBe(true);
    
    const addCardButtonText = await cardManagementPage.getAddCardButtonText();
    logger.info(`Add card button text: ${addCardButtonText}`);
    expect(addCardButtonText).toMatch(/Add a Card|Register Your First Card/i);
    
    const hasErrors = await cardManagementPage.hasPageErrors();
    expect(hasErrors).toBe(false);
    
    logger.info('Test completed successfully');
  });

  test('QE-9931 TS001 TC-001: Verify card-specific details are displayed within 500 milliseconds when a card is selected', async ({ page }) => {
    logger.info('Starting test: Card selection with details display');
    
    await cardManagementPage.navigateToCardManagement();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);
    
    const startTime = Date.now();
    await cardManagementPage.selectCard('Visa', '1234');
    const loadTime = Date.now() - startTime;
    
    logger.info(`Card details load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(500);
    
    await expect(cardDetailPage.cardDetailContainer).toBeVisible();
    
    const hasSpendAnalysis = await cardDetailPage.hasSpendAnalysis();
    expect(hasSpendAnalysis).toBe(true);
    
    const monthlySpend = await cardDetailPage.getMonthlySpend();
    logger.info(`Monthly spend: ${monthlySpend}`);
    expect(monthlySpend).toBe('$1,250.50');
    
    const metadata = await cardDetailPage.getCardMetadata();
    logger.info(`Card metadata: ${JSON.stringify(metadata)}`);
    expect(metadata.cardType).toBe('Visa');
    expect(metadata.issuer).toBe('Bank A');
    expect(metadata.expiryDate).toBe('12/2026');
    expect(metadata.rewardsProgram).toBe('Cashback');
    
    const hasNullValues = await cardDetailPage.hasNullOrMissingValues();
    expect(hasNullValues).toBe(false);
    
    logger.info('Test completed successfully');
  });

  test('QE-9931 TS002 TC-001: Verify system displays error message and redirects to card list when user attempts to select a deleted or inaccessible card', async ({ page }) => {
    logger.info('Starting test: Deleted card selection handling');
    
    await cardManagementPage.navigateToCardManagement();
    
    await page.route('**/api/cards/card-999*', route => {
      route.fulfill({ status: 404, body: JSON.stringify({ error: 'Card not found' }) });
    });
    
    await page.goto('https://creditcard-dashboard.example.com/cards/card-999');
    
    const isErrorDisplayed = await cardDetailPage.isErrorMessageVisible();
    expect(isErrorDisplayed).toBe(true);
    
    const errorMessage = await cardDetailPage.getErrorMessage();
    logger.info(`Error message: ${errorMessage}`);
    expect(errorMessage).toMatch(/Card not found|This card is no longer available/i);
    
    await page.waitForURL('**/cards', { timeout: 5000 });
    
    const currentUrl = page.url();
    logger.info(`Redirected to: ${currentUrl}`);
    expect(currentUrl).toContain('/cards');
    expect(currentUrl).not.toContain('card-999');
    
    const hasStaleData = await cardManagementPage.hasStaleCardData();
    expect(hasStaleData).toBe(false);
    
    logger.info('Test completed successfully');
  });

  test('QE-9931 TS003 TC-001: Verify each cards details load correctly within 500 milliseconds when user rapidly switches between multiple cards', async ({ page }) => {
    logger.info('Starting test: Rapid card switching');
    
    await cardManagementPage.navigateToCardManagement();
    
    const cards = [
      { type: 'Visa', digits: '1234' },
      { type: 'Mastercard', digits: '5678' },
      { type: 'Amex', digits: '9012' }
    ];
    
    for (const card of cards) {
      const startTime = Date.now();
      await cardManagementPage.selectCard(card.type, card.digits);
      const loadTime = Date.now() - startTime;
      
      logger.info(`${card.type} ${card.digits} load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(500);
      
      await expect(cardDetailPage.cardDetailContainer).toBeVisible();
      
      const displayedCardType = await cardDetailPage.getCardType();
      const displayedDigits = await cardDetailPage.getLastFourDigits();
      
      logger.info(`Displayed: ${displayedCardType} ending in ${displayedDigits}`);
      expect(displayedCardType).toBe(card.type);
      expect(displayedDigits).toBe(card.digits);
      
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
    
    const hasDataCorruption = await cardDetailPage.hasDataCorruption();
    expect(hasDataCorruption).toBe(false);
    
    const hasDisplayLag = await page.evaluate(() => {
      return document.body.style.cursor === 'wait' || document.body.style.pointerEvents === 'none';
    });
    expect(hasDisplayLag).toBe(false);
    
    logger.info('Test completed successfully');
  });
});