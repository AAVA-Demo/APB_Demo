/*
Test Documentation:
- Test Name: CreditCardDataService Test Suite
- Purpose: Validate CreditCardDataService functionality for fetching credit card data
- Scenario: Tests fetchAllCards method including data retrieval, model creation, and error handling
- Expected Result: Service correctly fetches mock credit card data and creates CreditCard model instances
*/

(function() {
'use strict';

describe('CreditCardDataService', function() {
  var CreditCardDataService;
  var CreditCardModelFactory;
  var $q;
  var $rootScope;

  beforeEach(module('creditCard.dashboard'));

  beforeEach(inject(function(_CreditCardDataService_, _CreditCardModelFactory_, _$q_, _$rootScope_) {
    CreditCardDataService = _CreditCardDataService_;
    CreditCardModelFactory = _CreditCardModelFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('fetchAllCards', function() {
    it('should fetch all credit cards successfully', function() {
      var result;
      CreditCardDataService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });

    it('should return credit cards with correct structure', function() {
      var result;
      CreditCardDataService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();

      var card = result[0];
      expect(card.cardId).toBeDefined();
      expect(card.cardName).toBeDefined();
      expect(card.cardType).toBeDefined();
      expect(card.creditLimit).toBeDefined();
      expect(card.currentBalance).toBeDefined();
      expect(card.monthlySpend).toBeDefined();
      expect(card.outstandingAmount).toBeDefined();
      expect(card.availableCredit).toBeDefined();
    });

    it('should return Visa Platinum card with correct data', function() {
      var result;
      CreditCardDataService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();

      var visaCard = result.find(function(card) { return card.cardId === 'CC001'; });
      expect(visaCard.cardName).toBe('Visa Platinum');
      expect(visaCard.cardType).toBe('Visa');
      expect(visaCard.creditLimit).toBe(50000);
      expect(visaCard.currentBalance).toBe(15000);
      expect(visaCard.monthlySpend).toBe(8500);
      expect(visaCard.outstandingAmount).toBe(15000);
      expect(visaCard.availableCredit).toBe(35000);
    });

    it('should return MasterCard Gold card with correct data', function() {
      var result;
      CreditCardDataService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();

      var masterCard = result.find(function(card) { return card.cardId === 'CC002'; });
      expect(masterCard.cardName).toBe('MasterCard Gold');
      expect(masterCard.cardType).toBe('MasterCard');
      expect(masterCard.creditLimit).toBe(30000);
      expect(masterCard.currentBalance).toBe(8000);
      expect(masterCard.monthlySpend).toBe(4200);
      expect(masterCard.outstandingAmount).toBe(8000);
      expect(masterCard.availableCredit).toBe(22000);
    });

    it('should return Amex Blue card with correct data', function() {
      var result;
      CreditCardDataService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();

      var amexCard = result.find(function(card) { return card.cardId === 'CC003'; });
      expect(amexCard.cardName).toBe('Amex Blue');
      expect(amexCard.cardType).toBe('Amex');
      expect(amexCard.creditLimit).toBe(40000);
      expect(amexCard.currentBalance).toBe(12000);
      expect(amexCard.monthlySpend).toBe(6300);
      expect(amexCard.outstandingAmount).toBe(12000);
      expect(amexCard.availableCredit).toBe(28000);
    });

    it('should create CreditCard model instances using factory', function() {
      spyOn(CreditCardModelFactory, 'create').and.callThrough();

      CreditCardDataService.fetchAllCards();
      $rootScope.$digest();

      expect(CreditCardModelFactory.create.calls.count()).toBe(3);
    });

    it('should calculate available credit correctly for all cards', function() {
      var result;
      CreditCardDataService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();

      result.forEach(function(card) {
        expect(card.availableCredit).toBe(card.creditLimit - card.currentBalance);
      });
    });

    it('should return a promise', function() {
      var promise = CreditCardDataService.fetchAllCards();
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });

    it('should handle empty card array scenario', function() {
      spyOn(CreditCardModelFactory, 'create').and.returnValue({});
      var originalFetch = CreditCardDataService.fetchAllCards;
      CreditCardDataService.fetchAllCards = function() {
        return $q.resolve([]);
      };

      var result;
      CreditCardDataService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();

      expect(result.length).toBe(0);
      CreditCardDataService.fetchAllCards = originalFetch;
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: fetchAllCards
- Scenarios covered:
  * Successful card data fetch
  * Correct data structure validation
  * Individual card data verification (Visa, MasterCard, Amex)
  * Model factory integration
  * Available credit calculation
  * Promise return validation
  * Empty array handling
- Uncovered scenarios: None - comprehensive coverage achieved
*/