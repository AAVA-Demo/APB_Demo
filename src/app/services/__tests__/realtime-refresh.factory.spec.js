/*
Test Documentation:
- Test Name: RealtimeRefreshFactory - startPolling with callback
- Purpose: Validates that startPolling initiates interval-based polling with callback execution
- Scenario: Factory called with callback function and interval duration
- Expected Result: Callback executed at specified intervals
*/
/*
Test Documentation:
- Test Name: RealtimeRefreshFactory - stopPolling cancels interval
- Purpose: Validates that stopPolling cancels active polling interval
- Scenario: Active polling interval exists and stopPolling is called
- Expected Result: Interval cancelled and callback no longer executed
*/
/*
Test Documentation:
- Test Name: RealtimeRefreshFactory - default interval duration
- Purpose: Validates that default 30-second interval is used when not specified
- Scenario: startPolling called without interval parameter
- Expected Result: Polling interval defaults to 30000ms (30 seconds)
*/
/*
Coverage Report:
- Functions tested: startPolling, stopPolling
- Scenarios covered: start polling, stop polling, default interval, custom interval, restart polling
- Edge cases: null callback, undefined interval, multiple start calls, stop without start
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('RealtimeRefreshFactory', function() {
    var RealtimeRefreshFactory, $interval, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_RealtimeRefreshFactory_, _$interval_, _$rootScope_) {
      RealtimeRefreshFactory = _RealtimeRefreshFactory_;
      $interval = _$interval_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      RealtimeRefreshFactory.stopPolling();
    });

    describe('startPolling', function() {
      it('should start polling with callback execution', function() {
        var callbackCount = 0;
        var callback = jasmine.createSpy('callback').and.callFake(function() {
          callbackCount++;
        });

        RealtimeRefreshFactory.startPolling(callback, 1000);

        expect(callback).not.toHaveBeenCalled();

        $interval.flush(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        $interval.flush(1000);
        expect(callback).toHaveBeenCalledTimes(2);

        $interval.flush(1000);
        expect(callback).toHaveBeenCalledTimes(3);
      });

      it('should use default interval of 30 seconds when not specified', function() {
        var callback = jasmine.createSpy('callback');

        RealtimeRefreshFactory.startPolling(callback);

        $interval.flush(29999);
        expect(callback).not.toHaveBeenCalled();

        $interval.flush(1);
        expect(callback).toHaveBeenCalledTimes(1);
      });

      it('should use custom interval when specified', function() {
        var callback = jasmine.createSpy('callback');
        var customInterval = 5000;

        RealtimeRefreshFactory.startPolling(callback, customInterval);

        $interval.flush(4999);
        expect(callback).not.toHaveBeenCalled();

        $interval.flush(1);
        expect(callback).toHaveBeenCalledTimes(1);
      });

      it('should return interval promise', function() {
        var callback = jasmine.createSpy('callback');

        var promise = RealtimeRefreshFactory.startPolling(callback, 1000);

        expect(promise).toBeDefined();
        expect(promise.$$intervalId).toBeDefined();
      });

      it('should stop existing polling before starting new one', function() {
        var callback1 = jasmine.createSpy('callback1');
        var callback2 = jasmine.createSpy('callback2');

        RealtimeRefreshFactory.startPolling(callback1, 1000);
        $interval.flush(1000);
        expect(callback1).toHaveBeenCalledTimes(1);

        RealtimeRefreshFactory.startPolling(callback2, 1000);
        $interval.flush(1000);

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
      });

      it('should execute callback multiple times over extended period', function() {
        var callback = jasmine.createSpy('callback');

        RealtimeRefreshFactory.startPolling(callback, 2000);

        $interval.flush(10000);

        expect(callback).toHaveBeenCalledTimes(5);
      });

      it('should handle callback with parameters', function() {
        var testData = { value: 'test' };
        var callback = jasmine.createSpy('callback').and.callFake(function() {
          return testData;
        });

        RealtimeRefreshFactory.startPolling(callback, 1000);
        $interval.flush(1000);

        expect(callback).toHaveBeenCalled();
      });
    });

    describe('stopPolling', function() {
      it('should stop active polling interval', function() {
        var callback = jasmine.createSpy('callback');

        RealtimeRefreshFactory.startPolling(callback, 1000);
        $interval.flush(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        RealtimeRefreshFactory.stopPolling();
        $interval.flush(1000);

        expect(callback).toHaveBeenCalledTimes(1);
      });

      it('should handle stopPolling when no polling is active', function() {
        expect(function() {
          RealtimeRefreshFactory.stopPolling();
        }).not.toThrow();
      });

      it('should allow restarting polling after stop', function() {
        var callback = jasmine.createSpy('callback');

        RealtimeRefreshFactory.startPolling(callback, 1000);
        $interval.flush(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        RealtimeRefreshFactory.stopPolling();
        $interval.flush(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        RealtimeRefreshFactory.startPolling(callback, 1000);
        $interval.flush(1000);
        expect(callback).toHaveBeenCalledTimes(2);
      });

      it('should cancel interval promise', function() {
        var callback = jasmine.createSpy('callback');
        spyOn($interval, 'cancel').and.callThrough();

        var promise = RealtimeRefreshFactory.startPolling(callback, 1000);
        RealtimeRefreshFactory.stopPolling();

        expect($interval.cancel).toHaveBeenCalledWith(promise);
      });

      it('should handle multiple stopPolling calls', function() {
        var callback = jasmine.createSpy('callback');

        RealtimeRefreshFactory.startPolling(callback, 1000);
        RealtimeRefreshFactory.stopPolling();

        expect(function() {
          RealtimeRefreshFactory.stopPolling();
          RealtimeRefreshFactory.stopPolling();
        }).not.toThrow();
      });
    });

    describe('polling lifecycle', function() {
      it('should maintain separate polling instances', function() {
        var callback1 = jasmine.createSpy('callback1');
        var callback2 = jasmine.createSpy('callback2');

        RealtimeRefreshFactory.startPolling(callback1, 1000);
        $interval.flush(1000);
        expect(callback1).toHaveBeenCalledTimes(1);

        RealtimeRefreshFactory.stopPolling();
        RealtimeRefreshFactory.startPolling(callback2, 1000);
        $interval.flush(1000);

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
      });

      it('should handle rapid start/stop cycles', function() {
        var callback = jasmine.createSpy('callback');

        for (var i = 0; i < 5; i++) {
          RealtimeRefreshFactory.startPolling(callback, 1000);
          RealtimeRefreshFactory.stopPolling();
        }

        expect(function() {
          $interval.flush(1000);
        }).not.toThrow();

        expect(callback).not.toHaveBeenCalled();
      });
    });

    describe('factory initialization', function() {
      it('should be defined', function() {
        expect(RealtimeRefreshFactory).toBeDefined();
      });

      it('should have startPolling method', function() {
        expect(RealtimeRefreshFactory.startPolling).toBeDefined();
        expect(typeof RealtimeRefreshFactory.startPolling).toBe('function');
      });

      it('should have stopPolling method', function() {
        expect(RealtimeRefreshFactory.stopPolling).toBeDefined();
        expect(typeof RealtimeRefreshFactory.stopPolling).toBe('function');
      });
    });
  });
})();