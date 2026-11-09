/*
Test Documentation:
- Test Name: CreditCardDataFactory - getAllCards method
- Purpose: Validates that getAllCards returns all credit cards with correct structure
- Scenario: Retrieve all credit cards from the factory
- Expected Result: Returns promise resolving to array of card objects with required properties
*/
/*
Test Documentation:
- Test Name: CreditCardDataFactory - getCardsByUserId method
- Purpose: Validates that getCardsByUserId returns cards for a specific user
- Scenario: Retrieve cards by user ID
- Expected Result: Returns promise resolving to array of card objects
*/
/*
Test Documentation:
- Test Name: CreditCardDataFactory - data integrity
- Purpose: Validates that card data contains all required fields and correct data types
- Scenario: Check card object structure and values
- Expected Result: Each card has cardId, cardNumber, cardType, creditLimit, etc.
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardsByUserId
- Scenarios covered: successful card retrieval, data structure validation, promise resolution, data immutability
- Edge cases: empty user ID, multiple calls, data cloning
- Uncovered scenarios: API failures (not applicable for mock implementation)
*/

describe('CreditCardDataFactory', function() {
  'use strict';

  var CreditCardDataFactory;
  var $q;
  var $rootScope;
  var $timeout;
  var AuthService;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardDataFactory_, _$q_, _$rootScope_, _$timeout_, _AuthService_) {
    CreditCardDataFactory = _CreditCardDataFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    AuthService = _AuthService_;
  }));

  describe('getAllCards', function() {
    it('should return a promise', function() {
      var result = CreditCardDataFactory.getAllCards();
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });

    it('should resolve with an array of credit cards', function(done) {
      CreditCardDataFactory.getAllCards().then(function(cards) {
        expect(Array.isArray(cards)).toBe(true);
        expect(cards.length).toBeGreaterThan(0);
        done();
      });
      $timeout.flush();
    });

    it('should return cards with required properties', function(done) {
      CreditCardDataFactory.getAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.cardName).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.outstandingAmount).toBeDefined();
          expect(card.expiryDate).toBeDefined();
          expect(card.status).toBeDefined();
        });
        done();
      });
      $timeout.flush();
    });

    it('should return three mock cards', function(done) {
      CreditCardDataFactory.getAllCards().then(function(cards) {
        expect(cards.length).toBe(3);
        done();
      });
      $timeout.flush();
    });

    it('should return cards with correct data types', function(done) {
      CreditCardDataFactory.getAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(typeof card.cardId).toBe('string');
          expect(typeof card.cardNumber).toBe('string');
          expect(typeof card.cardType).toBe('string');
          expect(typeof card.cardName).toBe('string');
          expect(typeof card.creditLimit).toBe('number');
          expect(typeof card.availableCredit).toBe('number');
          expect(typeof card.outstandingAmount).toBe('number');
          expect(typeof card.expiryDate).toBe('string');
          expect(typeof card.status).toBe('string');
        });
        done();
      });
      $timeout.flush();
    });

    it('should return cards with valid credit limit values', function(done) {
      CreditCardDataFactory.getAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(card.creditLimit).toBeGreaterThan(0);
          expect(card.availableCredit).toBeGreaterThanOrEqual(0);
          expect(card.outstandingAmount).toBeGreaterThanOrEqual(0);
          expect(card.creditLimit).toBeGreaterThanOrEqual(card.availableCredit);
        });
        done();
      });
      $timeout.flush();
    });

    it('should return cards with masked card numbers', function(done) {
      CreditCardDataFactory.getAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(card.cardNumber).toContain('****');
        });
        done();
      });
      $timeout.flush();
    });

    it('should return immutable data (deep copy)', function(done) {
      CreditCardDataFactory.getAllCards().then(function(cards1) {
        cards1[0].cardName = 'Modified Name';
        CreditCardDataFactory.getAllCards().then(function(cards2) {
          expect(cards2[0].cardName).not.toBe('Modified Name');
          done();
        });
        $timeout.flush();
      });
      $timeout.flush();
    });
  });

  describe('getCardsByUserId', function() {
    it('should return a promise', function() {
      var result = CreditCardDataFactory.getCardsByUserId('user123');
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });

    it('should resolve with an array of credit cards', function(done) {
      CreditCardDataFactory.getCardsByUserId('user123').then(function(cards) {
        expect(Array.isArray(cards)).toBe(true);
        expect(cards.length).toBeGreaterThan(0);
        done();
      });
      $timeout.flush();
    });

    it('should return same data as getAllCards for any user ID', function(done) {
      var userId = 'testUser456';
      CreditCardDataFactory.getCardsByUserId(userId).then(function(userCards) {
        CreditCardDataFactory.getAllCards().then(function(allCards) {
          expect(userCards.length).toBe(allCards.length);
          done();
        });
        $timeout.flush();
      });
      $timeout.flush();
    });

    it('should handle empty user ID', function(done) {
      CreditCardDataFactory.getCardsByUserId('').then(function(cards) {
        expect(Array.isArray(cards)).toBe(true);
        done();
      });
      $timeout.flush();
    });

    it('should handle null user ID', function(done) {
      CreditCardDataFactory.getCardsByUserId(null).then(function(cards) {
        expect(Array.isArray(cards)).toBe(true);
        done();
      });
      $timeout.flush();
    });
  });

  describe('card data validation', function() {
    it('should include Visa card in mock data', function(done) {
      CreditCardDataFactory.getAllCards().then(function(cards) {
        var visaCard = cards.find(function(c) { return c.cardType === 'Visa'; });
        expect(visaCard).toBeDefined();
        expect(visaCard.cardName).toBe('Visa Platinum');
        done();
      });
      $timeout.flush();
    });

    it('should include MasterCard in mock data', function(done) {
      CreditCardDataFactory.getAllCards().then(function(cards) {
        var masterCard = cards.find(function(c) { return c.cardType === 'MasterCard'; });
        expect(masterCard).toBeDefined();
        expect(masterCard.cardName).toBe('MasterCard Gold');
        done();
      });
      $timeout.flush();
    });

    it('should include Amex card in mock data', function(done) {
      CreditCardDataFactory.getAllCards().then(function(cards) {
        var amexCard = cards.find(function(c) { return c.cardType === 'Amex'; });
        expect(amexCard).toBeDefined();
        expect(amexCard.cardName).toBe('Amex Blue');
        done();
      });
      $timeout.flush();
    });

    it('should have all cards with Active status', function(done) {
      CreditCardDataFactory.getAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(card.status).toBe('Active');
        });
        done();
      });
      $timeout.flush();
    });
  });

  describe('edge cases', function() {
    it('should handle multiple simultaneous calls', function(done) {
      var promise1 = CreditCardDataFactory.getAllCards();
      var promise2 = CreditCardDataFactory.getAllCards();
      $q.all([promise1, promise2]).then(function(results) {
        expect(results[0].length).toBe(results[1].length);
        done();
      });
      $timeout.flush();
    });

    it('should resolve after 500ms delay', function() {
      var resolved = false;
      CreditCardDataFactory.getAllCards().then(function() {
        resolved = true;
      });
      expect(resolved).toBe(false);
      $timeout.flush(500);
      expect(resolved).toBe(true);
    });
  });
});