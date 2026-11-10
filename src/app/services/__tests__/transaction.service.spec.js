/*
Test Documentation:
- Test Name: TransactionService - getTransactions success
- Purpose: Validates retrieval of paginated transaction list
- Scenario: User requests transaction list with pagination
- Expected Result: Promise resolves with transactions and pagination metadata
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions with filters
- Purpose: Validates transaction filtering by date, card, and amount
- Scenario: User applies multiple filters
- Expected Result: API called with correct filter parameters
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions default pagination
- Purpose: Validates default pagination parameters
- Scenario: User requests transactions without pagination params
- Expected Result: Uses default page=1 and size=50
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: successful retrieval, filtering, pagination, default parameters, error handling
- Uncovered scenarios: network timeout, invalid filter combinations
*/

describe('TransactionService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionService, $httpBackend;
  
  beforeEach(inject(function(_TransactionService_, _$httpBackend_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getTransactions', function() {
    it('should return paginated transactions when API call succeeds', function() {
      var mockResponse = {
        transactions: [
          { id: 'txn1', merchant: 'Amazon', amount: 150, date: '2023-01-15', cardName: 'Visa Platinum' },
          { id: 'txn2', merchant: 'Starbucks', amount: 25, date: '2023-01-16', cardName: 'Mastercard Gold' }
        ],
        total: 100,
        page: 1,
        size: 50
      };
      
      $httpBackend.expectGET('/api/transactions?page=1&size=50')
        .respond(200, mockResponse);
      
      var result;
      TransactionService.getTransactions().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
      expect(result.transactions.length).toBe(2);
      expect(result.total).toBe(100);
    });
    
    it('should use default pagination parameters when not provided', function() {
      var mockResponse = { transactions: [], total: 0 };
      
      $httpBackend.expectGET('/api/transactions?page=1&size=50')
        .respond(200, mockResponse);
      
      TransactionService.getTransactions();
      $httpBackend.flush();
    });
    
    it('should override default pagination with provided parameters', function() {
      var params = { page: 2, size: 25 };
      var mockResponse = { transactions: [], total: 0 };
      
      $httpBackend.expectGET('/api/transactions?page=2&size=25')
        .respond(200, mockResponse);
      
      TransactionService.getTransactions(params);
      $httpBackend.flush();
    });
    
    it('should include filter parameters in request', function() {
      var params = {
        page: 1,
        size: 50,
        dateFrom: '2023-01-01',
        dateTo: '2023-01-31',
        cardId: 'card1',
        minAmount: 100,
        maxAmount: 500
      };
      var mockResponse = { transactions: [], total: 0 };
      
      $httpBackend.expectGET('/api/transactions?page=1&size=50&dateFrom=2023-01-01&dateTo=2023-01-31&cardId=card1&minAmount=100&maxAmount=500')
        .respond(200, mockResponse);
      
      TransactionService.getTransactions(params);
      $httpBackend.flush();
    });
    
    it('should handle empty transaction list', function() {
      var mockResponse = { transactions: [], total: 0 };
      
      $httpBackend.expectGET('/api/transactions?page=1&size=50')
        .respond(200, mockResponse);
      
      var result;
      TransactionService.getTransactions().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.transactions).toEqual([]);
      expect(result.total).toBe(0);
    });
    
    it('should reject promise when API call fails', function() {
      var errorResponse = { message: 'Internal Server Error' };
      
      $httpBackend.expectGET('/api/transactions?page=1&size=50')
        .respond(500, errorResponse);
      
      var error;
      TransactionService.getTransactions().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should handle 401 unauthorized error', function() {
      $httpBackend.expectGET('/api/transactions?page=1&size=50')
        .respond(401, { message: 'Unauthorized' });
      
      var error;
      TransactionService.getTransactions().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
    
    it('should handle partial filter parameters', function() {
      var params = {
        dateFrom: '2023-01-01',
        cardId: 'card1'
      };
      var mockResponse = { transactions: [], total: 0 };
      
      $httpBackend.expectGET('/api/transactions?page=1&size=50&dateFrom=2023-01-01&cardId=card1')
        .respond(200, mockResponse);
      
      TransactionService.getTransactions(params);
      $httpBackend.flush();
    });
    
    it('should handle large page numbers', function() {
      var params = { page: 100, size: 50 };
      var mockResponse = { transactions: [], total: 5000 };
      
      $httpBackend.expectGET('/api/transactions?page=100&size=50')
        .respond(200, mockResponse);
      
      var result;
      TransactionService.getTransactions(params).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.total).toBe(5000);
    });
  });
});