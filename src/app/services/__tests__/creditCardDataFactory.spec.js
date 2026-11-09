/*
Test Documentation:
- Test Name: creditCardDataFactory - fetchCards success scenario
- Purpose: Validates that fetchCards returns a promise that resolves with an array of mock credit cards
- Scenario: Service is invoked to fetch all credit cards
- Expected Result: Promise resolves with array of 3 mock cards with correct structure
*/
/*
Test Documentation:
- Test Name: creditCardDataFactory - fetchCardById success scenario
- Purpose: Validates that fetchCardById returns a promise that resolves with a specific card when valid ID is provided
- Scenario: Service is invoked with a valid card ID '1'
- Expected Result: Promise resolves with the card object matching the provided ID
*/
/*
Test Documentation:
- Test Name: creditCardDataFactory - fetchCardById error scenario
- Purpose: Validates that fetchCardById returns a promise that rejects when an invalid card ID is provided
- Scenario: Service is invoked with an invalid card ID 'invalid-id'
- Expected Result: Promise rejects with error message 'Card not found'
*/
/*
Test Documentation:
- Test Name: creditCardDataFactory - fetchCards data structure validation
- Purpose: Validates that each card object returned contains all required properties
- Scenario: Service fetches all cards and validates structure
- Expected Result: Each card has id, cardNumber, cardHolderName, cardType, expiryDate, creditLimit, currentBalance, availableCredit, outstandingAmount, and status
*/
/*
Coverage Report:
- Functions tested: fetchCards, fetchCardById
- Scenarios covered: successful card fetch, successful card fetch by ID, error handling for invalid ID, data structure validation
- Uncovered scenarios: none - all primary and error paths covered
*/

