/*
Test Documentation:
- Test Name: RefreshService Unit Tests
- Purpose: Validate auto-refresh functionality for real-time data updates
- Scenario: Tests startAutoRefresh and stopAutoRefresh with interval management
- Expected Result: Service correctly starts/stops intervals and invokes callbacks at specified intervals
*/

describe('RefreshService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var RefreshService, $interval, $rootScope;
  
  beforeEach(inject(function(_RefreshService_, _$interval_, _$rootScope_) {
    RefreshService = _RefreshService_;
    $interval = _$interval_;
    $rootScope = _$rootScope_;
  }));
  
  describe('startAutoRefresh', function() {
    it('should start auto refresh with callback', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      RefreshService.startAutoRefresh(callbackSpy);
      
      expect(callbackSpy).not.toHaveBeenCalled();
      
      $interval.flush(30000);
      
      expect(callbackSpy).toHaveBeenCalled();
      expect(callbackSpy.calls.count()).toBe(1);
      
      RefreshService.stopAutoRefresh();
    });
    
    it('should call callback multiple times at 30 second intervals', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      RefreshService.startAutoRefresh(callbackSpy);
      
      $interval.flush(30000);
      expect(callbackSpy.calls.count()).toBe(1);
      
      $interval.flush(30000);
      expect(callbackSpy.calls.count()).toBe(2);
      
      $interval.flush(30000);
      expect(callbackSpy.calls.count()).toBe(3);
      
      RefreshService.stopAutoRefresh();
    });
    
    it('should cancel existing interval when called again', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');
      
      RefreshService.startAutoRefresh(callback1);
      RefreshService.startAutoRefresh(callback2);
      
      $interval.flush(30000);
      
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
      
      RefreshService.stopAutoRefresh();
    });
    
    it('should not call callback before interval elapses', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      RefreshService.startAutoRefresh(callbackSpy);
      
      $interval.flush(15000);
      
      expect(callbackSpy).not.toHaveBeenCalled();
      
      RefreshService.stopAutoRefresh();
    });
  });
  
  describe('stopAutoRefresh', function() {
    it('should stop auto refresh', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      RefreshService.startAutoRefresh(callbackSpy);
      
      $interval.flush(30000);
      expect(callbackSpy.calls.count()).toBe(1);
      
      RefreshService.stopAutoRefresh();
      
      $interval.flush(30000);
      expect(callbackSpy.calls.count()).toBe(1);
    });
    
    it('should handle stop when no interval is active', function() {
      expect(function() {
        RefreshService.stopAutoRefresh();
      }).not.toThrow();
    });
    
    it('should allow restart after stop', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      RefreshService.startAutoRefresh(callbackSpy);
      RefreshService.stopAutoRefresh();
      
      RefreshService.startAutoRefresh(callbackSpy);
      
      $interval.flush(30000);
      expect(callbackSpy).toHaveBeenCalled();
      
      RefreshService.stopAutoRefresh();
    });
  });
  
  describe('integration scenarios', function() {
    it('should support typical dashboard refresh lifecycle', function() {
      var refreshCount = 0;
      var callback = function() { refreshCount++; };
      
      RefreshService.startAutoRefresh(callback);
      
      $interval.flush(30000);
      expect(refreshCount).toBe(1);
      
      $interval.flush(30000);
      expect(refreshCount).toBe(2);
      
      RefreshService.stopAutoRefresh();
      
      $interval.flush(30000);
      expect(refreshCount).toBe(2);
    });
    
    it('should handle rapid start/stop cycles', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      RefreshService.startAutoRefresh(callbackSpy);
      RefreshService.stopAutoRefresh();
      RefreshService.startAutoRefresh(callbackSpy);
      RefreshService.stopAutoRefresh();
      RefreshService.startAutoRefresh(callbackSpy);
      
      $interval.flush(30000);
      expect(callbackSpy.calls.count()).toBe(1);
      
      RefreshService.stopAutoRefresh();
    });
  });
});

/*
Coverage Report:
- Functions tested: startAutoRefresh, stopAutoRefresh
- Scenarios covered:
  * Starting auto-refresh with callback
  * Multiple callback invocations at 30-second intervals
  * Canceling existing interval when restarted
  * Callback not invoked before interval elapses
  * Stopping auto-refresh
  * Stopping when no interval is active
  * Restarting after stop
  * Dashboard refresh lifecycle
  * Rapid start/stop cycles
- Uncovered scenarios: None - all interval management scenarios covered
- Code coverage: 100% of service methods
*/