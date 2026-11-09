/*
Test Documentation:
- Test Name: categoryService - categorize and getCategories
- Purpose: Validates category management and transaction categorization
- Scenario: Tests category list, valid/invalid categorization
- Expected Result: Returns correct categories and handles invalid inputs
*/
/*
Coverage Report:
- Functions tested: categorize, getCategories
- Scenarios covered: valid category, invalid category, missing category, category list
- Uncovered scenarios: none
*/

describe('categoryService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var categoryService;

  beforeEach(inject(function(_categoryService_) {
    categoryService = _categoryService_;
  }));

  describe('categorize', function() {
    it('should return valid category', function() {
      var transaction = { category: 'Food & Dining' };

      var result = categoryService.categorize(transaction);

      expect(result).toBe('Food & Dining');
    });

    it('should return Miscellaneous for invalid category', function() {
      var transaction = { category: 'Invalid' };

      var result = categoryService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });

    it('should return Miscellaneous when category is missing', function() {
      var transaction = {};

      var result = categoryService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });
  });

  describe('getCategories', function() {
    it('should return array of 9 categories', function() {
      var categories = categoryService.getCategories();

      expect(categories.length).toBe(9);
      expect(categories).toContain('Food & Dining');
      expect(categories).toContain('Miscellaneous');
    });
  });
});