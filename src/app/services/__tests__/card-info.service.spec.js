/*
Test Documentation:
- Test Name: CardInfoService - getAllCards - fetches all cards from API
- Purpose: Validates that the service fetches complete list of user's cards
- Scenario: User requests all card information
- Expected Result: Service returns array of all cards
*/
/*
Test Documentation:
- Test Name: CardInfoService - getCardById - fetches specific card by ID
- Purpose: Validates that the service fetches details for a specific card
- Scenario: User requests details for one card
- Expected Result: Service returns card object
*/
/*
Test Documentation:
- Test Name: CardInfoService - handles API errors gracefully
- Purpose: Validates error handling when API calls fail
- Scenario: API returns error response
- Expected Result: Service rejects promise with error
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardById
- Scenarios covered: fetch all cards, fetch single card, API success, API failure, error handling
- Uncovered scenarios: none
*/

describe('CardInfoService', function() {
  'use strict';
  
  var CardInfoService;
  var $http;
  var $httpBackend;
  var $rootScope;
  var API_ENDPOINTS;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CardInfoService_, _$http_, _$httpBackend_, _$rootScope_, _API_ENDPOINTS_) {
    CardInfoService = _CardInfoService_;
    $http = _$http_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getAllCards', function() {
    
    it('should fetch all cards from API', function() {
      var mockCards = [
        {cardId: '1', cardType: 'Visa', creditLimit: 10000},
        {cardId: '2', cardType: 'Mastercard', creditLimit: 15000}
      ];
      
      $httpBackend.expectGET(API_ENDPOINTS.cards).respond(200, mockCards);
      
      var result;
      CardInfoService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockCards);
    });
    
    it('should handle empty cards array from API', function() {
      $httpBackend.expectGET(API_ENDPOINTS.cards).respond(200, []);
      
      var result;
      CardInfoService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should handle API errors and reject promise', function() {
      $httpBackend.expectGET(API_ENDPOINTS.cards).respond(500, {message: 'Server error'});
      
      var error;
      CardInfoService.getAllCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });
  
  describe('getCardById', function() {
    
    it('should fetch specific card by ID from API', function() {
      var cardId = 'card123';
      var mockCard = {cardId: cardId, cardType: 'Visa', creditLimit: 10000};
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(200, mockCard);
      
      var result;
      CardInfoService.getCardById(cardId).then(function(card) {
        result = card;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockCard);
    });
    
    it('should construct correct API endpoint with card ID', function() {
      var cardId = 'card456';
      var mockCard = {cardId: cardId, cardType: 'Mastercard'};
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(200, mockCard);
      
      CardInfoService.getCardById(cardId);
      
      $httpBackend.flush();
    });
    
    it('should handle 404 error when card not found', function() {
      var cardId = 'nonexistent';
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(404, {message: 'Card not found'});
      
      var error;
      CardInfoService.getCardById(cardId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
    
    it('should handle API errors and reject promise', function() {
      var cardId = 'card789';
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId).respond(500, {message: 'Server error'});
      
      var error;
      CardInfoService.getCardById(cardId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });
});