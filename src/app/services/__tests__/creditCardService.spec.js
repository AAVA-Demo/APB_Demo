/*
Test Documentation:
- Test Name: creditCardService.spec.js
- Purpose: Validate credit card data retrieval and caching functionality
- Scenario: Tests fetching all cards, individual card details, and cache management
- Expected Result: Credit card data is retrieved correctly with proper caching behavior
*/

(function() {
  'use strict';

  describe('creditCardService', function() {
    var creditCardService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_creditCardService_, _$q_, _$rootScope_) {
      creditCardService = _creditCardService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getAllCards', function() {
      it('should return all credit cards', function() {
        var cards;
        creditCardService.getAllCards().then(function(data) {
          cards = data;
        });
        $rootScope.$digest();

        expect(cards).toBeDefined();
        expect(cards.length).toBe(3);
        expect(cards[0].cardId).toBe('CC001');
        expect(cards[0].cardName).toBe('Platinum Rewards');
        expect(cards[1].cardId).toBe('CC002');
        expect(cards[2].cardId).toBe('CC003');
      });

      it('should return cached data on subsequent calls', function() {
        var firstCall, secondCall;

        creditCardService.getAllCards().then(function(data) {
          firstCall = data;
        });
        $rootScope.$digest();

        creditCardService.getAllCards().then(function(data) {
          secondCall = data;
        });
        $rootScope.$digest();

        expect(firstCall).toBe(secondCall);
      });

      it('should include all required card properties', function() {
        var cards;
        creditCardService.getAllCards().then(function(data) {
          cards = data;
        });
        $rootScope.$digest();

        var card = cards[0];
        expect(card.cardId).toBeDefined();
        expect(card.cardName).toBeDefined();
        expect(card.cardType).toBeDefined();
        expect(card.creditLimit).toBeDefined();
        expect(card.availableCredit).toBeDefined();
        expect(card.outstandingAmount).toBeDefined();
        expect(card.monthlySpend).toBeDefined();
        expect(card.lastUpdated).toBeDefined();
        expect(card.lastFourDigits).toBeDefined();
      });

      it('should return cards with correct credit limit values', function() {
        var cards;
        creditCardService.getAllCards().then(function(data) {
          cards = data;
        });
        $rootScope.$digest();

        expect(cards[0].creditLimit).toBe(50000);
        expect(cards[1].creditLimit).toBe(30000);
        expect(cards[2].creditLimit).toBe(75000);
      });

      it('should return cards with correct available credit values', function() {
        var cards;
        creditCardService.getAllCards().then(function(data) {
          cards = data;
        });
        $rootScope.$digest();

        expect(cards[0].availableCredit).toBe(35000);
        expect(cards[1].availableCredit).toBe(22000);
        expect(cards[2].availableCredit).toBe(60000);
      });
    });

    describe('getCardDetails', function() {
      it('should return specific card by cardId', function() {
        var card;
        creditCardService.getCardDetails('CC001').then(function(data) {
          card = data;
        });
        $rootScope.$digest();

        expect(card).toBeDefined();
        expect(card.cardId).toBe('CC001');
        expect(card.cardName).toBe('Platinum Rewards');
      });

      it('should return undefined for non-existent cardId', function() {
        var card;
        creditCardService.getCardDetails('CC999').then(function(data) {
          card = data;
        });
        $rootScope.$digest();

        expect(card).toBeUndefined();
      });

      it('should return correct card details for CC002', function() {
        var card;
        creditCardService.getCardDetails('CC002').then(function(data) {
          card = data;
        });
        $rootScope.$digest();

        expect(card.cardId).toBe('CC002');
        expect(card.cardName).toBe('Gold Cashback');
        expect(card.creditLimit).toBe(30000);
        expect(card.lastFourDigits).toBe('7834');
      });

      it('should return correct card details for CC003', function() {
        var card;
        creditCardService.getCardDetails('CC003').then(function(data) {
          card = data;
        });
        $rootScope.$digest();

        expect(card.cardId).toBe('CC003');
        expect(card.cardName).toBe('Travel Elite');
        expect(card.creditLimit).toBe(75000);
        expect(card.lastFourDigits).toBe('2109');
      });
    });

    describe('invalidateCache', function() {
      it('should clear cache and force fresh data fetch', function() {
        var firstCall, secondCall;

        creditCardService.getAllCards().then(function(data) {
          firstCall = data;
        });
        $rootScope.$digest();

        creditCardService.invalidateCache();

        creditCardService.getAllCards().then(function(data) {
          secondCall = data;
        });
        $rootScope.$digest();

        expect(firstCall).not.toBe(secondCall);
        expect(firstCall).toEqual(secondCall);
      });

      it('should allow cache to be rebuilt after invalidation', function() {
        var firstCall, secondCall, thirdCall;

        creditCardService.getAllCards().then(function(data) {
          firstCall = data;
        });
        $rootScope.$digest();

        creditCardService.invalidateCache();

        creditCardService.getAllCards().then(function(data) {
          secondCall = data;
        });
        $rootScope.$digest();

        creditCardService.getAllCards().then(function(data) {
          thirdCall = data;
        });
        $rootScope.$digest();

        expect(secondCall).toBe(thirdCall);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getAllCards, getCardDetails, invalidateCache
  - Scenarios covered:
    * Fetching all credit cards
    * Cache behavior on subsequent calls
    * Card property validation
    * Credit limit and available credit values
    * Fetching specific card by ID
    * Handling non-existent card IDs
    * Cache invalidation
    * Cache rebuilding after invalidation
  - Uncovered scenarios: None
  */
})();