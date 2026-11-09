/*
Test Documentation:
- Test Name: AnalyticsEngineService - getSpendingAnalytics
- Purpose: Validates category-wise spending aggregation and monthly trend calculation
- Scenario: User requests spending analytics for a date range
- Expected Result: Returns categorySpending array with totals and percentages, and monthlyTrend array sorted by month
*/
/*
Coverage Report:
- Functions tested: getSpendingAnalytics, getInsights
- Scenarios covered: successful analytics calculation, empty transactions, category aggregation, monthly trend sorting, percentage calculation
- Uncovered scenarios: none
*/

describe('AnalyticsEngineService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AnalyticsEngineService, TransactionService, $q, $rootScope;
  
  beforeEach(inject(function(_AnalyticsEngineService_, _TransactionService_, _$q_, _$rootScope_) {
    AnalyticsEngineService = _AnalyticsEngineService_;
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getSpendingAnalytics', function() {
    it('should aggregate transactions by category and calculate percentages', function(done) {
      var mockTransactions = [
        { amount: 1000, category: 'Food & Dining', date: new Date('2023-01-15') },
        { amount: 500, category: 'Fuel', date: new Date('2023-01-20') },
        { amount: 1500, category: 'Food & Dining', date: new Date('2023-02-10') }
      ];
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      
      AnalyticsEngineService.getSpendingAnalytics('U001', { from: '2023-01-01', to: '2023-02-28' }).then(function(result) {
        expect(result.categorySpending).toBeDefined();
        expect(result.categorySpending.length).toBe(2);
        var foodDining = result.categorySpending.find(function(c) { return c.category === 'Food & Dining'; });
        expect(foodDining.totalAmount).toBe(2500);
        expect(foodDining.transactionCount).toBe(2);
        expect(parseFloat(foodDining.percentageOfTotal)).toBeCloseTo(83.33, 1);
        done();
      });
      $rootScope.$apply();
    });
    
    it('should aggregate transactions by month and sort chronologically', function(done) {
      var mockTransactions = [
        { amount: 1000, category: 'Shopping', date: new Date('2023-03-15') },
        { amount: 500, category: 'Fuel', date: new Date('2023-01-20') },
        { amount: 1500, category: 'Travel', date: new Date('2023-02-10') }
      ];
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      
      AnalyticsEngineService.getSpendingAnalytics('U001', {}).then(function(result) {
        expect(result.monthlyTrend).toBeDefined();
        expect(result.monthlyTrend.length).toBe(3);
        expect(result.monthlyTrend[0].month).toBe('2023-01');
        expect(result.monthlyTrend[1].month).toBe('2023-02');
        expect(result.monthlyTrend[2].month).toBe('2023-03');
        expect(result.monthlyTrend[0].totalSpend).toBe(500);
        done();
      });
      $rootScope.$apply();
    });
    
    it('should handle empty transactions array', function(done) {
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve([]));
      
      AnalyticsEngineService.getSpendingAnalytics('U001', {}).then(function(result) {
        expect(result.categorySpending).toEqual([]);
        expect(result.monthlyTrend).toEqual([]);
        done();
      });
      $rootScope.$apply();
    });
  });
  
  describe('getInsights', function() {
    it('should return category insights with percentage of total', function(done) {
      var mockTransactions = [
        { amount: 2000, category: 'Entertainment', date: new Date('2023-01-15') },
        { amount: 1000, category: 'Utilities', date: new Date('2023-01-20') },
        { amount: 3000, category: 'Entertainment', date: new Date('2023-02-10') }
      ];
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      
      AnalyticsEngineService.getInsights('U001', { months: 12 }).then(function(result) {
        expect(result.categoryInsights).toBeDefined();
        expect(result.categoryInsights.length).toBe(2);
        var entertainment = result.categoryInsights.find(function(c) { return c.category === 'Entertainment'; });
        expect(entertainment.totalSpend).toBe(5000);
        expect(entertainment.transactionCount).toBe(2);
        expect(parseFloat(entertainment.percentageOfTotal)).toBeCloseTo(83.33, 1);
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return monthly trends with category breakdown', function(done) {
      var mockTransactions = [
        { amount: 1000, category: 'Food & Dining', date: new Date('2023-01-15') },
        { amount: 500, category: 'Fuel', date: new Date('2023-01-20') },
        { amount: 1500, category: 'Food & Dining', date: new Date('2023-02-10') }
      ];
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      
      AnalyticsEngineService.getInsights('U001', { months: 12 }).then(function(result) {
        expect(result.monthlyTrends).toBeDefined();
        expect(result.monthlyTrends.length).toBe(2);
        expect(result.monthlyTrends[0].month).toBe('2023-01');
        expect(result.monthlyTrends[0].totalSpend).toBe(1500);
        expect(result.monthlyTrends[0].categoryBreakdown.length).toBe(2);
        done();
      });
      $rootScope.$apply();
    });
    
    it('should use default 12 months if dateRange not provided', function(done) {
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve([]));
      
      AnalyticsEngineService.getInsights('U001').then(function() {
        expect(TransactionService.fetchTransactions).toHaveBeenCalledWith('U001', { months: 12 });
        done();
      });
      $rootScope.$apply();
    });
  });
});