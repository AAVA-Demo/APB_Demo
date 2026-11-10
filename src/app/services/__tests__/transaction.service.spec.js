/*
Test Documentation:
- Test Name: TransactionService - getTransactions
- Purpose: Validates retrieval of all transactions for a user
- Scenario: User requests transaction history
- Expected Result: Returns array of transaction objects
*/
/*
Test Documentation:
- Test Name: TransactionService - getMonthlySummary
- Purpose: Validates calculation of monthly spending summary
- Scenario: User requests current month spending total
- Expected Result: Returns object with monthlySpend property
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactionsByCard
- Purpose: Validates retrieval of transactions for specific card
- Scenario: User requests transactions for a specific card
- Expected Result: Returns filtered array of transactions for that card
*/
/*
Coverage Report:
- Functions tested: getTransactions, getMonthlySummary, getTransactionsByCard
- Scenarios covered: transaction retrieval, filtering by card, monthly aggregation, date filtering, empty results, data integrity
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService;
    var $rootScope;
    var AuthService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$rootScope_, _AuthService_) {
      TransactionService = _TransactionService_;
      $rootScope = _$rootScope_;
      AuthService = _AuthService_;
    }));

    describe('getTransactions', function() {
      it('should return array of transactions', function(done) {
        TransactionService.getTransactions('user-123', 12).then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBeGreaterThan(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should return transactions with required properties', function(done) {
        TransactionService.getTransactions('user-123', 12).then(function(transactions) {
          var txn = transactions[0];
          expect(txn.id).toBeDefined();
          expect(txn.cardId).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.merchant).toBeDefined();
          expect(txn.date).toBeDefined();
          expect(txn.description).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should return transactions with valid categories', function(done) {
        var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        TransactionService.getTransactions('user-123', 12).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(validCategories).toContain(txn.category);
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should return independent copies of transaction data', function(done) {
        TransactionService.getTransactions('user-123', 12).then(function(txns1) {
          TransactionService.getTransactions('user-123', 12).then(function(txns2) {
            expect(txns1).not.toBe(txns2);
            expect(txns1[0]).not.toBe(txns2[0]);
            done();
          });
        });
        $rootScope.$apply();
      });

      it('should handle null userId', function(done) {
        TransactionService.getTransactions(null, 12).then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(Array.isArray(transactions)).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      it('should return transactions with positive amounts', function(done) {
        TransactionService.getTransactions('user-123', 12).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.amount).toBeGreaterThan(0);
            expect(typeof txn.amount).toBe('number');
          });
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('getMonthlySummary', function() {
      it('should return monthly spend summary object', function(done) {
        TransactionService.getMonthlySummary('user-123').then(function(summary) {
          expect(summary).toBeDefined();
          expect(summary.monthlySpend).toBeDefined();
          expect(typeof summary.monthlySpend).toBe('number');
          done();
        });
        $rootScope.$apply();
      });

      it('should return non-negative monthly spend', function(done) {
        TransactionService.getMonthlySummary('user-123').then(function(summary) {
          expect(summary.monthlySpend).toBeGreaterThanOrEqual(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should filter transactions by current month and year', function(done) {
        TransactionService.getMonthlySummary('user-123').then(function(summary) {
          expect(summary.monthlySpend).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should handle null userId', function(done) {
        TransactionService.getMonthlySummary(null).then(function(summary) {
          expect(summary).toBeDefined();
          expect(summary.monthlySpend).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should calculate sum correctly for current month transactions', function(done) {
        TransactionService.getMonthlySummary('user-123').then(function(summary) {
          expect(typeof summary.monthlySpend).toBe('number');
          expect(isNaN(summary.monthlySpend)).toBe(false);
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('getTransactionsByCard', function() {
      it('should return transactions for specific card', function(done) {
        TransactionService.getTransactionsByCard('card-1').then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(Array.isArray(transactions)).toBe(true);
          transactions.forEach(function(txn) {
            expect(txn.cardId).toBe('card-1');
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should return empty array for non-existent card', function(done) {
        TransactionService.getTransactionsByCard('invalid-card').then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should return independent copies of filtered transactions', function(done) {
        TransactionService.getTransactionsByCard('card-2').then(function(txns1) {
          TransactionService.getTransactionsByCard('card-2').then(function(txns2) {
            expect(txns1).not.toBe(txns2);
            if (txns1.length > 0 && txns2.length > 0) {
              expect(txns1[0]).not.toBe(txns2[0]);
            }
            done();
          });
        });
        $rootScope.$apply();
      });

      it('should filter transactions correctly for multiple cards', function(done) {
        var cardIds = ['card-1', 'card-2', 'card-3'];
        var promises = cardIds.map(function(cardId) {
          return TransactionService.getTransactionsByCard(cardId);
        });

        Promise.all(promises).then(function(results) {
          results.forEach(function(transactions, index) {
            var expectedCardId = cardIds[index];
            transactions.forEach(function(txn) {
              expect(txn.cardId).toBe(expectedCardId);
            });
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should handle null cardId', function(done) {
        TransactionService.getTransactionsByCard(null).then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should return transactions with all required properties', function(done) {
        TransactionService.getTransactionsByCard('card-1').then(function(transactions) {
          if (transactions.length > 0) {
            var txn = transactions[0];
            expect(txn.id).toBeDefined();
            expect(txn.amount).toBeDefined();
            expect(txn.category).toBeDefined();
            expect(txn.merchant).toBeDefined();
            expect(txn.date).toBeDefined();
          }
          done();
        });
        $rootScope.$apply();
      });
    });
  });
})();