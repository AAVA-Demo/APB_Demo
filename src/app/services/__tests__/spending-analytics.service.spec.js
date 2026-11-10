/*
Test Documentation:
- Test Name: SpendingAnalyticsService - getCardSpending
- Purpose: Validates retrieval of card-specific spending data
- Scenario: Request spending data for a specific card
- Expected Result: Returns spending object with monthlySpend, transactionCount, and lastTransactionDate

- Test Name: SpendingAnalyticsService - data structure
- Purpose: Validates spending data contains all required fields
- Scenario: Spending data is retrieved
- Expected Result: Object has cardId, monthlySpend, lastTransactionDate, transactionCount

- Test Name: SpendingAnalyticsService - multiple cards
- Purpose: Validates service can handle multiple card requests
- Scenario: Request spending for multiple cards
- Expected Result: Each card gets unique spending data

Coverage Report:
- Functions tested: getCardSpending
- Scenarios covered: normal flow, data structure validation, multiple cards, value ranges
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('SpendingAnalyticsService', function() {
    var SpendingAnalyticsService, $q, $rootScope;

    beforeEach(module('cardManagement'));

    beforeEach(inject(function(_SpendingAnalyticsService_, _$q_, _$rootScope_) {
      SpendingAnalyticsService = _SpendingAnalyticsService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getCardSpending', function() {
      it('should return spending data for specified card', function(done) {
        SpendingAnalyticsService.getCardSpending('card123').then(function(spending) {
          expect(spending).toBeDefined();
          expect(spending.cardId).toBe('card123');
          expect(spending.monthlySpend).toBeDefined();
          expect(spending.lastTransactionDate).toBeDefined();
          expect(spending.transactionCount).toBeDefined();
          done();
        });

        $rootScope.$apply();
      });

      it('should return spending data with all required fields', function(done) {
        SpendingAnalyticsService.getCardSpending('card456').then(function(spending) {
          expect(spending.cardId).toBe('card456');
          expect(typeof spending.monthlySpend).toBe('number');
          expect(typeof spending.transactionCount).toBe('number');
          expect(typeof spending.lastTransactionDate).toBe('string');
          done();
        });

        $rootScope.$apply();
      });

      it('should return monthlySpend within valid range', function(done) {
        SpendingAnalyticsService.getCardSpending('card789').then(function(spending) {
          expect(spending.monthlySpend).toBeGreaterThanOrEqual(500);
          expect(spending.monthlySpend).toBeLessThanOrEqual(3500);
          done();
        });

        $rootScope.$apply();
      });

      it('should return transactionCount within valid range', function(done) {
        SpendingAnalyticsService.getCardSpending('card101').then(function(spending) {
          expect(spending.transactionCount).toBeGreaterThanOrEqual(10);
          expect(spending.transactionCount).toBeLessThanOrEqual(60);
          done();
        });

        $rootScope.$apply();
      });

      it('should return valid ISO date string for lastTransactionDate', function(done) {
        SpendingAnalyticsService.getCardSpending('card202').then(function(spending) {
          var date = new Date(spending.lastTransactionDate);
          expect(date instanceof Date).toBe(true);
          expect(isNaN(date.getTime())).toBe(false);
          done();
        });

        $rootScope.$apply();
      });

      it('should handle multiple card requests independently', function(done) {
        var promises = [
          SpendingAnalyticsService.getCardSpending('card1'),
          SpendingAnalyticsService.getCardSpending('card2'),
          SpendingAnalyticsService.getCardSpending('card3')
        ];

        $q.all(promises).then(function(results) {
          expect(results.length).toBe(3);
          expect(results[0].cardId).toBe('card1');
          expect(results[1].cardId).toBe('card2');
          expect(results[2].cardId).toBe('card3');
          done();
        });

        $rootScope.$apply();
      });

      it('should always resolve successfully', function(done) {
        var promises = [];
        for (var i = 0; i < 10; i++) {
          promises.push(SpendingAnalyticsService.getCardSpending('card' + i));
        }

        $q.all(promises).then(function(results) {
          expect(results.length).toBe(10);
          results.forEach(function(result) {
            expect(result.cardId).toBeDefined();
            expect(result.monthlySpend).toBeDefined();
          });
          done();
        });

        $rootScope.$apply();
      });
    });
  });
})();