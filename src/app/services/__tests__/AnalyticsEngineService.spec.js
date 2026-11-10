/*
Test Documentation:
- Test Name: AnalyticsEngineService - aggregateByCategory with valid transactions
- Purpose: Validates aggregation of transactions by category
- Scenario: Multiple transactions across different categories
- Expected Result: Returns array with category totals, counts, and percentages
*/
/*
Test Documentation:
- Test Name: AnalyticsEngineService - aggregateByCategory with empty transactions
- Purpose: Validates handling of empty transaction array
- Scenario: Empty array passed to aggregateByCategory
- Expected Result: Returns empty array
*/
/*
Test Documentation:
- Test Name: AnalyticsEngineService - filterByCategory with selected categories
- Purpose: Validates filtering transactions by selected categories
- Scenario: Filter transactions for specific categories
- Expected Result: Returns only transactions matching selected categories
*/
/*
Test Documentation:
- Test Name: AnalyticsEngineService - filterByCategory with no selection
- Purpose: Validates behavior when no categories selected
- Scenario: Empty or null selectedCategories array
- Expected Result: Returns all transactions
*/
/*
Coverage Report:
- Functions tested: aggregateByCategory, filterByCategory
- Scenarios covered: valid aggregation, empty input, category filtering, no filter selection, percentage calculation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AnalyticsEngineService', function() {
    var AnalyticsEngineService, CategoryService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsEngineService_, _CategoryService_) {
      AnalyticsEngineService = _AnalyticsEngineService_;
      CategoryService = _CategoryService_;
    }));

    describe('aggregateByCategory', function() {
      it('should aggregate transactions by category with correct totals and percentages', function() {
        var transactions = [
          { transactionId: 'txn1', amount: 1000, category: 'Food & Dining' },
          { transactionId: 'txn2', amount: 500, category: 'Food & Dining' },
          { transactionId: 'txn3', amount: 2000, category: 'Travel' },
          { transactionId: 'txn4', amount: 1500, category: 'Shopping' }
        ];

        var result = AnalyticsEngineService.aggregateByCategory(transactions);

        expect(result.length).toBe(3);
        
        var foodCategory = result.find(function(item) { return item.category === 'Food & Dining'; });
        expect(foodCategory).toBeDefined();
        expect(foodCategory.totalSpend).toBe(1500);
        expect(foodCategory.transactionCount).toBe(2);
        expect(foodCategory.percentageOfTotal).toBe('30.00');

        var travelCategory = result.find(function(item) { return item.category === 'Travel'; });
        expect(travelCategory).toBeDefined();
        expect(travelCategory.totalSpend).toBe(2000);
        expect(travelCategory.transactionCount).toBe(1);
        expect(travelCategory.percentageOfTotal).toBe('40.00');
      });

      it('should return empty array for empty transactions', function() {
        var result = AnalyticsEngineService.aggregateByCategory([]);
        expect(result).toEqual([]);
      });

      it('should handle single transaction correctly', function() {
        var transactions = [
          { transactionId: 'txn1', amount: 1000, category: 'Fuel' }
        ];

        var result = AnalyticsEngineService.aggregateByCategory(transactions);

        expect(result.length).toBe(1);
        expect(result[0].category).toBe('Fuel');
        expect(result[0].totalSpend).toBe(1000);
        expect(result[0].transactionCount).toBe(1);
        expect(result[0].percentageOfTotal).toBe('100.00');
      });

      it('should calculate percentage as 0 when total spend is 0', function() {
        var transactions = [
          { transactionId: 'txn1', amount: 0, category: 'Shopping' }
        ];

        var result = AnalyticsEngineService.aggregateByCategory(transactions);

        expect(result[0].percentageOfTotal).toBe(0);
      });
    });

    describe('filterByCategory', function() {
      var transactions;

      beforeEach(function() {
        transactions = [
          { transactionId: 'txn1', amount: 1000, category: 'Food & Dining' },
          { transactionId: 'txn2', amount: 500, category: 'Fuel' },
          { transactionId: 'txn3', amount: 2000, category: 'Travel' },
          { transactionId: 'txn4', amount: 1500, category: 'Shopping' }
        ];
      });

      it('should filter transactions by selected categories', function() {
        var selectedCategories = ['Food & Dining', 'Travel'];
        var result = AnalyticsEngineService.filterByCategory(transactions, selectedCategories);

        expect(result.length).toBe(2);
        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Travel');
      });

      it('should return all transactions when selectedCategories is empty', function() {
        var result = AnalyticsEngineService.filterByCategory(transactions, []);
        expect(result.length).toBe(4);
        expect(result).toEqual(transactions);
      });

      it('should return all transactions when selectedCategories is null', function() {
        var result = AnalyticsEngineService.filterByCategory(transactions, null);
        expect(result.length).toBe(4);
        expect(result).toEqual(transactions);
      });

      it('should return empty array when no transactions match selected categories', function() {
        var selectedCategories = ['Entertainment'];
        var result = AnalyticsEngineService.filterByCategory(transactions, selectedCategories);
        expect(result.length).toBe(0);
      });

      it('should handle single category filter', function() {
        var selectedCategories = ['Fuel'];
        var result = AnalyticsEngineService.filterByCategory(transactions, selectedCategories);

        expect(result.length).toBe(1);
        expect(result[0].category).toBe('Fuel');
      });
    });
  });
})();