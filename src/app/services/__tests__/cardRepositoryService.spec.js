/*
Test Documentation:
- Test Name: cardRepositoryService Unit Tests
- Purpose: Validate user card retrieval and individual card details
- Scenario: Test getUserCards and getCardDetails methods with mock data
- Expected Result: Correct card IDs and detailed card information
*/

describe('cardRepositoryService', function() {
  'use strict';
  
  var cardRepositoryService, $timeout;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_cardRepositoryService_, _$timeout_) {
    cardRepositoryService = _cardRepositoryService_;
    $timeout = _$timeout_;
  }));
  
  describe('getUserCards', function() {
    it('should return array of card IDs for user', function() {
      var result;
      cardRepositoryService.getUserCards('user123').then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(result.cardIds).toBeDefined();
      expect(result.cardIds.length).toBe(3);
      expect(result.cardIds).toContain('card1');
      expect(result.cardIds).toContain('card2');
      expect(result.cardIds).toContain('card3');
    });
    
    it('should resolve promise asynchronously', function() {
      var resolved = false;
      cardRepositoryService.getUserCards('user123').then(function() {
        resolved = true;
      });
      
      expect(resolved).toBe(false);
      $timeout.flush();
      expect(resolved).toBe(true);
    });
  });
  
  describe('getCardDetails', function() {
    it('should return card details for valid card ID', function() {
      var result;
      cardRepositoryService.getCardDetails('card1').then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe('card1');
      expect(result.cardNumber).toBe('****1234');
      expect(result.cardType).toBe('Visa');
      expect(result.creditLimit).toBe(5000);
      expect(result.availableCredit).toBe(3500);
      expect(result.outstandingAmount).toBe(1500);
    });
    
    it('should return Mastercard details for card2', function() {
      var result;
      cardRepositoryService.getCardDetails('card2').then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result.cardType).toBe('Mastercard');
      expect(result.creditLimit).toBe(10000);
    });
    
    it('should reject promise for invalid card ID', function() {
      var error;
      cardRepositoryService.getCardDetails('invalid-card').catch(function(err) {
        error = err;
      });
      
      $timeout.flush();
      
      expect(error).toBe('Card not found');
    });
    
    it('should include lastUpdated timestamp', function() {
      var result;
      cardRepositoryService.getCardDetails('card1').then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated instanceof Date).toBe(true);
    });
  });
});

/*
Coverage Report:
- Functions tested: getUserCards, getCardDetails
- Scenarios covered:
  * User card ID retrieval
  * Card details for valid IDs
  * Invalid card ID error handling
  * Async promise resolution
  * Data completeness validation
- Uncovered scenarios: None
*/