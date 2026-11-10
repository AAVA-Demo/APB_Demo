/*
Test Documentation:
- Test Name: CreditCardRepositoryFactory - getUserCards
- Purpose: Validates retrieval of all cards for a user
- Scenario: Valid userId provided
- Expected Result: Returns array of user's credit cards
*/
/*
Test Documentation:
- Test Name: CreditCardRepositoryFactory - getCardById found
- Purpose: Validates retrieval of specific card by ID
- Scenario: Valid cardId exists
- Expected Result: Returns matching card object
*/
/*
Test Documentation:
- Test Name: CreditCardRepositoryFactory - getCardById not found
- Purpose: Validates behavior when card ID does not exist
- Scenario: Invalid cardId provided
- Expected Result: Returns null
*/
/*
Coverage Report:
- Functions tested: getUserCards, getCardById
- Scenarios covered: successful retrieval, card found, card not found, data immutability
- Uncovered scenarios: none
*/

describe('CreditCardRepositoryFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CreditCardRepositoryFactory;
  var $timeout;
  var $rootScope;
  
  beforeEach(inject(function(_CreditCardRepositoryFactory_, _$timeout_, _$rootScope_) {
    CreditCardRepositoryFactory = _CreditCardRepositoryFactory_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getUserCards', function() {
    it('should return all cards for a user', function() {
      var result;
      CreditCardRepositoryFactory.getUserCards('user123').then(function(cards) {
        result = cards;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].cardId).toBe('card1');
    });
    
    it('should return a copy of data', function() {
      var result;
      CreditCardRepositoryFactory.getUserCards('user123').then(function(cards) {
        result = cards;
        result[0].cardNumber = 'MODIFIED';
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      var secondResult;
      CreditCardRepositoryFactory.getUserCards('user123').then(function(cards) {
        secondResult = cards;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(secondResult[0].cardNumber).toBe('****1234');
    });
    
    it('should return a promise', function() {
      var promise = CreditCardRepositoryFactory.getUserCards('user123');
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });
  });
  
  describe('getCardById', function() {
    it('should return card when cardId exists', function() {
      var result;
      CreditCardRepositoryFactory.getCardById('card2').then(function(card) {
        result = card;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe('card2');
      expect(result.cardNumber).toBe('****5678');
      expect(result.cardType).toBe('MasterCard');
    });
    
    it('should return null when cardId does not exist', function() {
      var result;
      CreditCardRepositoryFactory.getCardById('invalidCard').then(function(card) {
        result = card;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result).toBeNull();
    });
    
    it('should return a copy of card data', function() {
      var result;
      CreditCardRepositoryFactory.getCardById('card1').then(function(card) {
        result = card;
        result.cardNumber = 'MODIFIED';
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      var secondResult;
      CreditCardRepositoryFactory.getCardById('card1').then(function(card) {
        secondResult = card;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(secondResult.cardNumber).toBe('****1234');
    });
    
    it('should return a promise', function() {
      var promise = CreditCardRepositoryFactory.getCardById('card1');
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });
  });
});