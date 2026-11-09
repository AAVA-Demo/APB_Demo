/*
Test Documentation:
- Test Name: CategorizationService - validateCategory - valid category
- Purpose: Validates that valid spending categories are accepted
- Scenario: Service receives a valid category name
- Expected Result: Returns the same category name unchanged
*/
/*
Test Documentation:
- Test Name: CategorizationService - validateCategory - invalid category
- Purpose: Validates handling of invalid category names
- Scenario: Service receives an invalid/unknown category
- Expected Result: Returns 'Miscellaneous' as default category
*/
/*
Test Documentation:
- Test Name: CategorizationService - getCategories - retrieve all categories
- Purpose: Validates retrieval of complete category list
- Scenario: Service is asked for all spending categories
- Expected Result: Returns array of 9 predefined spending categories
*/
/*
Coverage Report:
- Functions tested: validateCategory, getCategories
- Scenarios covered: valid category validation, invalid category fallback, category list retrieval, all 9 categories
- Uncovered scenarios: None - service is stateless and all paths covered
*/

describe('CategorizationService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CategorizationService;
  
  beforeEach(inject(function(_CategorizationService_) {
    CategorizationService = _CategorizationService_;
  }));
  
  describe('validateCategory', function() {
    it('should return the same category when it is valid', function() {
      expect(CategorizationService.validateCategory('Food & Dining')).toBe('Food & Dining');
      expect(CategorizationService.validateCategory('Fuel')).toBe('Fuel');
      expect(CategorizationService.validateCategory('Shopping')).toBe('Shopping');
      expect(CategorizationService.validateCategory('Travel')).toBe('Travel');
      expect(CategorizationService.validateCategory('Entertainment')).toBe('Entertainment');
      expect(CategorizationService.validateCategory('Utilities')).toBe('Utilities');
      expect(CategorizationService.validateCategory('Healthcare')).toBe('Healthcare');
      expect(CategorizationService.validateCategory('Education')).toBe('Education');
      expect(CategorizationService.validateCategory('Miscellaneous')).toBe('Miscellaneous');
    });
    
    it('should return Miscellaneous for invalid categories', function() {
      expect(CategorizationService.validateCategory('InvalidCategory')).toBe('Miscellaneous');
      expect(CategorizationService.validateCategory('Random')).toBe('Miscellaneous');
      expect(CategorizationService.validateCategory('')).toBe('Miscellaneous');
      expect(CategorizationService.validateCategory(null)).toBe('Miscellaneous');
      expect(CategorizationService.validateCategory(undefined)).toBe('Miscellaneous');
    });
    
    it('should be case-sensitive', function() {
      expect(CategorizationService.validateCategory('food & dining')).toBe('Miscellaneous');
      expect(CategorizationService.validateCategory('FUEL')).toBe('Miscellaneous');
    });
  });
  
  describe('getCategories', function() {
    it('should return array of all 9 spending categories', function() {
      var categories = CategorizationService.getCategories();
      
      expect(Array.isArray(categories)).toBe(true);
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
    
    it('should return categories in expected order', function() {
      var categories = CategorizationService.getCategories();
      
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
});