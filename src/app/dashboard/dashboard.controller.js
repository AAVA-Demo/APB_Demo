(function() {
  'use strict';
  angular.module('dashboardModule').controller('KPIDashboardController', ['DashboardKPIService', '$scope', '$interval', function(DashboardKPIService, $scope, $interval) {
    const vm = this;
    vm.kpiData = null;
    vm.loading = true;
    vm.error = null;
    function loadKPIData() {
      vm.loading = true;
      DashboardKPIService.getKPIData().then(function(data) {
        vm.kpiData = data;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data';
        vm.loading = false;
      });
    }
    loadKPIData();
    const refreshInterval = $interval(function() {
      loadKPIData();
    }, 30000);
    $scope.$on('$destroy', function() {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
      }
    });
  }]);
})();