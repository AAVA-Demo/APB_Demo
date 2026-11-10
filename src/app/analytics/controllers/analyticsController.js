(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .controller('AnalyticsController', ['$scope', '$filter', 'dataAnalyticsService', function($scope, $filter, dataAnalyticsService) {
      var vm = this;
      vm.analytics = {};
      vm.loading = true;
      vm.error = null;
      vm.selectedCategory = null;
      vm.filteredTransactions = [];
      vm.dateRange = {start: new Date(new Date().setMonth(new Date().getMonth() - 12)), end: new Date()};
      function loadAnalytics() {
        vm.loading = true;
        dataAnalyticsService.getSpendingAnalytics(vm.dateRange).then(function(data) {
          vm.analytics = data;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load analytics';
          vm.loading = false;
        });
      }
      vm.onCategoryClick = function(category) {
        vm.selectedCategory = category;
        vm.filteredTransactions = vm.analytics.transactions.filter(function(txn) {
          return txn.category === category.categoryName;
        });
      };
      loadAnalytics();
    }]);
})();