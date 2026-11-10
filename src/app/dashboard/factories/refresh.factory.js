(function() {
  'use strict';
  angular.module('dashboardModule').factory('RefreshFactory', ['$interval', function($interval) {
    return {
      startPolling: function(callback, intervalMs) {
        return $interval(callback, intervalMs || 30000);
      },
      stopPolling: function(promise) {
        if (promise) {
          $interval.cancel(promise);
        }
      }
    };
  }]);
})();