/*
Test Documentation:
- Test Name: CategoryService - getCategoryMetadata
- Purpose: Validates retrieval of category metadata
- Scenario: Request category list via promise
- Expected Result: Returns promise resolving to array of categories
*/
/*
Test Documentation:
- Test Name: CategoryService - getAllCategories
- Purpose: Validates synchronous retrieval of all categories
- Scenario: Request category list synchronously
- Expected Result: Returns array of all predefined categories
*/
/*
Test Documentation:
- Test Name: CategoryService - category list completeness
- Purpose: Validates all expected categories are present
- Scenario: Check category array contents
- Expected Result: Contains all 9 predefined categories
*/
/*
Coverage Report:
- Functions tested: getCategoryMetadata, getAllCategories
- Scenarios covered: async category retrieval, sync category retrieval, category completeness, category count
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CategoryService', function() {
    var CategoryService, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategoryService_, _$rootScope_) {
      CategoryService = _CategoryService_;
      $rootScope = _$rootScope_;
    }));

    describe('getCategoryMetadata', function() {
      it('should return promise that resolves to categories array', function() {
        var result;

        CategoryService.getCategoryMetadata().then(function(categories) {
          result = categories;
        });

        $rootScope.$apply();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(9);
      });

      it('should return categories with expected values', function() {
        var result;

        CategoryService.getCategoryMetadata().then(function(categories) {
          result = categories;
        });

        $rootScope.$apply();

        expect(result).toContain('Food & Dining');
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

    describe('getAllCategories', function() {
      it('should return array of all categories synchronously', function() {
        var result = CategoryService.getAllCategories();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(9);
      });

      it('should return categories in expected order', function() {
        var result = CategoryService.getAllCategories();

        expect(result[0]).toBe('Food & Dining');
        expect(result[1]).toBe('Fuel');
        expect(result[2]).toBe('Shopping');
        expect(result[3]).toBe('Travel');
        expect(result[4]).toBe('Entertainment');
        expect(result[5]).toBe('Utilities');
        expect(result[6]).toBe('Healthcare');
        expect(result[7]).toBe('Education');
        expect(result[8]).toBe('Miscellaneous');
      });

      it('should return all expected categories', function() {
        var result = CategoryService.getAllCategories();

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

        expectedCategories.forEach(function(category) {
          expect(result).toContain(category);
        });
      });

      it('should return same reference on multiple calls', function() {
        var result1 = CategoryService.getAllCategories();
        var result2 = CategoryService.getAllCategories();

        expect(result1).toBe(result2);
      });
    });

    describe('category consistency', function() {
      it('should return same categories from both methods', function() {
        var syncResult = CategoryService.getAllCategories();
        var asyncResult;

        CategoryService.getCategoryMetadata().then(function(categories) {
          asyncResult = categories;
        });

        $rootScope.$apply();

        expect(asyncResult).toEqual(syncResult);
      });
    });
  });
})();