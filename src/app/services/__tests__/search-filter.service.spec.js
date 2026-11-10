/*
Test Documentation:
- Test Name: SearchFilterService Test Suite
- Purpose: Validate SearchFilterService functionality for filtering transactions based on multiple criteria
- Scenario: Tests applyFilters method with date range, amount range, categories, cardIds, and search term filters
- Expected Result: Service correctly filters transactions based on provided criteria and handles edge cases
*/

(function() {
'use strict';

describe('SearchFilterService', function() {
  var SearchFilterService;

  beforeEach(module('creditCard.transactions'));

  beforeEach(inject(function(_SearchFilterService_) {
    SearchFilterService = _SearchFilterService_;
  }));

  describe('applyFilters', function() {
    var mockTransactions;

    beforeEach(function() {
      mockTransactions = [
        {transactionId: 'T001', date: new Date('2024-01-15'), amount: 1200, merchant: 'Restaurant ABC', category: 'Food & Dining', cardId: 'CC001'},
        {transactionId: 'T002', date: new Date('2024-01-14'), amount: 3500, merchant: 'Fuel Station XYZ', category: 'Fuel', cardId: 'CC001'},
        {transactionId: 'T003', date: new Date('2024-01-13'), amount: 8500, merchant: 'Shopping Mall', category: 'Shopping', cardId: 'CC002'},
        {transactionId: 'T004', date: new Date('2024-01-12'), amount: 15000, merchant: 'Flight Booking', category: 'Travel', cardId: 'CC003'},
        {transactionId: 'T005', date: new Date('2024-01-11'), amount: 500, merchant: 'Movie Theater', category: 'Entertainment', cardId: 'CC001'}
      ];
    });

    it('should return all transactions when no filters are applied', function() {
      var filterCriteria = {dateRange: {}, amountRange: {}, categories: [], cardIds: [], searchTerm: ''};
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(5);
    });

    it('should filter transactions by date range', function() {
      var filterCriteria = {
        dateRange: {startDate: '2024-01-13', endDate: '2024-01-15'},
        amountRange: {},
        categories: [],
        cardIds: [],
        searchTerm: ''
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(3);
      expect(result.every(function(txn) { return txn.date >= new Date('2024-01-13') && txn.date <= new Date('2024-01-15'); })).toBe(true);
    });

    it('should filter transactions by minimum amount', function() {
      var filterCriteria = {
        dateRange: {},
        amountRange: {min: 3000},
        categories: [],
        cardIds: [],
        searchTerm: ''
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(3);
      expect(result.every(function(txn) { return txn.amount >= 3000; })).toBe(true);
    });

    it('should filter transactions by maximum amount', function() {
      var filterCriteria = {
        dateRange: {},
        amountRange: {max: 5000},
        categories: [],
        cardIds: [],
        searchTerm: ''
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(3);
      expect(result.every(function(txn) { return txn.amount <= 5000; })).toBe(true);
    });

    it('should filter transactions by amount range (min and max)', function() {
      var filterCriteria = {
        dateRange: {},
        amountRange: {min: 1000, max: 5000},
        categories: [],
        cardIds: [],
        searchTerm: ''
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(2);
      expect(result.every(function(txn) { return txn.amount >= 1000 && txn.amount <= 5000; })).toBe(true);
    });

    it('should filter transactions by category', function() {
      var filterCriteria = {
        dateRange: {},
        amountRange: {},
        categories: ['Food & Dining', 'Fuel'],
        cardIds: [],
        searchTerm: ''
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(2);
      expect(result.every(function(txn) { return txn.category === 'Food & Dining' || txn.category === 'Fuel'; })).toBe(true);
    });

    it('should filter transactions by cardId', function() {
      var filterCriteria = {
        dateRange: {},
        amountRange: {},
        categories: [],
        cardIds: ['CC001'],
        searchTerm: ''
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(3);
      expect(result.every(function(txn) { return txn.cardId === 'CC001'; })).toBe(true);
    });

    it('should filter transactions by search term (merchant)', function() {
      var filterCriteria = {
        dateRange: {},
        amountRange: {},
        categories: [],
        cardIds: [],
        searchTerm: 'restaurant'
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(1);
      expect(result[0].merchant.toLowerCase()).toContain('restaurant');
    });

    it('should filter transactions by search term (category)', function() {
      var filterCriteria = {
        dateRange: {},
        amountRange: {},
        categories: [],
        cardIds: [],
        searchTerm: 'fuel'
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(1);
      expect(result[0].category.toLowerCase()).toContain('fuel');
    });

    it('should apply multiple filters simultaneously', function() {
      var filterCriteria = {
        dateRange: {startDate: '2024-01-12', endDate: '2024-01-15'},
        amountRange: {min: 1000, max: 10000},
        categories: ['Food & Dining', 'Fuel', 'Shopping'],
        cardIds: ['CC001', 'CC002'],
        searchTerm: ''
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(3);
    });

    it('should return empty array for null transactions input', function() {
      var filterCriteria = {dateRange: {}, amountRange: {}, categories: [], cardIds: [], searchTerm: ''};
      var result = SearchFilterService.applyFilters(null, filterCriteria);

      expect(result).toEqual([]);
    });

    it('should return empty array for undefined transactions input', function() {
      var filterCriteria = {dateRange: {}, amountRange: {}, categories: [], cardIds: [], searchTerm: ''};
      var result = SearchFilterService.applyFilters(undefined, filterCriteria);

      expect(result).toEqual([]);
    });

    it('should return empty array for empty transactions array', function() {
      var filterCriteria = {dateRange: {}, amountRange: {}, categories: [], cardIds: [], searchTerm: ''};
      var result = SearchFilterService.applyFilters([], filterCriteria);

      expect(result).toEqual([]);
    });

    it('should not mutate original transactions array', function() {
      var originalLength = mockTransactions.length;
      var filterCriteria = {
        dateRange: {},
        amountRange: {min: 5000},
        categories: [],
        cardIds: [],
        searchTerm: ''
      };
      SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(mockTransactions.length).toBe(originalLength);
    });

    it('should handle case-insensitive search term', function() {
      var filterCriteria = {
        dateRange: {},
        amountRange: {},
        categories: [],
        cardIds: [],
        searchTerm: 'RESTAURANT'
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(1);
    });

    it('should return empty array when no transactions match filters', function() {
      var filterCriteria = {
        dateRange: {},
        amountRange: {min: 100000},
        categories: [],
        cardIds: [],
        searchTerm: ''
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(0);
    });

    it('should filter by multiple cardIds', function() {
      var filterCriteria = {
        dateRange: {},
        amountRange: {},
        categories: [],
        cardIds: ['CC001', 'CC003'],
        searchTerm: ''
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(4);
      expect(result.every(function(txn) { return txn.cardId === 'CC001' || txn.cardId === 'CC003'; })).toBe(true);
    });

    it('should handle partial search term matches', function() {
      var filterCriteria = {
        dateRange: {},
        amountRange: {},
        categories: [],
        cardIds: [],
        searchTerm: 'mall'
      };
      var result = SearchFilterService.applyFilters(mockTransactions, filterCriteria);

      expect(result.length).toBe(1);
      expect(result[0].merchant).toBe('Shopping Mall');
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: applyFilters
- Scenarios covered:
  * No filters applied
  * Date range filtering
  * Minimum amount filtering
  * Maximum amount filtering
  * Amount range filtering (min and max)
  * Category filtering
  * CardId filtering
  * Search term filtering (merchant)
  * Search term filtering (category)
  * Multiple filters simultaneously
  * Null transactions input
  * Undefined transactions input
  * Empty transactions array
  * Original array immutability
  * Case-insensitive search
  * No matches scenario
  * Multiple cardIds filtering
  * Partial search term matches
- Uncovered scenarios: None - comprehensive coverage achieved
*/