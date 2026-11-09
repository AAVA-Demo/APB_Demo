const { expect } = require('@playwright/test');

exports.KPIDashboardPage = class KPIDashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.kpiMenuItem = page.locator('nav a[href="#/kpi"]');
    this.portfolioMenuItem = page.locator('nav a[href="#/portfolio"]');
    this.kpiCards = page.locator('.kpi-card');
    this.warningMessage = page.locator('.alert-warning');
    this.lastRefreshedIndicator = page.locator('.last-refreshed');
    this.retryButton = page.locator('button:has-text("Retry")');
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

  async navigateToKPIDashboard() {
    await expect(this.kpiMenuItem).toBeVisible();
    await this.kpiMenuItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToPortfolio() {
    await expect(this.portfolioMenuItem).toBeVisible();
    await this.portfolioMenuItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyKPICardVisible(kpiTitle) {
    const kpiCard = this.page.locator(`.kpi-card:has-text("${kpiTitle}")`);
    await expect(kpiCard).toBeVisible();
  }

  async verifyKPIValue(kpiTitle, expectedValue) {
    const kpiCard = this.page.locator(`.kpi-card:has-text("${kpiTitle}")`);
    await expect(kpiCard).toBeVisible();
    const valueText = await kpiCard.locator('.kpi-value').textContent();
    const actualValue = this.parseAmount(valueText);
    expect(actualValue).toBe(expectedValue);
  }

  async getKPIValue(kpiTitle) {
    const kpiCard = this.page.locator(`.kpi-card:has-text("${kpiTitle}")`);
    await expect(kpiCard).toBeVisible();
    const valueText = await kpiCard.locator('.kpi-value').textContent();
    return this.parseAmount(valueText);
  }

  async verifyWarningMessage(expectedMessage) {
    await expect(this.warningMessage).toBeVisible();
    const actualMessage = await this.warningMessage.textContent();
    expect(actualMessage.trim()).toContain(expectedMessage);
  }

  async verifyIndividualCardLimits(expectedLimits) {
    const cards = this.page.locator('.card-item');
    for (let i = 0; i < expectedLimits.length; i++) {
      const card = cards.nth(i);
      const limitText = await card.locator('.detail-row:has-text("Credit Limit") .value').textContent();
      const limit = this.parseAmount(limitText);
      expect(limit).toBe(expectedLimits[i]);
    }
  }

  async verifyCardLimitDisplay(cardIndex, expectedDisplay) {
    const card = this.page.locator('.card-item').nth(cardIndex);
    const limitText = await card.locator('.detail-row:has-text("Credit Limit") .value').textContent();
    expect(limitText.trim()).toContain(expectedDisplay);
  }

  async getCardCount() {
    await this.page.waitForTimeout(500);
    return await this.page.locator('.card-item').count();
  }

  async verifyCardLimit(cardIndex, expectedLimit) {
    const card = this.page.locator('.card-item').nth(cardIndex);
    const limitText = await card.locator('.detail-row:has-text("Credit Limit") .value').textContent();
    const limit = this.parseAmount(limitText);
    expect(limit).toBe(expectedLimit);
  }

  async verifyLastRefreshedVisible() {
    await expect(this.lastRefreshedIndicator).toBeVisible();
  }

  async verifyKPIValuesUpdated() {
    await this.page.waitForTimeout(1000);
    const kpiCount = await this.kpiCards.count();
    expect(kpiCount).toBe(4);
  }

  async verifyKPIError(kpiTitle, expectedErrorMessage) {
    const kpiCard = this.page.locator(`.kpi-card:has-text("${kpiTitle}")`);
    await expect(kpiCard).toBeVisible();
    const errorText = await kpiCard.locator('.error-message, .alert-danger').textContent();
    expect(errorText.trim()).toContain(expectedErrorMessage);
  }

  async verifyRetryButtonVisible(kpiTitle) {
    const kpiCard = this.page.locator(`.kpi-card:has-text("${kpiTitle}")`);
    const retryBtn = kpiCard.locator('button:has-text("Retry")');
    await expect(retryBtn).toBeVisible();
  }

  async verifyTimestampUpdated() {
    await expect(this.lastRefreshedIndicator).toBeVisible();
    const timestampText = await this.lastRefreshedIndicator.textContent();
    expect(timestampText).toContain('Last refreshed');
  }

  parseAmount(amountText) {
    const cleaned = amountText.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned);
  }
};
