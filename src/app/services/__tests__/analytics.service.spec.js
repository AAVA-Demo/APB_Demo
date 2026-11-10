/*
Test Documentation:
- Test Name: AnalyticsService Test Suite
- Purpose: Validate AnalyticsService functionality for retrieving category spending, monthly trends, and card-wise spend data
- Scenario: Tests cover successful data retrieval, error handling, and proper promise resolution/rejection
- Expected Result: All service methods correctly interact with HTTP endpoints and handle responses/errors
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, $httpBackend, API_ENDPOINTS;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _API_ENDPOINTS_) {
      AnalyticsService = _AnalyticsService_;
      $httpBackend = _$httpBackend_;
      API_ENDPOINTS = _API_ENDPOINTS_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCategorySpending', function() {
      it('should successfully retrieve category spending data', function() {
        var mockCategoryData = [
          { category: 'FOOD', amount: 500 },
          { category: 'FUEL', amount: 300 },
          { category: 'SHOPPING', amount: 700 }
        ];

        $httpBackend.expectGET(API_ENDPOINTS.categorySpending)
          .respond(200, mockCategoryData);

        var result;
        AnalyticsService.getCategorySpending().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCategoryData);
        expect(result.length).toBe(3);
        expect(result[0].category).toBe('FOOD');
      });

      it('should handle empty category spending data', function() {
        $httpBackend.expectGET(API_ENDPOINTS.categorySpending)
          .respond(200, []);

        var result;
        AnalyticsService.getCategorySpending().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should reject promise on HTTP error', function() {
        $httpBackend.expectGET(API_ENDPOINTS.categorySpending)
          .respond(500, 'Internal Server Error');

        var error;
        AnalyticsService.getCategorySpending().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should reject promise on network failure', function() {
        $httpBackend.expectGET(API_ENDPOINTS.categorySpending)
          .respond(0, '');

        var error;
        AnalyticsService.getCategorySpending().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(0);
      });
    });

    describe('getMonthlyTrends', function() {
      it('should successfully retrieve monthly trends data', function() {
        var mockMonthlyData = [
          { month: 'January', totalSpend: 1500 },
          { month: 'February', totalSpend: 1800 },
          { month: 'March', totalSpend: 1200 }
        ];

        $httpBackend.expectGET(API_ENDPOINTS.monthlyTrends)
          .respond(200, mockMonthlyData);

        var result;
        AnalyticsService.getMonthlyTrends().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockMonthlyData);
        expect(result.length).toBe(3);
        expect(result[1].totalSpend).toBe(1800);
      });

      it('should handle empty monthly trends data', function() {
        $httpBackend.expectGET(API_ENDPOINTS.monthlyTrends)
          .respond(200, []);

        var result;
        AnalyticsService.getMonthlyTrends().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
      });

      it('should reject promise on 404 error', function() {
        $httpBackend.expectGET(API_ENDPOINTS.monthlyTrends)
          .respond(404, 'Not Found');

        var error;
        AnalyticsService.getMonthlyTrends().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(404);
      });

      it('should handle malformed response data', function() {
        $httpBackend.expectGET(API_ENDPOINTS.monthlyTrends)
          .respond(200, { invalid: 'structure' });

        var result;
        AnalyticsService.getMonthlyTrends().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual({ invalid: 'structure' });
      });
    });

    describe('getCardWiseSpend', function() {
      it('should successfully retrieve card-wise spend data', function() {
        var mockCardWiseData = [
          { cardName: 'Visa Platinum', totalSpend: 2500 },
          { cardName: 'MasterCard Gold', totalSpend: 1800 }
        ];

        $httpBackend.expectGET(API_ENDPOINTS.cardWiseSpend)
          .respond(200, mockCardWiseData);

        var result;
        AnalyticsService.getCardWiseSpend().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCardWiseData);
        expect(result.length).toBe(2);
        expect(result[0].cardName).toBe('Visa Platinum');
      });

      it('should handle single card data', function() {
        var mockSingleCard = [
          { cardName: 'Amex Blue', totalSpend: 3200 }
        ];

        $httpBackend.expectGET(API_ENDPOINTS.cardWiseSpend)
          .respond(200, mockSingleCard);

        var result;
        AnalyticsService.getCardWiseSpend().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.length).toBe(1);
        expect(result[0].totalSpend).toBe(3200);
      });

      it('should reject promise on authentication error', function() {
        $httpBackend.expectGET(API_ENDPOINTS.cardWiseSpend)
          .respond(401, 'Unauthorized');

        var error;
        AnalyticsService.getCardWiseSpend().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(401);
      });

      it('should handle timeout errors', function() {
        $httpBackend.expectGET(API_ENDPOINTS.cardWiseSpend)
          .respond(-1, '');

        var error;
        AnalyticsService.getCardWiseSpend().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getCategorySpending, getMonthlyTrends, getCardWiseSpend
- Scenarios covered:
  * Successful data retrieval for all three methods
  * Empty data handling
  * HTTP error responses (500, 404, 401)
  * Network failures
  * Malformed data handling
  * Single vs multiple records
  * Promise resolution and rejection
- Edge cases: Empty arrays, network timeouts, authentication failures
- Uncovered scenarios: None - all public methods and error paths tested
*/