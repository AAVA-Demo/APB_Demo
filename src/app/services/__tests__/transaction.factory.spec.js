/*
Test Documentation:
- Test Name: TransactionFactory - getMonthlySpend method
- Purpose: Validates calculation of monthly spend and outstanding amounts
- Scenario: Retrieve monthly spending summary
- Expected Result: Returns promise with monthlySpend and outstanding totals
*/
/*
Test Documentation:
- Test Name: TransactionFactory - getTransactions method
- Purpose: Validates retrieval of all transactions within date range
- Scenario: Fetch transactions for a given date range
- Expected Result: Returns promise resolving to array of transaction objects
*/
/*
Test Documentation:
- Test Name: TransactionFactory - fetchTransactions method
- Purpose: Validates paginated transaction retrieval with filtering
- Scenario: Fetch transactions with pagination and filters
- Expected Result: Returns paginated results with totalRecords and totalPages
*/
/*
Coverage Report:
- Functions tested: getMonthlySpend, getTransactions, fetchTransactions
- Scenarios covered: monthly spend calculation, transaction retrieval, pagination, filtering by cardIds, search term filtering
- Edge cases: empty filters, invalid page numbers, search term matching, multiple card filters
- Uncovered scenarios: date range validation (not implemented in mock)
*/

describe('TransactionFactory', function() {
  'use strict';

  var TransactionFactory;
  var $q;
  var $rootScope;
  var $timeout;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionFactory_, _$q_, _$rootScope_, _$timeout_) {
    TransactionFactory = _TransactionFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  describe('getMonthlySpend', function() {
    it('should return a promise', function() {
      var result = TransactionFactory.getMonthlySpend();
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });

    it('should resolve with monthlySpend and outstanding properties', function(done) {
      TransactionFactory.getMonthlySpend().then(function(data) {
        expect(data.monthlySpend).toBeDefined();
        expect(data.outstanding).toBeDefined();
        done();
      });
      $timeout.flush();
    });

    it('should calculate correct total monthly spend', function(done) {
      TransactionFactory.getMonthlySpend().then(function(data) {
        expect(typeof data.monthlySpend).toBe('number');
        expect(data.monthlySpend).toBeGreaterThan(0);
        expect(data.monthlySpend).toBe(13250); // 2500 + 850 + 3200 + 1200 + 5500
        done();
      });
      $timeout.flush();
    });

    it('should calculate correct outstanding amount', function(done) {
      TransactionFactory.getMonthlySpend().then(function(data) {
        expect(typeof data.outstanding).toBe('number');
        expect(data.outstanding).toBeGreaterThanOrEqual(0);
        expect(data.outstanding).toBe(5500); // Only Pending transaction
        done();
      });
      $timeout.flush();
    });

    it('should resolve after 500ms delay', function() {
      var resolved = false;
      TransactionFactory.getMonthlySpend().then(function() {
        resolved = true;
      });
      expect(resolved).toBe(false);
      $timeout.flush(500);
      expect(resolved).toBe(true);
    });
  });

  describe('getTransactions', function() {
    it('should return a promise', function() {
      var result = TransactionFactory.getTransactions({});
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });

    it('should resolve with an array of transactions', function(done) {
      TransactionFactory.getTransactions({}).then(function(transactions) {
        expect(Array.isArray(transactions)).toBe(true);
        expect(transactions.length).toBeGreaterThan(0);
        done();
      });
      $timeout.flush();
    });

    it('should return transactions with required properties', function(done) {
      TransactionFactory.getTransactions({}).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.transactionId).toBeDefined();
          expect(txn.cardId).toBeDefined();
          expect(txn.cardName).toBeDefined();
          expect(txn.merchantName).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.currency).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.transactionDate).toBeDefined();
          expect(txn.status).toBeDefined();
          expect(txn.description).toBeDefined();
        });
        done();
      });
      $timeout.flush();
    });

    it('should return five mock transactions', function(done) {
      TransactionFactory.getTransactions({}).then(function(transactions) {
        expect(transactions.length).toBe(5);
        done();
      });
      $timeout.flush();
    });

    it('should return transactions with correct data types', function(done) {
      TransactionFactory.getTransactions({}).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(typeof txn.transactionId).toBe('string');
          expect(typeof txn.cardId).toBe('string');
          expect(typeof txn.merchantName).toBe('string');
          expect(typeof txn.amount).toBe('number');
          expect(typeof txn.currency).toBe('string');
          expect(typeof txn.category).toBe('string');
          expect(txn.transactionDate instanceof Date).toBe(true);
          expect(typeof txn.status).toBe('string');
        });
        done();
      });
      $timeout.flush();
    });

    it('should return immutable data (deep copy)', function(done) {
      TransactionFactory.getTransactions({}).then(function(txns1) {
        txns1[0].merchantName = 'Modified Merchant';
        TransactionFactory.getTransactions({}).then(function(txns2) {
          expect(txns2[0].merchantName).not.toBe('Modified Merchant');
          done();
        });
        $timeout.flush();
      });
      $timeout.flush();
    });
  });

  describe('fetchTransactions', function() {
    it('should return a promise', function() {
      var result = TransactionFactory.fetchTransactions(1, 20, {});
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });

    it('should resolve with paginated result structure', function(done) {
      TransactionFactory.fetchTransactions(1, 20, {}).then(function(result) {
        expect(result.transactions).toBeDefined();
        expect(result.totalRecords).toBeDefined();
        expect(result.totalPages).toBeDefined();
        expect(Array.isArray(result.transactions)).toBe(true);
        done();
      });
      $timeout.flush();
    });

    it('should return correct total records', function(done) {
      TransactionFactory.fetchTransactions(1, 20, {}).then(function(result) {
        expect(result.totalRecords).toBe(5);
        done();
      });
      $timeout.flush();
    });

    it('should calculate correct total pages', function(done) {
      TransactionFactory.fetchTransactions(1, 2, {}).then(function(result) {
        expect(result.totalPages).toBe(3); // 5 transactions / 2 per page = 3 pages
        done();
      });
      $timeout.flush();
    });

    it('should return correct page of results', function(done) {
      TransactionFactory.fetchTransactions(1, 2, {}).then(function(result) {
        expect(result.transactions.length).toBe(2);
        done();
      });
      $timeout.flush();
    });

    it('should handle page 2 correctly', function(done) {
      TransactionFactory.fetchTransactions(2, 2, {}).then(function(result) {
        expect(result.transactions.length).toBe(2);
        done();
      });
      $timeout.flush();
    });

    it('should handle last page with remaining items', function(done) {
      TransactionFactory.fetchTransactions(3, 2, {}).then(function(result) {
        expect(result.transactions.length).toBe(1);
        done();
      });
      $timeout.flush();
    });

    it('should filter by single cardId', function(done) {
      var filters = { cardIds: ['card1'] };
      TransactionFactory.fetchTransactions(1, 20, filters).then(function(result) {
        expect(result.transactions.length).toBe(2);
        result.transactions.forEach(function(txn) {
          expect(txn.cardId).toBe('card1');
        });
        done();
      });
      $timeout.flush();
    });

    it('should filter by multiple cardIds', function(done) {
      var filters = { cardIds: ['card1', 'card2'] };
      TransactionFactory.fetchTransactions(1, 20, filters).then(function(result) {
        expect(result.transactions.length).toBe(4);
        result.transactions.forEach(function(txn) {
          expect(['card1', 'card2'].indexOf(txn.cardId)).toBeGreaterThan(-1);
        });
        done();
      });
      $timeout.flush();
    });

    it('should filter by search term in merchant name', function(done) {
      var filters = { searchTerm: 'Amazon' };
      TransactionFactory.fetchTransactions(1, 20, filters).then(function(result) {
        expect(result.transactions.length).toBe(1);
        expect(result.transactions[0].merchantName).toBe('Amazon');
        done();
      });
      $timeout.flush();
    });

    it('should filter by search term in description', function(done) {
      var filters = { searchTerm: 'delivery' };
      TransactionFactory.fetchTransactions(1, 20, filters).then(function(result) {
        expect(result.transactions.length).toBeGreaterThan(0);
        var found = result.transactions.some(function(txn) {
          return txn.description.toLowerCase().indexOf('delivery') !== -1;
        });
        expect(found).toBe(true);
        done();
      });
      $timeout.flush();
    });

    it('should handle case-insensitive search', function(done) {
      var filters = { searchTerm: 'AMAZON' };
      TransactionFactory.fetchTransactions(1, 20, filters).then(function(result) {
        expect(result.transactions.length).toBe(1);
        done();
      });
      $timeout.flush();
    });

    it('should combine cardIds and search term filters', function(done) {
      var filters = { cardIds: ['card1'], searchTerm: 'Shell' };
      TransactionFactory.fetchTransactions(1, 20, filters).then(function(result) {
        expect(result.transactions.length).toBe(1);
        expect(result.transactions[0].cardId).toBe('card1');
        expect(result.transactions[0].merchantName).toBe('Shell');
        done();
      });
      $timeout.flush();
    });

    it('should return empty array when no matches found', function(done) {
      var filters = { searchTerm: 'NonExistentMerchant' };
      TransactionFactory.fetchTransactions(1, 20, filters).then(function(result) {
        expect(result.transactions.length).toBe(0);
        expect(result.totalRecords).toBe(0);
        expect(result.totalPages).toBe(0);
        done();
      });
      $timeout.flush();
    });

    it('should handle empty filters object', function(done) {
      TransactionFactory.fetchTransactions(1, 20, {}).then(function(result) {
        expect(result.transactions.length).toBe(5);
        done();
      });
      $timeout.flush();
    });

    it('should handle null filters', function(done) {
      TransactionFactory.fetchTransactions(1, 20, null).then(function(result) {
        expect(result.transactions.length).toBe(5);
        done();
      });
      $timeout.flush();
    });

    it('should handle empty cardIds array', function(done) {
      var filters = { cardIds: [] };
      TransactionFactory.fetchTransactions(1, 20, filters).then(function(result) {
        expect(result.transactions.length).toBe(5);
        done();
      });
      $timeout.flush();
    });
  });

  describe('transaction data validation', function() {
    it('should include transactions from different categories', function(done) {
      TransactionFactory.getTransactions({}).then(function(transactions) {
        var categories = transactions.map(function(t) { return t.category; });
        var uniqueCategories = categories.filter(function(value, index, self) {
          return self.indexOf(value) === index;
        });
        expect(uniqueCategories.length).toBeGreaterThan(1);
        done();
      });
      $timeout.flush();
    });

    it('should include both Posted and Pending transactions', function(done) {
      TransactionFactory.getTransactions({}).then(function(transactions) {
        var hasPosted = transactions.some(function(t) { return t.status === 'Posted'; });
        var hasPending = transactions.some(function(t) { return t.status === 'Pending'; });
        expect(hasPosted).toBe(true);
        expect(hasPending).toBe(true);
        done();
      });
      $timeout.flush();
    });

    it('should have all transactions with INR currency', function(done) {
      TransactionFactory.getTransactions({}).then(function(transactions) {
        transactions.forEach(function(txn) {
          expect(txn.currency).toBe('INR');
        });
        done();
      });
      $timeout.flush();
    });
  });

  describe('edge cases', function() {
    it('should handle page beyond available data', function(done) {
      TransactionFactory.fetchTransactions(10, 20, {}).then(function(result) {
        expect(result.transactions.length).toBe(0);
        done();
      });
      $timeout.flush();
    });

    it('should handle very large page size', function(done) {
      TransactionFactory.fetchTransactions(1, 1000, {}).then(function(result) {
        expect(result.transactions.length).toBe(5);
        done();
      });
      $timeout.flush();
    });
  });
});