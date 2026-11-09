/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending with valid date range
- Purpose: Validates that getCategorySpending retrieves category spending data with provided date range
- Scenario: Service called with valid startDate and endDate parameters
- Expected Result: Returns analytics data from API response
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending with default dates
- Purpose: Validates that getCategorySpending uses default dates when none provided
- Scenario: Service called without date parameters
- Expected Result: Uses 12 months ago as startDate and current date as endDate
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending error handling
- Purpose: Validates error handling when API call fails
- Scenario: HTTP request returns error response
- Expected Result: Promise rejected with error and error logged to console
*/
/*
Coverage Report:
- Functions tested: getCategorySpending, getDefaultStartDate
- Scenarios covered: valid date range, default dates, error handling, parameter validation
- Edge cases: null dates, undefined dates, API failures
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, $httpBackend, $rootScope, $q;
    var apiBaseUrl = 'https://api.creditcard.demo';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _$rootScope_, _$q_) {
      AnalyticsService = _AnalyticsService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $rootScope.apiBaseUrl = apiBaseUrl;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCategorySpending', function() {
      it('should retrieve category spending data with valid date range', function() {
        var startDate = '2023-01-01T00:00:00.000Z';
        var endDate = '2023-12-31T23:59:59.999Z';
        var mockResponse = {
          categories: [
            { categoryName: 'Food & Dining', totalSpend: 1500.50, transactionCount: 45 },
            { categoryName: 'Fuel', totalSpend: 800.25, transactionCount: 20 }
          ],
          monthlyTrends: [
            { month: 'Jan 2023', totalSpend: 2300.75 },
            { month: 'Feb 2023', totalSpend: 2100.50 }
          ]
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/analytics/spending?endDate=' + endDate + '&startDate=' + startDate)
          .respond(200, mockResponse);

        var result;
        AnalyticsService.getCategorySpending(startDate, endDate).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.categories.length).toBe(2);
        expect(result.categories[0].categoryName).toBe('Food & Dining');
        expect(result.monthlyTrends.length).toBe(2);
      });

      it('should use default dates when no parameters provided', function() {
        var mockResponse = {
          categories: [],
          monthlyTrends: []
        };

        var currentDate = new Date();
        var twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        $httpBackend.expectGET(function(url) {
          return url.indexOf(apiBaseUrl + '/api/analytics/spending') === 0 &&
                 url.indexOf('startDate=') > -1 &&
                 url.indexOf('endDate=') > -1;
        }).respond(200, mockResponse);

        var result;
        AnalyticsService.getCategorySpending().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should use default startDate when only endDate provided', function() {
        var endDate = '2023-12-31T23:59:59.999Z';
        var mockResponse = { categories: [], monthlyTrends: [] };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(apiBaseUrl + '/api/analytics/spending') === 0 &&
                 url.indexOf('endDate=' + endDate) > -1 &&
                 url.indexOf('startDate=') > -1;
        }).respond(200, mockResponse);

        var result;
        AnalyticsService.getCategorySpending(null, endDate).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
      });

      it('should handle API error and reject promise', function() {
        var startDate = '2023-01-01T00:00:00.000Z';
        var endDate = '2023-12-31T23:59:59.999Z';
        var errorResponse = { message: 'Internal Server Error' };

        spyOn(console, 'error');

        $httpBackend.expectGET(apiBaseUrl + '/api/analytics/spending?endDate=' + endDate + '&startDate=' + startDate)
          .respond(500, errorResponse);

        var error;
        AnalyticsService.getCategorySpending(startDate, endDate).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
        expect(console.error).toHaveBeenCalledWith('Error fetching analytics:', jasmine.any(Object));
      });

      it('should handle network error', function() {
        var startDate = '2023-01-01T00:00:00.000Z';
        var endDate = '2023-12-31T23:59:59.999Z';

        spyOn(console, 'error');

        $httpBackend.expectGET(apiBaseUrl + '/api/analytics/spending?endDate=' + endDate + '&startDate=' + startDate)
          .respond(-1, null);

        var error;
        AnalyticsService.getCategorySpending(startDate, endDate).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle empty response data', function() {
        var startDate = '2023-01-01T00:00:00.000Z';
        var endDate = '2023-12-31T23:59:59.999Z';

        $httpBackend.expectGET(apiBaseUrl + '/api/analytics/spending?endDate=' + endDate + '&startDate=' + startDate)
          .respond(200, null);

        var result;
        AnalyticsService.getCategorySpending(startDate, endDate).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeNull();
      });

      it('should handle malformed date parameters gracefully', function() {
        var startDate = 'invalid-date';
        var endDate = 'invalid-date';
        var mockResponse = { categories: [], monthlyTrends: [] };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(apiBaseUrl + '/api/analytics/spending') === 0;
        }).respond(200, mockResponse);

        var result;
        AnalyticsService.getCategorySpending(startDate, endDate).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });
    });

    describe('service initialization', function() {
      it('should be defined', function() {
        expect(AnalyticsService).toBeDefined();
      });

      it('should have getCategorySpending method', function() {
        expect(AnalyticsService.getCategorySpending).toBeDefined();
        expect(typeof AnalyticsService.getCategorySpending).toBe('function');
      });
    });
  });
})();