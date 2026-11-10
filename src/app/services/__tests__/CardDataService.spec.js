/*
Test Documentation:
- Test Name: CardDataService - getAllCards with cache miss
- Purpose: Validates retrieval of all cards for user
- Scenario: First time request with no cache
- Expected Result: Returns array of cards after timeout and caches result
*/
/*
Test Documentation:
- Test Name: CardDataService - getAllCards with cache hit
- Purpose: Validates cache functionality
- Scenario: Second request for same user
- Expected Result: Returns cached data immediately
*/
/*
Test Documentation:
- Test Name: CardDataService - getCardById success
- Purpose: Validates retrieval of specific card
- Scenario: Valid card ID provided
- Expected Result: Returns matching card object
*/
/*
Test Documentation:
- Test Name: CardDataService - getCardById not found
- Purpose: Validates behavior when card not found
- Scenario: Invalid card ID provided
- Expected Result: Returns undefined
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardById
- Scenarios covered: cache miss, cache hit, card retrieval by ID, card not found, multiple cards
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardDataService', function() {
    var CardDataService, $rootScope, $timeout, $cacheFactory;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardDataService_, _$rootScope_, _$timeout_, _$cacheFactory_) {
      CardDataService = _CardDataService_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
      $cacheFactory = _$cacheFactory_;
    }));

    afterEach(function() {
      var cache = $cacheFactory.get('cardDataCache');
      if (cache) {
        cache.removeAll();
      }
    });

    describe('getAllCards', function() {
      it('should return all cards for user on first request (cache miss)', function() {
        var userId = 'user123';
        var result;

        CardDataService.getAllCards(userId).then(function(cards) {
          result = cards;
        });

        $timeout.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(3);
        expect(result[0].cardId).toBe('card1');
        expect(result[1].cardId).toBe('card2');
        expect(result[2].cardId).toBe('card3');
      });

      it('should return cached cards on subsequent request (cache hit)', function() {
        var userId = 'user123';
        var result1, result2;

        CardDataService.getAllCards(userId).then(function(cards) {
          result1 = cards;
        });

        $timeout.flush();

        CardDataService.getAllCards(userId).then(function(cards) {
          result2 = cards;
        });

        $rootScope.$apply();

        expect(result2).toBeDefined();
        expect(result2).toEqual(result1);
      });

      it('should return cards with correct structure', function() {
        var userId = 'user123';
        var result;

        CardDataService.getAllCards(userId).then(function(cards) {
          result = cards;
        });

        $timeout.flush();

        var card = result[0];
        expect(card.cardId).toBeDefined();
        expect(card.userId).toBe('user123');
        expect(card.cardNumber).toBeDefined();
        expect(card.cardType).toBeDefined();
        expect(card.creditLimit).toBeDefined();
        expect(card.availableCredit).toBeDefined();
        expect(card.outstandingBalance).toBeDefined();
        expect(card.monthlySpend).toBeDefined();
        expect(card.isActive).toBe(true);
      });

      it('should return cards with expected values', function() {
        var userId = 'user123';
        var result;

        CardDataService.getAllCards(userId).then(function(cards) {
          result = cards;
        });

        $timeout.flush();

        expect(result[0].cardType).toBe('Visa');
        expect(result[0].creditLimit).toBe(50000);
        expect(result[1].cardType).toBe('MasterCard');
        expect(result[1].creditLimit).toBe(30000);
        expect(result[2].cardType).toBe('Amex');
        expect(result[2].creditLimit).toBe(70000);
      });
    });

    describe('getCardById', function() {
      it('should return card matching the given card ID', function() {
        var cardId = 'card1';
        var result;

        CardDataService.getCardById(cardId).then(function(card) {
          result = card;
        });

        $timeout.flush();

        expect(result).toBeDefined();
        expect(result.cardId).toBe('card1');
        expect(result.cardType).toBe('Visa');
        expect(result.cardNumber).toBe('**** **** **** 1234');
      });

      it('should return undefined for non-existent card ID', function() {
        var cardId = 'nonExistentCard';
        var result;

        CardDataService.getCardById(cardId).then(function(card) {
          result = card;
        });

        $timeout.flush();

        expect(result).toBeUndefined();
      });

      it('should return correct card for card2', function() {
        var result;

        CardDataService.getCardById('card2').then(function(card) {
          result = card;
        });

        $timeout.flush();

        expect(result.cardId).toBe('card2');
        expect(result.cardType).toBe('MasterCard');
        expect(result.creditLimit).toBe(30000);
      });

      it('should return correct card for card3', function() {
        var result;

        CardDataService.getCardById('card3').then(function(card) {
          result = card;
        });

        $timeout.flush();

        expect(result.cardId).toBe('card3');
        expect(result.cardType).toBe('Amex');
        expect(result.creditLimit).toBe(70000);
      });

      it('should resolve promise asynchronously', function() {
        var resolved = false;

        CardDataService.getCardById('card1').then(function() {
          resolved = true;
        });

        expect(resolved).toBe(false);

        $timeout.flush();

        expect(resolved).toBe(true);
      });
    });
  });
})();