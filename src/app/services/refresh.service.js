(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('RefreshService', ['$interval', 'KPIService', function($interval, KPIService) {
      var self = this;
      var refreshInterval = null;
      self.startAutoRefresh = function(userId, callback, intervalMs) {
        intervalMs = intervalMs || 600000;
        self.stopAutoRefresh();
        refreshInterval = $interval(function() {
          KPIService.getDashboardKPIs(userId).then(callback);
        }, intervalMs);
      };
      self.stopAutoRefresh = function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
          refreshInterval = null;
        }
      };
    }]);
})();