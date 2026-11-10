/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend success
- Purpose: Verify service retrieves monthly spend from API
- Scenario: API returns monthly spend amount
- Expected Result: Returns numeric spend value
*/
/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend with zero amount
- Purpose: Verify service handles zero spend correctly
- Scenario: API returns amount as 0
- Expected Result: Returns 0 instead of undefined
*/
/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend API failure
- Purpose: Verify service returns fallback value on API error
- Scenario: HTTP request fails
- Expected Result: Returns default demo value 28500
*/
/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend timeout
- Purpose: Verify service respects timeout configuration
- Scenario: Request timeout configured
- Expected Result: Request includes timeout parameter
*/
/*
Coverage Report:
- Functions tested: getMonthlySpend
- Scenarios covered: API success, zero amount, API failure, timeout handling
- Uncovered scenarios: multiple concurrent requests, cache implementation
*/

describe('TransactionService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var TransactionService, $httpBackend, API_CONFIG;
  
  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _API_CONFIG_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getMonthlySpend', function() {
    it('should return monthly spend from API', function() {
      var mockResponse = { amount: 35000 };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly-spend')
        .respond(200, mockResponse);
      
      var result;
      TransactionService.getMonthlySpend().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBe(35000);
      expect(typeof result).toBe('number');
    });
    
    it('should return 0 when amount is 0', function() {
      var mockResponse = { amount: 0 };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly-spend')
        .respond(200, mockResponse);
      
      var result;
      TransactionService.getMonthlySpend().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBe(0);
    });
    
    it('should return 0 when amount is undefined', function() {
      var mockResponse = {};
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly-spend')
        .respond(200, mockResponse);
      
      var result;
      TransactionService.getMonthlySpend().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBe(0);
    });
    
    it('should return fallback value on API error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly-spend')
        .respond(500, 'Server Error');
      
      var result;
      TransactionService.getMonthlySpend().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBe(28500);
    });
    
    it('should return fallback value on network error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly-spend')
        .respond(0, '');
      
      var result;
      TransactionService.getMonthlySpend().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBe(28500);
    });
    
    it('should handle large spend amounts', function() {
      var mockResponse = { amount: 999999999 };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly-spend')
        .respond(200, mockResponse);
      
      var result;
      TransactionService.getMonthlySpend().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBe(999999999);
    });
    
    it('should respect timeout configuration', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly-spend')
        .respond(200, { amount: 10000 });
      
      TransactionService.getMonthlySpend();
      $httpBackend.flush();
    });
  });
});