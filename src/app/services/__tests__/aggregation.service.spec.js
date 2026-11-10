/*
Test Documentation:
- Test Name: AggregationService - calculateCategoryTotals
- Purpose: Validates category-wise transaction aggregation with totals, counts, and percentages
- Scenario: Service receives categorized transactions and calculates category totals
- Expected Result: Returns accurate category totals with rounded amounts and percentages

- Test Name: AggregationService - calculateCategoryTotals with empty array
- Purpose: Validates handling of empty transaction array
- Scenario: Service receives empty transaction array
- Expected Result: Returns empty array without errors

- Test Name: AggregationService - calculateMonthlyTrends
- Purpose: Validates monthly trend calculation with category breakdown
- Scenario: Service receives transactions spanning multiple months
- Expected Result: Returns monthly aggregated data sorted chronologically with category breakdown

- Test Name: AggregationService - calculateMonthlyTrends with single month
- Purpose: Validates monthly trend calculation for single month
- Scenario: Service receives transactions from single month only
- Expected Result: Returns single month data with correct totals

Coverage Report:
- Functions tested: calculateCategoryTotals, calculateMonthlyTrends
- Scenarios covered: normal aggregation, empty data, multiple months, single month, percentage calculation, rounding
- Uncovered scenarios: none
*/

describe('AggregationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AggregationService;
  
  beforeEach(inject(function(_AggregationService_) {
    AggregationService = _AggregationService_;
  }));
  
  describe('calculateCategoryTotals', function() {
    it('should calculate category totals with amounts, counts, and percentages', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 100.50 },
        { category: 'Food & Dining', amount: 50.25 },
        { category: 'Fuel', amount: 75.00 },
        { category: 'Shopping', amount: 200.00 }
      ];
      
      var result = AggregationService.calculateCategoryTotals(transactions);
      
      expect(result.length).toBe(3);
      
      var foodCategory = result.find(function(cat) { return cat.category === 'Food & Dining'; });
      expect(foodCategory).toBeDefined();
      expect(foodCategory.totalAmount).toBe(150.75);
      expect(foodCategory.transactionCount).toBe(2);
      expect(foodCategory.percentage).toBeGreaterThan(0);
    });
    
    it('should handle empty transaction array', function() {
      var result = AggregationService.calculateCategoryTotals([]);
      expect(result).toEqual([]);
    });
    
    it('should round amounts to 2 decimal places', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 100.556 },
        { category: 'Food & Dining', amount: 50.444 }
      ];
      
      var result = AggregationService.calculateCategoryTotals(transactions);
      expect(result[0].totalAmount).toBe(151.00);
    });
    
    it('should calculate percentages correctly', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 50 },
        { category: 'Fuel', amount: 50 }
      ];
      
      var result = AggregationService.calculateCategoryTotals(transactions);
      result.forEach(function(cat) {
        expect(cat.percentage).toBe(50);
      });
    });
  });
  
  describe('calculateMonthlyTrends', function() {
    it('should calculate monthly trends with category breakdown', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 100, date: new Date('2026-11-05') },
        { category: 'Fuel', amount: 75, date: new Date('2026-11-10') },
        { category: 'Shopping', amount: 200, date: new Date('2026-10-15') }
      ];
      
      var result = AggregationService.calculateMonthlyTrends(transactions);
      
      expect(result.length).toBe(2);
      expect(result[0].month).toBe('2026-10');
      expect(result[1].month).toBe('2026-11');
      expect(result[1].totalSpend).toBe(175);
      expect(result[1].categoryBreakdown).toBeDefined();
      expect(result[1].categoryBreakdown.length).toBeGreaterThan(0);
    });
    
    it('should handle single month transactions', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 100, date: new Date('2026-11-05') },
        { category: 'Fuel', amount: 50, date: new Date('2026-11-10') }
      ];
      
      var result = AggregationService.calculateMonthlyTrends(transactions);
      expect(result.length).toBe(1);
      expect(result[0].totalSpend).toBe(150);
    });
    
    it('should sort months chronologically', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 100, date: new Date('2026-12-05') },
        { category: 'Fuel', amount: 75, date: new Date('2026-10-10') },
        { category: 'Shopping', amount: 50, date: new Date('2026-11-15') }
      ];
      
      var result = AggregationService.calculateMonthlyTrends(transactions);
      expect(result[0].month).toBe('2026-10');
      expect(result[1].month).toBe('2026-11');
      expect(result[2].month).toBe('2026-12');
    });
    
    it('should not include transactions array in final result', function() {
      var transactions = [
        { category: 'Food & Dining', amount: 100, date: new Date('2026-11-05') }
      ];
      
      var result = AggregationService.calculateMonthlyTrends(transactions);
      expect(result[0].transactions).toBeUndefined();
    });
  });
});