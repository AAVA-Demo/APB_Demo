/*
Test Documentation:
- Test Name: CreditCardDataService - getCardBalances with valid userId
- Purpose: Validates that getCardBalances retrieves card balance data for a user
- Scenario: Service is called with valid userId
- Expected Result: Returns promise resolving to card balance data

Test Documentation:
- Test Name: CreditCardDataService - getCardBalances HTTP error handling
- Purpose: Validates that service properly handles HTTP errors
- Scenario: Backend returns error response
- Expected Result: Promise is rejected with error object

Test Documentation:
- Test Name: CreditCardDataService - getCardBalances with empty response
- Purpose: Validates handling of empty balance data
- Scenario: Backend returns empty array
- Expected Result: Returns empty array successfully

Coverage Report:
- Functions tested: getCardBalances
- Scenarios covered: valid userId, HTTP errors, empty response
- Uncovered scenarios: none
*/

describe('CreditCardDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CreditCardDataService, $httpBackend, API_CONFIG;
  
  beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _API_CONFIG_) {
    CreditCardDataService = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCardBalances', function() {
    it('should retrieve card balances for valid userId', function() {
      var userId = 'user-123';
      var mockResponse = [
        { cardId: 'card-1', balance: 1500.50, creditLimit: 5000 },
        { cardId: 'card-2', balance: 2300.75, creditLimit: 10000 }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + userId + '/balances')
        .respond(200, mockResponse);
      
      var result;
      CreditCardDataService.getCardBalances(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card-1');
      expect(result[0].balance).toBe(1500.50);
    });
    
    it('should handle HTTP errors gracefully', function() {
      var userId = 'user-123';
      var errorResponse = { message: 'User not found' };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + userId + '/balances')
        .respond(404, errorResponse);
      
      var error;
      CreditCardDataService.getCardBalances(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
    
    it('should handle empty response', function() {
      var userId = 'user-456';
      var mockResponse = [];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + userId + '/balances')
        .respond(200, mockResponse);
      
      var result;
      CreditCardDataService.getCardBalances(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should handle server errors (500)', function() {
      var userId = 'user-789';
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + userId + '/balances')
        .respond(500, { message: 'Internal server error' });
      
      var error;
      CreditCardDataService.getCardBalances(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should construct correct API endpoint URL', function() {
      var userId = 'test-user';
      var mockResponse = [];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + userId + '/balances')
        .respond(200, mockResponse);
      
      CreditCardDataService.getCardBalances(userId);
      $httpBackend.flush();
    });
  });
});