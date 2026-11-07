/*
Test Documentation:
- Test Name: AnalyticsService Test Suite
- Purpose: Validate AnalyticsService functionality for category breakdown, monthly trends, and card-wise spending
- Scenario: Tests promise resolution, data aggregation, and error handling
- Expected Result: All functions return correct aggregated data with proper promise handling
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, TransactionService, $rootScope, $q;
    var mockTransactions;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AnalyticsService_, _TransactionService_, _$rootScope_, _$q_) {
      AnalyticsService = _AnalyticsService_;
      TransactionService = _TransactionService_;
      $rootScope = _$rootScope_;
      $q = _$q_;

      mockTransactions = [
        {id: 1, cardId: 1, date: new Date('2024-01-15'), category: 'Food & Dining', amount: 125.50},
        {id: 2, cardId: 1, date: new Date('2024-01-16'), category: 'Fuel', amount: 55.00},
        {id: 3, cardId: 2, date: new Date('2024-02-17'), category: 'Shopping', amount: 299.99},
        {id: 4, cardId: 1, date: new Date('2024-01-18'), category: 'Food & Dining', amount: 85.00}
      ];
    }));

    describe('getCategoryBreakdown', function() {
      it('should return category-wise spending breakdown', function(done) {
        spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.resolve(mockTransactions));

        AnalyticsService.getCategoryBreakdown().then(function(result) {
          expect(result['Food & Dining']).toBe(210.50);
          expect(result['Fuel']).toBe(55.00);
          expect(result['Shopping']).toBe(299.99);
          expect(Object.keys(result).length).toBe(3);
          done();
        });

        $rootScope.$digest();
      });

      it('should handle empty transactions array', function(done) {
        spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.resolve([]));

        AnalyticsService.getCategoryBreakdown().then(function(result) {
          expect(result).toEqual({});
          expect(Object.keys(result).length).toBe(0);
          done();
        });

        $rootScope.$digest();
      });

      it('should handle service rejection', function(done) {
        spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.reject('Error'));

        AnalyticsService.getCategoryBreakdown().catch(function(error) {
          expect(error).toBe('Error');
          done();
        });

        $rootScope.$digest();
      });
    });

    describe('getMonthlyTrends', function() {
      it('should return monthly spending trends sorted by date', function(done) {
        spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.resolve(mockTransactions));

        AnalyticsService.getMonthlyTrends().then(function(result) {
          expect(result.length).toBe(2);
          expect(result[0].month).toBe('2024-1');
          expect(result[0].amount).toBe(265.50);
          expect(result[1].month).toBe('2024-2');
          expect(result[1].amount).toBe(299.99);
          done();
        });

        $rootScope.$digest();
      });

      it('should aggregate multiple transactions in same month', function(done) {
        var sameMonthTransactions = [
          {id: 1, date: new Date('2024-01-05'), amount: 100},
          {id: 2, date: new Date('2024-01-15'), amount: 200},
          {id: 3, date: new Date('2024-01-25'), amount: 150}
        ];
        spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.resolve(sameMonthTransactions));

        AnalyticsService.getMonthlyTrends().then(function(result) {
          expect(result.length).toBe(1);
          expect(result[0].amount).toBe(450);
          done();
        });

        $rootScope.$digest();
      });

      it('should handle empty transactions', function(done) {
        spyOn(TransactionService, 'getAllTransactions').and.returnValue($q.resolve([]));

        AnalyticsService.getMonthlyTrends().then(function(result) {
          expect(result).toEqual([]);
          done();
        });

        $rootScope.$digest();
      });
    });

    describe('getCardWiseSpending', function() {
      it('should return spending analytics for specific card', function(done) {
        var cardTransactions = [
          {id: 1, cardId: 1, category: 'Food & Dining', amount: 125.50},
          {id: 2, cardId: 1, category: 'Fuel', amount: 55.00},
          {id: 4, cardId: 1, category: 'Food & Dining', amount: 85.00}
        ];
        spyOn(TransactionService, 'getTransactionsByCardId').and.returnValue($q.resolve(cardTransactions));

        AnalyticsService.getCardWiseSpending(1).then(function(result) {
          expect(result.total).toBe(265.50);
          expect(result.transactionCount).toBe(3);
          expect(result.categories['Food & Dining']).toBe(210.50);
          expect(result.categories['Fuel']).toBe(55.00);
          done();
        });

        $rootScope.$digest();
      });

      it('should handle card with no transactions', function(done) {
        spyOn(TransactionService, 'getTransactionsByCardId').and.returnValue($q.resolve([]));

        AnalyticsService.getCardWiseSpending(999).then(function(result) {
          expect(result.total).toBe(0);
          expect(result.transactionCount).toBe(0);
          expect(result.categories).toEqual({});
          done();
        });

        $rootScope.$digest();
      });

      it('should handle service error', function(done) {
        spyOn(TransactionService, 'getTransactionsByCardId').and.returnValue($q.reject('Card not found'));

        AnalyticsService.getCardWiseSpending(999).catch(function(error) {
          expect(error).toBe('Card not found');
          done();
        });

        $rootScope.$digest();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getCategoryBreakdown, getMonthlyTrends, getCardWiseSpending
- Scenarios covered: 
  * Normal data aggregation
  * Empty data handling
  * Error/rejection handling
  * Multiple transactions in same period
  * Category grouping
  * Card-specific filtering
- Edge cases: Empty arrays, invalid card IDs, service rejections
- Uncovered scenarios: None - all public methods tested
*/