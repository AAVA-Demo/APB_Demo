(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'DashboardService', 'AuthService', function($scope, $interval, DashboardService, AuthService) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.dashboardData = null;
      vm.loadDashboard = function() {
        vm.loading = true;
        vm.error = null;
        var userId = AuthService.getUserId();
        DashboardService.getDashboardData(userId)
          .then(function(data) {
            vm.dashboardData = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data';
            vm.loading = false;
            console.error(error);
          });
      };
      vm.loadDashboard();
      var refreshInterval = $interval(function() {
        vm.loadDashboard();
      }, 60000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();