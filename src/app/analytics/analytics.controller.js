(function() {
  'use strict';
  angular.module('creditCard.analytics').controller('AnalyticsController', ['TransactionService', 'CategoryService', 'AnalyticsFactory', '$scope', function(TransactionService, CategoryService, AnalyticsFactory, $scope) {
    var vm = this;
    vm.loading = true;
    vm.error = null;
    vm.categoryData = null;
    vm.monthlyData = null;
    vm.cardData = null;
    vm.selectedView = 'category';
    vm.init = function() {
      vm.loading = true;
      TransactionService.getMockTransactions().then(function(transactions) {
        var categorized = CategoryService.categorize(transactions);
        vm.categoryData = AnalyticsFactory.aggregateByCategory(categorized);
        vm.monthlyData = AnalyticsFactory.aggregateByMonth(categorized);
        vm.cardData = AnalyticsFactory.aggregateByCard(categorized);
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load analytics data. Please try again.';
        vm.loading = false;
      });
    };
    vm.selectView = function(view) {
      vm.selectedView = view;
    };
    vm.formatCurrency = function(amount) {
      return '₹' + (amount || 0).toLocaleString('en-IN');
    };
    vm.init();
  }]);
})();