(function() {
  'use strict';
  angular.module('app.analytics')
    .controller('AnalyticsController', ['AnalyticsEngineService', 'TransactionCategorizationService', '$scope', AnalyticsController]);
  function AnalyticsController(AnalyticsEngineService, TransactionCategorizationService, $scope) {
    var vm = this;
    vm.categoryData = [];
    vm.trendData = [];
    vm.loading = true;
    vm.error = null;
    vm.viewMode = 'category';
    vm.switchView = switchView;
    activate();
    function activate() {
      loadAnalytics();
    }
    function loadAnalytics() {
      vm.loading = true;
      vm.error = null;
      TransactionCategorizationService.getCategorizedTransactions()
        .then(function(transactions) {
          if (vm.viewMode === 'category') {
            return AnalyticsEngineService.computeCategorySpending(transactions);
          } else {
            return AnalyticsEngineService.computeMonthlyTrends(transactions);
          }
        })
        .then(function(data) {
          if (vm.viewMode === 'category') {
            vm.categoryData = data;
          } else {
            vm.trendData = data;
          }
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
    }
    function switchView(mode) {
      vm.viewMode = mode;
      loadAnalytics();
    }
  }
})();