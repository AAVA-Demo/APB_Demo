(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'DashboardService', 'RefreshFactory', function($scope, $interval, DashboardService, RefreshFactory) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.kpiData = null;
      vm.lastUpdated = null;
      vm.refreshInterval = null;
      vm.init = function() {
        vm.loadKPIData();
        vm.refreshInterval = RefreshFactory.startAutoRefresh(function() {
          vm.loadKPIData(true);
        }, 60000);
      };
      vm.loadKPIData = function(skipCache) {
        vm.loading = true;
        vm.error = null;
        DashboardService.getKPIData('user-123', skipCache)
          .then(function(data) {
            vm.kpiData = data;
            vm.lastUpdated = new Date();
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data. Please try again.';
            vm.loading = false;
            $scope.$apply();
          });
      };
      vm.manualRefresh = function() {
        vm.loadKPIData(true);
      };
      $scope.$on('$destroy', function() {
        if (vm.refreshInterval) {
          $interval.cancel(vm.refreshInterval);
        }
      });
      vm.init();
    }]);
})();