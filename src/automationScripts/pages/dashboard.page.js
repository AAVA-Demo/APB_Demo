const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');
const config = require('../../data/config.json');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.baseURL = config.apiBaseURL;
    
    // API endpoints
    this.endpoints = {
      cardComparison: '/api/portfolio/comparison',
      dashboardData: '/api/dashboard',
      kpiDashboard: '/api/dashboard/kpi'
    };
  }

  async navigate() {
    Logger.info('Navigating to dashboard page');
    await this.page.goto(`${this.baseURL}/dashboard`);
    await this.page.waitForLoadState('networkidle');
  }

  async getCardComparison(userId) {
    Logger.info(`Fetching card comparison for user: ${userId}`);
    const response = await this.page.request.get(`${this.baseURL}${this.endpoints.cardComparison}`, {
      params: { userId: userId }
    });
    return response;
  }

  async getDashboardData(userId, deviceType) {
    Logger.info(`Fetching dashboard data for user: ${userId}, device: ${deviceType}`);
    const response = await this.page.request.get(`${this.baseURL}${this.endpoints.dashboardData}`, {
      params: {
        userId: userId,
        device: deviceType
      }
    });
    return response;
  }

  async getKPIDashboard(userId) {
    Logger.info(`Fetching KPI dashboard for user: ${userId}`);
    const response = await this.page.request.get(`${this.baseURL}${this.endpoints.kpiDashboard}`, {
      params: { userId: userId }
    });
    return response;
  }

  async waitForDashboardLoad() {
    Logger.info('Waiting for dashboard to load');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAPIResponse(response, expectedStatus) {
    Logger.info(`Verifying API response status: ${expectedStatus}`);
    await expect(response.status).toBe(expectedStatus);
  }
};
