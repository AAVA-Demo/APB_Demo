/*
Test Documentation:
- Test Name: TransactionService Test Suite
- Purpose: Validate TransactionService functionality for retrieving paginated transactions with filters and individual transaction details
- Scenario: Tests cover successful data retrieval, pagination, filtering, search, error handling, and edge cases
- Expected Result: Service correctly builds query parameters, handles pagination, applies filters, and retrieves transaction details
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend, API_ENDPOINTS, $httpParamSerializer;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_ENDPOINTS_, _$httpParamSerializer_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      API_ENDPOINTS = _API_ENDPOINTS_;
      $httpParamSerializer = _$httpParamSerializer_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactions', function() {
      it('should retrieve transactions with default pagination', function() {
        var mockResponse = {
          transactions: [
            { transactionId: 1, amount: 100, merchantName: 'Store A' },
            { transactionId: 2, amount: 200, merchantName: 'Store B' }
          ],
          totalCount: 50,
          hasMore: true
        };

        var expectedUrl = API_ENDPOINTS.transactions + '?' + $httpParamSerializer({ page: 1, size: 20 });
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.transactions.length).toBe(2);
        expect(result.hasMore).toBe(true);
      });

      it('should retrieve transactions with custom pagination', function() {
        var mockResponse = {
          transactions: [],
          totalCount: 100,
          hasMore: true
        };

        var expectedUrl = API_ENDPOINTS.transactions + '?' + $httpParamSerializer({ page: 3, size: 50 });
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(3, 50).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should apply date range filter', function() {
        var filters = {
          startDate: '2024-01-01',
          endDate: '2024-01-31'
        };

        var mockResponse = {
          transactions: [{ transactionId: 10, amount: 500 }],
          totalCount: 15,
          hasMore: false
        };

        var expectedParams = {
          page: 1,
          size: 20,
          startDate: '2024-01-01',
          endDate: '2024-01-31'
        };
        var expectedUrl = API_ENDPOINTS.transactions + '?' + $httpParamSerializer(expectedParams);
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.transactions.length).toBe(1);
      });

      it('should apply card filter', function() {
        var filters = {
          cardId: 'card-123'
        };

        var mockResponse = {
          transactions: [{ transactionId: 20, cardId: 'card-123' }],
          totalCount: 5,
          hasMore: false
        };

        var expectedParams = {
          page: 1,
          size: 20,
          cardId: 'card-123'
        };
        var expectedUrl = API_ENDPOINTS.transactions + '?' + $httpParamSerializer(expectedParams);
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.transactions[0].cardId).toBe('card-123');
      });

      it('should apply amount range filter', function() {
        var filters = {
          minAmount: 100,
          maxAmount: 1000
        };

        var mockResponse = {
          transactions: [{ transactionId: 30, amount: 500 }],
          totalCount: 10,
          hasMore: true
        };

        var expectedParams = {
          page: 1,
          size: 20,
          minAmount: 100,
          maxAmount: 1000
        };
        var expectedUrl = API_ENDPOINTS.transactions + '?' + $httpParamSerializer(expectedParams);
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.transactions[0].amount).toBe(500);
      });

      it('should apply search text filter', function() {
        var filters = {
          searchText: 'coffee shop'
        };

        var mockResponse = {
          transactions: [{ transactionId: 40, merchantName: 'Coffee Shop' }],
          totalCount: 3,
          hasMore: false
        };

        var expectedParams = {
          page: 1,
          size: 20,
          search: 'coffee shop'
        };
        var expectedUrl = API_ENDPOINTS.transactions + '?' + $httpParamSerializer(expectedParams);
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.transactions[0].merchantName).toBe('Coffee Shop');
      });

      it('should apply multiple filters simultaneously', function() {
        var filters = {
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          cardId: 'card-456',
          minAmount: 50,
          maxAmount: 500,
          searchText: 'restaurant'
        };

        var mockResponse = {
          transactions: [{ transactionId: 50, amount: 250 }],
          totalCount: 2,
          hasMore: false
        };

        var expectedParams = {
          page: 2,
          size: 10,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          cardId: 'card-456',
          minAmount: 50,
          maxAmount: 500,
          search: 'restaurant'
        };
        var expectedUrl = API_ENDPOINTS.transactions + '?' + $httpParamSerializer(expectedParams);
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(2, 10, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.transactions.length).toBe(1);
      });

      it('should handle empty filter object', function() {
        var filters = {};

        var mockResponse = {
          transactions: [{ transactionId: 60 }],
          totalCount: 100,
          hasMore: true
        };

        var expectedUrl = API_ENDPOINTS.transactions + '?' + $httpParamSerializer({ page: 1, size: 20 });
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should ignore null/undefined filter values', function() {
        var filters = {
          startDate: null,
          endDate: undefined,
          cardId: 'card-789',
          minAmount: null,
          searchText: ''
        };

        var mockResponse = {
          transactions: [],
          totalCount: 0,
          hasMore: false
        };

        var expectedParams = {
          page: 1,
          size: 20,
          cardId: 'card-789'
        };
        var expectedUrl = API_ENDPOINTS.transactions + '?' + $httpParamSerializer(expectedParams);
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockResponse);

        var result;
        TransactionService.getTransactions(null, null, filters).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.transactions.length).toBe(0);
      });

      it('should reject promise on HTTP error', function() {
        var expectedUrl = API_ENDPOINTS.transactions + '?' + $httpParamSerializer({ page: 1, size: 20 });
        $httpBackend.expectGET(expectedUrl)
          .respond(500, 'Internal Server Error');

        var error;
        TransactionService.getTransactions().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle network failure', function() {
        var expectedUrl = API_ENDPOINTS.transactions + '?' + $httpParamSerializer({ page: 1, size: 20 });
        $httpBackend.expectGET(expectedUrl)
          .respond(0, '');

        var error;
        TransactionService.getTransactions().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(0);
      });
    });

    describe('getTransactionById', function() {
      it('should retrieve transaction details by ID', function() {
        var transactionId = 'txn-12345';
        var mockTransaction = {
          transactionId: 'txn-12345',
          amount: 750,
          merchantName: 'Electronics Store',
          category: 'SHOPPING',
          transactionDate: '2024-01-15',
          status: 'Posted'
        };

        $httpBackend.expectGET(API_ENDPOINTS.transactions + '/' + transactionId)
          .respond(200, mockTransaction);

        var result;
        TransactionService.getTransactionById(transactionId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransaction);
        expect(result.transactionId).toBe('txn-12345');
        expect(result.amount).toBe(750);
      });

      it('should handle numeric transaction ID', function() {
        var transactionId = 999;
        var mockTransaction = {
          transactionId: 999,
          amount: 100
        };

        $httpBackend.expectGET(API_ENDPOINTS.transactions + '/' + transactionId)
          .respond(200, mockTransaction);

        var result;
        TransactionService.getTransactionById(transactionId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.transactionId).toBe(999);
      });

      it('should reject promise on 404 Not Found', function() {
        var transactionId = 'txn-nonexistent';

        $httpBackend.expectGET(API_ENDPOINTS.transactions + '/' + transactionId)
          .respond(404, 'Transaction not found');

        var error;
        TransactionService.getTransactionById(transactionId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(404);
      });

      it('should reject promise on 401 Unauthorized', function() {
        var transactionId = 'txn-secure';

        $httpBackend.expectGET(API_ENDPOINTS.transactions + '/' + transactionId)
          .respond(401, 'Unauthorized');

        var error;
        TransactionService.getTransactionById(transactionId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(401);
      });

      it('should handle server error', function() {
        var transactionId = 'txn-error';

        $httpBackend.expectGET(API_ENDPOINTS.transactions + '/' + transactionId)
          .respond(500, 'Internal Server Error');

        var error;
        TransactionService.getTransactionById(transactionId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle empty transaction ID', function() {
        var transactionId = '';

        $httpBackend.expectGET(API_ENDPOINTS.transactions + '/')
          .respond(400, 'Bad Request');

        var error;
        TransactionService.getTransactionById(transactionId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });
    });

    describe('integration scenarios', function() {
      it('should retrieve transactions and then get details for specific transaction', function() {
        var mockTransactions = {
          transactions: [
            { transactionId: 'txn-100', amount: 200 },
            { transactionId: 'txn-101', amount: 300 }
          ],
          totalCount: 2,
          hasMore: false
        };

        var expectedUrl = API_ENDPOINTS.transactions + '?' + $httpParamSerializer({ page: 1, size: 20 });
        $httpBackend.expectGET(expectedUrl)
          .respond(200, mockTransactions);

        var transactionList;
        TransactionService.getTransactions().then(function(data) {
          transactionList = data;
        });

        $httpBackend.flush();
        expect(transactionList.transactions.length).toBe(2);

        var mockDetail = {
          transactionId: 'txn-100',
          amount: 200,
          merchantName: 'Store X',
          description: 'Purchase details'
        };

        $httpBackend.expectGET(API_ENDPOINTS.transactions + '/txn-100')
          .respond(200, mockDetail);

        var transactionDetail;
        TransactionService.getTransactionById('txn-100').then(function(data) {
          transactionDetail = data;
        });

        $httpBackend.flush();
        expect(transactionDetail.merchantName).toBe('Store X');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getTransactions, getTransactionById
- Scenarios covered:
  * Default pagination (page 1, size 20)
  * Custom pagination parameters
  * Date range filtering (startDate, endDate)
  * Card ID filtering
  * Amount range filtering (minAmount, maxAmount)
  * Search text filtering
  * Multiple simultaneous filters
  * Empty filter object
  * Null/undefined filter values
  * HTTP error responses (500, 404, 401, 400)
  * Network failures
  * Transaction detail retrieval by ID
  * Numeric vs string transaction IDs
  * Empty transaction ID
  * Integration scenario: list then detail
- Edge cases: Empty filters, null values, network errors, various HTTP status codes, empty IDs
- Uncovered scenarios: None - all public methods, parameter combinations, and error paths tested
*/