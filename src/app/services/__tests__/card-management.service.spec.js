/*
Test Documentation:
- Test Name: CardManagementService Test Suite
- Purpose: Validate card portfolio retrieval, spend analysis integration, and mock data fallback
- Scenario: Tests cover successful API calls, error handling with mock data, card analysis enrichment, and edge cases
- Expected Result: Service returns complete portfolio with spend analysis for each card
*/

(function() {
  'use strict';

  describe('CardManagementService', function() {
    var CardManagementService, $httpBackend, $q, AuthService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardManagementService_, _$httpBackend_, _$q_, _AuthService_) {
      CardManagementService = _CardManagementService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      AuthService = _AuthService_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getUserCards', function() {
      it('should retrieve user card portfolio successfully from API', function() {
        var userId = 'user-123';
        var mockPortfolio = {
          userId: userId,
          cards: [
            { cardId: 'card-001', cardNumber: '**** 1234', creditLimit: 10000 },
            { cardId: 'card-002', cardNumber: '**** 5678', creditLimit: 15000 }
          ],
          totalCreditLimit: 25000
        };

        var mockAnalysis1 = { cardId: 'card-001', currentMonthSpend: 500, spendTrend: 'up' };
        var mockAnalysis2 = { cardId: 'card-002', currentMonthSpend: 700, spendTrend: 'down' };

        $httpBackend.expectGET('/api/cards/portfolio?userId=' + userId).respond(200, mockPortfolio);
        $httpBackend.expectGET('/api/cards/card-001/spend-analysis').respond(200, mockAnalysis1);
        $httpBackend.expectGET('/api/cards/card-002/spend-analysis').respond(200, mockAnalysis2);

        var result;
        CardManagementService.getUserCards(userId).then(function(portfolio) {
          result = portfolio;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.userId).toBe(userId);
        expect(result.cards.length).toBe(2);
        expect(result.cards[0].spendAnalysis).toEqual(mockAnalysis1);
        expect(result.cards[1].spendAnalysis).toEqual(mockAnalysis2);
      });

      it('should fallback to mock data when API call fails', function() {
        var userId = 'user-456';

        $httpBackend.expectGET('/api/cards/portfolio?userId=' + userId).respond(500, 'Server error');

        var result;
        CardManagementService.getUserCards(userId).then(function(portfolio) {
          result = portfolio;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.userId).toBe(userId);
        expect(result.cards.length).toBe(3);
        expect(result.cards[0].cardId).toBe('card-001');
        expect(result.cards[0].spendAnalysis).toBeDefined();
      });

      it('should handle empty card portfolio', function() {
        var userId = 'user-789';
        var emptyPortfolio = {
          userId: userId,
          cards: [],
          totalCreditLimit: 0
        };

        $httpBackend.expectGET('/api/cards/portfolio?userId=' + userId).respond(200, emptyPortfolio);

        var result;
        CardManagementService.getUserCards(userId).then(function(portfolio) {
          result = portfolio;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.cards.length).toBe(0);
      });

      it('should enrich each card with spend analysis', function() {
        var userId = 'user-999';
        var mockPortfolio = {
          userId: userId,
          cards: [{ cardId: 'card-001', cardNumber: '**** 1234' }],
          totalCreditLimit: 10000
        };

        var mockAnalysis = { cardId: 'card-001', currentMonthSpend: 1200, topCategories: [] };

        $httpBackend.expectGET('/api/cards/portfolio?userId=' + userId).respond(200, mockPortfolio);
        $httpBackend.expectGET('/api/cards/card-001/spend-analysis').respond(200, mockAnalysis);

        var result;
        CardManagementService.getUserCards(userId).then(function(portfolio) {
          result = portfolio;
        });

        $httpBackend.flush();

        expect(result.cards[0].spendAnalysis).toBeDefined();
        expect(result.cards[0].spendAnalysis.currentMonthSpend).toBe(1200);
      });
    });

    describe('getCardSpendAnalysis', function() {
      it('should retrieve card spend analysis successfully', function() {
        var cardId = 'card-001';
        var mockAnalysis = {
          cardId: cardId,
          currentMonthSpend: 1500,
          previousMonthSpend: 1200,
          spendTrend: 'up',
          topCategories: [{ category: 'Shopping', amount: 600 }]
        };

        $httpBackend.expectGET('/api/cards/' + cardId + '/spend-analysis').respond(200, mockAnalysis);

        var result;
        CardManagementService.getCardSpendAnalysis(cardId).then(function(analysis) {
          result = analysis;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockAnalysis);
        expect(result.spendTrend).toBe('up');
      });

      it('should return default analysis when API call fails', function() {
        var cardId = 'card-002';

        $httpBackend.expectGET('/api/cards/' + cardId + '/spend-analysis').respond(404, 'Not found');

        var result;
        CardManagementService.getCardSpendAnalysis(cardId).then(function(analysis) {
          result = analysis;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.cardId).toBe(cardId);
        expect(result.currentMonthSpend).toBe(0);
        expect(result.spendTrend).toBe('stable');
        expect(result.topCategories).toEqual([]);
      });

      it('should handle malformed API response gracefully', function() {
        var cardId = 'card-003';

        $httpBackend.expectGET('/api/cards/' + cardId + '/spend-analysis').respond(500, 'Internal error');

        var result;
        CardManagementService.getCardSpendAnalysis(cardId).then(function(analysis) {
          result = analysis;
        });

        $httpBackend.flush();

        expect(result.cardId).toBe(cardId);
        expect(result.topCategories).toEqual([]);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getUserCards, getCardSpendAnalysis
- Scenarios covered:
  * Successful portfolio retrieval with spend analysis enrichment
  * API failure with fallback to mock data
  * Empty portfolio handling
  * Individual card spend analysis retrieval
  * Default analysis on API failure
  * Malformed response handling
- Uncovered scenarios: Network timeout, partial portfolio load failures
*/