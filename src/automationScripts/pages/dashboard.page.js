const { expect } = require('@playwright/test');

/**
 * Dashboard Page Object
 * Handles all interactions with the Credit Card Dashboard page
 * Covers: KPIs, Multiple Credit Cards Overview, Responsive Layouts
 */
exports.DashboardPage = class DashboardPage {

  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.kpiSection = page.locator('.dashboard-container');
    this.monthlySpendKPI = page.locator('kpi-card[label="Monthly Spend"] .kpi-value');
    this.totalCreditLimitKPI = page.locator('kpi-card[label="Total Credit Limit"] .kpi-value');
    this.availableCreditKPI = page.locator('kpi-card[label="Available Credit"] .kpi-value');
    this.outstandingAmountKPI = page.locator('kpi-card[label="Outstanding Amount"] .kpi-value');
    
    // Credit Card Locators
    this.creditCardList = page.locator('.card-item');
    this.cardName = page.locator('.card-name');
    this.cardNumber = page.locator('.card-number');
    this.cardDetails = page.locator('.card-details');
    
    // Error Handling Locators
    this.errorMessage = page.locator('.alert-danger');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.emptyStateMessage = page.locator('.dashboard-container p:has-text("no credit cards")');
    this.errorTooltip = page.locator('.error-tooltip, [role="tooltip"]');
    
    // Navigation Locators
    this.navDashboard = page.locator('a[href="#/dashboard"]');
    this.navTrends = page.locator('a[href="#/trends"]');
    this.navCategories = page.locator('a[href="#/categories"]');
    
    // Login Locators (if needed)
    this.usernameInput = page.locator('#username, input[name="username"]');
    this.passwordInput = page.locator('#password, input[name="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login")');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToDashboard() {
    await this.navDashboard.click();
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    await this.page.waitForSelector('.dashboard-container', { state: 'visible', timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    return await this.outstandingAmountKPI.textContent();
  }

  async verifyKPICurrencyFormat() {
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    for (const kpi of kpis) {
      const text = await kpi.textContent();
      // Verify format: $X,XXX (no decimal places)
      expect(text).toMatch(/^\$[0-9,]+$/);
      expect(text).not.toContain('.');
    }
  }

  async clickRetry() {
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCreditCardCount() {
    const count = await this.creditCardList.count();
    return count;
  }

  async getAllCreditCards() {
    await this.page.waitForSelector('.card-item', { state: 'visible', timeout: 5000 });
    return await this.creditCardList.all();
  }

  async verifyCreditCardDetails(cardIndex, expectedDetails) {
    const card = this.creditCardList.nth(cardIndex);
    await expect(card).toBeVisible();
    
    const name = await card.locator('.card-name').textContent();
    const number = await card.locator('.card-number').textContent();
    const limit = await card.locator('.card-details div:has-text("Credit Limit") .value').textContent();
    const available = await card.locator('.card-details div:has-text("Available") .value').textContent();
    const outstanding = await card.locator('.card-details div:has-text("Outstanding") .value').textContent();
    const monthly = await card.locator('.card-details div:has-text("Monthly Spend") .value').textContent();
    
    expect(name).toContain(expectedDetails.name);
    expect(number).toContain(expectedDetails.number);
    expect(limit).toBe(expectedDetails.limit);
    expect(available).toBe(expectedDetails.available);
    expect(outstanding).toBe(expectedDetails.outstanding);
    expect(monthly).toBe(expectedDetails.monthly);
  }

  async verifyMobileLayout() {
    // Verify single-column layout on mobile
    const cards = await this.creditCardList.all();
    for (let i = 0; i < cards.length - 1; i++) {
      const box1 = await cards[i].boundingBox();
      const box2 = await cards[i + 1].boundingBox();
      // Cards should be stacked vertically (y position increases)
      expect(box2.y).toBeGreaterThan(box1.y + box1.height - 10);
    }
  }

  async verifyGridLayout(expectedColumns) {
    const cards = await this.creditCardList.all();
    if (cards.length < 2) return;
    
    const box1 = await cards[0].boundingBox();
    const box2 = await cards[1].boundingBox();
    
    if (expectedColumns === 1) {
      // Single column: cards stacked vertically
      expect(box2.y).toBeGreaterThan(box1.y + box1.height - 10);
    } else {
      // Multi-column: cards side by side (same row)
      expect(Math.abs(box1.y - box2.y)).toBeLessThan(50);
    }
  }

  async verifyCurrencyFormatting() {
    const cards = await this.creditCardList.all();
    for (const card of cards) {
      const values = await card.locator('.card-details .value').allTextContents();
      for (const value of values) {
        expect(value).toMatch(/^\$[0-9,]+(\.[0-9]{2})?$/);
      }
    }
  }

  async verifyDecimalFormatting() {
    const cards = await this.creditCardList.all();
    for (const card of cards) {
      const values = await card.locator('.card-details .value').allTextContents();
      for (const value of values) {
        // Verify exactly 2 decimal places
        expect(value).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
      }
    }
  }

  async scrollThroughCards() {
    const cards = await this.creditCardList.all();
    for (const card of cards) {
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeInViewport();
    }
  }

  async verifyAllCardsInViewport() {
    const cards = await this.creditCardList.all();
    for (const card of cards) {
      await expect(card).toBeInViewport();
    }
  }

  async verifyCardDataComplete(cardIndex) {
    const card = this.creditCardList.nth(cardIndex);
    await expect(card.locator('.card-name')).toBeVisible();
    await expect(card.locator('.card-number')).toBeVisible();
    await expect(card.locator('.card-details')).toBeVisible();
    const detailsCount = await card.locator('.card-details > div').count();
    expect(detailsCount).toBeGreaterThanOrEqual(4);
  }

  getCardErrorIndicator(cardIndex) {
    return this.creditCardList.nth(cardIndex).locator('.error-indicator, .warning-badge, [class*="error"]');
  }

  async hoverCardErrorIndicator(cardIndex) {
    const indicator = this.getCardErrorIndicator(cardIndex);
    await indicator.hover();
    await this.page.waitForTimeout(500);
  }

};