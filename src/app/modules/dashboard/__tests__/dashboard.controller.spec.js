/*
Test Documentation:
- Test Name: DashboardController - initialization
- Purpose: Validates controller initializes and loads KPIs
- Scenario: Controller is instantiated
- Expected Result: loadKPIs is called, loading state is true
*/
/*
Test Documentation:
- Test Name: DashboardController - successful KPI load
- Purpose: Validates KPIs are loaded successfully
- Scenario: dashboardService returns valid KPI data
- Expected Result: vm.kpis populated, loading false, error null
*/
/*
Test Documentation:
- Test Name: DashboardController - KPI load failure
- Purpose: Validates error handling when KPI load fails
- Scenario: dashboardService rejects promise
- Expected Result: vm.error set, loading false
*/
/*
Test Documentation:
- Test Name: DashboardController - auto-refresh interval
- Purpose: Validates KPIs refresh every 60 seconds
- Scenario: Controller initialized with interval
- Expected Result: loadKPIs called periodically
*/
/*
Test Documentation:
- Test Name: DashboardController - interval cleanup on destroy
- Purpose: Validates interval is cancelled on scope destroy
- Scenario: $destroy event fired
- Expected Result: Interval cancelled, no memory leak
*/
/*
Coverage Report:
- Functions tested: loadKPIs, initialization, auto-refresh, cleanup
- Scenarios covered: successful load, failed load, auto-refresh, interval cleanup
- Edge cases: service rejection, scope destruction
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('DashboardController', function() {
    var controller, dashboardService, authService, $scope, $interval, $q;
    var mockKPIData = {
      monthlySpend: 1500.50,
      totalCreditLimit: 10000.00,
      availableCredit: 7500.00,
      outstandingAmount: 2500.00,
      lastUpdated: new Date()
    };

    beforeEach(module('dashboardModule'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function($controller, _$q_, _$interval_, $rootScope) {
      $q = _$q_;
      $interval = _$interval_;
      $scope = $rootScope.$new();

      dashboardService = {
        getKPIs: jasmine.createSpy('getKPIs').and.returnValue($q.resolve(mockKPIData))
      };

      authService = {
        getUserId: jasmine.createSpy('getUserId').and.returnValue('user123')
      };

      controller = $controller('DashboardController', {
        dashboardService: dashboardService,
        authService: authService,
        $scope: $scope,
        $interval: $interval
      });
    }));

    describe('initialization', function() {
      it('should initialize with loading state true', function() {
        expect(controller.loading).toBe(true);
      });

      it('should initialize kpis as null', function() {
        expect(controller.kpis).toBeNull();
      });

      it('should initialize error as null', function() {
        expect(controller.error).toBeNull();
      });

      it('should call loadKPIs on initialization', function() {
        expect(authService.getUserId).toHaveBeenCalled();
        expect(dashboardService.getKPIs).toHaveBeenCalledWith('user123');
      });
    });

    describe('loadKPIs', function() {
      it('should load KPIs successfully', function() {
        controller.loadKPIs();
        $scope.$digest();

        expect(controller.kpis).toEqual(mockKPIData);
        expect(controller.loading).toBe(false);
        expect(controller.error).toBeNull();
      });

      it('should handle KPI load failure', function() {
        dashboardService.getKPIs.and.returnValue($q.reject({ error: 'Server error' }));

        controller.loadKPIs();
        $scope.$digest();

        expect(controller.error).toBe('Failed to load dashboard data');
        expect(controller.loading).toBe(false);
        expect(controller.kpis).toBeNull();
      });

      it('should get userId from authService', function() {
        controller.loadKPIs();

        expect(authService.getUserId).toHaveBeenCalled();
        expect(dashboardService.getKPIs).toHaveBeenCalledWith('user123');
      });

      it('should reset error on successful reload', function() {
        controller.error = 'Previous error';

        controller.loadKPIs();
        $scope.$digest();

        expect(controller.error).toBeNull();
      });
    });

    describe('auto-refresh', function() {
      it('should set up interval to refresh KPIs every 60 seconds', function() {
        spyOn(controller, 'loadKPIs');
        var initialCallCount = controller.loadKPIs.calls.count();

        $interval.flush(60000);

        expect(controller.loadKPIs.calls.count()).toBe(initialCallCount + 1);
      });

      it('should continue refreshing at regular intervals', function() {
        spyOn(controller, 'loadKPIs');
        var initialCallCount = controller.loadKPIs.calls.count();

        $interval.flush(60000);
        $interval.flush(60000);
        $interval.flush(60000);

        expect(controller.loadKPIs.calls.count()).toBe(initialCallCount + 3);
      });
    });

    describe('cleanup', function() {
      it('should cancel interval on scope destroy', function() {
        spyOn($interval, 'cancel');

        $scope.$destroy();

        expect($interval.cancel).toHaveBeenCalled();
      });

      it('should not throw error if interval already cancelled', function() {
        $scope.$destroy();

        expect(function() {
          $scope.$destroy();
        }).not.toThrow();
      });
    });
  });
})();