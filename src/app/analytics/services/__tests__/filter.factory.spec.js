/*
Test Documentation:
- Test Name: FilterFactory Unit Tests
- Purpose: Validate filter management for analytics including date range and category filtering
- Scenario: Tests cover filter initialization, date range updates, category filtering, and event broadcasting
- Expected Result: Filter state is managed correctly with proper event broadcasting for UI updates
*/

(function() {
  'use strict';

  describe('FilterFactory', function() {
    var FilterFactory, $rootScope;

    beforeEach(module('app.analytics'));

    beforeEach(inject(function(_FilterFactory_, _$rootScope_) {
      FilterFactory = _FilterFactory_;
      $rootScope = _$rootScope_;
    }));

    describe('getFilter', function() {
      it('should return current filter state', function() {
        var filter = FilterFactory.getFilter();
        
        expect(filter).toBeDefined();
        expect(filter.dateRange).toBeDefined();
        expect(filter.dateRange.start).toBeDefined();
        expect(filter.dateRange.end).toBeDefined();
        expect(filter.category).toBeNull();
      });

      it('should return a copy of filter state', function() {
        var filter1 = FilterFactory.getFilter();
        var filter2 = FilterFactory.getFilter();
        
        expect(filter1).not.toBe(filter2);
        expect(filter1).toEqual(filter2);
      });

      it('should initialize with default date range of last 12 months', function() {
        var filter = FilterFactory.getFilter();
        var now = new Date();
        var expectedStart = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        
        expect(filter.dateRange.start.getFullYear()).toBe(expectedStart.getFullYear());
        expect(filter.dateRange.start.getMonth()).toBe(expectedStart.getMonth());
      });
    });

    describe('setDateRange', function() {
      it('should update date range', function() {
        var startDate = new Date(2024, 0, 1);
        var endDate = new Date(2024, 11, 31);
        
        FilterFactory.setDateRange(startDate, endDate);
        
        var filter = FilterFactory.getFilter();
        expect(filter.dateRange.start).toEqual(startDate);
        expect(filter.dateRange.end).toEqual(endDate);
      });

      it('should broadcast filter-changed event', function() {
        spyOn($rootScope, '$broadcast');
        var startDate = new Date(2024, 0, 1);
        var endDate = new Date(2024, 11, 31);
        
        FilterFactory.setDateRange(startDate, endDate);
        
        expect($rootScope.$broadcast).toHaveBeenCalledWith('filter-changed', jasmine.any(Object));
      });

      it('should include updated filter in broadcast', function() {
        var broadcastedFilter;
        $rootScope.$on('filter-changed', function(event, filter) {
          broadcastedFilter = filter;
        });
        
        var startDate = new Date(2024, 0, 1);
        var endDate = new Date(2024, 11, 31);
        
        FilterFactory.setDateRange(startDate, endDate);
        
        expect(broadcastedFilter.dateRange.start).toEqual(startDate);
        expect(broadcastedFilter.dateRange.end).toEqual(endDate);
      });
    });

    describe('setCategory', function() {
      it('should update category filter', function() {
        FilterFactory.setCategory('Food & Dining');
        
        var filter = FilterFactory.getFilter();
        expect(filter.category).toBe('Food & Dining');
      });

      it('should broadcast filter-changed event', function() {
        spyOn($rootScope, '$broadcast');
        
        FilterFactory.setCategory('Shopping');
        
        expect($rootScope.$broadcast).toHaveBeenCalledWith('filter-changed', jasmine.any(Object));
      });

      it('should allow multiple category changes', function() {
        FilterFactory.setCategory('Food & Dining');
        FilterFactory.setCategory('Shopping');
        
        var filter = FilterFactory.getFilter();
        expect(filter.category).toBe('Shopping');
      });

      it('should include updated filter in broadcast', function() {
        var broadcastedFilter;
        $rootScope.$on('filter-changed', function(event, filter) {
          broadcastedFilter = filter;
        });
        
        FilterFactory.setCategory('Travel');
        
        expect(broadcastedFilter.category).toBe('Travel');
      });
    });

    describe('clearCategory', function() {
      it('should clear category filter', function() {
        FilterFactory.setCategory('Food & Dining');
        FilterFactory.clearCategory();
        
        var filter = FilterFactory.getFilter();
        expect(filter.category).toBeNull();
      });

      it('should broadcast filter-changed event', function() {
        spyOn($rootScope, '$broadcast');
        FilterFactory.setCategory('Food & Dining');
        
        FilterFactory.clearCategory();
        
        expect($rootScope.$broadcast).toHaveBeenCalledWith('filter-changed', jasmine.any(Object));
      });

      it('should handle clearing when no category is set', function() {
        expect(function() {
          FilterFactory.clearCategory();
        }).not.toThrow();
        
        var filter = FilterFactory.getFilter();
        expect(filter.category).toBeNull();
      });
    });

    describe('reset', function() {
      it('should reset to default filter state', function() {
        FilterFactory.setCategory('Food & Dining');
        FilterFactory.setDateRange(new Date(2024, 0, 1), new Date(2024, 11, 31));
        
        FilterFactory.reset();
        
        var filter = FilterFactory.getFilter();
        expect(filter.category).toBeNull();
        expect(filter.dateRange.start).toBeDefined();
        expect(filter.dateRange.end).toBeDefined();
      });

      it('should broadcast filter-changed event', function() {
        spyOn($rootScope, '$broadcast');
        
        FilterFactory.reset();
        
        expect($rootScope.$broadcast).toHaveBeenCalledWith('filter-changed', jasmine.any(Object));
      });

      it('should reset date range to last 12 months', function() {
        FilterFactory.setDateRange(new Date(2024, 0, 1), new Date(2024, 11, 31));
        
        FilterFactory.reset();
        
        var filter = FilterFactory.getFilter();
        var now = new Date();
        var expectedStart = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        
        expect(filter.dateRange.start.getFullYear()).toBe(expectedStart.getFullYear());
        expect(filter.dateRange.start.getMonth()).toBe(expectedStart.getMonth());
      });

      it('should allow multiple resets', function() {
        FilterFactory.setCategory('Food & Dining');
        FilterFactory.reset();
        FilterFactory.setCategory('Shopping');
        FilterFactory.reset();
        
        var filter = FilterFactory.getFilter();
        expect(filter.category).toBeNull();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getFilter, setDateRange, setCategory, clearCategory, reset
- Scenarios covered:
  * Filter state retrieval
  * Filter state copying
  * Default date range initialization (12 months)
  * Date range updates
  * Event broadcasting for date changes
  * Category filtering
  * Event broadcasting for category changes
  * Multiple category changes
  * Category clearing
  * Clearing when no category set
  * Filter reset to defaults
  * Event broadcasting for reset
  * Date range reset to 12 months
  * Multiple resets
- Uncovered scenarios: None - all filter management operations tested
- Edge cases: No category set, multiple updates, reset operations, event broadcasting
*/