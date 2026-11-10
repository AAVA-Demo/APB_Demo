/*
Test Documentation:
- Test Name: trendAnalysisService - calculateTrends
- Purpose: Validates that calculateTrends computes category spending and monthly trends from transactions
- Scenario: When calculateTrends is called with categorized transactions, it should return spending analytics
- Expected Result: Returns object with categorySpending array and monthlyTrends array
*/
/*
Test Documentation:
- Test Name: trendAnalysisService - calculateTrends category spending
- Purpose: Validates that category spending is correctly aggregated and includes percentages
- Scenario: When calculateTrends processes transactions, it should sum amounts by category and calculate percentages
- Expected Result: Each category has totalAmount, transactionCount, and percentage
*/
/*
Test Documentation:
- Test Name: trendAnalysisService - calculateTrends monthly trends
- Purpose: Validates that monthly trends are correctly aggregated by month with category breakdowns
- Scenario: When calculateTrends processes transactions, it should group by month and provide category breakdowns
- Expected Result: Each month has totalSpend and categoryBreakdown array
*/
/*
Coverage Report:
- Functions tested: calculateTrends
- Scenarios covered: category aggregation, percentage calculation, monthly grouping, category breakdown, empty data handling
- Edge cases: empty array, null input, single transaction, multiple categories, multiple months
- Uncovered scenarios: none
*/

