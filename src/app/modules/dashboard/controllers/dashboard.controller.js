(function() {
  'use strict';
  angular.module('dashboardKpi').controller('DashboardController', ['KpiService', 'DataRefreshFactory', '$scope', '$interval', function(KpiService, DataRefreshFactory, $scope, $interval) {
    const vm = this;
    vm.kpiData = null;
    vm.loading = true;
    vm.error = null;
    let refreshInterval = null;
    vm.loadKpis = function() {
      vm.loading = true;
      vm.error = null;
      KpiService.getConsolidatedKpis().then(data => {
        vm.kpiData = data;
        vm.loading = false;
      }).catch(err => {
        vm.error = 'Failed to load KPI data. Please try again.';
        vm.loading = false;
      });
    };
    vm.retry = function() {
      vm.loadKpis();
    };
    vm.loadKpis();
    refreshInterval = DataRefreshFactory.startPolling(vm.loadKpis, 30000);
    $scope.$on('$destroy', function() {
      DataRefreshFactory.stopPolling(refreshInterval);
    });
  }]);
})();