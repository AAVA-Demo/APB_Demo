const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TrendsPage = class TrendsPage {
  constructor(page) {
    this.page = page;
    
    this.monthlyTrendsSection = page.locator('.chart-section:has-text("Monthly Spend Trends")');
    this.monthlyTrendChart = page.locator('trend-chart[chart-type="line"]');
    this.insufficientDataMessage = page.locator('text=Full 12-month trend analysis not available');
    
    this.cardWiseSection = page.locator('.chart-section:has-text("Card-wise Spending Breakdown")');
    this.cardWiseChart = page.locator('trend-chart[chart-type="bar"]');
    this.cardWiseTable = page.locator('.table-responsive table');
    this.cardWiseRows = page.locator('.table-responsive table tbody tr');
    
    this.filterSection = page.locator('.filter-section');
    this.startDateInput = page.locator('input[type="date"][ng-model="vm.startDate"]');
    this.endDateInput = page.locator('input[type="date"][ng-model="vm.endDate"]');
    this.cardFilterList = page.locator('.card-filter-list');
    this.cardCheckboxes = page.locator('.card-filter-list input[type="checkbox"]');
    
    this.emptyDataMessage = page.locator('text=No spending data available for selected date range');
    this.errorMessage = page.locator('.alert-danger');
  }

  async navigate() {
    logger.info('Navigating to trends page');
    await this.page.goto(process.env.BASE_URL + '/trends');
    await this.page.waitForLoadState('networkidle');
  }

  async setDateRange(startDate, endDate) {
    logger.info(`Setting date range: ${startDate} to ${endDate}`);
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
    await this.page.waitForTimeout(300);
  }

  async getMonthlyTrendDataPoints() {
    logger.info('Getting monthly trend data points');
    await this.page.waitForTimeout(500);
    
    const dataPoints = await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="TrendsController"]')).scope();
      return scope.vm.monthlyTrends || [];
    });
    
    return dataPoints;
  }

  async getChartLabels() {
    logger.info('Getting chart labels');
    const dataPoints = await this.getMonthlyTrendDataPoints();
    return dataPoints.map(point => point.month);
  }

  async getTrendIndicators() {
    logger.info('Getting trend indicators');
    const dataPoints = await this.getMonthlyTrendDataPoints();
    const indicators = [];
    
    for (let i = 1; i < dataPoints.length; i++) {
      const current = parseFloat(dataPoints[i].totalSpend);
      const previous = parseFloat(dataPoints[i - 1].totalSpend);
      
      if (current > previous) {
        indicators.push({ month: dataPoints[i].month, trend: 'increasing' });
      } else if (current < previous) {
        indicators.push({ month: dataPoints[i].month, trend: 'decreasing' });
      } else {
        indicators.push({ month: dataPoints[i].month, trend: 'stable' });
      }
    }
    
    return indicators;
  }

  async getSelectedCardCount() {
    logger.info('Getting selected card count');
    await this.page.waitForTimeout(500);
    
    const selectedCount = await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="TrendsController"]')).scope();
      return scope.vm.selectedCards ? scope.vm.selectedCards.length : 0;
    });
    
    return selectedCount;
  }

  async getCardWiseData() {
    logger.info('Getting card-wise spending data');
    await this.page.waitForTimeout(500);
    const count = await this.cardWiseRows.count();
    const cardData = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.cardWiseRows.nth(i);
      const cells = row.locator('td');
      
      const cardName = await cells.nth(0).textContent();
      const totalSpend = await cells.nth(1).textContent();
      const percentage = await cells.nth(2).textContent();
      
      cardData.push({
        cardName: cardName.trim(),
        totalSpend: totalSpend.trim(),
        percentage: percentage.trim().replace('%', '')
      });
    }
    
    return cardData;
  }

  async selectCard(cardId) {
    logger.info(`Selecting card: ${cardId}`);
    await this.page.evaluate((id) => {
      const scope = angular.element(document.querySelector('[ng-controller="TrendsController"]')).scope();
      scope.$apply(() => {
        scope.vm.toggleCardSelection(id);
      });
    }, cardId);
    await this.page.waitForTimeout(300);
  }
};
