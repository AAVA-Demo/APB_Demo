(function() {
  'use strict';
  angular.module('app.dashboard')
    .controller('DashboardController', ['$scope', '$q', '$interval', 'CreditCardService', 'TransactionService', 'KPICalculator', function($scope, $q, $interval, CreditCardService, TransactionService, KPICalculator) {
      var vm = this;
      vm.kpi = {};
      vm.loading = true;
      vm.error = null;

      function loadDashboard() {
        vm.loading = true;
        vm.error = null;
        $q.all([
          CreditCardService.getCards(),
          TransactionService.getMonthlyTransactions()
        ])
        .then(function(results) {
          var cards = results[0];
          var transactions = results[1];
          vm.kpi = KPICalculator.compute(cards, transactions);
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load dashboard data. Please try again.';
          vm.loading = false;
          vm.kpi = { monthlySpend: 0, totalCreditLimit: 0, availableCredit: 0, outstandingAmount: 0, lastUpdated: new Date() };
        });
      }

      loadDashboard();
      var refreshInterval = $interval(loadDashboard, 30000);
      $scope.$on('$destroy', function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
        }
      });
    }]);
})();