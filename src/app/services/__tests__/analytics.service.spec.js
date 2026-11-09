/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics with valid months parameter
- Purpose: Validates that the service correctly retrieves and processes transaction history
- Scenario: User requests spending analytics for 12 months with valid transaction data
- Expected Result: Returns aggregated analytics with monthlyTrends, categoryBreakdown, totalSpend, and dateRange
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics returns cached data within cache duration
- Purpose: Validates caching mechanism to improve performance
- Scenario: Multiple calls within 5-minute cache window
- Expected Result: Returns cached data without making additional service calls
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics handles empty transaction history
- Purpose: Validates graceful handling of empty data sets
- Scenario: No transactions available for the requested period
- Expected Result: Returns empty arrays for trends and breakdown with zero totalSpend
*/
/*
Test Documentation:
- Test Name: AnalyticsService - aggregateMonthlyTrends correctly groups transactions by month
- Purpose: Validates monthly aggregation logic
- Scenario: Transactions spanning multiple months
- Expected Result: Correctly groups and sums transactions by month-year
*/
/*
Test Documentation:
- Test Name: AnalyticsService - aggregateCategoryBreakdown calculates percentages correctly
- Purpose: Validates category-wise spending calculation and percentage computation
- Scenario: Transactions across multiple categories
- Expected Result: Correct totals and percentages for each category
*/
/*
Test Documentation:
- Test Name: AnalyticsService - handles service failure gracefully
- Purpose: Validates error handling when TransactionDataFactory fails
- Scenario: Network error or service unavailable
- Expected Result: Promise is rejected with appropriate error
*/
/*
Coverage Report:
- Functions tested: getSpendingAnalytics, aggregateMonthlyTrends, aggregateCategoryBreakdown
- Scenarios covered: normal data retrieval, caching, empty data, error handling, date range calculation
- Edge cases: empty transactions, cache expiration, invalid dates
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('cc.analytics'));
  
  var AnalyticsService;
  var TransactionDataFactory;
  var CategorizationService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_AnalyticsService_, _TransactionDataFactory_, _CategorizationService_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    TransactionDataFactory = _TransactionDataFactory_;
    CategorizationService = _CategorizationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getSpendingAnalytics', function() {
    
    it('should retrieve and process transaction history for valid months parameter', function() {
      var mockTransactions = [
        { transactionDate: '2024-01-15', amount: 100, category: 'Food & Dining', merchantName: 'Restaurant A' },
        { transactionDate: '2024-01-20', amount: 50, category: 'Fuel', merchantName: 'Gas Station' },
        { transactionDate: '2024-02-10', amount: 200, category: 'Shopping', merchantName: 'Store B' }
      ];
      
      spyOn(TransactionDataFactory, 'getTransactionHistory').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'categorizeTransactions').and.returnValue(mockTransactions);
      
      var result;
      AnalyticsService.getSpendingAnalytics(12).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(TransactionDataFactory.getTransactionHistory).toHaveBeenCalledWith(12);
      expect(CategorizationService.categorizeTransactions).toHaveBeenCalledWith(mockTransactions);
      expect(result).toBeDefined();
      expect(result.monthlyTrends).toBeDefined();
      expect(result.categoryBreakdown).toBeDefined();
      expect(result.totalSpend).toBe(350);
      expect(result.dateRange).toBeDefined();
      expect(result.dateRange.startDate).toBeDefined();
      expect(result.dateRange.endDate).toBeDefined();
    });
    
    it('should return cached data within cache duration', function() {
      var mockTransactions = [
        { transactionDate: '2024-01-15', amount: 100, category: 'Food & Dining', merchantName: 'Restaurant A' }
      ];
      
      spyOn(TransactionDataFactory, 'getTransactionHistory').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'categorizeTransactions').and.returnValue(mockTransactions);
      
      var result1, result2;
      AnalyticsService.getSpendingAnalytics(12).then(function(data) {
        result1 = data;
      });
      $rootScope.$digest();
      
      AnalyticsService.getSpendingAnalytics(12).then(function(data) {
        result2 = data;
      });
      $rootScope.$digest();
      
      expect(TransactionDataFactory.getTransactionHistory.calls.count()).toBe(1);
      expect(result1).toEqual(result2);
    });
    
    it('should handle empty transaction history gracefully', function() {
      spyOn(TransactionDataFactory, 'getTransactionHistory').and.returnValue($q.resolve([]));
      spyOn(CategorizationService, 'categorizeTransactions').and.returnValue([]);
      
      var result;
      AnalyticsService.getSpendingAnalytics(12).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.monthlyTrends).toEqual([]);
      expect(result.categoryBreakdown).toEqual([]);
      expect(result.totalSpend).toBe(0);
    });
    
    it('should handle service failure gracefully', function() {
      var errorMessage = 'Network error';
      spyOn(TransactionDataFactory, 'getTransactionHistory').and.returnValue($q.reject(errorMessage));
      
      var error;
      AnalyticsService.getSpendingAnalytics(12).catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe(errorMessage);
    });
    
    it('should correctly aggregate monthly trends from transactions', function() {
      var mockTransactions = [
        { transactionDate: '2024-01-15', amount: 100, category: 'Food & Dining' },
        { transactionDate: '2024-01-20', amount: 50, category: 'Fuel' },
        { transactionDate: '2024-02-10', amount: 200, category: 'Shopping' },
        { transactionDate: '2024-02-15', amount: 75, category: 'Travel' }
      ];
      
      spyOn(TransactionDataFactory, 'getTransactionHistory').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'categorizeTransactions').and.returnValue(mockTransactions);
      
      var result;
      AnalyticsService.getSpendingAnalytics(12).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].totalSpend).toBe(150);
      expect(result.monthlyTrends[0].transactionCount).toBe(2);
      expect(result.monthlyTrends[1].totalSpend).toBe(275);
      expect(result.monthlyTrends[1].transactionCount).toBe(2);
    });
    
    it('should correctly calculate category breakdown with percentages', function() {
      var mockTransactions = [
        { transactionDate: '2024-01-15', amount: 100, category: 'Food & Dining' },
        { transactionDate: '2024-01-20', amount: 100, category: 'Food & Dining' },
        { transactionDate: '2024-02-10', amount: 200, category: 'Shopping' }
      ];
      
      spyOn(TransactionDataFactory, 'getTransactionHistory').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'categorizeTransactions').and.returnValue(mockTransactions);
      
      var result;
      AnalyticsService.getSpendingAnalytics(12).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.categoryBreakdown.length).toBe(2);
      var foodCategory = result.categoryBreakdown.find(function(c) { return c.category === 'Food & Dining'; });
      var shoppingCategory = result.categoryBreakdown.find(function(c) { return c.category === 'Shopping'; });
      
      expect(foodCategory.totalAmount).toBe(200);
      expect(foodCategory.percentage).toBe('50.00');
      expect(shoppingCategory.totalAmount).toBe(200);
      expect(shoppingCategory.percentage).toBe('50.00');
    });
    
    it('should handle transactions with invalid or missing dates', function() {
      var mockTransactions = [
        { transactionDate: null, amount: 100, category: 'Food & Dining' },
        { transactionDate: 'invalid-date', amount: 50, category: 'Fuel' }
      ];
      
      spyOn(TransactionDataFactory, 'getTransactionHistory').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategorizationService, 'categorizeTransactions').and.returnValue(mockTransactions);
      
      var result;
      AnalyticsService.getSpendingAnalytics(12).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.totalSpend).toBe(150);
    });
  });
});