(function() {
  'use strict';
  angular.module('dashboardModule')
    .controller('DashboardController', ['$scope', 'DashboardApiService', 'AuthService', function($scope, DashboardApiService, AuthService) {
      const vm = this;
      vm.kpis = {};
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        if (!AuthService.isAuthenticated()) {
          vm.error = 'Please authenticate to view dashboard';
          vm.loading = false;
          return;
        }
        DashboardApiService.fetchDashboardData().then(function(kpiData) {
          vm.kpis = kpiData;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load dashboard data';
          vm.loading = false;
        });
      };
      vm.refreshData = function() {
        vm.loading = true;
        vm.error = null;
        vm.init();
      };
      vm.init();
    }]);
})();