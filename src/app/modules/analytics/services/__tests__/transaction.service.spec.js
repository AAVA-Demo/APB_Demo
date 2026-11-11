/*
Test Documentation:
- Test Name: TransactionService - Transaction Data Retrieval and Caching
- Purpose: Validate transaction fetching with filtering and caching
- Scenario: Test getTransactions with various filters and cache management
- Expected Result: Transactions fetched with filters, cached appropriately
*/

describe('TransactionService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.analytics'));
  
  var TransactionService, $httpBackend, API_CONFIG;
  var mockTransactions = [
    {transactionId: '1', merchantName: 'Restaurant A', category: 'Food & Dining', amount: 45.50, transactionDate: '2026-11-01'},
    {transactionId: '2', merchantName: 'Gas Station', category: 'Fuel', amount: 60.00, transactionDate: '2026-11-02'},
    {transactionId: '3', merchantName: 'Store B', category: 'Shopping', amount: 120.00, transactionDate: '2026-11-03'}
  ];
  
  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_CONFIG_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    TransactionService.clearCache();
  });
  
  describe('getTransactions', function() {
    it('should fetch transactions without filters', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions')
        .respond(200, mockTransactions);
      
      var result;
      TransactionService.getTransactions().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(3);
    });
    
    it('should fetch transactions with date filters', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?startDate=2026-11-01&endDate=2026-11-30')
        .respond(200, mockTransactions);
      
      var result;
      TransactionService.getTransactions('2026-11-01', '2026-11-30').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockTransactions);
    });
    
    it('should fetch transactions with category filter', function() {
      var foodTransactions = [mockTransactions[0]];
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?category=Food%20%26%20Dining')
        .respond(200, foodTransactions);
      
      var result;
      TransactionService.getTransactions(null, null, 'Food & Dining').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(foodTransactions);
    });
    
    it('should fetch transactions with all filters', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?startDate=2026-11-01&endDate=2026-11-30&category=Fuel')
        .respond(200, [mockTransactions[1]]);
      
      var result;
      TransactionService.getTransactions('2026-11-01', '2026-11-30', 'Fuel').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result.length).toBe(1);
      expect(result[0].category).toBe('Fuel');
    });
    
    it('should return cached data on subsequent calls with same parameters', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?category=Shopping')
        .respond(200, [mockTransactions[2]]);
      
      TransactionService.getTransactions(null, null, 'Shopping');
      $httpBackend.flush();
      
      var result;
      TransactionService.getTransactions(null, null, 'Shopping').then(function(data) {
        result = data;
      });
      
      expect(result.length).toBe(1);
      expect(result[0].category).toBe('Shopping');
    });
    
    it('should handle empty transaction list', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions')
        .respond(200, []);
      
      var result;
      TransactionService.getTransactions().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual([]);
    });
    
    it('should handle API error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions')
        .respond(500, {error: 'Server Error'});
      
      var error;
      TransactionService.getTransactions().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });
  
  describe('clearCache', function() {
    it('should clear cached transactions', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions')
        .respond(200, mockTransactions);
      
      TransactionService.getTransactions();
      $httpBackend.flush();
      
      TransactionService.clearCache();
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions')
        .respond(200, mockTransactions);
      
      TransactionService.getTransactions();
      $httpBackend.flush();
    });
    
    it('should not throw error when clearing empty cache', function() {
      expect(function() {
        TransactionService.clearCache();
      }).not.toThrow();
    });
  });
});

/*
Coverage Report:
- Functions tested: getTransactions, clearCache
- Scenarios covered: fetch without filters, date filters, category filter, combined filters, caching, cache clearing, empty results, errors
- Edge cases: empty transaction list, API errors, cache hit/miss
- Uncovered scenarios: none
*/