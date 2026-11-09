const { expect } = require('@playwright/test');
const BasePage = require('./base.page');
const config = require('../../data/config.json');

exports.DashboardPage = class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // Locators
    this.monthlySpendWidget = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitWidget = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditWidget = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountWidget = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.kpiWidgetContainer = page.locator('.kpi-widget-container');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.addCardButton = page.locator('[data-testid="add-card-button"]');
    this.creditUtilizationBar = page.locator('[data-testid="credit-utilization-bar"]');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"]');
    this.refreshButton = page.locator('[data-testid="refresh-dashboard"]');
  }

  async navigate() {
    await this.page.goto(config.baseUrl + '/dashboard');
  }

  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.kpiWidgetContainer).toBeVisible({ timeout: 5000 });
  }

  async getKPIValues() {
    await this.waitForDashboardLoad();
    
    const totalCreditLimit = await this.extractNumericValue(this.totalCreditLimitWidget);
    const availableCredit = await this.extractNumericValue(this.availableCreditWidget);
    const outstandingAmount = await this.extractNumericValue(this.outstandingAmountWidget);
    const monthlySpend = await this.extractNumericValue(this.monthlySpendWidget);
    
    const creditUtilization = (outstandingAmount / totalCreditLimit) * 100;

    return {
      totalCreditLimit,
      availableCredit,
      outstandingAmount,
      monthlySpend,
      creditUtilization
    };
  }

  async extractNumericValue(locator) {
    const text = await locator.textContent();
    const numericValue = text.replace(/[^0-9.]/g, '');
    return parseFloat(numericValue);
  }

  async getKPIWidgetLayout() {
    await this.waitForDashboardLoad();
    
    const widgets = await this.page.locator('.kpi-widget').all();
    const firstWidgetBox = await widgets[0].boundingBox();
    const secondWidgetBox = await widgets[1].boundingBox();
    
    const columns = firstWidgetBox.y === secondWidgetBox.y ? 2 : 1;
    
    const viewportWidth = await this.page.viewportSize().width;
    const bodyWidth = await this.page.evaluate(() => document.body.scrollWidth);
    const hasHorizontalScroll = bodyWidth > viewportWidth;

    return {
      columns,
      hasHorizontalScroll
    };
  }

  async refreshDashboard() {
    await this.refreshButton.click();
    await this.waitForDashboardLoad();
  }

  async getCreditUtilizationPercentage() {
    const utilizationText = await this.creditUtilizationBar.textContent();
    return parseFloat(utilizationText.replace('%', ''));
  }
};
