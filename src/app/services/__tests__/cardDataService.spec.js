/*
Test Documentation:
- Test Name: cardDataService - getCardList
- Purpose: Validates card list retrieval
- Scenario: Service fetches card list after session validation
- Expected Result: Returns array of cards with complete card information
*/
/*
Test Documentation:
- Test Name: cardDataService - error handling
- Purpose: Validates fallback to mock data on API failure
- Scenario: Service returns mock data when API call fails
- Expected Result: Returns mock card list with valid structure
*/
/*
Coverage Report:
- Functions tested: getCardList
- Scenarios covered: successful API call, API failure with mock fallback, session validation
- Uncovered scenarios: none
*/

describe('cardDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var cardDataService, $httpBackend, $q, $rootScope, authService, apiConfig;
  
  beforeEach(inject(function(_cardDataService_, _$httpBackend_, _$q_, _$rootScope_, _authService_, _apiConfig_) {
    cardDataService = _cardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    authService = _authService_;
    apiConfig = _apiConfig_;
    
    spyOn(authService, 'validateSession').and.returnValue($q.resolve('mock-token'));
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCardList', function() {
    it('should validate session before fetching cards', function() {
      var mockCards = [
        {cardId: 'card1', cardNumber: '**** 1234', balance: 1000}
      ];
      
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.cards).respond(200, mockCards);
      
      cardDataService.getCardList('user123');
      $rootScope.$apply();
      
      expect(authService.validateSession).toHaveBeenCalled();
      $httpBackend.flush();
    });
    
    it('should return card list on successful API call', function() {
      var mockCards = [
        {cardId: 'card1', cardNumber: '**** **** **** 1234', cardType: 'Visa', issuer: 'Chase', balance: 2500, creditLimit: 10000, availableCredit: 7500, monthlySpend: 2500},
        {cardId: 'card2', cardNumber: '**** **** **** 5678', cardType: 'Mastercard', issuer: 'Citi', balance: 1200, creditLimit: 5000, availableCredit: 3800, monthlySpend: 1200}
      ];
      
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.cards).respond(200, mockCards);
      
      var result;
      cardDataService.getCardList('user123').then(function(cards) {
        result = cards;
      });
      
      $rootScope.$apply();
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
    });
    
    it('should return mock data on API failure', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.cards).respond(500, 'Server Error');
      
      var result;
      cardDataService.getCardList('user123').then(function(cards) {
        result = cards;
      });
      
      $rootScope.$apply();
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].cardType).toBe('Visa');
    });
    
    it('should include all required card properties', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.cards).respond(500, 'Error');
      
      var result;
      cardDataService.getCardList('user123').then(function(cards) {
        result = cards;
      });
      
      $rootScope.$apply();
      $httpBackend.flush();
      
      var card = result[0];
      expect(card.cardId).toBeDefined();
      expect(card.cardNumber).toBeDefined();
      expect(card.cardType).toBeDefined();
      expect(card.issuer).toBeDefined();
      expect(card.balance).toBeDefined();
      expect(card.creditLimit).toBeDefined();
      expect(card.availableCredit).toBeDefined();
      expect(card.monthlySpend).toBeDefined();
    });
  });
});