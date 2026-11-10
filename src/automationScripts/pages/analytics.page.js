const { expect } = require('@playwright/test');
const { WaitUtils } = require('../utils/wait.utils');
const { Logger } = require('../utils/logger');
const config = require('../../data/config.json');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger();
    this.waitUtils = new WaitUtils(page);
    
    // Locators
    this.analyticsLink = page.locator('a[href="#/analytics"]');
    this.categoryVisualization = page.locator('category-spending-chart');
    this.zeroStateMessage = page.locator('.analytics-container .alert, .analytics-container .empty-state');
    this.categoryTable = page.locator('.analytics-container table');
    this.categoryRows = page.locator('.analytics-container table tbody tr');
    this.drillDownModal = page.locator('.drill-down-modal, .transaction-details-modal');
    this.transactionList = page.locator('.transaction-list, .drill-down-modal table tbody tr');
    this.closeModalButton = page.locator('.drill-down-modal .close, .modal .close');
    this.categoryFilterDropdown = page.locator('category-filter select');
  }

  async navigateToAnalytics() {
    await this.analyticsLink.click();
    await this.waitUtils.waitForPageLoad();
    await expect(this.page).toHaveURL(/.*analytics/);
    this.logger.info('Navigated to Analytics dashboard');
  }

  async getCategorySpendingData() {
    await this.waitUtils.waitForElement(this.categoryTable);
    
    const categoryData = await this.page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.analytics-container table tbody tr'));
      return rows.map(row => {
        const cells = row.querySelectorAll('td');
        return {
          category: cells[0]?.textContent.trim(),
          totalAmount: parseFloat(cells[1]?.textContent.replace(/[$,]/g, '')),
          transactionCount: parseInt(cells[2]?.textContent),
          percentage: parseFloat(cells[3]?.textContent.replace('%', ''))
        };
      });
    });
    
    this.logger.info(`Retrieved ${categoryData.length} category records`);
    return categoryData;
  }

  async getRenderedCategoryCount() {
    const count = await this.categoryRows.count();
    return count;
  }

  async isVisualizationEmpty() {
    const isEmpty = await this.page.evaluate(() => {
      const chartElement = document.querySelector('category-spending-chart canvas');
      if (!chartElement) return true;
      const ctx = chartElement.getContext('2d');
      const imageData = ctx.getImageData(0, 0, chartElement.width, chartElement.height);
      return imageData.data.every((val, idx) => idx % 4 === 3 ? val === 0 : val === 255);
    });
    return isEmpty;
  }

  async drillDownIntoCategory(categoryName) {
    const categoryRow = this.page.locator(`table tbody tr:has-text("${categoryName}")`);
    await categoryRow.click();
    await this.waitUtils.waitForElement(this.drillDownModal);
    await expect(this.drillDownModal).toBeVisible();
    this.logger.info(`Opened drill-down for category: ${categoryName}`);
  }

  async getCategoryTransactionDetails() {
    await this.waitUtils.waitForElement(this.transactionList);
    
    const transactions = await this.page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.transaction-list tr, .drill-down-modal table tbody tr'));
      return rows.map(row => {
        const cells = row.querySelectorAll('td');
        return {
          merchantName: cells[0]?.textContent.trim(),
          transactionDate: cells[1]?.textContent.trim(),
          amount: parseFloat(cells[2]?.textContent.replace(/[$,]/g, '')),
          category: cells[3]?.textContent.trim()
        };
      });
    });
    
    this.logger.info(`Retrieved ${transactions.length} transaction details`);
    return transactions;
  }

  async closeDrillDown() {
    await this.closeModalButton.click();
    await this.waitUtils.waitForElementHidden(this.drillDownModal);
    this.logger.info('Closed drill-down modal');
  }
};
