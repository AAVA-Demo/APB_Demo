(function() {
  'use strict';
  angular.module('creditCard.dashboardModule')
    .controller('DashboardController', ['KPIAggregationService', '$scope', '$interval', function(KPIAggregationService, $scope, $interval) {
      var vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      function loadKPIs() {
        vm.loading = true;
        KPIAggregationService.fetchKPIs()
          .then(function(data) {
            vm.kpis = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load KPIs';
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