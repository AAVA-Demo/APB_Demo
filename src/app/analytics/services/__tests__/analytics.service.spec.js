/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics success
- Purpose: Validates spending analytics aggregation
- Scenario: Multiple transactions across months and categories
- Expected Result: Returns monthly trends and category breakdown

- Test Name: AnalyticsService - aggregateByMonth
- Purpose: Validates monthly aggregation logic
- Scenario: Transactions from different months
- Expected Result: Correctly grouped and sorted by month

- Test Name: AnalyticsService - aggregateByCategory
- Purpose: Validates category aggregation with percentages
- Scenario: Transactions across multiple categories
- Expected Result: Correct totals and percentage calculations

- Test Name: AnalyticsService - empty transactions
- Purpose: Validates handling of empty data
- Scenario: No transactions
- Expected Result: Empty arrays for trends and breakdown

- Test Name: AnalyticsService - error handling
- Purpose: Validates error propagation
- Scenario: API error
- Expected Result: Error propagated to caller
*/

/*
Coverage Report:
- Functions tested: getSpendingAnalytics, aggregateByMonth, aggregateByCategory
- Scenarios covered: successful aggregation, monthly grouping, category breakdown, percentage calculation, empty data, error handling
- Edge cases: empty transactions, single transaction, same month transactions, zero totals
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService;
    var TransactionAPIFactory;
    var CategoryEngineService;
    var $q;
    var $rootScope;

    beforeEach(module('analytics'));

    beforeEach(inject(function(_AnalyticsService_, _TransactionAPIFactory_, _CategoryEngineService_, _$q_, _$rootScope_) {
      AnalyticsService = _AnalyticsService_;
      TransactionAPIFactory = _TransactionAPIFactory_;
      CategoryEngineService = _CategoryEngineService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getSpendingAnalytics', function() {
      it('should return spending analytics with monthly trends and category breakdown', function() {
        var mockTransactions = [
          { transactionId: 'txn-001', amount: 100, category: 'Food & Dining', date: new Date('2024-01-15') },
          { transactionId: 'txn-002', amount: 200, category: 'Shopping', date: new Date('2024-01-20') },
          { transactionId: 'txn-003', amount: 150, category: 'Food & Dining', date: new Date('2024-02-10') }
        ];
        var dateRange = { start: new Date('2024-01-01'), end: new Date('2024-02-28') };
        
        spyOn(TransactionAPIFactory, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
        spyOn(CategoryEngineService, 'categorizeTransactions').and.returnValue(mockTransactions);

        var result;
        AnalyticsService.getSpendingAnalytics('user-001', dateRange).then(function(analytics) {
          result = analytics;
        });
        $rootScope.$apply();

        expect(result.userId).toBe('user-001');
        expect(result.monthlyTrends.length).toBe(2);
        expect(result.categoryBreakdown.length).toBe(2);
        expect(result.dateRange).toBe(dateRange);
      });

      it('should handle empty transactions', function() {
        var dateRange = { start: new Date('2024-01-01'), end: new Date('2024-01-31') };
        
        spyOn(TransactionAPIFactory, 'getTransactions').and.returnValue($q.resolve([]));
        spyOn(CategoryEngineService, 'categorizeTransactions').and.returnValue([]);

        var result;
        AnalyticsService.getSpendingAnalytics('user-002', dateRange).then(function(analytics) {
          result = analytics;
        });
        $rootScope.$apply();

        expect(result.monthlyTrends.length).toBe(0);
        expect(result.categoryBreakdown.length).toBe(0);
      });

      it('should propagate errors from TransactionAPIFactory', function() {
        var errorMessage = 'Transaction API Error';
        var dateRange = { start: new Date('2024-01-01'), end: new Date('2024-01-31') };
        
        spyOn(TransactionAPIFactory, 'getTransactions').and.returnValue($q.reject(errorMessage));

        var errorResult;
        AnalyticsService.getSpendingAnalytics('user-003', dateRange).catch(function(error) {
          errorResult = error;
        });
        $rootScope.$apply();

        expect(errorResult).toBe(errorMessage);
      });
    });

    describe('aggregateByMonth', function() {
      it('should aggregate transactions by month correctly', function() {
        var transactions = [
          { transactionId: 'txn-001', amount: 100, date: new Date('2024-01-15') },
          { transactionId: 'txn-002', amount: 200, date: new Date('2024-01-20') },
          { transactionId: 'txn-003', amount: 150, date: new Date('2024-02-10') },
          { transactionId: 'txn-004', amount: 300, date: new Date('2024-02-25') }
        ];

        var result = AnalyticsService.aggregateByMonth(transactions);

        expect(result.length).toBe(2);
        expect(result[0].month).toBe('2024-01');
        expect(result[0].totalSpend).toBe(300);
        expect(result[0].transactionCount).toBe(2);
        expect(result[1].month).toBe('2024-02');
        expect(result[1].totalSpend).toBe(450);
        expect(result[1].transactionCount).toBe(2);
      });

      it('should sort months in ascending order', function() {
        var transactions = [
          { transactionId: 'txn-001', amount: 100, date: new Date('2024-03-15') },
          { transactionId: 'txn-002', amount: 200, date: new Date('2024-01-20') },
          { transactionId: 'txn-003', amount: 150, date: new Date('2024-02-10') }
        ];

        var result = AnalyticsService.aggregateByMonth(transactions);

        expect(result[0].month).toBe('2024-01');
        expect(result[1].month).toBe('2024-02');
        expect(result[2].month).toBe('2024-03');
      });

      it('should handle empty transactions array', function() {
        var result = AnalyticsService.aggregateByMonth([]);
        expect(result.length).toBe(0);
      });

      it('should handle single transaction', function() {
        var transactions = [
          { transactionId: 'txn-001', amount: 500, date: new Date('2024-01-15') }
        ];

        var result = AnalyticsService.aggregateByMonth(transactions);

        expect(result.length).toBe(1);
        expect(result[0].totalSpend).toBe(500);
        expect(result[0].transactionCount).toBe(1);
      });

      it('should handle multiple transactions in same month', function() {
        var transactions = [
          { transactionId: 'txn-001', amount: 100, date: new Date('2024-01-05') },
          { transactionId: 'txn-002', amount: 200, date: new Date('2024-01-15') },
          { transactionId: 'txn-003', amount: 300, date: new Date('2024-01-25') }
        ];

        var result = AnalyticsService.aggregateByMonth(transactions);

        expect(result.length).toBe(1);
        expect(result[0].totalSpend).toBe(600);
        expect(result[0].transactionCount).toBe(3);
      });
    });

    describe('aggregateByCategory', function() {
      it('should aggregate transactions by category with percentages', function() {
        var transactions = [
          { transactionId: 'txn-001', amount: 100, category: 'Food & Dining' },
          { transactionId: 'txn-002', amount: 200, category: 'Shopping' },
          { transactionId: 'txn-003', amount: 100, category: 'Food & Dining' },
          { transactionId: 'txn-004', amount: 100, category: 'Travel' }
        ];

        var result = AnalyticsService.aggregateByCategory(transactions);

        expect(result.length).toBe(3);
        
        var foodDining = result.find(function(c) { return c.category === 'Food & Dining'; });
        expect(foodDining.totalSpend).toBe(200);
        expect(foodDining.percentage).toBe('40.00');

        var shopping = result.find(function(c) { return c.category === 'Shopping'; });
        expect(shopping.totalSpend).toBe(200);
        expect(shopping.percentage).toBe('40.00');

        var travel = result.find(function(c) { return c.category === 'Travel'; });
        expect(travel.totalSpend).toBe(100);
        expect(travel.percentage).toBe('20.00');
      });

      it('should handle empty transactions array', function() {
        var result = AnalyticsService.aggregateByCategory([]);
        expect(result.length).toBe(0);
      });

      it('should handle single category', function() {
        var transactions = [
          { transactionId: 'txn-001', amount: 100, category: 'Food & Dining' },
          { transactionId: 'txn-002', amount: 200, category: 'Food & Dining' }
        ];

        var result = AnalyticsService.aggregateByCategory(transactions);

        expect(result.length).toBe(1);
        expect(result[0].category).toBe('Food & Dining');
        expect(result[0].totalSpend).toBe(300);
        expect(result[0].percentage).toBe('100.00');
      });

      it('should calculate percentages correctly for decimal amounts', function() {
        var transactions = [
          { transactionId: 'txn-001', amount: 33.33, category: 'Food & Dining' },
          { transactionId: 'txn-002', amount: 66.67, category: 'Shopping' }
        ];

        var result = AnalyticsService.aggregateByCategory(transactions);

        var foodDining = result.find(function(c) { return c.category === 'Food & Dining'; });
        expect(parseFloat(foodDining.percentage)).toBeCloseTo(33.33, 1);

        var shopping = result.find(function(c) { return c.category === 'Shopping'; });
        expect(parseFloat(shopping.percentage)).toBeCloseTo(66.67, 1);
      });

      it('should handle zero total gracefully', function() {
        var transactions = [
          { transactionId: 'txn-001', amount: 0, category: 'Food & Dining' }
        ];

        var result = AnalyticsService.aggregateByCategory(transactions);

        expect(result[0].percentage).toBe('0');
      });
    });
  });
})();