const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"], kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"], kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"], kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"], kpi-card:has-text("Outstanding Amount")');
    
    // Warning Indicators
    this.monthlySpendWarning = page.locator('[data-testid="kpi-monthly-spend"] .warning-icon, [data-testid="monthly-spend-warning"]');
    this.availableCreditWarning = page.locator('[data-testid="kpi-available-credit"] .warning-icon, [data-testid="available-credit-warning"]');
    this.warningBanner = page.locator('.warning-banner, [data-testid="warning-banner"]');
    
    // Credit Cards Section
    this.creditCardsSection = page.locator('[data-testid="credit-cards-section"], .credit-cards-container');
    this.cardItems = page.locator('.card-item, [data-testid="card-item"]');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], .no-cards-message');
    this.addCardButton = page.locator('[data-testid="add-card-button"], button:has-text("Add Card")');
    
    // Error and Loading States
    this.serviceErrorMessage = page.locator('[data-testid="service-error"], .error-message');
    this.timeoutErrorMessage = page.locator('[data-testid="timeout-error"], .timeout-error');
    this.retryButton = page.locator('[data-testid="retry-button"], button:has-text("Retry")');
    this.loadingIndicator = page.locator('[data-testid="loading"], .loading-spinner');
    
    // Navigation
    this.transactionsLink = page.locator('a[href*="transactions"], nav a:has-text("Transactions")');
    this.analyticsLink = page.locator('a[href*="analytics"], nav a:has-text("Analytics")');
  }

  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.monthlySpendKPI.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  async getKPIValue(kpiName) {
    const kpiMap = {
      'monthlySpend': this.monthlySpendKPI,
      'totalCreditLimit': this.totalCreditLimitKPI,
      'availableCredit': this.availableCreditKPI,
      'outstandingAmount': this.outstandingAmountKPI
    };
    
    const kpiElement = kpiMap[kpiName];
    await kpiElement.waitFor({ state: 'visible' });
    const text = await kpiElement.textContent();
    // Extract value (assuming format like "$2,500.50" or "Monthly Spend\n$2,500.50")
    const match = text.match(/\$[\d,]+\.?\d*/);
    return match ? match[0] : text;
  }

  async getCardCount() {
    await this.page.waitForTimeout(1000); // Wait for cards to render
    return await this.cardItems.count();
  }

  async getCardDetails(index) {
    const card = this.cardItems.nth(index);
    await card.waitFor({ state: 'visible' });
    
    const cardText = await card.textContent();
    
    return {
      cardName: await card.locator('.card-name, h4').textContent().catch(() => ''),
      cardNumber: await card.locator('.card-number, [data-testid="card-number"]').textContent().catch(() => ''),
      creditLimit: await card.locator('[data-testid="credit-limit"], .credit-limit').textContent().catch(() => ''),
      availableCredit: await card.locator('[data-testid="available-credit"], .available-credit').textContent().catch(() => ''),
      outstandingBalance: await card.locator('[data-testid="outstanding-balance"], .outstanding-balance').textContent().catch(() => ''),
      monthlySpend: await card.locator('[data-testid="monthly-spend"], .monthly-spend').textContent().catch(() => '')
    };
  }

  async isCardGridLayout() {
    const container = await this.creditCardsSection.boundingBox();
    const firstCard = await this.cardItems.first().boundingBox();
    const secondCard = await this.cardItems.nth(1).boundingBox();
    
    if (!firstCard || !secondCard) return false;
    
    // Check if cards are side by side (grid layout)
    return Math.abs(firstCard.y - secondCard.y) < 50;
  }

  async isCardSingleColumnLayout() {
    const firstCard = await this.cardItems.first().boundingBox();
    const secondCard = await this.cardItems.nth(1).boundingBox();
    
    if (!firstCard || !secondCard) return true;
    
    // Check if cards are stacked vertically
    return secondCard.y > firstCard.y + firstCard.height;
  }

  async clickAddCard() {
    await this.addCardButton.click();
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