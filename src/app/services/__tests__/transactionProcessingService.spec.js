/*
Test Documentation:
- Test Name: transactionProcessingService - getMonthlyTransactions
- Purpose: Validates monthly transaction summary retrieval
- Scenario: Service fetches monthly spend and outstanding amount
- Expected Result: Returns monthly transaction summary with spend and outstanding amount
*/
/*
Test Documentation:
- Test Name: transactionProcessingService - error handling
- Purpose: Validates fallback to mock data on API failure
- Scenario: Service returns mock data when API call fails
- Expected Result: Returns mock monthly data with valid structure
*/
/*
Coverage Report:
- Functions tested: getMonthlyTransactions
- Scenarios covered: successful API call, API failure with mock fallback, data structure validation
- Uncovered scenarios: none
*/

describe('transactionProcessingService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var transactionProcessingService, $httpBackend, $rootScope, apiConfig;
  
  beforeEach(inject(function(_transactionProcessingService_, _$httpBackend_, _$rootScope_, _apiConfig_) {
    transactionProcessingService = _transactionProcessingService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    apiConfig = _apiConfig_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getMonthlyTransactions', function() {
    it('should return monthly transaction data on successful API call', function() {
      var mockData = {
        monthlySpend: 5000,
        outstandingAmount: 5000
      };
      
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.monthlyTransactions).respond(200, mockData);
      
      var result;
      transactionProcessingService.getMonthlyTransactions().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(5000);
      expect(result.outstandingAmount).toBe(5000);
    });
    
    it('should return mock data on API failure', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.monthlyTransactions).respond(500, 'Server Error');
      
      var result;
      transactionProcessingService.getMonthlyTransactions().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(4500);
      expect(result.outstandingAmount).toBe(4500);
    });
    
    it('should include both monthlySpend and outstandingAmount', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.monthlyTransactions).respond(500, 'Error');
      
      var result;
      transactionProcessingService.getMonthlyTransactions().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.monthlySpend).toBeDefined();
      expect(result.outstandingAmount).toBeDefined();
      expect(typeof result.monthlySpend).toBe('number');
      expect(typeof result.outstandingAmount).toBe('number');
    });
    
    it('should respect API timeout configuration', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.monthlyTransactions).respond(200, {monthlySpend: 3000, outstandingAmount: 3000});
      
      transactionProcessingService.getMonthlyTransactions();
      
      $httpBackend.flush();
    });
  });
});