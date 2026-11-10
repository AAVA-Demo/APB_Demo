/*
Test Documentation:
- Test Name: TransactionService - getTransactions success
- Purpose: Validates successful transaction retrieval
- Scenario: HTTP call succeeds
- Expected Result: Returns transaction data
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions with filters
- Purpose: Validates filtering functionality
- Scenario: Filters are applied
- Expected Result: Returns filtered transactions
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions error with cache
- Purpose: Validates error handling with cached data
- Scenario: HTTP fails but cache exists
- Expected Result: Returns cached data
*/
/*
Test Documentation:
- Test Name: TransactionService - getMockTransactions
- Purpose: Validates mock data generation
- Scenario: Mock data is requested
- Expected Result: Returns mock transactions
*/
/*
Coverage Report:
- Functions tested: getTransactions, getMockTransactions
- Scenarios covered: success, filters, pagination, error with cache, error without cache, mock data
- Uncovered scenarios: none
*/

describe('TransactionService', function() {
  'use strict';
  
  beforeEach(module('transactionModule'));
  
  var TransactionService, $httpBackend, $q;
  var mockResponse = {
    transactions: [
      { transactionId: '1', cardId: '1', merchant: 'Amazon', amount: 2500 },
      { transactionId: '2', cardId: '1', merchant: 'Swiggy', amount: 450 }
    ],
    totalCount: 10,
    page: 1,
    pageSize: 20
  };
  
  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getTransactions', function() {
    it('should fetch transactions successfully', function() {
      $httpBackend.expectGET('/api/transactions?page=1&pageSize=20').respond(200, mockResponse);
      
      var result;
      TransactionService.getTransactions(1, null).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
      expect(result.transactions.length).toBe(2);
    });
    
    it('should apply filters correctly', function() {
      var filters = { cardId: '1', searchTerm: 'Amazon', dateRange: '30' };
      $httpBackend.expectGET('/api/transactions?cardId=1&dateRange=30&page=1&pageSize=20&searchTerm=Amazon').respond(200, mockResponse);
      
      var result;
      TransactionService.getTransactions(1, filters).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
    });
    
    it('should return cached data on error if available', function() {
      $httpBackend.expectGET('/api/transactions?page=1&pageSize=20').respond(200, mockResponse);
      
      TransactionService.getTransactions(1, null);
      $httpBackend.flush();
      
      $httpBackend.expectGET('/api/transactions?page=1&pageSize=20').respond(500, 'Server Error');
      
      var result;
      TransactionService.getTransactions(1, null).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
    });
    
    it('should reject promise when error occurs and no cache exists', function() {
      $httpBackend.expectGET('/api/transactions?page=1&pageSize=20').respond(500, 'Server Error');
      
      var rejected = false;
      TransactionService.getTransactions(1, null).catch(function() {
        rejected = true;
      });
      
      $httpBackend.flush();
      
      expect(rejected).toBe(true);
    });
  });
  
  describe('getMockTransactions', function() {
    it('should return mock transaction data', function() {
      var result;
      TransactionService.getMockTransactions(1, null).then(function(data) {
        result = data;
      });
      
      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
      expect(result.transactions.length).toBeGreaterThan(0);
      expect(result.totalCount).toBe(10);
    });
    
    it('should filter by cardId', function() {
      var result;
      TransactionService.getMockTransactions(1, { cardId: '1' }).then(function(data) {
        result = data;
      });
      
      result.transactions.forEach(function(txn) {
        expect(txn.cardId).toBe('1');
      });
    });
    
    it('should filter by search term', function() {
      var result;
      TransactionService.getMockTransactions(1, { searchTerm: 'Amazon' }).then(function(data) {
        result = data;
      });
      
      result.transactions.forEach(function(txn) {
        expect(txn.merchant.toLowerCase()).toContain('amazon');
      });
    });
    
    it('should handle pagination correctly', function() {
      var result;
      TransactionService.getMockTransactions(1, null).then(function(data) {
        result = data;
      });
      
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
    });
  });
});