/*
Test Documentation:
- Test Name: DashboardController
- Purpose: Verify dashboard controller initialization and KPI loading
- Scenario: Controller loads dashboard data and manages auto-refresh
- Expected Result: Controller should display KPIs and handle errors
*/

describe('DashboardController', function() {
  'use strict';

  var $controller;
  var $scope;
  var $q;
  var DashboardService;
  var RefreshService;
  var controller;

  beforeEach(module('dashboardModule'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
    $q = _$q_;

    DashboardService = {
      getKpis: jasmine.createSpy('getKpis').and.returnValue($q.resolve({}))
    };

    RefreshService = {
      startAutoRefresh: jasmine.createSpy('startAutoRefresh'),
      stopAutoRefresh: jasmine.createSpy('stopAutoRefresh')
    };

    controller = $controller('DashboardController', {
      $scope: $scope,
      DashboardService: DashboardService,
      RefreshService: RefreshService
    });
  }));

  /*
  Test Documentation:
  - Test Name: should be defined
  - Purpose: Verify controller exists
  - Scenario: Create controller instance
  - Expected Result: Controller should be defined
  */
  it('should be defined', function() {
    expect(controller).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should initialize with default values
  - Purpose: Verify initial state
  - Scenario: Check controller properties after creation
  - Expected Result: dashboardData null, loading true, error null
  */
  it('should initialize with default values', function() {
    expect(controller.dashboardData).toBeNull();
    expect(controller.loading).toBe(true);
    expect(controller.error).toBeNull();
  });

  /*
  Test Documentation:
  - Test Name: should call init on controller creation
  - Purpose: Verify init is called automatically
  - Scenario: Controller creation triggers init
  - Expected Result: DashboardService.getKpis should be called
  */
  it('should call init on controller creation', function() {
    expect(DashboardService.getKpis).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: should start auto refresh on init
  - Purpose: Verify auto-refresh is started
  - Scenario: Controller initialization
  - Expected Result: RefreshService.startAutoRefresh should be called
  */
  it('should start auto refresh on init', function() {
    expect(RefreshService.startAutoRefresh).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: should load KPIs successfully
  - Purpose: Verify successful KPI loading
  - Scenario: DashboardService returns data
  - Expected Result: dashboardData populated, loading false
  */
  it('should load KPIs successfully', function() {
    var mockData = {
      monthlySpend: { label: 'Monthly Spend', value: 1000 },
      totalCreditLimit: { label: 'Total Credit Limit', value: 10000 }
    };

    DashboardService.getKpis.and.returnValue($q.resolve(mockData));
    
    controller.loadKpis();
    $scope.$digest();

    expect(controller.dashboardData).toEqual(mockData);
    expect(controller.loading).toBe(false);
    expect(controller.error).toBeNull();
  });

  /*
  Test Documentation:
  - Test Name: should handle KPI loading error
  - Purpose: Verify error handling
  - Scenario: DashboardService returns error
  - Expected Result: error message set, loading false
  */
  it('should handle KPI loading error', function() {
    DashboardService.getKpis.and.returnValue($q.reject('API Error'));
    
    controller.loadKpis();
    $scope.$digest();

    expect(controller.error).toBe('Failed to load dashboard data. Please try again.');
    expect(controller.loading).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: should stop auto refresh on scope destroy
  - Purpose: Verify cleanup on controller destruction
  - Scenario: Broadcast $destroy event
  - Expected Result: RefreshService.stopAutoRefresh should be called
  */
  it('should stop auto refresh on scope destroy', function() {
    $scope.$broadcast('$destroy');
    expect(RefreshService.stopAutoRefresh).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: should set loading to true when loading KPIs
  - Purpose: Verify loading state management
  - Scenario: Call loadKpis
  - Expected Result: loading should be true before promise resolves
  */
  it('should set loading to true when loading KPIs', function() {
    controller.loading = false;
    controller.loadKpis();
    expect(controller.loading).toBe(true);
  });
});

/*
Coverage Report:
- Functions tested: init, loadKpis
- Scenarios covered: initialization, successful load, error handling, auto-refresh management, cleanup
- Uncovered scenarios: none
*/