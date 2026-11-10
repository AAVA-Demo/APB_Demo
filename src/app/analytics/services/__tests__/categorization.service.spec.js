/*
Test Documentation:
- Test Name: categorizationService - categorizeTransactions
- Purpose: Validates that categorizeTransactions ensures all transactions have a category
- Scenario: When categorizeTransactions is called with transactions, it should return categorized transactions
- Expected Result: Returns array of transactions with category property, defaulting to 'Miscellaneous' if missing
*/
/*
Test Documentation:
- Test Name: categorizationService - categorizeTransactions with missing categories
- Purpose: Validates that categorizeTransactions assigns default category to transactions without category
- Scenario: When categorizeTransactions is called with transactions missing category, it should assign 'Miscellaneous'
- Expected Result: Transactions without category are assigned 'Miscellaneous'
*/
/*
Coverage Report:
- Functions tested: categorizeTransactions
- Scenarios covered: valid categorization, missing category handling, empty array, null input, data immutability
- Edge cases: empty array, null input, undefined input, transactions without category property
- Uncovered scenarios: none
*/

describe('categorizationService', function() {
  'use strict';
  
  beforeEach(module('analyticsModule'));
  
  var categorizationService;
  
  beforeEach(inject(function(_categorizationService_) {
    categorizationService = _categorizationService_;
  }));
  
  describe('categorizeTransactions', function() {
    it('should be defined', function() {
      expect(categorizationService.categorizeTransactions).toBeDefined();
      expect(typeof categorizationService.categorizeTransactions).toBe('function');
    });
    
    it('should return an array', function() {
      var transactions = [
        {transactionId: 'txn001', amount: 1200, category: 'Food & Dining'}
      ];
      var result = categorizationService.categorizeTransactions(transactions);
      expect(Array.isArray(result)).toBe(true);
    });
    
    it('should return empty array for empty input', function() {
      var result = categorizationService.categorizeTransactions([]);
      expect(result).toEqual([]);
    });
    
    it('should return empty array for null input', function() {
      var result = categorizationService.categorizeTransactions(null);
      expect(result).toEqual([]);
    });
    
    it('should return empty array for undefined input', function() {
      var result = categorizationService.categorizeTransactions(undefined);
      expect(result).toEqual([]);
    });
    
    it('should preserve existing categories', function() {
      var transactions = [
        {transactionId: 'txn001', amount: 1200, category: 'Food & Dining'},
        {transactionId: 'txn002', amount: 850, category: 'Fuel'}
      ];
      var result = categorizationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
    });
    
    it('should assign Miscellaneous to transactions without category', function() {
      var transactions = [
        {transactionId: 'txn001', amount: 1200},
        {transactionId: 'txn002', amount: 850, category: null}
      ];
      var result = categorizationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Miscellaneous');
      expect(result[1].category).toBe('Miscellaneous');
    });
    
    it('should handle mixed categorized and uncategorized transactions', function() {
      var transactions = [
        {transactionId: 'txn001', amount: 1200, category: 'Food & Dining'},
        {transactionId: 'txn002', amount: 850},
        {transactionId: 'txn003', amount: 2500, category: 'Shopping'}
      ];
      var result = categorizationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Miscellaneous');
      expect(result[2].category).toBe('Shopping');
    });
    
    it('should preserve all transaction properties', function() {
      var transactions = [
        {transactionId: 'txn001', amount: 1200, merchantName: 'Store', category: 'Shopping', date: '2024-01-15'}
      ];
      var result = categorizationService.categorizeTransactions(transactions);
      expect(result[0].transactionId).toBe('txn001');
      expect(result[0].amount).toBe(1200);
      expect(result[0].merchantName).toBe('Store');
      expect(result[0].category).toBe('Shopping');
      expect(result[0].date).toBe('2024-01-15');
    });
    
    it('should not modify original transactions array', function() {
      var transactions = [
        {transactionId: 'txn001', amount: 1200, category: 'Food & Dining'}
      ];
      var originalCategory = transactions[0].category;
      categorizationService.categorizeTransactions(transactions);
      expect(transactions[0].category).toBe(originalCategory);
    });
    
    it('should handle all valid categories', function() {
      var transactions = [
        {transactionId: 'txn001', category: 'Food & Dining'},
        {transactionId: 'txn002', category: 'Fuel'},
        {transactionId: 'txn003', category: 'Shopping'},
        {transactionId: 'txn004', category: 'Travel'},
        {transactionId: 'txn005', category: 'Entertainment'},
        {transactionId: 'txn006', category: 'Utilities'},
        {transactionId: 'txn007', category: 'Healthcare'},
        {transactionId: 'txn008', category: 'Education'},
        {transactionId: 'txn009', category: 'Miscellaneous'}
      ];
      var result = categorizationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
      expect(result[3].category).toBe('Travel');
      expect(result[4].category).toBe('Entertainment');
      expect(result[5].category).toBe('Utilities');
      expect(result[6].category).toBe('Healthcare');
      expect(result[7].category).toBe('Education');
      expect(result[8].category).toBe('Miscellaneous');
    });
    
    it('should handle empty string category', function() {
      var transactions = [
        {transactionId: 'txn001', amount: 1200, category: ''}
      ];
      var result = categorizationService.categorizeTransactions(transactions);
      expect(result[0].category).toBe('Miscellaneous');
    });
  });
});