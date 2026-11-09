/*
Test Documentation:
- Test Name: TransactionDataFactory - fetchTransactions success
- Purpose: Validates retrieval of transactions with filters
- Scenario: API returns filtered transaction list
- Expected Result: Promise resolves with transaction array
*/
/*
Test Documentation:
- Test Name: TransactionDataFactory - fetchTransactions with filters
- Purpose: Validates filter parameter handling
- Scenario: Multiple filters are applied to transaction query
- Expected Result: Filters are correctly passed as query parameters
*/
/*
Test Documentation:
- Test Name: TransactionDataFactory - getTransactionById success
- Purpose: Validates retrieval of single transaction by ID
- Scenario: API returns specific transaction details
- Expected Result: Promise resolves with transaction object
*/
/*
Coverage Report:
- Functions tested: fetchTransactions, getTransactionById
- Scenarios covered: successful retrieval, filtering, error handling
- Edge cases: empty filters, invalid IDs, API failures, empty results
- Uncovered scenarios: none
*/

describe('TransactionDataFactory', function() {
  'use strict';

  var TransactionDataFactory, $httpBackend;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionDataFactory_, _$httpBackend_) {
    TransactionDataFactory = _TransactionDataFactory_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('fetchTransactions', function() {
    it('should return transactions when API call succeeds', function() {
      var mockTransactions = [
        { transactionId: 'tx1', merchantName: 'Amazon', amount: 125.50 },
        { transactionId: 'tx2', merchantName: 'Starbucks', amount: 5.75 }
      ];

      $httpBackend.expectGET('/api/transactions')
        .respond(200, mockTransactions);

      TransactionDataFactory.fetchTransactions().then(function(data) {
        expect(data).toEqual(mockTransactions);
        expect(data.length).toBe(2);
      });

      $httpBackend.flush();
    });

    it('should pass filter parameters to API', function() {
      var filters = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        cardIds: ['card1', 'card2'],
        categories: ['Shopping', 'Fuel']
      };

      var mockTransactions = [];

      $httpBackend.expectGET('/api/transactions?cardIds=card1%2Ccard2&categories=Shopping%2CFuel&endDate=2024-12-31&startDate=2024-01-01')
        .respond(200, mockTransactions);

      TransactionDataFactory.fetchTransactions(filters).then(function(data) {
        expect(data).toEqual(mockTransactions);
      });

      $httpBackend.flush();
    });

    it('should handle filters with amount range', function() {
      var filters = {
        minAmount: 100,
        maxAmount: 500
      };

      var mockTransactions = [];

      $httpBackend.expectGET('/api/transactions?maxAmount=500&minAmount=100')
        .respond(200, mockTransactions);

      TransactionDataFactory.fetchTransactions(filters).then(function(data) {
        expect(data).toEqual(mockTransactions);
      });

      $httpBackend.flush();
    });

    it('should handle filters with merchants', function() {
      var filters = {
        merchants: ['Amazon', 'Walmart']
      };

      var mockTransactions = [];

      $httpBackend.expectGET('/api/transactions?merchants=Amazon%2CWalmart')
        .respond(200, mockTransactions);

      TransactionDataFactory.fetchTransactions(filters).then(function(data) {
        expect(data).toEqual(mockTransactions);
      });

      $httpBackend.flush();
    });

    it('should handle null filters parameter', function() {
      var mockTransactions = [];

      $httpBackend.expectGET('/api/transactions')
        .respond(200, mockTransactions);

      TransactionDataFactory.fetchTransactions(null).then(function(data) {
        expect(data).toEqual(mockTransactions);
      });

      $httpBackend.flush();
    });

    it('should handle empty filters object', function() {
      var mockTransactions = [];

      $httpBackend.expectGET('/api/transactions')
        .respond(200, mockTransactions);

      TransactionDataFactory.fetchTransactions({}).then(function(data) {
        expect(data).toEqual(mockTransactions);
      });

      $httpBackend.flush();
    });

    it('should reject promise when API call fails', function() {
      $httpBackend.expectGET('/api/transactions')
        .respond(500, { message: 'Internal Server Error' });

      TransactionDataFactory.fetchTransactions().catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });

    it('should handle 401 unauthorized error', function() {
      $httpBackend.expectGET('/api/transactions')
        .respond(401, { message: 'Unauthorized' });

      TransactionDataFactory.fetchTransactions().catch(function(error) {
        expect(error.status).toBe(401);
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
        timestamp: '2024-11-09T14:30:00Z'
      };

      $httpBackend.expectGET('/api/transactions/' + transactionId)
        .respond(200, mockTransaction);

      TransactionDataFactory.getTransactionById(transactionId).then(function(data) {
        expect(data).toEqual(mockTransaction);
        expect(data.transactionId).toBe('tx123');
      });

      $httpBackend.flush();
    });

    it('should handle invalid transaction ID', function() {
      var invalidId = 'invalid-tx';

      $httpBackend.expectGET('/api/transactions/' + invalidId)
        .respond(404, { message: 'Transaction not found' });

      TransactionDataFactory.getTransactionById(invalidId).catch(function(error) {
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
    });

    it('should handle server error', function() {
      var transactionId = 'tx456';

      $httpBackend.expectGET('/api/transactions/' + transactionId)
        .respond(500, { message: 'Internal Server Error' });

      TransactionDataFactory.getTransactionById(transactionId).catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });
  });
});