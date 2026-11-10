/*
Test Documentation:
- Test Name: DashboardController - initialization
- Purpose: Validates controller initializes and loads KPI data
- Scenario: Controller is instantiated
- Expected Result: Loading state set, KPI data loaded
*/
/*
Test Documentation:
- Test Name: DashboardController - auto-refresh
- Purpose: Validates automatic refresh of KPI data every 60 seconds
- Scenario: Time passes and interval triggers
- Expected Result: KPI data is refreshed automatically
*/
/*
Coverage Report:
- Functions tested: controller initialization, loadKPIs, auto-refresh
- Scenarios covered: successful load, error handling, auto-refresh, cleanup on destroy
- Uncovered scenarios: none
*/

describe('DashboardController', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var $controller, DashboardService, $q, $rootScope, $interval, $scope;
  
  beforeEach(inject(function(_$controller_, _DashboardService_, _$q_, _$rootScope_, _$interval_) {
    $controller = _$controller_;
    DashboardService = _DashboardService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $interval = _$interval_;
    $scope = $rootScope.$new();
  }));
  
  describe('initialization', function() {
    it('should initialize with loading state', function() {
      var mockKPIs = {
        monthlySpend: 1500,
        totalCreditLimit: 5000,
        totalAvailableCredit: 3000,
        totalOutstanding: 2000,
        cards: []
      };
      
      spyOn(DashboardService, 'getKPIs').and.returnValue($q.resolve(mockKPIs));
      
      var vm = $controller('DashboardController', {
        DashboardService: DashboardService,
        $scope: $scope,
        $interval: $interval
      });
      
      expect(vm.loading).toBe(true);
      expect(vm.kpis).toBe(null);
      expect(vm.error).toBe(null);
      
      $rootScope.$digest();
      
      expect(vm.loading).toBe(false);
      expect(vm.kpis).toEqual(mockKPIs);
    });
    
    it('should handle error during initialization', function() {
      spyOn(DashboardService, 'getKPIs').and.returnValue($q.reject('Service Error'));
      
      var vm = $controller('DashboardController', {
        DashboardService: DashboardService,
        $scope: $scope,
        $interval: $interval
      });
      
      $rootScope.$digest();
      
      expect(vm.loading).toBe(false);
      expect(vm.error).toBe('Failed to load dashboard data');
      expect(vm.kpis).toBe(null);
    });
  });
  
  describe('auto-refresh', function() {
    it('should refresh KPIs every 60 seconds', function() {
      var mockKPIs = { monthlySpend: 1500, totalCreditLimit: 5000 };
      
      spyOn(DashboardService, 'getKPIs').and.returnValue($q.resolve(mockKPIs));
      
      var vm = $controller('DashboardController', {
        DashboardService: DashboardService,
        $scope: $scope,
        $interval: $interval
      });
      
      $rootScope.$digest();
      expect(DashboardService.getKPIs.calls.count()).toBe(1);
      
      $interval.flush(60000);
      $rootScope.$digest();
      
      expect(DashboardService.getKPIs.calls.count()).toBe(2);
    });
    
    it('should cancel interval on scope destroy', function() {
      var mockKPIs = { monthlySpend: 1500 };
      spyOn(DashboardService, 'getKPIs').and.returnValue($q.resolve(mockKPIs));
      
      var vm = $controller('DashboardController', {
        DashboardService: DashboardService,
        $scope: $scope,
        $interval: $interval
      });
      
      $rootScope.$digest();
      
      spyOn($interval, 'cancel');
      $scope.$destroy();
      
      expect($interval.cancel).toHaveBeenCalled();
    });
  });
});