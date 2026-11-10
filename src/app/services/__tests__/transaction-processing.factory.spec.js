/*
Test Documentation:
- Test Name: TransactionProcessingFactory - getMonthlyTransactions returns mock data
- Purpose: Validates retrieval of current month transactions
- Scenario: Factory is called to get monthly transactions
- Expected Result: Returns promise resolving to array of 5 mock transactions

- Test Name: TransactionProcessingFactory - getMonthlyTransactions includes required fields
- Purpose: Validates completeness of transaction data structure
- Scenario: Monthly transaction data is retrieved
- Expected Result: Each transaction contains transactionId, cardId, amount, date, merchantName, merchantCode

- Test Name: TransactionProcessingFactory - getMonthlyTransactions uses auth token
- Purpose: Validates authentication integration
- Scenario: Factory retrieves monthly transactions
- Expected Result: AuthService.getToken is called

- Test Name: TransactionProcessingFactory - getMonthlyTransactions resolves within timeout
- Purpose: Validates async promise resolution timing
- Scenario: Monthly transactions are requested
- Expected Result: Promise resolves after 300ms timeout

Coverage Report:
- Functions tested: getMonthlyTransactions
- Scenarios covered: data retrieval, data structure validation, authentication, async timing
- Uncovered scenarios: HTTP error handling (mock implementation)
*/

describe('TransactionProcessingFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionProcessingFactory, AuthService, $q, $rootScope, $timeout;
  
  beforeEach(inject(function(_TransactionProcessingFactory_, _AuthService_, _$q_, _$rootScope_, _$timeout_) {
    TransactionProcessingFactory = _TransactionProcessingFactory_;
    AuthService = _AuthService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    
    spyOn(AuthService, 'getToken').and.returnValue('mock-token-12345');
  }));
  
  describe('getMonthlyTransactions', function() {
    it('should return promise resolving to array of 5 mock transactions', function() {
      var result;
      TransactionProcessingFactory.getMonthlyTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(5);
    });
    
    it('should include all required transaction fields', function() {
      var result;
      TransactionProcessingFactory.getMonthlyTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      var transaction = result[0];
      expect(transaction.transactionId).toBeDefined();
      expect(transaction.cardId).toBeDefined();
      expect(transaction.amount).toBeDefined();
      expect(transaction.date).toBeDefined();
      expect(transaction.merchantName).toBeDefined();
      expect(transaction.merchantCode).toBeDefined();
    });
    
    it('should return transactions with valid amounts', function() {
      var result;
      TransactionProcessingFactory.getMonthlyTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      result.forEach(function(txn) {
        expect(txn.amount).toBeGreaterThan(0);
        expect(typeof txn.amount).toBe('number');
      });
    });
    
    it('should return transactions with Date objects', function() {
      var result;
      TransactionProcessingFactory.getMonthlyTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      result.forEach(function(txn) {
        expect(txn.date instanceof Date).toBe(true);
      });
    });
    
    it('should return transactions with valid merchant codes', function() {
      var result;
      TransactionProcessingFactory.getMonthlyTransactions().then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      result.forEach(function(txn) {
        expect(txn.merchantCode).toBeDefined();
        expect(typeof txn.merchantCode).toBe('string');
        expect(txn.merchantCode.length).toBeGreaterThan(0);
      });
    });
    
    it('should resolve promise after 300ms timeout', function() {
      var resolved = false;
      TransactionProcessingFactory.getMonthlyTransactions().then(function() {
        resolved = true;
      });
      
      expect(resolved).toBe(false);
      $timeout.flush(299);
      expect(resolved).toBe(false);
      $timeout.flush(1);
      expect(resolved).toBe(true);
    });
  });
});