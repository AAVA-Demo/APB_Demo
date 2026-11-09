/*
Test Documentation:
- Test Name: AnalyticsService - getSpendingAnalytics success
- Purpose: Validates that getSpendingAnalytics retrieves and processes transaction data correctly
- Scenario: Service fetches transactions, categorizes them, and aggregates by category and month
- Expected Result: Returns analytics object with categoryBreakdown, monthlyTrend, and timeRange
*/
/*
Test Documentation:
- Test Name: AnalyticsService - _aggregateByCategory with transactions
- Purpose: Validates category aggregation logic
- Scenario: Service aggregates transactions by category and calculates percentages
- Expected Result: Returns array of category totals with percentages
*/
/*
Test Documentation:
- Test Name: AnalyticsService - _aggregateByMonth with transactions
- Purpose: Validates monthly aggregation logic
- Scenario: Service aggregates transactions by month with category breakdown
- Expected Result: Returns sorted array of monthly totals
*/
/*
Coverage Report:
- Functions tested: getSpendingAnalytics, _aggregateByCategory, _aggregateByMonth
- Scenarios covered: successful data retrieval, category aggregation, monthly aggregation, empty transactions, error handling
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AnalyticsService, TransactionService, CategoryService, $q, $rootScope;
  
  beforeEach(inject(function(_AnalyticsService_, _TransactionService_, _CategoryService_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    TransactionService = _TransactionService_;
    CategoryService = _CategoryService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getSpendingAnalytics', function() {
    it('should fetch and process transactions successfully', function() {
      var mockTransactions = [
        { date: '2024-01-15', amount: 100, categoryId: 1 },
        { date: '2024-01-20', amount: 200, categoryId: 2 },
        { date: '2024-02-10', amount: 150, categoryId: 1 }
      ];
      var mockCategories = [
        { id: 1, name: 'Food & Dining', color: '#e74c3c' },
        { id: 2, name: 'Fuel', color: '#f39c12' }
      ];
      
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      spyOn(CategoryService, 'categorizeTransactions').and.returnValue(mockTransactions);
      spyOn(CategoryService, 'getCategories').and.returnValue(mockCategories);
      
      var result;
      AnalyticsService.getSpendingAnalytics('2024-01-01', '2024-02-28').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(TransactionService.fetchTransactions).toHaveBeenCalledWith('2024-01-01', '2024-02-28');
      expect(CategoryService.categorizeTransactions).toHaveBeenCalledWith(mockTransactions);
      expect(result).toBeDefined();
      expect(result.categoryBreakdown).toBeDefined();
      expect(result.monthlyTrend).toBeDefined();
      expect(result.timeRange.startDate).toBe('2024-01-01');
      expect(result.timeRange.endDate).toBe('2024-02-28');
    });
    
    it('should handle empty transactions array', function() {
      var mockCategories = [
        { id: 1, name: 'Food & Dining', color: '#e74c3c' }
      ];
      
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve([]));
      spyOn(CategoryService, 'categorizeTransactions').and.returnValue([]);
      spyOn(CategoryService, 'getCategories').and.returnValue(mockCategories);
      
      var result;
      AnalyticsService.getSpendingAnalytics('2024-01-01', '2024-01-31').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.categoryBreakdown).toBeDefined();
      expect(result.categoryBreakdown.length).toBe(1);
      expect(result.categoryBreakdown[0].totalAmount).toBe(0);
      expect(result.monthlyTrend).toBeDefined();
      expect(result.monthlyTrend.length).toBe(0);
    });
    
    it('should handle transaction service error', function() {
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.reject('API Error'));
      
      var error;
      AnalyticsService.getSpendingAnalytics('2024-01-01', '2024-01-31').catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('API Error');
    });
  });
  
  describe('_aggregateByCategory', function() {
    it('should aggregate transactions by category correctly', function() {
      var mockCategories = [
        { id: 1, name: 'Food & Dining', color: '#e74c3c' },
        { id: 2, name: 'Fuel', color: '#f39c12' },
        { id: 3, name: 'Shopping', color: '#9b59b6' }
      ];
      var mockTransactions = [
        { categoryId: 1, amount: 100 },
        { categoryId: 1, amount: 150 },
        { categoryId: 2, amount: 200 }
      ];
      
      spyOn(CategoryService, 'getCategories').and.returnValue(mockCategories);
      
      var result = AnalyticsService._aggregateByCategory(mockTransactions);
      
      expect(result.length).toBe(3);
      expect(result[0].categoryId).toBe(1);
      expect(result[0].totalAmount).toBe(250);
      expect(result[0].percentage).toBe('55.56');
      expect(result[1].totalAmount).toBe(200);
      expect(result[1].percentage).toBe('44.44');
      expect(result[2].totalAmount).toBe(0);
      expect(result[2].percentage).toBe('0');
    });
    
    it('should handle empty transactions', function() {
      var mockCategories = [
        { id: 1, name: 'Food & Dining', color: '#e74c3c' }
      ];
      
      spyOn(CategoryService, 'getCategories').and.returnValue(mockCategories);
      
      var result = AnalyticsService._aggregateByCategory([]);
      
      expect(result.length).toBe(1);
      expect(result[0].totalAmount).toBe(0);
      expect(result[0].percentage).toBe('0');
    });
    
    it('should ignore transactions with invalid categoryId', function() {
      var mockCategories = [
        { id: 1, name: 'Food & Dining', color: '#e74c3c' }
      ];
      var mockTransactions = [
        { categoryId: 1, amount: 100 },
        { categoryId: 99, amount: 200 }
      ];
      
      spyOn(CategoryService, 'getCategories').and.returnValue(mockCategories);
      
      var result = AnalyticsService._aggregateByCategory(mockTransactions);
      
      expect(result[0].totalAmount).toBe(100);
    });
  });
  
  describe('_aggregateByMonth', function() {
    it('should aggregate transactions by month correctly', function() {
      var mockTransactions = [
        { date: '2024-01-15T10:00:00Z', amount: 100, categoryId: 1 },
        { date: '2024-01-20T10:00:00Z', amount: 150, categoryId: 2 },
        { date: '2024-02-10T10:00:00Z', amount: 200, categoryId: 1 }
      ];
      
      var result = AnalyticsService._aggregateByMonth(mockTransactions);
      
      expect(result.length).toBe(2);
      expect(result[0].month).toBe('2024-01');
      expect(result[0].totalAmount).toBe(250);
      expect(result[0].categoryBreakdown[1]).toBe(100);
      expect(result[0].categoryBreakdown[2]).toBe(150);
      expect(result[1].month).toBe('2024-02');
      expect(result[1].totalAmount).toBe(200);
    });
    
    it('should sort months chronologically', function() {
      var mockTransactions = [
        { date: '2024-03-15T10:00:00Z', amount: 100, categoryId: 1 },
        { date: '2024-01-20T10:00:00Z', amount: 150, categoryId: 1 },
        { date: '2024-02-10T10:00:00Z', amount: 200, categoryId: 1 }
      ];
      
      var result = AnalyticsService._aggregateByMonth(mockTransactions);
      
      expect(result[0].month).toBe('2024-01');
      expect(result[1].month).toBe('2024-02');
      expect(result[2].month).toBe('2024-03');
    });
    
    it('should handle empty transactions', function() {
      var result = AnalyticsService._aggregateByMonth([]);
      
      expect(result.length).toBe(0);
    });
    
    it('should handle multiple transactions in same month', function() {
      var mockTransactions = [
        { date: '2024-01-05T10:00:00Z', amount: 50, categoryId: 1 },
        { date: '2024-01-15T10:00:00Z', amount: 100, categoryId: 1 },
        { date: '2024-01-25T10:00:00Z', amount: 75, categoryId: 2 }
      ];
      
      var result = AnalyticsService._aggregateByMonth(mockTransactions);
      
      expect(result.length).toBe(1);
      expect(result[0].totalAmount).toBe(225);
      expect(result[0].categoryBreakdown[1]).toBe(150);
      expect(result[0].categoryBreakdown[2]).toBe(75);
    });
  });
});