/*
Test Documentation:
- Test Name: RealtimeRefreshFactory - startPolling
- Purpose: Validates periodic data refresh mechanism for near-realtime updates
- Scenario: Dashboard starts polling for KPI updates every 60 seconds
- Expected Result: Callback is executed at specified interval and can be stopped
*/
/*
Coverage Report:
- Functions tested: startPolling, stopPolling
- Scenarios covered: polling start, polling stop, callback execution
- Uncovered scenarios: none
*/

describe('RealtimeRefreshFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var RealtimeRefreshFactory, $interval, $rootScope;
  
  beforeEach(inject(function(_RealtimeRefreshFactory_, _$interval_, _$rootScope_) {
    RealtimeRefreshFactory = _RealtimeRefreshFactory_;
    $interval = _$interval_;
    $rootScope = _$rootScope_;
  }));
  
  describe('startPolling', function() {
    it('should start polling with specified interval', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      var promise = RealtimeRefreshFactory.startPolling(callbackSpy, 1000);
      
      expect(promise).toBeDefined();
      $interval.flush(1000);
      expect(callbackSpy).toHaveBeenCalled();
    });
    
    it('should execute callback multiple times', function() {
      var callbackSpy = jasmine.createSpy('callback');
      
      RealtimeRefreshFactory.startPolling(callbackSpy, 500);
      
      $interval.flush(1500);
      expect(callbackSpy).toHaveBeenCalledTimes(3);
    });
  });
  
  describe('stopPolling', function() {
    it('should stop polling when called', function() {
      var callbackSpy = jasmine.createSpy('callback');
      var promise = RealtimeRefreshFactory.startPolling(callbackSpy, 1000);
      
      RealtimeRefreshFactory.stopPolling(promise);
      
      expect(function() {
        $interval.flush(1000);
      }).toThrow();
    });
    
    it('should handle null promise gracefully', function() {
      expect(function() {
        RealtimeRefreshFactory.stopPolling(null);
      }).not.toThrow();
    });
  });
});