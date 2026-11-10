(function() {
  'use strict';
  angular.module('dashboardModule').controller('DashboardController', ['$scope', '$interval', 'DashboardService', 'AuthService', function($scope, $interval, DashboardService, AuthService) {
    const vm = this;
    vm.loading = true;
    vm.kpis = null;
    vm.refreshInterval = null;
    vm.init = function() {
      AuthService.verifyAuth().then(function(authResult) {
        if (authResult.valid) {
          vm.loadDashboard();
          vm.setupAutoRefresh();
        }
      });
    };
    vm.loadDashboard = function() {
      vm.loading = true;
      DashboardService.loadKPIs().then(function(kpis) {
        vm.kpis = kpis;
        vm.loading = false;
        $scope.$apply();
      }).catch(function(error) {
        vm.loading = false;
        console.error('Error loading KPIs:', error);
        $scope.$apply();
      });
    };
    vm.setupAutoRefresh = function() {
      vm.refreshInterval = $interval(function() {
        vm.loadDashboard();
      }, 60000);
    };
    vm.manualRefresh = function() {
      vm.loadDashboard();
    };
    $scope.$on('$destroy', function() {
      if (vm.refreshInterval) {
        $interval.cancel(vm.refreshInterval);
      }
    });
    vm.init();
  }]);
})();