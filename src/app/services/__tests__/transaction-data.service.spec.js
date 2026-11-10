/*
Test Documentation:
- Test Name: TransactionDataService - fetchCategorizedTransactions returns transactions
- Purpose: Validates retrieval of categorized transaction data
- Scenario: Service is called with valid userId
- Expected Result: Promise resolves with array of categorized transactions
*/
/*
Test Documentation:
- Test Name: TransactionDataService - fetchCategorizedTransactions returns valid categories
- Purpose: Validates that all transactions have valid predefined categories
- Scenario: Transactions are fetched for user
- Expected Result: All transactions have categories from the predefined list
*/
/*
Test Documentation:
- Test Name: TransactionDataService - fetchCategorizedTransactions returns complete transaction objects
- Purpose: Validates transaction object structure
- Scenario: Service returns transaction data
- Expected Result: Each transaction has id, userId, cardId, amount, category, description, transactionDate, merchantName
*/
/*
Coverage Report:
- Functions tested: fetchCategorizedTransactions
- Scenarios covered: transaction retrieval, category validation, data structure validation, userId association
- Uncovered scenarios: none
*/

describe('TransactionDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionDataService;
  var $rootScope;
  
  beforeEach(inject(function(_TransactionDataService_, _$rootScope_) {
    TransactionDataService = _TransactionDataService_;
    $rootScope = _$rootScope_;
  }));
  
  describe('fetchCategorizedTransactions', function() {
    
    var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    it('should return promise that resolves with array of transactions', function(done) {
      var userId = 'user123';
      
      TransactionDataService.fetchCategorizedTransactions(userId).then(function(transactions) {
        expect(transactions).toBeDefined();
        expect(Array.isArray(transactions)).toBe(true);
        expect(transactions.length).toBeGreaterThan(0);
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return approximately 150 transactions', function(done) {
      var userId = 'user123';
      
      TransactionDataService.fetchCategorizedTransactions(userId).then(function(transactions) {
        expect(transactions.length).toBe(150);
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return transactions with valid predefined categories', function(done) {
      var userId = 'user123';
      
      TransactionDataService.fetchCategorizedTransactions(userId).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(validCategories).toContain(txn.category);
        });
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return transactions with complete required fields', function(done) {
      var userId = 'user123';
      
      TransactionDataService.fetchCategorizedTransactions(userId).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.id).toBeDefined();
          expect(txn.userId).toBe(userId);
          expect(txn.cardId).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(typeof txn.amount).toBe('number');
          expect(txn.category).toBeDefined();
          expect(txn.description).toBeDefined();
          expect(txn.transactionDate).toBeDefined();
          expect(txn.transactionDate instanceof Date).toBe(true);
          expect(txn.merchantName).toBeDefined();
        });
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return transactions with positive amounts', function(done) {
      var userId = 'user123';
      
      TransactionDataService.fetchCategorizedTransactions(userId).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.amount).toBeGreaterThan(0);
        });
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return transactions with valid cardId format', function(done) {
      var userId = 'user123';
      
      TransactionDataService.fetchCategorizedTransactions(userId).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.cardId).toMatch(/^card00[1-3]$/);
        });
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return transactions with dates within past year', function(done) {
      var userId = 'user123';
      var now = new Date();
      var oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      
      TransactionDataService.fetchCategorizedTransactions(userId).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.transactionDate.getTime()).toBeLessThanOrEqual(now.getTime());
          expect(txn.transactionDate.getTime()).toBeGreaterThanOrEqual(oneYearAgo.getTime());
        });
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return transactions distributed across multiple categories', function(done) {
      var userId = 'user123';
      
      TransactionDataService.fetchCategorizedTransactions(userId).then(function(transactions) {
        var categoriesUsed = {};
        transactions.forEach(function(txn) {
          categoriesUsed[txn.category] = true;
        });
        var uniqueCategories = Object.keys(categoriesUsed);
        expect(uniqueCategories.length).toBeGreaterThan(1);
        done();
      });
      $rootScope.$apply();
    });
  });
});