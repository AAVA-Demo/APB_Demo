/*
Test Documentation:
- Test Name: SpendingAnalyticsService - getAnalytics - aggregates transactions by month
- Purpose: Validates that the service correctly groups transactions by month and calculates monthly totals
- Scenario: User has transactions across multiple months
- Expected Result: Service returns monthly trend data with correct spend totals
*/
/*
Test Documentation:
- Test Name: SpendingAnalyticsService - getAnalytics - aggregates transactions by category
- Purpose: Validates that the service groups transactions by category with percentages
- Scenario: User has transactions in multiple spending categories
- Expected Result: Service returns category breakdown with amounts and percentages
*/
/*
Test Documentation:
- Test Name: SpendingAnalyticsService - getAnalytics - handles API errors gracefully
- Purpose: Validates error handling when transaction API call fails
- Scenario: API returns error response
- Expected Result: Service rejects promise with error
*/
/*
Coverage Report:
- Functions tested: getAnalytics
- Scenarios covered: monthly aggregation, category aggregation, percentage calculation, API success, API failure, empty data
- Uncovered scenarios: none
*/

describe('SpendingAnalyticsService', function() {
  'use strict';
  
  var SpendingAnalyticsService;
  var TransactionService;
  var CategoryClassifier;
  var $q;
  var $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_SpendingAnalyticsService_, _TransactionService_, _CategoryClassifier_, _$q_, _$rootScope_) {
    SpendingAnalyticsService = _SpendingAnalyticsService_;
    TransactionService = _TransactionService_;
    CategoryClassifier = _CategoryClassifier_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getAnalytics', function() {
    
    it('should aggregate transactions by month correctly', function() {
      var mockTransactions = [
        {date: '2024-01-15', amount: 100, merchant: 'Store A'},
        {date: '2024-01-20', amount: 200, merchant: 'Store B'},
        {date: '2024-02-10', amount: 300, merchant: 'Store C'}
      ];
      var categorizedTransactions = mockTransactions.map(function(t) {
        return angular.extend({}, t, {category: 'Shopping'});
      });
      
      var deferred = $q.defer();
      deferred.resolve(mockTransactions);
      spyOn(TransactionService, 'fetchTransactions').and.returnValue(deferred.promise);
      spyOn(CategoryClassifier, 'categorize').and.returnValue(categorizedTransactions);
      
      var result;
      SpendingAnalyticsService.getAnalytics('2024-01-01', '2024-02-28').then(function(analytics) {
        result = analytics;
      });
      $rootScope.$digest();
      
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].month).toBe('2024-01');
      expect(result.monthlyTrends[0].totalSpend).toBe(300);
      expect(result.monthlyTrends[1].month).toBe('2024-02');
      expect(result.monthlyTrends[1].totalSpend).toBe(300);
    });
    
    it('should aggregate transactions by category with percentages', function() {
      var mockTransactions = [
        {date: '2024-01-15', amount: 100, merchant: 'Restaurant'},
        {date: '2024-01-20', amount: 200, merchant: 'Gas Station'},
        {date: '2024-01-25', amount: 100, merchant: 'Restaurant'}
      ];
      var categorizedTransactions = [
        {date: '2024-01-15', amount: 100, merchant: 'Restaurant', category: 'Food & Dining'},
        {date: '2024-01-20', amount: 200, merchant: 'Gas Station', category: 'Fuel'},
        {date: '2024-01-25', amount: 100, merchant: 'Restaurant', category: 'Food & Dining'}
      ];
      
      var deferred = $q.defer();
      deferred.resolve(mockTransactions);
      spyOn(TransactionService, 'fetchTransactions').and.returnValue(deferred.promise);
      spyOn(CategoryClassifier, 'categorize').and.returnValue(categorizedTransactions);
      
      var result;
      SpendingAnalyticsService.getAnalytics('2024-01-01', '2024-01-31').then(function(analytics) {
        result = analytics;
      });
      $rootScope.$digest();
      
      expect(result.categoryBreakdown.length).toBe(2);
      var foodCategory = result.categoryBreakdown.find(function(c) { return c.category === 'Food & Dining'; });
      var fuelCategory = result.categoryBreakdown.find(function(c) { return c.category === 'Fuel'; });
      
      expect(foodCategory.amount).toBe(200);
      expect(foodCategory.percentage).toBe('50.00');
      expect(fuelCategory.amount).toBe(200);
      expect(fuelCategory.percentage).toBe('50.00');
    });
    
    it('should calculate total spend correctly', function() {
      var mockTransactions = [
        {date: '2024-01-15', amount: 150, merchant: 'Store A'},
        {date: '2024-01-20', amount: 250, merchant: 'Store B'}
      ];
      var categorizedTransactions = mockTransactions.map(function(t) {
        return angular.extend({}, t, {category: 'Shopping'});
      });
      
      var deferred = $q.defer();
      deferred.resolve(mockTransactions);
      spyOn(TransactionService, 'fetchTransactions').and.returnValue(deferred.promise);
      spyOn(CategoryClassifier, 'categorize').and.returnValue(categorizedTransactions);
      
      var result;
      SpendingAnalyticsService.getAnalytics('2024-01-01', '2024-01-31').then(function(analytics) {
        result = analytics;
      });
      $rootScope.$digest();
      
      expect(result.totalSpend).toBe(400);
    });
    
    it('should include period start and end dates in result', function() {
      var mockTransactions = [];
      var deferred = $q.defer();
      deferred.resolve(mockTransactions);
      spyOn(TransactionService, 'fetchTransactions').and.returnValue(deferred.promise);
      spyOn(CategoryClassifier, 'categorize').and.returnValue([]);
      
      var startDate = '2024-01-01';
      var endDate = '2024-01-31';
      var result;
      SpendingAnalyticsService.getAnalytics(startDate, endDate).then(function(analytics) {
        result = analytics;
      });
      $rootScope.$digest();
      
      expect(result.periodStart).toEqual(new Date(startDate));
      expect(result.periodEnd).toEqual(new Date(endDate));
    });
    
    it('should handle empty transactions array', function() {
      var mockTransactions = [];
      var deferred = $q.defer();
      deferred.resolve(mockTransactions);
      spyOn(TransactionService, 'fetchTransactions').and.returnValue(deferred.promise);
      spyOn(CategoryClassifier, 'categorize').and.returnValue([]);
      
      var result;
      SpendingAnalyticsService.getAnalytics('2024-01-01', '2024-01-31').then(function(analytics) {
        result = analytics;
      });
      $rootScope.$digest();
      
      expect(result.monthlyTrends).toEqual([]);
      expect(result.categoryBreakdown).toEqual([]);
      expect(result.totalSpend).toBe(0);
    });
    
    it('should handle API errors and reject the promise', function() {
      var deferred = $q.defer();
      deferred.reject({message: 'Failed to fetch transactions'});
      spyOn(TransactionService, 'fetchTransactions').and.returnValue(deferred.promise);
      
      var error;
      SpendingAnalyticsService.getAnalytics('2024-01-01', '2024-01-31').catch(function(err) {
        error = err;
      });
      $rootScope.$digest();
      
      expect(error).toBeDefined();
      expect(error.message).toBe('Failed to fetch transactions');
    });
    
    it('should sort monthly trends chronologically', function() {
      var mockTransactions = [
        {date: '2024-03-15', amount: 100, merchant: 'Store A'},
        {date: '2024-01-20', amount: 200, merchant: 'Store B'},
        {date: '2024-02-10', amount: 300, merchant: 'Store C'}
      ];
      var categorizedTransactions = mockTransactions.map(function(t) {
        return angular.extend({}, t, {category: 'Shopping'});
      });
      
      var deferred = $q.defer();
      deferred.resolve(mockTransactions);
      spyOn(TransactionService, 'fetchTransactions').and.returnValue(deferred.promise);
      spyOn(CategoryClassifier, 'categorize').and.returnValue(categorizedTransactions);
      
      var result;
      SpendingAnalyticsService.getAnalytics('2024-01-01', '2024-03-31').then(function(analytics) {
        result = analytics;
      });
      $rootScope.$digest();
      
      expect(result.monthlyTrends[0].month).toBe('2024-01');
      expect(result.monthlyTrends[1].month).toBe('2024-02');
      expect(result.monthlyTrends[2].month).toBe('2024-03');
    });
    
    it('should assign colors to categories in breakdown', function() {
      var mockTransactions = [
        {date: '2024-01-15', amount: 100, merchant: 'Restaurant'}
      ];
      var categorizedTransactions = [
        {date: '2024-01-15', amount: 100, merchant: 'Restaurant', category: 'Food & Dining'}
      ];
      
      var deferred = $q.defer();
      deferred.resolve(mockTransactions);
      spyOn(TransactionService, 'fetchTransactions').and.returnValue(deferred.promise);
      spyOn(CategoryClassifier, 'categorize').and.returnValue(categorizedTransactions);
      
      var result;
      SpendingAnalyticsService.getAnalytics('2024-01-01', '2024-01-31').then(function(analytics) {
        result = analytics;
      });
      $rootScope.$digest();
      
      expect(result.categoryBreakdown[0].color).toBeDefined();
      expect(result.categoryBreakdown[0].color).toBe('#FF6384');
    });
  });
});