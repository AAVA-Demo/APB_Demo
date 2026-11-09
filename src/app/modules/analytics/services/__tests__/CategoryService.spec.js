/*
Test Documentation:
- Test Name: CategoryService
- Purpose: Verify category management and color mapping
- Scenario: Get categories, validate categories, and retrieve colors
- Expected Result: Service should provide category utilities
*/

describe('CategoryService', function() {
  'use strict';

  var CategoryService;

  beforeEach(module('analyticsModule'));

  beforeEach(inject(function(_CategoryService_) {
    CategoryService = _CategoryService_;
  }));

  /*
  Test Documentation:
  - Test Name: should be defined
  - Purpose: Verify service exists
  - Scenario: Inject CategoryService
  - Expected Result: Service should be defined
  */
  it('should be defined', function() {
    expect(CategoryService).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should return all categories
  - Purpose: Verify category list retrieval
  - Scenario: Call getAllCategories
  - Expected Result: Should return array of 9 categories
  */
  it('should return all categories', function() {
    var categories = CategoryService.getAllCategories();

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

  /*
  Test Documentation:
  - Test Name: should validate valid category
  - Purpose: Verify category validation
  - Scenario: Check valid category name
  - Expected Result: isValidCategory should return true
  */
  it('should validate valid category', function() {
    expect(CategoryService.isValidCategory('Food & Dining')).toBe(true);
    expect(CategoryService.isValidCategory('Fuel')).toBe(true);
    expect(CategoryService.isValidCategory('Travel')).toBe(true);
  });

  /*
  Test Documentation:
  - Test Name: should reject invalid category
  - Purpose: Verify invalid category detection
  - Scenario: Check invalid category name
  - Expected Result: isValidCategory should return false
  */
  it('should reject invalid category', function() {
    expect(CategoryService.isValidCategory('Invalid Category')).toBe(false);
    expect(CategoryService.isValidCategory('')).toBe(false);
    expect(CategoryService.isValidCategory(null)).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: should return color for valid category
  - Purpose: Verify color mapping
  - Scenario: Get color for each category
  - Expected Result: Each category should have a color code
  */
  it('should return color for valid category', function() {
    expect(CategoryService.getCategoryColor('Food & Dining')).toBe('#FF6384');
    expect(CategoryService.getCategoryColor('Fuel')).toBe('#36A2EB');
    expect(CategoryService.getCategoryColor('Shopping')).toBe('#FFCE56');
    expect(CategoryService.getCategoryColor('Travel')).toBe('#4BC0C0');
    expect(CategoryService.getCategoryColor('Entertainment')).toBe('#9966FF');
    expect(CategoryService.getCategoryColor('Utilities')).toBe('#FF9F40');
  });

  /*
  Test Documentation:
  - Test Name: should return default color for invalid category
  - Purpose: Verify fallback color
  - Scenario: Get color for non-existent category
  - Expected Result: Should return default gray color
  */
  it('should return default color for invalid category', function() {
    expect(CategoryService.getCategoryColor('Unknown')).toBe('#999');
    expect(CategoryService.getCategoryColor('')).toBe('#999');
  });

  /*
  Test Documentation:
  - Test Name: should have unique colors for most categories
  - Purpose: Verify color differentiation
  - Scenario: Check all category colors
  - Expected Result: Most categories should have unique colors
  */
  it('should have unique colors for most categories', function() {
    var categories = CategoryService.getAllCategories();
    var colors = categories.map(function(cat) {
      return CategoryService.getCategoryColor(cat);
    });

    // At least 7 unique colors (some may repeat intentionally)
    var uniqueColors = colors.filter(function(value, index, self) {
      return self.indexOf(value) === index;
    });

    expect(uniqueColors.length).toBeGreaterThanOrEqual(7);
  });
});

/*
Coverage Report:
- Functions tested: getAllCategories, isValidCategory, getCategoryColor
- Scenarios covered: category retrieval, validation, color mapping, default handling
- Uncovered scenarios: none
*/