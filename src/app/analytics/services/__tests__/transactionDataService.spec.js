/*
Test Documentation:
- Test Name: transactionDataService - Get Transactions
- Purpose: Verify service retrieves and filters transactions by date range
- Scenario: Request transactions within date range
- Expected Result: Returns only transactions within specified dates
*/
/*
Test Documentation:
- Test Name: transactionDataService - Empty Result
- Purpose: Verify service handles no matching transactions
- Scenario: Date range with no transactions
- Expected Result: Returns empty array
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: date filtering, empty results
- Uncovered scenarios: API error handling
*/

describe('transactionDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.analytics'));
  
  var transactionDataService, $rootScope;
  
  beforeEach(inject(function(_transactionDataService_, _$rootScope_) {
    transactionDataService = _transactionDataService_;
    $rootScope = _$rootScope_;
  }));
  
  it('should return transactions within date range', function() {
    var startDate = new Date(2024, 0, 1);
    var endDate = new Date(2024, 2, 31);
    var result;
    
    transactionDataService.getTransactions(startDate, endDate).then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    result.forEach(function(txn) {
      expect(txn.date >= startDate).toBe(true);
      expect(txn.date <= endDate).toBe(true);
    });
  });
  
  it('should return empty array when no transactions match date range', function() {
    var startDate = new Date(2025, 0, 1);
    var endDate = new Date(2025, 0, 31);
    var result;
    
    transactionDataService.getTransactions(startDate, endDate).then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result).toEqual([]);
  });
  
  it('should return all mock transactions for full year range', function() {
    var startDate = new Date(2024, 0, 1);
    var endDate = new Date(2024, 11, 31);
    var result;
    
    transactionDataService.getTransactions(startDate, endDate).then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result.length).toBe(12);
  });
});