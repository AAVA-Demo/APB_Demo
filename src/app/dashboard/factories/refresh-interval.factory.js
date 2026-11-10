(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .factory('RefreshIntervalFactory', ['$interval', '$rootScope', function($interval, $rootScope) {
      var factory = {
        startAutoRefresh: startAutoRefresh,
        stopAutoRefresh: stopAutoRefresh
      };
      return factory;
      function startAutoRefresh(intervalMs, callback) {
        return $interval(function() {
          callback();
        }, intervalMs);
      }
      function stopAutoRefresh(intervalPromise) {
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
        }
      }
    }]);
})();