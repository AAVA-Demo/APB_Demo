const { expect } = require('@playwright/test');

exports.TrendAnalysisPage = class TrendAnalysisPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.trendAnalysisMenu = page.locator('a[href*="trend-analysis"]');
    this.monthlyTrendsTab = page.locator('[data-tab="monthly-trends"]');
    this.cardwiseAnalysisTab = page.locator('[data-tab="cardwise-analysis"]');
    
    // Monthly Trends
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.monthLabels = page.locator('.month-label');
    this.monthDataPoints = page.locator('.data-point');
    this.momComparisons = page.locator('.mom-comparison');
    this.insufficientDataNotification = page.locator('[data-testid="insufficient-data-notification"]');
    
    // Growth Indicators
    this.highGrowthIndicators = page.locator('.high-growth-indicator');
    this.reducedSpendingIndicators = page.locator('.reduced-spending-indicator');
    
    // Card-wise Analysis
    this.cardBreakdownChart = page.locator('[data-testid="card-breakdown-chart"]');
    this.cardItems = page.locator('.card-analysis-item');
    this.inactiveCardNotification = page.locator('[data-testid="inactive-card-notification"]');
    this.mostFrequentCardIndicator = page.locator('[data-testid="most-frequent-card"]');
    this.optimizationInsights = page.locator('[data-testid="optimization-insights"]');
  }

  async navigate() {
    await this.trendAnalysisMenu.click();
    await expect(this.trendChart.or(this.cardBreakdownChart)).toBeVisible({ timeout: 10000 });
  }

  async navigateToMonthlyTrends() {
    await this.monthlyTrendsTab.click();
    await expect(this.trendChart).toBeVisible();
  }

  async navigateToCardwiseAnalysis() {
    await this.cardwiseAnalysisTab.click();
    await expect(this.cardBreakdownChart).toBeVisible();
  }

  async getTrendMonths() {
    await this.monthLabels.first().waitFor({ state: 'visible' });
    const labels = await this.monthLabels.all();
    const months = [];
    
    for (const label of labels) {
      const text = await label.textContent();
      months.push(text.trim());
    }
    
    return months;
  }

  async getMoMComparisons() {
    const comparisons = await this.momComparisons.all();
    const values = [];
    
    for (const comp of comparisons) {
      const text = await comp.textContent();
      values.push(text.trim());
    }
    
    return values;
  }

  async getMonthlySpendTotals() {
    const dataPoints = await this.monthDataPoints.all();
    const totals = [];
    
    for (const point of dataPoints) {
      const value = await point.getAttribute('data-value');
      totals.push(parseFloat(value));
    }
    
    return totals;
  }

  async getHighGrowthMonths() {
    const indicators = await this.highGrowthIndicators.all();
    const months = [];
    
    for (const indicator of indicators) {
      const month = await indicator.getAttribute('data-month');
      months.push(month);
    }
    
    return months;
  }

  async getReducedSpendingMonths() {
    const indicators = await this.reducedSpendingIndicators.all();
    const months = [];
    
    for (const indicator of indicators) {
      const month = await indicator.getAttribute('data-month');
      months.push(month);
    }
    
    return months;
  }

  async getStableMonths() {
    const allMonths = await this.getTrendMonths();
    const highGrowth = await this.getHighGrowthMonths();
    const reducedSpending = await this.getReducedSpendingMonths();
    
    return allMonths.filter(m => !highGrowth.includes(m) && !reducedSpending.includes(m));
  }

  getMonthIndicator(month) {
    return this.page.locator(`[data-month="${month}"] .month-indicator`);
  }

  async getMoMChange(month) {
    const indicator = this.page.locator(`[data-month="${month}"] [data-field="mom-change"]`);
    const text = await indicator.textContent();
    return parseFloat(text.replace('%', ''));
  }

  getCardSpendingAmount(cardName) {
    return this.page.locator(`[data-card="${cardName}"] [data-field="spending-amount"]`);
  }

  getCardSpendingPercentage(cardName) {
    return this.page.locator(`[data-card="${cardName}"] [data-field="spending-percentage"]`);
  }

  getCardTransactionCount(cardName) {
    return this.page.locator(`[data-card="${cardName}"] [data-field="transaction-count"]`);
  }

  async getTotalCardPercentage() {
    const items = await this.cardItems.all();
    let total = 0;
    
    for (const item of items) {
      const percentText = await item.locator('[data-field="spending-percentage"]').textContent();
      const percent = parseFloat(percentText.replace('%', ''));
      if (!isNaN(percent)) {
        total += percent;
      }
    }
    
    return total;
  }

  async getUsageDistributionMetrics() {
    const items = await this.cardItems.all();
    const metrics = [];
    
    for (const item of items) {
      const card = await item.getAttribute('data-card');
      const count = await item.locator('[data-field="transaction-count"]').textContent();
      const amount = await item.locator('[data-field="spending-amount"]').textContent();
      
      metrics.push({ card, transactionCount: parseInt(count), spendingAmount: amount });
    }
    
    return metrics;
  }

  async getDisplayedCards() {
    const items = await this.cardItems.all();
    const cards = [];
    
    for (const item of items) {
      const card = await item.getAttribute('data-card');
      cards.push(card);
    }
    
    return cards;
  }

  async getTotalSpending() {
    const totalElement = this.page.locator('[data-testid="total-spending"]');
    const text = await totalElement.textContent();
    return parseFloat(text.replace(/[₹,]/g, ''));
  }

  async getActiveCardsTotalSpending() {
    const items = await this.cardItems.all();
    let total = 0;
    
    for (const item of items) {
      const amountText = await item.locator('[data-field="spending-amount"]').textContent();
      const amount = parseFloat(amountText.replace(/[₹,]/g, ''));
      total += amount;
    }
    
    return total;
  }

  async getSpendingRanking() {
    const items = await this.cardItems.all();
    const ranking = [];
    
    for (const item of items) {
      const card = await item.getAttribute('data-card');
      const rank = await item.locator('[data-field="spending-rank"]').textContent();
      const amount = await item.locator('[data-field="spending-amount"]').textContent();
      
      ranking.push({ card, rank: parseInt(rank), amount });
    }
    
    return ranking.sort((a, b) => a.rank - b.rank);
  }

  async getFrequencyRanking() {
    const items = await this.cardItems.all();
    const ranking = [];
    
    for (const item of items) {
      const card = await item.getAttribute('data-card');
      const rank = await item.locator('[data-field="frequency-rank"]').textContent();
      const count = await item.locator('[data-field="transaction-count"]').textContent();
      
      ranking.push({ card, rank: parseInt(rank), count: parseInt(count) });
    }
    
    return ranking.sort((a, b) => a.rank - b.rank);
  }

  async getOptimizationInsights() {
    const insightsVisible = await this.optimizationInsights.isVisible().catch(() => false);
    if (!insightsVisible) return null;
    
    return await this.optimizationInsights.textContent();
  }
};