const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend"], .kpi-card:has-text("Monthly Spend"), .monthly-spend');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"], .kpi-card:has-text("Total Credit Limit"), .total-credit-limit');
    this.availableCreditKPI = page.locator('[data-testid="available-credit"], .kpi-card:has-text("Available Credit"), .available-credit');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount"], .kpi-card:has-text("Outstanding Amount"), .outstanding-amount');
    
    this.monthlySpendLabel = page.locator('[data-testid="monthly-spend-label"], .kpi-label:has-text("Monthly Spend")');
    this.totalCreditLimitLabel = page.locator('[data-testid="total-credit-limit-label"], .kpi-label:has-text("Total Credit Limit")');
    this.availableCreditLabel = page.locator('[data-testid="available-credit-label"], .kpi-label:has-text("Available Credit")');
    this.outstandingAmountLabel = page.locator('[data-testid="outstanding-amount-label"], .kpi-label:has-text("Outstanding Amount")');
    
    this.loadingIndicator = page.locator('.loading-spinner, .loader, [data-testid="loading"]');
    this.lastUpdatedTimestamp = page.locator('.last-updated, [data-testid="last-updated"]');
    this.errorMessage = page.locator('.error-message, .alert-danger, [data-testid="error"]');
    this.noDataMessage = page.locator('.no-data-message, [data-testid="no-data"]');
    this.dataFeedWarning = page.locator('.data-feed-warning, [data-testid="data-warning"]');
    this.browserWarning = page.locator('.browser-warning, [data-testid="browser-warning"]');
    this.kpiContainer = page.locator('.kpi-container, .dashboard-kpis, [data-testid="kpi-container"]');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await this.page.waitForLoadState('networkidle');
    await expect(this.monthlySpendKPI.or(this.noDataMessage)).toBeVisible({ timeout: 10000 });
    logger.info('Dashboard loaded');
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    const match = text.match(/\$[0-9,]+\.[0-9]{2}/);
    return match ? match[0] : '0';
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    const match = text.match(/\$[0-9,]+\.[0-9]{2}/);
    return match ? match[0] : '0';
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    const match = text.match(/\$[0-9,]+\.[0-9]{2}/);
    return match ? match[0] : '0';
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    const match = text.match(/\$[0-9,]+\.[0-9]{2}/);
    return match ? match[0] : '0';
  }

  async hasLoadingIndicator() {
    try {
      await this.loadingIndicator.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async hasLastUpdatedTimestamp() {
    try {
      await this.lastUpdatedTimestamp.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    return await this.lastUpdatedTimestamp.textContent();
  }

  async hasNoDataMessage() {
    try {
      await this.noDataMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async hasErrorMessage() {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async hasDataFeedWarning() {
    try {
      await this.dataFeedWarning.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getDataFeedWarning() {
    await expect(this.dataFeedWarning).toBeVisible();
    return await this.dataFeedWarning.textContent();
  }

  async hasBrowserWarning() {
    try {
      await this.browserWarning.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async getBrowserWarning() {
    await expect(this.browserWarning).toBeVisible();
    return await this.browserWarning.textContent();
  }

  async getKPILayout() {
    const container = await this.kpiContainer.boundingBox();
    const cards = await this.page.locator('.kpi-card').all();
    
    if (cards.length === 0) return 'unknown';
    
    const firstCard = await cards[0].boundingBox();
    const secondCard = cards.length > 1 ? await cards[1].boundingBox() : null;
    
    if (!secondCard) return 'single';
    
    if (Math.abs(firstCard.y - secondCard.y) < 10) {
      const cardsInRow = cards.filter(async (card) => {
        const box = await card.boundingBox();
        return Math.abs(box.y - firstCard.y) < 10;
      }).length;
      
      if (cardsInRow === 4) return 'grid-4-column';
      if (cardsInRow === 2) return 'grid-2-column';
      return 'grid-2-row';
    }
    
    return 'stacked';
  }

  async getKPIFontSize() {
    const kpiValue = this.page.locator('.kpi-value, .kpi-card .value').first();
    await expect(kpiValue).toBeVisible();
    const fontSize = await kpiValue.evaluate(el => window.getComputedStyle(el).fontSize);
    return fontSize;
  }
};