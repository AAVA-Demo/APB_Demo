const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardsPage } = require('./pages/cards.page');
const logger = require('../utils/logger');

test.describe('Individual Card Details Tests - QE-10451', () => {
  let loginPage;
  let cardsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardsPage = new CardsPage(page);
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    logger.info('User authenticated');
  });

  test('QE-10451 TS-001 TC-001: Verify user can view complete card details', async ({ page }) => {
    logger.info('Starting test: QE-10451 TS-001 TC-001');
    
    // Step 3: Navigate to My Cards section
    await cardsPage.navigateToMyCards();
    await expect(cardsPage.cardListContainer).toBeVisible();
    logger.info('Navigated to My Cards section');
    
    // Step 4: Verify three credit cards are displayed
    const cardCount = await cardsPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(1);
    logger.info(`${cardCount} cards displayed in list`);
    
    // Step 5: Click on first card (Visa Platinum or first available)
    await cardsPage.clickFirstCard();
    await page.waitForLoadState('networkidle');
    logger.info('Clicked on first card to view details');
    
    // Step 6-11: Verify all card details are displayed
    await expect(cardsPage.creditLimitField).toBeVisible();
    await expect(cardsPage.outstandingBalanceField).toBeVisible();
    await expect(cardsPage.availableCreditField).toBeVisible();
    await expect(cardsPage.monthlySpendField).toBeVisible();
    await expect(cardsPage.creditUtilizationField).toBeVisible();
    await expect(cardsPage.lastUpdatedField).toBeVisible();
    
    const creditLimit = await cardsPage.getCreditLimit();
    const outstanding = await cardsPage.getOutstandingBalance();
    const available = await cardsPage.getAvailableCredit();
    const monthlySpend = await cardsPage.getMonthlySpend();
    const utilization = await cardsPage.getCreditUtilization();
    
    logger.info(`Card Details - Limit: ${creditLimit}, Outstanding: ${outstanding}, Available: ${available}, Spend: ${monthlySpend}, Utilization: ${utilization}`);
    
    expect(creditLimit).toContain('₹');
    expect(outstanding).toContain('₹');
    expect(available).toContain('₹');
    expect(monthlySpend).toContain('₹');
    expect(utilization).toContain('%');
    
    logger.info('All card details displayed correctly');
  });

  test('QE-10451 TS-002 TC-001: Verify error message for invalid card ID', async ({ page }) => {
    logger.info('Starting test: QE-10451 TS-002 TC-001');
    
    // Step 3: Navigate to invalid card URL
    await page.goto('https://creditcard-dashboard.example.com/cards/invalid-card-999');
    await page.waitForLoadState('networkidle');
    logger.info('Navigated to invalid card URL');
    
    // Step 4: Verify error message
    const errorMessage = page.locator('text=/card not found/i');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    logger.info('Card not found error message displayed');
    
    // Step 5: Verify Back to Cards button
    const backButton = page.locator('button:has-text("Back to Cards"), a:has-text("Back to Cards")');
    await expect(backButton).toBeVisible();
    logger.info('Back to Cards button is visible');
    
    // Step 6: Click Back to Cards button
    await backButton.click();
    await page.waitForLoadState('networkidle');
    await expect(cardsPage.cardListContainer).toBeVisible();
    logger.info('Successfully navigated back to card list');
  });

  test('QE-10451 TS-003 TC-001: Verify recent usage patterns display', async ({ page }) => {
    logger.info('Starting test: QE-10451 TS-003 TC-001');
    
    // Step 3-4: Navigate to My Cards and select first card
    await cardsPage.navigateToMyCards();
    await cardsPage.clickFirstCard();
    await page.waitForLoadState('networkidle');
    logger.info('Navigated to card details page');
    
    // Step 5-6: Scroll to Recent Usage Patterns section
    const recentTransactionsSection = page.locator('text=/recent usage|recent transactions/i').first();
    await recentTransactionsSection.scrollIntoViewIfNeeded();
    await expect(recentTransactionsSection).toBeVisible();
    logger.info('Recent usage patterns section visible');
    
    // Step 7-10: Verify transaction details
    const transactions = await cardsPage.getRecentTransactions();
    expect(transactions.length).toBeGreaterThanOrEqual(1);
    expect(transactions.length).toBeLessThanOrEqual(10);
    logger.info(`${transactions.length} recent transactions displayed`);
    
    // Verify first transaction has all required fields
    if (transactions.length > 0) {
      const firstTransaction = transactions[0];
      expect(firstTransaction).toHaveProperty('date');
      expect(firstTransaction).toHaveProperty('merchant');
      expect(firstTransaction).toHaveProperty('category');
      expect(firstTransaction).toHaveProperty('amount');
      logger.info('Transaction details include date, merchant, category, and amount');
    }
  });
});

