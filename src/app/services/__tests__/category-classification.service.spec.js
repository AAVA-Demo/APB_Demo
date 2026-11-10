/*
Test Documentation:
- Test Name: CategoryClassificationService Test Suite
- Purpose: Validate category classification and categorization logic for transactions
- Scenario: Tests categorization of transactions into predefined categories
- Expected Result: All transactions are properly categorized with fallback to Miscellaneous
*/

(function() {
  'use strict';

  describe('CategoryClassificationService', function() {
    var CategoryClassificationService, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategoryClassificationService_, _$rootScope_) {
      CategoryClassificationService = _CategoryClassificationService_;
      $rootScope = _$rootScope_;
    }));

    describe('ensureCategorization', function() {
      it('should preserve valid categories for transactions', function() {
        var transactions = [
          { transactionId: 'txn-001', category: 'Food & Dining', amount: 100 },
          { transactionId: 'txn-002', category: 'Fuel', amount: 50 },
          { transactionId: 'txn-003', category: 'Shopping', amount: 200 }
        ];

        var result;
        CategoryClassificationService.ensureCategorization(transactions).then(function(categorized) {
          result = categorized;
        });
        $rootScope.$digest();

        expect(result.length).toBe(3);
        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Fuel');
        expect(result[2].category).toBe('Shopping');
      });

      it('should categorize transactions without category as Miscellaneous', function() {
        var transactions = [
          { transactionId: 'txn-001', amount: 100 },
          { transactionId: 'txn-002', category: null, amount: 50 }
        ];

        var result;
        CategoryClassificationService.ensureCategorization(transactions).then(function(categorized) {
          result = categorized;
        });
        $rootScope.$digest();

        expect(result.length).toBe(2);
        expect(result[0].category).toBe('Miscellaneous');
        expect(result[1].category).toBe('Miscellaneous');
      });

      it('should categorize transactions with invalid category as Miscellaneous', function() {
        var transactions = [
          { transactionId: 'txn-001', category: 'InvalidCategory', amount: 100 },
          { transactionId: 'txn-002', category: 'AnotherInvalid', amount: 50 }
        ];

        var result;
        CategoryClassificationService.ensureCategorization(transactions).then(function(categorized) {
          result = categorized;
        });
        $rootScope.$digest();

        expect(result.length).toBe(2);
        expect(result[0].category).toBe('Miscellaneous');
        expect(result[1].category).toBe('Miscellaneous');
      });

      it('should handle all valid categories correctly', function() {
        var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        var transactions = validCategories.map(function(cat, index) {
          return { transactionId: 'txn-' + index, category: cat, amount: 100 };
        });

        var result;
        CategoryClassificationService.ensureCategorization(transactions).then(function(categorized) {
          result = categorized;
        });
        $rootScope.$digest();

        expect(result.length).toBe(9);
        result.forEach(function(txn, index) {
          expect(txn.category).toBe(validCategories[index]);
        });
      });

      it('should return empty array for empty transaction list', function() {
        var result;
        CategoryClassificationService.ensureCategorization([]).then(function(categorized) {
          result = categorized;
        });
        $rootScope.$digest();

        expect(result.length).toBe(0);
      });
    });

    describe('getCategories', function() {
      it('should return all predefined categories', function() {
        var categories = CategoryClassificationService.getCategories();

        expect(categories.length).toBe(9);
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
  });

})();

/*
Coverage Report:
- Functions tested: ensureCategorization, getCategories
- Scenarios covered:
  * Valid category preservation
  * Missing category handling
  * Invalid category handling
  * All 9 predefined categories validation
  * Empty transaction list
  * Category list retrieval
- Uncovered scenarios: None - comprehensive coverage achieved
*/