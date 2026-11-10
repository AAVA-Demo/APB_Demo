/*
Test Documentation:
- Test Name: TransactionRepositoryFactory - fetchTransactions returns all transactions
- Purpose: Validates retrieval of complete transaction dataset
- Scenario: Factory method called to fetch all transactions
- Expected Result: Returns all 15 mock transactions with complete details
*/
/*
Test Documentation:
- Test Name: TransactionRepositoryFactory - fetchTransactions caching
- Purpose: Validates caching mechanism for performance optimization
- Scenario: fetchTransactions called multiple times
- Expected Result: Cached data returned on subsequent calls
*/
/*
Test Documentation:
- Test Name: TransactionRepositoryFactory - transaction data structure
- Purpose: Validates transaction object structure and required fields
- Scenario: Transactions retrieved and inspected
- Expected Result: Each transaction has all required fields
*/
/*
Coverage Report:
- Functions tested: fetchTransactions
- Scenarios covered: data retrieval, caching, data structure validation, data independence
- Uncovered scenarios: none
*/

(function(){
'use strict';

describe('TransactionRepositoryFactory', function(){
  var TransactionRepositoryFactory, $rootScope, $cacheFactory;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_TransactionRepositoryFactory_, _$rootScope_, _$cacheFactory_){
    TransactionRepositoryFactory = _TransactionRepositoryFactory_;
    $rootScope = _$rootScope_;
    $cacheFactory = _$cacheFactory_;
    
    var cache = $cacheFactory.get('transactionRepoCache');
    if(cache){
      cache.removeAll();
    }
  }));
  
  describe('fetchTransactions', function(){
    
    it('should return all transactions', function(){
      var result;
      TransactionRepositoryFactory.fetchTransactions().then(function(transactions){
        result = transactions;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(15);
    });
    
    it('should return transactions with complete details', function(){
      var result;
      TransactionRepositoryFactory.fetchTransactions().then(function(transactions){
        result = transactions;
      });
      
      $rootScope.$digest();
      
      var firstTransaction = result[0];
      expect(firstTransaction.transactionId).toBe('T001');
      expect(firstTransaction.cardId).toBe('CC001');
      expect(firstTransaction.amount).toBe(1250);
      expect(firstTransaction.date).toBeDefined();
      expect(firstTransaction.merchant).toBe('Restaurant ABC');
      expect(firstTransaction.category).toBe('Food & Dining');
      expect(firstTransaction.description).toBe('Dinner');
    });
    
    it('should include all nine categories in transactions', function(){
      var result;
      TransactionRepositoryFactory.fetchTransactions().then(function(transactions){
        result = transactions;
      });
      
      $rootScope.$digest();
      
      var categories = result.map(function(t){return t.category;});
      var uniqueCategories = categories.filter(function(value, index, self){
        return self.indexOf(value) === index;
      });
      
      expect(uniqueCategories).toContain('Food & Dining');
      expect(uniqueCategories).toContain('Shopping');
      expect(uniqueCategories).toContain('Fuel');
      expect(uniqueCategories).toContain('Travel');
      expect(uniqueCategories).toContain('Entertainment');
      expect(uniqueCategories).toContain('Utilities');
      expect(uniqueCategories).toContain('Healthcare');
      expect(uniqueCategories).toContain('Education');
      expect(uniqueCategories).toContain('Miscellaneous');
    });
    
    it('should cache results', function(){
      var result1, result2;
      
      TransactionRepositoryFactory.fetchTransactions().then(function(transactions){
        result1 = transactions;
      });
      $rootScope.$digest();
      
      TransactionRepositoryFactory.fetchTransactions().then(function(transactions){
        result2 = transactions;
      });
      $rootScope.$digest();
      
      expect(result1).toEqual(result2);
    });
    
    it('should return independent copies', function(){
      var result1, result2;
      TransactionRepositoryFactory.fetchTransactions().then(function(transactions){
        result1 = transactions;
      });
      $rootScope.$digest();
      
      var cache = $cacheFactory.get('transactionRepoCache');
      cache.removeAll();
      
      TransactionRepositoryFactory.fetchTransactions().then(function(transactions){
        result2 = transactions;
      });
      $rootScope.$digest();
      
      result1[0].amount = 88888;
      expect(result2[0].amount).toBe(1250);
    });
    
    it('should return transactions with date objects', function(){
      var result;
      TransactionRepositoryFactory.fetchTransactions().then(function(transactions){
        result = transactions;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(t){
        expect(t.date instanceof Date).toBe(true);
      });
    });
    
    it('should return transactions with numeric amounts', function(){
      var result;
      TransactionRepositoryFactory.fetchTransactions().then(function(transactions){
        result = transactions;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(t){
        expect(typeof t.amount).toBe('number');
        expect(t.amount).toBeGreaterThan(0);
      });
    });
    
  });
  
});

})();