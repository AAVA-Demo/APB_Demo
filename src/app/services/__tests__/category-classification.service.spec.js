/*
Test Documentation:
- Test Name: CategoryClassificationService Test Suite
- Purpose: Validate category validation and retrieval functionality
- Scenario: Tests valid category validation, invalid category handling, and category list retrieval
- Expected Result: Service correctly validates categories and returns complete category list
*/

(function() {
  'use strict';

  describe('CategoryClassificationService', function() {
    var CategoryClassificationService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategoryClassificationService_) {
      CategoryClassificationService = _CategoryClassificationService_;
    }));

    describe('validateCategory', function() {
      it('should return the category if it is valid', function() {
        var result = CategoryClassificationService.validateCategory('Food & Dining');
        expect(result).toBe('Food & Dining');
      });

      it('should return Miscellaneous for invalid category', function() {
        var result = CategoryClassificationService.validateCategory('InvalidCategory');
        expect(result).toBe('Miscellaneous');
      });

      it('should validate all predefined categories', function() {
        var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        validCategories.forEach(function(cat) {
          expect(CategoryClassificationService.validateCategory(cat)).toBe(cat);
        });
      });

      it('should return Miscellaneous for null category', function() {
        var result = CategoryClassificationService.validateCategory(null);
        expect(result).toBe('Miscellaneous');
      });

      it('should return Miscellaneous for undefined category', function() {
        var result = CategoryClassificationService.validateCategory(undefined);
        expect(result).toBe('Miscellaneous');
      });

      it('should return Miscellaneous for empty string', function() {
        var result = CategoryClassificationService.validateCategory('');
        expect(result).toBe('Miscellaneous');
      });

      it('should be case-sensitive', function() {
        var result = CategoryClassificationService.validateCategory('food & dining');
        expect(result).toBe('Miscellaneous');
      });

      it('should handle special characters as invalid', function() {
        var result = CategoryClassificationService.validateCategory('Food & Dining!');
        expect(result).toBe('Miscellaneous');
      });
    });

    describe('getCategories', function() {
      it('should return all valid categories', function() {
        var categories = CategoryClassificationService.getCategories();
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
        var categories1 = CategoryClassificationService.getCategories();
        var categories2 = CategoryClassificationService.getCategories();
        expect(categories1).not.toBe(categories2);
        categories1.push('NewCategory');
        expect(categories2.length).toBe(9);
      });

      it('should return categories in correct order', function() {
        var categories = CategoryClassificationService.getCategories();
        expect(categories[0]).toBe('Food & Dining');
        expect(categories[1]).toBe('Fuel');
        expect(categories[8]).toBe('Miscellaneous');
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: validateCategory, getCategories
  - Scenarios covered:
    * Valid category validation
    * Invalid category handling
    * All predefined categories validation
    * Null/undefined/empty string handling
    * Case sensitivity
    * Special character handling
    * Category list retrieval
    * Array immutability
    * Category order verification
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();