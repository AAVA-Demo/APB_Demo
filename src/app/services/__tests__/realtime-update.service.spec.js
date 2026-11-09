/*
Test Documentation:
- Test Name: RealtimeUpdateService Test Suite
- Purpose: Validate the RealtimeUpdateService manages polling intervals correctly
- Scenario: Tests starting polling, stopping polling, and interval management
- Expected Result: Service correctly starts and stops polling with proper interval handling
*/

(function() {
  'use strict';

  describe('RealtimeUpdateService', function() {
    var RealtimeUpdateService, $interval;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_RealtimeUpdateService_, _$interval_) {
      RealtimeUpdateService = _RealtimeUpdateService_;
      $interval = _$interval_;
    }));

    describe('startPolling', function() {
      it('should start polling with callback and interval', function() {
        var callbackSpy = jasmine.createSpy('callback');
        var intervalMs = 1000;

        RealtimeUpdateService.startPolling(callbackSpy, intervalMs);
        $interval.flush(intervalMs);

        expect(callbackSpy).toHaveBeenCalled();
        expect(callbackSpy.calls.count()).toBe(1);
      });

      it('should call callback multiple times at specified interval', function() {
        var callbackSpy = jasmine.createSpy('callback');
        var intervalMs = 500;

        RealtimeUpdateService.startPolling(callbackSpy, intervalMs);
        $interval.flush(1500);

        expect(callbackSpy.calls.count()).toBe(3);
      });

      it('should cancel existing polling before starting new one', function() {
        var callback1 = jasmine.createSpy('callback1');
        var callback2 = jasmine.createSpy('callback2');
        var intervalMs = 1000;

        RealtimeUpdateService.startPolling(callback1, intervalMs);
        RealtimeUpdateService.startPolling(callback2, intervalMs);
        $interval.flush(intervalMs);

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
      });

      it('should handle different interval durations', function() {
        var callbackSpy = jasmine.createSpy('callback');
        var intervalMs = 2000;

        RealtimeUpdateService.startPolling(callbackSpy, intervalMs);
        $interval.flush(2000);

        expect(callbackSpy).toHaveBeenCalled();
        expect(callbackSpy.calls.count()).toBe(1);

        $interval.flush(2000);
        expect(callbackSpy.calls.count()).toBe(2);
      });

      it('should execute callback immediately on first interval completion', function() {
        var callbackSpy = jasmine.createSpy('callback');
        var intervalMs = 1000;

        RealtimeUpdateService.startPolling(callbackSpy, intervalMs);

        expect(callbackSpy).not.toHaveBeenCalled();

        $interval.flush(intervalMs);
        expect(callbackSpy).toHaveBeenCalled();
      });
    });

    describe('stopPolling', function() {
      it('should stop polling when called', function() {
        var callbackSpy = jasmine.createSpy('callback');
        var intervalMs = 1000;

        RealtimeUpdateService.startPolling(callbackSpy, intervalMs);
        RealtimeUpdateService.stopPolling();

        $interval.flush(intervalMs);

        expect(callbackSpy).not.toHaveBeenCalled();
      });

      it('should handle stopPolling when no polling is active', function() {
        expect(function() {
          RealtimeUpdateService.stopPolling();
        }).not.toThrow();
      });

      it('should prevent callback execution after stopping', function() {
        var callbackSpy = jasmine.createSpy('callback');
        var intervalMs = 500;

        RealtimeUpdateService.startPolling(callbackSpy, intervalMs);
        $interval.flush(500);
        expect(callbackSpy.calls.count()).toBe(1);

        RealtimeUpdateService.stopPolling();
        $interval.flush(1000);
        expect(callbackSpy.calls.count()).toBe(1);
      });

      it('should allow restarting polling after stopping', function() {
        var callback1 = jasmine.createSpy('callback1');
        var callback2 = jasmine.createSpy('callback2');
        var intervalMs = 1000;

        RealtimeUpdateService.startPolling(callback1, intervalMs);
        RealtimeUpdateService.stopPolling();
        RealtimeUpdateService.startPolling(callback2, intervalMs);

        $interval.flush(intervalMs);

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
      });
    });

    describe('polling lifecycle', function() {
      it('should handle start-stop-start cycle correctly', function() {
        var callbackSpy = jasmine.createSpy('callback');
        var intervalMs = 1000;

        RealtimeUpdateService.startPolling(callbackSpy, intervalMs);
        $interval.flush(1000);
        expect(callbackSpy.calls.count()).toBe(1);

        RealtimeUpdateService.stopPolling();
        $interval.flush(1000);
        expect(callbackSpy.calls.count()).toBe(1);

        RealtimeUpdateService.startPolling(callbackSpy, intervalMs);
        $interval.flush(1000);
        expect(callbackSpy.calls.count()).toBe(2);
      });

      it('should handle multiple stop calls without error', function() {
        var callbackSpy = jasmine.createSpy('callback');
        var intervalMs = 1000;

        RealtimeUpdateService.startPolling(callbackSpy, intervalMs);
        RealtimeUpdateService.stopPolling();

        expect(function() {
          RealtimeUpdateService.stopPolling();
          RealtimeUpdateService.stopPolling();
        }).not.toThrow();
      });

      it('should handle very short intervals', function() {
        var callbackSpy = jasmine.createSpy('callback');
        var intervalMs = 100;

        RealtimeUpdateService.startPolling(callbackSpy, intervalMs);
        $interval.flush(500);

        expect(callbackSpy.calls.count()).toBe(5);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: startPolling, stopPolling
  - Scenarios covered:
    * Starting polling with callback and interval
    * Multiple callback executions at specified interval
    * Canceling existing polling before starting new one
    * Different interval durations
    * Immediate execution on first interval completion
    * Stopping active polling
    * Stopping when no polling is active
    * Preventing callback execution after stopping
    * Restarting polling after stopping
    * Start-stop-start lifecycle
    * Multiple stop calls
    * Very short intervals
  - Uncovered scenarios: None - comprehensive coverage achieved
  */
})();