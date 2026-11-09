/*
Test Documentation:
- Test Name: creditCardDataService Unit Tests
- Purpose: Validate credit card details retrieval by card ID
- Scenario: Test getCardDetails method with valid and invalid card IDs
- Expected Result: Correct card details or rejection for invalid IDs
*/

describe('creditCardDataService', function() {
  'use strict';
  
  var creditCardDataService, $timeout;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_creditCardDataService_, _$timeout_) {
    creditCardDataService = _creditCardDataService_;
    $timeout = _$timeout_;
  }));
  
  describe('getCardDetails', function() {
    it('should return card details for card1', function() {
      var result;
      creditCardDataService.getCardDetails('card1').then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(result.cardDetails).toBeDefined();
      expect(result.cardDetails.cardId).toBe('card1');
      expect(result.cardDetails.cardNumber).toBe('****1234');
      expect(result.cardDetails.cardType).toBe('Visa');
      expect(result.cardDetails.creditLimit).toBe(5000);
      expect(result.cardDetails.outstandingBalance).toBe(1500);
      expect(result.cardDetails.availableCredit).toBe(3500);
      expect(result.cardDetails.expiryDate).toBe('12/25');
    });
    
    it('should return card details for card2', function() {
      var result;
      creditCardDataService.getCardDetails('card2').then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result.cardDetails.cardType).toBe('Mastercard');
      expect(result.cardDetails.creditLimit).toBe(10000);
      expect(result.cardDetails.expiryDate).toBe('06/26');
    });
    
    it('should return card details for card3', function() {
      var result;
      creditCardDataService.getCardDetails('card3').then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result.cardDetails.cardType).toBe('Amex');
      expect(result.cardDetails.creditLimit).toBe(15000);
      expect(result.cardDetails.expiryDate).toBe('09/27');
    });
    
    it('should reject promise for invalid card ID', function() {
      var error;
      creditCardDataService.getCardDetails('invalid-card').catch(function(err) {
        error = err;
      });
      
      $timeout.flush();
      
      expect(error).toBe('Card not found');
    });
    
    it('should resolve promise asynchronously', function() {
      var resolved = false;
      creditCardDataService.getCardDetails('card1').then(function() {
        resolved = true;
      });
      
      expect(resolved).toBe(false);
      $timeout.flush();
      expect(resolved).toBe(true);
    });
    
    it('should return card with all required fields', function() {
      var result;
      creditCardDataService.getCardDetails('card1').then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      var card = result.cardDetails;
      expect(card.cardId).toBeDefined();
      expect(card.cardNumber).toBeDefined();
      expect(card.cardType).toBeDefined();
      expect(card.creditLimit).toBeDefined();
      expect(card.outstandingBalance).toBeDefined();
      expect(card.availableCredit).toBeDefined();
      expect(card.expiryDate).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardDetails
- Scenarios covered:
  * Card details retrieval for all mock cards
  * Invalid card ID error handling
  * Async promise resolution
  * Field completeness validation
- Uncovered scenarios: None
*/