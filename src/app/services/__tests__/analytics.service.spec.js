/*
Test Documentation:
- Test Name: analytics.service - getSpendingAnalytics and recalculateAnalytics
- Purpose: Validate comprehensive spending analytics aggregation
- Scenario: Service processes categorized transactions to generate analytics
- Expected Result: Returns category spends, monthly trends, and card-wise spends
*/

describe('AnalyticsService (analytics.service.js)', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AnalyticsService;
  var TransactionService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_AnalyticsService_, _TransactionService_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getSpendingAnalytics', function() {
    var mockTransactions;
    
    beforeEach(function() {
      mockTransactions = [
        {transactionId: 'TX001', cardId: 'CC001', amount: 100, date: new Date('2023-01-15'), category: 'Food & Dining'},
        {transactionId: 'TX002', cardId: 'CC002', amount: 200, date: new Date('2023-02-20'), category: 'Fuel'},
        {transactionId: 'TX003', cardId: 'CC001', amount: 150, date: new Date('2023-01-25'), category: 'Food & Dining'}
      ];
    });
    
    it('should aggregate category spending correctly', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));
      
      AnalyticsService.getSpendingAnalytics().then(function(result) {
        expect(result.categorySpends).toBeDefined();
        expect(result.categorySpends.length).toBe(2);
        
        var foodDining = result.categorySpends.find(function(cs) { return cs.category === 'Food & Dining'; });
        expect(foodDining.amount).toBe(250);
        expect(foodDining.transactionCount).toBe(2);
        expect(foodDining.percentage).toBeCloseTo(55.56, 1);
        
        var fuel = result.categorySpends.find(function(cs) { return cs.category === 'Fuel'; });
        expect(fuel.amount).toBe(200);
        expect(fuel.transactionCount).toBe(1);
        expect(fuel.percentage).toBeCloseTo(44.44, 1);
        
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should calculate monthly trends correctly', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));
      
      AnalyticsService.getSpendingAnalytics().then(function(result) {
        expect(result.monthlyTrends).toBeDefined();
        expect(result.monthlyTrends.length).toBe(2);
        
        var jan = result.monthlyTrends.find(function(mt) { return mt.month === '2023-1'; });
        expect(jan.totalSpend).toBe(250);
        expect(jan.categoryBreakdown.length).toBe(1);
        expect(jan.categoryBreakdown[0].category).toBe('Food & Dining');
        expect(jan.categoryBreakdown[0].amount).toBe(250);
        
        var feb = result.monthlyTrends.find(function(mt) { return mt.month === '2023-2'; });
        expect(feb.totalSpend).toBe(200);
        
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should aggregate card-wise spending', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));
      
      AnalyticsService.getSpendingAnalytics().then(function(result) {
        expect(result.cardWiseSpends).toBeDefined();
        expect(result.cardWiseSpends.length).toBe(2);
        
        var cc001 = result.cardWiseSpends.find(function(cws) { return cws.cardId === 'CC001'; });
        expect(cc001.amount).toBe(250);
        
        var cc002 = result.cardWiseSpends.find(function(cws) { return cws.cardId === 'CC002'; });
        expect(cc002.amount).toBe(200);
        
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty transaction list', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.resolve([]));
      
      AnalyticsService.getSpendingAnalytics().then(function(result) {
        expect(result.categorySpends).toEqual([]);
        expect(result.monthlyTrends).toEqual([]);
        expect(result.cardWiseSpends).toEqual([]);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle service errors', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.reject('Service error'));
      
      AnalyticsService.getSpendingAnalytics().catch(function(error) {
        expect(error).toBe('Service error');
        done();
      });
      
      $rootScope.$apply();
    });
  });
  
  describe('recalculateAnalytics', function() {
    it('should call getSpendingAnalytics', function(done) {
      var mockResult = {
        categorySpends: [],
        monthlyTrends: [],
        cardWiseSpends: []
      };
      
      spyOn(AnalyticsService, 'getSpendingAnalytics').and.returnValue($q.resolve(mockResult));
      
      AnalyticsService.recalculateAnalytics({}).then(function(result) {
        expect(AnalyticsService.getSpendingAnalytics).toHaveBeenCalled();
        expect(result).toEqual(mockResult);
        done();
      });
      
      $rootScope.$apply();
    });
  });
});

/*
Coverage Report:
- Functions tested: getSpendingAnalytics, recalculateAnalytics
- Scenarios covered:
  * Category spending aggregation with percentages
  * Monthly trend calculation with category breakdown
  * Card-wise spending aggregation
  * Empty transaction list
  * Service error handling
  * Recalculation delegation
- Uncovered scenarios: None
- Edge cases: Empty data, service failures
*/