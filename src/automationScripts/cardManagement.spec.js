const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Multiple Credit Card Management Tests', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
  });

  test('QE-9959 TS-001 TC-001: Verify user with 5 linked cards sees all cards with complete details', async ({ page }) => {
    await loginPage.login(testData.users.fiveCards.username, testData.users.fiveCards.password);
    await cardManagementPage.navigateToMyCards();
    
    await expect(cardManagementPage.cardPortfolioContainer).toBeVisible();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBe(5);
    
    const cardTypes = ['Visa', 'MasterCard', 'Amex', 'Discover', 'Visa'];
    const cardNumbers = ['1234', '5678', '9012', '3456', '7890'];
    
    for (let i = 0; i < 5; i++) {
      await expect(cardManagementPage.getCardByIndex(i)).toBeVisible();
      
      const cardType = await cardManagementPage.getCardType(i);
      expect(cardType).toContain(cardTypes[i]);
      
      const cardNumber = await cardManagementPage.getCardNumber(i);
      expect(cardNumber).toContain(cardNumbers[i]);
      
      await expect(cardManagementPage.getCardCreditLimit(i)).toBeVisible();
      await expect(cardManagementPage.getCardAvailableBalance(i)).toBeVisible();
      await expect(cardManagementPage.getCardOutstandingBalance(i)).toBeVisible();
      await expect(cardManagementPage.getCardStatus(i)).toBeVisible();
    }
  });

  test('QE-9959 TS-002 TC-001: Verify appropriate message for user with no linked cards', async ({ page }) => {
    await loginPage.login(testData.users.noCards.username, testData.users.noCards.password);
    await cardManagementPage.navigateToMyCards();
    
    await expect(cardManagementPage.emptyStateMessage).toBeVisible();
    const messageText = await cardManagementPage.emptyStateMessage.textContent();
    expect(messageText).toContain('No cards found matching the filter criteria');
    
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.waitForTimeout(2000);
    expect(consoleErrors).toHaveLength(0);
  });

  test('QE-9959 TS-003 TC-001: Verify error message when card data service is unavailable', async ({ page }) => {
    await page.route('**/api/cards', route => route.abort('failed'));
    
    await loginPage.login(testData.users.testUser.username, testData.users.testUser.password);
    await cardManagementPage.navigateToMyCards();
    
    await expect(cardManagementPage.errorMessage).toBeVisible();
    const errorText = await cardManagementPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load cards');
    expect(errorText).not.toContain('500');
    expect(errorText).not.toContain('Internal Server Error');
    
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleMessages.push(msg.text());
    });
    
    await page.waitForTimeout(1000);
    expect(consoleMessages.some(msg => msg.includes('Error fetching cards'))).toBe(true);
  });

  test('QE-9956 TS-001 TC-001: Verify card-specific spending details display', async ({ page }) => {
    await loginPage.login(testData.users.cardUser.username, testData.users.cardUser.password);
    await cardManagementPage.navigateToMyCards();
    
    await expect(cardManagementPage.cardPortfolioContainer).toBeVisible();
    await cardManagementPage.selectCardByNumber('1234');
    
    await expect(cardManagementPage.cardDetailContainer).toBeVisible();
    
    const totalSpend = await cardManagementPage.getTotalSpend();
    expect(totalSpend).toBe('$5,000.00');
    
    const monthlySpend = await cardManagementPage.getMonthlySpend();
    expect(monthlySpend).toBe('$500.00');
    
    const utilizationRate = await cardManagementPage.getUtilizationRate();
    expect(utilizationRate).toBe('30.0%');
    
    await expect(cardManagementPage.spendingBreakdownSection).toBeVisible();
  });

  test('QE-9956 TS-002 TC-001: Verify zero transaction card displays $0.00 values', async ({ page }) => {
    await loginPage.login(testData.users.newCard.username, testData.users.newCard.password);
    await cardManagementPage.navigateToMyCards();
    
    await cardManagementPage.selectCardByNumber('9999');
    
    await expect(cardManagementPage.cardDetailContainer).toBeVisible();
    
    expect(await cardManagementPage.getTotalSpend()).toBe('$0.00');
    expect(await cardManagementPage.getMonthlySpend()).toBe('$0.00');
    expect(await cardManagementPage.getUtilizationRate()).toBe('0.0%');
    
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.waitForTimeout(2000);
    expect(consoleErrors.filter(e => e.includes('null') || e.includes('NaN'))).toHaveLength(0);
  });

  test('QE-9956 TS-003 TC-001: Verify 404 error for invalid card ID', async ({ page }) => {
    await loginPage.login(testData.users.testUser.username, testData.users.testUser.password);
    
    await page.goto(`${testData.baseUrl}/cards/invalidCardID123`);
    
    await expect(cardManagementPage.errorMessage).toBeVisible();
    const errorText = await cardManagementPage.errorMessage.textContent();
    expect(errorText).toMatch(/Card not found|Failed to load card details/);
    
    const response = await page.request.get(`${testData.apiBaseUrl}/cards/invalidCardID123`);
    expect(response.status()).toBe(404);
    
    expect(errorText).not.toContain('stack');
    expect(errorText).not.toContain('Error:');
    
    await expect(cardManagementPage.backToPortfolioButton).toBeVisible();
    await cardManagementPage.backToPortfolioButton.click();
    await expect(cardManagementPage.cardPortfolioContainer).toBeVisible();
  });
});