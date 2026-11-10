(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('DataRefreshService', ['$interval', 'KPICalculationService', function($interval, KPICalculationService) {
      var self = this;
      var refreshInterval = null;
      self.startRefresh = function(callback) {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
        refreshInterval = $interval(function() {
          KPICalculationService.calculateKPIs().then(function(kpis) {
            if (callback) callback(kpis);
          });
        }, 30000);
        return refreshInterval;
      };
      self.stopRefresh = function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
          refreshInterval = null;
        }
      };
    }]);
})();