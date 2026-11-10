(function() {
  'use strict';
  angular.module('dashboardModule')
    .controller('DashboardController', ['$scope', '$interval', 'KPIAggregationService', function($scope, $interval, KPIAggregationService) {
      const vm = this;
      vm.kpiData = {};
      vm.loading = true;
      vm.error = null;
      function loadKPIData() {
        vm.loading = true;
        KPIAggregationService.fetchKPIData().then(function(data) {
          vm.kpiData = data;
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load KPI data';
          vm.loading = false;
        });
      }
      loadKPIData();
      const refreshInterval = $interval(loadKPIData, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
      vm.refresh = function() {
        loadKPIData();
      };
    }]);
})();