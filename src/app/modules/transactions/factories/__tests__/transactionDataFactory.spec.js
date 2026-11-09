/*
Test Documentation:
- Test Name: TransactionDataFactory Unit Tests
- Purpose: Validate transaction data retrieval with pagination support
- Scenario: Test fetchTransactions with various parameters, pagination, and error handling
- Expected Result: Correct API calls with proper parameter handling
*/

describe('TransactionDataFactory', function() {
  'use strict';
  
  beforeEach(module('creditCard.transactions'));
  
  var TransactionDataFactory, $httpBackend;
  var mockTransactions;
  
  beforeEach(inject(function(_TransactionDataFactory_, _$httpBackend_) {
    TransactionDataFactory = _TransactionDataFactory_;
    $httpBackend = _$httpBackend_;
    
    mockTransactions = [
      { id: 'txn1', amount: 50, merchant: 'Store A' },
      { id: 'txn2', amount: 100, merchant: 'Store B' }
    ];
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchTransactions', function() {
    it('should fetch transactions for a user', function() {
      $httpBackend.expectGET('/api/transactions?userId=user123').respond(200, mockTransactions);
      
      TransactionDataFactory.fetchTransactions('user123').then(function(transactions) {
        expect(transactions).toEqual(mockTransactions);
        expect(transactions.length).toBe(2);
      });
      
      $httpBackend.flush();
    });
    
    it('should include page parameter when provided', function() {
      $httpBackend.expectGET('/api/transactions?page=2&userId=user123').respond(200, mockTransactions);
      
      TransactionDataFactory.fetchTransactions('user123', 2);
      
      $httpBackend.flush();
    });
    
    it('should include limit parameter when provided', function() {
      $httpBackend.expectGET('/api/transactions?limit=50&userId=user123').respond(200, mockTransactions);
      
      TransactionDataFactory.fetchTransactions('user123', null, 50);
      
      $httpBackend.flush();
    });
    
    it('should include both page and limit parameters', function() {
      $httpBackend.expectGET('/api/transactions?limit=25&page=3&userId=user123').respond(200, mockTransactions);
      
      TransactionDataFactory.fetchTransactions('user123', 3, 25);
      
      $httpBackend.flush();
    });
    
    it('should handle API errors', function() {
      $httpBackend.expectGET('/api/transactions?userId=user123').respond(500, 'Server Error');
      
      TransactionDataFactory.fetchTransactions('user123').catch(function(error) {
        expect(error.status).toBe(500);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle empty response', function() {
      $httpBackend.expectGET('/api/transactions?userId=user123').respond(200, []);
      
      TransactionDataFactory.fetchTransactions('user123').then(function(transactions) {
        expect(transactions).toEqual([]);
        expect(transactions.length).toBe(0);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle network errors', function() {
      $httpBackend.expectGET('/api/transactions?userId=user123').respond(0, '');
      
      TransactionDataFactory.fetchTransactions('user123').catch(function(error) {
        expect(error.status).toBe(0);
      });
      
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: fetchTransactions
- Scenarios covered:
  * Basic transaction fetch
  * Pagination with page parameter
  * Pagination with limit parameter
  * Combined page and limit parameters
  * Server error handling
  * Empty response handling
  * Network error handling
- Edge cases: Empty results, network failures, various pagination combinations
- Uncovered scenarios: Invalid pagination parameters, very large page numbers, negative limits
*/