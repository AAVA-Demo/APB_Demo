/*
Test Documentation:
- Test Name: TransactionService - getTransactions success
- Purpose: Validates retrieval of transaction list with filters
- Scenario: API returns transactions matching filter criteria
- Expected Result: Promise resolves with transaction array
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions error
- Purpose: Validates error handling when transaction fetch fails
- Scenario: API returns error response
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactionById success
- Purpose: Validates retrieval of individual transaction details
- Scenario: API returns specific transaction information
- Expected Result: Promise resolves with transaction details
*/
/*
Coverage Report:
- Functions tested: getTransactions, getTransactionById
- Scenarios covered: successful retrieval, filtering, error handling, individual transaction fetch
- Edge cases: empty filters, invalid transaction IDs, API failures
- Uncovered scenarios: none
*/

describe('TransactionService', function() {
  'use strict';

  var TransactionService, $httpBackend, API_ENDPOINTS;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_ENDPOINTS_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getTransactions', function() {
    it('should return transactions when API call succeeds', function() {
      var mockTransactions = {
        transactions: [
          { transactionId: 'tx1', merchantName: 'Starbucks', amount: 5.50, category: 'Food & Dining' },
          { transactionId: 'tx2', merchantName: 'Shell', amount: 45.00, category: 'Fuel' }
        ],
        totalCount: 2
      };

      $httpBackend.expectGET(API_ENDPOINTS.transactions)
        .respond(200, mockTransactions);

      TransactionService.getTransactions().then(function(data) {
        expect(data).toEqual(mockTransactions);
        expect(data.transactions.length).toBe(2);
      });

      $httpBackend.flush();
    });

    it('should pass filter parameters to API', function() {
      var filters = {
        cardId: 'card123',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31'
      };

      var mockTransactions = { transactions: [], totalCount: 0 };

      $httpBackend.expectGET(API_ENDPOINTS.transactions + '?cardId=card123&dateFrom=2024-01-01&dateTo=2024-12-31')
        .respond(200, mockTransactions);

      TransactionService.getTransactions(filters).then(function(data) {
        expect(data).toEqual(mockTransactions);
      });

      $httpBackend.flush();
    });

    it('should handle empty filter object', function() {
      var filters = {};
      var mockTransactions = { transactions: [], totalCount: 0 };

      $httpBackend.expectGET(API_ENDPOINTS.transactions)
        .respond(200, mockTransactions);

      TransactionService.getTransactions(filters).then(function(data) {
        expect(data).toEqual(mockTransactions);
      });

      $httpBackend.flush();
    });

    it('should handle null filters parameter', function() {
      var mockTransactions = { transactions: [], totalCount: 0 };

      $httpBackend.expectGET(API_ENDPOINTS.transactions)
        .respond(200, mockTransactions);

      TransactionService.getTransactions(null).then(function(data) {
        expect(data).toEqual(mockTransactions);
      });

      $httpBackend.flush();
    });

    it('should reject promise when API call fails', function() {
      var errorResponse = { status: 500, message: 'Internal Server Error' };

      $httpBackend.expectGET(API_ENDPOINTS.transactions)
        .respond(500, errorResponse);

      TransactionService.getTransactions().catch(function(error) {
        expect(error.status).toBe(500);
        expect(error.data.message).toBe('Internal Server Error');
      });

      $httpBackend.flush();
    });

    it('should handle 401 unauthorized error', function() {
      $httpBackend.expectGET(API_ENDPOINTS.transactions)
        .respond(401, { message: 'Unauthorized' });

      TransactionService.getTransactions().catch(function(error) {
        expect(error.status).toBe(401);
      });

      $httpBackend.flush();
    });

    it('should handle empty transaction list', function() {
      var emptyResponse = { transactions: [], totalCount: 0 };

      $httpBackend.expectGET(API_ENDPOINTS.transactions)
        .respond(200, emptyResponse);

      TransactionService.getTransactions().then(function(data) {
        expect(data.transactions.length).toBe(0);
        expect(data.totalCount).toBe(0);
      });

      $httpBackend.flush();
    });

    it('should handle multiple filter parameters', function() {
      var filters = {
        cardId: 'card456',
        minAmount: 100,
        maxAmount: 500,
        category: 'Shopping'
      };

      var mockTransactions = { transactions: [], totalCount: 0 };

      $httpBackend.expectGET(API_ENDPOINTS.transactions + '?cardId=card456&category=Shopping&maxAmount=500&minAmount=100')
        .respond(200, mockTransactions);

      TransactionService.getTransactions(filters).then(function(data) {
        expect(data).toEqual(mockTransactions);
      });

      $httpBackend.flush();
    });
  });

  describe('getTransactionById', function() {
    it('should return transaction details when API call succeeds', function() {
      var transactionId = 'tx123';
      var mockTransaction = {
        transactionId: 'tx123',
        merchantName: 'Amazon',
        amount: 125.50,
        category: 'Shopping',
        timestamp: '2024-11-09T14:30:00Z',
        status: 'posted'
      };

      $httpBackend.expectGET(API_ENDPOINTS.transactions + '/' + transactionId)
        .respond(200, mockTransaction);

      TransactionService.getTransactionById(transactionId).then(function(data) {
        expect(data).toEqual(mockTransaction);
        expect(data.transactionId).toBe('tx123');
        expect(data.amount).toBe(125.50);
      });

      $httpBackend.flush();
    });

    it('should handle invalid transaction ID', function() {
      var invalidId = 'invalid-tx';

      $httpBackend.expectGET(API_ENDPOINTS.transactions + '/' + invalidId)
        .respond(404, { message: 'Transaction not found' });

      TransactionService.getTransactionById(invalidId).catch(function(error) {
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
    });

    it('should handle server error', function() {
      var transactionId = 'tx456';

      $httpBackend.expectGET(API_ENDPOINTS.transactions + '/' + transactionId)
        .respond(500, { message: 'Internal Server Error' });

      TransactionService.getTransactionById(transactionId).catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });

    it('should handle null transaction ID', function() {
      var transactionId = null;

      $httpBackend.expectGET(API_ENDPOINTS.transactions + '/' + transactionId)
        .respond(400, { message: 'Invalid transaction ID' });

      TransactionService.getTransactionById(transactionId).catch(function(error) {
        expect(error.status).toBe(400);
      });

      $httpBackend.flush();
    });

    it('should handle empty string transaction ID', function() {
      var transactionId = '';

      $httpBackend.expectGET(API_ENDPOINTS.transactions + '/' + transactionId)
        .respond(400, { message: 'Invalid transaction ID' });

      TransactionService.getTransactionById(transactionId).catch(function(error) {
        expect(error.status).toBe(400);
      });

      $httpBackend.flush();
    });
  });
});