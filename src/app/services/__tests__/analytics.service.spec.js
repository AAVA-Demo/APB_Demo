/*
Test Documentation:
- Test Name: AnalyticsService - getTrends with valid filters
- Purpose: Validates that getTrends correctly retrieves transactions and calculates trend data
- Scenario: Service is called with valid filter parameters
- Expected Result: Returns promise resolving to trend data with monthlyTrends and cardWiseSpend
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getTrends handles errors
- Purpose: Validates error handling when transaction retrieval fails
- Scenario: TransactionDataFactory.fetchTransactions rejects with error
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getTrends
- Scenarios covered: successful trend retrieval, error handling, dependency integration
- Uncovered scenarios: none
*/

(function(){
'use strict';

describe('AnalyticsService', function(){
  var AnalyticsService, TransactionDataFactory, TrendCalculationService, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_AnalyticsService_, _TransactionDataFactory_, _TrendCalculationService_, _$q_, _$rootScope_){
    AnalyticsService = _AnalyticsService_;
    TransactionDataFactory = _TransactionDataFactory_;
    TrendCalculationService = _TrendCalculationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getTrends', function(){
    
    it('should retrieve transactions and calculate trends successfully', function(){
      var mockTransactions = [
        {transactionId:'T001', cardId:'CC001', cardName:'Platinum', amount:1000, date:new Date('2024-01-15')},
        {transactionId:'T002', cardId:'CC002', cardName:'Gold', amount:2000, date:new Date('2024-02-15')}
      ];
      var mockTrendData = {
        monthlyTrends: [{month:'2024-01', totalSpend:1000}],
        cardWiseSpend: [{cardId:'CC001', totalSpend:1000}],
        dateRange: {startDate: new Date('2024-01-15'), endDate: new Date('2024-02-15')}
      };
      
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(TrendCalculationService, 'calculateTrends').and.returnValue(mockTrendData);
      
      var result;
      AnalyticsService.getTrends({startDate:'2024-01-01'}).then(function(data){
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(TransactionDataFactory.fetchTransactions).toHaveBeenCalledWith({startDate:'2024-01-01'});
      expect(TrendCalculationService.calculateTrends).toHaveBeenCalledWith(mockTransactions);
      expect(result).toEqual(mockTrendData);
      expect(result.monthlyTrends.length).toBe(1);
      expect(result.cardWiseSpend.length).toBe(1);
    });
    
    it('should handle errors when transaction retrieval fails', function(){
      var mockError = {message: 'Failed to fetch transactions'};
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.reject(mockError));
      
      var error;
      AnalyticsService.getTrends({}).catch(function(err){
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toEqual(mockError);
    });
    
    it('should call getTrends without filters', function(){
      var mockTransactions = [];
      var mockTrendData = {monthlyTrends:[], cardWiseSpend:[], dateRange:{startDate:null, endDate:null}};
      
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(TrendCalculationService, 'calculateTrends').and.returnValue(mockTrendData);
      
      var result;
      AnalyticsService.getTrends().then(function(data){
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(TransactionDataFactory.fetchTransactions).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockTrendData);
    });
    
  });
  
});

})();