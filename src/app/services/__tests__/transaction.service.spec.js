/*
Test Documentation:
- Test Name: transaction.service - getAllTransactions, getCurrentMonthTransactions, getCategorizedTransactions, getTransactionById, getMonthlyTransactions
- Purpose: Validate transaction retrieval with mock data generation and filtering
- Scenario: Service provides mock transaction data with various filtering options
- Expected Result: Returns transactions matching filter criteria
*/

describe('TransactionService (transaction.service.js)', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionService;
  var $timeout;
  var $rootScope;
  
  beforeEach(inject(function(_TransactionService_, _$timeout_, _$rootScope_) {
    TransactionService = _TransactionService_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getAllTransactions', function() {
    it('should return all mock transactions', function(done) {
      TransactionService.getAllTransactions().then(function(transactions) {
        expect(transactions).toBeDefined();
        expect(transactions.length).toBeGreaterThan(0);
        expect(transactions[0].transactionId).toBeDefined();
        expect(transactions[0].cardId).toBeDefined();
        expect(transactions[0].amount).toBeDefined();
        expect(transactions[0].category).toBeDefined();
        done();
      });
      
      $timeout.flush();
    });
    
    it('should include all required transaction properties', function(done) {
      TransactionService.getAllTransactions().then(function(transactions) {
        var tx = transactions[0];
        expect(tx.transactionId).toBeDefined();
        expect(tx.cardId).toBeDefined();
        expect(tx.cardNumber).toBeDefined();
        expect(tx.date).toBeDefined();
        expect(tx.merchant).toBeDefined();
        expect(tx.amount).toBeDefined();
        expect(tx.category).toBeDefined();
        expect(tx.status).toBeDefined();
        expect(tx.description).toBeDefined();
        done();
      });
      
      $timeout.flush();
    });
  });
  
  describe('getCurrentMonthTransactions', function() {
    it('should return only current month transactions', function(done) {
      var now = new Date();
      var currentMonth = now.getMonth();
      var currentYear = now.getFullYear();
      
      TransactionService.getCurrentMonthTransactions().then(function(transactions) {
        expect(transactions).toBeDefined();
        transactions.forEach(function(tx) {
          var txDate = new Date(tx.date);
          expect(txDate.getMonth()).toBe(currentMonth);
          expect(txDate.getFullYear()).toBe(currentYear);
        });
        done();
      });
      
      $timeout.flush();
    });
  });
  
  describe('getCategorizedTransactions', function() {
    it('should return all transactions when no date range provided', function(done) {
      TransactionService.getCategorizedTransactions().then(function(transactions) {
        expect(transactions).toBeDefined();
        expect(transactions.length).toBeGreaterThan(0);
        done();
      });
      
      $timeout.flush();
    });
    
    it('should filter transactions by date range', function(done) {
      var startDate = new Date('2023-01-01');
      var endDate = new Date('2023-03-31');
      
      TransactionService.getCategorizedTransactions(startDate, endDate).then(function(transactions) {
        expect(transactions).toBeDefined();
        transactions.forEach(function(tx) {
          var txDate = new Date(tx.date);
          expect(txDate >= startDate).toBe(true);
          expect(txDate <= endDate).toBe(true);
        });
        done();
      });
      
      $timeout.flush();
    });
  });
  
  describe('getTransactionById', function() {
    it('should return a specific transaction by ID', function(done) {
      TransactionService.getAllTransactions().then(function(allTx) {
        var txId = allTx[0].transactionId;
        
        return TransactionService.getTransactionById(txId);
      }).then(function(transaction) {
        expect(transaction).toBeDefined();
        expect(transaction.transactionId).toBeDefined();
        done();
      });
      
      $timeout.flush();
    });
    
    it('should reject for non-existent transaction ID', function(done) {
      TransactionService.getTransactionById('INVALID_TX').catch(function(error) {
        expect(error).toBe('Transaction not found');
        done();
      });
      
      $timeout.flush();
    });
  });
  
  describe('getMonthlyTransactions', function() {
    it('should delegate to getCurrentMonthTransactions', function(done) {
      spyOn(TransactionService, 'getCurrentMonthTransactions').and.callThrough();
      
      TransactionService.getMonthlyTransactions().then(function() {
        expect(TransactionService.getCurrentMonthTransactions).toHaveBeenCalled();
        done();
      });
      
      $timeout.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getAllTransactions, getCurrentMonthTransactions, getCategorizedTransactions, getTransactionById, getMonthlyTransactions
- Scenarios covered:
  * Retrieve all transactions
  * Transaction property validation
  * Current month filtering
  * Date range filtering
  * Transaction by ID retrieval
  * Invalid transaction ID
  * Method delegation
- Uncovered scenarios: None
- Edge cases: Invalid IDs, date filtering, method delegation
*/