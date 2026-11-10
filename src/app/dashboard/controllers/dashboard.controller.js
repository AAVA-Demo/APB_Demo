(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['DashboardAggregationService', '$scope', '$interval', function(DashboardAggregationService, $scope, $interval) {
      const vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      vm.lastUpdated = null;
      vm.refreshKPIs = function() {
        vm.loading = true;
        DashboardAggregationService.fetchKPIs()
          .then(function(kpis) {
            vm.kpis = kpis;
            vm.lastUpdated = new Date();
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(err) {
            vm.error = 'Failed to load dashboard data. Please try again.';
            vm.loading = false;
            console.error('Dashboard error:', err);
          });
      };
      vm.refreshKPIs();
      const refreshInterval = $interval(vm.refreshKPIs, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();