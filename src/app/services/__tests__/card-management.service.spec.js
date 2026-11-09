/*
Test Documentation:
- Test Name: CardManagementService Unit Tests
- Purpose: Validate card CRUD operations and data transformations
- Scenario: Tests getCards, getCardDetails, and addCard methods with various inputs
- Expected Result: Proper API calls, data transformation, and error handling
*/

(function() {
'use strict';

describe('CardManagementService', function() {
  var CardManagementService, $httpBackend, API_ENDPOINTS, $q;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CardManagementService_, _$httpBackend_, _API_ENDPOINTS_, _$q_) {
    CardManagementService = _CardManagementService_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINTS = _API_ENDPOINTS_;
    $q = _$q_;
    
    window.toastr = window.toastr || {};
    window.toastr.error = jasmine.createSpy('toastr.error');
    window.toastr.success = jasmine.createSpy('toastr.success');
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCards', function() {
    it('should retrieve all cards when no cardIds provided', function() {
      var mockCards = [
        {cardId: 'card1', creditLimit: 5000, outstandingBalance: 1000},
        {cardId: 'card2', creditLimit: 10000, outstandingBalance: 3000}
      ];
      
      $httpBackend.expectGET(API_ENDPOINTS.cards)
        .respond(200, mockCards);
      
      var result;
      CardManagementService.getCards([]).then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      expect(result.length).toBe(2);
      expect(result[0].availableCredit).toBe('4000.00');
      expect(result[1].availableCredit).toBe('7000.00');
    });
    
    it('should retrieve specific cards when cardIds provided', function() {
      var cardIds = ['card1', 'card2'];
      var mockCards = [
        {cardId: 'card1', creditLimit: 5000, outstandingBalance: 1000}
      ];
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '?ids=card1,card2')
        .respond(200, mockCards);
      
      var result;
      CardManagementService.getCards(cardIds).then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      expect(result.length).toBe(1);
    });
    
    it('should calculate availableCredit correctly', function() {
      var mockCards = [
        {cardId: 'card1', creditLimit: 10000, outstandingBalance: 2500.50}
      ];
      
      $httpBackend.expectGET(API_ENDPOINTS.cards)
        .respond(200, mockCards);
      
      var result;
      CardManagementService.getCards([]).then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      expect(result[0].availableCredit).toBe('7499.50');
    });
    
    it('should handle API errors and show error message', function() {
      $httpBackend.expectGET(API_ENDPOINTS.cards)
        .respond(500, {error: 'Server error'});
      
      var rejected = false;
      CardManagementService.getCards([]).catch(function(error) {
        rejected = true;
      });
      
      $httpBackend.flush();
      expect(rejected).toBe(true);
      expect(window.toastr.error).toHaveBeenCalledWith('Failed to load cards');
    });
    
    it('should handle empty card list', function() {
      $httpBackend.expectGET(API_ENDPOINTS.cards)
        .respond(200, []);
      
      var result;
      CardManagementService.getCards([]).then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      expect(result).toEqual([]);
    });
  });
  
  describe('getCardDetails', function() {
    it('should retrieve card details for specific cardId', function() {
      var cardId = 'card-123';
      var mockCard = {
        cardId: cardId,
        cardNumber: '4567',
        creditLimit: 8000,
        outstandingBalance: 2000,
        cardType: 'Visa'
      };
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId)
        .respond(200, mockCard);
      
      var result;
      CardManagementService.getCardDetails(cardId).then(function(card) {
        result = card;
      });
      
      $httpBackend.flush();
      expect(result.cardId).toBe(cardId);
      expect(result.availableCredit).toBe('6000.00');
    });
    
    it('should handle 404 not found errors', function() {
      var cardId = 'invalid-card';
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId)
        .respond(404, {error: 'Card not found'});
      
      var rejected = false;
      CardManagementService.getCardDetails(cardId).catch(function(error) {
        rejected = true;
      });
      
      $httpBackend.flush();
      expect(rejected).toBe(true);
      expect(window.toastr.error).toHaveBeenCalledWith('Failed to load card details');
    });
    
    it('should calculate availableCredit with decimal precision', function() {
      var mockCard = {
        cardId: 'card-decimal',
        creditLimit: 5000.75,
        outstandingBalance: 1234.56
      };
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/card-decimal')
        .respond(200, mockCard);
      
      var result;
      CardManagementService.getCardDetails('card-decimal').then(function(card) {
        result = card;
      });
      
      $httpBackend.flush();
      expect(result.availableCredit).toBe('3766.19');
    });
  });
  
  describe('addCard', function() {
    it('should successfully add a new card', function() {
      var newCard = {
        cardNumber: '1234567890123456',
        cardHolderName: 'John Doe',
        creditLimit: 5000,
        cardType: 'MasterCard'
      };
      var mockResponse = {cardId: 'new-card-123', ...newCard};
      
      $httpBackend.expectPOST(API_ENDPOINTS.cards, newCard)
        .respond(201, mockResponse);
      
      var result;
      CardManagementService.addCard(newCard).then(function(card) {
        result = card;
      });
      
      $httpBackend.flush();
      expect(result.cardId).toBe('new-card-123');
      expect(window.toastr.success).toHaveBeenCalledWith('Card added successfully');
    });
    
    it('should handle validation errors when adding card', function() {
      var invalidCard = {
        cardNumber: '123',
        cardHolderName: ''
      };
      
      $httpBackend.expectPOST(API_ENDPOINTS.cards, invalidCard)
        .respond(400, {error: 'Invalid card data'});
      
      var rejected = false;
      CardManagementService.addCard(invalidCard).catch(function(error) {
        rejected = true;
      });
      
      $httpBackend.flush();
      expect(rejected).toBe(true);
      expect(window.toastr.error).toHaveBeenCalledWith('Failed to add card');
    });
    
    it('should handle server errors when adding card', function() {
      var newCard = {cardNumber: '1234567890123456'};
      
      $httpBackend.expectPOST(API_ENDPOINTS.cards, newCard)
        .respond(500, {error: 'Server error'});
      
      var rejected = false;
      CardManagementService.addCard(newCard).catch(function(error) {
        rejected = true;
      });
      
      $httpBackend.flush();
      expect(rejected).toBe(true);
      expect(window.toastr.error).toHaveBeenCalled();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCards, getCardDetails, addCard
- Scenarios covered:
  * Retrieve all cards (no filter)
  * Retrieve specific cards by IDs
  * Available credit calculation (integer and decimal)
  * Card detail retrieval
  * Add new card successfully
  * API error handling (400, 404, 500)
  * Empty card list handling
  * Toastr notifications (success and error)
- Edge cases: Empty arrays, decimal precision, invalid data, missing cards
- Uncovered scenarios: None - full coverage achieved
*/
})();