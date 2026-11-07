(function() {
  'use strict';
  angular.module('ccDashboardModule').controller('DashboardController', ['$scope', '$interval', 'DashboardService', 'AuthService', function($scope, $interval, DashboardService, AuthService) {
    var vm = this;
    vm.kpis = null;
    vm.cards = [];
    vm.loading = true;
    vm.error = null;
    var refreshInterval;
    vm.init = function() {
      vm.loadDashboard();
      refreshInterval = $interval(function() {
        vm.loadDashboard();
      }, 60000);
    };
    vm.loadDashboard = function() {
      vm.loading = true;
      DashboardService.loadDashboard().then(function(data) {
        vm.kpis = data.kpis;
        vm.cards = data.cards;
        vm.loading = false;
        vm.error = null;
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data';
        vm.loading = false;
      });
    };
    $scope.$on('$destroy', function() {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
      }
    });
    vm.init();
  }]);
})();