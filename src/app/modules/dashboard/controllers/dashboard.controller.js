(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'KPIService', function($scope, $interval, KPIService) {
      var vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      function loadKPIs() {
        vm.loading = true;
        KPIService.getKPIs()
          .then(function(data) {
            vm.kpis = data;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(err) {
            vm.error = 'Failed to load KPI data';
            vm.loading = false;
            $scope.$apply();
          });
      }
      loadKPIs();
      var refreshInterval = $interval(function() {
        loadKPIs();
      }, 60000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();