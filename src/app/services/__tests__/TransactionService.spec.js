/*
Test Documentation:
- Test Name: TransactionService - getTransactions for all cards
- Purpose: Validates retrieval of all transactions
- Scenario: No card ID filter provided
- Expected Result: Returns all transactions
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions filtered by card ID
- Purpose: Validates filtering transactions by card
- Scenario: Specific card ID provided
- Expected Result: Returns only transactions for specified card
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions async behavior
- Purpose: Validates asynchronous promise resolution
- Scenario: Transactions returned after timeout
- Expected Result: Promise resolves after delay
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: all transactions retrieval, card-specific filtering, async resolution, transaction structure validation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $rootScope, $timeout;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$rootScope_, _$timeout_) {
      TransactionService = _TransactionService_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    }));

    describe('getTransactions', function() {
      it('should return all transactions when no cardId is provided', function() {
        var result;

        TransactionService.getTransactions(null, null).then(function(transactions) {
          result = transactions;
        });

        $timeout.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(10);
      });

      it('should filter transactions by cardId when provided', function() {
        var cardId = 'card1';
        var result;

        TransactionService.getTransactions(cardId, null).then(function(transactions) {
          result = transactions;
        });

        $timeout.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(5);
        result.forEach(function(txn) {
          expect(txn.cardId).toBe('card1');
        });
      });

      it('should return transactions for card2', function() {
        var result;

        TransactionService.getTransactions('card2', null).then(function(transactions) {
          result = transactions;
        });

        $timeout.flush();

        expect(result.length).toBe(3);
        result.forEach(function(txn) {
          expect(txn.cardId).toBe('card2');
        });
      });

      it('should return transactions for card3', function() {
        var result;

        TransactionService.getTransactions('card3', null).then(function(transactions) {
          result = transactions;
        });

        $timeout.flush();

        expect(result.length).toBe(2);
        result.forEach(function(txn) {
          expect(txn.cardId).toBe('card3');
        });
      });

      it('should return empty array for non-existent cardId', function() {
        var result;

        TransactionService.getTransactions('nonExistentCard', null).then(function(transactions) {
          result = transactions;
        });

        $timeout.flush();

        expect(result.length).toBe(0);
      });

      it('should return transactions with correct structure', function() {
        var result;

        TransactionService.getTransactions(null, null).then(function(transactions) {
          result = transactions;
        });

        $timeout.flush();

        var txn = result[0];
        expect(txn.transactionId).toBeDefined();
        expect(txn.cardId).toBeDefined();
        expect(txn.amount).toBeDefined();
        expect(txn.category).toBeDefined();
        expect(txn.merchantName).toBeDefined();
        expect(txn.transactionDate).toBeDefined();
        expect(txn.description).toBeDefined();
      });

      it('should return transactions with expected categories', function() {
        var result;

        TransactionService.getTransactions(null, null).then(function(transactions) {
          result = transactions;
        });

        $timeout.flush();

        var categories = result.map(function(txn) { return txn.category; });
        expect(categories).toContain('Food & Dining');
        expect(categories).toContain('Fuel');
        expect(categories).toContain('Shopping');
        expect(categories).toContain('Travel');
        expect(categories).toContain('Entertainment');
        expect(categories).toContain('Utilities');
        expect(categories).toContain('Healthcare');
        expect(categories).toContain('Education');
        expect(categories).toContain('Miscellaneous');
      });

      it('should resolve promise asynchronously', function() {
        var resolved = false;

        TransactionService.getTransactions(null, null).then(function() {
          resolved = true;
        });

        expect(resolved).toBe(false);

        $timeout.flush();

        expect(resolved).toBe(true);
      });

      it('should accept dateRange parameter without error', function() {
        var result;
        var dateRange = { start: '2024-06-01', end: '2024-06-30' };

        TransactionService.getTransactions(null, dateRange).then(function(transactions) {
          result = transactions;
        });

        $timeout.flush();

        expect(result).toBeDefined();
      });

      it('should return transactions with valid amounts', function() {
        var result;

        TransactionService.getTransactions(null, null).then(function(transactions) {
          result = transactions;
        });

        $timeout.flush();

        result.forEach(function(txn) {
          expect(typeof txn.amount).toBe('number');
          expect(txn.amount).toBeGreaterThan(0);
        });
      });
    });
  });
})();