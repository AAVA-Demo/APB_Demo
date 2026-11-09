const { expect } = require('@playwright/test');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.portfolioMenuItem = page.locator('nav a[href="#/portfolio"]');
    this.kpiMenuItem = page.locator('nav a[href="#/kpi"]');
    this.cardItems = page.locator('.card-item');
    this.errorMessage = page.locator('.alert-danger');
    this.infoMessage = page.locator('.alert-info');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.totalCreditLimitSummary = page.locator('.summary-card:has-text("Total Credit Limit") .amount');
    this.totalAvailableCreditSummary = page.locator('.summary-card:has-text("Total Available Credit") .amount');
    this.totalOutstandingSummary = page.locator('.summary-card:has-text("Total Outstanding") .amount');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToPortfolio() {
    await expect(this.portfolioMenuItem).toBeVisible();
    await this.portfolioMenuItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToKPIDashboard() {
    await expect(this.kpiMenuItem).toBeVisible();
    await this.kpiMenuItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await this.page.waitForTimeout(500);
    return await this.cardItems.count();
  }

  async verifyCardDetails(cardIndex, expectedDetails) {
    const card = this.cardItems.nth(cardIndex);
    await expect(card).toBeVisible();
    
    const creditLimitText = await card.locator('.detail-row:has-text("Credit Limit") .value').textContent();
    const creditLimit = this.parseAmount(creditLimitText);
    expect(creditLimit).toBe(expectedDetails.creditLimit);
    
    const availableCreditText = await card.locator('.detail-row:has-text("Available Credit") .value').textContent();
    const availableCredit = this.parseAmount(availableCreditText);
    expect(availableCredit).toBe(expectedDetails.availableCredit);
    
    const outstandingText = await card.locator('.detail-row:has-text("Outstanding Balance") .value').textContent();
    const outstanding = this.parseAmount(outstandingText);
    expect(outstanding).toBe(expectedDetails.outstandingBalance);
  }

  async verifyPortfolioSummary(expectedSummary) {
    await expect(this.totalCreditLimitSummary).toBeVisible();
    const totalCreditLimitText = await this.totalCreditLimitSummary.textContent();
    const totalCreditLimit = this.parseAmount(totalCreditLimitText);
    expect(totalCreditLimit).toBe(expectedSummary.totalCreditLimit);
    
    const totalAvailableText = await this.totalAvailableCreditSummary.textContent();
    const totalAvailable = this.parseAmount(totalAvailableText);
    expect(totalAvailable).toBe(expectedSummary.totalAvailableCredit);
    
    const totalOutstandingText = await this.totalOutstandingSummary.textContent();
    const totalOutstanding = this.parseAmount(totalOutstandingText);
    expect(totalOutstanding).toBe(expectedSummary.totalOutstanding);
  }

  async verifyCardIssuerInfo(cardIndex, expectedIssuer, expectedCardType) {
    const card = this.cardItems.nth(cardIndex);
    await expect(card).toBeVisible();
    
    const cardType = await card.locator('.card-type').textContent();
    expect(cardType).toContain(expectedCardType);
    
    const cardholderName = await card.locator('.cardholder-name').textContent();
    expect(cardholderName).toContain(expectedIssuer);
  }

  async verifyErrorMessage(expectedMessage) {
    await expect(this.errorMessage).toBeVisible();
    const actualMessage = await this.errorMessage.textContent();
    expect(actualMessage.trim()).toContain(expectedMessage);
  }

  async verifyRetryButtonVisible() {
    await expect(this.retryButton).toBeVisible();
  }

  async verifyInfoMessage(expectedMessage) {
    await expect(this.infoMessage).toBeVisible();
    const actualMessage = await this.infoMessage.textContent();
    expect(actualMessage.trim()).toContain(expectedMessage);
  }

  async verifyNoErrorMessages() {
    const errorCount = await this.errorMessage.count();
    expect(errorCount).toBe(0);
  }

  async verifyAmountFormatting() {
    const firstCard = this.cardItems.first();
    const amountText = await firstCard.locator('.detail-row .value').first().textContent();
    expect(amountText).toMatch(/\$[\d,]+\.\d{2}/);
  }

  async verifyResponsiveLayout(deviceType) {
    if (deviceType === 'tablet') {
      const cardGrid = this.page.locator('.card-grid');
      await expect(cardGrid).toBeVisible();
    } else if (deviceType === 'mobile') {
      const cardGrid = this.page.locator('.card-grid');
      await expect(cardGrid).toBeVisible();
      const firstCard = this.cardItems.first();
      await expect(firstCard).toBeVisible();
    }
  }

  async getCardByName(cardName) {
    return this.page.locator(`.card-item:has-text("${cardName}")`);
  }

  async verifyNegativeAvailableCredit(cardLocator, expectedAmount) {
    const availableCreditText = await cardLocator.locator('.detail-row:has-text("Available Credit") .value').textContent();
    const availableCredit = this.parseAmount(availableCreditText);
    expect(availableCredit).toBe(expectedAmount);
  }

  async verifyOverlimitVisualIndicators(cardLocator) {
    const availableCreditValue = cardLocator.locator('.detail-row:has-text("Available Credit") .value');
    await expect(availableCreditValue).toHaveCSS('color', /rgb\(255,\s*0,\s*0\)|red/);
  }

  async verifyWarningMessage(cardLocator, expectedMessage) {
    const warningIcon = cardLocator.locator('.warning-icon, .glyphicon-exclamation-sign');
    await expect(warningIcon).toBeVisible();
  }

  async verifyCardStatus(cardLocator, expectedStatus) {
    const statusElement = cardLocator.locator('.card-status');
    const statusText = await statusElement.textContent();
    expect(statusText.trim()).toBe(expectedStatus);
  }

  async hasDataIntegrityError() {
    const errorMessage = this.page.locator('.alert-danger:has-text("Data integrity issue")');
    const count = await errorMessage.count();
    return count > 0;
  }

  async getCardAvailableCredit(cardIndex) {
    const card = this.cardItems.nth(cardIndex);
    const availableCreditText = await card.locator('.detail-row:has-text("Available Credit") .value').textContent();
    return this.parseAmount(availableCreditText);
  }

  async verifyOtherCardsDisplayNormally() {
    const cardCount = await this.cardItems.count();
    expect(cardCount).toBeGreaterThan(0);
  }

  parseAmount(amountText) {
    const cleaned = amountText.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned);
  }
};
