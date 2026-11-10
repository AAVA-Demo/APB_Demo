/*
Test Documentation:
- Test Name: CardAnalyticsService Test Suite
- Purpose: Validate card analytics calculation functionality
- Scenario: Tests metric calculation for card data including monthly spend, transactions, and averages
- Expected Result: Service should calculate accurate metrics and return them via promise
*/

(function() {
  'use strict';

  describe('CardAnalyticsService', function() {
    var CardAnalyticsService, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardAnalyticsService_, _$rootScope_) {
      CardAnalyticsService = _CardAnalyticsService_;
      $rootScope = _$rootScope_;
    }));

    describe('calculateMetrics', function() {
      it('should calculate metrics for valid card data', function() {
        var cardData = {
          cardId: 'card-123',
          outstandingAmount: 5000
        };

        var result;
        CardAnalyticsService.calculateMetrics(cardData).then(function(metrics) {
          result = metrics;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.cardId).toBe('card-123');
        expect(result.monthlySpend).toBe(5000);
      });

      it('should return promise', function() {
        var cardData = { cardId: 'test', outstandingAmount: 1000 };
        var promise = CardAnalyticsService.calculateMetrics(cardData);

        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');
      });

      it('should generate totalTransactions within valid range', function() {
        var cardData = { cardId: 'card-456', outstandingAmount: 3000 };

        var result;
        CardAnalyticsService.calculateMetrics(cardData).then(function(metrics) {
          result = metrics;
        });
        $rootScope.$digest();

        expect(result.totalTransactions).toBeGreaterThanOrEqual(10);
        expect(result.totalTransactions).toBeLessThanOrEqual(60);
      });

      it('should calculate averageTransactionAmount when outstandingAmount exists', function() {
        var cardData = { cardId: 'card-789', outstandingAmount: 2500 };

        var result;
        CardAnalyticsService.calculateMetrics(cardData).then(function(metrics) {
          result = metrics;
        });
        $rootScope.$digest();

        expect(result.averageTransactionAmount).toBeDefined();
        expect(parseFloat(result.averageTransactionAmount)).toBeGreaterThan(0);
      });

      it('should set lastTransactionDate to current date', function() {
        var cardData = { cardId: 'card-999', outstandingAmount: 1500 };
        var beforeTime = new Date();

        var result;
        CardAnalyticsService.calculateMetrics(cardData).then(function(metrics) {
          result = metrics;
        });
        $rootScope.$digest();

        var afterTime = new Date();
        expect(result.lastTransactionDate).toBeDefined();
        expect(result.lastTransactionDate.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
        expect(result.lastTransactionDate.getTime()).toBeLessThanOrEqual(afterTime.getTime());
      });

      it('should handle zero outstandingAmount', function() {
        var cardData = { cardId: 'card-000', outstandingAmount: 0 };

        var result;
        CardAnalyticsService.calculateMetrics(cardData).then(function(metrics) {
          result = metrics;
        });
        $rootScope.$digest();

        expect(result.monthlySpend).toBe(0);
        expect(result.averageTransactionAmount).toBe(0);
      });

      it('should handle undefined outstandingAmount', function() {
        var cardData = { cardId: 'card-undef' };

        var result;
        CardAnalyticsService.calculateMetrics(cardData).then(function(metrics) {
          result = metrics;
        });
        $rootScope.$digest();

        expect(result.monthlySpend).toBe(0);
        expect(result.averageTransactionAmount).toBe(0);
      });

      it('should include all required metric fields', function() {
        var cardData = { cardId: 'card-complete', outstandingAmount: 4000 };

        var result;
        CardAnalyticsService.calculateMetrics(cardData).then(function(metrics) {
          result = metrics;
        });
        $rootScope.$digest();

        expect(result.cardId).toBeDefined();
        expect(result.monthlySpend).toBeDefined();
        expect(result.totalTransactions).toBeDefined();
        expect(result.averageTransactionAmount).toBeDefined();
        expect(result.lastTransactionDate).toBeDefined();
      });

      it('should format averageTransactionAmount to 2 decimal places', function() {
        var cardData = { cardId: 'card-decimal', outstandingAmount: 3333.33 };

        var result;
        CardAnalyticsService.calculateMetrics(cardData).then(function(metrics) {
          result = metrics;
        });
        $rootScope.$digest();

        var decimalPlaces = result.averageTransactionAmount.toString().split('.')[1];
        if (decimalPlaces) {
          expect(decimalPlaces.length).toBeLessThanOrEqual(2);
        }
      });
    });

    describe('edge cases', function() {
      it('should handle very large outstandingAmount', function() {
        var cardData = { cardId: 'card-large', outstandingAmount: 999999.99 };

        var result;
        CardAnalyticsService.calculateMetrics(cardData).then(function(metrics) {
          result = metrics;
        });
        $rootScope.$digest();

        expect(result.monthlySpend).toBe(999999.99);
        expect(result.averageTransactionAmount).toBeDefined();
      });

      it('should handle negative outstandingAmount gracefully', function() {
        var cardData = { cardId: 'card-negative', outstandingAmount: -100 };

        var result;
        CardAnalyticsService.calculateMetrics(cardData).then(function(metrics) {
          result = metrics;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.cardId).toBe('card-negative');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: calculateMetrics()
- Scenarios covered:
  * Valid card data with outstanding amount
  * Promise resolution
  * Total transactions range validation
  * Average transaction calculation
  * Last transaction date generation
  * Zero outstanding amount handling
  * Undefined outstanding amount handling
  * All required metric fields presence
  * Decimal formatting validation
  * Large outstanding amount handling
  * Negative outstanding amount handling
- Uncovered scenarios: Historical transaction analysis, category-wise breakdown, fraud detection metrics
*/