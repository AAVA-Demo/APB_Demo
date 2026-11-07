/*
Test Documentation:
- Test Name: TransactionService Test Suite
- Purpose: Validate TransactionService functionality for transaction retrieval and spending calculations
- Scenario: Tests promise resolution, filtering, date-based calculations, and category aggregation
- Expected Result: All functions return correct transaction data with accurate filtering and calculations
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$rootScope_) {
      TransactionService = _TransactionService_;
      $rootScope = _$rootScope_;
    }));

    describe('getAllTransactions', function() {
      it('should return all transactions as a promise', function(done) {
        TransactionService.getAllTransactions().then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(20);
          done();
        });

        $rootScope.$digest();
      });

      it('should return transactions with required properties', function(done) {
        TransactionService.getAllTransactions().then(function(transactions) {
          var transaction = transactions[0];
          expect(transaction.id).toBeDefined();
          expect(transaction.cardId).toBeDefined();
          expect(transaction.date).toBeDefined();
          expect(transaction.merchant).toBeDefined();
          expect(transaction.category).toBeDefined();
          expect(transaction.amount).toBeDefined();
          expect(transaction.description).toBeDefined();
          done();
        });

        $rootScope.$digest();
      });

      it('should return a copy of transactions array (not reference)', function(done) {
        TransactionService.getAllTransactions().then(function(trans1) {
          TransactionService.getAllTransactions().then(function(trans2) {
            expect(trans1).not.toBe(trans2);
            expect(trans1[0]).not.toBe(trans2[0]);
            done();
          });
        });

        $rootScope.$digest();
      });
    });

    describe('getTransactionsByCardId', function() {
      it('should return transactions for specific card', function(done) {
        TransactionService.getTransactionsByCardId(1).then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(Array.isArray(transactions)).toBe(true);
          transactions.forEach(function(t) {
            expect(t.cardId).toBe(1);
          });
          done();
        });

        $rootScope.$digest();
      });

      it('should return different transactions for different cards', function(done) {
        TransactionService.getTransactionsByCardId(1).then(function(card1Trans) {
          TransactionService.getTransactionsByCardId(2).then(function(card2Trans) {
            expect(card1Trans.length).toBeGreaterThan(0);
            expect(card2Trans.length).toBeGreaterThan(0);
            card1Trans.forEach(function(t) {
              expect(t.cardId).toBe(1);
            });
            card2Trans.forEach(function(t) {
              expect(t.cardId).toBe(2);
            });
            done();
          });
        });

        $rootScope.$digest();
      });

      it('should return empty array for non-existent card', function(done) {
        TransactionService.getTransactionsByCardId(999).then(function(transactions) {
          expect(transactions).toEqual([]);
          expect(transactions.length).toBe(0);
          done();
        });

        $rootScope.$digest();
      });

      it('should return a copy of filtered transactions', function(done) {
        TransactionService.getTransactionsByCardId(1).then(function(trans1) {
          TransactionService.getTransactionsByCardId(1).then(function(trans2) {
            expect(trans1).not.toBe(trans2);
            if (trans1.length > 0) {
              expect(trans1[0]).not.toBe(trans2[0]);
            }
            done();
          });
        });

        $rootScope.$digest();
      });
    });

    describe('getMonthlySpend', function() {
      it('should return a number', function() {
        var spend = TransactionService.getMonthlySpend();
        expect(typeof spend).toBe('number');
      });

      it('should be synchronous (not a promise)', function() {
        var spend = TransactionService.getMonthlySpend();
        expect(spend).not.toBeUndefined();
        expect(typeof spend.then).toBe('undefined');
      });

      it('should return non-negative value', function() {
        var spend = TransactionService.getMonthlySpend();
        expect(spend).toBeGreaterThanOrEqual(0);
      });

      it('should only include current month transactions', function(done) {
        var now = new Date();
        var currentMonth = now.getMonth();
        var currentYear = now.getFullYear();

        TransactionService.getAllTransactions().then(function(transactions) {
          var manualTotal = transactions
            .filter(function(t) {
              var tDate = new Date(t.date);
              return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            })
            .reduce(function(sum, t) {
              return sum + t.amount;
            }, 0);

          var serviceTotal = TransactionService.getMonthlySpend();
          expect(serviceTotal).toBe(manualTotal);
          done();
        });

        $rootScope.$digest();
      });
    });

    describe('getCategorySpending', function() {
      it('should return an object with category totals', function() {
        var categories = TransactionService.getCategorySpending();
        expect(typeof categories).toBe('object');
        expect(categories).not.toBeNull();
      });

      it('should include all spending categories', function() {
        var categories = TransactionService.getCategorySpending();
        expect(categories['Food & Dining']).toBeDefined();
        expect(categories['Fuel']).toBeDefined();
        expect(categories['Shopping']).toBeDefined();
        expect(categories['Travel']).toBeDefined();
        expect(categories['Entertainment']).toBeDefined();
        expect(categories['Utilities']).toBeDefined();
        expect(categories['Healthcare']).toBeDefined();
        expect(categories['Education']).toBeDefined();
      });

      it('should have numeric values for all categories', function() {
        var categories = TransactionService.getCategorySpending();
        Object.keys(categories).forEach(function(category) {
          expect(typeof categories[category]).toBe('number');
          expect(categories[category]).toBeGreaterThan(0);
        });
      });

      it('should be synchronous (not a promise)', function() {
        var categories = TransactionService.getCategorySpending();
        expect(categories).not.toBeUndefined();
        expect(typeof categories.then).toBe('undefined');
      });

      it('should aggregate amounts correctly by category', function(done) {
        TransactionService.getAllTransactions().then(function(transactions) {
          var manualCategories = {};
          transactions.forEach(function(t) {
            if (!manualCategories[t.category]) {
              manualCategories[t.category] = 0;
            }
            manualCategories[t.category] += t.amount;
          });

          var serviceCategories = TransactionService.getCategorySpending();
          
          Object.keys(manualCategories).forEach(function(category) {
            expect(serviceCategories[category]).toBe(manualCategories[category]);
          });
          done();
        });

        $rootScope.$digest();
      });
    });

    describe('Integration tests', function() {
      it('should have consistent data across getAllTransactions and getTransactionsByCardId', function(done) {
        TransactionService.getAllTransactions().then(function(allTransactions) {
          var cardIds = [1, 2, 3];
          var promises = cardIds.map(function(cardId) {
            return TransactionService.getTransactionsByCardId(cardId);
          });

          Promise.all(promises).then(function(results) {
            var totalFromCards = results.reduce(function(sum, cardTrans) {
              return sum + cardTrans.length;
            }, 0);
            expect(totalFromCards).toBe(allTransactions.length);
            done();
          });
        });

        $rootScope.$digest();
      });

      it('should have valid date objects in transactions', function(done) {
        TransactionService.getAllTransactions().then(function(transactions) {
          transactions.forEach(function(t) {
            expect(t.date instanceof Date).toBe(true);
            expect(isNaN(t.date.getTime())).toBe(false);
          });
          done();
        });

        $rootScope.$digest();
      });

      it('should have positive amounts for all transactions', function(done) {
        TransactionService.getAllTransactions().then(function(transactions) {
          transactions.forEach(function(t) {
            expect(t.amount).toBeGreaterThan(0);
          });
          done();
        });

        $rootScope.$digest();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getAllTransactions, getTransactionsByCardId, getMonthlySpend, getCategorySpending
- Scenarios covered:
  * Promise resolution for async methods
  * Data filtering by card ID
  * Date-based filtering for monthly spend
  * Category aggregation
  * Data immutability
  * Edge cases (non-existent cards, empty results)
  * Data validation (dates, amounts, types)
  * Integration consistency across methods
- Edge cases: Non-existent card IDs, current month calculations, empty arrays, data immutability
- Uncovered scenarios: None - all public methods tested with comprehensive normal, edge, and integration scenarios
*/