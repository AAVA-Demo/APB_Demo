/*
Test Documentation:
- Test Name: CardAnalyticsService - getCardAnalytics success
- Purpose: Validates retrieval of card analytics data
- Scenario: Request analytics for valid card ID
- Expected Result: Returns analytics object with monthly trends and category breakdown
*/
/*
Test Documentation:
- Test Name: CardAnalyticsService - getCardAnalytics with different cardId
- Purpose: Validates analytics retrieval for different cards
- Scenario: Request analytics for different card IDs
- Expected Result: Returns analytics with correct cardId
*/
/*
Test Documentation:
- Test Name: CardAnalyticsService - getCardAnalytics async behavior
- Purpose: Validates asynchronous promise resolution
- Scenario: Analytics data returned after timeout
- Expected Result: Promise resolves after delay with analytics data
*/
/*
Coverage Report:
- Functions tested: getCardAnalytics
- Scenarios covered: successful analytics retrieval, multiple card IDs, async promise resolution, data structure validation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardAnalyticsService', function() {
    var CardAnalyticsService, $rootScope, $timeout;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardAnalyticsService_, _$rootScope_, _$timeout_) {
      CardAnalyticsService = _CardAnalyticsService_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    }));

    describe('getCardAnalytics', function() {
      it('should return analytics data for given card ID', function() {
        var cardId = 'card1';
        var result;

        CardAnalyticsService.getCardAnalytics(cardId).then(function(analytics) {
          result = analytics;
        });

        $timeout.flush();

        expect(result).toBeDefined();
        expect(result.cardId).toBe(cardId);
        expect(result.monthlyTrends).toBeDefined();
        expect(result.monthlyTrends.length).toBe(6);
        expect(result.categoryBreakdown).toBeDefined();
      });

      it('should return analytics with correct monthly trends structure', function() {
        var result;

        CardAnalyticsService.getCardAnalytics('card2').then(function(analytics) {
          result = analytics;
        });

        $timeout.flush();

        expect(result.monthlyTrends[0]).toEqual({ month: 'Jan', spend: 10000 });
        expect(result.monthlyTrends[1]).toEqual({ month: 'Feb', spend: 12000 });
        expect(result.monthlyTrends[5]).toEqual({ month: 'Jun', spend: 14000 });
      });

      it('should return analytics with category breakdown', function() {
        var result;

        CardAnalyticsService.getCardAnalytics('card3').then(function(analytics) {
          result = analytics;
        });

        $timeout.flush();

        expect(result.categoryBreakdown['Food & Dining']).toBe(4000);
        expect(result.categoryBreakdown['Fuel']).toBe(2000);
        expect(result.categoryBreakdown['Shopping']).toBe(3500);
        expect(result.categoryBreakdown['Travel']).toBe(2500);
        expect(result.categoryBreakdown['Entertainment']).toBe(1500);
        expect(result.categoryBreakdown['Utilities']).toBe(1000);
      });

      it('should return analytics with lastTransactionDate and averageMonthlySpend', function() {
        var result;

        CardAnalyticsService.getCardAnalytics('card1').then(function(analytics) {
          result = analytics;
        });

        $timeout.flush();

        expect(result.lastTransactionDate).toBe('2024-06-15');
        expect(result.averageMonthlySpend).toBe(12166.67);
      });

      it('should return promise that resolves asynchronously', function() {
        var resolved = false;

        CardAnalyticsService.getCardAnalytics('card1').then(function() {
          resolved = true;
        });

        expect(resolved).toBe(false);

        $timeout.flush();

        expect(resolved).toBe(true);
      });

      it('should return analytics with cardId matching input', function() {
        var testCardIds = ['card1', 'card2', 'card3', 'cardX'];

        testCardIds.forEach(function(cardId) {
          var result;
          CardAnalyticsService.getCardAnalytics(cardId).then(function(analytics) {
            result = analytics;
          });

          $timeout.flush();

          expect(result.cardId).toBe(cardId);
        });
      });
    });
  });
})();