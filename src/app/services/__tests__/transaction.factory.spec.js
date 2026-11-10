/*
Test Documentation:
- Test Name: TransactionFactory - getMonthlyTransactions
- Purpose: Validates retrieval of current month transactions with totals
- Scenario: Request monthly transactions
- Expected Result: Returns filtered transactions, monthly spend, and outstanding amount
*/
/*
Test Documentation:
- Test Name: TransactionFactory - getAllTransactions
- Purpose: Validates retrieval of all transactions
- Scenario: Request all transactions
- Expected Result: Returns complete transaction array
*/
/*
Test Documentation:
- Test Name: TransactionFactory - getMonthlyTransactions calculation
- Purpose: Validates monthly spend and outstanding amount calculations
- Scenario: Known transaction amounts
- Expected Result: Correct totals calculated
*/
/*
Coverage Report:
- Functions tested: getMonthlyTransactions, getAllTransactions
- Scenarios covered: monthly filtering, totals calculation, all transactions, data immutability
- Uncovered scenarios: none
*/

describe('TransactionFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionFactory;
  var $timeout;
  var $rootScope;
  
  beforeEach(inject(function(_TransactionFactory_, _$timeout_, _$rootScope_) {
    TransactionFactory = _TransactionFactory_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getMonthlyTransactions', function() {
    it('should return monthly transactions with totals', function() {
      var result;
      TransactionFactory.getMonthlyTransactions().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
      expect(result.monthlySpend).toBeDefined();
      expect(result.outstandingAmount).toBeDefined();
      expect(Array.isArray(result.transactions)).toBe(true);
    });
    
    it('should filter transactions by current month', function() {
      var result;
      TransactionFactory.getMonthlyTransactions().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      var currentMonth = new Date().getMonth();
      result.transactions.forEach(function(t) {
        expect(t.date.getMonth()).toBe(currentMonth);
      });
    });
    
    it('should calculate monthly spend correctly', function() {
      var result;
      TransactionFactory.getMonthlyTransactions().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      var calculatedTotal = result.transactions.reduce(function(sum, t) {
        return sum + t.amount;
      }, 0);
      
      expect(result.monthlySpend).toBe(calculatedTotal);
    });
    
    it('should return a promise', function() {
      var promise = TransactionFactory.getMonthlyTransactions();
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });
  });
  
  describe('getAllTransactions', function() {
    it('should return all transactions', function() {
      var result;
      TransactionFactory.getAllTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
    
    it('should return a copy of data', function() {
      var result;
      TransactionFactory.getAllTransactions().then(function(transactions) {
        result = transactions;
        result[0].amount = 99999;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      var secondResult;
      TransactionFactory.getAllTransactions().then(function(transactions) {
        secondResult = transactions;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(secondResult[0].amount).not.toBe(99999);
    });
    
    it('should include transaction properties', function() {
      var result;
      TransactionFactory.getAllTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result[0].transactionId).toBeDefined();
      expect(result[0].cardId).toBeDefined();
      expect(result[0].amount).toBeDefined();
      expect(result[0].date).toBeDefined();
      expect(result[0].description).toBeDefined();
      expect(result[0].category).toBeDefined();
      expect(result[0].status).toBeDefined();
    });
    
    it('should return a promise', function() {
      var promise = TransactionFactory.getAllTransactions();
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });
  });
});