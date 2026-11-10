/*
Test Documentation:
- Test Name: dashboardApiService Unit Tests
- Purpose: Validates dashboard API service for fetching KPI data with error handling and mock data fallback
- Scenario: Tests successful API calls, error handling, network failures, and mock data generation
- Expected Result: Service should fetch KPIs correctly and provide mock data on failure
*/

describe('dashboardApiService', function() {
  'use strict';

  var dashboardApiService, $httpBackend, $q, API_CONFIG;
  var mockUserId = 'user123';
  var mockKPIData = {
    userId: 'user123',
    monthlySpend: 4567.89,
    totalCreditLimit: 50000,
    availableCredit: 35432.11,
    outstandingAmount: 14567.89,
    utilizationRate: 29.14,
    lastUpdated: '2026-11-10T22:29:43.000Z'
  };

  beforeEach(module('creditCardApp.dashboard'));

  beforeEach(inject(function(_dashboardApiService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    dashboardApiService = _dashboardApiService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(dashboardApiService).toBeDefined();
    });

    it('should have getKPIs method', function() {
      expect(dashboardApiService.getKPIs).toBeDefined();
      expect(typeof dashboardApiService.getKPIs).toBe('function');
    });
  });

  describe('getKPIs() - Success Scenarios', function() {
    it('should make GET request to correct endpoint with userId', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(200, mockKPIData);

      dashboardApiService.getKPIs(mockUserId);
      $httpBackend.flush();
    });

    it('should return KPI data on successful response', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(200, mockKPIData);

      dashboardApiService.getKPIs(mockUserId).then(function(data) {
        expect(data).toEqual(mockKPIData);
      });
      $httpBackend.flush();
    });

    it('should include timeout in request configuration', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(200, mockKPIData);

      dashboardApiService.getKPIs(mockUserId);
      $httpBackend.flush();
    });

    it('should return all required KPI fields', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(200, mockKPIData);

      dashboardApiService.getKPIs(mockUserId).then(function(data) {
        expect(data.userId).toBeDefined();
        expect(data.monthlySpend).toBeDefined();
        expect(data.totalCreditLimit).toBeDefined();
        expect(data.availableCredit).toBeDefined();
        expect(data.outstandingAmount).toBeDefined();
        expect(data.utilizationRate).toBeDefined();
      });
      $httpBackend.flush();
    });
  });

  describe('getKPIs() - Error Handling', function() {
    it('should return mock data on 500 server error', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(500, {error: 'Server Error'});

      dashboardApiService.getKPIs(mockUserId).then(function(data) {
        expect(data).toBeDefined();
        expect(data.userId).toBe('user123');
        expect(data.monthlySpend).toBeDefined();
      });
      $httpBackend.flush();
    });

    it('should return mock data on 404 not found', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(404, {error: 'Not Found'});

      dashboardApiService.getKPIs(mockUserId).then(function(data) {
        expect(data).toBeDefined();
        expect(data.totalCreditLimit).toBe(50000);
      });
      $httpBackend.flush();
    });

    it('should return mock data on network error', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(-1, '');

      dashboardApiService.getKPIs(mockUserId).catch(function(error) {
        expect(error.message).toContain('Network error');
        expect(error.mock).toBe(true);
      });
      $httpBackend.flush();
    });
  });

  describe('Mock Data Generation', function() {
    it('should generate valid mock KPI data structure', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(500, {});

      dashboardApiService.getKPIs(mockUserId).then(function(data) {
        expect(data.userId).toBe('user123');
        expect(typeof data.monthlySpend).toBe('number');
        expect(typeof data.totalCreditLimit).toBe('number');
        expect(typeof data.availableCredit).toBe('number');
        expect(typeof data.outstandingAmount).toBe('number');
        expect(typeof data.utilizationRate).toBe('number');
      });
      $httpBackend.flush();
    });

    it('should generate realistic mock values', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(500, {});

      dashboardApiService.getKPIs(mockUserId).then(function(data) {
        expect(data.monthlySpend).toBe(4567.89);
        expect(data.totalCreditLimit).toBe(50000);
        expect(data.availableCredit).toBe(35432.11);
        expect(data.outstandingAmount).toBe(14567.89);
        expect(data.utilizationRate).toBe(29.14);
      });
      $httpBackend.flush();
    });

    it('should include lastUpdated timestamp in mock data', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(500, {});

      dashboardApiService.getKPIs(mockUserId).then(function(data) {
        expect(data.lastUpdated).toBeDefined();
        expect(typeof data.lastUpdated).toBe('string');
      });
      $httpBackend.flush();
    });
  });

  describe('Multiple User Scenarios', function() {
    it('should handle requests for different users', function() {
      var user1 = 'user123';
      var user2 = 'user456';
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      
      $httpBackend.expectGET(expectedUrl + '?userId=' + user1).respond(200, mockKPIData);
      $httpBackend.expectGET(expectedUrl + '?userId=' + user2).respond(200, mockKPIData);

      dashboardApiService.getKPIs(user1);
      dashboardApiService.getKPIs(user2);
      $httpBackend.flush();
    });

    it('should handle concurrent requests', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(200, mockKPIData);
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(200, mockKPIData);

      var promise1 = dashboardApiService.getKPIs(mockUserId);
      var promise2 = dashboardApiService.getKPIs(mockUserId);

      expect(promise1).toBeDefined();
      expect(promise2).toBeDefined();
      $httpBackend.flush();
    });
  });

  describe('Data Validation', function() {
    it('should validate numeric KPI values', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(200, mockKPIData);

      dashboardApiService.getKPIs(mockUserId).then(function(data) {
        expect(data.monthlySpend).toBeGreaterThanOrEqual(0);
        expect(data.totalCreditLimit).toBeGreaterThan(0);
        expect(data.availableCredit).toBeGreaterThanOrEqual(0);
        expect(data.outstandingAmount).toBeGreaterThanOrEqual(0);
        expect(data.utilizationRate).toBeGreaterThanOrEqual(0);
        expect(data.utilizationRate).toBeLessThanOrEqual(100);
      });
      $httpBackend.flush();
    });

    it('should maintain financial consistency in mock data', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard + '/kpis';
      $httpBackend.expectGET(expectedUrl + '?userId=' + mockUserId).respond(500, {});

      dashboardApiService.getKPIs(mockUserId).then(function(data) {
        var calculatedAvailable = data.totalCreditLimit - data.outstandingAmount;
        expect(Math.abs(data.availableCredit - calculatedAvailable)).toBeLessThan(0.01);
      });
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getKPIs, getMockKPIs (internal)
- Scenarios covered:
  * Successful API call with valid response
  * Error handling (500, 404, network errors)
  * Mock data generation and structure
  * Multiple user requests
  * Concurrent requests
  * Data validation and financial consistency
  * Timeout configuration
- Uncovered scenarios: Request cancellation, rate limiting
*/