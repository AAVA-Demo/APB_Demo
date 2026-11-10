/*
Test Documentation:
- Test Name: CreditCardDataFactory - getCards returns mock card data
- Purpose: Validates retrieval of credit card data for a user
- Scenario: Factory is called with user ID
- Expected Result: Returns promise resolving to array of 5 mock credit cards with complete details

- Test Name: CreditCardDataFactory - getCards includes all required card fields
- Purpose: Validates completeness of card data structure
- Scenario: Card data is retrieved
- Expected Result: Each card contains cardId, cardNumber, issuer, cardType, creditLimit, currentBalance, availableCredit, expiryDate, status

- Test Name: CreditCardDataFactory - getCards masks card numbers
- Purpose: Validates PCI-DSS compliance with card number masking
- Scenario: Card data is retrieved
- Expected Result: Card numbers are masked showing only last 4 digits

- Test Name: CreditCardDataFactory - getCards uses auth token
- Purpose: Validates authentication integration
- Scenario: Factory retrieves cards
- Expected Result: AuthService.getToken is called

Coverage Report:
- Functions tested: getCards
- Scenarios covered: data retrieval, data structure validation, card masking, authentication, async promise handling
- Uncovered scenarios: HTTP error handling (mock implementation)
*/

describe('CreditCardDataFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CreditCardDataFactory, AuthService, $q, $rootScope, $timeout;
  
  beforeEach(inject(function(_CreditCardDataFactory_, _AuthService_, _$q_, _$rootScope_, _$timeout_) {
    CreditCardDataFactory = _CreditCardDataFactory_;
    AuthService = _AuthService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    
    spyOn(AuthService, 'getToken').and.returnValue('mock-token-12345');
  }));
  
  describe('getCards', function() {
    it('should return promise resolving to array of 5 mock credit cards', function() {
      var result;
      CreditCardDataFactory.getCards('user-001').then(function(cards) {
        result = cards;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(5);
    });
    
    it('should include all required card fields', function() {
      var result;
      CreditCardDataFactory.getCards('user-001').then(function(cards) {
        result = cards;
      });
      
      $timeout.flush();
      
      var card = result[0];
      expect(card.cardId).toBeDefined();
      expect(card.cardNumber).toBeDefined();
      expect(card.issuer).toBeDefined();
      expect(card.cardType).toBeDefined();
      expect(card.creditLimit).toBeDefined();
      expect(card.currentBalance).toBeDefined();
      expect(card.availableCredit).toBeDefined();
      expect(card.expiryDate).toBeDefined();
      expect(card.status).toBeDefined();
    });
    
    it('should mask card numbers showing only last 4 digits', function() {
      var result;
      CreditCardDataFactory.getCards('user-001').then(function(cards) {
        result = cards;
      });
      
      $timeout.flush();
      
      result.forEach(function(card) {
        expect(card.cardNumber).toMatch(/^\*{4}\d{4}$/);
      });
    });
    
    it('should call AuthService.getToken', function() {
      CreditCardDataFactory.getCards('user-001');
      expect(AuthService.getToken).toHaveBeenCalled();
    });
    
    it('should return cards with Active status', function() {
      var result;
      CreditCardDataFactory.getCards('user-001').then(function(cards) {
        result = cards;
      });
      
      $timeout.flush();
      
      result.forEach(function(card) {
        expect(card.status).toBe('Active');
      });
    });
    
    it('should return cards with valid credit calculations', function() {
      var result;
      CreditCardDataFactory.getCards('user-001').then(function(cards) {
        result = cards;
      });
      
      $timeout.flush();
      
      result.forEach(function(card) {
        expect(card.creditLimit).toBeGreaterThan(0);
        expect(card.availableCredit).toBeGreaterThanOrEqual(0);
        expect(card.currentBalance).toBeGreaterThanOrEqual(0);
        expect(card.creditLimit).toBe(card.availableCredit + card.currentBalance);
      });
    });
  });
});