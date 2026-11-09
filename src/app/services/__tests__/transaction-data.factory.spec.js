/*
Test Documentation:
- Test Name: TransactionDataFactory Test Suite
- Purpose: Validate the TransactionDataFactory retrieves categorized transactions correctly
- Scenario: Tests API calls with filters, parameter handling, and error scenarios
- Expected Result: Factory correctly calls API with categorized flag and optional filters
*/

(function() {
  'use strict';

  describe('TransactionDataFactory', function() {
    var TransactionDataFactory, $httpBackend, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionDataFactory_, _$httpBackend_, _API_CONFIG_) {
      TransactionDataFactory = _TransactionDataFactory_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCategorizedTransactions', function() {
      it('should retrieve categorized transactions without filters', function() {
        var mockTransactions = {
          transactions: [
            {
              transactionId: 'txn1',
              category: 'Food & Dining',
              amount: 50.00
            },
            {
              transactionId: 'txn2',
              category: 'Fuel',
              amount: 30.00
            }
          ]
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true')
          .respond(200, mockTransactions);

        var result;
        TransactionDataFactory.getCategorizedTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
      });

      it('should retrieve categorized transactions with startDate filter', function() {
        var filters = {
          startDate: '2023-01-01'
        };

        var mockTransactions = {
          transactions: [
            {
              transactionId: 'txn1',
              category: 'Shopping',
              amount: 100.00,
              transactionDate: '2023-01-15'
            }
          ]
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true&startDate=2023-01-01')
          .respond(200, mockTransactions);

        var result;
        TransactionDataFactory.getCategorizedTransactions(filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
      });

      it('should retrieve categorized transactions with endDate filter', function() {
        var filters = {
          endDate: '2023-12-31'
        };

        var mockTransactions = {
          transactions: [
            {
              transactionId: 'txn1',
              category: 'Travel',
              amount: 500.00,
              transactionDate: '2023-12-15'
            }
          ]
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true&endDate=2023-12-31')
          .respond(200, mockTransactions);

        var result;
        TransactionDataFactory.getCategorizedTransactions(filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
      });

      it('should retrieve categorized transactions with both date filters', function() {
        var filters = {
          startDate: '2023-01-01',
          endDate: '2023-12-31'
        };

        var mockTransactions = {
          transactions: [
            {
              transactionId: 'txn1',
              category: 'Entertainment',
              amount: 75.00
            }
          ]
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true&endDate=2023-12-31&startDate=2023-01-01')
          .respond(200, mockTransactions);

        var result;
        TransactionDataFactory.getCategorizedTransactions(filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
      });

      it('should handle empty filters object', function() {
        var filters = {};

        var mockTransactions = {
          transactions: []
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true')
          .respond(200, mockTransactions);

        var result;
        TransactionDataFactory.getCategorizedTransactions(filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
      });

      it('should handle null filters parameter', function() {
        var mockTransactions = {
          transactions: []
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true')
          .respond(200, mockTransactions);

        var result;
        TransactionDataFactory.getCategorizedTransactions(null).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
      });

      it('should handle undefined filters parameter', function() {
        var mockTransactions = {
          transactions: []
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true')
          .respond(200, mockTransactions);

        var result;
        TransactionDataFactory.getCategorizedTransactions(undefined).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
      });

      it('should handle API error response', function() {
        var filters = {};
        var errorResponse = { message: 'Internal Server Error' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true')
          .respond(500, errorResponse);

        var error;
        TransactionDataFactory.getCategorizedTransactions(filters).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle unauthorized error', function() {
        var filters = {};
        var errorResponse = { message: 'Unauthorized' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true')
          .respond(401, errorResponse);

        var error;
        TransactionDataFactory.getCategorizedTransactions(filters).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(401);
      });

      it('should handle network error', function() {
        var filters = {};

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true')
          .respond(-1, '');

        var error;
        TransactionDataFactory.getCategorizedTransactions(filters).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(-1);
      });

      it('should return a promise', function() {
        var filters = {};
        var mockTransactions = { transactions: [] };

        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?categorized=true')
          .respond(200, mockTransactions);

        var promise = TransactionDataFactory.getCategorizedTransactions(filters);

        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');

        $httpBackend.flush();
      });

      it('should always include categorized=true parameter', function() {
        var filters = {
          startDate: '2023-01-01'
        };

        var mockTransactions = { transactions: [] };

        $httpBackend.expectGET(function(url) {
          return url.indexOf('categorized=true') !== -1;
        }).respond(200, mockTransactions);

        TransactionDataFactory.getCategorizedTransactions(filters);

        $httpBackend.flush();
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getCategorizedTransactions
  - Scenarios covered:
    * Retrieve categorized transactions without filters
    * Retrieve with startDate filter
    * Retrieve with endDate filter
    * Retrieve with both date filters
    * Empty filters object
    * Null filters parameter
    * Undefined filters parameter
    * API error response (500)
    * Unauthorized error (401)
    * Network error
    * Promise return validation
    * Categorized parameter always included
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();