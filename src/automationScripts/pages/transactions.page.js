const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    this.transactionTable = page.locator('.transaction-table');
    this.transactionRows = page.locator('.transaction-table tbody tr');
    this.paginationControls = page.locator('.pagination-controls');
    this.nextButton = page.locator('.pagination-controls button:has-text("Next")');
    this.previousButton = page.locator('.pagination-controls button:has-text("Previous")');
    this.pageInfo = page.locator('.page-info');
    
    this.analyticsSection = page.locator('.analytics-section');
    this.categoryChart = page.locator('category-chart');
    this.categoryList = page.locator('.category-list');
    this.categoryItems = page.locator('.category-item');
    this.emptyChartMessage = page.locator('text=No spending data available');
    
    this.filterSection = page.locator('.filter-section');
    this.categoryDropdown = page.locator('select[ng-model="vm.selectedCategory"]');
    this.startDateInput = page.locator('input[type="date"][name="startDate"]');
    this.endDateInput = page.locator('input[type="date"][name="endDate"]');
    
    this.errorMessage = page.locator('.alert-danger');
  }

  async navigate() {
    logger.info('Navigating to transactions page');
    await this.page.goto(process.env.BASE_URL + '/transactions');
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionCount() {
    logger.info('Getting transaction count');
    await this.page.waitForTimeout(500);
    return await this.transactionRows.count();
  }

  async getTransactionDetails(index) {
    logger.info(`Getting transaction details for row at index: ${index}`);
    const row = this.transactionRows.nth(index);
    await expect(row).toBeVisible();
    
    const cells = row.locator('td');
    const date = await cells.nth(0).textContent();
    const merchant = await cells.nth(1).textContent();
    const category = await cells.nth(2).textContent();
    const amount = await cells.nth(3).textContent();
    const description = await cells.nth(4).textContent();
    
    return {
      date: date.trim(),
      merchant: merchant.trim(),
      category: category.trim(),
      amount: amount.trim(),
      description: description.trim()
    };
  }

  async getPageInfo() {
    logger.info('Getting pagination info');
    await expect(this.pageInfo).toBeVisible();
    return await this.pageInfo.textContent();
  }

  async setDateRange(startDate, endDate) {
    logger.info(`Setting date range: ${startDate} to ${endDate}`);
    
    if (this.startDateInput && this.endDateInput) {
      await this.startDateInput.fill(startDate);
      await this.endDateInput.fill(endDate);
      await this.page.waitForTimeout(300);
    } else {
      await this.page.evaluate(({ start, end }) => {
        const scope = angular.element(document.querySelector('[ng-controller]')).scope();
        scope.$apply(() => {
          scope.vm.startDate = start;
          scope.vm.endDate = end;
          scope.vm.onDateChange();
        });
      }, { start: startDate, end: endDate });
    }
  }

  async getCategoryList() {
    logger.info('Getting category list');
    await this.page.waitForTimeout(500);
    const count = await this.categoryItems.count();
    const categories = [];
    
    for (let i = 0; i < count; i++) {
      const item = this.categoryItems.nth(i);
      const name = await item.locator('.category-name').textContent();
      const totalSpend = await item.locator('.category-amount').textContent();
      const percentage = await item.locator('.category-percentage').textContent();
      
      categories.push({
        name: name.trim(),
        totalSpend: totalSpend.trim(),
        percentage: percentage.trim().replace('%', '')
      });
    }
    
    return categories;
  }

  async clickCategoryInChart(categoryName) {
    logger.info(`Clicking category in chart: ${categoryName}`);
    await this.page.evaluate((category) => {
      const scope = angular.element(document.querySelector('[ng-controller]')).scope();
      scope.$apply(() => {
        scope.vm.filterByCategory(category);
      });
    }, categoryName);
    await this.page.waitForTimeout(500);
  }

  async selectCategory(categoryName) {
    logger.info(`Selecting category: ${categoryName}`);
    await this.categoryDropdown.selectOption(categoryName);
    await this.page.waitForTimeout(300);
  }
};
