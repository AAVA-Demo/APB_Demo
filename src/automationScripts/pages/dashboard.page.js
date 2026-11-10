const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    // KPI locators
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend-kpi"], .kpi-monthly-spend, :has-text("Monthly Spend")').first();
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit-kpi"], .kpi-credit-limit, :has-text("Total Credit Limit")').first();
    this.availableCreditKPI = page.locator('[data-testid="available-credit-kpi"], .kpi-available-credit, :has-text("Available Credit")').first();
    this.outstandingAmountsKPI = page.locator('[data-testid="outstanding-amounts-kpi"], .kpi-outstanding, :has-text("Outstanding")').first();
    
    // Card and portfolio locators
    this.cardContainer = page.locator('.card-list, .cards-container, [data-testid="cards-container"]');
    this.cardItems = page.locator('.card-item, .credit-card, [data-testid="card-item"]');
    this.portfolioSummary = page.locator('.portfolio-summary, [data-testid="portfolio-summary"]');
    
    // Messages and buttons
    this.noCardsMessage = page.locator('.no-cards-message, :has-text("no registered credit cards")');
    this.addCardButton = page.locator('button:has-text("Add Credit Card"), .add-card-button');
    this.kpiErrorMessage = page.locator('.kpi-error, .error-message, :has-text("Unable to retrieve KPI")');
    this.retryButton = page.locator('button:has-text("Retry"), .retry-button');
    this.refreshButton = page.locator('button:has-text("Refresh"), .refresh-button');
  }

  async waitForDashboardToLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('.dashboard, [data-testid="dashboard"]', { state: 'visible', timeout: 10000 }).catch(() => {});
  }

  async getCardCount() {
    await this.cardItems.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.cardItems.count();
  }

  async getAllCardDetails() {
    const cards = [];
    const count = await this.getCardCount();
    for (let i = 0; i < count; i++) {
      const card = this.cardItems.nth(i);
      const cardName = await card.locator('.card-name, [data-testid="card-name"]').textContent();
      const lastFourDigits = await card.locator('.card-number, [data-testid="card-number"]').textContent();
      const creditLimit = await card.locator('.credit-limit, [data-testid="credit-limit"]').textContent();
      const availableCredit = await card.locator('.available-credit, [data-testid="available-credit"]').textContent();
      const outstandingAmount = await card.locator('.outstanding, [data-testid="outstanding"]').textContent();
      const monthlySpend = await card.locator('.monthly-spend, [data-testid="monthly-spend"]').textContent();
      
      cards.push({
        cardName: cardName.trim(),
        lastFourDigits: lastFourDigits.trim(),
        creditLimit: creditLimit.trim(),
        availableCredit: availableCredit.trim(),
        outstandingAmount: outstandingAmount.trim(),
        monthlySpend: monthlySpend.trim()
      });
    }
    return cards;
  }

  async getPortfolioSummary() {
    await this.portfolioSummary.waitFor({ state: 'visible' });
    const totalCreditLimit = await this.portfolioSummary.locator(':has-text("Total Credit Limit")').textContent();
    const totalAvailableCredit = await this.portfolioSummary.locator(':has-text("Total Available Credit")').textContent();
    const totalOutstanding = await this.portfolioSummary.locator(':has-text("Total Outstanding")').textContent();
    
    return {
      totalCreditLimit: totalCreditLimit.trim(),
      totalAvailableCredit: totalAvailableCredit.trim(),
      totalOutstanding: totalOutstanding.trim()
    };
  }

  async getTotalMonthlySpend() {
    const element = await this.portfolioSummary.locator(':has-text("Total Monthly Spend"), :has-text("Monthly Spend")').first();
    return await element.textContent();
  }

  async getNoCardsMessageText() {
    await this.noCardsMessage.waitFor({ state: 'visible' });
    return await this.noCardsMessage.textContent();
  }

  async getCardLayoutType() {
    const containerClass = await this.cardContainer.getAttribute('class');
    if (containerClass.includes('single-column') || await this.page.viewportSize().width < 768) {
      return 'single-column';
    } else if (containerClass.includes('two-column') || await this.page.viewportSize().width < 1024) {
      return 'two-column';
    } else {
      return 'multi-column';
    }
  }

  async verifyAllCardsAccessible() {
    const count = await this.getCardCount();
    for (let i = 0; i < count; i++) {
      const card = this.cardItems.nth(i);
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
    }
    return true;
  }

  async verifyPortfolioSummaryFormatting() {
    await this.portfolioSummary.waitFor({ state: 'visible' });
    const boundingBox = await this.portfolioSummary.boundingBox();
    return boundingBox !== null && boundingBox.width > 0 && boundingBox.height > 0;
  }

  async verifyPortfolioSummaryProminence() {
    await this.portfolioSummary.waitFor({ state: 'visible' });
    const boundingBox = await this.portfolioSummary.boundingBox();
    return boundingBox !== null && boundingBox.y < 300;
  }

  async getMonthlySpendValue() {
    await this.monthlySpendKPI.waitFor({ state: 'visible' });
    return await this.monthlySpendKPI.locator('.value, .kpi-value').textContent();
  }

  async getTotalCreditLimitValue() {
    await this.totalCreditLimitKPI.waitFor({ state: 'visible' });
    return await this.totalCreditLimitKPI.locator('.value, .kpi-value').textContent();
  }

  async getAvailableCreditValue() {
    await this.availableCreditKPI.waitFor({ state: 'visible' });
    return await this.availableCreditKPI.locator('.value, .kpi-value').textContent();
  }

  async getOutstandingAmountsValue() {
    await this.outstandingAmountsKPI.waitFor({ state: 'visible' });
    return await this.outstandingAmountsKPI.locator('.value, .kpi-value').textContent();
  }

  async getTotalSpending() {
    const monthlySpend = await this.getMonthlySpendValue();
    return monthlySpend;
  }

  async refreshDashboard() {
    if (await this.refreshButton.isVisible()) {
      await this.refreshButton.click();
    } else {
      await this.page.reload();
    }
    await this.waitForDashboardToLoad();
  }

  async getKpiErrorMessageText() {
    await this.kpiErrorMessage.waitFor({ state: 'visible' });
    return await this.kpiErrorMessage.textContent();
  }

  async clickRetry() {
    await this.retryButton.waitFor({ state: 'visible' });
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getPortfolioSummaryText() {
    await this.portfolioSummary.waitFor({ state: 'visible' });
    return await this.portfolioSummary.textContent();
  }
};