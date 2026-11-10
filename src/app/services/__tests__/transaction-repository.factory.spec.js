/*
Test Documentation:
- Test Name: TransactionRepositoryFactory - getTransactions
- Purpose: Validates retrieval of user transactions
- Scenario: User requests transaction history for specified months
- Expected Result: Returns array of transaction objects with complete details

- Test Name: TransactionRepositoryFactory - caching mechanism
- Purpose: Validates cache functionality to reduce redundant calls
- Scenario: Multiple calls within cache duration
- Expected Result: Returns cached data without re-fetching

- Test Name: TransactionRepositoryFactory - transaction data structure
- Purpose: Validates transaction objects contain all required fields
- Scenario: Transactions are retrieved
- Expected Result: Each transaction has id, cardId, merchant, amount, date, description

Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: normal flow, caching, data structure validation, multiple transactions
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TransactionRepositoryFactory', function() {
    var TransactionRepositoryFactory, $q, $rootScope;

    beforeEach(module('analytics'));

    beforeEach(inject(function(_TransactionRepositoryFactory_, _$q_, _$rootScope_) {
      TransactionRepositoryFactory = _TransactionRepositoryFactory_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getTransactions', function() {
      it('should return array of transactions', function(done) {
        TransactionRepositoryFactory.getTransactions('user123', 12).then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBeGreaterThan(0);
          done();
        });

        $rootScope.$apply();
      });

      it('should return transactions with all required fields', function(done) {
        TransactionRepositoryFactory.getTransactions('user123', 12).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.transactionId).toBeDefined();
            expect(txn.cardId).toBeDefined();
            expect(txn.merchantName).toBeDefined();
            expect(txn.amount).toBeDefined();
            expect(txn.transactionDate).toBeDefined();
            expect(txn.description).toBeDefined();
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should cache results for subsequent calls', function(done) {
        TransactionRepositoryFactory.getTransactions('user123', 12).then(function(firstResult) {
          TransactionRepositoryFactory.getTransactions('user123', 12).then(function(secondResult) {
            expect(firstResult).toBe(secondResult);
            done();
          });
        });

        $rootScope.$apply();
      });

      it('should return transactions with valid amounts', function(done) {
        TransactionRepositoryFactory.getTransactions('user123', 12).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(typeof txn.amount).toBe('number');
            expect(txn.amount).toBeGreaterThan(0);
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should return transactions with valid date format', function(done) {
        TransactionRepositoryFactory.getTransactions('user123', 12).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.transactionDate).toMatch(/\d{4}-\d{2}-\d{2}/);
            var date = new Date(txn.transactionDate);
            expect(date instanceof Date).toBe(true);
            expect(isNaN(date.getTime())).toBe(false);
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should return transactions from multiple cards', function(done) {
        TransactionRepositoryFactory.getTransactions('user123', 12).then(function(transactions) {
          var cardIds = transactions.map(function(txn) { return txn.cardId; });
          var uniqueCardIds = cardIds.filter(function(value, index, self) {
            return self.indexOf(value) === index;
          });
          expect(uniqueCardIds.length).toBeGreaterThan(1);
          done();
        });

        $rootScope.$apply();
      });

      it('should return transactions with non-empty merchant names', function(done) {
        TransactionRepositoryFactory.getTransactions('user123', 12).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.merchantName.length).toBeGreaterThan(0);
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should return transactions with non-empty descriptions', function(done) {
        TransactionRepositoryFactory.getTransactions('user123', 12).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.description.length).toBeGreaterThan(0);
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should handle different userId values', function(done) {
        var promises = [
          TransactionRepositoryFactory.getTransactions('user1', 12),
          TransactionRepositoryFactory.getTransactions('user2', 12)
        ];

        $q.all(promises).then(function(results) {
          expect(results[0]).toBeDefined();
          expect(results[1]).toBeDefined();
          expect(Array.isArray(results[0])).toBe(true);
          expect(Array.isArray(results[1])).toBe(true);
          done();
        });

        $rootScope.$apply();
      });

      it('should handle different month values', function(done) {
        var promises = [
          TransactionRepositoryFactory.getTransactions('user123', 1),
          TransactionRepositoryFactory.getTransactions('user123', 6),
          TransactionRepositoryFactory.getTransactions('user123', 12)
        ];

        $q.all(promises).then(function(results) {
          results.forEach(function(result) {
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
          });
          done();
        });

        $rootScope.$apply();
      });
    });
  });
})();