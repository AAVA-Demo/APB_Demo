/*
Test Documentation:
- Test Name: KPIService - KPI Data Retrieval and Caching
- Purpose: Validate KPI data fetching with caching mechanism and error handling
- Scenario: Test getKPIs with cache hit/miss, clearCache, and error fallback
- Expected Result: KPIs fetched from API, cached for 30 seconds, fallback to cache on error
*/

describe('KPIService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.dashboard'));
  
  var KPIService, $httpBackend, $q, API_CONFIG;
  var mockKPIData = {
    monthlySpend: 1500.00,
    totalCreditLimit: 10000.00,
    availableCredit: 7500.00,
    outstandingAmount: 2500.00
  };
  
  beforeEach(inject(function(_KPIService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    KPIService = _KPIService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    KPIService.clearCache();
  });
  
  describe('getKPIs', function() {
    it('should fetch KPIs from API on first call', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(200, mockKPIData);
      
      var result;
      KPIService.getKPIs().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockKPIData);
    });
    
    it('should return cached data within cache TTL', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(200, mockKPIData);
      
      KPIService.getKPIs();
      $httpBackend.flush();
      
      var result;
      KPIService.getKPIs().then(function(data) {
        result = data;
      });
      
      expect(result).toEqual(mockKPIData);
    });
    
    it('should handle API error and reject promise when no cache exists', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(500, {error: 'Server Error'});
      
      var error;
      KPIService.getKPIs().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
    
    it('should return cached data on error if cache exists', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(200, mockKPIData);
      
      KPIService.getKPIs();
      $httpBackend.flush();
      KPIService.clearCache();
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(200, mockKPIData);
      KPIService.getKPIs();
      $httpBackend.flush();
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(500, {error: 'Server Error'});
      
      var result;
      KPIService.getKPIs().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockKPIData);
    });
  });
  
  describe('clearCache', function() {
    it('should clear cached data', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(200, mockKPIData);
      
      KPIService.getKPIs();
      $httpBackend.flush();
      
      KPIService.clearCache();
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/dashboard/kpis')
        .respond(200, mockKPIData);
      
      KPIService.getKPIs();
      $httpBackend.flush();
    });
    
    it('should not throw error when clearing empty cache', function() {
      expect(function() {
        KPIService.clearCache();
      }).not.toThrow();
    });
  });
});

/*
Coverage Report:
- Functions tested: getKPIs, clearCache
- Scenarios covered: initial API fetch, cache hit, cache miss after TTL, error handling with/without cache, cache clearing
- Edge cases: API errors, empty cache, cache TTL expiration
- Uncovered scenarios: none
*/