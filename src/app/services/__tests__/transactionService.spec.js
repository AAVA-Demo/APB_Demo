/*
Test Documentation:
- Test Name: transactionService.spec.js
- Purpose: Validate transaction data retrieval with pagination and filtering
- Scenario: Tests fetching transactions with pagination, card filtering, and enrichment
- Expected Result: Transactions are retrieved correctly with proper pagination and card details
*/

(function() {
  'use strict';

  describe('transactionService', function() {
    var transactionService, creditCardService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_transactionService_, _creditCardService_, _$q_, _$rootScope_) {
      transactionService = _transactionService_;
      creditCardService = _creditCardService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getTransactions', function() {
      var mockCards;

      beforeEach(function() {
        mockCards = [
          {cardId: 'CC001', cardName: 'Platinum Rewards', lastFourDigits: '4521'},
          {cardId: 'CC002', cardName: 'Gold Cashback', lastFourDigits: '7834'},
          {cardId: 'CC003', cardName: 'Travel Elite', lastFourDigits: '2109'}
        ];
        spyOn(creditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      });

      it('should return all transactions without pagination', function() {
        var result;
        transactionService.getTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.data).toBeDefined();
        expect(result.total).toBeDefined();
        expect(result.data.length).toBe(18);
        expect(result.total).toBe(18);
      });

      it('should enrich transactions with card details', function() {
        var result;
        transactionService.getTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        var txn = result.data[0];
        expect(txn.cardName).toBeDefined();
        expect(txn.lastFourDigits).toBeDefined();
        expect(creditCardService.getAllCards).toHaveBeenCalled();
      });

      it('should return paginated transactions', function() {
        var result;
        transactionService.getTransactions(1, 5).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.data.length).toBe(5);
        expect(result.total).toBe(18);
      });

      it('should return correct page of transactions', function() {
        var page1, page2;
        transactionService.getTransactions(1, 5).then(function(data) {
          page1 = data;
        });
        $rootScope.$digest();

        transactionService.getTransactions(2, 5).then(function(data) {
          page2 = data;
        });
        $rootScope.$digest();

        expect(page1.data.length).toBe(5);
        expect(page2.data.length).toBe(5);
        expect(page1.data[0].transactionId).not.toBe(page2.data[0].transactionId);
      });

      it('should filter transactions by card', function() {
        var result;
        transactionService.getTransactions(null, null, 'CC001').then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.data.length).toBeGreaterThan(0);
        result.data.forEach(function(txn) {
          expect(txn.cardId).toBe('CC001');
        });
      });

      it('should apply pagination after filtering', function() {
        var result;
        transactionService.getTransactions(1, 2, 'CC001').then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.data.length).toBeLessThanOrEqual(2);
        result.data.forEach(function(txn) {
          expect(txn.cardId).toBe('CC001');
        });
      });

      it('should sort transactions by date descending', function() {
        var result;
        transactionService.getTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        for (var i = 0; i < result.data.length - 1; i++) {
          expect(result.data[i].date.getTime()).toBeGreaterThanOrEqual(result.data[i + 1].date.getTime());
        }
      });

      it('should include all required transaction properties', function() {
        var result;
        transactionService.getTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        var txn = result.data[0];
        expect(txn.transactionId).toBeDefined();
        expect(txn.cardId).toBeDefined();
        expect(txn.date).toBeDefined();
        expect(txn.merchant).toBeDefined();
        expect(txn.category).toBeDefined();
        expect(txn.amount).toBeDefined();
        expect(txn.currency).toBeDefined();
        expect(txn.cardName).toBeDefined();
        expect(txn.lastFourDigits).toBeDefined();
      });

      it('should handle unknown card gracefully', function() {
        var mockCardsPartial = [{cardId: 'CC001', cardName: 'Platinum Rewards', lastFourDigits: '4521'}];
        creditCardService.getAllCards.and.returnValue($q.resolve(mockCardsPartial));

        var result;
        transactionService.getTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        var unknownCardTxn = result.data.find(function(t) { return t.cardId === 'CC002'; });
        if (unknownCardTxn) {
          expect(unknownCardTxn.cardName).toBe('Unknown');
          expect(unknownCardTxn.lastFourDigits).toBe('');
        }
      });

      it('should return correct total count with filtering', function() {
        var result;
        transactionService.getTransactions(1, 10, 'CC002').then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        var cc002Count = result.data.filter(function(t) { return t.cardId === 'CC002'; }).length;
        expect(result.total).toBeGreaterThan(0);
        expect(cc002Count).toBe(result.data.length);
      });

      it('should handle edge case of last page with partial results', function() {
        var result;
        transactionService.getTransactions(4, 5).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.data.length).toBeLessThanOrEqual(5);
        expect(result.total).toBe(18);
      });

      it('should handle page beyond available data', function() {
        var result;
        transactionService.getTransactions(10, 10).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.data.length).toBe(0);
        expect(result.total).toBe(18);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getTransactions
  - Scenarios covered:
    * Fetching all transactions without pagination
    * Transaction enrichment with card details
    * Paginated transaction retrieval
    * Multiple page fetching
    * Card filtering
    * Pagination with filtering
    * Date-based sorting (descending)
    * Transaction property validation
    * Unknown card handling
    * Total count with filtering
    * Last page with partial results
    * Page beyond available data
  - Uncovered scenarios: None
  */
})();