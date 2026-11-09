/*
Test Documentation:
- Test Name: DashboardController Unit Tests
- Purpose: Validate dashboard controller initialization, data loading, and auto-refresh functionality
- Scenario: Test controller initialization, KPI loading, error handling, and auto-refresh lifecycle
- Expected Result: Controller should properly load dashboard data and manage refresh intervals
*/

(function(){
'use strict';

describe('DashboardController', function() {
  var $controller, $scope, $q, KpiAggregationService, DataRefreshService;
  var controller;

  beforeEach(module('creditCardDashboard'));

  beforeEach(inject(function(_$controller_, $rootScope, _$q_) {
    $controller = _$controller_;
    $scope = $rootScope.$new();
    $q = _$q_;

    KpiAggregationService = {
      fetchKPIs: jasmine.createSpy('fetchKPIs').and.returnValue($q.resolve({
        kpis: {
          totalMonthlySpend: 1000,
          totalCreditLimit: 5000,
          totalAvailableCredit: 4000,
          totalOutstandingAmount: 1000
        },
        cards: [{cardId: 1, cardNumber: '1234'}]
      }))
    };

    DataRefreshService = {
      startAutoRefresh: jasmine.createSpy('startAutoRefresh'),
      stopAutoRefresh: jasmine.createSpy('stopAutoRefresh')
    };
  }));

  function createController() {
    return $controller('DashboardController', {
      $scope: $scope,
      KpiAggregationService: KpiAggregationService,
      DataRefreshService: DataRefreshService
    });
  }

  describe('Initialization', function() {
    it('should initialize with default values', function() {
      controller = createController();
      expect(controller.kpis).toEqual({});
      expect(controller.cards).toEqual([]);
      expect(controller.loading).toBe(true);
      expect(controller.lastUpdated).toBeNull();
    });

    it('should load dashboard data on initialization', function() {
      controller = createController();
      $scope.$digest();

      expect(KpiAggregationService.fetchKPIs).toHaveBeenCalled();
      expect(controller.loading).toBe(false);
      expect(controller.kpis.totalMonthlySpend).toBe(1000);
      expect(controller.cards.length).toBe(1);
      expect(controller.lastUpdated).toBeDefined();
    });

    it('should start auto-refresh on initialization', function() {
      controller = createController();
      expect(DataRefreshService.startAutoRefresh).toHaveBeenCalled();
    });
  });

  describe('Error Handling', function() {
    it('should handle error when loading dashboard fails', function() {
      KpiAggregationService.fetchKPIs.and.returnValue($q.reject('Error'));
      spyOn(console, 'error');

      controller = createController();
      $scope.$digest();

      expect(controller.loading).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Failed to load dashboard:', 'Error');
    });
  });

  describe('Auto-refresh', function() {
    it('should update data when auto-refresh callback is triggered', function() {
      controller = createController();
      $scope.$digest();

      var refreshCallback = DataRefreshService.startAutoRefresh.calls.mostRecent().args[0];
      KpiAggregationService.fetchKPIs.calls.reset();

      refreshCallback();
      $scope.$digest();

      expect(KpiAggregationService.fetchKPIs).toHaveBeenCalled();
    });

    it('should stop auto-refresh on scope destroy', function() {
      controller = createController();
      $scope.$destroy();

      expect(DataRefreshService.stopAutoRefresh).toHaveBeenCalled();
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: Controller initialization, loadDashboard, auto-refresh callback, $destroy handler
- Scenarios covered: Successful data load, error handling, auto-refresh lifecycle, scope cleanup
- Edge cases: Service errors, refresh callback execution
- Uncovered scenarios: None - all critical paths covered
*/