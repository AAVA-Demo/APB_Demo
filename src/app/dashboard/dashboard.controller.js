(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .controller('DashboardController', ['KPIService', 'RefreshService', 'AuthService', '$scope', function(KPIService, RefreshService, AuthService, $scope) {
      var vm = this;
      vm.kpis = {};
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        var userId = AuthService.getUserId();
        vm.loadKPIs(userId);
        RefreshService.startAutoRefresh(userId, function(updatedKPIs) {
          vm.kpis = updatedKPIs;
          $scope.$apply();
        }, 600000);
      };
      vm.loadKPIs = function(userId) {
        vm.loading = true;
        KPIService.getDashboardKPIs(userId)
          .then(function(data) {
            vm.kpis = data;
            vm.loading = false;
          })
          .catch(function(err) {
            vm.error = 'Failed to load dashboard data';
            vm.loading = false;
            toastr.error('Failed to load dashboard data');
          });
      };
      $scope.$on('$destroy', function() {
        RefreshService.stopAutoRefresh();
      });
      vm.init();
    }]);
})();