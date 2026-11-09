/*
Test Documentation:
- Test Name: TransactionDataFactory
- Purpose: Validate transaction data factory for fetching transaction records
- Scenario: Fetching transactions, mock data structure validation
- Expected Result: Transaction data returned with correct structure
*/

describe('TransactionDataFactory', function() {
  'use strict';
  
  var TransactionDataFactory, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_TransactionDataFactory_, _$q_, _$rootScope_) {
    TransactionDataFactory = _TransactionDataFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('Factory Definition', function() {
    it('should define TransactionDataFactory', function() {
      expect(TransactionDataFactory).toBeDefined();
    });
    
    it('should have fetchTransactions method', function() {
      expect(TransactionDataFactory.fetchTransactions).toBeDefined();
      expect(typeof TransactionDataFactory.fetchTransactions).toBe('function');
    });
  });
  
  describe('fetchTransactions - Success Scenario', function() {
    it('should return promise', function() {
      var result = TransactionDataFactory.fetchTransactions();
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });
    
    it('should fetch transaction data', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        expect(transactions).toBeDefined();
        expect(Array.isArray(transactions)).toBe(true);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return multiple transactions', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        expect(transactions.length).toBeGreaterThan(0);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return transactions with correct structure', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        transactions.forEach(function(t) {
          expect(t).toHaveProperty('transactionId');
          expect(t).toHaveProperty('cardId');
          expect(t).toHaveProperty('date');
          expect(t).toHaveProperty('merchant');
          expect(t).toHaveProperty('amount');
          expect(t).toHaveProperty('category');
          expect(t).toHaveProperty('description');
          expect(t).toHaveProperty('status');
        });
        done();
      });
      $rootScope.$digest();
    });
  });
  
  describe('Transaction Data Validation', function() {
    it('should have valid transaction IDs', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        transactions.forEach(function(t) {
          expect(t.transactionId).toBeDefined();
          expect(typeof t.transactionId).toBe('string');
          expect(t.transactionId.length).toBeGreaterThan(0);
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should have valid card IDs', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        transactions.forEach(function(t) {
          expect(t.cardId).toBeDefined();
          expect(typeof t.cardId).toBe('string');
          expect(t.cardId).toMatch(/^CC\d+$/);
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should have valid dates', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        transactions.forEach(function(t) {
          expect(t.date).toBeDefined();
          expect(typeof t.date).toBe('string');
          expect(new Date(t.date).toString()).not.toBe('Invalid Date');
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should have valid merchants', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        transactions.forEach(function(t) {
          expect(t.merchant).toBeDefined();
          expect(typeof t.merchant).toBe('string');
          expect(t.merchant.length).toBeGreaterThan(0);
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should have valid amounts', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        transactions.forEach(function(t) {
          expect(t.amount).toBeDefined();
          expect(typeof t.amount).toBe('number');
          expect(t.amount).toBeGreaterThan(0);
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should have valid categories', function(done) {
      var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        transactions.forEach(function(t) {
          expect(t.category).toBeDefined();
          expect(validCategories).toContain(t.category);
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should have completed status', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        transactions.forEach(function(t) {
          expect(t.status).toBe('Completed');
        });
        done();
      });
      $rootScope.$digest();
    });
  });
  
  describe('Transaction Categories Coverage', function() {
    it('should include Food & Dining transactions', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        var foodTransactions = transactions.filter(function(t) { return t.category === 'Food & Dining'; });
        expect(foodTransactions.length).toBeGreaterThan(0);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should include Fuel transactions', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        var fuelTransactions = transactions.filter(function(t) { return t.category === 'Fuel'; });
        expect(fuelTransactions.length).toBeGreaterThan(0);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should include Shopping transactions', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        var shoppingTransactions = transactions.filter(function(t) { return t.category === 'Shopping'; });
        expect(shoppingTransactions.length).toBeGreaterThan(0);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should include Travel transactions', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        var travelTransactions = transactions.filter(function(t) { return t.category === 'Travel'; });
        expect(travelTransactions.length).toBeGreaterThan(0);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should include transactions from multiple cards', function(done) {
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        var cardIds = transactions.map(function(t) { return t.cardId; });
        var uniqueCards = cardIds.filter(function(id, index) { return cardIds.indexOf(id) === index; });
        expect(uniqueCards.length).toBeGreaterThan(1);
        done();
      });
      $rootScope.$digest();
    });
  });
  
  describe('Edge Cases', function() {
    it('should always resolve promise', function(done) {
      TransactionDataFactory.fetchTransactions()
        .then(function() {
          expect(true).toBe(true);
          done();
        })
        .catch(function() {
          fail('Promise should not be rejected');
          done();
        });
      $rootScope.$digest();
    });
    
    it('should return consistent data on multiple calls', function(done) {
      var firstCall, secondCall;
      
      TransactionDataFactory.fetchTransactions().then(function(transactions) {
        firstCall = transactions;
        return TransactionDataFactory.fetchTransactions();
      }).then(function(transactions) {
        secondCall = transactions;
        expect(firstCall.length).toBe(secondCall.length);
        expect(firstCall[0].transactionId).toBe(secondCall[0].transactionId);
        done();
      });
      
      $rootScope.$digest();
    });
  });
});

/*
Coverage Report:
- Functions tested: fetchTransactions
- Scenarios covered: Successful fetch, data structure validation, category coverage, multi-card transactions
- Edge cases: Multiple calls, promise resolution, data consistency
- Uncovered scenarios: None (mock data always succeeds)
*/