describe('trendAnalysisService', function() {
  'use strict';
  
  beforeEach(module('analyticsModule'));
  
  var trendAnalysisService;
  
  beforeEach(inject(function(_trendAnalysisService_) {
    trendAnalysisService = _trendAnalysisService_;
  }));
  
  describe('calculateTrends', function() {
    it('should be defined', function() {
      expect(trendAnalysisService.calculateTrends).toBeDefined();
      expect(typeof trendAnalysisService.calculateTrends).toBe('function');
    });
    
    it('should return object with categorySpending and monthlyTrends', function() {
      var transactions = [
        {amount: 1200, category: 'Food & Dining', transactionDate: new Date('2024-01-15')}
      ];
      var result = trendAnalysisService.calculateTrends(transactions);
      expect(result.categorySpending).toBeDefined();
      expect(result.monthlyTrends).toBeDefined();
      expect(Array.isArray(result.categorySpending)).toBe(true);
      expect(Array.isArray(result.monthlyTrends)).toBe(true);
    });
    
    it('should return empty arrays for empty input', function() {
      var result = trendAnalysisService.calculateTrends([]);
      expect(result.categorySpending).toEqual([]);
      expect(result.monthlyTrends).toEqual([]);
    });
    
    it('should return empty arrays for null input', function() {
      var result = trendAnalysisService.calculateTrends(null);
      expect(result.categorySpending).toEqual([]);
      expect(result.monthlyTrends).toEqual([]);
    });
    
    it('should return empty arrays for undefined input', function() {
      var result = trendAnalysisService.calculateTrends(undefined);
      expect(result.categorySpending).toEqual([]);
      expect(result.monthlyTrends).toEqual([]);
    });
    
    it('should aggregate spending by category', function() {
      var transactions = [
        {amount: 1200, category: 'Food & Dining', transactionDate: new Date('2024-01-15')},
        {amount: 850, category: 'Fuel', transactionDate: new Date('2024-01-18')},
        {amount: 500, category: 'Food & Dining', transactionDate: new Date('2024-01-20')}
      ];
      var result = trendAnalysisService.calculateTrends(transactions);
      var foodCategory = result.categorySpending.find(function(c) { return c.category === 'Food & Dining'; });
      var fuelCategory = result.categorySpending.find(function(c) { return c.category === 'Fuel'; });
      expect(foodCategory.totalAmount).toBe(1700);
      expect(foodCategory.transactionCount).toBe(2);
      expect(fuelCategory.totalAmount).toBe(850);
      expect(fuelCategory.transactionCount).toBe(1);
    });
    
    it('should calculate percentage for each category', function() {
      var transactions = [
        {amount: 1000, category: 'Food & Dining', transactionDate: new Date('2024-01-15')},
        {amount: 500, category: 'Fuel', transactionDate: new Date('2024-01-18')}
      ];
      var result = trendAnalysisService.calculateTrends(transactions);
      var foodCategory = result.categorySpending.find(function(c) { return c.category === 'Food & Dining'; });
      var fuelCategory = result.categorySpending.find(function(c) { return c.category === 'Fuel'; });
      expect(foodCategory.percentage).toBe('66.7');
      expect(fuelCategory.percentage).toBe('33.3');
    });
    
    it('should handle zero total spend for percentage calculation', function() {
      var transactions = [
        {amount: 0, category: 'Food & Dining', transactionDate: new Date('2024-01-15')}
      ];
      var result = trendAnalysisService.calculateTrends(transactions);
      expect(result.categorySpending[0].percentage).toBe(0);
    });
    
    it('should group transactions by month', function() {
      var transactions = [
        {amount: 1200, category: 'Food & Dining', transactionDate: new Date('2024-01-15')},
        {amount: 850, category: 'Fuel', transactionDate: new Date('2024-01-18')},
        {amount: 2500, category: 'Shopping', transactionDate: new Date('2024-02-10')}
      ];
      var result = trendAnalysisService.calculateTrends(transactions);
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].month).toBe('2024-01');
      expect(result.monthlyTrends[1].month).toBe('2024-02');
    });
    
    it('should calculate total spend per month', function() {
      var transactions = [
        {amount: 1200, category: 'Food & Dining', transactionDate: new Date('2024-01-15')},
        {amount: 850, category: 'Fuel', transactionDate: new Date('2024-01-18')},
        {amount: 2500, category: 'Shopping', transactionDate: new Date('2024-02-10')}
      ];
      var result = trendAnalysisService.calculateTrends(transactions);
      expect(result.monthlyTrends[0].totalSpend).toBe(2050);
      expect(result.monthlyTrends[1].totalSpend).toBe(2500);
    });
    
    it('should include category breakdown for each month', function() {
      var transactions = [
        {amount: 1200, category: 'Food & Dining', transactionDate: new Date('2024-01-15')},
        {amount: 850, category: 'Fuel', transactionDate: new Date('2024-01-18')}
      ];
      var result = trendAnalysisService.calculateTrends(transactions);
      expect(result.monthlyTrends[0].categoryBreakdown).toBeDefined();
      expect(Array.isArray(result.monthlyTrends[0].categoryBreakdown)).toBe(true);
      expect(result.monthlyTrends[0].categoryBreakdown.length).toBe(2);
    });
    
    it('should aggregate category spending within each month', function() {
      var transactions = [
        {amount: 1200, category: 'Food & Dining', transactionDate: new Date('2024-01-15')},
        {amount: 500, category: 'Food & Dining', transactionDate: new Date('2024-01-20')},
        {amount: 850, category: 'Fuel', transactionDate: new Date('2024-01-18')}
      ];
      var result = trendAnalysisService.calculateTrends(transactions);
      var foodBreakdown = result.monthlyTrends[0].categoryBreakdown.find(function(c) { return c.category === 'Food & Dining'; });
      var fuelBreakdown = result.monthlyTrends[0].categoryBreakdown.find(function(c) { return c.category === 'Fuel'; });
      expect(foodBreakdown.totalAmount).toBe(1700);
      expect(foodBreakdown.transactionCount).toBe(2);
      expect(fuelBreakdown.totalAmount).toBe(850);
      expect(fuelBreakdown.transactionCount).toBe(1);
    });
    
    it('should sort monthly trends chronologically', function() {
      var transactions = [
        {amount: 1200, category: 'Food & Dining', transactionDate: new Date('2024-03-15')},
        {amount: 850, category: 'Fuel', transactionDate: new Date('2024-01-18')},
        {amount: 2500, category: 'Shopping', transactionDate: new Date('2024-02-10')}
      ];
      var result = trendAnalysisService.calculateTrends(transactions);
      expect(result.monthlyTrends[0].month).toBe('2024-01');
      expect(result.monthlyTrends[1].month).toBe('2024-02');
      expect(result.monthlyTrends[2].month).toBe('2024-03');
    });
    
    it('should handle single transaction', function() {
      var transactions = [
        {amount: 1200, category: 'Food & Dining', transactionDate: new Date('2024-01-15')}
      ];
      var result = trendAnalysisService.calculateTrends(transactions);
      expect(result.categorySpending.length).toBe(1);
      expect(result.categorySpending[0].totalAmount).toBe(1200);
      expect(result.categorySpending[0].transactionCount).toBe(1);
      expect(result.categorySpending[0].percentage).toBe('100.0');
      expect(result.monthlyTrends.length).toBe(1);
      expect(result.monthlyTrends[0].totalSpend).toBe(1200);
    });
    
    it('should handle multiple transactions in same category and month', function() {
      var transactions = [
        {amount: 100, category: 'Food & Dining', transactionDate: new Date('2024-01-05')},
        {amount: 200, category: 'Food & Dining', transactionDate: new Date('2024-01-10')},
        {amount: 300, category: 'Food & Dining', transactionDate: new Date('2024-01-15')}
      ];
      var result = trendAnalysisService.calculateTrends(transactions);
      expect(result.categorySpending[0].totalAmount).toBe(600);
      expect(result.categorySpending[0].transactionCount).toBe(3);
      expect(result.monthlyTrends[0].totalSpend).toBe(600);
    });
  });
});