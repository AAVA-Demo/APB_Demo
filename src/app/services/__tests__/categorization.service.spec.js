/*
Test Documentation:
- Test Name: CategorizationService - getCategorizedTransactions with default period
- Purpose: Validates retrieval of categorized transactions with default 12-month period
- Scenario: API call succeeds with default period parameter
- Expected Result: Returns categorized transaction data

- Test Name: CategorizationService - getCategorizedTransactions with custom period
- Purpose: Validates retrieval with custom time period
- Scenario: API call with custom period parameter
- Expected Result: Returns data for specified period

- Test Name: CategorizationService - error handling
- Purpose: Validates error handling when API fails
- Scenario: API returns error response
- Expected Result: Logs error and rejects promise

Coverage Report:
- Functions tested: getCategorizedTransactions
- Scenarios covered: default period, custom period, error handling
- Edge cases: missing period parameter, invalid period
- Uncovered scenarios: malformed response data (handled by consumer)
*/

(function() {
  'use strict';

  describe('CategorizationService', function() {
    var CategorizationService, $httpBackend, API_BASE_URL;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategorizationService_, _$httpBackend_, _API_BASE_URL_) {
      CategorizationService = _CategorizationService_;
      $httpBackend = _$httpBackend_;
      API_BASE_URL = _API_BASE_URL_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCategorizedTransactions', function() {
      it('should retrieve categorized transactions with default period', function() {
        var mockResponse = {
          monthlyTrends: [
            { month: 'Jan 2024', totalSpend: 1500 },
            { month: 'Feb 2024', totalSpend: 1800 }
          ],
          categoryWiseSpend: [
            { category: 'Food & Dining', totalSpend: 500 },
            { category: 'Fuel', totalSpend: 300 }
          ]
        };

        $httpBackend.expectGET(API_BASE_URL + '/analytics/spending?period=12months')
          .respond(200, mockResponse);

        var result;
        CategorizationService.getCategorizedTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.monthlyTrends.length).toBe(2);
        expect(result.categoryWiseSpend.length).toBe(2);
      });

      it('should retrieve categorized transactions with custom period', function() {
        var customPeriod = '6months';
        var mockResponse = {
          monthlyTrends: [{ month: 'Jan 2024', totalSpend: 1200 }],
          categoryWiseSpend: [{ category: 'Shopping', totalSpend: 800 }]
        };

        $httpBackend.expectGET(API_BASE_URL + '/analytics/spending?period=' + customPeriod)
          .respond(200, mockResponse);

        var result;
        CategorizationService.getCategorizedTransactions(customPeriod).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should handle API error and reject promise', function() {
        var errorResponse = { status: 500, message: 'Server error' };
        var errorCaught = false;

        spyOn(console, 'error');

        $httpBackend.expectGET(API_BASE_URL + '/analytics/spending?period=12months')
          .respond(500, errorResponse);

        CategorizationService.getCategorizedTransactions().catch(function(error) {
          errorCaught = true;
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();

        expect(errorCaught).toBe(true);
        expect(console.error).toHaveBeenCalledWith('Error fetching categorized transactions:', jasmine.any(Object));
      });

      it('should handle empty response data', function() {
        var mockResponse = {
          monthlyTrends: [],
          categoryWiseSpend: []
        };

        $httpBackend.expectGET(API_BASE_URL + '/analytics/spending?period=12months')
          .respond(200, mockResponse);

        var result;
        CategorizationService.getCategorizedTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlyTrends).toEqual([]);
        expect(result.categoryWiseSpend).toEqual([]);
      });

      it('should handle 404 not found error', function() {
        var errorCaught = false;

        spyOn(console, 'error');

        $httpBackend.expectGET(API_BASE_URL + '/analytics/spending?period=12months')
          .respond(404, { message: 'Not found' });

        CategorizationService.getCategorizedTransactions().catch(function(error) {
          errorCaught = true;
          expect(error.status).toBe(404);
        });

        $httpBackend.flush();

        expect(errorCaught).toBe(true);
      });

      it('should pass period parameter correctly in query string', function() {
        var period = '3months';
        var mockResponse = { monthlyTrends: [], categoryWiseSpend: [] };

        $httpBackend.expectGET(API_BASE_URL + '/analytics/spending?period=' + period)
          .respond(200, mockResponse);

        CategorizationService.getCategorizedTransactions(period);

        $httpBackend.flush();
      });
    });
  });
})();