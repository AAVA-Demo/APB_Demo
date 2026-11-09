/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingInsights
- Purpose: Validates that spending insights are correctly retrieved and processed
- Scenario: Fetch transactions, categorize, and aggregate data
- Expected Result: Returns spending insights with category spending and monthly trends
*/
/*
Test Documentation:
- Test Name: AnalyticsService - error handling
- Purpose: Validates proper error handling when dependencies fail
- Scenario: TransactionFactory rejects promise
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getSpendingInsights
- Scenarios covered: successful data retrieval, categorization, aggregation, error handling, caching
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';

  beforeEach(module('app.analytics'));

  var AnalyticsService, TransactionFactory, CategorizationService, AggregationService, $q, $rootScope;

  beforeEach(inject(function(_AnalyticsService_, _TransactionFactory_, _CategorizationService_, _AggregationService_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    TransactionFactory = _TransactionFactory_;
    CategorizationService = _CategorizationService_;
    AggregationService = _AggregationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getSpendingInsights', function() {
    var mockTransactions, mockCategorizedTransactions, mockCategorySpending, mockMonthlyTrends;

    beforeEach(function() {
      mockTransactions = [
        { transactionId: '1', amount: 100, merchant: 'Restaurant A', date: '2023-01-15' },
        { transactionId: '2', amount: 50, merchant: 'Gas Station', date: '2023-01-20' }
      ];

      mockCategorizedTransactions = [
        { transactionId: '1', amount: 100, merchant: 'Restaurant A', date: '2023-01-15', category: 'Food & Dining' },
        { transactionId: '2', amount: 50, merchant: 'Gas Station', date: '2023-01-20', category: 'Fuel' }
      ];

      mockCategorySpending = [
        { categoryName: 'Food & Dining', amount: 100, percentage: '66.67', transactionCount: 1 },
        { categoryName: 'Fuel', amount: 50, percentage: '33.33', transactionCount: 1 }
      ];

      mockMonthlyTrends = [
        { month: '2023-01', amount: 150 }
      ];

      spyOn(TransactionFactory, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'categorizeTransactions').and.returnValue(mockCategorizedTransactions);
      spyOn(AggregationService, 'aggregateByCategory').and.returnValue(mockCategorySpending);
      spyOn(AggregationService, 'aggregateByMonth').and.returnValue(mockMonthlyTrends);
    });

    it('should retrieve spending insights successfully', function() {
      var startDate = new Date('2023-01-01');
      var endDate = new Date('2023-12-31');
      var result;

      AnalyticsService.getSpendingInsights(startDate, endDate).then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(TransactionFactory.getTransactions).toHaveBeenCalledWith(startDate, endDate);
      expect(CategorizationService.categorizeTransactions).toHaveBeenCalledWith(mockTransactions);
      expect(AggregationService.aggregateByCategory).toHaveBeenCalledWith(mockCategorizedTransactions);
      expect(AggregationService.aggregateByMonth).toHaveBeenCalledWith(mockCategorizedTransactions);
      expect(result.categorySpending).toEqual(mockCategorySpending);
      expect(result.monthlyTrends).toEqual(mockMonthlyTrends);
      expect(result.totalSpend).toBe(150);
      expect(result.period).toBe('Last 12 Months');
    });

    it('should calculate total spend correctly from category spending', function() {
      var result;

      AnalyticsService.getSpendingInsights(new Date(), new Date()).then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.totalSpend).toBe(150);
    });

    it('should handle empty transactions', function() {
      TransactionFactory.getTransactions.and.returnValue($q.resolve([]));
      CategorizationService.categorizeTransactions.and.returnValue([]);
      AggregationService.aggregateByCategory.and.returnValue([]);
      AggregationService.aggregateByMonth.and.returnValue([]);

      var result;

      AnalyticsService.getSpendingInsights(new Date(), new Date()).then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.categorySpending).toEqual([]);
      expect(result.monthlyTrends).toEqual([]);
      expect(result.totalSpend).toBe(0);
    });

    it('should reject promise when TransactionFactory fails', function() {
      TransactionFactory.getTransactions.and.returnValue($q.reject('Transaction error'));

      var error;

      AnalyticsService.getSpendingInsights(new Date(), new Date()).catch(function(err) {
        error = err;
      });

      $rootScope.$apply();

      expect(error).toBe('Transaction error');
    });

    it('should cache insights after first retrieval', function() {
      var result1, result2;

      AnalyticsService.getSpendingInsights(new Date(), new Date()).then(function(data) {
        result1 = data;
      });

      $rootScope.$apply();

      AnalyticsService.getSpendingInsights(new Date(), new Date()).then(function(data) {
        result2 = data;
      });

      $rootScope.$apply();

      expect(result1).toEqual(result2);
      expect(TransactionFactory.getTransactions.calls.count()).toBe(2);
    });
  });
});