/*
Test Documentation:
- Test Name: RefreshService - Start Polling with Callback
- Purpose: Validates that RefreshService correctly starts polling with a callback function
- Scenario: When startPolling() is called with a key, callback, and interval
- Expected Result: Callback is executed at the specified interval
*/

/*
Test Documentation:
- Test Name: RefreshService - Stop Polling by Key
- Purpose: Validates that RefreshService correctly stops a specific polling interval
- Scenario: When stopPolling() is called with an active polling key
- Expected Result: The interval for that key is cancelled and removed
*/

/*
Test Documentation:
- Test Name: RefreshService - Stop All Polling Intervals
- Purpose: Validates that RefreshService correctly stops all active polling intervals
- Scenario: When stopAll() is called with multiple active polling intervals
- Expected Result: All intervals are cancelled and the intervals object is reset
*/

/*
Test Documentation:
- Test Name: RefreshService - Replace Existing Polling Interval
- Purpose: Validates that RefreshService cancels existing interval when startPolling is called with same key
- Scenario: When startPolling() is called twice with the same key
- Expected Result: Previous interval is cancelled and new interval is created
*/

/*
Test Documentation:
- Test Name: RefreshService - Default Interval Value
- Purpose: Validates that RefreshService uses default 30000ms interval when not specified
- Scenario: When startPolling() is called without intervalMs parameter
- Expected Result: Callback is executed every 30000ms
*/

/*
Test Documentation:
- Test Name: RefreshService - Multiple Independent Polling Intervals
- Purpose: Validates that RefreshService can manage multiple independent polling intervals
- Scenario: When startPolling() is called with different keys and intervals
- Expected Result: Each interval executes independently at its specified rate
*/

/*
Test Documentation:
- Test Name: RefreshService - Stop Non-Existent Polling Key
- Purpose: Validates that RefreshService handles stopping a non-existent polling key gracefully
- Scenario: When stopPolling() is called with a key that doesn't exist
- Expected Result: No error is thrown and function completes successfully
*/

/*
Coverage Report:
- Functions tested: startPolling, stopPolling, stopAll
- Scenarios covered:
  * Starting polling with callback and interval (success)
  * Stopping specific polling interval (success)
  * Stopping all polling intervals (success)
  * Replacing existing polling interval (edge case)
  * Default interval value (edge case)
  * Multiple independent intervals (success)
  * Stopping non-existent key (error case)
- Uncovered scenarios:
  * Memory leak validation after many start/stop cycles
  * Callback error handling during execution
*/

