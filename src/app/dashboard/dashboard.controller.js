(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'KPIService', function($scope, $interval, KPIService) {
      var vm = this;
      vm.kpiData = {};
      vm.loading = true;
      vm.error = null;
      vm.lastUpdated = null;
      function loadKPIs() {
        vm.loading = true;
        KPIService.getKPIs().then(function(data) {
          vm.kpiData = data;
          vm.lastUpdated = new Date();
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load dashboard data';
          vm.loading = false;
          console.error('KPI load error:', error);
        });
      }
      loadKPIs();
      var refreshInterval = $interval(loadKPIs, 300000);
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