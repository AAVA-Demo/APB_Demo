/*
Test Documentation:
- Test Name: TransactionFilterService - applyFilters with searchText
- Purpose: Validates that transactions are filtered by search text across merchant, category, and description
- Scenario: Service is called with searchText filter
- Expected Result: Returns only transactions matching search text
*/
/*
Test Documentation:
- Test Name: TransactionFilterService - applyFilters with date range
- Purpose: Validates that transactions are filtered by date range
- Scenario: Service is called with dateFrom and dateTo filters
- Expected Result: Returns only transactions within date range
*/
/*
Test Documentation:
- Test Name: TransactionFilterService - applyFilters with cardIds
- Purpose: Validates that transactions are filtered by card IDs
- Scenario: Service is called with cardIds filter
- Expected Result: Returns only transactions for specified cards
*/
/*
Test Documentation:
- Test Name: TransactionFilterService - applyFilters with categories
- Purpose: Validates that transactions are filtered by categories
- Scenario: Service is called with categories filter
- Expected Result: Returns only transactions in specified categories
*/
/*
Test Documentation:
- Test Name: TransactionFilterService - applyFilters with multiple filters
- Purpose: Validates that multiple filters are applied cumulatively
- Scenario: Service is called with searchText, dateFrom, and cardIds filters
- Expected Result: Returns only transactions matching all filters
*/
/*
Coverage Report:
- Functions tested: applyFilters
- Scenarios covered: searchText filtering, date range filtering, cardIds filtering, categories filtering, multiple filters, empty transactions array
- Uncovered scenarios: invalid date formats, null filter values
*/

describe('TransactionFilterService', function() {
  'use strict';
  
  beforeEach(module('app.transactions'));
  
  var TransactionFilterService;
  
  beforeEach(inject(function(_TransactionFilterService_) {
    TransactionFilterService = _TransactionFilterService_;
  }));
  
  describe('applyFilters', function() {
    var mockTransactions;
    
    beforeEach(function() {
      mockTransactions = [
        {transactionId: 'txn1', cardId: 'c1', date: new Date('2024-01-15'), merchant: 'Amazon', category: 'Shopping', description: 'Online purchase'},
        {transactionId: 'txn2', cardId: 'c2', date: new Date('2024-02-20'), merchant: 'Starbucks', category: 'Food & Dining', description: 'Coffee'},
        {transactionId: 'txn3', cardId: 'c1', date: new Date('2024-03-10'), merchant: 'Shell Gas', category: 'Fuel', description: 'Gas station'},
        {transactionId: 'txn4', cardId: 'c3', date: new Date('2024-04-05'), merchant: 'Walmart', category: 'Shopping', description: 'Groceries'}
      ];
    });
    
    it('should filter transactions by searchText in merchant', function() {
      var filter = {searchText: 'amazon'};
      
      var result = TransactionFilterService.applyFilters(mockTransactions, filter);
      
      expect(result.length).toBe(1);
      expect(result[0].transactionId).toBe('txn1');
    });
    
    it('should filter transactions by searchText in category', function() {
      var filter = {searchText: 'shopping'};
      
      var result = TransactionFilterService.applyFilters(mockTransactions, filter);
      
      expect(result.length).toBe(2);
    });
    
    it('should filter transactions by searchText in description', function() {
      var filter = {searchText: 'coffee'};
      
      var result = TransactionFilterService.applyFilters(mockTransactions, filter);
      
      expect(result.length).toBe(1);
      expect(result[0].transactionId).toBe('txn2');
    });
    
    it('should filter transactions by dateFrom', function() {
      var filter = {dateFrom: new Date('2024-02-01')};
      
      var result = TransactionFilterService.applyFilters(mockTransactions, filter);
      
      expect(result.length).toBe(3);
    });
    
    it('should filter transactions by dateTo', function() {
      var filter = {dateTo: new Date('2024-02-28')};
      
      var result = TransactionFilterService.applyFilters(mockTransactions, filter);
      
      expect(result.length).toBe(2);
    });
    
    it('should filter transactions by date range', function() {
      var filter = {dateFrom: new Date('2024-02-01'), dateTo: new Date('2024-03-31')};
      
      var result = TransactionFilterService.applyFilters(mockTransactions, filter);
      
      expect(result.length).toBe(2);
    });
    
    it('should filter transactions by cardIds', function() {
      var filter = {cardIds: ['c1']};
      
      var result = TransactionFilterService.applyFilters(mockTransactions, filter);
      
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('c1');
      expect(result[1].cardId).toBe('c1');
    });
    
    it('should filter transactions by multiple cardIds', function() {
      var filter = {cardIds: ['c1', 'c2']};
      
      var result = TransactionFilterService.applyFilters(mockTransactions, filter);
      
      expect(result.length).toBe(3);
    });
    
    it('should filter transactions by categories', function() {
      var filter = {categories: ['Shopping']};
      
      var result = TransactionFilterService.applyFilters(mockTransactions, filter);
      
      expect(result.length).toBe(2);
    });
    
    it('should apply multiple filters cumulatively', function() {
      var filter = {
        searchText: 'shopping',
        dateFrom: new Date('2024-03-01'),
        cardIds: ['c1']
      };
      
      var result = TransactionFilterService.applyFilters(mockTransactions, filter);
      
      expect(result.length).toBe(0);
    });
    
    it('should return empty array when transactions is null', function() {
      var filter = {};
      
      var result = TransactionFilterService.applyFilters(null, filter);
      
      expect(result).toEqual([]);
    });
    
    it('should return all transactions when no filters are applied', function() {
      var filter = {};
      
      var result = TransactionFilterService.applyFilters(mockTransactions, filter);
      
      expect(result.length).toBe(4);
    });
  });
});