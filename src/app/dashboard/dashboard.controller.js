(function() {
  'use strict';
  angular.module('app.dashboard').controller('DashboardController', ['KPIService', 'DataRefreshService', '$scope', DashboardController]);
  function DashboardController(KPIService, DataRefreshService, $scope) {
    var vm = this;
    vm.kpis = {};
    vm.loading = true;
    vm.error = false;
    vm.refreshKPIs = refreshKPIs;
    init();
    function init() {
      loadKPIs();
      DataRefreshService.startPolling(function() {
        refreshKPIs();
      }, 30000);
      $scope.$on('$destroy', function() {
        DataRefreshService.stopPolling();
      });
    }
    function loadKPIs() {
      vm.loading = true;
      vm.error = false;
      KPIService.getDashboardKPIs().then(function(kpis) {
        vm.kpis = kpis;
        vm.error = kpis.error || false;
        vm.loading = false;
      }).catch(function() {
        vm.error = true;
        vm.loading = false;
      });
    }
    function refreshKPIs() {
      KPIService.getDashboardKPIs().then(function(kpis) {
        vm.kpis = kpis;
        vm.error = kpis.error || false;
      });
    }
  }
})();