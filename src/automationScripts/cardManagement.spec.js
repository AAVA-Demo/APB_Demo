const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { CardDetailsPage } = require('./pages/cardDetails.page');

test.describe('Multiple Credit Card Display - QE-10304', () => {
  let loginPage;
  let cardManagementPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
  });

  test('TC-7421: Verify user with three registered credit cards can view all cards with accurate key details', async ({ page }) => {
    await loginPage.login('testuser3cards', 'Pass@123');
    await cardManagementPage.navigate();
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(3);
    const card1Details = await cardManagementPage.getCardDetails(0);
    expect(card1Details.cardNumber).toContain('1234');
    expect(card1Details.issuer).toBe('Visa');
    expect(card1Details.creditLimit).toContain('50000');
    expect(card1Details.availableCredit).toContain('35000');
    expect(card1Details.outstandingAmount).toContain('15000');
    expect(card1Details.status).toBe('Active');
  });

  test('TC-7422: Verify card details are retrieved from correct data source and match expected format', async ({ page }) => {
    await loginPage.login('testuser3cards', 'Pass@123');
    await page.waitForResponse(response => response.url().includes('/api/cards') && response.status() === 200);
    await cardManagementPage.navigate();
    const card1Number = await cardManagementPage.getCardNumber(0);
    expect(card1Number).toMatch(/\*{4} \d{4}/);
    const card1CreditLimit = await cardManagementPage.getCreditLimit(0);
    expect(card1CreditLimit).toMatch(/₹[0-9,]+\.\d{2}/);
  });

  test('TC-7423: Verify system displays appropriate error message when credit card data service unavailable', async ({ page }) => {
    await page.route('**/api/cards', route => route.abort());
    await loginPage.login('testuser', 'Pass@123');
    await cardManagementPage.navigate();
    await expect(cardManagementPage.errorMessage).toBeVisible();
    const errorText = await cardManagementPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load credit cards');
    expect(errorText).not.toContain('stack trace');
    expect(errorText).not.toContain('/api/cards');
  });

  test('TC-7424: Verify application does not crash when credit card data service unavailable', async ({ page }) => {
    await page.route('**/api/cards', route => route.abort());
    await loginPage.login('testuser', 'Pass@123');
    await cardManagementPage.navigate();
    await expect(cardManagementPage.cardManagementContainer).toBeVisible();
    await cardManagementPage.navigateToDashboard();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('TC-7425: Verify user with ten registered credit cards can view all cards without performance degradation', async ({ page }) => {
    await loginPage.login('testuser10cards', 'Pass@123');
    const startTime = Date.now();
    await cardManagementPage.navigate();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(10);
    for (let i = 0; i < 10; i++) {
      const cardDetails = await cardManagementPage.getCardDetails(i);
      expect(cardDetails.cardNumber).toBeTruthy();
      expect(cardDetails.issuer).toBeTruthy();
      expect(cardDetails.status).toBe('Active');
    }
  });

  test('TC-7426: Verify card management interface maintains responsiveness when displaying ten credit cards', async ({ page }) => {
    await loginPage.login('testuser10cards', 'Pass@123');
    await cardManagementPage.navigate();
    await cardManagementPage.scrollToCard(5);
    await cardManagementPage.viewCardDetails(5);
    await expect(page).toHaveURL(/card-management\//);
    await page.goBack();
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(10);
  });
});

test.describe('Card-Wise Spend Analysis View - QE-10301', () => {
  let loginPage;
  let cardManagementPage;
  let cardDetailsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    cardDetailsPage = new CardDetailsPage(page);
    await loginPage.navigate();
  });

  test('TC-7439: Verify user can select specific credit card and view detailed spend analysis', async ({ page }) => {
    await loginPage.login('testusermultiplecards', 'Pass@123');
    await cardManagementPage.navigate();
    await cardManagementPage.viewCardDetails(0);
    await expect(cardDetailsPage.cardDetailsContainer).toBeVisible();
    const monthlySpend = await cardDetailsPage.getMonthlySpend();
    const transactionCount = await cardDetailsPage.getTransactionCount();
    const lastTransactionDate = await cardDetailsPage.getLastTransactionDate();
    expect(monthlySpend).toContain('₹');
    expect(parseInt(transactionCount)).toBeGreaterThan(0);
    expect(lastTransactionDate).toBeTruthy();
  });

  test('TC-7440: Verify spend analysis data is retrieved from correct data source and calculated accurately', async ({ page }) => {
    await loginPage.login('testusermultiplecards', 'Pass@123');
    await cardManagementPage.navigate();
    await page.waitForResponse(response => response.url().includes('/api/cards/1/spending') && response.status() === 200);
    await cardManagementPage.viewCardDetails(0);
    const monthlySpend = await cardDetailsPage.getMonthlySpend();
    const transactionCount = await cardDetailsPage.getTransactionCount();
    expect(parseFloat(monthlySpend.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseInt(transactionCount)).toBeGreaterThan(0);
  });

  test('TC-7441: Verify user selecting credit card with no transaction history sees zero spending with appropriate message', async ({ page }) => {
    await loginPage.login('testusernotransactions', 'Pass@123');
    await cardManagementPage.navigate();
    await cardManagementPage.viewCardDetails(0);
    const monthlySpend = await cardDetailsPage.getMonthlySpend();
    const transactionCount = await cardDetailsPage.getTransactionCount();
    expect(monthlySpend).toContain('₹0.00');
    expect(transactionCount).toBe('0');
    await expect(cardDetailsPage.noTransactionsMessage).toBeVisible();
    const messageText = await cardDetailsPage.noTransactionsMessage.textContent();
    expect(messageText).toContain('No transactions available');
  });

  test('TC-7442: Verify system handles cards with no transaction history gracefully without misleading data', async ({ page }) => {
    await loginPage.login('testusernotransactions', 'Pass@123');
    await cardManagementPage.navigate();
    await cardManagementPage.viewCardDetails(0);
    const monthlySpend = await cardDetailsPage.getMonthlySpend();
    expect(monthlySpend).not.toContain('dummy');
    expect(monthlySpend).not.toContain('placeholder');
    const lastTransactionDate = await cardDetailsPage.getLastTransactionDate();
    expect(lastTransactionDate).toMatch(/N\/A|null/);
  });

  test('TC-7443: Verify user attempting to view spend analysis for non-existent card ID receives validation error', async ({ page }) => {
    await loginPage.login('testuser', 'Pass@123');
    await page.goto('/card-management/999');
    await expect(cardDetailsPage.errorMessage).toBeVisible();
    const errorText = await cardDetailsPage.errorMessage.textContent();
    expect(errorText).toContain('Card not found');
  });

  test('TC-7444: Verify system enforces authorization checks to prevent unauthorized access to card spend analysis', async ({ page }) => {
    await loginPage.login('testuser', 'Pass@123');
    const response = await page.goto('/card-management/100');
    expect([403, 404]).toContain(response.status());
    await expect(cardDetailsPage.errorMessage).toBeVisible();
    const errorText = await cardDetailsPage.errorMessage.textContent();
    expect(errorText).not.toContain('Card ID: 100');
  });
});