const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { CardDetailPage } = require('./pages/cardDetail.page');
const { LoginPage } = require('./pages/login.page');

/**
 * Test Suite: Multiple Credit Cards Display and Card-wise Spend Analysis
 * Test Cases: TC-7008, TC-7009, TC-7010, TC-7014, TC-7015, TC-7016
 * User Stories: QE-9894 (Multiple Credit Cards Display), QE-9897 (Card-wise Spend Analysis)
 */

test.describe('Card Management - Multiple Cards Display', () => {
  let loginPage;
  let cardManagementPage;
  let cardDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    cardDetailPage = new CardDetailPage(page);
    await loginPage.navigate();
  });

  /**
   * Test Case ID: TC-7014
   * Scenario: QE-9894 TS-001 TC-001
   * Description: Verify card management interface displays 10 credit cards with all required details within 1 second
   */
  test('TC-7014: Verify card management displays 10 credit cards within 1 second', async ({ page }) => {
    // Step 1: Log in with user who has 10 credit cards
    await loginPage.login('testuser_10cards', 'Test@123');

    // Step 2: Navigate to My Cards section
    await cardManagementPage.navigate();

    // Step 3: Measure time taken for card list to load
    const startTime = Date.now();
    await cardManagementPage.waitForCardsLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(1000);

    // Step 4: Verify all 10 cards display complete information
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(10);

    // Verify first card has all required fields
    const firstCard = await cardManagementPage.getCardAtIndex(0);
    expect(firstCard.cardNumber).toContain('****');
    expect(firstCard.cardBrand).toBeTruthy();
    expect(firstCard.cardType).toBeTruthy();
    expect(firstCard.availableCredit).toBeTruthy();
    expect(firstCard.outstandingBalance).toBeTruthy();
  });

  /**
   * Test Case ID: TC-7015
   * Scenario: QE-9894 TS-002 TC-001
   * Description: Verify system denies access when User Profile Service fails to validate ownership
   */
  test('TC-7015: Verify system denies access when User Profile Service fails', async ({ page }) => {
    // Step 1: Simulate User Profile Service failure
    await page.route('**/api/users/validate', route => {
      route.fulfill({ status: 401, body: 'Unauthorized' });
    });

    // Step 2: Attempt to navigate to My Cards section
    await loginPage.login('testuser', 'Test@123');
    await cardManagementPage.navigate();

    // Step 3: Observe system response
    const errorMessage = await cardManagementPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load credit cards');

    // Step 4: Verify user is prompted to re-login
    await expect(page).toHaveURL(/login/);
  });

  /**
   * Test Case ID: TC-7016
   * Scenario: QE-9894 TS-003 TC-001
   * Description: Verify system supports more than 10 credit cards (15 cards) and displays all within 1 second
   */
  test('TC-7016: Verify system supports 15+ credit cards within 1 second', async ({ page }) => {
    // Step 1: Log in with user who has 15 credit cards
    await loginPage.login('testuser_15cards', 'Test@123');

    // Step 2: Navigate to My Cards section
    await cardManagementPage.navigate();

    // Step 3: Measure time taken for card list to load
    const startTime = Date.now();
    await cardManagementPage.waitForCardsLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(1000);

    // Step 4: Verify all 15 cards are displayed
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(15);

    // Step 5: Verify system meets NFR requirement
    expect(cardCount).toBeGreaterThanOrEqual(10);
  });

  /**
   * Test Case ID: TC-7008
   * Scenario: QE-9897 TS-001 TC-001
   * Description: Verify card-wise spending details are displayed when user selects a specific card
   */
  test('TC-7008: Verify card-wise spending details displayed when card selected', async ({ page }) => {
    // Step 1: Navigate to My Cards section
    await loginPage.login('testuser', 'Test@123');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardsLoad();

    // Step 2: Select specific credit card (Visa ending in 1234)
    await cardManagementPage.selectCardByNumber('**** 1234');

    // Step 3: Verify card details are displayed
    await cardDetailPage.waitForCardDetailsLoad();
    
    const cardNumber = await cardDetailPage.getCardNumber();
    expect(cardNumber).toBe('**** 1234');
    
    const cardBrand = await cardDetailPage.getCardBrand();
    expect(cardBrand).toBe('Visa');
    
    const creditLimit = await cardDetailPage.getCreditLimit();
    expect(creditLimit).toBe('$10,000');

    // Step 4: Verify spending analysis section
    const currentMonthSpend = await cardDetailPage.getCurrentMonthSpend();
    expect(currentMonthSpend).toBe('$1,500');
    
    const lastMonthSpend = await cardDetailPage.getLastMonthSpend();
    expect(lastMonthSpend).toBe('$1,200');
    
    const averageMonthlySpend = await cardDetailPage.getAverageMonthlySpend();
    expect(averageMonthlySpend).toBe('$1,350');
    
    const topCategory = await cardDetailPage.getTopCategory();
    expect(topCategory).toBe('Shopping');
  });

  /**
   * Test Case ID: TC-7009
   * Scenario: QE-9897 TS-002 TC-001
   * Description: Verify card with no transaction history displays zero spending values and appropriate message
   */
  test('TC-7009: Verify card with no transaction history displays zero values', async ({ page }) => {
    // Step 1: Navigate to My Cards section
    await loginPage.login('testuser', 'Test@123');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardsLoad();

    // Step 2: Select card with no transaction history
    await cardManagementPage.selectCardByNumber('**** 5678');

    // Step 3: Verify card details are displayed
    await cardDetailPage.waitForCardDetailsLoad();
    
    const cardNumber = await cardDetailPage.getCardNumber();
    expect(cardNumber).toBe('**** 5678');
    
    const availableCredit = await cardDetailPage.getAvailableCredit();
    expect(availableCredit).toBe('$15,000');

    // Step 4: Verify spending analysis shows zero values
    const currentMonthSpend = await cardDetailPage.getCurrentMonthSpend();
    expect(currentMonthSpend).toBe('$0');
    
    const noTransactionsMessage = await cardDetailPage.getNoTransactionsMessage();
    expect(noTransactionsMessage).toContain('No transactions are available for analysis');
  });

  /**
   * Test Case ID: TC-7010
   * Scenario: QE-9897 TS-003 TC-001
   * Description: Verify system returns error and redirects when user attempts to view closed or removed card
   */
  test('TC-7010: Verify error when attempting to view closed or removed card', async ({ page }) => {
    // Step 1: Navigate to My Cards section
    await loginPage.login('testuser', 'Test@123');
    await cardManagementPage.navigate();

    // Step 2: Attempt to access closed card using direct URL
    await page.goto('https://creditcard.example.com/cards/999');

    // Step 3: Observe system response
    const errorMessage = await cardDetailPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load card details');

    // Step 4: Verify user is redirected back to card list
    await expect(page).toHaveURL(/\/cards$/);
  });
});
