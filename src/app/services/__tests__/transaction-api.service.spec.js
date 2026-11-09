/*
Test Documentation:
- Test Name: TransactionApiService - fetchTransactions
- Purpose: Validates that TransactionApiService.fetchTransactions correctly filters and returns transactions based on userId, date range, and cardId
- Scenario: Service is initialized and fetchTransactions is called with various filter combinations
- Expected Result: Returns a promise resolving to an array of transaction objects filtered by the provided criteria
*/
/*
Coverage Report:
- Functions tested: fetchTransactions
- Scenarios covered: no filters, cardId filter, startDate filter, endDate filter, combined filters, edge cases
- Uncovered scenarios: HTTP error handling (not applicable for mock implementation)
*/

(function() {
  'use strict';

  describe('TransactionApiService', function() {
    var TransactionApiService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionApiService_, _$q_, _$rootScope_) {
      TransactionApiService = _TransactionApiService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('fetchTransactions', function() {
      it('should be defined', function() {
        expect(TransactionApiService.fetchTransactions).toBeDefined();
        expect(typeof TransactionApiService.fetchTransactions).toBe('function');
      });

      it('should return a promise', function() {
        var result = TransactionApiService.fetchTransactions('user123');
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should resolve with an array of transactions when no filters applied', function(done) {
        TransactionApiService.fetchTransactions('user123', null, null, null).then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBeGreaterThan(0);
          done();
        });
        $rootScope.$digest();
      });

      it('should return transactions with correct structure', function(done) {
        TransactionApiService.fetchTransactions('user123').then(function(transactions) {
          var txn = transactions[0];
          expect(txn.transactionId).toBeDefined();
          expect(txn.cardId).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.date).toBeDefined();
          expect(txn.description).toBeDefined();
          expect(txn.merchantName).toBeDefined();
          expect(txn.status).toBeDefined();
          done();
        });
        $rootScope.$digest();
      });

      it('should filter transactions by cardId', function(done) {
        TransactionApiService.fetchTransactions('user123', null, null, 'card001').then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          transactions.forEach(function(txn) {
            expect(txn.cardId).toBe('card001');
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should return multiple transactions for card001', function(done) {
        TransactionApiService.fetchTransactions('user123', null, null, 'card001').then(function(transactions) {
          expect(transactions.length).toBeGreaterThan(1);
          done();
        });
        $rootScope.$digest();
      });

      it('should filter transactions by startDate', function(done) {
        var startDate = new Date(2024, 9, 1);
        TransactionApiService.fetchTransactions('user123', startDate, null, null).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(new Date(txn.date).getTime()).toBeGreaterThanOrEqual(startDate.getTime());
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should filter transactions by endDate', function(done) {
        var endDate = new Date(2024, 10, 1);
        TransactionApiService.fetchTransactions('user123', null, endDate, null).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(new Date(txn.date).getTime()).toBeLessThanOrEqual(endDate.getTime());
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should filter transactions by date range', function(done) {
        var startDate = new Date(2024, 9, 1);
        var endDate = new Date(2024, 10, 30);
        TransactionApiService.fetchTransactions('user123', startDate, endDate, null).then(function(transactions) {
          transactions.forEach(function(txn) {
            var txnDate = new Date(txn.date).getTime();
            expect(txnDate).toBeGreaterThanOrEqual(startDate.getTime());
            expect(txnDate).toBeLessThanOrEqual(endDate.getTime());
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should filter transactions by cardId and date range', function(done) {
        var startDate = new Date(2024, 10, 1);
        var endDate = new Date(2024, 10, 30);
        TransactionApiService.fetchTransactions('user123', startDate, endDate, 'card001').then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.cardId).toBe('card001');
            var txnDate = new Date(txn.date).getTime();
            expect(txnDate).toBeGreaterThanOrEqual(startDate.getTime());
            expect(txnDate).toBeLessThanOrEqual(endDate.getTime());
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should return empty array for non-existent cardId', function(done) {
        TransactionApiService.fetchTransactions('user123', null, null, 'nonExistentCard').then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(0);
          done();
        });
        $rootScope.$digest();
      });

      it('should return transactions with numeric amounts', function(done) {
        TransactionApiService.fetchTransactions('user123').then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(typeof txn.amount).toBe('number');
            expect(txn.amount).toBeGreaterThan(0);
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should return transactions with valid categories', function(done) {
        var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        TransactionApiService.fetchTransactions('user123').then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(validCategories).toContain(txn.category);
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should return transactions with valid status', function(done) {
        var validStatuses = ['Posted', 'Pending'];
        TransactionApiService.fetchTransactions('user123').then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(validStatuses).toContain(txn.status);
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should handle edge case with future startDate', function(done) {
        var futureDate = new Date(2025, 0, 1);
        TransactionApiService.fetchTransactions('user123', futureDate, null, null).then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(0);
          done();
        });
        $rootScope.$digest();
      });

      it('should handle edge case with past endDate', function(done) {
        var pastDate = new Date(2020, 0, 1);
        TransactionApiService.fetchTransactions('user123', null, pastDate, null).then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(0);
          done();
        });
        $rootScope.$digest();
      });

      it('should return all transactions when all filters are null', function(done) {
        TransactionApiService.fetchTransactions('user123', null, null, null).then(function(transactions) {
          expect(transactions.length).toBe(13);
          done();
        });
        $rootScope.$digest();
      });

      it('should return transactions for multiple cards when no cardId filter', function(done) {
        TransactionApiService.fetchTransactions('user123').then(function(transactions) {
          var cardIds = transactions.map(function(txn) { return txn.cardId; });
          var uniqueCardIds = cardIds.filter(function(id, index) {
            return cardIds.indexOf(id) === index;
          });
          expect(uniqueCardIds.length).toBeGreaterThan(1);
          done();
        });
        $rootScope.$digest();
      });

      it('should return transactions with Date objects for date field', function(done) {
        TransactionApiService.fetchTransactions('user123').then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.date instanceof Date).toBe(true);
          });
          done();
        });
        $rootScope.$digest();
      });

      it('should filter correctly when startDate equals transaction date', function(done) {
        var exactDate = new Date(2024, 10, 15);
        TransactionApiService.fetchTransactions('user123', exactDate, null, null).then(function(transactions) {
          var found = transactions.some(function(txn) {
            return txn.date.getTime() === exactDate.getTime();
          });
          expect(found).toBe(true);
          done();
        });
        $rootScope.$digest();
      });

      it('should filter correctly when endDate equals transaction date', function(done) {
        var exactDate = new Date(2024, 10, 15);
        TransactionApiService.fetchTransactions('user123', null, exactDate, null).then(function(transactions) {
          var found = transactions.some(function(txn) {
            return txn.date.getTime() === exactDate.getTime();
          });
          expect(found).toBe(true);
          done();
        });
        $rootScope.$digest();
      });
    });
  });
})();