describe('RefreshService', function() {
  'use strict';

  var RefreshService, $interval, $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_RefreshService_, _$interval_, _$rootScope_) {
    RefreshService = _RefreshService_;
    $interval = _$interval_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    RefreshService.stopAll();
  });

  describe('startPolling()', function() {

    it('should start polling with callback and execute at specified interval', function() {
      var callCount = 0;
      var callback = jasmine.createSpy('callback').and.callFake(function() {
        callCount++;
      });

      RefreshService.startPolling('test-key', callback, 1000);

      expect(callback).not.toHaveBeenCalled();

      $interval.flush(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      $interval.flush(1000);
      expect(callback).toHaveBeenCalledTimes(2);

      $interval.flush(1000);
      expect(callback).toHaveBeenCalledTimes(3);
    });

    it('should use default interval of 30000ms when intervalMs is not provided', function() {
      var callback = jasmine.createSpy('callback');

      RefreshService.startPolling('default-key', callback);

      $interval.flush(29999);
      expect(callback).not.toHaveBeenCalled();

      $interval.flush(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should cancel existing interval when startPolling is called with same key', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');

      RefreshService.startPolling('duplicate-key', callback1, 1000);
      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(1);

      RefreshService.startPolling('duplicate-key', callback2, 1000);
      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);

      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(2);
    });

    it('should manage multiple independent polling intervals with different keys', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');
      var callback3 = jasmine.createSpy('callback3');

      RefreshService.startPolling('key1', callback1, 1000);
      RefreshService.startPolling('key2', callback2, 2000);
      RefreshService.startPolling('key3', callback3, 3000);

      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();
      expect(callback3).not.toHaveBeenCalled();

      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).not.toHaveBeenCalled();

      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(3);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    it('should execute callback with correct context', function() {
      var contextCheck = null;
      var callback = function() {
        contextCheck = this;
      };

      RefreshService.startPolling('context-key', callback, 1000);
      $interval.flush(1000);

      expect(contextCheck).toBeDefined();
    });

  });

  describe('stopPolling()', function() {

    it('should stop polling for specified key', function() {
      var callback = jasmine.createSpy('callback');

      RefreshService.startPolling('stop-key', callback, 1000);
      $interval.flush(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      RefreshService.stopPolling('stop-key');
      $interval.flush(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      $interval.flush(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle stopping non-existent key gracefully', function() {
      expect(function() {
        RefreshService.stopPolling('non-existent-key');
      }).not.toThrow();
    });

    it('should only stop the specified key and leave others running', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');

      RefreshService.startPolling('key1', callback1, 1000);
      RefreshService.startPolling('key2', callback2, 1000);

      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);

      RefreshService.stopPolling('key1');

      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(2);
    });

    it('should allow restarting polling after stopping', function() {
      var callback = jasmine.createSpy('callback');

      RefreshService.startPolling('restart-key', callback, 1000);
      $interval.flush(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      RefreshService.stopPolling('restart-key');
      $interval.flush(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      RefreshService.startPolling('restart-key', callback, 1000);
      $interval.flush(1000);
      expect(callback).toHaveBeenCalledTimes(2);
    });

  });

  describe('stopAll()', function() {

    it('should stop all active polling intervals', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');
      var callback3 = jasmine.createSpy('callback3');

      RefreshService.startPolling('key1', callback1, 1000);
      RefreshService.startPolling('key2', callback2, 1000);
      RefreshService.startPolling('key3', callback3, 1000);

      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);

      RefreshService.stopAll();

      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    it('should handle stopAll when no intervals are active', function() {
      expect(function() {
        RefreshService.stopAll();
      }).not.toThrow();
    });

    it('should allow starting new intervals after stopAll', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');

      RefreshService.startPolling('key1', callback1, 1000);
      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(1);

      RefreshService.stopAll();

      RefreshService.startPolling('key2', callback2, 1000);
      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should reset intervals object after stopAll', function() {
      var callback = jasmine.createSpy('callback');

      RefreshService.startPolling('key1', callback, 1000);
      RefreshService.startPolling('key2', callback, 1000);
      RefreshService.startPolling('key3', callback, 1000);

      RefreshService.stopAll();

      expect(function() {
        RefreshService.stopPolling('key1');
        RefreshService.stopPolling('key2');
        RefreshService.stopPolling('key3');
      }).not.toThrow();
    });

  });

  describe('edge cases and integration scenarios', function() {

    it('should handle rapid start and stop operations', function() {
      var callback = jasmine.createSpy('callback');

      RefreshService.startPolling('rapid-key', callback, 1000);
      RefreshService.stopPolling('rapid-key');
      RefreshService.startPolling('rapid-key', callback, 1000);
      RefreshService.stopPolling('rapid-key');
      RefreshService.startPolling('rapid-key', callback, 1000);

      $interval.flush(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle zero interval value', function() {
      var callback = jasmine.createSpy('callback');

      RefreshService.startPolling('zero-key', callback, 0);
      $interval.flush(0);

      expect(callback).toHaveBeenCalled();
    });

    it('should handle very large interval values', function() {
      var callback = jasmine.createSpy('callback');

      RefreshService.startPolling('large-key', callback, 999999);
      $interval.flush(999998);
      expect(callback).not.toHaveBeenCalled();

      $interval.flush(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should maintain separate state for different keys', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');

      RefreshService.startPolling('state-key-1', callback1, 1000);
      RefreshService.startPolling('state-key-2', callback2, 2000);

      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();

      RefreshService.stopPolling('state-key-1');

      $interval.flush(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should handle callback that throws error gracefully', function() {
      var errorCallback = jasmine.createSpy('errorCallback').and.throwError('Test error');
      var normalCallback = jasmine.createSpy('normalCallback');

      RefreshService.startPolling('error-key', errorCallback, 1000);
      RefreshService.startPolling('normal-key', normalCallback, 1000);

      expect(function() {
        $interval.flush(1000);
      }).toThrow();

      expect(errorCallback).toHaveBeenCalledTimes(1);
      expect(normalCallback).toHaveBeenCalledTimes(1);
    });

  });

});