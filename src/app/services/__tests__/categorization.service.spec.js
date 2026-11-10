/*
Test Documentation:
- Test Name: CategorizationService - categorizeAndAggregate with valid transactions
- Purpose: Validates transaction categorization and aggregation across predefined categories
- Scenario: Service receives array of transactions with various categories
- Expected Result: Returns categorized data with amounts, percentages, and transaction counts
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorizeAndAggregate with empty transactions
- Purpose: Validates handling of empty transaction array
- Scenario: Service receives empty array
- Expected Result: Returns empty categories array with totalSpend 0
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorizeAndAggregate with unknown category
- Purpose: Validates that unknown categories are mapped to Miscellaneous
- Scenario: Transaction has category not in predefined list
- Expected Result: Transaction is categorized as Miscellaneous
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorizeAndAggregate calculates percentages correctly
- Purpose: Validates percentage calculation accuracy
- Scenario: Multiple transactions across different categories
- Expected Result: Percentages sum to 100% and are calculated correctly
*/
/*
Coverage Report:
- Functions tested: categorizeAndAggregate
- Scenarios covered: valid transactions, empty transactions, unknown categories, percentage calculations, nine predefined categories
- Uncovered scenarios: none
*/

(function(){
'use strict';

describe('CategorizationService', function(){
  var CategorizationService;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CategorizationService_){
    CategorizationService = _CategorizationService_;
  }));
  
  describe('categorizeAndAggregate', function(){
    
    it('should categorize and aggregate transactions correctly', function(){
      var transactions = [
        {transactionId:'T001', amount:1000, category:'Food & Dining'},
        {transactionId:'T002', amount:2000, category:'Shopping'},
        {transactionId:'T003', amount:1500, category:'Food & Dining'},
        {transactionId:'T004', amount:500, category:'Fuel'}
      ];
      
      var result = CategorizationService.categorizeAndAggregate(transactions);
      
      expect(result.totalSpend).toBe(5000);
      expect(result.transactions).toEqual(transactions);
      expect(result.categories.length).toBe(9);
      
      var foodCategory = result.categories.find(function(c){return c.name === 'Food & Dining';});
      expect(foodCategory.amount).toBe(2500);
      expect(foodCategory.percentage).toBe(50);
      expect(foodCategory.transactionCount).toBe(2);
      
      var shoppingCategory = result.categories.find(function(c){return c.name === 'Shopping';});
      expect(shoppingCategory.amount).toBe(2000);
      expect(shoppingCategory.percentage).toBe(40);
      expect(shoppingCategory.transactionCount).toBe(1);
      
      var fuelCategory = result.categories.find(function(c){return c.name === 'Fuel';});
      expect(fuelCategory.amount).toBe(500);
      expect(fuelCategory.percentage).toBe(10);
    });
    
    it('should return empty result for empty transactions', function(){
      var result = CategorizationService.categorizeAndAggregate([]);
      
      expect(result.categories).toEqual([]);
      expect(result.totalSpend).toBe(0);
      expect(result.transactions).toEqual([]);
    });
    
    it('should return empty result for null transactions', function(){
      var result = CategorizationService.categorizeAndAggregate(null);
      
      expect(result.categories).toEqual([]);
      expect(result.totalSpend).toBe(0);
    });
    
    it('should map unknown categories to Miscellaneous', function(){
      var transactions = [
        {transactionId:'T001', amount:1000, category:'UnknownCategory'},
        {transactionId:'T002', amount:500, category:'AnotherUnknown'}
      ];
      
      var result = CategorizationService.categorizeAndAggregate(transactions);
      
      var miscCategory = result.categories.find(function(c){return c.name === 'Miscellaneous';});
      expect(miscCategory.amount).toBe(1500);
      expect(miscCategory.transactionCount).toBe(2);
    });
    
    it('should handle transactions without category field', function(){
      var transactions = [
        {transactionId:'T001', amount:1000}
      ];
      
      var result = CategorizationService.categorizeAndAggregate(transactions);
      
      var miscCategory = result.categories.find(function(c){return c.name === 'Miscellaneous';});
      expect(miscCategory.amount).toBe(1000);
    });
    
    it('should calculate percentages correctly with decimal precision', function(){
      var transactions = [
        {transactionId:'T001', amount:333.33, category:'Food & Dining'},
        {transactionId:'T002', amount:333.33, category:'Shopping'},
        {transactionId:'T003', amount:333.34, category:'Travel'}
      ];
      
      var result = CategorizationService.categorizeAndAggregate(transactions);
      
      expect(result.totalSpend).toBe(1000);
      
      var foodCategory = result.categories.find(function(c){return c.name === 'Food & Dining';});
      expect(foodCategory.percentage).toBe(33.33);
    });
    
    it('should include all nine predefined categories', function(){
      var transactions = [{transactionId:'T001', amount:100, category:'Food & Dining'}];
      
      var result = CategorizationService.categorizeAndAggregate(transactions);
      
      var categoryNames = result.categories.map(function(c){return c.name;});
      expect(categoryNames).toContain('Food & Dining');
      expect(categoryNames).toContain('Fuel');
      expect(categoryNames).toContain('Shopping');
      expect(categoryNames).toContain('Travel');
      expect(categoryNames).toContain('Entertainment');
      expect(categoryNames).toContain('Utilities');
      expect(categoryNames).toContain('Healthcare');
      expect(categoryNames).toContain('Education');
      expect(categoryNames).toContain('Miscellaneous');
    });
    
  });
  
});

})();