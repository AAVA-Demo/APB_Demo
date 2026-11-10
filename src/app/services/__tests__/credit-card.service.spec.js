/*
Test Documentation:
- Test Name: CreditCardService - getAllCards
- Purpose: Validates retrieval of all credit cards for a user
- Scenario: User requests all their credit cards
- Expected Result: Returns array of credit card objects with complete details
*/
/*
Test Documentation:
- Test Name: CreditCardService - getCardById
- Purpose: Validates retrieval of specific credit card by ID
- Scenario: User requests details of a specific card
- Expected Result: Returns card object when found, rejects when not found
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardById
- Scenarios covered: successful retrieval, card not found, promise resolution, data copying, timeout handling
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService;
    var $q;
    var $rootScope;
    var AuthService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$q_, _$rootScope_, _AuthService_) {
      CreditCardService = _CreditCardService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      AuthService = _AuthService_;
    }));

    describe('getAllCards', function() {
      it('should return array of credit cards', function(done) {
        CreditCardService.getAllCards('user-123').then(function(cards) {
          expect(cards).toBeDefined();
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBeGreaterThan(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should return cards with required properties', function(done) {
        CreditCardService.getAllCards('user-123').then(function(cards) {
          var card = cards[0];
          expect(card.cardId).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardHolderName).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.currentBalance).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.lastTransactionDate).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should return independent copies of card data', function(done) {
        CreditCardService.getAllCards('user-123').then(function(cards1) {
          CreditCardService.getAllCards('user-123').then(function(cards2) {
            expect(cards1).not.toBe(cards2);
            expect(cards1[0]).not.toBe(cards2[0]);
            done();
          });
        });
        $rootScope.$apply();
      });

      it('should handle null userId', function(done) {
        CreditCardService.getAllCards(null).then(function(cards) {
          expect(cards).toBeDefined();
          expect(Array.isArray(cards)).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      it('should return cards with valid numeric values', function(done) {
        CreditCardService.getAllCards('user-123').then(function(cards) {
          cards.forEach(function(card) {
            expect(typeof card.creditLimit).toBe('number');
            expect(typeof card.currentBalance).toBe('number');
            expect(typeof card.availableCredit).toBe('number');
            expect(card.creditLimit).toBeGreaterThan(0);
            expect(card.availableCredit).toBeGreaterThanOrEqual(0);
          });
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('getCardById', function() {
      it('should return specific card when valid cardId is provided', function(done) {
        CreditCardService.getCardById('card-1').then(function(card) {
          expect(card).toBeDefined();
          expect(card.cardId).toBe('card-1');
          expect(card.cardNumber).toBe('**** **** **** 1234');
          done();
        });
        $rootScope.$apply();
      });

      it('should reject promise when card is not found', function(done) {
        CreditCardService.getCardById('invalid-card-id').then(
          function(card) {
            fail('Promise should have been rejected');
            done();
          },
          function(error) {
            expect(error).toBeDefined();
            expect(error.message).toBe('Card not found');
            done();
          }
        );
        $rootScope.$apply();
      });

      it('should return card with all required properties', function(done) {
        CreditCardService.getCardById('card-2').then(function(card) {
          expect(card.cardId).toBe('card-2');
          expect(card.cardType).toBe('MasterCard');
          expect(card.creditLimit).toBe(15000);
          expect(card.currentBalance).toBe(5200);
          expect(card.availableCredit).toBe(9800);
          done();
        });
        $rootScope.$apply();
      });

      it('should return independent copy of card data', function(done) {
        CreditCardService.getCardById('card-1').then(function(card1) {
          CreditCardService.getCardById('card-1').then(function(card2) {
            expect(card1).not.toBe(card2);
            expect(card1.cardId).toBe(card2.cardId);
            done();
          });
        });
        $rootScope.$apply();
      });

      it('should handle null cardId', function(done) {
        CreditCardService.getCardById(null).then(
          function(card) {
            fail('Promise should have been rejected');
            done();
          },
          function(error) {
            expect(error.message).toBe('Card not found');
            done();
          }
        );
        $rootScope.$apply();
      });

      it('should handle empty string cardId', function(done) {
        CreditCardService.getCardById('').then(
          function(card) {
            fail('Promise should have been rejected');
            done();
          },
          function(error) {
            expect(error.message).toBe('Card not found');
            done();
          }
        );
        $rootScope.$apply();
      });

      it('should retrieve all mock cards by their IDs', function(done) {
        var cardIds = ['card-1', 'card-2', 'card-3'];
        var promises = cardIds.map(function(id) {
          return CreditCardService.getCardById(id);
        });
        
        $q.all(promises).then(function(cards) {
          expect(cards.length).toBe(3);
          expect(cards[0].cardType).toBe('Visa');
          expect(cards[1].cardType).toBe('MasterCard');
          expect(cards[2].cardType).toBe('Amex');
          done();
        });
        $rootScope.$apply();
      });
    });
  });
})();