(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['KPIService', '$scope', '$interval', DashboardController]);
  function DashboardController(KPIService, $scope, $interval) {
    var vm = this;
    vm.kpis = null;
    vm.loading = true;
    vm.error = null;
    vm.lastUpdated = null;
    var refreshInterval;
    vm.init = function() {
      vm.loadKPIs();
      refreshInterval = $interval(function() {
        vm.loadKPIs();
      }, 30000);
    };
    vm.loadKPIs = function() {
      vm.loading = true;
      vm.error = null;
      var userId = 'user123';
      KPIService.getAggregatedKPIs(userId)
        .then(function(data) {
          vm.kpis = data;
          vm.lastUpdated = new Date();
          vm.loading = false;
          $scope.$apply();
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data';
          vm.loading = false;
          toastr.error('Unable to fetch KPI data', 'Error');
          $scope.$apply();
        });
    };
    $scope.$on('$destroy', function() {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
      }
    });
    vm.init();
  }
})();