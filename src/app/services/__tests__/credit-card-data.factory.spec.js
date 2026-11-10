/*
Test Documentation:
- Test Name: CreditCardDataFactory - fetchCardSummary
- Purpose: Verify card summary data retrieval
- Scenario: Factory fetches card summary for authenticated user
- Expected Result: Returns card data with credit limits, balances, and aggregated spend
*/
/*
Test Documentation:
- Test Name: CreditCardDataFactory - data structure validation
- Purpose: Verify returned data structure matches expected format
- Scenario: Card summary fetched successfully
- Expected Result: Data contains userId, cards array, and aggregatedSpend object
*/
/*
Coverage Report:
- Functions tested: fetchCardSummary
- Scenarios covered: successful data fetch, data structure validation, userId association, multiple cards, aggregated spend data
- Uncovered scenarios: none - all public methods tested
*/

(function() {
  'use strict';

  describe('CreditCardDataFactory', function() {
    var CreditCardDataFactory, AuthService, $rootScope, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardDataFactory_, _AuthService_, _$rootScope_, _$q_) {
      CreditCardDataFactory = _CreditCardDataFactory_;
      AuthService = _AuthService_;
      $rootScope = _$rootScope_;
      $q = _$q_;

      spyOn(AuthService, 'getUserId').and.returnValue('user-001');
    }));

    describe('fetchCardSummary', function() {
      it('should return card summary data', function(done) {
        CreditCardDataFactory.fetchCardSummary().then(function(data) {
          expect(data).toBeDefined();
          expect(data.userId).toBe('user-001');
          expect(data.cards).toBeDefined();
          expect(data.aggregatedSpend).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should call AuthService.getUserId', function(done) {
        CreditCardDataFactory.fetchCardSummary().then(function() {
          expect(AuthService.getUserId).toHaveBeenCalled();
          done();
        });
        $rootScope.$apply();
      });

      it('should return array of cards', function(done) {
        CreditCardDataFactory.fetchCardSummary().then(function(data) {
          expect(Array.isArray(data.cards)).toBe(true);
          expect(data.cards.length).toBe(3);
          done();
        });
        $rootScope.$apply();
      });

      it('should return cards with required properties', function(done) {
        CreditCardDataFactory.fetchCardSummary().then(function(data) {
          var card = data.cards[0];
          expect(card.cardId).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.currentBalance).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should return aggregated spend with currentMonth and lastMonth', function(done) {
        CreditCardDataFactory.fetchCardSummary().then(function(data) {
          expect(data.aggregatedSpend.currentMonth).toBe(22000);
          expect(data.aggregatedSpend.lastMonth).toBe(18500);
          done();
        });
        $rootScope.$apply();
      });

      it('should return valid credit limit values', function(done) {
        CreditCardDataFactory.fetchCardSummary().then(function(data) {
          data.cards.forEach(function(card) {
            expect(card.creditLimit).toBeGreaterThan(0);
            expect(card.availableCredit).toBeGreaterThanOrEqual(0);
            expect(card.currentBalance).toBeGreaterThanOrEqual(0);
          });
          done();
        });
        $rootScope.$apply();
      });

      it('should return consistent data on multiple calls', function(done) {
        var firstData;
        CreditCardDataFactory.fetchCardSummary().then(function(data) {
          firstData = data;
          return CreditCardDataFactory.fetchCardSummary();
        }).then(function(secondData) {
          expect(secondData.cards.length).toBe(firstData.cards.length);
          expect(secondData.aggregatedSpend.currentMonth).toBe(firstData.aggregatedSpend.currentMonth);
          done();
        });
        $rootScope.$apply();
      });
    });
  });
})();