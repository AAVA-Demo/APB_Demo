(function() {
  'use strict';
  angular.module('dashboardModule')
    .controller('DashboardController', ['KPIService', '$scope', '$interval', function(KPIService, $scope, $interval) {
      var vm = this;
      vm.kpiData = {};
      vm.loading = true;
      vm.lastUpdated = null;
      vm.loadKPIData = function() {
        vm.loading = true;
        KPIService.getKPIData().then(function(data) {
          vm.kpiData = data;
          vm.lastUpdated = new Date();
          vm.loading = false;
          $scope.$apply();
        }).catch(function(error) {
          console.error('Error loading KPI data:', error);
          vm.loading = false;
          $scope.$apply();
        });
      };
      var refreshInterval = $interval(function() {
        vm.loadKPIData();
      }, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
      vm.loadKPIData();
    }]);
})();