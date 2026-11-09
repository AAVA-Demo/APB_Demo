const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { MultiCardPage } = require('./pages/multiCard.page');

test.describe('Multi-Card Management', () => {
  let loginPage;
  let dashboardPage;
  let multiCardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    multiCardPage = new MultiCardPage(page);
    await loginPage.navigate();
  });

  test('QE-9015 TS-001 TC-001 - Verify all credit cards are displayed with complete individual details', async ({ page }) => {
    // Step 2: Log in with user credentials who has 5 registered credit cards
    await loginPage.login('testuser_5cards', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Navigate to the multi-card management dashboard
    await dashboardPage.navigateToCards();
    await expect(page).toHaveURL(/.*cards/);

    // Step 4: Verify all 5 credit cards are displayed
    await multiCardPage.waitForCardsToLoad();
    const cardCount = await multiCardPage.getCardCount();
    expect(cardCount).toBe(5);

    // Step 5-11: Verify each card displays complete details
    const cards = await multiCardPage.getAllCards();
    for (const card of cards) {
      await expect(card.cardNumber).toBeVisible();
      await expect(card.cardType).toBeVisible();
      await expect(card.issuer).toBeVisible();
      await expect(card.creditLimit).toBeVisible();
      await expect(card.currentBalance).toBeVisible();
      await expect(card.availableCredit).toBeVisible();
      await expect(card.status).toBeVisible();
    }

    // Verify specific card details
    const firstCard = await multiCardPage.getCardByIndex(0);
    const cardNumber = await firstCard.cardNumber.textContent();
    expect(cardNumber).toMatch(/\*{4}\d{4}/);
  });

  test('QE-9015 TS-002 TC-001 - Verify error message with retry option when card data service returns error', async ({ page }) => {
    // Step 2: Log in with valid user credentials
    await loginPage.login('testuser', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Navigate to the multi-card management dashboard
    await dashboardPage.navigateToCards();

    // Step 4: Simulate card data service error
    await page.route('**/api/cards', route => route.abort());
    await page.reload();

    // Step 5: Verify error message is displayed instead of card list
    await multiCardPage.waitForErrorMessage();
    const errorMessage = await multiCardPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load card portfolio');

    // Step 6: Verify card list is not displayed
    const cardCount = await multiCardPage.getCardCount();
    expect(cardCount).toBe(0);

    // Step 7: Verify retry option is available
    await expect(multiCardPage.retryButton).toBeVisible();
    await expect(multiCardPage.retryButton).toBeEnabled();
  });

  test('QE-9015 TS-003 TC-001 - Verify card filtering by type displays only matching cards', async ({ page }) => {
    // Step 2: Log in with user credentials who has 10 registered credit cards
    await loginPage.login('testuser_10cards', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Navigate to the multi-card management dashboard
    await dashboardPage.navigateToCards();
    await multiCardPage.waitForCardsToLoad();

    // Step 4: Verify all 10 cards are initially displayed
    const initialCount = await multiCardPage.getCardCount();
    expect(initialCount).toBe(10);

    // Step 5: Enter 'Visa' in the card filter search box
    await multiCardPage.filterCards('Visa');

    // Step 6: Verify only Visa cards are displayed
    await multiCardPage.waitForFilterResults();
    const filteredCount = await multiCardPage.getCardCount();
    expect(filteredCount).toBe(4);

    // Step 7: Verify non-Visa cards are not displayed
    const visibleCards = await multiCardPage.getAllCards();
    for (const card of visibleCards) {
      const cardType = await card.cardType.textContent();
      expect(cardType).toContain('Visa');
    }
  });

  test('QE-9017 TS-001 TC-001 - Verify detailed spend analysis for card with transaction history', async ({ page }) => {
    // Step 2: Log in with user credentials who has credit cards with transaction history
    await loginPage.login('testuser_history', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Navigate to the multi-card management page
    await dashboardPage.navigateToCards();
    await multiCardPage.waitForCardsToLoad();

    // Step 4: Select a credit card with transaction history
    await multiCardPage.selectCard('****1234');
    await expect(page).toHaveURL(/.*cards\/1/);

    // Step 5: Verify total spend amount is displayed
    await multiCardPage.waitForSpendAnalysisToLoad();
    const yearlySpend = await multiCardPage.getYearlySpend();
    expect(yearlySpend).toContain('14,000');

    // Step 6: Verify category-wise breakdown is displayed for all nine categories
    const categories = await multiCardPage.getAllCategories();
    expect(categories.length).toBe(9);
    
    const categoryNames = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const categoryName of categoryNames) {
      const categoryExists = await multiCardPage.categoryExists(categoryName);
      expect(categoryExists).toBeTruthy();
    }

    // Step 7: Verify monthly trend chart is displayed for past 12 months
    await expect(multiCardPage.trendChart).toBeVisible();
    const chartMonths = await multiCardPage.getTrendChartMonths();
    expect(chartMonths.length).toBe(12);
  });

  test('QE-9017 TS-002 TC-001 - Verify message for card with no transaction history', async ({ page }) => {
    // Step 2: Log in with user credentials who has a card with no transaction history
    await loginPage.login('testuser_newcard', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Navigate to the multi-card management page
    await dashboardPage.navigateToCards();
    await multiCardPage.waitForCardsToLoad();

    // Step 4: Select a credit card with no transaction history
    await multiCardPage.selectCard('****7890');
    await expect(page).toHaveURL(/.*cards\/5/);

    // Step 5: Verify message indicating no spending data is displayed
    const message = await multiCardPage.getNoSpendingDataMessage();
    expect(message).toContain('No spending data is available for the selected card');

    // Step 6: Verify spend analysis section shows zero or empty values
    const yearlySpend = await multiCardPage.getYearlySpend();
    expect(yearlySpend).toContain('0');
  });

  test('QE-9017 TS-003 TC-001 - Verify error message when transaction service fails', async ({ page }) => {
    // Step 2: Log in with valid user credentials
    await loginPage.login('testuser', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Navigate to the multi-card management page
    await dashboardPage.navigateToCards();
    await multiCardPage.waitForCardsToLoad();

    // Step 4: Select a credit card to view spending analysis
    await multiCardPage.selectCardByIndex(0);

    // Step 5: Simulate transaction service failure
    await page.route('**/api/transactions/card/**', route => route.abort());
    await page.reload();

    // Step 6: Verify error message is displayed to the user
    await multiCardPage.waitForSpendingErrorMessage();
    const errorMessage = await multiCardPage.getSpendingErrorMessage();
    expect(errorMessage).toContain('Failed to load card spending data');

    // Step 7: Verify retry option is available
    await expect(multiCardPage.spendingRetryButton).toBeVisible();
    await expect(multiCardPage.spendingRetryButton).toBeEnabled();
  });
});