(function() {
  'use strict';
  angular.module('app.dashboard').controller('DashboardController', DashboardController);
  DashboardController.$inject = ['KPIService', 'RealtimeRefreshFactory', '$scope'];
  function DashboardController(KPIService, RealtimeRefreshFactory, $scope) {
    var vm = this;
    vm.kpis = {};
    vm.loading = true;
    vm.error = null;
    activate();
    function activate() {
      loadKPIs();
      RealtimeRefreshFactory.startPolling(loadKPIs, 30000);
      $scope.$on('$destroy', function() {
        RealtimeRefreshFactory.stopPolling();
      });
    }
    function loadKPIs() {
      KPIService.getConsolidatedKPIs().then(function(data) {
        vm.kpis = data;
        vm.loading = false;
        vm.error = null;
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data. Please try again.';
        vm.loading = false;
      });
    }
  }
})();