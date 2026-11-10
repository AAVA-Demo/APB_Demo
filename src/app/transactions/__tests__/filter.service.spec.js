/*
Test Documentation:
- Test Name: FilterService - getFilters
- Purpose: Validates retrieval of current filter state
- Scenario: getFilters is called
- Expected Result: Returns copy of current filters
*/
/*
Test Documentation:
- Test Name: FilterService - setFilters
- Purpose: Validates updating filter state
- Scenario: setFilters is called with new filter values
- Expected Result: Filters are updated correctly
*/
/*
Test Documentation:
- Test Name: FilterService - resetFilters
- Purpose: Validates resetting filters to default state
- Scenario: resetFilters is called after filters are modified
- Expected Result: All filters return to default values
*/
/*
Test Documentation:
- Test Name: FilterService - partial filter update
- Purpose: Validates partial filter updates
- Scenario: setFilters called with subset of filters
- Expected Result: Only specified filters are updated
*/
/*
Coverage Report:
- Functions tested: getFilters(), setFilters(), resetFilters()
- Scenarios covered: get, set, reset, partial updates, isolation
- Uncovered scenarios: invalid filter values, type validation
*/

(function() {
  'use strict';

  describe('FilterService', function() {
    var FilterService;

    beforeEach(module('app.transactions'));

    beforeEach(inject(function(_FilterService_) {
      FilterService = _FilterService_;
    }));

    describe('getFilters()', function() {
      it('should return default filters on first call', function() {
        var filters = FilterService.getFilters();

        expect(filters.startDate).toBe(null);
        expect(filters.endDate).toBe(null);
        expect(filters.cardIds).toEqual([]);
        expect(filters.minAmount).toBe(null);
        expect(filters.maxAmount).toBe(null);
        expect(filters.searchTerm).toBe('');
        expect(filters.sortBy).toBe('date');
        expect(filters.sortOrder).toBe('desc');
      });

      it('should return a copy of filters, not reference', function() {
        var filters1 = FilterService.getFilters();
        filters1.searchTerm = 'modified';

        var filters2 = FilterService.getFilters();
        expect(filters2.searchTerm).toBe('');
      });
    });

    describe('setFilters()', function() {
      it('should update filters with new values', function() {
        var newFilters = {
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          searchTerm: 'coffee',
          minAmount: 10,
          maxAmount: 100
        };

        FilterService.setFilters(newFilters);
        var filters = FilterService.getFilters();

        expect(filters.startDate).toBe('2024-01-01');
        expect(filters.endDate).toBe('2024-01-31');
        expect(filters.searchTerm).toBe('coffee');
        expect(filters.minAmount).toBe(10);
        expect(filters.maxAmount).toBe(100);
      });

      it('should perform partial updates without affecting other filters', function() {
        FilterService.setFilters({ searchTerm: 'test' });
        var filters = FilterService.getFilters();

        expect(filters.searchTerm).toBe('test');
        expect(filters.sortBy).toBe('date');
        expect(filters.sortOrder).toBe('desc');
      });

      it('should update cardIds array', function() {
        FilterService.setFilters({ cardIds: ['card1', 'card2', 'card3'] });
        var filters = FilterService.getFilters();

        expect(filters.cardIds).toEqual(['card1', 'card2', 'card3']);
      });
    });

    describe('resetFilters()', function() {
      it('should reset all filters to default values', function() {
        FilterService.setFilters({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          searchTerm: 'coffee',
          minAmount: 10,
          maxAmount: 100,
          cardIds: ['card1'],
          sortBy: 'amount',
          sortOrder: 'asc'
        });

        FilterService.resetFilters();
        var filters = FilterService.getFilters();

        expect(filters.startDate).toBe(null);
        expect(filters.endDate).toBe(null);
        expect(filters.cardIds).toEqual([]);
        expect(filters.minAmount).toBe(null);
        expect(filters.maxAmount).toBe(null);
        expect(filters.searchTerm).toBe('');
        expect(filters.sortBy).toBe('date');
        expect(filters.sortOrder).toBe('desc');
      });
    });
  });
})();