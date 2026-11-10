(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'dashboardOrchestrationService', function($scope, $interval, dashboardOrchestrationService) {
      var vm = this;
      vm.kpis = {};
      vm.loading = true;
      vm.error = null;
      function loadKPIs() {
        vm.loading = true;
        dashboardOrchestrationService.getKPIs().then(function(data) {
          vm.kpis = data;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load dashboard data';
          vm.loading = false;
        });
      }
      loadKPIs();
      var refreshInterval = $interval(loadKPIs, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();