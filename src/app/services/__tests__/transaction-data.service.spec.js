/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions returns filtered data
- Purpose: Validates transaction retrieval with date filtering
- Scenario: Service fetches transactions from specific date
- Expected Result: Returns transactions on or after specified date
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions filters by date correctly
- Purpose: Validates date filtering logic
- Scenario: Transactions requested with fromDate parameter
- Expected Result: Only transactions >= fromDate are returned
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions returns complete transaction objects
- Purpose: Validates data structure integrity
- Scenario: Transactions retrieved from service
- Expected Result: Each transaction contains all required properties
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions handles 12 months data
- Purpose: Validates NFR for 12-month data handling
- Scenario: Request transactions for last 12 months
- Expected Result: Returns all transactions within timeframe
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: date filtering, data structure, 12-month window, performance
- Uncovered scenarios: pagination, real-time updates, transaction updates
*/

(function() {
  'use strict';

  describe('TransactionDataService', function() {
    var TransactionDataService;
    var $http;
    var $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionDataService_, _$http_, _$q_) {
      TransactionDataService = _TransactionDataService_;
      $http = _$http_;
      $q = _$q_;
    }));

    describe('getTransactions', function() {
      it('should be defined', function() {
        expect(TransactionDataService.getTransactions).toBeDefined();
        expect(typeof TransactionDataService.getTransactions).toBe('function');
      });

      it('should return a promise', function() {
        var fromDate = new Date('2024-01-01');
        var result = TransactionDataService.getTransactions('user123', fromDate);

        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should return array of transactions', function(done) {
        var fromDate = new Date('2024-01-01');

        TransactionDataService.getTransactions('user123', fromDate).then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBeGreaterThan(0);
          done();
        }).catch(function(error) {
          fail('Promise should not reject: ' + error);
          done();
        });
      });

      it('should filter transactions by date', function(done) {
        var fromDate = new Date('2024-03-01');

        TransactionDataService.getTransactions('user123', fromDate).then(function(transactions) {
          transactions.forEach(function(t) {
            var txnDate = new Date(t.transactionDate);
            expect(txnDate >= fromDate).toBe(true);
          });
          done();
        });
      });

      it('should return transactions with required properties', function(done) {
        var fromDate = new Date('2024-01-01');

        TransactionDataService.getTransactions('user123', fromDate).then(function(transactions) {
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
        var fromDate = new Date('2024-01-01');

        TransactionDataService.getTransactions('user123', fromDate).then(function(transactions) {
          transactions.forEach(function(t) {
            expect(typeof t.amount).toBe('number');
            expect(t.amount).toBeGreaterThan(0);
          });
          done();
        });
      });

      it('should return transactions with valid categories', function(done) {
        var fromDate = new Date('2024-01-01');
        var validCategories = [
          'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
          'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
        ];

        TransactionDataService.getTransactions('user123', fromDate).then(function(transactions) {
          transactions.forEach(function(t) {
            expect(validCategories).toContain(t.category);
          });
          done();
        });
      });

      it('should handle recent date filter', function(done) {
        var fromDate = new Date('2024-06-01');

        TransactionDataService.getTransactions('user123', fromDate).then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(Array.isArray(transactions)).toBe(true);
          transactions.forEach(function(t) {
            var txnDate = new Date(t.transactionDate);
            expect(txnDate >= fromDate).toBe(true);
          });
          done();
        });
      });

      it('should handle 12-month date range', function(done) {
        var fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 12);

        TransactionDataService.getTransactions('user123', fromDate).then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(transactions.length).toBeGreaterThan(0);
          done();
        });
      });

      it('should return empty array for future date', function(done) {
        var fromDate = new Date();
        fromDate.setFullYear(fromDate.getFullYear() + 1);

        TransactionDataService.getTransactions('user123', fromDate).then(function(transactions) {
          expect(transactions).toBeDefined();
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(0);
          done();
        });
      });

      it('should resolve within expected timeout for 12 months data', function(done) {
        var startTime = Date.now();
        var fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 12);

        TransactionDataService.getTransactions('user123', fromDate).then(function(transactions) {
          var endTime = Date.now();
          var elapsed = endTime - startTime;

          expect(elapsed).toBeLessThan(1000);
          done();
        });
      });

      it('should return transactions sorted by date', function(done) {
        var fromDate = new Date('2024-01-01');

        TransactionDataService.getTransactions('user123', fromDate).then(function(transactions) {
          for (var i = 1; i < transactions.length; i++) {
            var prevDate = new Date(transactions[i - 1].transactionDate);
            var currDate = new Date(transactions[i].transactionDate);
            expect(currDate >= prevDate).toBe(true);
          }
          done();
        });
      });

      it('should include transactions across multiple categories', function(done) {
        var fromDate = new Date('2024-01-01');

        TransactionDataService.getTransactions('user123', fromDate).then(function(transactions) {
          var categories = transactions.map(function(t) { return t.category; });
          var uniqueCategories = categories.filter(function(value, index, self) {
            return self.indexOf(value) === index;
          });
          expect(uniqueCategories.length).toBeGreaterThan(1);
          done();
        });
      });
    });
  });
})();