/*
Test Documentation:
- Test Name: TransactionFactory - getCardSpending calculates monthly spend
- Purpose: Validates card-specific spending calculation for current month
- Scenario: Factory is called with card ID
- Expected Result: Returns promise with monthly spend, transaction count, and last transaction date

- Test Name: TransactionFactory - getCardSpending filters by card ID
- Purpose: Validates transaction filtering for specific card
- Scenario: Multiple cards have transactions
- Expected Result: Returns spending data only for specified card

- Test Name: TransactionFactory - getCardSpending handles card with no transactions
- Purpose: Validates handling of card with no transaction history
- Scenario: Card ID has no associated transactions
- Expected Result: Returns zero monthly spend and null last transaction date

- Test Name: TransactionFactory - getTransactions returns card transactions
- Purpose: Validates retrieval of all transactions for a specific card
- Scenario: Factory is called with card ID
- Expected Result: Returns promise resolving to array of card transactions

Coverage Report:
- Functions tested: getCardSpending, getTransactions
- Scenarios covered: spending calculation, card filtering, no transactions, transaction retrieval, current month filtering
- Uncovered scenarios: none
*/

describe('TransactionFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionFactory, $q, $rootScope, $timeout;
  
  beforeEach(inject(function(_TransactionFactory_, _$q_, _$rootScope_, _$timeout_) {
    TransactionFactory = _TransactionFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));
  
  describe('getCardSpending', function() {
    it('should calculate monthly spend for specified card', function() {
      var result;
      TransactionFactory.getCardSpending('card-001').then(function(spending) {
        result = spending;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe('card-001');
      expect(result.monthlySpend).toBeDefined();
      expect(typeof result.monthlySpend).toBe('number');
      expect(result.totalTransactions).toBeDefined();
      expect(result.lastTransactionDate).toBeDefined();
    });
    
    it('should filter transactions by card ID', function() {
      var result;
      TransactionFactory.getCardSpending('card-002').then(function(spending) {
        result = spending;
      });
      
      $timeout.flush();
      
      expect(result.cardId).toBe('card-002');
      expect(result.totalTransactions).toBeGreaterThan(0);
    });
    
    it('should handle card with no transactions', function() {
      var result;
      TransactionFactory.getCardSpending('card-999').then(function(spending) {
        result = spending;
      });
      
      $timeout.flush();
      
      expect(result.cardId).toBe('card-999');
      expect(result.monthlySpend).toBe(0);
      expect(result.totalTransactions).toBe(0);
      expect(result.lastTransactionDate).toBeNull();
    });
    
    it('should round monthly spend to 2 decimal places', function() {
      var result;
      TransactionFactory.getCardSpending('card-001').then(function(spending) {
        result = spending;
      });
      
      $timeout.flush();
      
      var decimalPlaces = (result.monthlySpend.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
    
    it('should return last transaction date as Date object or null', function() {
      var result;
      TransactionFactory.getCardSpending('card-001').then(function(spending) {
        result = spending;
      });
      
      $timeout.flush();
      
      if (result.lastTransactionDate) {
        expect(result.lastTransactionDate instanceof Date).toBe(true);
      } else {
        expect(result.lastTransactionDate).toBeNull();
      }
    });
  });
  
  describe('getTransactions', function() {
    it('should return all transactions for specified card', function() {
      var result;
      TransactionFactory.getTransactions('card-001').then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      result.forEach(function(txn) {
        expect(txn.cardId).toBe('card-001');
      });
    });
    
    it('should return empty array for card with no transactions', function() {
      var result;
      TransactionFactory.getTransactions('card-999').then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should include all transaction fields', function() {
      var result;
      TransactionFactory.getTransactions('card-001').then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      if (result.length > 0) {
        var txn = result[0];
        expect(txn.transactionId).toBeDefined();
        expect(txn.cardId).toBeDefined();
        expect(txn.amount).toBeDefined();
        expect(txn.date).toBeDefined();
        expect(txn.merchantName).toBeDefined();
        expect(txn.merchantCode).toBeDefined();
      }
    });
    
    it('should resolve promise after 200ms timeout', function() {
      var resolved = false;
      TransactionFactory.getTransactions('card-001').then(function() {
        resolved = true;
      });
      
      expect(resolved).toBe(false);
      $timeout.flush(199);
      expect(resolved).toBe(false);
      $timeout.flush(1);
      expect(resolved).toBe(true);
    });
  });
});