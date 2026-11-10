(function() {
  'use strict';
  angular.module('analyticsModule').controller('AnalyticsController', ['$scope', 'AnalyticsService', 'TransactionService', 'CategoryService', function($scope, AnalyticsService, TransactionService, CategoryService) {
    var vm = this;
    vm.categoryData = [];
    vm.drillDownData = null;
    vm.selectedCategory = null;
    vm.loading = true;
    vm.error = null;
    vm.categories = CategoryService.getCategories();
    function loadAnalytics() {
      vm.loading = true;
      vm.error = null;
      var userId = 'user123';
      var currentMonth = new Date().toISOString().substring(0, 7);
      AnalyticsService.getCategorySpending(userId, currentMonth)
        .then(function(data) {
          vm.categoryData = data;
          vm.loading = false;
        })
        .catch(function(error) {
          vm.error = 'Failed to load analytics data. Please try again.';
          vm.loading = false;
        });
    }
    vm.onCategoryClick = function(categoryId) {
      vm.selectedCategory = CategoryService.getCategoryById(categoryId);
      var userId = 'user123';
      TransactionService.getTransactionsByCategory(categoryId, userId)
        .then(function(transactions) {
          vm.drillDownData = transactions;
        })
        .catch(function(error) {
          console.error('Error loading drill-down data:', error);
        });
    };
    vm.closeDrillDown = function() {
      vm.drillDownData = null;
      vm.selectedCategory = null;
    };
    loadAnalytics();
  }]);
})();