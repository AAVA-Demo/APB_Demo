/*
Test Documentation:
- Test Name: SearchFilterService - applyFilters with searchTerm
- Purpose: Validates filtering transactions by search term
- Scenario: Filter applied with merchant name search
- Expected Result: Returns transactions matching search term

- Test Name: SearchFilterService - applyFilters with date range
- Purpose: Validates filtering by start and end date
- Scenario: Filter applied with date range
- Expected Result: Returns transactions within date range

- Test Name: SearchFilterService - applyFilters with cardId
- Purpose: Validates filtering by specific card ID
- Scenario: Filter applied with cardId
- Expected Result: Returns transactions for specified card only

- Test Name: SearchFilterService - applyFilters with multiple criteria
- Purpose: Validates combined filtering with multiple criteria
- Scenario: Multiple filters applied simultaneously
- Expected Result: Returns transactions matching all criteria

- Test Name: SearchFilterService - buildQueryParams
- Purpose: Validates query parameter object construction
- Scenario: Filters object passed to buildQueryParams
- Expected Result: Returns properly formatted query parameters

Coverage Report:
- Functions tested: applyFilters, buildQueryParams
- Scenarios covered: search term, date range, cardId, combined filters, query params
- Edge cases: empty filters, null values, no matches
- Uncovered scenarios: invalid date formats (handled by Date constructor)
*/

(function() {
  'use strict';

  describe('SearchFilterService', function() {
    var SearchFilterService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_SearchFilterService_) {
      SearchFilterService = _SearchFilterService_;
    }));

    describe('applyFilters', function() {
      var mockTransactions;

      beforeEach(function() {
        mockTransactions = [
          { transactionId: 'txn-001', merchantName: 'Starbucks', transactionDate: '2024-01-15', cardId: 'card-001', amount: 5.50 },
          { transactionId: 'txn-002', merchantName: 'Shell Gas', transactionDate: '2024-01-20', cardId: 'card-002', amount: 45.00 },
          { transactionId: 'txn-003', merchantName: 'Amazon', transactionDate: '2024-02-05', cardId: 'card-001', amount: 89.99 },
          { transactionId: 'txn-004', merchantName: 'Walmart', transactionDate: '2024-02-10', cardId: 'card-003', amount: 120.50 }
        ];
      });

      it('should filter transactions by search term', function() {
        var filters = { searchTerm: 'Starbucks' };
        var result = SearchFilterService.applyFilters(mockTransactions, filters);

        expect(result.length).toBe(1);
        expect(result[0].merchantName).toBe('Starbucks');
      });

      it('should filter transactions by partial search term', function() {
        var filters = { searchTerm: 'Shell' };
        var result = SearchFilterService.applyFilters(mockTransactions, filters);

        expect(result.length).toBe(1);
        expect(result[0].merchantName).toBe('Shell Gas');
      });

      it('should filter transactions by start date', function() {
        var filters = { startDate: '2024-02-01' };
        var result = SearchFilterService.applyFilters(mockTransactions, filters);

        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('txn-003');
        expect(result[1].transactionId).toBe('txn-004');
      });

      it('should filter transactions by end date', function() {
        var filters = { endDate: '2024-01-31' };
        var result = SearchFilterService.applyFilters(mockTransactions, filters);

        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('txn-001');
        expect(result[1].transactionId).toBe('txn-002');
      });

      it('should filter transactions by date range', function() {
        var filters = { startDate: '2024-01-15', endDate: '2024-02-05' };
        var result = SearchFilterService.applyFilters(mockTransactions, filters);

        expect(result.length).toBe(3);
        expect(result[0].transactionId).toBe('txn-001');
        expect(result[1].transactionId).toBe('txn-002');
        expect(result[2].transactionId).toBe('txn-003');
      });

      it('should filter transactions by cardId', function() {
        var filters = { cardId: 'card-001' };
        var result = SearchFilterService.applyFilters(mockTransactions, filters);

        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('card-001');
        expect(result[1].cardId).toBe('card-001');
      });

      it('should apply multiple filters simultaneously', function() {
        var filters = {
          searchTerm: 'Amazon',
          startDate: '2024-02-01',
          cardId: 'card-001'
        };
        var result = SearchFilterService.applyFilters(mockTransactions, filters);

        expect(result.length).toBe(1);
        expect(result[0].transactionId).toBe('txn-003');
      });

      it('should return all transactions when no filters applied', function() {
        var filters = {};
        var result = SearchFilterService.applyFilters(mockTransactions, filters);

        expect(result.length).toBe(4);
        expect(result).toEqual(mockTransactions);
      });

      it('should return empty array when no transactions match', function() {
        var filters = { searchTerm: 'NonExistentMerchant' };
        var result = SearchFilterService.applyFilters(mockTransactions, filters);

        expect(result.length).toBe(0);
      });

      it('should handle empty transaction array', function() {
        var filters = { searchTerm: 'Test' };
        var result = SearchFilterService.applyFilters([], filters);

        expect(result.length).toBe(0);
      });
    });

    describe('buildQueryParams', function() {
      it('should build query params with all filter values', function() {
        var filters = {
          searchTerm: 'Starbucks',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          cardId: 'card-001'
        };

        var result = SearchFilterService.buildQueryParams(filters);

        expect(result.search).toBe('Starbucks');
        expect(result.startDate).toBe('2024-01-01');
        expect(result.endDate).toBe('2024-01-31');
        expect(result.cardId).toBe('card-001');
      });

      it('should build query params with partial filter values', function() {
        var filters = {
          searchTerm: 'Amazon',
          startDate: '2024-01-01'
        };

        var result = SearchFilterService.buildQueryParams(filters);

        expect(result.search).toBe('Amazon');
        expect(result.startDate).toBe('2024-01-01');
        expect(result.endDate).toBeUndefined();
        expect(result.cardId).toBeUndefined();
      });

      it('should return empty object when no filters provided', function() {
        var filters = {};
        var result = SearchFilterService.buildQueryParams(filters);

        expect(Object.keys(result).length).toBe(0);
      });

      it('should ignore null and undefined filter values', function() {
        var filters = {
          searchTerm: null,
          startDate: undefined,
          endDate: '2024-01-31',
          cardId: ''
        };

        var result = SearchFilterService.buildQueryParams(filters);

        expect(result.search).toBeUndefined();
        expect(result.startDate).toBeUndefined();
        expect(result.endDate).toBe('2024-01-31');
        expect(result.cardId).toBeUndefined();
      });

      it('should handle filters with only searchTerm', function() {
        var filters = { searchTerm: 'Test Merchant' };
        var result = SearchFilterService.buildQueryParams(filters);

        expect(result.search).toBe('Test Merchant');
        expect(Object.keys(result).length).toBe(1);
      });

      it('should handle filters with only date range', function() {
        var filters = {
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        };

        var result = SearchFilterService.buildQueryParams(filters);

        expect(result.startDate).toBe('2024-01-01');
        expect(result.endDate).toBe('2024-12-31');
        expect(Object.keys(result).length).toBe(2);
      });
    });
  });
})();