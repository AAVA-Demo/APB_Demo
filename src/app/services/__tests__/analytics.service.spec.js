/*
Test Documentation:
- Test Name: AnalyticsService Test Suite
- Purpose: Validate AnalyticsService functionality for retrieving and caching analytics data
- Scenario: Tests getAnalyticsData method with various parameters including caching, card filtering, and error handling
- Expected Result: Service correctly fetches, aggregates, and caches analytics data; handles errors appropriately
*/

(function() {
'use strict';

describe('AnalyticsService', function() {
  var AnalyticsService;
  var TransactionDataService;
  var DashboardKPIService;
  var DataAggregationFactory;
  var $q;
  var $rootScope;

  beforeEach(module('creditCard.analytics'));

  beforeEach(inject(function(_AnalyticsService_, _TransactionDataService_, _DashboardKPIService_, _DataAggregationFactory_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    TransactionDataService = _TransactionDataService_;
    DashboardKPIService = _DashboardKPIService_;
    DataAggregationFactory = _DataAggregationFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getAnalyticsData', function() {
    var mockTransactions;
    var mockMetrics;
    var mockCategorySpending;
    var mockMonthlyTrends;
    var mockCardWiseSpending;

    beforeEach(function() {
      mockTransactions = [
        {transactionId: 'T001', date: '2024-01-15', amount: 1200, merchant: 'Restaurant ABC', category: 'Food & Dining', cardId: 'CC001', cardName: 'Visa Platinum'},
        {transactionId: 'T002', date: '2024-01-14', amount: 3500, merchant: 'Fuel Station XYZ', category: 'Fuel', cardId: 'CC001', cardName: 'Visa Platinum'},
        {transactionId: 'T003', date: '2024-01-13', amount: 8500, merchant: 'Shopping Mall', category: 'Shopping', cardId: 'CC002', cardName: 'MasterCard Gold'}
      ];
      mockMetrics = {totalSpend: 47650, avgMonthlySpend: 6335};
      mockCategorySpending = [{category: 'Food & Dining', amount: 1200, percentage: 10}];
      mockMonthlyTrends = [{month: 'Jan', year: 2024, amount: 13200}];
      mockCardWiseSpending = [{cardId: 'CC001', cardName: 'Visa Platinum', amount: 4700}];

      spyOn(TransactionDataService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(DashboardKPIService, 'getAggregatedMetrics').and.returnValue($q.resolve(mockMetrics));
      spyOn(DataAggregationFactory, 'aggregateByCategory').and.returnValue(mockCategorySpending);
      spyOn(DataAggregationFactory, 'aggregateByMonth').and.returnValue(mockMonthlyTrends);
      spyOn(DataAggregationFactory, 'aggregateByCard').and.returnValue(mockCardWiseSpending);
    });

    it('should fetch and aggregate analytics data successfully', function() {
      var result;
      AnalyticsService.getAnalyticsData(null, null).then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(TransactionDataService.fetchTransactions).toHaveBeenCalledWith(null);
      expect(DashboardKPIService.getAggregatedMetrics).toHaveBeenCalled();
      expect(DataAggregationFactory.aggregateByCategory).toHaveBeenCalledWith(mockTransactions);
      expect(DataAggregationFactory.aggregateByMonth).toHaveBeenCalledWith(mockTransactions);
      expect(DataAggregationFactory.aggregateByCard).toHaveBeenCalledWith(mockTransactions);
      expect(result.categorySpending).toEqual(mockCategorySpending);
      expect(result.monthlyTrends).toEqual(mockMonthlyTrends);
      expect(result.cardWiseSpending).toEqual(mockCardWiseSpending);
      expect(result.totalSpend).toBe(47650);
    });

    it('should filter transactions by cardId when provided', function() {
      var result;
      AnalyticsService.getAnalyticsData(null, 'CC001').then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(DataAggregationFactory.aggregateByCategory).toHaveBeenCalled();
      var filteredTransactions = DataAggregationFactory.aggregateByCategory.calls.argsFor(0)[0];
      expect(filteredTransactions.length).toBe(2);
      expect(filteredTransactions.every(function(txn) { return txn.cardId === 'CC001'; })).toBe(true);
    });

    it('should cache analytics data when no cardId is provided', function() {
      var result1, result2;
      AnalyticsService.getAnalyticsData(null, null).then(function(data) {
        result1 = data;
      });
      $rootScope.$digest();

      AnalyticsService.getAnalyticsData(null, null).then(function(data) {
        result2 = data;
      });
      $rootScope.$digest();

      expect(TransactionDataService.fetchTransactions.calls.count()).toBe(1);
      expect(result1).toBe(result2);
    });

    it('should not use cache when cardId is provided', function() {
      AnalyticsService.getAnalyticsData(null, null);
      $rootScope.$digest();

      AnalyticsService.getAnalyticsData(null, 'CC001');
      $rootScope.$digest();

      expect(TransactionDataService.fetchTransactions.calls.count()).toBe(2);
    });

    it('should handle errors from TransactionDataService', function() {
      var error;
      TransactionDataService.fetchTransactions.and.returnValue($q.reject('Fetch error'));

      AnalyticsService.getAnalyticsData(null, null).catch(function(err) {
        error = err;
      });
      $rootScope.$digest();

      expect(error).toBe('Fetch error');
    });

    it('should handle errors from DashboardKPIService', function() {
      var error;
      DashboardKPIService.getAggregatedMetrics.and.returnValue($q.reject('KPI error'));

      AnalyticsService.getAnalyticsData(null, null).catch(function(err) {
        error = err;
      });
      $rootScope.$digest();

      expect(error).toBe('KPI error');
    });

    it('should pass dateRange to TransactionDataService', function() {
      var dateRange = {startDate: '2024-01-01', endDate: '2024-01-31'};
      AnalyticsService.getAnalyticsData(dateRange, null);
      $rootScope.$digest();

      expect(TransactionDataService.fetchTransactions).toHaveBeenCalledWith(dateRange);
    });

    it('should include dateRange in returned analytics data', function() {
      var result;
      var dateRange = {startDate: '2024-01-01', endDate: '2024-01-31'};
      AnalyticsService.getAnalyticsData(dateRange, null).then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result.dateRange).toEqual(dateRange);
    });

    it('should set empty dateRange object when not provided', function() {
      var result;
      AnalyticsService.getAnalyticsData(null, null).then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result.dateRange).toEqual({});
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: getAnalyticsData
- Scenarios covered:
  * Successful data fetch and aggregation
  * Card filtering
  * Data caching mechanism
  * Cache bypass with cardId
  * Error handling from TransactionDataService
  * Error handling from DashboardKPIService
  * Date range parameter passing
  * Date range inclusion in results
  * Empty date range handling
- Uncovered scenarios: None - comprehensive coverage achieved
*/