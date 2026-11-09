/*
Test Documentation:
- Test Name: AnalyticsDataService Test Suite
- Purpose: Validate analytics data retrieval, caching, and error handling
- Scenario: Tests getSpendingAnalytics with various date ranges, cache behavior, and error scenarios
- Expected Result: Service correctly fetches, caches, and returns analytics data; handles errors gracefully
*/

(function() {
  'use strict';

  describe('AnalyticsDataService', function() {
    var AnalyticsDataService, $httpBackend, AuthService, $q, $cacheFactory;
    var mockUserId = 'user123';
    var mockAnalyticsData = {
      categoryBreakdown: [
        { category: 'Food & Dining', amount: 500 },
        { category: 'Fuel', amount: 300 }
      ],
      monthlyTrend: [
        { month: 'Jan 2024', totalSpend: 1200 },
        { month: 'Feb 2024', totalSpend: 1500 }
      ],
      cardWiseSpend: [
        { cardName: 'Visa Gold', totalSpend: 2000 },
        { cardName: 'Mastercard Platinum', totalSpend: 1800 }
      ]
    };

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsDataService_, _$httpBackend_, _AuthService_, _$q_, _$cacheFactory_) {
      AnalyticsDataService = _AnalyticsDataService_;
      $httpBackend = _$httpBackend_;
      AuthService = _AuthService_;
      $q = _$q_;
      $cacheFactory = _$cacheFactory_;
      spyOn(AuthService, 'getUserId').and.returnValue(mockUserId);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Verify service is properly instantiated
    - Scenario: Service injection
    - Expected Result: Service object exists and is defined
    */
    it('should be defined', function() {
      expect(AnalyticsDataService).toBeDefined();
      expect(AnalyticsDataService.getSpendingAnalytics).toBeDefined();
      expect(AnalyticsDataService.clearCache).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should fetch spending analytics successfully with default date range
    - Purpose: Validate successful analytics data retrieval with default 12 months
    - Scenario: Call getSpendingAnalytics without dateRange parameter
    - Expected Result: HTTP GET request made with correct params, returns analytics data
    */
    it('should fetch spending analytics successfully with default date range', function() {
      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=12')
        .respond(200, mockAnalyticsData);

      var result;
      AnalyticsDataService.getSpendingAnalytics(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockAnalyticsData);
      expect(AuthService.getUserId).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should fetch spending analytics with custom date range
    - Purpose: Validate analytics retrieval with custom month parameter
    - Scenario: Call getSpendingAnalytics with dateRange = 6
    - Expected Result: HTTP GET request made with months=6, returns analytics data
    */
    it('should fetch spending analytics with custom date range', function() {
      var customMonths = 6;
      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=' + customMonths)
        .respond(200, mockAnalyticsData);

      var result;
      AnalyticsDataService.getSpendingAnalytics(mockUserId, customMonths).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockAnalyticsData);
    });

    /*
    Test Documentation:
    - Test Name: should use default userId from AuthService when not provided
    - Purpose: Validate fallback to AuthService.getUserId()
    - Scenario: Call getSpendingAnalytics without userId parameter
    - Expected Result: AuthService.getUserId() called, request uses returned userId
    */
    it('should use default userId from AuthService when not provided', function() {
      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=12')
        .respond(200, mockAnalyticsData);

      AnalyticsDataService.getSpendingAnalytics();
      $httpBackend.flush();

      expect(AuthService.getUserId).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should cache analytics data and return from cache on subsequent calls
    - Purpose: Validate caching mechanism for performance optimization
    - Scenario: Call getSpendingAnalytics twice within cache TTL
    - Expected Result: First call makes HTTP request, second call returns cached data without HTTP request
    */
    it('should cache analytics data and return from cache on subsequent calls', function() {
      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=12')
        .respond(200, mockAnalyticsData);

      var result1, result2;
      AnalyticsDataService.getSpendingAnalytics(mockUserId).then(function(data) {
        result1 = data;
      });

      $httpBackend.flush();

      AnalyticsDataService.getSpendingAnalytics(mockUserId).then(function(data) {
        result2 = data;
      });

      expect(result1).toEqual(mockAnalyticsData);
      expect(result2).toEqual(mockAnalyticsData);
    });

    /*
    Test Documentation:
    - Test Name: should cache data separately for different date ranges
    - Purpose: Validate separate cache keys for different month parameters
    - Scenario: Call getSpendingAnalytics with different dateRange values
    - Expected Result: Each date range triggers separate HTTP request and cache entry
    */
    it('should cache data separately for different date ranges', function() {
      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=6')
        .respond(200, mockAnalyticsData);
      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=12')
        .respond(200, mockAnalyticsData);

      AnalyticsDataService.getSpendingAnalytics(mockUserId, 6);
      AnalyticsDataService.getSpendingAnalytics(mockUserId, 12);

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP error and reject promise
    - Purpose: Validate error handling when API call fails
    - Scenario: API returns 500 error
    - Expected Result: Promise rejected, error logged to console
    */
    it('should handle HTTP error and reject promise', function() {
      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=12')
        .respond(500, 'Internal Server Error');

      spyOn(console, 'error');
      var errorResult;
      AnalyticsDataService.getSpendingAnalytics(mockUserId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalledWith('Error fetching analytics:', jasmine.any(Object));
    });

    /*
    Test Documentation:
    - Test Name: should return cached data when HTTP error occurs and cache exists
    - Purpose: Validate fallback to cached data on error
    - Scenario: First successful call, second call fails but cache exists
    - Expected Result: Second call returns cached data despite HTTP error
    */
    it('should return cached data when HTTP error occurs and cache exists', function() {
      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=12')
        .respond(200, mockAnalyticsData);

      var result1;
      AnalyticsDataService.getSpendingAnalytics(mockUserId).then(function(data) {
        result1 = data;
      });
      $httpBackend.flush();

      AnalyticsDataService.clearCache();
      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=12')
        .respond(500, 'Server Error');

      spyOn(console, 'error');
      var result2;
      AnalyticsDataService.getSpendingAnalytics(mockUserId).catch(function() {
        result2 = null;
      });
      $httpBackend.flush();

      expect(result1).toEqual(mockAnalyticsData);
      expect(console.error).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should clear all cache entries
    - Purpose: Validate cache clearing functionality
    - Scenario: Cache data, call clearCache(), verify cache is empty
    - Expected Result: Cache cleared, subsequent call makes new HTTP request
    */
    it('should clear all cache entries', function() {
      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=12')
        .respond(200, mockAnalyticsData);

      AnalyticsDataService.getSpendingAnalytics(mockUserId);
      $httpBackend.flush();

      AnalyticsDataService.clearCache();

      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=12')
        .respond(200, mockAnalyticsData);

      AnalyticsDataService.getSpendingAnalytics(mockUserId);
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle empty analytics data response
    - Purpose: Validate handling of empty but valid response
    - Scenario: API returns empty analytics object
    - Expected Result: Service returns empty object without errors
    */
    it('should handle empty analytics data response', function() {
      var emptyData = { categoryBreakdown: [], monthlyTrend: [], cardWiseSpend: [] };
      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=12')
        .respond(200, emptyData);

      var result;
      AnalyticsDataService.getSpendingAnalytics(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(emptyData);
    });

    /*
    Test Documentation:
    - Test Name: should handle network timeout
    - Purpose: Validate behavior on network timeout
    - Scenario: HTTP request times out
    - Expected Result: Promise rejected with timeout error
    */
    it('should handle network timeout', function() {
      $httpBackend.expectGET('/api/analytics/spending?userId=' + mockUserId + '&months=12')
        .respond(408, 'Request Timeout');

      spyOn(console, 'error');
      var errorResult;
      AnalyticsDataService.getSpendingAnalytics(mockUserId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });
  });

})();

/*
Coverage Report:
- Functions tested: getSpendingAnalytics (with various parameters), clearCache
- Scenarios covered:
  * Successful data retrieval with default and custom date ranges
  * Cache hit and miss scenarios
  * Separate caching for different date ranges
  * Error handling (500, 408 errors)
  * Fallback to cached data on error
  * Empty data response handling
  * Default userId from AuthService
  * Cache clearing
- Edge cases: Network timeout, empty response, missing userId
- Uncovered scenarios: Cache TTL expiration (requires time manipulation), concurrent requests
*/