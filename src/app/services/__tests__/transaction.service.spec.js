/*
Test Documentation:
- Test Name: TransactionService - getTransactions method
- Purpose: Validates transaction retrieval and categorization integration
- Scenario: Fetch transactions and apply categorization
- Expected Result: Returns promise with categorized transactions
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, TransactionApiService, CategorizationService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _TransactionApiService_, _CategorizationService_, _$q_, _$rootScope_) {
      TransactionService = _TransactionService_;
      TransactionApiService = _TransactionApiService_;
      CategorizationService = _CategorizationService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getTransactions method', function() {
      it('should call TransactionApiService.fetchTransactions', function() {
        spyOn(TransactionApiService, 'fetchTransactions').and.returnValue($q.resolve([]));
        spyOn(CategorizationService, 'categorize').and.returnValue([]);
        TransactionService.getTransactions();
        expect(TransactionApiService.fetchTransactions).toHaveBeenCalled();
      });

      it('should pass cardId to TransactionApiService.fetchTransactions', function() {
        spyOn(TransactionApiService, 'fetchTransactions').and.returnValue($q.resolve([]));
        spyOn(CategorizationService, 'categorize').and.returnValue([]);
        TransactionService.getTransactions('CC001');
        expect(TransactionApiService.fetchTransactions).toHaveBeenCalledWith('CC001');
      });

      it('should call CategorizationService.categorize with fetched transactions', function(done) {
        var mockTransactions = [
          {transactionId: 'T001', category: 'Food & Dining', amount: 1200}
        ];
        spyOn(TransactionApiService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
        spyOn(CategorizationService, 'categorize').and.callThrough();
        TransactionService.getTransactions().then(function() {
          expect(CategorizationService.categorize).toHaveBeenCalledWith(mockTransactions);
          done();
        });
        $rootScope.$apply();
      });

      it('should return a promise', function() {
        spyOn(TransactionApiService, 'fetchTransactions').and.returnValue($q.resolve([]));
        var result = TransactionService.getTransactions();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should resolve with categorized transactions', function(done) {
        var mockTransactions = [
          {transactionId: 'T001', category: 'InvalidCat', amount: 1200}
        ];
        var categorizedTransactions = [
          {transactionId: 'T001', category: 'Miscellaneous', amount: 1200}
        ];
        spyOn(TransactionApiService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
        spyOn(CategorizationService, 'categorize').and.returnValue(categorizedTransactions);
        TransactionService.getTransactions().then(function(transactions) {
          expect(transactions).toEqual(categorizedTransactions);
          expect(transactions[0].category).toBe('Miscellaneous');
          done();
        });
        $rootScope.$apply();
      });

      it('should handle empty transaction array', function(done) {
        spyOn(TransactionApiService, 'fetchTransactions').and.returnValue($q.resolve([]));
        spyOn(CategorizationService, 'categorize').and.callThrough();
        TransactionService.getTransactions().then(function(transactions) {
          expect(transactions.length).toBe(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should handle multiple transactions', function(done) {
        var mockTransactions = [
          {transactionId: 'T001', category: 'Food & Dining', amount: 1200},
          {transactionId: 'T002', category: 'InvalidCat', amount: 800},
          {transactionId: 'T003', category: 'Travel', amount: 3500}
        ];
        spyOn(TransactionApiService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
        spyOn(CategorizationService, 'categorize').and.callThrough();
        TransactionService.getTransactions().then(function(transactions) {
          expect(transactions.length).toBe(3);
          expect(transactions[0].category).toBe('Food & Dining');
          expect(transactions[1].category).toBe('Miscellaneous');
          expect(transactions[2].category).toBe('Travel');
          done();
        });
        $rootScope.$apply();
      });

      it('should propagate errors from TransactionApiService', function(done) {
        spyOn(TransactionApiService, 'fetchTransactions').and.returnValue($q.reject('API Error'));
        TransactionService.getTransactions().catch(function(error) {
          expect(error).toBe('API Error');
          done();
        });
        $rootScope.$apply();
      });

      it('should work with cardId parameter', function(done) {
        var mockTransactions = [
          {transactionId: 'T001', cardId: 'CC001', category: 'Food & Dining', amount: 1200}
        ];
        spyOn(TransactionApiService, 'fetchTransactions').and.returnValue($q.resolve(mockTransactions));
        spyOn(CategorizationService, 'categorize').and.callThrough();
        TransactionService.getTransactions('CC001').then(function(transactions) {
          expect(transactions.length).toBe(1);
          expect(transactions[0].cardId).toBe('CC001');
          done();
        });
        $rootScope.$apply();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered:
  * TransactionApiService.fetchTransactions invocation
  * CardId parameter passing
  * CategorizationService.categorize invocation with correct parameters
  * Promise return validation
  * Categorized transaction results
  * Empty transaction array handling
  * Multiple transactions with mixed categories
  * Error propagation from API service
  * CardId-specific retrieval
- Edge cases: Empty arrays, API errors, invalid categories, multiple transactions
- Uncovered scenarios: None (comprehensive integration testing)
*/