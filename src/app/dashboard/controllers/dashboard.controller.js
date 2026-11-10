(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'DashboardService', function($scope, $interval, DashboardService) {
      var vm = this;
      vm.kpis = {};
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.loadDashboard = function() {
        vm.loading = true;
        vm.error = null;
        DashboardService.getKPIs()
          .then(function(data) {
            vm.kpis = data.kpis;
            vm.cards = data.cards;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data. Please try again.';
            vm.loading = false;
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