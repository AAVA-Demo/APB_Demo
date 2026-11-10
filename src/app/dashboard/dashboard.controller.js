(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'KpiService', function($scope, $interval, KpiService) {
      var vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      vm.refresh = refresh;
      var refreshInterval;
      init();
      function init() {
        loadKpis();
        refreshInterval = $interval(function() {
          loadKpis();
        }, 300000);
        $scope.$on('$destroy', function() {
          if (refreshInterval) {
            $interval.cancel(refreshInterval);
          }
        });
      }
      function loadKpis() {
        vm.loading = true;
        vm.error = null;
        KpiService.getKpis()
          .then(function(data) {
            vm.kpis = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data. Please try again.';
            vm.loading = false;
          });
      }
      function refresh() {
        KpiService.clearCache();
        loadKpis();
      }
    }]);
})();