/*
Test Documentation:
- Test Name: CategoryService - getCategories success scenario
- Purpose: Validates that getCategories successfully retrieves category data from API
- Scenario: HTTP GET request returns successful response with category data
- Expected Result: Promise resolves with category array
*/
/*
Test Documentation:
- Test Name: CategoryService - getCategories error scenario
- Purpose: Validates error handling when API call fails
- Scenario: HTTP GET request fails with error
- Expected Result: Promise rejects with error and logs error to console
*/
/*
Test Documentation:
- Test Name: CategoryService - getMockCategories success scenario
- Purpose: Validates that getMockCategories returns all 9 predefined categories
- Scenario: getMockCategories is called without parameters
- Expected Result: Promise resolves with array of 9 category strings
*/
/*
Coverage Report:
- Functions tested: getCategories (success/error), getMockCategories
- Scenarios covered: successful API call, failed API call, mock data retrieval, category validation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CategoryService', function() {
    var CategoryService, $httpBackend, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategoryService_, _$httpBackend_, _$q_) {
      CategoryService = _CategoryService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCategories', function() {
      it('should successfully retrieve categories from API', function() {
        var mockCategories = ['Food & Dining', 'Fuel', 'Shopping'];

        $httpBackend.expectGET('/api/categories').respond(200, mockCategories);

        var result;
        CategoryService.getCategories().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCategories);
        expect(result.length).toBe(3);
      });

      it('should handle error when API call fails', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/categories').respond(500, 'Internal Server Error');

        var errorResult;
        CategoryService.getCategories().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching categories:', jasmine.any(Object));
      });

      it('should handle 404 error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/categories').respond(404, 'Not Found');

        var errorResult;
        CategoryService.getCategories().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe('getMockCategories', function() {
      it('should return array of 9 predefined categories', function() {
        var result;
        CategoryService.getMockCategories().then(function(data) {
          result = data;
        });

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(9);
      });

      it('should return all expected category names', function() {
        var result;
        var expectedCategories = [
          'Food & Dining',
          'Fuel',
          'Shopping',
          'Travel',
          'Entertainment',
          'Utilities',
          'Healthcare',
          'Education',
          'Miscellaneous'
        ];

        CategoryService.getMockCategories().then(function(data) {
          result = data;
        });

        expect(result).toEqual(expectedCategories);
      });

      it('should return categories as strings', function() {
        var result;
        CategoryService.getMockCategories().then(function(data) {
          result = data;
        });

        result.forEach(function(category) {
          expect(typeof category).toBe('string');
          expect(category.length).toBeGreaterThan(0);
        });
      });

      it('should include Food & Dining category', function() {
        var result;
        CategoryService.getMockCategories().then(function(data) {
          result = data;
        });

        expect(result).toContain('Food & Dining');
      });

      it('should include all spending categories', function() {
        var result;
        CategoryService.getMockCategories().then(function(data) {
          result = data;
        });

        expect(result).toContain('Fuel');
        expect(result).toContain('Shopping');
        expect(result).toContain('Travel');
        expect(result).toContain('Entertainment');
        expect(result).toContain('Utilities');
        expect(result).toContain('Healthcare');
        expect(result).toContain('Education');
        expect(result).toContain('Miscellaneous');
      });
    });
  });
})();