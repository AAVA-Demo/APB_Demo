const { test, expect } = require('@playwright/test');
const { CardsPage } = require('./pages/cards.page');
const { AuthService } = require('./services/auth.service');

// Test cases for Cards Module - QE-8090 and QE-8088

test.describe('Multiple Credit Card Portfolio Tests - QE-8090', () => {
  let cardsPage;
  let authService;

  test.beforeEach(async ({ page }) => {
    cardsPage = new CardsPage(page);
    authService = new AuthService(page);
  });

  test('QE-8090 TS-001 TC-001: Verify card management interface displays complete portfolio view for user with 5 registered credit cards within 500ms', async ({ page }) => {
    // Step 1: Authenticate user with 5 registered credit cards
    await authService.login('user_5cards', 'password123');

    // Step 2: Navigate to the card management interface
    const startTime = Date.now();
    await cardsPage.navigate();

    // Step 3: Verify all 5 credit cards are displayed in the portfolio view
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(5);

    // Step 4: Verify each card displays individual spending, credit limit, available credit, and outstanding balance
    const cards = await cardsPage.getAllCards();
    for (const card of cards) {
      await expect(card.locator('[data-testid="card-spending"], .monthly-spend')).toBeVisible();
      await expect(card.locator('[data-testid="card-credit-limit"], .credit-limit')).toBeVisible();
      await expect(card.locator('[data-testid="card-available-credit"], .available-credit')).toBeVisible();
      await expect(card.locator('[data-testid="card-outstanding"], .outstanding-balance')).toBeVisible();
    }

    // Step 5: Measure data retrieval time from request to display completion
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(500); // Performance threshold: < 500ms
  });

  test('QE-8090 TS-002 TC-001: Verify card management interface displays appropriate message when user has 0 registered credit cards', async ({ page }) => {
    // Step 1: Authenticate user with 0 registered credit cards
    await authService.login('user_no_cards', 'password123');

    // Step 2: Navigate to the card management interface
    await cardsPage.navigate();

    // Step 3: Verify no credit cards are displayed in the portfolio view
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(0);

    // Step 4: Verify appropriate message is displayed indicating no registered cards
    const emptyMessage = await cardsPage.getEmptyStateMessage();
    expect(emptyMessage).toMatch(/No credit cards are registered|No cards found/i);

    // Step 5: Verify prompt or guidance to add a credit card is displayed
    const addCardPrompt = await cardsPage.getAddCardPrompt();
    expect(addCardPrompt).toMatch(/Add a credit card|Add card/i);
    await expect(cardsPage.addCardButton).toBeVisible();
  });

  test('QE-8090 TS-003 TC-001: Verify card management interface meets NFR requirement by displaying 10 registered credit cards with accurate financial details within 500ms', async ({ page }) => {
    // Step 1: Authenticate user with 10 registered credit cards (NFR minimum)
    await authService.login('user_10cards_nfr', 'password123');

    // Step 2: Navigate to the card management interface
    const startTime = Date.now();
    await cardsPage.navigate();

    // Step 3: Verify all 10 credit cards are displayed in the portfolio view
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBe(10);

    // Step 4: Verify each of the 10 cards displays accurate individual financial details
    const cards = await cardsPage.getAllCards();
    expect(cards.length).toBe(10);
    for (const card of cards) {
      const hasCompleteMetrics = await cardsPage.cardHasCompleteFinancialMetrics(card);
      expect(hasCompleteMetrics).toBe(true);
    }

    // Step 5: Measure data retrieval time from request to display completion
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(500); // Performance threshold: < 500ms (NFR compliance)
  });
});

