(function() {
  'use strict';
  angular.module('app.dashboard').factory('DashboardRefreshFactory', ['$interval', function($interval) {
    var REFRESH_INTERVAL = 30000;
    return {
      startRefresh: function(callback) {
        return $interval(callback, REFRESH_INTERVAL);
      },
      stopRefresh: function(intervalPromise) {
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
        }
      }
    };
  }]);
})();