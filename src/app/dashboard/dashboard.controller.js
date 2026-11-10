(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'DashboardService', function($scope, $interval, DashboardService) {
      var vm = this;
      vm.dashboard = { kpis: {}, cards: [], loading: true, error: null };
      function loadData() {
        vm.dashboard.loading = true;
        DashboardService.loadKPIs().then(function(data) {
          vm.dashboard.kpis = data.kpis;
          vm.dashboard.cards = data.cards;
          vm.dashboard.loading = false;
        }).catch(function(error) {
          vm.dashboard.error = 'Failed to load dashboard data. Please try again.';
          vm.dashboard.loading = false;
        });
      }
      loadData();
      var refreshInterval = $interval(function() {
        loadData();
      }, 45000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();