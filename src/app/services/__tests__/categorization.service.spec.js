/*
Test Documentation:
- Test Name: CategorizationService - categorize transactions
- Purpose: Validates transaction categorization across predefined categories
- Scenario: Multiple transactions with different categories
- Expected Result: Transactions grouped by category with totals and percentages
*/
/*
Test Documentation:
- Test Name: CategorizationService - handle missing category
- Purpose: Validates fallback to Miscellaneous for uncategorized transactions
- Scenario: Transaction without category field
- Expected Result: Transaction assigned to Miscellaneous category
*/
/*
Test Documentation:
- Test Name: CategorizationService - calculate percentages correctly
- Purpose: Validates percentage calculation for each category
- Scenario: Transactions with varying amounts
- Expected Result: Percentages sum to 100% and are calculated correctly
*/
/*
Coverage Report:
- Functions tested: categorize
- Scenarios covered: multi-category transactions, missing categories, percentage calculation, empty transactions
- Uncovered scenarios: invalid transaction amounts, null transactions
*/

(function() {
  'use strict';

  describe('CategorizationService', function() {
    var CategorizationService, CATEGORY_CONSTANTS;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategorizationService_, _CATEGORY_CONSTANTS_) {
      CategorizationService = _CategorizationService_;
      CATEGORY_CONSTANTS = _CATEGORY_CONSTANTS_;
    }));

    describe('categorize', function() {
      it('should categorize transactions correctly', function() {
        var transactions = [
          { transactionId: 't1', amount: 50.00, category: 'Food & Dining' },
          { transactionId: 't2', amount: 60.00, category: 'Fuel' },
          { transactionId: 't3', amount: 100.00, category: 'Shopping' },
          { transactionId: 't4', amount: 40.00, category: 'Food & Dining' }
        ];

        var result = CategorizationService.categorize(transactions);

        expect(result).toBeDefined();
        expect(result.totalSpend).toBe(250.00);
        expect(result.categories).toBeDefined();
        expect(result.categories.length).toBe(CATEGORY_CONSTANTS.length);

        var foodCategory = result.categories.find(function(cat) { return cat.categoryName === 'Food & Dining'; });
        expect(foodCategory.totalSpend).toBe(90.00);
        expect(foodCategory.transactionCount).toBe(2);
        expect(foodCategory.percentageOfTotal).toBe('36.00');

        var fuelCategory = result.categories.find(function(cat) { return cat.categoryName === 'Fuel'; });
        expect(fuelCategory.totalSpend).toBe(60.00);
        expect(fuelCategory.percentageOfTotal).toBe('24.00');
      });

      it('should handle transactions without category', function() {
        var transactions = [
          { transactionId: 't1', amount: 50.00 },
          { transactionId: 't2', amount: 30.00, category: null }
        ];

        var result = CategorizationService.categorize(transactions);

        var miscCategory = result.categories.find(function(cat) { return cat.categoryName === 'Miscellaneous'; });
        expect(miscCategory.totalSpend).toBe(80.00);
        expect(miscCategory.transactionCount).toBe(2);
      });

      it('should handle invalid category names', function() {
        var transactions = [
          { transactionId: 't1', amount: 100.00, category: 'InvalidCategory' }
        ];

        var result = CategorizationService.categorize(transactions);

        var miscCategory = result.categories.find(function(cat) { return cat.categoryName === 'Miscellaneous'; });
        expect(miscCategory.totalSpend).toBe(100.00);
        expect(miscCategory.transactionCount).toBe(1);
      });

      it('should initialize all predefined categories', function() {
        var transactions = [];

        var result = CategorizationService.categorize(transactions);

        expect(result.categories.length).toBe(CATEGORY_CONSTANTS.length);
        result.categories.forEach(function(cat) {
          expect(cat.totalSpend).toBe(0);
          expect(cat.transactionCount).toBe(0);
          expect(cat.transactions.length).toBe(0);
        });
      });

      it('should calculate percentages correctly', function() {
        var transactions = [
          { transactionId: 't1', amount: 100.00, category: 'Food & Dining' },
          { transactionId: 't2', amount: 200.00, category: 'Shopping' },
          { transactionId: 't3', amount: 200.00, category: 'Travel' }
        ];

        var result = CategorizationService.categorize(transactions);

        expect(result.totalSpend).toBe(500.00);

        var foodCategory = result.categories.find(function(cat) { return cat.categoryName === 'Food & Dining'; });
        expect(foodCategory.percentageOfTotal).toBe('20.00');

        var shoppingCategory = result.categories.find(function(cat) { return cat.categoryName === 'Shopping'; });
        expect(shoppingCategory.percentageOfTotal).toBe('40.00');

        var travelCategory = result.categories.find(function(cat) { return cat.categoryName === 'Travel'; });
        expect(travelCategory.percentageOfTotal).toBe('40.00');
      });

      it('should handle empty transactions array', function() {
        var transactions = [];

        var result = CategorizationService.categorize(transactions);

        expect(result.totalSpend).toBe(0);
        expect(result.categories.length).toBe(CATEGORY_CONSTANTS.length);
      });

      it('should store transactions in respective categories', function() {
        var transactions = [
          { transactionId: 't1', amount: 50.00, category: 'Food & Dining' },
          { transactionId: 't2', amount: 60.00, category: 'Food & Dining' }
        ];

        var result = CategorizationService.categorize(transactions);

        var foodCategory = result.categories.find(function(cat) { return cat.categoryName === 'Food & Dining'; });
        expect(foodCategory.transactions.length).toBe(2);
        expect(foodCategory.transactions[0].transactionId).toBe('t1');
        expect(foodCategory.transactions[1].transactionId).toBe('t2');
      });
    });
  });
})();