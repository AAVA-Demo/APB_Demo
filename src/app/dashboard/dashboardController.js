(function() {
  'use strict';
  angular.module('creditCardApp').controller('dashboardController', ['creditCardDataService', 'transactionProcessingService', 'kpiCalculationFactory', 'dataAggregationService', '$scope', '$timeout', function(creditCardDataService, transactionProcessingService, kpiCalculationFactory, dataAggregationService, $scope, $timeout) {
    const vm = this;
    vm.kpiData = null;
    vm.loading = true;
    vm.error = null;
    let refreshTimeout;
    vm.init = function() {
      loadDashboardData();
    };
    function loadDashboardData() {
      vm.loading = true;
      vm.error = null;
      const cardPromise = creditCardDataService.getCreditCardData();
      const transactionPromise = transactionProcessingService.getMonthlyTransactions();
      Promise.all([cardPromise, transactionPromise]).then(function(results) {
        const cardData = results[0];
        const transactionData = results[1];
        const metrics = kpiCalculationFactory.calculateKPIs(cardData, transactionData);
        vm.kpiData = dataAggregationService.consolidateKPIs(metrics);
        vm.loading = false;
        $scope.$apply();
        scheduleRefresh();
      }).catch(function(error) {
        console.error('Error loading dashboard data:', error);
        vm.error = 'Failed to load dashboard data. Please try again.';
        vm.loading = false;
        $scope.$apply();
      });
    }
    function scheduleRefresh() {
      if (refreshTimeout) {
        $timeout.cancel(refreshTimeout);
      }
      refreshTimeout = $timeout(function() {
        loadDashboardData();
      }, 30000);
    }
    $scope.$on('$destroy', function() {
      if (refreshTimeout) {
        $timeout.cancel(refreshTimeout);
      }
    });
    vm.init();
  }]);
})();