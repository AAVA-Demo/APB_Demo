/*
Test Documentation:
- Test Name: TransactionService - getTransactions returns mock transaction data
- Purpose: Validates transaction data retrieval
- Scenario: When getTransactions is called
- Expected Result: Returns array of transaction objects with correct structure
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions returns cached data on subsequent calls
- Purpose: Validates caching mechanism
- Scenario: Given transactions have been loaded once
- Expected Result: Returns same cached data without reloading
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: initial load, caching, data structure validation
- Uncovered scenarios: none
*/

describe('TransactionService', function() {
  'use strict';

  beforeEach(module('creditCardApp.analytics'));

  var TransactionService, $q, $rootScope, TransactionFactory;

  beforeEach(inject(function(_TransactionService_, _$q_, _$rootScope_, _TransactionFactory_) {
    TransactionService = _TransactionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    TransactionFactory = _TransactionFactory_;
  }));

  describe('getTransactions', function() {
    it('should return an array of transactions', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return transactions with correct structure', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      var transaction = result[0];
      expect(transaction.transactionId).toBeDefined();
      expect(transaction.cardId).toBeDefined();
      expect(transaction.merchantName).toBeDefined();
      expect(transaction.merchantCategory).toBeDefined();
      expect(transaction.amount).toBeDefined();
      expect(transaction.currency).toBeDefined();
      expect(transaction.transactionDate).toBeDefined();
      expect(transaction.description).toBeDefined();
    });

    it('should return transactions across all nine categories', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      var categories = result.map(function(t) { return t.merchantCategory; });
      var uniqueCategories = categories.filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });

      expect(uniqueCategories.length).toBeGreaterThanOrEqual(9);
      expect(uniqueCategories).toContain('food');
      expect(uniqueCategories).toContain('fuel');
      expect(uniqueCategories).toContain('shopping');
      expect(uniqueCategories).toContain('travel');
      expect(uniqueCategories).toContain('entertainment');
      expect(uniqueCategories).toContain('utilities');
      expect(uniqueCategories).toContain('healthcare');
      expect(uniqueCategories).toContain('education');
      expect(uniqueCategories).toContain('miscellaneous');
    });

    it('should return cached data on subsequent calls', function() {
      var firstResult, secondResult;

      TransactionService.getTransactions().then(function(transactions) {
        firstResult = transactions;
      });
      $rootScope.$digest();

      TransactionService.getTransactions().then(function(transactions) {
        secondResult = transactions;
      });
      $rootScope.$digest();

      expect(firstResult).toBe(secondResult);
    });

    it('should return transactions with valid date objects', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      result.forEach(function(transaction) {
        expect(transaction.transactionDate instanceof Date).toBe(true);
      });
    });

    it('should return transactions spanning multiple months', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      var months = result.map(function(t) {
        var date = new Date(t.transactionDate);
        return date.getFullYear() + '-' + (date.getMonth() + 1);
      });
      var uniqueMonths = months.filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });

      expect(uniqueMonths.length).toBeGreaterThan(1);
    });
  });
});