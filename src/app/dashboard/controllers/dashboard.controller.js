(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'DashboardService', 'AuthService', function($scope, $interval, DashboardService, AuthService) {
      const vm = this;
      vm.loading = true;
      vm.kpis = {};
      vm.cards = [];
      vm.lastUpdated = null;
      const userId = AuthService.getUserId();
      function loadKPIs(forceRefresh) {
        vm.loading = true;
        DashboardService.getKPIs(userId, forceRefresh).then(function(data) {
          vm.kpis = data.kpis;
          vm.cards = data.cards;
          vm.lastUpdated = data.lastUpdated;
          vm.loading = false;
        }).catch(function(error) {
          vm.loading = false;
          toastr.error('Failed to load dashboard data');
        });
      }
      loadKPIs(false);
      const refreshInterval = $interval(function() {
        loadKPIs(true);
      }, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
      vm.refresh = function() {
        loadKPIs(true);
      };
    }]);
})();