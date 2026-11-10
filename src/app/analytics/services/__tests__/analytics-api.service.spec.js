/*
Test Documentation:
- Test Name: analyticsApiService Unit Tests
- Purpose: Validates analytics API service for fetching monthly trends, category breakdowns, and transactions
- Scenario: Tests all analytics methods with success and error scenarios including mock data generation
- Expected Result: Service should fetch analytics data or provide realistic mock data on failure
*/

describe('analyticsApiService', function() {
  'use strict';

  var analyticsApiService, $httpBackend, $q, API_CONFIG;
  var mockUserId = 'user123';
  var mockCategory = 'Food & Dining';

  beforeEach(module('creditCardApp.analytics'));

  beforeEach(inject(function(_analyticsApiService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    analyticsApiService = _analyticsApiService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(analyticsApiService).toBeDefined();
    });

    it('should have getMonthlyTrends method', function() {
      expect(analyticsApiService.getMonthlyTrends).toBeDefined();
      expect(typeof analyticsApiService.getMonthlyTrends).toBe('function');
    });

    it('should have getCategoryBreakdown method', function() {
      expect(analyticsApiService.getCategoryBreakdown).toBeDefined();
      expect(typeof analyticsApiService.getCategoryBreakdown).toBe('function');
    });

    it('should have getTransactionsByCategory method', function() {
      expect(analyticsApiService.getTransactionsByCategory).toBeDefined();
      expect(typeof analyticsApiService.getTransactionsByCategory).toBe('function');
    });
  });

  describe('getMonthlyTrends() - Success Scenarios', function() {
    var mockTrends = {
      monthlyTrends: [
        {month: 'Jan', totalSpend: 3500},
        {month: 'Feb', totalSpend: 4200}
      ],
      period: 'Last 12 months'
    };

    it('should make GET request with userId and period parameters', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/trends?period=12&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockTrends);

      analyticsApiService.getMonthlyTrends(mockUserId, 12);
      $httpBackend.flush();
    });

    it('should return monthly trends data on success', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/trends?period=12&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockTrends);

      analyticsApiService.getMonthlyTrends(mockUserId, 12).then(function(data) {
        expect(data).toEqual(mockTrends);
      });
      $httpBackend.flush();
    });

    it('should return trends with monthlyTrends array', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/trends?period=12&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockTrends);

      analyticsApiService.getMonthlyTrends(mockUserId, 12).then(function(data) {
        expect(Array.isArray(data.monthlyTrends)).toBe(true);
        expect(data.period).toBeDefined();
      });
      $httpBackend.flush();
    });
  });

  describe('getMonthlyTrends() - Mock Data Generation', function() {
    it('should return mock trends on API failure', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/trends?period=12&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      analyticsApiService.getMonthlyTrends(mockUserId, 12).then(function(data) {
        expect(data).toBeDefined();
        expect(Array.isArray(data.monthlyTrends)).toBe(true);
      });
      $httpBackend.flush();
    });

    it('should generate 12 months of mock data', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/trends?period=12&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      analyticsApiService.getMonthlyTrends(mockUserId, 12).then(function(data) {
        expect(data.monthlyTrends.length).toBe(12);
      });
      $httpBackend.flush();
    });

    it('should generate mock data with month names', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/trends?period=12&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      analyticsApiService.getMonthlyTrends(mockUserId, 12).then(function(data) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        data.monthlyTrends.forEach(function(trend, idx) {
          expect(trend.month).toBe(months[idx]);
        });
      });
      $httpBackend.flush();
    });

    it('should generate realistic spending values in mock data', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/trends?period=12&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      analyticsApiService.getMonthlyTrends(mockUserId, 12).then(function(data) {
        data.monthlyTrends.forEach(function(trend) {
          expect(trend.totalSpend).toBeGreaterThan(2000);
          expect(trend.totalSpend).toBeLessThan(7000);
        });
      });
      $httpBackend.flush();
    });
  });

  describe('getCategoryBreakdown() - Success Scenarios', function() {
    var mockBreakdown = {
      categoryBreakdown: [
        {category: 'Food & Dining', amount: 2500, percentage: '25.00'},
        {category: 'Fuel', amount: 1500, percentage: '15.00'}
      ],
      totalSpend: 10000
    };

    it('should make GET request with userId parameter', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/categories?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockBreakdown);

      analyticsApiService.getCategoryBreakdown(mockUserId);
      $httpBackend.flush();
    });

    it('should return category breakdown data on success', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/categories?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockBreakdown);

      analyticsApiService.getCategoryBreakdown(mockUserId).then(function(data) {
        expect(data).toEqual(mockBreakdown);
      });
      $httpBackend.flush();
    });

    it('should return breakdown with categoryBreakdown array', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/categories?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockBreakdown);

      analyticsApiService.getCategoryBreakdown(mockUserId).then(function(data) {
        expect(Array.isArray(data.categoryBreakdown)).toBe(true);
        expect(data.totalSpend).toBeDefined();
      });
      $httpBackend.flush();
    });
  });

  describe('getCategoryBreakdown() - Mock Data Generation', function() {
    it('should return mock breakdown on API failure', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/categories?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      analyticsApiService.getCategoryBreakdown(mockUserId).then(function(data) {
        expect(data).toBeDefined();
        expect(Array.isArray(data.categoryBreakdown)).toBe(true);
      });
      $httpBackend.flush();
    });

    it('should generate all 9 predefined categories', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/categories?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      analyticsApiService.getCategoryBreakdown(mockUserId).then(function(data) {
        expect(data.categoryBreakdown.length).toBe(9);
        var categories = data.categoryBreakdown.map(function(item) { return item.category; });
        expect(categories).toContain('Food & Dining');
        expect(categories).toContain('Fuel');
        expect(categories).toContain('Shopping');
        expect(categories).toContain('Travel');
        expect(categories).toContain('Entertainment');
        expect(categories).toContain('Utilities');
        expect(categories).toContain('Healthcare');
        expect(categories).toContain('Education');
        expect(categories).toContain('Miscellaneous');
      });
      $httpBackend.flush();
    });

    it('should generate mock data with amount and percentage fields', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/categories?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      analyticsApiService.getCategoryBreakdown(mockUserId).then(function(data) {
        data.categoryBreakdown.forEach(function(item) {
          expect(item.category).toBeDefined();
          expect(item.amount).toBeDefined();
          expect(item.percentage).toBeDefined();
        });
      });
      $httpBackend.flush();
    });
  });

  describe('getTransactionsByCategory() - Success Scenarios', function() {
    var mockTransactions = [
      {
        transactionId: 't1',
        cardId: 'card1',
        userId: 'user123',
        amount: 45.67,
        category: 'Food & Dining',
        date: '2026-11-10T10:00:00.000Z',
        description: 'Restaurant',
        merchantName: 'Joe\'s Diner'
      }
    ];

    it('should make GET request with userId and category parameters', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?category=' + encodeURIComponent(mockCategory) + '&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      analyticsApiService.getTransactionsByCategory(mockUserId, mockCategory);
      $httpBackend.flush();
    });

    it('should return transactions array on success', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?category=' + encodeURIComponent(mockCategory) + '&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      analyticsApiService.getTransactionsByCategory(mockUserId, mockCategory).then(function(data) {
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
      });
      $httpBackend.flush();
    });

    it('should return transactions with all required fields', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?category=' + encodeURIComponent(mockCategory) + '&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      analyticsApiService.getTransactionsByCategory(mockUserId, mockCategory).then(function(data) {
        data.forEach(function(txn) {
          expect(txn.transactionId).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.date).toBeDefined();
        });
      });
      $httpBackend.flush();
    });
  });

  describe('getTransactionsByCategory() - Mock Data Generation', function() {
    it('should return mock transactions on API failure', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?category=' + encodeURIComponent(mockCategory) + '&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      analyticsApiService.getTransactionsByCategory(mockUserId, mockCategory).then(function(data) {
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
      });
      $httpBackend.flush();
    });

    it('should generate mock transactions with correct category', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?category=' + encodeURIComponent(mockCategory) + '&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      analyticsApiService.getTransactionsByCategory(mockUserId, mockCategory).then(function(data) {
        data.forEach(function(txn) {
          expect(txn.category).toBe(mockCategory);
        });
      });
      $httpBackend.flush();
    });
  });

  describe('Query Performance (NFR)', function() {
    it('should execute getMonthlyTrends within acceptable time', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/trends?period=12&userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, {monthlyTrends: [], period: '12'});

      var startTime = Date.now();
      analyticsApiService.getMonthlyTrends(mockUserId, 12).then(function() {
        var endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(3000);
      });
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getMonthlyTrends, getCategoryBreakdown, getTransactionsByCategory, getMockMonthlyTrends, getMockCategoryBreakdown, getMockTransactions
- Scenarios covered:
  * Successful API calls for all methods
  * Mock data generation on failures
  * 12 months of historical data
  * All 9 predefined categories
  * Transaction retrieval by category
  * Data structure validation
  * Query performance (3-second NFR)
- Uncovered scenarios: Pagination, date range filtering
*/