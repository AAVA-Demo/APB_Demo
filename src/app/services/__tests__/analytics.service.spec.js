/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics
- Purpose: Validates that getSpendingAnalytics retrieves transactions, categorizes them, and computes category totals and monthly trends
- Scenario: Service fetches transactions with filter, categorizes them, and returns analytics data
- Expected Result: Returns object with categorySpending and monthlyTrends arrays
*/
/*
Test Documentation:
- Test Name: AnalyticsService - computeCategoryTotals
- Purpose: Validates category-wise spending aggregation with transaction counts and percentages
- Scenario: Given transactions with categories, compute totals, counts, and percentages
- Expected Result: Returns array of category objects with amount, transactionCount, and percentage
*/
/*
Test Documentation:
- Test Name: AnalyticsService - computeMonthlyTrends
- Purpose: Validates monthly spending trend computation with category breakdown
- Scenario: Given transactions across multiple months, compute monthly totals and category breakdowns
- Expected Result: Returns sorted array of monthly trend objects with totalSpend and categoryBreakdown
*/
/*
Coverage Report:
- Functions tested: getSpendingAnalytics, computeCategoryTotals, computeMonthlyTrends
- Scenarios covered: successful analytics retrieval, category aggregation with percentages, monthly trend computation, empty transaction handling, single category scenario
- Uncovered scenarios: API error handling (delegated to TransactionService), malformed transaction data
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, TransactionService, CategoryService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _TransactionService_, _CategoryService_, _$q_, _$rootScope_) {
      AnalyticsService = _AnalyticsService_;
      TransactionService = _TransactionService_;
      CategoryService = _CategoryService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getSpendingAnalytics', function() {
      it('should fetch transactions, categorize them, and return analytics data', function() {
        var mockTransactions = [
          {date: '2023-01-15', category: 'Food & Dining', amount: 100},
          {date: '2023-01-20', category: 'Fuel', amount: 50},
          {date: '2023-02-10', category: 'Food & Dining', amount: 150}
        ];
        var mockCategorized = mockTransactions;
        var filter = {startDate: '2023-01-01', endDate: '2023-02-28'};

        spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
        spyOn(CategoryService, 'categorizeTransactions').and.returnValue(mockCategorized);

        var result;
        AnalyticsService.getSpendingAnalytics(filter).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(TransactionService.fetchTransactions).toHaveBeenCalledWith(filter);
        expect(CategoryService.categorizeTransactions).toHaveBeenCalledWith(mockTransactions);
        expect(result).toBeDefined();
        expect(result.categorySpending).toBeDefined();
        expect(result.monthlyTrends).toBeDefined();
        expect(Array.isArray(result.categorySpending)).toBe(true);
        expect(Array.isArray(result.monthlyTrends)).toBe(true);
      });

      it('should handle empty transactions array', function() {
        spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve([]));
        spyOn(CategoryService, 'categorizeTransactions').and.returnValue([]);

        var result;
        AnalyticsService.getSpendingAnalytics({}).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.categorySpending).toEqual([]);
        expect(result.monthlyTrends).toEqual([]);
      });
    });

    describe('computeCategoryTotals', function() {
      it('should compute category totals with transaction counts and percentages', function() {
        var transactions = [
          {category: 'Food & Dining', amount: 100},
          {category: 'Food & Dining', amount: 50},
          {category: 'Fuel', amount: 150},
          {category: 'Shopping', amount: 200}
        ];

        var result = AnalyticsService.computeCategoryTotals(transactions);

        expect(result.length).toBe(3);
        var foodDining = result.find(function(c) { return c.category === 'Food & Dining'; });
        expect(foodDining.amount).toBe(150);
        expect(foodDining.transactionCount).toBe(2);
        expect(parseFloat(foodDining.percentage)).toBeCloseTo(30.0, 1);

        var fuel = result.find(function(c) { return c.category === 'Fuel'; });
        expect(fuel.amount).toBe(150);
        expect(fuel.transactionCount).toBe(1);
        expect(parseFloat(fuel.percentage)).toBeCloseTo(30.0, 1);

        var shopping = result.find(function(c) { return c.category === 'Shopping'; });
        expect(shopping.amount).toBe(200);
        expect(shopping.transactionCount).toBe(1);
        expect(parseFloat(shopping.percentage)).toBeCloseTo(40.0, 1);
      });

      it('should handle empty transactions array', function() {
        var result = AnalyticsService.computeCategoryTotals([]);
        expect(result).toEqual([]);
      });

      it('should handle single category', function() {
        var transactions = [
          {category: 'Food & Dining', amount: 100},
          {category: 'Food & Dining', amount: 200}
        ];

        var result = AnalyticsService.computeCategoryTotals(transactions);

        expect(result.length).toBe(1);
        expect(result[0].category).toBe('Food & Dining');
        expect(result[0].amount).toBe(300);
        expect(result[0].transactionCount).toBe(2);
        expect(parseFloat(result[0].percentage)).toBe(100.0);
      });
    });

    describe('computeMonthlyTrends', function() {
      it('should compute monthly trends with category breakdown', function() {
        var transactions = [
          {date: '2023-01-15', category: 'Food & Dining', amount: 100},
          {date: '2023-01-20', category: 'Fuel', amount: 50},
          {date: '2023-02-10', category: 'Food & Dining', amount: 150},
          {date: '2023-02-15', category: 'Shopping', amount: 200}
        ];

        var result = AnalyticsService.computeMonthlyTrends(transactions);

        expect(result.length).toBe(2);
        expect(result[0].month).toBe('2023-01');
        expect(result[0].totalSpend).toBe(150);
        expect(result[0].categoryBreakdown.length).toBe(2);

        expect(result[1].month).toBe('2023-02');
        expect(result[1].totalSpend).toBe(350);
        expect(result[1].categoryBreakdown.length).toBe(2);

        var jan = result[0];
        var janFood = jan.categoryBreakdown.find(function(c) { return c.category === 'Food & Dining'; });
        expect(janFood.amount).toBe(100);
        var janFuel = jan.categoryBreakdown.find(function(c) { return c.category === 'Fuel'; });
        expect(janFuel.amount).toBe(50);
      });

      it('should return sorted months in ascending order', function() {
        var transactions = [
          {date: '2023-03-15', category: 'Food & Dining', amount: 100},
          {date: '2023-01-20', category: 'Fuel', amount: 50},
          {date: '2023-02-10', category: 'Shopping', amount: 150}
        ];

        var result = AnalyticsService.computeMonthlyTrends(transactions);

        expect(result.length).toBe(3);
        expect(result[0].month).toBe('2023-01');
        expect(result[1].month).toBe('2023-02');
        expect(result[2].month).toBe('2023-03');
      });

      it('should handle empty transactions array', function() {
        var result = AnalyticsService.computeMonthlyTrends([]);
        expect(result).toEqual([]);
      });
    });
  });
})();