(function() {
  'use strict';
  angular.module('dashboard.kpiModule')
    .controller('DashboardKpiController', ['$scope', '$interval', 'KpiDataService', 'AuthService', function($scope, $interval, KpiDataService, AuthService) {
      var vm = this;
      vm.kpiMetrics = {};
      vm.loading = true;
      vm.error = null;
      var refreshInterval;
      vm.init = function() {
        AuthService.validateSession()
          .then(function() {
            var userId = AuthService.getUserId();
            vm.loadKpiData(userId);
            refreshInterval = $interval(function() {
              vm.loadKpiData(userId);
            }, 30000);
          })
          .catch(function(error) {
            vm.error = 'Authentication failed';
            vm.loading = false;
          });
      };
      vm.loadKpiData = function(userId) {
        KpiDataService.getKpiMetrics(userId)
          .then(function(data) {
            vm.kpiMetrics = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load KPI data';
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