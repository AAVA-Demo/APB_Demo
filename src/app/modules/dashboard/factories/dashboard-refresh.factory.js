(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .factory('DashboardRefreshFactory', ['$interval', DashboardRefreshFactory]);
  function DashboardRefreshFactory($interval) {
    const refreshInterval = 300000;
    return {
      startAutoRefresh: startAutoRefresh,
      stopAutoRefresh: stopAutoRefresh
    };
    function startAutoRefresh(callback) {
      return $interval(callback, refreshInterval);
    }
    function stopAutoRefresh(intervalPromise) {
      if (intervalPromise) {
        $interval.cancel(intervalPromise);
      }
    }
  }
})();