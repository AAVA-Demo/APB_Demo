/*
Test Documentation:
- Test Name: TransactionDataService - getRawTransactions success
- Purpose: Validates retrieval of raw transaction data for analytics
- Scenario: Analytics engine requests raw transactions
- Expected Result: Promise resolves with array of transaction objects
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getRawTransactions with filters
- Purpose: Validates parameter passing for filtered transaction retrieval
- Scenario: Request includes date range and card filters
- Expected Result: API called with correct query parameters
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getRawTransactions error
- Purpose: Validates error handling when API fails
- Scenario: HTTP request fails with server error
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getRawTransactions
- Scenarios covered: successful retrieval, filtered requests, empty response, API errors
- Uncovered scenarios: network timeout, partial transaction data
*/

describe('TransactionDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionDataService, $httpBackend;
  
  beforeEach(inject(function(_TransactionDataService_, _$httpBackend_) {
    TransactionDataService = _TransactionDataService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getRawTransactions', function() {
    it('should return array of transactions when API call succeeds', function() {
      var userId = 'user123';
      var mockResponse = {
        transactions: [
          { id: 'txn1', merchant: 'Amazon', amount: 150, date: '2023-01-15' },
          { id: 'txn2', merchant: 'Starbucks', amount: 25, date: '2023-01-16' }
        ]
      };
      
      $httpBackend.expectGET('/api/transactions/raw?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      TransactionDataService.getRawTransactions(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse.transactions);
      expect(result.length).toBe(2);
      expect(result[0].merchant).toBe('Amazon');
    });
    
    it('should include additional parameters in request', function() {
      var userId = 'user123';
      var params = {
        dateFrom: '2023-01-01',
        dateTo: '2023-01-31',
        cardId: 'card1'
      };
      var mockResponse = { transactions: [] };
      
      $httpBackend.expectGET('/api/transactions/raw?userId=' + userId + '&dateFrom=2023-01-01&dateTo=2023-01-31&cardId=card1')
        .respond(200, mockResponse);
      
      TransactionDataService.getRawTransactions(userId, params);
      $httpBackend.flush();
    });
    
    it('should return empty array when transactions property is missing', function() {
      var userId = 'user123';
      var mockResponse = {};
      
      $httpBackend.expectGET('/api/transactions/raw?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      TransactionDataService.getRawTransactions(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should return empty array when transactions is null', function() {
      var userId = 'user123';
      var mockResponse = { transactions: null };
      
      $httpBackend.expectGET('/api/transactions/raw?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      TransactionDataService.getRawTransactions(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should reject promise when API call fails', function() {
      var userId = 'user123';
      var errorResponse = { message: 'Internal Server Error' };
      
      $httpBackend.expectGET('/api/transactions/raw?userId=' + userId)
        .respond(500, errorResponse);
      
      var error;
      TransactionDataService.getRawTransactions(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should handle params as null', function() {
      var userId = 'user123';
      var mockResponse = { transactions: [] };
      
      $httpBackend.expectGET('/api/transactions/raw?userId=' + userId)
        .respond(200, mockResponse);
      
      TransactionDataService.getRawTransactions(userId, null);
      $httpBackend.flush();
    });
    
    it('should handle 401 unauthorized error', function() {
      var userId = 'user123';
      
      $httpBackend.expectGET('/api/transactions/raw?userId=' + userId)
        .respond(401, { message: 'Unauthorized' });
      
      var error;
      TransactionDataService.getRawTransactions(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
  });
});