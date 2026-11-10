/*
Test Documentation:
- Test Name: CategoryService - categorizeTransactions
- Purpose: Validates automatic categorization of transactions without existing category
- Scenario: Service receives transactions, assigns categories to uncategorized transactions
- Expected Result: Returns transactions with all entries having a valid category from predefined list
*/
/*
Test Documentation:
- Test Name: CategoryService - categorizeTransactions with existing categories
- Purpose: Validates that transactions with existing categories are preserved
- Scenario: Service receives transactions with categories already assigned
- Expected Result: Returns transactions with original categories unchanged
*/
/*
Test Documentation:
- Test Name: CategoryService - getCategories
- Purpose: Validates retrieval of predefined category list
- Scenario: Service returns list of all supported spending categories
- Expected Result: Returns array of 9 categories: Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous
*/
/*
Coverage Report:
- Functions tested: categorizeTransactions, getCategories
- Scenarios covered: auto-categorization of uncategorized transactions, preservation of existing categories, category list retrieval, empty transaction array, mixed categorized/uncategorized transactions
- Uncovered scenarios: invalid category values, null/undefined transaction objects
*/

(function() {
  'use strict';

  describe('CategoryService', function() {
    var CategoryService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategoryService_) {
      CategoryService = _CategoryService_;
    }));

    describe('categorizeTransactions', function() {
      it('should assign categories to transactions without category', function() {
        var transactions = [
          {date: '2023-01-15', amount: 100, merchant: 'Starbucks'},
          {date: '2023-01-20', amount: 50, merchant: 'Shell Gas'},
          {date: '2023-02-10', amount: 150, merchant: 'Amazon'}
        ];

        var result = CategoryService.categorizeTransactions(transactions);

        expect(result.length).toBe(3);
        result.forEach(function(txn) {
          expect(txn.category).toBeDefined();
          expect(typeof txn.category).toBe('string');
          expect(txn.category.length).toBeGreaterThan(0);
        });
      });

      it('should preserve existing categories', function() {
        var transactions = [
          {date: '2023-01-15', amount: 100, merchant: 'Starbucks', category: 'Food & Dining'},
          {date: '2023-01-20', amount: 50, merchant: 'Shell Gas', category: 'Fuel'},
          {date: '2023-02-10', amount: 150, merchant: 'Amazon', category: 'Shopping'}
        ];

        var result = CategoryService.categorizeTransactions(transactions);

        expect(result.length).toBe(3);
        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Fuel');
        expect(result[2].category).toBe('Shopping');
      });

      it('should handle empty transactions array', function() {
        var result = CategoryService.categorizeTransactions([]);
        expect(result).toEqual([]);
      });

      it('should handle mixed categorized and uncategorized transactions', function() {
        var transactions = [
          {date: '2023-01-15', amount: 100, merchant: 'Starbucks', category: 'Food & Dining'},
          {date: '2023-01-20', amount: 50, merchant: 'Shell Gas'},
          {date: '2023-02-10', amount: 150, merchant: 'Amazon', category: 'Shopping'}
        ];

        var result = CategoryService.categorizeTransactions(transactions);

        expect(result.length).toBe(3);
        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBeDefined();
        expect(result[2].category).toBe('Shopping');
      });

      it('should assign valid categories from predefined list', function() {
        var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        var transactions = [
          {date: '2023-01-15', amount: 100, merchant: 'Test'}
        ];

        var result = CategoryService.categorizeTransactions(transactions);

        expect(validCategories).toContain(result[0].category);
      });
    });

    describe('getCategories', function() {
      it('should return array of 9 predefined categories', function() {
        var result = CategoryService.getCategories();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(9);
      });

      it('should return correct category names', function() {
        var result = CategoryService.getCategories();

        expect(result).toContain('Food & Dining');
        expect(result).toContain('Fuel');
        expect(result).toContain('Shopping');
        expect(result).toContain('Travel');
        expect(result).toContain('Entertainment');
        expect(result).toContain('Utilities');
        expect(result).toContain('Healthcare');
        expect(result).toContain('Education');
        expect(result).toContain('Miscellaneous');
      });

      it('should return same reference on multiple calls', function() {
        var result1 = CategoryService.getCategories();
        var result2 = CategoryService.getCategories();

        expect(result1).toBe(result2);
      });
    });
  });
})();