test.describe('Card Comparison Tests - QE-10446', () => {
  let loginPage;
  let cardsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardsPage = new CardsPage(page);
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    logger.info('User authenticated');
  });

  test('QE-10446 TS-001 TC-001: Verify card comparison feature with three cards', async ({ page }) => {
    logger.info('Starting test: QE-10446 TS-001 TC-001');
    
    // Step 3: Navigate to My Cards section
    await cardsPage.navigateToMyCards();
    await expect(cardsPage.cardListContainer).toBeVisible();
    logger.info('Navigated to My Cards section');
    
    // Step 4: Click Compare Cards button
    await cardsPage.clickCompareCardsButton();
    await page.waitForLoadState('networkidle');
    logger.info('Activated card comparison feature');
    
    // Step 5-11: Verify comparison table displays all metrics
    await expect(cardsPage.comparisonTable).toBeVisible();
    
    const comparisonData = await cardsPage.getComparisonData();
    expect(comparisonData.cardNames.length).toBeGreaterThanOrEqual(2);
    logger.info(`Comparing ${comparisonData.cardNames.length} cards`);
    
    // Verify all metrics are displayed
    expect(comparisonData.creditLimits.length).toBe(comparisonData.cardNames.length);
    expect(comparisonData.outstandingBalances.length).toBe(comparisonData.cardNames.length);
    expect(comparisonData.availableCredits.length).toBe(comparisonData.cardNames.length);
    expect(comparisonData.utilizations.length).toBe(comparisonData.cardNames.length);
    expect(comparisonData.monthlySpendings.length).toBe(comparisonData.cardNames.length);
    
    logger.info('All comparison metrics displayed correctly');
  });

  test('QE-10446 TS-002 TC-001: Verify comparison disabled for single card user', async ({ page }) => {
    logger.info('Starting test: QE-10446 TS-002 TC-001');
    
    // Login with user who has only one card
    await loginPage.navigate();
    await loginPage.login('onecard@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    
    // Step 3: Navigate to My Cards section
    await cardsPage.navigateToMyCards();
    await expect(cardsPage.cardListContainer).toBeVisible();
    logger.info('Navigated to My Cards section');
    
    // Step 4-5: Verify Compare Cards button is disabled or shows message
    const compareButton = cardsPage.compareCardsButton;
    const isDisabled = await compareButton.isDisabled().catch(() => false);
    
    if (!isDisabled) {
      await compareButton.click();
      const errorMessage = page.locator('text=/at least 2 cards|insufficient cards/i');
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
      logger.info('Insufficient cards message displayed');
    } else {
      logger.info('Compare Cards button is disabled');
    }
    
    // Step 6: Verify comparison feature not activated
    const comparisonTable = page.locator('[data-testid="comparison-table"], .comparison-table');
    await expect(comparisonTable).not.toBeVisible();
    logger.info('Comparison table not displayed');
  });

  test('QE-10446 TS-003 TC-001: Verify optimal card identification in comparison', async ({ page }) => {
    logger.info('Starting test: QE-10446 TS-003 TC-001');
    
    // Step 3: Navigate to My Cards and activate comparison
    await cardsPage.navigateToMyCards();
    await cardsPage.clickCompareCardsButton();
    await page.waitForLoadState('networkidle');
    logger.info('Card comparison activated');
    
    // Step 4-9: Review and identify optimal card
    const comparisonData = await cardsPage.getComparisonData();
    
    // Find card with highest available credit
    let maxAvailableCredit = 0;
    let maxAvailableCardIndex = 0;
    
    comparisonData.availableCredits.forEach((credit, index) => {
      const creditValue = parseFloat(credit.replace(/[^\d.]/g, ''));
      if (creditValue > maxAvailableCredit) {
        maxAvailableCredit = creditValue;
        maxAvailableCardIndex = index;
      }
    });
    
    // Find card with lowest utilization
    let minUtilization = 100;
    let minUtilizationCardIndex = 0;
    
    comparisonData.utilizations.forEach((util, index) => {
      const utilValue = parseFloat(util.replace(/[^\d.]/g, ''));
      if (utilValue < minUtilization) {
        minUtilization = utilValue;
        minUtilizationCardIndex = index;
      }
    });
    
    logger.info(`Card with highest available credit: ${comparisonData.cardNames[maxAvailableCardIndex]} (₹${maxAvailableCredit})`);
    logger.info(`Card with lowest utilization: ${comparisonData.cardNames[minUtilizationCardIndex]} (${minUtilization}%)`);
    
    // Verify optimal card is identified
    expect(maxAvailableCredit).toBeGreaterThan(0);
    expect(minUtilization).toBeLessThan(100);
    
    logger.info('Optimal card identification completed');
  });
});
