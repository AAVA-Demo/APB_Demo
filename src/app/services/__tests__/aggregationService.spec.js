/*
Test Documentation:
- Test Name: aggregationService.spec.js
- Purpose: Validate aggregation service functionality for spending analytics
- Scenario: Tests category-wise spending, monthly trends, and card-wise analysis
- Expected Result: All aggregation calculations return accurate results
*/

(function() {
  'use strict';

  describe('aggregationService', function() {
    var aggregationService, transactionService, categorizationService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_aggregationService_, _transactionService_, _categorizationService_, _$q_, _$rootScope_) {
      aggregationService = _aggregationService_;
      transactionService = _transactionService_;
      categorizationService = _categorizationService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getSpendingAnalytics', function() {
      var mockTransactionData;

      beforeEach(function() {
        mockTransactionData = {
          data: [
            {transactionId: 'T001', cardId: 'CC001', cardName: 'Platinum Rewards', date: new Date('2026-11-01'), merchant: 'Starbucks', category: 'Food & Dining', amount: 450},
            {transactionId: 'T002', cardId: 'CC001', cardName: 'Platinum Rewards', date: new Date('2026-11-02'), merchant: 'Shell Fuel', category: 'Fuel', amount: 2500},
            {transactionId: 'T003', cardId: 'CC002', cardName: 'Gold Cashback', date: new Date('2026-11-03'), merchant: 'Amazon', category: 'Shopping', amount: 3200},
            {transactionId: 'T004', cardId: 'CC003', cardName: 'Travel Elite', date: new Date('2026-10-04'), merchant: 'Uber', category: 'Travel', amount: 850}
          ],
          total: 4
        };
      });

      it('should aggregate spending analytics successfully', function() {
        spyOn(transactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
        spyOn(categorizationService, 'categorizeTransactions').and.callFake(function(data) { return data; });

        var result;
        aggregationService.getSpendingAnalytics().then(function(analytics) {
          result = analytics;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.categoryData).toBeDefined();
        expect(result.monthlyTrends).toBeDefined();
        expect(result.cardWiseData).toBeDefined();
        expect(transactionService.getTransactions).toHaveBeenCalled();
        expect(categorizationService.categorizeTransactions).toHaveBeenCalledWith(mockTransactionData.data);
      });

      it('should calculate category-wise spending correctly', function() {
        spyOn(transactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
        spyOn(categorizationService, 'categorizeTransactions').and.callFake(function(data) { return data; });

        var result;
        aggregationService.getSpendingAnalytics().then(function(analytics) {
          result = analytics;
        });
        $rootScope.$digest();

        expect(result.categoryData.length).toBe(9);
        var foodDining = result.categoryData.find(function(c) { return c.category === 'Food & Dining'; });
        expect(foodDining.totalAmount).toBe(450);
        expect(foodDining.transactionCount).toBe(1);
        var fuel = result.categoryData.find(function(c) { return c.category === 'Fuel'; });
        expect(fuel.totalAmount).toBe(2500);
      });

      it('should calculate percentage correctly for each category', function() {
        spyOn(transactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
        spyOn(categorizationService, 'categorizeTransactions').and.callFake(function(data) { return data; });

        var result;
        aggregationService.getSpendingAnalytics().then(function(analytics) {
          result = analytics;
        });
        $rootScope.$digest();

        var grandTotal = 450 + 2500 + 3200 + 850;
        var foodDining = result.categoryData.find(function(c) { return c.category === 'Food & Dining'; });
        expect(parseFloat(foodDining.percentage)).toBeCloseTo((450 / grandTotal * 100), 1);
      });

      it('should group transactions by month correctly', function() {
        spyOn(transactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
        spyOn(categorizationService, 'categorizeTransactions').and.callFake(function(data) { return data; });

        var result;
        aggregationService.getSpendingAnalytics().then(function(analytics) {
          result = analytics;
        });
        $rootScope.$digest();

        expect(result.monthlyTrends.length).toBe(2);
        var nov2026 = result.monthlyTrends.find(function(m) { return m.month === '2026-11'; });
        expect(nov2026).toBeDefined();
        expect(nov2026.totalSpend).toBe(6150);
        expect(nov2026.categoryBreakdown).toBeDefined();
        expect(nov2026.categoryBreakdown.length).toBe(9);
      });

      it('should calculate card-wise spending correctly', function() {
        spyOn(transactionService, 'getTransactions').and.returnValue($q.resolve(mockTransactionData));
        spyOn(categorizationService, 'categorizeTransactions').and.callFake(function(data) { return data; });

        var result;
        aggregationService.getSpendingAnalytics().then(function(analytics) {
          result = analytics;
        });
        $rootScope.$digest();

        expect(result.cardWiseData.length).toBe(3);
        var cc001 = result.cardWiseData.find(function(c) { return c.cardId === 'CC001'; });
        expect(cc001.totalSpend).toBe(2950);
        expect(cc001.cardName).toBe('Platinum Rewards');
        expect(cc001.categoryBreakdown).toBeDefined();
        expect(cc001.categoryBreakdown.length).toBe(9);
      });

      it('should handle empty transaction data', function() {
        spyOn(transactionService, 'getTransactions').and.returnValue($q.resolve({data: [], total: 0}));
        spyOn(categorizationService, 'categorizeTransactions').and.callFake(function(data) { return data; });

        var result;
        aggregationService.getSpendingAnalytics().then(function(analytics) {
          result = analytics;
        });
        $rootScope.$digest();

        expect(result.categoryData.length).toBe(9);
        expect(result.monthlyTrends.length).toBe(0);
        expect(result.cardWiseData.length).toBe(0);
        result.categoryData.forEach(function(cat) {
          expect(cat.totalAmount).toBe(0);
          expect(cat.transactionCount).toBe(0);
        });
      });

      it('should handle service errors gracefully', function() {
        spyOn(transactionService, 'getTransactions').and.returnValue($q.reject('Service error'));

        var error;
        aggregationService.getSpendingAnalytics().catch(function(err) {
          error = err;
        });
        $rootScope.$digest();

        expect(error).toBe('Service error');
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getSpendingAnalytics
  - Scenarios covered:
    * Successful analytics aggregation
    * Category-wise spending calculation
    * Percentage calculation for categories
    * Monthly trend grouping
    * Card-wise spending analysis
    * Empty data handling
    * Error handling
  - Uncovered scenarios: None
  */
})();