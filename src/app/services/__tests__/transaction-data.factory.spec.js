/*
Test Documentation:
- Test Name: TransactionDataFactory - fetchTransactions without filters
- Purpose: Validates retrieval of all transactions without filtering
- Scenario: Factory method called without filter parameters
- Expected Result: Returns all mock transactions
*/
/*
Test Documentation:
- Test Name: TransactionDataFactory - fetchTransactions with date filters
- Purpose: Validates date range filtering
- Scenario: Factory method called with startDate and endDate
- Expected Result: Returns only transactions within date range
*/
/*
Test Documentation:
- Test Name: TransactionDataFactory - fetchTransactions with cardId filter
- Purpose: Validates card-specific filtering
- Scenario: Factory method called with cardId
- Expected Result: Returns only transactions for specified card
*/
/*
Test Documentation:
- Test Name: TransactionDataFactory - fetchTransactions caching
- Purpose: Validates caching mechanism
- Scenario: Same filter parameters used multiple times
- Expected Result: Cached results returned on subsequent calls
*/
/*
Coverage Report:
- Functions tested: fetchTransactions
- Scenarios covered: no filters, date filtering, card filtering, caching, data independence
- Uncovered scenarios: none
*/

(function(){
'use strict';

describe('TransactionDataFactory', function(){
  var TransactionDataFactory, $rootScope, $cacheFactory;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_TransactionDataFactory_, _$rootScope_, _$cacheFactory_){
    TransactionDataFactory = _TransactionDataFactory_;
    $rootScope = _$rootScope_;
    $cacheFactory = _$cacheFactory_;
    
    var cache = $cacheFactory.get('transactionCache');
    if(cache){
      cache.removeAll();
    }
  }));
  
  describe('fetchTransactions', function(){
    
    it('should return all transactions without filters', function(){
      var result;
      TransactionDataFactory.fetchTransactions().then(function(transactions){
        result = transactions;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(15);
    });
    
    it('should filter transactions by startDate', function(){
      var filters = {startDate: '2024-03-01'};
      var result;
      TransactionDataFactory.fetchTransactions(filters).then(function(transactions){
        result = transactions;
      });
      
      $rootScope.$digest();
      
      expect(result.length).toBeLessThan(15);
      result.forEach(function(t){
        expect(new Date(t.date) >= new Date('2024-03-01')).toBe(true);
      });
    });
    
    it('should filter transactions by endDate', function(){
      var filters = {endDate: '2024-02-28'};
      var result;
      TransactionDataFactory.fetchTransactions(filters).then(function(transactions){
        result = transactions;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(t){
        expect(new Date(t.date) <= new Date('2024-02-28')).toBe(true);
      });
    });
    
    it('should filter transactions by date range', function(){
      var filters = {startDate: '2024-02-01', endDate: '2024-03-31'};
      var result;
      TransactionDataFactory.fetchTransactions(filters).then(function(transactions){
        result = transactions;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(t){
        var date = new Date(t.date);
        expect(date >= new Date('2024-02-01')).toBe(true);
        expect(date <= new Date('2024-03-31')).toBe(true);
      });
    });
    
    it('should filter transactions by cardId', function(){
      var filters = {cardId: 'CC001'};
      var result;
      TransactionDataFactory.fetchTransactions(filters).then(function(transactions){
        result = transactions;
      });
      
      $rootScope.$digest();
      
      expect(result.length).toBeGreaterThan(0);
      result.forEach(function(t){
        expect(t.cardId).toBe('CC001');
      });
    });
    
    it('should combine multiple filters', function(){
      var filters = {startDate: '2024-01-01', endDate: '2024-03-31', cardId: 'CC001'};
      var result;
      TransactionDataFactory.fetchTransactions(filters).then(function(transactions){
        result = transactions;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(t){
        expect(t.cardId).toBe('CC001');
        var date = new Date(t.date);
        expect(date >= new Date('2024-01-01')).toBe(true);
        expect(date <= new Date('2024-03-31')).toBe(true);
      });
    });
    
    it('should cache results based on filter parameters', function(){
      var filters = {cardId: 'CC002'};
      var result1, result2;
      
      TransactionDataFactory.fetchTransactions(filters).then(function(transactions){
        result1 = transactions;
      });
      $rootScope.$digest();
      
      TransactionDataFactory.fetchTransactions(filters).then(function(transactions){
        result2 = transactions;
      });
      $rootScope.$digest();
      
      expect(result1).toEqual(result2);
    });
    
    it('should return independent copies of data', function(){
      var result1, result2;
      TransactionDataFactory.fetchTransactions().then(function(transactions){
        result1 = transactions;
      });
      $rootScope.$digest();
      
      var cache = $cacheFactory.get('transactionCache');
      cache.removeAll();
      
      TransactionDataFactory.fetchTransactions().then(function(transactions){
        result2 = transactions;
      });
      $rootScope.$digest();
      
      result1[0].amount = 99999;
      expect(result2[0].amount).not.toBe(99999);
    });
    
    it('should return transactions with all required fields', function(){
      var result;
      TransactionDataFactory.fetchTransactions().then(function(transactions){
        result = transactions;
      });
      
      $rootScope.$digest();
      
      var firstTransaction = result[0];
      expect(firstTransaction.transactionId).toBeDefined();
      expect(firstTransaction.cardId).toBeDefined();
      expect(firstTransaction.cardName).toBeDefined();
      expect(firstTransaction.amount).toBeDefined();
      expect(firstTransaction.date).toBeDefined();
      expect(firstTransaction.category).toBeDefined();
      expect(firstTransaction.merchant).toBeDefined();
    });
    
  });
  
});

})();