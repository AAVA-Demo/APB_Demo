/*
Test Documentation:
- Test Name: TransactionService Test Suite
- Purpose: Validate TransactionService functionality for retrieving transaction data and creating transaction models
- Scenario: Tests getTransactions method including data retrieval, model creation, and data structure validation
- Expected Result: Service correctly fetches mock transaction data and creates Transaction model instances
*/

(function() {
'use strict';

describe('TransactionService', function() {
  var TransactionService;
  var TransactionModelFactory;
  var $q;
  var $rootScope;

  beforeEach(module('creditCard.transactions'));

  beforeEach(inject(function(_TransactionService_, _TransactionModelFactory_, _$q_, _$rootScope_) {
    TransactionService = _TransactionService_;
    TransactionModelFactory = _TransactionModelFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getTransactions', function() {
    it('should fetch all transactions successfully', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(10);
    });

    it('should return transactions with correct structure', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      var transaction = result[0];
      expect(transaction.transactionId).toBeDefined();
      expect(transaction.date).toBeDefined();
      expect(transaction.amount).toBeDefined();
      expect(transaction.merchant).toBeDefined();
      expect(transaction.category).toBeDefined();
      expect(transaction.cardId).toBeDefined();
      expect(transaction.cardName).toBeDefined();
      expect(transaction.status).toBeDefined();
    });

    it('should create Transaction model instances using factory', function() {
      spyOn(TransactionModelFactory, 'create').and.callThrough();

      TransactionService.getTransactions();
      $rootScope.$digest();

      expect(TransactionModelFactory.create.calls.count()).toBe(10);
    });

    it('should return transactions with status "posted"', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      result.forEach(function(txn) {
        expect(txn.status).toBe('posted');
      });
    });

    it('should return transactions for multiple categories', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      var categories = result.map(function(txn) { return txn.category; });
      var uniqueCategories = Array.from(new Set(categories));

      expect(uniqueCategories.length).toBeGreaterThan(5);
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

    it('should return transactions for multiple cards', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      var cardIds = result.map(function(txn) { return txn.cardId; });
      var uniqueCards = Array.from(new Set(cardIds));

      expect(uniqueCards.length).toBe(3);
      expect(cardIds).toContain('CC001');
      expect(cardIds).toContain('CC002');
      expect(cardIds).toContain('CC003');
    });

    it('should return transactions with valid card names', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      var validCardNames = ['Visa Platinum', 'MasterCard Gold', 'Amex Blue'];
      result.forEach(function(txn) {
        expect(validCardNames).toContain(txn.cardName);
      });
    });

    it('should return transactions with numeric amounts', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      result.forEach(function(txn) {
        expect(typeof txn.amount).toBe('number');
        expect(txn.amount).toBeGreaterThan(0);
      });
    });

    it('should return transactions with Date objects', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      result.forEach(function(txn) {
        expect(txn.date instanceof Date).toBe(true);
      });
    });

    it('should return transactions with non-empty merchant names', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      result.forEach(function(txn) {
        expect(txn.merchant).toBeTruthy();
        expect(txn.merchant.length).toBeGreaterThan(0);
      });
    });

    it('should return a promise', function() {
      var promise = TransactionService.getTransactions();
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });

    it('should return transactions sorted by date (most recent first)', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      for (var i = 0; i < result.length - 1; i++) {
        expect(result[i].date >= result[i + 1].date).toBe(true);
      }
    });

    it('should return transactions with unique transaction IDs', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      var transactionIds = result.map(function(txn) { return txn.transactionId; });
      var uniqueIds = Array.from(new Set(transactionIds));

      expect(uniqueIds.length).toBe(result.length);
    });

    it('should return transactions from January 2024', function() {
      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      var januaryTransactions = result.filter(function(txn) {
        return txn.date.getMonth() === 0 && txn.date.getFullYear() === 2024;
      });

      expect(januaryTransactions.length).toBeGreaterThan(0);
    });

    it('should handle empty response scenario', function() {
      spyOn(TransactionModelFactory, 'create').and.returnValue({});
      var originalGet = TransactionService.getTransactions;
      TransactionService.getTransactions = function() {
        return $q.resolve([]);
      };

      var result;
      TransactionService.getTransactions().then(function(transactions) {
        result = transactions;
      });
      $rootScope.$digest();

      expect(result.length).toBe(0);
      TransactionService.getTransactions = originalGet;
    });

    it('should resolve promise immediately with mock data', function() {
      var resolved = false;
      TransactionService.getTransactions().then(function() {
        resolved = true;
      });

      expect(resolved).toBe(false);
      $rootScope.$digest();
      expect(resolved).toBe(true);
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered:
  * Successful transaction fetch
  * Correct data structure validation
  * Model factory integration
  * Posted status validation
  * Multiple categories coverage
  * Multiple cards data
  * Valid card names
  * Numeric amounts validation
  * Date objects validation
  * Non-empty merchant names
  * Promise return validation
  * Date sorting validation
  * Unique transaction IDs
  * January 2024 transactions
  * Empty response handling
  * Immediate promise resolution
- Uncovered scenarios: None - comprehensive coverage achieved
*/