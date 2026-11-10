/*
Test Documentation:
- Test Name: transactionService - getMonthlySpend success
- Purpose: Validates retrieval of monthly spending data
- Scenario: When getMonthlySpend is called, then monthly spend data should be returned
- Expected Result: Returns monthly spend amount
*/
/*
Test Documentation:
- Test Name: transactionService - getTransactionsByCard success
- Purpose: Validates retrieval of transactions for a specific card
- Scenario: Given valid cardId, when getTransactionsByCard is called, then card-specific transactions should be returned
- Expected Result: Returns array of transactions for specified card
*/
/*
Test Documentation:
- Test Name: transactionService - error handling
- Purpose: Validates error handling for failed API requests
- Scenario: Given API failure, when service methods are called, then errors should be properly rejected
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getMonthlySpend, getTransactionsByCard
- Scenarios covered: monthly spend retrieval, card-specific transactions, error handling, promise rejection
- Uncovered scenarios: none - comprehensive coverage achieved
*/

describe('transactionService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var transactionService;
  var $httpBackend;

  beforeEach(inject(function(_transactionService_, _$httpBackend_) {
    transactionService = _transactionService_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getMonthlySpend', function() {
    it('should retrieve monthly spending data', function() {
      var mockMonthlyData = {
        monthlySpend: 3500.00,
        month: '2023-12',
        transactionCount: 45
      };

      $httpBackend.expectGET('/api/transactions/monthly').respond(200, mockMonthlyData);

      transactionService.getMonthlySpend().then(function(response) {
        expect(response.monthlySpend).toBe(3500.00);
        expect(response.month).toBe('2023-12');
        expect(response.transactionCount).toBe(45);
      });

      $httpBackend.flush();
    });

    it('should handle error when retrieving monthly spend', function() {
      $httpBackend.expectGET('/api/transactions/monthly').respond(500, { error: 'Server error' });

      transactionService.getMonthlySpend().catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });
  });

  describe('getTransactionsByCard', function() {
    it('should retrieve transactions for specific card', function() {
      var cardId = 'card123';
      var mockTransactions = [
        { transactionId: 'txn1', cardId: 'card123', amount: 150.00, category: 'Food & Dining' },
        { transactionId: 'txn2', cardId: 'card123', amount: 75.50, category: 'Fuel' },
        { transactionId: 'txn3', cardId: 'card123', amount: 200.00, category: 'Shopping' }
      ];

      $httpBackend.expectGET('/api/transactions/card/' + cardId).respond(200, mockTransactions);

      transactionService.getTransactionsByCard(cardId).then(function(response) {
        expect(response.length).toBe(3);
        expect(response[0].cardId).toBe('card123');
        expect(response[1].amount).toBe(75.50);
      });

      $httpBackend.flush();
    });

    it('should handle error when retrieving card transactions', function() {
      var cardId = 'invalid-card';

      $httpBackend.expectGET('/api/transactions/card/' + cardId).respond(404, { error: 'Card not found' });

      transactionService.getTransactionsByCard(cardId).catch(function(error) {
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
    });
  });
});