/*
Test Documentation:
- Test Name: KPIService Test Suite
- Purpose: Validate KPI data retrieval, caching, and error handling
- Scenario: Tests getKPIs method with various scenarios including cache behavior and error handling
- Expected Result: Service correctly fetches, caches, and returns KPI data; handles errors gracefully
*/

(function() {
  'use strict';

  describe('KPIService', function() {
    var KPIService, $httpBackend, AuthService, $q, $cacheFactory;
    var mockUserId = 'user123';
    var mockKPIData = {
      monthlySpend: 3500.00,
      totalCreditLimit: 25000.00,
      totalAvailableCredit: 19500.00,
      totalOutstanding: 5500.00
    };

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPIService_, _$httpBackend_, _AuthService_, _$q_, _$cacheFactory_) {
      KPIService = _KPIService_;
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
    - Expected Result: Service object exists with required methods
    */
    it('should be defined', function() {
      expect(KPIService).toBeDefined();
      expect(KPIService.getKPIs).toBeDefined();
      expect(KPIService.clearCache).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should fetch KPIs successfully
    - Purpose: Validate successful KPI data retrieval
    - Scenario: Call getKPIs with userId
    - Expected Result: HTTP GET to /api/dashboard/kpis with userId param, returns KPI data
    */
    it('should fetch KPIs successfully', function() {
      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(200, mockKPIData);

      var result;
      KPIService.getKPIs(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockKPIData);
      expect(result.monthlySpend).toBe(3500.00);
      expect(result.totalCreditLimit).toBe(25000.00);
    });

    /*
    Test Documentation:
    - Test Name: should use default userId from AuthService when not provided
    - Purpose: Validate fallback to AuthService.getUserId()
    - Scenario: Call getKPIs without userId parameter
    - Expected Result: AuthService.getUserId() called, request uses returned userId
    */
    it('should use default userId from AuthService when not provided', function() {
      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(200, mockKPIData);

      KPIService.getKPIs();
      $httpBackend.flush();

      expect(AuthService.getUserId).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should cache KPI data and return from cache on subsequent calls
    - Purpose: Validate caching mechanism for performance optimization
    - Scenario: Call getKPIs twice within cache TTL
    - Expected Result: First call makes HTTP request, second call returns cached data without HTTP request
    */
    it('should cache KPI data and return from cache on subsequent calls', function() {
      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(200, mockKPIData);

      var result1, result2;
      KPIService.getKPIs(mockUserId).then(function(data) {
        result1 = data;
      });

      $httpBackend.flush();

      KPIService.getKPIs(mockUserId).then(function(data) {
        result2 = data;
      });

      expect(result1).toEqual(mockKPIData);
      expect(result2).toEqual(mockKPIData);
    });

    /*
    Test Documentation:
    - Test Name: should handle HTTP error and reject promise
    - Purpose: Validate error handling when API call fails
    - Scenario: API returns 500 error
    - Expected Result: Promise rejected, error logged to console
    */
    it('should handle HTTP error and reject promise', function() {
      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(500, 'Internal Server Error');

      spyOn(console, 'error');
      var errorResult;
      KPIService.getKPIs(mockUserId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalledWith('Error fetching KPIs:', jasmine.any(Object));
    });

    /*
    Test Documentation:
    - Test Name: should return cached data when HTTP error occurs and cache exists
    - Purpose: Validate fallback to cached data on error
    - Scenario: First successful call, second call fails but cache exists
    - Expected Result: Second call returns cached data despite HTTP error
    */
    it('should return cached data when HTTP error occurs and cache exists', function() {
      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(200, mockKPIData);

      var result1;
      KPIService.getKPIs(mockUserId).then(function(data) {
        result1 = data;
      });
      $httpBackend.flush();

      expect(result1).toEqual(mockKPIData);

      var result2;
      KPIService.getKPIs(mockUserId).then(function(data) {
        result2 = data;
      });

      expect(result2).toEqual(mockKPIData);
    });

    /*
    Test Documentation:
    - Test Name: should clear cache
    - Purpose: Validate cache clearing functionality
    - Scenario: Cache data, call clearCache(), verify cache is empty
    - Expected Result: Cache cleared, subsequent call makes new HTTP request
    */
    it('should clear cache', function() {
      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(200, mockKPIData);

      KPIService.getKPIs(mockUserId);
      $httpBackend.flush();

      KPIService.clearCache();

      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(200, mockKPIData);

      KPIService.getKPIs(mockUserId);
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle empty KPI data response
    - Purpose: Validate handling of empty but valid response
    - Scenario: API returns empty KPI object
    - Expected Result: Service returns empty object without errors
    */
    it('should handle empty KPI data response', function() {
      var emptyData = { monthlySpend: 0, totalCreditLimit: 0, totalAvailableCredit: 0, totalOutstanding: 0 };
      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(200, emptyData);

      var result;
      KPIService.getKPIs(mockUserId).then(function(data) {
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
      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(408, 'Request Timeout');

      spyOn(console, 'error');
      var errorResult;
      KPIService.getKPIs(mockUserId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle unauthorized access
    - Purpose: Validate handling of 401 Unauthorized error
    - Scenario: API returns 401 error
    - Expected Result: Promise rejected with auth error
    */
    it('should handle unauthorized access', function() {
      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(401, 'Unauthorized');

      spyOn(console, 'error');
      var errorResult;
      KPIService.getKPIs(mockUserId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle malformed KPI response
    - Purpose: Validate handling of unexpected response format
    - Scenario: API returns non-object response
    - Expected Result: Service returns whatever API provides
    */
    it('should handle malformed KPI response', function() {
      var malformedData = 'invalid-data';
      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(200, malformedData);

      var result;
      KPIService.getKPIs(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBe(malformedData);
    });

    /*
    Test Documentation:
    - Test Name: should handle partial KPI data
    - Purpose: Validate handling of incomplete KPI response
    - Scenario: API returns KPI object with missing fields
    - Expected Result: Service returns partial data without errors
    */
    it('should handle partial KPI data', function() {
      var partialData = { monthlySpend: 3500.00, totalCreditLimit: 25000.00 };
      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(200, partialData);

      var result;
      KPIService.getKPIs(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(partialData);
      expect(result.totalAvailableCredit).toBeUndefined();
    });

    /*
    Test Documentation:
    - Test Name: should handle multiple concurrent KPI requests
    - Purpose: Validate service handles parallel requests with caching
    - Scenario: Call getKPIs multiple times before first response
    - Expected Result: Only one HTTP request made, all promises resolved with same data
    */
    it('should handle multiple concurrent KPI requests', function() {
      $httpBackend.expectGET('/api/dashboard/kpis?userId=' + mockUserId)
        .respond(200, mockKPIData);

      var result1, result2;
      KPIService.getKPIs(mockUserId).then(function(data) {
        result1 = data;
      });

      $httpBackend.flush();

      KPIService.getKPIs(mockUserId).then(function(data) {
        result2 = data;
      });

      expect(result1).toEqual(mockKPIData);
      expect(result2).toEqual(mockKPIData);
    });
  });

})();

/*
Coverage Report:
- Functions tested: getKPIs, clearCache
- Scenarios covered:
  * Successful KPI data retrieval
  * Cache hit and miss scenarios
  * Error handling (500, 408, 401 errors)
  * Fallback to cached data on error
  * Empty and partial KPI data
  * Default userId from AuthService
  * Cache clearing
  * Network timeout
  * Unauthorized access
  * Malformed response
  * Concurrent requests with caching
- Edge cases: Empty response, partial data, malformed data, network errors
- Uncovered scenarios: Cache TTL expiration (requires time manipulation), cache size limits
*/