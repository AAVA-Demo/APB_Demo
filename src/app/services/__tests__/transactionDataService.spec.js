/*
Test Documentation:
- Test Name: transactionDataService Unit Tests
- Purpose: Validate transaction data retrieval with date range filtering
- Scenario: Test getTransactions method with various date ranges
- Expected Result: Complete transaction list with all required fields
*/

describe('transactionDataService', function() {
  'use strict';
  
  var transactionDataService, $timeout;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_transactionDataService_, _$timeout_) {
    transactionDataService = _transactionDataService_;
    $timeout = _$timeout_;
  }));
  
  describe('getTransactions', function() {
    it('should return all mock transactions', function() {
      var result;
      transactionDataService.getTransactions({}).then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
      expect(result.transactions.length).toBe(9);
    });
    
    it('should return transactions with all required fields', function() {
      var result;
      transactionDataService.getTransactions({}).then(function(data) {
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
      expect(transaction.description).toBeDefined();
    });
    
    it('should include transactions from all 9 categories', function() {
      var result;
      transactionDataService.getTransactions({}).then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      var categories = result.transactions.map(function(t) { return t.category; });
      expect(categories).toContain('Food & Dining');
      expect(categories).toContain('Fuel');
      expect(categories).toContain('Shopping');
      expect(categories).toContain('Travel');
      expect(categories).toContain('Entertainment');
      expect(categories).toContain('Utilities');
      expect(categories).toContain('Healthcare');
      expect(categories).toContain('Education');
      expect(categories).toContain('Miscellaneous');
    });
    
    it('should include transactions from multiple cards', function() {
      var result;
      transactionDataService.getTransactions({}).then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      var cardIds = result.transactions.map(function(t) { return t.cardId; });
      expect(cardIds).toContain('card1');
      expect(cardIds).toContain('card2');
      expect(cardIds).toContain('card3');
    });
    
    it('should resolve promise asynchronously', function() {
      var resolved = false;
      transactionDataService.getTransactions({}).then(function() {
        resolved = true;
      });
      
      expect(resolved).toBe(false);
      $timeout.flush();
      expect(resolved).toBe(true);
    });
    
    it('should accept date range parameter', function() {
      var dateRange = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31')
      };
      
      var result;
      transactionDataService.getTransactions(dateRange).then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result.transactions).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered:
  * Transaction retrieval
  * Field completeness validation
  * Category coverage
  * Multi-card transactions
  * Async promise resolution
  * Date range parameter acceptance
- Uncovered scenarios: Date range filtering logic (not implemented in source)
*/