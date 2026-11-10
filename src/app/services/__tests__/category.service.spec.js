/*
Test Documentation:
- Test Name: CategoryService - getCategories
- Purpose: Validates that getCategories returns all predefined categories
- Scenario: getCategories method called
- Expected Result: Returns array of 9 category objects

- Test Name: CategoryService - getCategoryByName with valid name
- Purpose: Validates category lookup by name
- Scenario: getCategoryByName called with valid category name
- Expected Result: Returns matching category object

- Test Name: CategoryService - getCategoryByName with invalid name
- Purpose: Validates handling of invalid category name
- Scenario: getCategoryByName called with non-existent category name
- Expected Result: Returns undefined

- Test Name: CategoryService - getCategoryColor with valid name
- Purpose: Validates color retrieval for valid category
- Scenario: getCategoryColor called with valid category name
- Expected Result: Returns category color code

- Test Name: CategoryService - getCategoryColor with invalid name
- Purpose: Validates fallback color for invalid category
- Scenario: getCategoryColor called with non-existent category name
- Expected Result: Returns default color '#CCCCCC'

Coverage Report:
- Functions tested: getCategories, getCategoryByName, getCategoryColor
- Scenarios covered: category retrieval, name lookup, color retrieval, invalid inputs
- Edge cases: invalid category name, missing category
- Uncovered scenarios: none
*/

describe('CategoryService', function() {
  'use strict';

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
    });

    it('should return categories with required fields', function() {
      var categories = CategoryService.getCategories();

      categories.forEach(function(category) {
        expect(category.categoryId).toBeDefined();
        expect(category.categoryName).toBeDefined();
        expect(category.icon).toBeDefined();
        expect(category.color).toBeDefined();
      });
    });

    it('should include all expected category names', function() {
      var categories = CategoryService.getCategories();
      var names = categories.map(function(c) { return c.categoryName; });

      expect(names).toContain('Food & Dining');
      expect(names).toContain('Fuel');
      expect(names).toContain('Shopping');
      expect(names).toContain('Travel');
      expect(names).toContain('Entertainment');
      expect(names).toContain('Utilities');
      expect(names).toContain('Healthcare');
      expect(names).toContain('Education');
      expect(names).toContain('Miscellaneous');
    });
  });

  describe('getCategoryByName', function() {
    it('should return category object for valid name', function() {
      var category = CategoryService.getCategoryByName('Food & Dining');

      expect(category).toBeDefined();
      expect(category.categoryName).toBe('Food & Dining');
      expect(category.categoryId).toBe('food');
      expect(category.icon).toBe('fa-cutlery');
      expect(category.color).toBe('#FF6384');
    });

    it('should return undefined for invalid category name', function() {
      var category = CategoryService.getCategoryByName('InvalidCategory');

      expect(category).toBeUndefined();
    });

    it('should return undefined for null category name', function() {
      var category = CategoryService.getCategoryByName(null);

      expect(category).toBeUndefined();
    });

    it('should return undefined for empty string', function() {
      var category = CategoryService.getCategoryByName('');

      expect(category).toBeUndefined();
    });
  });

  describe('getCategoryColor', function() {
    it('should return color code for valid category name', function() {
      var color = CategoryService.getCategoryColor('Shopping');

      expect(color).toBe('#FFCE56');
    });

    it('should return default color for invalid category name', function() {
      var color = CategoryService.getCategoryColor('InvalidCategory');

      expect(color).toBe('#CCCCCC');
    });

    it('should return default color for null category name', function() {
      var color = CategoryService.getCategoryColor(null);

      expect(color).toBe('#CCCCCC');
    });

    it('should return default color for empty string', function() {
      var color = CategoryService.getCategoryColor('');

      expect(color).toBe('#CCCCCC');
    });

    it('should return correct colors for all categories', function() {
      expect(CategoryService.getCategoryColor('Food & Dining')).toBe('#FF6384');
      expect(CategoryService.getCategoryColor('Fuel')).toBe('#36A2EB');
      expect(CategoryService.getCategoryColor('Shopping')).toBe('#FFCE56');
      expect(CategoryService.getCategoryColor('Travel')).toBe('#4BC0C0');
      expect(CategoryService.getCategoryColor('Entertainment')).toBe('#9966FF');
      expect(CategoryService.getCategoryColor('Utilities')).toBe('#FF9F40');
      expect(CategoryService.getCategoryColor('Healthcare')).toBe('#FF6384');
      expect(CategoryService.getCategoryColor('Education')).toBe('#C9CBCF');
      expect(CategoryService.getCategoryColor('Miscellaneous')).toBe('#4BC0C0');
    });
  });
});