test.describe('Card Comparison Tests - QE-8088', () => {
  let cardsPage;
  let authService;

  test.beforeEach(async ({ page }) => {
    cardsPage = new CardsPage(page);
    authService = new AuthService(page);
  });

  test('QE-8088 TS-001 TC-001: Verify card comparison feature displays side-by-side view for 2 selected credit cards with all financial metrics', async ({ page }) => {
    // Step 1: Authenticate user with multiple credit cards in portfolio
    await authService.login('user_multiple_cards', 'password123');

    // Step 2: Navigate to the card management interface
    await cardsPage.navigate();
    await expect(cardsPage.cardsContainer).toBeVisible();

    // Step 3: Select 2 credit cards for comparison
    const cards = await cardsPage.getAllCards();
    await cardsPage.selectCardForComparison(cards[0]);
    await cardsPage.selectCardForComparison(cards[1]);
    const selectedCount = await cardsPage.getSelectedCardCount();
    expect(selectedCount).toBe(2);

    // Step 4: Activate comparison mode
    await cardsPage.activateComparisonMode();
    await expect(cardsPage.comparisonView).toBeVisible();

    // Step 5: Verify comparison view displays credit limits for both cards
    const creditLimits = await cardsPage.getComparisonCreditLimits();
    expect(creditLimits.length).toBe(2);

    // Step 6: Verify comparison view displays available credit for both cards
    const availableCredits = await cardsPage.getComparisonAvailableCredits();
    expect(availableCredits.length).toBe(2);

    // Step 7: Verify comparison view displays spending for both cards
    const spendings = await cardsPage.getComparisonSpendings();
    expect(spendings.length).toBe(2);

    // Step 8: Verify comparison view displays outstanding balances for both cards
    const outstandingBalances = await cardsPage.getComparisonOutstandingBalances();
    expect(outstandingBalances.length).toBe(2);
  });

  test('QE-8088 TS-002 TC-001: Verify card comparison feature displays side-by-side view for 5 selected credit cards in tabular format with all financial details', async ({ page }) => {
    // Step 1: Authenticate user with multiple credit cards in portfolio
    await authService.login('user_multiple_cards', 'password123');

    // Step 2: Navigate to the card management interface
    await cardsPage.navigate();

    // Step 3: Select 5 credit cards for comparison
    const cards = await cardsPage.getAllCards();
    for (let i = 0; i < 5; i++) {
      await cardsPage.selectCardForComparison(cards[i]);
    }
    const selectedCount = await cardsPage.getSelectedCardCount();
    expect(selectedCount).toBe(5);

    // Step 4: Activate comparison mode
    await cardsPage.activateComparisonMode();
    await expect(cardsPage.comparisonView).toBeVisible();
    const isTabularLayout = await cardsPage.isComparisonTabularLayout();
    expect(isTabularLayout).toBe(true);

    // Step 5: Verify comparison table displays all 5 cards with credit limits
    const creditLimits = await cardsPage.getComparisonCreditLimits();
    expect(creditLimits.length).toBe(5);

    // Step 6: Verify comparison table displays available credit for all 5 cards
    const availableCredits = await cardsPage.getComparisonAvailableCredits();
    expect(availableCredits.length).toBe(5);

    // Step 7: Verify comparison table displays spending for all 5 cards
    const spendings = await cardsPage.getComparisonSpendings();
    expect(spendings.length).toBe(5);

    // Step 8: Verify comparison table displays outstanding balances for all 5 cards
    const outstandingBalances = await cardsPage.getComparisonOutstandingBalances();
    expect(outstandingBalances.length).toBe(5);
  });

  test('QE-8088 TS-003 TC-001: Verify card comparison mode cannot be activated without selecting any credit cards and displays appropriate validation message', async ({ page }) => {
    // Step 1: Authenticate user with multiple credit cards in portfolio
    await authService.login('user_multiple_cards', 'password123');

    // Step 2: Navigate to the card management interface
    await cardsPage.navigate();
    await expect(cardsPage.cardsContainer).toBeVisible();

    // Step 3: Attempt to activate comparison mode without selecting any credit cards
    const selectedCount = await cardsPage.getSelectedCardCount();
    expect(selectedCount).toBe(0);
    await cardsPage.attemptActivateComparisonMode();

    // Step 4: Verify validation message is displayed prompting user to select cards
    const validationMessage = await cardsPage.getValidationMessage();
    expect(validationMessage).toMatch(/Please select at least one card|Select cards to compare/i);

    // Step 5: Verify comparison view is not displayed or remains disabled
    const isComparisonActive = await cardsPage.isComparisonModeActive();
    expect(isComparisonActive).toBe(false);
    const comparisonViewVisible = await cardsPage.comparisonView.isVisible().catch(() => false);
    expect(comparisonViewVisible).toBe(false);
  });
});