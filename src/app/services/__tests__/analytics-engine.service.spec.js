/*
Test Documentation:
- Test Name: AnalyticsEngineService - getSpendingAnalytics success scenario
- Purpose: Validates that getSpendingAnalytics correctly aggregates transaction data into category breakdown, monthly trends, and card-wise spending
- Scenario: Service receives transactions and processes them into analytics
- Expected Result: Returns properly formatted analytics object with accurate calculations to 2 decimal places
*/
/*
Test Documentation:
- Test Name: AnalyticsEngineService - getSpendingAnalytics error handling
- Purpose: Validates error handling when TransactionApiService fails
- Scenario: TransactionApiService rejects the promise
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getSpendingAnalytics
- Scenarios covered: successful analytics calculation, error handling, category classification, monthly aggregation, card-wise aggregation, decimal precision
- Uncovered scenarios: none
*/

describe('AnalyticsEngineService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AnalyticsEngineService;
  var TransactionApiService;
  var CategoryClassifierFactory;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_AnalyticsEngineService_, _TransactionApiService_, _CategoryClassifierFactory_, _$q_, _$rootScope_) {
    AnalyticsEngineService = _AnalyticsEngineService_;
    TransactionApiService = _TransactionApiService_;
    CategoryClassifierFactory = _CategoryClassifierFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getSpendingAnalytics', function() {
    it('should successfully aggregate transaction data into analytics', function() {
      var mockTransactions = [
        {transactionId: 'tx1', cardId: 'card1', amount: 1500.50, date: new Date('2024-01-15'), category: 'Food & Dining'},
        {transactionId: 'tx2', cardId: 'card1', amount: 2000.75, date: new Date('2024-01-20'), category: 'Fuel'},
        {transactionId: 'tx3', cardId: 'card2', amount: 3500.00, date: new Date('2024-02-10'), category: 'Shopping'}
      ];
      
      spyOn(TransactionApiService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategoryClassifierFactory, 'classify').and.callFake(function(tx) {
        return tx.category;
      });
      
      var result;
      AnalyticsEngineService.getSpendingAnalytics(12).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(TransactionApiService.getTransactions).toHaveBeenCalledWith(12);
      expect(result).toBeDefined();
      expect(result.categoryBreakdown).toBeDefined();
      expect(result.categoryBreakdown['Food & Dining']).toBe(1500.50);
      expect(result.categoryBreakdown['Fuel']).toBe(2000.75);
      expect(result.categoryBreakdown['Shopping']).toBe(3500.00);
      expect(result.monthlyTrends).toBeDefined();
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.cardWiseSpend).toBeDefined();
      expect(result.cardWiseSpend.length).toBe(2);
    });
    
    it('should calculate values with 2 decimal precision', function() {
      var mockTransactions = [
        {transactionId: 'tx1', cardId: 'card1', amount: 100.123, date: new Date('2024-01-15'), category: 'Food & Dining'},
        {transactionId: 'tx2', cardId: 'card1', amount: 200.456, date: new Date('2024-01-20'), category: 'Food & Dining'}
      ];
      
      spyOn(TransactionApiService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategoryClassifierFactory, 'classify').and.returnValue('Food & Dining');
      
      var result;
      AnalyticsEngineService.getSpendingAnalytics(3).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.categoryBreakdown['Food & Dining']).toBe(300.58);
    });
    
    it('should handle empty transaction list', function() {
      spyOn(TransactionApiService, 'getTransactions').and.returnValue($q.resolve([]));
      
      var result;
      AnalyticsEngineService.getSpendingAnalytics(12).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.categoryBreakdown).toBeDefined();
      expect(result.monthlyTrends.length).toBe(0);
      expect(result.cardWiseSpend.length).toBe(0);
    });
    
    it('should reject promise when TransactionApiService fails', function() {
      spyOn(TransactionApiService, 'getTransactions').and.returnValue($q.reject('API Error'));
      
      var error;
      AnalyticsEngineService.getSpendingAnalytics(12).catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('API Error');
    });
    
    it('should aggregate monthly trends correctly', function() {
      var mockTransactions = [
        {transactionId: 'tx1', cardId: 'card1', amount: 1000, date: new Date('2024-01-15'), category: 'Shopping'},
        {transactionId: 'tx2', cardId: 'card1', amount: 2000, date: new Date('2024-01-20'), category: 'Fuel'},
        {transactionId: 'tx3', cardId: 'card2', amount: 1500, date: new Date('2024-02-10'), category: 'Food & Dining'}
      ];
      
      spyOn(TransactionApiService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategoryClassifierFactory, 'classify').and.callFake(function(tx) { return tx.category; });
      
      var result;
      AnalyticsEngineService.getSpendingAnalytics(6).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].month).toBe('2024-01');
      expect(result.monthlyTrends[0].total).toBe(3000.00);
      expect(result.monthlyTrends[1].month).toBe('2024-02');
      expect(result.monthlyTrends[1].total).toBe(1500.00);
    });
    
    it('should aggregate card-wise spending correctly', function() {
      var mockTransactions = [
        {transactionId: 'tx1', cardId: 'card1', amount: 1000, date: new Date('2024-01-15'), category: 'Shopping'},
        {transactionId: 'tx2', cardId: 'card1', amount: 2000, date: new Date('2024-01-20'), category: 'Fuel'},
        {transactionId: 'tx3', cardId: 'card2', amount: 1500, date: new Date('2024-02-10'), category: 'Food & Dining'}
      ];
      
      spyOn(TransactionApiService, 'getTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategoryClassifierFactory, 'classify').and.callFake(function(tx) { return tx.category; });
      
      var result;
      AnalyticsEngineService.getSpendingAnalytics(6).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.cardWiseSpend.length).toBe(2);
      var card1Spend = result.cardWiseSpend.find(function(c) { return c.cardId === 'card1'; });
      var card2Spend = result.cardWiseSpend.find(function(c) { return c.cardId === 'card2'; });
      expect(card1Spend.total).toBe(3000.00);
      expect(card2Spend.total).toBe(1500.00);
    });
  });
});