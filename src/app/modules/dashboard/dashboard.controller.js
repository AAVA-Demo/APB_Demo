(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .controller('DashboardController', ['DashboardService', '$scope', '$interval', function(DashboardService, $scope, $interval) {
      var vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      var refreshInterval;
      vm.loadKpis = function() {
        vm.loading = true;
        DashboardService.loadKpis().then(function(data) {
          vm.kpis = data;
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load dashboard data';
          vm.loading = false;
          console.error('Dashboard load error:', error);
        });
      };
      vm.refresh = function() {
        vm.loadKpis();
      };
      vm.loadKpis();
      refreshInterval = $interval(function() {
        vm.loadKpis();
      }, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();