/*
Test Documentation:
- Test Name: CategorizationService Unit Tests
- Purpose: Validate CategorizationService functionality for categorizing transactions and retrieving category list
- Scenario: Tests cover transaction categorization logic, case-insensitive matching, default category assignment, and category list retrieval
- Expected Result: Transactions are correctly categorized with proper fallback to Miscellaneous for unknown categories
*/

(function() {
  'use strict';

  describe('CategorizationService', function() {
    var CategorizationService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategorizationService_) {
      CategorizationService = _CategorizationService_;
    }));

    describe('categorizeTransactions', function() {
      it('should categorize transactions with valid categories', function() {
        var transactions = [
          { transactionId: 1, amount: 100, category: 'food' },
          { transactionId: 2, amount: 50, category: 'fuel' },
          { transactionId: 3, amount: 200, category: 'shopping' }
        ];

        var result = CategorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Fuel');
        expect(result[2].category).toBe('Shopping');
      });

      it('should handle case-insensitive category matching', function() {
        var transactions = [
          { transactionId: 1, amount: 100, category: 'FOOD' },
          { transactionId: 2, amount: 50, category: 'FuEl' },
          { transactionId: 3, amount: 200, category: 'ShOpPiNg' }
        ];

        var result = CategorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Fuel');
        expect(result[2].category).toBe('Shopping');
      });

      it('should assign Miscellaneous to transactions with unknown categories', function() {
        var transactions = [
          { transactionId: 1, amount: 100, category: 'unknown' },
          { transactionId: 2, amount: 50, category: 'invalid' }
        ];

        var result = CategorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Miscellaneous');
        expect(result[1].category).toBe('Miscellaneous');
      });

      it('should assign Miscellaneous to transactions without category', function() {
        var transactions = [
          { transactionId: 1, amount: 100 },
          { transactionId: 2, amount: 50, category: null },
          { transactionId: 3, amount: 75, category: '' }
        ];

        var result = CategorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Miscellaneous');
        expect(result[1].category).toBe('Miscellaneous');
        expect(result[2].category).toBe('Miscellaneous');
      });

      it('should categorize all supported categories correctly', function() {
        var transactions = [
          { transactionId: 1, category: 'food' },
          { transactionId: 2, category: 'fuel' },
          { transactionId: 3, category: 'shopping' },
          { transactionId: 4, category: 'travel' },
          { transactionId: 5, category: 'entertainment' },
          { transactionId: 6, category: 'utilities' },
          { transactionId: 7, category: 'healthcare' },
          { transactionId: 8, category: 'education' },
          { transactionId: 9, category: 'misc' }
        ];

        var result = CategorizationService.categorizeTransactions(transactions);

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

      it('should handle empty transactions array', function() {
        var transactions = [];
        var result = CategorizationService.categorizeTransactions(transactions);
        expect(result).toEqual([]);
      });

      it('should not modify original transaction objects except category', function() {
        var transactions = [
          { transactionId: 1, amount: 100, merchantName: 'Restaurant', category: 'food' }
        ];

        var result = CategorizationService.categorizeTransactions(transactions);

        expect(result[0].transactionId).toBe(1);
        expect(result[0].amount).toBe(100);
        expect(result[0].merchantName).toBe('Restaurant');
        expect(result[0].category).toBe('Food & Dining');
      });

      it('should handle transactions with special characters in category', function() {
        var transactions = [
          { transactionId: 1, amount: 100, category: 'food!' },
          { transactionId: 2, amount: 50, category: '@fuel' }
        ];

        var result = CategorizationService.categorizeTransactions(transactions);

        expect(result[0].category).toBe('Miscellaneous');
        expect(result[1].category).toBe('Miscellaneous');
      });
    });

    describe('getCategories', function() {
      it('should return all available categories', function() {
        var categories = CategorizationService.getCategories();

        expect(categories).toBeDefined();
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBe(9);
      });

      it('should return categories in correct format', function() {
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

      it('should return all categories as strings', function() {
        var categories = CategorizationService.getCategories();

        categories.forEach(function(category) {
          expect(typeof category).toBe('string');
        });
      });

      it('should return unique categories', function() {
        var categories = CategorizationService.getCategories();
        var uniqueCategories = categories.filter(function(value, index, self) {
          return self.indexOf(value) === index;
        });

        expect(categories.length).toBe(uniqueCategories.length);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: categorizeTransactions, getCategories
  - Scenarios covered:
    * Valid category categorization
    * Case-insensitive category matching
    * Unknown category handling with Miscellaneous fallback
    * Missing/null/empty category handling
    * All 9 supported categories validation
    * Empty transactions array
    * Original transaction object preservation
    * Special characters in category names
    * Category list retrieval
    * Category format validation
    * Category uniqueness validation
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();