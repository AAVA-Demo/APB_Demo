/*
Test Documentation:
- Test Name: AnalyticsEngineService - aggregateByCategory with valid transactions
- Purpose: Validates that transactions are correctly aggregated by category
- Scenario: Service receives array of transactions with different categories
- Expected Result: Returns array of category objects with correct totals, counts, and percentages
*/
/*
Test Documentation:
- Test Name: AnalyticsEngineService - aggregateByCategory with empty transactions
- Purpose: Validates handling of empty transaction array
- Scenario: Service receives empty array
- Expected Result: Returns array of categories with zero amounts
*/
/*
Test Documentation:
- Test Name: AnalyticsEngineService - aggregateByCategory with unknown category
- Purpose: Validates handling of transactions with categories not in predefined list
- Scenario: Transaction has category not recognized by CategoryFactory
- Expected Result: Transaction is ignored, no error thrown
*/
/*
Coverage Report:
- Functions tested: aggregateByCategory
- Scenarios covered: valid transactions, empty array, unknown categories, percentage calculation
- Uncovered scenarios: none
*/

describe('AnalyticsEngineService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var AnalyticsEngineService;
  var CategoryFactory;
  
  beforeEach(inject(function(_AnalyticsEngineService_, _CategoryFactory_) {
    AnalyticsEngineService = _AnalyticsEngineService_;
    CategoryFactory = _CategoryFactory_;
  }));
  
  describe('aggregateByCategory', function() {
    
    it('should aggregate transactions by category with correct totals and percentages', function() {
      var mockTransactions = [
        { id: 'txn1', category: 'Food & Dining', amount: 1000 },
        { id: 'txn2', category: 'Food & Dining', amount: 500 },
        { id: 'txn3', category: 'Fuel', amount: 2000 },
        { id: 'txn4', category: 'Shopping', amount: 1500 }
      ];
      
      var result = AnalyticsEngineService.aggregateByCategory(mockTransactions);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      var foodDining = result.find(function(cat) { return cat.categoryName === 'Food & Dining'; });
      expect(foodDining).toBeDefined();
      expect(foodDining.totalAmount).toBe(1500);
      expect(foodDining.transactionCount).toBe(2);
      expect(foodDining.percentage).toBeCloseTo(30, 1);
      expect(foodDining.transactions.length).toBe(2);
      
      var fuel = result.find(function(cat) { return cat.categoryName === 'Fuel'; });
      expect(fuel).toBeDefined();
      expect(fuel.totalAmount).toBe(2000);
      expect(fuel.transactionCount).toBe(1);
      expect(fuel.percentage).toBeCloseTo(40, 1);
    });
    
    it('should return categories with zero amounts when given empty transaction array', function() {
      var result = AnalyticsEngineService.aggregateByCategory([]);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      result.forEach(function(cat) {
        expect(cat.totalAmount).toBe(0);
        expect(cat.transactionCount).toBe(0);
        expect(cat.percentage).toBe(0);
        expect(cat.transactions.length).toBe(0);
      });
    });
    
    it('should ignore transactions with unknown categories', function() {
      var mockTransactions = [
        { id: 'txn1', category: 'Food & Dining', amount: 1000 },
        { id: 'txn2', category: 'UnknownCategory', amount: 5000 },
        { id: 'txn3', category: 'Fuel', amount: 2000 }
      ];
      
      var result = AnalyticsEngineService.aggregateByCategory(mockTransactions);
      
      expect(result).toBeDefined();
      var unknownCat = result.find(function(cat) { return cat.categoryName === 'UnknownCategory'; });
      expect(unknownCat).toBeUndefined();
      
      var foodDining = result.find(function(cat) { return cat.categoryName === 'Food & Dining'; });
      expect(foodDining.totalAmount).toBe(1000);
    });
    
    it('should calculate percentages correctly for all categories', function() {
      var mockTransactions = [
        { id: 'txn1', category: 'Food & Dining', amount: 2500 },
        { id: 'txn2', category: 'Fuel', amount: 2500 },
        { id: 'txn3', category: 'Shopping', amount: 2500 },
        { id: 'txn4', category: 'Travel', amount: 2500 }
      ];
      
      var result = AnalyticsEngineService.aggregateByCategory(mockTransactions);
      var totalPercentage = 0;
      
      result.forEach(function(cat) {
        if (cat.transactionCount > 0) {
          totalPercentage += cat.percentage;
        }
      });
      
      expect(totalPercentage).toBeCloseTo(100, 1);
    });
    
    it('should include transaction objects in category results', function() {
      var mockTransactions = [
        { id: 'txn1', category: 'Food & Dining', amount: 1000, description: 'Restaurant' },
        { id: 'txn2', category: 'Food & Dining', amount: 500, description: 'Cafe' }
      ];
      
      var result = AnalyticsEngineService.aggregateByCategory(mockTransactions);
      var foodDining = result.find(function(cat) { return cat.categoryName === 'Food & Dining'; });
      
      expect(foodDining.transactions).toBeDefined();
      expect(foodDining.transactions.length).toBe(2);
      expect(foodDining.transactions[0].id).toBe('txn1');
      expect(foodDining.transactions[1].id).toBe('txn2');
    });
  });
});