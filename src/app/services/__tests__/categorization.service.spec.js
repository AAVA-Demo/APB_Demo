/*
Test Documentation:
- Test Name: CategorizationService - categorize maps merchant category to display category
- Purpose: Validates transaction categorization logic
- Scenario: Given a transaction with merchantCategory
- Expected Result: Transaction is assigned correct display category
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorizeAll processes array of transactions
- Purpose: Validates batch categorization
- Scenario: Given multiple transactions
- Expected Result: All transactions are categorized correctly
*/
/*
Coverage Report:
- Functions tested: categorize, categorizeAll
- Scenarios covered: valid categories, missing categories, case sensitivity, batch processing
- Uncovered scenarios: none
*/

describe('CategorizationService', function() {
  'use strict';

  beforeEach(module('creditCardApp.analytics'));

  var CategorizationService;

  beforeEach(inject(function(_CategorizationService_) {
    CategorizationService = _CategorizationService_;
  }));

  describe('categorize', function() {
    it('should map food merchant category to Food & Dining', function() {
      var transaction = {merchantCategory: 'food', amount: 50};
      var result = CategorizationService.categorize(transaction);
      expect(result.category).toBe('Food & Dining');
    });

    it('should map fuel merchant category to Fuel', function() {
      var transaction = {merchantCategory: 'fuel', amount: 60};
      var result = CategorizationService.categorize(transaction);
      expect(result.category).toBe('Fuel');
    });

    it('should map shopping merchant category to Shopping', function() {
      var transaction = {merchantCategory: 'shopping', amount: 100};
      var result = CategorizationService.categorize(transaction);
      expect(result.category).toBe('Shopping');
    });

    it('should map travel merchant category to Travel', function() {
      var transaction = {merchantCategory: 'travel', amount: 450};
      var result = CategorizationService.categorize(transaction);
      expect(result.category).toBe('Travel');
    });

    it('should map entertainment merchant category to Entertainment', function() {
      var transaction = {merchantCategory: 'entertainment', amount: 35};
      var result = CategorizationService.categorize(transaction);
      expect(result.category).toBe('Entertainment');
    });

    it('should map utilities merchant category to Utilities', function() {
      var transaction = {merchantCategory: 'utilities', amount: 85};
      var result = CategorizationService.categorize(transaction);
      expect(result.category).toBe('Utilities');
    });

    it('should map healthcare merchant category to Healthcare', function() {
      var transaction = {merchantCategory: 'healthcare', amount: 25};
      var result = CategorizationService.categorize(transaction);
      expect(result.category).toBe('Healthcare');
    });

    it('should map education merchant category to Education', function() {
      var transaction = {merchantCategory: 'education', amount: 500};
      var result = CategorizationService.categorize(transaction);
      expect(result.category).toBe('Education');
    });

    it('should default to Miscellaneous for unknown categories', function() {
      var transaction = {merchantCategory: 'unknown', amount: 30};
      var result = CategorizationService.categorize(transaction);
      expect(result.category).toBe('Miscellaneous');
    });

    it('should default to Miscellaneous when merchantCategory is missing', function() {
      var transaction = {amount: 30};
      var result = CategorizationService.categorize(transaction);
      expect(result.category).toBe('Miscellaneous');
    });

    it('should handle case-insensitive merchant categories', function() {
      var transaction = {merchantCategory: 'FOOD', amount: 50};
      var result = CategorizationService.categorize(transaction);
      expect(result.category).toBe('Food & Dining');
    });
  });

  describe('categorizeAll', function() {
    it('should categorize all transactions in array', function() {
      var transactions = [
        {merchantCategory: 'food', amount: 50},
        {merchantCategory: 'fuel', amount: 60},
        {merchantCategory: 'shopping', amount: 100}
      ];

      var result = CategorizationService.categorizeAll(transactions);

      expect(result.length).toBe(3);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Fuel');
      expect(result[2].category).toBe('Shopping');
    });

    it('should handle empty array', function() {
      var result = CategorizationService.categorizeAll([]);
      expect(result.length).toBe(0);
    });

    it('should handle mixed valid and invalid categories', function() {
      var transactions = [
        {merchantCategory: 'food', amount: 50},
        {merchantCategory: 'invalid', amount: 30},
        {amount: 20}
      ];

      var result = CategorizationService.categorizeAll(transactions);

      expect(result[0].category).toBe('Food & Dining');
      expect(result[1].category).toBe('Miscellaneous');
      expect(result[2].category).toBe('Miscellaneous');
    });
  });
});