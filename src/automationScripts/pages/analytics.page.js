const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsContainer = page.locator('.container-fluid, [data-testid="analytics"]');
    this.lineChart = page.locator('line-chart, canvas#lineChart');
    this.pieChart = page.locator('pie-chart, canvas#pieChart');
    this.chartTooltip = page.locator('.chartjs-tooltip, [role="tooltip"]');
    this.startDateInput = page.locator('input[type="date"]:first-of-type, input[ng-model*="startDate"]');
    this.endDateInput = page.locator('input[type="date"]:last-of-type, input[ng-model*="endDate"]');
    this.applyFilterButton = page.locator('button:has-text("Apply Filter"), button[ng-click*="applyFilter"]');
    this.insufficientDataMessage = page.locator('p:has-text("Insufficient data"), .text-center:has-text("Insufficient data")');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
    this.drillDownView = page.locator('.drill-down, [data-testid="drill-down"]');
    this.transactionList = page.locator('table, .transaction-list');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await expect(this.analyticsContainer).toBeVisible();
  }

  async getLineChartDataPointCount() {
    await expect(this.lineChart).toBeVisible();
    // Using page.evaluate to access Chart.js instance
    const count = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas#lineChart');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels.length;
      }
      return 0;
    });
    return count;
  }

  async hoverOverDataPoint(index) {
    await expect(this.lineChart).toBeVisible();
    const canvas = this.lineChart;
    const box = await canvas.boundingBox();
    if (box) {
      const x = box.x + (box.width / 12) * index;
      const y = box.y + box.height / 2;
      await this.page.mouse.move(x, y);
      await this.page.waitForTimeout(500); // Wait for tooltip to appear
    }
  }

  async setDateRange(startDate, endDate) {
    await expect(this.startDateInput).toBeVisible();
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async applyFilter() {
    await expect(this.applyFilterButton).toBeVisible();
    await this.applyFilterButton.click();
  }

  async getPieChartCategoryCount() {
    await expect(this.pieChart).toBeVisible();
    const count = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas#pieChart');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels.length;
      }
      return 0;
    });
    return count;
  }

  async getCategoryLabels() {
    const categoryRows = this.page.locator('table tbody tr');
    const count = await categoryRows.count();
    const labels = [];
    
    for (let i = 0; i < count; i++) {
      const text = await categoryRows.nth(i).textContent();
      labels.push(text.trim());
    }
    
    return labels;
  }

  async clickCategorySegment(categoryName) {
    await expect(this.pieChart).toBeVisible();
    // Click on the pie chart canvas - in real implementation, this would need
    // specific coordinates based on the category segment
    const canvas = this.pieChart;
    const box = await canvas.boundingBox();
    if (box) {
      await canvas.click({ position: { x: box.width / 2, y: box.height / 2 } });
    }
  }

  async getTransactionDetails() {
    await expect(this.transactionList).toBeVisible();
    const rows = this.transactionList.locator('tbody tr');
    const count = await rows.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const date = await row.locator('td').nth(0).textContent();
      const merchant = await row.locator('td').nth(1).textContent();
      const amount = await row.locator('td').nth(3).textContent();
      
      transactions.push({
        date: date.trim(),
        merchant: merchant.trim(),
        amount: amount.trim()
      });
    }
    
    return transactions;
  }
};
