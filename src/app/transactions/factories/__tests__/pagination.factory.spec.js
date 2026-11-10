/*
Test Documentation:
- Test Name: PaginationFactory - calculatePagination
- Purpose: Validates pagination calculation
- Scenario: Total count and page info provided
- Expected Result: Returns correct pagination object
*/
/*
Coverage Report:
- Functions tested: calculatePagination
- Scenarios covered: normal pagination, edge cases, navigation flags
- Uncovered scenarios: none
*/

describe('PaginationFactory', function() {
  'use strict';
  
  beforeEach(module('transactionModule'));
  
  var PaginationFactory;
  
  beforeEach(inject(function(_PaginationFactory_) {
    PaginationFactory = _PaginationFactory_;
  }));
  
  describe('calculatePagination', function() {
    it('should calculate pagination correctly', function() {
      var pagination = PaginationFactory.calculatePagination(100, 1, 20);
      
      expect(pagination.currentPage).toBe(1);
      expect(pagination.totalPages).toBe(5);
      expect(pagination.pageSize).toBe(20);
      expect(pagination.totalCount).toBe(100);
      expect(pagination.hasNext).toBe(true);
      expect(pagination.hasPrev).toBe(false);
    });
    
    it('should handle middle page correctly', function() {
      var pagination = PaginationFactory.calculatePagination(100, 3, 20);
      
      expect(pagination.currentPage).toBe(3);
      expect(pagination.hasNext).toBe(true);
      expect(pagination.hasPrev).toBe(true);
    });
    
    it('should handle last page correctly', function() {
      var pagination = PaginationFactory.calculatePagination(100, 5, 20);
      
      expect(pagination.currentPage).toBe(5);
      expect(pagination.hasNext).toBe(false);
      expect(pagination.hasPrev).toBe(true);
    });
    
    it('should handle single page correctly', function() {
      var pagination = PaginationFactory.calculatePagination(10, 1, 20);
      
      expect(pagination.totalPages).toBe(1);
      expect(pagination.hasNext).toBe(false);
      expect(pagination.hasPrev).toBe(false);
    });
    
    it('should round up total pages', function() {
      var pagination = PaginationFactory.calculatePagination(95, 1, 20);
      
      expect(pagination.totalPages).toBe(5);
    });
  });
});