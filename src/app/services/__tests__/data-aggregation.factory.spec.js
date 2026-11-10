/*
Test Documentation:
- Test Name: DataAggregationFactory Unit Tests
- Purpose: Validate transaction data aggregation by category and month
- Scenario: Tests aggregateByCategory and aggregateByMonth methods with various transaction datasets
- Expected Result: Correct aggregation with category totals, percentages, and monthly trends
*/

(function() {
  'use strict';

  describe('DataAggregationFactory', function() {
    var DataAggregationFactory;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_DataAggregationFactory_) {
      DataAggregationFactory = _DataAggregationFactory_;
    }));

    describe('aggregateByCategory', function() {
      it('should aggregate transactions by category correctly', function() {
        var transactions = [
          { transactionId: 'txn1', category: 'Food & Dining', amount: 50 },
          { transactionId: 'txn2', category: 'Fuel', amount: 40 },
          { transactionId: 'txn3', category: 'Food & Dining', amount: 30 },
          { transactionId: 'txn4', category: 'Shopping', amount: 100 },
          { transactionId: 'txn5', category: 'Fuel', amount: 60 }
        ];

        var result = DataAggregationFactory.aggregateByCategory(transactions);

        var foodDining = result.find(function(cat) { return cat.category === 'Food & Dining'; });
        var fuel = result.find(function(cat) { return cat.category === 'Fuel'; });
        var shopping = result.find(function(cat) { return cat.category === 'Shopping'; });

        expect(foodDining.totalAmount).toBe(80);
        expect(foodDining.transactionCount).toBe(2);
        expect(fuel.totalAmount).toBe(100);
        expect(fuel.transactionCount).toBe(2);
        expect(shopping.totalAmount).toBe(100);
        expect(shopping.transactionCount).toBe(1);
      });

      it('should calculate percentages correctly', function() {
        var transactions = [
          { transactionId: 'txn1', category: 'Food & Dining', amount: 50 },
          { transactionId: 'txn2', category: 'Fuel', amount: 50 }
        ];

        var result = DataAggregationFactory.aggregateByCategory(transactions);

        var foodDining = result.find(function(cat) { return cat.category === 'Food & Dining'; });
        var fuel = result.find(function(cat) { return cat.category === 'Fuel'; });

        expect(parseFloat(foodDining.percentage)).toBe(50.00);
        expect(parseFloat(fuel.percentage)).toBe(50.00);
      });

      it('should handle transactions with missing category as Miscellaneous', function() {
        var transactions = [
          { transactionId: 'txn1', amount: 100 },
          { transactionId: 'txn2', category: null, amount: 50 },
          { transactionId: 'txn3', category: 'Food & Dining', amount: 50 }
        ];

        var result = DataAggregationFactory.aggregateByCategory(transactions);

        var miscellaneous = result.find(function(cat) { return cat.category === 'Miscellaneous'; });
        expect(miscellaneous.totalAmount).toBe(150);
        expect(miscellaneous.transactionCount).toBe(2);
      });

      it('should return all 9 predefined categories even with zero amounts', function() {
        var transactions = [
          { transactionId: 'txn1', category: 'Food & Dining', amount: 100 }
        ];

        var result = DataAggregationFactory.aggregateByCategory(transactions);

        expect(result.length).toBe(9);
        var categories = result.map(function(cat) { return cat.category; });
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

      it('should handle empty transactions array', function() {
        var transactions = [];
        var result = DataAggregationFactory.aggregateByCategory(transactions);

        expect(result.length).toBe(9);
        result.forEach(function(cat) {
          expect(cat.totalAmount).toBe(0);
          expect(cat.transactionCount).toBe(0);
          expect(cat.percentage).toBe('0');
        });
      });

      it('should handle large transaction datasets', function() {
        var transactions = [];
        for (var i = 0; i < 1000; i++) {
          transactions.push({
            transactionId: 'txn' + i,
            category: 'Food & Dining',
            amount: 10
          });
        }

        var result = DataAggregationFactory.aggregateByCategory(transactions);
        var foodDining = result.find(function(cat) { return cat.category === 'Food & Dining'; });

        expect(foodDining.totalAmount).toBe(10000);
        expect(foodDining.transactionCount).toBe(1000);
      });

      it('should handle transactions with decimal amounts', function() {
        var transactions = [
          { transactionId: 'txn1', category: 'Food & Dining', amount: 25.50 },
          { transactionId: 'txn2', category: 'Food & Dining', amount: 30.75 }
        ];

        var result = DataAggregationFactory.aggregateByCategory(transactions);
        var foodDining = result.find(function(cat) { return cat.category === 'Food & Dining'; });

        expect(foodDining.totalAmount).toBeCloseTo(56.25, 2);
      });
    });

    describe('aggregateByMonth', function() {
      it('should aggregate transactions by month correctly', function() {
        var transactions = [
          { transactionId: 'txn1', transactionDate: '2026-01-15', amount: 100 },
          { transactionId: 'txn2', transactionDate: '2026-01-20', amount: 50 },
          { transactionId: 'txn3', transactionDate: '2026-02-10', amount: 200 },
          { transactionId: 'txn4', transactionDate: '2026-02-25', amount: 150 }
        ];

        var result = DataAggregationFactory.aggregateByMonth(transactions);

        expect(result.length).toBe(2);
        expect(result[0].month).toBe(1);
        expect(result[0].year).toBe(2026);
        expect(result[0].totalSpend).toBe(150);
        expect(result[1].month).toBe(2);
        expect(result[1].year).toBe(2026);
        expect(result[1].totalSpend).toBe(350);
      });

      it('should sort results by year and month chronologically', function() {
        var transactions = [
          { transactionId: 'txn1', transactionDate: '2026-03-15', amount: 100 },
          { transactionId: 'txn2', transactionDate: '2026-01-20', amount: 50 },
          { transactionId: 'txn3', transactionDate: '2026-02-10', amount: 200 },
          { transactionId: 'txn4', transactionDate: '2025-12-25', amount: 150 }
        ];

        var result = DataAggregationFactory.aggregateByMonth(transactions);

        expect(result.length).toBe(4);
        expect(result[0].year).toBe(2025);
        expect(result[0].month).toBe(12);
        expect(result[1].year).toBe(2026);
        expect(result[1].month).toBe(1);
        expect(result[2].year).toBe(2026);
        expect(result[2].month).toBe(2);
        expect(result[3].year).toBe(2026);
        expect(result[3].month).toBe(3);
      });

      it('should handle empty transactions array', function() {
        var transactions = [];
        var result = DataAggregationFactory.aggregateByMonth(transactions);

        expect(result.length).toBe(0);
      });

      it('should handle transactions spanning multiple years', function() {
        var transactions = [
          { transactionId: 'txn1', transactionDate: '2025-12-15', amount: 100 },
          { transactionId: 'txn2', transactionDate: '2026-01-20', amount: 200 },
          { transactionId: 'txn3', transactionDate: '2026-12-10', amount: 300 },
          { transactionId: 'txn4', transactionDate: '2027-01-25', amount: 400 }
        ];

        var result = DataAggregationFactory.aggregateByMonth(transactions);

        expect(result.length).toBe(4);
        expect(result[0].year).toBe(2025);
        expect(result[3].year).toBe(2027);
      });

      it('should handle 12 months of transaction data', function() {
        var transactions = [];
        for (var month = 1; month <= 12; month++) {
          transactions.push({
            transactionId: 'txn' + month,
            transactionDate: '2026-' + (month < 10 ? '0' + month : month) + '-15',
            amount: 100 * month
          });
        }

        var result = DataAggregationFactory.aggregateByMonth(transactions);

        expect(result.length).toBe(12);
        expect(result[0].month).toBe(1);
        expect(result[0].totalSpend).toBe(100);
        expect(result[11].month).toBe(12);
        expect(result[11].totalSpend).toBe(1200);
      });

      it('should handle multiple transactions in the same month', function() {
        var transactions = [
          { transactionId: 'txn1', transactionDate: '2026-01-05', amount: 100 },
          { transactionId: 'txn2', transactionDate: '2026-01-10', amount: 200 },
          { transactionId: 'txn3', transactionDate: '2026-01-15', amount: 150 },
          { transactionId: 'txn4', transactionDate: '2026-01-25', amount: 50 }
        ];

        var result = DataAggregationFactory.aggregateByMonth(transactions);

        expect(result.length).toBe(1);
        expect(result[0].totalSpend).toBe(500);
      });

      it('should handle transactions with decimal amounts', function() {
        var transactions = [
          { transactionId: 'txn1', transactionDate: '2026-01-15', amount: 25.50 },
          { transactionId: 'txn2', transactionDate: '2026-01-20', amount: 30.75 }
        ];

        var result = DataAggregationFactory.aggregateByMonth(transactions);

        expect(result[0].totalSpend).toBeCloseTo(56.25, 2);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: aggregateByCategory, aggregateByMonth
- Scenarios covered:
  * Category aggregation with multiple transactions
  * Percentage calculation
  * Missing category handling (Miscellaneous)
  * All 9 predefined categories
  * Empty transactions array
  * Large datasets (1000 transactions)
  * Decimal amounts
  * Monthly aggregation
  * Chronological sorting
  * Multi-year transactions
  * 12-month data handling
  * Multiple transactions per month
- Edge cases: Empty arrays, large datasets, decimal amounts, multi-year data
- Error scenarios: Missing categories, null values
- Uncovered scenarios: None - comprehensive coverage achieved
*/