/*
Test Documentation:
- Test Name: categoryFilter - Transaction Category Filtering
- Purpose: Validate category filter for transaction arrays
- Scenario: Test filter with category parameter and without
- Expected Result: Transactions filtered by category correctly
*/

describe('categoryFilter', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.analytics'));
  
  var categoryFilter;
  var mockTransactions = [
    {transactionId: '1', merchantName: 'Restaurant A', category: 'Food & Dining', amount: 45.50},
    {transactionId: '2', merchantName: 'Gas Station', category: 'Fuel', amount: 60.00},
    {transactionId: '3', merchantName: 'Restaurant B', category: 'Food & Dining', amount: 30.00},
    {transactionId: '4', merchantName: 'Store A', category: 'Shopping', amount: 120.00}
  ];
  
  beforeEach(inject(function($filter) {
    categoryFilter = $filter('categoryFilter');
  }));
  
  it('should return all transactions when category is not specified', function() {
    var result = categoryFilter(mockTransactions);
    expect(result.length).toBe(4);
    expect(result).toEqual(mockTransactions);
  });
  
  it('should return all transactions when category is null', function() {
    var result = categoryFilter(mockTransactions, null);
    expect(result.length).toBe(4);
    expect(result).toEqual(mockTransactions);
  });
  
  it('should return all transactions when category is empty string', function() {
    var result = categoryFilter(mockTransactions, '');
    expect(result.length).toBe(4);
    expect(result).toEqual(mockTransactions);
  });
  
  it('should filter transactions by category', function() {
    var result = categoryFilter(mockTransactions, 'Food & Dining');
    expect(result.length).toBe(2);
    expect(result[0].category).toBe('Food & Dining');
    expect(result[1].category).toBe('Food & Dining');
  });
  
  it('should return single transaction for unique category', function() {
    var result = categoryFilter(mockTransactions, 'Fuel');
    expect(result.length).toBe(1);
    expect(result[0].category).toBe('Fuel');
    expect(result[0].merchantName).toBe('Gas Station');
  });
  
  it('should return empty array when no transactions match category', function() {
    var result = categoryFilter(mockTransactions, 'Travel');
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
  
  it('should handle empty transaction array', function() {
    var result = categoryFilter([], 'Food & Dining');
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
  
  it('should be case-sensitive', function() {
    var result = categoryFilter(mockTransactions, 'food & dining');
    expect(result.length).toBe(0);
  });
});

/*
Coverage Report:
- Functions tested: categoryFilter
- Scenarios covered: no filter, null/empty category, category filtering, single/multiple matches, no matches, empty array
- Edge cases: empty transaction array, case sensitivity, null/empty string category
- Uncovered scenarios: none
*/