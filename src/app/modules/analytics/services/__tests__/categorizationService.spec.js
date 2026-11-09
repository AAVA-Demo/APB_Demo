/*
Test Documentation:
- Test Name: CategorizationService Unit Tests
- Purpose: Validate category validation logic and category list retrieval
- Scenario: Test validateCategories with valid and invalid categories, and getCategories method
- Expected Result: Only valid categories returned, complete category list available
*/

describe('CategorizationService', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var CategorizationService;
  
  beforeEach(inject(function(_CategorizationService_) {
    CategorizationService = _CategorizationService_;
  }));
  
  describe('validateCategories', function() {
    it('should return only valid categories', function() {
      var categoryData = [
        { category: 'Food & Dining', amount: 500 },
        { category: 'Fuel', amount: 300 },
        { category: 'InvalidCategory', amount: 100 },
        { category: 'Shopping', amount: 800 }
      ];
      
      var result = CategorizationService.validateCategories(categoryData);
      
      expect(result.length).toBe(3);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
    });
    
    it('should handle all valid categories', function() {
      var categoryData = [
        { category: 'Food & Dining', amount: 500 },
        { category: 'Fuel', amount: 300 },
        { category: 'Shopping', amount: 800 },
        { category: 'Travel', amount: 1200 },
        { category: 'Entertainment', amount: 400 },
        { category: 'Utilities', amount: 250 },
        { category: 'Healthcare', amount: 600 },
        { category: 'Education', amount: 1000 },
        { category: 'Miscellaneous', amount: 150 }
      ];
      
      var result = CategorizationService.validateCategories(categoryData);
      
      expect(result.length).toBe(9);
    });
    
    it('should handle empty array', function() {
      var result = CategorizationService.validateCategories([]);
      
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
    
    it('should filter out all invalid categories', function() {
      var categoryData = [
        { category: 'InvalidCat1', amount: 100 },
        { category: 'InvalidCat2', amount: 200 },
        { category: 'InvalidCat3', amount: 300 }
      ];
      
      var result = CategorizationService.validateCategories(categoryData);
      
      expect(result.length).toBe(0);
    });
    
    it('should be case-sensitive', function() {
      var categoryData = [
        { category: 'food & dining', amount: 500 },
        { category: 'Food & Dining', amount: 600 }
      ];
      
      var result = CategorizationService.validateCategories(categoryData);
      
      expect(result.length).toBe(1);
      expect(result[0].category).toBe('Food & Dining');
    });
    
    it('should preserve original data structure', function() {
      var categoryData = [
        { category: 'Shopping', amount: 800, extraField: 'test' }
      ];
      
      var result = CategorizationService.validateCategories(categoryData);
      
      expect(result[0].extraField).toBe('test');
    });
  });
  
  describe('getCategories', function() {
    it('should return all valid categories', function() {
      var categories = CategorizationService.getCategories();
      
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
    
    it('should return a copy of categories array', function() {
      var categories1 = CategorizationService.getCategories();
      var categories2 = CategorizationService.getCategories();
      
      expect(categories1).not.toBe(categories2);
      expect(categories1).toEqual(categories2);
    });
    
    it('should not allow modification of internal categories', function() {
      var categories = CategorizationService.getCategories();
      categories.push('NewCategory');
      
      var freshCategories = CategorizationService.getCategories();
      expect(freshCategories.length).toBe(9);
    });
  });
});

/*
Coverage Report:
- Functions tested: validateCategories, getCategories
- Scenarios covered:
  * Valid category filtering
  * All valid categories handling
  * Empty array handling
  * All invalid categories filtering
  * Case sensitivity
  * Data structure preservation
  * Category list retrieval
  * Array copy protection
  * Internal state protection
- Edge cases: Empty arrays, all invalid, case sensitivity, array immutability
- Uncovered scenarios: Null input, undefined categories, special characters in category names
*/