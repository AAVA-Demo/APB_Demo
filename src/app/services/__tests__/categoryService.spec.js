/*
Test Documentation:
- Test Name: categoryService - getCategories
- Purpose: Validates retrieval of all valid spending categories
- Scenario: When getCategories is called, then all 9 valid categories should be returned
- Expected Result: Returns array of 9 categories including Food & Dining, Fuel, Shopping, Travel, Entertainment, Utilities, Healthcare, Education, Miscellaneous
*/
/*
Test Documentation:
- Test Name: categoryService - validateCategory
- Purpose: Validates category validation and defaulting to Miscellaneous
- Scenario: Given valid and invalid categories, when validateCategory is called, then valid categories are returned as-is and invalid ones default to Miscellaneous
- Expected Result: Valid categories returned unchanged, invalid categories return 'Miscellaneous'
*/
/*
Test Documentation:
- Test Name: categoryService - getCategoryColor
- Purpose: Validates color mapping for category visualization
- Scenario: Given category names, when getCategoryColor is called, then appropriate hex color codes should be returned
- Expected Result: Returns correct color code for each category
*/
/*
Coverage Report:
- Functions tested: getCategories, validateCategory, getCategoryColor
- Scenarios covered: category retrieval, validation, color mapping, invalid category handling
- Uncovered scenarios: none - comprehensive coverage achieved
*/

describe('categoryService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var categoryService;

  beforeEach(inject(function(_categoryService_) {
    categoryService = _categoryService_;
  }));

  describe('getCategories', function() {
    it('should return all 9 valid categories', function() {
      var categories = categoryService.getCategories();

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
  });

  describe('validateCategory', function() {
    it('should return valid category unchanged', function() {
      var validCategory = 'Food & Dining';

      var result = categoryService.validateCategory(validCategory);

      expect(result).toBe('Food & Dining');
    });

    it('should default invalid category to Miscellaneous', function() {
      var invalidCategory = 'InvalidCategory';

      var result = categoryService.validateCategory(invalidCategory);

      expect(result).toBe('Miscellaneous');
    });

    it('should validate all standard categories', function() {
      var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

      categories.forEach(function(cat) {
        var result = categoryService.validateCategory(cat);
        expect(result).toBe(cat);
      });
    });
  });

  describe('getCategoryColor', function() {
    it('should return correct color for Food & Dining', function() {
      var color = categoryService.getCategoryColor('Food & Dining');
      expect(color).toBe('#e74c3c');
    });

    it('should return correct color for Fuel', function() {
      var color = categoryService.getCategoryColor('Fuel');
      expect(color).toBe('#f39c12');
    });

    it('should return correct color for Shopping', function() {
      var color = categoryService.getCategoryColor('Shopping');
      expect(color).toBe('#9b59b6');
    });

    it('should return correct color for Travel', function() {
      var color = categoryService.getCategoryColor('Travel');
      expect(color).toBe('#3498db');
    });

    it('should return correct color for Entertainment', function() {
      var color = categoryService.getCategoryColor('Entertainment');
      expect(color).toBe('#1abc9c');
    });

    it('should return correct color for Utilities', function() {
      var color = categoryService.getCategoryColor('Utilities');
      expect(color).toBe('#34495e');
    });

    it('should return correct color for Healthcare', function() {
      var color = categoryService.getCategoryColor('Healthcare');
      expect(color).toBe('#e67e22');
    });

    it('should return correct color for Education', function() {
      var color = categoryService.getCategoryColor('Education');
      expect(color).toBe('#2ecc71');
    });

    it('should return correct color for Miscellaneous', function() {
      var color = categoryService.getCategoryColor('Miscellaneous');
      expect(color).toBe('#95a5a6');
    });

    it('should return default color for invalid category', function() {
      var color = categoryService.getCategoryColor('InvalidCategory');
      expect(color).toBe('#95a5a6');
    });
  });
});