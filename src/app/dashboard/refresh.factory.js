(function() {
  'use strict';
  angular.module('app.dashboard')
    .factory('RefreshFactory', ['$interval', function($interval) {
      return {
        startAutoRefresh: function(callback, interval) {
          return $interval(callback, interval);
        },
        stopAutoRefresh: function(intervalPromise) {
          if (intervalPromise) {
            $interval.cancel(intervalPromise);
          }
        }
      };
    }]);
})();