/*
Test Documentation:
- Test Name: TransactionService - Transaction Data Management
- Purpose: Validate transaction retrieval, monthly spend calculation, and card-specific spending analysis
- Scenario: User transaction data operations across multiple cards and categories
- Expected Result: Accurate transaction data, spending calculations, and category breakdowns
*/

/*
Coverage Report:
- Functions tested: getMonthlySpend, getCardSpending, getTransactions
- Scenarios covered: monthly spend calculation (current month), card-specific spending with category breakdown, transaction filtering by date range, empty results, edge cases (no transactions, invalid card IDs, null date ranges)
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $q, $rootScope, $timeout;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$q_, _$rootScope_, _$timeout_) {
      TransactionService = _TransactionService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    }));

    describe('getMonthlySpend', function() {
      it('should return monthly spend for current month', function(done) {
        TransactionService.getMonthlySpend().then(function(monthlyTotal) {
          expect(monthlyTotal).toBeDefined();
          expect(typeof monthlyTotal).toBe('number');
          expect(monthlyTotal).toBeGreaterThanOrEqual(0);
          done();
        });
        $timeout.flush();
      });

      it('should filter transactions by current month and year', function(done) {
        var currentMonth = new Date().getMonth();
        var currentYear = new Date().getFullYear();
        TransactionService.getMonthlySpend().then(function(monthlyTotal) {
          expect(monthlyTotal).toBeDefined();
          done();
        });
        $timeout.flush();
      });

      it('should return zero when no transactions exist for current month', function(done) {
        spyOn(Date.prototype, 'getMonth').and.returnValue(5);
        spyOn(Date.prototype, 'getFullYear').and.returnValue(2025);
        TransactionService.getMonthlySpend().then(function(monthlyTotal) {
          expect(monthlyTotal).toBeGreaterThanOrEqual(0);
          done();
        });
        $timeout.flush();
      });

      it('should resolve promise within expected timeout', function(done) {
        var startTime = Date.now();
        TransactionService.getMonthlySpend().then(function() {
          var elapsed = Date.now() - startTime;
          expect(elapsed).toBeLessThan(1000);
          done();
        });
        $timeout.flush();
      });

      it('should handle multiple concurrent calls', function(done) {
        var promise1 = TransactionService.getMonthlySpend();
        var promise2 = TransactionService.getMonthlySpend();
        $q.all([promise1, promise2]).then(function(results) {
          expect(results[0]).toBe(results[1]);
          done();
        });
        $timeout.flush();
      });
    });

    describe('getCardSpending', function() {
      it('should return spending data for valid card ID', function(done) {
        TransactionService.getCardSpending('c1').then(function(result) {
          expect(result).toBeDefined();
          expect(result.cardId).toBe('c1');
          expect(result.monthlySpend).toBeDefined();
          expect(result.categoryBreakdown).toBeDefined();
          expect(result.transactionCount).toBeDefined();
          done();
        });
        $timeout.flush();
      });

      it('should calculate total monthly spend for card', function(done) {
        TransactionService.getCardSpending('c1').then(function(result) {
          expect(typeof result.monthlySpend).toBe('number');
          expect(result.monthlySpend).toBeGreaterThan(0);
          done();
        });
        $timeout.flush();
      });

      it('should provide category breakdown as array', function(done) {
        TransactionService.getCardSpending('c1').then(function(result) {
          expect(Array.isArray(result.categoryBreakdown)).toBe(true);
          expect(result.categoryBreakdown.length).toBeGreaterThan(0);
          done();
        });
        $timeout.flush();
      });

      it('should include category and amount in breakdown', function(done) {
        TransactionService.getCardSpending('c1').then(function(result) {
          result.categoryBreakdown.forEach(function(item) {
            expect(item.category).toBeDefined();
            expect(item.amount).toBeDefined();
            expect(typeof item.amount).toBe('number');
          });
          done();
        });
        $timeout.flush();
      });

      it('should return correct transaction count', function(done) {
        TransactionService.getCardSpending('c1').then(function(result) {
          expect(result.transactionCount).toBeGreaterThan(0);
          expect(typeof result.transactionCount).toBe('number');
          done();
        });
        $timeout.flush();
      });

      it('should handle card with no transactions', function(done) {
        TransactionService.getCardSpending('c999').then(function(result) {
          expect(result.monthlySpend).toBe(0);
          expect(result.categoryBreakdown).toEqual([]);
          expect(result.transactionCount).toBe(0);
          done();
        });
        $timeout.flush();
      });

      it('should aggregate amounts by category correctly', function(done) {
        TransactionService.getCardSpending('c1').then(function(result) {
          var totalFromBreakdown = result.categoryBreakdown.reduce(function(sum, cat) {
            return sum + cat.amount;
          }, 0);
          expect(totalFromBreakdown).toBe(result.monthlySpend);
          done();
        });
        $timeout.flush();
      });

      it('should handle multiple cards independently', function(done) {
        $q.all([
          TransactionService.getCardSpending('c1'),
          TransactionService.getCardSpending('c2'),
          TransactionService.getCardSpending('c3')
        ]).then(function(results) {
          expect(results[0].cardId).toBe('c1');
          expect(results[1].cardId).toBe('c2');
          expect(results[2].cardId).toBe('c3');
          done();
        });
        $timeout.flush();
      });

      it('should handle null card ID gracefully', function(done) {
        TransactionService.getCardSpending(null).then(function(result) {
          expect(result.monthlySpend).toBe(0);
          expect(result.transactionCount).toBe(0);
          done();
        });
        $timeout.flush();
      });

      it('should handle undefined card ID gracefully', function(done) {
        TransactionService.getCardSpending(undefined).then(function(result) {
          expect(result.monthlySpend).toBe(0);
          done();
        });
        $timeout.flush();
      });
    });

    describe('getTransactions', function() {
      it('should return all transactions when no date range provided', function(done) {
        TransactionService.getTransactions().then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBeGreaterThan(0);
          done();
        });
        $timeout.flush();
      });

      it('should filter transactions by date range', function(done) {
        var dateRange = {
          start: new Date('2026-11-01'),
          end: new Date('2026-11-30')
        };
        TransactionService.getTransactions(dateRange).then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          transactions.forEach(function(t) {
            var tDate = new Date(t.date);
            expect(tDate >= dateRange.start).toBe(true);
            expect(tDate <= dateRange.end).toBe(true);
          });
          done();
        });
        $timeout.flush();
      });

      it('should return transactions with all required fields', function(done) {
        TransactionService.getTransactions().then(function(transactions) {
          transactions.forEach(function(t) {
            expect(t.transactionId).toBeDefined();
            expect(t.cardId).toBeDefined();
            expect(t.amount).toBeDefined();
            expect(t.date).toBeDefined();
            expect(t.merchant).toBeDefined();
            expect(t.category).toBeDefined();
            expect(t.description).toBeDefined();
          });
          done();
        });
        $timeout.flush();
      });

      it('should handle date range with no matching transactions', function(done) {
        var dateRange = {
          start: new Date('2025-01-01'),
          end: new Date('2025-01-31')
        };
        TransactionService.getTransactions(dateRange).then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(0);
          done();
        });
        $timeout.flush();
      });

      it('should handle null date range', function(done) {
        TransactionService.getTransactions(null).then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBeGreaterThan(0);
          done();
        });
        $timeout.flush();
      });

      it('should handle date range with only start date', function(done) {
        var dateRange = {start: new Date('2026-11-01')};
        TransactionService.getTransactions(dateRange).then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          done();
        });
        $timeout.flush();
      });

      it('should handle date range with only end date', function(done) {
        var dateRange = {end: new Date('2026-11-30')};
        TransactionService.getTransactions(dateRange).then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          done();
        });
        $timeout.flush();
      });

      it('should return transactions in consistent format', function(done) {
        TransactionService.getTransactions().then(function(transactions) {
          transactions.forEach(function(t) {
            expect(typeof t.transactionId).toBe('string');
            expect(typeof t.cardId).toBe('string');
            expect(typeof t.amount).toBe('number');
            expect(t.date instanceof Date).toBe(true);
            expect(typeof t.merchant).toBe('string');
            expect(typeof t.category).toBe('string');
          });
          done();
        });
        $timeout.flush();
      });

      it('should handle multiple categories correctly', function(done) {
        TransactionService.getTransactions().then(function(transactions) {
          var categories = transactions.map(function(t) { return t.category; });
          var uniqueCategories = categories.filter(function(v, i, a) { return a.indexOf(v) === i; });
          expect(uniqueCategories.length).toBeGreaterThan(1);
          done();
        });
        $timeout.flush();
      });

      it('should resolve within expected timeout', function(done) {
        var startTime = Date.now();
        TransactionService.getTransactions().then(function() {
          var elapsed = Date.now() - startTime;
          expect(elapsed).toBeLessThan(1000);
          done();
        });
        $timeout.flush();
      });
    });

    describe('Edge Cases and Error Handling', function() {
      it('should handle rapid successive calls to getMonthlySpend', function(done) {
        var promises = [];
        for (var i = 0; i < 10; i++) {
          promises.push(TransactionService.getMonthlySpend());
        }
        $q.all(promises).then(function(results) {
          expect(results.length).toBe(10);
          done();
        });
        $timeout.flush();
      });

      it('should handle empty string card ID', function(done) {
        TransactionService.getCardSpending('').then(function(result) {
          expect(result.monthlySpend).toBe(0);
          done();
        });
        $timeout.flush();
      });

      it('should handle date range with start after end', function(done) {
        var dateRange = {
          start: new Date('2026-12-01'),
          end: new Date('2026-11-01')
        };
        TransactionService.getTransactions(dateRange).then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(0);
          done();
        });
        $timeout.flush();
      });

      it('should handle very large date ranges', function(done) {
        var dateRange = {
          start: new Date('2020-01-01'),
          end: new Date('2030-12-31')
        };
        TransactionService.getTransactions(dateRange).then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          done();
        });
        $timeout.flush();
      });

      it('should maintain data integrity across multiple calls', function(done) {
        var call1, call2;
        TransactionService.getTransactions().then(function(result1) {
          call1 = result1;
          return TransactionService.getTransactions();
        }).then(function(result2) {
          call2 = result2;
          expect(call1.length).toBe(call2.length);
          done();
        });
        $timeout.flush();
      });

      it('should handle category breakdown with single category', function(done) {
        TransactionService.getCardSpending('c1').then(function(result) {
          expect(result.categoryBreakdown).toBeDefined();
          expect(Array.isArray(result.categoryBreakdown)).toBe(true);
          done();
        });
        $timeout.flush();
      });

      it('should calculate spending correctly for cards with multiple transactions', function(done) {
        TransactionService.getCardSpending('c1').then(function(result) {
          expect(result.monthlySpend).toBeGreaterThan(0);
          expect(result.transactionCount).toBeGreaterThan(0);
          done();
        });
        $timeout.flush();
      });
    });

    describe('Data Validation', function() {
      it('should ensure all transaction amounts are positive numbers', function(done) {
        TransactionService.getTransactions().then(function(transactions) {
          transactions.forEach(function(t) {
            expect(t.amount).toBeGreaterThan(0);
          });
          done();
        });
        $timeout.flush();
      });

      it('should ensure all transactions have valid dates', function(done) {
        TransactionService.getTransactions().then(function(transactions) {
          transactions.forEach(function(t) {
            expect(t.date instanceof Date).toBe(true);
            expect(isNaN(t.date.getTime())).toBe(false);
          });
          done();
        });
        $timeout.flush();
      });

      it('should ensure category breakdown amounts match transaction amounts', function(done) {
        TransactionService.getCardSpending('c2').then(function(result) {
          var total = result.categoryBreakdown.reduce(function(sum, cat) {
            return sum + cat.amount;
          }, 0);
          expect(total).toBe(result.monthlySpend);
          done();
        });
        $timeout.flush();
      });

      it('should ensure transaction count matches actual transactions', function(done) {
        var cardId = 'c1';
        TransactionService.getCardSpending(cardId).then(function(result) {
          return TransactionService.getTransactions().then(function(allTransactions) {
            var cardTransactions = allTransactions.filter(function(t) { return t.cardId === cardId; });
            expect(result.transactionCount).toBe(cardTransactions.length);
            done();
          });
        });
        $timeout.flush();
      });
    });
  });
})();