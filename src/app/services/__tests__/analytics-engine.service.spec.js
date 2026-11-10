/*
Test Documentation:
- Test Name: AnalyticsEngineService - aggregateByCategory with valid transactions
- Purpose: Validates category aggregation logic
- Scenario: Given multiple transactions across different categories
- Expected Result: Returns aggregated spending by category with correct totals and percentages
*/
/*
Test Documentation:
- Test Name: AnalyticsEngineService - aggregateByMonth with valid transactions
- Purpose: Validates monthly aggregation logic
- Scenario: Given transactions spanning multiple months
- Expected Result: Returns monthly spend trends sorted chronologically
*/
/*
Coverage Report:
- Functions tested: aggregateByCategory, aggregateByMonth
- Scenarios covered: valid transactions, empty transactions, edge cases
- Uncovered scenarios: none
*/

describe('AnalyticsEngineService', function() {
  'use strict';

  beforeEach(module('creditCardApp.analytics'));

  var AnalyticsEngineService;

  beforeEach(inject(function(_AnalyticsEngineService_) {
    AnalyticsEngineService = _AnalyticsEngineService_;
  }));

  describe('aggregateByCategory', function() {
    it('should aggregate transactions by category correctly', function() {
      var transactions = [
        {category: 'Food & Dining', amount: 50},
        {category: 'Food & Dining', amount: 30},
        {category: 'Fuel', amount: 60},
        {category: 'Shopping', amount: 100}
      ];

      var result = AnalyticsEngineService.aggregateByCategory(transactions);

      expect(result.length).toBe(3);
      var foodCategory = result.find(function(r) { return r.category === 'Food & Dining'; });
      expect(foodCategory.totalSpend).toBe(80);
      expect(foodCategory.transactionCount).toBe(2);
      expect(foodCategory.percentage).toBeCloseTo(33.33, 1);
    });

    it('should handle empty transactions array', function() {
      var result = AnalyticsEngineService.aggregateByCategory([]);
      expect(result.length).toBe(0);
    });

    it('should default to Miscellaneous for transactions without category', function() {
      var transactions = [
        {amount: 50},
        {category: '', amount: 30}
      ];

      var result = AnalyticsEngineService.aggregateByCategory(transactions);

      expect(result.length).toBe(1);
      expect(result[0].category).toBe('Miscellaneous');
      expect(result[0].totalSpend).toBe(80);
    });

    it('should calculate percentage correctly when total is zero', function() {
      var transactions = [{category: 'Food & Dining', amount: 0}];
      var result = AnalyticsEngineService.aggregateByCategory(transactions);
      expect(result[0].percentage).toBe(0);
    });
  });

  describe('aggregateByMonth', function() {
    it('should aggregate transactions by month correctly', function() {
      var transactions = [
        {category: 'Food & Dining', amount: 50, transactionDate: new Date('2024-01-15')},
        {category: 'Fuel', amount: 60, transactionDate: new Date('2024-01-20')},
        {category: 'Shopping', amount: 100, transactionDate: new Date('2024-02-05')}
      ];

      var result = AnalyticsEngineService.aggregateByMonth(transactions);

      expect(result.length).toBe(2);
      expect(result[0].month).toBe('2024-01');
      expect(result[0].totalSpend).toBe(110);
      expect(result[1].month).toBe('2024-02');
      expect(result[1].totalSpend).toBe(100);
    });

    it('should include category breakdown in monthly aggregation', function() {
      var transactions = [
        {category: 'Food & Dining', amount: 50, transactionDate: new Date('2024-01-15')},
        {category: 'Fuel', amount: 60, transactionDate: new Date('2024-01-20')}
      ];

      var result = AnalyticsEngineService.aggregateByMonth(transactions);

      expect(result[0].categoryBreakdown['Food & Dining']).toBe(50);
      expect(result[0].categoryBreakdown['Fuel']).toBe(60);
    });

    it('should sort results chronologically', function() {
      var transactions = [
        {category: 'Shopping', amount: 100, transactionDate: new Date('2024-03-05')},
        {category: 'Food & Dining', amount: 50, transactionDate: new Date('2024-01-15')},
        {category: 'Fuel', amount: 60, transactionDate: new Date('2024-02-20')}
      ];

      var result = AnalyticsEngineService.aggregateByMonth(transactions);

      expect(result[0].month).toBe('2024-01');
      expect(result[1].month).toBe('2024-02');
      expect(result[2].month).toBe('2024-03');
    });

    it('should handle empty transactions array', function() {
      var result = AnalyticsEngineService.aggregateByMonth([]);
      expect(result.length).toBe(0);
    });

    it('should default category to Miscellaneous if not provided', function() {
      var transactions = [
        {amount: 50, transactionDate: new Date('2024-01-15')}
      ];

      var result = AnalyticsEngineService.aggregateByMonth(transactions);

      expect(result[0].categoryBreakdown['Miscellaneous']).toBe(50);
    });
  });
});