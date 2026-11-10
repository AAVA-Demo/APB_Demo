(function() {
  'use strict';
  angular.module('dashboard')
    .controller('DashboardController', ['DashboardService', 'AuthService', '$scope', '$interval', function(DashboardService, AuthService, $scope, $interval) {
      var vm = this;
      vm.kpis = {};
      vm.loading = true;
      vm.error = null;
      function loadKPIs() {
        var userId = AuthService.getUserId();
        DashboardService.getKPIs(userId)
          .then(function(data) {
            vm.kpis = data;
            vm.loading = false;
          })
          .catch(function(error) {
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