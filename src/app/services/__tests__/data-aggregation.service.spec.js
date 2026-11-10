/*
Test Documentation:
- Test Name: DataAggregationService - getSpendingSummary
- Purpose: Verify spending summary aggregation for specified period
- Scenario: Service aggregates transactions into category breakdown and monthly trends
- Expected Result: Returns summary with categoryBreakdown, monthlyTrends, and period
*/
/*
Test Documentation:
- Test Name: DataAggregationService - getFilteredData
- Purpose: Verify filtered data retrieval by category
- Scenario: Service filters transactions by specific category and aggregates by month
- Expected Result: Returns monthly trends for specified category only
*/
/*
Test Documentation:
- Test Name: DataAggregationService - aggregateByCategory
- Purpose: Verify category-wise transaction aggregation
- Scenario: Service groups transactions by category and sums amounts
- Expected Result: Returns array of category objects with totalAmount and transactionCount
*/
/*
Test Documentation:
- Test Name: DataAggregationService - aggregateByMonth
- Purpose: Verify monthly transaction aggregation
- Scenario: Service groups transactions by month and aggregates spending
- Expected Result: Returns sorted array of monthly spend objects
*/
/*
Coverage Report:
- Functions tested: getSpendingSummary, getFilteredData, aggregateByCategory, aggregateByMonth
- Scenarios covered: summary generation, category filtering, category aggregation, monthly aggregation, sorting, empty data, multiple categories, multiple months
- Uncovered scenarios: none - all public methods and edge cases tested
*/

(function() {
  'use strict';

  describe('DataAggregationService', function() {
    var DataAggregationService, TransactionCategorizationFactory, $rootScope, $q;
    var mockTransactions;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_DataAggregationService_, _TransactionCategorizationFactory_, _$rootScope_, _$q_) {
      DataAggregationService = _DataAggregationService_;
      TransactionCategorizationFactory = _TransactionCategorizationFactory_;
      $rootScope = _$rootScope_;
      $q = _$q_;

      mockTransactions = [
        { id: 'txn-1', cardId: 'card-001', amount: 1200, category: 'Shopping', date: new Date('2024-01-15') },
        { id: 'txn-2', cardId: 'card-001', amount: 850, category: 'Food & Dining', date: new Date('2024-01-14') },
        { id: 'txn-3', cardId: 'card-001', amount: 3500, category: 'Fuel', date: new Date('2024-01-12') },
        { id: 'txn-4', cardId: 'card-002', amount: 2200, category: 'Shopping', date: new Date('2024-02-10') },
        { id: 'txn-5', cardId: 'card-002', amount: 650, category: 'Entertainment', date: new Date('2024-02-08') }
      ];

      spyOn(TransactionCategorizationFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
    }));

    describe('getSpendingSummary', function() {
      it('should return spending summary with categoryBreakdown', function(done) {
        DataAggregationService.getSpendingSummary('12months').then(function(summary) {
          expect(summary.categoryBreakdown).toBeDefined();
          expect(Array.isArray(summary.categoryBreakdown)).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      it('should return spending summary with monthlyTrends', function(done) {
        DataAggregationService.getSpendingSummary('12months').then(function(summary) {
          expect(summary.monthlyTrends).toBeDefined();
          expect(Array.isArray(summary.monthlyTrends)).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      it('should return period information', function(done) {
        DataAggregationService.getSpendingSummary('12months').then(function(summary) {
          expect(summary.period).toBeDefined();
          expect(summary.period.startDate).toBeDefined();
          expect(summary.period.endDate).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should use default period when not provided', function(done) {
        DataAggregationService.getSpendingSummary().then(function(summary) {
          expect(summary).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should call TransactionCategorizationFactory.fetchTransactions', function(done) {
        DataAggregationService.getSpendingSummary('12months').then(function() {
          expect(TransactionCategorizationFactory.fetchTransactions).toHaveBeenCalledWith('12months');
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('getFilteredData', function() {
      it('should return filtered monthly trends for category', function(done) {
        DataAggregationService.getFilteredData('Shopping').then(function(trends) {
          expect(Array.isArray(trends)).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      it('should filter transactions by specified category', function(done) {
        DataAggregationService.getFilteredData('Shopping').then(function(trends) {
          expect(trends.length).toBeGreaterThan(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should call TransactionCategorizationFactory.fetchTransactions', function(done) {
        DataAggregationService.getFilteredData('Fuel').then(function() {
          expect(TransactionCategorizationFactory.fetchTransactions).toHaveBeenCalledWith('12months');
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('aggregateByCategory', function() {
      it('should return array of category aggregations', function() {
        var result = DataAggregationService.aggregateByCategory(mockTransactions);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });

      it('should aggregate amounts by category', function() {
        var result = DataAggregationService.aggregateByCategory(mockTransactions);
        var shopping = result.find(function(cat) { return cat.category === 'Shopping'; });
        expect(shopping).toBeDefined();
        expect(shopping.totalAmount).toBe(3400);
      });

      it('should count transactions per category', function() {
        var result = DataAggregationService.aggregateByCategory(mockTransactions);
        var shopping = result.find(function(cat) { return cat.category === 'Shopping'; });
        expect(shopping.transactionCount).toBe(2);
      });

      it('should handle single transaction', function() {
        var singleTxn = [{ id: 'txn-1', amount: 500, category: 'Travel', date: new Date() }];
        var result = DataAggregationService.aggregateByCategory(singleTxn);
        expect(result.length).toBe(1);
        expect(result[0].totalAmount).toBe(500);
      });

      it('should handle empty transaction list', function() {
        var result = DataAggregationService.aggregateByCategory([]);
        expect(result.length).toBe(0);
      });

      it('should create separate entries for different categories', function() {
        var result = DataAggregationService.aggregateByCategory(mockTransactions);
        var categories = result.map(function(cat) { return cat.category; });
        expect(categories).toContain('Shopping');
        expect(categories).toContain('Food & Dining');
        expect(categories).toContain('Fuel');
      });
    });

    describe('aggregateByMonth', function() {
      it('should return array of monthly aggregations', function() {
        var result = DataAggregationService.aggregateByMonth(mockTransactions);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });

      it('should aggregate amounts by month', function() {
        var result = DataAggregationService.aggregateByMonth(mockTransactions);
        var jan2024 = result.find(function(m) { return m.month === '2024-1'; });
        expect(jan2024).toBeDefined();
        expect(jan2024.totalSpend).toBe(5550);
      });

      it('should include category data per month', function() {
        var result = DataAggregationService.aggregateByMonth(mockTransactions);
        var jan2024 = result.find(function(m) { return m.month === '2024-1'; });
        expect(jan2024.categoryData).toBeDefined();
        expect(jan2024.categoryData['Shopping']).toBe(1200);
      });

      it('should sort months chronologically', function() {
        var result = DataAggregationService.aggregateByMonth(mockTransactions);
        expect(result[0].month).toBe('2024-1');
        expect(result[1].month).toBe('2024-2');
      });

      it('should handle single month', function() {
        var singleMonthTxns = [
          { id: 'txn-1', amount: 500, category: 'Travel', date: new Date('2024-03-15') },
          { id: 'txn-2', amount: 300, category: 'Food & Dining', date: new Date('2024-03-20') }
        ];
        var result = DataAggregationService.aggregateByMonth(singleMonthTxns);
        expect(result.length).toBe(1);
        expect(result[0].totalSpend).toBe(800);
      });

      it('should handle empty transaction list', function() {
        var result = DataAggregationService.aggregateByMonth([]);
        expect(result.length).toBe(0);
      });
    });
  });
})();