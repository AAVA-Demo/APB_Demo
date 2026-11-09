(function() {
  'use strict';
  angular.module('dashboardModule')
    .controller('DashboardController', ['$scope', '$interval', 'KpiService', 'RefreshService', function($scope, $interval, KpiService, RefreshService) {
      var vm = this;
      vm.kpis = {};
      vm.loading = true;
      vm.error = null;
      vm.lastRefreshed = null;
      vm.userId = 'user123';
      vm.refreshKpis = function() {
        vm.loading = true;
        vm.error = null;
        KpiService.getKpis(vm.userId).then(function(data) {
          vm.kpis = data;
          vm.lastRefreshed = new Date();
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load KPI data. Please try again.';
          vm.loading = false;
        });
      };
      vm.refreshKpis();
      var refreshInterval = RefreshService.startAutoRefresh(function() {
        vm.refreshKpis();
      }, 60000);
      $scope.$on('$destroy', function() {
        RefreshService.stopAutoRefresh(refreshInterval);
      });
    }]);
})();