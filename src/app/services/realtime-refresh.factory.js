(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('RealtimeRefreshFactory', ['$interval', function($interval) {
      return {
        startPolling: function(callback, intervalMs) {
          return $interval(callback, intervalMs);
        },
        stopPolling: function(promise) {
          if (promise) $interval.cancel(promise);
        }
      };
    }]);
})();