/*
Test Documentation:
- Test Name: transactionDataService - getTransactions
- Purpose: Validates transaction data retrieval with caching
- Scenario: Service fetches transaction history and caches results
- Expected Result: Returns transactions with caching for subsequent calls
*/
/*
Test Documentation:
- Test Name: transactionDataService - caching mechanism
- Purpose: Validates transaction caching functionality
- Scenario: Service returns cached data on subsequent calls
- Expected Result: No additional HTTP calls for cached transaction data
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: successful API call, API failure with mock fallback, caching, different month parameters
- Uncovered scenarios: none
*/

describe('transactionDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var transactionDataService, $httpBackend, $rootScope, apiConfig;
  
  beforeEach(inject(function(_transactionDataService_, _$httpBackend_, _$rootScope_, _apiConfig_) {
    transactionDataService = _transactionDataService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    apiConfig = _apiConfig_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getTransactions', function() {
    it('should fetch transactions for specified months', function() {
      var mockTransactions = [
        {transactionId: 'txn1', amount: 100, category: 'Shopping', transactionDate: '2024-01-15'},
        {transactionId: 'txn2', amount: 200, category: 'Fuel', transactionDate: '2024-01-20'}
      ];
      
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.transactions + '?months=12').respond(200, mockTransactions);
      
      var result;
      transactionDataService.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('txn1');
    });
    
    it('should return mock data on API failure', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.transactions + '?months=12').respond(500, 'Server Error');
      
      var result;
      transactionDataService.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].transactionId).toBeDefined();
      expect(result[0].amount).toBeDefined();
      expect(result[0].category).toBeDefined();
    });
    
    it('should cache transactions after first fetch', function() {
      var mockTransactions = [{transactionId: 'txn1', amount: 100}];
      
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.transactions + '?months=6').respond(200, mockTransactions);
      
      transactionDataService.getTransactions(6);
      $httpBackend.flush();
      
      var result;
      transactionDataService.getTransactions(6).then(function(transactions) {
        result = transactions;
      });
      $rootScope.$apply();
      
      expect(result).toBeDefined();
      expect(result[0].transactionId).toBe('txn1');
    });
    
    it('should use different cache for different month parameters', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.transactions + '?months=6').respond(200, [{transactionId: 'txn1'}]);
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.transactions + '?months=12').respond(200, [{transactionId: 'txn2'}]);
      
      transactionDataService.getTransactions(6);
      transactionDataService.getTransactions(12);
      
      $httpBackend.flush();
    });
    
    it('should generate mock transactions with all required properties', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.transactions + '?months=12').respond(500, 'Error');
      
      var result;
      transactionDataService.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      var txn = result[0];
      expect(txn.transactionId).toBeDefined();
      expect(txn.cardId).toBeDefined();
      expect(txn.amount).toBeDefined();
      expect(txn.category).toBeDefined();
      expect(txn.merchant).toBeDefined();
      expect(txn.transactionDate).toBeDefined();
      expect(txn.description).toBeDefined();
    });
    
    it('should generate transactions across multiple months', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.transactions + '?months=12').respond(500, 'Error');
      
      var result;
      transactionDataService.getTransactions(12).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      var uniqueMonths = new Set();
      result.forEach(function(txn) {
        var date = new Date(txn.transactionDate);
        var monthKey = date.getFullYear() + '-' + (date.getMonth() + 1);
        uniqueMonths.add(monthKey);
      });
      
      expect(uniqueMonths.size).toBeGreaterThan(1);
    });
  });
});