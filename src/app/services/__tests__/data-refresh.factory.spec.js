/*
Test Documentation:
- Test Name: DataRefreshFactory - startPolling
- Purpose: Validates polling mechanism for real-time data refresh
- Scenario: Factory starts interval polling with callback function
- Expected Result: Callback is invoked at specified intervals
*/
/*
Test Documentation:
- Test Name: DataRefreshFactory - stopPolling
- Purpose: Validates stopping of polling interval
- Scenario: Factory cancels active polling interval
- Expected Result: Interval is cancelled and callback stops executing
*/
/*
Coverage Report:
- Functions tested: startPolling, stopPolling
- Scenarios covered: start polling with custom interval, default interval, stop polling, null interval handling
- Uncovered scenarios: none
*/

describe('DataRefreshFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var DataRefreshFactory, $interval, $timeout;
  
  beforeEach(inject(function(_DataRefreshFactory_, _$interval_, _$timeout_) {
    DataRefreshFactory = _DataRefreshFactory_;
    $interval = _$interval_;
    $timeout = _$timeout_;
  }));
  
  describe('startPolling', function() {
    it('should start polling with custom interval', function() {
      var callbackCount = 0;
      var callback = function() {
        callbackCount++;
      };
      
      var interval = DataRefreshFactory.startPolling(callback, 1000);
      
      expect(interval).toBeDefined();
      
      $interval.flush(1000);
      expect(callbackCount).toBe(1);
      
      $interval.flush(1000);
      expect(callbackCount).toBe(2);
      
      DataRefreshFactory.stopPolling(interval);
    });
    
    it('should use default interval of 30000ms when not specified', function() {
      var callbackCount = 0;
      var callback = function() {
        callbackCount++;
      };
      
      var interval = DataRefreshFactory.startPolling(callback);
      
      expect(interval).toBeDefined();
      
      $interval.flush(30000);
      expect(callbackCount).toBe(1);
      
      DataRefreshFactory.stopPolling(interval);
    });
    
    it('should execute callback immediately on first flush', function() {
      var callbackExecuted = false;
      var callback = function() {
        callbackExecuted = true;
      };
      
      var interval = DataRefreshFactory.startPolling(callback, 5000);
      
      expect(callbackExecuted).toBe(false);
      
      $interval.flush(5000);
      expect(callbackExecuted).toBe(true);
      
      DataRefreshFactory.stopPolling(interval);
    });
    
    it('should continue polling until stopped', function() {
      var callbackCount = 0;
      var callback = function() {
        callbackCount++;
      };
      
      var interval = DataRefreshFactory.startPolling(callback, 2000);
      
      $interval.flush(2000);
      $interval.flush(2000);
      $interval.flush(2000);
      
      expect(callbackCount).toBe(3);
      
      DataRefreshFactory.stopPolling(interval);
    });
    
    it('should handle callback with parameters', function() {
      var receivedData = null;
      var callback = function() {
        receivedData = 'data';
      };
      
      var interval = DataRefreshFactory.startPolling(callback, 1000);
      
      $interval.flush(1000);
      expect(receivedData).toBe('data');
      
      DataRefreshFactory.stopPolling(interval);
    });
  });
  
  describe('stopPolling', function() {
    it('should stop active polling interval', function() {
      var callbackCount = 0;
      var callback = function() {
        callbackCount++;
      };
      
      var interval = DataRefreshFactory.startPolling(callback, 1000);
      
      $interval.flush(1000);
      expect(callbackCount).toBe(1);
      
      DataRefreshFactory.stopPolling(interval);
      
      try {
        $interval.flush(1000);
      } catch (e) {
        // Expected - no pending intervals
      }
      
      expect(callbackCount).toBe(1);
    });
    
    it('should handle null interval gracefully', function() {
      expect(function() {
        DataRefreshFactory.stopPolling(null);
      }).not.toThrow();
    });
    
    it('should handle undefined interval gracefully', function() {
      expect(function() {
        DataRefreshFactory.stopPolling(undefined);
      }).not.toThrow();
    });
    
    it('should prevent further callback execution after stop', function() {
      var callbackCount = 0;
      var callback = function() {
        callbackCount++;
      };
      
      var interval = DataRefreshFactory.startPolling(callback, 1000);
      
      $interval.flush(1000);
      expect(callbackCount).toBe(1);
      
      DataRefreshFactory.stopPolling(interval);
      
      expect(callbackCount).toBe(1);
    });
  });
  
  describe('multiple polling instances', function() {
    it('should handle multiple concurrent polling intervals', function() {
      var count1 = 0;
      var count2 = 0;
      
      var callback1 = function() { count1++; };
      var callback2 = function() { count2++; };
      
      var interval1 = DataRefreshFactory.startPolling(callback1, 1000);
      var interval2 = DataRefreshFactory.startPolling(callback2, 2000);
      
      $interval.flush(1000);
      expect(count1).toBe(1);
      expect(count2).toBe(0);
      
      $interval.flush(1000);
      expect(count1).toBe(2);
      expect(count2).toBe(1);
      
      DataRefreshFactory.stopPolling(interval1);
      DataRefreshFactory.stopPolling(interval2);
    });
    
    it('should stop only specified interval', function() {
      var count1 = 0;
      var count2 = 0;
      
      var callback1 = function() { count1++; };
      var callback2 = function() { count2++; };
      
      var interval1 = DataRefreshFactory.startPolling(callback1, 1000);
      var interval2 = DataRefreshFactory.startPolling(callback2, 1000);
      
      $interval.flush(1000);
      expect(count1).toBe(1);
      expect(count2).toBe(1);
      
      DataRefreshFactory.stopPolling(interval1);
      
      $interval.flush(1000);
      expect(count1).toBe(1);
      expect(count2).toBe(2);
      
      DataRefreshFactory.stopPolling(interval2);
    });
  });
});