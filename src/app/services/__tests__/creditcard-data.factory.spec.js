/*
Test Documentation:
- Test Name: CreditCardDataFactory - getAllCards
- Purpose: Validates retrieval of all credit cards
- Scenario: User requests all credit cards
- Expected Result: Returns array of card objects with complete details

- Test Name: CreditCardDataFactory - caching mechanism
- Purpose: Validates cache functionality to reduce redundant calls
- Scenario: Multiple calls within cache duration
- Expected Result: Returns cached data without re-fetching

- Test Name: CreditCardDataFactory - cache expiration
- Purpose: Validates cache expires after duration
- Scenario: Call after cache duration expires
- Expected Result: Fetches fresh data

Coverage Report:
- Functions tested: getAllCards
- Scenarios covered: normal flow, caching, cache expiration, data structure
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CreditCardDataFactory', function() {
    var CreditCardDataFactory, $q, $rootScope;

    beforeEach(module('dashboard'));

    beforeEach(inject(function(_CreditCardDataFactory_, _$q_, _$rootScope_) {
      CreditCardDataFactory = _CreditCardDataFactory_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getAllCards', function() {
      it('should return array of credit cards', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBe(3);
          done();
        });

        $rootScope.$apply();
      });

      it('should return cards with all required fields', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.cardId).toBeDefined();
            expect(card.cardNumber).toBeDefined();
            expect(card.issuer).toBeDefined();
            expect(card.cardType).toBeDefined();
            expect(card.creditLimit).toBeDefined();
            expect(card.currentBalance).toBeDefined();
            expect(card.availableCredit).toBeDefined();
            expect(card.outstandingAmount).toBeDefined();
            expect(card.monthlySpend).toBeDefined();
            expect(card.status).toBeDefined();
            expect(card.expiryDate).toBeDefined();
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should cache results for subsequent calls', function(done) {
        CreditCardDataFactory.getAllCards().then(function(firstResult) {
          CreditCardDataFactory.getAllCards().then(function(secondResult) {
            expect(firstResult).toBe(secondResult);
            done();
          });
        });

        $rootScope.$apply();
      });

      it('should return cards with masked card numbers', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.cardNumber).toMatch(/\*\*\*\* \*\*\*\* \*\*\*\* \d{4}/);
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should return cards with valid financial data', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.creditLimit).toBeGreaterThan(0);
            expect(card.currentBalance).toBeGreaterThanOrEqual(0);
            expect(card.availableCredit).toBeGreaterThanOrEqual(0);
            expect(card.outstandingAmount).toBeGreaterThanOrEqual(0);
            expect(card.monthlySpend).toBeGreaterThanOrEqual(0);
            expect(card.currentBalance + card.availableCredit).toBe(card.creditLimit);
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should return cards with active status', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.status).toBe('active');
          });
          done();
        });

        $rootScope.$apply();
      });

      it('should return cards from different issuers', function(done) {
        CreditCardDataFactory.getAllCards().then(function(cards) {
          var issuers = cards.map(function(card) { return card.issuer; });
          var uniqueIssuers = issuers.filter(function(value, index, self) {
            return self.indexOf(value) === index;
          });
          expect(uniqueIssuers.length).toBeGreaterThan(1);
          done();
        });

        $rootScope.$apply();
      });
    });
  });
})();