/*
Test Documentation:
- Test Name: AnalyticsEngine Service - getInsights
- Purpose: Validates that getInsights aggregates transactions by category and month correctly
- Scenario: User requests analytics insights with 12-month date range
- Expected Result: Returns categoryInsights and monthlyTrends with correct aggregations
*/
/*
Test Documentation:
- Test Name: AnalyticsEngine Service - getSpendingAnalytics
- Purpose: Validates that getSpendingAnalytics delegates to getInsights
- Scenario: User requests spending analytics
- Expected Result: Returns same result as getInsights
*/
/*
Coverage Report:
- Functions tested: getInsights, getSpendingAnalytics, aggregateByCategory, aggregateByMonth
- Scenarios covered: successful aggregation, empty transactions, category percentage calculation, monthly sorting
- Uncovered scenarios: none
*/

describe('AnalyticsEngine Service', function() {
  'use strict';

  var AnalyticsEngine, TransactionService, $q, $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AnalyticsEngine_, _TransactionService_, _$q_, _$rootScope_) {
    AnalyticsEngine = _AnalyticsEngine_;
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getInsights', function() {
    it('should aggregate transactions by category and return categoryInsights', function() {
      var mockTransactions = [
        {transactionId: 't1', amount: 1000, category: 'Food & Dining', transactionDate: new Date('2024-01-15')},
        {transactionId: 't2', amount: 2000, category: 'Fuel', transactionDate: new Date('2024-01-20')},
        {transactionId: 't3', amount: 1500, category: 'Food & Dining', transactionDate: new Date('2024-02-10')}
      ];
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));

      var result;
      AnalyticsEngine.getInsights('user123', {months: 12}).then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(TransactionService.fetchTransactions).toHaveBeenCalledWith('user123', {months: 12});
      expect(result.categoryInsights).toBeDefined();
      expect(result.categoryInsights.length).toBe(2);
      var foodDining = result.categoryInsights.find(function(c) { return c.category === 'Food & Dining'; });
      expect(foodDining.totalSpend).toBe(2500);
      expect(foodDining.transactionCount).toBe(2);
      expect(foodDining.percentageOfTotal).toBe('55.56');
    });

    it('should aggregate transactions by month and return monthlyTrends sorted', function() {
      var mockTransactions = [
        {transactionId: 't1', amount: 1000, category: 'Shopping', transactionDate: new Date('2024-02-15')},
        {transactionId: 't2', amount: 2000, category: 'Fuel', transactionDate: new Date('2024-01-20')},
        {transactionId: 't3', amount: 1500, category: 'Shopping', transactionDate: new Date('2024-01-10')}
      ];
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));

      var result;
      AnalyticsEngine.getInsights('user123', {months: 6}).then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result.monthlyTrends).toBeDefined();
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].month).toBe('2024-01');
      expect(result.monthlyTrends[0].totalSpend).toBe(3500);
      expect(result.monthlyTrends[1].month).toBe('2024-02');
      expect(result.monthlyTrends[1].totalSpend).toBe(1000);
    });

    it('should handle empty transactions array', function() {
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve([]));

      var result;
      AnalyticsEngine.getInsights('user123', {months: 12}).then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result.categoryInsights).toEqual([]);
      expect(result.monthlyTrends).toEqual([]);
    });

    it('should use default date range if not provided', function() {
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve([]));

      AnalyticsEngine.getInsights('user123');
      $rootScope.$digest();

      expect(TransactionService.fetchTransactions).toHaveBeenCalledWith('user123', {months: 12});
    });
  });

  describe('getSpendingAnalytics', function() {
    it('should delegate to getInsights', function() {
      spyOn(AnalyticsEngine, 'getInsights').and.returnValue($q.resolve({categoryInsights: [], monthlyTrends: []}));

      AnalyticsEngine.getSpendingAnalytics('user123', {months: 6});
      $rootScope.$digest();

      expect(AnalyticsEngine.getInsights).toHaveBeenCalledWith('user123', {months: 6});
    });
  });

  describe('aggregateByCategory', function() {
    it('should calculate percentage of total correctly', function() {
      var mockTransactions = [
        {amount: 5000, category: 'Travel', transactionDate: new Date()},
        {amount: 3000, category: 'Food & Dining', transactionDate: new Date()},
        {amount: 2000, category: 'Travel', transactionDate: new Date()}
      ];
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));

      var result;
      AnalyticsEngine.getInsights('user123').then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      var travel = result.categoryInsights.find(function(c) { return c.category === 'Travel'; });
      expect(travel.percentageOfTotal).toBe('70.00');
    });
  });

  describe('aggregateByMonth', function() {
    it('should create category breakdown per month', function() {
      var mockTransactions = [
        {amount: 1000, category: 'Utilities', transactionDate: new Date('2024-03-10')},
        {amount: 500, category: 'Healthcare', transactionDate: new Date('2024-03-15')}
      ];
      spyOn(TransactionService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));

      var result;
      AnalyticsEngine.getInsights('user123').then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result.monthlyTrends[0].categoryBreakdown.length).toBe(2);
      expect(result.monthlyTrends[0].categoryBreakdown[0].category).toBe('Utilities');
      expect(result.monthlyTrends[0].categoryBreakdown[0].amount).toBe(1000);
    });
  });
});