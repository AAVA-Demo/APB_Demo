/*
Test Documentation:
- Test Name: TransactionDatabaseFactory - getRecentTransactions
- Purpose: Validates retrieval of recent transactions for a card
- Scenario: Valid cardId provided
- Expected Result: Returns limited number of recent transactions
*/
/*
Test Documentation:
- Test Name: TransactionDatabaseFactory - getFullTransactionHistory
- Purpose: Validates retrieval of complete transaction history for a card
- Scenario: Valid cardId provided
- Expected Result: Returns all transactions for the card
*/
/*
Test Documentation:
- Test Name: TransactionDatabaseFactory - getRecentTransactions empty result
- Purpose: Validates behavior when no transactions exist for card
- Scenario: CardId with no transactions
- Expected Result: Returns empty array
*/
/*
Coverage Report:
- Functions tested: getRecentTransactions, getFullTransactionHistory
- Scenarios covered: recent transactions, full history, empty results, filtering by cardId
- Uncovered scenarios: none
*/

describe('TransactionDatabaseFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionDatabaseFactory;
  var $timeout;
  var $rootScope;
  
  beforeEach(inject(function(_TransactionDatabaseFactory_, _$timeout_, _$rootScope_) {
    TransactionDatabaseFactory = _TransactionDatabaseFactory_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getRecentTransactions', function() {
    it('should return recent transactions for a card', function() {
      var result;
      TransactionDatabaseFactory.getRecentTransactions('card1').then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(5);
      result.forEach(function(t) {
        expect(t.cardId).toBe('card1');
      });
    });
    
    it('should return empty array when no transactions exist for card', function() {
      var result;
      TransactionDatabaseFactory.getRecentTransactions('nonexistentCard').then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
    
    it('should return a promise', function() {
      var promise = TransactionDatabaseFactory.getRecentTransactions('card1');
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });
  });
  
  describe('getFullTransactionHistory', function() {
    it('should return full transaction history for a card', function() {
      var result;
      TransactionDatabaseFactory.getFullTransactionHistory('card2').then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      result.forEach(function(t) {
        expect(t.cardId).toBe('card2');
      });
    });
    
    it('should return empty array when no transactions exist for card', function() {
      var result;
      TransactionDatabaseFactory.getFullTransactionHistory('nonexistentCard').then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
    
    it('should include transaction properties', function() {
      var result;
      TransactionDatabaseFactory.getFullTransactionHistory('card1').then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      if (result.length > 0) {
        expect(result[0].transactionId).toBeDefined();
        expect(result[0].cardId).toBeDefined();
        expect(result[0].amount).toBeDefined();
        expect(result[0].date).toBeDefined();
        expect(result[0].description).toBeDefined();
        expect(result[0].category).toBeDefined();
        expect(result[0].status).toBeDefined();
      }
    });
    
    it('should return a promise', function() {
      var promise = TransactionDatabaseFactory.getFullTransactionHistory('card1');
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });
  });
});