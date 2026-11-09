const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');
const { WaitUtils } = require('../../utils/wait-utils');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Analytics Container Locators
    this.analyticsContainer = page.locator('[data-testid="analytics-container"], .analytics-page, #analytics');
    this.loadingIndicator = page.locator('[data-testid="loading-spinner"], .loading-indicator');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .no-data-message');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message');
    
    // Category Visualization Locators
    this.categoryChart = page.locator('[data-testid="category-chart"], .category-chart, canvas');
    this.categoryItems = page.locator('[data-testid="category-item"], .category-item, table tbody tr');
    this.categoryTooltip = page.locator('[data-testid="chart-tooltip"], .tooltip');
    this.drillDownPanel = page.locator('[data-testid="drill-down"], .drill-down-panel');
    this.drillDownTransactions = page.locator('[data-testid="drill-down-transactions"] tr');
    this.emptyCategoryMessage = page.locator('[data-testid="empty-category"], .no-transactions-message');
    
    // Trend Analysis Locators
    this.trendSection = page.locator('[data-testid="trend-section"], .trend-analysis');
    this.trendChart = page.locator('[data-testid="trend-chart"], .trend-chart canvas');
    this.monthlyDataPoints = page.locator('[data-testid="monthly-data"]');
    this.trendErrorMessage = page.locator('[data-testid="trend-error"], .trend-error-message');
    this.trendDateFromInput = page.locator('[data-testid="trend-date-from"], input[name="trendDateFrom"]');
    this.trendDateToInput = page.locator('[data-testid="trend-date-to"], input[name="trendDateTo"]');
    this.monthSelect = page.locator('[data-testid="month-select"], select[name="month"]');
    
    // Card-Wise Analysis Locators
    this.cardWiseSection = page.locator('[data-testid="card-wise-section"], .card-wise-analysis');
    this.cardWiseChart = page.locator('[data-testid="card-wise-chart"], .card-wise-chart canvas');
    this.cardWiseItems = page.locator('[data-testid="card-wise-item"], table tbody tr');
    this.singleCardMessage = page.locator('[data-testid="single-card-message"], .single-card-message');
    
    // Layout Locators
    this.layoutContainer = page.locator('[data-testid="layout-container"], .analytics-layout');
  }

  async navigate() {
    Logger.info('Navigating to Analytics page');
    await this.page.goto('/analytics');
    await WaitUtils.waitForPageLoad(this.page);
  }

  async waitForAnalyticsToLoad() {
    Logger.info('Waiting for analytics to load');
    await WaitUtils.waitForElementVisible(this.page, this.analyticsContainer);
    await WaitUtils.waitForElementHidden(this.page, this.loadingIndicator);
    await this.page.waitForTimeout(1000);
  }

  async getDisplayedCategories() {
    await WaitUtils.waitForElementVisible(this.page, this.categoryItems.first());
    const count = await this.categoryItems.count();
    const categories = [];
    
    for (let i = 0; i < count; i++) {
      const item = this.categoryItems.nth(i);
      const cells = item.locator('td');
      
      const category = {
        name: await cells.nth(0).textContent(),
        amount: await cells.nth(1).textContent(),
        transactionCount: await cells.nth(2).textContent(),
        percentage: await cells.nth(3).textContent()
      };
      
      categories.push(category);
    }
    
    Logger.info(`Retrieved ${categories.length} categories`);
    return categories;
  }

  async getEmptyStateMessage() {
    await WaitUtils.waitForElementVisible(this.page, this.emptyStateMessage);
    const message = await this.emptyStateMessage.textContent();
    Logger.info(`Empty state message: ${message}`);
    return message;
  }

  async clickCategory(categoryName) {
    Logger.info(`Clicking on category: ${categoryName}`);
    const categoryRow = this.page.locator(`tr:has-text("${categoryName}")`);
    await categoryRow.click();
    await this.page.waitForTimeout(500);
  }

  async isDrillDownVisible() {
    const visible = await this.drillDownPanel.isVisible();
    Logger.info(`Drill-down panel visible: ${visible}`);
    return visible;
  }

  async getDrillDownTransactions() {
    await WaitUtils.waitForElementVisible(this.page, this.drillDownTransactions.first());
    const count = await this.drillDownTransactions.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.drillDownTransactions.nth(i);
      const cells = row.locator('td');
      
      const transaction = {
        merchant: await cells.nth(0).textContent(),
        date: await cells.nth(1).textContent(),
        amount: await cells.nth(2).textContent()
      };
      
      transactions.push(transaction);
    }
    
    Logger.info(`Retrieved ${transactions.length} drill-down transactions`);
    return transactions;
  }

  async hoverOverCategory(categoryName) {
    Logger.info(`Hovering over category: ${categoryName}`);
    const categoryElement = this.page.locator(`[data-category="${categoryName}"], .category-segment:has-text("${categoryName}")`);
    await categoryElement.hover();
    await this.page.waitForTimeout(300);
  }

  async getTooltipContent() {
    await WaitUtils.waitForElementVisible(this.page, this.categoryTooltip);
    
    const tooltip = {
      categoryName: await this.categoryTooltip.locator('.tooltip-category').textContent(),
      amount: await this.categoryTooltip.locator('.tooltip-amount').textContent(),
      percentage: await this.categoryTooltip.locator('.tooltip-percentage').textContent()
    };
    
    Logger.info('Retrieved tooltip content');
    return tooltip;
  }

  async getEmptyCategoryMessage() {
    await WaitUtils.waitForElementVisible(this.page, this.emptyCategoryMessage);
    const message = await this.emptyCategoryMessage.textContent();
    Logger.info(`Empty category message: ${message}`);
    return message;
  }

  async isChartVisible() {
    const visible = await this.categoryChart.isVisible();
    Logger.info(`Chart visible: ${visible}`);
    return visible;
  }

  async navigateToTrendSection() {
    Logger.info('Navigating to trend section');
    const trendLink = this.page.locator('a:has-text("Monthly Trends"), [data-testid="trend-link"]');
    await trendLink.click();
    await this.page.waitForTimeout(500);
  }

  async getMonthlyTrendData() {
    await WaitUtils.waitForElementVisible(this.page, this.trendSection);
    
    const dataPoints = await this.page.evaluate(() => {
      const chartData = window.chartInstance?.data;
      if (!chartData) return [];
      
      const labels = chartData.labels || [];
      const data = chartData.datasets?.[0]?.data || [];
      
      return labels.map((month, index) => ({
        month: month,
        amount: data[index]
      }));
    });
    
    Logger.info(`Retrieved ${dataPoints.length} monthly data points`);
    return dataPoints;
  }

  async setTrendDateRange(fromDate, toDate) {
    Logger.info(`Setting trend date range: ${fromDate} to ${toDate}`);
    await this.trendDateFromInput.fill(fromDate);
    await this.trendDateToInput.fill(toDate);
    await this.page.waitForTimeout(500);
    await this.waitForAnalyticsToLoad();
  }

  async getTrendErrorMessage() {
    await WaitUtils.waitForElementVisible(this.page, this.trendErrorMessage);
    const message = await this.trendErrorMessage.textContent();
    Logger.info(`Trend error message: ${message}`);
    return message;
  }

  async selectMonth(monthName) {
    Logger.info(`Selecting month: ${monthName}`);
    await this.monthSelect.selectOption({ label: monthName });
    await this.page.waitForTimeout(500);
  }

  async navigateToCardWiseSection() {
    Logger.info('Navigating to card-wise section');
    const cardWiseLink = this.page.locator('a:has-text("Card-Wise"), [data-testid="card-wise-link"]');
    await cardWiseLink.click();
    await this.page.waitForTimeout(500);
  }

  async getCardWiseSpendData() {
    await WaitUtils.waitForElementVisible(this.page, this.cardWiseSection);
    const count = await this.cardWiseItems.count();
    const cardData = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.cardWiseItems.nth(i);
      const cells = row.locator('td');
      
      const card = {
        cardName: await cells.nth(0).textContent(),
        amount: await cells.nth(1).textContent()
      };
      
      cardData.push(card);
    }
    
    Logger.info(`Retrieved ${cardData.length} card-wise spend data`);
    return cardData;
  }

  async hasCardWiseChart() {
    const visible = await this.cardWiseChart.isVisible();
    Logger.info(`Card-wise chart visible: ${visible}`);
    return visible;
  }

  async getSingleCardMessage() {
    await WaitUtils.waitForElementVisible(this.page, this.singleCardMessage);
    const message = await this.singleCardMessage.textContent();
    Logger.info(`Single card message: ${message}`);
    return message;
  }

  async getLayoutType() {
    const containerClass = await this.layoutContainer.getAttribute('class');
    
    if (containerClass.includes('single-column')) {
      return 'single-column';
    } else if (containerClass.includes('two-column')) {
      return 'two-column';
    } else if (containerClass.includes('multi-column')) {
      return 'multi-column';
    }
    
    const width = await this.page.viewportSize().width;
    
    if (width < 768) {
      return 'single-column';
    } else if (width < 1024) {
      return 'two-column';
    } else {
      return 'multi-column';
    }
  }

  async hasHorizontalScrollbar() {
    const hasScroll = await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    return hasScroll;
  }

  async hasVisibleLayout() {
    const visible = await this.analyticsContainer.isVisible();
    Logger.info(`Analytics layout visible: ${visible}`);
    return visible;
  }

  async hasOverlappingElements() {
    const hasOverlap = await this.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.kpi-card, .chart-container, .category-item'));
      
      for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
          const rect1 = elements[i].getBoundingClientRect();
          const rect2 = elements[j].getBoundingClientRect();
          
          const overlap = !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
          );
          
          if (overlap) return true;
        }
      }
      
      return false;
    });
    
    Logger.info(`Has overlapping elements: ${hasOverlap}`);
    return hasOverlap;
  }
};