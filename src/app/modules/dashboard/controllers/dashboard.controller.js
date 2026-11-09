(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', 'DashboardService', 'RefreshService', function($scope, DashboardService, RefreshService) {
      var vm = this;
      vm.kpis = {};
      vm.loading = true;
      vm.error = null;

      vm.init = function() {
        vm.loadKPIs();
        RefreshService.startPolling(function(data) {
          vm.kpis = data;
          $scope.$apply();
        });
      };

      vm.loadKPIs = function() {
        vm.loading = true;
        vm.error = null;
        DashboardService.getKPIs().then(function(data) {
          vm.kpis = data;
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load dashboard data';
          vm.loading = false;
        });
      };

      vm.refresh = function() {
        DashboardService.clearCache();
        vm.loadKPIs();
      };

      $scope.$on('$destroy', function() {
        RefreshService.stopPolling();
      });

      vm.init();
    }]);
})();