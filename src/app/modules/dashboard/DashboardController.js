(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .controller('DashboardController', ['DashboardService', '$scope', '$interval', function(DashboardService, $scope, $interval) {
      const vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      function loadKPIs() {
        vm.loading = true;
        DashboardService.getKPIs()
          .then(function(kpis) {
            vm.kpis = kpis;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data';
            vm.loading = false;
          });
      }
      loadKPIs();
      const refreshInterval = $interval(loadKPIs, 60000);
      $scope.$on('$destroy', function() {
        $interval.cancel(refreshInterval);
      });
    }]);
})();