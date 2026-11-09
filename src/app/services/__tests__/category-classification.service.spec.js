/*
Test Documentation:
- Test Name: CategoryClassificationService Unit Tests
- Purpose: Validate transaction categorization and grouping logic with accurate calculations
- Scenario: Tests cover normal grouping, percentage calculations, edge cases with empty/single transactions, and data integrity
- Expected Result: Accurate category grouping with correct totals, counts, and percentages
*/

describe('CategoryClassificationService', function() {
  'use strict';

  var CategoryClassificationService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CategoryClassificationService_) {
    CategoryClassificationService = _CategoryClassificationService_;
  }));

  describe('groupByCategory', function() {
    it('should group transactions by category with correct totals', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 50 },
        { category: 'Food & Dining', amount: 30 },
        { category: 'Fuel', amount: 40 },
        { category: 'Shopping', amount: 100 }
      ];

      var result = CategoryClassificationService.groupByCategory(transactions);

      expect(result.length).toBe(3);
      var foodCategory = result.find(c => c.category === 'Food & Dining');
      expect(foodCategory.totalAmount).toBe(80);
      expect(foodCategory.transactionCount).toBe(2);
    });

    it('should calculate correct percentages for each category', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 50 },
        { category: 'Fuel', amount: 50 }
      ];

      var result = CategoryClassificationService.groupByCategory(transactions);

      result.forEach(function(cat) {
        expect(cat.percentage).toBe('50.00');
      });
    });

    it('should handle empty transaction array', function() {
      var result = CategoryClassificationService.groupByCategory([]);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle single transaction', function() {
      var transactions = [{ category: 'Travel', amount: 200 }];

      var result = CategoryClassificationService.groupByCategory(transactions);

      expect(result.length).toBe(1);
      expect(result[0].category).toBe('Travel');
      expect(result[0].totalAmount).toBe(200);
      expect(result[0].transactionCount).toBe(1);
      expect(result[0].percentage).toBe('100.00');
    });

    it('should handle all transactions in same category', function() {
      var transactions = [
        { category: 'Entertainment', amount: 25 },
        { category: 'Entertainment', amount: 35 },
        { category: 'Entertainment', amount: 40 }
      ];

      var result = CategoryClassificationService.groupByCategory(transactions);

      expect(result.length).toBe(1);
      expect(result[0].totalAmount).toBe(100);
      expect(result[0].transactionCount).toBe(3);
      expect(result[0].percentage).toBe('100.00');
    });

    it('should handle transactions with zero amounts', function() {
      var transactions = [
        { category: 'Utilities', amount: 0 },
        { category: 'Healthcare', amount: 100 }
      ];

      var result = CategoryClassificationService.groupByCategory(transactions);

      var utilities = result.find(c => c.category === 'Utilities');
      expect(utilities.totalAmount).toBe(0);
      expect(utilities.percentage).toBe('0.00');
    });

    it('should handle all nine standard categories', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 100 },
        { category: 'Fuel', amount: 100 },
        { category: 'Shopping', amount: 100 },
        { category: 'Travel', amount: 100 },
        { category: 'Entertainment', amount: 100 },
        { category: 'Utilities', amount: 100 },
        { category: 'Healthcare', amount: 100 },
        { category: 'Education', amount: 100 },
        { category: 'Miscellaneous', amount: 100 }
      ];

      var result = CategoryClassificationService.groupByCategory(transactions);

      expect(result.length).toBe(9);
      result.forEach(function(cat) {
        expect(cat.totalAmount).toBe(100);
        expect(cat.transactionCount).toBe(1);
        expect(parseFloat(cat.percentage)).toBeCloseTo(11.11, 1);
      });
    });

    it('should handle decimal amounts correctly', function() {
      var transactions = [
        { category: 'Shopping', amount: 25.50 },
        { category: 'Shopping', amount: 30.75 }
      ];

      var result = CategoryClassificationService.groupByCategory(transactions);

      expect(result[0].totalAmount).toBe(56.25);
    });

    it('should handle large transaction volumes', function() {
      var transactions = [];
      for (var i = 0; i < 1000; i++) {
        transactions.push({ category: 'Shopping', amount: 10 });
      }

      var result = CategoryClassificationService.groupByCategory(transactions);

      expect(result.length).toBe(1);
      expect(result[0].totalAmount).toBe(10000);
      expect(result[0].transactionCount).toBe(1000);
    });

    it('should not mutate original transaction array', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 50 }
      ];
      var originalLength = transactions.length;

      CategoryClassificationService.groupByCategory(transactions);

      expect(transactions.length).toBe(originalLength);
      expect(transactions[0].category).toBe('Food & Dining');
    });

    it('should handle transactions with very small amounts', function() {
      var transactions = [
        { category: 'Miscellaneous', amount: 0.01 },
        { category: 'Miscellaneous', amount: 0.02 }
      ];

      var result = CategoryClassificationService.groupByCategory(transactions);

      expect(result[0].totalAmount).toBeCloseTo(0.03, 2);
    });
  });
});

/*
Coverage Report:
- Functions tested: groupByCategory
- Scenarios covered:
  * Normal transaction grouping with multiple categories
  * Percentage calculation accuracy
  * Empty transaction array
  * Single transaction handling
  * All transactions in same category
  * Zero amount transactions
  * All nine standard categories
  * Decimal amount handling
  * Large volume processing (1000+ transactions)
  * Original data immutability
  * Very small amount precision
- Edge cases: Empty arrays, single items, zero amounts, decimal precision, large volumes
- Error scenarios: N/A (pure calculation function)
- Uncovered scenarios: None - comprehensive coverage achieved
*/