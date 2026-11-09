(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .controller('DashboardController', ['KPIService', 'CreditCardDataService', 'TransactionService', 'DashboardRefreshFactory', '$scope', '$interval', DashboardController]);
  function DashboardController(KPIService, CreditCardDataService, TransactionService, DashboardRefreshFactory, $scope, $interval) {
    const vm = this;
    vm.kpiData = null;
    vm.loading = true;
    vm.error = null;
    vm.lastUpdated = null;
    vm.refreshKPIs = refreshKPIs;
    init();
    function init() {
      loadKPIs();
      const refreshInterval = DashboardRefreshFactory.startAutoRefresh(loadKPIs);
      $scope.$on('$destroy', function() {
        DashboardRefreshFactory.stopAutoRefresh(refreshInterval);
      });
    }
    function loadKPIs() {
      vm.loading = true;
      vm.error = null;
      KPIService.fetchKPIs()
        .then(function(data) {
          vm.kpiData = data;
          vm.lastUpdated = new Date();
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
    }
    function refreshKPIs() {
      loadKPIs();
    }
  }
})();