(function() {
  'use strict';
  angular.module('dashboardModule').controller('DashboardController', ['KpiAggregationService', '$scope', '$interval', function(KpiAggregationService, $scope, $interval) {
    var vm = this;
    vm.kpis = null;
    vm.loading = true;
    vm.error = null;
    var refreshInterval;
    vm.loadKpis = function() {
      vm.loading = true;
      vm.error = null;
      KpiAggregationService.getKpis().then(function(data) {
        vm.kpis = data;
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load dashboard data. Please try again.';
        vm.loading = false;
        vm.kpis = {
          monthlySpend: 0,
          totalCreditLimit: 0,
          availableCredit: 0,
          outstandingAmount: 0,
          lastUpdated: new Date()
        };
      });
    };
    vm.loadKpis();
    refreshInterval = $interval(function() {
      vm.loadKpis();
    }, 60000);
    $scope.$on('$destroy', function() {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
      }
    });
  }]);
})();