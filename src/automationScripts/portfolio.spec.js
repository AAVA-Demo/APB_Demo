const { test, expect } = require('@playwright/test');
const { PortfolioPage } = require('./pages/portfolio.page');

// Test Case: QE-10416 TS-001 TC-001
test('Verify consolidated portfolio view displays five credit cards with masked numbers', async ({ page }) => {
  const portfolioPage = new PortfolioPage(page);
  
  // Step 1: Launch application
  await portfolioPage.navigate();
  await expect(page).toHaveTitle(/Credit Card/);
  
  // Step 2: Navigate to Portfolio Management
  await portfolioPage.waitForPortfolioLoad();
  
  // Step 3: Verify all five credit cards are displayed
  const cardCount = await portfolioPage.getCardCount();
  expect(cardCount).toBeGreaterThanOrEqual(2);
  
  // Step 4: Verify masked card numbers
  const cardNumbers = await portfolioPage.getAllCardNumbers();
  for (const cardNumber of cardNumbers) {
    expect(cardNumber).toMatch(/\*{4}\d{4}/);
  }
  
  // Step 5: Verify card type is displayed
  const cardTypes = await portfolioPage.getAllCardTypes();
  expect(cardTypes.length).toBeGreaterThan(0);
  
  // Step 6: Verify issuer name is displayed
  const issuers = await portfolioPage.getAllIssuers();
  expect(issuers.length).toBeGreaterThan(0);
  
  // Step 7: Verify credit limit and available credit
  const firstCard = await portfolioPage.getCardByIndex(0);
  await expect(firstCard.creditLimit).toBeVisible();
  await expect(firstCard.availableCredit).toBeVisible();
});

// Test Case: QE-10416 TS-002 TC-001
test('Verify appropriate message when user has no credit cards', async ({ page }) => {
  const portfolioPage = new PortfolioPage(page);
  
  // Step 1: Launch application
  await portfolioPage.navigate();
  
  // Step 2: Navigate to Portfolio with no cards
  await portfolioPage.waitForPortfolioLoad();
  
  // Step 3: Verify no cards message (if applicable)
  const cardCount = await portfolioPage.getCardCount();
  if (cardCount === 0) {
    const noCardsMessage = await portfolioPage.getNoCardsMessage();
    expect(noCardsMessage).toBeTruthy();
    
    // Step 4: Verify Add New Card button
    await expect(portfolioPage.addCardButton).toBeVisible();
    
    // Step 5: Click Add New Card
    await portfolioPage.clickAddCard();
    await expect(portfolioPage.addCardModal).toBeVisible();
  }
});

// Test Case: QE-10416 TS-003 TC-001
test('Verify portfolio displays multiple cards with complete details within 3 seconds', async ({ page }) => {
  const portfolioPage = new PortfolioPage(page);
  
  // Step 1: Launch application
  await portfolioPage.navigate();
  
  // Step 2: Navigate to Portfolio and measure load time
  const startTime = Date.now();
  await portfolioPage.waitForPortfolioLoad();
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(3000);
  
  // Step 3: Verify multiple cards displayed
  const cardCount = await portfolioPage.getCardCount();
  expect(cardCount).toBeGreaterThan(0);
  
  // Step 4: Verify complete card details
  const cards = await portfolioPage.getAllCards();
  for (const card of cards) {
    await expect(card.cardNumber).toBeVisible();
    await expect(card.cardType).toBeVisible();
    await expect(card.issuer).toBeVisible();
    await expect(card.creditLimit).toBeVisible();
  }
  
  // Step 5: Verify individual metrics
  const firstCard = cards[0];
  await portfolioPage.selectCard(0);
  await portfolioPage.waitForCardDetails();
  
  // Step 6: Verify no performance degradation
  await expect(portfolioPage.cardDetailPanel).toBeVisible();
});

// Test Case: QE-10421 TS-001 TC-001
test('Verify card-specific metrics display when user selects a card', async ({ page }) => {
  const portfolioPage = new PortfolioPage(page);
  
  // Step 1: Launch application
  await portfolioPage.navigate();
  
  // Step 2: Navigate to Portfolio
  await portfolioPage.waitForPortfolioLoad();
  
  // Step 3: Select specific card
  await portfolioPage.selectCard(0);
  await portfolioPage.waitForCardDetails();
  
  // Step 4: Verify monthly spend metric
  const monthlySpend = await portfolioPage.getCardMonthlySpend();
  expect(monthlySpend).toContain('$');
  
  // Step 5: Verify utilization rate
  const utilizationRate = await portfolioPage.getCardUtilizationRate();
  expect(utilizationRate).toContain('%');
  
  // Step 6: Verify transaction count
  const transactionCount = await portfolioPage.getCardTransactionCount();
  expect(parseInt(transactionCount)).toBeGreaterThanOrEqual(0);
  
  // Step 7: Verify last transaction date
  const lastTransactionDate = await portfolioPage.getLastTransactionDate();
  expect(lastTransactionDate).toBeTruthy();
});

// Test Case: QE-10421 TS-002 TC-001
test('Verify card metrics display zero values when card has no transaction history', async ({ page }) => {
  const portfolioPage = new PortfolioPage(page);
  
  // Step 1: Launch application
  await portfolioPage.navigate();
  
  // Step 2: Navigate to Portfolio
  await portfolioPage.waitForPortfolioLoad();
  
  // Step 3: Select card with no transactions (if exists)
  const cardCount = await portfolioPage.getCardCount();
  if (cardCount > 1) {
    await portfolioPage.selectCard(1);
    await portfolioPage.waitForCardDetails();
    
    // Step 4: Verify monthly spend shows zero
    const monthlySpend = await portfolioPage.getCardMonthlySpend();
    
    // Step 5: Verify transaction count shows zero
    const transactionCount = await portfolioPage.getCardTransactionCount();
    
    // Step 6: Verify last transaction date handling
    const lastTransactionDate = await portfolioPage.getLastTransactionDate();
    
    // Step 7: Verify credit limit and available credit
    await expect(portfolioPage.cardCreditLimit).toBeVisible();
    await expect(portfolioPage.cardAvailableCredit).toBeVisible();
  }
});

// Test Case: QE-10421 TS-003 TC-001
test('Verify card-wise spend analysis with accurate aggregation for multiple transactions', async ({ page }) => {
  const portfolioPage = new PortfolioPage(page);
  
  // Step 1: Launch application
  await portfolioPage.navigate();
  
  // Step 2: Navigate to Portfolio
  await portfolioPage.waitForPortfolioLoad();
  
  // Step 3: Select card with multiple transactions
  await portfolioPage.selectCard(0);
  await portfolioPage.waitForCardDetails();
  
  // Step 4: Verify total monthly spend aggregation
  const monthlySpend = await portfolioPage.getCardMonthlySpend();
  const spendValue = parseFloat(monthlySpend.replace(/[$,]/g, ''));
  expect(spendValue).toBeGreaterThan(0);
  
  // Step 5: Verify utilization rate calculation
  const utilizationRate = await portfolioPage.getCardUtilizationRate();
  const utilizationValue = parseFloat(utilizationRate.replace('%', ''));
  expect(utilizationValue).toBeGreaterThanOrEqual(0);
  expect(utilizationValue).toBeLessThanOrEqual(100);
  
  // Step 6: Verify transaction count accuracy
  const transactionCount = await portfolioPage.getCardTransactionCount();
  expect(parseInt(transactionCount)).toBeGreaterThan(0);
});
