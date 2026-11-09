/*
Test Documentation:
- Test Name: AnalyticsService Test Suite
- Purpose: Validate the AnalyticsService retrieves spending analytics data with proper filtering
- Scenario: Tests API calls, parameter handling, promise resolution/rejection, and filter combinations
- Expected Result: Service correctly calls API endpoints with appropriate parameters and handles responses
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, $httpBackend, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _API_CONFIG_) {
      AnalyticsService = _AnalyticsService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getSpendingAnalytics', function() {
      it('should call API with default period when no filters provided', function() {
        var filters = {};
        var mockResponse = {
          categories: [
            { categoryName: 'Food & Dining', amount: 500 }
          ],
          totalSpend: 500
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?period=monthly')
          .respond(200, mockResponse);

        var result;
        AnalyticsService.getSpendingAnalytics(filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should call API with custom period filter', function() {
        var filters = { period: 'weekly' };
        var mockResponse = {
          categories: [],
          totalSpend: 0
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?period=weekly')
          .respond(200, mockResponse);

        var result;
        AnalyticsService.getSpendingAnalytics(filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should include categories parameter when specific categories selected', function() {
        var filters = {
          period: 'monthly',
          categories: ['Food & Dining', 'Fuel']
        };
        var mockResponse = {
          categories: [
            { categoryName: 'Food & Dining', amount: 300 },
            { categoryName: 'Fuel', amount: 150 }
          ],
          totalSpend: 450
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?categories=Food%20%26%20Dining%2CFuel&period=monthly')
          .respond(200, mockResponse);

        var result;
        AnalyticsService.getSpendingAnalytics(filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should not include categories parameter when "all" is selected', function() {
        var filters = {
          period: 'monthly',
          categories: ['all']
        };
        var mockResponse = {
          categories: [],
          totalSpend: 0
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?period=monthly')
          .respond(200, mockResponse);

        var result;
        AnalyticsService.getSpendingAnalytics(filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should include cardIds parameter when cards are filtered', function() {
        var filters = {
          period: 'monthly',
          cardIds: ['card123', 'card456']
        };
        var mockResponse = {
          categories: [
            { categoryName: 'Shopping', amount: 600 }
          ],
          totalSpend: 600
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?cardIds=card123%2Ccard456&period=monthly')
          .respond(200, mockResponse);

        var result;
        AnalyticsService.getSpendingAnalytics(filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should include both categories and cardIds when both filters provided', function() {
        var filters = {
          period: 'yearly',
          categories: ['Travel', 'Entertainment'],
          cardIds: ['card789']
        };
        var mockResponse = {
          categories: [
            { categoryName: 'Travel', amount: 1200 },
            { categoryName: 'Entertainment', amount: 400 }
          ],
          totalSpend: 1600
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?cardIds=card789&categories=Travel%2CEntertainment&period=yearly')
          .respond(200, mockResponse);

        var result;
        AnalyticsService.getSpendingAnalytics(filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should not include categories parameter when categories array is empty', function() {
        var filters = {
          period: 'monthly',
          categories: []
        };
        var mockResponse = {
          categories: [],
          totalSpend: 0
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?period=monthly')
          .respond(200, mockResponse);

        var result;
        AnalyticsService.getSpendingAnalytics(filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should not include cardIds parameter when cardIds array is empty', function() {
        var filters = {
          period: 'monthly',
          cardIds: []
        };
        var mockResponse = {
          categories: [],
          totalSpend: 0
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?period=monthly')
          .respond(200, mockResponse);

        var result;
        AnalyticsService.getSpendingAnalytics(filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should handle API error response', function() {
        var filters = { period: 'monthly' };
        var errorResponse = { message: 'Internal Server Error' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?period=monthly')
          .respond(500, errorResponse);

        var error;
        AnalyticsService.getSpendingAnalytics(filters).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle network error', function() {
        var filters = { period: 'monthly' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?period=monthly')
          .respond(-1, '');

        var error;
        AnalyticsService.getSpendingAnalytics(filters).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(-1);
      });

      it('should return a promise', function() {
        var filters = { period: 'monthly' };
        var mockResponse = { categories: [], totalSpend: 0 };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsSpending + '?period=monthly')
          .respond(200, mockResponse);

        var promise = AnalyticsService.getSpendingAnalytics(filters);

        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');

        $httpBackend.flush();
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getSpendingAnalytics
  - Scenarios covered:
    * Default period parameter
    * Custom period parameter
    * Categories filtering (specific categories)
    * Categories filtering ("all" selection)
    * CardIds filtering
    * Combined categories and cardIds filtering
    * Empty categories array
    * Empty cardIds array
    * API error response (500)
    * Network error
    * Promise return validation
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();