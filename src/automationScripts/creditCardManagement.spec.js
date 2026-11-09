const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Credit Card Management - Multiple Cards Display', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
  });

  test('QE-8184 TS-001 TC-001 - Verify consolidated card list displays all registered cards with proper formatting', async ({ page }) => {
    // Step 1: Log in with user having five registered credit cards
    await loginPage.login(testData.users.fiveCardsUser.username, testData.users.fiveCardsUser.password);

    // Step 2: Navigate to My Cards section
    await cardManagementPage.navigate();
    await expect(page).toHaveURL(/.*cards/);

    // Step 3: Verify consolidated list displays all five credit cards
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);

    // Step 4: Verify each card displays card type name
    const cardTypes = await cardManagementPage.getAllCardTypes();
    expect(cardTypes.length).toBe(5);
    cardTypes.forEach(type => {
      expect(type).toBeTruthy();
    });

    // Step 5: Verify each card displays credit limit formatted to 2 decimal places
    const creditLimits = await cardManagementPage.getAllCreditLimits();
    creditLimits.forEach(limit => {
      expect(limit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    });

    // Step 6: Verify each card displays outstanding balance formatted to 2 decimal places
    const outstandingBalances = await cardManagementPage.getAllOutstandingBalances();
    outstandingBalances.forEach(balance => {
      expect(balance).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    });
  });

  test('QE-8184 TS-002 TC-001 - Verify informational message when user has no registered credit cards', async ({ page }) => {
    // Step 1: Log in with user having no registered cards
    await loginPage.login(testData.users.noCardsUser.username, testData.users.noCardsUser.password);

    // Step 2: Navigate to My Cards section
    await cardManagementPage.navigate();

    // Step 3: Verify informational message is displayed
    await expect(cardManagementPage.noCardsMessage).toBeVisible();
    const messageText = await cardManagementPage.getNoCardsMessageText();
    expect(messageText).toContain('No credit cards');

    // Step 4: Verify no card list is displayed
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(0);
  });

  test('QE-8184 TS-003 TC-001 - Verify available credit calculation for all cards in the list', async ({ page }) => {
    // Step 1: Log in with user having multiple cards
    await loginPage.login(testData.users.multiCardUser.username, testData.users.multiCardUser.password);

    // Step 2: Navigate to My Cards section
    await cardManagementPage.navigate();

    // Step 3: For first card, verify available credit calculation
    const firstCardAvailable = await cardManagementPage.getAvailableCreditForCard(0);
    expect(firstCardAvailable).toBe('$7,500.00');

    // Step 4: For second card, verify available credit calculation
    const secondCardAvailable = await cardManagementPage.getAvailableCreditForCard(1);
    expect(secondCardAvailable).toBe('$10,000.00');

    // Step 5: Verify all displayed available credit values are formatted to 2 decimal places
    const allAvailableCredits = await cardManagementPage.getAllAvailableCredits();
    allAvailableCredits.forEach(credit => {
      expect(credit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
      const decimalPart = credit.split('.')[1];
      expect(decimalPart.length).toBe(2);
    });

    // Step 6: Verify calculation for card with zero outstanding balance
    const zeroBalanceCard = await cardManagementPage.getCardWithZeroBalance();
    if (zeroBalanceCard) {
      const creditLimit = await cardManagementPage.getCreditLimitForCard(zeroBalanceCard);
      const availableCredit = await cardManagementPage.getAvailableCreditForCard(zeroBalanceCard);
      expect(availableCredit).toBe(creditLimit);
    }
  });
});

test.describe('Credit Card Management - Card-Wise Spend Analysis', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
  });

  test('QE-8186 TS-001 TC-001 - Verify detailed spend analysis for selected card', async ({ page }) => {
    // Step 1: Log in with user having multiple credit cards
    await loginPage.login(testData.users.multiCardUser.username, testData.users.multiCardUser.password);

    // Step 2: Navigate to My Cards section
    await cardManagementPage.navigate();

    // Step 3: Select a specific credit card from the list
    await cardManagementPage.selectCard('Visa Gold - **** 1234');
    await expect(page).toHaveURL(/.*cards\/.*/);

    // Step 4: Verify total spend amount is displayed for the selected card
    await expect(cardManagementPage.totalSpendLabel).toBeVisible();
    const totalSpend = await cardManagementPage.getTotalSpendValue();
    expect(totalSpend).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);

    // Step 5: Verify category-wise breakdown displays all nine categories
    const categories = await cardManagementPage.getAllCategories();
    expect(categories.length).toBe(9);
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expectedCategories.forEach(category => {
      expect(categories).toContain(category);
    });

    // Step 6: Verify complete transaction history is displayed
    await expect(cardManagementPage.transactionHistoryTable).toBeVisible();
    const transactionCount = await cardManagementPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    const firstTransaction = await cardManagementPage.getTransactionDetails(0);
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.merchant).toBeTruthy();
    expect(firstTransaction.category).toBeTruthy();
    expect(firstTransaction.amount).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
  });

  test('QE-8186 TS-002 TC-001 - Verify validation error for deleted or inaccessible card', async ({ page }) => {
    // Step 1: Log in
    await loginPage.login(testData.users.testUser.username, testData.users.testUser.password);

    // Step 2: Attempt to access card detail page using deleted card ID
    await page.goto(testData.baseURL + '/cards/deleted_card_999');

    // Step 3: Verify validation error message is displayed
    await expect(cardManagementPage.errorMessage).toBeVisible();
    const errorText = await cardManagementPage.getErrorMessageText();
    expect(errorText).toMatch(/Card not found|no longer accessible/i);

    // Step 4: Verify user is redirected to card list page or error page
    await page.waitForTimeout(2000); // Wait for potential redirect
    const currentURL = page.url();
    expect(currentURL).toMatch(/\/cards$|\/error/);
  });

  test('QE-8186 TS-003 TC-001 - Verify spend analysis for card with zero transactions', async ({ page }) => {
    // Step 1: Log in with user having a card with zero transactions
    await loginPage.login(testData.users.newCardUser.username, testData.users.newCardUser.password);

    // Step 2: Navigate to My Cards and select the card with no transactions
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('New Visa - **** 5678');

    // Step 3: Verify total spend displays $0.00
    const totalSpend = await cardManagementPage.getTotalSpendValue();
    expect(totalSpend).toBe('$0.00');

    // Step 4: Verify all nine category breakdowns display $0.00
    const categoryAmounts = await cardManagementPage.getAllCategoryAmounts();
    categoryAmounts.forEach(amount => {
      expect(amount).toBe('$0.00');
    });

    // Step 5: Verify transaction history section displays empty state message
    await expect(cardManagementPage.emptyTransactionMessage).toBeVisible();
    const emptyMessage = await cardManagementPage.getEmptyTransactionMessageText();
    expect(emptyMessage).toMatch(/No transactions found/i);
  });
});