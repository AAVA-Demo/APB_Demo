(function() {
  'use strict';
  angular.module('dashboard.module')
    .controller('DashboardController', ['$scope', '$interval', 'DashboardService', 'AuthService', function($scope, $interval, DashboardService, AuthService) {
      const vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      let refreshInterval = null;
      vm.init = function() {
        AuthService.validateSession().then(function(session) {
          vm.loadKPIs();
          refreshInterval = $interval(function() {
            DashboardService.clearCache();
            vm.loadKPIs();
          }, 30000);
        }).catch(function(err) {
          vm.error = 'Authentication failed. Please login.';
          vm.loading = false;
        });
      };
      vm.loadKPIs = function() {
        vm.loading = true;
        vm.error = null;
        DashboardService.getKPIs().then(function(data) {
          vm.kpis = data;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
      };
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
      vm.init();
    }]);
})();