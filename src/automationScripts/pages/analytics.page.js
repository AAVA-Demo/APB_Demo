const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {

  constructor(page) {
    this.page = page;
    
    // Navigation locators
    this.analyticsLink = page.locator('a[href*="analytics"]');
    
    // Monthly trend graph locators
    this.monthlyTrendGraph = page.locator('.chart-container:has-text("Monthly"), canvas[id*="trend"]');
    this.graphPlaceholder = page.locator('.chart-container .placeholder, text=/No data available/i');
    this.insufficientDataMessage = page.locator('text=/Insufficient data|At least 2 months/i');
    this.dataPoints = page.locator('.chart-container canvas, svg circle, svg rect');
    this.tooltip = page.locator('.chart-tooltip, [role="tooltip"]');
    this.drillDownView = page.locator('.drill-down, .transaction-detail');
    
    // Category chart locators
    this.categoryChart = page.locator('.chart-container:has-text("Category"), canvas[id*="spending"]');
    this.categoryLegend = page.locator('.chart-legend, [chart-legend]');
    this.totalSpendElement = page.locator('text=/Total Spend:/i').locator('..');
    
    // Filter locators
    this.categoryFilterPanel = page.locator('[category-filter]');
    this.cardFilterPanel = page.locator('[card-filter]');
    this.chartTypeDropdown = page.locator('select[ng-model*="chartType"]');
    
    // Login locators
    this.usernameInput = page.locator('input[type="email"], input[name="username"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Login"), button:has-text("Sign In")');
  }

  async navigate() {
    await this.page.goto('https://app.creditcard.com');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/.*dashboard/, { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async goToAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForURL(/.*analytics/, { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async getMonthlyDataPoints() {
    await this.page.waitForSelector('canvas, svg', { state: 'visible', timeout: 5000 });
    return await this.dataPoints.all();
  }

  async hoverOverDataPoint(index) {
    const points = await this.getMonthlyDataPoints();
    if (points.length > index) {
      await points[index].hover();
      await this.page.waitForTimeout(500);
    }
  }

  async clickDataPoint(index) {
    const points = await this.getMonthlyDataPoints();
    if (points.length > index) {
      await points[index].click();
      await this.page.waitForTimeout(1000);
    }
  }

  async getDrillDownTransactions() {
    await expect(this.drillDownView).toBeVisible();
    const rows = await this.page.locator('.drill-down table tbody tr, .transaction-detail tbody tr').all();
    
    return rows.map(row => ({
      element: row,
      dateElement: row.locator('td:nth-child(1)'),
      merchantElement: row.locator('td:nth-child(2)'),
      amountElement: row.locator('td:has-text("USD"), td:has-text("$")'),
      cardElement: row.locator('td:has-text("****")'),
      
      async getAmount() {
        const text = await this.amountElement.textContent();
        return parseFloat(text.replace(/[^0-9.-]/g, ''));
      },
      
      async getCategoryName() {
        const categoryCell = row.locator('td:nth-child(4), td[data-category]');
        return await categoryCell.textContent();
      }
    }));
  }

  async selectCategoryFilter(categoryName) {
    const checkbox = this.page.locator(`[category-filter] input[type="checkbox"] + label:has-text("${categoryName}")`);
    await checkbox.click();
    await this.page.waitForTimeout(300);
  }

  async selectCardFilter(cardName) {
    const checkbox = this.page.locator(`[card-filter] input[type="checkbox"] + label:has-text("${cardName}")`);
    await checkbox.click();
    await this.page.waitForTimeout(300);
  }

  async waitForGraphUpdate() {
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
  }

  async getTotalSpend() {
    await expect(this.totalSpendElement).toBeVisible();
    const text = await this.totalSpendElement.textContent();
    const match = text.match(/\$([0-9,]+\.?[0-9]*)/)
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  }

  async getCategoryPercentage(categoryName) {
    await this.hoverOverCategory(categoryName);
    await expect(this.tooltip).toBeVisible();
    const text = await this.tooltip.textContent();
    const match = text.match(/([0-9]+\.?[0-9]*)%/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getCategoryElement(categoryName) {
    return this.page.locator(`.chart-legend li:has-text("${categoryName}"), text="${categoryName}"`);
  }

  async hoverOverCategory(categoryName) {
    const categoryElement = await this.getCategoryElement(categoryName);
    await categoryElement.hover();
    await this.page.waitForTimeout(500);
  }

  async clickCategorySegment(categoryName) {
    const categoryElement = await this.getCategoryElement(categoryName);
    await categoryElement.click();
    await this.page.waitForTimeout(1000);
  }

  async getActiveCategoryElements() {
    return await this.page.locator('.chart-legend li[class*="active"], [data-amount]:not([data-amount="0"])').all();
  }

  async getCategoryAmount(categoryNameOrElement) {
    let element;
    if (typeof categoryNameOrElement === 'string') {
      element = await this.getCategoryElement(categoryNameOrElement);
    } else {
      element = categoryNameOrElement;
    }
    
    await element.hover();
    await this.page.waitForTimeout(500);
    
    if (await this.tooltip.isVisible()) {
      const text = await this.tooltip.textContent();
      const match = text.match(/\$([0-9,]+\.?[0-9]*)/)
      return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    }
    return 0;
  }

  async getDrillDownTotal() {
    const totalElement = this.page.locator('.drill-down text=/Total:/i, .transaction-detail text=/Total:/i').locator('..');
    await expect(totalElement).toBeVisible();
    const text = await totalElement.textContent();
    const match = text.match(/\$([0-9,]+\.?[0-9]*)/)
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  }

  async getDrillDownCount() {
    const countElement = this.page.locator('text=/Transaction[s]?:/i').locator('..');
    await expect(countElement).toBeVisible();
    const text = await countElement.textContent();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

};