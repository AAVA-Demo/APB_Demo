(function() {
  'use strict';
  angular.module('analyticsModule')
    .controller('AnalyticsController', ['$scope', 'AnalyticsService', 'CategoryService', function($scope, AnalyticsService, CategoryService) {
      var vm = this;
      vm.analyticsSummary = null;
      vm.categories = [];
      vm.loading = true;
      vm.error = null;
      vm.userId = 'user123';
      vm.selectedCategory = null;
      vm.filteredTransactions = [];
      vm.dateRange = {
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        endDate: new Date()
      };
      vm.loadAnalytics = function() {
        vm.loading = true;
        vm.error = null;
        AnalyticsService.getSpendingAnalytics(vm.userId, vm.dateRange).then(function(data) {
          vm.analyticsSummary = data;
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
      };
      vm.selectCategory = function(category) {
        vm.selectedCategory = category;
        AnalyticsService.getTransactionsByCategory(vm.userId, category).then(function(transactions) {
          vm.filteredTransactions = transactions;
        });
      };
      vm.clearCategoryFilter = function() {
        vm.selectedCategory = null;
        vm.filteredTransactions = [];
      };
      vm.categories = CategoryService.getCategories();
      vm.loadAnalytics();
    }]);
})();