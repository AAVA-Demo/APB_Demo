/*
Test Documentation:
- Test Name: TransactionProcessingService - getCurrentMonthSpend
- Purpose: Validates calculation of current month spending
- Scenario: Filters transactions by current month and sums amounts
- Expected Result: Returns correct sum of current month transactions
*/
/*
Test Documentation:
- Test Name: TransactionProcessingService - getCurrentMonthSpend with no transactions
- Purpose: Validates handling of empty transaction list
- Scenario: No transactions for current month
- Expected Result: Returns 0
*/
/*
Coverage Report:
- Functions tested: getCurrentMonthSpend
- Scenarios covered: transactions in current month, no transactions, date filtering
- Uncovered scenarios: none
*/

describe('TransactionProcessingService', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var TransactionProcessingService, TransactionDataFactory, $q, $rootScope;
  
  beforeEach(inject(function(_TransactionProcessingService_, _TransactionDataFactory_, _$q_, _$rootScope_) {
    TransactionProcessingService = _TransactionProcessingService_;
    TransactionDataFactory = _TransactionDataFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getCurrentMonthSpend', function() {
    it('should calculate current month spend correctly', function() {
      var currentDate = new Date();
      var currentMonth = currentDate.getMonth();
      var currentYear = currentDate.getFullYear();
      
      var mockTransactions = [
        { transactionId: 1, amount: 100, transactionDate: new Date(currentYear, currentMonth, 5).toISOString() },
        { transactionId: 2, amount: 250, transactionDate: new Date(currentYear, currentMonth, 10).toISOString() },
        { transactionId: 3, amount: 50, transactionDate: new Date(currentYear, currentMonth - 1, 15).toISOString() }
      ];
      
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      
      var result;
      TransactionProcessingService.getCurrentMonthSpend().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result).toBe(350);
    });
    
    it('should return 0 when no transactions in current month', function() {
      var mockTransactions = [
        { transactionId: 1, amount: 100, transactionDate: new Date(2023, 0, 5).toISOString() }
      ];
      
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      
      var result;
      TransactionProcessingService.getCurrentMonthSpend().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result).toBe(0);
    });
    
    it('should return 0 when no transactions at all', function() {
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve([]));
      
      var result;
      TransactionProcessingService.getCurrentMonthSpend().then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result).toBe(0);
    });
  });
});