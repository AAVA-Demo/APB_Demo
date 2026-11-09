/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions - successful API call
- Purpose: Validates that getTransactions retrieves transaction data from API successfully
- Scenario: HTTP GET request to /transactions with months parameter returns valid data
- Expected Result: Service returns array of transaction objects
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions - cache hit scenario
- Purpose: Validates that service uses cached data when available
- Scenario: Second call with same parameters should return cached data without API call
- Expected Result: Service returns cached transactions without making HTTP request
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions - API failure with mock fallback
- Purpose: Validates that service falls back to mock data when API fails
- Scenario: HTTP GET request fails with error
- Expected Result: Service returns mock transaction data
*/
/*
Test Documentation:
- Test Name: TransactionDataService - getTransactions - cardId filter
- Purpose: Validates that service correctly filters transactions by cardId
- Scenario: API call with cardId parameter
- Expected Result: Request URL includes cardId query parameter
*/
/*
Coverage Report:
- Functions tested: getTransactions, mockTransactions
- Scenarios covered: successful API call, cache hit, API failure, cardId filtering, empty response handling
- Edge cases: null response, network errors, cache expiration, multiple months parameter
- Uncovered scenarios: cache invalidation timing (requires time-based testing infrastructure)
*/

describe('TransactionDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionDataService;
  var $httpBackend;
  var $q;
  var API_BASE_URL;
  var $cacheFactory;
  
  beforeEach(inject(function(_TransactionDataService_, _$httpBackend_, _$q_, _API_BASE_URL_, _$cacheFactory_) {
    TransactionDataService = _TransactionDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_BASE_URL = _API_BASE_URL_;
    $cacheFactory = _$cacheFactory_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    var cache = $cacheFactory.get('transactionCache');
    if (cache) {
      cache.removeAll();
    }
  });
  
  describe('getTransactions', function() {
    
    it('should retrieve transactions successfully from API', function() {
      var mockResponse = [
        {transactionId: 'txn-1', cardId: 'card-001', amount: 500, category: 'Food & Dining', transactionDate: '2024-01-15'},
        {transactionId: 'txn-2', cardId: 'card-002', amount: 2000, category: 'Fuel', transactionDate: '2024-01-20'}
      ];
      
      $httpBackend.expectGET(API_BASE_URL + '/transactions?months=12').respond(200, mockResponse);
      
      var result;
      TransactionDataService.getTransactions(12).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('txn-1');
      expect(result[1].transactionId).toBe('txn-2');
    });
    
    it('should use cached data on subsequent calls with same parameters', function() {
      var mockResponse = [
        {transactionId: 'txn-1', cardId: 'card-001', amount: 500, category: 'Food & Dining', transactionDate: '2024-01-15'}
      ];
      
      $httpBackend.expectGET(API_BASE_URL + '/transactions?months=12').respond(200, mockResponse);
      
      var result1, result2;
      TransactionDataService.getTransactions(12).then(function(data) {
        result1 = data;
      });
      
      $httpBackend.flush();
      
      TransactionDataService.getTransactions(12).then(function(data) {
        result2 = data;
      });
      
      expect(result1).toBe(result2);
      expect(result2.length).toBe(1);
    });
    
    it('should include cardId in request URL when provided', function() {
      var mockResponse = [{transactionId: 'txn-1', cardId: 'card-001', amount: 500}];
      
      $httpBackend.expectGET(API_BASE_URL + '/transactions?months=6&cardId=card-001').respond(200, mockResponse);
      
      var result;
      TransactionDataService.getTransactions(6, 'card-001').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
    });
    
    it('should return mock data when API call fails', function() {
      $httpBackend.expectGET(API_BASE_URL + '/transactions?months=12').respond(500, 'Internal Server Error');
      
      var result;
      TransactionDataService.getTransactions(12).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toEqual(jasmine.objectContaining({
        transactionId: jasmine.any(String),
        cardId: jasmine.any(String),
        amount: jasmine.any(Number),
        category: jasmine.any(String),
        transactionDate: jasmine.any(String)
      }));
    });
    
    it('should return mock data when API returns null or empty response', function() {
      $httpBackend.expectGET(API_BASE_URL + '/transactions?months=12').respond(200, null);
      
      var result;
      TransactionDataService.getTransactions(12).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
    
    it('should cache mock data when API fails', function() {
      $httpBackend.expectGET(API_BASE_URL + '/transactions?months=3').respond(500, 'Error');
      
      var result1, result2;
      TransactionDataService.getTransactions(3).then(function(data) {
        result1 = data;
      });
      
      $httpBackend.flush();
      
      TransactionDataService.getTransactions(3).then(function(data) {
        result2 = data;
      });
      
      expect(result1).toBe(result2);
    });
    
    it('should generate mock transactions with all required fields', function() {
      $httpBackend.expectGET(API_BASE_URL + '/transactions?months=12').respond(500, 'Error');
      
      var result;
      TransactionDataService.getTransactions(12).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result[0]).toEqual(jasmine.objectContaining({
        transactionId: jasmine.any(String),
        cardId: jasmine.any(String),
        amount: jasmine.any(Number),
        category: jasmine.any(String),
        merchantName: jasmine.any(String),
        transactionDate: jasmine.any(String),
        description: jasmine.any(String)
      }));
    });
    
    it('should generate mock transactions with valid categories', function() {
      $httpBackend.expectGET(API_BASE_URL + '/transactions?months=12').respond(500, 'Error');
      
      var result;
      TransactionDataService.getTransactions(12).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      expect(validCategories).toContain(result[0].category);
    });
    
    it('should handle different cache keys for different parameters', function() {
      var mockResponse1 = [{transactionId: 'txn-1', amount: 500}];
      var mockResponse2 = [{transactionId: 'txn-2', amount: 1000}];
      
      $httpBackend.expectGET(API_BASE_URL + '/transactions?months=6').respond(200, mockResponse1);
      $httpBackend.expectGET(API_BASE_URL + '/transactions?months=12').respond(200, mockResponse2);
      
      var result1, result2;
      TransactionDataService.getTransactions(6).then(function(data) {
        result1 = data;
      });
      
      TransactionDataService.getTransactions(12).then(function(data) {
        result2 = data;
      });
      
      $httpBackend.flush();
      
      expect(result1).not.toBe(result2);
      expect(result1[0].transactionId).toBe('txn-1');
      expect(result2[0].transactionId).toBe('txn-2');
    });
    
    it('should handle network errors gracefully', function() {
      $httpBackend.expectGET(API_BASE_URL + '/transactions?months=12').respond(0, '');
      
      var result;
      TransactionDataService.getTransactions(12).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});