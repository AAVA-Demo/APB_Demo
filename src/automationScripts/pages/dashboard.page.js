const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.loadingIndicator = page.locator('.loading-spinner, .loading-indicator');
    this.loadingState = page.locator('.loading-state, .data-unavailable');
  }

  async waitForKPIsToLoad() {
    await expect(this.monthlySpendKPI).toBeVisible({ timeout: 5000 });
    await expect(this.totalCreditLimitKPI).toBeVisible({ timeout: 5000 });
    await expect(this.availableCreditKPI).toBeVisible({ timeout: 5000 });
    await expect(this.outstandingAmountKPI).toBeVisible({ timeout: 5000 });
    logger.info('All KPIs loaded successfully');
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const value = await this.monthlySpendKPI.textContent();
    logger.info(`Monthly Spend retrieved: ${value}`);
    return value.trim();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const value = await this.totalCreditLimitKPI.textContent();
    logger.info(`Total Credit Limit retrieved: ${value}`);
    return value.trim();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const value = await this.availableCreditKPI.textContent();
    logger.info(`Available Credit retrieved: ${value}`);
    return value.trim();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const value = await this.outstandingAmountKPI.textContent();
    logger.info(`Outstanding Amount retrieved: ${value}`);
    return value.trim();
  }

  calculateAvailableCredit(totalLimit, outstanding) {
    const limitValue = parseFloat(totalLimit.replace(/[$,]/g, ''));
    const outstandingValue = parseFloat(outstanding.replace(/[$,]/g, ''));
    const available = (limitValue - outstandingValue).toFixed(2);
    const formatted = `$${parseFloat(available).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    logger.info(`Calculated Available Credit: ${formatted}`);
    return formatted;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const message = await this.errorMessage.textContent();
    logger.info(`Error message retrieved: ${message}`);
    return message.trim();
  }

  async hasLoadingState() {
    const isVisible = await this.loadingState.isVisible();
    logger.info(`Loading state visible: ${isVisible}`);
    return isVisible;
  }

  async canNavigateToOtherSections() {
    const navLinks = this.page.locator('nav a, .nav-link');
    const count = await navLinks.count();
    logger.info(`Navigation links available: ${count}`);
    return count > 0;
  }

  async getKPILayout() {
    const container = this.page.locator('.kpi-container, .dashboard-kpis');
    const styles = await container.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        flexDirection: computed.flexDirection,
        gridTemplateColumns: computed.gridTemplateColumns
      };
    });
    
    if (styles.display === 'grid' && styles.gridTemplateColumns.includes('2')) {
      return 'grid-2x2';
    } else if (styles.flexDirection === 'column') {
      return 'vertical';
    }
    return 'horizontal';
  }

  async getKPIFontSize() {
    const fontSize = await this.monthlySpendKPI.evaluate(el => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });
    logger.info(`KPI font size: ${fontSize}px`);
    return fontSize;
  }

  async getKPISpacing() {
    const spacing = await this.page.evaluate(() => {
      const kpis = document.querySelectorAll('[data-testid^="kpi-"]');
      if (kpis.length < 2) return 0;
      const rect1 = kpis[0].getBoundingClientRect();
      const rect2 = kpis[1].getBoundingClientRect();
      return Math.abs(rect2.top - rect1.bottom);
    });
    logger.info(`KPI spacing: ${spacing}px`);
    return spacing;
  }

  async hasHorizontalScroll() {
    const hasScroll = await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    logger.info(`Has horizontal scroll: ${hasScroll}`);
    return hasScroll;
  }

  async getCurrentBreakpoint() {
    const width = await this.page.viewportSize().width;
    logger.info(`Current viewport width: ${width}px`);
    return width;
  }

  async areAllKPIsLoaded() {
    const allVisible = await Promise.all([
      this.monthlySpendKPI.isVisible(),
      this.totalCreditLimitKPI.isVisible(),
      this.availableCreditKPI.isVisible(),
      this.outstandingAmountKPI.isVisible()
    ]);
    return allVisible.every(visible => visible === true);
  }

  async getTimeoutMessage() {
    const timeoutMsg = this.page.locator('.timeout-message, .slow-connection-warning');
    await expect(timeoutMsg).toBeVisible();
    const message = await timeoutMsg.textContent();
    logger.info(`Timeout message retrieved: ${message}`);
    return message.trim();
  }

  async hasRetryButton() {
    const retryButton = this.page.locator('button:has-text("Retry"), button:has-text("Try Again")');
    const isVisible = await retryButton.isVisible();
    logger.info(`Retry button visible: ${isVisible}`);
    return isVisible;
  }
};
