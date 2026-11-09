const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.analyticsMenu = page.locator('[data-testid="nav-analytics"]');
    
    // Category Chart
    this.categoryChartSection = page.locator('[data-testid="category-chart-section"]');
    this.categoryPieChart = page.locator('[data-testid="category-pie-chart"]');
    this.chartLegend = page.locator('[data-testid="chart-legend"]');
    this.categorySlice = page.locator('[data-testid="category-slice"]');
    
    // Monthly Trend
    this.monthlyTrendSection = page.locator('[data-testid="monthly-trend-section"]');
    this.monthlyLineChart = page.locator('[data-testid="monthly-line-chart"]');
    this.monthDataPoint = page.locator('[data-testid="month-data-point"]');
    
    // Drill-down
    this.drillDownPanel = page.locator('[data-testid="drill-down-panel"]');
    this.drillDownTransactions = page.locator('[data-testid="drill-down-transaction"]');
    this.backButton = page.locator('[data-testid="back-button"]');
    
    // Messages
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }
  
  async navigate() {
    await this.page.goto('https://creditcard.example.com');
  }
  
  async clickAnalyticsMenu() {
    await this.analyticsMenu.click();
  }
  
  async waitForCategoryChartToLoad() {
    await this.categoryPieChart.waitFor({ state: 'visible', timeout: 5000 });
  }
  
  async waitForMonthlyTrendToLoad() {
    await this.monthlyLineChart.waitFor({ state: 'visible', timeout: 5000 });
  }
  
  async getCategoryChartData() {
    const slices = await this.categorySlice.all();
    const data = [];
    
    for (const slice of slices) {
      const name = await slice.getAttribute('data-category');
      const percentage = parseFloat(await slice.getAttribute('data-percentage'));
      const amount = await slice.getAttribute('data-amount');
      
      data.push({ name, percentage, amount });
    }
    
    return data;
  }
  
  async getLegendItems() {
    return await this.chartLegend.locator('[data-testid="legend-item"]').all();
  }
  
  async clickCategorySlice(categoryName) {
    const slice = this.page.locator(`[data-testid="category-slice"][data-category="${categoryName}"]`);
    await slice.click();
  }
  
  async getDrillDownTransactions() {
    const rows = await this.drillDownTransactions.all();
    const transactions = [];
    
    for (const row of rows) {
      transactions.push({
        date: await row.locator('[data-testid="txn-date"]').textContent(),
        merchant: await row.locator('[data-testid="txn-merchant"]').textContent(),
        category: await row.locator('[data-testid="txn-category"]').textContent(),
        amount: await row.locator('[data-testid="txn-amount"]').textContent()
      });
    }
    
    return transactions;
  }
  
  async getCategoryTotal(categoryName) {
    const slice = this.page.locator(`[data-testid="category-slice"][data-category="${categoryName}"]`);
    const amount = await slice.getAttribute('data-amount');
    return parseFloat(amount.replace(/[$,]/g, ''));
  }
  
  async getMonthlyTrendMonths() {
    const points = await this.monthDataPoint.all();
    const months = [];
    
    for (const point of points) {
      const month = await point.getAttribute('data-month');
      months.push(month);
    }
    
    return months;
  }
  
  async getMonthlyTrendData() {
    const points = await this.monthDataPoint.all();
    const data = [];
    
    for (const point of points) {
      const month = await point.getAttribute('data-month');
      const amount = parseFloat(await point.getAttribute('data-amount'));
      
      data.push({ month, amount });
    }
    
    return data;
  }
  
  async clickMonthDataPoint(monthName) {
    const point = this.page.locator(`[data-testid="month-data-point"][data-month="${monthName}"]`);
    await point.click();
  }
  
  async clickBackButton() {
    await this.backButton.click();
  }
};
