(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'KPIService', 'CreditCardService', 'UserProfileService', function($scope, $interval, KPIService, CreditCardService, UserProfileService) {
      var vm = this;
      vm.loading = true;
      vm.error = null;
      vm.kpis = {};
      vm.currentUser = UserProfileService.getCurrentUser();
      vm.init = function() {
        vm.loadKPIs();
        var refreshInterval = $interval(function() {
          vm.loadKPIs();
        }, 30000);
        $scope.$on('$destroy', function() {
          $interval.cancel(refreshInterval);
        });
      };
      vm.loadKPIs = function() {
        vm.loading = true;
        KPIService.getKPIs(vm.currentUser.userId)
          .then(function(data) {
            vm.kpis = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load dashboard data. Please try again.';
            vm.loading = false;
            toastr.error('Failed to load dashboard data');
          });
      };
      vm.formatCurrency = function(value) {
        return '$' + (value || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      };
      vm.init();
    }]);
})();