/*
Test Documentation:
- Test Name: CategoryClassificationService Test Suite
- Purpose: Validate category classification logic and category retrieval
- Scenario: Tests service initialization, category list retrieval, and transaction classification
- Expected Result: Service correctly returns predefined categories and classifies transactions appropriately
*/

(function() {
  'use strict';

  describe('CategoryClassificationService', function() {
    var CategoryClassificationService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategoryClassificationService_) {
      CategoryClassificationService = _CategoryClassificationService_;
    }));

    describe('getCategories', function() {
      it('should return an array of predefined categories', function() {
        var categories = CategoryClassificationService.getCategories();
        
        expect(categories).toBeDefined();
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBe(9);
      });

      it('should return all expected category names', function() {
        var categories = CategoryClassificationService.getCategories();
        
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

      it('should return the same array reference on multiple calls', function() {
        var categories1 = CategoryClassificationService.getCategories();
        var categories2 = CategoryClassificationService.getCategories();
        
        expect(categories1).toBe(categories2);
      });
    });

    describe('classifyTransaction', function() {
      it('should return the transaction category if it is valid', function() {
        var transaction = { category: 'Food & Dining', amount: 100 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Food & Dining');
      });

      it('should return Miscellaneous if transaction category is not in predefined list', function() {
        var transaction = { category: 'Unknown Category', amount: 100 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Miscellaneous');
      });

      it('should return Miscellaneous if transaction has no category', function() {
        var transaction = { amount: 100 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Miscellaneous');
      });

      it('should return Miscellaneous if transaction category is null', function() {
        var transaction = { category: null, amount: 100 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Miscellaneous');
      });

      it('should return Miscellaneous if transaction category is undefined', function() {
        var transaction = { category: undefined, amount: 100 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Miscellaneous');
      });

      it('should return Miscellaneous if transaction category is empty string', function() {
        var transaction = { category: '', amount: 100 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Miscellaneous');
      });

      it('should correctly classify Fuel category', function() {
        var transaction = { category: 'Fuel', amount: 50 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Fuel');
      });

      it('should correctly classify Shopping category', function() {
        var transaction = { category: 'Shopping', amount: 200 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Shopping');
      });

      it('should correctly classify Travel category', function() {
        var transaction = { category: 'Travel', amount: 500 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Travel');
      });

      it('should correctly classify Entertainment category', function() {
        var transaction = { category: 'Entertainment', amount: 75 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Entertainment');
      });

      it('should correctly classify Utilities category', function() {
        var transaction = { category: 'Utilities', amount: 120 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Utilities');
      });

      it('should correctly classify Healthcare category', function() {
        var transaction = { category: 'Healthcare', amount: 300 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Healthcare');
      });

      it('should correctly classify Education category', function() {
        var transaction = { category: 'Education', amount: 1000 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Education');
      });

      it('should correctly classify Miscellaneous category when explicitly set', function() {
        var transaction = { category: 'Miscellaneous', amount: 25 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Miscellaneous');
      });

      it('should be case-sensitive for category matching', function() {
        var transaction = { category: 'food & dining', amount: 100 };
        var result = CategoryClassificationService.classifyTransaction(transaction);
        
        expect(result).toBe('Miscellaneous');
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: getCategories, classifyTransaction
- Scenarios covered:
  * Retrieval of predefined category list
  * Validation of all 9 expected categories
  * Array reference consistency
  * Valid category classification
  * Invalid category handling (returns Miscellaneous)
  * Missing category handling (returns Miscellaneous)
  * Null category handling
  * Undefined category handling
  * Empty string category handling
  * Classification for all 9 predefined categories
  * Case-sensitive category matching
- Uncovered scenarios: None - comprehensive coverage achieved
*/