(function() {
  'use strict';
  angular.module('creditCardApp').factory('RealtimeRefreshFactory', RealtimeRefreshFactory);
  RealtimeRefreshFactory.$inject = ['$interval', '$rootScope'];
  function RealtimeRefreshFactory($interval, $rootScope) {
    var intervalPromise = null;
    var factory = {
      startPolling: startPolling,
      stopPolling: stopPolling
    };
    return factory;
    function startPolling(callback, intervalMs) {
      if (intervalPromise) {
        stopPolling();
      }
      intervalMs = intervalMs || 30000;
      intervalPromise = $interval(function() {
        callback();
      }, intervalMs);
      return intervalPromise;
    }
    function stopPolling() {
      if (intervalPromise) {
        $interval.cancel(intervalPromise);
        intervalPromise = null;
      }
    }
  }
})();