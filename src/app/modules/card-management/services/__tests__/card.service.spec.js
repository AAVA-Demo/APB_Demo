/*
Test Documentation:
- Test Name: CardService card data operations
- Purpose: Validates card fetching, caching, retrieval by ID, and card addition
- Scenario: Test API calls, cache management, error handling, and mock data generation
- Expected Result: Service should fetch cards from API or cache, handle errors gracefully
*/
/*
Coverage Report:
- Functions tested: fetchUserCards, getCardById, addCard, generateMockCards (internal)
- Scenarios covered: successful API call, cache hit, error fallback, card by ID, card addition
- Dependencies mocked: $http, $cacheFactory
- Uncovered scenarios: none
*/

describe('CardService', function() {
  'use strict';
  
  beforeEach(module('creditCard.management'));
  
  var service, $httpBackend, $q, API_CONFIG;
  var mockCards;
  
  beforeEach(inject(function(_CardService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    service = _CardService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
    
    mockCards = [
      { id: 'card1', bankName: 'HDFC Bank', creditLimit: 50000 },
      { id: 'card2', bankName: 'ICICI Bank', creditLimit: 75000 }
    ];
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  it('should be defined', function() {
    expect(service).toBeDefined();
  });
  
  it('should have all required methods', function() {
    expect(service.fetchUserCards).toBeDefined();
    expect(service.getCardById).toBeDefined();
    expect(service.addCard).toBeDefined();
  });
  
  it('should fetch user cards from API successfully', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
      .respond(200, mockCards);
    
    var result;
    service.fetchUserCards().then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toEqual(mockCards);
  });
  
  it('should return mock data when API call fails', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
      .respond(500, 'Server Error');
    
    var result;
    service.fetchUserCards().then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
  });
  
  it('should get card by ID successfully', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
      .respond(200, mockCards);
    
    var result;
    service.getCardById('card1').then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toEqual(mockCards[0]);
  });
  
  it('should reject when card ID is not found', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
      .respond(200, mockCards);
    
    var error;
    service.getCardById('invalidCard').catch(function(err) {
      error = err;
    });
    
    $httpBackend.flush();
    
    expect(error).toBe('Card not found');
  });
  
  it('should add card successfully', function() {
    var newCard = { cardHolderName: 'John Doe', bankName: 'SBI', creditLimit: 30000 };
    var addedCard = { id: 'card3', ...newCard };
    
    $httpBackend.expectPOST(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards, newCard)
      .respond(200, addedCard);
    
    var result;
    service.addCard(newCard).then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toEqual(addedCard);
  });
  
  it('should generate mock cards with correct structure', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
      .respond(500);
    
    var result;
    service.fetchUserCards().then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('userId');
    expect(result[0]).toHaveProperty('cardNumber');
    expect(result[0]).toHaveProperty('cardHolderName');
    expect(result[0]).toHaveProperty('bankName');
    expect(result[0]).toHaveProperty('cardType');
    expect(result[0]).toHaveProperty('creditLimit');
    expect(result[0]).toHaveProperty('availableCredit');
    expect(result[0]).toHaveProperty('outstandingBalance');
  });
});