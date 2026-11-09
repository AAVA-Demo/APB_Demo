(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('RefreshService', ['$interval', function($interval) {
      var intervals = {};
      function startPolling(key, callback, intervalMs) {
        if (intervals[key]) {
          $interval.cancel(intervals[key]);
        }
        intervals[key] = $interval(callback, intervalMs || 30000);
      }
      function stopPolling(key) {
        if (intervals[key]) {
          $interval.cancel(intervals[key]);
          delete intervals[key];
        }
      }
      function stopAll() {
        angular.forEach(intervals, function(interval) {
          $interval.cancel(interval);
        });
        intervals = {};
      }
      return {
        startPolling: startPolling,
        stopPolling: stopPolling,
        stopAll: stopAll
      };
    }]);
})();