/*
Test Documentation:
- Test Name: filter.service - applyFilters
- Purpose: Validate transaction filtering based on multiple criteria
- Scenario: Service filters transactions by card, date range, amount, and merchant
- Expected Result: Returns filtered transaction list matching all criteria
*/

describe('FilterService (filter.service.js)', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var FilterService;
  
  beforeEach(inject(function(_FilterService_) {
    FilterService = _FilterService_;
  }));
  
  describe('applyFilters', function() {
    var mockTransactions;
    
    beforeEach(function() {
      mockTransactions = [
        {transactionId: 'TX001', cardId: 'CC001', date: new Date('2023-01-15'), amount: 100, merchant: 'Starbucks'},
        {transactionId: 'TX002', cardId: 'CC002', date: new Date('2023-02-20'), amount: 200, merchant: 'Shell'},
        {transactionId: 'TX003', cardId: 'CC001', date: new Date('2023-03-10'), amount: 50, merchant: 'Amazon'},
        {transactionId: 'TX004', cardId: 'CC003', date: new Date('2023-01-25'), amount: 300, merchant: 'Walmart'}
      ];
    });
    
    it('should return all transactions when no criteria provided', function() {
      var result = FilterService.applyFilters(mockTransactions, null);
      expect(result).toEqual(mockTransactions);
    });
    
    it('should filter by cardId', function() {
      var criteria = {cardId: 'CC001'};
      var result = FilterService.applyFilters(mockTransactions, criteria);
      
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('CC001');
      expect(result[1].cardId).toBe('CC001');
    });
    
    it('should filter by dateFrom', function() {
      var criteria = {dateFrom: '2023-02-01'};
      var result = FilterService.applyFilters(mockTransactions, criteria);
      
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('TX002');
      expect(result[1].transactionId).toBe('TX003');
    });
    
    it('should filter by dateTo', function() {
      var criteria = {dateTo: '2023-02-01'};
      var result = FilterService.applyFilters(mockTransactions, criteria);
      
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('TX001');
      expect(result[1].transactionId).toBe('TX004');
    });
    
    it('should filter by date range', function() {
      var criteria = {dateFrom: '2023-01-01', dateTo: '2023-02-01'};
      var result = FilterService.applyFilters(mockTransactions, criteria);
      
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('TX001');
      expect(result[1].transactionId).toBe('TX004');
    });
    
    it('should filter by minAmount', function() {
      var criteria = {minAmount: 150};
      var result = FilterService.applyFilters(mockTransactions, criteria);
      
      expect(result.length).toBe(2);
      expect(result[0].amount).toBe(200);
      expect(result[1].amount).toBe(300);
    });
    
    it('should filter by maxAmount', function() {
      var criteria = {maxAmount: 150};
      var result = FilterService.applyFilters(mockTransactions, criteria);
      
      expect(result.length).toBe(2);
      expect(result[0].amount).toBe(100);
      expect(result[1].amount).toBe(50);
    });
    
    it('should filter by amount range', function() {
      var criteria = {minAmount: 100, maxAmount: 200};
      var result = FilterService.applyFilters(mockTransactions, criteria);
      
      expect(result.length).toBe(2);
      expect(result[0].amount).toBe(100);
      expect(result[1].amount).toBe(200);
    });
    
    it('should filter by merchant name (case-insensitive)', function() {
      var criteria = {merchant: 'star'};
      var result = FilterService.applyFilters(mockTransactions, criteria);
      
      expect(result.length).toBe(1);
      expect(result[0].merchant).toBe('Starbucks');
    });
    
    it('should apply multiple filters simultaneously', function() {
      var criteria = {
        cardId: 'CC001',
        dateFrom: '2023-01-01',
        dateTo: '2023-02-01',
        minAmount: 50,
        maxAmount: 150
      };
      var result = FilterService.applyFilters(mockTransactions, criteria);
      
      expect(result.length).toBe(1);
      expect(result[0].transactionId).toBe('TX001');
    });
    
    it('should return empty array when no transactions match', function() {
      var criteria = {cardId: 'INVALID_CARD'};
      var result = FilterService.applyFilters(mockTransactions, criteria);
      
      expect(result).toEqual([]);
    });
    
    it('should handle empty transaction list', function() {
      var criteria = {cardId: 'CC001'};
      var result = FilterService.applyFilters([], criteria);
      
      expect(result).toEqual([]);
    });
  });
});

/*
Coverage Report:
- Functions tested: applyFilters
- Scenarios covered:
  * No criteria (return all)
  * Filter by cardId
  * Filter by dateFrom
  * Filter by dateTo
  * Filter by date range
  * Filter by minAmount
  * Filter by maxAmount
  * Filter by amount range
  * Filter by merchant (case-insensitive)
  * Multiple simultaneous filters
  * No matching transactions
  * Empty transaction list
- Uncovered scenarios: None
- Edge cases: Empty data, no matches, case sensitivity
*/