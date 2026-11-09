/*
Test Documentation:
- Test Name: CreditCardService Unit Tests
- Purpose: Validate credit card details retrieval for multiple cards
- Scenario: Test getCardDetails with single and multiple card IDs, error handling
- Expected Result: Correct parallel API calls with proper error handling
*/

describe('CreditCardService', function() {
  'use strict';
  
  beforeEach(module('creditCard.transactions'));
  
  var CreditCardService, $httpBackend;
  var mockCard1, mockCard2;
  
  beforeEach(inject(function(_CreditCardService_, _$httpBackend_) {
    CreditCardService = _CreditCardService_;
    $httpBackend = _$httpBackend_;
    
    mockCard1 = { id: 'card1', cardName: 'Visa Gold', cardNumber: '**** 1234' };
    mockCard2 = { id: 'card2', cardName: 'Mastercard', cardNumber: '**** 5678' };
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCardDetails', function() {
    it('should fetch details for multiple cards', function() {
      $httpBackend.expectGET('/api/cards/card1').respond(200, mockCard1);
      $httpBackend.expectGET('/api/cards/card2').respond(200, mockCard2);
      
      CreditCardService.getCardDetails(['card1', 'card2']).then(function(cards) {
        expect(cards.length).toBe(2);
        expect(cards[0]).toEqual(mockCard1);
        expect(cards[1]).toEqual(mockCard2);
      });
      
      $httpBackend.flush();
    });
    
    it('should fetch details for a single card', function() {
      $httpBackend.expectGET('/api/cards/card1').respond(200, mockCard1);
      
      CreditCardService.getCardDetails(['card1']).then(function(cards) {
        expect(cards.length).toBe(1);
        expect(cards[0]).toEqual(mockCard1);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle empty card IDs array', function() {
      CreditCardService.getCardDetails([]).then(function(cards) {
        expect(cards).toEqual([]);
      });
    });
    
    it('should handle API errors for individual cards', function() {
      $httpBackend.expectGET('/api/cards/card1').respond(500, 'Server Error');
      
      CreditCardService.getCardDetails(['card1']).catch(function(error) {
        expect(error.status).toBe(500);
      });
      
      $httpBackend.flush();
    });
    
    it('should make parallel requests for multiple cards', function() {
      $httpBackend.expectGET('/api/cards/card1').respond(200, mockCard1);
      $httpBackend.expectGET('/api/cards/card2').respond(200, mockCard2);
      $httpBackend.expectGET('/api/cards/card3').respond(200, { id: 'card3', cardName: 'Amex' });
      
      CreditCardService.getCardDetails(['card1', 'card2', 'card3']).then(function(cards) {
        expect(cards.length).toBe(3);
      });
      
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardDetails
- Scenarios covered:
  * Multiple cards retrieval
  * Single card retrieval
  * Empty array handling
  * API error handling
  * Parallel request execution
- Edge cases: Empty array, server errors, multiple cards
- Uncovered scenarios: Partial failures, network timeouts, duplicate card IDs
*/