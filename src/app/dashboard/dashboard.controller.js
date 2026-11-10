(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['KPICalculationService', 'DataRefreshService', '$scope', function(KPICalculationService, DataRefreshService, $scope) {
      var vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      vm.loadKPIs = function() {
        vm.loading = true;
        KPICalculationService.calculateKPIs().then(function(kpis) {
          vm.kpis = kpis;
          vm.loading = false;
        }, function(error) {
          vm.error = 'Failed to load KPIs';
          vm.loading = false;
        });
      };
      vm.loadKPIs();
      var refreshInterval = DataRefreshService.startRefresh(function(kpis) {
        vm.kpis = kpis;
        $scope.$apply();
      });
      $scope.$on('$destroy', function() {
        DataRefreshService.stopRefresh();
      });
    }]);
})();