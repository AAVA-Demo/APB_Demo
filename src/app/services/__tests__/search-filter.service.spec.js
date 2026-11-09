/*
Test Documentation:
- Test Name: SearchFilterService - constructQueryParams with all filters
- Purpose: Validates query parameter construction from filter object
- Scenario: Filter object contains all possible filter criteria
- Expected Result: Returns properly formatted query params object
*/
/*
Test Documentation:
- Test Name: SearchFilterService - constructQueryParams with partial filters
- Purpose: Validates handling of incomplete filter objects
- Scenario: Filter object contains only some filter criteria
- Expected Result: Returns params only for provided filters
*/
/*
Test Documentation:
- Test Name: SearchFilterService - applyClientFilter
- Purpose: Validates client-side filtering of transaction arrays
- Scenario: Transactions are filtered by merchant name and category
- Expected Result: Returns filtered transaction array
*/
/*
Coverage Report:
- Functions tested: constructQueryParams, applyClientFilter
- Scenarios covered: full filters, partial filters, empty filters, client-side filtering
- Edge cases: null values, empty strings, invalid dates, empty transaction arrays
- Uncovered scenarios: none
*/

describe('SearchFilterService', function() {
  'use strict';

  var SearchFilterService, $filter;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_SearchFilterService_, _$filter_) {
    SearchFilterService = _SearchFilterService_;
    $filter = _$filter_;
  }));

  describe('constructQueryParams', function() {
    it('should construct query params with all filters provided', function() {
      var filterObj = {
        cardId: 'card123',
        dateFrom: new Date('2024-01-01'),
        dateTo: new Date('2024-12-31'),
        minAmount: 100,
        maxAmount: 5000,
        merchantName: 'Amazon',
        category: 'Shopping'
      };

      var params = SearchFilterService.constructQueryParams(filterObj);

      expect(params.cardId).toBe('card123');
      expect(params.dateFrom).toBe('2024-01-01');
      expect(params.dateTo).toBe('2024-12-31');
      expect(params.minAmount).toBe(100);
      expect(params.maxAmount).toBe(5000);
      expect(params.merchantName).toBe('Amazon');
      expect(params.category).toBe('Shopping');
    });

    it('should construct query params with only cardId', function() {
      var filterObj = {
        cardId: 'card456'
      };

      var params = SearchFilterService.constructQueryParams(filterObj);

      expect(params.cardId).toBe('card456');
      expect(params.dateFrom).toBeUndefined();
      expect(params.dateTo).toBeUndefined();
    });

    it('should construct query params with date range only', function() {
      var filterObj = {
        dateFrom: new Date('2024-06-01'),
        dateTo: new Date('2024-06-30')
      };

      var params = SearchFilterService.constructQueryParams(filterObj);

      expect(params.dateFrom).toBe('2024-06-01');
      expect(params.dateTo).toBe('2024-06-30');
      expect(params.cardId).toBeUndefined();
    });

    it('should construct query params with amount range only', function() {
      var filterObj = {
        minAmount: 50,
        maxAmount: 1000
      };

      var params = SearchFilterService.constructQueryParams(filterObj);

      expect(params.minAmount).toBe(50);
      expect(params.maxAmount).toBe(1000);
    });

    it('should handle empty filter object', function() {
      var filterObj = {};

      var params = SearchFilterService.constructQueryParams(filterObj);

      expect(Object.keys(params).length).toBe(0);
    });

    it('should ignore null values in filter object', function() {
      var filterObj = {
        cardId: null,
        dateFrom: null,
        merchantName: 'Walmart'
      };

      var params = SearchFilterService.constructQueryParams(filterObj);

      expect(params.cardId).toBeUndefined();
      expect(params.dateFrom).toBeUndefined();
      expect(params.merchantName).toBe('Walmart');
    });

    it('should ignore undefined values in filter object', function() {
      var filterObj = {
        cardId: undefined,
        category: 'Travel'
      };

      var params = SearchFilterService.constructQueryParams(filterObj);

      expect(params.cardId).toBeUndefined();
      expect(params.category).toBe('Travel');
    });

    it('should format dates correctly', function() {
      var filterObj = {
        dateFrom: new Date('2024-03-15'),
        dateTo: new Date('2024-03-20')
      };

      var params = SearchFilterService.constructQueryParams(filterObj);

      expect(params.dateFrom).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(params.dateTo).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should handle zero amount values', function() {
      var filterObj = {
        minAmount: 0,
        maxAmount: 0
      };

      var params = SearchFilterService.constructQueryParams(filterObj);

      expect(params.minAmount).toBeUndefined();
      expect(params.maxAmount).toBeUndefined();
    });
  });

  describe('applyClientFilter', function() {
    it('should filter transactions by merchant name', function() {
      var transactions = [
        { transactionId: 'tx1', merchantName: 'Starbucks', category: 'Food & Dining' },
        { transactionId: 'tx2', merchantName: 'Shell', category: 'Fuel' },
        { transactionId: 'tx3', merchantName: 'Starbucks', category: 'Food & Dining' }
      ];

      var filterObj = { merchantName: 'Starbucks' };

      var filtered = SearchFilterService.applyClientFilter(transactions, filterObj);

      expect(filtered.length).toBe(2);
      expect(filtered[0].merchantName).toBe('Starbucks');
      expect(filtered[1].merchantName).toBe('Starbucks');
    });

    it('should filter transactions by category', function() {
      var transactions = [
        { transactionId: 'tx1', merchantName: 'Target', category: 'Shopping' },
        { transactionId: 'tx2', merchantName: 'Exxon', category: 'Fuel' },
        { transactionId: 'tx3', merchantName: 'Walmart', category: 'Shopping' }
      ];

      var filterObj = { category: 'Shopping' };

      var filtered = SearchFilterService.applyClientFilter(transactions, filterObj);

      expect(filtered.length).toBe(2);
      expect(filtered[0].category).toBe('Shopping');
      expect(filtered[1].category).toBe('Shopping');
    });

    it('should filter transactions by both merchant name and category', function() {
      var transactions = [
        { transactionId: 'tx1', merchantName: 'Amazon', category: 'Shopping' },
        { transactionId: 'tx2', merchantName: 'Amazon', category: 'Entertainment' },
        { transactionId: 'tx3', merchantName: 'Target', category: 'Shopping' }
      ];

      var filterObj = { merchantName: 'Amazon', category: 'Shopping' };

      var filtered = SearchFilterService.applyClientFilter(transactions, filterObj);

      expect(filtered.length).toBe(1);
      expect(filtered[0].merchantName).toBe('Amazon');
      expect(filtered[0].category).toBe('Shopping');
    });

    it('should return all transactions when no filters applied', function() {
      var transactions = [
        { transactionId: 'tx1', merchantName: 'Store1', category: 'Shopping' },
        { transactionId: 'tx2', merchantName: 'Store2', category: 'Fuel' }
      ];

      var filterObj = {};

      var filtered = SearchFilterService.applyClientFilter(transactions, filterObj);

      expect(filtered.length).toBe(2);
    });

    it('should handle empty transaction array', function() {
      var transactions = [];
      var filterObj = { merchantName: 'Test' };

      var filtered = SearchFilterService.applyClientFilter(transactions, filterObj);

      expect(filtered.length).toBe(0);
    });

    it('should return empty array when no matches found', function() {
      var transactions = [
        { transactionId: 'tx1', merchantName: 'Store1', category: 'Shopping' },
        { transactionId: 'tx2', merchantName: 'Store2', category: 'Fuel' }
      ];

      var filterObj = { merchantName: 'NonExistent' };

      var filtered = SearchFilterService.applyClientFilter(transactions, filterObj);

      expect(filtered.length).toBe(0);
    });

    it('should handle partial merchant name matches', function() {
      var transactions = [
        { transactionId: 'tx1', merchantName: 'Starbucks Coffee', category: 'Food & Dining' },
        { transactionId: 'tx2', merchantName: 'Shell Gas', category: 'Fuel' }
      ];

      var filterObj = { merchantName: 'Star' };

      var filtered = SearchFilterService.applyClientFilter(transactions, filterObj);

      expect(filtered.length).toBe(1);
      expect(filtered[0].merchantName).toContain('Star');
    });
  });
});