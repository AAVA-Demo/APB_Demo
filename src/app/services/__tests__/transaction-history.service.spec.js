/*
Test Documentation:
- Test Name: TransactionHistoryService - fetchHistoricalTransactions returns historical data
- Purpose: Validates retrieval of historical transaction data spanning multiple months
- Scenario: Service is called with userId and number of months
- Expected Result: Promise resolves with array of transactions spanning requested months
*/
/*
Test Documentation:
- Test Name: TransactionHistoryService - fetchHistoricalTransactions generates transactions for each month
- Purpose: Validates that transactions are generated for all requested months
- Scenario: Service is called with 12 months parameter
- Expected Result: Transactions span all 12 months
*/
/*
Test Documentation:
- Test Name: TransactionHistoryService - fetchHistoricalTransactions returns valid transaction structure
- Purpose: Validates transaction object completeness
- Scenario: Historical transactions are fetched
- Expected Result: Each transaction has all required fields with correct data types
*/
/*
Coverage Report:
- Functions tested: fetchHistoricalTransactions
- Scenarios covered: historical data retrieval, multi-month generation, transaction structure, date range validation
- Uncovered scenarios: none
*/

describe('TransactionHistoryService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionHistoryService;
  var $rootScope;
  
  beforeEach(inject(function(_TransactionHistoryService_, _$rootScope_) {
    TransactionHistoryService = _TransactionHistoryService_;
    $rootScope = _$rootScope_;
  }));
  
  describe('fetchHistoricalTransactions', function() {
    
    var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    it('should return promise that resolves with array of transactions', function(done) {
      var userId = 'user123';
      var months = 12;
      
      TransactionHistoryService.fetchHistoricalTransactions(userId, months).then(function(transactions) {
        expect(transactions).toBeDefined();
        expect(Array.isArray(transactions)).toBe(true);
        expect(transactions.length).toBeGreaterThan(0);
        done();
      });
      $rootScope.$apply();
    });
    
    it('should generate transactions for requested number of months', function(done) {
      var userId = 'user123';
      var months = 6;
      
      TransactionHistoryService.fetchHistoricalTransactions(userId, months).then(function(transactions) {
        var monthsFound = {};
        transactions.forEach(function(txn) {
          var monthKey = txn.transactionDate.getFullYear() + '-' + (txn.transactionDate.getMonth() + 1);
          monthsFound[monthKey] = true;
        });
        expect(Object.keys(monthsFound).length).toBeGreaterThanOrEqual(months);
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return transactions with complete required fields', function(done) {
      var userId = 'user123';
      var months = 3;
      
      TransactionHistoryService.fetchHistoricalTransactions(userId, months).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.id).toBeDefined();
          expect(txn.userId).toBe(userId);
          expect(txn.cardId).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(typeof txn.amount).toBe('number');
          expect(txn.category).toBeDefined();
          expect(validCategories).toContain(txn.category);
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
      var months = 3;
      
      TransactionHistoryService.fetchHistoricalTransactions(userId, months).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.amount).toBeGreaterThan(0);
        });
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return transactions with valid cardId format', function(done) {
      var userId = 'user123';
      var months = 3;
      
      TransactionHistoryService.fetchHistoricalTransactions(userId, months).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.cardId).toMatch(/^card00[1-3]$/);
        });
        done();
      });
      $rootScope.$apply();
    });
    
    it('should generate variable number of transactions per month', function(done) {
      var userId = 'user123';
      var months = 12;
      
      TransactionHistoryService.fetchHistoricalTransactions(userId, months).then(function(transactions) {
        expect(transactions.length).toBeGreaterThan(months * 20);
        expect(transactions.length).toBeLessThan(months * 70);
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return transactions with dates in past months', function(done) {
      var userId = 'user123';
      var months = 6;
      var now = new Date();
      
      TransactionHistoryService.fetchHistoricalTransactions(userId, months).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.transactionDate.getTime()).toBeLessThanOrEqual(now.getTime());
        });
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return transactions distributed across multiple categories', function(done) {
      var userId = 'user123';
      var months = 3;
      
      TransactionHistoryService.fetchHistoricalTransactions(userId, months).then(function(transactions) {
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
    
    it('should handle single month request', function(done) {
      var userId = 'user123';
      var months = 1;
      
      TransactionHistoryService.fetchHistoricalTransactions(userId, months).then(function(transactions) {
        expect(transactions).toBeDefined();
        expect(transactions.length).toBeGreaterThan(0);
        done();
      });
      $rootScope.$apply();
    });
  });
});