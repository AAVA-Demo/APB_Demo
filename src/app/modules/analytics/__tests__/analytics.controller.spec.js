/*
Test Documentation:
- Test Name: AnalyticsController - initialization
- Purpose: Validates controller initializes and loads analytics
- Scenario: Controller instantiated
- Expected Result: loadAnalytics called, loading true, default dateRange set
*/
/*
Test Documentation:
- Test Name: AnalyticsController - successful analytics load
- Purpose: Validates analytics data loaded successfully
- Scenario: analyticsService returns valid data
- Expected Result: vm.analytics populated, loading false, analyticsDataLoaded event broadcast
*/
/*
Test Documentation:
- Test Name: AnalyticsController - analytics load failure
- Purpose: Validates error handling when analytics load fails
- Scenario: analyticsService rejects promise
- Expected Result: vm.error set, loading false
*/
/*
Test Documentation:
- Test Name: AnalyticsController - date range change
- Purpose: Validates analytics reload on date range change
- Scenario: User changes date range
- Expected Result: loadAnalytics called with new date range
*/
/*
Test Documentation:
- Test Name: AnalyticsController - auto-refresh interval
- Purpose: Validates analytics refresh every 5 minutes
- Scenario: Controller initialized with interval
- Expected Result: loadAnalytics called periodically
*/
/*
Test Documentation:
- Test Name: AnalyticsController - interval cleanup on destroy
- Purpose: Validates interval cancelled on scope destroy
- Scenario: $destroy event fired
- Expected Result: Interval cancelled, no memory leak
*/
/*
Coverage Report:
- Functions tested: loadAnalytics, changeDateRange, initialization, auto-refresh, cleanup
- Scenarios covered: successful load, failed load, date range change, auto-refresh, interval cleanup
- Edge cases: service rejection, scope destruction, event broadcasting
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AnalyticsController', function() {
    var controller, analyticsService, authService, $scope, $interval, $q;
    var mockAnalyticsData = {
      userId: 'user123',
      period: '12months',
      categoryBreakdown: [
        { category: 'Food & Dining', amount: 1200.50 },
        { category: 'Fuel', amount: 450.00 },
        { category: 'Shopping', amount: 800.75 }
      ],
      monthlyTrends: [
        { month: 'Jan 2024', totalSpend: 2500.00 },
        { month: 'Feb 2024', totalSpend: 2800.00 },
        { month: 'Mar 2024', totalSpend: 2300.00 }
      ],
      totalTransactions: 156
    };

    beforeEach(module('analyticsModule'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function($controller, _$q_, _$interval_, $rootScope) {
      $q = _$q_;
      $interval = _$interval_;
      $scope = $rootScope.$new();

      analyticsService = {
        getSpendingData: jasmine.createSpy('getSpendingData').and.returnValue($q.resolve(mockAnalyticsData))
      };

      authService = {
        getUserId: jasmine.createSpy('getUserId').and.returnValue('user123')
      };

      controller = $controller('AnalyticsController', {
        analyticsService: analyticsService,
        authService: authService,
        $scope: $scope,
        $interval: $interval
      });
    }));

    describe('initialization', function() {
      it('should initialize with loading state true', function() {
        expect(controller.loading).toBe(true);
      });

      it('should initialize analytics as null', function() {
        expect(controller.analytics).toBeNull();
      });

      it('should initialize error as null', function() {
        expect(controller.error).toBeNull();
      });

      it('should initialize dateRange as 12months', function() {
        expect(controller.dateRange).toBe('12months');
      });

      it('should call loadAnalytics on initialization', function() {
        expect(authService.getUserId).toHaveBeenCalled();
        expect(analyticsService.getSpendingData).toHaveBeenCalledWith('user123', '12months');
      });
    });

    describe('loadAnalytics', function() {
      it('should load analytics successfully', function() {
        spyOn($scope, '$broadcast');

        controller.loadAnalytics();
        $scope.$digest();

        expect(controller.analytics).toEqual(mockAnalyticsData);
        expect(controller.loading).toBe(false);
        expect(controller.error).toBeNull();
        expect($scope.$broadcast).toHaveBeenCalledWith('analyticsDataLoaded', mockAnalyticsData);
      });

      it('should handle analytics load failure', function() {
        analyticsService.getSpendingData.and.returnValue($q.reject({ error: 'Server error' }));

        controller.loadAnalytics();
        $scope.$digest();

        expect(controller.error).toBe('Failed to load analytics data');
        expect(controller.loading).toBe(false);
        expect(controller.analytics).toBeNull();
      });

      it('should get userId from authService', function() {
        controller.loadAnalytics();

        expect(authService.getUserId).toHaveBeenCalled();
        expect(analyticsService.getSpendingData).toHaveBeenCalledWith('user123', controller.dateRange);
      });

      it('should reset error on successful reload', function() {
        controller.error = 'Previous error';

        controller.loadAnalytics();
        $scope.$digest();

        expect(controller.error).toBeNull();
      });

      it('should broadcast analyticsDataLoaded event', function() {
        spyOn($scope, '$broadcast');

        controller.loadAnalytics();
        $scope.$digest();

        expect($scope.$broadcast).toHaveBeenCalledWith('analyticsDataLoaded', mockAnalyticsData);
      });
    });

    describe('changeDateRange', function() {
      it('should update dateRange and reload analytics', function() {
        controller.changeDateRange('6months');

        expect(controller.dateRange).toBe('6months');
        expect(analyticsService.getSpendingData).toHaveBeenCalledWith('user123', '6months');
      });

      it('should handle 3months date range', function() {
        controller.changeDateRange('3months');
        $scope.$digest();

        expect(controller.dateRange).toBe('3months');
        expect(analyticsService.getSpendingData).toHaveBeenCalledWith('user123', '3months');
      });

      it('should handle 12months date range', function() {
        controller.changeDateRange('12months');
        $scope.$digest();

        expect(controller.dateRange).toBe('12months');
        expect(analyticsService.getSpendingData).toHaveBeenCalledWith('user123', '12months');
      });

      it('should reload analytics with new date range', function() {
        var initialCallCount = analyticsService.getSpendingData.calls.count();

        controller.changeDateRange('3months');

        expect(analyticsService.getSpendingData.calls.count()).toBe(initialCallCount + 1);
      });
    });

    describe('auto-refresh', function() {
      it('should set up interval to refresh analytics every 5 minutes', function() {
        spyOn(controller, 'loadAnalytics');
        var initialCallCount = controller.loadAnalytics.calls.count();

        $interval.flush(300000);

        expect(controller.loadAnalytics.calls.count()).toBe(initialCallCount + 1);
      });

      it('should continue refreshing at regular intervals', function() {
        spyOn(controller, 'loadAnalytics');
        var initialCallCount = controller.loadAnalytics.calls.count();

        $interval.flush(300000);
        $interval.flush(300000);

        expect(controller.loadAnalytics.calls.count()).toBe(initialCallCount + 2);
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