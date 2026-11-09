const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('.dashboard-container, [data-testid="dashboard"]');
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend"], .panel:has-text("Monthly Spend") h3');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"], .panel:has-text("Total Credit Limit") h3');
    this.availableCreditKPI = page.locator('[data-testid="available-credit"], .panel:has-text("Available Credit") h3');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount"], .panel:has-text("Outstanding Amount") h3');
    this.creditUtilizationKPI = page.locator('[data-testid="credit-utilization"], .panel:has-text("Credit Utilization") h4');
    this.errorMessage = page.locator('.alert-danger, [role="alert"]');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.creditCardTable = page.locator('table, [data-testid="credit-card-table"]');
    this.creditCardRows = page.locator('table tbody tr, [data-testid="credit-card-row"]');
    this.creditCardOverviewSection = page.locator('[data-testid="credit-card-overview"], .credit-card-portfolio');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    return await this.outstandingAmountKPI.textContent();
  }

  async getCreditUtilization() {
    await expect(this.creditUtilizationKPI).toBeVisible();
    const text = await this.creditUtilizationKPI.textContent();
    const match = text.match(/\d+\.?\d*%/);
    return match ? match[0] : text;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async isDashboardStructureVisible() {
    return await this.dashboardContainer.isVisible();
  }

  async navigateToCreditCardOverview() {
    await expect(this.creditCardOverviewSection).toBeVisible();
    await this.page.evaluate(() => {
      document.querySelector('[data-testid="credit-card-overview"], .credit-card-portfolio')?.scrollIntoView();
    });
  }

  async getCreditCardCount() {
    await expect(this.creditCardTable).toBeVisible();
    return await this.creditCardRows.count();
  }

  async getAllCreditCards() {
    await expect(this.creditCardTable).toBeVisible();
    const count = await this.creditCardRows.count();
    const cards = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.creditCardRows.nth(i);
      const cardNumber = await row.locator('td').nth(0).textContent();
      const creditLimit = await row.locator('td').nth(2).textContent();
      const outstanding = await row.locator('td').nth(3).textContent();
      const available = await row.locator('td').nth(4).textContent();
      const utilization = await row.locator('td').nth(5).textContent();
      
      cards.push({
        cardNumber: cardNumber.trim(),
        creditLimit: creditLimit.trim(),
        outstanding: outstanding.trim(),
        available: available.trim(),
        utilization: utilization.trim()
      });
    }
    
    return cards;
  }

  async getAggregateCreditUtilization() {
    return await this.getCreditUtilization();
  }

  async isApplicationResponsive() {
    const isVisible = await this.dashboardContainer.isVisible();
    const isClickable = await this.retryButton.isVisible() ? await this.retryButton.isEnabled() : true;
    return isVisible && isClickable;
  }
};
