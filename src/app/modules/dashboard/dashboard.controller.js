(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['DashboardService', 'KPIComputationService', '$scope', '$interval', DashboardController]);
  function DashboardController(DashboardService, KPIComputationService, $scope, $interval) {
    var vm = this;
    vm.kpiMetrics = {};
    vm.loading = true;
    vm.error = null;
    vm.loadKPIs = loadKPIs;
    activate();
    function activate() {
      loadKPIs();
      $interval(loadKPIs, 300000);
    }
    function loadKPIs() {
      vm.loading = true;
      vm.error = null;
      DashboardService.loadKPIs()
        .then(function(kpis) {
          vm.kpiMetrics = kpis;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard KPIs. Please try again.';
          vm.loading = false;
          vm.kpiMetrics = {
            monthlySpend: 'N/A',
            totalCreditLimit: 'N/A',
            availableCredit: 'N/A',
            outstandingAmount: 'N/A'
          };
        });
    }
  }
})();