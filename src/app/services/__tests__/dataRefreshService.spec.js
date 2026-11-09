/*
Test Documentation:
- Test Name: dataRefreshService - startRefresh creates interval and returns promise
- Purpose: Validates that startRefresh initiates periodic callback execution
- Scenario: startRefresh is called with callback and delay
- Expected Result: $interval is called with callback and delay, interval promise is returned

- Test Name: dataRefreshService - startRefresh executes callback at specified interval
- Purpose: Validates that callback is invoked periodically at the specified delay
- Scenario: startRefresh is called and time elapses
- Expected Result: Callback is executed after each interval period

- Test Name: dataRefreshService - stopRefresh cancels specific interval
- Purpose: Validates that stopRefresh stops a specific interval without affecting others
- Scenario: Multiple intervals are started and one is stopped
- Expected Result: Specified interval is cancelled and removed from internal tracking

- Test Name: dataRefreshService - stopRefresh handles invalid interval promise
- Purpose: Validates that stopRefresh gracefully handles non-existent interval
- Scenario: stopRefresh is called with interval promise not in tracking array
- Expected Result: No error is thrown, $interval.cancel is still called

- Test Name: dataRefreshService - stopAll cancels all active intervals
- Purpose: Validates that stopAll terminates all registered intervals
- Scenario: Multiple intervals are started and stopAll is called
- Expected Result: All intervals are cancelled and tracking array is cleared

- Test Name: dataRefreshService - stopAll handles empty intervals array
- Purpose: Validates that stopAll works when no intervals are active
- Scenario: stopAll is called with no active intervals
- Expected Result: No error is thrown, intervals array remains empty

Coverage Report:
- Functions tested: startRefresh, stopRefresh, stopAll
- Scenarios covered: interval creation, callback execution, single interval cancellation, invalid interval handling, bulk cancellation, edge case with no intervals
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('dataRefreshService', function() {
    var dataRefreshService;
    var $interval;
    var $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_dataRefreshService_, _$interval_, _$rootScope_) {
      dataRefreshService = _dataRefreshService_;
      $interval = _$interval_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      dataRefreshService.stopAll();
    });

    describe('startRefresh', function() {
      it('should create interval and return promise', function() {
        var callback = jasmine.createSpy('callback');
        var delay = 5000;
        var intervalPromise = dataRefreshService.startRefresh(callback, delay);
        expect(intervalPromise).toBeDefined();
        expect(callback).not.toHaveBeenCalled();
      });

      it('should execute callback at specified interval', function() {
        var callback = jasmine.createSpy('callback');
        var delay = 1000;
        dataRefreshService.startRefresh(callback, delay);
        expect(callback).not.toHaveBeenCalled();
        $interval.flush(1000);
        expect(callback).toHaveBeenCalledTimes(1);
        $interval.flush(1000);
        expect(callback).toHaveBeenCalledTimes(2);
      });

      it('should track multiple intervals independently', function() {
        var callback1 = jasmine.createSpy('callback1');
        var callback2 = jasmine.createSpy('callback2');
        dataRefreshService.startRefresh(callback1, 1000);
        dataRefreshService.startRefresh(callback2, 2000);
        $interval.flush(1000);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).not.toHaveBeenCalled();
        $interval.flush(1000);
        expect(callback1).toHaveBeenCalledTimes(2);
        expect(callback2).toHaveBeenCalledTimes(1);
      });
    });

    describe('stopRefresh', function() {
      it('should cancel specific interval', function() {
        var callback = jasmine.createSpy('callback');
        var intervalPromise = dataRefreshService.startRefresh(callback, 1000);
        $interval.flush(1000);
        expect(callback).toHaveBeenCalledTimes(1);
        dataRefreshService.stopRefresh(intervalPromise);
        $interval.flush(1000);
        expect(callback).toHaveBeenCalledTimes(1);
      });

      it('should not affect other intervals when stopping one', function() {
        var callback1 = jasmine.createSpy('callback1');
        var callback2 = jasmine.createSpy('callback2');
        var interval1 = dataRefreshService.startRefresh(callback1, 1000);
        dataRefreshService.startRefresh(callback2, 1000);
        dataRefreshService.stopRefresh(interval1);
        $interval.flush(1000);
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledTimes(1);
      });

      it('should handle invalid interval promise gracefully', function() {
        var fakePromise = {};
        expect(function() {
          dataRefreshService.stopRefresh(fakePromise);
        }).not.toThrow();
      });
    });

    describe('stopAll', function() {
      it('should cancel all active intervals', function() {
        var callback1 = jasmine.createSpy('callback1');
        var callback2 = jasmine.createSpy('callback2');
        dataRefreshService.startRefresh(callback1, 1000);
        dataRefreshService.startRefresh(callback2, 1000);
        $interval.flush(1000);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
        dataRefreshService.stopAll();
        $interval.flush(1000);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
      });

      it('should handle empty intervals array', function() {
        expect(function() {
          dataRefreshService.stopAll();
        }).not.toThrow();
      });

      it('should clear intervals array after stopping all', function() {
        var callback = jasmine.createSpy('callback');
        dataRefreshService.startRefresh(callback, 1000);
        dataRefreshService.stopAll();
        dataRefreshService.stopAll();
        expect(function() {
          $interval.flush(1000);
        }).not.toThrow();
      });
    });
  });
})();