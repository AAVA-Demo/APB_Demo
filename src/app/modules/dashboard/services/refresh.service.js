(function() {
  'use strict';
  angular.module('dashboardModule')
    .factory('RefreshService', ['$interval', '$rootScope', function($interval, $rootScope) {
      return {
        startAutoRefresh: function(callback, intervalMs) {
          return $interval(callback, intervalMs);
        },
        stopAutoRefresh: function(intervalPromise) {
          if (intervalPromise) {
            $interval.cancel(intervalPromise);
          }
        }
      };
    }]);
})();