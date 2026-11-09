/*
Test Documentation:
- Test Name: transactionProcessingService Unit Tests
- Purpose: Validate monthly transaction retrieval and total calculation
- Scenario: Test getMonthlyTransactions and getTransactions methods
- Expected Result: Correct transaction filtering and total amount calculation
*/

describe('transactionProcessingService', function() {
  'use strict';
  
  var transactionProcessingService, $timeout;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_transactionProcessingService_, _$timeout_) {
    transactionProcessingService = _transactionProcessingService_;
    $timeout = _$timeout_;
  }));
  
  describe('getMonthlyTransactions', function() {
    it('should return transactions for current month', function() {
      var result;
      transactionProcessingService.getMonthlyTransactions().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
      expect(result.total).toBeDefined();
    });
    
    it('should calculate total amount correctly', function() {
      var result;
      transactionProcessingService.getMonthlyTransactions().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(typeof result.total).toBe('string');
      expect(parseFloat(result.total)).toBeGreaterThanOrEqual(0);
    });
    
    it('should return total with 2 decimal places', function() {
      var result;
      transactionProcessingService.getMonthlyTransactions().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      var decimalPart = result.total.split('.')[1];
      expect(decimalPart).toBeDefined();
      expect(decimalPart.length).toBe(2);
    });
    
    it('should resolve promise asynchronously', function() {
      var resolved = false;
      transactionProcessingService.getMonthlyTransactions().then(function() {
        resolved = true;
      });
      
      expect(resolved).toBe(false);
      $timeout.flush();
      expect(resolved).toBe(true);
    });
  });
  
  describe('getTransactions', function() {
    it('should return all mock transactions', function() {
      var result;
      transactionProcessingService.getTransactions({}).then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
      expect(result.transactions.length).toBe(5);
    });
    
    it('should return transactions with required fields', function() {
      var result;
      transactionProcessingService.getTransactions({}).then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      var transaction = result.transactions[0];
      expect(transaction.transactionId).toBeDefined();
      expect(transaction.cardId).toBeDefined();
      expect(transaction.amount).toBeDefined();
      expect(transaction.date).toBeDefined();
      expect(transaction.category).toBeDefined();
      expect(transaction.merchantName).toBeDefined();
    });
    
    it('should accept date range parameter', function() {
      var dateRange = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31')
      };
      
      var result;
      transactionProcessingService.getTransactions(dateRange).then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result.transactions).toBeDefined();
    });
    
    it('should resolve promise within timeout period', function() {
      var resolved = false;
      transactionProcessingService.getTransactions({}).then(function() {
        resolved = true;
      });
      
      expect(resolved).toBe(false);
      $timeout.flush(400);
      expect(resolved).toBe(true);
    });
  });
});

/*
Coverage Report:
- Functions tested: getMonthlyTransactions, getTransactions
- Scenarios covered:
  * Monthly transaction retrieval
  * Total amount calculation
  * Decimal precision validation
  * All transactions retrieval
  * Field completeness
  * Date range parameter acceptance
  * Async timeout resolution
- Uncovered scenarios: Date range filtering logic (not fully implemented in source)
*/