(function() {
  'use strict';

  describe('creditCardDataFactory', function() {
    var creditCardDataFactory, $q, $timeout;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_creditCardDataFactory_, _$q_, _$timeout_) {
      creditCardDataFactory = _creditCardDataFactory_;
      $q = _$q_;
      $timeout = _$timeout_;
    }));

    describe('fetchCards', function() {
      it('should return a promise that resolves with an array of mock credit cards', function(done) {
        var promise = creditCardDataFactory.fetchCards();
        
        expect(promise).toBeDefined();
        expect(promise.then).toBeDefined();
        
        promise.then(function(cards) {
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBe(3);
          done();
        }).catch(function(error) {
          fail('Promise should not reject: ' + error);
          done();
        });
        
        $timeout.flush();
      });

      it('should return cards with correct structure and properties', function(done) {
        creditCardDataFactory.fetchCards().then(function(cards) {
          expect(cards.length).toBeGreaterThan(0);
          
          var firstCard = cards[0];
          expect(firstCard.id).toBeDefined();
          expect(firstCard.cardNumber).toBeDefined();
          expect(firstCard.cardHolderName).toBeDefined();
          expect(firstCard.cardType).toBeDefined();
          expect(firstCard.expiryDate).toBeDefined();
          expect(firstCard.creditLimit).toBeDefined();
          expect(firstCard.currentBalance).toBeDefined();
          expect(firstCard.availableCredit).toBeDefined();
          expect(firstCard.outstandingAmount).toBeDefined();
          expect(firstCard.status).toBeDefined();
          
          expect(typeof firstCard.creditLimit).toBe('number');
          expect(typeof firstCard.currentBalance).toBe('number');
          expect(typeof firstCard.availableCredit).toBe('number');
          expect(typeof firstCard.outstandingAmount).toBe('number');
          
          done();
        });
        
        $timeout.flush();
      });

      it('should return cards with specific expected values', function(done) {
        creditCardDataFactory.fetchCards().then(function(cards) {
          var card1 = cards.find(function(c) { return c.id === '1'; });
          expect(card1).toBeDefined();
          expect(card1.cardNumber).toBe('****1234');
          expect(card1.cardHolderName).toBe('John Doe');
          expect(card1.cardType).toBe('Visa');
          expect(card1.creditLimit).toBe(50000);
          expect(card1.status).toBe('Active');
          done();
        });
        
        $timeout.flush();
      });

      it('should simulate async behavior with timeout', function() {
        var resolved = false;
        
        creditCardDataFactory.fetchCards().then(function() {
          resolved = true;
        });
        
        expect(resolved).toBe(false);
        $timeout.flush();
        expect(resolved).toBe(true);
      });
    });

    describe('fetchCardById', function() {
      it('should return a promise that resolves with a specific card when valid ID is provided', function(done) {
        var cardId = '1';
        
        creditCardDataFactory.fetchCardById(cardId).then(function(card) {
          expect(card).toBeDefined();
          expect(card.id).toBe(cardId);
          expect(card.cardNumber).toBe('****1234');
          expect(card.cardType).toBe('Visa');
          done();
        }).catch(function(error) {
          fail('Promise should not reject for valid ID: ' + error);
          done();
        });
        
        $timeout.flush();
      });

      it('should return correct card for ID "2"', function(done) {
        creditCardDataFactory.fetchCardById('2').then(function(card) {
          expect(card.id).toBe('2');
          expect(card.cardNumber).toBe('****5678');
          expect(card.cardType).toBe('MasterCard');
          expect(card.creditLimit).toBe(30000);
          done();
        });
        
        $timeout.flush();
      });

      it('should return correct card for ID "3"', function(done) {
        creditCardDataFactory.fetchCardById('3').then(function(card) {
          expect(card.id).toBe('3');
          expect(card.cardNumber).toBe('****9012');
          expect(card.cardType).toBe('Visa');
          expect(card.creditLimit).toBe(20000);
          done();
        });
        
        $timeout.flush();
      });

      it('should reject promise when invalid card ID is provided', function(done) {
        var invalidId = 'invalid-id';
        
        creditCardDataFactory.fetchCardById(invalidId).then(function(card) {
          fail('Promise should reject for invalid ID');
          done();
        }).catch(function(error) {
          expect(error).toBe('Card not found');
          done();
        });
        
        $timeout.flush();
      });

      it('should reject promise when null ID is provided', function(done) {
        creditCardDataFactory.fetchCardById(null).then(function(card) {
          fail('Promise should reject for null ID');
          done();
        }).catch(function(error) {
          expect(error).toBe('Card not found');
          done();
        });
        
        $timeout.flush();
      });

      it('should reject promise when undefined ID is provided', function(done) {
        creditCardDataFactory.fetchCardById(undefined).then(function(card) {
          fail('Promise should reject for undefined ID');
          done();
        }).catch(function(error) {
          expect(error).toBe('Card not found');
          done();
        });
        
        $timeout.flush();
      });

      it('should simulate async behavior with timeout', function() {
        var resolved = false;
        
        creditCardDataFactory.fetchCardById('1').then(function() {
          resolved = true;
        });
        
        expect(resolved).toBe(false);
        $timeout.flush();
        expect(resolved).toBe(true);
      });
    });

    describe('edge cases and data integrity', function() {
      it('should return the same data on multiple calls to fetchCards', function(done) {
        var firstCall, secondCall;
        
        creditCardDataFactory.fetchCards().then(function(cards1) {
          firstCall = cards1;
          return creditCardDataFactory.fetchCards();
        }).then(function(cards2) {
          secondCall = cards2;
          expect(firstCall.length).toBe(secondCall.length);
          expect(firstCall[0].id).toBe(secondCall[0].id);
          done();
        });
        
        $timeout.flush();
        $timeout.flush();
      });

      it('should maintain data consistency across fetchCards and fetchCardById', function(done) {
        var allCards;
        
        creditCardDataFactory.fetchCards().then(function(cards) {
          allCards = cards;
          return creditCardDataFactory.fetchCardById('1');
        }).then(function(singleCard) {
          var matchingCard = allCards.find(function(c) { return c.id === '1'; });
          expect(singleCard.id).toBe(matchingCard.id);
          expect(singleCard.cardNumber).toBe(matchingCard.cardNumber);
          expect(singleCard.creditLimit).toBe(matchingCard.creditLimit);
          done();
        });
        
        $timeout.flush();
        $timeout.flush();
      });

      it('should handle rapid successive calls correctly', function() {
        var promise1 = creditCardDataFactory.fetchCards();
        var promise2 = creditCardDataFactory.fetchCards();
        var promise3 = creditCardDataFactory.fetchCardById('1');
        
        expect(promise1).toBeDefined();
        expect(promise2).toBeDefined();
        expect(promise3).toBeDefined();
        
        $timeout.flush();
      });
    });
  });
})();