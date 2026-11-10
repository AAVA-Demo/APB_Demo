/*
Test Documentation:
- Test Name: RefreshService - start method
- Purpose: Verify service starts interval correctly
- Scenario: start() is called with callback
- Expected Result: $interval is created with correct interval
*/
/*
Test Documentation:
- Test Name: RefreshService - stop method
- Purpose: Verify service stops interval correctly
- Scenario: stop() is called after start()
- Expected Result: $interval is cancelled
*/
/*
Test Documentation:
- Test Name: RefreshService - restart behavior
- Purpose: Verify service stops previous interval before starting new one
- Scenario: start() called multiple times
- Expected Result: Previous interval is cancelled before new one starts
*/
/*
Test Documentation:
- Test Name: RefreshService - callback execution
- Purpose: Verify callback is executed at specified interval
- Scenario: Interval elapses
- Expected Result: Callback function is invoked
*/
/*
Coverage Report:
- Functions tested: start, stop
- Scenarios covered: start interval, stop interval, restart, callback execution
- Uncovered scenarios: none
*/

describe('RefreshService', function() {
  'use strict';

  var RefreshService, $interval, API_CONFIG;

  beforeEach(module('app.dashboard'));

  beforeEach(inject(function(_RefreshService_, _$interval_, _API_CONFIG_) {
    RefreshService = _RefreshService_;
    $interval = _$interval_;
    API_CONFIG = _API_CONFIG_;
  }));

  it('should start interval with correct duration', function() {
    var callback = jasmine.createSpy('callback');
    spyOn($interval, 'cancel');

    RefreshService.start(callback);

    expect($interval.cancel).not.toHaveBeenCalled();

    $interval.flush(API_CONFIG.refreshInterval);

    expect(callback).toHaveBeenCalled();
  });

  it('should stop interval when stop is called', function() {
    var callback = jasmine.createSpy('callback');

    RefreshService.start(callback);
    RefreshService.stop();

    $interval.flush(API_CONFIG.refreshInterval);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should stop previous interval before starting new one', function() {
    var callback1 = jasmine.createSpy('callback1');
    var callback2 = jasmine.createSpy('callback2');

    RefreshService.start(callback1);
    RefreshService.start(callback2);

    $interval.flush(API_CONFIG.refreshInterval);

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  it('should execute callback multiple times at interval', function() {
    var callback = jasmine.createSpy('callback');

    RefreshService.start(callback);

    $interval.flush(API_CONFIG.refreshInterval);
    expect(callback).toHaveBeenCalledTimes(1);

    $interval.flush(API_CONFIG.refreshInterval);
    expect(callback).toHaveBeenCalledTimes(2);

    $interval.flush(API_CONFIG.refreshInterval);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should handle stop when no interval is running', function() {
    expect(function() {
      RefreshService.stop();
    }).not.toThrow();
  });

  it('should not execute callback after stop', function() {
    var callback = jasmine.createSpy('callback');

    RefreshService.start(callback);
    $interval.flush(API_CONFIG.refreshInterval);
    expect(callback).toHaveBeenCalledTimes(1);

    RefreshService.stop();
    $interval.flush(API_CONFIG.refreshInterval);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});