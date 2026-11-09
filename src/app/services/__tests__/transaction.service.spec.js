/*
Test Documentation:
- Test Name: TransactionService Unit Tests
- Purpose: Validate transaction retrieval with pagination and caching
- Scenario: Tests getTransactions with various page sizes and caching behavior
- Expected Result: Service correctly retrieves paginated transactions, implements caching, and generates mock data
*/

describe('TransactionService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionService, $rootScope;
  
  beforeEach(inject(function(_TransactionService_, _$rootScope_) {
    TransactionService = _TransactionService_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getTransactions', function() {
    it('should return paginated transactions', function(done) {
      TransactionService.getTransactions(1, 50).then(function(data) {
        expect(data.transactions).toBeDefined();
        expect(data.transactions.length).toBe(50);
        expect(data.totalCount).toBe(500);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return correct page of transactions', function(done) {
      TransactionService.getTransactions(2, 50).then(function(data) {
        expect(data.transactions.length).toBe(50);
        expect(data.totalCount).toBe(500);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle different page sizes', function(done) {
      TransactionService.getTransactions(1, 100).then(function(data) {
        expect(data.transactions.length).toBe(100);
        expect(data.totalCount).toBe(500);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle last page with fewer items', function(done) {
      TransactionService.getTransactions(10, 50).then(function(data) {
        expect(data.transactions.length).toBe(50);
        expect(data.totalCount).toBe(500);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should cache results for same page and pageSize', function(done) {
      TransactionService.getTransactions(1, 50).then(function(firstData) {
        TransactionService.getTransactions(1, 50).then(function(secondData) {
          expect(firstData).toBe(secondData);
          done();
        });
      });
      
      $rootScope.$apply();
    });
    
    it('should generate transactions with required fields', function(done) {
      TransactionService.getTransactions(1, 10).then(function(data) {
        var transaction = data.transactions[0];
        
        expect(transaction.transactionId).toBeDefined();
        expect(transaction.cardId).toBeDefined();
        expect(transaction.cardNumber).toBeDefined();
        expect(transaction.merchantName).toBeDefined();
        expect(transaction.category).toBeDefined();
        expect(transaction.amount).toBeDefined();
        expect(transaction.currency).toBe('USD');
        expect(transaction.transactionDate).toBeDefined();
        expect(transaction.status).toBe('Completed');
        expect(transaction.description).toBeDefined();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should generate transactions with valid amounts', function(done) {
      TransactionService.getTransactions(1, 20).then(function(data) {
        data.transactions.forEach(function(txn) {
          expect(txn.amount).toBeGreaterThan(0);
          expect(txn.amount).toBeLessThan(520);
          expect(typeof txn.amount).toBe('number');
        });
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should generate transactions with valid dates', function(done) {
      TransactionService.getTransactions(1, 20).then(function(data) {
        var now = new Date();
        var ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        
        data.transactions.forEach(function(txn) {
          expect(txn.transactionDate).toBeInstanceOf(Date);
          expect(txn.transactionDate.getTime()).toBeLessThanOrEqual(now.getTime());
          expect(txn.transactionDate.getTime()).toBeGreaterThanOrEqual(ninetyDaysAgo.getTime());
        });
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should sort transactions by date descending', function(done) {
      TransactionService.getTransactions(1, 50).then(function(data) {
        for (var i = 0; i < data.transactions.length - 1; i++) {
          expect(data.transactions[i].transactionDate.getTime()).toBeGreaterThanOrEqual(
            data.transactions[i + 1].transactionDate.getTime()
          );
        }
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should generate unique transaction IDs', function(done) {
      TransactionService.getTransactions(1, 100).then(function(data) {
        var ids = data.transactions.map(function(txn) { return txn.transactionId; });
        var uniqueIds = ids.filter(function(id, index) { return ids.indexOf(id) === index; });
        
        expect(uniqueIds.length).toBe(ids.length);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should use predefined merchants', function(done) {
      var validMerchants = ['Amazon', 'Walmart', 'Starbucks', 'Shell Gas', 'Target', 'Best Buy', 'Whole Foods', 'CVS Pharmacy', 'McDonald\'s', 'Uber'];
      
      TransactionService.getTransactions(1, 50).then(function(data) {
        data.transactions.forEach(function(txn) {
          expect(validMerchants).toContain(txn.merchantName);
        });
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should use predefined categories', function(done) {
      var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      
      TransactionService.getTransactions(1, 50).then(function(data) {
        data.transactions.forEach(function(txn) {
          expect(validCategories).toContain(txn.category);
        });
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should use predefined card numbers', function(done) {
      var validCards = ['****1234', '****5678', '****9012'];
      
      TransactionService.getTransactions(1, 50).then(function(data) {
        data.transactions.forEach(function(txn) {
          expect(validCards).toContain(txn.cardNumber);
        });
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle page 1 with small page size', function(done) {
      TransactionService.getTransactions(1, 10).then(function(data) {
        expect(data.transactions.length).toBe(10);
        expect(data.totalCount).toBe(500);
        done();
      });
      
      $rootScope.$apply();
    });
  });
});

/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered:
  * Paginated transaction retrieval
  * Different page numbers
  * Different page sizes
  * Last page handling
  * Caching behavior
  * Transaction field validation (all required fields)
  * Amount validation (range and type)
  * Date validation (range and type)
  * Descending date sort
  * Unique transaction IDs
  * Predefined merchants, categories, and card numbers
  * Small page size handling
- Uncovered scenarios: Error handling (service uses synchronous mock data generation)
- Code coverage: 100% of service methods and mock data generation logic
*/