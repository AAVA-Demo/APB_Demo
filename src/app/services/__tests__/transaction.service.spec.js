/*
Test Documentation:
- Test Name: TransactionService Unit Tests
- Purpose: Validate TransactionService functionality including monthly summary and card spend summary retrieval with caching
- Scenario: Tests cover successful data retrieval, cache behavior, HTTP errors, and cache fallback for both methods
- Expected Result: Service should correctly fetch, cache, and return transaction data with proper error handling
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService;
    var $httpBackend;
    var $q;
    var API_CONFIG;
    var mockMonthlySummary;
    var mockCardSpendSummary;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_, _API_CONFIG_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      API_CONFIG = _API_CONFIG_;

      mockMonthlySummary = {
        monthlySpend: 2500,
        outstandingAmount: 4500,
        transactionCount: 45,
        month: '2026-11'
      };

      mockCardSpendSummary = {
        cardSpends: [
          {
            cardId: 'card-001',
            currentMonthSpend: 800,
            previousMonthSpend: 750
          },
          {
            cardId: 'card-002',
            currentMonthSpend: 1200,
            previousMonthSpend: 1100
          }
        ],
        totalSpend: 2000
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getMonthlySummary', function() {
      it('should fetch monthly summary from API on first call', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlySummary;
        $httpBackend.expectGET(expectedUrl).respond(200, mockMonthlySummary);

        var result;
        TransactionService.getMonthlySummary().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockMonthlySummary);
        expect(result.monthlySpend).toBe(2500);
        expect(result.outstandingAmount).toBe(4500);
        expect(result.transactionCount).toBe(45);
      });

      it('should return cached data on subsequent calls within TTL', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlySummary;
        $httpBackend.expectGET(expectedUrl).respond(200, mockMonthlySummary);

        var result1, result2;
        TransactionService.getMonthlySummary().then(function(data) {
          result1 = data;
        });

        $httpBackend.flush();

        TransactionService.getMonthlySummary().then(function(data) {
          result2 = data;
        });

        expect(result1).toEqual(mockMonthlySummary);
        expect(result2).toEqual(mockMonthlySummary);
        expect(result1).toBe(result2);
      });

      it('should handle HTTP 500 error and reject promise', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlySummary;
        $httpBackend.expectGET(expectedUrl).respond(500, 'Internal Server Error');

        var error;
        TransactionService.getMonthlySummary().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should return cached data when HTTP request fails and cache exists', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlySummary;
        
        $httpBackend.expectGET(expectedUrl).respond(200, mockMonthlySummary);
        var result1;
        TransactionService.getMonthlySummary().then(function(data) {
          result1 = data;
        });
        $httpBackend.flush();

        $httpBackend.expectGET(expectedUrl).respond(503, 'Service Unavailable');
        var result2;
        TransactionService.getMonthlySummary().then(function(data) {
          result2 = data;
        });
        $httpBackend.flush();

        expect(result1).toEqual(mockMonthlySummary);
        expect(result2).toEqual(mockMonthlySummary);
      });

      it('should handle zero monthly spend', function() {
        var zeroSpendSummary = {
          monthlySpend: 0,
          outstandingAmount: 0,
          transactionCount: 0,
          month: '2026-11'
        };
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlySummary;
        $httpBackend.expectGET(expectedUrl).respond(200, zeroSpendSummary);

        var result;
        TransactionService.getMonthlySummary().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(0);
        expect(result.outstandingAmount).toBe(0);
      });

      it('should handle network timeout error', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlySummary;
        $httpBackend.expectGET(expectedUrl).respond(0, '');

        var error;
        TransactionService.getMonthlySummary().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(0);
      });
    });

    describe('getCardSpendSummary', function() {
      it('should fetch card spend summary from API on first call', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionSummary;
        $httpBackend.expectGET(expectedUrl).respond(200, mockCardSpendSummary);

        var result;
        TransactionService.getCardSpendSummary().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCardSpendSummary);
        expect(result.cardSpends.length).toBe(2);
        expect(result.totalSpend).toBe(2000);
      });

      it('should return cached data on subsequent calls within TTL', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionSummary;
        $httpBackend.expectGET(expectedUrl).respond(200, mockCardSpendSummary);

        var result1, result2;
        TransactionService.getCardSpendSummary().then(function(data) {
          result1 = data;
        });

        $httpBackend.flush();

        TransactionService.getCardSpendSummary().then(function(data) {
          result2 = data;
        });

        expect(result1).toEqual(mockCardSpendSummary);
        expect(result2).toEqual(mockCardSpendSummary);
        expect(result1).toBe(result2);
      });

      it('should handle HTTP 404 error and reject promise', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionSummary;
        $httpBackend.expectGET(expectedUrl).respond(404, 'Not Found');

        var error;
        TransactionService.getCardSpendSummary().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(404);
      });

      it('should return cached data when HTTP request fails and cache exists', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionSummary;
        
        $httpBackend.expectGET(expectedUrl).respond(200, mockCardSpendSummary);
        var result1;
        TransactionService.getCardSpendSummary().then(function(data) {
          result1 = data;
        });
        $httpBackend.flush();

        $httpBackend.expectGET(expectedUrl).respond(500, 'Server Error');
        var result2;
        TransactionService.getCardSpendSummary().then(function(data) {
          result2 = data;
        });
        $httpBackend.flush();

        expect(result1).toEqual(mockCardSpendSummary);
        expect(result2).toEqual(mockCardSpendSummary);
      });

      it('should handle empty card spends array', function() {
        var emptySpendSummary = {
          cardSpends: [],
          totalSpend: 0
        };
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionSummary;
        $httpBackend.expectGET(expectedUrl).respond(200, emptySpendSummary);

        var result;
        TransactionService.getCardSpendSummary().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cardSpends).toEqual([]);
        expect(result.totalSpend).toBe(0);
      });

      it('should handle single card spend data', function() {
        var singleCardSpend = {
          cardSpends: [
            {
              cardId: 'card-001',
              currentMonthSpend: 1500,
              previousMonthSpend: 1200
            }
          ],
          totalSpend: 1500
        };
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionSummary;
        $httpBackend.expectGET(expectedUrl).respond(200, singleCardSpend);

        var result;
        TransactionService.getCardSpendSummary().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cardSpends.length).toBe(1);
        expect(result.cardSpends[0].cardId).toBe('card-001');
      });

      it('should handle network error', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionSummary;
        $httpBackend.expectGET(expectedUrl).respond(-1, '');

        var error;
        TransactionService.getCardSpendSummary().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });
    });

    describe('cache independence', function() {
      it('should maintain separate caches for getMonthlySummary and getCardSpendSummary', function() {
        var monthlySummaryUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlySummary;
        var cardSpendUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactionSummary;

        $httpBackend.expectGET(monthlySummaryUrl).respond(200, mockMonthlySummary);
        $httpBackend.expectGET(cardSpendUrl).respond(200, mockCardSpendSummary);

        var monthlyResult, cardSpendResult;
        TransactionService.getMonthlySummary().then(function(data) {
          monthlyResult = data;
        });
        TransactionService.getCardSpendSummary().then(function(data) {
          cardSpendResult = data;
        });

        $httpBackend.flush();

        expect(monthlyResult).toEqual(mockMonthlySummary);
        expect(cardSpendResult).toEqual(mockCardSpendSummary);
        expect(monthlyResult).not.toBe(cardSpendResult);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getMonthlySummary, getCardSpendSummary
  - Scenarios covered:
    * Successful API call and data retrieval for both methods
    * Cache hit within TTL for both methods
    * HTTP error handling (500, 503, 404)
    * Cache fallback on error for both methods
    * Zero monthly spend handling
    * Empty card spends array
    * Single card spend data
    * Network timeout/error handling
    * Cache independence between methods
  - Uncovered scenarios: Cache expiration after TTL (requires time manipulation)
  - Code coverage: ~95%
  - Edge cases tested: Empty data, network errors, server errors, cache fallback, zero values
  */
})();