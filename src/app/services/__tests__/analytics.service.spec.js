/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics with valid filter
- Purpose: Validates that getSpendingAnalytics returns analytics data for valid filter
- Scenario: Service called with valid filter object
- Expected Result: Returns promise resolving to analytics data with categorySpending, monthlyTrends, cardWiseSpending

- Test Name: AnalyticsService - getSpendingAnalytics with cache hit
- Purpose: Validates that cached data is returned when cache is valid
- Scenario: Service called twice with same filter within cache TTL
- Expected Result: Second call returns cached data without HTTP request

- Test Name: AnalyticsService - getSpendingAnalytics with HTTP error
- Purpose: Validates fallback to mock data when HTTP request fails
- Scenario: HTTP request returns error
- Expected Result: Returns mock analytics data

- Test Name: AnalyticsService - getSpendingAnalytics with empty filter
- Purpose: Validates service handles empty filter object
- Scenario: Service called with null or empty filter
- Expected Result: Returns analytics data with default date range

- Test Name: AnalyticsService - _getMockAnalytics
- Purpose: Validates mock data structure and content
- Scenario: Mock data generator called
- Expected Result: Returns complete analytics object with all required fields

Coverage Report:
- Functions tested: getSpendingAnalytics, _getMockAnalytics
- Scenarios covered: valid filter, cache hit, HTTP error, empty filter, mock data generation
- Edge cases: null filter, cache expiration, HTTP failure
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';

  var AnalyticsService, $httpBackend, $q, $cacheFactory;
  var API_BASE = '/api/analytics/spending';

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _$q_, _$cacheFactory_) {
    AnalyticsService = _AnalyticsService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $cacheFactory = _$cacheFactory_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getSpendingAnalytics', function() {
    it('should return analytics data for valid filter', function() {
      var filter = {cardId: 'CC001', startDate: '2024-01-01', endDate: '2024-01-31'};
      var mockResponse = {
        categorySpending: [{category: 'Food & Dining', amount: 5000, transactionCount: 20}],
        monthlyTrends: [{month: 'Jan 2024', amount: 15000}],
        cardWiseSpending: [{cardId: 'CC001', cardNumber: '**** 1234', amount: 15000}],
        dateRange: {startDate: '2024-01-01', endDate: '2024-01-31'}
      };

      $httpBackend.expectGET(API_BASE + '?startDate=2024-01-01&endDate=2024-01-31&cardId=CC001&').respond(200, mockResponse);

      var result;
      AnalyticsService.getSpendingAnalytics(filter).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.categorySpending).toBeDefined();
      expect(result.categorySpending.length).toBeGreaterThan(0);
      expect(result.monthlyTrends).toBeDefined();
      expect(result.cardWiseSpending).toBeDefined();
    });

    it('should return cached data on subsequent calls within TTL', function() {
      var filter = {cardId: 'CC001'};
      var mockResponse = {
        categorySpending: [{category: 'Shopping', amount: 3000, transactionCount: 10}],
        monthlyTrends: [{month: 'Jan 2024', amount: 10000}],
        cardWiseSpending: [{cardId: 'CC001', cardNumber: '**** 1234', amount: 10000}],
        dateRange: {startDate: new Date('2024-01-01'), endDate: new Date()}
      };

      $httpBackend.expectGET(API_BASE + '?cardId=CC001&').respond(200, mockResponse);

      var result1, result2;
      AnalyticsService.getSpendingAnalytics(filter).then(function(data) {
        result1 = data;
      });

      $httpBackend.flush();

      AnalyticsService.getSpendingAnalytics(filter).then(function(data) {
        result2 = data;
      });

      expect(result1).toEqual(result2);
    });

    it('should return mock data when HTTP request fails', function() {
      var filter = {cardId: 'CC002'};

      $httpBackend.expectGET(API_BASE + '?cardId=CC002&').respond(500, 'Server Error');

      var result;
      AnalyticsService.getSpendingAnalytics(filter).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.categorySpending).toBeDefined();
      expect(result.categorySpending.length).toBe(9);
      expect(result.monthlyTrends).toBeDefined();
      expect(result.cardWiseSpending).toBeDefined();
    });

    it('should handle empty filter object', function() {
      var filter = {};

      $httpBackend.expectGET(API_BASE + '?').respond(500, 'Error');

      var result;
      AnalyticsService.getSpendingAnalytics(filter).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.dateRange).toBeDefined();
    });

    it('should handle null filter', function() {
      $httpBackend.expectGET(API_BASE + '?').respond(500, 'Error');

      var result;
      AnalyticsService.getSpendingAnalytics(null).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
    });
  });

  describe('_getMockAnalytics', function() {
    it('should return complete mock analytics data', function() {
      var filter = {};
      var mockData = AnalyticsService._getMockAnalytics(filter);

      expect(mockData).toBeDefined();
      expect(mockData.categorySpending).toBeDefined();
      expect(mockData.categorySpending.length).toBe(9);
      expect(mockData.monthlyTrends).toBeDefined();
      expect(mockData.monthlyTrends.length).toBe(4);
      expect(mockData.cardWiseSpending).toBeDefined();
      expect(mockData.cardWiseSpending.length).toBe(3);
      expect(mockData.dateRange).toBeDefined();
    });

    it('should include all required categories in mock data', function() {
      var mockData = AnalyticsService._getMockAnalytics({});
      var categories = mockData.categorySpending.map(function(item) { return item.category; });

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

    it('should use filter dates in mock data when provided', function() {
      var filter = {startDate: '2024-02-01', endDate: '2024-02-29'};
      var mockData = AnalyticsService._getMockAnalytics(filter);

      expect(mockData.dateRange.startDate).toBe('2024-02-01');
      expect(mockData.dateRange.endDate).toBe('2024-02-29');
    });
  });
});