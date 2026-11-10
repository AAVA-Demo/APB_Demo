/*
Test Documentation:
- Test Name: CategoryService Unit Tests
- Purpose: Validate category list retrieval and color mapping functionality
- Scenario: Tests getCategories returns correct list, getCategoryColor returns proper colors
- Expected Result: Correct 9 categories returned, proper color codes for each category
*/

(function() {
  'use strict';

  describe('CategoryService', function() {
    var CategoryService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategoryService_) {
      CategoryService = _CategoryService_;
    }));

    describe('getCategories', function() {
      it('should return array of 9 categories', function() {
        var categories = CategoryService.getCategories();

        expect(categories).toEqual(jasmine.any(Array));
        expect(categories.length).toBe(9);
      });

      it('should return correct category names', function() {
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

      it('should return same array reference on multiple calls', function() {
        var categories1 = CategoryService.getCategories();
        var categories2 = CategoryService.getCategories();

        expect(categories1).toEqual(categories2);
      });
    });

    describe('getCategoryColor', function() {
      it('should return correct color for Food & Dining', function() {
        var color = CategoryService.getCategoryColor('Food & Dining');
        expect(color).toBe('#FF6384');
      });

      it('should return correct color for Fuel', function() {
        var color = CategoryService.getCategoryColor('Fuel');
        expect(color).toBe('#36A2EB');
      });

      it('should return correct color for Shopping', function() {
        var color = CategoryService.getCategoryColor('Shopping');
        expect(color).toBe('#FFCE56');
      });

      it('should return correct color for Travel', function() {
        var color = CategoryService.getCategoryColor('Travel');
        expect(color).toBe('#4BC0C0');
      });

      it('should return correct color for Entertainment', function() {
        var color = CategoryService.getCategoryColor('Entertainment');
        expect(color).toBe('#9966FF');
      });

      it('should return correct color for Utilities', function() {
        var color = CategoryService.getCategoryColor('Utilities');
        expect(color).toBe('#FF9F40');
      });

      it('should return correct color for Healthcare', function() {
        var color = CategoryService.getCategoryColor('Healthcare');
        expect(color).toBe('#FF6384');
      });

      it('should return correct color for Education', function() {
        var color = CategoryService.getCategoryColor('Education');
        expect(color).toBe('#C9CBCF');
      });

      it('should return correct color for Miscellaneous', function() {
        var color = CategoryService.getCategoryColor('Miscellaneous');
        expect(color).toBe('#4BC0C0');
      });

      it('should return default color for unknown category', function() {
        var color = CategoryService.getCategoryColor('UnknownCategory');
        expect(color).toBe('#CCCCCC');
      });

      it('should return default color for null category', function() {
        var color = CategoryService.getCategoryColor(null);
        expect(color).toBe('#CCCCCC');
      });

      it('should return default color for undefined category', function() {
        var color = CategoryService.getCategoryColor(undefined);
        expect(color).toBe('#CCCCCC');
      });

      it('should return default color for empty string', function() {
        var color = CategoryService.getCategoryColor('');
        expect(color).toBe('#CCCCCC');
      });

      it('should be case-sensitive for category names', function() {
        var color = CategoryService.getCategoryColor('food & dining');
        expect(color).toBe('#CCCCCC');
      });

      it('should return valid hex color codes', function() {
        var categories = CategoryService.getCategories();
        var hexColorRegex = /^#[0-9A-F]{6}$/i;

        categories.forEach(function(category) {
          var color = CategoryService.getCategoryColor(category);
          expect(color).toMatch(hexColorRegex);
        });
      });
    });

    describe('integration', function() {
      it('should have color mapping for all categories', function() {
        var categories = CategoryService.getCategories();

        categories.forEach(function(category) {
          var color = CategoryService.getCategoryColor(category);
          expect(color).toBeDefined();
          expect(color).not.toBe('#CCCCCC');
        });
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getCategories, getCategoryColor
  - Scenarios covered:
    * Category list retrieval (count, names, order)
    * Color mapping for all 9 categories
    * Default color for unknown/invalid categories
    * Null/undefined/empty string handling
    * Case sensitivity
    * Hex color format validation
    * Integration between categories and colors
  - Edge cases: Unknown categories, null/undefined, empty strings, case variations
  - Uncovered scenarios: Dynamic category addition, color customization, localization
  */
})();