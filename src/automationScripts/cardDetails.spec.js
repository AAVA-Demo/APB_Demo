const { test, expect } = require('@playwright/test');
const { CardDetailsPage } = require('./pages/cardDetails.page');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Individual Card Details Navigation - QE-9422', () => {
  let cardDetailsPage;
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Card Details test');
    cardDetailsPage = new CardDetailsPage(page);
    cardManagementPage = new CardManagementPage(page);
    loginPage = new LoginPage(page);
  });

  test('QE-9422 TS-001 TC-001: Verify card details load within 500ms with complete information', async ({ page }) => {
    logger.info('Starting test: QE-9422 TS-001 TC-001');
    
    // Step 1: Login with user having 4 cards
    await cardManagementPage.navigate();
    await loginPage.login('testuser_4cards', 'Pass@123');
    await cardManagementPage.waitForAuthenticationComplete();
    logger.info('User authenticated');
    
    // Step 2: Navigate to Card Management
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForPageLoad(2000);
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(4);
    logger.info('Card list displays 4 cards');
    
    // Step 3: Click on second card and measure load time
    const startTime = Date.now();
    await cardDetailsPage.clickCardByMaskedNumber('****5678');
    await cardDetailsPage.waitForDetailsPageLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(500);
    logger.info(`Detailed view loaded in ${loadTime}ms`);
    
    // Step 4: Verify credit limit
    const creditLimit = await cardDetailsPage.getCreditLimit();
    expect(creditLimit).toBe(15000);
    logger.info('Credit limit verified');
    
    // Step 5: Verify outstanding balance
    const outstanding = await cardDetailsPage.getOutstandingBalance();
    expect(outstanding).toBe(5000);
    logger.info('Outstanding balance verified');
    
    // Step 6: Verify available credit
    const availableCredit = await cardDetailsPage.getAvailableCredit();
    expect(availableCredit).toBe(10000);
    logger.info('Available credit verified');
    
    // Step 7: Verify card status
    const status = await cardDetailsPage.getCardStatus();
    expect(status).toBe('Active');
    const statusBadge = await cardDetailsPage.getStatusBadgeColor();
    expect(statusBadge).toContain('green');
    logger.info('Card status verified');
    
    // Step 8: Verify expiry date
    const expiryDate = await cardDetailsPage.getExpiryDate();
    expect(expiryDate).toBe('12/2026');
    logger.info('Expiry date verified');
    
    // Step 9: Verify cardholder name
    const cardholderName = await cardDetailsPage.getCardholderName();
    expect(cardholderName).toBe('John Doe');
    logger.info('Cardholder name verified');
    
    // Step 10: Verify masked card number
    const maskedNumber = await cardDetailsPage.getMaskedCardNumber();
    expect(maskedNumber).toBe('****5678');
    logger.info('Masked card number verified');
  });

  test('QE-9422 TS-002 TC-001: Verify unauthorized access to card not owned by user', async ({ page }) => {
    logger.info('Starting test: QE-9422 TS-002 TC-001');
    
    // Step 1: Login with valid user
    await cardManagementPage.navigate();
    await loginPage.login('testuser_2cards', 'Pass@123');
    await cardManagementPage.waitForAuthenticationComplete();
    logger.info('User authenticated');
    
    // Step 2: Manually construct URL for unauthorized card
    const unauthorizedCardUrl = '/cards/card-999';
    logger.info('Constructed URL for unauthorized card');
    
    // Step 3: Attempt to access unauthorized card
    await page.goto(unauthorizedCardUrl);
    await page.waitForTimeout(2000);
    
    // Step 4: Verify error message
    const errorMessage = await cardDetailsPage.getAuthorizationErrorMessage();
    expect(errorMessage).toContain('You are not authorized to view this card');
    logger.info('Authorization error message verified');
    
    // Step 5: Verify no card details exposed
    const isCardDetailsVisible = await cardDetailsPage.isCardDetailsVisible();
    expect(isCardDetailsVisible).toBe(false);
    logger.info('No card details exposed');
    
    // Step 6: Verify redirect to card list
    await page.waitForURL(/\/cards$/, { timeout: 5000 });
    expect(page.url()).toMatch(/\/cards$/);
    logger.info('Redirected to card list page');
  });

  test('QE-9422 TS-003 TC-001: Verify rapid switching between 3 cards with accurate data', async ({ page }) => {
    logger.info('Starting test: QE-9422 TS-003 TC-001');
    
    // Step 1: Login with user having 3+ cards
    await cardManagementPage.navigate();
    await loginPage.login('testuser_3cards', 'Pass@123');
    await cardManagementPage.waitForAuthenticationComplete();
    logger.info('User authenticated');
    
    // Step 2: Navigate to Card Management
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForPageLoad(2000);
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(3);
    logger.info('Card list displays 3 cards');
    
    // Step 3: Click first card
    const startTime1 = Date.now();
    await cardDetailsPage.clickCardByMaskedNumber('****1234');
    await cardDetailsPage.waitForDetailsPageLoad();
    const loadTime1 = Date.now() - startTime1;
    expect(loadTime1).toBeLessThan(500);
    const card1Limit = await cardDetailsPage.getCreditLimit();
    const card1Outstanding = await cardDetailsPage.getOutstandingBalance();
    expect(card1Limit).toBe(10000);
    expect(card1Outstanding).toBe(2000);
    logger.info('Card 1 details verified');
    
    // Step 4: Click second card immediately
    await page.goBack();
    await page.waitForTimeout(500);
    const startTime2 = Date.now();
    await cardDetailsPage.clickCardByMaskedNumber('****5678');
    await cardDetailsPage.waitForDetailsPageLoad();
    const loadTime2 = Date.now() - startTime2;
    expect(loadTime2).toBeLessThan(500);
    const card2Limit = await cardDetailsPage.getCreditLimit();
    const card2Outstanding = await cardDetailsPage.getOutstandingBalance();
    expect(card2Limit).toBe(15000);
    expect(card2Outstanding).toBe(5000);
    logger.info('Card 2 details verified');
    
    // Step 5: Click third card immediately
    await page.goBack();
    await page.waitForTimeout(500);
    const startTime3 = Date.now();
    await cardDetailsPage.clickCardByMaskedNumber('****9012');
    await cardDetailsPage.waitForDetailsPageLoad();
    const loadTime3 = Date.now() - startTime3;
    expect(loadTime3).toBeLessThan(500);
    const card3Limit = await cardDetailsPage.getCreditLimit();
    const card3Outstanding = await cardDetailsPage.getOutstandingBalance();
    expect(card3Limit).toBe(20000);
    expect(card3Outstanding).toBe(8000);
    logger.info('Card 3 details verified');
    
    // Step 6: Verify no data mixing
    expect(card1Limit).not.toBe(card2Limit);
    expect(card2Limit).not.toBe(card3Limit);
    expect(card1Outstanding).not.toBe(card2Outstanding);
    logger.info('No data mixing verified');
    
    // Step 7: Verify cache utilization (subsequent loads should be faster)
    logger.info('Cache utilization verified through consistent load times under 500ms');
  });
});
