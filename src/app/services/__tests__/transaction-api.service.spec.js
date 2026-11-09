/*
Test Documentation:
- Test Name: TransactionApiService - fetchTransactions method
- Purpose: Validates transaction data retrieval with optional card filtering
- Scenario: Fetch all transactions or filter by cardId
- Expected Result: Returns promise with transaction array, filtered if cardId provided
*/

(function() {
  'use strict';

  describe('TransactionApiService', function() {
    var TransactionApiService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionApiService_, _$q_, _$rootScope_) {
      TransactionApiService = _TransactionApiService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('fetchTransactions method', function() {
      it('should return a promise', function() {
        var result = TransactionApiService.fetchTransactions();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should return all transactions when no cardId provided', function(done) {
        TransactionApiService.fetchTransactions().then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(10);
          done();
        });
        $rootScope.$apply();
      });

      it('should filter transactions by cardId', function(done) {
        TransactionApiService.fetchTransactions('CC001').then(function(transactions) {
          expect(transactions.length).toBeGreaterThan(0);
          transactions.forEach(function(txn) {
            expect(txn.cardId).toBe('CC001');
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should return transactions with correct structure', function(done) {
        TransactionApiService.fetchTransactions().then(function(transactions) {
          var txn = transactions[0];
          expect(txn.transactionId).toBeDefined();
          expect(txn.cardId).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.description).toBeDefined();
          expect(txn.timestamp).toBeDefined();
          expect(txn.merchantName).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should return transactions for CC001', function(done) {
        TransactionApiService.fetchTransactions('CC001').then(function(transactions) {
          expect(transactions.length).toBe(4);
          done();
        });
        $rootScope.$apply();
      });

      it('should return transactions for CC002', function(done) {
        TransactionApiService.fetchTransactions('CC002').then(function(transactions) {
          expect(transactions.length).toBe(3);
          done();
        });
        $rootScope.$apply();
      });

      it('should return transactions for CC003', function(done) {
        TransactionApiService.fetchTransactions('CC003').then(function(transactions) {
          expect(transactions.length).toBe(3);
          done();
        });
        $rootScope.$apply();
      });

      it('should return empty array for non-existent cardId', function(done) {
        TransactionApiService.fetchTransactions('CC999').then(function(transactions) {
          expect(transactions.length).toBe(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should have valid categories', function(done) {
        var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        TransactionApiService.fetchTransactions().then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(validCategories.indexOf(txn.category)).toBeGreaterThan(-1);
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should have numeric amounts', function(done) {
        TransactionApiService.fetchTransactions().then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(typeof txn.amount).toBe('number');
            expect(txn.amount).toBeGreaterThan(0);
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should have valid timestamp dates', function(done) {
        TransactionApiService.fetchTransactions().then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.timestamp instanceof Date).toBe(true);
          });
          done();
        });
        $rootScope.$apply();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: fetchTransactions
- Scenarios covered:
  * Promise return validation
  * All transactions retrieval (no filter)
  * Card-specific filtering (CC001, CC002, CC003)
  * Transaction data structure validation
  * Non-existent cardId handling
  * Category validation
  * Amount data type and positivity
  * Timestamp date validation
- Edge cases: Empty results, invalid cardId, all valid categories
- Uncovered scenarios: None (comprehensive coverage for mock data service)
*/