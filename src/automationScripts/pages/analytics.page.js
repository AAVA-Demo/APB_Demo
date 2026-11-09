const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');
const config = require('../../data/config.json');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.baseURL = config.apiBaseURL;
    
    // API endpoints
    this.endpoints = {
      monthlyTrends: '/api/analytics/trends',
      categorySpending: '/api/analytics/spending/category'
    };
  }

  async navigate() {
    Logger.info('Navigating to analytics page');
    await this.page.goto(`${this.baseURL}/analytics`);
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlyTrends(userId, period) {
    Logger.info(`Fetching monthly trends for user: ${userId}, period: ${period}`);
    const response = await this.page.request.get(`${this.baseURL}${this.endpoints.monthlyTrends}`, {
      params: {
        userId: userId,
        period: period
      }
    });
    return response;
  }

  async getMonthlyTrendsWithPercentage(userId) {
    Logger.info(`Fetching monthly trends with percentage changes for user: ${userId}`);
    const response = await this.page.request.get(`${this.baseURL}${this.endpoints.monthlyTrends}`, {
      params: {
        userId: userId,
        includePercentageChange: true
      }
    });
    return response;
  }

  async getMonthlyTrendsWithDateRange(userId, startDate, endDate) {
    Logger.info(`Fetching monthly trends for user: ${userId}, date range: ${startDate} to ${endDate}`);
    const response = await this.page.request.get(`${this.baseURL}${this.endpoints.monthlyTrends}`, {
      params: {
        userId: userId,
        startDate: startDate,
        endDate: endDate
      }
    });
    return response;
  }

  async getCategorySpending(userId) {
    Logger.info(`Fetching category-wise spending for user: ${userId}`);
    const response = await this.page.request.get(`${this.baseURL}${this.endpoints.categorySpending}`, {
      params: { userId: userId }
    });
    return response;
  }

  async waitForAnalyticsLoad() {
    Logger.info('Waiting for analytics page to load');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAPIResponse(response, expectedStatus) {
    Logger.info(`Verifying API response status: ${expectedStatus}`);
    await expect(response.status).toBe(expectedStatus);
  }
};
