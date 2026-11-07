const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    this.dashboardContainer = page.locator('.dashboard-container, #dashboard, [data-testid="dashboard"]');
    this.monthlySpendKPI = page.locator('.kpi-card:has-text("Monthly Spend"), [data-kpi="monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit"), [data-kpi="total-credit-limit"]');
    this.availableCreditKPI = page.locator('.kpi-card:has-text("Available Credit"), [data-kpi="available-credit"]');
    this.outstandingAmountKPI = page.locator('.kpi-card:has-text("Outstanding"), [data-kpi="outstanding-amount"]');
    
    this.kpiValue = page.locator('.kpi-value');
    this.kpiLabel = page.locator('.kpi-label');
    
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
    this.noCardsMessage = page.locator('.no-cards-message, .alert-info:has-text("No credit cards")');
    
    this.analyticsLink = page.locator('a[href*="analytics"], button:has-text("Analytics"), [data-nav="analytics"]');
    this.cardManagementLink = page.locator('a[href*="cards"], button:has-text("Manage Cards"), [data-nav="cards"]');
    
    this.refreshButton = page.locator('button:has-text("Refresh")');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Dashboard loaded successfully');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const valueElement = this.monthlySpendKPI.locator('.kpi-value');
    return await valueElement.textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const valueElement = this.totalCreditLimitKPI.locator('.kpi-value');
    return await valueElement.textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const valueElement = this.availableCreditKPI.locator('.kpi-value');
    return await valueElement.textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const valueElement = this.outstandingAmountKPI.locator('.kpi-value');
    return await valueElement.textContent();
  }

  async areKPIsVisible() {
    try {
      await expect(this.monthlySpendKPI).toBeVisible({ timeout: 2000 });
      await expect(this.totalCreditLimitKPI).toBeVisible({ timeout: 2000 });
      await expect(this.availableCreditKPI).toBeVisible({ timeout: 2000 });
      await expect(this.outstandingAmountKPI).toBeVisible({ timeout: 2000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async areAllKPIsVisible() {
    return await this.areKPIsVisible();
  }

  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async navigateToAnalytics() {
    await expect(this.analyticsLink).toBeVisible();
    await this.analyticsLink.click();
    logger.info('Navigated to Analytics section');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCardManagement() {
    await expect(this.cardManagementLink).toBeVisible();
    await this.cardManagementLink.click();
    logger.info('Navigated to Card Management section');
    await this.page.waitForLoadState('networkidle');
  }

  async getKPIFontSize() {
    const fontSize = await this.kpiValue.first().evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    return fontSize;
  }

  async isKPILayoutStacked() {
    const kpiCards = await this.page.locator('.kpi-card').all();
    if (kpiCards.length < 2) return false;
    
    const firstCardBox = await kpiCards[0].boundingBox();
    const secondCardBox = await kpiCards[1].boundingBox();
    
    if (!firstCardBox || !secondCardBox) return false;
    
    return secondCardBox.y > firstCardBox.y + firstCardBox.height;
  }

  async isDesktopLayout() {
    const viewportWidth = await this.page.evaluate(() => window.innerWidth);
    return viewportWidth >= 1024;
  }

  async isMobileLayout() {
    const viewportWidth = await this.page.evaluate(() => window.innerWidth);
    return viewportWidth < 768;
  }

  async clickRefresh() {
    await expect(this.refreshButton).toBeVisible();
    await this.refreshButton.click();
    logger.info('Clicked refresh button');
  }
};