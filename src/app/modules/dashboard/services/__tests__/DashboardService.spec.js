/*
Test Documentation:
- Test Name: DashboardService
- Purpose: Verify dashboard data fetching and KPI aggregation
- Scenario: Fetch KPIs from API and transform to KPI models
- Expected Result: Service should return properly formatted dashboard data
*/

describe('DashboardService', function() {
  'use strict';

  var DashboardService;
  var $httpBackend;
  var API_CONFIG;
  var KpiFactory;
  var $q;
  var $rootScope;

  beforeEach(module('dashboardModule'));
  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_DashboardService_, _$httpBackend_, _API_CONFIG_, _KpiFactory_, _$q_, _$rootScope_) {
    DashboardService = _DashboardService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    KpiFactory = _KpiFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  /*
  Test Documentation:
  - Test Name: should be defined
  - Purpose: Verify service exists
  - Scenario: Inject DashboardService
  - Expected Result: Service should be defined
  */
  it('should be defined', function() {
    expect(DashboardService).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should fetch KPIs successfully
  - Purpose: Verify successful API call and data transformation
  - Scenario: Call getKpis with valid response
  - Expected Result: Should return dashboard data with all KPIs
  */
  it('should fetch KPIs successfully', function() {
    var mockResponse = {
      monthlySpend: 2500.00,
      monthlySpendTrend: 'up',
      monthlySpendTrendPct: 5.5,
      totalCreditLimit: 50000.00,
      availableCredit: 35000.00,
      availableCreditTrend: 'down',
      availableCreditTrendPct: 2.3,
      outstandingAmount: 15000.00,
      outstandingTrend: 'up',
      outstandingTrendPct: 3.1
    };

    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard)
      .respond(200, mockResponse);

    var result;
    DashboardService.getKpis().then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result).toBeDefined();
    expect(result.monthlySpend).toBeDefined();
    expect(result.monthlySpend.label).toBe('Monthly Spend');
    expect(result.monthlySpend.value).toBe(2500.00);
    expect(result.totalCreditLimit).toBeDefined();
    expect(result.availableCredit).toBeDefined();
    expect(result.outstandingAmount).toBeDefined();
    expect(result.lastUpdated).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should handle API error
  - Purpose: Verify error handling for failed API calls
  - Scenario: API returns error response
  - Expected Result: Promise should be rejected with error
  */
  it('should handle API error', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard)
      .respond(500, 'Server Error');

    var error;
    DashboardService.getKpis().catch(function(err) {
      error = err;
    });

    $httpBackend.flush();

    expect(error).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should create KPI models with correct icons
  - Purpose: Verify KPI icons are assigned correctly
  - Scenario: Fetch KPIs and check icon properties
  - Expected Result: Each KPI should have appropriate icon
  */
  it('should create KPI models with correct icons', function() {
    var mockResponse = {
      monthlySpend: 1000,
      totalCreditLimit: 10000,
      availableCredit: 5000,
      outstandingAmount: 5000
    };

    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.dashboard)
      .respond(200, mockResponse);

    var result;
    DashboardService.getKpis().then(function(data) {
      result = data;
    });

    $httpBackend.flush();

    expect(result.monthlySpend.icon).toBe('glyphicon-credit-card');
    expect(result.totalCreditLimit.icon).toBe('glyphicon-stats');
    expect(result.availableCredit.icon).toBe('glyphicon-ok-circle');
    expect(result.outstandingAmount.icon).toBe('glyphicon-exclamation-sign');
  });

  /*
  Test Documentation:
  - Test Name: should call refreshKpis
  - Purpose: Verify refresh method calls getKpis
  - Scenario: Call refreshKpis
  - Expected Result: Should return promise from getKpis
  */
  it('should call refreshKpis', function() {
    spyOn(DashboardService, 'getKpis').and.returnValue($q.resolve({}));
    
    DashboardService.refreshKpis();
    
    expect(DashboardService.getKpis).toHaveBeenCalled();
  });
});

/*
Coverage Report:
- Functions tested: getKpis, refreshKpis
- Scenarios covered: successful fetch, error handling, KPI model creation, icon assignment
- Uncovered scenarios: network timeout (requires additional setup)
*/