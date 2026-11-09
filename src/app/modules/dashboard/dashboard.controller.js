(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['DashboardService', '$scope', '$interval', function(DashboardService, $scope, $interval) {
      const vm = this;
      vm.kpiData = {};
      vm.loading = true;
      vm.error = null;
      let refreshInterval;

      vm.loadKPIData = function() {
        vm.loading = true;
        const userId = 'user123';
        DashboardService.getKPIData(userId)
          .then(function(data) {
            vm.kpiData = data;
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data';
            vm.loading = false;
            console.error('Dashboard KPI load error:', error);
          });
      };

      vm.refreshData = function() {
        vm.loadKPIData();
      };

      vm.loadKPIData();

      refreshInterval = $interval(function() {
        vm.loadKPIData();
      }, 30000);

      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();