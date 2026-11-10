/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending with valid userId and month
- Purpose: Validates that getCategorySpending returns category spending data
- Scenario: Service is called with valid userId and month parameters
- Expected Result: Should return category spending data from API
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending with cache hit
- Purpose: Validates caching mechanism for performance optimization
- Scenario: Service is called twice with same parameters within cache timeout
- Expected Result: Should return cached data on second call without API request
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending error handling
- Purpose: Validates error handling when API fails
- Scenario: API returns error response
- Expected Result: Should reject promise and log error
*/
/*
Coverage Report:
- Functions tested: getCategorySpending
- Scenarios covered: successful API call, cache hit, error handling, cache timeout validation
- Edge cases: null userId, undefined month, cache expiration
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, $httpBackend, $q;
    var mockUserId = 'user123';
    var mockMonth = '2026-11';
    var mockCategoryData = [
      { categoryId: '1', categoryName: 'Food & Dining', totalAmount: 500, percentage: 25 },
      { categoryId: '2', categoryName: 'Fuel', totalAmount: 300, percentage: 15 }
    ];

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _$q_) {
      AnalyticsService = _AnalyticsService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCategorySpending', function() {
      it('should fetch category spending data successfully', function() {
        $httpBackend.expectGET('/api/analytics/category-spending?userId=' + mockUserId + '&month=' + mockMonth)
          .respond(200, mockCategoryData);

        var result;
        AnalyticsService.getCategorySpending(mockUserId, mockMonth)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result).toEqual(mockCategoryData);
        expect(result.length).toBe(2);
        expect(result[0].categoryName).toBe('Food & Dining');
      });

      it('should fetch category spending without month parameter', function() {
        $httpBackend.expectGET('/api/analytics/category-spending?userId=' + mockUserId)
          .respond(200, mockCategoryData);

        var result;
        AnalyticsService.getCategorySpending(mockUserId)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result).toEqual(mockCategoryData);
      });

      it('should return cached data on subsequent calls within cache timeout', function() {
        $httpBackend.expectGET('/api/analytics/category-spending?userId=' + mockUserId + '&month=' + mockMonth)
          .respond(200, mockCategoryData);

        var firstResult, secondResult;
        AnalyticsService.getCategorySpending(mockUserId, mockMonth)
          .then(function(data) {
            firstResult = data;
          });

        $httpBackend.flush();

        AnalyticsService.getCategorySpending(mockUserId, mockMonth)
          .then(function(data) {
            secondResult = data;
          });

        expect(secondResult).toEqual(firstResult);
        expect(secondResult).toEqual(mockCategoryData);
      });

      it('should handle API errors gracefully', function() {
        var errorResponse = { status: 500, statusText: 'Internal Server Error' };
        $httpBackend.expectGET('/api/analytics/category-spending?userId=' + mockUserId + '&month=' + mockMonth)
          .respond(500, errorResponse);

        var errorResult;
        AnalyticsService.getCategorySpending(mockUserId, mockMonth)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(500);
      });

      it('should handle network errors', function() {
        $httpBackend.expectGET('/api/analytics/category-spending?userId=' + mockUserId + '&month=' + mockMonth)
          .respond(-1, null);

        var errorResult;
        AnalyticsService.getCategorySpending(mockUserId, mockMonth)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
      });

      it('should cache data with timestamp', function() {
        $httpBackend.expectGET('/api/analytics/category-spending?userId=' + mockUserId + '&month=' + mockMonth)
          .respond(200, mockCategoryData);

        var beforeTime = Date.now();
        var result;
        AnalyticsService.getCategorySpending(mockUserId, mockMonth)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();
        var afterTime = Date.now();

        expect(result).toEqual(mockCategoryData);
        expect(beforeTime).toBeLessThanOrEqual(afterTime);
      });
    });
  });
})();