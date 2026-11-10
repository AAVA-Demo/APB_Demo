/*
Test Documentation:
- Test Name: CategorizationService - aggregateByCategory
- Purpose: Validates transaction categorization and aggregation by spending category
- Scenario: Service processes transactions and groups by predefined categories
- Expected Result: Returns array of category objects with totals, counts, and percentages
*/
/*
Test Documentation:
- Test Name: CategorizationService - getCategories
- Purpose: Validates retrieval of predefined spending categories
- Scenario: Service returns list of valid categories
- Expected Result: Returns array of 9 predefined category names
*/
/*
Coverage Report:
- Functions tested: aggregateByCategory, getCategories
- Scenarios covered: normal aggregation, empty transactions, null input, percentage calculation, all categories, single category
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CategorizationService', function() {
    var CategorizationService;
    var EXPECTED_CATEGORIES = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategorizationService_) {
      CategorizationService = _CategorizationService_;
    }));

    describe('aggregateByCategory', function() {
      it('should return all categories with zero values for empty transaction array', function() {
        var result = CategorizationService.aggregateByCategory([]);
        expect(result.length).toBe(9);
        result.forEach(function(cat) {
          expect(cat.total).toBe(0);
          expect(cat.transactionCount).toBe(0);
          expect(cat.percentage).toBe(0);
        });
      });

      it('should return all categories with zero values for null transactions', function() {
        var result = CategorizationService.aggregateByCategory(null);
        expect(result.length).toBe(9);
        result.forEach(function(cat) {
          expect(cat.total).toBe(0);
          expect(cat.transactionCount).toBe(0);
          expect(cat.percentage).toBe(0);
        });
      });

      it('should return all categories with zero values for undefined transactions', function() {
        var result = CategorizationService.aggregateByCategory(undefined);
        expect(result.length).toBe(9);
        result.forEach(function(cat) {
          expect(cat.total).toBe(0);
          expect(cat.transactionCount).toBe(0);
        });
      });

      it('should aggregate transactions by category correctly', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining'},
          {amount: 50, category: 'Food & Dining'},
          {amount: 75, category: 'Fuel'},
          {amount: 200, category: 'Shopping'}
        ];
        var result = CategorizationService.aggregateByCategory(transactions);
        var foodDining = result.find(function(c) { return c.category === 'Food & Dining'; });
        var fuel = result.find(function(c) { return c.category === 'Fuel'; });
        var shopping = result.find(function(c) { return c.category === 'Shopping'; });

        expect(foodDining.total).toBe(150);
        expect(foodDining.transactionCount).toBe(2);
        expect(fuel.total).toBe(75);
        expect(fuel.transactionCount).toBe(1);
        expect(shopping.total).toBe(200);
        expect(shopping.transactionCount).toBe(1);
      });

      it('should calculate percentages correctly', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining'},
          {amount: 100, category: 'Fuel'},
          {amount: 200, category: 'Shopping'}
        ];
        var result = CategorizationService.aggregateByCategory(transactions);
        var foodDining = result.find(function(c) { return c.category === 'Food & Dining'; });
        var fuel = result.find(function(c) { return c.category === 'Fuel'; });
        var shopping = result.find(function(c) { return c.category === 'Shopping'; });

        expect(parseFloat(foodDining.percentage)).toBeCloseTo(25.00, 2);
        expect(parseFloat(fuel.percentage)).toBeCloseTo(25.00, 2);
        expect(parseFloat(shopping.percentage)).toBeCloseTo(50.00, 2);
      });

      it('should return all 9 predefined categories even if some have no transactions', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining'}
        ];
        var result = CategorizationService.aggregateByCategory(transactions);
        expect(result.length).toBe(9);
        EXPECTED_CATEGORIES.forEach(function(catName) {
          var found = result.find(function(c) { return c.category === catName; });
          expect(found).toBeDefined();
        });
      });

      it('should handle transactions with decimal amounts', function() {
        var transactions = [
          {amount: 125.50, category: 'Food & Dining'},
          {amount: 60.75, category: 'Fuel'}
        ];
        var result = CategorizationService.aggregateByCategory(transactions);
        var foodDining = result.find(function(c) { return c.category === 'Food & Dining'; });
        var fuel = result.find(function(c) { return c.category === 'Fuel'; });

        expect(foodDining.total).toBeCloseTo(125.50, 2);
        expect(fuel.total).toBeCloseTo(60.75, 2);
      });

      it('should ignore transactions with unknown categories', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining'},
          {amount: 50, category: 'Unknown Category'},
          {amount: 75, category: 'Fuel'}
        ];
        var result = CategorizationService.aggregateByCategory(transactions);
        var totalAmount = result.reduce(function(sum, cat) { return sum + cat.total; }, 0);
        expect(totalAmount).toBe(175);
      });

      it('should handle all categories having transactions', function() {
        var transactions = EXPECTED_CATEGORIES.map(function(cat, index) {
          return {amount: (index + 1) * 10, category: cat};
        });
        var result = CategorizationService.aggregateByCategory(transactions);
        result.forEach(function(cat) {
          expect(cat.total).toBeGreaterThan(0);
          expect(cat.transactionCount).toBe(1);
        });
      });

      it('should return category objects with required properties', function() {
        var transactions = [
          {amount: 100, category: 'Food & Dining'}
        ];
        var result = CategorizationService.aggregateByCategory(transactions);
        result.forEach(function(cat) {
          expect(cat.hasOwnProperty('category')).toBe(true);
          expect(cat.hasOwnProperty('total')).toBe(true);
          expect(cat.hasOwnProperty('transactionCount')).toBe(true);
          expect(cat.hasOwnProperty('percentage')).toBe(true);
        });
      });

      it('should calculate percentage as 0 when total amount is 0', function() {
        var result = CategorizationService.aggregateByCategory([]);
        result.forEach(function(cat) {
          expect(cat.percentage).toBe(0);
        });
      });

      it('should handle large transaction amounts', function() {
        var transactions = [
          {amount: 1000000, category: 'Travel'},
          {amount: 500000, category: 'Shopping'}
        ];
        var result = CategorizationService.aggregateByCategory(transactions);
        var travel = result.find(function(c) { return c.category === 'Travel'; });
        var shopping = result.find(function(c) { return c.category === 'Shopping'; });

        expect(travel.total).toBe(1000000);
        expect(shopping.total).toBe(500000);
        expect(parseFloat(travel.percentage)).toBeCloseTo(66.67, 1);
        expect(parseFloat(shopping.percentage)).toBeCloseTo(33.33, 1);
      });
    });

    describe('getCategories', function() {
      it('should return array of 9 categories', function() {
        var categories = CategorizationService.getCategories();
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBe(9);
      });

      it('should return all expected category names', function() {
        var categories = CategorizationService.getCategories();
        EXPECTED_CATEGORIES.forEach(function(expectedCat) {
          expect(categories).toContain(expectedCat);
        });
      });

      it('should return independent copy of categories array', function() {
        var categories1 = CategorizationService.getCategories();
        var categories2 = CategorizationService.getCategories();
        expect(categories1).not.toBe(categories2);
        expect(categories1).toEqual(categories2);
      });

      it('should return categories in expected order', function() {
        var categories = CategorizationService.getCategories();
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
    });
  });
})();