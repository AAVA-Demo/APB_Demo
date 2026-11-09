(function() {
  'use strict';
  angular.module('creditCardApp').factory('DataRefreshFactory', ['$interval', '$timeout', function($interval, $timeout) {
    return {
      startPolling: function(callback, intervalMs) {
        const interval = $interval(callback, intervalMs || 30000);
        return interval;
      },
      stopPolling: function(interval) {
        if (interval) {
          $interval.cancel(interval);
        }
      }
    };
  }]);
})();