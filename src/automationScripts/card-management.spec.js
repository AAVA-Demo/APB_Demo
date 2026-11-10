const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/card-management.page');
const { CardDetailPage } = require('./pages/card-detail.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

// Test Suite for Multiple Credit Card Display - Story QE-10444
test.describe('Card Management Tests', () => {
  let loginPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await page.goto(testData.baseUrl);
  });

  // Test Case: QE-10513 TS-001 TC-001
  test('TC-013: Verify all registered cards are displayed with correct details', async ({ page }) => {
    // Step 1-2: Launch and authenticate
    await loginPage.login(testData.users.fiveCards.username, testData.users.fiveCards.password);
    
    // Step 3: Navigate to My Cards
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForCardListLoad();
    
    // Step 4: Verify 5 cards displayed
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    
    // Step 5: Verify card numbers masked
    const cardNumbers = await cardManagementPage.getAllCardNumbers();
    cardNumbers.forEach(cardNumber => {
      expect(cardNumber).toMatch(/XXXX-XXXX-XXXX-\d{4}/);
    });
    expect(cardNumbers).toContain('XXXX-XXXX-XXXX-5678');
    expect(cardNumbers).toContain('XXXX-XXXX-XXXX-4321');
    
    // Step 6: Verify card types displayed
    const cardTypes = await cardManagementPage.getAllCardTypes();
    expect(cardTypes.length).toBe(5);
    
    // Step 7: Verify credit limits displayed
    const creditLimits = await cardManagementPage.getAllCreditLimits();
    expect(creditLimits.length).toBe(5);
    
    // Step 8: Verify available credit displayed
    const availableCredits = await cardManagementPage.getAllAvailableCredits();
    expect(availableCredits.length).toBe(5);
    
    // Step 9: Verify outstanding balances displayed
    const outstandingBalances = await cardManagementPage.getAllOutstandingBalances();
    expect(outstandingBalances.length).toBe(5);
  });

  // Test Case: QE-10513 TS-002 TC-001
  test('TC-014: Verify system supports maximum of 10 credit cards with proper pagination or scrolling', async ({ page }) => {
    // Step 1-2: Launch and authenticate
    await loginPage.login(testData.users.tenCards.username, testData.users.tenCards.password);
    
    // Step 3: Navigate to My Cards
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForCardListLoad();
    
    // Step 4: Verify all 10 cards accessible
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(10);
    
    // Step 5: Verify load time
    const startTime = Date.now();
    await cardManagementPage.waitForAllCardsLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000);
    
    // Step 6-7: Verify pagination or scrolling
    const hasPagination = await cardManagementPage.hasPagination();
    const hasScrolling = await cardManagementPage.hasScrolling();
    expect(hasPagination || hasScrolling).toBe(true);
    
    if (hasPagination) {
      await expect(cardManagementPage.paginationControls).toBeVisible();
      await cardManagementPage.clickNextPage();
      await cardManagementPage.clickPreviousPage();
    }
    
    if (hasScrolling) {
      await cardManagementPage.scrollToBottom();
      const allCardsVisible = await cardManagementPage.areAllCardsAccessible();
      expect(allCardsVisible).toBe(true);
    }
    
    // Step 8: Verify all card details displayed
    const allCardsHaveDetails = await cardManagementPage.verifyAllCardsHaveDetails();
    expect(allCardsHaveDetails).toBe(true);
  });

  // Test Case: QE-10513 TS-003 TC-001
  test('TC-015: Verify appropriate message when user has no registered credit cards', async ({ page }) => {
    // Step 1-2: Launch and authenticate
    await loginPage.login(testData.users.noCards.username, testData.users.noCards.password);
    
    // Step 3: Navigate to My Cards
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForCardListLoad();
    
    // Step 4: Verify no cards message
    await expect(cardManagementPage.noCardsMessage).toBeVisible();
    await expect(cardManagementPage.noCardsMessage).toContainText('No credit cards registered');
    
    // Step 5: Verify add card option
    await expect(cardManagementPage.addCardButton).toBeVisible();
    
    // Step 6: Verify no card list displayed
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(0);
  });
});

