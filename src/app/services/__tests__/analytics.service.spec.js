/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingInsights with valid date range
- Purpose: Validates that getSpendingInsights returns aggregated spending insights
- Scenario: User requests spending insights for a valid date range
- Expected Result: Returns object with monthlyTrends, categorySpends, and cardWiseSpends
*/
/*
Test Documentation:
- Test Name: AnalyticsService - aggregateByMonth with multiple transactions
- Purpose: Validates monthly aggregation logic
- Scenario: Multiple transactions across different months
- Expected Result: Returns array of monthly spend totals grouped by month
*/
/*
Test Documentation:
- Test Name: AnalyticsService - aggregateByCategory with category data
- Purpose: Validates category-wise spending aggregation
- Scenario: Transactions with various categories
- Expected Result: Returns array with category totals, counts, and percentages
*/
/*
Test Documentation:
- Test Name: AnalyticsService - aggregateByCard with multiple cards
- Purpose: Validates card-wise spending aggregation with category breakdown
- Scenario: Transactions from multiple credit cards
- Expected Result: Returns array of card-wise spends with category breakdowns
*/
/*
Test Documentation:
- Test Name: AnalyticsService - error handling when TransactionFactory fails
- Purpose: Validates error handling when dependency fails
- Scenario: TransactionFactory.getTransactions rejects promise
- Expected Result: Promise is rejected and error is propagated
*/
/*
Coverage Report:
- Functions tested: getSpendingInsights, aggregateByMonth, aggregateByCategory, aggregateByCard
- Scenarios covered: normal flow, multiple transactions, empty data, error handling
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, TransactionFactory, CategoryFactory, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _TransactionFactory_, _CategoryFactory_, _$q_, _$rootScope_) {
      AnalyticsService = _AnalyticsService_;
      TransactionFactory = _TransactionFactory_;
      CategoryFactory = _CategoryFactory_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getSpendingInsights', function() {
      it('should return spending insights with monthlyTrends, categorySpends, and cardWiseSpends', function() {
        var mockTransactions = [
          { transactionId: 'txn1', cardId: 'card1234', amount: 1200, category: 'Food & Dining', date: '2026-11-01' },
          { transactionId: 'txn2', cardId: 'card1234', amount: 800, category: 'Fuel', date: '2026-11-05' },
          { transactionId: 'txn3', cardId: 'card5678', amount: 2500, category: 'Shopping', date: '2026-10-10' }
        ];
        var mockCategories = ['Food & Dining', 'Fuel', 'Shopping'];

        spyOn(TransactionFactory, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
        spyOn(CategoryFactory, 'getCategories').and.returnValue($q.resolve(mockCategories));

        var result;
        AnalyticsService.getSpendingInsights(new Date('2026-10-01'), new Date('2026-11-30')).then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(result.monthlyTrends).toBeDefined();
        expect(result.categorySpends).toBeDefined();
        expect(result.cardWiseSpends).toBeDefined();
        expect(TransactionFactory.getTransactions).toHaveBeenCalled();
        expect(CategoryFactory.getCategories).toHaveBeenCalled();
      });

      it('should handle empty transactions array', function() {
        spyOn(TransactionFactory, 'getTransactions').and.returnValue($q.resolve([]));
        spyOn(CategoryFactory, 'getCategories').and.returnValue($q.resolve([]));

        var result;
        AnalyticsService.getSpendingInsights(new Date('2026-10-01'), new Date('2026-11-30')).then(function(data) {
          result = data;
        });

        $rootScope.$apply();

        expect(result.monthlyTrends).toEqual([]);
        expect(result.categorySpends).toEqual([]);
        expect(result.cardWiseSpends).toEqual([]);
      });

      it('should handle promise rejection from TransactionFactory', function() {
        spyOn(TransactionFactory, 'getTransactions').and.returnValue($q.reject('Error fetching transactions'));
        spyOn(CategoryFactory, 'getCategories').and.returnValue($q.resolve([]));

        var error;
        AnalyticsService.getSpendingInsights(new Date('2026-10-01'), new Date('2026-11-30')).catch(function(err) {
          error = err;
        });

        $rootScope.$apply();

        expect(error).toBe('Error fetching transactions');
      });
    });

    describe('aggregateByMonth', function() {
      it('should aggregate transactions by month', function() {
        var transactions = [
          { amount: 1200, date: '2026-11-01' },
          { amount: 800, date: '2026-11-15' },
          { amount: 2500, date: '2026-10-10' }
        ];

        var result = AnalyticsService.aggregateByMonth(transactions);

        expect(result.length).toBe(2);
        expect(result[0].totalSpend).toBeDefined();
        expect(result[0].month).toBeDefined();
      });

      it('should return empty array for empty transactions', function() {
        var result = AnalyticsService.aggregateByMonth([]);
        expect(result).toEqual([]);
      });

      it('should sum multiple transactions in the same month', function() {
        var transactions = [
          { amount: 500, date: '2026-11-01' },
          { amount: 700, date: '2026-11-15' },
          { amount: 300, date: '2026-11-20' }
        ];

        var result = AnalyticsService.aggregateByMonth(transactions);

        expect(result.length).toBe(1);
        expect(result[0].totalSpend).toBe(1500);
      });
    });

    describe('aggregateByCategory', function() {
      it('should aggregate transactions by category with percentage', function() {
        var transactions = [
          { amount: 1000, category: 'Food & Dining' },
          { amount: 500, category: 'Fuel' },
          { amount: 1500, category: 'Food & Dining' }
        ];
        var categories = ['Food & Dining', 'Fuel'];

        var result = AnalyticsService.aggregateByCategory(transactions, categories);

        expect(result.length).toBe(2);
        expect(result[0].category).toBeDefined();
        expect(result[0].totalSpend).toBeDefined();
        expect(result[0].transactionCount).toBeDefined();
        expect(result[0].percentage).toBeDefined();
      });

      it('should calculate correct percentage for each category', function() {
        var transactions = [
          { amount: 1000, category: 'Food & Dining' },
          { amount: 1000, category: 'Fuel' }
        ];
        var categories = ['Food & Dining', 'Fuel'];

        var result = AnalyticsService.aggregateByCategory(transactions, categories);

        var foodCategory = result.find(function(c) { return c.category === 'Food & Dining'; });
        expect(foodCategory.percentage).toBe('50.00');
      });

      it('should return empty array for empty transactions', function() {
        var result = AnalyticsService.aggregateByCategory([], []);
        expect(result).toEqual([]);
      });

      it('should handle zero total spend gracefully', function() {
        var transactions = [];
        var categories = ['Food & Dining'];

        var result = AnalyticsService.aggregateByCategory(transactions, categories);

        expect(result).toEqual([]);
      });
    });

    describe('aggregateByCard', function() {
      it('should aggregate transactions by card with category breakdown', function() {
        var transactions = [
          { cardId: 'card1234', amount: 1000, category: 'Food & Dining' },
          { cardId: 'card1234', amount: 500, category: 'Fuel' },
          { cardId: 'card5678', amount: 1500, category: 'Shopping' }
        ];
        var categories = ['Food & Dining', 'Fuel', 'Shopping'];

        var result = AnalyticsService.aggregateByCard(transactions, categories);

        expect(result.length).toBe(2);
        expect(result[0].cardId).toBeDefined();
        expect(result[0].cardName).toBeDefined();
        expect(result[0].totalSpend).toBeDefined();
        expect(result[0].categoryBreakdown).toBeDefined();
        expect(Array.isArray(result[0].categoryBreakdown)).toBe(true);
      });

      it('should calculate correct total spend per card', function() {
        var transactions = [
          { cardId: 'card1234', amount: 1000, category: 'Food & Dining' },
          { cardId: 'card1234', amount: 500, category: 'Fuel' }
        ];
        var categories = ['Food & Dining', 'Fuel'];

        var result = AnalyticsService.aggregateByCard(transactions, categories);

        expect(result[0].totalSpend).toBe(1500);
      });

      it('should return empty array for empty transactions', function() {
        var result = AnalyticsService.aggregateByCard([], []);
        expect(result).toEqual([]);
      });

      it('should create category breakdown with transaction counts', function() {
        var transactions = [
          { cardId: 'card1234', amount: 500, category: 'Food & Dining' },
          { cardId: 'card1234', amount: 700, category: 'Food & Dining' },
          { cardId: 'card1234', amount: 300, category: 'Fuel' }
        ];
        var categories = ['Food & Dining', 'Fuel'];

        var result = AnalyticsService.aggregateByCard(transactions, categories);

        var foodBreakdown = result[0].categoryBreakdown.find(function(c) { return c.category === 'Food & Dining'; });
        expect(foodBreakdown.transactionCount).toBe(2);
        expect(foodBreakdown.totalSpend).toBe(1200);
      });
    });
  });
})();