/*
Test Documentation:
- Test Name: CategoryService - getCategories
- Purpose: Validates retrieval of all spending categories
- Scenario: Service method is called
- Expected Result: Returns array of 9 categories
*/
/*
Test Documentation:
- Test Name: CategoryService - validateCategory
- Purpose: Validates category validation logic
- Scenario: Valid and invalid categories are checked
- Expected Result: Returns true for valid, false for invalid
*/
/*
Coverage Report:
- Functions tested: getCategories, validateCategory
- Scenarios covered: category retrieval, validation of valid/invalid categories
- Uncovered scenarios: none
*/

describe('CategoryService', function() {
  'use strict';
  
  beforeEach(module('analyticsModule'));
  
  var CategoryService;
  
  beforeEach(inject(function(_CategoryService_) {
    CategoryService = _CategoryService_;
  }));
  
  describe('getCategories', function() {
    it('should return an array of 9 categories', function() {
      var categories = CategoryService.getCategories();
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBe(9);
    });
    
    it('should include all expected categories', function() {
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
  });
  
  describe('validateCategory', function() {
    it('should return true for valid categories', function() {
      expect(CategoryService.validateCategory('Food & Dining')).toBe(true);
      expect(CategoryService.validateCategory('Fuel')).toBe(true);
      expect(CategoryService.validateCategory('Shopping')).toBe(true);
    });
    
    it('should return false for invalid categories', function() {
      expect(CategoryService.validateCategory('Invalid Category')).toBe(false);
      expect(CategoryService.validateCategory('')).toBe(false);
      expect(CategoryService.validateCategory(null)).toBe(false);
    });
    
    it('should be case-sensitive', function() {
      expect(CategoryService.validateCategory('food & dining')).toBe(false);
      expect(CategoryService.validateCategory('FUEL')).toBe(false);
    });
  });
});