/*
Test Documentation:
- Test Name: SearchFilterService Test Suite
- Purpose: Validate search and filter functionality for transactions
- Scenario: Tests filtering by search text, card selection, and date range
- Expected Result: Transactions are filtered correctly based on applied criteria
*/

(function() {
  'use strict';

  describe('SearchFilterService', function() {
    var SearchFilterService, $filter;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_SearchFilterService_, _$filter_) {
      SearchFilterService = _SearchFilterService_;
      $filter = _$filter_;
    }));

    afterEach(function() {
      SearchFilterService.resetFilters();
    });

    describe('applyFilters', function() {
      it('should filter transactions by search text', function() {
        var transactions = [
          { transactionId: 'txn-001', merchantName: 'Starbucks', amount: 10 },
          { transactionId: 'txn-002', merchantName: 'Shell Gas', amount: 50 },
          { transactionId: 'txn-003', merchantName: 'Amazon', amount: 100 }
        ];

        SearchFilterService.setSearchText('Starbucks');
        var result = SearchFilterService.applyFilters(transactions);

        expect(result.length).toBe(1);
        expect(result[0].merchantName).toBe('Starbucks');
      });

      it('should filter transactions by selected card', function() {
        var transactions = [
          { transactionId: 'txn-001', cardId: 'card-001', amount: 10 },
          { transactionId: 'txn-002', cardId: 'card-002', amount: 50 },
          { transactionId: 'txn-003', cardId: 'card-001', amount: 100 }
        ];

        SearchFilterService.setSelectedCard('card-001');
        var result = SearchFilterService.applyFilters(transactions);

        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('card-001');
        expect(result[1].cardId).toBe('card-001');
      });

      it('should filter transactions by date range (from date)', function() {
        var transactions = [
          { transactionId: 'txn-001', transactionDate: '2026-01-15', amount: 10 },
          { transactionId: 'txn-002', transactionDate: '2026-02-20', amount: 50 },
          { transactionId: 'txn-003', transactionDate: '2026-03-25', amount: 100 }
        ];

        SearchFilterService.setDateRange('2026-02-01', null);
        var result = SearchFilterService.applyFilters(transactions);

        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('txn-002');
        expect(result[1].transactionId).toBe('txn-003');
      });

      it('should filter transactions by date range (to date)', function() {
        var transactions = [
          { transactionId: 'txn-001', transactionDate: '2026-01-15', amount: 10 },
          { transactionId: 'txn-002', transactionDate: '2026-02-20', amount: 50 },
          { transactionId: 'txn-003', transactionDate: '2026-03-25', amount: 100 }
        ];

        SearchFilterService.setDateRange(null, '2026-02-28');
        var result = SearchFilterService.applyFilters(transactions);

        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('txn-001');
        expect(result[1].transactionId).toBe('txn-002');
      });

      it('should filter transactions by complete date range', function() {
        var transactions = [
          { transactionId: 'txn-001', transactionDate: '2026-01-15', amount: 10 },
          { transactionId: 'txn-002', transactionDate: '2026-02-20', amount: 50 },
          { transactionId: 'txn-003', transactionDate: '2026-03-25', amount: 100 }
        ];

        SearchFilterService.setDateRange('2026-02-01', '2026-02-28');
        var result = SearchFilterService.applyFilters(transactions);

        expect(result.length).toBe(1);
        expect(result[0].transactionId).toBe('txn-002');
      });

      it('should apply multiple filters simultaneously', function() {
        var transactions = [
          { transactionId: 'txn-001', cardId: 'card-001', merchantName: 'Starbucks', transactionDate: '2026-01-15', amount: 10 },
          { transactionId: 'txn-002', cardId: 'card-001', merchantName: 'Shell Gas', transactionDate: '2026-02-20', amount: 50 },
          { transactionId: 'txn-003', cardId: 'card-002', merchantName: 'Starbucks', transactionDate: '2026-02-25', amount: 100 }
        ];

        SearchFilterService.setSearchText('Starbucks');
        SearchFilterService.setSelectedCard('card-001');
        SearchFilterService.setDateRange('2026-01-01', '2026-01-31');
        var result = SearchFilterService.applyFilters(transactions);

        expect(result.length).toBe(1);
        expect(result[0].transactionId).toBe('txn-001');
      });

      it('should return all transactions when no filters are applied', function() {
        var transactions = [
          { transactionId: 'txn-001', amount: 10 },
          { transactionId: 'txn-002', amount: 50 },
          { transactionId: 'txn-003', amount: 100 }
        ];

        var result = SearchFilterService.applyFilters(transactions);

        expect(result.length).toBe(3);
      });
    });

    describe('filter state management', function() {
      it('should set and retrieve search text', function() {
        SearchFilterService.setSearchText('test search');
        var state = SearchFilterService.getFilterState();

        expect(state.searchText).toBe('test search');
      });

      it('should set and retrieve selected card', function() {
        SearchFilterService.setSelectedCard('card-123');
        var state = SearchFilterService.getFilterState();

        expect(state.selectedCard).toBe('card-123');
      });

      it('should set and retrieve date range', function() {
        SearchFilterService.setDateRange('2026-01-01', '2026-12-31');
        var state = SearchFilterService.getFilterState();

        expect(state.dateFrom).toBe('2026-01-01');
        expect(state.dateTo).toBe('2026-12-31');
      });

      it('should reset all filters to default state', function() {
        SearchFilterService.setSearchText('test');
        SearchFilterService.setSelectedCard('card-001');
        SearchFilterService.setDateRange('2026-01-01', '2026-12-31');

        SearchFilterService.resetFilters();
        var state = SearchFilterService.getFilterState();

        expect(state.searchText).toBe('');
        expect(state.selectedCard).toBe(null);
        expect(state.dateFrom).toBe(null);
        expect(state.dateTo).toBe(null);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: applyFilters, setSearchText, setSelectedCard, setDateRange, getFilterState, resetFilters
- Scenarios covered:
  * Search text filtering
  * Card selection filtering
  * Date range filtering (from, to, complete range)
  * Multiple simultaneous filters
  * No filters applied
  * Filter state management
  * Filter reset functionality
- Uncovered scenarios: None - comprehensive coverage achieved
*/