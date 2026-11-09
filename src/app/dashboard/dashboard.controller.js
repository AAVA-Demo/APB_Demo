(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', DashboardController);
  DashboardController.$inject = ['$scope', 'DashboardService', 'AuthFactory'];
  function DashboardController($scope, DashboardService, AuthFactory) {
    var vm = this;
    vm.kpiData = null;
    vm.loading = true;
    vm.error = null;
    function init() {
      if (!AuthFactory.validateSession()) {
        vm.error = 'Please log in to view dashboard';
        vm.loading = false;
        return;
      }
      DashboardService.getKPIs()
        .then(function(data) {
          vm.kpiData = data;
          vm.loading = false;
        })
        .catch(function(err) {
          vm.error = 'Failed to load dashboard data';
          vm.loading = false;
        });
    }
    init();
  }
})();