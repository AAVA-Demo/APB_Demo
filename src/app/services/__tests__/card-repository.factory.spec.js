/*
Test Documentation:
- Test Name: CardRepositoryFactory - getUserCards
- Purpose: Validates retrieval of user credit cards
- Scenario: User requests their card list
- Expected Result: Returns array of card objects with complete details

- Test Name: CardRepositoryFactory - card data structure
- Purpose: Validates card object contains all required fields
- Scenario: Cards are retrieved
- Expected Result: Each card has cardId, userId, cardNumber, type, issuer, limits, balances, etc.

- Test Name: CardRepositoryFactory - userId association
- Purpose: Validates cards are associated with correct user
- Scenario: Cards are retrieved for specific user
- Expected Result: All cards have matching userId

Coverage Report:
- Functions tested: getUserCards
- Scenarios covered: normal flow, data structure validation, userId association
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardRepositoryFactory', function() {
    var CardRepositoryFactory, $q, $rootScope;

    beforeEach(module('cardManagement'));

    beforeEach(inject(function(_CardRepositoryFactory_, _$q_, _$rootScope_) {
      CardRepositoryFactory = _CardRepositoryFactory_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getUserCards', function() {
      it('should return array of user cards', function(done) {
        CardRepositoryFactory.getUserCards('user123').then(function(cards) {
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBe(3);
          done();
        });

        $rootScope.$apply();
      });

      it('should return cards with all required fields', function(done) {
        CardRepositoryFactory.getUserCards('user123').then(function(cards) {
          cards.forEach(function(card) {
            expect(card.cardId).toBeDefined();
            expect(card.userId).toBeDefined();
            expect(card.cardNumber).toBeDefined();
            expect(card.cardType).toBeDefined();
            expect(card.issuer).toBeDefined();
            expect(card.creditLimit).toBeDefined();
            expect(card.currentBalance).toBeDefined();
            expect(card.availableCredit).toBeDefined();
            expect(card.outstandingAmount).toBeDefined();
            expect(card.expiryDate).toBeDefined();
            expect(card.status).toBeDefined();
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should associate all cards with provided userId', function(done) {
        var testUserId = 'testUser456';

        CardRepositoryFactory.getUserCards(testUserId).then(function(cards) {
          cards.forEach(function(card) {
            expect(card.userId).toBe(testUserId);
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should return cards with masked card numbers', function(done) {
        CardRepositoryFactory.getUserCards('user123').then(function(cards) {
          cards.forEach(function(card) {
            expect(card.cardNumber).toMatch(/\*\*\*\* \*\*\*\* \*\*\*\* \d{4}/);
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should return cards with active status', function(done) {
        CardRepositoryFactory.getUserCards('user123').then(function(cards) {
          cards.forEach(function(card) {
            expect(card.status).toBe('active');
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should return cards with valid credit limits and balances', function(done) {
        CardRepositoryFactory.getUserCards('user123').then(function(cards) {
          cards.forEach(function(card) {
            expect(card.creditLimit).toBeGreaterThan(0);
            expect(card.currentBalance).toBeGreaterThanOrEqual(0);
            expect(card.availableCredit).toBeGreaterThanOrEqual(0);
            expect(card.availableCredit).toBeLessThanOrEqual(card.creditLimit);
          });
          done();
        });

        $rootScope.$apply();
      });
    });
  });
})();