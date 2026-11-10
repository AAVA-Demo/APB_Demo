(function() {
  'use strict';
  angular.module('creditCard.analyticsModule')
    .controller('AnalyticsDashboardController', ['TransactionDataService', 'CategorizationService', 'VisualizationService', '$scope', function(TransactionDataService, CategorizationService, VisualizationService, $scope) {
      var vm = this;
      vm.analyticsData = null;
      vm.loading = true;
      vm.error = null;
      vm.selectedCategory = null;
      vm.months = 12;
      vm.categories = CategorizationService.getCategories();
      vm.filterByCategory = function(category) {
        vm.selectedCategory = category;
        if (vm.categorizedTransactions) {
          vm.analyticsData = VisualizationService.prepareFilteredChartData(vm.categorizedTransactions, category);
        }
      };
      vm.clearFilter = function() {
        vm.selectedCategory = null;
        if (vm.categorizedTransactions) {
          vm.analyticsData = VisualizationService.prepareChartData(vm.categorizedTransactions);
        }
      };
      function loadAnalytics() {
        vm.loading = true;
        TransactionDataService.fetchTransactions(vm.months)
          .then(function(transactions) {
            vm.categorizedTransactions = CategorizationService.categorizeTransactions(transactions);
            vm.analyticsData = VisualizationService.prepareChartData(vm.categorizedTransactions);
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load analytics data';
            vm.loading = false;
          });
      }
      loadAnalytics();
    }]);
})();