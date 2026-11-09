/*
Test Documentation:
- Test Name: TransactionService Test Suite
- Purpose: Validate the TransactionService retrieves transactions with pagination and filtering
- Scenario: Tests getTransactions and getTransactionById with various filter combinations and error handling
- Expected Result: Service correctly calls API with pagination and filter parameters
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_CONFIG_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactions', function() {
      it('should retrieve transactions with default pagination', function() {
        var mockResponse = {
          transactions: [
            { transactionId: 'txn1', amount: 100 },
            { transactionId: 'txn2', amount: 200 }
          ],
          totalRecords: 2
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?page=1&size=20')
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should retrieve transactions with custom pagination', function() {
        var page = 2;
        var size = 50;
        var mockResponse = {
          transactions: [],
          totalRecords: 0
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?page=2&size=50')
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(page, size).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should include startDate filter when provided', function() {
        var filters = { startDate: '2023-01-01' };
        var mockResponse = { transactions: [], totalRecords: 0 };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?page=1&size=20&startDate=2023-01-01')
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should include endDate filter when provided', function() {
        var filters = { endDate: '2023-12-31' };
        var mockResponse = { transactions: [], totalRecords: 0 };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?endDate=2023-12-31&page=1&size=20')
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should include cardIds filter when provided', function() {
        var filters = { cardIds: ['card123', 'card456'] };
        var mockResponse = { transactions: [], totalRecords: 0 };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?cardIds=card123%2Ccard456&page=1&size=20')
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should not include cardIds filter when array is empty', function() {
        var filters = { cardIds: [] };
        var mockResponse = { transactions: [], totalRecords: 0 };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?page=1&size=20')
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should include minAmount filter when provided', function() {
        var filters = { minAmount: 50 };
        var mockResponse = { transactions: [], totalRecords: 0 };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?minAmount=50&page=1&size=20')
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should include maxAmount filter when provided', function() {
        var filters = { maxAmount: 500 };
        var mockResponse = { transactions: [], totalRecords: 0 };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?maxAmount=500&page=1&size=20')
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should include categories filter when provided', function() {
        var filters = { categories: ['Food & Dining', 'Fuel'] };
        var mockResponse = { transactions: [], totalRecords: 0 };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categories=Food%20%26%20Dining%2CFuel&page=1&size=20')
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should not include categories filter when array is empty', function() {
        var filters = { categories: [] };
        var mockResponse = { transactions: [], totalRecords: 0 };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?page=1&size=20')
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should include all filters when provided', function() {
        var filters = {
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          cardIds: ['card123'],
          minAmount: 10,
          maxAmount: 1000,
          categories: ['Shopping']
        };
        var mockResponse = { transactions: [], totalRecords: 0 };

        $httpBackend.expectGET(function(url) {
          return url.indexOf('startDate=2023-01-01') !== -1 &&
                 url.indexOf('endDate=2023-12-31') !== -1 &&
                 url.indexOf('cardIds=card123') !== -1 &&
                 url.indexOf('minAmount=10') !== -1 &&
                 url.indexOf('maxAmount=1000') !== -1 &&
                 url.indexOf('categories=Shopping') !== -1;
        }).respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(1, 20, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should handle API error response', function() {
        var errorResponse = { message: 'Internal Server Error' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?page=1&size=20')
          .respond(500, errorResponse);

        var error;
        TransactionService.getTransactions().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle network error', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?page=1&size=20')
          .respond(-1, '');

        var error;
        TransactionService.getTransactions().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(-1);
      });

      it('should return a promise', function() {
        var mockResponse = { transactions: [], totalRecords: 0 };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?page=1&size=20')
          .respond(200, mockResponse);

        var promise = TransactionService.getTransactions();

        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');

        $httpBackend.flush();
      });
    });

    describe('getTransactionById', function() {
      it('should retrieve transaction by ID successfully', function() {
        var transactionId = 'txn123';
        var mockTransaction = {
          transactionId: 'txn123',
          amount: 150.00,
          merchantName: 'Amazon',
          category: 'Shopping'
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId)
          .respond(200, mockTransaction);

        var result;
        TransactionService.getTransactionById(transactionId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransaction);
        expect(result.transactionId).toBe(transactionId);
      });

      it('should handle transaction not found error', function() {
        var transactionId = 'invalidTxn';
        var errorResponse = { message: 'Transaction not found' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId)
          .respond(404, errorResponse);

        var error;
        TransactionService.getTransactionById(transactionId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(404);
      });

      it('should handle unauthorized error', function() {
        var transactionId = 'txn456';
        var errorResponse = { message: 'Unauthorized' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId)
          .respond(401, errorResponse);

        var error;
        TransactionService.getTransactionById(transactionId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(401);
      });

      it('should handle server error', function() {
        var transactionId = 'txn789';
        var errorResponse = { message: 'Internal Server Error' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId)
          .respond(500, errorResponse);

        var error;
        TransactionService.getTransactionById(transactionId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle network error', function() {
        var transactionId = 'txn999';

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId)
          .respond(-1, '');

        var error;
        TransactionService.getTransactionById(transactionId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(-1);
      });

      it('should return a promise', function() {
        var transactionId = 'txn123';
        var mockTransaction = { transactionId: 'txn123', amount: 100 };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId)
          .respond(200, mockTransaction);

        var promise = TransactionService.getTransactionById(transactionId);

        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');

        $httpBackend.flush();
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getTransactions, getTransactionById
  - Scenarios covered:
    * Default pagination
    * Custom pagination
    * Individual filter parameters (startDate, endDate, cardIds, minAmount, maxAmount, categories)
    * Empty filter arrays
    * All filters combined
    * Transaction retrieval by ID
    * Transaction not found (404)
    * Unauthorized error (401)
    * Server error (500)
    * Network error
    * Promise return validation
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();