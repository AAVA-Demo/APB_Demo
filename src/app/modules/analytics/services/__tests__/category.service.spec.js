/*
Test Documentation:
- Test Name: CategoryService - getCategories
- Purpose: Verify service returns all predefined categories
- Scenario: getCategories is called
- Expected Result: Array of 9 categories returned
*/
/*
Test Documentation:
- Test Name: CategoryService - category list completeness
- Purpose: Verify all required categories are present
- Scenario: Category list is checked
- Expected Result: All 9 categories from requirements are included
*/
/*
Coverage Report:
- Functions tested: getCategories
- Scenarios covered: category retrieval, completeness validation
- Uncovered scenarios: none
*/

describe('CategoryService', function() {
  'use strict';

  var CategoryService;

  beforeEach(module('app.analytics'));

  beforeEach(inject(function(_CategoryService_) {
    CategoryService = _CategoryService_;
  }));

  it('should return array of categories', function() {
    var categories = CategoryService.getCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBe(9);
  });

  it('should include all required categories', function() {
    var categories = CategoryService.getCategories();

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

  it('should return same categories on multiple calls', function() {
    var categories1 = CategoryService.getCategories();
    var categories2 = CategoryService.getCategories();

    expect(categories1).toEqual(categories2);
  });

  it('should return categories in correct order', function() {
    var categories = CategoryService.getCategories();

    expect(categories[0]).toBe('Food & Dining');
    expect(categories[1]).toBe('Fuel');
    expect(categories[2]).toBe('Shopping');
    expect(categories[3]).toBe('Travel');
    expect(categories[4]).toBe('Entertainment');
    expect(categories[5]).toBe('Utilities');
    expect(categories[6]).toBe('Healthcare');
    expect(categories[7]).toBe('Education');
    expect(categories[8]).toBe('Miscellaneous');
  });
});