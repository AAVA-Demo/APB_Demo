/*
Test Documentation:
- Test Name: AnalyticsService - Transaction Aggregation
- Purpose: Validate transaction aggregation by category and month
- Scenario: Test aggregateByCategory and aggregateByMonth
- Expected Result: Transactions aggregated correctly with totals and percentages
*/

describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.analytics'));
  
  var AnalyticsService;
  var mockTransactions = [
    {transactionId: '1', merchantName: 'Restaurant A', category: 'Food & Dining', amount: 45.50, transactionDate: '2026-11-05T12:30:00Z'},
    {transactionId: '2', merchantName: 'Restaurant B', category: 'Food & Dining', amount: 30.00, transactionDate: '2026-11-10T18:00:00Z'},
    {transactionId: '3', merchantName: 'Gas Station', category: 'Fuel', amount: 60.00, transactionDate: '2026-11-08T08:15:00Z'},
    {transactionId: '4', merchantName: 'Store A', category: 'Shopping', amount: 120.00, transactionDate: '2026-10-15T14:20:00Z'},
    {transactionId: '5', merchantName: 'Store B', category: 'Shopping', amount: 80.00, transactionDate: '2026-10-20T16:45:00Z'}
  ];
  
  beforeEach(inject(function(_AnalyticsService_) {
    AnalyticsService = _AnalyticsService_;
  }));
  
  describe('aggregateByCategory', function() {
    it('should aggregate transactions by category', function() {
      var result = AnalyticsService.aggregateByCategory(mockTransactions);
      
      expect(result.length).toBe(3);
      
      var foodCategory = result.find(function(cat) { return cat.category === 'Food & Dining'; });
      expect(foodCategory.totalAmount).toBe(75.50);
      expect(foodCategory.transactionCount).toBe(2);
      
      var fuelCategory = result.find(function(cat) { return cat.category === 'Fuel'; });
      expect(fuelCategory.totalAmount).toBe(60.00);
      expect(fuelCategory.transactionCount).toBe(1);
      
      var shoppingCategory = result.find(function(cat) { return cat.category === 'Shopping'; });
      expect(shoppingCategory.totalAmount).toBe(200.00);
      expect(shoppingCategory.transactionCount).toBe(2);
    });
    
    it('should calculate percentage for each category', function() {
      var result = AnalyticsService.aggregateByCategory(mockTransactions);
      var total = 335.50;
      
      var foodCategory = result.find(function(cat) { return cat.category === 'Food & Dining'; });
      var expectedPercentage = ((75.50 / total) * 100).toFixed(2);
      expect(foodCategory.percentage).toBe(expectedPercentage);
    });
    
    it('should handle empty transaction array', function() {
      var result = AnalyticsService.aggregateByCategory([]);
      expect(result).toEqual([]);
    });
    
    it('should handle single transaction', function() {
      var singleTransaction = [mockTransactions[0]];
      var result = AnalyticsService.aggregateByCategory(singleTransaction);
      
      expect(result.length).toBe(1);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[0].totalAmount).toBe(45.50);
      expect(result[0].percentage).toBe('100.00');
    });
  });
  
  describe('aggregateByMonth', function() {
    it('should aggregate transactions by month', function() {
      var result = AnalyticsService.aggregateByMonth(mockTransactions);
      
      expect(result.length).toBe(2);
      expect(result[0].month).toBe('2026-10');
      expect(result[1].month).toBe('2026-11');
    });
    
    it('should calculate total spend per month', function() {
      var result = AnalyticsService.aggregateByMonth(mockTransactions);
      
      var oct2026 = result.find(function(m) { return m.month === '2026-10'; });
      expect(oct2026.totalSpend).toBe(200.00);
      
      var nov2026 = result.find(function(m) { return m.month === '2026-11'; });
      expect(nov2026.totalSpend).toBe(135.50);
    });
    
    it('should include category breakdown per month', function() {
      var result = AnalyticsService.aggregateByMonth(mockTransactions);
      
      var nov2026 = result.find(function(m) { return m.month === '2026-11'; });
      expect(nov2026.categoryBreakdown.length).toBe(2);
      
      var foodBreakdown = nov2026.categoryBreakdown.find(function(c) { return c.category === 'Food & Dining'; });
      expect(foodBreakdown.amount).toBe(75.50);
      
      var fuelBreakdown = nov2026.categoryBreakdown.find(function(c) { return c.category === 'Fuel'; });
      expect(fuelBreakdown.amount).toBe(60.00);
    });
    
    it('should sort months chronologically', function() {
      var result = AnalyticsService.aggregateByMonth(mockTransactions);
      
      expect(result[0].month).toBe('2026-10');
      expect(result[1].month).toBe('2026-11');
    });
    
    it('should handle empty transaction array', function() {
      var result = AnalyticsService.aggregateByMonth([]);
      expect(result).toEqual([]);
    });
    
    it('should handle single month transactions', function() {
      var singleMonthTransactions = mockTransactions.filter(function(t) {
        return t.transactionDate.startsWith('2026-11');
      });
      
      var result = AnalyticsService.aggregateByMonth(singleMonthTransactions);
      expect(result.length).toBe(1);
      expect(result[0].month).toBe('2026-11');
    });
  });
});

/*
Coverage Report:
- Functions tested: aggregateByCategory, aggregateByMonth
- Scenarios covered: category aggregation with totals/percentages, month aggregation with category breakdown, sorting, empty arrays
- Edge cases: empty transactions, single transaction, single month, percentage calculation
- Uncovered scenarios: none
*/