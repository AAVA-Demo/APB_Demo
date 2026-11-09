(function() {
  'use strict';
  angular.module('cc.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'DashboardService', 'DataSyncService', 'REFRESH_INTERVAL', DashboardController]);
  function DashboardController($scope, $interval, DashboardService, DataSyncService, REFRESH_INTERVAL) {
    var vm = this;
    vm.kpis = {
      monthlySpend: 0,
      totalCreditLimit: 0,
      totalAvailableCredit: 0,
      totalOutstanding: 0
    };
    vm.loading = true;
    vm.error = null;
    vm.loadKpis = function() {
      vm.loading = true;
      vm.error = null;
      DashboardService.loadKpis()
        .then(function(kpis) {
          vm.kpis = kpis;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Unable to load dashboard data. Please try again.';
          vm.loading = false;
        });
    };
    vm.loadKpis();
    var syncInterval = $interval(function() {
      DataSyncService.refreshKpis().then(function(kpis) {
        vm.kpis = kpis;
      });
    }, REFRESH_INTERVAL);
    $scope.$on('$destroy', function() {
      if (syncInterval) {
        $interval.cancel(syncInterval);
      }
    });
  }
})();