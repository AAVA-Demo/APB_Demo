/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingInsights success
- Purpose: Validates that getSpendingInsights successfully retrieves and aggregates transaction data
- Scenario: Service calls TransactionCategorizationFactory and DataAggregationService
- Expected Result: Returns aggregated spending insights with categories and monthly trends
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingInsights error handling
- Purpose: Validates error handling when TransactionCategorizationFactory fails
- Scenario: TransactionCategorizationFactory rejects promise
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getSpendingInsights
- Scenarios covered: successful data retrieval, error handling, promise resolution
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AnalyticsService;
  var $q;
  var $rootScope;
  var TransactionCategorizationFactory;
  var DataAggregationService;
  
  beforeEach(inject(function(_AnalyticsService_, _$q_, _$rootScope_, _TransactionCategorizationFactory_, _DataAggregationService_) {
    AnalyticsService = _AnalyticsService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    TransactionCategorizationFactory = _TransactionCategorizationFactory_;
    DataAggregationService = _DataAggregationService_;
  }));
  
  describe('getSpendingInsights', function() {
    it('should successfully retrieve and aggregate spending insights', function() {
      var mockTransactions = [
        {transactionId: 't1', amount: 150, category: 'Food & Dining'},
        {transactionId: 't2', amount: 200, category: 'Shopping'}
      ];
      var mockAggregated = {
        categories: [{categoryName: 'Food & Dining', totalAmount: 150}],
        monthlyTrends: [{month: '2024-01', totalSpend: 350}]
      };
      
      spyOn(TransactionCategorizationFactory, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(DataAggregationService, 'aggregateByMonthAndCategory').and.returnValue(mockAggregated);
      
      var result;
      AnalyticsService.getSpendingInsights().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(TransactionCategorizationFactory.getCategorizedTransactions).toHaveBeenCalled();
      expect(DataAggregationService.aggregateByMonthAndCategory).toHaveBeenCalledWith(mockTransactions);
      expect(result).toEqual(mockAggregated);
    });
    
    it('should handle error when TransactionCategorizationFactory fails', function() {
      var errorMessage = 'Failed to retrieve transactions';
      spyOn(TransactionCategorizationFactory, 'getCategorizedTransactions').and.returnValue($q.reject(errorMessage));
      
      var error;
      AnalyticsService.getSpendingInsights().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe(errorMessage);
    });
    
    it('should return a promise', function() {
      spyOn(TransactionCategorizationFactory, 'getCategorizedTransactions').and.returnValue($q.resolve([]));
      spyOn(DataAggregationService, 'aggregateByMonthAndCategory').and.returnValue({});
      
      var promise = AnalyticsService.getSpendingInsights();
      
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });
  });
});