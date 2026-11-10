(function() {
  'use strict';
  angular.module('analytics.spendingModule')
    .controller('SpendingAnalyticsController', ['$scope', 'MonthlyAggregationService', 'TransactionDataService', 'AuthService', function($scope, MonthlyAggregationService, TransactionDataService, AuthService) {
      var vm = this;
      vm.monthlyData = null;
      vm.categoryData = [];
      vm.categoryLabels = [];
      vm.selectedCategory = null;
      vm.categoryTransactions = [];
      vm.loading = true;
      vm.error = null;
      vm.init = function() {
        var userId = AuthService.getUserId();
        var currentMonth = new Date().toISOString().substring(0, 7);
        MonthlyAggregationService.getMonthlySpending(userId, currentMonth)
          .then(function(data) {
            vm.monthlyData = data;
            vm.categoryData = data.categoryBreakdown.map(function(cat) {
              return cat.totalAmount;
            });
            vm.categoryLabels = data.categoryBreakdown.map(function(cat) {
              return cat.category;
            });
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load spending analytics';
            vm.loading = false;
          });
      };
      vm.onCategorySelect = function(category) {
        vm.selectedCategory = category;
        TransactionDataService.getTransactionsByCategory(category)
          .then(function(transactions) {
            vm.categoryTransactions = transactions;
          })
          .catch(function(error) {
            vm.error = 'Failed to load category transactions';
          });
      };
      vm.init();
    }]);
})();