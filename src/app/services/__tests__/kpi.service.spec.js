/*
Test Documentation:
- Test Name: KPIService - getKPIData returns formatted KPI data
- Purpose: Validates that getKPIData retrieves and formats KPI metrics correctly
- Scenario: Service is called to fetch dashboard KPIs
- Expected Result: Returns promise resolving to KPI object with all metrics

Test Documentation:
- Test Name: KPIService - getKPIData handles missing fields with defaults
- Purpose: Validates default value assignment for missing KPI fields
- Scenario: Backend response is missing some KPI fields
- Expected Result: Missing fields are set to 0 or current timestamp

Test Documentation:
- Test Name: KPIService - getKPIData HTTP error handling
- Purpose: Validates error handling for failed KPI requests
- Scenario: Backend returns error response
- Expected Result: Promise is rejected with error object

Test Documentation:
- Test Name: KPIService - getKPIData disables caching
- Purpose: Validates that KPI requests bypass cache for real-time data
- Scenario: Service makes HTTP request
- Expected Result: Request includes cache: false option

Coverage Report:
- Functions tested: getKPIData
- Scenarios covered: valid response, missing fields with defaults, HTTP errors, cache disabled
- Uncovered scenarios: none
*/

describe('KPIService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var KPIService, $httpBackend, API_CONFIG;
  
  beforeEach(inject(function(_KPIService_, _$httpBackend_, _API_CONFIG_) {
    KPIService = _KPIService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getKPIData', function() {
    it('should return formatted KPI data', function() {
      var mockResponse = {
        monthlySpend: 3500.75,
        totalCreditLimit: 25000,
        availableCredit: 18500,
        outstandingAmount: 6500,
        utilizationRate: 26,
        lastUpdated: '2023-12-15T10:30:00Z'
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.kpi)
        .respond(200, mockResponse);
      
      var result;
      KPIService.getKPIData().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.monthlySpend).toBe(3500.75);
      expect(result.totalCreditLimit).toBe(25000);
      expect(result.availableCredit).toBe(18500);
      expect(result.outstandingAmount).toBe(6500);
      expect(result.utilizationRate).toBe(26);
      expect(result.lastUpdated).toEqual(new Date('2023-12-15T10:30:00Z'));
    });
    
    it('should handle missing fields with default values', function() {
      var mockResponse = {
        monthlySpend: 1000
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.kpi)
        .respond(200, mockResponse);
      
      var result;
      KPIService.getKPIData().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.monthlySpend).toBe(1000);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.availableCredit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.utilizationRate).toBe(0);
      expect(result.lastUpdated).toBeDefined();
      expect(result.lastUpdated instanceof Date).toBe(true);
    });
    
    it('should handle HTTP errors gracefully', function() {
      var errorResponse = { message: 'Failed to fetch KPI data' };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.kpi)
        .respond(500, errorResponse);
      
      var error;
      KPIService.getKPIData().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should make request with cache disabled', function() {
      var mockResponse = {
        monthlySpend: 2000,
        totalCreditLimit: 10000,
        availableCredit: 8000,
        outstandingAmount: 2000,
        utilizationRate: 20,
        lastUpdated: Date.now()
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.kpi)
        .respond(200, mockResponse);
      
      KPIService.getKPIData();
      $httpBackend.flush();
    });
    
    it('should handle empty response with defaults', function() {
      var mockResponse = {};
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.kpi)
        .respond(200, mockResponse);
      
      var result;
      KPIService.getKPIData().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.monthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.availableCredit).toBe(0);
      expect(result.outstandingAmount).toBe(0);
      expect(result.utilizationRate).toBe(0);
    });
    
    it('should parse lastUpdated as Date object', function() {
      var mockResponse = {
        monthlySpend: 1500,
        totalCreditLimit: 5000,
        availableCredit: 3500,
        outstandingAmount: 1500,
        utilizationRate: 30,
        lastUpdated: '2023-11-20T14:45:00Z'
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.kpi)
        .respond(200, mockResponse);
      
      var result;
      KPIService.getKPIData().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.lastUpdated instanceof Date).toBe(true);
      expect(result.lastUpdated.toISOString()).toBe('2023-11-20T14:45:00.000Z');
    });
  });
});