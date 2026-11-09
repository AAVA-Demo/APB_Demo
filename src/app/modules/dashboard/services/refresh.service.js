(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('RefreshService', ['$interval', 'DashboardService', function($interval, DashboardService) {
      var intervalPromise = null;
      var refreshInterval = 30000;

      this.startPolling = function(callback) {
        if (intervalPromise) {
          this.stopPolling();
        }
        intervalPromise = $interval(function() {
          DashboardService.getKPIs().then(function(data) {
            if (callback) {
              callback(data);
            }
          });
        }, refreshInterval);
      };

      this.stopPolling = function() {
        if (intervalPromise) {
          $interval.cancel(intervalPromise);
          intervalPromise = null;
        }
      };

      this.setInterval = function(interval) {
        refreshInterval = interval;
      };
    }]);
})();