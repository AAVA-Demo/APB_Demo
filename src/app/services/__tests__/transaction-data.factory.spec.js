/*
Test Documentation:
- Test Name: TransactionDataFactory - getTransactions returns mock data
- Purpose: Validates retrieval of transaction history for specified months
- Scenario: Factory is called with months parameter
- Expected Result: Returns promise resolving to array of 120 mock transactions

- Test Name: TransactionDataFactory - getTransactions includes required fields
- Purpose: Validates completeness of transaction data structure
- Scenario: Transaction data is retrieved
- Expected Result: Each transaction contains id, date, amount, merchantName, merchantCode, cardId

- Test Name: TransactionDataFactory - getTransactions generates dates within range
- Purpose: Validates date range generation based on months parameter
- Scenario: Transactions are generated for specified months
- Expected Result: All transaction dates fall within the specified month range

- Test Name: TransactionDataFactory - getTransactions assigns valid merchant codes
- Purpose: Validates merchant code assignment from predefined categories
- Scenario: Transactions are generated
- Expected Result: All merchant codes are from the predefined category list

Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: data retrieval, data structure, date range validation, merchant code assignment, async promise handling
- Uncovered scenarios: HTTP error handling (mock implementation)
*/

describe('TransactionDataFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionDataFactory, $q, $rootScope, $timeout;
  
  beforeEach(inject(function(_TransactionDataFactory_, _$q_, _$rootScope_, _$timeout_) {
    TransactionDataFactory = _TransactionDataFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));
  
  describe('getTransactions', function() {
    it('should return promise resolving to array of 120 mock transactions', function() {
      var result;
      TransactionDataFactory.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(120);
    });
    
    it('should include all required transaction fields', function() {
      var result;
      TransactionDataFactory.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      var transaction = result[0];
      expect(transaction.id).toBeDefined();
      expect(transaction.date).toBeDefined();
      expect(transaction.amount).toBeDefined();
      expect(transaction.merchantName).toBeDefined();
      expect(transaction.merchantCode).toBeDefined();
      expect(transaction.cardId).toBeDefined();
    });
    
    it('should generate dates within specified month range', function() {
      var months = 12;
      var result;
      TransactionDataFactory.getTransactions(months).then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      var startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      var endDate = new Date();
      
      result.forEach(function(txn) {
        expect(txn.date instanceof Date).toBe(true);
        expect(txn.date.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
        expect(txn.date.getTime()).toBeLessThanOrEqual(endDate.getTime());
      });
    });
    
    it('should assign valid merchant codes from predefined categories', function() {
      var validCodes = ['5812', '5541', '5311', '5411', '3000', '7832', '4900', '8011', '8220', '9999'];
      var result;
      TransactionDataFactory.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      result.forEach(function(txn) {
        expect(validCodes).toContain(txn.merchantCode);
      });
    });
    
    it('should generate amounts between 10 and 510', function() {
      var result;
      TransactionDataFactory.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      result.forEach(function(txn) {
        expect(txn.amount).toBeGreaterThanOrEqual(10);
        expect(txn.amount).toBeLessThanOrEqual(510);
      });
    });
    
    it('should assign card IDs from card-001 to card-005', function() {
      var validCardIds = ['card-001', 'card-002', 'card-003', 'card-004', 'card-005'];
      var result;
      TransactionDataFactory.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      result.forEach(function(txn) {
        expect(validCardIds).toContain(txn.cardId);
      });
    });
    
    it('should generate unique transaction IDs', function() {
      var result;
      TransactionDataFactory.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $timeout.flush();
      
      var ids = result.map(function(txn) { return txn.id; });
      var uniqueIds = ids.filter(function(id, index, self) { return self.indexOf(id) === index; });
      expect(uniqueIds.length).toBe(result.length);
    });
  });
});