/*
Test Documentation:
- Test Name: AnalyticsService - aggregateByCategory with valid transactions
- Purpose: Validates category aggregation functionality
- Scenario: Service receives array of transactions with categories
- Expected Result: Returns aggregated spending by category with percentages
*/
/*
Test Documentation:
- Test Name: AnalyticsService - aggregateByCategory with empty array
- Purpose: Validates handling of empty transaction list
- Scenario: Service receives empty array
- Expected Result: Returns empty array without errors
*/
/*
Test Documentation:
- Test Name: AnalyticsService - aggregateByCategory uses cache
- Purpose: Validates caching mechanism for performance
- Scenario: Service called twice with same data
- Expected Result: Second call returns cached result
*/
/*
Test Documentation:
- Test Name: AnalyticsService - calculateMonthlyTrends with valid transactions
- Purpose: Validates monthly trend calculation
- Scenario: Service receives transactions across multiple months
- Expected Result: Returns monthly aggregated data sorted by month
*/
/*
Test Documentation:
- Test Name: AnalyticsService - calculateMonthlyTrends with single month
- Purpose: Validates handling of single month data
- Scenario: All transactions in same month
- Expected Result: Returns single month trend data
*/
/*
Test Documentation:
- Test Name: AnalyticsService - calculateMonthlyTrends uses cache
- Purpose: Validates caching for monthly trends
- Scenario: Service called twice with same data
- Expected Result: Second call returns cached result
*/
/*
Coverage Report:
- Functions tested: aggregateByCategory, calculateMonthlyTrends
- Scenarios covered: valid data, empty data, caching, single/multiple months
- Uncovered scenarios: malformed transaction objects, null values
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService;
    var $cacheFactory;
    var mockTransactions;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _$cacheFactory_) {
      AnalyticsService = _AnalyticsService_;
      $cacheFactory = _$cacheFactory_;

      mockTransactions = [
        {transactionId: 't1', amount: 150, category: 'Food & Dining', transactionDate: new Date('2024-01-15')},
        {transactionId: 't2', amount: 80, category: 'Fuel', transactionDate: new Date('2024-01-20')},
        {transactionId: 't3', amount: 300, category: 'Shopping', transactionDate: new Date('2024-02-10')},
        {transactionId: 't4', amount: 120, category: 'Food & Dining', transactionDate: new Date('2024-02-14')}
      ];
    }));

    describe('aggregateByCategory', function() {
      it('should aggregate transactions by category with valid data', function() {
        var result = AnalyticsService.aggregateByCategory(mockTransactions);

        expect(result).toBeDefined();
        expect(result.length).toBe(3);
        
        var foodDining = result.find(function(r) { return r.category === 'Food & Dining'; });
        expect(foodDining).toBeDefined();
        expect(foodDining.totalSpend).toBe(270);
        expect(foodDining.transactionCount).toBe(2);
        expect(foodDining.percentage).toBeCloseTo(41.54, 1);

        var fuel = result.find(function(r) { return r.category === 'Fuel'; });
        expect(fuel.totalSpend).toBe(80);
        expect(fuel.transactionCount).toBe(1);
      });

      it('should handle empty transaction array', function() {
        var result = AnalyticsService.aggregateByCategory([]);

        expect(result).toBeDefined();
        expect(result.length).toBe(0);
      });

      it('should use cache for repeated calls with same data', function() {
        var cache = $cacheFactory.get('analyticsCache');
        spyOn(cache, 'get').and.callThrough();
        spyOn(cache, 'put').and.callThrough();

        var result1 = AnalyticsService.aggregateByCategory(mockTransactions);
        expect(cache.put).toHaveBeenCalled();

        var result2 = AnalyticsService.aggregateByCategory(mockTransactions);
        expect(cache.get).toHaveBeenCalled();
        expect(result1).toEqual(result2);
      });

      it('should calculate percentage correctly when total is zero', function() {
        var zeroTransactions = [{amount: 0, category: 'Test'}];
        var result = AnalyticsService.aggregateByCategory(zeroTransactions);

        expect(result[0].percentage).toBe(0);
      });

      it('should handle single category transactions', function() {
        var singleCategory = [
          {amount: 100, category: 'Food & Dining'},
          {amount: 200, category: 'Food & Dining'}
        ];
        var result = AnalyticsService.aggregateByCategory(singleCategory);

        expect(result.length).toBe(1);
        expect(result[0].totalSpend).toBe(300);
        expect(result[0].percentage).toBe(100);
      });
    });

    describe('calculateMonthlyTrends', function() {
      it('should calculate monthly trends with valid transactions', function() {
        var result = AnalyticsService.calculateMonthlyTrends(mockTransactions);

        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result[0].month).toBe('2024-01');
        expect(result[0].totalSpend).toBe(230);
        expect(result[1].month).toBe('2024-02');
        expect(result[1].totalSpend).toBe(420);
      });

      it('should include category breakdown in monthly trends', function() {
        var result = AnalyticsService.calculateMonthlyTrends(mockTransactions);

        expect(result[0].categoryBreakdown).toBeDefined();
        expect(Array.isArray(result[0].categoryBreakdown)).toBe(true);
        expect(result[0].categoryBreakdown.length).toBeGreaterThan(0);

        var foodCategory = result[0].categoryBreakdown.find(function(c) { 
          return c.category === 'Food & Dining'; 
        });
        expect(foodCategory).toBeDefined();
        expect(foodCategory.totalSpend).toBe(150);
      });

      it('should sort months chronologically', function() {
        var unsortedTransactions = [
          {amount: 100, category: 'Test', transactionDate: new Date('2024-03-15')},
          {amount: 200, category: 'Test', transactionDate: new Date('2024-01-15')},
          {amount: 150, category: 'Test', transactionDate: new Date('2024-02-15')}
        ];
        var result = AnalyticsService.calculateMonthlyTrends(unsortedTransactions);

        expect(result[0].month).toBe('2024-01');
        expect(result[1].month).toBe('2024-02');
        expect(result[2].month).toBe('2024-03');
      });

      it('should handle single month transactions', function() {
        var singleMonth = [
          {amount: 100, category: 'Food', transactionDate: new Date('2024-01-10')},
          {amount: 200, category: 'Fuel', transactionDate: new Date('2024-01-20')}
        ];
        var result = AnalyticsService.calculateMonthlyTrends(singleMonth);

        expect(result.length).toBe(1);
        expect(result[0].month).toBe('2024-01');
        expect(result[0].totalSpend).toBe(300);
      });

      it('should use cache for repeated calls', function() {
        var cache = $cacheFactory.get('analyticsCache');
        spyOn(cache, 'get').and.callThrough();
        spyOn(cache, 'put').and.callThrough();

        var result1 = AnalyticsService.calculateMonthlyTrends(mockTransactions);
        expect(cache.put).toHaveBeenCalled();

        var result2 = AnalyticsService.calculateMonthlyTrends(mockTransactions);
        expect(cache.get).toHaveBeenCalled();
        expect(result1).toEqual(result2);
      });

      it('should handle empty transaction array', function() {
        var result = AnalyticsService.calculateMonthlyTrends([]);

        expect(result).toBeDefined();
        expect(result.length).toBe(0);
      });
    });
  });
})();