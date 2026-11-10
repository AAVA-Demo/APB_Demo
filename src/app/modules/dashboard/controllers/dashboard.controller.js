(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['DashboardService', 'RefreshService', '$scope', function(DashboardService, RefreshService, $scope) {
      var vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      vm.userId = 'user123';

      vm.loadKPIs = function() {
        vm.loading = true;
        vm.error = null;
        DashboardService.getKPIs(vm.userId)
          .then(function(data) {
            vm.kpis = data;
            vm.loading = false;
          })
          .catch(function(err) {
            vm.error = 'Failed to load dashboard data';
            vm.loading = false;
            console.error('Dashboard error:', err);
          });
      };

      vm.loadKPIs();

      RefreshService.start(function() {
        vm.loadKPIs();
      });

      $scope.$on('$destroy', function() {
        RefreshService.stop();
      });
    }]);
})();