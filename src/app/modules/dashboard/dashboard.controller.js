(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['KPIService', '$scope', '$interval', function(KPIService, $scope, $interval) {
      const vm = this;
      vm.kpis = {};
      vm.loading = true;
      vm.loadKPIs = function() {
        KPIService.getKPIs().then(function(data) {
          vm.kpis = data;
          vm.loading = false;
        }).catch(function(error) {
          console.error('Error loading KPIs:', error);
          vm.loading = false;
        });
      };
      vm.loadKPIs();
      const refreshInterval = $interval(function() {
        vm.loadKPIs();
      }, 60000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();