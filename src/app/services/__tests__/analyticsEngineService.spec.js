/*
Test Documentation:
- Test Name: analyticsEngineService - computeAnalytics
- Purpose: Validates analytics computation for transactions
- Scenario: Service computes category breakdown and monthly trends
- Expected Result: Returns correct analytics with category breakdown, monthly trends, total spend, and transaction count
*/
/*
Test Documentation:
- Test Name: analyticsEngineService - recomputeAnalytics with filters
- Purpose: Validates analytics recomputation with date and category filters
- Scenario: Service filters transactions by date range and category
- Expected Result: Returns filtered analytics matching filter criteria
*/
/*
Coverage Report:
- Functions tested: computeAnalytics, recomputeAnalytics
- Scenarios covered: normal computation, empty transactions, date filtering, category filtering, combined filters
- Uncovered scenarios: none
*/

describe('analyticsEngineService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var analyticsEngineService;
  
  beforeEach(inject(function(_analyticsEngineService_) {
    analyticsEngineService = _analyticsEngineService_;
  }));
  
  describe('computeAnalytics', function() {
    it('should compute analytics for valid transactions', function() {
      var transactions = [
        {transactionId: 'txn1', amount: 100, category: 'Food & Dining', transactionDate: '2024-01-15'},
        {transactionId: 'txn2', amount: 200, category: 'Fuel', transactionDate: '2024-01-20'},
        {transactionId: 'txn3', amount: 150, category: 'Food & Dining', transactionDate: '2024-02-10'}
      ];
      
      var result = analyticsEngineService.computeAnalytics(transactions);
      
      expect(result).toBeDefined();
      expect(result.totalSpend).toBe(450);
      expect(result.transactionCount).toBe(3);
      expect(result.categoryBreakdown).toBeDefined();
      expect(result.categoryBreakdown.length).toBe(2);
      expect(result.monthlyTrends).toBeDefined();
      expect(result.monthlyTrends.length).toBe(2);
    });
    
    it('should handle empty transactions array', function() {
      var transactions = [];
      
      var result = analyticsEngineService.computeAnalytics(transactions);
      
      expect(result.totalSpend).toBe(0);
      expect(result.transactionCount).toBe(0);
      expect(result.categoryBreakdown.length).toBe(0);
      expect(result.monthlyTrends.length).toBe(0);
    });
    
    it('should calculate correct category percentages', function() {
      var transactions = [
        {transactionId: 'txn1', amount: 100, category: 'Shopping', transactionDate: '2024-01-15'},
        {transactionId: 'txn2', amount: 300, category: 'Travel', transactionDate: '2024-01-20'}
      ];
      
      var result = analyticsEngineService.computeAnalytics(transactions);
      
      var shopping = result.categoryBreakdown.find(c => c.category === 'Shopping');
      var travel = result.categoryBreakdown.find(c => c.category === 'Travel');
      
      expect(shopping.percentage).toBe('25.00');
      expect(travel.percentage).toBe('75.00');
    });
    
    it('should group transactions by month correctly', function() {
      var transactions = [
        {transactionId: 'txn1', amount: 100, category: 'Food & Dining', transactionDate: '2024-01-15'},
        {transactionId: 'txn2', amount: 200, category: 'Fuel', transactionDate: '2024-01-20'},
        {transactionId: 'txn3', amount: 150, category: 'Shopping', transactionDate: '2024-02-10'}
      ];
      
      var result = analyticsEngineService.computeAnalytics(transactions);
      
      expect(result.monthlyTrends[0].month).toBe('2024-01');
      expect(result.monthlyTrends[0].totalSpend).toBe(300);
      expect(result.monthlyTrends[1].month).toBe('2024-02');
      expect(result.monthlyTrends[1].totalSpend).toBe(150);
    });
  });
  
  describe('recomputeAnalytics', function() {
    var transactions;
    
    beforeEach(function() {
      transactions = [
        {transactionId: 'txn1', amount: 100, category: 'Food & Dining', transactionDate: '2024-01-15'},
        {transactionId: 'txn2', amount: 200, category: 'Fuel', transactionDate: '2024-02-20'},
        {transactionId: 'txn3', amount: 150, category: 'Food & Dining', transactionDate: '2024-03-10'}
      ];
    });
    
    it('should filter transactions by start date', function() {
      var filters = {startDate: '2024-02-01'};
      
      var result = analyticsEngineService.recomputeAnalytics(transactions, filters);
      
      expect(result.transactionCount).toBe(2);
      expect(result.totalSpend).toBe(350);
    });
    
    it('should filter transactions by end date', function() {
      var filters = {endDate: '2024-02-28'};
      
      var result = analyticsEngineService.recomputeAnalytics(transactions, filters);
      
      expect(result.transactionCount).toBe(2);
      expect(result.totalSpend).toBe(300);
    });
    
    it('should filter transactions by category', function() {
      var filters = {category: 'Food & Dining'};
      
      var result = analyticsEngineService.recomputeAnalytics(transactions, filters);
      
      expect(result.transactionCount).toBe(2);
      expect(result.totalSpend).toBe(250);
    });
    
    it('should not filter when category is All', function() {
      var filters = {category: 'All'};
      
      var result = analyticsEngineService.recomputeAnalytics(transactions, filters);
      
      expect(result.transactionCount).toBe(3);
      expect(result.totalSpend).toBe(450);
    });
    
    it('should apply multiple filters simultaneously', function() {
      var filters = {
        startDate: '2024-01-01',
        endDate: '2024-02-28',
        category: 'Food & Dining'
      };
      
      var result = analyticsEngineService.recomputeAnalytics(transactions, filters);
      
      expect(result.transactionCount).toBe(1);
      expect(result.totalSpend).toBe(100);
    });
  });
});