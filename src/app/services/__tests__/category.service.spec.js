/*
Test Documentation:
- Test Name: categoryService - getCategories and categorize
- Purpose: Validates category list retrieval and transaction categorization
- Scenario: Tests category list, valid categorization, invalid category handling
- Expected Result: Returns correct category list and categorizes transactions properly
*/
/*
Coverage Report:
- Functions tested: getCategories, categorize
- Scenarios covered: category list retrieval, valid category, invalid category, missing category
- Uncovered scenarios: none
*/

describe('categoryService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var categoryService;

  beforeEach(inject(function(_categoryService_) {
    categoryService = _categoryService_;
  }));

  describe('getCategories', function() {
    it('should return array of 9 categories', function() {
      var categories = categoryService.getCategories();

      expect(categories).toBeDefined();
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

  describe('categorize', function() {
    it('should return transaction category when valid', function() {
      var transaction = { category: 'Food & Dining', amount: 100 };

      var result = categoryService.categorize(transaction);

      expect(result).toBe('Food & Dining');
    });

    it('should return Miscellaneous for invalid category', function() {
      var transaction = { category: 'InvalidCategory', amount: 100 };

      var result = categoryService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });

    it('should return Miscellaneous when category is missing', function() {
      var transaction = { amount: 100 };

      var result = categoryService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });

    it('should return Miscellaneous when category is null', function() {
      var transaction = { category: null, amount: 100 };

      var result = categoryService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });

    it('should handle all valid categories', function() {
      var categories = categoryService.getCategories();

      categories.forEach(function(cat) {
        var transaction = { category: cat };
        var result = categoryService.categorize(transaction);
        expect(result).toBe(cat);
      });
    });
  });
});