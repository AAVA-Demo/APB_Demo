(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'DashboardService', function($scope, $interval, DashboardService) {
      var vm = this;
      vm.kpis = {};
      vm.loading = true;
      vm.error = null;
      vm.lastUpdated = null;
      function loadKPIs() {
        vm.loading = true;
        DashboardService.getKPIs()
          .then(function(data) {
            vm.kpis = data;
            vm.loading = false;
            vm.error = null;
            vm.lastUpdated = new Date();
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data';
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
      vm.refresh = function() {
        loadKPIs();
      };
    }]);
})();