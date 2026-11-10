(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['DashboardService', 'RefreshFactory', '$scope', function(DashboardService, RefreshFactory, $scope) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.dashboardKPI = null;
      
      vm.loadKPIs = function() {
        vm.loading = true;
        vm.error = null;
        DashboardService.getKPIs()
          .then(function(data) {
            vm.dashboardKPI = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data. Please try again.';
            vm.loading = false;
          });
      };
      
      vm.loadKPIs();
      RefreshFactory.startPolling(30000, vm.loadKPIs);
      
      $scope.$on('$destroy', function() {
        RefreshFactory.stopPolling();
      });
      
      $scope.$on('dataRefreshed', function() {
        vm.loadKPIs();
      });
    }]);
})();