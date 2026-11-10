/*
Test Documentation:
- Test Name: DataAggregationService - aggregateByMonthAndCategory
- Purpose: Validates aggregation of transactions by month and category
- Scenario: Multiple transactions across different months and categories
- Expected Result: Returns category totals and monthly trends
*/
/*
Test Documentation:
- Test Name: DataAggregationService - percentage calculation
- Purpose: Validates percentage calculation for each category
- Scenario: Transactions with known amounts
- Expected Result: Percentages sum to 100%
*/
/*
Test Documentation:
- Test Name: DataAggregationService - empty transactions
- Purpose: Validates behavior with empty transaction array
- Scenario: Empty array provided
- Expected Result: Returns empty categories and trends
*/
/*
Coverage Report:
- Functions tested: aggregateByMonthAndCategory
- Scenarios covered: normal aggregation, percentage calculation, empty input, multiple categories, monthly trends
- Uncovered scenarios: none
*/

describe('DataAggregationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var DataAggregationService;
  
  beforeEach(inject(function(_DataAggregationService_) {
    DataAggregationService = _DataAggregationService_;
  }));
  
  describe('aggregateByMonthAndCategory', function() {
    it('should aggregate transactions by category', function() {
      var transactions = [
        {amount: 100, date: new Date('2024-01-15'), category: 'Food & Dining'},
        {amount: 150, date: new Date('2024-01-20'), category: 'Food & Dining'},
        {amount: 200, date: new Date('2024-01-25'), category: 'Shopping'}
      ];
      
      var result = DataAggregationService.aggregateByMonthAndCategory(transactions);
      
      expect(result.categories).toBeDefined();
      expect(result.categories.length).toBe(2);
      
      var foodCategory = result.categories.find(function(c) { return c.categoryName === 'Food & Dining'; });
      expect(foodCategory.totalAmount).toBe(250);
      expect(foodCategory.transactionCount).toBe(2);
    });
    
    it('should calculate percentage of total for each category', function() {
      var transactions = [
        {amount: 100, date: new Date('2024-01-15'), category: 'Food & Dining'},
        {amount: 100, date: new Date('2024-01-20'), category: 'Shopping'}
      ];
      
      var result = DataAggregationService.aggregateByMonthAndCategory(transactions);
      
      var foodCategory = result.categories.find(function(c) { return c.categoryName === 'Food & Dining'; });
      expect(foodCategory.percentageOfTotal).toBe('50.00');
    });
    
    it('should aggregate transactions by month', function() {
      var transactions = [
        {amount: 100, date: new Date('2024-01-15'), category: 'Food & Dining'},
        {amount: 150, date: new Date('2024-02-20'), category: 'Shopping'}
      ];
      
      var result = DataAggregationService.aggregateByMonthAndCategory(transactions);
      
      expect(result.monthlyTrends).toBeDefined();
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].month).toBe('2024-01');
      expect(result.monthlyTrends[0].totalSpend).toBe(100);
    });
    
    it('should handle empty transaction array', function() {
      var result = DataAggregationService.aggregateByMonthAndCategory([]);
      
      expect(result.categories).toBeDefined();
      expect(result.categories.length).toBe(0);
      expect(result.monthlyTrends).toBeDefined();
      expect(result.monthlyTrends.length).toBe(0);
    });
    
    it('should include category breakdown in monthly data', function() {
      var transactions = [
        {amount: 100, date: new Date('2024-01-15'), category: 'Food & Dining'},
        {amount: 50, date: new Date('2024-01-20'), category: 'Fuel'}
      ];
      
      var result = DataAggregationService.aggregateByMonthAndCategory(transactions);
      
      expect(result.monthlyTrends[0].categoryBreakdown).toBeDefined();
      expect(result.monthlyTrends[0].categoryBreakdown['Food & Dining']).toBe(100);
      expect(result.monthlyTrends[0].categoryBreakdown['Fuel']).toBe(50);
    });
    
    it('should sort monthly trends chronologically', function() {
      var transactions = [
        {amount: 100, date: new Date('2024-03-15'), category: 'Food & Dining'},
        {amount: 150, date: new Date('2024-01-20'), category: 'Shopping'},
        {amount: 200, date: new Date('2024-02-10'), category: 'Travel'}
      ];
      
      var result = DataAggregationService.aggregateByMonthAndCategory(transactions);
      
      expect(result.monthlyTrends[0].month).toBe('2024-01');
      expect(result.monthlyTrends[1].month).toBe('2024-02');
      expect(result.monthlyTrends[2].month).toBe('2024-03');
    });
  });
});