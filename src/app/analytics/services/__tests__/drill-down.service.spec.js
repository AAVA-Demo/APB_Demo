/*
Test Documentation:
- Test Name: DrillDownService - getFilteredData by category
- Purpose: Validates filtering transactions by category
- Scenario: Filter transactions for specific category
- Expected Result: Returns only transactions matching category

- Test Name: DrillDownService - getFilteredData by month
- Purpose: Validates filtering transactions by month
- Scenario: Filter transactions for specific month
- Expected Result: Returns only transactions matching month

- Test Name: DrillDownService - getFilteredData by category and month
- Purpose: Validates combined filtering
- Scenario: Filter by both category and month
- Expected Result: Returns transactions matching both criteria

- Test Name: DrillDownService - getFilteredData with no filters
- Purpose: Validates behavior when no filters applied
- Scenario: No category or month specified
- Expected Result: Returns all transactions

- Test Name: DrillDownService - getFilteredData with empty results
- Purpose: Validates handling of no matching transactions
- Scenario: Filters match no transactions
- Expected Result: Returns empty array
*/

/*
Coverage Report:
- Functions tested: getFilteredData
- Scenarios covered: category filtering, month filtering, combined filtering, no filters, empty results
- Edge cases: null/undefined filters, empty transaction arrays, no matches
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('DrillDownService', function() {
    var DrillDownService;

    beforeEach(module('analytics'));

    beforeEach(inject(function(_DrillDownService_) {
      DrillDownService = _DrillDownService_;
    }));

    describe('getFilteredData', function() {
      var mockTransactions;

      beforeEach(function() {
        mockTransactions = [
          { transactionId: 'txn-001', amount: 100, category: 'Food & Dining', date: new Date('2024-01-15') },
          { transactionId: 'txn-002', amount: 200, category: 'Shopping', date: new Date('2024-01-20') },
          { transactionId: 'txn-003', amount: 150, category: 'Food & Dining', date: new Date('2024-02-10') },
          { transactionId: 'txn-004', amount: 300, category: 'Travel', date: new Date('2024-02-25') },
          { transactionId: 'txn-005', amount: 50, category: 'Shopping', date: new Date('2024-03-05') }
        ];
      });

      it('should filter transactions by category only', function() {
        var result = DrillDownService.getFilteredData('Food & Dining', null, mockTransactions);
        
        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('txn-001');
        expect(result[1].transactionId).toBe('txn-003');
      });

      it('should filter transactions by month only', function() {
        var result = DrillDownService.getFilteredData(null, '2024-01', mockTransactions);
        
        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('txn-001');
        expect(result[1].transactionId).toBe('txn-002');
      });

      it('should filter transactions by both category and month', function() {
        var result = DrillDownService.getFilteredData('Food & Dining', '2024-02', mockTransactions);
        
        expect(result.length).toBe(1);
        expect(result[0].transactionId).toBe('txn-003');
      });

      it('should return all transactions when no filters applied', function() {
        var result = DrillDownService.getFilteredData(null, null, mockTransactions);
        
        expect(result.length).toBe(5);
      });

      it('should return empty array when no transactions match', function() {
        var result = DrillDownService.getFilteredData('Utilities', '2024-01', mockTransactions);
        
        expect(result.length).toBe(0);
      });

      it('should handle empty transactions array', function() {
        var result = DrillDownService.getFilteredData('Food & Dining', '2024-01', []);
        
        expect(result.length).toBe(0);
      });

      it('should handle undefined category filter', function() {
        var result = DrillDownService.getFilteredData(undefined, '2024-02', mockTransactions);
        
        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('txn-003');
        expect(result[1].transactionId).toBe('txn-004');
      });

      it('should handle undefined month filter', function() {
        var result = DrillDownService.getFilteredData('Shopping', undefined, mockTransactions);
        
        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('txn-002');
        expect(result[1].transactionId).toBe('txn-005');
      });

      it('should handle empty string category', function() {
        var result = DrillDownService.getFilteredData('', '2024-01', mockTransactions);
        
        expect(result.length).toBe(2);
      });

      it('should handle empty string month', function() {
        var result = DrillDownService.getFilteredData('Travel', '', mockTransactions);
        
        expect(result.length).toBe(1);
        expect(result[0].transactionId).toBe('txn-004');
      });

      it('should filter correctly across multiple months', function() {
        var result = DrillDownService.getFilteredData('Shopping', null, mockTransactions);
        
        expect(result.length).toBe(2);
        expect(result[0].category).toBe('Shopping');
        expect(result[1].category).toBe('Shopping');
      });

      it('should handle month format correctly', function() {
        var transactions = [
          { transactionId: 'txn-001', category: 'Food & Dining', date: new Date('2024-12-31') }
        ];
        var result = DrillDownService.getFilteredData(null, '2024-12', transactions);
        
        expect(result.length).toBe(1);
      });
    });
  });
})();