(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .controller('DashboardController', ['$scope', '$interval', 'CreditCardService', 'TransactionService', 'KPICalculator', function($scope, $interval, CreditCardService, TransactionService, KPICalculator) {
      var vm = this;
      vm.kpis = {};
      vm.cards = [];
      vm.loading = true;
      vm.error = null;
      vm.loadDashboard = function() {
        vm.loading = true;
        vm.error = null;
        Promise.all([
          CreditCardService.getCards(),
          TransactionService.getSummary()
        ]).then(function(results) {
          vm.cards = results[0];
          var summary = results[1];
          vm.kpis = KPICalculator.calculate(vm.cards, summary);
          vm.loading = false;
          $scope.$apply();
        }).catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
          $scope.$apply();
        });
      };
      vm.loadDashboard();
      var refreshInterval = $interval(function() {
        vm.loadDashboard();
      }, 60000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();