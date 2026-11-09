const { expect } = require('@playwright/test');

/**
 * API Helper: Centralized API request methods
 * Provides reusable API interaction methods for all test suites
 */
exports.ApiHelper = class ApiHelper {
  constructor(page) {
    this.page = page;
    this.baseUrl = process.env.API_BASE_URL || '/api';
  }

  // Dashboard KPIs API Methods
  async getDashboardKPIs(userId) {
    return await this.page.request.get(`${this.baseUrl}/dashboard/kpis`, {
      params: { userId }
    });
  }

  async mockDashboardKPIs(data) {
    await this.page.route('**/api/dashboard/kpis**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          totalCreditLimit: data.creditLimit,
          totalOutstanding: data.outstanding,
          totalAvailableCredit: data.creditLimit - data.outstanding,
          creditUtilizationPercent: data.utilization
        })
      });
    });
  }

  // Credit Cards API Methods
  async getCreditCards(userId) {
    return await this.page.request.get(`${this.baseUrl}/creditcards`, {
      params: { userId }
    });
  }

  async getCreditCardsOverview(userId) {
    return await this.page.request.get(`${this.baseUrl}/creditcards/overview`, {
      params: { userId }
    });
  }

  // Transactions API Methods
  async getTransactions(userId, page = 1, size = 50) {
    return await this.page.request.get(`${this.baseUrl}/transactions`, {
      params: { userId, page, size }
    });
  }

  async getTransactionsWithDateFilter(userId, startDate, endDate) {
    return await this.page.request.get(`${this.baseUrl}/transactions`, {
      params: { userId, startDate, endDate }
    });
  }

  async getTransactionsByCardId(userId, cardId) {
    return await this.page.request.get(`${this.baseUrl}/transactions`, {
      params: { userId, cardId }
    });
  }

  async getTransactionById(transactionId) {
    return await this.page.request.get(`${this.baseUrl}/transactions/${transactionId}`);
  }

  // Analytics API Methods
  async getMonthlyTrends(userId) {
    return await this.page.request.get(`${this.baseUrl}/analytics/monthly-trends`, {
      params: { userId }
    });
  }

  async getMonthlyTrendsWithDateRange(userId, startDate, endDate) {
    return await this.page.request.get(`${this.baseUrl}/analytics/monthly-trends`, {
      params: { userId, startDate, endDate }
    });
  }

  async getCategorySpending(userId) {
    return await this.page.request.get(`${this.baseUrl}/analytics/category-spending`, {
      params: { userId }
    });
  }

  async getTotalSpendingFromDB(userId) {
    // Mock method for database validation
    return await this.page.request.get(`${this.baseUrl}/analytics/total-spending`, {
      params: { userId }
    });
  }

  // Utility Methods
  async verifyResponseTime(requestPromise, maxTime) {
    const startTime = Date.now();
    const response = await requestPromise;
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(maxTime);
    return response;
  }
};