const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"], .kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"], .kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"], .kpi-card:has-text("Outstanding Amount")');
    
    // Credit Card Locators
    this.creditCardList = page.locator('[data-testid="credit-card-list"], .credit-card-list');
    this.creditCardItems = page.locator('[data-testid="credit-card-item"], .credit-card-item');
    
    // Message Locators
    this.noCreditCardsMessage = page.locator('[data-testid="no-cards-message"], .no-data-message:has-text("No credit cards")');
    
    // Layout Locators
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"], .dashboard-view');
    this.kpiContainer = page.locator('[data-testid="kpi-container"], .row:has(.kpi-card)');
  }

  async navigate() {
    logger.info('Navigating to dashboard page');
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await expect(this.dashboardContainer).toBeVisible({ timeout: 5000 });
    // Wait for either KPIs or no cards message to be visible
    await Promise.race([
      this.monthlySpendKPI.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {}),
      this.noCreditCardsMessage.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {})
    ]);
  }

  async getCreditCardCount() {
    logger.info('Getting credit card count');
    await this.creditCardItems.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    return await this.creditCardItems.count();
  }

  getCreditCardByLastDigits(lastDigits) {
    return this.page.locator(`[data-testid="credit-card-item"]:has-text("${lastDigits}"), .credit-card-item:has-text("${lastDigits}")`);
  }

  async getMonthlySpendValue() {
    logger.info('Getting monthly spend value');
    const text = await this.monthlySpendKPI.locator('.kpi-value, [data-testid="kpi-value"]').textContent();
    return this.parseNumericValue(text);
  }

  async getTotalCreditLimitValue() {
    logger.info('Getting total credit limit value');
    const text = await this.totalCreditLimitKPI.locator('.kpi-value, [data-testid="kpi-value"]').textContent();
    return this.parseNumericValue(text);
  }

  async getAvailableCreditValue() {
    logger.info('Getting available credit value');
    const text = await this.availableCreditKPI.locator('.kpi-value, [data-testid="kpi-value"]').textContent();
    return this.parseNumericValue(text);
  }

  async getOutstandingAmountValue() {
    logger.info('Getting outstanding amount value');
    const text = await this.outstandingAmountKPI.locator('.kpi-value, [data-testid="kpi-value"]').textContent();
    return this.parseNumericValue(text);
  }

  parseNumericValue(text) {
    // Remove currency symbols, commas, and whitespace, then parse
    const cleaned = text.replace(/[$,\s]/g, '');
    return parseFloat(cleaned) || 0;
  }

  async getNoCreditCardsMessageText() {
    logger.info('Getting no credit cards message text');
    return await this.noCreditCardsMessage.textContent();
  }

  async areKPIWidgetsVisible() {
    logger.info('Checking if KPI widgets are visible');
    const monthlySpendVisible = await this.monthlySpendKPI.isVisible().catch(() => false);
    return monthlySpendVisible;
  }

  async getKPILayout() {
    logger.info('Determining KPI layout');
    const kpiContainerBox = await this.kpiContainer.boundingBox();
    const firstKPIBox = await this.monthlySpendKPI.boundingBox();
    const secondKPIBox = await this.totalCreditLimitKPI.boundingBox();
    
    if (!firstKPIBox || !secondKPIBox) {
      return 'unknown';
    }
    
    // If KPIs are stacked vertically, their Y positions will be significantly different
    const yDifference = Math.abs(secondKPIBox.y - firstKPIBox.y);
    
    if (yDifference > 50) {
      return 'stacked';
    } else {
      return 'multi-column';
    }
  }

  async hasHorizontalScroll() {
    logger.info('Checking for horizontal scroll');
    const scrollWidth = await this.page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await this.page.evaluate(() => document.documentElement.clientWidth);
    return scrollWidth > clientWidth;
  }

  async hasVerticalScroll() {
    logger.info('Checking for vertical scroll');
    const scrollHeight = await this.page.evaluate(() => document.documentElement.scrollHeight);
    const clientHeight = await this.page.evaluate(() => document.documentElement.clientHeight);
    return scrollHeight > clientHeight;
  }

  async isCreditCardListVisible() {
    logger.info('Checking if credit card list is visible');
    return await this.creditCardList.isVisible().catch(() => false);
  }

  async getCreditCardLayout() {
    logger.info('Determining credit card layout');
    const cardItems = await this.creditCardItems.all();
    if (cardItems.length < 2) {
      return 'single';
    }
    
    const firstCardBox = await cardItems[0].boundingBox();
    const secondCardBox = await cardItems[1].boundingBox();
    
    if (!firstCardBox || !secondCardBox) {
      return 'unknown';
    }
    
    // If cards are side by side, their Y positions will be similar
    const yDifference = Math.abs(secondCardBox.y - firstCardBox.y);
    
    if (yDifference < 50) {
      return 'grid';
    } else {
      return 'stacked';
    }
  }

  async hasExcessiveWhiteSpace() {
    logger.info('Checking for excessive white space');
    // This is a simplified check - in real implementation, you'd analyze actual spacing
    const viewportHeight = await this.page.viewportSize().then(size => size.height);
    const contentHeight = await this.dashboardContainer.evaluate(el => el.scrollHeight);
    
    // If content takes up less than 40% of viewport, consider it excessive white space
    return contentHeight < (viewportHeight * 0.4);
  }

  async isAllTextVisible() {
    logger.info('Checking if all text is visible without truncation');
    // Check if any text has text-overflow: ellipsis applied
    const truncatedElements = await this.page.locator('*').evaluateAll(elements => {
      return elements.filter(el => {
        const style = window.getComputedStyle(el);
        return style.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth;
      }).length;
    });
    
    return truncatedElements === 0;
  }
};
