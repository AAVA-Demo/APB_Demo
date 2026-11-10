/*
Test Documentation:
- Test Name: RefreshService Test Suite
- Purpose: Validate auto-refresh mechanism for KPI data with configurable intervals
- Scenario: Tests cover starting auto-refresh, stopping refresh, interval execution, and cleanup
- Expected Result: Service correctly schedules and cancels periodic KPI refresh operations
*/

(function() {
  'use strict';

  describe('RefreshService', function() {
    var RefreshService, $interval, KPIService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_RefreshService_, _$interval_, _KPIService_, _$q_, _$rootScope_) {
      RefreshService = _RefreshService_;
      $interval = _$interval_;
      KPIService = _KPIService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('startAutoRefresh', function() {
      it('should start auto-refresh with default interval', function() {
        var userId = 'user-123';
        var callback = jasmine.createSpy('callback');
        var mockKPIs = { userId: userId, monthlySpend: 1000 };

        spyOn(KPIService, 'getDashboardKPIs').and.returnValue($q.resolve(mockKPIs));

        RefreshService.startAutoRefresh(userId, callback);

        expect(KPIService.getDashboardKPIs).not.toHaveBeenCalled();

        $interval.flush(600000);

        expect(KPIService.getDashboardKPIs).toHaveBeenCalledWith(userId);
        $rootScope.$apply();
        expect(callback).toHaveBeenCalledWith(mockKPIs);
      });

      it('should start auto-refresh with custom interval', function() {
        var userId = 'user-456';
        var callback = jasmine.createSpy('callback');
        var customInterval = 300000;
        var mockKPIs = { userId: userId, monthlySpend: 2000 };

        spyOn(KPIService, 'getDashboardKPIs').and.returnValue($q.resolve(mockKPIs));

        RefreshService.startAutoRefresh(userId, callback, customInterval);

        $interval.flush(customInterval);

        expect(KPIService.getDashboardKPIs).toHaveBeenCalledWith(userId);
        $rootScope.$apply();
        expect(callback).toHaveBeenCalledWith(mockKPIs);
      });

      it('should stop existing refresh before starting new one', function() {
        var userId = 'user-789';
        var callback1 = jasmine.createSpy('callback1');
        var callback2 = jasmine.createSpy('callback2');
        var mockKPIs = { userId: userId, monthlySpend: 3000 };

        spyOn(KPIService, 'getDashboardKPIs').and.returnValue($q.resolve(mockKPIs));
        spyOn(RefreshService, 'stopAutoRefresh').and.callThrough();

        RefreshService.startAutoRefresh(userId, callback1);
        RefreshService.startAutoRefresh(userId, callback2);

        expect(RefreshService.stopAutoRefresh).toHaveBeenCalled();
      });

      it('should execute callback on each interval', function() {
        var userId = 'user-999';
        var callback = jasmine.createSpy('callback');
        var mockKPIs = { userId: userId, monthlySpend: 4000 };

        spyOn(KPIService, 'getDashboardKPIs').and.returnValue($q.resolve(mockKPIs));

        RefreshService.startAutoRefresh(userId, callback, 100000);

        $interval.flush(100000);
        $rootScope.$apply();
        expect(callback).toHaveBeenCalledTimes(1);

        $interval.flush(100000);
        $rootScope.$apply();
        expect(callback).toHaveBeenCalledTimes(2);

        $interval.flush(100000);
        $rootScope.$apply();
        expect(callback).toHaveBeenCalledTimes(3);
      });
    });

    describe('stopAutoRefresh', function() {
      it('should stop active auto-refresh', function() {
        var userId = 'user-111';
        var callback = jasmine.createSpy('callback');
        var mockKPIs = { userId: userId, monthlySpend: 5000 };

        spyOn(KPIService, 'getDashboardKPIs').and.returnValue($q.resolve(mockKPIs));

        RefreshService.startAutoRefresh(userId, callback, 100000);
        RefreshService.stopAutoRefresh();

        $interval.flush(100000);
        $rootScope.$apply();

        expect(callback).not.toHaveBeenCalled();
      });

      it('should handle stop when no refresh is active', function() {
        expect(function() {
          RefreshService.stopAutoRefresh();
        }).not.toThrow();
      });

      it('should allow restart after stop', function() {
        var userId = 'user-222';
        var callback = jasmine.createSpy('callback');
        var mockKPIs = { userId: userId, monthlySpend: 6000 };

        spyOn(KPIService, 'getDashboardKPIs').and.returnValue($q.resolve(mockKPIs));

        RefreshService.startAutoRefresh(userId, callback, 100000);
        RefreshService.stopAutoRefresh();
        RefreshService.startAutoRefresh(userId, callback, 100000);

        $interval.flush(100000);
        $rootScope.$apply();

        expect(callback).toHaveBeenCalledTimes(1);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: startAutoRefresh, stopAutoRefresh
- Scenarios covered:
  * Starting auto-refresh with default and custom intervals
  * Stopping existing refresh before starting new one
  * Callback execution on each interval
  * Stopping active refresh
  * Handling stop when no refresh is active
  * Restart after stop
- Uncovered scenarios: Error handling during KPI fetch, memory leak prevention
*/