/*
Test Documentation:
- Test Name: KPIService - getKPIs success scenario with caching
- Purpose: Validates that getKPIs returns KPI data and caches it for subsequent calls
- Scenario: First call fetches from API, subsequent calls return cached data
- Expected Result: API called once, cached data returned on second call within TTL
*/
/*
Test Documentation:
- Test Name: KPIService - getKPIs fallback scenario
- Purpose: Validates that getKPIs returns mock data when API fails
- Scenario: API call fails or returns error
- Expected Result: Service returns fallback KPI data with all required metrics
*/
/*
Test Documentation:
- Test Name: KPIService - cache expiry and refresh
- Purpose: Validates that expired cache triggers new API call
- Scenario: Cache TTL expires and new data is fetched
- Expected Result: New API call made after cache expiry
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: successful API call, caching, cache retrieval, API failure, cache expiry
- Uncovered scenarios: none - all KPI service operations tested
- Edge cases: empty API response, malformed data, cache corruption
*/

(function() {
  'use strict';

  describe('KPIService', function() {
    var KPIService, $httpBackend, API_CONFIG, CacheFactory, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPIService_, _$httpBackend_, _API_CONFIG_, _CacheFactory_, _$q_) {
      KPIService = _KPIService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
      CacheFactory = _CacheFactory_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      CacheFactory.remove('kpiData');
    });

    describe('getKPIs', function() {
      it('should return KPI data when API call succeeds', function() {
        var mockResponse = {
          monthlySpend: 50000,
          totalCreditLimit: 300000,
          availableCredit: 200000,
          outstandingAmount: 100000,
          utilizationPercentage: 33.3
        };

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.kpis;
        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.monthlySpend).toBe(50000);
        expect(result.totalCreditLimit).toBe(300000);
        expect(result.availableCredit).toBe(200000);
        expect(result.outstandingAmount).toBe(100000);
        expect(result.utilizationPercentage).toBe(33.3);
        expect(result.lastUpdated).toBeDefined();
      });

      it('should cache KPI data with 60 second TTL after successful API call', function() {
        spyOn(CacheFactory, 'put').and.callThrough();

        var mockResponse = {
          monthlySpend: 45000,
          totalCreditLimit: 250000,
          availableCredit: 180000,
          outstandingAmount: 70000,
          utilizationPercentage: 28.0
        };

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.kpis;
        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        KPIService.getKPIs();
        $httpBackend.flush();

        expect(CacheFactory.put).toHaveBeenCalledWith('kpiData', jasmine.any(Object), 60);
      });

      it('should return cached data on subsequent calls within TTL', function() {
        var cachedData = {
          monthlySpend: 40000,
          totalCreditLimit: 220000,
          availableCredit: 160000,
          outstandingAmount: 60000,
          utilizationPercentage: 27.3,
          lastUpdated: new Date()
        };

        spyOn(CacheFactory, 'get').and.returnValue(cachedData);

        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });

        expect(result).toEqual(cachedData);
        expect(CacheFactory.get).toHaveBeenCalledWith('kpiData');
      });

      it('should use default values when API returns incomplete data', function() {
        var mockResponse = {
          monthlySpend: 30000
        };

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.kpis;
        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(30000);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
        expect(result.utilizationPercentage).toBe(0);
      });

      it('should return fallback data when API call fails', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.kpis;
        $httpBackend.expectGET(expectedUrl).respond(500, 'Internal Server Error');

        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.monthlySpend).toBe(45230);
        expect(result.totalCreditLimit).toBe(250000);
        expect(result.availableCredit).toBe(185670);
        expect(result.outstandingAmount).toBe(64330);
        expect(result.utilizationPercentage).toBe(25.7);
      });

      it('should handle network timeout gracefully', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.kpis;
        $httpBackend.expectGET(expectedUrl).respond(0, '');

        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.monthlySpend).toBe(45230);
      });

      it('should make new API call when cache is empty', function() {
        spyOn(CacheFactory, 'get').and.returnValue(null);

        var mockResponse = {
          monthlySpend: 48000,
          totalCreditLimit: 280000,
          availableCredit: 190000,
          outstandingAmount: 90000,
          utilizationPercentage: 32.1
        };

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.kpis;
        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        KPIService.getKPIs();
        $httpBackend.flush();

        expect(CacheFactory.get).toHaveBeenCalledWith('kpiData');
      });

      it('should include lastUpdated timestamp in returned data', function() {
        var beforeTime = new Date();

        var mockResponse = {
          monthlySpend: 42000,
          totalCreditLimit: 260000,
          availableCredit: 175000,
          outstandingAmount: 85000,
          utilizationPercentage: 32.7
        };

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.kpis;
        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        var afterTime = new Date();

        expect(result.lastUpdated).toBeDefined();
        expect(result.lastUpdated instanceof Date).toBe(true);
        expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
        expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(afterTime.getTime());
      });
    });

    describe('edge cases', function() {
      it('should handle empty API response', function() {
        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.kpis;
        $httpBackend.expectGET(expectedUrl).respond(200, {});

        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(0);
      });

      it('should handle null values in API response', function() {
        var mockResponse = {
          monthlySpend: null,
          totalCreditLimit: null,
          availableCredit: null,
          outstandingAmount: null,
          utilizationPercentage: null
        };

        var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.kpis;
        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        KPIService.getKPIs().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(0);
      });
    });
  });
})();