/*
Test Documentation:
- Test Name: refreshService - polling management
- Purpose: Validates refresh service manages polling intervals
- Scenario: Service starts and stops polling with callbacks
- Expected Result: Executes callbacks at specified intervals and broadcasts events
*/

(function() {
  'use strict';

  describe('refreshService', function() {
    var refreshService;
    var $interval;
    var $rootScope;
    var callback;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_refreshService_, _$interval_, _$rootScope_) {
      refreshService = _refreshService_;
      $interval = _$interval_;
      $rootScope = _$rootScope_;

      callback = jasmine.createSpy('callback');
    }));

    /*
    Test Documentation:
    - Test Name: should start polling with default interval
    - Purpose: Validates startPolling with default 30 second interval
    - Scenario: Start polling without specifying interval
    - Expected Result: Callback executed every 30 seconds
    */
    it('should start polling with default interval', function() {
      refreshService.startPolling(callback);

      expect(callback).not.toHaveBeenCalled();

      $interval.flush(30000);
      expect(callback).toHaveBeenCalledTimes(1);

      $interval.flush(30000);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    /*
    Test Documentation:
    - Test Name: should start polling with custom interval
    - Purpose: Validates startPolling with custom interval
    - Scenario: Start polling with 10 second interval
    - Expected Result: Callback executed every 10 seconds
    */
    it('should start polling with custom interval', function() {
      refreshService.startPolling(callback, 10000);

      $interval.flush(10000);
      expect(callback).toHaveBeenCalledTimes(1);

      $interval.flush(10000);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    /*
    Test Documentation:
    - Test Name: should broadcast dashboard:refresh event
    - Purpose: Validates event broadcasting on each interval
    - Scenario: Polling interval triggers
    - Expected Result: dashboard:refresh event broadcast
    */
    it('should broadcast dashboard:refresh event', function() {
      spyOn($rootScope, '$broadcast');

      refreshService.startPolling(callback, 5000);
      $interval.flush(5000);

      expect($rootScope.$broadcast).toHaveBeenCalledWith('dashboard:refresh');
    });

    /*
    Test Documentation:
    - Test Name: should stop polling
    - Purpose: Validates stopPolling cancels interval
    - Scenario: Start polling then stop
    - Expected Result: Callback not executed after stop
    */
    it('should stop polling', function() {
      refreshService.startPolling(callback, 5000);
      $interval.flush(5000);
      expect(callback).toHaveBeenCalledTimes(1);

      refreshService.stopPolling();
      $interval.flush(5000);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    /*
    Test Documentation:
    - Test Name: should cancel previous interval when starting new one
    - Purpose: Validates only one polling interval active
    - Scenario: Start polling twice without stopping
    - Expected Result: Previous interval cancelled, new one active
    */
    it('should cancel previous interval when starting new one', function() {
      refreshService.startPolling(callback, 5000);
      $interval.flush(5000);
      expect(callback).toHaveBeenCalledTimes(1);

      var newCallback = jasmine.createSpy('newCallback');
      refreshService.startPolling(newCallback, 3000);

      $interval.flush(5000);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(newCallback).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle stopPolling when no polling active
    - Purpose: Validates stopPolling without active interval
    - Scenario: Call stopPolling without startPolling
    - Expected Result: No error thrown
    */
    it('should handle stopPolling when no polling active', function() {
      expect(function() {
        refreshService.stopPolling();
      }).not.toThrow();
    });

    /*
    Test Documentation:
    - Test Name: should execute callback immediately on interval
    - Purpose: Validates callback timing
    - Scenario: Polling interval reached
    - Expected Result: Callback executed at exact interval
    */
    it('should execute callback immediately on interval', function() {
      refreshService.startPolling(callback, 1000);

      expect(callback).not.toHaveBeenCalled();
      $interval.flush(999);
      expect(callback).not.toHaveBeenCalled();
      $interval.flush(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    /*
    Test Documentation:
    - Test Name: should handle multiple stop calls
    - Purpose: Validates multiple stopPolling calls
    - Scenario: Call stopPolling multiple times
    - Expected Result: No error thrown
    */
    it('should handle multiple stop calls', function() {
      refreshService.startPolling(callback, 5000);
      refreshService.stopPolling();

      expect(function() {
        refreshService.stopPolling();
        refreshService.stopPolling();
      }).not.toThrow();
    });
  });

  /*
  Coverage Report:
  - Functions tested: startPolling, stopPolling
  - Scenarios covered: default interval, custom interval, event broadcasting, stopping, interval cancellation
  - Edge cases: stop without start, multiple stops, interval replacement
  - Uncovered scenarios: none
  */
})();