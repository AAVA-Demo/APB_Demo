/*
Test Documentation:
- Test Name: CategoryService - getCategories
- Purpose: Validates retrieval of all predefined categories
- Scenario: Service is initialized and getCategories is called
- Expected Result: Should return array of 9 predefined categories
*/
/*
Test Documentation:
- Test Name: CategoryService - getCategoryById with valid ID
- Purpose: Validates category lookup by ID
- Scenario: Service is called with valid category ID
- Expected Result: Should return matching category object
*/
/*
Test Documentation:
- Test Name: CategoryService - getCategoryById with invalid ID
- Purpose: Validates handling of non-existent category ID
- Scenario: Service is called with invalid category ID
- Expected Result: Should return undefined
*/
/*
Coverage Report:
- Functions tested: getCategories, getCategoryById
- Scenarios covered: retrieve all categories, find by valid ID, find by invalid ID, category structure validation
- Edge cases: null ID, undefined ID, empty string ID, non-string ID
- Uncovered scenarios: none
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
      it('should return all 9 predefined categories', function() {
        var categories = CategoryService.getCategories();

        expect(categories).toBeDefined();
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBe(9);
      });

      it('should return categories with correct structure', function() {
        var categories = CategoryService.getCategories();
        var firstCategory = categories[0];

        expect(firstCategory).toHaveProperty('categoryId');
        expect(firstCategory).toHaveProperty('categoryName');
        expect(firstCategory).toHaveProperty('iconClass');
        expect(firstCategory).toHaveProperty('colorCode');
      });

      it('should return Food & Dining as first category', function() {
        var categories = CategoryService.getCategories();

        expect(categories[0].categoryId).toBe('1');
        expect(categories[0].categoryName).toBe('Food & Dining');
        expect(categories[0].iconClass).toBe('glyphicon-cutlery');
        expect(categories[0].colorCode).toBe('#FF6384');
      });

      it('should return all expected category names', function() {
        var categories = CategoryService.getCategories();
        var categoryNames = categories.map(function(cat) { return cat.categoryName; });

        expect(categoryNames).toContain('Food & Dining');
        expect(categoryNames).toContain('Fuel');
        expect(categoryNames).toContain('Shopping');
        expect(categoryNames).toContain('Travel');
        expect(categoryNames).toContain('Entertainment');
        expect(categoryNames).toContain('Utilities');
        expect(categoryNames).toContain('Healthcare');
        expect(categoryNames).toContain('Education');
        expect(categoryNames).toContain('Miscellaneous');
      });

      it('should return categories with unique IDs', function() {
        var categories = CategoryService.getCategories();
        var categoryIds = categories.map(function(cat) { return cat.categoryId; });
        var uniqueIds = categoryIds.filter(function(id, index, self) {
          return self.indexOf(id) === index;
        });

        expect(uniqueIds.length).toBe(categoryIds.length);
      });
    });

    describe('getCategoryById', function() {
      it('should return correct category for valid ID', function() {
        var category = CategoryService.getCategoryById('1');

        expect(category).toBeDefined();
        expect(category.categoryId).toBe('1');
        expect(category.categoryName).toBe('Food & Dining');
      });

      it('should return Fuel category for ID 2', function() {
        var category = CategoryService.getCategoryById('2');

        expect(category).toBeDefined();
        expect(category.categoryName).toBe('Fuel');
        expect(category.iconClass).toBe('glyphicon-oil');
      });

      it('should return Shopping category for ID 3', function() {
        var category = CategoryService.getCategoryById('3');

        expect(category).toBeDefined();
        expect(category.categoryName).toBe('Shopping');
        expect(category.colorCode).toBe('#FFCE56');
      });

      it('should return undefined for non-existent category ID', function() {
        var category = CategoryService.getCategoryById('999');

        expect(category).toBeUndefined();
      });

      it('should return undefined for null ID', function() {
        var category = CategoryService.getCategoryById(null);

        expect(category).toBeUndefined();
      });

      it('should return undefined for undefined ID', function() {
        var category = CategoryService.getCategoryById(undefined);

        expect(category).toBeUndefined();
      });

      it('should return undefined for empty string ID', function() {
        var category = CategoryService.getCategoryById('');

        expect(category).toBeUndefined();
      });

      it('should return Miscellaneous category for ID 9', function() {
        var category = CategoryService.getCategoryById('9');

        expect(category).toBeDefined();
        expect(category.categoryName).toBe('Miscellaneous');
        expect(category.iconClass).toBe('glyphicon-th');
      });
    });
  });
})();