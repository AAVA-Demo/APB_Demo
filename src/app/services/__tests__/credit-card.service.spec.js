/*
Test Documentation:
- Test Name: CreditCardService - getCards with valid userId
- Purpose: Validates that getCards retrieves and formats card data correctly
- Scenario: Service is called with valid userId
- Expected Result: Returns promise resolving to array of formatted card objects

Test Documentation:
- Test Name: CreditCardService - getCards without userId uses 'current'
- Purpose: Validates default userId behavior
- Scenario: Service is called without userId parameter
- Expected Result: Uses 'current' as default userId in API call

Test Documentation:
- Test Name: CreditCardService - getCards calculates utilization rate
- Purpose: Validates automatic calculation of utilization rate when not provided
- Scenario: Backend response missing utilizationRate field
- Expected Result: Calculates utilizationRate as (outstandingBalance / creditLimit) * 100

Test Documentation:
- Test Name: CreditCardService - getCards HTTP error handling
- Purpose: Validates error handling for failed requests
- Scenario: Backend returns error response
- Expected Result: Promise is rejected with error object

Test Documentation:
- Test Name: CreditCardService - getCardById retrieves single card details
- Purpose: Validates retrieval of individual card details
- Scenario: Service is called with valid cardId
- Expected Result: Returns promise resolving to card detail object

Test Documentation:
- Test Name: CreditCardService - getCardById HTTP error handling
- Purpose: Validates error handling for card not found
- Scenario: Backend returns 404 for invalid cardId
- Expected Result: Promise is rejected with 404 error

Coverage Report:
- Functions tested: getCards, getCardById
- Scenarios covered: valid userId, default userId, utilization calculation, HTTP errors, single card retrieval
- Uncovered scenarios: none
*/

describe('CreditCardService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CreditCardService, $httpBackend, API_CONFIG;
  
  beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _API_CONFIG_) {
    CreditCardService = _CreditCardService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCards', function() {
    it('should retrieve and format cards with valid userId', function() {
      var userId = 'user-123';
      var mockResponse = [
        {
          cardId: 'card-1',
          cardNumber: '**** **** **** 1234',
          cardType: 'Visa',
          cardHolderName: 'John Doe',
          creditLimit: 5000,
          availableCredit: 3500,
          outstandingBalance: 1500,
          utilizationRate: 30,
          expiryDate: '12/25',
          issuer: 'Bank A',
          status: 'Active'
        }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + userId)
        .respond(200, mockResponse);
      
      var result;
      CreditCardService.getCards(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].cardId).toBe('card-1');
      expect(result[0].cardNumber).toBe('**** **** **** 1234');
      expect(result[0].utilizationRate).toBe(30);
    });
    
    it('should use "current" as default userId when not provided', function() {
      var mockResponse = [];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/current')
        .respond(200, mockResponse);
      
      CreditCardService.getCards();
      $httpBackend.flush();
    });
    
    it('should calculate utilization rate when not provided in response', function() {
      var userId = 'user-456';
      var mockResponse = [
        {
          cardId: 'card-2',
          cardNumber: '**** 5678',
          cardType: 'Mastercard',
          cardHolderName: 'Jane Smith',
          creditLimit: 10000,
          availableCredit: 7500,
          outstandingBalance: 2500,
          expiryDate: '06/26',
          issuer: 'Bank B',
          status: 'Active'
        }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + userId)
        .respond(200, mockResponse);
      
      var result;
      CreditCardService.getCards(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result[0].utilizationRate).toBe(25);
    });
    
    it('should handle HTTP errors gracefully', function() {
      var userId = 'user-789';
      var errorResponse = { message: 'Server error' };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + userId)
        .respond(500, errorResponse);
      
      var error;
      CreditCardService.getCards(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should handle empty card list', function() {
      var userId = 'user-empty';
      var mockResponse = [];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + userId)
        .respond(200, mockResponse);
      
      var result;
      CreditCardService.getCards(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should map all card fields correctly', function() {
      var userId = 'user-test';
      var mockResponse = [
        {
          cardId: 'card-full',
          cardNumber: '**** 9999',
          cardType: 'Amex',
          cardHolderName: 'Test User',
          creditLimit: 15000,
          availableCredit: 10000,
          outstandingBalance: 5000,
          utilizationRate: 33.33,
          expiryDate: '03/27',
          issuer: 'Bank C',
          status: 'Active'
        }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + userId)
        .respond(200, mockResponse);
      
      var result;
      CreditCardService.getCards(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result[0]).toEqual({
        cardId: 'card-full',
        cardNumber: '**** 9999',
        cardType: 'Amex',
        cardHolderName: 'Test User',
        creditLimit: 15000,
        availableCredit: 10000,
        outstandingBalance: 5000,
        utilizationRate: 33.33,
        expiryDate: '03/27',
        issuer: 'Bank C',
        status: 'Active'
      });
    });
  });
  
  describe('getCardById', function() {
    it('should retrieve single card details by cardId', function() {
      var cardId = 'card-123';
      var mockResponse = {
        cardId: 'card-123',
        cardNumber: '**** 1111',
        cardType: 'Visa',
        cardHolderName: 'Alice Johnson',
        creditLimit: 8000,
        availableCredit: 6000,
        outstandingBalance: 2000
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/detail/' + cardId)
        .respond(200, mockResponse);
      
      var result;
      CreditCardService.getCardById(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
      expect(result.cardId).toBe('card-123');
    });
    
    it('should handle card not found error', function() {
      var cardId = 'invalid-card';
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/detail/' + cardId)
        .respond(404, { message: 'Card not found' });
      
      var error;
      CreditCardService.getCardById(cardId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
    
    it('should handle server errors', function() {
      var cardId = 'card-error';
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/detail/' + cardId)
        .respond(500, { message: 'Internal server error' });
      
      var error;
      CreditCardService.getCardById(cardId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });
});