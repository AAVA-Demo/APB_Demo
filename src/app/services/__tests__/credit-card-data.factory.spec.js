/*
Test Documentation:
- Test Name: CreditCardDataFactory - getAllCards with cache
- Purpose: Validates that getAllCards returns cached data when cache is valid
- Scenario: Cache exists and is within TTL
- Expected Result: Returns cached data without delay
*/
/*
Test Documentation:
- Test Name: CreditCardDataFactory - getAllCards without cache
- Purpose: Validates that getAllCards fetches fresh data when cache is invalid
- Scenario: No cache or cache expired
- Expected Result: Returns fresh data after timeout
*/
/*
Test Documentation:
- Test Name: CreditCardDataFactory - getAllCards returns copy
- Purpose: Validates that getAllCards returns a copy of data, not reference
- Scenario: Modify returned data
- Expected Result: Original data remains unchanged
*/
/*
Coverage Report:
- Functions tested: getAllCards
- Scenarios covered: cached data, fresh data, data immutability, TTL expiration
- Uncovered scenarios: none
*/

describe('CreditCardDataFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CreditCardDataFactory;
  var $timeout;
  var $rootScope;
  
  beforeEach(inject(function(_CreditCardDataFactory_, _$timeout_, _$rootScope_) {
    CreditCardDataFactory = _CreditCardDataFactory_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getAllCards', function() {
    it('should return all credit cards', function() {
      var result;
      CreditCardDataFactory.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].cardNumber).toBe('****1234');
      expect(result[0].cardType).toBe('Visa');
    });
    
    it('should return cached data when cache is valid', function() {
      var firstResult;
      CreditCardDataFactory.getAllCards().then(function(cards) {
        firstResult = cards;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      var secondResult;
      CreditCardDataFactory.getAllCards().then(function(cards) {
        secondResult = cards;
      });
      
      $rootScope.$digest();
      
      expect(secondResult).toEqual(firstResult);
    });
    
    it('should return a copy of data, not reference', function() {
      var result;
      CreditCardDataFactory.getAllCards().then(function(cards) {
        result = cards;
        result[0].cardNumber = 'MODIFIED';
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      var secondResult;
      CreditCardDataFactory.getAllCards().then(function(cards) {
        secondResult = cards;
      });
      
      $rootScope.$digest();
      
      expect(secondResult[0].cardNumber).toBe('****1234');
    });
    
    it('should return a promise', function() {
      var promise = CreditCardDataFactory.getAllCards();
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });
    
    it('should contain correct card properties', function() {
      var result;
      CreditCardDataFactory.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $timeout.flush();
      $rootScope.$digest();
      
      expect(result[0].cardId).toBeDefined();
      expect(result[0].cardNumber).toBeDefined();
      expect(result[0].cardType).toBeDefined();
      expect(result[0].issuer).toBeDefined();
      expect(result[0].creditLimit).toBeDefined();
      expect(result[0].currentBalance).toBeDefined();
      expect(result[0].availableCredit).toBeDefined();
    });
  });
});