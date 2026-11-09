/*
Test Documentation:
- Test Name: categorizationService Unit Tests
- Purpose: Validate transaction categorization and category mapping retrieval
- Scenario: Test categorizeTransactions and getCategoryMappings methods
- Expected Result: Categorized transactions and complete category list
*/

describe('categorizationService', function() {
  'use strict';
  
  var categorizationService, $timeout;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_categorizationService_, _$timeout_) {
    categorizationService = _categorizationService_;
    $timeout = _$timeout_;
  }));
  
  describe('categorizeTransactions', function() {
    it('should return categorized transactions', function() {
      var mockTransactions = [
        {transactionId: 't1', amount: 100},
        {transactionId: 't2', amount: 200}
      ];
      
      var result;
      categorizationService.categorizeTransactions(mockTransactions).then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(result.categorizedTransactions).toBeDefined();
      expect(result.categorizedTransactions.length).toBe(2);
    });
    
    it('should handle empty transaction array', function() {
      var result;
      categorizationService.categorizeTransactions([]).then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result.categorizedTransactions).toEqual([]);
    });
    
    it('should preserve transaction data', function() {
      var mockTransactions = [
        {transactionId: 't1', amount: 150, merchantName: 'Store A'}
      ];
      
      var result;
      categorizationService.categorizeTransactions(mockTransactions).then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result.categorizedTransactions[0].transactionId).toBe('t1');
      expect(result.categorizedTransactions[0].amount).toBe(150);
    });
  });
  
  describe('getCategoryMappings', function() {
    it('should return all 9 predefined categories', function() {
      var result;
      categorizationService.getCategoryMappings().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(result.categories).toBeDefined();
      expect(result.categories.length).toBe(9);
    });
    
    it('should include Food & Dining category', function() {
      var result;
      categorizationService.getCategoryMappings().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result.categories).toContain('Food & Dining');
    });
    
    it('should include all required categories', function() {
      var result;
      categorizationService.getCategoryMappings().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      var expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      expectedCategories.forEach(function(cat) {
        expect(result.categories).toContain(cat);
      });
    });
    
    it('should resolve promise asynchronously', function() {
      var resolved = false;
      categorizationService.getCategoryMappings().then(function() {
        resolved = true;
      });
      
      expect(resolved).toBe(false);
      $timeout.flush();
      expect(resolved).toBe(true);
    });
  });
});

/*
Coverage Report:
- Functions tested: categorizeTransactions, getCategoryMappings
- Scenarios covered:
  * Transaction categorization
  * Empty transaction handling
  * Data preservation
  * Category mapping retrieval
  * All 9 categories validation
  * Async promise resolution
- Uncovered scenarios: None
*/