(function() {
  'use strict';
  angular.module('app.dashboard').controller('DashboardController', ['KPIService', 'AuthService', '$scope', function(KPIService, AuthService, $scope) {
    var vm = this;
    vm.loading = true;
    vm.dashboardData = null;
    vm.error = null;
    vm.init = function() {
      var userId = AuthService.getUserId();
      vm.loadDashboard(userId);
    };
    vm.loadDashboard = function(userId) {
      vm.loading = true;
      KPIService.loadDashboardData(userId).then(function(data) {
        vm.dashboardData = data;
        vm.loading = false;
      }).catch(function(err) {
        vm.error = 'Failed to load dashboard data';
        vm.loading = false;
      });
    };
    vm.refresh = function() {
      var userId = AuthService.getUserId();
      KPIService.clearCache(userId);
      vm.loadDashboard(userId);
    };
    vm.init();
  }]);
})();