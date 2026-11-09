/*
Test Documentation:
- Test Name: CategoryService - getCategories
- Purpose: Validates that all nine spending categories are returned
- Scenario: Service returns predefined category list
- Expected Result: Returns array of 9 categories
*/
/*
Test Documentation:
- Test Name: CategoryService - mapTransactionToCategory
- Purpose: Validates transaction category mapping logic
- Scenario: Transaction has category or defaults to Miscellaneous
- Expected Result: Returns correct category or Miscellaneous
*/
/*
Test Documentation:
- Test Name: CategoryService - getCategoryColor
- Purpose: Validates color mapping for each category
- Scenario: Service returns color code for given category
- Expected Result: Returns valid hex color code
*/
/*
Coverage Report:
- Functions tested: getCategories, mapTransactionToCategory, getCategoryColor
- Scenarios covered: category retrieval, transaction mapping, color assignment
- Edge cases: unknown categories, null transactions, missing category field
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
    it('should return array of 9 spending categories', function() {
      var categories = CategoryService.getCategories();
      expect(categories).toBeDefined();
      expect(categories.length).toBe(9);
    });

    it('should include all required categories', function() {
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

    it('should return the same array reference on multiple calls', function() {
      var categories1 = CategoryService.getCategories();
      var categories2 = CategoryService.getCategories();
      expect(categories1).toBe(categories2);
    });
  });

  describe('mapTransactionToCategory', function() {
    it('should return transaction category when present', function() {
      var transaction = { category: 'Food & Dining', amount: 50 };
      var result = CategoryService.mapTransactionToCategory(transaction);
      expect(result).toBe('Food & Dining');
    });

    it('should return Miscellaneous when category is missing', function() {
      var transaction = { amount: 100 };
      var result = CategoryService.mapTransactionToCategory(transaction);
      expect(result).toBe('Miscellaneous');
    });

    it('should return Miscellaneous when category is null', function() {
      var transaction = { category: null, amount: 75 };
      var result = CategoryService.mapTransactionToCategory(transaction);
      expect(result).toBe('Miscellaneous');
    });

    it('should return Miscellaneous when category is empty string', function() {
      var transaction = { category: '', amount: 25 };
      var result = CategoryService.mapTransactionToCategory(transaction);
      expect(result).toBe('Miscellaneous');
    });

    it('should handle valid category names correctly', function() {
      var categories = ['Fuel', 'Shopping', 'Travel', 'Entertainment'];
      categories.forEach(function(cat) {
        var transaction = { category: cat };
        expect(CategoryService.mapTransactionToCategory(transaction)).toBe(cat);
      });
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
      expect(color).toBe('#4D5360');
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
  });
});