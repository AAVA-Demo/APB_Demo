(function() {
  'use strict';
  angular.module('dashboardModule')
    .factory('DashboardRefreshFactory', ['$interval', function($interval) {
      var refreshInterval;
      return {
        startAutoRefresh: function(callback, intervalMs) {
          this.stopAutoRefresh();
          refreshInterval = $interval(callback, intervalMs);
        },
        stopAutoRefresh: function() {
          if (refreshInterval) {
            $interval.cancel(refreshInterval);
            refreshInterval = null;
          }
        }
      };
    }]);
})();