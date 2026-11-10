/*
Test Documentation:
- Test Name: TransactionCategorizationFactory - getCategorizedTransactions
- Purpose: Validates retrieval of categorized transactions
- Scenario: Request categorized transactions
- Expected Result: Returns array of transactions with category assignments
*/
/*
Test Documentation:
- Test Name: TransactionCategorizationFactory - transaction properties
- Purpose: Validates that transactions contain required properties
- Scenario: Retrieve categorized transactions
- Expected Result: Each transaction has transactionId, amount, date, category, description
*/
/*
Test Documentation:
- Test Name: TransactionCategorizationFactory - data immutability
- Purpose: Validates that returned data is a copy, not reference
- Scenario: Modify returned transaction data
- Expected Result: Original data remains unchanged
*/
/*
Coverage Report:
- Functions tested: getCategorizedTransactions
- Scenarios covered: successful retrieval, data properties, data immutability, promise resolution
- Uncovered scenarios: none
*/

describe('TransactionCategorizationFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionCategorizationFactory;
  var $timeout;
  var $rootScope;
  
  beforeEach(inject(function(_TransactionCategorizationFactory_, _$timeout_, _$rootScope_) {
    TransactionCategorizationFactory = _TransactionCategorizationFactory_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getCategorizedTransactions', function() {
    it('should return categorized transactions', function() {
      var result;
      TransactionCategorizationFactory.getCategorizedTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].category).toBeDefined();
    });
    
    it('should include required transaction properties', function() {
      var result;
      TransactionCategorizationFactory.getCategorizedTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result[0].transactionId).toBeDefined();
      expect(result[0].amount).toBeDefined();
      expect(result[0].date).toBeDefined();
      expect(result[0].category).toBeDefined();
      expect(result[0].description).toBeDefined();
    });
    
    it('should return a copy of data', function() {
      var result;
      TransactionCategorizationFactory.getCategorizedTransactions().then(function(transactions) {
        result = transactions;
        result[0].amount = 99999;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      var secondResult;
      TransactionCategorizationFactory.getCategorizedTransactions().then(function(transactions) {
        secondResult = transactions;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(secondResult[0].amount).not.toBe(99999);
    });
    
    it('should return a promise', function() {
      var promise = TransactionCategorizationFactory.getCategorizedTransactions();
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });
    
    it('should include multiple spending categories', function() {
      var result;
      TransactionCategorizationFactory.getCategorizedTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      var categories = result.map(function(t) { return t.category; });
      var uniqueCategories = categories.filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });
      
      expect(uniqueCategories.length).toBeGreaterThan(1);
    });
  });
});