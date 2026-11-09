const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');
const config = require('../../data/config.json');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    this.baseURL = config.apiBaseURL;
    
    // API endpoints
    this.endpoints = {
      portfolioOverview: '/api/portfolio/overview'
    };
  }

  async navigate() {
    Logger.info('Navigating to portfolio page');
    await this.page.goto(`${this.baseURL}/portfolio`);
    await this.page.waitForLoadState('networkidle');
  }

  async getPortfolioOverview(userId) {
    Logger.info(`Fetching portfolio overview for user: ${userId}`);
    const response = await this.page.request.get(`${this.baseURL}${this.endpoints.portfolioOverview}`, {
      params: { userId: userId }
    });
    return response;
  }

  async waitForPortfolioLoad() {
    Logger.info('Waiting for portfolio page to load');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAPIResponse(response, expectedStatus) {
    Logger.info(`Verifying API response status: ${expectedStatus}`);
    await expect(response.status).toBe(expectedStatus);
  }
};
