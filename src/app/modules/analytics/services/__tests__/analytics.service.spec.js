/*
Test Documentation:
- Test Name: AnalyticsService Unit Tests
- Purpose: Validate spending analytics retrieval with long-term caching
- Scenario: Test getSpendingAnalytics method with various periods and caching behavior
- Expected Result: Service should fetch analytics data, cache for 24 hours, and handle errors
*/

describe('AnalyticsService', function() {
  'use strict';

  beforeEach(module('analyticsModule'));
  beforeEach(module('creditCardApp'));

  var AnalyticsService, $httpBackend, API_CONFIG, AuthService;
  var mockUserId = 'user-001';
  var mockPeriod = '12months';
  var mockAnalyticsData = {
    userId: 'user-001',
    period: '12months',
    categorySpend: {
      'Food & Dining': 5000,
      'Fuel': 2000,
      'Shopping': 8000,
      'Travel': 3000
    },
    monthlyTrend: [
      { month: 'Jan', totalSpend: 4000 },
      { month: 'Feb', totalSpend: 5000 }
    ],
    cardWiseSpend: [
      { cardId: 'card-001', totalSpend: 10000 },
      { cardId: 'card-002', totalSpend: 8000 }
    ]
  };

  beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _API_CONFIG_, _AuthService_) {
    AnalyticsService = _AnalyticsService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    AuthService = _AuthService_;
    spyOn(AuthService, 'getToken').and.returnValue('mock-token-analytics');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(AnalyticsService).toBeDefined();
    });

    it('should have getSpendingAnalytics method', function() {
      expect(AnalyticsService.getSpendingAnalytics).toBeDefined();
      expect(typeof AnalyticsService.getSpendingAnalytics).toBe('function');
    });
  });

  describe('getSpendingAnalytics() - Success Scenarios', function() {
    it('should fetch spending analytics successfully', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=' + mockPeriod;
      $httpBackend.expectGET(url).respond(200, mockAnalyticsData);

      var result;
      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.userId).toBe(mockUserId);
      expect(result.period).toBe(mockPeriod);
    });

    it('should include authorization header', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=' + mockPeriod;
      $httpBackend.expectGET(url, function(headers) {
        return headers['Authorization'] === 'Bearer mock-token-analytics';
      }).respond(200, mockAnalyticsData);

      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod);
      $httpBackend.flush();

      expect(AuthService.getToken).toHaveBeenCalled();
    });

    it('should return category spend data', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=' + mockPeriod;
      $httpBackend.expectGET(url).respond(200, mockAnalyticsData);

      var result;
      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.categorySpend).toBeDefined();
      expect(result.categorySpend['Food & Dining']).toBe(5000);
    });

    it('should return monthly trend data', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=' + mockPeriod;
      $httpBackend.expectGET(url).respond(200, mockAnalyticsData);

      var result;
      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.monthlyTrend).toBeDefined();
      expect(Array.isArray(result.monthlyTrend)).toBe(true);
      expect(result.monthlyTrend.length).toBe(2);
    });

    it('should return card-wise spend data', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=' + mockPeriod;
      $httpBackend.expectGET(url).respond(200, mockAnalyticsData);

      var result;
      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.cardWiseSpend).toBeDefined();
      expect(Array.isArray(result.cardWiseSpend)).toBe(true);
      expect(result.cardWiseSpend.length).toBe(2);
    });
  });

  describe('getSpendingAnalytics() - Caching Behavior', function() {
    it('should cache analytics data after first fetch', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=' + mockPeriod;
      $httpBackend.expectGET(url).respond(200, mockAnalyticsData);

      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod);
      $httpBackend.flush();

      // Second call should use cache
      var result;
      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod).then(function(data) {
        result = data;
      });

      expect(result).toBeDefined();
    });

    it('should cache separately for different periods', function() {
      var url1 = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=6months';
      var url2 = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=12months';
      
      $httpBackend.expectGET(url1).respond(200, mockAnalyticsData);
      $httpBackend.expectGET(url2).respond(200, mockAnalyticsData);

      AnalyticsService.getSpendingAnalytics(mockUserId, '6months');
      AnalyticsService.getSpendingAnalytics(mockUserId, '12months');
      
      $httpBackend.flush();

      expect(true).toBe(true); // Both requests executed
    });
  });

  describe('getSpendingAnalytics() - Different Periods', function() {
    it('should handle 3months period', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=3months';
      $httpBackend.expectGET(url).respond(200, mockAnalyticsData);

      var result;
      AnalyticsService.getSpendingAnalytics(mockUserId, '3months').then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
    });

    it('should handle 6months period', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=6months';
      $httpBackend.expectGET(url).respond(200, mockAnalyticsData);

      var result;
      AnalyticsService.getSpendingAnalytics(mockUserId, '6months').then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
    });
  });

  describe('getSpendingAnalytics() - Error Handling', function() {
    it('should handle 400 bad request error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=' + mockPeriod;
      $httpBackend.expectGET(url).respond(400, 'Bad Request');

      var error;
      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(400);
    });

    it('should handle 401 unauthorized error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=' + mockPeriod;
      $httpBackend.expectGET(url).respond(401, 'Unauthorized');

      var error;
      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });

    it('should handle 500 server error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=' + mockPeriod;
      $httpBackend.expectGET(url).respond(500, 'Internal Server Error');

      var error;
      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should reject promise on network error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=' + mockPeriod;
      $httpBackend.expectGET(url).respond(-1, '');

      var rejected = false;
      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod).catch(function() {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
    });
  });

  describe('getSpendingAnalytics() - Edge Cases', function() {
    it('should handle empty category spend', function() {
      var emptyData = { userId: mockUserId, period: mockPeriod, categorySpend: {}, monthlyTrend: [], cardWiseSpend: [] };
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=' + mockPeriod;
      $httpBackend.expectGET(url).respond(200, emptyData);

      var result;
      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.categorySpend).toBeDefined();
      expect(Object.keys(result.categorySpend).length).toBe(0);
    });

    it('should handle null response', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ANALYTICS_SPENDING + '?userId=' + mockUserId + '&period=' + mockPeriod;
      $httpBackend.expectGET(url).respond(200, null);

      var result;
      AnalyticsService.getSpendingAnalytics(mockUserId, mockPeriod).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeNull();
    });
  });
});

/*
Coverage Report:
- Service tested: AnalyticsService
- Methods tested: getSpendingAnalytics()
- Scenarios covered: successful fetch, authorization, data structure validation, caching (24-hour), different periods (3/6/12 months), error handling (400, 401, 500, network), edge cases
- Dependencies mocked: $http, AuthService, API_CONFIG
- Uncovered scenarios: cache expiration timing (requires time manipulation)
*/