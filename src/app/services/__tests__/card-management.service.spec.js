/*
Test Documentation:
- Test Name: CardManagementService - getCardPortfolio
- Purpose: Validates retrieval and enrichment of user card portfolio
- Scenario: User has multiple cards with spending data
- Expected Result: Returns enriched portfolio with card details and spending analytics

- Test Name: CardManagementService - portfolio aggregation
- Purpose: Validates portfolio metadata calculation
- Scenario: Cards have different statuses
- Expected Result: Returns correct totalCards and activeCards counts

- Test Name: CardManagementService - error handling
- Purpose: Validates error propagation from dependencies
- Scenario: CardRepositoryFactory fails
- Expected Result: Promise is rejected with error

Coverage Report:
- Functions tested: getCardPortfolio
- Scenarios covered: normal flow, multiple cards, error handling, active card filtering
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardManagementService', function() {
    var CardManagementService, CardRepositoryFactory, SpendingAnalyticsService, $q, $rootScope;

    beforeEach(module('cardManagement'));

    beforeEach(inject(function(_CardManagementService_, _CardRepositoryFactory_, _SpendingAnalyticsService_, _$q_, _$rootScope_) {
      CardManagementService = _CardManagementService_;
      CardRepositoryFactory = _CardRepositoryFactory_;
      SpendingAnalyticsService = _SpendingAnalyticsService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getCardPortfolio', function() {
      it('should retrieve and enrich card portfolio with spending data', function(done) {
        var mockCards = [
          {cardId: 'c1', cardNumber: '****1234', status: 'active'},
          {cardId: 'c2', cardNumber: '****5678', status: 'active'}
        ];

        spyOn(CardRepositoryFactory, 'getUserCards').and.returnValue($q.resolve(mockCards));
        spyOn(SpendingAnalyticsService, 'getCardSpending').and.callFake(function(cardId) {
          return $q.resolve({monthlySpend: 1000, transactionCount: 25});
        });

        CardManagementService.getCardPortfolio('user123').then(function(portfolio) {
          expect(portfolio.userId).toBe('user123');
          expect(portfolio.cards.length).toBe(2);
          expect(portfolio.totalCards).toBe(2);
          expect(portfolio.activeCards).toBe(2);
          expect(portfolio.cards[0].monthlySpend).toBe(1000);
          expect(portfolio.cards[0].transactionCount).toBe(25);
          done();
        });

        $rootScope.$apply();
      });

      it('should correctly count active cards', function(done) {
        var mockCards = [
          {cardId: 'c1', status: 'active'},
          {cardId: 'c2', status: 'inactive'},
          {cardId: 'c3', status: 'active'}
        ];

        spyOn(CardRepositoryFactory, 'getUserCards').and.returnValue($q.resolve(mockCards));
        spyOn(SpendingAnalyticsService, 'getCardSpending').and.returnValue($q.resolve({monthlySpend: 500, transactionCount: 10}));

        CardManagementService.getCardPortfolio('user123').then(function(portfolio) {
          expect(portfolio.totalCards).toBe(3);
          expect(portfolio.activeCards).toBe(2);
          done();
        });

        $rootScope.$apply();
      });

      it('should handle empty card list', function(done) {
        spyOn(CardRepositoryFactory, 'getUserCards').and.returnValue($q.resolve([]));

        CardManagementService.getCardPortfolio('user123').then(function(portfolio) {
          expect(portfolio.cards.length).toBe(0);
          expect(portfolio.totalCards).toBe(0);
          expect(portfolio.activeCards).toBe(0);
          done();
        });

        $rootScope.$apply();
      });

      it('should reject promise when card repository fails', function(done) {
        spyOn(CardRepositoryFactory, 'getUserCards').and.returnValue($q.reject('Database error'));

        CardManagementService.getCardPortfolio('user123').catch(function(error) {
          expect(error).toBe('Database error');
          done();
        });

        $rootScope.$apply();
      });

      it('should handle spending analytics failure for individual cards', function(done) {
        var mockCards = [{cardId: 'c1', status: 'active'}];

        spyOn(CardRepositoryFactory, 'getUserCards').and.returnValue($q.resolve(mockCards));
        spyOn(SpendingAnalyticsService, 'getCardSpending').and.returnValue($q.reject('Analytics service unavailable'));

        CardManagementService.getCardPortfolio('user123').catch(function(error) {
          expect(error).toBe('Analytics service unavailable');
          done();
        });

        $rootScope.$apply();
      });
    });
  });
})();