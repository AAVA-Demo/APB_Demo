/*
Test Documentation:
- Test Name: CategoryService Test Suite
- Purpose: Validate predefined category list and category validation logic
- Scenario: Tests cover category retrieval, valid category checking, and invalid category detection
- Expected Result: Service returns correct category list and validates categories accurately
*/

(function() {
  'use strict';

  describe('CategoryService', function() {
    var CategoryService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategoryService_) {
      CategoryService = _CategoryService_;
    }));

    describe('getCategories', function() {
      it('should return all predefined categories', function() {
        var categories = CategoryService.getCategories();

        expect(categories).toBeDefined();
        expect(categories.length).toBe(9);
        expect(categories).toContain('Food & Dining');
        expect(categories).toContain('Fuel');
        expect(categories).toContain('Shopping');
        expect(categories).toContain('Travel');
        expect(categories).toContain('Entertainment');
        expect(categories).toContain('Utilities');
        expect(categories).toContain('Healthcare');
        expect(categories).toContain('Education');
        expect(categories).toContain('Miscellaneous');
      });

      it('should return array reference to internal categories', function() {
        var categories1 = CategoryService.getCategories();
        var categories2 = CategoryService.getCategories();

        expect(categories1).toBe(categories2);
      });

      it('should return categories in correct order', function() {
        var categories = CategoryService.getCategories();

        expect(categories[0]).toBe('Food & Dining');
        expect(categories[1]).toBe('Fuel');
        expect(categories[8]).toBe('Miscellaneous');
      });
    });

    describe('isValidCategory', function() {
      it('should return true for valid category', function() {
        expect(CategoryService.isValidCategory('Food & Dining')).toBe(true);
        expect(CategoryService.isValidCategory('Fuel')).toBe(true);
        expect(CategoryService.isValidCategory('Shopping')).toBe(true);
      });

      it('should return false for invalid category', function() {
        expect(CategoryService.isValidCategory('InvalidCategory')).toBe(false);
        expect(CategoryService.isValidCategory('Random')).toBe(false);
        expect(CategoryService.isValidCategory('')).toBe(false);
      });

      it('should be case-sensitive', function() {
        expect(CategoryService.isValidCategory('food & dining')).toBe(false);
        expect(CategoryService.isValidCategory('FUEL')).toBe(false);
      });

      it('should return false for null or undefined', function() {
        expect(CategoryService.isValidCategory(null)).toBe(false);
        expect(CategoryService.isValidCategory(undefined)).toBe(false);
      });

      it('should validate all predefined categories', function() {
        var categories = CategoryService.getCategories();

        categories.forEach(function(cat) {
          expect(CategoryService.isValidCategory(cat)).toBe(true);
        });
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getCategories, isValidCategory
- Scenarios covered:
  * Retrieval of all predefined categories
  * Category list integrity and order
  * Valid category validation
  * Invalid category detection
  * Case sensitivity
  * Null and undefined handling
- Uncovered scenarios: Category addition/removal (not supported by current design)
*/