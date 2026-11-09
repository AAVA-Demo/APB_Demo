/*
Test Documentation:
- Test Name: RealtimeRefreshFactory - startPolling
- Purpose: Validates that startPolling initiates interval-based callback execution
- Scenario: User starts real-time data refresh
- Expected Result: Callback is executed at specified interval
*/
/*
Test Documentation:
- Test Name: RealtimeRefreshFactory - stopPolling
- Purpose: Validates that stopPolling cancels the active interval
- Scenario: User stops real-time data refresh
- Expected Result: Interval is cancelled and callback stops executing
*/
/*
Coverage Report:
- Functions tested: startPolling, stopPolling
- Scenarios covered: start polling, stop polling, default interval, custom interval
- Uncovered scenarios: none
*/

describe('RealtimeRefreshFactory', function() {
  'use strict';

  var RealtimeRefreshFactory, $interval, $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_RealtimeRefreshFactory_, _$interval_, _$rootScope_) {
    RealtimeRefreshFactory = _RealtimeRefreshFactory_;
    $interval = _$interval_;
    $rootScope = _$rootScope_;
  }));

  describe('startPolling', function() {
    it('should start polling with default interval of 60000ms', function() {
      var callback = jasmine.createSpy('callback');

      RealtimeRefreshFactory.startPolling(callback);
      $interval.flush(60000);

      expect(callback).toHaveBeenCalled();
    });

    it('should start polling with custom interval', function() {
      var callback = jasmine.createSpy('callback');

      RealtimeRefreshFactory.startPolling(callback, 30000);
      $interval.flush(30000);

      expect(callback).toHaveBeenCalled();
    });

    it('should stop previous polling when starting new polling', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');

      RealtimeRefreshFactory.startPolling(callback1, 10000);
      RealtimeRefreshFactory.startPolling(callback2, 10000);
      $interval.flush(10000);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('stopPolling', function() {
    it('should cancel active polling interval', function() {
      var callback = jasmine.createSpy('callback');

      RealtimeRefreshFactory.startPolling(callback, 10000);
      RealtimeRefreshFactory.stopPolling();

      expect(function() {
        $interval.flush(10000);
      }).toThrow();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should do nothing if no polling is active', function() {
      expect(function() {
        RealtimeRefreshFactory.stopPolling();
      }).not.toThrow();
    });
  });
});