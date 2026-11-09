/*
Test Documentation:
- Test Name: CreditCardDataService - fetchCards - fetches multiple cards by IDs
- Purpose: Validates that the service fetches card details for provided card IDs
- Scenario: User requests details for multiple cards
- Expected Result: Service returns array of card objects
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - fetchCards - filters out failed card fetches
- Purpose: Validates that service continues when some card fetches fail
- Scenario: One or more card IDs return errors
- Expected Result: Service returns successfully fetched cards only
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - fetchCards - handles empty card ID array
- Purpose: Validates that service handles empty input gracefully
- Scenario: Empty array of card IDs provided
- Expected Result: Service returns empty array
*/
/*
Coverage Report:
- Functions tested: fetchCards
- Scenarios covered: multiple card fetch, partial failures, empty input, API success, API failure
- Uncovered scenarios: none
*/

describe('CreditCardDataService', function() {
  'use strict';
  
  var CreditCardDataService;
  var $http;
  var $httpBackend;
  var $q;
  var $rootScope;
  var API_ENDPOINTS;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CreditCardDataService_, _$http_, _$httpBackend_, _$q_, _$rootScope_, _API_ENDPOINTS_) {
    CreditCardDataService = _CreditCardDataService_;
    $http = _$http_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchCards', function() {
    
    it('should fetch multiple cards by their IDs', function() {
      var cardIds = ['card1', 'card2', 'card3'];
      var mockCard1 = {cardId: 'card1', cardType: 'Visa'};
      var mockCard2 = {cardId: 'card2', cardType: 'Mastercard'};
      var mockCard3 = {cardId: 'card3', cardType: 'Amex'};
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/card1').respond(200, mockCard1);
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/card2').respond(200, mockCard2);
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/card3').respond(200, mockCard3);
      
      var result;
      CreditCardDataService.fetchCards(cardIds).then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(3);
      expect(result[0]).toEqual(mockCard1);
      expect(result[1]).toEqual(mockCard2);
      expect(result[2]).toEqual(mockCard3);
    });
    
    it('should filter out failed card fetches and return successful ones', function() {
      var cardIds = ['card1', 'card2', 'card3'];
      var mockCard1 = {cardId: 'card1', cardType: 'Visa'};
      var mockCard3 = {cardId: 'card3', cardType: 'Amex'};
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/card1').respond(200, mockCard1);
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/card2').respond(404, {message: 'Card not found'});
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/card3').respond(200, mockCard3);
      
      var result;
      CreditCardDataService.fetchCards(cardIds).then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(mockCard1);
      expect(result[1]).toEqual(mockCard3);
    });
    
    it('should handle empty card IDs array', function() {
      var cardIds = [];
      
      var result;
      CreditCardDataService.fetchCards(cardIds).then(function(cards) {
        result = cards;
      });
      
      $rootScope.$digest();
      
      expect(result).toEqual([]);
    });
    
    it('should return empty array when all card fetches fail', function() {
      var cardIds = ['card1', 'card2'];
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/card1').respond(500, {message: 'Server error'});
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/card2').respond(404, {message: 'Not found'});
      
      var result;
      CreditCardDataService.fetchCards(cardIds).then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should make parallel requests for all card IDs', function() {
      var cardIds = ['card1', 'card2'];
      var mockCard1 = {cardId: 'card1', cardType: 'Visa'};
      var mockCard2 = {cardId: 'card2', cardType: 'Mastercard'};
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/card1').respond(200, mockCard1);
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/card2').respond(200, mockCard2);
      
      CreditCardDataService.fetchCards(cardIds);
      
      $httpBackend.flush();
    });
    
    it('should construct correct API endpoint for each card ID', function() {
      var cardIds = ['card123'];
      var mockCard = {cardId: 'card123', cardType: 'Visa'};
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/card123').respond(200, mockCard);
      
      CreditCardDataService.fetchCards(cardIds);
      
      $httpBackend.flush();
    });
  });
});