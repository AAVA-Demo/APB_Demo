/*
Test Documentation:
- Test Name: categoryService Unit Tests
- Purpose: Validate category mapping retrieval for spending analytics
- Scenario: Test getCategoryMappings method
- Expected Result: Complete list of 9 spending categories
*/

describe('categoryService', function() {
  'use strict';
  
  var categoryService, $timeout;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_categoryService_, _$timeout_) {
    categoryService = _categoryService_;
    $timeout = _$timeout_;
  }));
  
  describe('getCategoryMappings', function() {
    it('should return all 9 spending categories', function() {
      var result;
      categoryService.getCategoryMappings().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(result.categories).toBeDefined();
      expect(result.categories.length).toBe(9);
    });
    
    it('should include Food & Dining category', function() {
      var result;
      categoryService.getCategoryMappings().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result.categories).toContain('Food & Dining');
    });
    
    it('should include Fuel category', function() {
      var result;
      categoryService.getCategoryMappings().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result.categories).toContain('Fuel');
    });
    
    it('should include all required categories', function() {
      var result;
      categoryService.getCategoryMappings().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      var expectedCategories = [
        'Food & Dining',
        'Fuel',
        'Shopping',
        'Travel',
        'Entertainment',
        'Utilities',
        'Healthcare',
        'Education',
        'Miscellaneous'
      ];
      
      expectedCategories.forEach(function(category) {
        expect(result.categories).toContain(category);
      });
    });
    
    it('should resolve promise within 100ms timeout', function() {
      var resolved = false;
      categoryService.getCategoryMappings().then(function() {
        resolved = true;
      });
      
      expect(resolved).toBe(false);
      $timeout.flush(100);
      expect(resolved).toBe(true);
    });
    
    it('should return categories as array', function() {
      var result;
      categoryService.getCategoryMappings().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(Array.isArray(result.categories)).toBe(true);
    });
  });
});

/*
Coverage Report:
- Functions tested: getCategoryMappings
- Scenarios covered:
  * Category count validation
  * Individual category presence
  * Complete category list validation
  * Async timeout resolution
  * Return type validation
- Uncovered scenarios: Error handling (not implemented in source)
*/