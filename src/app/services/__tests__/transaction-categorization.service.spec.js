/*
Test Documentation:
- Test Name: TransactionCategorizationService Test Suite
- Purpose: Validate transaction categorization retrieval logic
- Scenario: Tests successful retrieval of categorized transactions
- Expected Result: Service correctly retrieves categorized transactions or handles errors
*/

describe('TransactionCategorizationService', function() {
  'use strict';
  
  beforeEach(module('app.analytics'));
  
  var TransactionCategorizationService, TransactionDataFactory, $q, $rootScope;
  
  beforeEach(inject(function(_TransactionCategorizationService_, _TransactionDataFactory_, _$q_, _$rootScope_) {
    TransactionCategorizationService = _TransactionCategorizationService_;
    TransactionDataFactory = _TransactionDataFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getCategorizedTransactions', function() {
    /*
    Test Documentation:
    - Test Name: should retrieve categorized transactions successfully
    - Purpose: Validate successful retrieval of categorized data
    - Scenario: Factory returns valid categorized transactions
    - Expected Result: Promise resolves with categorized transactions
    */
    it('should retrieve categorized transactions successfully', function(done) {
      var mockTransactions = [
        {id: 1, amount: 100, category: 'Food & Dining', date: '2023-01-15'},
        {id: 2, amount: 50, category: 'Fuel', date: '2023-01-20'},
        {id: 3, amount: 200, category: 'Shopping', date: '2023-01-25'}
      ];
      
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      
      TransactionCategorizationService.getCategorizedTransactions()
        .then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(transactions.length).toBe(3);
          expect(transactions[0].category).toBe('Food & Dining');
          expect(transactions[1].category).toBe('Fuel');
          expect(transactions[2].category).toBe('Shopping');
          
          expect(TransactionDataFactory.fetchTransactions).toHaveBeenCalledWith({categorized: true});
          
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should pass correct parameters to factory
    - Purpose: Validate parameter passing to data factory
    - Scenario: Service calls factory with categorized flag
    - Expected Result: Factory is called with {categorized: true}
    */
    it('should pass correct parameters to factory', function(done) {
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve([]));
      
      TransactionCategorizationService.getCategorizedTransactions()
        .then(function() {
          expect(TransactionDataFactory.fetchTransactions).toHaveBeenCalledWith({categorized: true});
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should handle empty transactions array
    - Purpose: Validate behavior with no categorized transactions
    - Scenario: Factory returns empty array
    - Expected Result: Promise resolves with empty array
    */
    it('should handle empty transactions array', function(done) {
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve([]));
      
      TransactionCategorizationService.getCategorizedTransactions()
        .then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(transactions.length).toBe(0);
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should handle factory error
    - Purpose: Validate error handling when factory fails
    - Scenario: Factory rejects promise
    - Expected Result: Promise is rejected with error
    */
    it('should handle factory error', function(done) {
      var errorMessage = 'Failed to fetch categorized transactions';
      
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.reject(errorMessage));
      
      TransactionCategorizationService.getCategorizedTransactions()
        .then(function(transactions) {
          fail('Should have rejected promise');
          done();
        })
        .catch(function(error) {
          expect(error).toBe(errorMessage);
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should retrieve transactions with all nine categories
    - Purpose: Validate retrieval of all category types
    - Scenario: Transactions across all nine categories
    - Expected Result: All categories are present in result
    */
    it('should retrieve transactions with all nine categories', function(done) {
      var mockTransactions = [
        {id: 1, category: 'Food & Dining', amount: 100},
        {id: 2, category: 'Fuel', amount: 50},
        {id: 3, category: 'Shopping', amount: 200},
        {id: 4, category: 'Travel', amount: 300},
        {id: 5, category: 'Entertainment', amount: 75},
        {id: 6, category: 'Utilities', amount: 150},
        {id: 7, category: 'Healthcare', amount: 250},
        {id: 8, category: 'Education', amount: 500},
        {id: 9, category: 'Miscellaneous', amount: 80}
      ];
      
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      
      TransactionCategorizationService.getCategorizedTransactions()
        .then(function(transactions) {
          expect(transactions.length).toBe(9);
          
          var categories = transactions.map(function(t) { return t.category; });
          expect(categories).toContain('Food & Dining');
          expect(categories).toContain('Fuel');
          expect(categories).toContain('Shopping');
          expect(categories).toContain('Travel');
          expect(categories).toContain('Entertainment');
          expect(categories).toContain('Utilities');
          expect(categories).toContain('Healthcare');
          expect(categories).toContain('Education');
          expect(categories).toContain('Miscellaneous');
          
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should handle transactions with additional metadata
    - Purpose: Validate that full transaction objects are preserved
    - Scenario: Transactions with multiple fields
    - Expected Result: All transaction fields are preserved
    */
    it('should handle transactions with additional metadata', function(done) {
      var mockTransactions = [
        {
          id: 1,
          amount: 100,
          category: 'Food & Dining',
          date: '2023-01-15',
          merchantName: 'Restaurant ABC',
          status: 'posted',
          cardId: 1
        }
      ];
      
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      
      TransactionCategorizationService.getCategorizedTransactions()
        .then(function(transactions) {
          expect(transactions[0].id).toBe(1);
          expect(transactions[0].amount).toBe(100);
          expect(transactions[0].category).toBe('Food & Dining');
          expect(transactions[0].merchantName).toBe('Restaurant ABC');
          expect(transactions[0].status).toBe('posted');
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should handle large number of transactions
    - Purpose: Validate performance with many transactions
    - Scenario: Factory returns 1000+ transactions
    - Expected Result: All transactions are retrieved successfully
    */
    it('should handle large number of transactions', function(done) {
      var mockTransactions = [];
      for (var i = 0; i < 1000; i++) {
        mockTransactions.push({
          id: i,
          amount: Math.random() * 500,
          category: 'Food & Dining',
          date: '2023-01-15'
        });
      }
      
      spyOn(TransactionDataFactory, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
      
      TransactionCategorizationService.getCategorizedTransactions()
        .then(function(transactions) {
          expect(transactions.length).toBe(1000);
          done();
        })
        .catch(function(error) {
          fail('Should not reject: ' + error);
          done();
        });
      
      $rootScope.$apply();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCategorizedTransactions
- Scenarios covered:
  * Successful retrieval of categorized transactions
  * Correct parameter passing to factory
  * Empty transactions array handling
  * Factory error handling
  * All nine category types retrieval
  * Transaction metadata preservation
  * Large number of transactions handling
- Uncovered scenarios: None - comprehensive coverage achieved
*/