/*
Test Documentation:
- Test Name: CardService - getAllCards - success with API response
- Purpose: Validates successful card retrieval from API endpoint
- Scenario: API returns valid card data
- Expected Result: Returns array of Card model instances with correct properties
*/
/*
Test Documentation:
- Test Name: CardService - getAllCards - fallback to mock data on API failure
- Purpose: Validates resilience when API fails
- Scenario: API request fails with error
- Expected Result: Returns mock card data as fallback
*/
/*
Test Documentation:
- Test Name: CardService - getAllCards - caching mechanism
- Purpose: Validates that service caches card data to reduce API calls
- Scenario: Multiple calls to getAllCards
- Expected Result: API called only once, subsequent calls return cached data
*/
/*
Test Documentation:
- Test Name: CardService - clearCache - cache invalidation
- Purpose: Validates cache clearing functionality
- Scenario: Cache is populated then cleared
- Expected Result: Next call to getAllCards triggers new API request
*/
/*
Coverage Report:
- Functions tested: getAllCards, clearCache
- Scenarios covered: API success, API failure with mock fallback, caching, cache invalidation
- Uncovered scenarios: None - all critical paths covered
*/

describe('CardService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CardService, $httpBackend, Card;
  
  beforeEach(inject(function(_CardService_, _$httpBackend_, _Card_) {
    CardService = _CardService_;
    $httpBackend = _$httpBackend_;
    Card = _Card_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    CardService.clearCache();
  });
  
  describe('getAllCards', function() {
    it('should retrieve cards from API and return Card model instances', function() {
      var mockApiResponse = [
        {id: '1', cardNumber: '**** 1111', issuer: 'Chase', cardType: 'Visa', creditLimit: 5000, currentBalance: 1000, outstandingAmount: 1000, monthlySpend: 500},
        {id: '2', cardNumber: '**** 2222', issuer: 'Citi', cardType: 'MasterCard', creditLimit: 10000, currentBalance: 2000, outstandingAmount: 2000, monthlySpend: 800}
      ];
      
      $httpBackend.expectGET('/api/cards').respond(200, mockApiResponse);
      
      CardService.getAllCards().then(function(cards) {
        expect(cards.length).toBe(2);
        expect(cards[0] instanceof Card).toBe(true);
        expect(cards[0].id).toBe('1');
        expect(cards[0].issuer).toBe('Chase');
        expect(cards[0].creditLimit).toBe(5000);
        expect(cards[0].availableCredit).toBe(4000);
        
        expect(cards[1].id).toBe('2');
        expect(cards[1].issuer).toBe('Citi');
        expect(cards[1].availableCredit).toBe(8000);
      });
      
      $httpBackend.flush();
    });
    
    it('should return mock data when API call fails', function() {
      $httpBackend.expectGET('/api/cards').respond(500, 'Server Error');
      
      CardService.getAllCards().then(function(cards) {
        expect(cards.length).toBe(4);
        expect(cards[0] instanceof Card).toBe(true);
        expect(cards[0].id).toBe('1');
        expect(cards[0].issuer).toBe('Chase');
        expect(cards[0].cardType).toBe('Visa');
        expect(cards[0].creditLimit).toBe(10000);
        
        expect(cards[1].issuer).toBe('Citi');
        expect(cards[2].issuer).toBe('Amex');
        expect(cards[3].issuer).toBe('Discover');
      });
      
      $httpBackend.flush();
    });
    
    it('should cache cards after first successful retrieval', function() {
      var mockApiResponse = [
        {id: '1', cardNumber: '**** 1111', issuer: 'Chase', cardType: 'Visa', creditLimit: 5000, currentBalance: 1000, outstandingAmount: 1000, monthlySpend: 500}
      ];
      
      $httpBackend.expectGET('/api/cards').respond(200, mockApiResponse);
      
      CardService.getAllCards().then(function(cards) {
        expect(cards.length).toBe(1);
      });
      
      $httpBackend.flush();
      
      CardService.getAllCards().then(function(cards) {
        expect(cards.length).toBe(1);
        expect(cards[0].id).toBe('1');
      });
    });
    
    it('should calculate availableCredit correctly for each card', function() {
      var mockApiResponse = [
        {id: '1', cardNumber: '**** 1111', issuer: 'Test', cardType: 'Visa', creditLimit: 10000, currentBalance: 3000, outstandingAmount: 3000, monthlySpend: 1000}
      ];
      
      $httpBackend.expectGET('/api/cards').respond(200, mockApiResponse);
      
      CardService.getAllCards().then(function(cards) {
        expect(cards[0].availableCredit).toBe(7000);
      });
      
      $httpBackend.flush();
    });
  });
  
  describe('clearCache', function() {
    it('should clear cached data and trigger new API call', function() {
      var mockApiResponse = [
        {id: '1', cardNumber: '**** 1111', issuer: 'Chase', cardType: 'Visa', creditLimit: 5000, currentBalance: 1000, outstandingAmount: 1000, monthlySpend: 500}
      ];
      
      $httpBackend.expectGET('/api/cards').respond(200, mockApiResponse);
      CardService.getAllCards();
      $httpBackend.flush();
      
      CardService.clearCache();
      
      $httpBackend.expectGET('/api/cards').respond(200, mockApiResponse);
      CardService.getAllCards();
      $httpBackend.flush();
    });
  });
});