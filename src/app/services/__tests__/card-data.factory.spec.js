/*
Test Documentation:
- Test Name: cardDataFactory - getCards
- Purpose: Validate that getCards resolves a promise with the correct mock card data
- Scenario: Normal resolution with 3 mock cards
- Expected Result: Promise resolves with array of 3 cards having correct structure

- Test Name: cardDataFactory - getCards card structure
- Purpose: Ensure each card object has required fields
- Scenario: Check cardId, cardNumber, cardType, creditLimit, outstandingAmount, availableCredit
- Expected Result: All fields present and correctly typed
*/

describe('cardDataFactory', function() {
  'use strict';

  var cardDataFactory;
  var $rootScope;
  var $timeout;

  beforeEach(module('creditCardDashboardModule'));

  beforeEach(inject(function(_cardDataFactory_, _$rootScope_, _$timeout_) {
    cardDataFactory = _cardDataFactory_;
    $rootScope      = _$rootScope_;
    $timeout        = _$timeout_;
  }));

  // ─── getCards ────────────────────────────────────────────────────────────────

  describe('getCards', function() {

    it('should return a promise', function() {
      var promise = cardDataFactory.getCards();
      expect(promise).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });

    it('should resolve with an array of 3 mock cards', function() {
      var resolvedCards;
      cardDataFactory.getCards().then(function(cards) { resolvedCards = cards; });
      $timeout.flush();
      $rootScope.$digest();
      expect(resolvedCards).toBeDefined();
      expect(resolvedCards.length).toBe(3);
    });

    it('should resolve with cards having correct cardId values', function() {
      var resolvedCards;
      cardDataFactory.getCards().then(function(cards) { resolvedCards = cards; });
      $timeout.flush();
      $rootScope.$digest();
      expect(resolvedCards[0].cardId).toBe('card-001');
      expect(resolvedCards[1].cardId).toBe('card-002');
      expect(resolvedCards[2].cardId).toBe('card-003');
    });

    it('should resolve with cards having correct cardType values', function() {
      var resolvedCards;
      cardDataFactory.getCards().then(function(cards) { resolvedCards = cards; });
      $timeout.flush();
      $rootScope.$digest();
      expect(resolvedCards[0].cardType).toBe('Visa');
      expect(resolvedCards[1].cardType).toBe('MasterCard');
      expect(resolvedCards[2].cardType).toBe('Amex');
    });

    it('should resolve with cards having numeric creditLimit values', function() {
      var resolvedCards;
      cardDataFactory.getCards().then(function(cards) { resolvedCards = cards; });
      $timeout.flush();
      $rootScope.$digest();
      resolvedCards.forEach(function(card) {
        expect(typeof card.creditLimit).toBe('number');
        expect(card.creditLimit).toBeGreaterThan(0);
      });
    });

    it('should resolve with cards where availableCredit equals creditLimit minus outstandingAmount', function() {
      var resolvedCards;
      cardDataFactory.getCards().then(function(cards) { resolvedCards = cards; });
      $timeout.flush();
      $rootScope.$digest();
      resolvedCards.forEach(function(card) {
        expect(card.availableCredit).toBe(card.creditLimit - card.outstandingAmount);
      });
    });

    it('should resolve with masked card numbers', function() {
      var resolvedCards;
      cardDataFactory.getCards().then(function(cards) { resolvedCards = cards; });
      $timeout.flush();
      $rootScope.$digest();
      resolvedCards.forEach(function(card) {
        expect(card.cardNumber).toMatch(/^\*{4} \*{4} \*{4} \d{4}$/);
      });
    });
  });
});

/*
Coverage Report:
- Functions tested: getCards
- Scenarios covered: promise returned, 3 cards resolved, cardId values, cardType values, numeric creditLimit, availableCredit calculation, masked card numbers
- Uncovered scenarios: network error (factory uses mock data internally)
*/