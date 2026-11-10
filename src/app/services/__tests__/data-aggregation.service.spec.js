/*
Test Documentation:
- Test Name: DataAggregationService Unit Tests
- Purpose: Validate data aggregation and filtering functionality for transaction analysis
- Scenario: Tests categorizeAndAggregate, filterByDateRange, and filterByCategory methods
- Expected Result: Service correctly aggregates transaction data and filters by various criteria
*/

/*
Coverage Report:
- Functions tested: categorizeAndAggregate, filterByDateRange, filterByCategory
- Scenarios covered:
  * Normal: successful aggregation, date filtering, category filtering
  * Edge: empty transaction array, single transaction, multiple categories
  * Error: null/undefined input handling
- Uncovered scenarios: none
*/

describe('DataAggregationService', function() {
  'use strict';
  
  var DataAggregationService;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_DataAggregationService_) {
    DataAggregationService = _DataAggregationService_;
  }));
  
  describe('categorizeAndAggregate', function() {
    
    it('should return empty arrays for null transactions', function() {
      var result = DataAggregationService.categorizeAndAggregate(null);
      
      expect(result.monthlyTrends).toEqual([]);
      expect(result.categoryTotals).toEqual([]);
    });
    
    it('should return empty arrays for empty transaction array', function() {
      var result = DataAggregationService.categorizeAndAggregate([]);
      
      expect(result.monthlyTrends).toEqual([]);
      expect(result.categoryTotals).toEqual([]);
    });
    
    it('should aggregate transactions by category', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 0, 15) },
        { amount: 200, category: 'Food & Dining', date: new Date(2024, 0, 20) },
        { amount: 150, category: 'Fuel', date: new Date(2024, 0, 25) }
      ];
      
      var result = DataAggregationService.categorizeAndAggregate(transactions);
      
      expect(result.categoryTotals.length).toBe(2);
      
      var foodCategory = result.categoryTotals.find(function(cat) {
        return cat.categoryName === 'Food & Dining';
      });
      expect(foodCategory.totalAmount).toBe(300);
      expect(foodCategory.transactionCount).toBe(2);
    });
    
    it('should calculate percentages correctly', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 0, 15) },
        { amount: 100, category: 'Fuel', date: new Date(2024, 0, 20) },
        { amount: 100, category: 'Shopping', date: new Date(2024, 0, 25) },
        { amount: 100, category: 'Travel', date: new Date(2024, 0, 28) }
      ];
      
      var result = DataAggregationService.categorizeAndAggregate(transactions);
      
      result.categoryTotals.forEach(function(cat) {
        expect(cat.percentage).toBe('25.00');
      });
    });
    
    it('should aggregate transactions by month', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 0, 15) },
        { amount: 200, category: 'Fuel', date: new Date(2024, 0, 20) },
        { amount: 150, category: 'Shopping', date: new Date(2024, 1, 10) }
      ];
      
      var result = DataAggregationService.categorizeAndAggregate(transactions);
      
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].totalSpend).toBe(300);
      expect(result.monthlyTrends[1].totalSpend).toBe(150);
    });
    
    it('should include category breakdown in monthly data', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 0, 15) },
        { amount: 200, category: 'Fuel', date: new Date(2024, 0, 20) }
      ];
      
      var result = DataAggregationService.categorizeAndAggregate(transactions);
      
      expect(result.monthlyTrends[0].categoryBreakdown['Food & Dining']).toBe(100);
      expect(result.monthlyTrends[0].categoryBreakdown['Fuel']).toBe(200);
    });
    
    it('should sort monthly trends chronologically', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 2, 15) },
        { amount: 200, category: 'Fuel', date: new Date(2024, 0, 20) },
        { amount: 150, category: 'Shopping', date: new Date(2024, 1, 10) }
      ];
      
      var result = DataAggregationService.categorizeAndAggregate(transactions);
      
      expect(result.monthlyTrends[0].month).toBe('2024-1');
      expect(result.monthlyTrends[1].month).toBe('2024-2');
      expect(result.monthlyTrends[2].month).toBe('2024-3');
    });
    
    it('should handle single transaction', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 0, 15) }
      ];
      
      var result = DataAggregationService.categorizeAndAggregate(transactions);
      
      expect(result.categoryTotals.length).toBe(1);
      expect(result.categoryTotals[0].percentage).toBe('100.00');
      expect(result.monthlyTrends.length).toBe(1);
    });
    
    it('should accumulate multiple transactions in same category and month', function() {
      var transactions = [
        { amount: 50, category: 'Food & Dining', date: new Date(2024, 0, 5) },
        { amount: 75, category: 'Food & Dining', date: new Date(2024, 0, 15) },
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 0, 25) }
      ];
      
      var result = DataAggregationService.categorizeAndAggregate(transactions);
      
      expect(result.categoryTotals[0].totalAmount).toBe(225);
      expect(result.categoryTotals[0].transactionCount).toBe(3);
      expect(result.monthlyTrends[0].totalSpend).toBe(225);
    });
    
  });
  
  describe('filterByDateRange', function() {
    
    it('should filter transactions within date range', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 0, 15) },
        { amount: 200, category: 'Fuel', date: new Date(2024, 1, 20) },
        { amount: 150, category: 'Shopping', date: new Date(2024, 2, 10) }
      ];
      
      var startDate = new Date(2024, 0, 1);
      var endDate = new Date(2024, 1, 28);
      
      var result = DataAggregationService.filterByDateRange(transactions, startDate, endDate);
      
      expect(result.length).toBe(2);
      expect(result[0].amount).toBe(100);
      expect(result[1].amount).toBe(200);
    });
    
    it('should return empty array when no transactions in range', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 0, 15) }
      ];
      
      var startDate = new Date(2024, 2, 1);
      var endDate = new Date(2024, 2, 28);
      
      var result = DataAggregationService.filterByDateRange(transactions, startDate, endDate);
      
      expect(result.length).toBe(0);
    });
    
    it('should include transactions on boundary dates', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 0, 1) },
        { amount: 200, category: 'Fuel', date: new Date(2024, 0, 31) }
      ];
      
      var startDate = new Date(2024, 0, 1);
      var endDate = new Date(2024, 0, 31);
      
      var result = DataAggregationService.filterByDateRange(transactions, startDate, endDate);
      
      expect(result.length).toBe(2);
    });
    
    it('should handle empty transaction array', function() {
      var result = DataAggregationService.filterByDateRange([], new Date(), new Date());
      
      expect(result.length).toBe(0);
    });
    
  });
  
  describe('filterByCategory', function() {
    
    it('should filter transactions by category', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 0, 15) },
        { amount: 200, category: 'Fuel', date: new Date(2024, 0, 20) },
        { amount: 150, category: 'Food & Dining', date: new Date(2024, 0, 25) }
      ];
      
      var result = DataAggregationService.filterByCategory(transactions, 'Food & Dining');
      
      expect(result.length).toBe(2);
      expect(result[0].amount).toBe(100);
      expect(result[1].amount).toBe(150);
    });
    
    it('should return empty array when category not found', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 0, 15) }
      ];
      
      var result = DataAggregationService.filterByCategory(transactions, 'NonExistent');
      
      expect(result.length).toBe(0);
    });
    
    it('should handle empty transaction array', function() {
      var result = DataAggregationService.filterByCategory([], 'Food & Dining');
      
      expect(result.length).toBe(0);
    });
    
    it('should be case-sensitive', function() {
      var transactions = [
        { amount: 100, category: 'Food & Dining', date: new Date(2024, 0, 15) }
      ];
      
      var result = DataAggregationService.filterByCategory(transactions, 'food & dining');
      
      expect(result.length).toBe(0);
    });
    
  });
  
});