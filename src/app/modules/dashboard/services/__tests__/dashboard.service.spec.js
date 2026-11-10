/*
Test Documentation:
- Test Name: DashboardService Unit Tests
- Purpose: Validate dashboard KPI retrieval with caching mechanism
- Scenario: Test getKPIs method with successful response, error handling, and cache behavior
- Expected Result: Service should fetch KPIs, cache results, and handle errors appropriately
*/

describe('DashboardService', function() {
  'use strict';

  beforeEach(module('dashboardModule'));
  beforeEach(module('creditCardApp'));

  var DashboardService, $httpBackend, API_CONFIG, AuthService, $q;
  var mockUserId = 'user-001';
  var mockKPIData = {
    userId: 'user-001',
    totalCreditLimit: 50000,
    totalOutstanding: 15000,
    totalAvailableCredit: 35000,
    monthlySpend: 5000,
    lastUpdated: '2024-01-15T10:00:00Z',
    cards: []
  };

  beforeEach(inject(function(_DashboardService_, _$httpBackend_, _API_CONFIG_, _AuthService_, _$q_) {
    DashboardService = _DashboardService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    AuthService = _AuthService_;
    $q = _$q_;
    spyOn(AuthService, 'getToken').and.returnValue('mock-token-123');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(DashboardService).toBeDefined();
    });

    it('should have getKPIs method', function() {
      expect(DashboardService.getKPIs).toBeDefined();
      expect(typeof DashboardService.getKPIs).toBe('function');
    });
  });

  describe('getKPIs() - Success Scenarios', function() {
    it('should fetch KPIs for valid user ID', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPIS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(200, mockKPIData);

      var result;
      DashboardService.getKPIs(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.userId).toBe(mockUserId);
      expect(result.totalCreditLimit).toBe(50000);
    });

    it('should include authorization header in request', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPIS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url, function(headers) {
        return headers['Authorization'] === 'Bearer mock-token-123';
      }).respond(200, mockKPIData);

      DashboardService.getKPIs(mockUserId);
      $httpBackend.flush();

      expect(AuthService.getToken).toHaveBeenCalled();
    });

    it('should return promise', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPIS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(200, mockKPIData);

      var promise = DashboardService.getKPIs(mockUserId);
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $httpBackend.flush();
    });
  });

  describe('getKPIs() - Caching Behavior', function() {
    it('should cache KPI data after first fetch', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPIS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(200, mockKPIData);

      DashboardService.getKPIs(mockUserId);
      $httpBackend.flush();

      // Second call should use cache, no HTTP request
      var result;
      DashboardService.getKPIs(mockUserId).then(function(data) {
        result = data;
      });

      expect(result).toBeDefined();
    });

    it('should use cached data within cache time window', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPIS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(200, mockKPIData);

      var result1, result2;
      DashboardService.getKPIs(mockUserId).then(function(data) {
        result1 = data;
      });
      $httpBackend.flush();

      DashboardService.getKPIs(mockUserId).then(function(data) {
        result2 = data;
      });

      expect(result1).toEqual(result2);
    });
  });

  describe('getKPIs() - Error Handling', function() {
    it('should handle 404 error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPIS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(404, 'Not Found');

      var error;
      DashboardService.getKPIs(mockUserId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle 500 server error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPIS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(500, 'Internal Server Error');

      var error;
      DashboardService.getKPIs(mockUserId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle network timeout', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPIS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(-1, '');

      var error;
      DashboardService.getKPIs(mockUserId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    it('should reject promise on error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPIS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(400, 'Bad Request');

      var rejected = false;
      DashboardService.getKPIs(mockUserId).catch(function() {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
    });
  });

  describe('getKPIs() - Edge Cases', function() {
    it('should handle empty user ID', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPIS + '?userId=';
      $httpBackend.expectGET(url).respond(400, 'Invalid user ID');

      var error;
      DashboardService.getKPIs('').catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    it('should handle null response data', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD_KPIS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(200, null);

      var result;
      DashboardService.getKPIs(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeNull();
    });
  });
});

/*
Coverage Report:
- Service tested: DashboardService
- Methods tested: getKPIs()
- Scenarios covered: successful fetch, caching mechanism, authorization headers, error handling (404, 500, timeout), edge cases (empty ID, null data)
- Dependencies mocked: $http, AuthService, API_CONFIG
- Uncovered scenarios: cache expiration timing (requires time manipulation)
*/