/*
Test Documentation:
- Test Name: DashboardController - Initialization
- Purpose: Verify controller initializes with correct default state
- Scenario: Controller is instantiated
- Expected Result: All properties are initialized correctly
*/
/*
Test Documentation:
- Test Name: DashboardController - loadKPIs success
- Purpose: Verify KPIs are loaded successfully from service
- Scenario: DashboardService returns valid data
- Expected Result: vm.kpis is populated, loading is false, error is null
*/
/*
Test Documentation:
- Test Name: DashboardController - loadKPIs error
- Purpose: Verify error handling when service fails
- Scenario: DashboardService rejects promise
- Expected Result: vm.error is set, loading is false
*/
/*
Test Documentation:
- Test Name: DashboardController - RefreshService integration
- Purpose: Verify refresh service starts on initialization and stops on destroy
- Scenario: Controller lifecycle events
- Expected Result: RefreshService.start called on init, stop called on $destroy
*/
/*
Coverage Report:
- Functions tested: loadKPIs, initialization, $destroy handler
- Scenarios covered: success path, error handling, service integration, lifecycle management
- Uncovered scenarios: none
*/

describe('DashboardController', function() {
  'use strict';

  var $controller, $rootScope, $q, DashboardService, RefreshService, controller, scope;

  beforeEach(module('app.dashboard'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _DashboardService_, _RefreshService_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    DashboardService = _DashboardService_;
    RefreshService = _RefreshService_;
    scope = $rootScope.$new();

    spyOn(DashboardService, 'getKPIs').and.returnValue($q.resolve({
      userId: 'user123',
      month: '2026-11',
      monthlySpend: 5000,
      totalCreditLimit: 50000,
      availableCredit: 40000,
      outstandingAmount: 10000,
      overallUtilization: '20.00',
      cardCount: 3,
      lastUpdated: '2026-11-10T22:32:20.000Z'
    }));

    spyOn(RefreshService, 'start');
    spyOn(RefreshService, 'stop');
  }));

  it('should initialize with correct default values', function() {
    controller = $controller('DashboardController', {
      DashboardService: DashboardService,
      RefreshService: RefreshService,
      $scope: scope
    });

    expect(controller.kpis).toBeNull();
    expect(controller.loading).toBe(true);
    expect(controller.error).toBeNull();
    expect(controller.userId).toBe('user123');
  });

  it('should load KPIs successfully on initialization', function() {
    controller = $controller('DashboardController', {
      DashboardService: DashboardService,
      RefreshService: RefreshService,
      $scope: scope
    });

    $rootScope.$digest();

    expect(DashboardService.getKPIs).toHaveBeenCalledWith('user123');
    expect(controller.kpis).toBeDefined();
    expect(controller.kpis.monthlySpend).toBe(5000);
    expect(controller.kpis.totalCreditLimit).toBe(50000);
    expect(controller.loading).toBe(false);
    expect(controller.error).toBeNull();
  });

  it('should handle error when loading KPIs fails', function() {
    DashboardService.getKPIs.and.returnValue($q.reject('Service error'));

    controller = $controller('DashboardController', {
      DashboardService: DashboardService,
      RefreshService: RefreshService,
      $scope: scope
    });

    $rootScope.$digest();

    expect(controller.error).toBe('Failed to load dashboard data');
    expect(controller.loading).toBe(false);
    expect(controller.kpis).toBeNull();
  });

  it('should call loadKPIs when manually invoked', function() {
    controller = $controller('DashboardController', {
      DashboardService: DashboardService,
      RefreshService: RefreshService,
      $scope: scope
    });

    $rootScope.$digest();
    DashboardService.getKPIs.calls.reset();

    controller.loadKPIs();
    $rootScope.$digest();

    expect(DashboardService.getKPIs).toHaveBeenCalledWith('user123');
  });

  it('should start RefreshService on initialization', function() {
    controller = $controller('DashboardController', {
      DashboardService: DashboardService,
      RefreshService: RefreshService,
      $scope: scope
    });

    expect(RefreshService.start).toHaveBeenCalled();
  });

  it('should stop RefreshService on $destroy', function() {
    controller = $controller('DashboardController', {
      DashboardService: DashboardService,
      RefreshService: RefreshService,
      $scope: scope
    });

    scope.$destroy();

    expect(RefreshService.stop).toHaveBeenCalled();
  });

  it('should reset loading and error state before loading KPIs', function() {
    controller = $controller('DashboardController', {
      DashboardService: DashboardService,
      RefreshService: RefreshService,
      $scope: scope
    });

    controller.error = 'Previous error';
    controller.loading = false;

    controller.loadKPIs();

    expect(controller.loading).toBe(true);
    expect(controller.error).toBeNull();
  });
});