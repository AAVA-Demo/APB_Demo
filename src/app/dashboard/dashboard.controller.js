(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', DashboardController);
  DashboardController.$inject = ['KPIService', '$scope', '$interval'];
  function DashboardController(KPIService, $scope, $interval) {
    var vm = this;
    vm.kpis = {};
    vm.loading = true;
    vm.error = null;
    vm.lastUpdated = null;
    vm.refreshKPIs = refreshKPIs;
    activate();
    function activate() {
      loadKPIs();
      var refreshInterval = $interval(function() {
        loadKPIs();
      }, 300000);
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
          vm.lastUpdated = data.lastUpdated;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
        });
    }
    function refreshKPIs() {
      loadKPIs();
    }
  }
})();