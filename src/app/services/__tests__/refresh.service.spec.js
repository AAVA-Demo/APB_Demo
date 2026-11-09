/*
Test Documentation:
- Test Name: refreshService - startPolling and stopPolling
- Purpose: Validates real-time data refresh polling mechanism
- Scenario: Tests polling start, stop, callback execution, interval management
- Expected Result: Polling starts/stops correctly, broadcasts refresh events
*/
/*
Coverage Report:
- Functions tested: startPolling, stopPolling
- Scenarios covered: start polling, stop polling, callback execution, broadcast event
- Uncovered scenarios: none
*/

describe('refreshService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var refreshService;
  var $interval;
  var $rootScope;

  beforeEach(inject(function(_refreshService_, _$interval_, _$rootScope_) {
    refreshService = _refreshService_;
    $interval = _$interval_;
    $rootScope = _$rootScope_;
  }));

  describe('startPolling', function() {
    it('should start polling with callback', function() {
      var callback = jasmine.createSpy('callback');

      refreshService.startPolling(callback, 1000);
      $interval.flush(1000);

      expect(callback).toHaveBeenCalled();
    });

    it('should broadcast dashboard:refresh event', function() {
      var callback = jasmine.createSpy('callback');
      spyOn($rootScope, '$broadcast');

      refreshService.startPolling(callback, 1000);
      $interval.flush(1000);

      expect($rootScope.$broadcast).toHaveBeenCalledWith('dashboard:refresh');
    });

    it('should use default interval of 30000ms', function() {
      var callback = jasmine.createSpy('callback');

      refreshService.startPolling(callback);
      $interval.flush(30000);

      expect(callback).toHaveBeenCalled();
    });

    it('should cancel existing interval before starting new one', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');

      refreshService.startPolling(callback1, 1000);
      refreshService.startPolling(callback2, 1000);
      $interval.flush(1000);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('stopPolling', function() {
    it('should stop polling', function() {
      var callback = jasmine.createSpy('callback');

      refreshService.startPolling(callback, 1000);
      refreshService.stopPolling();

      expect(function() {
        $interval.flush(1000);
      }).toThrow();
    });

    it('should handle stop when not polling', function() {
      expect(function() {
        refreshService.stopPolling();
      }).not.toThrow();
    });
  });
});