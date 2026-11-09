(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .controller('DashboardController', ['KPIService', '$scope', '$interval', DashboardController]);
  function DashboardController(KPIService, $scope, $interval) {
    var vm = this;
    vm.kpis = null;
    vm.loading = true;
    vm.error = null;
    vm.refresh = refresh;
    activate();
    function activate() {
      loadKPIs();
      var refreshInterval = $interval(function() {
        loadKPIs();
      }, 30000);
      $scope.$on('$destroy', function() {
        $interval.cancel(refreshInterval);
      });
    }
    function loadKPIs() {
      vm.loading = true;
      vm.error = null;
      KPIService.getKPIs()
        .then(function(data) {
          vm.kpis = data;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
    }
    function refresh() {
      loadKPIs();
    }
  }
})();