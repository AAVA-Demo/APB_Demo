(function() {
  'use strict';
  angular.module('dashboardModule').controller('DashboardController', DashboardController);
  DashboardController.$inject = ['DashboardService', '$scope', '$interval'];
  function DashboardController(DashboardService, $scope, $interval) {
    var vm = this;
    vm.dashboard = {};
    vm.loading = true;
    vm.error = null;
    activate();
    function activate() {
      loadDashboard();
      var refreshInterval = $interval(function() {
        refreshKPIs();
      }, 10000);
      $scope.$on('$destroy', function() {
        $interval.cancel(refreshInterval);
      });
    }
    function loadDashboard() {
      vm.loading = true;
      DashboardService.loadDashboard().then(function(data) {
        vm.dashboard = data;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data';
        vm.loading = false;
      });
    }
    function refreshKPIs() {
      DashboardService.refreshKPIs().then(function(kpis) {
        vm.dashboard.totalCreditLimit = kpis.totalCreditLimit;
        vm.dashboard.totalOutstandingAmount = kpis.totalOutstandingAmount;
        vm.dashboard.totalAvailableCredit = kpis.totalAvailableCredit;
        vm.dashboard.totalMonthlySpend = kpis.totalMonthlySpend;
      });
    }
  }
})();