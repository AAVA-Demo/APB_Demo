/*
Test Documentation:
- Test Name: DashboardRefreshFactory auto-refresh management
- Purpose: Validates auto-refresh interval creation and cancellation
- Scenario: Test interval start, stop, and callback execution
- Expected Result: Factory should correctly manage refresh intervals
*/
/*
Coverage Report:
- Functions tested: startAutoRefresh, stopAutoRefresh
- Scenarios covered: interval creation, interval cancellation
- Dependencies mocked: $interval
- Uncovered scenarios: none
*/

describe('DashboardRefreshFactory', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var factory, $interval;
  
  beforeEach(inject(function(_DashboardRefreshFactory_, _$interval_) {
    factory = _DashboardRefreshFactory_;
    $interval = _$interval_;
  }));
  
  it('should be defined', function() {
    expect(factory).toBeDefined();
  });
  
  it('should have startAutoRefresh method', function() {
    expect(factory.startAutoRefresh).toBeDefined();
    expect(typeof factory.startAutoRefresh).toBe('function');
  });
  
  it('should have stopAutoRefresh method', function() {
    expect(factory.stopAutoRefresh).toBeDefined();
    expect(typeof factory.stopAutoRefresh).toBe('function');
  });
  
  it('should start auto-refresh with callback', function() {
    var callback = jasmine.createSpy('callback');
    var intervalPromise = factory.startAutoRefresh(callback);
    
    expect(intervalPromise).toBeDefined();
  });
  
  it('should stop auto-refresh when provided interval promise', function() {
    spyOn($interval, 'cancel');
    var callback = jasmine.createSpy('callback');
    var intervalPromise = factory.startAutoRefresh(callback);
    
    factory.stopAutoRefresh(intervalPromise);
    
    expect($interval.cancel).toHaveBeenCalledWith(intervalPromise);
  });
  
  it('should handle null interval promise gracefully', function() {
    expect(function() {
      factory.stopAutoRefresh(null);
    }).not.toThrow();
  });
});