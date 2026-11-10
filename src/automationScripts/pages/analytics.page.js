const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    this.analyticsNavLink = page.locator('a[href*="analytics"], button:has-text("Analytics")');
    this.categoryWiseSpendingOption = page.locator('button:has-text("Category-Wise Spending"), a:has-text("Category")');
    this.monthlySpendTrendsOption = page.locator('button:has-text("Monthly Spend Trends"), a:has-text("Trends")');
    this.categoryBreakdownContainer = page.locator('.category-breakdown, [data-testid="category-breakdown"]');
    this.monthlyTrendsChart = page.locator('canvas, .chart-container, [data-testid="trends-chart"]');
    this.noDataMessage = page.locator('.no-data-message, [data-testid="no-data"]');
    this.noHistoricalDataMessage = page.locator('.no-historical-data, [data-testid="no-historical"]');
    this.emptyChart = page.locator('.empty-chart');
    this.brokenChart = page.locator('.chart-error');
    this.zeroValueWithoutContext = page.locator('.zero-value:not(:has(.context))');
    this.loadingSpinner = page.locator('.spinner, [data-testid="loading"]');
  }

  async navigateToAnalytics() {
    await this.analyticsNavLink.click();
  }

  async selectCategoryWiseSpending() {
    await this.categoryWiseSpendingOption.click();
  }

  async selectMonthlySpendTrends() {
    await this.monthlySpendTrendsOption.click();
  }

  async waitForCategoryViewLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async waitForTrendsViewLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async verifyCategoryDisplayed(categoryName) {
    const categoryElement = this.page.locator(`text="${categoryName}"`);
    await expect(categoryElement).toBeVisible();
  }

  async verifyCategoryAmount(categoryName, expectedAmount) {
    const categoryRow = this.page.locator(`.category-row:has-text("${categoryName}"), tr:has-text("${categoryName}")`);
    const amountText = await categoryRow.locator('.amount, td:nth-child(2)').textContent();
    const amount = parseFloat(amountText.replace(/[^0-9.]/g, ''));
    expect(amount).toBe(expectedAmount);
  }

  async verifyCategoryPercentage(categoryName, expectedPercentage) {
    const categoryRow = this.page.locator(`.category-row:has-text("${categoryName}"), tr:has-text("${categoryName}")`);
    const percentageText = await categoryRow.locator('.percentage, td:nth-child(3)').textContent();
    const percentage = parseFloat(percentageText.replace(/[^0-9.]/g, ''));
    expect(Math.round(percentage)).toBe(expectedPercentage);
  }

  async verifyTotalPercentageSum(expectedSum) {
    const percentageElements = await this.page.locator('.percentage, td:nth-child(3)').allTextContents();
    let sum = 0;
    for (const text of percentageElements) {
      const value = parseFloat(text.replace(/[^0-9.]/g, ''));
      if (!isNaN(value)) {
        sum += value;
      }
    }
    expect(Math.round(sum)).toBe(expectedSum);
  }

  async isCategoryZeroOrOmitted(categoryName) {
    const categoryElement = this.page.locator(`text="${categoryName}"`);
    const isVisible = await categoryElement.isVisible().catch(() => false);
    
    if (!isVisible) {
      return true;
    }
    
    const categoryRow = this.page.locator(`.category-row:has-text("${categoryName}"), tr:has-text("${categoryName}")`);
    const amountText = await categoryRow.locator('.amount, td:nth-child(2)').textContent();
    const amount = parseFloat(amountText.replace(/[^0-9.]/g, ''));
    
    return amount === 0;
  }

  async getChartDataPointCount() {
    await this.page.waitForTimeout(1000);
    const chartData = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels.length;
      }
      return 0;
    });
    return chartData;
  }

  async verifyChartHasProperLabels() {
    const hasLabels = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        const labels = canvas.chart.data.labels;
        return labels && labels.length > 0;
      }
      return false;
    });
    expect(hasLabels).toBe(true);
  }

  async verifyMonthlyTotal(month, expectedAmount) {
    const monthElement = this.page.locator(`text="${month}"`);
    const isVisible = await monthElement.isVisible().catch(() => false);
    
    if (isVisible) {
      const monthRow = this.page.locator(`.month-row:has-text("${month}"), tr:has-text("${month}")`);
      const amountText = await monthRow.locator('.amount, td:nth-child(2)').textContent();
      const amount = parseFloat(amountText.replace(/[^0-9.]/g, ''));
      expect(amount).toBe(expectedAmount);
    }
  }

  async isMonthZeroOrOmitted(month) {
    const monthElement = this.page.locator(`text="${month}"`);
    const isVisible = await monthElement.isVisible().catch(() => false);
    
    if (!isVisible) {
      return true;
    }
    
    const monthRow = this.page.locator(`.month-row:has-text("${month}"), tr:has-text("${month}")`);
    const amountText = await monthRow.locator('.amount, td:nth-child(2)').textContent();
    const amount = parseFloat(amountText.replace(/[^0-9.]/g, ''));
    
    return amount === 0;
  }

  async verifyChartInteractivity() {
    const isInteractive = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const hasClickHandler = canvas.onclick !== null;
        const hasHoverHandler = canvas.onmousemove !== null;
        return hasClickHandler || hasHoverHandler || canvas.style.cursor === 'pointer';
      }
      return false;
    });
    return isInteractive;
  }

  async verifyTrendVisualizationAccuracy() {
    const accuracy = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        const data = canvas.chart.data.datasets[0].data;
        const hasValidData = data.some(value => value > 0);
        const noNegativeValues = data.every(value => value >= 0);
        return hasValidData && noNegativeValues;
      }
      return false;
    });
    return accuracy;
  }
};
