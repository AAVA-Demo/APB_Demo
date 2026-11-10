const { expect } = require('@playwright/test');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    this.portfolioNavLink = page.locator('a[href*="portfolio"]');
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardItem = page.locator('.card-item');
    this.displayLimitNotification = page.locator('[data-testid="display-limit-notification"]');
    this.serviceUnavailableError = page.locator('[data-testid="service-unavailable-error"]');
    this.cardWiseAnalysisTab = page.locator('[data-testid="card-wise-analysis-tab"]');
    this.utilizationChart = page.locator('[data-testid="utilization-chart"]');
    this.trendLineGraph = page.locator('[data-testid="trend-line-graph"]');
    this.noSpendingActivityMessage = page.locator('[data-testid="no-spending-activity-message"]');
  }

  async navigateToPortfolio() {
    await this.portfolioNavLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveURL(/portfolio/);
  }

  async navigateToPortfolioWithTestFlag(testFlag) {
    await this.page.goto(`https://creditcard-dashboard.example.com/portfolio?${testFlag}`);
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await this.page.waitForSelector('.card-item', { timeout: 5000 }).catch(() => {});
    const cards = await this.cardItem.all();
    return cards.length;
  }

  async getAllCardNumbers() {
    const cards = await this.cardItem.all();
    const cardNumbers = [];
    
    for (const card of cards) {
      const numberText = await card.locator('.card-number').textContent();
      cardNumbers.push(numberText.trim());
    }
    
    return cardNumbers;
  }

  async getCardDetails(cardNumber) {
    const card = this.cardItem.locator(`:has-text("${cardNumber}")`);
    await expect(card).toBeVisible();
    
    const type = await card.locator('.card-type').textContent();
    const creditLimit = await card.locator('.credit-limit').textContent();
    const currentBalance = await card.locator('.current-balance').textContent();
    const monthlySpend = await card.locator('.monthly-spend').textContent().catch(() => '$0.00');
    const utilization = await card.locator('.utilization').textContent().catch(() => '0%');
    
    return {
      type: type.trim(),
      creditLimit: creditLimit.trim(),
      currentBalance: currentBalance.trim(),
      monthlySpend: monthlySpend.trim(),
      utilization: utilization.trim()
    };
  }

  async getPageLoadTime() {
    const startTime = Date.now();
    await this.page.waitForSelector('.card-item', { timeout: 5000 });
    const endTime = Date.now();
    return endTime - startTime;
  }

  async checkForCorruptedUI() {
    // Check for broken images, missing elements, or error indicators
    const brokenImages = await this.page.locator('img[src=""]').count();
    const errorElements = await this.page.locator('.error, .broken').count();
    
    return brokenImages > 0 || errorElements > 0;
  }

  async selectCardWiseSpendAnalysis() {
    await this.cardWiseAnalysisTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardMonthlySpend(cardNumber) {
    const card = this.cardItem.locator(`:has-text("${cardNumber}")`);
    await expect(card).toBeVisible();
    const spendText = await card.locator('.monthly-spend').textContent();
    return spendText.trim();
  }

  async getCardUtilization(cardNumber) {
    const card = this.cardItem.locator(`:has-text("${cardNumber}")`);
    await expect(card).toBeVisible();
    const utilizationText = await card.locator('.utilization').textContent();
    return utilizationText.trim();
  }

  async getHighestUtilizationCard() {
    const cards = await this.cardItem.all();
    let highestUtilization = 0;
    let highestCard = '';
    
    for (const card of cards) {
      const utilizationText = await card.locator('.utilization').textContent();
      const utilization = parseFloat(utilizationText.replace('%', ''));
      
      if (utilization > highestUtilization) {
        highestUtilization = utilization;
        highestCard = await card.locator('.card-number').textContent();
      }
    }
    
    return highestCard.trim();
  }

  async getCardMonthlyTrends(cardNumber) {
    const card = this.cardItem.locator(`:has-text("${cardNumber}")`);
    await expect(card).toBeVisible();
    
    const trendElements = await card.locator('.trend-data-point').all();
    const trends = [];
    
    for (const element of trendElements) {
      const month = await element.locator('.month').textContent();
      const amount = await element.locator('.amount').textContent();
      trends.push({ month: month.trim(), amount: amount.trim() });
    }
    
    return trends;
  }

  async isCardTrendVisible(cardNumber) {
    const card = this.cardItem.locator(`:has-text("${cardNumber}")`);
    const trendLine = card.locator('.trend-line');
    return await trendLine.isVisible();
  }

  async getMostUtilizedCard() {
    await expect(this.utilizationChart).toBeVisible();
    
    const mostUtilizedElement = this.utilizationChart.locator('.most-utilized-card');
    await expect(mostUtilizedElement).toBeVisible();
    
    const cardNumber = await mostUtilizedElement.locator('.card-number').textContent();
    const totalSpend = await mostUtilizedElement.locator('.total-spend').textContent();
    
    return {
      cardNumber: cardNumber.trim(),
      totalSpend: totalSpend.trim()
    };
  }
};