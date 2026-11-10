/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend success
- Purpose: Validates retrieval of monthly spending data
- Scenario: HTTP GET to /api/transactions/monthly returns transaction array
- Expected Result: Promise resolves with monthly transaction data
*/
/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend handles error
- Purpose: Validates error handling when monthly spend API fails
- Scenario: HTTP GET to /api/transactions/monthly returns error
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactionsByCard success
- Purpose: Validates retrieval of transactions for a specific card
- Scenario: HTTP GET to /api/transactions/card/:cardId returns transaction array
- Expected Result: Promise resolves with card-specific transactions
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactionsByCard handles error
- Purpose: Validates error handling when card transactions API fails
- Scenario: HTTP GET to /api/transactions/card/:cardId returns error
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getMonthlySpend, getTransactionsByCard
- Scenarios covered: success responses, HTTP errors, empty data, 404 not found
- Uncovered scenarios: none
*/

describe('TransactionService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var TransactionService, $httpBackend, $rootScope;
  var API_BASE = '/api/transactions';

  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$rootScope_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getMonthlySpend', function() {
    it('should retrieve monthly spend data successfully', function(done) {
      var mockTransactions = [
        { date: '2023-01-15', amount: 100, category: 'Food & Dining' },
        { date: '2023-01-14', amount: 200, category: 'Shopping' },
        { date: '2023-01-13', amount: 60, category: 'Fuel' }
      ];

      $httpBackend.expectGET(API_BASE + '/monthly').respond(200, mockTransactions);

      TransactionService.getMonthlySpend().then(function(result) {
        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(3);
        expect(result[0].amount).toBe(100);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle HTTP error when fetching monthly spend', function(done) {
      $httpBackend.expectGET(API_BASE + '/monthly').respond(500, 'Internal Server Error');

      TransactionService.getMonthlySpend().catch(function(error) {
        expect(error.status).toBe(500);
        done();
      });

      $httpBackend.flush();
    });

    it('should return empty array when no transactions exist', function(done) {
      $httpBackend.expectGET(API_BASE + '/monthly').respond(200, []);

      TransactionService.getMonthlySpend().then(function(result) {
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle unauthorized access', function(done) {
      $httpBackend.expectGET(API_BASE + '/monthly').respond(401, 'Unauthorized');

      TransactionService.getMonthlySpend().catch(function(error) {
        expect(error.status).toBe(401);
        done();
      });

      $httpBackend.flush();
    });
  });

  describe('getTransactionsByCard', function() {
    it('should retrieve transactions by card ID successfully', function(done) {
      var mockTransactions = [
        { date: '2023-01-15', amount: 100, category: 'Food & Dining', cardId: 'card1' },
        { date: '2023-01-14', amount: 200, category: 'Shopping', cardId: 'card1' }
      ];

      $httpBackend.expectGET(API_BASE + '/card/card1').respond(200, mockTransactions);

      TransactionService.getTransactionsByCard('card1').then(function(result) {
        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('card1');
        done();
      });

      $httpBackend.flush();
    });

    it('should handle 404 when card has no transactions', function(done) {
      $httpBackend.expectGET(API_BASE + '/card/invalidCard').respond(404, 'Card not found');

      TransactionService.getTransactionsByCard('invalidCard').catch(function(error) {
        expect(error.status).toBe(404);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle server error when fetching transactions by card', function(done) {
      $httpBackend.expectGET(API_BASE + '/card/card1').respond(500, 'Internal Server Error');

      TransactionService.getTransactionsByCard('card1').catch(function(error) {
        expect(error.status).toBe(500);
        done();
      });

      $httpBackend.flush();
    });

    it('should return empty array when card has no transactions', function(done) {
      $httpBackend.expectGET(API_BASE + '/card/card1').respond(200, []);

      TransactionService.getTransactionsByCard('card1').then(function(result) {
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle network timeout', function(done) {
      $httpBackend.expectGET(API_BASE + '/card/card1').respond(-1, '');

      TransactionService.getTransactionsByCard('card1').catch(function(error) {
        expect(error.status).toBe(-1);
        done();
      });

      $httpBackend.flush();
    });
  });
});