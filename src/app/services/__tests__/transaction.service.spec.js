/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend success
- Purpose: Validates retrieval of monthly spending total
- Scenario: Service makes HTTP GET request to /api/transactions/monthly
- Expected Result: Returns monthly spend object with totalSpend property
*/
/*
Test Documentation:
- Test Name: TransactionService - getCardSpending success
- Purpose: Validates retrieval of spending data for specific card
- Scenario: Service makes HTTP GET request to /api/transactions/card/:cardId
- Expected Result: Returns card spending analysis object
*/
/*
Test Documentation:
- Test Name: TransactionService - fetchTransactions success
- Purpose: Validates retrieval of transactions within date range
- Scenario: Service makes HTTP GET request with date parameters
- Expected Result: Returns array of transaction objects
*/
/*
Coverage Report:
- Functions tested: getMonthlySpend, getCardSpending, fetchTransactions
- Scenarios covered: successful API calls, error handling, parameter validation
- Uncovered scenarios: none
*/

describe('TransactionService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionService, $httpBackend;
  
  beforeEach(inject(function(_TransactionService_, _$httpBackend_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getMonthlySpend', function() {
    it('should fetch monthly spend successfully', function() {
      var mockMonthlySpend = { totalSpend: 3500, transactionCount: 45 };
      
      $httpBackend.expectGET('/api/transactions/monthly').respond(200, mockMonthlySpend);
      
      var result;
      TransactionService.getMonthlySpend().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.totalSpend).toBe(3500);
      expect(result.transactionCount).toBe(45);
    });
    
    it('should handle zero monthly spend', function() {
      var mockMonthlySpend = { totalSpend: 0, transactionCount: 0 };
      
      $httpBackend.expectGET('/api/transactions/monthly').respond(200, mockMonthlySpend);
      
      var result;
      TransactionService.getMonthlySpend().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.totalSpend).toBe(0);
    });
    
    it('should handle API error', function() {
      $httpBackend.expectGET('/api/transactions/monthly').respond(500, 'Server Error');
      
      var error;
      TransactionService.getMonthlySpend().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    it('should handle network failure', function() {
      $httpBackend.expectGET('/api/transactions/monthly').respond(0, '');
      
      var error;
      TransactionService.getMonthlySpend().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
  });
  
  describe('getCardSpending', function() {
    it('should fetch card spending successfully', function() {
      var mockCardSpending = {
        monthlySpend: 1200,
        yearlySpend: 14000,
        transactionCount: 30,
        averageTransactionAmount: 40
      };
      
      $httpBackend.expectGET('/api/transactions/card/1').respond(200, mockCardSpending);
      
      var result;
      TransactionService.getCardSpending(1).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(1200);
      expect(result.yearlySpend).toBe(14000);
      expect(result.transactionCount).toBe(30);
    });
    
    it('should handle string cardId parameter', function() {
      var mockCardSpending = { monthlySpend: 500 };
      
      $httpBackend.expectGET('/api/transactions/card/2').respond(200, mockCardSpending);
      
      var result;
      TransactionService.getCardSpending('2').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
    });
    
    it('should handle card not found', function() {
      $httpBackend.expectGET('/api/transactions/card/999').respond(404, 'Card not found');
      
      var error;
      TransactionService.getCardSpending(999).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    it('should handle API error', function() {
      $httpBackend.expectGET('/api/transactions/card/1').respond(500, 'Server Error');
      
      var error;
      TransactionService.getCardSpending(1).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
  });
  
  describe('fetchTransactions', function() {
    it('should fetch transactions with date range successfully', function() {
      var mockTransactions = [
        { id: 1, date: '2024-01-15', amount: 100, description: 'Restaurant' },
        { id: 2, date: '2024-01-20', amount: 50, description: 'Gas station' }
      ];
      
      $httpBackend.expectGET('/api/transactions?start=2024-01-01&end=2024-01-31').respond(200, mockTransactions);
      
      var result;
      TransactionService.fetchTransactions('2024-01-01', '2024-01-31').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
    
    it('should handle empty transactions array', function() {
      $httpBackend.expectGET('/api/transactions?start=2024-01-01&end=2024-01-31').respond(200, []);
      
      var result;
      TransactionService.fetchTransactions('2024-01-01', '2024-01-31').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
    
    it('should handle invalid date range', function() {
      $httpBackend.expectGET('/api/transactions?start=2024-02-01&end=2024-01-01').respond(400, 'Invalid date range');
      
      var error;
      TransactionService.fetchTransactions('2024-02-01', '2024-01-01').catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    it('should handle API error', function() {
      $httpBackend.expectGET('/api/transactions?start=2024-01-01&end=2024-01-31').respond(500, 'Server Error');
      
      var error;
      TransactionService.fetchTransactions('2024-01-01', '2024-01-31').catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    it('should encode date parameters correctly', function() {
      var mockTransactions = [];
      
      $httpBackend.expectGET('/api/transactions?start=2024-01-01&end=2024-12-31').respond(200, mockTransactions);
      
      TransactionService.fetchTransactions('2024-01-01', '2024-12-31');
      
      $httpBackend.flush();
    });
    
    it('should handle network failure', function() {
      $httpBackend.expectGET('/api/transactions?start=2024-01-01&end=2024-01-31').respond(0, '');
      
      var error;
      TransactionService.fetchTransactions('2024-01-01', '2024-01-31').catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
  });
});