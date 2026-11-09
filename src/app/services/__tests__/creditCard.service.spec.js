/*
Test Documentation:
- Test Name: creditCard.service - getAllCards, getCardDetails, getCardById
- Purpose: Validate credit card data retrieval with caching
- Scenario: Service provides mock credit card data with caching mechanism
- Expected Result: Returns card information with proper caching behavior
*/

describe('CreditCardService (creditCard.service.js)', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CreditCardService;
  var $timeout;
  var $rootScope;
  
  beforeEach(inject(function(_CreditCardService_, _$timeout_, _$rootScope_) {
    CreditCardService = _CreditCardService_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getAllCards', function() {
    it('should return all mock credit cards', function(done) {
      CreditCardService.getAllCards().then(function(cards) {
        expect(cards).toBeDefined();
        expect(cards.length).toBe(3);
        expect(cards[0].cardId).toBe('CC001');
        expect(cards[1].cardId).toBe('CC002');
        expect(cards[2].cardId).toBe('CC003');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should return cached data on subsequent calls', function(done) {
      CreditCardService.getAllCards().then(function(firstCall) {
        CreditCardService.getAllCards().then(function(secondCall) {
          expect(secondCall).toEqual(firstCall);
          done();
        });
        $rootScope.$apply();
      });
      
      $timeout.flush();
    });
    
    it('should return cards with all required properties', function(done) {
      CreditCardService.getAllCards().then(function(cards) {
        cards.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.bankName).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.outstandingAmount).toBeDefined();
          expect(card.status).toBeDefined();
        });
        done();
      });
      
      $timeout.flush();
    });
  });
  
  describe('getCardDetails', function() {
    it('should return cards matching provided IDs', function(done) {
      var cardIds = ['CC001', 'CC003'];
      
      CreditCardService.getCardDetails(cardIds).then(function(cards) {
        expect(cards.length).toBe(2);
        expect(cards[0].cardId).toBe('CC001');
        expect(cards[1].cardId).toBe('CC003');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should return empty array for non-matching IDs', function(done) {
      var cardIds = ['INVALID_ID'];
      
      CreditCardService.getCardDetails(cardIds).then(function(cards) {
        expect(cards).toEqual([]);
        done();
      });
      
      $timeout.flush();
    });
    
    it('should handle empty cardIds array', function(done) {
      var cardIds = [];
      
      CreditCardService.getCardDetails(cardIds).then(function(cards) {
        expect(cards).toEqual([]);
        done();
      });
      
      $timeout.flush();
    });
  });
  
  describe('getCardById', function() {
    it('should return a specific card by ID', function(done) {
      var cardId = 'CC002';
      
      CreditCardService.getCardById(cardId).then(function(card) {
        expect(card).toBeDefined();
        expect(card.cardId).toBe('CC002');
        expect(card.cardNumber).toBe('****5678');
        expect(card.cardType).toBe('Mastercard');
        done();
      });
      
      $timeout.flush();
    });
    
    it('should reject for non-existent card ID', function(done) {
      var cardId = 'INVALID_CARD';
      
      CreditCardService.getCardById(cardId).catch(function(error) {
        expect(error).toBe('Card not found');
        done();
      });
      
      $timeout.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getAllCards, getCardDetails, getCardById
- Scenarios covered:
  * Retrieve all cards
  * Caching behavior
  * Card property validation
  * Filter by card IDs
  * Empty/invalid ID handling
  * Single card retrieval
  * Card not found error
- Uncovered scenarios: None
- Edge cases: Empty arrays, invalid IDs, caching
*/