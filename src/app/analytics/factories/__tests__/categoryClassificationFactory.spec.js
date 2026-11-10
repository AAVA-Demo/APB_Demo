/*
Test Documentation:
- Test Name: categoryClassificationFactory - Categorize Valid Categories
- Purpose: Verify factory preserves valid categories
- Scenario: Transactions with valid category names
- Expected Result: Categories remain unchanged
*/
/*
Test Documentation:
- Test Name: categoryClassificationFactory - Categorize Invalid Categories
- Purpose: Verify factory assigns Miscellaneous to invalid categories
- Scenario: Transactions with invalid or missing categories
- Expected Result: Invalid categories set to Miscellaneous
*/
/*
Coverage Report:
- Functions tested: categorize
- Scenarios covered: valid categories, invalid categories, missing categories
- Uncovered scenarios: none
*/

describe('categoryClassificationFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.analytics'));
  
  var categoryClassificationFactory;
  
  beforeEach(inject(function(_categoryClassificationFactory_) {
    categoryClassificationFactory = _categoryClassificationFactory_;
  }));
  
  it('should preserve valid categories', function() {
    var transactions = [
      {transactionId: 't1', category: 'Food & Dining', amount: 150},
      {transactionId: 't2', category: 'Fuel', amount: 80},
      {transactionId: 't3', category: 'Shopping', amount: 500}
    ];
    
    var result = categoryClassificationFactory.categorize(transactions);
    
    expect(result[0].category).toBe('Food & Dining');
    expect(result[1].category).toBe('Fuel');
    expect(result[2].category).toBe('Shopping');
  });
  
  it('should assign Miscellaneous to invalid categories', function() {
    var transactions = [
      {transactionId: 't1', category: 'InvalidCategory', amount: 150},
      {transactionId: 't2', category: 'AnotherInvalid', amount: 80}
    ];
    
    var result = categoryClassificationFactory.categorize(transactions);
    
    expect(result[0].category).toBe('Miscellaneous');
    expect(result[1].category).toBe('Miscellaneous');
  });
  
  it('should assign Miscellaneous to transactions without category', function() {
    var transactions = [
      {transactionId: 't1', amount: 150},
      {transactionId: 't2', category: null, amount: 80}
    ];
    
    var result = categoryClassificationFactory.categorize(transactions);
    
    expect(result[0].category).toBe('Miscellaneous');
    expect(result[1].category).toBe('Miscellaneous');
  });
  
  it('should handle all valid categories', function() {
    var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    var transactions = validCategories.map(function(cat, idx) {
      return {transactionId: 't' + idx, category: cat, amount: 100};
    });
    
    var result = categoryClassificationFactory.categorize(transactions);
    
    result.forEach(function(txn, idx) {
      expect(txn.category).toBe(validCategories[idx]);
    });
  });
});