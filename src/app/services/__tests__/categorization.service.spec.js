/*
Test Documentation:
- Test Name: CategorizationService - categorizeTransactions with valid data
- Purpose: Verify service correctly categorizes transactions into predefined categories
- Scenario: Array of transactions with category property
- Expected Result: Returns object with transactions grouped by category
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorizeTransactions with missing category
- Purpose: Verify transactions without category are placed in Miscellaneous
- Scenario: Transactions with undefined or null category
- Expected Result: Transactions assigned to Miscellaneous category
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorizeTransactions with invalid category
- Purpose: Verify transactions with unknown category go to Miscellaneous
- Scenario: Transaction category not in predefined list
- Expected Result: Transaction placed in Miscellaneous bucket
*/
/*
Test Documentation:
- Test Name: CategorizationService - getCategories
- Purpose: Verify service returns complete list of valid categories
- Scenario: Call getCategories method
- Expected Result: Returns array of 9 predefined category names
*/
/*
Test Documentation:
- Test Name: CategorizationService - empty transaction array
- Purpose: Verify service handles empty input gracefully
- Scenario: Empty array passed to categorizeTransactions
- Expected Result: Returns object with empty arrays for all categories
*/
/*
Coverage Report:
- Functions tested: categorizeTransactions, getCategories
- Scenarios covered: valid categorization, missing category, invalid category, empty input, category list retrieval
- Uncovered scenarios: null input, malformed transaction objects
*/

describe('CategorizationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CategorizationService;
  
  beforeEach(inject(function(_CategorizationService_) {
    CategorizationService = _CategorizationService_;
  }));
  
  describe('categorizeTransactions', function() {
    it('should categorize transactions correctly', function() {
      var transactions = [
        { transactionId: 'tx1', category: 'Food & Dining', amount: 500 },
        { transactionId: 'tx2', category: 'Fuel', amount: 1000 },
        { transactionId: 'tx3', category: 'Food & Dining', amount: 800 },
        { transactionId: 'tx4', category: 'Shopping', amount: 2000 }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result['Food & Dining'].length).toBe(2);
      expect(result['Fuel'].length).toBe(1);
      expect(result['Shopping'].length).toBe(1);
      expect(result['Travel'].length).toBe(0);
    });
    
    it('should place transactions without category in Miscellaneous', function() {
      var transactions = [
        { transactionId: 'tx1', amount: 500 },
        { transactionId: 'tx2', category: null, amount: 600 },
        { transactionId: 'tx3', category: undefined, amount: 700 }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result['Miscellaneous'].length).toBe(3);
    });
    
    it('should place transactions with invalid category in Miscellaneous', function() {
      var transactions = [
        { transactionId: 'tx1', category: 'InvalidCategory', amount: 1000 },
        { transactionId: 'tx2', category: 'AnotherInvalid', amount: 1500 }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result['Miscellaneous'].length).toBe(2);
    });
    
    it('should handle empty transaction array', function() {
      var result = CategorizationService.categorizeTransactions([]);
      
      expect(result['Food & Dining']).toEqual([]);
      expect(result['Fuel']).toEqual([]);
      expect(result['Shopping']).toEqual([]);
      expect(result['Travel']).toEqual([]);
      expect(result['Entertainment']).toEqual([]);
      expect(result['Utilities']).toEqual([]);
      expect(result['Healthcare']).toEqual([]);
      expect(result['Education']).toEqual([]);
      expect(result['Miscellaneous']).toEqual([]);
    });
    
    it('should initialize all categories even if no transactions', function() {
      var result = CategorizationService.categorizeTransactions([]);
      var categories = CategorizationService.getCategories();
      
      categories.forEach(function(cat) {
        expect(result[cat]).toBeDefined();
        expect(Array.isArray(result[cat])).toBe(true);
      });
    });
    
    it('should handle all valid categories', function() {
      var transactions = [
        { transactionId: 'tx1', category: 'Food & Dining', amount: 100 },
        { transactionId: 'tx2', category: 'Fuel', amount: 200 },
        { transactionId: 'tx3', category: 'Shopping', amount: 300 },
        { transactionId: 'tx4', category: 'Travel', amount: 400 },
        { transactionId: 'tx5', category: 'Entertainment', amount: 500 },
        { transactionId: 'tx6', category: 'Utilities', amount: 600 },
        { transactionId: 'tx7', category: 'Healthcare', amount: 700 },
        { transactionId: 'tx8', category: 'Education', amount: 800 },
        { transactionId: 'tx9', category: 'Miscellaneous', amount: 900 }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      
      expect(result['Food & Dining'].length).toBe(1);
      expect(result['Fuel'].length).toBe(1);
      expect(result['Shopping'].length).toBe(1);
      expect(result['Travel'].length).toBe(1);
      expect(result['Entertainment'].length).toBe(1);
      expect(result['Utilities'].length).toBe(1);
      expect(result['Healthcare'].length).toBe(1);
      expect(result['Education'].length).toBe(1);
      expect(result['Miscellaneous'].length).toBe(1);
    });
    
    it('should preserve transaction properties', function() {
      var transactions = [
        {
          transactionId: 'tx1',
          category: 'Food & Dining',
          amount: 500,
          merchantName: 'Restaurant',
          date: new Date()
        }
      ];
      
      var result = CategorizationService.categorizeTransactions(transactions);
      var categorized = result['Food & Dining'][0];
      
      expect(categorized.transactionId).toBe('tx1');
      expect(categorized.amount).toBe(500);
      expect(categorized.merchantName).toBe('Restaurant');
      expect(categorized.date).toBeDefined();
    });
  });
  
  describe('getCategories', function() {
    it('should return array of all categories', function() {
      var categories = CategorizationService.getCategories();
      
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBe(9);
    });
    
    it('should return correct category names', function() {
      var categories = CategorizationService.getCategories();
      
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
    
    it('should return same reference on multiple calls', function() {
      var categories1 = CategorizationService.getCategories();
      var categories2 = CategorizationService.getCategories();
      
      expect(categories1).toBe(categories2);
    });
  });
});