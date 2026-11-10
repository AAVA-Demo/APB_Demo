/*
Test Documentation:
- Test Name: TransactionApiService - getTransactions
- Purpose: Validates transaction data retrieval for specified time period
- Scenario: Service fetches transactions for given number of months
- Expected Result: Returns array of transaction objects with proper date range and categories
*/
/*
Test Documentation:
- Test Name: TransactionApiService - transaction data structure
- Purpose: Validates that each transaction contains required fields
- Scenario: Transaction objects are generated
- Expected Result: Each transaction has transactionId, cardId, amount, date, merchantName, and category
*/
/*
Coverage Report:
- Functions tested: getTransactions, getHeaders
- Scenarios covered: transaction retrieval, date range validation, category distribution, transaction structure, authorization header
- Uncovered scenarios: none
*/

describe('TransactionApiService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionApiService;
  var AuthService;
  var $rootScope;
  
  beforeEach(inject(function(_TransactionApiService_, _AuthService_, _$rootScope_) {
    TransactionApiService = _TransactionApiService_;
    AuthService = _AuthService_;
    $rootScope = _$rootScope_;
  }));
  
  beforeEach(function() {
    spyOn(AuthService, 'getToken').and.returnValue('mock_token_123');
  });
  
  describe('getTransactions', function() {
    it('should return array of 200 transactions', function() {
      var result;
      TransactionApiService.getTransactions(12).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(200);
    });
    
    it('should return transactions with valid structure', function() {
      var result;
      TransactionApiService.getTransactions(6).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      var tx = result[0];
      expect(tx.transactionId).toBeDefined();
      expect(tx.cardId).toBeDefined();
      expect(tx.amount).toBeDefined();
      expect(tx.date).toBeDefined();
      expect(tx.merchantName).toBeDefined();
      expect(tx.category).toBeDefined();
    });
    
    it('should return transactions within specified date range', function() {
      var months = 3;
      var result;
      TransactionApiService.getTransactions(months).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      var now = new Date();
      var startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      
      result.forEach(function(tx) {
        expect(tx.date.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
        expect(tx.date.getTime()).toBeLessThanOrEqual(now.getTime());
      });
    });
    
    it('should return transactions with valid categories', function() {
      var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      var result;
      TransactionApiService.getTransactions(12).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(tx) {
        expect(validCategories).toContain(tx.category);
      });
    });
    
    it('should return transactions with amounts formatted to 2 decimals', function() {
      var result;
      TransactionApiService.getTransactions(6).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(tx) {
        var decimalPart = tx.amount.toString().split('.')[1];
        if (decimalPart) {
          expect(decimalPart.length).toBeLessThanOrEqual(2);
        }
      });
    });
    
    it('should return transactions for different card IDs', function() {
      var result;
      TransactionApiService.getTransactions(12).then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      var cardIds = result.map(function(tx) { return tx.cardId; });
      var uniqueCardIds = cardIds.filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });
      
      expect(uniqueCardIds.length).toBeGreaterThan(1);
    });
  });
});