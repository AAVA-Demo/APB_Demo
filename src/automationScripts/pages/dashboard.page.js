const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"], .kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"], .kpi-card:has-text("Available Credit")');
    this.totalOutstandingKPI = page.locator('[data-testid="kpi-total-outstanding"], .kpi-card:has-text("Total Outstanding")');
    
    // Credit Card Table Locators
    this.creditCardTable = page.locator('[data-testid="credit-card-table"], table:has-text("Card Number")');
    this.cardRows = page.locator('[data-testid="card-row"], tbody tr');
    this.cardNumberCell = (row) => row.locator('td:nth-child(1)');
    this.cardTypeCell = (row) => row.locator('td:nth-child(2)');
    this.creditLimitCell = (row) => row.locator('td:nth-child(3)');
    this.outstandingCell = (row) => row.locator('td:nth-child(4)');
    this.availableCreditCell = (row) => row.locator('td:nth-child(5)');
    this.utilizationCell = (row) => row.locator('td:nth-child(6)');
    
    // Message Locators
    this.errorMessage = page.locator('[data-testid="error-message"], .alert-danger, .error-message');
    this.warningMessage = page.locator('[data-testid="warning-message"], .alert-warning, .warning-message');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], .empty-state:has-text("No credit cards")');
    
    // Dashboard Container
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"], .dashboard-container');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.waitForDashboardLoad();
  }

  async navigateDirectly() {
    await this.page.goto('/dashboard');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 5000 });
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    return this.extractCurrencyValue(text);
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    return this.extractCurrencyValue(text);
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    return this.extractCurrencyValue(text);
  }

  async getTotalOutstandingValue() {
    await expect(this.totalOutstandingKPI).toBeVisible();
    const text = await this.totalOutstandingKPI.textContent();
    return this.extractCurrencyValue(text);
  }

  extractCurrencyValue(text) {
    const match = text.match(/\$?([\d,]+\.?\d*)/)
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  }

  async verifyKPICalculations() {
    const totalLimit = await this.getTotalCreditLimitValue();
    const totalOutstanding = await this.getTotalOutstandingValue();
    const availableCredit = await this.getAvailableCreditValue();
    
    // Verify Available Credit = Total Limit - Total Outstanding
    const calculatedAvailable = totalLimit - totalOutstanding;
    expect(Math.abs(availableCredit - calculatedAvailable)).toBeLessThan(1);
  }

  async verifyAuthenticationError() {
    // Check for authentication error or redirect to login
    const currentUrl = this.page.url();
    expect(currentUrl).toMatch(/login/);
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getWarningMessageText() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  async getNoCardsMessageText() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async getCardCount() {
    await expect(this.creditCardTable).toBeVisible();
    return await this.cardRows.count();
  }

  async verifyCardRowData(rowIndex) {
    const row = this.cardRows.nth(rowIndex);
    await expect(row).toBeVisible();
    
    // Verify card number is masked
    const cardNumber = await this.cardNumberCell(row).textContent();
    expect(cardNumber).toMatch(/\*{4}.*\d{4}/);
    
    // Verify card type is displayed
    const cardType = await this.cardTypeCell(row).textContent();
    expect(cardType).toBeTruthy();
    
    // Verify credit limit is in currency format
    const creditLimit = await this.creditLimitCell(row).textContent();
    expect(creditLimit).toMatch(/\$[\d,]+/);
    
    // Verify outstanding amount is in currency format
    const outstanding = await this.outstandingCell(row).textContent();
    expect(outstanding).toMatch(/\$[\d,]+/);
    
    // Verify available credit is in currency format
    const available = await this.availableCreditCell(row).textContent();
    expect(available).toMatch(/\$[\d,]+/);
    
    // Verify utilization percentage is displayed
    const utilization = await this.utilizationCell(row).textContent();
    expect(utilization).toMatch(/\d+\.?\d*%/);
  }

  async verifyResponsiveLayout(page) {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(this.creditCardTable).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(this.creditCardTable).toBeVisible();
  }
};