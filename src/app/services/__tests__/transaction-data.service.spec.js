/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions - fetches transactions for specific card
- Purpose: Validates that the service fetches paginated transactions for a card
- Scenario: User requests transaction history for a specific card
- Expected Result: Service returns paginated transaction data
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions - uses default pagination values
- Purpose: Validates that service applies default page and page size when not provided
- Scenario: User requests transactions without pagination parameters
- Expected Result: Service uses default page 1 and page size 20
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions - handles API errors gracefully
- Purpose: Validates error handling when transaction API call fails
- Scenario: API returns error response
- Expected Result: Service rejects promise with error
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: pagination with custom values, default pagination, API success, API failure, query parameters
- Uncovered scenarios: none
*/

describe('TransactionDataService', function() {
  'use strict';
  
  var TransactionDataService;
  var $http;
  var $httpBackend;
  var $rootScope;
  var API_ENDPOINTS;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_TransactionDataService_, _$http_, _$httpBackend_, _$rootScope_, _API_ENDPOINTS_) {
    TransactionDataService = _TransactionDataService_;
    $http = _$http_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getTransactions', function() {
    
    it('should fetch transactions with specified pagination parameters', function() {
      var cardId = 'card123';
      var page = 2;
      var pageSize = 10;
      var mockResponse = {
        transactions: [
          {transactionId: 'txn1', amount: 100},
          {transactionId: 'txn2', amount: 200}
        ],
        page: 2,
        size: 10
      };
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId + '/transactions?page=2&size=10').respond(200, mockResponse);
      
      var result;
      TransactionDataService.getTransactions(cardId, page, pageSize).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
    });
    
    it('should use default page 1 when page parameter is not provided', function() {
      var cardId = 'card456';
      var pageSize = 20;
      var mockResponse = {transactions: []};
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId + '/transactions?page=1&size=20').respond(200, mockResponse);
      
      TransactionDataService.getTransactions(cardId, null, pageSize);
      
      $httpBackend.flush();
    });
    
    it('should use default page size 20 when pageSize parameter is not provided', function() {
      var cardId = 'card789';
      var page = 1;
      var mockResponse = {transactions: []};
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId + '/transactions?page=1&size=20').respond(200, mockResponse);
      
      TransactionDataService.getTransactions(cardId, page, null);
      
      $httpBackend.flush();
    });
    
    it('should use default values for both page and pageSize when not provided', function() {
      var cardId = 'card999';
      var mockResponse = {transactions: []};
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId + '/transactions?page=1&size=20').respond(200, mockResponse);
      
      TransactionDataService.getTransactions(cardId);
      
      $httpBackend.flush();
    });
    
    it('should construct correct API endpoint with card ID', function() {
      var cardId = 'card111';
      var mockResponse = {transactions: []};
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId + '/transactions?page=1&size=20').respond(200, mockResponse);
      
      TransactionDataService.getTransactions(cardId);
      
      $httpBackend.flush();
    });
    
    it('should handle API errors and reject promise', function() {
      var cardId = 'card222';
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId + '/transactions?page=1&size=20').respond(500, {message: 'Server error'});
      
      var error;
      TransactionDataService.getTransactions(cardId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should handle empty transaction response', function() {
      var cardId = 'card333';
      var mockResponse = {transactions: []};
      
      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId + '/transactions?page=1&size=20').respond(200, mockResponse);
      
      var result;
      TransactionDataService.getTransactions(cardId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.transactions).toEqual([]);
    });
  });
});