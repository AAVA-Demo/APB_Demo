(function() {
  'use strict';
  angular.module('dashboardModule')
    .controller('DashboardController', ['$scope', '$interval', 'CreditCardDataService', 'AuthService', function($scope, $interval, CreditCardDataService, AuthService) {
      var vm = this;
      vm.kpis = {};
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      var refreshInterval;
      function loadDashboardData() {
        vm.loading = true;
        AuthService.validateSession().then(function() {
          return CreditCardDataService.getDashboardData();
        }).then(function(data) {
          vm.kpis = {
            monthlySpend: data.monthlySpend || 0,
            totalCreditLimit: data.totalCreditLimit || 0,
            availableCredit: data.availableCredit || 0,
            outstandingAmount: data.outstandingAmount || 0,
            utilizationPercentage: data.utilizationPercentage || 0
          };
          vm.cards = data.cards || [];
          vm.loading = false;
          vm.error = null;
        }).catch(function(error) {
          vm.error = 'Failed to load dashboard data';
          vm.loading = false;
        });
      }
      loadDashboardData();
      refreshInterval = $interval(function() {
        loadDashboardData();
      }, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();