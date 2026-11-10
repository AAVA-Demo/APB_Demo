/*
Test Documentation:
- Test Name: CreditCardService - getCards returns all cards
- Purpose: Validates card retrieval functionality
- Scenario: Service fetches all credit cards
- Expected Result: Returns array of credit card objects
*/
/*
Test Documentation:
- Test Name: CreditCardService - getCards returns cards with required properties
- Purpose: Validates data structure integrity
- Scenario: Cards retrieved from service
- Expected Result: Each card contains all required properties
*/
/*
Test Documentation:
- Test Name: CreditCardService - getCards returns masked card numbers
- Purpose: Validates security requirement
- Scenario: Card data retrieved
- Expected Result: Card numbers are masked showing only last 4 digits
*/
/*
Test Documentation:
- Test Name: CreditCardService - getCards resolves within timeout
- Purpose: Validates performance requirement
- Scenario: Service called to fetch cards
- Expected Result: Promise resolves within expected timeframe
*/
/*
Coverage Report:
- Functions tested: getCards
- Scenarios covered: card retrieval, data structure, masking, performance
- Uncovered scenarios: error handling, network failures, card updates
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService;
    var $http;
    var $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$http_, _$q_) {
      CreditCardService = _CreditCardService_;
      $http = _$http_;
      $q = _$q_;
    }));

    describe('getCards', function() {
      it('should be defined', function() {
        expect(CreditCardService.getCards).toBeDefined();
        expect(typeof CreditCardService.getCards).toBe('function');
      });

      it('should return a promise', function() {
        var result = CreditCardService.getCards();

        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should return array of credit cards', function(done) {
        CreditCardService.getCards().then(function(cards) {
          expect(cards).toBeDefined();
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBeGreaterThan(0);
          done();
        }).catch(function(error) {
          fail('Promise should not reject: ' + error);
          done();
        });
      });

      it('should return cards with required properties', function(done) {
        CreditCardService.getCards().then(function(cards) {
          expect(cards.length).toBeGreaterThan(0);
          
          var card = cards[0];
          expect(card.cardId).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.outstandingAmount).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          done();
        });
      });

      it('should return cards with numeric credit limit', function(done) {
        CreditCardService.getCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(typeof card.creditLimit).toBe('number');
            expect(card.creditLimit).toBeGreaterThan(0);
          });
          done();
        });
      });

      it('should return cards with numeric outstanding amount', function(done) {
        CreditCardService.getCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(typeof card.outstandingAmount).toBe('number');
            expect(card.outstandingAmount).toBeGreaterThanOrEqual(0);
          });
          done();
        });
      });

      it('should return cards with numeric available credit', function(done) {
        CreditCardService.getCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(typeof card.availableCredit).toBe('number');
            expect(card.availableCredit).toBeGreaterThanOrEqual(0);
          });
          done();
        });
      });

      it('should return masked card numbers', function(done) {
        CreditCardService.getCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.cardNumber).toMatch(/^\*{4}\d{4}$/);
          });
          done();
        });
      });

      it('should return cards with valid card types', function(done) {
        CreditCardService.getCards().then(function(cards) {
          var validTypes = ['Visa', 'MasterCard', 'Amex', 'Discover'];
          cards.forEach(function(card) {
            expect(validTypes).toContain(card.cardType);
          });
          done();
        });
      });

      it('should validate credit calculations', function(done) {
        CreditCardService.getCards().then(function(cards) {
          cards.forEach(function(card) {
            var calculatedAvailable = card.creditLimit - card.outstandingAmount;
            expect(card.availableCredit).toBe(calculatedAvailable);
          });
          done();
        });
      });

      it('should resolve within expected timeout', function(done) {
        var startTime = Date.now();

        CreditCardService.getCards().then(function(cards) {
          var endTime = Date.now();
          var elapsed = endTime - startTime;

          expect(elapsed).toBeLessThan(700);
          expect(cards.length).toBeGreaterThan(0);
          done();
        });
      });

      it('should return consistent data on multiple calls', function(done) {
        var promise1 = CreditCardService.getCards();
        var promise2 = CreditCardService.getCards();

        Promise.all([promise1, promise2]).then(function(results) {
          expect(results[0].length).toBe(results[1].length);
          expect(results[0][0].cardId).toBe(results[1][0].cardId);
          done();
        });
      });
    });
  });
})();