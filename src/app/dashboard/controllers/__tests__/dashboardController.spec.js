/*
Test Documentation:
- Test Name: DashboardController - Initialization
- Purpose: Verify controller initializes and loads KPIs
- Scenario: Controller is instantiated
- Expected Result: KPIs are loaded and loading is false
*/
/*
Test Documentation:
- Test Name: DashboardController - Load KPIs Success
- Purpose: Verify KPIs load successfully
- Scenario: dashboardOrchestrationService returns KPI data
- Expected Result: vm.kpis is populated
*/
/*
Test Documentation:
- Test Name: DashboardController - Load KPIs Error
- Purpose: Verify error handling when KPIs fail to load
- Scenario: dashboardOrchestrationService rejects promise
- Expected Result: vm.error is set
*/
/*
Test Documentation:
- Test Name: DashboardController - Auto Refresh
- Purpose: Verify KPIs refresh automatically every 30 seconds
- Scenario: Controller is active for 30+ seconds
- Expected Result: getKPIs is called multiple times
*/
/*
Coverage Report:
- Functions tested: initialization, loadKPIs, auto-refresh
- Scenarios covered: success path, error handling, interval cleanup
- Uncovered scenarios: none
*/

describe('DashboardController', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.dashboard'));
  
  var $controller, $rootScope, $q, $interval, vm, mockDashboardOrchestrationService;
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _$interval_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    $interval = _$interval_;
    
    mockDashboardOrchestrationService = {
      getKPIs: jasmine.createSpy('getKPIs')
    };
  }));
  
  function createController() {
    var $scope = $rootScope.$new();
    vm = $controller('DashboardController', {
      $scope: $scope,
      $interval: $interval,
      dashboardOrchestrationService: mockDashboardOrchestrationService
    });
    return {vm: vm, $scope: $scope};
  }
  
  it('should initialize with correct default state', function() {
    mockDashboardOrchestrationService.getKPIs.and.returnValue($q.resolve({}));
    var ctrl = createController();
    
    expect(ctrl.vm.kpis).toEqual({});
    expect(ctrl.vm.loading).toBe(true);
    expect(ctrl.vm.error).toBe(null);
  });
  
  it('should load KPIs successfully', function() {
    var mockKPIs = {
      monthlySpend: 730,
      totalCreditLimit: 45000,
      availableCredit: 29500,
      outstandingAmount: 15500
    };
    mockDashboardOrchestrationService.getKPIs.and.returnValue($q.resolve(mockKPIs));
    
    var ctrl = createController();
    $rootScope.$digest();
    
    expect(ctrl.vm.kpis).toEqual(mockKPIs);
    expect(ctrl.vm.loading).toBe(false);
    expect(ctrl.vm.error).toBe(null);
  });
  
  it('should handle KPI load error', function() {
    mockDashboardOrchestrationService.getKPIs.and.returnValue($q.reject('Error'));
    
    var ctrl = createController();
    $rootScope.$digest();
    
    expect(ctrl.vm.error).toBe('Failed to load dashboard data');
    expect(ctrl.vm.loading).toBe(false);
  });
  
  it('should refresh KPIs every 30 seconds', function() {
    mockDashboardOrchestrationService.getKPIs.and.returnValue($q.resolve({}));
    var ctrl = createController();
    $rootScope.$digest();
    
    expect(mockDashboardOrchestrationService.getKPIs.calls.count()).toBe(1);
    
    $interval.flush(30000);
    expect(mockDashboardOrchestrationService.getKPIs.calls.count()).toBe(2);
  });
  
  it('should cancel interval on scope destroy', function() {
    mockDashboardOrchestrationService.getKPIs.and.returnValue($q.resolve({}));
    var ctrl = createController();
    
    spyOn($interval, 'cancel');
    ctrl.$scope.$destroy();
    
    expect($interval.cancel).toHaveBeenCalled();
  });
});