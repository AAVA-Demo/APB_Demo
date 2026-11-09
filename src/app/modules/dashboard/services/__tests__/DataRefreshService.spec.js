/*
Test Documentation:
- Test Name: DataRefreshService Unit Tests
- Purpose: Validate auto-refresh functionality for dashboard data
- Scenario: Test startAutoRefresh and stopAutoRefresh methods
- Expected Result: Service should properly manage refresh intervals
*/

(function(){
'use strict';

describe('DataRefreshService', function() {
  var DataRefreshService, $interval;

  beforeEach(module('creditCardDashboard'));

  beforeEach(inject(function(_DataRefreshService_, _$interval_) {
    DataRefreshService = _DataRefreshService_;
    $interval = _$interval_;
  }));

  describe('startAutoRefresh', function() {
    it('should start auto-refresh with callback', function() {
      var callback = jasmine.createSpy('callback');
      DataRefreshService.startAutoRefresh(callback);

      $interval.flush(30000);
      expect(callback).toHaveBeenCalled();
    });

    it('should call callback multiple times at 30 second intervals', function() {
      var callback = jasmine.createSpy('callback');
      DataRefreshService.startAutoRefresh(callback);

      $interval.flush(30000);
      expect(callback.calls.count()).toBe(1);

      $interval.flush(30000);
      expect(callback.calls.count()).toBe(2);

      $interval.flush(30000);
      expect(callback.calls.count()).toBe(3);
    });

    it('should cancel existing interval before starting new one', function() {
      var callback1 = jasmine.createSpy('callback1');
      var callback2 = jasmine.createSpy('callback2');

      DataRefreshService.startAutoRefresh(callback1);
      DataRefreshService.startAutoRefresh(callback2);

      $interval.flush(30000);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('stopAutoRefresh', function() {
    it('should stop auto-refresh interval', function() {
      var callback = jasmine.createSpy('callback');
      DataRefreshService.startAutoRefresh(callback);
      DataRefreshService.stopAutoRefresh();

      $interval.flush(30000);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle stop when no interval is active', function() {
      expect(function() {
        DataRefreshService.stopAutoRefresh();
      }).not.toThrow();
    });

    it('should allow restart after stop', function() {
      var callback = jasmine.createSpy('callback');
      DataRefreshService.startAutoRefresh(callback);
      DataRefreshService.stopAutoRefresh();
      DataRefreshService.startAutoRefresh(callback);

      $interval.flush(30000);
      expect(callback).toHaveBeenCalled();
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: startAutoRefresh, stopAutoRefresh
- Scenarios covered: Start refresh, multiple intervals, cancel existing, stop refresh, restart
- Edge cases: No active interval, multiple start calls, stop before start
- Uncovered scenarios: None - all interval management covered
*/