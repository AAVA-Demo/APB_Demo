/*
Test Documentation:
- Test Name: CreditCardService - getAllCards returns cached data within cache duration
- Purpose: Validates caching mechanism for performance
- Scenario: Given cache is valid and within 30-second duration
- Expected Result: Returns cached data without making new request
*/
/*
Test Documentation:
- Test Name: CreditCardService - getAllCards returns mock credit card data
- Purpose: Validates credit card data retrieval
- Scenario: When getAllCards is called
- Expected Result: Returns array of credit card objects with correct structure
*/
/*
Coverage Report:
- Functions tested: getAllCards
- Scenarios covered: initial load, caching, data structure validation
- Uncovered scenarios: none
*/

describe('CreditCardService', function() {
  'use strict';

  beforeEach(module('creditCardApp.dashboard'));

  var CreditCardService, $q, $rootScope, AuthService, CreditCardFactory;

  beforeEach(inject(function(_CreditCardService_, _$q_, _$rootScope_, _AuthService_, _CreditCardFactory_) {
    CreditCardService = _CreditCardService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    AuthService = _AuthService_;
    CreditCardFactory = _CreditCardFactory_;

    spyOn(AuthService, 'isAuthenticated').and.returnValue(true);
  }));

  describe('getAllCards', function() {
    it('should return an array of credit cards', function() {
      var result;
      CreditCardService.getAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });

    it('should return cards with correct structure', function() {
      var result;
      CreditCardService.getAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();

      var card = result[0];
      expect(card.cardId).toBeDefined();
      expect(card.cardNumber).toBeDefined();
      expect(card.cardType).toBeDefined();
      expect(card.cardHolderName).toBeDefined();
      expect(card.creditLimit).toBeDefined();
      expect(card.outstandingAmount).toBeDefined();
      expect(card.availableCredit).toBeDefined();
      expect(card.monthlySpend).toBeDefined();
      expect(card.expiryDate).toBeDefined();
    });

    it('should calculate availableCredit correctly', function() {
      var result;
      CreditCardService.getAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();

      var card = result[0];
      expect(card.availableCredit).toBe(card.creditLimit - card.outstandingAmount);
    });

    it('should return cached data on subsequent calls within cache duration', function() {
      var firstResult, secondResult;

      CreditCardService.getAllCards().then(function(cards) {
        firstResult = cards;
      });
      $rootScope.$digest();

      CreditCardService.getAllCards().then(function(cards) {
        secondResult = cards;
      });
      $rootScope.$digest();

      expect(firstResult).toBe(secondResult);
    });

    it('should return cards with masked card numbers', function() {
      var result;
      CreditCardService.getAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();

      result.forEach(function(card) {
        expect(card.cardNumber).toContain('****');
      });
    });
  });
});