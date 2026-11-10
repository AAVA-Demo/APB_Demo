const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Card Management Tests', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    logger.info('Starting card management test setup');
  });

  test('QE-9781 TS-001 TC-001 - Verify multiple credit cards display with all key details', async ({ page }) => {
    logger.info('Test Case: QE-9781 TS-001 TC-001 - Multiple Cards Display');
    
    // Step 1: Login with user having 5 cards
    await loginPage.navigate();
    await loginPage.login('fivecards@example.com', 'Test@123');
    logger.info('User with 5 cards logged in');
    
    // Step 2: Navigate to Card Management
    await cardManagementPage.navigate();
    await expect(page).toHaveURL(/.*cards/, { timeout: 1000 });
    logger.info('Card Management page loaded within 1 second');
    
    // Step 3: Verify 5 cards displayed
    const cardCount = await cardManagementPage.getCardCount();
    await expect(cardCount).toBe(5);
    logger.info('5 credit cards displayed');
    
    // Step 4: Verify masked card numbers
    await cardManagementPage.verifyMaskedCardNumbers();
    logger.info('Card numbers properly masked');
    
    // Step 5: Verify card types
    await cardManagementPage.verifyCardTypes(['Visa', 'Mastercard', 'Amex', 'Discover']);
    logger.info('Card types verified');
    
    // Step 6: Verify issuers
    await cardManagementPage.verifyIssuers(['Chase', 'Citi', 'American Express', 'Bank of America', 'Discover']);
    logger.info('Issuers verified');
    
    // Step 7: Verify credit limits
    await cardManagementPage.verifyCreditLimits(['$10,000', '$15,000', '$20,000', '$12,000', '$8,000']);
    logger.info('Credit limits verified');
    
    // Step 8-9: Verify available credit and outstanding amounts
    await cardManagementPage.verifyAvailableCreditDisplayed();
    await cardManagementPage.verifyOutstandingAmountsDisplayed();
    logger.info('Available credit and outstanding amounts verified');
    
    // Step 10: Verify expiry dates
    await cardManagementPage.verifyExpiryDateFormat();
    logger.info('Expiry dates in MM/YYYY format verified');
  });

  test('QE-9781 TS-002 TC-001 - Verify message when user has no active credit cards', async ({ page }) => {
    logger.info('Test Case: QE-9781 TS-002 TC-001 - No Active Cards');
    
    // Step 1: Login with user having 0 cards
    await loginPage.navigate();
    await loginPage.login('nocards@example.com', 'Test@123');
    logger.info('User with no cards logged in');
    
    // Step 2: Navigate to Card Management
    await cardManagementPage.navigate();
    logger.info('Card Management page loaded');
    
    // Step 3: Verify no active cards message
    await expect(cardManagementPage.noCardsMessage).toBeVisible();
    await expect(cardManagementPage.noCardsMessage).toContainText('No active credit cards available');
    logger.info('No active cards message displayed');
    
    // Step 4: Verify Add New Card button
    await expect(cardManagementPage.addNewCardButton).toBeVisible();
    await expect(cardManagementPage.addNewCardButton).toBeEnabled();
    logger.info('Add New Card button visible and enabled');
    
    // Step 5: Verify Contact Support link
    await expect(cardManagementPage.contactSupportLink).toBeVisible();
    await expect(cardManagementPage.contactSupportLink).toBeEnabled();
    logger.info('Contact Support link visible and enabled');
  });

  test('QE-9781 TS-003 TC-001 - Verify system handles 12 credit cards without performance degradation', async ({ page }) => {
    logger.info('Test Case: QE-9781 TS-003 TC-001 - 12 Cards Performance');
    
    // Step 1: Login with user having 12 cards
    await loginPage.navigate();
    await loginPage.login('twelvecards@example.com', 'Test@123');
    logger.info('User with 12 cards logged in');
    
    // Step 2: Navigate and measure load time
    const startTime = Date.now();
    await cardManagementPage.navigate();
    const loadTime = Date.now() - startTime;
    await expect(loadTime).toBeLessThan(1000);
    logger.info(`Card Management page loaded in ${loadTime}ms (< 1 second)`);
    
    // Step 3: Verify 12 cards displayed
    const cardCount = await cardManagementPage.getCardCount();
    await expect(cardCount).toBe(12);
    logger.info('12 credit cards displayed');
    
    // Step 4: Verify smooth scrolling
    await cardManagementPage.scrollThroughCards();
    logger.info('Smooth scrolling verified');
    
    // Step 5: Verify card details expand without delay
    await cardManagementPage.expandCardDetails(0);
    await cardManagementPage.expandCardDetails(5);
    await cardManagementPage.expandCardDetails(11);
    logger.info('Card details expand without delay');
    
    // Step 6: Verify comparison feature
    await cardManagementPage.selectCardsForComparison([0, 5, 11]);
    await expect(cardManagementPage.compareButton).toBeVisible();
    await expect(cardManagementPage.compareButton).toBeEnabled();
    logger.info('Card comparison feature functional');
  });

  test('QE-9784 TS-001 TC-001 - Verify card-wise spending breakdown displays comprehensive metrics', async ({ page }) => {
    logger.info('Test Case: QE-9784 TS-001 TC-001 - Card-wise Spending Breakdown');
    
    // Step 1: Login with user having multiple cards
    await loginPage.navigate();
    await loginPage.login('multicards@example.com', 'Test@123');
    logger.info('User with multiple cards logged in');
    
    // Step 2: Navigate to Card Management
    await cardManagementPage.navigate();
    logger.info('Card Management page loaded');
    
    // Step 3: Select specific card (C002)
    await cardManagementPage.selectCard('C002');
    await expect(cardManagementPage.cardDetailView).toBeVisible();
    logger.info('Card C002 selected and detailed view expanded');
    
    // Step 4: Verify Monthly Spend
    const monthlySpend = await cardManagementPage.getCardMonthlySpend('C002');
    await expect(monthlySpend).toBe('$2,500');
    logger.info('Monthly Spend: $2,500');
    
    // Step 5: Verify Total Spend
    const totalSpend = await cardManagementPage.getCardTotalSpend('C002');
    await expect(totalSpend).toBe('$30,000');
    logger.info('Total Spend: $30,000');
    
    // Step 6: Verify Transaction Count
    const transactionCount = await cardManagementPage.getCardTransactionCount('C002');
    await expect(transactionCount).toBe('78');
    logger.info('Transaction Count: 78');
    
    // Step 7: Verify Utilization Percentage
    const utilization = await cardManagementPage.getCardUtilization('C002');
    await expect(utilization).toBe('53.3%');
    logger.info('Utilization: 53.3%');
    
    // Step 8: Verify Top Spending Categories
    const topCategories = await cardManagementPage.getCardTopCategories('C002');
    await expect(topCategories).toContain('Travel');
    await expect(topCategories).toContain('Shopping');
    await expect(topCategories).toContain('Entertainment');
    logger.info('Top categories verified: Travel, Shopping, Entertainment');
  });

  test('QE-9784 TS-002 TC-001 - Verify message when selected card has no transaction history', async ({ page }) => {
    logger.info('Test Case: QE-9784 TS-002 TC-001 - No Transaction History');
    
    // Step 1: Login with user having new card
    await loginPage.navigate();
    await loginPage.login('newcard@example.com', 'Test@123');
    logger.info('User with new card logged in');
    
    // Step 2: Navigate to Card Management
    await cardManagementPage.navigate();
    
    // Step 3: Select newly added card (C006)
    await cardManagementPage.selectCard('C006');
    logger.info('New card C006 selected');
    
    // Step 4: Verify no spending data message
    await expect(cardManagementPage.noSpendingDataMessage).toBeVisible();
    await expect(cardManagementPage.noSpendingDataMessage).toContainText('No spending data available');
    logger.info('No spending data message displayed');
    
    // Step 5: Verify metrics show $0 or N/A
    const monthlySpend = await cardManagementPage.getCardMonthlySpend('C006');
    await expect(monthlySpend).toMatch(/\$0|N\/A/);
    logger.info('Spending metrics show $0 or N/A');
  });

  test('QE-9784 TS-003 TC-001 - Verify system validates and handles invalid spending data', async ({ page }) => {
    logger.info('Test Case: QE-9784 TS-003 TC-001 - Invalid Data Validation');
    
    // Step 1: Mock invalid spending data
    await page.route('**/api/cards/spending', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([{
          cardId: 'C001',
          monthlySpend: -1200,
          totalSpend: -14400
        }])
      });
    });
    logger.info('Invalid spending data mocked');
    
    // Step 2: Login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Navigate and select card
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('C001');
    logger.info('Card C001 selected');
    
    // Step 4: Verify error message
    await expect(cardManagementPage.dataIntegrityError).toBeVisible();
    await expect(cardManagementPage.dataIntegrityError).toContainText('Data integrity issue detected');
    logger.info('Data integrity error message displayed');
    
    // Step 5: Verify invalid metrics not rendered
    await expect(cardManagementPage.cardSpendingBreakdown).not.toBeVisible();
    logger.info('Invalid spending metrics not rendered');
  });
});