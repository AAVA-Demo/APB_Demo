/*
Test Documentation:
- Test Name: refreshService - startPolling and stopPolling
- Purpose: Validates automatic dashboard refresh polling every 30 seconds
- Scenario: Tests polling initialization, data refresh, error handling, polling stop
- Expected Result: Polls every 30s, broadcasts refresh events, handles errors
*/
/*
Coverage Report:
- Functions tested: startPolling, stopPolling
- Scenarios covered: polling start, interval execution, broadcast, error handling, polling stop
- Uncovered scenarios: none
*/

describe('refreshService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var refreshService;
  var $interval;
  var $rootScope;
  var cardDataService;
  var $q;

  beforeEach(inject(function(_refreshService_, _$interval_, _$rootScope_, _cardDataService_, _$q_) {
    refreshService = _refreshService_;
    $interval = _$interval_;
    $rootScope = _$rootScope_;
    cardDataService = _cardDataService_;
    $q = _$q_;
  }));

  describe('startPolling', function() {
    it('should start polling and broadcast refresh event', function() {
      var mockData = { cards: [{ cardId: '1' }] };
      spyOn(cardDataService, 'getDashboardData').and.returnValue($q.resolve(mockData));
      spyOn($rootScope, '$broadcast');

      refreshService.startPolling();
      $interval.flush(30000);
      $rootScope.$apply();

      expect(cardDataService.getDashboardData).toHaveBeenCalled();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('dashboard:refresh', mockData);
    });

    it('should not start multiple polling intervals', function() {
      spyOn(cardDataService, 'getDashboardData').and.returnValue($q.resolve({}));

      refreshService.startPolling();
      refreshService.startPolling();

      $interval.flush(30000);
      $rootScope.$apply();

      expect(cardDataService.getDashboardData.calls.count()).toBe(1);
    });

    it('should handle error during refresh', function() {
      spyOn(cardDataService, 'getDashboardData').and.returnValue($q.reject('Error'));
      spyOn(console, 'error');

      refreshService.startPolling();
      $interval.flush(30000);
      $rootScope.$apply();

      expect(console.error).toHaveBeenCalledWith('Refresh failed:', 'Error');
    });
  });

  describe('stopPolling', function() {
    it('should stop polling', function() {
      spyOn(cardDataService, 'getDashboardData').and.returnValue($q.resolve({}));

      refreshService.startPolling();
      refreshService.stopPolling();

      expect(function() {
        $interval.flush(30000);
      }).toThrow();
    });

    it('should handle stop when not polling', function() {
      expect(function() {
        refreshService.stopPolling();
      }).not.toThrow();
    });
  });
});