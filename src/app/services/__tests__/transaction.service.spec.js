/*
Test Documentation:
- Test Name: TransactionService - getCardSpending with valid cardId
- Purpose: Validates that getCardSpending retrieves and formats card spending data
- Scenario: Service is called with valid cardId
- Expected Result: Returns promise resolving to formatted spending object

Test Documentation:
- Test Name: TransactionService - getCardSpending handles missing fields with defaults
- Purpose: Validates default value assignment for missing spending fields
- Scenario: Backend response is missing some fields
- Expected Result: Missing fields are set to 0 or 'N/A'

Test Documentation:
- Test Name: TransactionService - getCardSpending HTTP error handling
- Purpose: Validates error handling for failed spending requests
- Scenario: Backend returns error response
- Expected Result: Promise is rejected with error object

Test Documentation:
- Test Name: TransactionService - getTransactionHistory with valid cardId
- Purpose: Validates that getTransactionHistory retrieves transaction history
- Scenario: Service is called with valid cardId
- Expected Result: Returns promise resolving to transaction history array

Test Documentation:
- Test Name: TransactionService - getTransactionHistory HTTP error handling
- Purpose: Validates error handling for failed history requests
- Scenario: Backend returns error response
- Expected Result: Promise is rejected with error object

Coverage Report:
- Functions tested: getCardSpending, getTransactionHistory
- Scenarios covered: valid cardId, missing fields with defaults, HTTP errors for both methods
- Uncovered scenarios: none
*/

describe('TransactionService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionService, $httpBackend, API_CONFIG;
  
  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_CONFIG_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCardSpending', function() {
    it('should retrieve and format card spending data', function() {
      var cardId = 'card-123';
      var mockResponse = {
        cardId: 'card-123',
        monthlySpend: 2500.50,
        lastTransactionDate: '2023-12-15T10:30:00Z',
        transactionCount: 35,
        topCategory: 'Food & Dining'
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/card/' + cardId + '/spending')
        .respond(200, mockResponse);
      
      var result;
      TransactionService.getCardSpending(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe('card-123');
      expect(result.monthlySpend).toBe(2500.50);
      expect(result.lastTransactionDate instanceof Date).toBe(true);
      expect(result.transactionCount).toBe(35);
      expect(result.topCategory).toBe('Food & Dining');
    });
    
    it('should handle missing fields with default values', function() {
      var cardId = 'card-456';
      var mockResponse = {
        cardId: 'card-456',
        lastTransactionDate: '2023-12-10T08:00:00Z'
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/card/' + cardId + '/spending')
        .respond(200, mockResponse);
      
      var result;
      TransactionService.getCardSpending(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.monthlySpend).toBe(0);
      expect(result.transactionCount).toBe(0);
      expect(result.topCategory).toBe('N/A');
    });
    
    it('should handle HTTP errors gracefully', function() {
      var cardId = 'card-invalid';
      var errorResponse = { message: 'Card not found' };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/card/' + cardId + '/spending')
        .respond(404, errorResponse);
      
      var error;
      TransactionService.getCardSpending(cardId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
    
    it('should parse lastTransactionDate as Date object', function() {
      var cardId = 'card-789';
      var mockResponse = {
        cardId: 'card-789',
        monthlySpend: 1000,
        lastTransactionDate: '2023-11-20T14:45:00Z',
        transactionCount: 10,
        topCategory: 'Travel'
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/card/' + cardId + '/spending')
        .respond(200, mockResponse);
      
      var result;
      TransactionService.getCardSpending(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.lastTransactionDate instanceof Date).toBe(true);
      expect(result.lastTransactionDate.toISOString()).toBe('2023-11-20T14:45:00.000Z');
    });
    
    it('should handle server errors (500)', function() {
      var cardId = 'card-error';
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/card/' + cardId + '/spending')
        .respond(500, { message: 'Internal server error' });
      
      var error;
      TransactionService.getCardSpending(cardId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });
  
  describe('getTransactionHistory', function() {
    it('should retrieve transaction history for valid cardId', function() {
      var cardId = 'card-123';
      var mockResponse = [
        { transactionId: 'txn-1', date: '2023-12-01', amount: 50.00, category: 'Food & Dining', merchant: 'Restaurant A' },
        { transactionId: 'txn-2', date: '2023-12-05', amount: 100.00, category: 'Shopping', merchant: 'Store B' }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/card/' + cardId + '/history')
        .respond(200, mockResponse);
      
      var result;
      TransactionService.getTransactionHistory(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('txn-1');
    });
    
    it('should handle empty transaction history', function() {
      var cardId = 'card-empty';
      var mockResponse = [];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/card/' + cardId + '/history')
        .respond(200, mockResponse);
      
      var result;
      TransactionService.getTransactionHistory(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should handle HTTP errors gracefully', function() {
      var cardId = 'card-invalid';
      var errorResponse = { message: 'Card not found' };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/card/' + cardId + '/history')
        .respond(404, errorResponse);
      
      var error;
      TransactionService.getTransactionHistory(cardId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
    
    it('should handle server errors (500)', function() {
      var cardId = 'card-error';
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/card/' + cardId + '/history')
        .respond(500, { message: 'Internal server error' });
      
      var error;
      TransactionService.getTransactionHistory(cardId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });
});