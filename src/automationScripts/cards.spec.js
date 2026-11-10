const { test, expect } = require('@playwright/test');
const { CardsPage } = require('./pages/cards.page');
const { CardDetailPage } = require('./pages/cardDetail.page');
const { LoginPage } = require('./pages/login.page');

// Test cases for QE-9655 - Multi-Card Display and Selection
test.describe('Multi-Card Display and Selection', () => {
  let cardsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardsPage = new CardsPage(page);
    await loginPage.navigate();
  });

  test('QE-9798 TS-001 TC-001 - Verify user with 5 credit cards can view all cards with clear visual distinction', async ({ page }) => {
    await loginPage.login('user_5cards@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.waitForCardsToLoad();
    
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(5);
    
    const startTime = Date.now();
    await cardsPage.selectCardByIndex(0);
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(500);
  });

  test('QE-9798 TS-001 TC-002 - Verify card selection response time is under 500ms for user with 10 credit cards', async ({ page }) => {
    await loginPage.login('user_10cards@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.waitForCardsToLoad();
    
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(10);
    
    const startTime = Date.now();
    await cardsPage.selectCardByIndex(0);
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(500);
  });

  test('QE-9798 TS-001 TC-003 - Verify visual distinction between different card types', async ({ page }) => {
    await loginPage.login('user_mixed_cards@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.waitForCardsToLoad();
    
    const visaCard = await cardsPage.getCardByType('Visa');
    const mastercardCard = await cardsPage.getCardByType('Mastercard');
    const amexCard = await cardsPage.getCardByType('Amex');
    
    await expect(visaCard).toBeVisible();
    await expect(mastercardCard).toBeVisible();
    await expect(amexCard).toBeVisible();
    
    const visaLogo = await cardsPage.getCardLogo(visaCard);
    const mastercardLogo = await cardsPage.getCardLogo(mastercardCard);
    const amexLogo = await cardsPage.getCardLogo(amexCard);
    
    expect(visaLogo).toBeTruthy();
    expect(mastercardLogo).toBeTruthy();
    expect(amexLogo).toBeTruthy();
  });

  test('QE-9798 TS-002 TC-001 - Verify system fails to load all 10 cards when performance bottleneck is present', async ({ page }) => {
    await page.route('**/api/cards', route => {
      setTimeout(() => route.continue(), 10000);
    });
    
    await loginPage.login('user_10cards@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    
    await page.waitForTimeout(5000);
    
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBeLessThan(10);
    
    const errorMessage = await cardsPage.getErrorMessage();
    expect(errorMessage).toContain('Unable to load all cards');
  });

  test('QE-9798 TS-002 TC-002 - Verify error message when system fails to load all cards due to backend failure', async ({ page }) => {
    await page.route('**/api/cards', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });
    
    await loginPage.login('user_10cards@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    
    const errorMessage = await cardsPage.getErrorMessage();
    expect(errorMessage).toContain('Unable to load your credit cards');
  });

  test('QE-9798 TS-002 TC-003 - Verify user can retry loading cards after initial failure', async ({ page }) => {
    let requestCount = 0;
    await page.route('**/api/cards', route => {
      requestCount++;
      if (requestCount === 1) {
        route.fulfill({ status: 500, body: 'Internal Server Error' });
      } else {
        route.continue();
      }
    });
    
    await loginPage.login('user_10cards@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    
    await cardsPage.clickRetryButton();
    await cardsPage.waitForCardsToLoad();
    
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(10);
  });

  test('QE-9798 TS-003 TC-001 - Verify card selection exceeds 500ms response time when API response is slow', async ({ page }) => {
    await page.route('**/api/cards/**/details', route => {
      setTimeout(() => route.continue(), 1000);
    });
    
    await loginPage.login('testuser@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.waitForCardsToLoad();
    
    const startTime = Date.now();
    await cardsPage.selectCardByIndex(0);
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeGreaterThan(500);
  });

  test('QE-9798 TS-003 TC-002 - Verify user experience is degraded when card switching takes longer than 500ms', async ({ page }) => {
    await page.route('**/api/cards/**/details', route => {
      setTimeout(() => route.continue(), 1000);
    });
    
    await loginPage.login('testuser@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.waitForCardsToLoad();
    
    await cardsPage.selectCardByIndex(0);
    const loadingSpinner = await cardsPage.getLoadingSpinner();
    await expect(loadingSpinner).toBeVisible();
  });

  test('QE-9798 TS-003 TC-003 - Verify card selection meets 500ms NFR when API response is optimized', async ({ page }) => {
    await loginPage.login('testuser@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.waitForCardsToLoad();
    
    const startTime = Date.now();
    await cardsPage.selectCardByIndex(0);
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(500);
  });
});

// Test cases for QE-9658 - Card-Specific Spending Analysis
test.describe('Card-Specific Spending Analysis', () => {
  let cardsPage;
  let cardDetailPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardsPage = new CardsPage(page);
    cardDetailPage = new CardDetailPage(page);
    await loginPage.navigate();
  });

  test('QE-9795 TS-001 TC-001 - Verify user can select a specific card and view transaction history filtered exclusively', async ({ page }) => {
    await loginPage.login('user_multiple_cards@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.selectCardByNumber('****1234');
    
    await cardDetailPage.navigateToSpendingAnalysis();
    await cardDetailPage.waitForTransactionsToLoad();
    
    const transactions = await cardDetailPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    
    // Verify all transactions belong to selected card
    for (const transaction of transactions) {
      const cardNumber = await cardDetailPage.getTransactionCardNumber(transaction);
      expect(cardNumber).toContain('****1234');
    }
  });

  test('QE-9795 TS-001 TC-002 - Verify spending breakdown is filtered correctly when switching between different cards', async ({ page }) => {
    await loginPage.login('user_multi_pattern@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    
    await cardsPage.selectCardByNumber('****1234');
    await cardDetailPage.navigateToSpendingAnalysis();
    const card1TotalSpend = await cardDetailPage.getTotalSpend();
    const card1TopCategory = await cardDetailPage.getTopCategory();
    
    await cardsPage.navigateToCards();
    await cardsPage.selectCardByNumber('****5678');
    await cardDetailPage.navigateToSpendingAnalysis();
    const card2TotalSpend = await cardDetailPage.getTotalSpend();
    const card2TopCategory = await cardDetailPage.getTopCategory();
    
    expect(card1TotalSpend).not.toBe(card2TotalSpend);
    expect(card1TopCategory).not.toBe(card2TopCategory);
  });

  test('QE-9795 TS-001 TC-003 - Verify transaction history pagination works correctly for card-specific view', async ({ page }) => {
    await loginPage.login('user_many_txn@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.selectCardByNumber('****1234');
    
    await cardDetailPage.navigateToSpendingAnalysis();
    await cardDetailPage.waitForTransactionsToLoad();
    
    const page1Transactions = await cardDetailPage.getAllTransactions();
    expect(page1Transactions.length).toBe(20);
    
    await cardDetailPage.clickNextPage();
    const page2Transactions = await cardDetailPage.getAllTransactions();
    expect(page2Transactions.length).toBeGreaterThan(0);
    
    // Verify all transactions still belong to selected card
    for (const transaction of page2Transactions) {
      const cardNumber = await cardDetailPage.getTransactionCardNumber(transaction);
      expect(cardNumber).toContain('****1234');
    }
  });

  test('QE-9795 TS-002 TC-001 - Verify appropriate message when user selects a card with no transactions', async ({ page }) => {
    await loginPage.login('user_new_card@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.selectCardByNumber('****9012');
    
    await cardDetailPage.navigateToSpendingAnalysis();
    
    const noDataMessage = await cardDetailPage.getNoDataMessage();
    expect(noDataMessage).toContain('No transaction data available for this card');
  });

  test('QE-9795 TS-002 TC-002 - Verify spending breakdown shows zero values for all categories when card has no transactions', async ({ page }) => {
    await loginPage.login('user_new_card@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.selectCardByNumber('****9012');
    
    await cardDetailPage.navigateToSpendingAnalysis();
    
    const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    for (const category of categories) {
      const categoryAmount = await cardDetailPage.getCategoryAmount(category);
      expect(categoryAmount).toBe(0);
    }
    
    const totalSpend = await cardDetailPage.getTotalSpend();
    expect(totalSpend).toBe(0);
  });

  test('QE-9795 TS-002 TC-003 - Verify user can navigate back to card list after viewing card with no transactions', async ({ page }) => {
    await loginPage.login('user_new_card@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.selectCardByNumber('****9012');
    
    await cardDetailPage.navigateToSpendingAnalysis();
    await cardDetailPage.clickBackToCards();
    
    await cardsPage.waitForCardsToLoad();
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('QE-9795 TS-003 TC-001 - Verify data isolation error is detected when system returns transactions from different card', async ({ page }) => {
    await loginPage.login('user_known_cards@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.selectCardByNumber('****1234');
    
    await cardDetailPage.navigateToSpendingAnalysis();
    await cardDetailPage.waitForTransactionsToLoad();
    
    const transactions = await cardDetailPage.getAllTransactions();
    
    // Check for data isolation violation
    for (const transaction of transactions) {
      const cardNumber = await cardDetailPage.getTransactionCardNumber(transaction);
      if (!cardNumber.includes('****1234')) {
        // Data isolation violation detected
        console.error('Data isolation violation: Transaction from different card found');
        expect(cardNumber).toContain('****1234');
      }
    }
  });

  test('QE-9795 TS-003 TC-002 - Verify spending breakdown totals match only the selected card transactions', async ({ page }) => {
    await loginPage.login('user_two_cards@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    await cardsPage.selectCardByNumber('****1234');
    
    await cardDetailPage.navigateToSpendingAnalysis();
    
    const totalSpend = await cardDetailPage.getTotalSpend();
    expect(totalSpend).toBe(1000);
    
    const categoryTotals = await cardDetailPage.getAllCategoryTotals();
    const sumOfCategories = categoryTotals.reduce((sum, amount) => sum + amount, 0);
    expect(sumOfCategories).toBe(1000);
  });

  test('QE-9795 TS-003 TC-003 - Verify card context is maintained correctly when rapidly switching between multiple cards', async ({ page }) => {
    await loginPage.login('user_three_cards@test.com', 'SecurePass123!');
    await cardsPage.navigateToCards();
    
    await cardsPage.selectCardByNumber('****1234');
    await cardDetailPage.navigateToSpendingAnalysis();
    const card1Total = await cardDetailPage.getTotalSpend();
    expect(card1Total).toBe(1000);
    
    await cardsPage.navigateToCards();
    await cardsPage.selectCardByNumber('****5678');
    await cardDetailPage.navigateToSpendingAnalysis();
    const card2Total = await cardDetailPage.getTotalSpend();
    expect(card2Total).toBe(2000);
    
    await cardsPage.navigateToCards();
    await cardsPage.selectCardByNumber('****9012');
    await cardDetailPage.navigateToSpendingAnalysis();
    const card3Total = await cardDetailPage.getTotalSpend();
    expect(card3Total).toBe(1500);
  });
});