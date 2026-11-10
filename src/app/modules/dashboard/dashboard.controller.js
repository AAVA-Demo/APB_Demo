(function() {
  'use strict';
  angular.module('app.dashboard').controller('DashboardController', ['$scope', '$interval', 'CreditCardService', 'TransactionService', 'KPICalculator', function($scope, $interval, CreditCardService, TransactionService, KPICalculator) {
    var vm = this;
    vm.kpiData = {};
    vm.loading = true;
    vm.error = null;
    var refreshInterval;

    function loadDashboardData() {
      vm.loading = true;
      vm.error = null;
      var cardsPromise = CreditCardService.getCards();
      var spendPromise = TransactionService.getMonthlySpend();
      Promise.all([cardsPromise, spendPromise]).then(function(results) {
        var cards = results[0];
        var monthlySpend = results[1];
        vm.kpiData = KPICalculator.aggregate(cards, monthlySpend);
        vm.loading = false;
        $scope.$apply();
      }).catch(function(error) {
        vm.error = 'Failed to load dashboard data. Please try again.';
        vm.loading = false;
        $scope.$apply();
      });
    }

    vm.$onInit = function() {
      loadDashboardData();
      refreshInterval = $interval(function() {
        loadDashboardData();
      }, 30000);
    };

    $scope.$on('$destroy', function() {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
      }
    });
  }]);
})();