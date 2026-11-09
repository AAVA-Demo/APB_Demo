const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Dashboard container
    this.dashboardContainer = page.locator('.dashboard-container');
    this.dashboardHeader = page.locator('h2:has-text("Credit Card Dashboard")');
    this.navigationMenu = page.locator('.navbar');
    
    // KPI locators
    this.monthlySpendKPI = page.locator('.kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('.kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('.kpi-card:has-text("Outstanding Amount")');
    
    // Card summary locators
    this.cardSummaryContainer = page.locator('.cards-section');
    this.cardSummaryCards = page.locator('.card-summary');
    this.aggregatedTotalsSection = page.locator('.aggregated-totals-section');
    
    // Messages
    this.noCardsMessage = page.locator('text=No credit cards linked to your account');
    this.singleCardMessage = page.locator('text=You have 1 credit card linked');
    this.errorMessage = page.locator('.alert-danger');
  }

  async navigate() {
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/.*dashboard/);
  }

  async navigateToDashboard() {
    await this.page.click('a[href="#!/dashboard"]');
    await expect(this.dashboardContainer).toBeVisible();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const valueElement = this.monthlySpendKPI.locator('.kpi-content h2');
    return await valueElement.textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const valueElement = this.totalCreditLimitKPI.locator('.kpi-content h2');
    return await valueElement.textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const valueElement = this.availableCreditKPI.locator('.kpi-content h2');
    return await valueElement.textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const valueElement = this.outstandingAmountKPI.locator('.kpi-content h2');
    return await valueElement.textContent();
  }

  async getNoCardsMessageText() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async getCardSummaryCount() {
    return await this.cardSummaryCards.count();
  }

  async getCardDetails(index) {
    const card = this.cardSummaryCards.nth(index);
    await expect(card).toBeVisible();
    
    const cardNumber = await card.locator('.card-number').textContent();
    const creditLimit = await card.locator('.credit-limit').textContent();
    const currentBalance = await card.locator('.current-balance').textContent();
    const availableCredit = await card.locator('.available-credit').textContent();
    const outstandingAmount = await card.locator('.outstanding-amount').textContent();
    
    return {
      cardNumber,
      creditLimit,
      currentBalance,
      availableCredit,
      outstandingAmount
    };
  }

  async scrollToAggregatedTotals() {
    await this.aggregatedTotalsSection.scrollIntoViewIfNeeded();
  }

  async getTotalAvailableCreditValue() {
    const element = this.aggregatedTotalsSection.locator('.total-available-credit');
    return await element.textContent();
  }

  async getTotalOutstandingValue() {
    const element = this.aggregatedTotalsSection.locator('.total-outstanding');
    return await element.textContent();
  }

  async getSingleCardMessageText() {
    await expect(this.singleCardMessage).toBeVisible();
    return await this.singleCardMessage.textContent();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getGridColumnCount() {
    const gridTemplateColumns = await this.cardSummaryContainer.evaluate(el => 
      window.getComputedStyle(el).gridTemplateColumns
    );
    return gridTemplateColumns.split(' ').length;
  }
};