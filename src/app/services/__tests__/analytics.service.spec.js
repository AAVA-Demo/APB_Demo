/*
Test Documentation:
- Test Name: AnalyticsService Unit Tests
- Purpose: Validate AnalyticsService functionality including spending data retrieval, caching, category aggregation, and monthly trend calculations
- Scenario: Tests cover normal operation, caching behavior, error handling, and data transformation logic
- Expected Result: All methods return correct data structures, caching works as expected, and errors are handled gracefully
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, $httpBackend, $rootScope, $q, SpendingDataModel;
    var API_BASE = '/api';
    var mockUserId = 'user123';
    var mockTransactions = [
      { date: '2023-01-15', category: 'Food & Dining', amount: 50.00 },
      { date: '2023-01-20', category: 'Fuel', amount: 75.00 },
      { date: '2023-02-10', category: 'Shopping', amount: 120.00 },
      { date: '2023-02-15', category: 'Food & Dining', amount: 60.00 },
      { date: '2023-03-05', category: 'Travel', amount: 200.00 },
      { date: '2023-03-10', category: 'Unknown', amount: 30.00 }
    ];

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _$rootScope_, _$q_, _SpendingDataModel_) {
      AnalyticsService = _AnalyticsService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      SpendingDataModel = _SpendingDataModel_;
      
      $rootScope.currentUser = {
        userId: mockUserId,
        token: 'mock-token'
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Verify AnalyticsService is properly instantiated
    - Scenario: Service is injected
    - Expected Result: Service object exists
    */
    it('should be defined', function() {
      expect(AnalyticsService).toBeDefined();
      expect(AnalyticsService.getSpendingData).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: getSpendingData - should fetch spending data successfully
    - Purpose: Validate successful retrieval of spending data from API
    - Scenario: User requests spending data for 12 months
    - Expected Result: Returns SpendingDataModel with transactions, category breakdown, and monthly trends
    */
    it('getSpendingData - should fetch spending data successfully', function() {
      var months = 12;
      $httpBackend.expectGET(API_BASE + '/transactions?userId=' + mockUserId + '&months=' + months)
        .respond(200, mockTransactions);

      var result;
      AnalyticsService.getSpendingData(months).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.userId).toBe(mockUserId);
      expect(result.transactions).toEqual(mockTransactions);
      expect(result.categoryBreakdown).toBeDefined();
      expect(result.monthlyTrends).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: getSpendingData - should use default months value when not provided
    - Purpose: Validate default parameter handling
    - Scenario: User calls getSpendingData without months parameter
    - Expected Result: API is called with default 12 months
    */
    it('getSpendingData - should use default months value when not provided', function() {
      $httpBackend.expectGET(API_BASE + '/transactions?userId=' + mockUserId + '&months=12')
        .respond(200, mockTransactions);

      AnalyticsService.getSpendingData();
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: getSpendingData - should aggregate transactions by category correctly
    - Purpose: Validate category aggregation logic
    - Scenario: Transactions with various categories are processed
    - Expected Result: Category breakdown contains correct sums for each category
    */
    it('getSpendingData - should aggregate transactions by category correctly', function() {
      $httpBackend.expectGET(API_BASE + '/transactions?userId=' + mockUserId + '&months=12')
        .respond(200, mockTransactions);

      var result;
      AnalyticsService.getSpendingData(12).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.categoryBreakdown['Food & Dining']).toBe(110.00);
      expect(result.categoryBreakdown['Fuel']).toBe(75.00);
      expect(result.categoryBreakdown['Shopping']).toBe(120.00);
      expect(result.categoryBreakdown['Travel']).toBe(200.00);
      expect(result.categoryBreakdown['Miscellaneous']).toBe(30.00);
    });

    /*
    Test Documentation:
    - Test Name: getSpendingData - should aggregate transactions by month correctly
    - Purpose: Validate monthly trend aggregation logic
    - Scenario: Transactions from different months are processed
    - Expected Result: Monthly trends array contains correct monthly sums in sorted order
    */
    it('getSpendingData - should aggregate transactions by month correctly', function() {
      $httpBackend.expectGET(API_BASE + '/transactions?userId=' + mockUserId + '&months=12')
        .respond(200, mockTransactions);

      var result;
      AnalyticsService.getSpendingData(12).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlyTrends.length).toBe(3);
      expect(result.monthlyTrends[0].month).toBe('2023-01');
      expect(result.monthlyTrends[0].spend).toBe(125.00);
      expect(result.monthlyTrends[1].month).toBe('2023-02');
      expect(result.monthlyTrends[1].spend).toBe(180.00);
      expect(result.monthlyTrends[2].month).toBe('2023-03');
      expect(result.monthlyTrends[2].spend).toBe(230.00);
    });

    /*
    Test Documentation:
    - Test Name: getSpendingData - should return cached data within TTL
    - Purpose: Validate caching mechanism
    - Scenario: Multiple calls to getSpendingData within cache TTL period
    - Expected Result: Second call returns cached data without making HTTP request
    */
    it('getSpendingData - should return cached data within TTL', function() {
      $httpBackend.expectGET(API_BASE + '/transactions?userId=' + mockUserId + '&months=12')
        .respond(200, mockTransactions);

      var result1, result2;
      AnalyticsService.getSpendingData(12).then(function(data) {
        result1 = data;
      });

      $httpBackend.flush();

      AnalyticsService.getSpendingData(12).then(function(data) {
        result2 = data;
      });

      $rootScope.$digest();

      expect(result1).toBe(result2);
    });

    /*
    Test Documentation:
    - Test Name: getSpendingData - should handle HTTP errors gracefully
    - Purpose: Validate error handling for failed API requests
    - Scenario: API returns 500 error
    - Expected Result: Promise is rejected with error
    */
    it('getSpendingData - should handle HTTP errors gracefully', function() {
      $httpBackend.expectGET(API_BASE + '/transactions?userId=' + mockUserId + '&months=12')
        .respond(500, 'Internal Server Error');

      var errorCaught = false;
      AnalyticsService.getSpendingData(12).catch(function(error) {
        errorCaught = true;
      });

      $httpBackend.flush();

      expect(errorCaught).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: getSpendingData - should handle empty transactions array
    - Purpose: Validate handling of edge case with no transactions
    - Scenario: API returns empty array
    - Expected Result: Returns valid SpendingDataModel with empty/zero values
    */
    it('getSpendingData - should handle empty transactions array', function() {
      $httpBackend.expectGET(API_BASE + '/transactions?userId=' + mockUserId + '&months=12')
        .respond(200, []);

      var result;
      AnalyticsService.getSpendingData(12).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.transactions.length).toBe(0);
      expect(result.monthlyTrends.length).toBe(0);
      expect(result.categoryBreakdown['Food & Dining']).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: getSpendingData - should initialize all predefined categories to zero
    - Purpose: Validate category initialization logic
    - Scenario: Transactions don't cover all categories
    - Expected Result: All predefined categories exist in breakdown with at least zero value
    */
    it('getSpendingData - should initialize all predefined categories to zero', function() {
      var limitedTransactions = [
        { date: '2023-01-15', category: 'Food & Dining', amount: 50.00 }
      ];

      $httpBackend.expectGET(API_BASE + '/transactions?userId=' + mockUserId + '&months=12')
        .respond(200, limitedTransactions);

      var result;
      AnalyticsService.getSpendingData(12).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.categoryBreakdown['Food & Dining']).toBe(50.00);
      expect(result.categoryBreakdown['Fuel']).toBe(0);
      expect(result.categoryBreakdown['Shopping']).toBe(0);
      expect(result.categoryBreakdown['Travel']).toBe(0);
      expect(result.categoryBreakdown['Entertainment']).toBe(0);
      expect(result.categoryBreakdown['Utilities']).toBe(0);
      expect(result.categoryBreakdown['Healthcare']).toBe(0);
      expect(result.categoryBreakdown['Education']).toBe(0);
      expect(result.categoryBreakdown['Miscellaneous']).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: getSpendingData - should categorize unknown categories as Miscellaneous
    - Purpose: Validate handling of transactions with unrecognized categories
    - Scenario: Transaction has category not in predefined list
    - Expected Result: Amount is added to Miscellaneous category
    */
    it('getSpendingData - should categorize unknown categories as Miscellaneous', function() {
      var unknownCategoryTransactions = [
        { date: '2023-01-15', category: 'UnknownCategory', amount: 100.00 },
        { date: '2023-01-20', category: 'AnotherUnknown', amount: 50.00 }
      ];

      $httpBackend.expectGET(API_BASE + '/transactions?userId=' + mockUserId + '&months=12')
        .respond(200, unknownCategoryTransactions);

      var result;
      AnalyticsService.getSpendingData(12).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.categoryBreakdown['Miscellaneous']).toBe(150.00);
    });

    /*
    Test Documentation:
    - Test Name: getSpendingData - should handle transactions with invalid dates
    - Purpose: Validate error handling for malformed date data
    - Scenario: Transaction contains invalid date string
    - Expected Result: Service handles gracefully without crashing
    */
    it('getSpendingData - should handle transactions with invalid dates', function() {
      var invalidDateTransactions = [
        { date: 'invalid-date', category: 'Food & Dining', amount: 50.00 },
        { date: '2023-01-15', category: 'Fuel', amount: 75.00 }
      ];

      $httpBackend.expectGET(API_BASE + '/transactions?userId=' + mockUserId + '&months=12')
        .respond(200, invalidDateTransactions);

      var result;
      AnalyticsService.getSpendingData(12).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.monthlyTrends.length).toBeGreaterThan(0);
    });
  });

  /*
  Coverage Report:
  - Functions tested: getSpendingData, aggregateByCategory (internal), aggregateByMonth (internal)
  - Scenarios covered:
    * Successful data retrieval
    * Default parameter handling
    * Category aggregation with all predefined categories
    * Monthly trend aggregation and sorting
    * Caching mechanism (within TTL)
    * HTTP error handling
    * Empty transactions array
    * Unknown category handling (Miscellaneous)
    * Invalid date handling
    * All predefined categories initialization
  - Uncovered scenarios:
    * Cache expiration after TTL (requires time manipulation)
    * Network timeout scenarios
    * Concurrent request handling
  */
})();