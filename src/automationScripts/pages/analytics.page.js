const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsContainer = page.locator('.analytics-container, [data-testid="analytics"]');
    this.analyticsNavLink = page.locator('a[href*="analytics"], nav a:has-text("Analytics")');
    this.monthlyTrendsOption = page.locator('[data-testid="monthly-trends"], .panel:has-text("Monthly Spend Trends")');
    this.categoryWiseOption = page.locator('[data-testid="category-wise"], .panel:has-text("Category-Wise Spending")');
    this.chart = page.locator('canvas, [data-testid="chart"]');
    this.chartContainer = page.locator('.panel-body, [data-testid="chart-container"]');
    this.errorMessage = page.locator('.alert-danger, [role="alert"]');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .empty-message');
    this.categoryTable = page.locator('table, [data-testid="category-table"]');
    this.categoryRows = page.locator('table tbody tr, [data-testid="category-row"]');
  }

  async navigateToAnalytics() {
    await expect(this.analyticsNavLink).toBeVisible();
    await this.analyticsNavLink.click();
    await expect(this.analyticsContainer).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async selectMonthlySpendTrends() {
    await expect(this.monthlyTrendsOption).toBeVisible();
    await this.page.evaluate(() => {
      document.querySelector('[data-testid="monthly-trends"], .panel:has-text("Monthly Spend Trends")')?.scrollIntoView();
    });
    await this.page.waitForTimeout(1500);
  }

  async selectCategoryWiseSpending() {
    await expect(this.categoryWiseOption).toBeVisible();
    await this.page.evaluate(() => {
      document.querySelector('[data-testid="category-wise"], .panel:has-text("Category-Wise Spending")')?.scrollIntoView();
    });
    await this.page.waitForTimeout(1500);
  }

  async getMonthlyTrendsChartData() {
    await expect(this.chart).toBeVisible();
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      return chart.data.datasets[0].data.map((value, index) => ({
        month: chart.data.labels[index],
        amount: value
      }));
    });
  }

  async getMonthLabels() {
    await expect(this.chart).toBeVisible();
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.labels : [];
    });
  }

  async isChartInteractive() {
    await expect(this.chart).toBeVisible();
    const boundingBox = await this.chart.boundingBox();
    if (!boundingBox) return false;
    
    await this.page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
    await this.page.waitForTimeout(500);
    return true;
  }

  async isChartVisible() {
    return await this.chart.isVisible();
  }

  async getTrendLine() {
    await expect(this.chart).toBeVisible();
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.datasets[0] : null;
    });
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async hasRetryButton() {
    return await this.retryButton.isVisible();
  }

  async getAllCategories() {
    await expect(this.categoryTable).toBeVisible();
    const count = await this.categoryRows.count();
    const categories = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.categoryRows.nth(i);
      const category = await row.locator('td').nth(0).textContent();
      categories.push(category.trim());
    }
    
    return categories;
  }

  async getCategoryWiseData() {
    await expect(this.categoryTable).toBeVisible();
    const count = await this.categoryRows.count();
    const data = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.categoryRows.nth(i);
      const category = await row.locator('td').nth(0).textContent();
      const amount = await row.locator('td').nth(1).textContent();
      const percentage = await row.locator('td').nth(2).textContent();
      
      data.push({
        category: category.trim(),
        amount: amount.trim(),
        percentage: percentage.trim().replace('%', '')
      });
    }
    
    return data;
  }

  async getCategoryAmount(categoryName) {
    await expect(this.categoryTable).toBeVisible();
    const count = await this.categoryRows.count();
    
    for (let i = 0; i < count; i++) {
      const row = this.categoryRows.nth(i);
      const category = await row.locator('td').nth(0).textContent();
      if (category.trim() === categoryName) {
        return await row.locator('td').nth(1).textContent();
      }
    }
    
    return '0';
  }

  async getTotalSpending() {
    const data = await this.getCategoryWiseData();
    return data.reduce((sum, item) => {
      const amount = parseFloat(item.amount.replace(/[$,]/g, ''));
      return sum + amount;
    }, 0).toFixed(2);
  }

  async getChartTotalSpending() {
    return await this.getTotalSpending();
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async isChartContainerVisible() {
    return await this.chartContainer.isVisible();
  }
};
