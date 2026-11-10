(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'KPIService', 'AuthFactory', function($scope, $interval, KPIService, AuthFactory) {
      var vm = this;
      vm.kpiMetrics = {};
      vm.loading = true;
      vm.error = null;
      vm.loadKPIData = function() {
        vm.loading = true;
        KPIService.getKPIMetrics()
          .then(function(metrics) {
            vm.kpiMetrics = metrics;
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load KPI data. Please try again.';
            vm.loading = false;
          });
      };
      vm.loadKPIData();
      var refreshInterval = $interval(function() {
        vm.loadKPIData();
      }, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();