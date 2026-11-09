/*
Test Documentation:
- Test Name: AnalyticsService
- Purpose: Verify analytics data fetching for trends and category breakdown
- Scenario: Fetch spending trends and category-wise breakdown
- Expected Result: Service should return properly formatted analytics data
*/

describe('AnalyticsService', function() {
  'use strict';

  var AnalyticsService;
  var $httpBackend;
  var API_CONFIG;
  var TransactionFactory;

  beforeEach(module('analyticsModule'));
  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _API_CONFIG_, _TransactionFactory_) {
    AnalyticsService = _AnalyticsService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    TransactionFactory = _TransactionFactory_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  /*
  Test Documentation:
  - Test Name: should be defined
  - Purpose: Verify service exists
  - Scenario: Inject AnalyticsService
  - Expected Result: Service should be defined
  */
  it('should be defined', function() {
    expect(AnalyticsService).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should fetch trends successfully
  - Purpose: Verify trend data retrieval
  - Scenario: Call getTrends with date range
  - Expected Result: Should return array of trend objects
  */
  it('should fetch trends successfully', function() {
    var mockResponse = {
      trends: [
        { month: '2024-01', totalSpend: 2500 },
        { month: '2024-02', totalSpend: 2800 }
      ]
    };

    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsTrends + '?endDate=2024-02-28&startDate=2024-01-01')
      .respond(200, mockResponse);

    var result;
    AnalyticsService.getTrends('2024-01-01', '2024-02-28').then(function(trends) {
      result = trends;
    });

    $httpBackend.flush();

    expect(result.length).toBe(2);
    expect(result[0].month).toBe('2024-01');
  });

  /*
  Test Documentation:
  - Test Name: should include category filter in trends request
  - Purpose: Verify category filtering
  - Scenario: Call getTrends with category parameter
  - Expected Result: Request should include category in params
  */
  it('should include category filter in trends request', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsTrends + '?category=Food%20%26%20Dining&endDate=2024-12-31&startDate=2024-01-01')
      .respond(200, { trends: [] });

    AnalyticsService.getTrends('2024-01-01', '2024-12-31', 'Food & Dining');
    $httpBackend.flush();
  });

  /*
  Test Documentation:
  - Test Name: should handle trends API error
  - Purpose: Verify error handling
  - Scenario: API returns error
  - Expected Result: Promise should be rejected
  */
  it('should handle trends API error', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsTrends + '?endDate=2024-12-31&startDate=2024-01-01')
      .respond(500, 'Server Error');

    var error;
    AnalyticsService.getTrends('2024-01-01', '2024-12-31').catch(function(err) {
      error = err;
    });

    $httpBackend.flush();

    expect(error).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should fetch category breakdown successfully
  - Purpose: Verify category breakdown retrieval
  - Scenario: Call getCategoryBreakdown with date range
  - Expected Result: Should return category breakdown object
  */
  it('should fetch category breakdown successfully', function() {
    var mockResponse = {
      categoryBreakdown: {
        'Food & Dining': 1500,
        'Fuel': 800,
        'Shopping': 2000
      }
    };

    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsTrends + '?breakdown=category&endDate=2024-12-31&startDate=2024-01-01')
      .respond(200, mockResponse);

    var result;
    AnalyticsService.getCategoryBreakdown('2024-01-01', '2024-12-31').then(function(breakdown) {
      result = breakdown;
    });

    $httpBackend.flush();

    expect(result['Food & Dining']).toBe(1500);
    expect(result['Fuel']).toBe(800);
    expect(result['Shopping']).toBe(2000);
  });

  /*
  Test Documentation:
  - Test Name: should handle category breakdown API error
  - Purpose: Verify error handling for breakdown
  - Scenario: API returns error
  - Expected Result: Promise should be rejected
  */
  it('should handle category breakdown API error', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsTrends + '?breakdown=category&endDate=2024-12-31&startDate=2024-01-01')
      .respond(500, 'Server Error');

    var error;
    AnalyticsService.getCategoryBreakdown('2024-01-01', '2024-12-31').catch(function(err) {
      error = err;
    });

    $httpBackend.flush();

    expect(error).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should handle empty trends response
  - Purpose: Verify handling of no data
  - Scenario: API returns empty trends array
  - Expected Result: Should return empty array
  */
  it('should handle empty trends response', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analyticsTrends + '?endDate=2024-12-31&startDate=2024-01-01')
      .respond(200, { trends: [] });

    var result;
    AnalyticsService.getTrends('2024-01-01', '2024-12-31').then(function(trends) {
      result = trends;
    });

    $httpBackend.flush();

    expect(result.length).toBe(0);
  });
});

/*
Coverage Report:
- Functions tested: getTrends, getCategoryBreakdown
- Scenarios covered: successful fetch, category filtering, error handling, empty data
- Uncovered scenarios: network timeout (requires additional setup)
*/