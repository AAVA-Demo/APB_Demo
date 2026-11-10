/*
Test Documentation:
- Test Name: CardMetadataService - fetchCardList success
- Purpose: Validates retrieval of card metadata for a user
- Scenario: User requests list of cards with metadata
- Expected Result: Promise resolves with array of card objects
*/
/*
Test Documentation:
- Test Name: CardMetadataService - fetchCardList empty response
- Purpose: Validates handling of empty card list
- Scenario: API returns response without cards array
- Expected Result: Returns empty array
*/
/*
Test Documentation:
- Test Name: CardMetadataService - fetchCardList error
- Purpose: Validates error handling when API fails
- Scenario: HTTP request fails with error
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: fetchCardList
- Scenarios covered: successful retrieval, empty response, API error, multiple cards
- Uncovered scenarios: partial card data, network timeout
*/

describe('CardMetadataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CardMetadataService, $httpBackend;
  
  beforeEach(inject(function(_CardMetadataService_, _$httpBackend_) {
    CardMetadataService = _CardMetadataService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchCardList', function() {
    it('should return array of cards when API call succeeds', function() {
      var userId = 'user123';
      var mockResponse = {
        cards: [
          { cardId: 'card1', cardName: 'Visa Platinum', cardType: 'Credit' },
          { cardId: 'card2', cardName: 'Mastercard Gold', cardType: 'Credit' }
        ]
      };
      
      $httpBackend.expectGET('/api/cards/metadata?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      CardMetadataService.fetchCardList(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse.cards);
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
      expect(result[1].cardName).toBe('Mastercard Gold');
    });
    
    it('should return empty array when cards property is missing from response', function() {
      var userId = 'user123';
      var mockResponse = {};
      
      $httpBackend.expectGET('/api/cards/metadata?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      CardMetadataService.fetchCardList(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should return empty array when cards is null', function() {
      var userId = 'user123';
      var mockResponse = { cards: null };
      
      $httpBackend.expectGET('/api/cards/metadata?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      CardMetadataService.fetchCardList(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should reject promise when API call fails', function() {
      var userId = 'user123';
      var errorResponse = { message: 'Internal Server Error' };
      
      $httpBackend.expectGET('/api/cards/metadata?userId=' + userId)
        .respond(500, errorResponse);
      
      var error;
      CardMetadataService.fetchCardList(userId).catch(function(err) {
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
          { cardId: 'card1', cardName: 'Visa Platinum', cardType: 'Credit' }
        ]
      };
      
      $httpBackend.expectGET('/api/cards/metadata?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      CardMetadataService.fetchCardList(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(1);
      expect(result[0].cardId).toBe('card1');
    });
    
    it('should handle 404 error when user has no cards', function() {
      var userId = 'user123';
      
      $httpBackend.expectGET('/api/cards/metadata?userId=' + userId)
        .respond(404, { message: 'No cards found' });
      
      var error;
      CardMetadataService.fetchCardList(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
  });
});