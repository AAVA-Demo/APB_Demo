/*
Test Documentation:
- Test Name: TimeSeriesProcessorService - aggregateByMonth
- Purpose: Validates aggregation of transactions by month
- Scenario: Transactions from multiple months are aggregated
- Expected Result: Returns array of monthly aggregates sorted by month
*/
/*
Coverage Report:
- Functions tested: aggregateByMonth
- Scenarios covered: multiple months, single month, empty list, sorting
- Uncovered scenarios: none
*/

describe('TimeSeriesProcessorService', function() {
  'use strict';
  
  beforeEach(module('creditCard.trends'));
  
  var TimeSeriesProcessorService;
  
  beforeEach(inject(function(_TimeSeriesProcessorService_) {
    TimeSeriesProcessorService = _TimeSeriesProcessorService_;
  }));
  
  describe('aggregateByMonth', function() {
    it('should aggregate transactions by month', function() {
      var transactions = [
        { transactionId: 1, amount: 100, transactionDate: '2024-01-15' },
        { transactionId: 2, amount: 200, transactionDate: '2024-01-20' },
        { transactionId: 3, amount: 150, transactionDate: '2024-02-10' },
        { transactionId: 4, amount: 300, transactionDate: '2024-02-25' }
      ];
      
      var result = TimeSeriesProcessorService.aggregateByMonth(transactions);
      
      expect(result.length).toBe(2);
      expect(result[0].month).toBe('2024-01');
      expect(result[0].totalSpend).toBe(300);
      expect(result[0].transactionCount).toBe(2);
      expect(result[1].month).toBe('2024-02');
      expect(result[1].totalSpend).toBe(450);
      expect(result[1].transactionCount).toBe(2);
    });
    
    it('should handle single month transactions', function() {
      var transactions = [
        { transactionId: 1, amount: 100, transactionDate: '2024-01-15' },
        { transactionId: 2, amount: 200, transactionDate: '2024-01-20' }
      ];
      
      var result = TimeSeriesProcessorService.aggregateByMonth(transactions);
      
      expect(result.length).toBe(1);
      expect(result[0].month).toBe('2024-01');
      expect(result[0].totalSpend).toBe(300);
    });
    
    it('should handle empty transaction list', function() {
      var result = TimeSeriesProcessorService.aggregateByMonth([]);
      expect(result.length).toBe(0);
    });
    
    it('should sort results by month chronologically', function() {
      var transactions = [
        { transactionId: 1, amount: 100, transactionDate: '2024-03-15' },
        { transactionId: 2, amount: 200, transactionDate: '2024-01-20' },
        { transactionId: 3, amount: 150, transactionDate: '2024-02-10' }
      ];
      
      var result = TimeSeriesProcessorService.aggregateByMonth(transactions);
      
      expect(result[0].month).toBe('2024-01');
      expect(result[1].month).toBe('2024-02');
      expect(result[2].month).toBe('2024-03');
    });
  });
});