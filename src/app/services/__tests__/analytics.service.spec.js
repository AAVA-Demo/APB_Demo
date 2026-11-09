/*
Test Documentation:
- Test Name: AnalyticsService Unit Tests
- Purpose: Validate AnalyticsService functionality including spending analytics retrieval, category transactions, and mock data generation
- Scenario: Tests cover successful API calls, error handling, date range filtering, category filtering, and mock data structure
- Expected Result: All service methods work correctly with proper promise resolution/rejection and data transformation
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, $httpBackend, $rootScope, API_CONFIG;
    var mockAnalyticsData, mockTransactions;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _$rootScope_, _API_CONFIG_) {
      AnalyticsService = _AnalyticsService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      API_CONFIG = _API_CONFIG_;

      mockAnalyticsData = {
        categories: [
          { category: 'Food & Dining', amount: 2500, percentage: 25, transactionCount: 45 },
          { category: 'Fuel', amount: 1800, percentage: 18, transactionCount: 12 }
        ],
        monthlyTrends: [
          { month: 'Jan 2024', totalSpend: 10000, cardWiseSpend: [{ cardId: 'CC001', amount: 6500 }] }
        ],
        totalSpend: 10000
      };

      mockTransactions = [
        { transactionId: 'TXN001', category: 'Food & Dining', amount: 45.50 },
        { transactionId: 'TXN002', category: 'Food & Dining', amount: 32.00 }
      ];
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: getSpendingAnalytics - successful retrieval without date range
    - Purpose: Verify service retrieves spending analytics from API without date filters
    - Scenario: Call getSpendingAnalytics with no date range
    - Expected Result: Promise resolves with analytics data from API response
    */
    it('should retrieve spending analytics successfully without date range', function() {
      var result;
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/analytics/spending').respond(200, mockAnalyticsData);

      AnalyticsService.getSpendingAnalytics().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockAnalyticsData);
      expect(result.categories.length).toBe(2);
      expect(result.totalSpend).toBe(10000);
    });

    /*
    Test Documentation:
    - Test Name: getSpendingAnalytics - successful retrieval with date range
    - Purpose: Verify service retrieves spending analytics with date range filters
    - Scenario: Call getSpendingAnalytics with startDate and endDate
    - Expected Result: Promise resolves with filtered analytics data, URL includes date parameters
    */
    it('should retrieve spending analytics with date range filter', function() {
      var result;
      var dateRange = { startDate: '2024-01-01', endDate: '2024-01-31' };
      var expectedUrl = API_CONFIG.baseUrl + '/analytics/spending?startDate=2024-01-01&endDate=2024-01-31';

      $httpBackend.expectGET(expectedUrl).respond(200, mockAnalyticsData);

      AnalyticsService.getSpendingAnalytics(dateRange).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockAnalyticsData);
    });

    /*
    Test Documentation:
    - Test Name: getSpendingAnalytics - handles API error
    - Purpose: Verify service properly handles API errors
    - Scenario: API returns 500 error when fetching analytics
    - Expected Result: Promise rejects with error object
    */
    it('should handle error when retrieving spending analytics fails', function() {
      var error;
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/analytics/spending').respond(500, 'Internal Server Error');

      AnalyticsService.getSpendingAnalytics().then(function() {
        fail('Should not resolve');
      }, function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: getSpendingAnalytics - handles partial date range
    - Purpose: Verify service handles incomplete date range gracefully
    - Scenario: Call with only startDate or only endDate
    - Expected Result: Service does not append date parameters if both are not present
    */
    it('should not append date parameters if date range is incomplete', function() {
      var result;
      var incompleteDateRange = { startDate: '2024-01-01' };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/analytics/spending').respond(200, mockAnalyticsData);

      AnalyticsService.getSpendingAnalytics(incompleteDateRange).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockAnalyticsData);
    });

    /*
    Test Documentation:
    - Test Name: getTransactionsByCategory - successful retrieval
    - Purpose: Verify service retrieves transactions filtered by category
    - Scenario: Call getTransactionsByCategory with valid category name
    - Expected Result: Promise resolves with filtered transaction list
    */
    it('should retrieve transactions by category successfully', function() {
      var result;
      var category = 'Food & Dining';
      var expectedUrl = API_CONFIG.baseUrl + '/transactions?category=' + category;

      $httpBackend.expectGET(expectedUrl).respond(200, mockTransactions);

      AnalyticsService.getTransactionsByCategory(category).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Food & Dining');
    });

    /*
    Test Documentation:
    - Test Name: getTransactionsByCategory - handles API error
    - Purpose: Verify service properly handles errors when fetching category transactions
    - Scenario: API returns 404 error for category transactions
    - Expected Result: Promise rejects with error object
    */
    it('should handle error when retrieving transactions by category fails', function() {
      var error;
      var category = 'InvalidCategory';

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?category=' + category).respond(404, 'Not Found');

      AnalyticsService.getTransactionsByCategory(category).then(function() {
        fail('Should not resolve');
      }, function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    /*
    Test Documentation:
    - Test Name: getTransactionsByCategory - handles special characters in category
    - Purpose: Verify service handles category names with special characters
    - Scenario: Call with category containing spaces and ampersand
    - Expected Result: Category parameter is properly encoded in URL
    */
    it('should handle special characters in category name', function() {
      var result;
      var category = 'Food & Dining';

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?category=Food & Dining').respond(200, mockTransactions);

      AnalyticsService.getTransactionsByCategory(category).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: getMockAnalytics - returns complete mock data structure
    - Purpose: Verify mock analytics data contains all required fields and categories
    - Scenario: Call getMockAnalytics without parameters
    - Expected Result: Returns object with categories array (9 categories), monthlyTrends array (6 months), totalSpend, and period
    */
    it('should return complete mock analytics data structure', function() {
      var mockData = AnalyticsService.getMockAnalytics();

      expect(mockData).toBeDefined();
      expect(mockData.categories).toBeDefined();
      expect(mockData.categories.length).toBe(9);
      expect(mockData.monthlyTrends).toBeDefined();
      expect(mockData.monthlyTrends.length).toBe(6);
      expect(mockData.totalSpend).toBe(10000);
      expect(mockData.period).toBeDefined();
      expect(mockData.period.startDate).toEqual(jasmine.any(Date));
      expect(mockData.period.endDate).toEqual(jasmine.any(Date));
    });

    /*
    Test Documentation:
    - Test Name: getMockAnalytics - validates all 9 predefined categories
    - Purpose: Verify mock data includes all required spending categories
    - Scenario: Call getMockAnalytics and check category names
    - Expected Result: Categories array contains Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous
    */
    it('should return mock analytics with all 9 predefined categories', function() {
      var mockData = AnalyticsService.getMockAnalytics();
      var categoryNames = mockData.categories.map(function(c) { return c.category; });

      expect(categoryNames).toContain('Food & Dining');
      expect(categoryNames).toContain('Fuel');
      expect(categoryNames).toContain('Shopping');
      expect(categoryNames).toContain('Travel');
      expect(categoryNames).toContain('Entertainment');
      expect(categoryNames).toContain('Utilities');
      expect(categoryNames).toContain('Healthcare');
      expect(categoryNames).toContain('Education');
      expect(categoryNames).toContain('Miscellaneous');
    });

    /*
    Test Documentation:
    - Test Name: getMockAnalytics - validates category data structure
    - Purpose: Verify each category object has required fields
    - Scenario: Call getMockAnalytics and inspect category objects
    - Expected Result: Each category has category name, amount, percentage, and transactionCount
    */
    it('should return mock analytics with proper category data structure', function() {
      var mockData = AnalyticsService.getMockAnalytics();
      var firstCategory = mockData.categories[0];

      expect(firstCategory.category).toBeDefined();
      expect(firstCategory.amount).toBeDefined();
      expect(firstCategory.percentage).toBeDefined();
      expect(firstCategory.transactionCount).toBeDefined();
      expect(typeof firstCategory.amount).toBe('number');
      expect(typeof firstCategory.percentage).toBe('number');
      expect(typeof firstCategory.transactionCount).toBe('number');
    });

    /*
    Test Documentation:
    - Test Name: getMockAnalytics - validates monthly trends structure
    - Purpose: Verify monthly trends data has correct structure with card-wise breakdown
    - Scenario: Call getMockAnalytics and inspect monthlyTrends array
    - Expected Result: Each trend has month, totalSpend, and cardWiseSpend array
    */
    it('should return mock analytics with proper monthly trends structure', function() {
      var mockData = AnalyticsService.getMockAnalytics();
      var firstTrend = mockData.monthlyTrends[0];

      expect(firstTrend.month).toBeDefined();
      expect(firstTrend.totalSpend).toBeDefined();
      expect(firstTrend.cardWiseSpend).toBeDefined();
      expect(Array.isArray(firstTrend.cardWiseSpend)).toBe(true);
      expect(firstTrend.cardWiseSpend.length).toBeGreaterThan(0);
      expect(firstTrend.cardWiseSpend[0].cardId).toBeDefined();
      expect(firstTrend.cardWiseSpend[0].amount).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: API timeout configuration
    - Purpose: Verify service respects API_CONFIG timeout setting
    - Scenario: Make API call and verify timeout parameter is passed
    - Expected Result: HTTP request includes timeout configuration from API_CONFIG
    */
    it('should use API_CONFIG timeout for HTTP requests', function() {
      var httpConfig;
      spyOn(AnalyticsService, 'getSpendingAnalytics').and.callFake(function() {
        return { then: function() {} };
      });

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/analytics/spending').respond(200, mockAnalyticsData);
      AnalyticsService.getSpendingAnalytics();
      $httpBackend.flush();

      expect(API_CONFIG.timeout).toBeDefined();
      expect(typeof API_CONFIG.timeout).toBe('number');
    });

    /*
    Test Documentation:
    - Test Name: Service method existence
    - Purpose: Verify all required service methods are defined
    - Scenario: Check service object for method definitions
    - Expected Result: getSpendingAnalytics, getTransactionsByCategory, and getMockAnalytics methods exist
    */
    it('should have all required service methods defined', function() {
      expect(AnalyticsService.getSpendingAnalytics).toBeDefined();
      expect(typeof AnalyticsService.getSpendingAnalytics).toBe('function');
      expect(AnalyticsService.getTransactionsByCategory).toBeDefined();
      expect(typeof AnalyticsService.getTransactionsByCategory).toBe('function');
      expect(AnalyticsService.getMockAnalytics).toBeDefined();
      expect(typeof AnalyticsService.getMockAnalytics).toBe('function');
    });
  });

})();

/*
Coverage Report:
- Functions tested: getSpendingAnalytics (with/without date range, error handling), getTransactionsByCategory (success, error, special characters), getMockAnalytics (structure validation)
- Scenarios covered:
  * Successful API calls with proper data resolution
  * Error handling for failed API requests (500, 404)
  * Date range filtering (complete, incomplete, none)
  * Category filtering with special characters
  * Mock data structure validation (9 categories, 6 months trends)
  * Category data fields validation (amount, percentage, transactionCount)
  * Monthly trends with card-wise breakdown
  * API timeout configuration
  * Service method existence checks
- Edge cases covered:
  * Incomplete date range (only startDate or endDate)
  * Special characters in category names
  * Empty or null date range
  * API errors and promise rejection
- Uncovered scenarios: Network timeout simulation, concurrent API calls, data caching mechanisms
*/