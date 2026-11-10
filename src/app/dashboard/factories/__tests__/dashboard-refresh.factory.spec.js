/*
Test Documentation:
- Test Name: DashboardRefreshFactory - startRefresh
- Purpose: Validates that refresh interval is started with correct interval
- Scenario: Normal scenario starting auto-refresh
- Expected Result: Interval is created and callback is executed periodically
*/
/*
Test Documentation:
- Test Name: DashboardRefreshFactory - stopRefresh
- Purpose: Validates that refresh interval is properly cancelled
- Scenario: Normal scenario stopping auto-refresh
- Expected Result: Interval is cancelled
*/
/*
Coverage Report:
- Functions tested: startRefresh, stopRefresh
- Scenarios covered: start refresh, stop refresh, null interval handling
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('DashboardRefreshFactory', function() {
    var DashboardRefreshFactory, $interval;

    beforeEach(module('app.dashboard'));

    beforeEach(inject(function(_DashboardRefreshFactory_, _$interval_) {
      DashboardRefreshFactory = _DashboardRefreshFactory_;
      $interval = _$interval_;
    }));

    describe('startRefresh', function() {
      it('should start interval with callback', function() {
        var callback = jasmine.createSpy('callback');
        var intervalPromise = DashboardRefreshFactory.startRefresh(callback);

        expect(intervalPromise).toBeDefined();
        
        $interval.flush(30000);
        expect(callback).toHaveBeenCalled();
      });

      it('should call callback multiple times', function() {
        var callback = jasmine.createSpy('callback');
        DashboardRefreshFactory.startRefresh(callback);

        $interval.flush(30000);
        expect(callback).toHaveBeenCalledTimes(1);

        $interval.flush(30000);
        expect(callback).toHaveBeenCalledTimes(2);
      });

      it('should use 30 second interval', function() {
        var callback = jasmine.createSpy('callback');
        DashboardRefreshFactory.startRefresh(callback);

        $interval.flush(29999);
        expect(callback).not.toHaveBeenCalled();

        $interval.flush(1);
        expect(callback).toHaveBeenCalled();
      });
    });

    describe('stopRefresh', function() {
      it('should cancel interval', function() {
        var callback = jasmine.createSpy('callback');
        var intervalPromise = DashboardRefreshFactory.startRefresh(callback);

        DashboardRefreshFactory.stopRefresh(intervalPromise);

        $interval.flush(30000);
        expect(callback).not.toHaveBeenCalled();
      });

      it('should handle null interval gracefully', function() {
        expect(function() {
          DashboardRefreshFactory.stopRefresh(null);
        }).not.toThrow();
      });

      it('should handle undefined interval gracefully', function() {
        expect(function() {
          DashboardRefreshFactory.stopRefresh(undefined);
        }).not.toThrow();
      });
    });
  });
})();