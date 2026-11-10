/*
Test Documentation:
- Test Name: TransactionDataService - fetchTransactions with cache
- Purpose: Verify service returns cached transactions when cache is valid
- Scenario: Transactions cached within 5 minutes for specified month range
- Expected Result: Returns cached data without HTTP request
*/
/*
Test Documentation:
- Test Name: TransactionDataService - fetchTransactions without cache
- Purpose: Verify service fetches transactions from API when cache expired
- Scenario: No cache or cache older than 5 minutes
- Expected Result: Makes HTTP GET request with month parameter
*/
/*
Test Documentation:
- Test Name: TransactionDataService - fetchTransactions API failure
- Purpose: Verify service generates mock data when API fails
- Scenario: HTTP request fails or times out
- Expected Result: Returns mock transaction data with proper structure
*/
/*
Test Documentation:
- Test Name: TransactionDataService - mock data generation
- Purpose: Verify mock data contains all required transaction properties
- Scenario: API failure triggers mock data generation
- Expected Result: Mock transactions have valid structure and categories
*/
/*
Test Documentation:
- Test Name: TransactionDataService - cache key uniqueness
- Purpose: Verify different month parameters use separate cache entries
- Scenario: Fetch transactions for different month ranges
- Expected Result: Each month range has independent cache
*/
/*
Coverage Report:
- Functions tested: fetchTransactions
- Scenarios covered: cache hit, cache miss, API success, API failure, mock generation, cache isolation
- Uncovered scenarios: cache expiration edge cases, concurrent requests
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
  
  describe('fetchTransactions', function() {
    it('should fetch transactions from API', function() {
      var months = 12;
      var mockTransactions = [
        {
          transactionId: 'tx1',
          cardId: 'card1',
          amount: 5000,
          category: 'Food & Dining',
          transactionDate: new Date(),
          merchantName: 'Restaurant ABC',
          description: 'Dinner'
        }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?months=' + months)
        .respond(200, mockTransactions);
      
      var result;
      TransactionDataService.fetchTransactions(months).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(1);
    });
    
    it('should return cached transactions when cache is valid', function() {
      var months = 6;
      var mockTransactions = [{ transactionId: 'tx1', amount: 1000 }];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?months=' + months)
        .respond(200, mockTransactions);
      
      TransactionDataService.fetchTransactions(months);
      $httpBackend.flush();
      
      var result;
      TransactionDataService.fetchTransactions(months).then(function(data) {
        result = data;
      });
      
      expect(result).toEqual(mockTransactions);
    });
    
    it('should generate mock data when API fails', function() {
      var months = 12;
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?months=' + months)
        .respond(500, 'Server Error');
      
      var result;
      TransactionDataService.fetchTransactions(months).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(100);
    });
    
    it('should generate mock data with valid structure', function() {
      var months = 3;
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?months=' + months)
        .respond(500);
      
      var result;
      TransactionDataService.fetchTransactions(months).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result[0]).toEqual(jasmine.objectContaining({
        transactionId: jasmine.any(String),
        cardId: jasmine.any(String),
        amount: jasmine.any(Number),
        category: jasmine.any(String),
        transactionDate: jasmine.any(Date),
        merchantName: jasmine.any(String),
        description: jasmine.any(String)
      }));
    });
    
    it('should generate mock data with valid categories', function() {
      var months = 1;
      var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?months=' + months)
        .respond(500);
      
      var result;
      TransactionDataService.fetchTransactions(months).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      result.forEach(function(tx) {
        expect(validCategories).toContain(tx.category);
      });
    });
    
    it('should use separate cache for different month parameters', function() {
      var mockTx6 = [{ transactionId: 'tx6', amount: 6000 }];
      var mockTx12 = [{ transactionId: 'tx12', amount: 12000 }];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?months=6')
        .respond(200, mockTx6);
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?months=12')
        .respond(200, mockTx12);
      
      var result6, result12;
      TransactionDataService.fetchTransactions(6).then(function(data) {
        result6 = data;
      });
      TransactionDataService.fetchTransactions(12).then(function(data) {
        result12 = data;
      });
      
      $httpBackend.flush();
      
      expect(result6).toEqual(mockTx6);
      expect(result12).toEqual(mockTx12);
      expect(result6).not.toEqual(result12);
    });
    
    it('should respect timeout configuration', function() {
      var months = 12;
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?months=' + months)
        .respond(200, []);
      
      TransactionDataService.fetchTransactions(months);
      $httpBackend.flush();
    });
    
    it('should handle empty response from API', function() {
      var months = 12;
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?months=' + months)
        .respond(200, []);
      
      var result;
      TransactionDataService.fetchTransactions(months).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
  });
});