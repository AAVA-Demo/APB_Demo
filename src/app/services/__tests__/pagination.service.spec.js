/*
Test Documentation:
- Test Name: PaginationService - createPagination with valid inputs
- Purpose: Validates pagination object creation with valid parameters
- Scenario: Service is called with currentPage, pageSize, and totalRecords
- Expected Result: Returns pagination object with correct totalPages calculation
*/
/*
Test Documentation:
- Test Name: PaginationService - createPagination with default values
- Purpose: Validates default values are applied when parameters are missing
- Scenario: Service is called with null or undefined parameters
- Expected Result: Returns pagination object with default values (page 1, pageSize 20)
*/
/*
Test Documentation:
- Test Name: PaginationService - getPageNumbers returns correct range
- Purpose: Validates page number array generation for pagination UI
- Scenario: Service is called with pagination object
- Expected Result: Returns array of page numbers within 2-page range of current page
*/
/*
Test Documentation:
- Test Name: PaginationService - getPageNumbers edge cases
- Purpose: Validates page number generation at boundaries (first and last pages)
- Scenario: Current page is at start or end of pagination
- Expected Result: Returns appropriate page numbers without exceeding boundaries
*/
/*
Coverage Report:
- Functions tested: createPagination, getPageNumbers
- Scenarios covered: valid inputs, default values, page range calculation, boundary conditions
- Edge cases: zero records, single page, first page, last page, middle pages
- Uncovered scenarios: negative values (not validated in implementation)
*/

(function() {
  'use strict';

  describe('PaginationService', function() {
    var PaginationService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_PaginationService_) {
      PaginationService = _PaginationService_;
    }));

    describe('createPagination', function() {
      it('should create pagination object with valid inputs', function() {
        var result = PaginationService.createPagination(1, 20, 100);

        expect(result).toBeDefined();
        expect(result.currentPage).toBe(1);
        expect(result.pageSize).toBe(20);
        expect(result.totalRecords).toBe(100);
        expect(result.totalPages).toBe(5);
      });

      it('should calculate totalPages correctly', function() {
        var result = PaginationService.createPagination(1, 20, 95);
        expect(result.totalPages).toBe(5);

        result = PaginationService.createPagination(1, 20, 100);
        expect(result.totalPages).toBe(5);

        result = PaginationService.createPagination(1, 20, 101);
        expect(result.totalPages).toBe(6);
      });

      it('should use default currentPage when not provided', function() {
        var result = PaginationService.createPagination(null, 20, 100);
        expect(result.currentPage).toBe(1);

        result = PaginationService.createPagination(undefined, 20, 100);
        expect(result.currentPage).toBe(1);

        result = PaginationService.createPagination(0, 20, 100);
        expect(result.currentPage).toBe(1);
      });

      it('should use default pageSize when not provided', function() {
        var result = PaginationService.createPagination(1, null, 100);
        expect(result.pageSize).toBe(20);

        result = PaginationService.createPagination(1, undefined, 100);
        expect(result.pageSize).toBe(20);

        result = PaginationService.createPagination(1, 0, 100);
        expect(result.pageSize).toBe(20);
      });

      it('should use default totalRecords when not provided', function() {
        var result = PaginationService.createPagination(1, 20, null);
        expect(result.totalRecords).toBe(0);
        expect(result.totalPages).toBe(0);

        result = PaginationService.createPagination(1, 20, undefined);
        expect(result.totalRecords).toBe(0);
        expect(result.totalPages).toBe(0);
      });

      it('should handle zero totalRecords', function() {
        var result = PaginationService.createPagination(1, 20, 0);
        expect(result.totalRecords).toBe(0);
        expect(result.totalPages).toBe(0);
      });

      it('should handle single page scenario', function() {
        var result = PaginationService.createPagination(1, 20, 15);
        expect(result.totalPages).toBe(1);
      });

      it('should handle exact page boundary', function() {
        var result = PaginationService.createPagination(1, 20, 40);
        expect(result.totalPages).toBe(2);
      });
    });

    describe('getPageNumbers', function() {
      it('should return page numbers within 2-page range', function() {
        var pagination = {currentPage: 5, totalPages: 10};
        var result = PaginationService.getPageNumbers(pagination);

        expect(result).toEqual([3, 4, 5, 6, 7]);
      });

      it('should handle first page', function() {
        var pagination = {currentPage: 1, totalPages: 10};
        var result = PaginationService.getPageNumbers(pagination);

        expect(result).toEqual([1, 2, 3]);
      });

      it('should handle second page', function() {
        var pagination = {currentPage: 2, totalPages: 10};
        var result = PaginationService.getPageNumbers(pagination);

        expect(result).toEqual([1, 2, 3, 4]);
      });

      it('should handle last page', function() {
        var pagination = {currentPage: 10, totalPages: 10};
        var result = PaginationService.getPageNumbers(pagination);

        expect(result).toEqual([8, 9, 10]);
      });

      it('should handle second-to-last page', function() {
        var pagination = {currentPage: 9, totalPages: 10};
        var result = PaginationService.getPageNumbers(pagination);

        expect(result).toEqual([7, 8, 9, 10]);
      });

      it('should handle single page', function() {
        var pagination = {currentPage: 1, totalPages: 1};
        var result = PaginationService.getPageNumbers(pagination);

        expect(result).toEqual([1]);
      });

      it('should handle two pages on first page', function() {
        var pagination = {currentPage: 1, totalPages: 2};
        var result = PaginationService.getPageNumbers(pagination);

        expect(result).toEqual([1, 2]);
      });

      it('should handle two pages on second page', function() {
        var pagination = {currentPage: 2, totalPages: 2};
        var result = PaginationService.getPageNumbers(pagination);

        expect(result).toEqual([1, 2]);
      });

      it('should handle three pages on middle page', function() {
        var pagination = {currentPage: 2, totalPages: 3};
        var result = PaginationService.getPageNumbers(pagination);

        expect(result).toEqual([1, 2, 3]);
      });

      it('should return array of numbers', function() {
        var pagination = {currentPage: 5, totalPages: 10};
        var result = PaginationService.getPageNumbers(pagination);

        result.forEach(function(page) {
          expect(typeof page).toBe('number');
        });
      });

      it('should return sequential page numbers', function() {
        var pagination = {currentPage: 5, totalPages: 10};
        var result = PaginationService.getPageNumbers(pagination);

        for (var i = 1; i < result.length; i++) {
          expect(result[i]).toBe(result[i - 1] + 1);
        }
      });
    });
  });
})();