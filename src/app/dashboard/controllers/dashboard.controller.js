(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'DashboardService', DashboardController]);

  function DashboardController($scope, $interval, DashboardService) {
    var vm = this;
    vm.kpis = null;
    vm.loading = true;
    vm.error = null;
    vm.lastUpdated = null;
    vm.refresh = refresh;

    activate();

    function activate() {
      loadKPIs();
      var refreshInterval = $interval(function() {
        loadKPIs(true);
      }, 5 * 60 * 1000);
      $scope.$on('$destroy', function() {
        $interval.cancel(refreshInterval);
      });
    }

    function loadKPIs(forceRefresh) {
      vm.loading = true;
      vm.error = null;
      DashboardService.getKPIs(forceRefresh)
        .then(function(kpis) {
          vm.kpis = kpis;
          vm.lastUpdated = kpis.lastRefreshTime;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
    }

    function refresh() {
      loadKPIs(true);
    }
  }
  DashboardController.$inject = ['$scope', '$interval', 'DashboardService'];
})();