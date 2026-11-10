/*
Test Documentation:
- Test Name: TrendAnalysisService - computeMonthlyTrends
- Purpose: Validates computation of monthly spending trends from transaction history
- Scenario: Service processes transactions and groups by month with category breakdown
- Expected Result: Returns array of monthly trend objects with totalSpend and categoryBreakdown
*/
/*
Coverage Report:
- Functions tested: computeMonthlyTrends
- Scenarios covered: normal trend calculation, empty transactions, null input, single month, multiple months, category aggregation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TrendAnalysisService', function() {
    var TrendAnalysisService;
    var CategorizationService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TrendAnalysisService_, _CategorizationService_) {
      TrendAnalysisService = _TrendAnalysisService_;
      CategorizationService = _CategorizationService_;
    }));

    describe('computeMonthlyTrends', function() {
      it('should return empty array for null transactions', function() {
        var result = TrendAnalysisService.computeMonthlyTrends(null);
        expect(result).toEqual([]);
      });

      it('should return empty array for undefined transactions', function() {
        var result = TrendAnalysisService.computeMonthlyTrends(undefined);
        expect(result).toEqual([]);
      });

      it('should return empty array for empty transaction array', function() {
        var result = TrendAnalysisService.computeMonthlyTrends([]);
        expect(result).toEqual([]);
      });

      it('should compute trends for single month', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining', date: new Date('2024-01-15')},
          {amount: 50, category: 'Fuel', date: new Date('2024-01-20')}
        ];
        var result = TrendAnalysisService.computeMonthlyTrends(transactions);
        expect(result.length).toBe(1);
        expect(result[0].month).toBe('2024-01');
        expect(result[0].totalSpend).toBe(150);
        expect(result[0].categoryBreakdown).toBeDefined();
      });

      it('should compute trends for multiple months', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining', date: new Date('2024-01-15')},
          {amount: 50, category: 'Fuel', date: new Date('2024-02-10')},
          {amount: 75, category: 'Shopping', date: new Date('2024-03-05')}
        ];
        var result = TrendAnalysisService.computeMonthlyTrends(transactions);
        expect(result.length).toBe(3);
        expect(result[0].month).toBe('2024-01');
        expect(result[1].month).toBe('2024-02');
        expect(result[2].month).toBe('2024-03');
      });

      it('should sort months in chronological order', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining', date: new Date('2024-03-15')},
          {amount: 50, category: 'Fuel', date: new Date('2024-01-10')},
          {amount: 75, category: 'Shopping', date: new Date('2024-02-05')}
        ];
        var result = TrendAnalysisService.computeMonthlyTrends(transactions);
        expect(result[0].month).toBe('2024-01');
        expect(result[1].month).toBe('2024-02');
        expect(result[2].month).toBe('2024-03');
      });

      it('should aggregate transactions within same month', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining', date: new Date('2024-01-05')},
          {amount: 50, category: 'Fuel', date: new Date('2024-01-15')},
          {amount: 75, category: 'Shopping', date: new Date('2024-01-25')}
        ];
        var result = TrendAnalysisService.computeMonthlyTrends(transactions);
        expect(result.length).toBe(1);
        expect(result[0].totalSpend).toBe(225);
      });

      it('should include category breakdown for each month', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining', date: new Date('2024-01-15')},
          {amount: 50, category: 'Fuel', date: new Date('2024-01-20')}
        ];
        spyOn(CategorizationService, 'aggregateByCategory').and.callThrough();
        var result = TrendAnalysisService.computeMonthlyTrends(transactions);
        expect(CategorizationService.aggregateByCategory).toHaveBeenCalled();
        expect(result[0].categoryBreakdown).toBeDefined();
        expect(Array.isArray(result[0].categoryBreakdown)).toBe(true);
      });

      it('should handle transactions spanning multiple years', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining', date: new Date('2023-12-15')},
          {amount: 50, category: 'Fuel', date: new Date('2024-01-10')}
        ];
        var result = TrendAnalysisService.computeMonthlyTrends(transactions);
        expect(result.length).toBe(2);
        expect(result[0].month).toBe('2023-12');
        expect(result[1].month).toBe('2024-01');
      });

      it('should format month keys with leading zeros', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining', date: new Date('2024-01-15')},
          {amount: 50, category: 'Fuel', date: new Date('2024-09-10')}
        ];
        var result = TrendAnalysisService.computeMonthlyTrends(transactions);
        expect(result[0].month).toBe('2024-01');
        expect(result[1].month).toBe('2024-09');
      });

      it('should return trend objects with required properties', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining', date: new Date('2024-01-15')}
        ];
        var result = TrendAnalysisService.computeMonthlyTrends(transactions);
        var trend = result[0];
        expect(trend.hasOwnProperty('month')).toBe(true);
        expect(trend.hasOwnProperty('totalSpend')).toBe(true);
        expect(trend.hasOwnProperty('categoryBreakdown')).toBe(true);
      });

      it('should calculate correct total spend for each month', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining', date: new Date('2024-01-05')},
          {amount: 50, category: 'Fuel', date: new Date('2024-01-15')},
          {amount: 200, category: 'Shopping', date: new Date('2024-02-10')},
          {amount: 75, category: 'Travel', date: new Date('2024-02-20')}
        ];
        var result = TrendAnalysisService.computeMonthlyTrends(transactions);
        expect(result[0].totalSpend).toBe(150);
        expect(result[1].totalSpend).toBe(275);
      });

      it('should handle decimal transaction amounts', function() {
        var transactions = [
          {amount: 125.50, category: 'Food & Dining', date: new Date('2024-01-15')},
          {amount: 60.75, category: 'Fuel', date: new Date('2024-01-20')}
        ];
        var result = TrendAnalysisService.computeMonthlyTrends(transactions);
        expect(result[0].totalSpend).toBeCloseTo(186.25, 2);
      });

      it('should handle large number of transactions', function() {
        var transactions = [];
        for (var i = 0; i < 100; i++) {
          transactions.push({
            amount: 10,
            category: 'Food & Dining',
            date: new Date('2024-01-' + ((i % 28) + 1))
          });
        }
        var result = TrendAnalysisService.computeMonthlyTrends(transactions);
        expect(result.length).toBe(1);
        expect(result[0].totalSpend).toBe(1000);
      });

      it('should pass correct transactions to CategorizationService for each month', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining', date: new Date('2024-01-15')},
          {amount: 50, category: 'Fuel', date: new Date('2024-01-20')},
          {amount: 200, category: 'Shopping', date: new Date('2024-02-10')}
        ];
        spyOn(CategorizationService, 'aggregateByCategory').and.callThrough();
        TrendAnalysisService.computeMonthlyTrends(transactions);
        expect(CategorizationService.aggregateByCategory).toHaveBeenCalledTimes(2);
      });
    });
  });
})();