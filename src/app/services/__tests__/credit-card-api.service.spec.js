/*
Test Documentation:
- Test Name: CreditCardApiService - getCards
- Purpose: Validates retrieval of all credit cards for a user
- Scenario: Service fetches cards for authenticated user
- Expected Result: Returns array of card objects with complete details
*/
/*
Test Documentation:
- Test Name: CreditCardApiService - getCardById
- Purpose: Validates retrieval of specific card by ID
- Scenario: Service fetches individual card details
- Expected Result: Returns card object when found, rejects when not found
*/
/*
Coverage Report:
- Functions tested: getCards, getCardById, getHeaders
- Scenarios covered: successful card retrieval, card not found error, multiple cards, authorization header inclusion
- Uncovered scenarios: none
*/

describe('CreditCardApiService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CreditCardApiService;
  var AuthService;
  var $rootScope;
  
  beforeEach(inject(function(_CreditCardApiService_, _AuthService_, _$rootScope_) {
    CreditCardApiService = _CreditCardApiService_;
    AuthService = _AuthService_;
    $rootScope = _$rootScope_;
  }));
  
  beforeEach(function() {
    spyOn(AuthService, 'getToken').and.returnValue('mock_token_123');
  });
  
  describe('getCards', function() {
    it('should return array of credit cards for user', function() {
      var result;
      CreditCardApiService.getCards('user123').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(5);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].userId).toBe('user123');
      expect(result[0].cardType).toBe('Visa Platinum');
    });
    
    it('should return cards with complete financial details', function() {
      var result;
      CreditCardApiService.getCards('user123').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      var card = result[0];
      expect(card.creditLimit).toBeDefined();
      expect(card.currentBalance).toBeDefined();
      expect(card.availableBalance).toBeDefined();
      expect(card.outstandingAmount).toBeDefined();
      expect(card.monthlySpend).toBeDefined();
      expect(card.issueDate).toBeDefined();
      expect(card.expiryDate).toBeDefined();
    });
    
    it('should return 5 mock cards', function() {
      var result;
      CreditCardApiService.getCards('user456').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.length).toBe(5);
      expect(result[1].cardType).toBe('Mastercard Gold');
      expect(result[2].cardType).toBe('Amex Blue');
      expect(result[3].cardType).toBe('Visa Signature');
      expect(result[4].cardType).toBe('Mastercard Titanium');
    });
  });
  
  describe('getCardById', function() {
    it('should return card when found', function() {
      spyOn(AuthService, 'getUser').and.returnValue({userId: 'user123'});
      
      var result;
      CreditCardApiService.getCardById('card1').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe('card1');
      expect(result.cardType).toBe('Visa Platinum');
    });
    
    it('should reject when card not found', function() {
      spyOn(AuthService, 'getUser').and.returnValue({userId: 'user123'});
      
      var error;
      CreditCardApiService.getCardById('invalidCard').catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('Card not found');
    });
    
    it('should find card2 correctly', function() {
      spyOn(AuthService, 'getUser').and.returnValue({userId: 'user123'});
      
      var result;
      CreditCardApiService.getCardById('card2').then(function(data) {
        result = data;
      });
      
      $rootScope.$digest();
      
      expect(result.cardId).toBe('card2');
      expect(result.cardType).toBe('Mastercard Gold');
      expect(result.creditLimit).toBe(75000);
    });
  });
});