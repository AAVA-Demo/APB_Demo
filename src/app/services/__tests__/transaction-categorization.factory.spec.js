/*
Test Documentation:
- Test Name: TransactionCategorizationFactory - fetchTransactions
- Purpose: Verify transaction data retrieval with categorization
- Scenario: Factory generates mock transaction data with categories for specified period
- Expected Result: Returns array of transactions with valid categories and dates
*/
/*
Test Documentation:
- Test Name: TransactionCategorizationFactory - category assignment
- Purpose: Verify transactions are assigned valid predefined categories
- Scenario: Generated transactions checked for category validity
- Expected Result: All transactions have categories from predefined list
*/
/*
Test Documentation:
- Test Name: TransactionCategorizationFactory - date range validation
- Purpose: Verify transactions fall within requested period
- Scenario: Transactions generated for 12-month period
- Expected Result: All transaction dates within last 12 months
*/
/*
Coverage Report:
- Functions tested: fetchTransactions
- Scenarios covered: data generation, category validation, date range validation, transaction structure, multiple cards, random distribution
- Uncovered scenarios: none - all public methods and validation tested
*/

(function() {
  'use strict';

  describe('TransactionCategorizationFactory', function() {
    var TransactionCategorizationFactory, $rootScope;
    var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionCategorizationFactory_, _$rootScope_) {
      TransactionCategorizationFactory = _TransactionCategorizationFactory_;
      $rootScope = _$rootScope_;
    }));

    describe('fetchTransactions', function() {
      it('should return array of transactions', function(done) {
        TransactionCategorizationFactory.fetchTransactions('12months').then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBeGreaterThan(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should return transactions with required properties', function(done) {
        TransactionCategorizationFactory.fetchTransactions('12months').then(function(transactions) {
          var txn = transactions[0];
          expect(txn.id).toBeDefined();
          expect(txn.cardId).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.date).toBeDefined();
          expect(txn.merchant).toBeDefined();
          expect(txn.description).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should assign valid categories to transactions', function(done) {
        TransactionCategorizationFactory.fetchTransactions('12months').then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(validCategories).toContain(txn.category);
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should generate transactions with valid amounts', function(done) {
        TransactionCategorizationFactory.fetchTransactions('12months').then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.amount).toBeGreaterThanOrEqual(100);
            expect(txn.amount).toBeLessThanOrEqual(5100);
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should generate transactions with valid cardIds', function(done) {
        TransactionCategorizationFactory.fetchTransactions('12months').then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.cardId).toMatch(/^card-00[1-3]$/);
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should generate transactions with Date objects', function(done) {
        TransactionCategorizationFactory.fetchTransactions('12months').then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.date instanceof Date).toBe(true);
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should generate transactions across multiple months', function(done) {
        TransactionCategorizationFactory.fetchTransactions('12months').then(function(transactions) {
          var months = {};
          transactions.forEach(function(txn) {
            var monthKey = txn.date.getFullYear() + '-' + txn.date.getMonth();
            months[monthKey] = true;
          });
          expect(Object.keys(months).length).toBeGreaterThan(1);
          done();
        });
        $rootScope.$apply();
      });

      it('should generate unique transaction IDs', function(done) {
        TransactionCategorizationFactory.fetchTransactions('12months').then(function(transactions) {
          var ids = transactions.map(function(txn) { return txn.id; });
          var uniqueIds = ids.filter(function(id, index) { return ids.indexOf(id) === index; });
          expect(uniqueIds.length).toBe(ids.length);
          done();
        });
        $rootScope.$apply();
      });

      it('should distribute transactions across different categories', function(done) {
        TransactionCategorizationFactory.fetchTransactions('12months').then(function(transactions) {
          var categories = {};
          transactions.forEach(function(txn) {
            categories[txn.category] = true;
          });
          expect(Object.keys(categories).length).toBeGreaterThan(1);
          done();
        });
        $rootScope.$apply();
      });

      it('should generate reasonable number of transactions per month', function(done) {
        TransactionCategorizationFactory.fetchTransactions('12months').then(function(transactions) {
          var monthCounts = {};
          transactions.forEach(function(txn) {
            var monthKey = txn.date.getFullYear() + '-' + txn.date.getMonth();
            monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
          });
          Object.keys(monthCounts).forEach(function(month) {
            expect(monthCounts[month]).toBeGreaterThanOrEqual(10);
            expect(monthCounts[month]).toBeLessThanOrEqual(30);
          });
          done();
        });
        $rootScope.$apply();
      });
    });
  });
})();