const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Card List Locators
    this.cardListContainer = page.locator('.card-management-container, [class*="card-list"]');
    this.cardItems = page.locator('.card-item');
    this.cardNumber = page.locator('.card-number');
    this.cardBank = page.locator('.card-bank');
    this.cardBalance = page.locator('.card-balance');
    this.cardLimit = page.locator('.card-limit');
    this.utilizationBar = page.locator('.utilization-bar .utilization-fill');
    
    // Card Detail Panel Locators
    this.cardDetailPanel = page.locator('.panel-primary, .card-details-panel');
    this.spendTrendChart = page.locator('canvas, .chart-container');
    this.chartTooltip = page.locator('.tooltip, [role="tooltip"]');
    this.monthlyTrendsTable = page.locator('table').filter({ hasText: 'Month' });
    
    // Loading and Error State Locators
    this.loadingIndicator = page.locator('.loading-spinner, [class*="loading"]');
    this.authErrorMessage = page.locator('.error-message, .alert-danger').filter({ hasText: 'validate' });
    this.noDataMessage = page.locator('text=No spending data available');
    
    // Warning and Message Locators
    this.maxLimitWarning = page.locator('text=maximum limit of 10 credit cards');
    
    // Comparison View Locators
    this.comparisonView = page.locator('.comparison-view, [class*="comparison"]');
    this.comparisonChart = page.locator('.comparison-chart, canvas');
    
    // Navigation
    this.cardManagementLink = page.locator('a[href*="card-management"], nav a:has-text("My Cards")');
  }

  async navigate() {
    await this.page.goto('/card-management');
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to Card Management page');
  }

  async login(username, password) {
    const isLoginPage = await this.page.locator('input[type="text"], input[name="username"]').isVisible().catch(() => false);
    
    if (isLoginPage) {
      await this.page.fill('input[type="text"], input[name="username"]', username);
      await this.page.fill('input[type="password"], input[name="password"]', password);
      await this.page.click('button[type="submit"], button:has-text("Login")');
      await this.page.waitForLoadState('networkidle');
      logger.info(`Logged in with username: ${username}`);
    }
  }

  async waitForAllCardsToLoad() {
    await expect(this.cardItems.first()).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    logger.info('All cards loaded');
  }

  async getCardCount() {
    await this.waitForAllCardsToLoad();
    const count = await this.cardItems.count();
    return count;
  }

  async getAllCardDetails() {
    const count = await this.getCardCount();
    const cards = [];
    
    for (let i = 0; i < count; i++) {
      const card = this.cardItems.nth(i);
      const cardNumber = await card.locator('.card-number').textContent();
      const bankName = await card.locator('.card-bank').textContent();
      const balance = await card.locator('.card-balance').textContent();
      const creditLimit = await card.locator('.card-limit').textContent();
      const utilizationRate = await card.locator('small').filter({ hasText: 'Utilization' }).textContent();
      
      cards.push({
        cardNumber: cardNumber.trim(),
        bankName: bankName.trim(),
        balance: balance.trim(),
        creditLimit: creditLimit.trim().replace('Limit: ', ''),
        utilizationRate: utilizationRate.trim().replace('Utilization: ', '')
      });
    }
    
    return cards;
  }

  async getAllCardNumbers() {
    const count = await this.getCardCount();
    const numbers = [];
    
    for (let i = 0; i < count; i++) {
      const cardNum = await this.cardItems.nth(i).locator('.card-number').textContent();
      numbers.push(cardNum.trim());
    }
    
    return numbers;
  }

  async selectCard(index) {
    await this.cardItems.nth(index).click();
    await this.page.waitForTimeout(500);
    logger.info(`Selected card at index ${index}`);
  }

  async getMonthlySpendTrends() {
    await expect(this.monthlyTrendsTable).toBeVisible();
    const rows = await this.monthlyTrendsTable.locator('tbody tr').all();
    const trends = [];
    
    for (const row of rows) {
      const month = await row.locator('td').nth(0).textContent();
      const amount = await row.locator('td').nth(1).textContent();
      trends.push({ month: month.trim(), amount: amount.trim() });
    }
    
    return trends;
  }

  async getChartType() {
    await expect(this.spendTrendChart).toBeVisible();
    // Determine chart type from canvas or chart container attributes
    const chartElement = await this.spendTrendChart.first();
    const chartClass = await chartElement.getAttribute('class');
    
    if (chartClass && chartClass.includes('line')) return 'line';
    if (chartClass && chartClass.includes('bar')) return 'bar';
    return 'line'; // default
  }

  async hoverOverChartDataPoint(index) {
    await expect(this.spendTrendChart).toBeVisible();
    // Hover over chart area (implementation depends on chart library)
    await this.spendTrendChart.hover();
    await this.page.waitForTimeout(500);
  }

  async isTrendsSectionEmpty() {
    const hasNoDataMessage = await this.noDataMessage.isVisible().catch(() => false);
    const hasEmptyChart = await this.spendTrendChart.isVisible().catch(() => false);
    
    return hasNoDataMessage || !hasEmptyChart;
  }

  async getCardComparisonData() {
    await expect(this.comparisonView).toBeVisible();
    const rows = await this.comparisonView.locator('table tbody tr, .comparison-item').all();
    const data = [];
    
    for (const row of rows) {
      const cardName = await row.locator('td, .card-name').first().textContent();
      const monthlySpend = await row.locator('td, .monthly-spend').nth(1).textContent();
      data.push({ cardName: cardName.trim(), monthlySpend: monthlySpend.trim() });
    }
    
    return data;
  }
};
