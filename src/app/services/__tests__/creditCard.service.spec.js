/*
Test Documentation:
- Test Name: CreditCardService Test Suite
- Purpose: Validate CreditCardService functionality for card management and credit calculations
- Scenario: Tests promise resolution, data retrieval, and synchronous calculations
- Expected Result: All functions return correct card data and accurate credit calculations
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$rootScope_) {
      CreditCardService = _CreditCardService_;
      $rootScope = _$rootScope_;
    }));

    describe('getAllCards', function() {
      it('should return all credit cards as a promise', function(done) {
        CreditCardService.getAllCards().then(function(cards) {
          expect(cards).toBeDefined();
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBe(3);
          done();
        });

        $rootScope.$digest();
      });

      it('should return cards with required properties', function(done) {
        CreditCardService.getAllCards().then(function(cards) {
          var card = cards[0];
          expect(card.id).toBeDefined();
          expect(card.name).toBeDefined();
          expect(card.bank).toBeDefined();
          expect(card.last4).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.outstandingAmount).toBeDefined();
          expect(card.status).toBeDefined();
          done();
        });

        $rootScope.$digest();
      });

      it('should return a copy of cards array (not reference)', function(done) {
        CreditCardService.getAllCards().then(function(cards1) {
          CreditCardService.getAllCards().then(function(cards2) {
            expect(cards1).not.toBe(cards2);
            expect(cards1[0]).not.toBe(cards2[0]);
            done();
          });
        });

        $rootScope.$digest();
      });
    });

    describe('getCardById', function() {
      it('should return specific card by ID', function(done) {
        CreditCardService.getCardById(1).then(function(card) {
          expect(card).toBeDefined();
          expect(card.id).toBe(1);
          expect(card.name).toBe('Visa Platinum');
          expect(card.bank).toBe('Chase');
          done();
        });

        $rootScope.$digest();
      });

      it('should return second card correctly', function(done) {
        CreditCardService.getCardById(2).then(function(card) {
          expect(card.id).toBe(2);
          expect(card.name).toBe('Mastercard Gold');
          expect(card.bank).toBe('Citi');
          done();
        });

        $rootScope.$digest();
      });

      it('should return undefined for non-existent card ID', function(done) {
        CreditCardService.getCardById(999).then(function(card) {
          expect(card).toBeUndefined();
          done();
        });

        $rootScope.$digest();
      });

      it('should return a copy of the card (not reference)', function(done) {
        CreditCardService.getCardById(1).then(function(card1) {
          CreditCardService.getCardById(1).then(function(card2) {
            expect(card1).not.toBe(card2);
            card1.name = 'Modified';
            expect(card2.name).toBe('Visa Platinum');
            done();
          });
        });

        $rootScope.$digest();
      });
    });

    describe('getTotalCreditLimit', function() {
      it('should return sum of all credit limits', function() {
        var total = CreditCardService.getTotalCreditLimit();
        expect(total).toBe(45000);
      });

      it('should return a number', function() {
        var total = CreditCardService.getTotalCreditLimit();
        expect(typeof total).toBe('number');
      });

      it('should be synchronous (not a promise)', function() {
        var total = CreditCardService.getTotalCreditLimit();
        expect(total).not.toBeUndefined();
        expect(typeof total.then).toBe('undefined');
      });
    });

    describe('getTotalAvailableCredit', function() {
      it('should return sum of all available credit', function() {
        var total = CreditCardService.getTotalAvailableCredit();
        expect(total).toBe(37500);
      });

      it('should return a number', function() {
        var total = CreditCardService.getTotalAvailableCredit();
        expect(typeof total).toBe('number');
      });

      it('should be less than or equal to total credit limit', function() {
        var available = CreditCardService.getTotalAvailableCredit();
        var limit = CreditCardService.getTotalCreditLimit();
        expect(available).toBeLessThanOrEqual(limit);
      });
    });

    describe('getTotalOutstanding', function() {
      it('should return sum of all outstanding amounts', function() {
        var total = CreditCardService.getTotalOutstanding();
        expect(total).toBe(7500);
      });

      it('should return a number', function() {
        var total = CreditCardService.getTotalOutstanding();
        expect(typeof total).toBe('number');
      });

      it('should equal credit limit minus available credit', function() {
        var outstanding = CreditCardService.getTotalOutstanding();
        var limit = CreditCardService.getTotalCreditLimit();
        var available = CreditCardService.getTotalAvailableCredit();
        expect(outstanding).toBe(limit - available);
      });
    });

    describe('Integration tests', function() {
      it('should maintain data consistency across all methods', function(done) {
        CreditCardService.getAllCards().then(function(cards) {
          var manualLimit = cards.reduce(function(sum, card) {
            return sum + card.creditLimit;
          }, 0);
          var serviceLimit = CreditCardService.getTotalCreditLimit();
          expect(manualLimit).toBe(serviceLimit);
          done();
        });

        $rootScope.$digest();
      });

      it('should have all cards with status active', function(done) {
        CreditCardService.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.status).toBe('active');
          });
          done();
        });

        $rootScope.$digest();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getAllCards, getCardById, getTotalCreditLimit, getTotalAvailableCredit, getTotalOutstanding
- Scenarios covered:
  * Promise resolution for async methods
  * Data integrity and immutability
  * Correct calculations for totals
  * Edge cases (non-existent IDs)
  * Data consistency across methods
  * Synchronous vs asynchronous behavior
- Edge cases: Invalid card IDs, data immutability, calculation accuracy
- Uncovered scenarios: None - all public methods tested with normal and edge cases
*/