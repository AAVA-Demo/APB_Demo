/*
Test Documentation:
- Test Name: categoryClassificationService - categorize
- Purpose: Validates transaction categorization with fallback to Miscellaneous
- Scenario: Tests valid category, invalid category, missing category
- Expected Result: Returns correct category or Miscellaneous as fallback
*/
/*
Coverage Report:
- Functions tested: categorize
- Scenarios covered: valid category, invalid category, null category, undefined category
- Uncovered scenarios: none
*/

describe('categoryClassificationService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var categoryClassificationService;

  beforeEach(inject(function(_categoryClassificationService_) {
    categoryClassificationService = _categoryClassificationService_;
  }));

  describe('categorize', function() {
    it('should return valid category when present', function() {
      var transaction = { category: 'Food & Dining' };

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Food & Dining');
    });

    it('should return Miscellaneous for invalid category', function() {
      var transaction = { category: 'InvalidCategory' };

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });

    it('should return Miscellaneous when category is null', function() {
      var transaction = { category: null };

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });

    it('should return Miscellaneous when category is undefined', function() {
      var transaction = {};

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });

    it('should validate all predefined categories', function() {
      var validCategories = [
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

      validCategories.forEach(function(cat) {
        var transaction = { category: cat };
        var result = categoryClassificationService.categorize(transaction);
        expect(result).toBe(cat);
      });
    });
  });
});