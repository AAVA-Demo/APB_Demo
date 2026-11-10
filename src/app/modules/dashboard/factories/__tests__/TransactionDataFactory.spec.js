/*
Test Documentation:
- Test Name: TransactionDataFactory - fetchTransactions without month parameter
- Purpose: Validates fetching all transactions without filtering
- Scenario: HTTP GET request to /api/transactions without parameters
- Expected Result: Promise resolves with all transaction data
*/
/*
Test Documentation:
- Test Name: TransactionDataFactory - fetchTransactions with month parameter
- Purpose: Validates fetching transactions filtered by month
- Scenario: HTTP GET request to /api/transactions with month parameter
- Expected Result: Promise resolves with filtered transaction data
*/
/*
Coverage Report:
- Functions tested: fetchTransactions
- Scenarios covered: fetch without parameters, fetch with month filter, error handling
- Uncovered scenarios: none
*/

describe('TransactionDataFactory', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var TransactionDataFactory, $httpBackend;
  
  beforeEach(inject(function(_TransactionDataFactory_, _$httpBackend_) {
    TransactionDataFactory = _TransactionDataFactory_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchTransactions', function() {
    it('should fetch transactions without month parameter', function() {
      var mockTransactions = [
        { transactionId: 1, amount: 100, transactionDate: '2024-01-15', cardId: 1 },
        { transactionId: 2, amount: 250, transactionDate: '2024-01-20', cardId: 2 }
      ];
      
      $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);
      
      var result;
      TransactionDataFactory.fetchTransactions().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(2);
    });
    
    it('should fetch transactions with month parameter', function() {
      var mockTransactions = [
        { transactionId: 1, amount: 100, transactionDate: '2024-01-15', cardId: 1 }
      ];
      
      $httpBackend.expectGET('/api/transactions?month=current').respond(200, mockTransactions);
      
      var result;
      TransactionDataFactory.fetchTransactions('current').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(1);
    });
    
    it('should handle API error', function() {
      $httpBackend.expectGET('/api/transactions').respond(404, 'Not Found');
      
      var errorResult;
      TransactionDataFactory.fetchTransactions().catch(function(error) {
        errorResult = error;
      });
      
      $httpBackend.flush();
      
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(404);
    });
  });
});