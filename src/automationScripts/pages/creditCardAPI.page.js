const { expect } = require('@playwright/test');

/**
 * Page Object Model for Credit Card Analysis Dashboard API
 * Handles all API interactions for portfolio, transactions, and analytics endpoints
 * 
 * Framework Compliance:
 * - All API endpoint URLs centralized in this Page Object
 * - No business logic in test files
 * - Reusable methods across multiple test cases
 * - Proper error handling and logging
 */
exports.CreditCardAPIPage = class CreditCardAPIPage {
  /**
   * Constructor
   * @param {APIRequestContext} request - Playwright API request context
   */
  constructor(request) {
    this.request = request;
    this.baseURL = process.env.API_BASE_URL || 'http://localhost:3000';
    
    // API Endpoints
    this.endpoints = {
      portfolio: '/api/portfolio',
      transactions: '/api/transactions',
      analytics: '/api/analytics/spending'
    };
  }

  /**
   * Get Portfolio Data
   * Retrieves user's credit card portfolio including KPIs
   * @param {string} authToken - Authentication token
   * @returns {Promise<APIResponse>} API response
   */
  async getPortfolio(authToken) {
    console.log(`[API] GET ${this.endpoints.portfolio}`);
    
    try {
      const response = await this.request.get(`${this.baseURL}${this.endpoints.portfolio}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`[API] Response Status: ${response.status()}`);
      return response;
    } catch (error) {
      console.error(`[API] Error fetching portfolio: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get Transactions
   * Retrieves transaction history with optional filters
   * @param {string} authToken - Authentication token
   * @param {Object} params - Query parameters (page, pageSize, cardId, dateRange, searchTerm)
   * @returns {Promise<APIResponse>} API response
   */
  async getTransactions(authToken, params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.cardId) queryParams.append('cardId', params.cardId);
    if (params.dateRange) queryParams.append('dateRange', params.dateRange);
    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    
    const url = `${this.baseURL}${this.endpoints.transactions}?${queryParams.toString()}`;
    console.log(`[API] GET ${url}`);
    
    try {
      const response = await this.request.get(url, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`[API] Response Status: ${response.status()}`);
      return response;
    } catch (error) {
      console.error(`[API] Error fetching transactions: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get Transactions Without Authentication
   * Used for testing unauthorized access scenarios
   * @param {Object} params - Query parameters
   * @returns {Promise<APIResponse>} API response
   */
  async getTransactionsWithoutAuth(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    
    const url = `${this.baseURL}${this.endpoints.transactions}?${queryParams.toString()}`;
    console.log(`[API] GET ${url} (No Auth)`);
    
    try {
      const response = await this.request.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`[API] Response Status: ${response.status()}`);
      return response;
    } catch (error) {
      console.error(`[API] Error fetching transactions without auth: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get Spending Analytics
   * Retrieves category-wise spending and monthly trends
   * @param {string} authToken - Authentication token
   * @param {Object} params - Query parameters (dateRange, startDate, endDate, cardIds, categories)
   * @returns {Promise<APIResponse>} API response
   */
  async getSpendingAnalytics(authToken, params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.dateRange) queryParams.append('dateRange', params.dateRange);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.cardIds) queryParams.append('cardIds', params.cardIds);
    if (params.categories) queryParams.append('categories', params.categories);
    
    const url = `${this.baseURL}${this.endpoints.analytics}?${queryParams.toString()}`;
    console.log(`[API] GET ${url}`);
    
    try {
      const response = await this.request.get(url, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`[API] Response Status: ${response.status()}`);
      return response;
    } catch (error) {
      console.error(`[API] Error fetching analytics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate Portfolio Response Structure
   * Helper method to validate portfolio API response
   * @param {Object} portfolioData - Portfolio response data
   * @returns {boolean} True if valid
   */
  validatePortfolioStructure(portfolioData) {
    console.log('[Validation] Validating portfolio response structure');
    
    if (!portfolioData.cards || !Array.isArray(portfolioData.cards)) {
      console.error('[Validation] Missing or invalid cards array');
      return false;
    }
    
    for (const card of portfolioData.cards) {
      if (!card.cardId || !card.cardName) {
        console.error('[Validation] Card missing required fields');
        return false;
      }
    }
    
    console.log('[Validation] Portfolio structure valid');
    return true;
  }

  /**
   * Validate Transaction Response Structure
   * Helper method to validate transaction API response
   * @param {Object} transactionData - Transaction response data
   * @returns {boolean} True if valid
   */
  validateTransactionStructure(transactionData) {
    console.log('[Validation] Validating transaction response structure');
    
    if (!transactionData.transactions || !Array.isArray(transactionData.transactions)) {
      console.error('[Validation] Missing or invalid transactions array');
      return false;
    }
    
    if (typeof transactionData.totalCount !== 'number') {
      console.error('[Validation] Missing or invalid totalCount');
      return false;
    }
    
    if (typeof transactionData.page !== 'number' || typeof transactionData.pageSize !== 'number') {
      console.error('[Validation] Missing or invalid pagination fields');
      return false;
    }
    
    console.log('[Validation] Transaction structure valid');
    return true;
  }

  /**
   * Validate Analytics Response Structure
   * Helper method to validate analytics API response
   * @param {Object} analyticsData - Analytics response data
   * @returns {boolean} True if valid
   */
  validateAnalyticsStructure(analyticsData) {
    console.log('[Validation] Validating analytics response structure');
    
    if (analyticsData.categoryBreakdown && !Array.isArray(analyticsData.categoryBreakdown)) {
      console.error('[Validation] Invalid categoryBreakdown array');
      return false;
    }
    
    if (analyticsData.monthlyTrends && !Array.isArray(analyticsData.monthlyTrends)) {
      console.error('[Validation] Invalid monthlyTrends array');
      return false;
    }
    
    console.log('[Validation] Analytics structure valid');
    return true;
  }

  /**
   * Calculate Expected KPIs
   * Helper method to calculate expected KPI values from card data
   * @param {Array} cards - Array of credit card objects
   * @returns {Object} Calculated KPIs
   */
  calculateExpectedKPIs(cards) {
    console.log('[Calculation] Calculating expected KPIs');
    
    if (!cards || cards.length === 0) {
      return {
        monthlySpend: 0,
        totalCreditLimit: 0,
        totalAvailableCredit: 0,
        totalOutstanding: 0
      };
    }
    
    const kpis = {
      monthlySpend: 0,
      totalCreditLimit: 0,
      totalAvailableCredit: 0,
      totalOutstanding: 0
    };
    
    cards.forEach(card => {
      kpis.totalCreditLimit += card.creditLimit || 0;
      kpis.totalAvailableCredit += card.availableCredit || 0;
      kpis.totalOutstanding += card.outstandingAmount || 0;
    });
    
    kpis.monthlySpend = kpis.totalOutstanding;
    
    console.log(`[Calculation] KPIs calculated: ${JSON.stringify(kpis)}`);
    return kpis;
  }

  /**
   * Validate Category List
   * Helper method to validate all 9 spending categories are present
   * @param {Array} categoryBreakdown - Category breakdown array
   * @returns {boolean} True if all categories present
   */
  validateAllCategories(categoryBreakdown) {
    console.log('[Validation] Validating all 9 categories present');
    
    const expectedCategories = [
      'Food & Dining',
      'Fuel',
      'Shopping',
      'Travel',
      'Entertainment',
      'Utilities',
      'Healthcare',
      'Education',
      'Miscellaneous'
    ];
    
    const actualCategories = categoryBreakdown.map(item => item.category);
    
    for (const expected of expectedCategories) {
      if (!actualCategories.includes(expected)) {
        console.error(`[Validation] Missing category: ${expected}`);
        return false;
      }
    }
    
    console.log('[Validation] All categories present');
    return true;
  }

  /**
   * Wait for API Response
   * Helper method to implement custom wait logic if needed
   * @param {Function} apiCall - API call function
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<APIResponse>} API response
   */
  async waitForResponse(apiCall, timeout = 5000) {
    console.log(`[Wait] Waiting for API response (timeout: ${timeout}ms)`);
    
    const startTime = Date.now();
    
    try {
      const response = await Promise.race([
        apiCall(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API timeout')), timeout)
        )
      ]);
      
      const elapsed = Date.now() - startTime;
      console.log(`[Wait] Response received in ${elapsed}ms`);
      
      return response;
    } catch (error) {
      console.error(`[Wait] Error: ${error.message}`);
      throw error;
    }
  }
};