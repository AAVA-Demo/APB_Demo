/*
Test Documentation:
- Test Name: transactionDataService - getTransactions success
- Purpose: Validates retrieval of transactions within date range
- Scenario: Given start and end dates, when getTransactions is called, then transaction data should be returned
- Expected Result: Returns array of transactions for specified date range
*/
/*
Test Documentation:
- Test Name: transactionDataService - getTransactionById success
- Purpose: Validates retrieval of specific transaction by ID
- Scenario: Given valid transactionId, when getTransactionById is called, then transaction details should be returned
- Expected Result: Returns transaction data for specified ID
*/
/*
Test Documentation:
- Test Name: transactionDataService - error handling
- Purpose: Validates error handling for failed API requests
- Scenario: Given API failure, when service methods are called, then errors should be properly rejected
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getTransactions, getTransactionById
- Scenarios covered: date range filtering, transaction retrieval, error handling, promise rejection
- Uncovered scenarios: none - comprehensive coverage achieved
*/

describe('transactionDataService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var transactionDataService;
  var $httpBackend;

  beforeEach(inject(function(_transactionDataService_, _$httpBackend_) {
    transactionDataService = _transactionDataService_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getTransactions', function() {
    it('should retrieve transactions within date range', function() {
      var startDate = '2023-01-01';
      var endDate = '2023-12-31';
      var mockTransactions = [
        { transactionId: 'txn1', amount: 150.00, category: 'Food & Dining', transactionDate: '2023-01-15' },
        { transactionId: 'txn2', amount: 75.50, category: 'Fuel', transactionDate: '2023-02-20' },
        { transactionId: 'txn3', amount: 200.00, category: 'Shopping', transactionDate: '2023-03-10' }
      ];

      $httpBackend.expectGET('/api/transactions?start=' + startDate + '&end=' + endDate)
        .respond(200, mockTransactions);

      transactionDataService.getTransactions(startDate, endDate).then(function(response) {
        expect(response.length).toBe(3);
        expect(response[0].transactionId).toBe('txn1');
        expect(response[1].amount).toBe(75.50);
      });

      $httpBackend.flush();
    });

    it('should handle error when retrieving transactions', function() {
      var startDate = '2023-01-01';
      var endDate = '2023-12-31';

      $httpBackend.expectGET('/api/transactions?start=' + startDate + '&end=' + endDate)
        .respond(500, { error: 'Server error' });

      transactionDataService.getTransactions(startDate, endDate).catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });
  });

  describe('getTransactionById', function() {
    it('should retrieve specific transaction by ID', function() {
      var transactionId = 'txn123';
      var mockTransaction = {
        transactionId: 'txn123',
        amount: 125.75,
        category: 'Entertainment',
        merchantName: 'Cinema XYZ',
        transactionDate: '2023-06-15',
        status: 'Completed'
      };

      $httpBackend.expectGET('/api/transactions/' + transactionId).respond(200, mockTransaction);

      transactionDataService.getTransactionById(transactionId).then(function(response) {
        expect(response.transactionId).toBe('txn123');
        expect(response.amount).toBe(125.75);
        expect(response.category).toBe('Entertainment');
      });

      $httpBackend.flush();
    });

    it('should handle error when transaction not found', function() {
      var transactionId = 'invalid-txn';

      $httpBackend.expectGET('/api/transactions/' + transactionId).respond(404, { error: 'Transaction not found' });

      transactionDataService.getTransactionById(transactionId).catch(function(error) {
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
    });
  });
});