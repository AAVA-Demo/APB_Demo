/*
Test Documentation:
- Test Name: AggregationService Unit Tests
- Purpose: Validate monthly trend computation and data aggregation
- Scenario: Tests time-series aggregation and category breakdown integration
- Expected Result: Service correctly computes monthly trends for 12 months
*/

(function() {
  'use strict';
  
  describe('AggregationService', function() {
    var AggregationService, CategoryService;
    
    beforeEach(module('analyticsModule'));
    
    beforeEach(inject(function(_AggregationService_, _CategoryService_) {
      AggregationService = _AggregationService_;
      CategoryService = _CategoryService_;
    }));
    
    describe('computeTrendsAndTotals()', function() {
      it('should compute monthly trends correctly', function() {
        var transactions = [
          {amount: 1000, date: new Date('2024-01-15'), category: 'Shopping'},
          {amount: 1500, date: new Date('2024-01-20'), category: 'Food & Dining'},
          {amount: 2000, date: new Date('2024-02-10'), category: 'Travel'}
        ];
        
        var result = AggregationService.computeTrendsAndTotals(transactions);
        expect(result.monthlyTrends).toBeDefined();
        expect(Array.isArray(result.monthlyTrends)).toBe(true);
      });
      
      it('should aggregate amounts by month', function() {
        var transactions = [
          {amount: 1000, date: new Date('2024-01-15'), category: 'Shopping'},
          {amount: 500, date: new Date('2024-01-20'), category: 'Fuel'}
        ];
        
        var result = AggregationService.computeTrendsAndTotals(transactions);
        var jan2024 = result.monthlyTrends.find(function(t) { return t.month === '2024-01'; });
        expect(jan2024.totalSpend).toBe(1500);
      });
      
      it('should limit trends to last 12 months', function() {
        var transactions = [];
        for (var i = 0; i < 24; i++) {
          var date = new Date();
          date.setMonth(date.getMonth() - i);
          transactions.push({amount: 1000, date: date, category: 'Shopping'});
        }
        
        var result = AggregationService.computeTrendsAndTotals(transactions);
        expect(result.monthlyTrends.length).toBeLessThanOrEqual(12);
      });
      
      it('should include category breakdown', function() {
        var transactions = [{amount: 1000, date: new Date(), category: 'Food & Dining'}];
        spyOn(CategoryService, 'getCategoryBreakdown').and.returnValue([{category: 'Food & Dining', amount: 1000}]);
        
        var result = AggregationService.computeTrendsAndTotals(transactions);
        expect(result.categoryBreakdown).toBeDefined();
        expect(CategoryService.getCategoryBreakdown).toHaveBeenCalledWith(transactions);
      });
      
      it('should handle empty transaction list', function() {
        var result = AggregationService.computeTrendsAndTotals([]);
        expect(result.monthlyTrends).toEqual([]);
        expect(result.categoryBreakdown).toBeDefined();
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: computeTrendsAndTotals
- Scenarios covered:
  * Monthly trend computation
  * Amount aggregation by month
  * 12-month limit
  * Category breakdown integration
  * Empty transaction handling
- Uncovered scenarios: Timezone handling, future dates
*/