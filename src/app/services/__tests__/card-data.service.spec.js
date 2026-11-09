/*
Test Documentation:
- Test Name: CardDataService - getAllCards success
- Purpose: Validates successful retrieval of all credit cards from API
- Scenario: Service makes HTTP GET request to /api/cards
- Expected Result: Returns array of card objects
*/
/*
Test Documentation:
- Test Name: CardDataService - getAllCards fallback to mock data
- Purpose: Validates fallback to mock data when API is unavailable
- Scenario: API request fails, service returns mock card data
- Expected Result: Returns mock cards array with 5 cards
*/
/*
Test Documentation:
- Test Name: CardDataService - getCardById success
- Purpose: Validates retrieval of specific card by ID
- Scenario: Service makes HTTP GET request to /api/cards/:cardId
- Expected Result: Returns single card object matching cardId
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardById
- Scenarios covered: successful API calls, API failures with mock fallback, card not found error
- Uncovered scenarios: none
*/

describe('CardDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CardDataService, $httpBackend, $q;
  
  beforeEach(inject(function(_CardDataService_, _$httpBackend_, _$q_) {
    CardDataService = _CardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getAllCards', function() {
    it('should fetch all cards from API successfully', function() {
      var mockApiCards = [
        { cardId: 1, cardNumber: '****1111', cardType: 'Visa', creditLimit: 5000 },
        { cardId: 2, cardNumber: '****2222', cardType: 'MasterCard', creditLimit: 8000 }
      ];
      
      $httpBackend.expectGET('/api/cards').respond(200, mockApiCards);
      
      var result;
      CardDataService.getAllCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe(1);
      expect(result[1].cardId).toBe(2);
    });
    
    it('should return mock data when API fails', function() {
      $httpBackend.expectGET('/api/cards').respond(500, 'Server Error');
      
      var result;
      CardDataService.getAllCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(5);
      expect(result[0].cardNumber).toBe('****1234');
      expect(result[0].cardType).toBe('Visa');
      expect(result[0].issuer).toBe('Chase');
    });
    
    it('should return mock data when API is unreachable', function() {
      $httpBackend.expectGET('/api/cards').respond(0, '');
      
      var result;
      CardDataService.getAllCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(5);
    });
  });
  
  describe('getCardById', function() {
    it('should fetch specific card by ID from API successfully', function() {
      var mockCard = { cardId: 3, cardNumber: '****3333', cardType: 'Amex', creditLimit: 15000 };
      
      $httpBackend.expectGET('/api/cards/3').respond(200, mockCard);
      
      var result;
      CardDataService.getCardById(3).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe(3);
      expect(result.cardNumber).toBe('****3333');
    });
    
    it('should return mock card when API fails and card exists in mock data', function() {
      $httpBackend.expectGET('/api/cards/2').respond(500, 'Server Error');
      
      var result;
      CardDataService.getCardById(2).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe(2);
      expect(result.cardNumber).toBe('****5678');
      expect(result.cardType).toBe('MasterCard');
    });
    
    it('should reject when API fails and card not found in mock data', function() {
      $httpBackend.expectGET('/api/cards/999').respond(500, 'Server Error');
      
      var error;
      CardDataService.getCardById(999).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBe('Card not found');
    });
    
    it('should handle string cardId parameter', function() {
      $httpBackend.expectGET('/api/cards/1').respond(500, 'Server Error');
      
      var result;
      CardDataService.getCardById('1').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe(1);
    });
  });
  
  describe('mock data validation', function() {
    it('should have valid mock card structure', function() {
      $httpBackend.expectGET('/api/cards').respond(500, 'Error');
      
      var result;
      CardDataService.getAllCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      result.forEach(function(card) {
        expect(card.cardId).toBeDefined();
        expect(card.cardNumber).toBeDefined();
        expect(card.cardType).toBeDefined();
        expect(card.issuer).toBeDefined();
        expect(card.creditLimit).toBeDefined();
        expect(card.currentBalance).toBeDefined();
        expect(card.availableCredit).toBeDefined();
        expect(card.status).toBeDefined();
        expect(card.expiryDate).toBeDefined();
      });
    });
  });
});