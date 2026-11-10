(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .controller('DashboardController', ['DataAggregationService', 'AuthService', '$scope', '$interval', function(DataAggregationService, AuthService, $scope, $interval) {
      var vm = this;
      vm.kpis = null;
      vm.loading = true;
      vm.error = null;
      function loadKPIs() {
        AuthService.validateUser()
          .then(function(user) {
            return DataAggregationService.getConsolidatedKPIs(user.userId);
          })
          .then(function(kpis) {
            vm.kpis = kpis;
            vm.loading = false;
            $scope.$apply();
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data';
            vm.loading = false;
            $scope.$apply();
          });
      }
      loadKPIs();
      var refreshInterval = $interval(function() {
        AuthService.validateUser()
          .then(function(user) {
            return DataAggregationService.getConsolidatedKPIs(user.userId);
          })
          .then(function(kpis) {
            vm.kpis = kpis;
          });
      }, 60000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();