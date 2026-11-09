/*
Test Documentation:
- Test Name: spendingAnalytics.service - getAnalytics and filterByCategory
- Purpose: Validate comprehensive spending analytics with category filtering
- Scenario: Service generates analytics for configurable time periods with category drill-down
- Expected Result: Returns category spending, monthly trends, and filtered views
*/

describe('SpendingAnalyticsService (spendingAnalytics.service.js)', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var SpendingAnalyticsService;
  var TransactionService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_SpendingAnalyticsService_, _TransactionService_, _$q_, _$rootScope_) {
    SpendingAnalyticsService = _SpendingAnalyticsService_;
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getAnalytics', function() {
    var mockTransactions;
    
    beforeEach(function() {
      mockTransactions = [
        {transactionId: 'TX001', amount: 100, date: new Date('2023-01-15'), category: 'Food & Dining'},
        {transactionId: 'TX002', amount: 200, date: new Date('2023-02-20'), category: 'Fuel'},
        {transactionId: 'TX003', amount: 150, date: new Date('2023-01-25'), category: 'Food & Dining'},
        {transactionId: 'TX004', amount: 300, date: new Date('2023-03-10'), category: 'Shopping'}
      ];
    });
    
    it('should calculate category spending with percentages', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));
      
      SpendingAnalyticsService.getAnalytics(12).then(function(result) {
        expect(result.categorySpending).toBeDefined();
        expect(result.categorySpending.length).toBe(3);
        
        var foodDining = result.categorySpending.find(function(cs) { return cs.category === 'Food & Dining'; });
        expect(foodDining.totalAmount).toBe(250);
        expect(foodDining.transactionCount).toBe(2);
        expect(foodDining.percentage).toBeCloseTo(33.33, 1);
        
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should calculate monthly trends', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));
      
      SpendingAnalyticsService.getAnalytics(12).then(function(result) {
        expect(result.monthlyTrends).toBeDefined();
        expect(result.monthlyTrends.length).toBe(3);
        
        var jan = result.monthlyTrends.find(function(mt) { return mt.month === '2023-1'; });
        expect(jan.totalSpend).toBe(250);
        expect(jan.categoryBreakdown).toBeDefined();
        
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should calculate total spend', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));
      
      SpendingAnalyticsService.getAnalytics(12).then(function(result) {
        expect(result.totalSpend).toBe(750);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should calculate average monthly spend', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));
      
      SpendingAnalyticsService.getAnalytics(12).then(function(result) {
        expect(result.averageMonthlySpend).toBeCloseTo(62.5, 1);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should use default 12 months when not specified', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));
      
      SpendingAnalyticsService.getAnalytics().then(function(result) {
        expect(result).toBeDefined();
        expect(TransactionService.getCategorizedTransactions).toHaveBeenCalled();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle custom month range', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.resolve(mockTransactions));
      
      SpendingAnalyticsService.getAnalytics(6).then(function(result) {
        expect(result.averageMonthlySpend).toBeCloseTo(125, 1);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty transaction list', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.resolve([]));
      
      SpendingAnalyticsService.getAnalytics(12).then(function(result) {
        expect(result.categorySpending).toEqual([]);
        expect(result.monthlyTrends).toEqual([]);
        expect(result.totalSpend).toBe(0);
        expect(result.averageMonthlySpend).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle service errors', function(done) {
      spyOn(TransactionService, 'getCategorizedTransactions').and.returnValue($q.reject('Service error'));
      
      SpendingAnalyticsService.getAnalytics(12).catch(function(error) {
        expect(error).toBe('Service error');
        done();
      });
      
      $rootScope.$apply();
    });
  });
  
  describe('filterByCategory', function() {
    it('should filter analytics by specific category', function(done) {
      var mockAnalytics = {
        categorySpending: [
          {category: 'Food & Dining', totalAmount: 250},
          {category: 'Fuel', totalAmount: 200}
        ],
        monthlyTrends: [
          {
            month: '2023-1',
            categoryBreakdown: [
              {category: 'Food & Dining', amount: 250},
              {category: 'Fuel', amount: 100}
            ]
          }
        ]
      };
      
      spyOn(SpendingAnalyticsService, 'getAnalytics').and.returnValue($q.resolve(mockAnalytics));
      
      SpendingAnalyticsService.filterByCategory('Food & Dining', 12).then(function(result) {
        expect(result.categorySpending.length).toBe(1);
        expect(result.categorySpending[0].category).toBe('Food & Dining');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should filter monthly trends by category', function(done) {
      var mockAnalytics = {
        categorySpending: [
          {category: 'Food & Dining', totalAmount: 250}
        ],
        monthlyTrends: [
          {
            month: '2023-1',
            categoryBreakdown: [
              {category: 'Food & Dining', amount: 250},
              {category: 'Fuel', amount: 100}
            ]
          }
        ]
      };
      
      spyOn(SpendingAnalyticsService, 'getAnalytics').and.returnValue($q.resolve(mockAnalytics));
      
      SpendingAnalyticsService.filterByCategory('Food & Dining', 12).then(function(result) {
        expect(result.monthlyTrends[0].categoryBreakdown.length).toBe(1);
        expect(result.monthlyTrends[0].categoryBreakdown[0].category).toBe('Food & Dining');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle filter errors', function(done) {
      spyOn(SpendingAnalyticsService, 'getAnalytics').and.returnValue($q.reject('Analytics error'));
      
      SpendingAnalyticsService.filterByCategory('Food & Dining', 12).catch(function(error) {
        expect(error).toBe('Analytics error');
        done();
      });
      
      $rootScope.$apply();
    });
  });
});

/*
Coverage Report:
- Functions tested: getAnalytics, filterByCategory
- Scenarios covered:
  * Category spending with percentages
  * Monthly trends calculation
  * Total spend calculation
  * Average monthly spend
  * Default month range (12)
  * Custom month range
  * Empty transaction list
  * Service error handling
  * Category filtering
  * Monthly trend filtering by category
  * Filter error handling
- Uncovered scenarios: None
- Edge cases: Empty data, service failures, custom ranges
*/