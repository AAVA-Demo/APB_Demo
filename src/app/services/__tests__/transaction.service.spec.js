/*
Test Documentation:
- Test Name: TransactionService - getMonthlyTransactions
- Purpose: Validates that getMonthlyTransactions fetches current month transactions
- Scenario: User requests transactions for current month
- Expected Result: Returns array of transactions with transactionId, cardId, amount, category, transactionDate, merchantName
*/
/*
Test Documentation:
- Test Name: TransactionService - fetchTransactions with date range
- Purpose: Validates that fetchTransactions constructs correct query parameters for date range
- Scenario: User requests transactions with from/to dates or months parameter
- Expected Result: Makes HTTP call with correct query string
*/
/*
Test Documentation:
- Test Name: TransactionService - getCardSpending
- Purpose: Validates that getCardSpending fetches spending data for specific card
- Scenario: User requests spending details for a card
- Expected Result: Returns cardId, monthlySpend, and transactions array
*/
/*
Coverage Report:
- Functions tested: getMonthlyTransactions, fetchTransactions, getCardSpending
- Scenarios covered: API success, API failure with mock fallback, date range parameters, empty results
- Uncovered scenarios: none
*/

describe('TransactionService', function() {
  'use strict';

  var TransactionService, $httpBackend;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionService_, _$httpBackend_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getMonthlyTransactions', function() {
    it('should fetch current month transactions from API', function() {
      var mockTransactions = [
        {transactionId: 't1', cardId: 'card1', amount: 2500, category: 'Food & Dining', transactionDate: new Date(), merchantName: 'Restaurant A'}
      ];
      $httpBackend.expectGET('/api/transactions/current-month?userId=user123').respond(200, mockTransactions);

      var result;
      TransactionService.getMonthlyTransactions('user123').then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result).toEqual(mockTransactions);
    });

    it('should return mock transactions when API call fails', function() {
      $httpBackend.expectGET('/api/transactions/current-month?userId=user123').respond(500, 'Error');

      var result;
      TransactionService.getMonthlyTransactions('user123').then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result.length).toBe(4);
      expect(result[0].transactionId).toBe('t1');
    });
  });

  describe('fetchTransactions', function() {
    it('should construct query with from and to dates', function() {
      var dateRange = {from: '2024-01-01', to: '2024-01-31'};
      $httpBackend.expectGET('/api/transactions?userId=user123&from=2024-01-01&to=2024-01-31').respond(200, []);

      TransactionService.fetchTransactions('user123', dateRange);
      $httpBackend.flush();
    });

    it('should construct query with months parameter', function() {
      var dateRange = {months: 12};
      $httpBackend.expectGET('/api/transactions?userId=user123&months=12').respond(200, []);

      TransactionService.fetchTransactions('user123', dateRange);
      $httpBackend.flush();
    });

    it('should return mock transactions when API call fails', function() {
      $httpBackend.expectGET('/api/transactions?userId=user123').respond(404, 'Not Found');

      var result;
      TransactionService.fetchTransactions('user123').then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result.length).toBe(120);
      expect(result[0].transactionId).toBe('t_0_0');
    });
  });

  describe('getCardSpending', function() {
    it('should fetch card spending from API', function() {
      var mockSpending = {cardId: 'card1', monthlySpend: 12000, transactions: []};
      $httpBackend.expectGET('/api/transactions/card/card1').respond(200, mockSpending);

      var result;
      TransactionService.getCardSpending('card1').then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result).toEqual(mockSpending);
    });

    it('should return mock card spending when API call fails', function() {
      $httpBackend.expectGET('/api/transactions/card/card2').respond(500, 'Error');

      var result;
      TransactionService.getCardSpending('card2').then(function(data) {
        result = data;
      });
      $httpBackend.flush();

      expect(result.cardId).toBe('card2');
      expect(result.monthlySpend).toBe(12000);
      expect(result.transactions.length).toBe(2);
    });
  });
});