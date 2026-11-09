(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .controller('DashboardController', ['DashboardService', '$scope', '$interval', function(DashboardService, $scope, $interval) {
      var vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      function loadKPIs() {
        vm.loading = true;
        vm.error = null;
        DashboardService.getKPIs().then(function(kpis) {
          vm.kpis = kpis;
          vm.loading = false;
        }).catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
      }
      loadKPIs();
      var refreshInterval = $interval(function() {
        loadKPIs();
      }, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();