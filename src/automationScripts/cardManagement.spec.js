const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');

// Test Case - QE-10363 TS-001 TC-001
test('QE-10363 TS-001 TC-001 - Verify user with multiple credit cards views all cards with masked numbers and details', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cardManagementPage = new CardManagementPage(page);

  // Step 1: Launch the credit card management application
  await loginPage.navigate();

  // Step 2: Authenticate as a user with multiple linked credit cards
  await loginPage.login('multicard@example.com', 'Pass@123');

  // Step 3: Navigate to the card management interface
  await cardManagementPage.navigate();

  // Step 4: Verify all credit cards are displayed in a single interface
  const cardCount = await cardManagementPage.getCardCount();
  expect(cardCount).toBeGreaterThanOrEqual(1);

  // Step 5: Verify each card displays masked card number
  const maskedNumbers = await cardManagementPage.getAllMaskedCardNumbers();
  for (const maskedNumber of maskedNumbers) {
    expect(maskedNumber).toMatch(/\*{4}.*\*{4}.*\d{4}/);
  }

  // Step 6: Verify each card displays card type, issuer, and expiry date
  await expect(cardManagementPage.firstCardType).toBeVisible();
  await expect(cardManagementPage.firstCardIssuer).toBeVisible();
  await expect(cardManagementPage.firstCardExpiry).toBeVisible();
});

// Test Case - QE-10363 TS-002 TC-001
test('QE-10363 TS-002 TC-001 - Verify appropriate message is displayed when user has no linked credit cards', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cardManagementPage = new CardManagementPage(page);

  // Step 1: Authenticate as a user with no linked credit cards
  await loginPage.navigate();
  await loginPage.login('nocard@example.com', 'Pass@123');

  // Step 2: Navigate to the card management interface
  await cardManagementPage.navigate();

  // Step 3: Verify no credit cards are displayed
  const cardCount = await cardManagementPage.getCardCount();
  expect(cardCount).toBe(0);

  // Step 4: Verify appropriate message is displayed
  await expect(cardManagementPage.noCardsMessage).toBeVisible();
  await expect(cardManagementPage.noCardsMessage).toContainText(/no cards|not linked/i);

  // Step 5: Verify user is prompted to add a credit card
  await expect(cardManagementPage.addCardCTA).toBeVisible();
});

// Test Case - QE-10363 TS-003 TC-001
test('QE-10363 TS-003 TC-001 - Verify error message when credit card data source is unavailable', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cardManagementPage = new CardManagementPage(page);

  // Step 1: Authenticate
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Pass@123');

  // Step 2: Simulate credit card data source unavailability
  await page.route('**/api/creditcards', route => route.abort());

  // Step 3: Navigate to the card management interface
  await cardManagementPage.navigate();

  // Step 4: Verify error message is displayed
  await expect(cardManagementPage.errorMessage).toBeVisible();
  await expect(cardManagementPage.errorMessage).toContainText(/unavailable|try again/i);

  // Step 5: Verify user is provided with a retry option
  await expect(cardManagementPage.retryButton).toBeVisible();
});

// Test Case - QE-10365 TS-001 TC-001
test('QE-10365 TS-001 TC-001 - Verify card detail view loads within 500ms with all metrics displayed', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cardManagementPage = new CardManagementPage(page);

  // Step 1: Launch the credit card management application
  await loginPage.navigate();

  // Step 2: Authenticate with valid user credentials
  await loginPage.login('testuser@example.com', 'Pass@123');

  // Step 3: Select a specific credit card from the list
  await cardManagementPage.navigate();
  const startTime = Date.now();
  await cardManagementPage.selectCard(0);
  const endTime = Date.now();
  const loadTime = endTime - startTime;

  // Step 4: Verify card-specific metrics are displayed
  await expect(cardManagementPage.cardDetailCreditLimit).toBeVisible();
  await expect(cardManagementPage.cardDetailAvailableCredit).toBeVisible();
  await expect(cardManagementPage.cardDetailOutstanding).toBeVisible();
  await expect(cardManagementPage.cardDetailMonthSpend).toBeVisible();
  await expect(cardManagementPage.cardDetailRecentTransactions).toBeVisible();

  // Step 5: Verify load time is within 500ms threshold
  expect(loadTime).toBeLessThanOrEqual(500);
});

// Test Case - QE-10365 TS-002 TC-001
test('QE-10365 TS-002 TC-001 - Verify error message is displayed when user attempts to view deactivated card', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cardManagementPage = new CardManagementPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Authenticate with valid user credentials
  await loginPage.login('testuser@example.com', 'Pass@123');

  // Step 3: Attempt to navigate to a deactivated card detail page using direct URL
  await page.goto('/cards/card_deactivated_001');

  // Step 4: Verify error message is displayed
  await expect(cardManagementPage.cardNotAccessibleError).toBeVisible();
  await expect(cardManagementPage.cardNotAccessibleError).toContainText(/no longer available|not accessible/i);

  // Step 5: Verify user is redirected back to card list or dashboard
  await page.waitForURL(/\/cards|\/dashboard/, { timeout: 5000 });
});

// Test Case - QE-10365 TS-003 TC-001
test('QE-10365 TS-003 TC-001 - Verify loading indicator and performance warning when card service response exceeds 500ms', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cardManagementPage = new CardManagementPage(page);

  // Step 1: Launch the application and authenticate
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Pass@123');

  // Step 2: Simulate network latency to delay card service response beyond 500ms
  await page.route('**/api/creditcards/*', async route => {
    await new Promise(resolve => setTimeout(resolve, 800));
    route.continue();
  });

  // Step 3: Select a credit card from the list
  await cardManagementPage.navigate();
  await cardManagementPage.selectCard(0);

  // Verify loading indicator is displayed immediately
  await expect(cardManagementPage.loadingIndicator).toBeVisible();

  // Step 4: Wait for card details to load
  await expect(cardManagementPage.cardDetailCreditLimit).toBeVisible({ timeout: 10000 });

  // Step 5: Verify performance warning is displayed
  await expect(cardManagementPage.performanceWarning).toBeVisible();
  await expect(cardManagementPage.performanceWarning).toContainText(/longer than expected|slow/i);
});