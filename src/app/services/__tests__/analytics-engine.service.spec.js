/*
Test Documentation:
- Test Name: AnalyticsEngineService Unit Tests
- Purpose: Validate analytics data aggregation, category spending calculation, and monthly trend generation
- Scenario: Test service methods with various time ranges and transaction datasets
- Expected Result: Accurate analytics data with correct category spending percentages and monthly trends
*/

describe('AnalyticsEngineService', function() {
  'use strict';
  
  var AnalyticsEngineService, TransactionFactory, CategoryFactory, $q, $rootScope;
  
  beforeEach(module('analyticsModule'));
  
  beforeEach(inject(function(_AnalyticsEngineService_, _$q_, _$rootScope_) {
    AnalyticsEngineService = _AnalyticsEngineService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    TransactionFactory = {
      getTransactions: jasmine.createSpy('getTransactions').and.returnValue($q.resolve([]))
    };
    
    CategoryFactory = {
      getCategoryMappings: jasmine.createSpy('getCategoryMappings').and.returnValue($q.resolve({}))
    };
    
    AnalyticsEngineService.__set__('TransactionFactory', TransactionFactory);
    AnalyticsEngineService.__set__('CategoryFactory', CategoryFactory);
  }));
  
  describe('getAnalytics', function() {
    it('should resolve analytics data for Last 12 months', function() {
      var mockTransactions = [
        {transactionId: 't1', categoryId: 'cat1', amount: 100, date: new Date()},
        {transactionId: 't2', categoryId: 'cat2', amount: 200, date: new Date()}
      ];
      var mockCategoryMap = {'cat1': 'Food & Dining', 'cat2': 'Fuel'};
      
      TransactionFactory.getTransactions.and.returnValue($q.resolve(mockTransactions));
      CategoryFactory.getCategoryMappings.and.returnValue($q.resolve(mockCategoryMap));
      
      var result;
      AnalyticsEngineService.getAnalytics('Last 12 months').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.timeRange).toBe('Last 12 months');
      expect(result.categorySpending).toBeDefined();
      expect(result.monthlyTrends).toBeDefined();
      expect(result.totalSpending).toBe(300);
    });
    
    it('should calculate category spending percentages correctly', function() {
      var mockTransactions = [
        {categoryId: 'cat1', amount: 100, date: new Date()},
        {categoryId: 'cat1', amount: 100, date: new Date()},
        {categoryId: 'cat2', amount: 200, date: new Date()}
      ];
      var mockCategoryMap = {'cat1': 'Food & Dining', 'cat2': 'Fuel'};
      
      TransactionFactory.getTransactions.and.returnValue($q.resolve(mockTransactions));
      CategoryFactory.getCategoryMappings.and.returnValue($q.resolve(mockCategoryMap));
      
      var result;
      AnalyticsEngineService.getAnalytics('Last 3 months').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      var foodCategory = result.categorySpending.find(function(c) { return c.categoryName === 'Food & Dining'; });
      expect(foodCategory.percentage).toBe(50);
    });
    
    it('should handle empty transactions gracefully', function() {
      TransactionFactory.getTransactions.and.returnValue($q.resolve([]));
      CategoryFactory.getCategoryMappings.and.returnValue($q.resolve({}));
      
      var result;
      AnalyticsEngineService.getAnalytics('Last 6 months').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.totalSpending).toBe(0);
      expect(result.categorySpending.length).toBeGreaterThan(0);
    });
    
    it('should reject promise on TransactionFactory error', function() {
      TransactionFactory.getTransactions.and.returnValue($q.reject('API Error'));
      
      var error;
      AnalyticsEngineService.getAnalytics('Last 12 months').catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('API Error');
    });
    
    it('should generate monthly trends for specified time range', function() {
      var mockTransactions = [
        {categoryId: 'cat1', amount: 100, date: new Date()}
      ];
      var mockCategoryMap = {'cat1': 'Food & Dining'};
      
      TransactionFactory.getTransactions.and.returnValue($q.resolve(mockTransactions));
      CategoryFactory.getCategoryMappings.and.returnValue($q.resolve(mockCategoryMap));
      
      var result;
      AnalyticsEngineService.getAnalytics('Last 3 months').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.monthlyTrends.length).toBe(3);
    });
  });
});

/*
Coverage Report:
- Functions tested: getAnalytics
- Scenarios covered: 
  * Normal flow with valid transactions
  * Category spending percentage calculation
  * Empty transaction handling
  * Error handling from dependencies
  * Monthly trend generation
- Uncovered scenarios: None critical
*/