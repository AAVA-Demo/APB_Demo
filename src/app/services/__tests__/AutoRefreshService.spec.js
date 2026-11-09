/*
Test Documentation:
- Test Name: AutoRefreshService - startRefresh with default interval
- Purpose: Validates that startRefresh starts interval with default 30000ms
- Scenario: startRefresh called without interval parameter
- Expected Result: Callback executed at 30-second intervals
*/
/*
Test Documentation:
- Test Name: AutoRefreshService - startRefresh with custom interval
- Purpose: Validates that startRefresh respects custom interval
- Scenario: startRefresh called with custom interval
- Expected Result: Callback executed at specified interval
*/
/*
Test Documentation:
- Test Name: AutoRefreshService - stopRefresh cancels interval
- Purpose: Validates that stopRefresh cancels active interval
- Scenario: stopRefresh called after startRefresh
- Expected Result: Interval cancelled, callback stops executing
*/
/*
Test Documentation:
- Test Name: AutoRefreshService - startRefresh cancels previous interval
- Purpose: Validates that starting new refresh cancels previous interval
- Scenario: startRefresh called twice
- Expected Result: Previous interval cancelled, new interval started
*/
/*
Coverage Report:
- Functions tested: startRefresh, stopRefresh
- Scenarios covered: default interval, custom interval, stop refresh, restart refresh
- Uncovered scenarios: none
*/

describe('AutoRefreshService', function() {
  var AutoRefreshService, $interval;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AutoRefreshService_, _$interval_) {
    AutoRefreshService = _AutoRefreshService_;
    $interval = _$interval_;
  }));

  afterEach(function() {
    AutoRefreshService.stopRefresh();
  });

  describe('startRefresh', function() {
    it('should start refresh with default interval of 30000ms', function() {
      var callbackSpy = jasmine.createSpy('callback');

      AutoRefreshService.startRefresh(callbackSpy);

      expect(callbackSpy).not.toHaveBeenCalled();

      $interval.flush(30000);
      expect(callbackSpy).toHaveBeenCalledTimes(1);

      $interval.flush(30000);
      expect(callbackSpy).toHaveBeenCalledTimes(2);
    });

    it('should start refresh with custom interval', function() {
      var callbackSpy = jasmine.createSpy('callback');
      var customInterval = 10000;

      AutoRefreshService.startRefresh(callbackSpy, customInterval);

      $interval.flush(10000);
      expect(callbackSpy).toHaveBeenCalledTimes(1);

      $interval.flush(10000);
      expect(callbackSpy).toHaveBeenCalledTimes(2);
    });

    it('should cancel previous interval when startRefresh called again', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');

      AutoRefreshService.startRefresh(callback1, 5000);
      $interval.flush(5000);
      expect(callback1).toHaveBeenCalledTimes(1);

      AutoRefreshService.startRefresh(callback2, 5000);
      $interval.flush(5000);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should handle callback execution errors gracefully', function() {
      var errorCallback = jasmine.createSpy('errorCallback').and.throwError('Test error');

      AutoRefreshService.startRefresh(errorCallback, 5000);

      expect(function() {
        $interval.flush(5000);
      }).toThrow();

      expect(errorCallback).toHaveBeenCalled();
    });
  });

  describe('stopRefresh', function() {
    it('should stop active refresh interval', function() {
      var callbackSpy = jasmine.createSpy('callback');

      AutoRefreshService.startRefresh(callbackSpy, 5000);
      $interval.flush(5000);
      expect(callbackSpy).toHaveBeenCalledTimes(1);

      AutoRefreshService.stopRefresh();
      $interval.flush(5000);

      expect(callbackSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle stopRefresh when no interval is active', function() {
      expect(function() {
        AutoRefreshService.stopRefresh();
      }).not.toThrow();
    });

    it('should allow restart after stop', function() {
      var callbackSpy = jasmine.createSpy('callback');

      AutoRefreshService.startRefresh(callbackSpy, 5000);
      AutoRefreshService.stopRefresh();

      AutoRefreshService.startRefresh(callbackSpy, 5000);
      $interval.flush(5000);

      expect(callbackSpy).toHaveBeenCalledTimes(1);
    });
  });
});