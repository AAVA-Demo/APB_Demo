/*
Test Documentation:
- Test Name: TrendAnalysisService - getTrendData
- Purpose: Validates integration of historical data, time-series, and card-wise analytics
- Scenario: Fetches historical data and processes through multiple services
- Expected Result: Returns object with monthlyTrends, cardwiseData, and dateRange
*/
/*
Test Documentation:
- Test Name: TrendAnalysisService - getTrendData with card filtering
- Purpose: Validates filtering of data by specific card IDs
- Scenario: Card IDs provided to filter transactions
- Expected Result: Only transactions for specified cards are analyzed
*/
/*
Coverage Report:
- Functions tested: getTrendData
- Scenarios covered: full data processing, card filtering, empty results, error handling
- Uncovered scenarios: none
*/

describe('TrendAnalysisService', function() {
  'use strict';
  
  beforeEach(module('creditCard.trends'));
  
  var TrendAnalysisService, HistoricalDataFactory, TimeSeriesProcessorService, CardwiseAnalyticsService, $q, $rootScope;
  
  beforeEach(inject(function(_TrendAnalysisService_, _HistoricalDataFactory_, _TimeSeriesProcessorService_, _CardwiseAnalyticsService_, _$q_, _$rootScope_) {
    TrendAnalysisService = _TrendAnalysisService_;
    HistoricalDataFactory = _HistoricalDataFactory_;
    TimeSeriesProcessorService = _TimeSeriesProcessorService_;
    CardwiseAnalyticsService = _CardwiseAnalyticsService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getTrendData', function() {
    it('should process trend data from historical transactions', function() {
      var mockTransactions = [
        { transactionId: 1, amount: 100, transactionDate: '2024-01-15', cardId: 1 },
        { transactionId: 2, amount: 200, transactionDate: '2024-02-20', cardId: 2 }
      ];
      var dateRange = { startDate: '2024-01-01', endDate: '2024-03-31' };
      var mockMonthlyTrends = [{ month: '2024-01', totalSpend: 100 }];
      var mockCardwiseData = [{ cardId: 1, totalSpend: 100 }];
      
      spyOn(HistoricalDataFactory, 'fetchHistoricalData').and.returnValue($q.resolve(mockTransactions));
      spyOn(TimeSeriesProcessorService, 'aggregateByMonth').and.returnValue(mockMonthlyTrends);
      spyOn(CardwiseAnalyticsService, 'analyzeByCard').and.returnValue(mockCardwiseData);
      
      var result;
      TrendAnalysisService.getTrendData(dateRange, null).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(HistoricalDataFactory.fetchHistoricalData).toHaveBeenCalledWith(dateRange);
      expect(TimeSeriesProcessorService.aggregateByMonth).toHaveBeenCalled();
      expect(CardwiseAnalyticsService.analyzeByCard).toHaveBeenCalled();
      expect(result.monthlyTrends).toEqual(mockMonthlyTrends);
      expect(result.cardwiseData).toEqual(mockCardwiseData);
      expect(result.dateRange).toEqual(dateRange);
    });
    
    it('should filter transactions by card IDs', function() {
      var mockTransactions = [
        { transactionId: 1, amount: 100, transactionDate: '2024-01-15', cardId: 1 },
        { transactionId: 2, amount: 200, transactionDate: '2024-02-20', cardId: 2 },
        { transactionId: 3, amount: 150, transactionDate: '2024-03-10', cardId: 3 }
      ];
      var dateRange = { startDate: '2024-01-01', endDate: '2024-03-31' };
      var cardIds = [1, 2];
      
      spyOn(HistoricalDataFactory, 'fetchHistoricalData').and.returnValue($q.resolve(mockTransactions));
      spyOn(TimeSeriesProcessorService, 'aggregateByMonth').and.callFake(function(transactions) {
        return transactions;
      });
      spyOn(CardwiseAnalyticsService, 'analyzeByCard').and.callFake(function(transactions) {
        return transactions;
      });
      
      var result;
      TrendAnalysisService.getTrendData(dateRange, cardIds).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      var filteredTransactions = TimeSeriesProcessorService.aggregateByMonth.calls.argsFor(0)[0];
      expect(filteredTransactions.length).toBe(2);
      expect(filteredTransactions.every(function(t) { return cardIds.indexOf(t.cardId) !== -1; })).toBe(true);
    });
    
    it('should handle empty card filter', function() {
      var mockTransactions = [
        { transactionId: 1, amount: 100, transactionDate: '2024-01-15', cardId: 1 }
      ];
      var dateRange = { startDate: '2024-01-01', endDate: '2024-03-31' };
      
      spyOn(HistoricalDataFactory, 'fetchHistoricalData').and.returnValue($q.resolve(mockTransactions));
      spyOn(TimeSeriesProcessorService, 'aggregateByMonth').and.returnValue([]);
      spyOn(CardwiseAnalyticsService, 'analyzeByCard').and.returnValue([]);
      
      var result;
      TrendAnalysisService.getTrendData(dateRange, []).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      var processedTransactions = TimeSeriesProcessorService.aggregateByMonth.calls.argsFor(0)[0];
      expect(processedTransactions).toEqual(mockTransactions);
    });
    
    it('should handle factory error', function() {
      var dateRange = { startDate: '2024-01-01', endDate: '2024-03-31' };
      
      spyOn(HistoricalDataFactory, 'fetchHistoricalData').and.returnValue($q.reject('API Error'));
      
      var errorResult;
      TrendAnalysisService.getTrendData(dateRange, null).catch(function(error) {
        errorResult = error;
      });
      
      $rootScope.$digest();
      
      expect(errorResult).toBe('API Error');
    });
  });
});