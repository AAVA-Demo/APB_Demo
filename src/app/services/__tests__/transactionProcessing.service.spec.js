/*
Test Documentation:
- Test Name: TransactionProcessingService - getMonthlyData
- Purpose: Validates that getMonthlyData retrieves monthly transaction summary from API
- Scenario: Service calls monthly transactions endpoint
- Expected Result: Returns monthly transaction data object
*/
/*
Test Documentation:
- Test Name: TransactionProcessingService - getTransactions
- Purpose: Validates that getTransactions retrieves categorized transactions with optional parameters
- Scenario: Service calls transactions endpoint with query parameters
- Expected Result: Returns array of transaction objects
*/
/*
Test Documentation:
- Test Name: TransactionProcessingService - getCardTransactions
- Purpose: Validates that getCardTransactions retrieves transactions for a specific card
- Scenario: Service calls transactions endpoint with cardId parameter
- Expected Result: Returns array of card-specific transactions
*/
/*
Test Documentation:
- Test Name: TransactionProcessingService - Error Handling
- Purpose: Validates that service properly handles API errors across all methods
- Scenario: API returns various error responses
- Expected Result: Promises are rejected with appropriate error objects
*/
/*
Coverage Report:
- Functions tested: getMonthlyData, getTransactions, getCardTransactions
- Scenarios covered: successful API calls, parameter passing, default parameters, error handling
- Edge cases: empty transaction arrays, missing parameters, network failures, server errors
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TransactionProcessingService', function() {
    var TransactionProcessingService;
    var $httpBackend;
    var API_CONFIG;
    var $q;
    var $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionProcessingService_, _$httpBackend_, _API_CONFIG_, _$q_, _$rootScope_) {
      TransactionProcessingService = _TransactionProcessingService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getMonthlyData', function() {
      it('should retrieve monthly transaction summary', function() {
        var mockMonthlyData = {
          totalSpend: 3500.50,
          month: '2026-11',
          transactionCount: 45
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlyTransactions)
          .respond(200, mockMonthlyData);

        var result;
        TransactionProcessingService.getMonthlyData().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockMonthlyData);
        expect(result.totalSpend).toBe(3500.50);
        expect(result.month).toBe('2026-11');
      });

      it('should handle zero spend month', function() {
        var mockMonthlyData = {
          totalSpend: 0,
          month: '2026-12',
          transactionCount: 0
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlyTransactions)
          .respond(200, mockMonthlyData);

        var result;
        TransactionProcessingService.getMonthlyData().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.totalSpend).toBe(0);
        expect(result.transactionCount).toBe(0);
      });

      it('should reject promise on API error', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlyTransactions)
          .respond(500, {error: 'Database connection failed'});

        var errorResult;
        TransactionProcessingService.getMonthlyData().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(500);
      });

      it('should reject promise on network failure', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.monthlyTransactions)
          .respond(0, '');

        var errorResult;
        TransactionProcessingService.getMonthlyData().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(0);
      });
    });

    describe('getTransactions', function() {
      it('should retrieve categorized transactions with default parameters', function() {
        var mockTransactions = [
          {transactionId: '1', amount: 50.00, category: 'Food & Dining', date: '2026-11-01'},
          {transactionId: '2', amount: 100.00, category: 'Shopping', date: '2026-11-02'}
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true')
          .respond(200, mockTransactions);

        var result;
        TransactionProcessingService.getTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(2);
      });

      it('should retrieve transactions with custom parameters', function() {
        var customParams = {
          categorized: true,
          startDate: '2026-11-01',
          endDate: '2026-11-30'
        };

        var mockTransactions = [
          {transactionId: '3', amount: 75.50, category: 'Fuel', date: '2026-11-15'}
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true&endDate=2026-11-30&startDate=2026-11-01')
          .respond(200, mockTransactions);

        var result;
        TransactionProcessingService.getTransactions(customParams).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(1);
      });

      it('should handle empty transaction array', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true')
          .respond(200, []);

        var result;
        TransactionProcessingService.getTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should reject promise on API error', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true')
          .respond(400, {error: 'Invalid parameters'});

        var errorResult;
        TransactionProcessingService.getTransactions().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(400);
      });
    });

    describe('getCardTransactions', function() {
      it('should retrieve transactions for specific card', function() {
        var cardId = 'card123';
        var mockTransactions = [
          {transactionId: '10', cardId: 'card123', amount: 120.00, category: 'Travel', date: '2026-11-05'},
          {transactionId: '11', cardId: 'card123', amount: 45.00, category: 'Entertainment', date: '2026-11-06'}
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=card123&categorized=true')
          .respond(200, mockTransactions);

        var result;
        TransactionProcessingService.getCardTransactions(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe(cardId);
      });

      it('should handle card with no transactions', function() {
        var cardId = 'card456';

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=card456&categorized=true')
          .respond(200, []);

        var result;
        TransactionProcessingService.getCardTransactions(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should handle single transaction for card', function() {
        var cardId = 'card789';
        var mockTransactions = [
          {transactionId: '20', cardId: 'card789', amount: 500.00, category: 'Healthcare', date: '2026-11-10'}
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=card789&categorized=true')
          .respond(200, mockTransactions);

        var result;
        TransactionProcessingService.getCardTransactions(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.length).toBe(1);
        expect(result[0].amount).toBe(500.00);
      });

      it('should reject promise when card not found', function() {
        var cardId = 'invalidCard';

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=invalidCard&categorized=true')
          .respond(404, {error: 'Card not found'});

        var errorResult;
        TransactionProcessingService.getCardTransactions(cardId).catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(404);
      });

      it('should reject promise on server error', function() {
        var cardId = 'card999';

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardId=card999&categorized=true')
          .respond(500, {error: 'Internal server error'});

        var errorResult;
        TransactionProcessingService.getCardTransactions(cardId).catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(500);
      });
    });
  });
})();