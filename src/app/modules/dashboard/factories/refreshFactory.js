(function() {
  'use strict';
  angular.module('dashboardModule').factory('RefreshFactory', ['$interval', function($interval) {
    return {
      startRefresh: function(callback, intervalMs) {
        return $interval(callback, intervalMs || 300000);
      },
      stopRefresh: function(intervalPromise) {
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
        }
      }
    };
  }]);
})();