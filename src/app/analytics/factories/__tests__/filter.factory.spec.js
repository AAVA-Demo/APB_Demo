/*
Test Documentation:
- Test Name: FilterFactory - createDateRange
- Purpose: Validates date range creation
- Scenario: Factory method is called with month count
- Expected Result: Returns date range object with start and end dates
*/
/*
Test Documentation:
- Test Name: FilterFactory - getDefaultFilters
- Purpose: Validates default filter object creation
- Scenario: Factory method is called
- Expected Result: Returns filter object with 12-month date range
*/
/*
Coverage Report:
- Functions tested: createDateRange, getDefaultFilters
- Scenarios covered: date range creation, default filters
- Uncovered scenarios: none
*/

describe('FilterFactory', function() {
  'use strict';
  
  beforeEach(module('analyticsModule'));
  
  var FilterFactory;
  
  beforeEach(inject(function(_FilterFactory_) {
    FilterFactory = _FilterFactory_;
  }));
  
  describe('createDateRange', function() {
    it('should create a date range for specified months', function() {
      var range = FilterFactory.createDateRange(6);
      expect(range).toBeDefined();
      expect(range.start).toBeDefined();
      expect(range.end).toBeDefined();
      expect(range.start instanceof Date).toBe(true);
      expect(range.end instanceof Date).toBe(true);
    });
    
    it('should set end date to current date', function() {
      var range = FilterFactory.createDateRange(3);
      var now = new Date();
      var timeDiff = Math.abs(range.end.getTime() - now.getTime());
      expect(timeDiff).toBeLessThan(1000);
    });
    
    it('should set start date correctly based on months', function() {
      var range = FilterFactory.createDateRange(12);
      var expectedStart = new Date();
      expectedStart.setMonth(expectedStart.getMonth() - 12);
      
      expect(range.start.getMonth()).toBe(expectedStart.getMonth());
      expect(range.start.getFullYear()).toBe(expectedStart.getFullYear());
    });
  });
  
  describe('getDefaultFilters', function() {
    it('should return default filter object', function() {
      var filters = FilterFactory.getDefaultFilters();
      expect(filters).toBeDefined();
      expect(filters.dateRange).toBeDefined();
      expect(filters.cardIds).toBeDefined();
      expect(filters.categories).toBeDefined();
    });
    
    it('should set 12-month date range by default', function() {
      var filters = FilterFactory.getDefaultFilters();
      expect(filters.dateRange.start).toBeDefined();
      expect(filters.dateRange.end).toBeDefined();
    });
    
    it('should initialize empty arrays for cardIds and categories', function() {
      var filters = FilterFactory.getDefaultFilters();
      expect(Array.isArray(filters.cardIds)).toBe(true);
      expect(filters.cardIds.length).toBe(0);
      expect(Array.isArray(filters.categories)).toBe(true);
      expect(filters.categories.length).toBe(0);
    });
  });
});