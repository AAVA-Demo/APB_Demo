/*
Test Documentation:
- Test Name: CategorizationService - categorize by merchant name
- Purpose: Validates transaction categorization based on merchant name
- Scenario: Transaction has merchant name matching category keywords
- Expected Result: Returns correct category

- Test Name: CategorizationService - categorize by description
- Purpose: Validates categorization using transaction description
- Scenario: Merchant name doesn't match but description does
- Expected Result: Returns correct category based on description

- Test Name: CategorizationService - default to Miscellaneous
- Purpose: Validates fallback behavior for unmatched transactions
- Scenario: Transaction doesn't match any category rules
- Expected Result: Returns 'Miscellaneous'

- Test Name: CategorizationService - all categories
- Purpose: Validates all 9 predefined categories can be matched
- Scenario: Transactions matching each category
- Expected Result: Each category is correctly identified

Coverage Report:
- Functions tested: categorize
- Scenarios covered: merchant matching, description matching, fallback, all categories, case insensitivity
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CategorizationService', function() {
    var CategorizationService;

    beforeEach(module('analytics'));

    beforeEach(inject(function(_CategorizationService_) {
      CategorizationService = _CategorizationService_;
    }));

    describe('categorize', function() {
      it('should categorize Food & Dining transactions by merchant name', function() {
        var transaction = {merchantName: 'Olive Garden Restaurant', description: 'Dinner'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });

      it('should categorize Fuel transactions', function() {
        var transaction = {merchantName: 'Shell Gas Station', description: 'Fuel'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Fuel');
      });

      it('should categorize Shopping transactions', function() {
        var transaction = {merchantName: 'Amazon', description: 'Electronics'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Shopping');
      });

      it('should categorize Travel transactions', function() {
        var transaction = {merchantName: 'United Airlines', description: 'Flight ticket'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Travel');
      });

      it('should categorize Entertainment transactions', function() {
        var transaction = {merchantName: 'Netflix', description: 'Subscription'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Entertainment');
      });

      it('should categorize Utilities transactions', function() {
        var transaction = {merchantName: 'Electric Company', description: 'Monthly bill'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Utilities');
      });

      it('should categorize Healthcare transactions', function() {
        var transaction = {merchantName: 'CVS Pharmacy', description: 'Medicine'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Healthcare');
      });

      it('should categorize Education transactions', function() {
        var transaction = {merchantName: 'Coursera', description: 'Online course'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Education');
      });

      it('should default to Miscellaneous for unmatched transactions', function() {
        var transaction = {merchantName: 'Unknown Store', description: 'Random purchase'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Miscellaneous');
      });

      it('should be case insensitive', function() {
        var transaction = {merchantName: 'RESTAURANT PIZZA', description: 'FOOD'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });

      it('should categorize by description when merchant name does not match', function() {
        var transaction = {merchantName: 'XYZ Corp', description: 'Gas purchase'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Fuel');
      });

      it('should handle missing merchantName', function() {
        var transaction = {description: 'restaurant meal'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });

      it('should handle missing description', function() {
        var transaction = {merchantName: 'cafe'};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Food & Dining');
      });

      it('should handle empty transaction object', function() {
        var transaction = {};
        var category = CategorizationService.categorize(transaction);
        expect(category).toBe('Miscellaneous');
      });
    });
  });
})();