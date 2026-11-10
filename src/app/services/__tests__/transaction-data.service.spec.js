/*
Test Documentation:
- Test Name: TransactionDataService - getMonthlySpend with valid userId
- Purpose: Validates that getMonthlySpend retrieves monthly spending data
- Scenario: Service is called with valid userId
- Expected Result: Returns promise resolving to monthly spend data

Test Documentation:
- Test Name: TransactionDataService - getMonthlySpend HTTP error handling
- Purpose: Validates error handling for failed requests
- Scenario: Backend returns error response
- Expected Result: Promise is rejected with error object

Test Documentation:
- Test Name: TransactionDataService - getOutstandingAmounts with valid userId
- Purpose: Validates that getOutstandingAmounts retrieves outstanding balance data
- Scenario: Service is called with valid userId
- Expected Result: Returns promise resolving to outstanding amounts data

Test Documentation:
- Test Name: TransactionDataService - getOutstandingAmounts HTTP error handling
- Purpose: Validates error handling for outstanding amounts request
- Scenario: Backend returns error response
- Expected Result: Promise is rejected with error object

Coverage Report:
- Functions tested: getMonthlySpend, getOutstandingAmounts
- Scenarios covered: valid userId for both methods, HTTP error handling for both methods
- Uncovered scenarios: none
*/

describe('TransactionDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionDataService, $httpBackend, API_CONFIG;
  
  beforeEach(inject(function(_TransactionDataService_, _$httpBackend_, _API_CONFIG_) {
    TransactionDataService = _TransactionDataService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getMonthlySpend', function() {
    it('should retrieve monthly spend for valid userId', function() {
      var userId = 'user-123';
      var mockResponse = {
        userId: 'user-123',
        monthlySpend: 4500.50,
        month: '2023-12',
        transactionCount: 45
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/monthly-spend/' + userId)
        .respond(200, mockResponse);
      
      var result;
      TransactionDataService.getMonthlySpend(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
      expect(result.monthlySpend).toBe(4500.50);
    });
    
    it('should handle HTTP errors gracefully', function() {
      var userId = 'user-456';
      var errorResponse = { message: 'User not found' };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/monthly-spend/' + userId)
        .respond(404, errorResponse);
      
      var error;
      TransactionDataService.getMonthlySpend(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
    
    it('should handle server errors (500)', function() {
      var userId = 'user-789';
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/monthly-spend/' + userId)
        .respond(500, { message: 'Internal server error' });
      
      var error;
      TransactionDataService.getMonthlySpend(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should construct correct API endpoint URL', function() {
      var userId = 'test-user';
      var mockResponse = { monthlySpend: 1000 };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/monthly-spend/' + userId)
        .respond(200, mockResponse);
      
      TransactionDataService.getMonthlySpend(userId);
      $httpBackend.flush();
    });
  });
  
  describe('getOutstandingAmounts', function() {
    it('should retrieve outstanding amounts for valid userId', function() {
      var userId = 'user-123';
      var mockResponse = {
        userId: 'user-123',
        totalOutstanding: 6500.75,
        cards: [
          { cardId: 'card-1', outstanding: 3000 },
          { cardId: 'card-2', outstanding: 3500.75 }
        ]
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/outstanding/' + userId)
        .respond(200, mockResponse);
      
      var result;
      TransactionDataService.getOutstandingAmounts(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
      expect(result.totalOutstanding).toBe(6500.75);
      expect(result.cards.length).toBe(2);
    });
    
    it('should handle HTTP errors gracefully', function() {
      var userId = 'user-456';
      var errorResponse = { message: 'User not found' };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/outstanding/' + userId)
        .respond(404, errorResponse);
      
      var error;
      TransactionDataService.getOutstandingAmounts(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
    
    it('should handle empty outstanding data', function() {
      var userId = 'user-empty';
      var mockResponse = {
        userId: 'user-empty',
        totalOutstanding: 0,
        cards: []
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/outstanding/' + userId)
        .respond(200, mockResponse);
      
      var result;
      TransactionDataService.getOutstandingAmounts(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.totalOutstanding).toBe(0);
      expect(result.cards).toEqual([]);
    });
    
    it('should handle server errors (500)', function() {
      var userId = 'user-error';
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/outstanding/' + userId)
        .respond(500, { message: 'Internal server error' });
      
      var error;
      TransactionDataService.getOutstandingAmounts(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });
});