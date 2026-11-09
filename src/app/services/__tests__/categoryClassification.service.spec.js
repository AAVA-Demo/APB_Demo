/*
Test Documentation:
- Test Name: categoryClassificationService - categorize with keyword matching
- Purpose: Validates transaction categorization based on merchant keywords
- Scenario: Tests keyword matching, predefined category, fallback to Miscellaneous
- Expected Result: Returns correct category based on merchant name or existing category
*/
/*
Coverage Report:
- Functions tested: categorize
- Scenarios covered: keyword matching, predefined category, missing merchant, fallback
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
    it('should return existing category if already set', function() {
      var transaction = { category: 'Shopping', merchant: 'Unknown Store' };

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Shopping');
    });

    it('should categorize based on merchant keyword - Food & Dining', function() {
      var transaction = { merchant: 'Local Restaurant' };

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Food & Dining');
    });

    it('should categorize based on merchant keyword - Fuel', function() {
      var transaction = { merchant: 'Shell Gas Station' };

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Fuel');
    });

    it('should categorize based on merchant keyword - Shopping', function() {
      var transaction = { merchant: 'Amazon Prime' };

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Shopping');
    });

    it('should categorize based on merchant keyword - Travel', function() {
      var transaction = { merchant: 'Delta Airlines' };

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Travel');
    });

    it('should categorize based on merchant keyword - Entertainment', function() {
      var transaction = { merchant: 'Netflix Subscription' };

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Entertainment');
    });

    it('should return Miscellaneous for unknown merchant', function() {
      var transaction = { merchant: 'Unknown Vendor' };

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });

    it('should handle missing merchant field', function() {
      var transaction = { amount: 100 };

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Miscellaneous');
    });

    it('should handle case-insensitive matching', function() {
      var transaction = { merchant: 'RESTAURANT' };

      var result = categoryClassificationService.categorize(transaction);

      expect(result).toBe('Food & Dining');
    });
  });
});