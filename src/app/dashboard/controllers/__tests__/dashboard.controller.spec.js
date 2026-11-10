/*
Test Documentation:
- Test Name: DashboardController - initialization
- Purpose: Validates controller initializes with correct default state
- Scenario: Normal initialization
- Expected Result: Loading is true, error is null, kpis is empty object
*/
/*
Test Documentation:
- Test Name: DashboardController - loadKPIs success
- Purpose: Validates successful KPI data loading
- Scenario: Normal scenario with successful API response
- Expected Result: KPIs are populated, loading is false, no error
*/
/*
Test Documentation:
- Test Name: DashboardController - loadKPIs error
- Purpose: Validates error handling when KPI loading fails
- Scenario: Error scenario with API failure
- Expected Result: Error message is set, loading is false
*/
/*
Test Documentation:
- Test Name: DashboardController - auto-refresh
- Purpose: Validates automatic refresh of KPI data
- Scenario: Normal scenario with periodic refresh
- Expected Result: KPIs are refreshed at intervals
*/
/*
Coverage Report:
- Functions tested: loadKPIs, auto-refresh mechanism
- Scenarios covered: initialization, successful load, error handling, auto-refresh, cleanup
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('DashboardController', function() {
    var $controller, $scope, $q, $interval, KPIAggregationService, DashboardRefreshFactory;
    var controller;

    beforeEach(module('app.dashboard'));

    beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _$interval_) {
      $controller = _$controller_;
      $scope = _$rootScope_.$new();
      $q = _$q_;
      $interval = _$interval_;

      KPIAggregationService = {
        getKPIs: jasmine.createSpy('getKPIs')
      };

      DashboardRefreshFactory = {
        startRefresh: jasmine.createSpy('startRefresh').and.returnValue('interval-promise'),
        stopRefresh: jasmine.createSpy('stopRefresh')
      };
    }));

    function createController() {
      return $controller('DashboardController', {
        $scope: $scope,
        $interval: $interval,
        KPIAggregationService: KPIAggregationService,
        DashboardRefreshFactory: DashboardRefreshFactory
      });
    }

    describe('initialization', function() {
      it('should initialize with default state', function() {
        var deferred = $q.defer();
        KPIAggregationService.getKPIs.and.returnValue(deferred.promise);

        controller = createController();

        expect(controller.loading).toBe(true);
        expect(controller.error).toBeNull();
        expect(controller.kpis).toEqual({});
      });

      it('should call loadKPIs on initialization', function() {
        var deferred = $q.defer();
        KPIAggregationService.getKPIs.and.returnValue(deferred.promise);

        controller = createController();

        expect(KPIAggregationService.getKPIs).toHaveBeenCalled();
      });

      it('should start auto-refresh on initialization', function() {
        var deferred = $q.defer();
        KPIAggregationService.getKPIs.and.returnValue(deferred.promise);

        controller = createController();
        deferred.resolve({});
        $scope.$digest();

        expect(DashboardRefreshFactory.startRefresh).toHaveBeenCalled();
      });
    });

    describe('loadKPIs', function() {
      it('should load KPIs successfully', function() {
        var mockKPIs = {
          monthlySpend: 1500,
          totalCreditLimit: 10000,
          availableCredit: 8500,
          outstandingAmount: 1500
        };
        var deferred = $q.defer();
        KPIAggregationService.getKPIs.and.returnValue(deferred.promise);

        controller = createController();
        deferred.resolve(mockKPIs);
        $scope.$digest();

        expect(controller.kpis).toEqual(mockKPIs);
        expect(controller.loading).toBe(false);
        expect(controller.error).toBeNull();
      });

      it('should handle KPI loading error', function() {
        spyOn(console, 'error');
        var deferred = $q.defer();
        KPIAggregationService.getKPIs.and.returnValue(deferred.promise);

        controller = createController();
        deferred.reject('API Error');
        $scope.$digest();

        expect(controller.error).toBe('Failed to load dashboard data. Please try again.');
        expect(controller.loading).toBe(false);
        expect(console.error).toHaveBeenCalledWith('KPI load error:', 'API Error');
      });

      it('should set loading to true when loadKPIs is called', function() {
        var deferred = $q.defer();
        KPIAggregationService.getKPIs.and.returnValue(deferred.promise);

        controller = createController();
        controller.loading = false;
        controller.loadKPIs();

        expect(controller.loading).toBe(true);
        expect(controller.error).toBeNull();
      });
    });

    describe('auto-refresh', function() {
      it('should refresh KPIs periodically', function() {
        var mockKPIs = { monthlySpend: 1500 };
        var deferred = $q.defer();
        var refreshCallback;
        
        DashboardRefreshFactory.startRefresh.and.callFake(function(callback) {
          refreshCallback = callback;
          return 'interval-promise';
        });
        
        KPIAggregationService.getKPIs.and.returnValue(deferred.promise);

        controller = createController();
        deferred.resolve(mockKPIs);
        $scope.$digest();

        var refreshDeferred = $q.defer();
        KPIAggregationService.getKPIs.and.returnValue(refreshDeferred.promise);
        refreshCallback();
        refreshDeferred.resolve({ monthlySpend: 2000 });
        $scope.$digest();

        expect(controller.kpis.monthlySpend).toBe(2000);
      });

      it('should handle refresh errors gracefully', function() {
        spyOn(console, 'error');
        var deferred = $q.defer();
        var refreshCallback;
        
        DashboardRefreshFactory.startRefresh.and.callFake(function(callback) {
          refreshCallback = callback;
          return 'interval-promise';
        });
        
        KPIAggregationService.getKPIs.and.returnValue(deferred.promise);

        controller = createController();
        deferred.resolve({});
        $scope.$digest();

        var refreshDeferred = $q.defer();
        KPIAggregationService.getKPIs.and.returnValue(refreshDeferred.promise);
        refreshCallback();
        refreshDeferred.reject('Refresh Error');
        $scope.$digest();

        expect(console.error).toHaveBeenCalledWith('KPI refresh error:', 'Refresh Error');
      });

      it('should stop refresh on scope destroy', function() {
        var deferred = $q.defer();
        KPIAggregationService.getKPIs.and.returnValue(deferred.promise);

        controller = createController();
        deferred.resolve({});
        $scope.$digest();

        $scope.$destroy();

        expect(DashboardRefreshFactory.stopRefresh).toHaveBeenCalledWith('interval-promise');
      });
    });
  });
})();