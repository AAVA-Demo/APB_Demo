(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'KPIService', 'AuthService', function($scope, $interval, KPIService, AuthService) {
      var vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      var refreshInterval;
      function loadKPIs() {
        vm.loading = true;
        var userId = AuthService.getUserId();
        KPIService.getKPIs(userId).then(function(data) {
          vm.kpis = data;
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
      }
      vm.refresh = function() {
        loadKPIs();
      };
      loadKPIs();
      refreshInterval = $interval(function() {
        loadKPIs();
      }, 300000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();