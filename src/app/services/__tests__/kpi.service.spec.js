/*
Test Documentation:
- Test Name: KPIService - getKPIs success
- Purpose: Validates retrieval of consolidated KPI data
- Scenario: User requests dashboard KPIs
- Expected Result: Promise resolves with KPI object containing financial metrics
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIs error
- Purpose: Validates error handling when API fails
- Scenario: HTTP request fails with server error
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIs with complete data
- Purpose: Validates all KPI fields are returned correctly
- Scenario: API returns complete KPI data
- Expected Result: All KPI metrics are present and accurate
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: successful retrieval, error handling, complete data validation
- Uncovered scenarios: partial KPI data, network timeout
*/

describe('KPIService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var KPIService, $httpBackend;
  
  beforeEach(inject(function(_KPIService_, _$httpBackend_) {
    KPIService = _KPIService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getKPIs', function() {
    it('should return KPI data when API call succeeds', function() {
      var userId = 'user123';
      var mockResponse = {
        monthlySpend: 2500,
        totalCreditLimit: 25000,
        availableCredit: 18000,
        outstandingAmount: 7000
      };
      
      $httpBackend.expectGET('/api/kpis?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      KPIService.getKPIs(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
      expect(result.monthlySpend).toBe(2500);
      expect(result.totalCreditLimit).toBe(25000);
      expect(result.availableCredit).toBe(18000);
      expect(result.outstandingAmount).toBe(7000);
    });
    
    it('should reject promise when API call fails', function() {
      var userId = 'user123';
      var errorResponse = { message: 'Internal Server Error' };
      
      $httpBackend.expectGET('/api/kpis?userId=' + userId)
        .respond(500, errorResponse);
      
      var error;
      KPIService.getKPIs(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should handle empty KPI data', function() {
      var userId = 'user123';
      var mockResponse = {};
      
      $httpBackend.expectGET('/api/kpis?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      KPIService.getKPIs(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual({});
    });
    
    it('should handle zero values in KPI data', function() {
      var userId = 'user123';
      var mockResponse = {
        monthlySpend: 0,
        totalCreditLimit: 10000,
        availableCredit: 10000,
        outstandingAmount: 0
      };
      
      $httpBackend.expectGET('/api/kpis?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      KPIService.getKPIs(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.monthlySpend).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.availableCredit).toBe(10000);
    });
    
    it('should handle 401 unauthorized error', function() {
      var userId = 'user123';
      
      $httpBackend.expectGET('/api/kpis?userId=' + userId)
        .respond(401, { message: 'Unauthorized' });
      
      var error;
      KPIService.getKPIs(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
    
    it('should handle 404 not found error', function() {
      var userId = 'user999';
      
      $httpBackend.expectGET('/api/kpis?userId=' + userId)
        .respond(404, { message: 'User not found' });
      
      var error;
      KPIService.getKPIs(userId).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
    
    it('should handle partial KPI data', function() {
      var userId = 'user123';
      var mockResponse = {
        monthlySpend: 1500,
        totalCreditLimit: 20000
      };
      
      $httpBackend.expectGET('/api/kpis?userId=' + userId)
        .respond(200, mockResponse);
      
      var result;
      KPIService.getKPIs(userId).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.monthlySpend).toBe(1500);
      expect(result.totalCreditLimit).toBe(20000);
      expect(result.availableCredit).toBeUndefined();
      expect(result.outstandingAmount).toBeUndefined();
    });
  });
});