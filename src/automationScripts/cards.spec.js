const { test, expect } = require('@playwright/test');
const { CardsPage } = require('./pages/cards.page');
const { LoginPage } = require('./pages/login.page');

// Test Case: QE-9758 TS-001 TC-001
test('QE-9758 TS-001 TC-001 - Verify user can view complete list of all credit cards', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cardsPage = new CardsPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to the 'My Cards' section
  await cardsPage.navigate();
  await expect(cardsPage.cardsContainer).toBeVisible();

  // Step 3: Verify that a list of all credit cards is displayed
  const cardCount = await cardsPage.getCardCount();
  expect(cardCount).toBeGreaterThan(0);

  // Step 4: Verify each card tile displays required information
  const firstCard = await cardsPage.getCardDetails(0);
  expect(firstCard.cardNumber).toContain('****');
  expect(firstCard.cardType).toBeTruthy();
  expect(firstCard.issuer).toBeTruthy();
  expect(firstCard.creditLimit).toContain('$');
  expect(firstCard.currentBalance).toContain('$');
  expect(firstCard.availableBalance).toContain('$');
});

// Test Case: QE-9758 TS-002 TC-001
test('QE-9758 TS-002 TC-001 - Verify user with no cards receives appropriate message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cardsPage = new CardsPage(page);

  // Step 1: Log into the application with user having no cards
  await loginPage.navigate();
  await loginPage.login('newuser_nocards@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to the 'My Cards' section
  await cardsPage.navigate();
  await expect(cardsPage.cardsContainer).toBeVisible();

  // Step 3: Observe the content displayed on the page
  await expect(cardsPage.noCardsMessage).toBeVisible();
  const messageText = await cardsPage.noCardsMessage.textContent();
  expect(messageText).toContain('No credit cards found');
});

// Test Case: QE-9758 TS-003 TC-001
test('QE-9758 TS-003 TC-001 - Verify error message when backend service is unavailable', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cardsPage = new CardsPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Simulate backend card data service unavailability
  await page.route('**/api/cards', route => route.abort('failed'));

  // Step 3: Navigate to the 'My Cards' section
  await cardsPage.navigate();

  // Step 4: Observe the error message and fallback behavior
  await expect(cardsPage.errorMessage).toBeVisible();
  const errorText = await cardsPage.errorMessage.textContent();
  expect(errorText).toContain('Unable to load credit cards');
});

// Test Case: QE-9756 TS-001 TC-001
test('QE-9756 TS-001 TC-001 - Verify user can view detailed spending analysis for specific card', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cardsPage = new CardsPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to the 'My Cards' section
  await cardsPage.navigate();
  await expect(cardsPage.cardsContainer).toBeVisible();

  // Step 3: Select a specific credit card from the list
  await cardsPage.selectCard(0);
  await expect(cardsPage.cardDetailContainer).toBeVisible();

  // Step 4: Verify card detail view displays required information
  await expect(cardsPage.monthlySpendLabel).toBeVisible();
  await expect(cardsPage.creditUtilizationLabel).toBeVisible();
  await expect(cardsPage.categoryBreakdownSection).toBeVisible();
  await expect(cardsPage.recentTransactionsSection).toBeVisible();

  const monthlySpend = await cardsPage.getMonthlySpend();
  expect(monthlySpend).toContain('$');
});

// Test Case: QE-9756 TS-002 TC-001
test('QE-9756 TS-002 TC-001 - Verify card with no transactions displays appropriate message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cardsPage = new CardsPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to the 'My Cards' section
  await cardsPage.navigate();
  await expect(cardsPage.cardsContainer).toBeVisible();

  // Step 3: Select a card with no transactions
  await cardsPage.selectCard(1); // Assuming second card has no transactions
  await expect(cardsPage.cardDetailContainer).toBeVisible();

  // Step 4: Verify monthly spend is $0.00 with appropriate message
  const monthlySpend = await cardsPage.getMonthlySpend();
  expect(monthlySpend).toContain('$0.00');
  await expect(cardsPage.noTransactionsMessage).toBeVisible();
  const messageText = await cardsPage.noTransactionsMessage.textContent();
  expect(messageText).toContain('No transactions found for this card');
});

// Test Case: QE-9756 TS-003 TC-001
test('QE-9756 TS-003 TC-001 - Verify system accurately computes total spend and category percentages', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cardsPage = new CardsPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to 'My Cards' and select a card with multiple categories
  await cardsPage.navigate();
  await expect(cardsPage.cardsContainer).toBeVisible();
  await cardsPage.selectCard(0);
  await expect(cardsPage.cardDetailContainer).toBeVisible();

  // Step 3: Verify total monthly spend is displayed
  const totalSpend = await cardsPage.getMonthlySpend();
  expect(totalSpend).toBeTruthy();

  // Step 4: Verify category breakdown amounts sum to total
  const categoryAmounts = await cardsPage.getCategoryBreakdownAmounts();
  const sum = categoryAmounts.reduce((acc, val) => acc + val, 0);
  const totalSpendValue = parseFloat(totalSpend.replace(/[$,]/g, ''));
  expect(sum).toBeCloseTo(totalSpendValue, 2);

  // Step 5: Verify category breakdown percentages add up to 100%
  const categoryPercentages = await cardsPage.getCategoryBreakdownPercentages();
  const percentageSum = categoryPercentages.reduce((acc, val) => acc + val, 0);
  expect(percentageSum).toBeCloseTo(100, 1);
});
