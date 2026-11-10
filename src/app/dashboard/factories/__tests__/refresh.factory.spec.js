/*
Test Documentation:
- Test Name: RefreshFactory - startPolling
- Purpose: Validates polling mechanism initialization
- Scenario: startPolling is called with callback
- Expected Result: Returns interval promise
*/
/*
Test Documentation:
- Test Name: RefreshFactory - stopPolling
- Purpose: Validates polling cancellation
- Scenario: stopPolling is called with promise
- Expected Result: Interval is cancelled
*/
/*
Coverage Report:
- Functions tested: startPolling, stopPolling
- Scenarios covered: start polling, stop polling, default interval
- Uncovered scenarios: none
*/

describe('RefreshFactory', function() {
  'use strict';
  
  beforeEach(module('dashboardModule'));
  
  var RefreshFactory, $interval;
  
  beforeEach(inject(function(_RefreshFactory_, _$interval_) {
    RefreshFactory = _RefreshFactory_;
    $interval = _$interval_;
  }));
  
  describe('startPolling', function() {
    it('should start polling with callback', function() {
      var callbackCalled = false;
      var callback = function() { callbackCalled = true; };
      
      var promise = RefreshFactory.startPolling(callback, 1000);
      expect(promise).toBeDefined();
      
      $interval.flush(1000);
      expect(callbackCalled).toBe(true);
      
      $interval.cancel(promise);
    });
    
    it('should use default interval if not specified', function() {
      var callbackCalled = false;
      var callback = function() { callbackCalled = true; };
      
      var promise = RefreshFactory.startPolling(callback);
      expect(promise).toBeDefined();
      
      $interval.flush(30000);
      expect(callbackCalled).toBe(true);
      
      $interval.cancel(promise);
    });
    
    it('should call callback multiple times', function() {
      var callCount = 0;
      var callback = function() { callCount++; };
      
      var promise = RefreshFactory.startPolling(callback, 1000);
      
      $interval.flush(3000);
      expect(callCount).toBe(3);
      
      $interval.cancel(promise);
    });
  });
  
  describe('stopPolling', function() {
    it('should cancel polling', function() {
      var callbackCalled = false;
      var callback = function() { callbackCalled = true; };
      
      var promise = RefreshFactory.startPolling(callback, 1000);
      RefreshFactory.stopPolling(promise);
      
      try {
        $interval.flush(1000);
      } catch (e) {
        // Expected - no pending intervals
      }
      
      expect(callbackCalled).toBe(false);
    });
    
    it('should handle null promise gracefully', function() {
      expect(function() {
        RefreshFactory.stopPolling(null);
      }).not.toThrow();
    });
  });
});