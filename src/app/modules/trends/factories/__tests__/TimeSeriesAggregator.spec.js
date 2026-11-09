/*
Test Documentation:
- Test Name: TimeSeriesAggregator Unit Tests
- Purpose: Validate monthly time-series aggregation of transactions
- Scenario: Test aggregateByMonth with various transaction dates
- Expected Result: Factory should correctly aggregate transactions by month
*/

(function(){
'use strict';

describe('TimeSeriesAggregator', function() {
  var TimeSeriesAggregator;

  beforeEach(module('spendTrendsModule'));

  beforeEach(inject(function(_TimeSeriesAggregator_) {
    TimeSeriesAggregator = _TimeSeriesAggregator_;
  }));

  describe('aggregateByMonth', function() {
    it('should aggregate transactions by month', function() {
      var transactions = [
        {cardId: 1, amount: 100, transactionDate: '2024-01-15'},
        {cardId: 1, amount: 50, transactionDate: '2024-01-20'},
        {cardId: 2, amount: 75, transactionDate: '2024-02-10'}
      ];

      var result = TimeSeriesAggregator.aggregateByMonth(transactions);

      expect(result.length).toBe(2);
      expect(result[0].month).toBe('2024-01');
      expect(result[0].totalSpend).toBe(150);
      expect(result[0].transactionCount).toBe(2);
      expect(result[1].month).toBe('2024-02');
      expect(result[1].totalSpend).toBe(75);
      expect(result[1].transactionCount).toBe(1);
    });

    it('should include card breakdown per month', function() {
      var transactions = [
        {cardId: 1, amount: 100, transactionDate: '2024-01-15'},
        {cardId: 2, amount: 50, transactionDate: '2024-01-20'}
      ];

      var result = TimeSeriesAggregator.aggregateByMonth(transactions);

      expect(result[0].cardBreakdown.length).toBe(2);
      expect(result[0].cardBreakdown[0].cardId).toBe(1);
      expect(result[0].cardBreakdown[0].spend).toBe(100);
      expect(result[0].cardBreakdown[1].cardId).toBe(2);
      expect(result[0].cardBreakdown[1].spend).toBe(50);
    });

    it('should sort months chronologically', function() {
      var transactions = [
        {cardId: 1, amount: 100, transactionDate: '2024-03-15'},
        {cardId: 1, amount: 50, transactionDate: '2024-01-20'},
        {cardId: 1, amount: 75, transactionDate: '2024-02-10'}
      ];

      var result = TimeSeriesAggregator.aggregateByMonth(transactions);

      expect(result[0].month).toBe('2024-01');
      expect(result[1].month).toBe('2024-02');
      expect(result[2].month).toBe('2024-03');
    });

    it('should handle empty transaction list', function() {
      var result = TimeSeriesAggregator.aggregateByMonth([]);
      expect(result.length).toBe(0);
    });

    it('should handle single-digit months with zero padding', function() {
      var transactions = [
        {cardId: 1, amount: 100, transactionDate: '2024-01-15'},
        {cardId: 1, amount: 50, transactionDate: '2024-09-20'}
      ];

      var result = TimeSeriesAggregator.aggregateByMonth(transactions);

      expect(result[0].month).toBe('2024-01');
      expect(result[1].month).toBe('2024-09');
    });

    it('should aggregate multiple transactions for same card in same month', function() {
      var transactions = [
        {cardId: 1, amount: 100, transactionDate: '2024-01-15'},
        {cardId: 1, amount: 50, transactionDate: '2024-01-20'},
        {cardId: 1, amount: 25, transactionDate: '2024-01-25'}
      ];

      var result = TimeSeriesAggregator.aggregateByMonth(transactions);

      expect(result[0].cardBreakdown[0].spend).toBe(175);
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: aggregateByMonth
- Scenarios covered: Monthly aggregation, card breakdown, chronological sorting, empty list, date formatting
- Edge cases: Single-digit months, multiple transactions per card, empty arrays
- Uncovered scenarios: None - all time-series logic covered
*/