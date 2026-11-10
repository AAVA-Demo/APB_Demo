/*
Test Documentation:
- Test Name: CardService - getCards success
- Purpose: Validates retrieval of user credit cards
- Scenario: User requests their credit card list
- Expected Result: Promise resolves with array of card objects
*/
/*
Test Documentation:
- Test Name: CardService - getCards empty response
- Purpose: Validates handling when user has no cards
- Scenario: API returns response without cards array
- Expected Result: Returns empty array
*/
/*
Test Documentation:
- Test Name: CardService - getCards error
- Purpose: Validates error handling when API fails
- Scenario: HTTP request fails with server error
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getCards
- Scenarios covered: successful retrieval, empty response, API errors, multiple cards
- Uncovered scenarios: network timeout, partial card data
*/

describe('CardService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CardService, $httpBackend;
  
  beforeEach(inject(function(_CardService_, _$httpBackend_) {
    CardService = _CardService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCards', function() {
    it('should return array of cards when API call succeeds', function() {
      var userId = 'user123';
      var mockResponse = {
        cards: [
          { 
            cardId: 'card1', 
            cardName: 'Visa Platinum', 
            cardType: 'Credit',
            balance: 1500,
            creditLimit: 10000,
            availableCredit: 8500
          },
          { 
            cardId: 'card2', 
            cardName: 'Mastercard Gold', 
            cardType: 'Credit',
            balance: 800,
            creditLimit: 5000,
            availableCredit: 4200
          }
        ]
      };
      
      $httpBackend.expectGET('/api/cards?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      CardService.getCards(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse.cards);
      expect(result.length).toBe(2);
      expect(result[0].cardName).toBe('Visa Platinum');
      expect(result[0].balance).toBe(1500);
      expect(result[1].availableCredit).toBe(4200);
    });
    
    it('should return empty array when cards property is missing from response', function() {
      var userId = 'user123';
      var mockResponse = {};
      
      $httpBackend.expectGET('/api/cards?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      CardService.getCards(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should return empty array when cards is null', function() {
      var userId = 'user123';
      var mockResponse = { cards: null };
      
      $httpBackend.expectGET('/api/cards?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      CardService.getCards(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should reject promise when API call fails', function() {
      var userId = 'user123';
      var errorResponse = { message: 'Internal Server Error' };
      
      $httpBackend.expectGET('/api/cards?userId=' + userId)
        .respond(500, errorResponse);
      
      var error;
      CardService.getCards(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should handle single card in response', function() {
      var userId = 'user123';
      var mockResponse = {
        cards: [
          { cardId: 'card1', cardName: 'Visa Platinum', balance: 1500 }
        ]
      };
      
      $httpBackend.expectGET('/api/cards?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      CardService.getCards(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(1);
      expect(result[0].cardId).toBe('card1');
    });
    
    it('should handle 401 unauthorized error', function() {
      var userId = 'user123';
      
      $httpBackend.expectGET('/api/cards?userId=' + userId)
        .respond(401, { message: 'Unauthorized' });
      
      var error;
      CardService.getCards(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
    
    it('should handle 404 not found error', function() {
      var userId = 'user999';
      
      $httpBackend.expectGET('/api/cards?userId=' + userId)
        .respond(404, { message: 'User not found' });
      
      var error;
      CardService.getCards(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
  });
});