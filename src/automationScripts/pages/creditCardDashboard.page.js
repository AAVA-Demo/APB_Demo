const { expect } = require('@playwright/test');

exports.CreditCardDashboardPage = class CreditCardDashboardPage {
  constructor(page) {
    this.page = page;
    
    // Login page locators
    this.loginForm = page.locator('form[id*="login"], form[class*="login"], div[class*="login-form"]');
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[type="text"][placeholder*="username" i]');
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Dashboard page locators
    this.dashboardHeader = page.locator('header, div[class*="dashboard-header"], h1:has-text("Dashboard")');
    this.consolidatedViewSection = page.locator('div[class*="consolidated"], section[class*="card-view"], div[id*="consolidated"]');
    
    // Credit card locators
    this.creditCardList = page.locator('div[class*="card-item"], div[class*="credit-card"], li[class*="card"]');
    this.cardNumber = page.locator('[class*="card-number"], [data-testid*="card-number"]');
    this.cardLimit = page.locator('[class*="credit-limit"], [data-testid*="limit"]');
    this.cardBalance = page.locator('[class*="balance"], [class*="outstanding"], [data-testid*="balance"]');
    
    // Financial metrics locators
    this.monthlySpend = page.locator('[class*="monthly-spend"], [data-testid*="monthly-spend"]');
    this.totalCreditLimit = page.locator('[class*="total-credit-limit"], [data-testid*="total-limit"]');
    this.availableCredit = page.locator('[class*="available-credit"], [data-testid*="available"]');
    this.outstandingAmount = page.locator('[class*="outstanding-amount"], [data-testid*="outstanding"]');
    
    // Zero state locators
    this.zeroStateMessage = page.locator('div[class*="empty-state"], div[class*="no-cards"], p:has-text("No credit cards"), p:has-text("no registered credit cards")');
  }

  /**
   * Navigate to the Credit Card Analysis Dashboard application
   */
  async navigate() {
    await this.page.goto('https://creditcarddashboard.example.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Login with provided credentials
   * @param {string} username - Username for login
   * @param {string} password - Password for login
   */
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to dashboard homepage
   */
  async navigateToDashboard() {
    await expect(this.consolidatedViewSection).toBeVisible();
  }

  /**
   * Verify all expected credit cards are displayed in consolidated view
   * @param {Array<string>} expectedCards - Array of expected card numbers (e.g., ['Visa *1234', 'Mastercard *5678'])
   */
  async verifyAllCardsDisplayed(expectedCards) {
    await expect(this.creditCardList).toHaveCount(expectedCards.length);
    
    for (const cardNumber of expectedCards) {
      const cardLocator = this.page.locator(`[class*="card-item"]:has-text("${cardNumber}"), [class*="credit-card"]:has-text("${cardNumber}"), li[class*="card"]:has-text("${cardNumber}")`);
      await expect(cardLocator).toBeVisible();
    }
  }

  /**
   * Verify card details (card number, credit limit, balance) for multiple cards
   * @param {Array<Object>} cardDetails - Array of card detail objects with cardNumber, limit, and balance
   */
  async verifyCardDetails(cardDetails) {
    for (const card of cardDetails) {
      const cardContainer = this.page.locator(`[class*="card-item"]:has-text("${card.cardNumber}"), [class*="credit-card"]:has-text("${card.cardNumber}")`);
      await expect(cardContainer).toBeVisible();
      
      // Verify card number (masked)
      const cardNumberElement = cardContainer.locator('[class*="card-number"], [data-testid*="card-number"]');
      await expect(cardNumberElement).toContainText(card.cardNumber);
      
      // Verify credit limit
      const limitElement = cardContainer.locator('[class*="credit-limit"], [class*="limit"], [data-testid*="limit"]');
      await expect(limitElement).toContainText(card.limit);
      
      // Verify outstanding balance
      const balanceElement = cardContainer.locator('[class*="balance"], [class*="outstanding"], [data-testid*="balance"]');
      await expect(balanceElement).toContainText(card.balance);
    }
  }

  /**
   * Verify financial metrics for a single credit card
   * @param {Object} metrics - Object containing cardNumber, monthlySpend, totalCreditLimit, availableCredit, outstandingAmount
   */
  async verifyCardFinancialMetrics(metrics) {
    const cardContainer = this.page.locator(`[class*="card-item"]:has-text("${metrics.cardNumber}"), [class*="credit-card"]:has-text("${metrics.cardNumber}")`);
    await expect(cardContainer).toBeVisible();
    
    // Verify monthly spend
    const monthlySpendElement = cardContainer.locator('[class*="monthly-spend"], [data-testid*="monthly-spend"], :has-text("Monthly Spend")');
    await expect(monthlySpendElement).toContainText(metrics.monthlySpend);
    
    // Verify total credit limit
    const totalLimitElement = cardContainer.locator('[class*="total-credit-limit"], [class*="credit-limit"], [data-testid*="limit"], :has-text("Credit Limit")');
    await expect(totalLimitElement).toContainText(metrics.totalCreditLimit);
    
    // Verify available credit
    const availableCreditElement = cardContainer.locator('[class*="available-credit"], [data-testid*="available"], :has-text("Available Credit")');
    await expect(availableCreditElement).toContainText(metrics.availableCredit);
    
    // Verify outstanding amount
    const outstandingElement = cardContainer.locator('[class*="outstanding-amount"], [class*="outstanding"], [data-testid*="outstanding"], :has-text("Outstanding")');
    await expect(outstandingElement).toContainText(metrics.outstandingAmount);
  }

  /**
   * Verify zero-state message is displayed when no credit cards are registered
   */
  async verifyZeroStateMessage() {
    await expect(this.zeroStateMessage).toBeVisible();
    const messageText = await this.zeroStateMessage.textContent();
    const validMessages = ['No credit cards available to display', 'You have no registered credit cards', 'no credit cards'];
    const hasValidMessage = validMessages.some(msg => messageText.toLowerCase().includes(msg.toLowerCase()));
    expect(hasValidMessage).toBeTruthy();
  }

  /**
   * Verify no credit card details are displayed in consolidated view
   */
  async verifyNoCardsDisplayed() {
    await expect(this.creditCardList).toHaveCount(0);
    await expect(this.cardNumber).toHaveCount(0);
    await expect(this.cardLimit).toHaveCount(0);
    await expect(this.cardBalance).toHaveCount(0);
  }
};