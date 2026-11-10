(function() {
  'use strict';
  angular.module('dashboard')
    .controller('DashboardController', ['$scope', 'DashboardService', 'AutoRefreshService', 'NotificationService', function($scope, DashboardService, AutoRefreshService, NotificationService) {
      var vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      function loadKPIs() {
        vm.loading = true;
        DashboardService.getKPIs()
          .then(function(data) {
            vm.kpis = data;
            vm.loading = false;
            vm.error = null;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard KPIs. Please try again.';
            vm.loading = false;
            NotificationService.error(vm.error);
          });
      }
      loadKPIs();
      AutoRefreshService.start(function() {
        DashboardService.getKPIs()
          .then(function(data) {
            vm.kpis = data;
          });
      }, 60000);
      $scope.$on('$destroy', function() {
        AutoRefreshService.stop();
      });
      vm.retry = function() {
        loadKPIs();
      };
    }]);
})();