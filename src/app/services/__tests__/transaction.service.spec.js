/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend returns spend amount
- Purpose: Validates monthly spend calculation
- Scenario: Service calculates total monthly spending
- Expected Result: Returns numeric monthly spend value
*/
/*
Test Documentation:
- Test Name: TransactionService - getCardTransactions returns card transactions
- Purpose: Validates card-specific transaction retrieval
- Scenario: Service fetches transactions for specific card
- Expected Result: Returns array of transactions for specified card
*/
/*
Test Documentation:
- Test Name: TransactionService - getCardTransactions filters by cardId
- Purpose: Validates transaction filtering logic
- Scenario: Transactions requested for specific card ID
- Expected Result: Only transactions for specified card are returned
*/
/*
Test Documentation:
- Test Name: TransactionService - getCardTransactions returns empty for invalid cardId
- Purpose: Validates edge case handling
- Scenario: Non-existent card ID provided
- Expected Result: Returns empty array without errors
*/
/*
Coverage Report:
- Functions tested: getMonthlySpend, getCardTransactions
- Scenarios covered: spend calculation, card filtering, edge cases, performance
- Uncovered scenarios: real-time updates, transaction posting, error handling
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService;
    var $http;
    var $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$http_, _$q_) {
      TransactionService = _TransactionService_;
      $http = _$http_;
      $q = _$q_;
    }));

    describe('getMonthlySpend', function() {
      it('should be defined', function() {
        expect(TransactionService.getMonthlySpend).toBeDefined();
        expect(typeof TransactionService.getMonthlySpend).toBe('function');
      });

      it('should return a promise', function() {
        var result = TransactionService.getMonthlySpend();

        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should return numeric monthly spend', function(done) {
        TransactionService.getMonthlySpend().then(function(monthlySpend) {
          expect(monthlySpend).toBeDefined();
          expect(typeof monthlySpend).toBe('number');
          expect(monthlySpend).toBeGreaterThan(0);
          done();
        }).catch(function(error) {
          fail('Promise should not reject: ' + error);
          done();
        });
      });

      it('should resolve within expected timeout', function(done) {
        var startTime = Date.now();

        TransactionService.getMonthlySpend().then(function(monthlySpend) {
          var endTime = Date.now();
          var elapsed = endTime - startTime;

          expect(elapsed).toBeLessThan(700);
          expect(monthlySpend).toBeGreaterThan(0);
          done();
        });
      });

      it('should return consistent value on multiple calls', function(done) {
        var promise1 = TransactionService.getMonthlySpend();
        var promise2 = TransactionService.getMonthlySpend();

        Promise.all([promise1, promise2]).then(function(results) {
          expect(results[0]).toBe(results[1]);
          done();
        });
      });
    });

    describe('getCardTransactions', function() {
      it('should be defined', function() {
        expect(TransactionService.getCardTransactions).toBeDefined();
        expect(typeof TransactionService.getCardTransactions).toBe('function');
      });

      it('should return a promise', function() {
        var result = TransactionService.getCardTransactions('c1');

        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should return array of transactions for valid card ID', function(done) {
        TransactionService.getCardTransactions('c1').then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBeGreaterThan(0);
          done();
        }).catch(function(error) {
          fail('Promise should not reject: ' + error);
          done();
        });
      });

      it('should filter transactions by card ID', function(done) {
        TransactionService.getCardTransactions('c1').then(function(transactions) {
          transactions.forEach(function(t) {
            expect(t.cardId).toBe('c1');
          });
          done();
        });
      });

      it('should return transactions with required properties', function(done) {
        TransactionService.getCardTransactions('c1').then(function(transactions) {
          expect(transactions.length).toBeGreaterThan(0);
          
          var txn = transactions[0];
          expect(txn.transactionId).toBeDefined();
          expect(txn.cardId).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.merchantName).toBeDefined();
          expect(txn.transactionDate).toBeDefined();
          expect(txn.description).toBeDefined();
          done();
        });
      });

      it('should return transactions with numeric amounts', function(done) {
        TransactionService.getCardTransactions('c1').then(function(transactions) {
          transactions.forEach(function(t) {
            expect(typeof t.amount).toBe('number');
            expect(t.amount).toBeGreaterThan(0);
          });
          done();
        });
      });

      it('should return transactions with valid categories', function(done) {
        var validCategories = [
          'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
          'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
        ];

        TransactionService.getCardTransactions('c1').then(function(transactions) {
          transactions.forEach(function(t) {
            expect(validCategories).toContain(t.category);
          });
          done();
        });
      });

      it('should return empty array for non-existent card ID', function(done) {
        TransactionService.getCardTransactions('nonexistent').then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(0);
          done();
        });
      });

      it('should return different transactions for different cards', function(done) {
        var promise1 = TransactionService.getCardTransactions('c1');
        var promise2 = TransactionService.getCardTransactions('c2');

        Promise.all([promise1, promise2]).then(function(results) {
          var c1Transactions = results[0];
          var c2Transactions = results[1];

          expect(c1Transactions.length).toBeGreaterThan(0);
          expect(c2Transactions.length).toBeGreaterThan(0);

          c1Transactions.forEach(function(t) {
            expect(t.cardId).toBe('c1');
          });

          c2Transactions.forEach(function(t) {
            expect(t.cardId).toBe('c2');
          });

          done();
        });
      });

      it('should resolve within expected timeout', function(done) {
        var startTime = Date.now();

        TransactionService.getCardTransactions('c1').then(function(transactions) {
          var endTime = Date.now();
          var elapsed = endTime - startTime;

          expect(elapsed).toBeLessThan(500);
          expect(transactions.length).toBeGreaterThan(0);
          done();
        });
      });

      it('should handle concurrent requests for different cards', function(done) {
        var promises = [
          TransactionService.getCardTransactions('c1'),
          TransactionService.getCardTransactions('c2'),
          TransactionService.getCardTransactions('c1')
        ];

        Promise.all(promises).then(function(results) {
          expect(results[0].length).toBeGreaterThan(0);
          expect(results[1].length).toBeGreaterThan(0);
          expect(results[0]).toEqual(results[2]);
          done();
        });
      });
    });
  });
})();