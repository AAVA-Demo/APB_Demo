/*
Test Documentation:
- Test Name: refreshFactory - startAutoRefresh
- Purpose: Validates that startAutoRefresh creates an interval that calls the callback function
- Scenario: When startAutoRefresh is called with a callback and interval, it should execute callback periodically
- Expected Result: Returns an interval promise and callback is invoked at specified intervals
*/
/*
Test Documentation:
- Test Name: refreshFactory - stopAutoRefresh
- Purpose: Validates that stopAutoRefresh cancels the interval
- Scenario: When stopAutoRefresh is called with an interval promise, it should cancel the interval
- Expected Result: Interval is cancelled and callback stops executing
*/
/*
Coverage Report:
- Functions tested: startAutoRefresh, stopAutoRefresh
- Scenarios covered: interval creation, callback execution, interval cancellation, null promise handling
- Edge cases: null promise, undefined promise, multiple start/stop cycles
- Uncovered scenarios: none
*/

describe('refreshFactory', function() {
  'use strict';
  
  beforeEach(module('dashboardModule'));
  
  var refreshFactory;
  var $interval;
  var $rootScope;
  
  beforeEach(inject(function(_refreshFactory_, _$interval_, _$rootScope_) {
    refreshFactory = _refreshFactory_;
    $interval = _$interval_;
    $rootScope = _$rootScope_;
  }));
  
  describe('startAutoRefresh', function() {
    it('should be defined', function() {
      expect(refreshFactory.startAutoRefresh).toBeDefined();
      expect(typeof refreshFactory.startAutoRefresh).toBe('function');
    });
    
    it('should return a promise', function() {
      var callback = jasmine.createSpy('callback');
      var promise = refreshFactory.startAutoRefresh(callback, 1000);
      expect(promise).toBeDefined();
      expect(promise.$$intervalId).toBeDefined();
      $interval.cancel(promise);
    });
    
    it('should call callback function at specified interval', function() {
      var callback = jasmine.createSpy('callback');
      var promise = refreshFactory.startAutoRefresh(callback, 100);
      
      $interval.flush(100);
      expect(callback).toHaveBeenCalledTimes(1);
      
      $interval.flush(100);
      expect(callback).toHaveBeenCalledTimes(2);
      
      $interval.cancel(promise);
    });
    
    it('should call callback multiple times', function() {
      var callback = jasmine.createSpy('callback');
      var promise = refreshFactory.startAutoRefresh(callback, 50);
      
      $interval.flush(250);
      expect(callback).toHaveBeenCalledTimes(5);
      
      $interval.cancel(promise);
    });
    
    it('should accept different interval values', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');
      
      var promise1 = refreshFactory.startAutoRefresh(callback1, 100);
      var promise2 = refreshFactory.startAutoRefresh(callback2, 200);
      
      $interval.flush(200);
      expect(callback1).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(1);
      
      $interval.cancel(promise1);
      $interval.cancel(promise2);
    });
  });
  
  describe('stopAutoRefresh', function() {
    it('should be defined', function() {
      expect(refreshFactory.stopAutoRefresh).toBeDefined();
      expect(typeof refreshFactory.stopAutoRefresh).toBe('function');
    });
    
    it('should cancel the interval', function() {
      var callback = jasmine.createSpy('callback');
      var promise = refreshFactory.startAutoRefresh(callback, 100);
      
      $interval.flush(100);
      expect(callback).toHaveBeenCalledTimes(1);
      
      refreshFactory.stopAutoRefresh(promise);
      
      $interval.flush(100);
      expect(callback).toHaveBeenCalledTimes(1);
    });
    
    it('should handle null promise gracefully', function() {
      expect(function() {
        refreshFactory.stopAutoRefresh(null);
      }).not.toThrow();
    });
    
    it('should handle undefined promise gracefully', function() {
      expect(function() {
        refreshFactory.stopAutoRefresh(undefined);
      }).not.toThrow();
    });
    
    it('should stop callback execution after cancellation', function() {
      var callback = jasmine.createSpy('callback');
      var promise = refreshFactory.startAutoRefresh(callback, 50);
      
      $interval.flush(100);
      expect(callback).toHaveBeenCalledTimes(2);
      
      refreshFactory.stopAutoRefresh(promise);
      
      $interval.flush(200);
      expect(callback).toHaveBeenCalledTimes(2);
    });
    
    it('should allow multiple start and stop cycles', function() {
      var callback = jasmine.createSpy('callback');
      
      var promise1 = refreshFactory.startAutoRefresh(callback, 50);
      $interval.flush(100);
      expect(callback).toHaveBeenCalledTimes(2);
      refreshFactory.stopAutoRefresh(promise1);
      
      callback.calls.reset();
      var promise2 = refreshFactory.startAutoRefresh(callback, 50);
      $interval.flush(100);
      expect(callback).toHaveBeenCalledTimes(2);
      refreshFactory.stopAutoRefresh(promise2);
    });
  });
  
  describe('factory structure', function() {
    it('should return an object with startAutoRefresh and stopAutoRefresh', function() {
      expect(typeof refreshFactory).toBe('object');
      expect(refreshFactory.startAutoRefresh).toBeDefined();
      expect(refreshFactory.stopAutoRefresh).toBeDefined();
    });
  });
});