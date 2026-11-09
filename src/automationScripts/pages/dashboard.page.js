const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

exports.DashboardPage = class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // KPI Locators
    this.dashboardContainer = page.locator('.dashboard-container, [data-testid="dashboard-container"]');
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"], .kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"], .kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"], .kpi-card:has-text("Outstanding Amount")');
    
    // Error and Status Indicators
    this.syncErrorMessage = page.locator('[data-testid="sync-error-message"], .alert-warning, .error-notification');
    this.unavailableDataIndicator = page.locator('[data-testid="data-unavailable"], .data-unavailable, .sync-error');
    
    // Layout Elements
    this.kpiCards = page.locator('.kpi-card, [data-testid="kpi-card"]');
    this.gridContainer = page.locator('.row, .grid-container, [data-testid="kpi-grid"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.waitForPageLoad();
    await expect(this.dashboardContainer).toBeVisible({ timeout: 10000 });
  }

  // KPI Value Extraction Methods
  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.locator('.kpi-value, .huge, [data-testid="kpi-value"]').textContent();
    return text.replace(/[^0-9.]/g, '');
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.locator('.kpi-value, .huge, [data-testid="kpi-value"]').textContent();
    return text.replace(/[^0-9.]/g, '');
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.locator('.kpi-value, .huge, [data-testid="kpi-value"]').textContent();
    return text.replace(/[^0-9.]/g, '');
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.locator('.kpi-value, .huge, [data-testid="kpi-value"]').textContent();
    return text.replace(/[^0-9.]/g, '');
  }

  async getMonthlySpendText() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  // Error and Status Methods
  async getVisibleKPICount() {
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    let count = 0;
    for (const kpi of kpis) {
      if (await kpi.isVisible()) count++;
    }
    return count;
  }

  async getUnavailableDataIndicators() {
    await this.page.waitForTimeout(1000); // Wait for indicators to render
    return await this.unavailableDataIndicator.all();
  }

  async getSyncErrorMessage() {
    await expect(this.syncErrorMessage).toBeVisible({ timeout: 5000 });
    return await this.syncErrorMessage.textContent();
  }

  async isDashboardInteractive() {
    const isVisible = await this.dashboardContainer.isVisible();
    const isEnabled = await this.dashboardContainer.isEnabled();
    return isVisible && isEnabled;
  }

  // Layout and Responsive Methods
  async getDashboardLayoutClass() {
    return await this.dashboardContainer.getAttribute('class');
  }

  async isVerticalStackLayout() {
    const kpiCards = await this.kpiCards.all();
    if (kpiCards.length < 2) return false;
    
    const firstBox = await kpiCards[0].boundingBox();
    const secondBox = await kpiCards[1].boundingBox();
    
    // Check if cards are stacked vertically (second card is below first card)
    return secondBox.y > firstBox.y + firstBox.height / 2;
  }

  async isGridLayout() {
    const kpiCards = await this.kpiCards.all();
    if (kpiCards.length < 2) return false;
    
    const firstBox = await kpiCards[0].boundingBox();
    const secondBox = await kpiCards[1].boundingBox();
    
    // Check if cards are arranged horizontally (side by side)
    return Math.abs(firstBox.y - secondBox.y) < 50; // Cards on same row
  }

  async getKPIColumnCount() {
    const kpiCards = await this.kpiCards.all();
    const firstBox = await kpiCards[0].boundingBox();
    let columnCount = 0;
    
    for (const card of kpiCards) {
      const box = await card.boundingBox();
      if (Math.abs(box.y - firstBox.y) < 50) {
        columnCount++;
      }
    }
    return columnCount;
  }

  async hasHorizontalScrollbar() {
    const scrollWidth = await this.page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await this.page.evaluate(() => document.documentElement.clientWidth);
    return scrollWidth > clientWidth;
  }

  async hasVerticalScrollbar() {
    const scrollHeight = await this.page.evaluate(() => document.documentElement.scrollHeight);
    const clientHeight = await this.page.evaluate(() => document.documentElement.clientHeight);
    return scrollHeight > clientHeight;
  }

  async canScrollVertically() {
    const scrollHeight = await this.page.evaluate(() => document.documentElement.scrollHeight);
    const clientHeight = await this.page.evaluate(() => document.documentElement.clientHeight);
    return scrollHeight > clientHeight;
  }

  async areAllKPIsVisibleInViewport() {
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    for (const kpi of kpis) {
      const isInViewport = await kpi.isVisible();
      if (!isInViewport) return false;
    }
    return true;
  }

  async areAllKPIsPresent() {
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    for (const kpi of kpis) {
      const count = await kpi.count();
      if (count === 0) return false;
    }
    return true;
  }

  async getKPIFontSize() {
    const fontSize = await this.monthlySpendKPI.locator('.kpi-value, .huge').evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    return fontSize;
  }

  async getKPISpacing() {
    const marginRight = await this.kpiCards.first().evaluate(el => {
      return window.getComputedStyle(el).marginRight;
    });
    return marginRight;
  }

  async getDashboardContainerWidth() {
    const box = await this.dashboardContainer.boundingBox();
    return box.width;
  }

  async isTextTruncated(locator) {
    return await locator.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
  }

  async hasLayoutBreakage() {
    // Check for common layout breakage indicators
    const hasOverflow = await this.page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        if (style.overflow === 'visible' && el.scrollWidth > el.clientWidth + 10) {
          return true;
        }
      }
      return false;
    });
    return hasOverflow;
  }
};