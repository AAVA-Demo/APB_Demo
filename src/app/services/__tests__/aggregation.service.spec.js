/*
Test Documentation:
- Test Name: AggregationService - aggregateByCategory
- Purpose: Validates that transactions are correctly aggregated by category with amounts, percentages, and counts
- Scenario: Multiple transactions with different categories
- Expected Result: Returns array of category objects with correct totals and percentages
*/
/*
Test Documentation:
- Test Name: AggregationService - aggregateByMonth
- Purpose: Validates that transactions are correctly aggregated by month
- Scenario: Transactions spanning multiple months
- Expected Result: Returns sorted array of monthly aggregations
*/
/*
Coverage Report:
- Functions tested: aggregateByCategory, aggregateByMonth
- Scenarios covered: normal aggregation, empty transactions, null amounts, date parsing, sorting
- Uncovered scenarios: none
*/

describe('AggregationService', function() {
  'use strict';

  beforeEach(module('app.analytics'));

  var AggregationService;

  beforeEach(inject(function(_AggregationService_) {
    AggregationService = _AggregationService_;
  }));

  describe('aggregateByCategory', function() {
    it('should aggregate transactions by category with correct amounts and counts', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 50 },
        { category: 'Food & Dining', amount: 30 },
        { category: 'Fuel', amount: 100 },
        { category: 'Shopping', amount: 200 }
      ];

      var result = AggregationService.aggregateByCategory(transactions);

      expect(result.length).toBe(3);
      var foodCategory = result.find(function(cat) { return cat.categoryName === 'Food & Dining'; });
      expect(foodCategory.amount).toBe(80);
      expect(foodCategory.transactionCount).toBe(2);
      expect(parseFloat(foodCategory.percentage)).toBeCloseTo(21.05, 1);
    });

    it('should handle transactions without category by defaulting to Miscellaneous', function() {
      var transactions = [
        { amount: 50 },
        { category: null, amount: 30 }
      ];

      var result = AggregationService.aggregateByCategory(transactions);

      expect(result.length).toBe(1);
      expect(result[0].categoryName).toBe('Miscellaneous');
      expect(result[0].amount).toBe(80);
      expect(result[0].transactionCount).toBe(2);
    });

    it('should handle empty transactions array', function() {
      var result = AggregationService.aggregateByCategory([]);

      expect(result).toEqual([]);
    });

    it('should handle transactions with null or undefined amounts', function() {
      var transactions = [
        { category: 'Food & Dining', amount: null },
        { category: 'Food & Dining', amount: undefined },
        { category: 'Food & Dining', amount: 50 }
      ];

      var result = AggregationService.aggregateByCategory(transactions);

      expect(result.length).toBe(1);
      expect(result[0].amount).toBe(50);
      expect(result[0].transactionCount).toBe(3);
    });

    it('should calculate percentage as 0 when total amount is 0', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 0 },
        { category: 'Fuel', amount: 0 }
      ];

      var result = AggregationService.aggregateByCategory(transactions);

      result.forEach(function(cat) {
        expect(parseFloat(cat.percentage)).toBe(0);
      });
    });
  });

  describe('aggregateByMonth', function() {
    it('should aggregate transactions by month with correct amounts', function() {
      var transactions = [
        { date: '2023-01-15', amount: 100 },
        { date: '2023-01-20', amount: 50 },
        { date: '2023-02-10', amount: 200 },
        { date: '2023-03-05', amount: 150 }
      ];

      var result = AggregationService.aggregateByMonth(transactions);

      expect(result.length).toBe(3);
      expect(result[0].month).toBe('2023-01');
      expect(result[0].amount).toBe(150);
      expect(result[1].month).toBe('2023-02');
      expect(result[1].amount).toBe(200);
      expect(result[2].month).toBe('2023-03');
      expect(result[2].amount).toBe(150);
    });

    it('should return results sorted by month in ascending order', function() {
      var transactions = [
        { date: '2023-03-15', amount: 100 },
        { date: '2023-01-20', amount: 50 },
        { date: '2023-02-10', amount: 200 }
      ];

      var result = AggregationService.aggregateByMonth(transactions);

      expect(result[0].month).toBe('2023-01');
      expect(result[1].month).toBe('2023-02');
      expect(result[2].month).toBe('2023-03');
    });

    it('should handle empty transactions array', function() {
      var result = AggregationService.aggregateByMonth([]);

      expect(result).toEqual([]);
    });

    it('should skip transactions without date', function() {
      var transactions = [
        { date: '2023-01-15', amount: 100 },
        { amount: 50 },
        { date: null, amount: 75 }
      ];

      var result = AggregationService.aggregateByMonth(transactions);

      expect(result.length).toBe(1);
      expect(result[0].amount).toBe(100);
    });

    it('should handle transactions with null or undefined amounts', function() {
      var transactions = [
        { date: '2023-01-15', amount: null },
        { date: '2023-01-20', amount: undefined },
        { date: '2023-01-25', amount: 100 }
      ];

      var result = AggregationService.aggregateByMonth(transactions);

      expect(result.length).toBe(1);
      expect(result[0].amount).toBe(100);
    });

    it('should format month with leading zero for single-digit months', function() {
      var transactions = [
        { date: '2023-03-15', amount: 100 },
        { date: '2023-11-20', amount: 50 }
      ];

      var result = AggregationService.aggregateByMonth(transactions);

      expect(result[0].month).toBe('2023-03');
      expect(result[1].month).toBe('2023-11');
    });
  });
});