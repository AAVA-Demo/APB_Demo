/*
Test Documentation:
- Test Name: PaginationHelper Factory
- Purpose: Validate pagination helper functionality
- Scenario: Pagination initialization, navigation, page size management
- Expected Result: Factory correctly manages pagination state and navigation
*/

describe('PaginationHelper Factory', function() {
  'use strict';

  beforeEach(module('creditCard.transactions'));

  var PaginationHelper;
  var paginationHelper;

  beforeEach(inject(function(_PaginationHelper_) {
    PaginationHelper = _PaginationHelper_;
    paginationHelper = new PaginationHelper();
  }));

  it('should create PaginationHelper instance', function() {
    expect(paginationHelper).toBeDefined();
  });

  it('should initialize with default values', function() {
    expect(paginationHelper.currentPage).toBe(1);
    expect(paginationHelper.totalPages).toBe(1);
    expect(paginationHelper.pageSize).toBe(20);
    expect(paginationHelper.totalRecords).toBe(0);
  });

  describe('initialize method', function() {
    it('should initialize pagination with provided values', function() {
      var pagination = {
        currentPage: 2,
        totalPages: 5,
        pageSize: 25,
        totalRecords: 100
      };
      
      paginationHelper.initialize(pagination);
      
      expect(paginationHelper.currentPage).toBe(2);
      expect(paginationHelper.totalPages).toBe(5);
      expect(paginationHelper.pageSize).toBe(25);
      expect(paginationHelper.totalRecords).toBe(100);
    });

    it('should use default values for missing properties', function() {
      paginationHelper.initialize({});
      
      expect(paginationHelper.currentPage).toBe(1);
      expect(paginationHelper.totalPages).toBe(1);
      expect(paginationHelper.pageSize).toBe(20);
      expect(paginationHelper.totalRecords).toBe(0);
    });
  });

  describe('nextPage method', function() {
    it('should increment current page when not at last page', function() {
      paginationHelper.initialize({ currentPage: 2, totalPages: 5 });
      
      var result = paginationHelper.nextPage();
      
      expect(result).toBe(true);
      expect(paginationHelper.currentPage).toBe(3);
    });

    it('should not increment when at last page', function() {
      paginationHelper.initialize({ currentPage: 5, totalPages: 5 });
      
      var result = paginationHelper.nextPage();
      
      expect(result).toBe(false);
      expect(paginationHelper.currentPage).toBe(5);
    });

    it('should handle single page scenario', function() {
      paginationHelper.initialize({ currentPage: 1, totalPages: 1 });
      
      var result = paginationHelper.nextPage();
      
      expect(result).toBe(false);
      expect(paginationHelper.currentPage).toBe(1);
    });
  });

  describe('prevPage method', function() {
    it('should decrement current page when not at first page', function() {
      paginationHelper.initialize({ currentPage: 3, totalPages: 5 });
      
      var result = paginationHelper.prevPage();
      
      expect(result).toBe(true);
      expect(paginationHelper.currentPage).toBe(2);
    });

    it('should not decrement when at first page', function() {
      paginationHelper.initialize({ currentPage: 1, totalPages: 5 });
      
      var result = paginationHelper.prevPage();
      
      expect(result).toBe(false);
      expect(paginationHelper.currentPage).toBe(1);
    });
  });

  describe('goToPage method', function() {
    beforeEach(function() {
      paginationHelper.initialize({ currentPage: 1, totalPages: 10 });
    });

    it('should navigate to valid page number', function() {
      var result = paginationHelper.goToPage(5);
      
      expect(result).toBe(true);
      expect(paginationHelper.currentPage).toBe(5);
    });

    it('should not navigate to page less than 1', function() {
      var result = paginationHelper.goToPage(0);
      
      expect(result).toBe(false);
      expect(paginationHelper.currentPage).toBe(1);
    });

    it('should not navigate to page greater than totalPages', function() {
      var result = paginationHelper.goToPage(11);
      
      expect(result).toBe(false);
      expect(paginationHelper.currentPage).toBe(1);
    });

    it('should navigate to first page', function() {
      paginationHelper.currentPage = 5;
      var result = paginationHelper.goToPage(1);
      
      expect(result).toBe(true);
      expect(paginationHelper.currentPage).toBe(1);
    });

    it('should navigate to last page', function() {
      var result = paginationHelper.goToPage(10);
      
      expect(result).toBe(true);
      expect(paginationHelper.currentPage).toBe(10);
    });
  });

  describe('setPageSize method', function() {
    it('should update page size', function() {
      paginationHelper.setPageSize(50);
      
      expect(paginationHelper.pageSize).toBe(50);
    });

    it('should reset current page to 1', function() {
      paginationHelper.initialize({ currentPage: 5, totalPages: 10 });
      paginationHelper.setPageSize(30);
      
      expect(paginationHelper.currentPage).toBe(1);
    });
  });
});

/*
Coverage Report:
- Functions tested: initialize, nextPage, prevPage, goToPage, setPageSize
- Scenarios covered: initialization, page navigation, boundary conditions, page size changes
- Edge cases: first/last page, invalid page numbers, single page
- Uncovered scenarios: none
*/