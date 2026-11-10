/*
Test Documentation:
- Test Name: CategoryService
- Purpose: Validate category management and color mapping
- Scenario: Category retrieval, lookup by ID, color mapping
- Expected Result: Service provides correct category data and color assignments
*/

describe('CategoryService', function() {
  'use strict';

  beforeEach(module('creditCard.analytics'));

  var CategoryService;

  beforeEach(inject(function(_CategoryService_) {
    CategoryService = _CategoryService_;
  }));

  it('should be defined', function() {
    expect(CategoryService).toBeDefined();
  });

  describe('getCategories', function() {
    it('should return array of categories', function() {
      var categories = CategoryService.getCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should return all 9 predefined categories', function() {
      var categories = CategoryService.getCategories();
      expect(categories.length).toBe(9);
    });

    it('should include Food & Dining category', function() {
      var categories = CategoryService.getCategories();
      var foodCategory = categories.find(function(c) { return c.name === 'Food & Dining'; });
      expect(foodCategory).toBeDefined();
    });

    it('should include all required categories', function() {
      var categories = CategoryService.getCategories();
      var categoryNames = categories.map(function(c) { return c.name; });
      
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

    it('should have id, name, and color for each category', function() {
      var categories = CategoryService.getCategories();
      categories.forEach(function(category) {
        expect(category.id).toBeDefined();
        expect(category.name).toBeDefined();
        expect(category.color).toBeDefined();
      });
    });
  });

  describe('getCategoryById', function() {
    it('should return category by ID', function() {
      var category = CategoryService.getCategoryById('food');
      expect(category).toBeDefined();
      expect(category.name).toBe('Food & Dining');
    });

    it('should return undefined for invalid ID', function() {
      var category = CategoryService.getCategoryById('invalid');
      expect(category).toBeUndefined();
    });

    it('should find fuel category', function() {
      var category = CategoryService.getCategoryById('fuel');
      expect(category).toBeDefined();
      expect(category.name).toBe('Fuel');
    });

    it('should find shopping category', function() {
      var category = CategoryService.getCategoryById('shopping');
      expect(category).toBeDefined();
      expect(category.name).toBe('Shopping');
    });
  });

  describe('getCategoryColor', function() {
    it('should return color for valid category name', function() {
      var color = CategoryService.getCategoryColor('Food & Dining');
      expect(color).toBeDefined();
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('should return default color for invalid category', function() {
      var color = CategoryService.getCategoryColor('Invalid Category');
      expect(color).toBe('#999999');
    });

    it('should return different colors for different categories', function() {
      var foodColor = CategoryService.getCategoryColor('Food & Dining');
      var fuelColor = CategoryService.getCategoryColor('Fuel');
      expect(foodColor).not.toBe(fuelColor);
    });

    it('should handle null category name', function() {
      var color = CategoryService.getCategoryColor(null);
      expect(color).toBe('#999999');
    });

    it('should handle undefined category name', function() {
      var color = CategoryService.getCategoryColor(undefined);
      expect(color).toBe('#999999');
    });

    it('should return colors for all categories', function() {
      var categories = CategoryService.getCategories();
      categories.forEach(function(category) {
        var color = CategoryService.getCategoryColor(category.name);
        expect(color).toBeDefined();
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });
});

/*
Coverage Report:
- Functions tested: getCategories, getCategoryById, getCategoryColor
- Scenarios covered: category retrieval, lookup, color mapping, validation
- Edge cases: invalid IDs, null/undefined names, default colors
- Uncovered scenarios: none
*/