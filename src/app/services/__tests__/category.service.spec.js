/*
Test Documentation:
- Test Name: CategoryService - getCategories - returns all predefined categories
- Purpose: Validates that the service returns the complete list of spending categories
- Scenario: Service is initialized and getCategories is called
- Expected Result: Returns array with all 9 predefined categories
*/
/*
Test Documentation:
- Test Name: CategoryService - isValidCategory - returns true for valid categories
- Purpose: Validates that the service correctly identifies valid spending categories
- Scenario: Valid category name is provided
- Expected Result: Returns true
*/
/*
Test Documentation:
- Test Name: CategoryService - isValidCategory - returns false for invalid categories
- Purpose: Validates that the service correctly rejects invalid category names
- Scenario: Invalid or non-existent category name is provided
- Expected Result: Returns false
*/
/*
Coverage Report:
- Functions tested: getCategories, isValidCategory
- Scenarios covered: category list retrieval, valid category validation, invalid category validation, case sensitivity, all 9 categories
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
    
    it('should return an array of all predefined categories', function() {
      var categories = CategoryService.getCategories();
      
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBe(9);
    });
    
    it('should return categories in the correct order', function() {
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
    
    it('should include Food & Dining category', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories).toContain('Food & Dining');
    });
    
    it('should include Fuel category', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories).toContain('Fuel');
    });
    
    it('should include Shopping category', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories).toContain('Shopping');
    });
    
    it('should include Travel category', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories).toContain('Travel');
    });
    
    it('should include Entertainment category', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories).toContain('Entertainment');
    });
    
    it('should include Utilities category', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories).toContain('Utilities');
    });
    
    it('should include Healthcare category', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories).toContain('Healthcare');
    });
    
    it('should include Education category', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories).toContain('Education');
    });
    
    it('should include Miscellaneous category', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories).toContain('Miscellaneous');
    });
    
    it('should return the same array reference on multiple calls', function() {
      var categories1 = CategoryService.getCategories();
      var categories2 = CategoryService.getCategories();
      
      expect(categories1).toBe(categories2);
    });
  });
  
  describe('isValidCategory', function() {
    
    it('should return true for Food & Dining category', function() {
      var result = CategoryService.isValidCategory('Food & Dining');
      
      expect(result).toBe(true);
    });
    
    it('should return true for Fuel category', function() {
      var result = CategoryService.isValidCategory('Fuel');
      
      expect(result).toBe(true);
    });
    
    it('should return true for Shopping category', function() {
      var result = CategoryService.isValidCategory('Shopping');
      
      expect(result).toBe(true);
    });
    
    it('should return true for Travel category', function() {
      var result = CategoryService.isValidCategory('Travel');
      
      expect(result).toBe(true);
    });
    
    it('should return true for Entertainment category', function() {
      var result = CategoryService.isValidCategory('Entertainment');
      
      expect(result).toBe(true);
    });
    
    it('should return true for Utilities category', function() {
      var result = CategoryService.isValidCategory('Utilities');
      
      expect(result).toBe(true);
    });
    
    it('should return true for Healthcare category', function() {
      var result = CategoryService.isValidCategory('Healthcare');
      
      expect(result).toBe(true);
    });
    
    it('should return true for Education category', function() {
      var result = CategoryService.isValidCategory('Education');
      
      expect(result).toBe(true);
    });
    
    it('should return true for Miscellaneous category', function() {
      var result = CategoryService.isValidCategory('Miscellaneous');
      
      expect(result).toBe(true);
    });
    
    it('should return false for invalid category', function() {
      var result = CategoryService.isValidCategory('InvalidCategory');
      
      expect(result).toBe(false);
    });
    
    it('should return false for empty string', function() {
      var result = CategoryService.isValidCategory('');
      
      expect(result).toBe(false);
    });
    
    it('should return false for null', function() {
      var result = CategoryService.isValidCategory(null);
      
      expect(result).toBe(false);
    });
    
    it('should return false for undefined', function() {
      var result = CategoryService.isValidCategory(undefined);
      
      expect(result).toBe(false);
    });
    
    it('should be case sensitive and return false for lowercase category', function() {
      var result = CategoryService.isValidCategory('fuel');
      
      expect(result).toBe(false);
    });
    
    it('should be case sensitive and return false for uppercase category', function() {
      var result = CategoryService.isValidCategory('FUEL');
      
      expect(result).toBe(false);
    });
    
    it('should return false for partial category match', function() {
      var result = CategoryService.isValidCategory('Food');
      
      expect(result).toBe(false);
    });
  });
});