// Test Suite for Individual Card Detail Views - Story QE-10443
test.describe('Card Detail Tests', () => {
  let loginPage;
  let cardManagementPage;
  let cardDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    cardDetailPage = new CardDetailPage(page);
    await page.goto(testData.baseUrl);
  });

  // Test Case: QE-10510 TS-001 TC-001
  test('TC-010: Verify detailed card information is displayed within 1 second', async ({ page }) => {
    // Step 1-2: Launch and authenticate
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    // Step 3: Navigate to My Cards
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForCardListLoad();
    
    // Step 4-5: Select card and measure load time
    const startTime = Date.now();
    await cardManagementPage.selectCard('5678');
    await cardDetailPage.waitForCardDetailLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(1000);
    
    // Step 6: Verify Credit Limit
    const creditLimit = await cardDetailPage.getCreditLimit();
    expect(creditLimit).toBe('$10,000.00');
    
    // Step 7: Verify Available Credit
    const availableCredit = await cardDetailPage.getAvailableCredit();
    expect(availableCredit).toBe('$7,500.00');
    
    // Step 8: Verify Outstanding Balance
    const outstandingBalance = await cardDetailPage.getOutstandingBalance();
    expect(outstandingBalance).toBe('$2,500.00');
    
    // Step 9: Verify Statement Balance
    const statementBalance = await cardDetailPage.getStatementBalance();
    expect(statementBalance).toBe('$2,500.00');
    
    // Step 10: Verify Minimum Payment
    const minimumPayment = await cardDetailPage.getMinimumPayment();
    expect(minimumPayment).toBe('$75.00');
    
    // Step 11: Verify Due Date
    const dueDate = await cardDetailPage.getDueDate();
    expect(dueDate).toContain('Feb 15, 2024');
    
    // Step 12: Verify Recent Transactions
    await expect(cardDetailPage.recentTransactionsSection).toBeVisible();
    const transactionCount = await cardDetailPage.getRecentTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(5);
    expect(transactionCount).toBeLessThanOrEqual(10);
  });

  // Test Case: QE-10510 TS-002 TC-001
  test('TC-011: Verify appropriate error message for deactivated card', async ({ page }) => {
    // Step 1-2: Launch and authenticate
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    // Step 3: Navigate to My Cards
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForCardListLoad();
    
    // Step 4: Attempt to select deactivated card
    await page.goto(`${testData.baseUrl}/cards/card_deactivated_001`);
    
    // Step 5: Verify error message
    await expect(cardDetailPage.errorMessage).toBeVisible();
    await expect(cardDetailPage.errorMessage).toContainText('This card is no longer available');
    
    // Step 6: Verify no sensitive information exposed
    const pageContent = await page.content();
    expect(pageContent).not.toContain('stack trace');
    expect(pageContent).not.toContain('SQLException');
    
    // Step 7: Verify back navigation
    await expect(cardDetailPage.backButton).toBeVisible();
    await cardDetailPage.clickBackButton();
    await expect(cardManagementPage.cardListContainer).toBeVisible();
  });

  // Test Case: QE-10510 TS-003 TC-001
  test('TC-012: Verify user-friendly error message with retry when card service unavailable', async ({ page }) => {
    // Step 2: Mock card service unavailability
    await page.route('**/api/cards/*/detail', route => {
      route.fulfill({ status: 503, body: 'Service Unavailable' });
    });
    
    // Step 3: Authenticate
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    // Step 4: Navigate to My Cards
    await cardManagementPage.navigateToMyCards();
    await cardManagementPage.waitForCardListLoad();
    
    // Step 5: Select card
    await cardManagementPage.selectCard('5678');
    
    // Step 6: Verify error message
    await expect(cardDetailPage.errorMessage).toBeVisible();
    await expect(cardDetailPage.errorMessage).toContainText('Unable to load card details');
    
    // Step 7: Verify retry button
    await expect(cardDetailPage.retryButton).toBeVisible();
    await expect(cardDetailPage.retryButton).toBeEnabled();
    
    // Step 8: Verify no technical information
    const pageContent = await page.content();
    expect(pageContent).not.toContain('503');
    expect(pageContent).not.toContain('/api/cards');
    
    // Step 9: Verify application functional
    await expect(cardDetailPage.navigationMenu).toBeVisible();
  });
});
