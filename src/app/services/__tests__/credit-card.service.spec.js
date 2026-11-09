/*
Test Documentation:
- Test Name: CreditCardService - getAllCards success
- Purpose: Validates successful retrieval of all credit cards
- Scenario: Service makes HTTP GET request to /api/cards
- Expected Result: Returns array of card objects
*/
/*
Test Documentation:
- Test Name: CreditCardService - getAllCards error handling
- Purpose: Validates error handling when API request fails
- Scenario: API returns error response
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: CreditCardService - getCardById success
- Purpose: Validates retrieval of specific card by ID
- Scenario: Service makes HTTP GET request to /api/cards/:cardId
- Expected Result: Returns single card object
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardById
- Scenarios covered: successful API calls, error handling, network failures
- Uncovered scenarios: none
*/

describe('CreditCardService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CreditCardService, $httpBackend;
  
  beforeEach(inject(function(_CreditCardService_, _$httpBackend_) {
    CreditCardService = _CreditCardService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getAllCards', function() {
    it('should fetch all cards successfully', function() {
      var mockCards = [
        { cardId: 1, cardNumber: '****1234', cardType: 'Visa', creditLimit: 10000 },
        { cardId: 2, cardNumber: '****5678', cardType: 'MasterCard', creditLimit: 15000 }
      ];
      
      $httpBackend.expectGET('/api/cards').respond(200, mockCards);
      
      var result;
      CreditCardService.getAllCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe(1);
      expect(result[1].cardId).toBe(2);
    });
    
    it('should handle empty cards array', function() {
      $httpBackend.expectGET('/api/cards').respond(200, []);
      
      var result;
      CreditCardService.getAllCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
    
    it('should handle API error', function() {
      $httpBackend.expectGET('/api/cards').respond(500, 'Internal Server Error');
      
      var error;
      CreditCardService.getAllCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    it('should handle network failure', function() {
      $httpBackend.expectGET('/api/cards').respond(0, '');
      
      var error;
      CreditCardService.getAllCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    it('should handle 404 not found', function() {
      $httpBackend.expectGET('/api/cards').respond(404, 'Not Found');
      
      var error;
      CreditCardService.getAllCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
  });
  
  describe('getCardById', function() {
    it('should fetch specific card by ID successfully', function() {
      var mockCard = { cardId: 1, cardNumber: '****1234', cardType: 'Visa', creditLimit: 10000 };
      
      $httpBackend.expectGET('/api/cards/1').respond(200, mockCard);
      
      var result;
      CreditCardService.getCardById(1).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe(1);
      expect(result.cardNumber).toBe('****1234');
    });
    
    it('should handle card not found', function() {
      $httpBackend.expectGET('/api/cards/999').respond(404, 'Card not found');
      
      var error;
      CreditCardService.getCardById(999).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    it('should handle API error', function() {
      $httpBackend.expectGET('/api/cards/1').respond(500, 'Internal Server Error');
      
      var error;
      CreditCardService.getCardById(1).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    it('should handle string cardId parameter', function() {
      var mockCard = { cardId: 2, cardNumber: '****5678' };
      
      $httpBackend.expectGET('/api/cards/2').respond(200, mockCard);
      
      var result;
      CreditCardService.getCardById('2').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe(2);
    });
    
    it('should handle unauthorized access', function() {
      $httpBackend.expectGET('/api/cards/1').respond(401, 'Unauthorized');
      
      var error;
      CreditCardService.getCardById(1).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
  });
});