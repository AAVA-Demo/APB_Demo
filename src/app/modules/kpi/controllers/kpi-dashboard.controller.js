(function() {
  'use strict';
  angular.module('creditCardApp.kpi').controller('KpiDashboardController', ['KpiService', '$scope', '$interval', function(KpiService, $scope, $interval) {
    var vm = this;
    vm.kpiData = null;
    vm.loading = true;
    vm.error = null;
    var refreshInterval;
    vm.init = function() {
      vm.loadKpiData();
      refreshInterval = $interval(function() {
        vm.loadKpiData();
      }, 30000);
    };
    vm.loadKpiData = function() {
      var userId = 'user123';
      KpiService.getKpiData(userId).then(function(kpiData) {
        vm.kpiData = kpiData;
        vm.loading = false;
        vm.error = null;
      }).catch(function(error) {
        vm.error = 'Failed to load KPI data. Please try again.';
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
  KpiDashboardController.$inject = ['KpiService', '$scope', '$interval'];
})();