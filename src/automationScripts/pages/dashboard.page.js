const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Widget Locators
    this.kpiWidgets = page.locator('.kpi-widget');
    this.kpiLoadingState = page.locator('.kpi-widget .loading, .kpi-widget .error');
    
    // Credit Card List Locators
    this.creditCardList = page.locator('.credit-card');
    this.creditCards = page.locator('.credit-card');
    
    // Empty State Locators
    this.emptyStateMessage = page.locator('text=/No credit cards are currently linked/i');
    this.addCardButton = page.locator('button:has-text("Add Credit Card"), a:has-text("Add Credit Card")');
    
    // Error State Locators
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.retryButton = page.locator('button:has-text("Retry")');
    
    // Navigation Locators
    this.transactionsLink = page.locator('a[href*="transactions"], a:has-text("Transactions")');
    this.analyticsLink = page.locator('a[href*="analytics"], a:has-text("Analytics")');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async getCreditCardCount() {
    await this.creditCards.first().waitFor({ state: 'visible' });
    return await this.creditCards.count();
  }

  async verifyCreditCardDetails(index, issuer, cardNumber) {
    const card = this.creditCards.nth(index);
    await expect(card).toBeVisible();
    await expect(card.locator('h4')).toContainText(issuer);
    await expect(card.locator('.card-number')).toContainText(cardNumber);
  }

  async getKPIValue(kpiName) {
    const kpi = this.kpiWidgets.filter({ hasText: kpiName });
    await expect(kpi).toBeVisible();
    const valueElement = kpi.locator('.value');
    return await valueElement.textContent();
  }

  async verifyCreditCardFinancials(index, creditLimit, outstanding, available) {
    const card = this.creditCards.nth(index);
    const details = card.locator('.card-details');
    
    const limitText = await details.locator('div:has-text("Credit Limit")').textContent();
    expect(limitText).toContain(creditLimit);
    
    const outstandingText = await details.locator('div:has-text("Outstanding")').textContent();
    expect(outstandingText).toContain(outstanding);
    
    const availableText = await details.locator('div:has-text("Available")').textContent();
    expect(availableText).toContain(available);
  }

  async verifyCreditCardOutstanding(index, amount) {
    const card = this.creditCards.nth(index);
    const outstandingText = await card.locator('div:has-text("Outstanding")').textContent();
    expect(outstandingText).toContain(amount);
  }

  async verifyCreditCardAvailable(index, amount) {
    const card = this.creditCards.nth(index);
    const availableText = await card.locator('div:has-text("Available")').textContent();
    expect(availableText).toContain(amount);
  }

  async getCreditCardAvailableText(index) {
    const card = this.creditCards.nth(index);
    return await card.locator('div:has-text("Available")').textContent();
  }

  async getCreditCardLimitText(index) {
    const card = this.creditCards.nth(index);
    return await card.locator('div:has-text("Credit Limit")').textContent();
  }

  async clickRetry() {
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTransactions() {
    await this.transactionsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
  }
};
