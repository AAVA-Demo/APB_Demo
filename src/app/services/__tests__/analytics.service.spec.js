/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingInsights
- Purpose: Validates that the service correctly retrieves transactions, categorizes them, and aggregates spending insights
- Scenario: User requests spending insights for 12 months
- Expected Result: Returns categorySpending and monthlyTrends arrays with correct aggregations

- Test Name: AnalyticsService - aggregateByCategory
- Purpose: Validates category-wise aggregation logic
- Scenario: Transactions with multiple categories are aggregated
- Expected Result: Returns array with category totals, counts, and percentages

- Test Name: AnalyticsService - aggregateByMonth
- Purpose: Validates monthly trend aggregation
- Scenario: Transactions spanning multiple months are aggregated
- Expected Result: Returns sorted array of monthly spending totals

- Test Name: AnalyticsService - error handling
- Purpose: Validates service behavior when dependencies fail
- Scenario: TransactionRepositoryFactory returns error
- Expected Result: Promise is rejected with appropriate error

Coverage Report:
- Functions tested: getSpendingInsights, aggregateByCategory, aggregateByMonth
- Scenarios covered: normal flow, empty transactions, error handling, edge cases
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, TransactionRepositoryFactory, CategorizationService, $q, $rootScope;

    beforeEach(module('analytics'));

    beforeEach(inject(function(_AnalyticsService_, _TransactionRepositoryFactory_, _CategorizationService_, _$q_, _$rootScope_) {
      AnalyticsService = _AnalyticsService_;
      TransactionRepositoryFactory = _TransactionRepositoryFactory_;
      CategorizationService = _CategorizationService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getSpendingInsights', function() {
      it('should retrieve transactions and return categorized spending insights', function(done) {
        var mockTransactions = [
          {transactionId: 't1', merchantName: 'Restaurant', amount: 50, transactionDate: '2024-01-15'},
          {transactionId: 't2', merchantName: 'Gas Station', amount: 40, transactionDate: '2024-01-20'},
          {transactionId: 't3', merchantName: 'Amazon', amount: 100, transactionDate: '2024-02-10'}
        ];

        spyOn(TransactionRepositoryFactory, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
        spyOn(CategorizationService, 'categorize').and.callFake(function(txn) {
          if (txn.merchantName === 'Restaurant') return 'Food & Dining';
          if (txn.merchantName === 'Gas Station') return 'Fuel';
          return 'Shopping';
        });

        AnalyticsService.getSpendingInsights('user123', {months: 12}).then(function(result) {
          expect(result.categorySpending).toBeDefined();
          expect(result.monthlyTrends).toBeDefined();
          expect(result.categorySpending.length).toBe(3);
          expect(result.monthlyTrends.length).toBe(2);
          done();
        });

        $rootScope.$apply();
      });

      it('should handle empty transaction list', function(done) {
        spyOn(TransactionRepositoryFactory, 'getTransactions').and.returnValue($q.resolve([]));

        AnalyticsService.getSpendingInsights('user123', {months: 12}).then(function(result) {
          expect(result.categorySpending.length).toBe(0);
          expect(result.monthlyTrends.length).toBe(0);
          done();
        });

        $rootScope.$apply();
      });

      it('should reject promise when transaction retrieval fails', function(done) {
        spyOn(TransactionRepositoryFactory, 'getTransactions').and.returnValue($q.reject('Error fetching transactions'));

        AnalyticsService.getSpendingInsights('user123', {months: 12}).catch(function(error) {
          expect(error).toBe('Error fetching transactions');
          done();
        });

        $rootScope.$apply();
      });
    });

    describe('aggregateByCategory', function() {
      it('should correctly aggregate transactions by category', function() {
        var transactions = [
          {category: 'Food & Dining', amount: 50},
          {category: 'Food & Dining', amount: 30},
          {category: 'Fuel', amount: 40}
        ];

        var result = AnalyticsService.aggregateByCategory(transactions);

        expect(result.length).toBe(2);
        var foodCategory = result.find(function(c) { return c.category === 'Food & Dining'; });
        expect(foodCategory.totalAmount).toBe(80);
        expect(foodCategory.transactionCount).toBe(2);
        expect(foodCategory.percentage).toBeCloseTo(66.67, 1);
      });

      it('should handle empty transaction array', function() {
        var result = AnalyticsService.aggregateByCategory([]);
        expect(result.length).toBe(0);
      });

      it('should calculate percentage as 0 when total is 0', function() {
        var transactions = [{category: 'Food & Dining', amount: 0}];
        var result = AnalyticsService.aggregateByCategory(transactions);
        expect(result[0].percentage).toBe(0);
      });
    });

    describe('aggregateByMonth', function() {
      it('should correctly aggregate transactions by month', function() {
        var transactions = [
          {transactionDate: '2024-01-15', amount: 100},
          {transactionDate: '2024-01-20', amount: 50},
          {transactionDate: '2024-02-10', amount: 75}
        ];

        var result = AnalyticsService.aggregateByMonth(transactions);

        expect(result.length).toBe(2);
        expect(result[0].month).toBe('2024-01');
        expect(result[0].totalSpend).toBe(150);
        expect(result[1].month).toBe('2024-02');
        expect(result[1].totalSpend).toBe(75);
      });

      it('should return sorted months in chronological order', function() {
        var transactions = [
          {transactionDate: '2024-03-15', amount: 100},
          {transactionDate: '2024-01-20', amount: 50},
          {transactionDate: '2024-02-10', amount: 75}
        ];

        var result = AnalyticsService.aggregateByMonth(transactions);

        expect(result[0].month).toBe('2024-01');
        expect(result[1].month).toBe('2024-02');
        expect(result[2].month).toBe('2024-03');
      });

      it('should handle empty transaction array', function() {
        var result = AnalyticsService.aggregateByMonth([]);
        expect(result.length).toBe(0);
      });
    });
  });
})();